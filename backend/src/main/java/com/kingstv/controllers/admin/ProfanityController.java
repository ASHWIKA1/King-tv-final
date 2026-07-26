package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Profanity dictionary manager and violation reports (#8).
 * CRUD for blacklisted terms, content scanning hook, violation reports.
 */
@RestController
@RequestMapping("/api/v1/admin/profanity")
public class ProfanityController {

    @Autowired private ProfanityWordRepository profanityWordRepository;
    @Autowired private ProfanityViolationRepository profanityViolationRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    // --- Dictionary CRUD ---

    @GetMapping("/dictionary")
    @RequiresPermission(Permission.PROFANITY_MANAGE)
    public ResponseEntity<?> listTerms() {
        return ResponseEntity.ok(profanityWordRepository.findAll());
    }

    @PostMapping("/dictionary")
    @RequiresPermission(Permission.PROFANITY_MANAGE)
    public ResponseEntity<?> addTerm(@RequestBody Map<String, String> request) {
        String term = request.get("term");
        if (term == null || term.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Term is required"));
        }
        if (profanityWordRepository.existsByTerm(term.trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Term already exists"));
        }

        ProfanityWord word = new ProfanityWord();
        word.setTerm(term.trim());
        word.setLanguage(request.getOrDefault("language", "ALL"));
        word.setCreatedBy(getCallerId());
        ProfanityWord saved = profanityWordRepository.save(word);

        logAudit("CREATE", "ProfanityWord", saved.getId(), "Added profanity term: " + term);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/dictionary/{id}")
    @RequiresPermission(Permission.PROFANITY_MANAGE)
    public ResponseEntity<?> updateTerm(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return profanityWordRepository.findById(id)
                .map(word -> {
                    if (request.containsKey("term")) word.setTerm(request.get("term"));
                    if (request.containsKey("language")) word.setLanguage(request.get("language"));
                    ProfanityWord saved = profanityWordRepository.save(word);
                    logAudit("UPDATE", "ProfanityWord", id, "Updated profanity term");
                    return ResponseEntity.ok((Object) saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/dictionary/{id}")
    @RequiresPermission(Permission.PROFANITY_MANAGE)
    public ResponseEntity<?> deleteTerm(@PathVariable Long id) {
        if (!profanityWordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        logAudit("DELETE", "ProfanityWord", id, "Removed profanity term");
        profanityWordRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Term deleted"));
    }

    // --- Violation Reports (#8, #28) ---

    @GetMapping("/violations")
    @RequiresPermission(Permission.PROFANITY_VIEW_REPORTS)
    public ResponseEntity<?> listViolations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ProfanityViolation> violations;

        if (status != null && !status.isEmpty()) {
            violations = profanityViolationRepository.findByStatus(status, pageRequest);
        } else {
            violations = profanityViolationRepository.findAll(pageRequest);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("violations", violations.getContent());
        response.put("totalElements", violations.getTotalElements());
        response.put("totalPages", violations.getTotalPages());
        response.put("pendingCount", profanityViolationRepository.countByStatus("PENDING"));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/violations/{id}/review")
    @RequiresPermission(Permission.PROFANITY_VIEW_REPORTS)
    public ResponseEntity<?> reviewViolation(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return profanityViolationRepository.findById(id)
                .map(violation -> {
                    violation.setStatus(request.getOrDefault("status", "REVIEWED"));
                    violation.setReviewNotes(request.get("notes"));
                    violation.setReviewedBy(getCallerId());
                    profanityViolationRepository.save(violation);
                    logAudit("REVIEW", "ProfanityViolation", id, "Reviewed violation: " + request.get("status"));
                    return ResponseEntity.ok(Map.of("message", "Violation reviewed"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Dashboard alert count ---
    @GetMapping("/violations/alert-count")
    @RequiresPermission(Permission.PROFANITY_VIEW_REPORTS)
    public ResponseEntity<?> getAlertCount() {
        long pending = profanityViolationRepository.countByStatus("PENDING");
        return ResponseEntity.ok(Map.of("pendingViolations", pending, "hasAlert", pending > 0));
    }

    private Long getCallerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long) return (Long) auth.getDetails();
        return null;
    }

    private void logAudit(String action, String entity, Long entityId, String details) {
        try {
            AuditLog log = new AuditLog();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                log.setActorEmail((String) auth.getPrincipal());
                log.setActorRole(auth.getAuthorities().stream()
                    .filter(a -> a.getAuthority().startsWith("ROLE_")).map(a -> a.getAuthority().substring(5))
                    .findFirst().orElse("UNKNOWN"));
                if (auth.getDetails() instanceof Long) log.setActorId((Long) auth.getDetails());
            }
            log.setActionType(action);
            log.setEntityType(entity);
            log.setEntityId(entityId);
            log.setDetails(details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Audit log write failed: " + e.getMessage());
        }
    }
}
