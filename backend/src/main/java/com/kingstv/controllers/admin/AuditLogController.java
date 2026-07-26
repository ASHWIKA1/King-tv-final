package com.kingstv.controllers.admin;

import com.kingstv.models.AuditLog;
import com.kingstv.models.Permission;
import com.kingstv.repository.AuditLogRepository;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Audit Log viewer (#6). Read-only, filterable by role/date/action type.
 * No update or delete endpoints exist for audit logs — this is by design.
 */
@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@RequiresPermission(Permission.AUDIT_VIEW)
public class AuditLogController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<?> listAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String actionType,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long actorId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("timestamp").descending());

        Specification<AuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (role != null && !role.isEmpty()) {
                predicates.add(cb.equal(root.get("actorRole"), role));
            }
            if (actionType != null && !actionType.isEmpty()) {
                predicates.add(cb.equal(root.get("actionType"), actionType));
            }
            if (entityType != null && !entityType.isEmpty()) {
                predicates.add(cb.equal(root.get("entityType"), entityType));
            }
            if (actorId != null) {
                predicates.add(cb.equal(root.get("actorId"), actorId));
            }
            if (startDate != null && !startDate.isEmpty()) {
                try {
                    LocalDateTime start = LocalDateTime.parse(startDate);
                    predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), start));
                } catch (Exception ignored) {}
            }
            if (endDate != null && !endDate.isEmpty()) {
                try {
                    LocalDateTime end = LocalDateTime.parse(endDate);
                    predicates.add(cb.lessThanOrEqualTo(root.get("timestamp"), end));
                } catch (Exception ignored) {}
            }
            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate emailPredicate = cb.like(cb.lower(root.get("actorEmail")), searchPattern);
                Predicate entityPredicate = cb.like(cb.lower(root.get("entityType")), searchPattern);
                Predicate detailsPredicate = cb.like(cb.lower(root.get("details")), searchPattern);
                predicates.add(cb.or(emailPredicate, entityPredicate, detailsPredicate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<AuditLog> logs = auditLogRepository.findAll(spec, pageRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("currentPage", page);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuditLog(@PathVariable Long id) {
        return auditLogRepository.findById(id)
                .map(log -> ResponseEntity.ok((Object) log))
                .orElse(ResponseEntity.notFound().build());
    }

    // Note: No PUT, PATCH, or DELETE endpoints exist here intentionally.
    // The audit log is append-only by design.
}
