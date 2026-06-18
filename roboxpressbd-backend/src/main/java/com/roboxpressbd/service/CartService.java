package com.roboxpressbd.service;

import com.roboxpressbd.config.CurrentUser;
import com.roboxpressbd.dto.CartDtos;
import com.roboxpressbd.entity.CartItem;
import com.roboxpressbd.entity.Product;
import com.roboxpressbd.entity.User;
import com.roboxpressbd.exception.ApiException;
import com.roboxpressbd.repository.CartItemRepository;
import com.roboxpressbd.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartRepository;
    private final ProductRepository productRepository;
    private final CurrentUser currentUser;

    public CartService(CartItemRepository cartRepository, ProductRepository productRepository, CurrentUser currentUser) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.currentUser = currentUser;
    }

    public List<CartDtos.CartItemResponse> list() {
        return cartRepository.findByUser(currentUser.get())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public List<CartDtos.CartItemResponse> add(CartDtos.CartItemRequest req) {
        User user = currentUser.get();
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new ApiException("Product not found"));
        if (!product.isActive()) throw new ApiException("Product unavailable");
        if (product.getStock() < req.quantity()) throw new ApiException("Insufficient stock");

        CartItem item = cartRepository.findByUserAndProductId(user, product.getId())
                .orElseGet(() -> CartItem.builder().user(user).product(product).quantity(0).build());
        item.setQuantity(item.getQuantity() + req.quantity());
        cartRepository.save(item);
        return list();
    }

    @Transactional
    public List<CartDtos.CartItemResponse> update(Long productId, Integer quantity) {
        User user = currentUser.get();
        CartItem item = cartRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new ApiException("Item not in cart"));
        if (quantity <= 0) {
            cartRepository.delete(item);
        } else {
            if (item.getProduct().getStock() < quantity) throw new ApiException("Insufficient stock");
            item.setQuantity(quantity);
            cartRepository.save(item);
        }
        return list();
    }

    @Transactional
    public List<CartDtos.CartItemResponse> remove(Long productId) {
        User user = currentUser.get();
        CartItem item = cartRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new ApiException("Item not in cart"));
        cartRepository.delete(item);
        return list();
    }

    @Transactional
    public void clear() {
        cartRepository.deleteByUser(currentUser.get());
    }

    private CartDtos.CartItemResponse toResponse(CartItem item) {
        Product p = item.getProduct();
        BigDecimal unit = p.getPrice();
        BigDecimal line = unit.multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartDtos.CartItemResponse(
                item.getId(), p.getId(), p.getName(), p.getSlug(),
                p.getImageUrl(), unit, item.getQuantity(), line);
    }
}
