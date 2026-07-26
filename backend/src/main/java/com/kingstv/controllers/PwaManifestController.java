package com.kingstv.controllers;

import com.kingstv.models.SystemConfig;
import com.kingstv.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/config")
public class PwaManifestController {

    @Autowired
    private SystemConfigRepository configRepository;

    @GetMapping("/manifest.json")
    public ResponseEntity<Map<String, Object>> getManifest() {
        List<SystemConfig> configs = configRepository.findAll();
        Map<String, String> configMap = new HashMap<>();
        
        for (SystemConfig config : configs) {
            configMap.put(config.getConfigKey(), config.getConfigValue());
        }

        String appName = configMap.getOrDefault("pwa_name", "King 24x7 News");
        String shortName = configMap.getOrDefault("pwa_short_name", "King24x7");
        String themeColor = configMap.getOrDefault("pwa_theme_color", "#e10600");
        String bgColor = configMap.getOrDefault("pwa_bg_color", "#ffffff");

        Map<String, Object> manifest = new HashMap<>();
        manifest.put("name", appName);
        manifest.put("short_name", shortName);
        manifest.put("theme_color", themeColor);
        manifest.put("background_color", bgColor);
        manifest.put("display", "standalone");
        manifest.put("start_url", "/");

        List<Map<String, String>> icons = List.of(
                Map.of("src", "/icons/icon-192x192.png", "sizes", "192x192", "type", "image/png"),
                Map.of("src", "/icons/icon-512x512.png", "sizes", "512x512", "type", "image/png")
        );
        manifest.put("icons", icons);

        return ResponseEntity.ok().body(manifest);
    }
}
