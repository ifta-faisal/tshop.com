package com.roboxpressbd.service;

import com.roboxpressbd.dto.ProductDtos;
import com.roboxpressbd.entity.Banner;
import com.roboxpressbd.entity.Brand;
import com.roboxpressbd.entity.Category;
import com.roboxpressbd.entity.Product;
import com.roboxpressbd.exception.ApiException;
import com.roboxpressbd.repository.BannerRepository;
import com.roboxpressbd.repository.BrandRepository;
import com.roboxpressbd.repository.CategoryRepository;
import com.roboxpressbd.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final BannerRepository bannerRepository;

    public CatalogService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          BannerRepository bannerRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.bannerRepository = bannerRepository;
    }

    public ProductDtos.ProductDetail getProduct(String slug) {
        Product p = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ApiException("Product not found"));
        return ProductDtos.ProductDetail.of(p);
    }

    public ProductDtos.PageResponse<ProductDtos.ProductSummary> listProducts(
            String category, String brand, String q, int page, int size, String sort) {
        Sort sorting = switch (sort == null ? "newest" : sort) {
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "name" -> Sort.by("name").ascending();
            default -> Sort.by("createdAt").descending();
        };
        PageRequest pr = PageRequest.of(page, size, sorting);
        Page<Product> result;
        if (q != null && !q.isBlank()) {
            result = productRepository.search(q.trim(), pr);
        } else if (category != null && !category.isBlank()) {
            result = productRepository.findByCategoriesSlugAndActiveTrue(category, pr);
        } else if (brand != null && !brand.isBlank()) {
            result = productRepository.findByBrandSlugAndActiveTrue(brand, pr);
        } else {
            result = productRepository.findByActiveTrueExcludingCategory("3d-printing-designs", pr);
        }
        return new ProductDtos.PageResponse<>(
                result.getContent().stream().map(ProductDtos.ProductSummary::of).toList(),
                result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public List<ProductDtos.ProductSummary> featured() {
        return productRepository.findTop12ByActiveTrueAndFeaturedTrueOrderByCreatedAtDesc()
                .stream().filter(p -> p.getCategories().stream().noneMatch(c -> c.getSlug().equals("3d-printing-designs")))
                .map(ProductDtos.ProductSummary::of).limit(12).toList();
    }

    public List<ProductDtos.ProductSummary> newArrivals() {
        return productRepository.findTop12ByActiveTrueAndNewArrivalTrueOrderByCreatedAtDesc()
                .stream().filter(p -> p.getCategories().stream().noneMatch(c -> c.getSlug().equals("3d-printing-designs")))
                .map(ProductDtos.ProductSummary::of).limit(12).toList();
    }

    public List<ProductDtos.ProductSummary> trending() {
        return productRepository.findTop12ByActiveTrueAndTrendingTrueOrderByCreatedAtDesc()
                .stream().filter(p -> p.getCategories().stream().noneMatch(c -> c.getSlug().equals("3d-printing-designs")))
                .map(ProductDtos.ProductSummary::of).limit(12).toList();
    }

    public List<ProductDtos.ProductSummary> backInStock() {
        return productRepository.findTop12ByActiveTrueAndBackInStockTrueOrderByCreatedAtDesc()
                .stream().filter(p -> p.getCategories().stream().noneMatch(c -> c.getSlug().equals("3d-printing-designs")))
                .map(ProductDtos.ProductSummary::of).limit(12).toList();
    }

    public List<ProductDtos.CategoryDto> categories() {
        return categoryRepository.findAll().stream().map(ProductDtos.CategoryDto::of).toList();
    }

    public List<ProductDtos.BrandDto> brands() {
        return brandRepository.findAll().stream().map(ProductDtos.BrandDto::of).toList();
    }

    public List<ProductDtos.ProductSummary> activeFlashSales() {
        return productRepository.findActiveFlashSales(java.time.Instant.now())
                .stream().map(ProductDtos.ProductSummary::of).toList();
    }
    public List<Banner> activeBanners() {
        return bannerRepository.findByActiveTrueOrderBySortOrderAsc();
    }

    public Category category(String slug) {
        return categoryRepository.findBySlug(slug).orElseThrow(() -> new ApiException("Category not found"));
    }

    public Brand brand(String slug) {
        return brandRepository.findBySlug(slug).orElseThrow(() -> new ApiException("Brand not found"));
    }
}
