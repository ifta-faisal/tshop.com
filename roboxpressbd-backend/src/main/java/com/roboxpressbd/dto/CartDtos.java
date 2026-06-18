package com.roboxpressbd.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartDtos {
    public record CartItemRequest(@NotNull Long productId, @NotNull @Min(1) Integer quantity) {}

    public record CartItemResponse(
            Long id, Long productId, String productName, String productSlug,
            String productImage, java.math.BigDecimal unitPrice, Integer quantity,
            java.math.BigDecimal lineTotal) {}
}
