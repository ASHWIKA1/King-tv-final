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
@RequestMapping("/api/v1/public/config")
public class PublicConfigController {

    @Autowired
    private SystemConfigRepository configRepository;

    @GetMapping("/ui")
    public ResponseEntity<Map<String, String>> getUiConfig() {
        Map<String, String> response = new HashMap<>();
        
        response.put("font.primary", "Inter");
        response.put("font.secondary", "Merriweather");
        response.put("font.tertiary", "Poppins");

        try {
            List<SystemConfig> configs = configRepository.findByConfigGroup("typography");
            if (configs != null) {
                for (SystemConfig config : configs) {
                    if (config != null && config.getConfigKey() != null) {
                        response.put(config.getConfigKey(), config.getConfigValue() != null ? config.getConfigValue() : "");
                    }
                }
            }
        } catch (Exception e) {
            // Safe fallback to defaults
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, String>> getPublicSettings() {
        Map<String, String> response = new HashMap<>();
        
        // Define default settings
        response.put("site.name", "KING 24x7");
        response.put("site.logo_url", "/assets/icons/logo-icon-light.png");
        response.put("site.logo_footer", "/assets/icons/logo-icon-light.png");
        response.put("site.tagline", "Truth. Responsibility. In Tamil.");
        response.put("site.tagline_ta", "உண்மை. பொறுப்புடன். தமிழ்.");
        response.put("site.description", "KING 24x7 is a leading Tamil news portal. We deliver instant, reliable news from Tamil Nadu, India, and across the globe.");
        response.put("site.description_ta", "KING 24x7 ஒரு முன்னணி தமிழ் செய்தி போர்டல். தமிழகம், இந்தியா மற்றும் உலகம் முழுவதும் இருந்து தமிழில் உடனடி, நம்பகமான செய்திகளை வழங்குகிறோம்.");
        response.put("social.facebook", "https://www.facebook.com/profile.php?id=61551357861905");
        response.put("social.twitter", "https://x.com/onlinethamizhan");
        response.put("social.instagram", "https://www.instagram.com/king24x7/");
        response.put("social.youtube", "https://www.youtube.com/@king24x7");

        try {
            List<SystemConfig> configs = configRepository.findAll();
            if (configs != null) {
                for (SystemConfig config : configs) {
                    if (config != null && config.getConfigKey() != null) {
                        String key = config.getConfigKey();
                        if (key.startsWith("site.") || key.startsWith("social.") || key.equals("system.maintenance_mode") || key.startsWith("pwa.")) {
                            response.put(key, config.getConfigValue() != null ? config.getConfigValue() : "");
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Safe fallback to default settings
        }

        return ResponseEntity.ok(response);
    }
}
