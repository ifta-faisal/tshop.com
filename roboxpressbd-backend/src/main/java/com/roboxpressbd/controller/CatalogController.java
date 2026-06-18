package com.roboxpressbd.controller;

import com.roboxpressbd.dto.ProductDtos;
import com.roboxpressbd.entity.Banner;
import com.roboxpressbd.service.CatalogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/banners/active")
    public List<Banner> activeBanners() {
        return catalogService.activeBanners();
    }

    @GetMapping("/categories")
    public List<ProductDtos.CategoryDto> categories() {
        return catalogService.categories();
    }

    @GetMapping("/brands")
    public List<ProductDtos.BrandDto> brands() {
        return catalogService.brands();
    }

    @GetMapping("/products")
    public ProductDtos.PageResponse<ProductDtos.ProductSummary> listProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort) {
        return catalogService.listProducts(category, brand, q, page, size, sort);
    }

    @GetMapping("/products/featured")
    public List<ProductDtos.ProductSummary> featured() { return catalogService.featured(); }

    @GetMapping("/products/new-arrivals")
    public List<ProductDtos.ProductSummary> newArrivals() { return catalogService.newArrivals(); }

    @GetMapping("/products/trending")
    public List<ProductDtos.ProductSummary> trending() { return catalogService.trending(); }

    @GetMapping("/products/back-in-stock")
    public List<ProductDtos.ProductSummary> backInStock() { return catalogService.backInStock(); }

    @GetMapping("/products/{slug}")
    public ProductDtos.ProductDetail product(@PathVariable String slug) {
        return catalogService.getProduct(slug);
    }
}
