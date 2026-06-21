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
import java.util.concurrent.CompletableFuture;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartRepository;
    private final ProductRepository productRepository;
    private final CurrentUser currentUser;
    private final InvoiceService invoiceService;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartRepository,
                        ProductRepository productRepository, CurrentUser currentUser,
                        InvoiceService invoiceService, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.currentUser = currentUser;
        this.invoiceService = invoiceService;
        this.emailService = emailService;
    }

    @Transactional
    public OrderDtos.OrderResponse checkout(OrderDtos.CheckoutRequest req) {
        User user = null;
        try {
            user = currentUser.get();
        } catch (Exception e) {} // Guest checkout fallback

        List<CartItem> items;
        if (user != null) {
            items = cartRepository.findByUser(user);
        } else {
            if (req.guestItems() == null || req.guestItems().isEmpty()) throw new ApiException("Cart is empty");
            items = new java.util.ArrayList<>();
            for (OrderDtos.GuestCartItem gi : req.guestItems()) {
                Product p = productRepository.findById(gi.productId())
                        .orElseThrow(() -> new ApiException("Product not found"));
                CartItem ci = new CartItem();
                ci.setProduct(p);
                ci.setQuantity(gi.quantity());
                items.add(ci);
            }
        }
        if (items.isEmpty()) throw new ApiException("Cart is empty");

        BigDecimal total = BigDecimal.ZERO;
        Order order = Order.builder()
                .user(user)
                .orderNumber("RX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerName(req.customerName())
                .customerEmail(user != null ? user.getEmail() : req.customerEmail())
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

            BigDecimal activePrice = p.getPrice();
            if (p.isFlashSaleEnabled() && p.getFlashSaleEndDate() != null && p.getFlashSaleEndDate().isAfter(java.time.Instant.now())) {
                activePrice = p.getFlashSalePrice() != null ? p.getFlashSalePrice() : activePrice;
            }

            BigDecimal line = activePrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(line);

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(p)
                    .productName(p.getName())
                    .productSlug(p.getSlug())
                    .productImage(p.getImageUrl())
                    .unitPrice(activePrice)
                    .quantity(ci.getQuantity())
                    .build();
            order.getItems().add(oi);
        }
        order.setTotalAmount(total);
        order = orderRepository.save(order);
        
        if (user != null) {
            cartRepository.deleteByUser(user);
        }

        // Asynchronously generate and send invoice
        final Order savedOrder = order;
        CompletableFuture.runAsync(() -> {
            try {
                byte[] pdf = invoiceService.generateInvoicePdf(savedOrder);
                emailService.sendInvoiceEmail(savedOrder.getCustomerEmail(), savedOrder.getOrderNumber(), pdf);
            } catch (Exception e) {
                System.err.println("Failed to process invoice email async: " + e.getMessage());
            }
        });

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

    public List<OrderDtos.OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public OrderDtos.OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
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
