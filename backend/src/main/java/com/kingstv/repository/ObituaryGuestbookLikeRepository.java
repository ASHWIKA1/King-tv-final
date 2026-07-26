package com.kingstv.repository;

import com.kingstv.models.ObituaryGuestbookLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ObituaryGuestbookLikeRepository extends JpaRepository<ObituaryGuestbookLike, Long> {
    Optional<ObituaryGuestbookLike> findByCommentIdAndSessionId(Long commentId, String sessionId);
    Optional<ObituaryGuestbookLike> findByCommentIdAndUserId(Long commentId, Long userId);
}
