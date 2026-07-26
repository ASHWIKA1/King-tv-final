package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Analytics & Reports module (#50-#56).
 * Role-gated per section. Provides aggregation queries for news performance,
 * user growth, push notification analytics, content metrics, and author performance.
 */
@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiresPermission(Permission.ANALYTICS_VIEW)
public class AnalyticsController {

    @Autowired private ArticleRepository articleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PushNotificationRepository pushRepo;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private CategoryRepository categoryRepository;

    /**
     * Dashboard KPIs (#56)
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardKpis() {
        Map<String, Object> kpis = new LinkedHashMap<>();
        kpis.put("totalArticles", articleRepository.count());
        kpis.put("totalUsers", userRepository.count());
        kpis.put("totalCategories", categoryRepository.count());
        kpis.put("activeUsers", userRepository.countByIsActive(true));
        kpis.put("totalNotifications", pushRepo.count());

        // Role breakdown
        Map<String, Long> roleBreakdown = new LinkedHashMap<>();
        roleBreakdown.put("superAdmins", userRepository.countByRole(Role.SUPER_ADMIN));
        roleBreakdown.put("chiefEditors", userRepository.countByRole(Role.CHIEF_EDITOR));
        roleBreakdown.put("districtAdmins", userRepository.countByRole(Role.DISTRICT_ADMIN));
        roleBreakdown.put("journalists", userRepository.countByRole(Role.MOBILE_JOURNALIST));
        roleBreakdown.put("institutions", userRepository.countByRole(Role.INSTITUTION_LOGIN));
        roleBreakdown.put("readers", userRepository.countByRole(Role.READER));
        kpis.put("roleBreakdown", roleBreakdown);

        return ResponseEntity.ok(kpis);
    }

    /**
     * News performance analytics (#51)
     * Filterable by global/district/category, monthly/yearly views
     */
    @GetMapping("/news-performance")
    public ResponseEntity<?> getNewsPerformance(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long districtId) {

        List<Article> articles = articleRepository.findAll();

        if (categoryId != null) {
            articles = articles.stream().filter(a -> categoryId.equals(a.getCategoryId())).toList();
        }
        if (districtId != null) {
            articles = articles.stream().filter(a -> districtId.equals(a.getDistrictId())).toList();
        }

        long totalViews = articles.stream().mapToInt(a -> a.getViewsCount() != null ? a.getViewsCount() : 0).sum();
        long publishedCount = articles.stream().filter(a -> "published".equals(a.getStatus())).count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalArticles", articles.size());
        result.put("totalViews", totalViews);
        result.put("publishedCount", publishedCount);
        result.put("avgViewsPerArticle", articles.isEmpty() ? 0 : totalViews / articles.size());

        // Top performing articles
        List<Map<String, Object>> topArticles = articles.stream()
                .sorted((a, b) -> (b.getViewsCount() != null ? b.getViewsCount() : 0) - (a.getViewsCount() != null ? a.getViewsCount() : 0))
                .limit(10)
                .map(a -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", a.getId());
                    m.put("title", a.getTitleEn());
                    m.put("views", a.getViewsCount());
                    m.put("status", a.getStatus());
                    m.put("categoryId", a.getCategoryId());
                    return m;
                }).toList();
        result.put("topArticles", topArticles);

        return ResponseEntity.ok(result);
    }

    /**
     * User growth analytics (#52)
     */
    @GetMapping("/user-growth")
    public ResponseEntity<?> getUserGrowthAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalUsers", userRepository.count());
        result.put("activeUsers", userRepository.countByIsActive(true));
        result.put("inactiveUsers", userRepository.countByIsActive(false));

        // By role
        Map<String, Long> byRole = new LinkedHashMap<>();
        for (String role : List.of(Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN, Role.MOBILE_JOURNALIST, Role.INSTITUTION_LOGIN, Role.READER)) {
            byRole.put(role, userRepository.countByRole(role));
        }
        result.put("byRole", byRole);

        return ResponseEntity.ok(result);
    }

    /**
     * Push notification analytics (#53)
     */
    @GetMapping("/push-analytics")
    public ResponseEntity<?> getPushAnalytics() {
        List<PushNotificationRecord> all = pushRepo.findAll();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalNotifications", all.size());
        result.put("sentCount", all.stream().filter(n -> "SENT".equals(n.getStatus())).count());
        result.put("draftCount", all.stream().filter(n -> "DRAFT".equals(n.getStatus())).count());
        result.put("totalSent", all.stream().mapToInt(n -> n.getSentCount() != null ? n.getSentCount() : 0).sum());
        result.put("totalDelivered", all.stream().mapToInt(n -> n.getDeliveredCount() != null ? n.getDeliveredCount() : 0).sum());
        result.put("totalOpened", all.stream().mapToInt(n -> n.getOpenedCount() != null ? n.getOpenedCount() : 0).sum());

        return ResponseEntity.ok(result);
    }

    /**
     * Content performance by category (#54)
     */
    @GetMapping("/content-by-category")
    public ResponseEntity<?> getContentByCategory() {
        List<Category> categories = categoryRepository.findAll();
        List<Article> allArticles = articleRepository.findAll();

        List<Map<String, Object>> result = categories.stream().map(cat -> {
            List<Article> catArticles = allArticles.stream()
                    .filter(a -> cat.getId().equals(a.getCategoryId())).toList();
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("categoryId", cat.getId());
            m.put("categoryName", cat.getName());
            m.put("articleCount", catArticles.size());
            m.put("totalViews", catArticles.stream().mapToInt(a -> a.getViewsCount() != null ? a.getViewsCount() : 0).sum());
            return m;
        }).toList();

        return ResponseEntity.ok(result);
    }

    /**
     * Author/journalist performance (#55)
     */
    @GetMapping("/author-performance")
    public ResponseEntity<?> getAuthorPerformance() {
        List<Article> allArticles = articleRepository.findAll();

        Map<String, List<Article>> byAuthor = new HashMap<>();
        for (Article a : allArticles) {
            String author = a.getAuthorName() != null ? a.getAuthorName() : "Unknown";
            byAuthor.computeIfAbsent(author, k -> new ArrayList<>()).add(a);
        }

        List<Map<String, Object>> result = byAuthor.entrySet().stream().map(entry -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("author", entry.getKey());
            m.put("articleCount", entry.getValue().size());
            m.put("totalViews", entry.getValue().stream().mapToInt(a -> a.getViewsCount() != null ? a.getViewsCount() : 0).sum());
            m.put("publishedCount", entry.getValue().stream().filter(a -> "published".equals(a.getStatus())).count());
            return m;
        }).sorted((a, b) -> ((Number) b.get("totalViews")).intValue() - ((Number) a.get("totalViews")).intValue())
          .toList();

        return ResponseEntity.ok(result);
    }
}
