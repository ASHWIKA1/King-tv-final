package com.kingstv.controllers.editor;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import com.kingstv.services.ProfanityService;
import com.kingstv.services.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Content review/publish queue (#25) for Chief Editor.
 * Content from District Admin, Mobile Journalist, and Institution Login
 * must pass through this queue before going live.
 *
 * Also handles UGC review queue (#29).
 */
@RestController
@RequestMapping("/api/v1/admin/content-review")
public class ContentReviewController {

    @Autowired private ArticleRepository articleRepository;
    @Autowired private UgcSubmissionRepository ugcSubmissionRepository;
    @Autowired private ProfanityService profanityService;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private SystemConfigService systemConfigService;

    /**
     * List pending articles for review (#25)
     */
    @GetMapping("/articles")
    @RequiresPermission(Permission.CONTENT_REVIEW)
    public ResponseEntity<?> listPendingArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        String filterStatus = (status != null) ? status : "submitted";

        Page<Article> articles = articleRepository.findByStatus(filterStatus, pageRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("articles", articles.getContent());
        response.put("totalElements", articles.getTotalElements());
        response.put("totalPages", articles.getTotalPages());
        return ResponseEntity.ok(response);
    }

    /**
     * Approve/publish an article (#25)
     */
    @PutMapping("/articles/{id}/approve")
    @RequiresPermission(Permission.ARTICLE_PUBLISH)
    @CacheEvict(value = {"articles", "articles_all", "articles_web"}, allEntries = true)
    public ResponseEntity<?> approveArticle(@PathVariable Long id) {
        return articleRepository.findById(id).map(article -> {
            if (!"submitted".equals(article.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Only articles in 'submitted' state can be approved"));
            }
            // Run profanity check before publishing if auto-flagging is enabled in config
            String autoFlagEnabledStr = systemConfigService.getConfigValueOrDefault("profanity.auto_flagging", "true");
            boolean autoFlagEnabled = Boolean.parseBoolean(autoFlagEnabledStr);
            if (autoFlagEnabled) {
                ProfanityService.ProfanityCheckResult check = profanityService.checkContent(
                    "ARTICLE", article.getId(), article.getTitleEn(),
                    null, null,
                    article.getTitleTa(), article.getTitleEn(),
                    article.getContentTa(), article.getContentEn()
                );

                if (!check.isClean()) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "message", "Content contains profanity and cannot be published",
                        "matchedTerms", check.getMatchedTerms()
                    ));
                }
            }

            article.setStatus("published");
            article.setPublishedAt(LocalDateTime.now());
            articleRepository.save(article);
            logAudit("PUBLISH", "Article", id, "Approved and published article");
            return ResponseEntity.ok(Map.of("message", "Article published successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Reject an article (#25)
     */
    @PutMapping("/articles/{id}/reject")
    @RequiresPermission(Permission.ARTICLE_REVIEW)
    @CacheEvict(value = {"articles", "articles_all", "articles_web"}, allEntries = true)
    public ResponseEntity<?> rejectArticle(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return articleRepository.findById(id).map(article -> {
            if (!"submitted".equals(article.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Only articles in 'submitted' state can be rejected"));
            }
            article.setStatus("rejected");
            articleRepository.save(article);
            logAudit("REJECT", "Article", id, "Rejected: " + request.getOrDefault("reason", "No reason provided"));
            return ResponseEntity.ok(Map.of("message", "Article rejected"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- UGC Review Queue (#29) ---

    @GetMapping("/ugc")
    @RequiresPermission(Permission.UGC_REVIEW)
    public ResponseEntity<?> listUgcSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UgcSubmission> submissions;

        if (status != null && !status.isEmpty()) {
            submissions = ugcSubmissionRepository.findByStatus(status, pageRequest);
        } else {
            submissions = ugcSubmissionRepository.findByStatus("PENDING", pageRequest);
        }

        return ResponseEntity.ok(Map.of(
            "submissions", submissions.getContent(),
            "totalElements", submissions.getTotalElements(),
            "totalPages", submissions.getTotalPages()
        ));
    }

    @PutMapping("/ugc/{id}/approve")
    @RequiresPermission(Permission.UGC_REVIEW)
    public ResponseEntity<?> approveUgc(@PathVariable Long id) {
        return ugcSubmissionRepository.findById(id).map(ugc -> {
            ugc.setStatus("APPROVED");
            ugc.setReviewedBy(getCallerId());
            ugc.setReviewedAt(LocalDateTime.now());
            ugcSubmissionRepository.save(ugc);
            logAudit("APPROVE", "UgcSubmission", id, "Approved UGC submission");
            return ResponseEntity.ok(Map.of("message", "UGC approved and published"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/ugc/{id}/reject")
    @RequiresPermission(Permission.UGC_REVIEW)
    public ResponseEntity<?> rejectUgc(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ugcSubmissionRepository.findById(id).map(ugc -> {
            ugc.setStatus("REJECTED");
            ugc.setReviewReason(request.get("reason"));
            ugc.setReviewedBy(getCallerId());
            ugc.setReviewedAt(LocalDateTime.now());
            ugcSubmissionRepository.save(ugc);
            logAudit("REJECT", "UgcSubmission", id, "Rejected: " + request.getOrDefault("reason", ""));
            return ResponseEntity.ok(Map.of("message", "UGC rejected"));
        }).orElse(ResponseEntity.notFound().build());
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
