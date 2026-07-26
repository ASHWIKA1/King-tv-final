package com.kingstv.repository;

import com.kingstv.models.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.time.LocalDateTime;

/**
 * Append-only audit log repository.
 * Only save() and find methods are used. Delete operations are overridden to throw.
 */
public interface AuditLogRepository extends JpaRepository<AuditLog, Long>, JpaSpecificationExecutor<AuditLog> {
    Page<AuditLog> findByActorRole(String actorRole, Pageable pageable);
    Page<AuditLog> findByActionType(String actionType, Pageable pageable);
    Page<AuditLog> findByEntityType(String entityType, Pageable pageable);
    Page<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<AuditLog> findByActorId(Long actorId, Pageable pageable);
}
