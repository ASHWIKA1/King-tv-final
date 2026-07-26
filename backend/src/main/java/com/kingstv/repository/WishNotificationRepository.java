package com.kingstv.repository;

import com.kingstv.models.WishNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WishNotificationRepository extends JpaRepository<WishNotification, Long> {
    List<WishNotification> findByRecipientUserIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientUserId);
}
