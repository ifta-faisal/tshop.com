package com.roboxpressbd.dto;

import com.roboxpressbd.entity.Product;
import java.math.BigDecimal;
import java.time.Instant;

public class ProductDtos {

    public record CategoryDto(Long id, String name, String slug, String imageUrl) {
        public static CategoryDto of(com.roboxpressbd.entity.Category c) {
            return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getImageUrl());
        }
    }

    public record BrandDto(Long id, String name, String slug, String logoUrl) {
        public static BrandDto of(com.roboxpressbd.entity.Brand b) {
            return new BrandDto(b.getId(), b.getName(), b.getSlug(), b.getLogoUrl());
        }
    }

    public record ProductSummary(
            Long id, String name, String slug, BigDecimal price, BigDecimal oldPrice,
            String imageUrl, Integer stock, CategoryDto category, BrandDto brand,
            boolean isNewArrival, boolean isFeatured, boolean isTrending, boolean backInStock,
            Boolean flashSaleEnabled, BigDecimal flashSalePrice, Instant flashSaleEndDate
    ) {
        public static ProductSummary of(Product p) {
            return new ProductSummary(
                    p.getId(), p.getName(), p.getSlug(), p.getPrice(), p.getOldPrice(),
                    p.getImageUrl(), p.getStock(), 
                    p.getCategories() == null || p.getCategories().isEmpty() ? null : CategoryDto.of(p.getCategories().iterator().next()), 
                    p.getBrand() == null ? null : BrandDto.of(p.getBrand()),
                    p.isNewArrival(), p.isFeatured(), p.isTrending(), p.isBackInStock(),
                    p.isFlashSaleEnabled(), p.getFlashSalePrice(), p.getFlashSaleEndDate()
            );   
        }
    }

    public record ProductDetail(
            Long id, String name, String slug, String description, String specifications,
            BigDecimal price, BigDecimal oldPrice, String imageUrl, String sku, Integer stock,
            CategoryDto category, BrandDto brand,
            boolean isNewArrival, boolean isFeatured, boolean isTrending, boolean backInStock,
            Boolean flashSaleEnabled, BigDecimal flashSalePrice, Instant flashSaleEndDate
    ) {
        public static ProductDetail of(Product p) {
            return new ProductDetail(
                    p.getId(), p.getName(), p.getSlug(), p.getDescription(), p.getSpecifications(),
                    p.getPrice(), p.getOldPrice(), p.getImageUrl(), p.getSku(), p.getStock(),
                    p.getCategories() == null || p.getCategories().isEmpty() ? null : CategoryDto.of(p.getCategories().iterator().next()), 
                    p.getBrand() == null ? null : BrandDto.of(p.getBrand()),
                    p.isNewArrival(), p.isFeatured(), p.isTrending(), p.isBackInStock(),
                    p.isFlashSaleEnabled(), p.getFlashSalePrice(), p.getFlashSaleEndDate()
            );   
        }
    }

    public record ProductRequest(
            String name, String slug, String description, String specifications,
            BigDecimal price, BigDecimal oldPrice, String imageUrl, String sku, Integer stock,
            Long categoryId, Long brandId,
            boolean newArrival, boolean featured, boolean trending, boolean backInStock,
            Boolean flashSaleEnabled, BigDecimal flashSalePrice, Instant flashSaleEndDate
    ) {}

    public record PageResponse<T>(
            java.util.List<T> content, int page, int size, long totalElements, int totalPages) {}
}
