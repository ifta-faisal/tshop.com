package com.roboxpressbd.repository;

import com.roboxpressbd.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategorySlugAndActiveTrue(String categorySlug, Pageable pageable);

    Page<Product> findByBrandSlugAndActiveTrue(String brandSlug, Pageable pageable);

    @Query("select p from Product p where p.active = true and (" +
            "lower(p.name) like lower(concat('%', :q, '%')) or " +
            "lower(p.description) like lower(concat('%', :q, '%')))")
    Page<Product> search(String q, Pageable pageable);

    List<Product> findTop12ByActiveTrueAndFeaturedTrueOrderByCreatedAtDesc();
    List<Product> findTop12ByActiveTrueAndNewArrivalTrueOrderByCreatedAtDesc();
    List<Product> findTop12ByActiveTrueAndTrendingTrueOrderByCreatedAtDesc();
    List<Product> findTop12ByActiveTrueAndBackInStockTrueOrderByCreatedAtDesc();
}
