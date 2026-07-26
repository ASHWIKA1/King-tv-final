package com.kingstv.repository;

import com.kingstv.models.WishSaved;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface WishSavedRepository extends JpaRepository<WishSaved, Long> {
    Optional<WishSaved> findByWishIdAndUserId(Long wishId, Long userId);
    List<WishSaved> findByUserId(Long userId);
}
