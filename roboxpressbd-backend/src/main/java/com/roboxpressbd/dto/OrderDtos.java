package com.roboxpressbd.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class OrderDtos {

    public record CheckoutRequest(
            @NotBlank String customerName,
            @NotBlank String customerPhone,
            @NotBlank String shippingAddress,
            String paymentMethod) {}

    public record OrderItemResponse(
            Long id, Long productId, String productName, String productSlug,
            String productImage, java.math.BigDecimal unitPrice, Integer quantity) {}

    public record OrderResponse(
            Long id, String orderNumber, String status, java.math.BigDecimal totalAmount,
            String paymentMethod, String customerName, String customerPhone,
            String shippingAddress, java.time.Instant createdAt, List<OrderItemResponse> items) {}
}
