package com.kingstv.controllers;

import com.kingstv.models.Article;
import com.kingstv.repository.ArticleRepository;
import com.kingstv.repository.HomeLayoutConfigRepository;
import com.kingstv.services.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@CrossOrigin(origins = "*") // Public API
public class PublicNewsController {
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private HomeLayoutConfigRepository layoutRepository;

    @Autowired
    private SystemConfigService systemConfigService;

    /**
     * Get news articles filtered by GPS location (Geo-fencing)
     * If an article has no GPS configured, it is considered Global and will be returned.
     * If it has GPS, it will only be returned if the user is within the visibility radius.
     */
    @GetMapping("/news")
    public ResponseEntity<?> getNearbyNews(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(defaultValue = "20") int limit) {
        
        List<Article> articles;
        
        if (lat != null && lon != null) {
            double defaultRadius = 50.0;
            try {
                String radiusVal = systemConfigService.getConfigValue("gps.news_radius_km");
                if (radiusVal != null && !radiusVal.trim().isEmpty()) {
                    defaultRadius = Double.parseDouble(radiusVal);
                }
            } catch (Exception e) {
                System.err.println("Failed to read gps.news_radius_km: " + e.getMessage());
            }
            articles = articleRepository.findNearbyArticles(lat, lon, defaultRadius, limit);
        } else {
            // Fallback for users who deny location permissions
            articles = articleRepository.findTop50ByStatusOrderByPublishedAtDesc("published");
        }
        
        return ResponseEntity.ok(articles);
    }

    /**
     * Get public home layout configuration
     */
    @GetMapping("/layout/web")
    public ResponseEntity<?> getWebLayout() {
        return ResponseEntity.ok(layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("WEB"));
    }

    @GetMapping("/maintenance-status")
    public ResponseEntity<?> getMaintenanceStatus() {
        boolean maintenance = false;
        try {
            String val = systemConfigService.getConfigValue("system.maintenance_mode");
            if (val != null) {
                maintenance = Boolean.parseBoolean(val);
            }
        } catch (Exception e) {
            System.err.println("Failed to read system.maintenance_mode: " + e.getMessage());
        }
        return ResponseEntity.ok(java.util.Map.of("maintenance", maintenance));
    }
}

