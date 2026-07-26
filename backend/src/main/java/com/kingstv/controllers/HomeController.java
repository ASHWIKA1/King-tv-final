package com.kingstv.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.Map;

@RestController
public class HomeController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/api/v1/home")
    public Map<String, Object> getHomeInfo() {
        return Map.of(
            "status", "UP",
            "siteName", "KINGS 24x7",
            "tagline", "LIVE • TRUE • TAMIL",
            "welcomeMessage", "Welcome to Kings TV Tamil News Portal API",
            "activeUsers", 1250,
            "breakingNews", "தமிழக பட்ஜெட் 2026 முக்கிய அம்சங்கள் அறிவிப்பு."
        );
    }

    @GetMapping("/api/v1/health")
    public Map<String, String> getHealthStatus() {
        String dbStatus = "DOWN";
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1000)) {
                dbStatus = "UP";
            }
        } catch (Exception e) {
            dbStatus = "DOWN (Error: " + e.getMessage() + ")";
        }

        return Map.of(
            "status", "UP",
            "database", dbStatus
        );
    }
}

