package com.roboxpressbd.repository;

import com.roboxpressbd.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoriesSlugAndActiveTrue(String categorySlug, Pageable pageable);

    Page<Product> findByBrandSlugAndActiveTrue(String brandSlug, Pageable pageable);

    @Query("select p from Product p where p.flashSaleEnabled = true and p.active = true and p.flashSaleEndDate > :now")
    List<Product> findActiveFlashSales(@Param("now") java.time.Instant now);

    @Query("select p from Product p where p.active = true and not exists (select 1 from p.categories c where c.slug = :excludedCategorySlug)")
    Page<Product> findByActiveTrueExcludingCategory(@Param("excludedCategorySlug") String excludedCategorySlug, Pageable pageable);

    @Query("select p from Product p where p.active = true and (" +
            "replace(lower(p.name), ' ', '') like lower(concat('%', replace(:q, ' ', ''), '%')) or " +
            "replace(lower(p.description), ' ', '') like lower(concat('%', replace(:q, ' ', ''), '%'))) and " +
            "not exists (select 1 from p.categories c where c.slug = '3d-printing-designs')")
    Page<Product> search(String q, Pageable pageable);

    List<Product> findTop12ByActiveTrueAndFeaturedTrueOrderByCreatedAtDesc();
    List<Product> findTop12ByActiveTrueAndNewArrivalTrueOrderByCreatedAtDesc();
    List<Product> findTop12ByActiveTrueAndTrendingTrueOrderByCreatedAtDesc();
    List<Product> findTop12ByActiveTrueAndBackInStockTrueOrderByCreatedAtDesc();
}
