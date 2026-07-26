package com.kingstv.repository;

import com.kingstv.models.ObituaryNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObituaryNotificationRepository extends JpaRepository<ObituaryNotification, Long> {
    List<ObituaryNotification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
