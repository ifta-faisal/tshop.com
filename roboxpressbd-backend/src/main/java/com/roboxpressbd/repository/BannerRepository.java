package com.roboxpressbd.repository;

import com.roboxpressbd.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveTrueOrderBySortOrderAsc();
}
