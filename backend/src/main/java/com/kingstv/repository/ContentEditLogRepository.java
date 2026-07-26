package com.kingstv.repository;

import com.kingstv.models.ContentEditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface ContentEditLogRepository extends JpaRepository<ContentEditLog, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<ContentEditLog> findByContentTypeAndContentId(String contentType, Long contentId);
}
