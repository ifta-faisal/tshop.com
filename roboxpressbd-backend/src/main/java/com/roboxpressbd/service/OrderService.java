package com.roboxpressbd.service;

import com.roboxpressbd.config.CurrentUser;
import com.roboxpressbd.dto.OrderDtos;
import com.roboxpressbd.entity.*;
import com.roboxpressbd.exception.ApiException;
import com.roboxpressbd.repository.CartItemRepository;
import com.roboxpressbd.repository.OrderRepository;
import com.roboxpressbd.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartRepository;
    private final ProductRepository productRepository;
    private final CurrentUser currentUser;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartRepository,
                        ProductRepository productRepository, CurrentUser currentUser) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.currentUser = currentUser;
    }

    @Transactional
    public OrderDtos.OrderResponse checkout(OrderDtos.CheckoutRequest req) {
        User user = currentUser.get();
        List<CartItem> items = cartRepository.findByUser(user);
        if (items.isEmpty()) throw new ApiException("Cart is empty");

        BigDecimal total = BigDecimal.ZERO;
        Order order = Order.builder()
                .user(user)
                .orderNumber("RX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerName(req.customerName())
                .customerEmail(user.getEmail())
                .customerPhone(req.customerPhone())
                .shippingAddress(req.shippingAddress())
                .paymentMethod(req.paymentMethod() == null ? "COD" : req.paymentMethod())
                .status("PENDING")
                .build();

        for (CartItem ci : items) {
            Product p = ci.getProduct();
            if (p.getStock() < ci.getQuantity()) {
                throw new ApiException("Insufficient stock for " + p.getName());
            }
            p.setStock(p.getStock() - ci.getQuantity());
            productRepository.save(p);

            BigDecimal line = p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(line);

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(p)
                    .productName(p.getName())
                    .productSlug(p.getSlug())
                    .productImage(p.getImageUrl())
                    .unitPrice(p.getPrice())
                    .quantity(ci.getQuantity())
                    .build();
            order.getItems().add(oi);
        }
        order.setTotalAmount(total);
        order = orderRepository.save(order);
        cartRepository.deleteByUser(user);
        return toResponse(order);
    }

    public List<OrderDtos.OrderResponse> myOrders() {
        return orderRepository.findByUserOrderByCreatedAtDesc(currentUser.get())
                .stream().map(this::toResponse).toList();
    }

    public OrderDtos.OrderResponse get(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ApiException("Order not found"));
        User me = currentUser.get();
        if (!order.getUser().getId().equals(me.getId()) && !me.getRoles().contains("ROLE_ADMIN")) {
            throw new ApiException("Forbidden");
        }
        return toResponse(order);
    }

    private OrderDtos.OrderResponse toResponse(Order o) {
        return new OrderDtos.OrderResponse(
                o.getId(), o.getOrderNumber(), o.getStatus(), o.getTotalAmount(),
                o.getPaymentMethod(), o.getCustomerName(), o.getCustomerPhone(),
                o.getShippingAddress(), o.getCreatedAt(),
                o.getItems().stream().map(i -> new OrderDtos.OrderItemResponse(
                        i.getId(), i.getProduct().getId(),
                        i.getProductName(), i.getProductSlug(),
                        i.getProductImage(), i.getUnitPrice(), i.getQuantity())).toList());
    }
}
