package com.kingstv.repository;

import com.kingstv.models.PushNotificationRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PushNotificationRepository extends JpaRepository<PushNotificationRecord, Long> {
    Page<PushNotificationRecord> findByStatus(String status, Pageable pageable);
    Page<PushNotificationRecord> findByTargetType(String targetType, Pageable pageable);
}
