package com.kingstv.repository;

import com.kingstv.models.WishReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface WishReactionRepository extends JpaRepository<WishReaction, Long> {
    Optional<WishReaction> findByWishIdAndUserId(Long wishId, Long userId);
    Optional<WishReaction> findByWishIdAndSessionId(Long wishId, String sessionId);
    List<WishReaction> findByWishId(Long wishId);
}
