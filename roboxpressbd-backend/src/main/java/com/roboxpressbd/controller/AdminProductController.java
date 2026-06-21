package com.roboxpressbd.controller;

import com.roboxpressbd.dto.ProductDtos.ProductRequest;
import com.roboxpressbd.dto.ProductDtos.ProductSummary;
import com.roboxpressbd.entity.Product;
import com.roboxpressbd.repository.BrandRepository;
import com.roboxpressbd.repository.CategoryRepository;
import com.roboxpressbd.repository.ProductRepository;
import com.roboxpressbd.service.CsvImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final CsvImportService csvImportService;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public AdminProductController(CsvImportService csvImportService, ProductRepository productRepository,
                                  CategoryRepository categoryRepository, BrandRepository brandRepository) {
        this.csvImportService = csvImportService;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "2000") int size) {
        var pr = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("createdAt").descending());
        var result = productRepository.findAll(pr);
        return ResponseEntity.ok(new com.roboxpressbd.dto.ProductDtos.PageResponse<>(
                result.getContent().stream().map(ProductSummary::of).toList(),
                result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages()
        ));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest req) {
        Product p = new Product();
        return saveProduct(p, req);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest req) {
        var pOpt = productRepository.findById(id);
        if (pOpt.isEmpty()) return ResponseEntity.notFound().build();
        return saveProduct(pOpt.get(), req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    private ResponseEntity<?> saveProduct(Product p, ProductRequest req) {
        p.setName(req.name());
        p.setSlug(req.slug());
        p.setDescription(req.description());
        p.setSpecifications(req.specifications());
        p.setPrice(req.price());
        p.setOldPrice(req.oldPrice());
        p.setImageUrl(req.imageUrl());
        p.setStock(req.stock() == null ? 0 : req.stock());
        p.setSku(req.sku());
        p.setFeatured(req.featured());
        p.setNewArrival(req.newArrival());
        p.setTrending(req.trending());
        p.setBackInStock(req.backInStock());
        p.setFlashSaleEnabled(req.flashSaleEnabled());
        p.setFlashSalePrice(req.flashSalePrice());
        p.setFlashSaleEndDate(req.flashSaleEndDate());

        p.getCategories().clear();
        if (req.categoryId() != null) {
            categoryRepository.findById(req.categoryId()).ifPresent(c -> p.getCategories().add(c));
        }

        if (req.brandId() != null) {
            brandRepository.findById(req.brandId()).ifPresent(p::setBrand);
        } else {
            p.setBrand(null);
        }

        Product saved = productRepository.save(p);
        return ResponseEntity.ok(ProductSummary.of(saved));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please select a CSV file to upload."));
        }

        try {
            csvImportService.importCsv(file);
            return ResponseEntity.ok(Map.of("message", "Products imported successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to import products: " + e.getMessage()));
        }
    }
}
