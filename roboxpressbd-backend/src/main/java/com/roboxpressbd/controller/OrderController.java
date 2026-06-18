package com.roboxpressbd.controller;

import com.roboxpressbd.dto.OrderDtos;
import com.roboxpressbd.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public OrderDtos.OrderResponse checkout(@Valid @RequestBody OrderDtos.CheckoutRequest req) {
        return orderService.checkout(req);
    }

    @GetMapping
    public List<OrderDtos.OrderResponse> myOrders() { return orderService.myOrders(); }

    @GetMapping("/{orderNumber}")
    public OrderDtos.OrderResponse get(@PathVariable String orderNumber) {
        return orderService.get(orderNumber);
    }
}
