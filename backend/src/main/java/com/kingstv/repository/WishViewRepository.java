package com.kingstv.repository;

import com.kingstv.models.WishView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface WishViewRepository extends JpaRepository<WishView, Long> {
    boolean existsByWishIdAndIpAddressAndCreatedAtAfter(Long wishId, String ipAddress, LocalDateTime limit);
}
