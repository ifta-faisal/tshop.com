package com.roboxpressbd.controller;

import com.roboxpressbd.dto.CartDtos;
import com.roboxpressbd.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartDtos.CartItemResponse> list() { return cartService.list(); }

    @PostMapping
    public List<CartDtos.CartItemResponse> add(@Valid @RequestBody CartDtos.CartItemRequest req) {
        return cartService.add(req);
    }

    @PutMapping("/{productId}")
    public List<CartDtos.CartItemResponse> update(@PathVariable Long productId,
                                                  @RequestParam Integer quantity) {
        return cartService.update(productId, quantity);
    }

    @DeleteMapping("/{productId}")
    public List<CartDtos.CartItemResponse> remove(@PathVariable Long productId) {
        return cartService.remove(productId);
    }

    @DeleteMapping
    public void clear() { cartService.clear(); }
}
