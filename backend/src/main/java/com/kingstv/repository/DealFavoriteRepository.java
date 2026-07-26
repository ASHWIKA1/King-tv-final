package com.kingstv.repository;

import com.kingstv.models.DealFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DealFavoriteRepository extends JpaRepository<DealFavorite, Long> {
    List<DealFavorite> findByUserId(Long userId);
    Optional<DealFavorite> findByUserIdAndDealId(Long userId, Long dealId);
}
