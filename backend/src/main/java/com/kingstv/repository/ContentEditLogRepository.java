package com.kingstv.repository;

import com.kingstv.models.ContentEditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface ContentEditLogRepository extends JpaRepository<ContentEditLog, Long> {

    /**
     * Plain read — no lock. Safe to call from non-transactional contexts (e.g. getRemainingEdits).
     */
    @Query("SELECT c FROM ContentEditLog c WHERE c.contentType = :contentType AND c.contentId = :contentId")
    Optional<ContentEditLog> findByContentTypeAndContentId(
            @Param("contentType") String contentType,
            @Param("contentId") Long contentId);

    /**
     * Pessimistic-write lock — MUST be called inside a @Transactional method only.
     * Used by attemptEdit() to prevent concurrent edit-count increments.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM ContentEditLog c WHERE c.contentType = :contentType AND c.contentId = :contentId")
    Optional<ContentEditLog> findByContentTypeAndContentIdForWrite(
            @Param("contentType") String contentType,
            @Param("contentId") Long contentId);
}
