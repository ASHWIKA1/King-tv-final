package com.kingstv.controllers.admin;

import com.kingstv.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides lightweight counts for the admin sidebar badge indicators.
 * Returns pending/active counts for: submitted articles, pending UGC,
 * active breaking news, and pending profanity violations.
 */
@RestController
@RequestMapping("/api/v1/admin/sidebar")
public class SidebarCountsController {

    @Autowired private ArticleRepository articleRepository;
    @Autowired private UgcSubmissionRepository ugcSubmissionRepository;
    @Autowired private BreakingNewsRepository breakingNewsRepository;
    @Autowired private ProfanityViolationRepository profanityViolationRepository;

    @GetMapping("/counts")
    public ResponseEntity<?> getSidebarCounts() {
        Map<String, Long> counts = new HashMap<>();
        
        // Articles awaiting editorial review
        counts.put("pendingArticles", articleRepository.countByStatus("submitted"));
        
        // UGC submissions awaiting moderation
        counts.put("pendingUgc", ugcSubmissionRepository.countByStatus("PENDING"));
        
        // Currently active breaking news alerts
        counts.put("activeBreaking", breakingNewsRepository.countByStatus("published"));
        
        // Profanity violations awaiting review
        counts.put("pendingProfanity", profanityViolationRepository.countByStatus("PENDING"));
        
        return ResponseEntity.ok(counts);
    }
}
