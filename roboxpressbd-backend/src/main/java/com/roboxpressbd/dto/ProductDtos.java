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
            boolean featured, boolean newArrival, boolean trending, boolean backInStock) {
        public static ProductSummary of(Product p) {
            return new ProductSummary(
                    p.getId(), p.getName(), p.getSlug(),
                    p.getPrice(), p.getOldPrice(), p.getImageUrl(), p.getStock(),
                    p.getCategory() == null ? null : CategoryDto.of(p.getCategory()),
                    p.getBrand() == null ? null : BrandDto.of(p.getBrand()),
                    p.isFeatured(), p.isNewArrival(), p.isTrending(), p.isBackInStock());
        }
    }

    public record ProductDetail(
            Long id, String name, String slug, String description, String specifications,
            BigDecimal price, BigDecimal oldPrice, String imageUrl, Integer stock, String sku,
            CategoryDto category, BrandDto brand, Instant createdAt) {
        public static ProductDetail of(Product p) {
            return new ProductDetail(
                    p.getId(), p.getName(), p.getSlug(),
                    p.getDescription(), p.getSpecifications(),
                    p.getPrice(), p.getOldPrice(), p.getImageUrl(), p.getStock(), p.getSku(),
                    p.getCategory() == null ? null : CategoryDto.of(p.getCategory()),
                    p.getBrand() == null ? null : BrandDto.of(p.getBrand()),
                    p.getCreatedAt());
        }
    }

    public record PageResponse<T>(
            java.util.List<T> content, int page, int size, long totalElements, int totalPages) {}
}
