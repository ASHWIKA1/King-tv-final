package com.kingstv.repository;

import com.kingstv.models.NfcCardAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NfcCardAuditLogRepository extends JpaRepository<NfcCardAuditLog, Long> {
    List<NfcCardAuditLog> findByCardIdOrderByChangedAtDesc(Long cardId);
}
