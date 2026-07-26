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
        List<SystemConfig> configs = configRepository.findByConfigGroup("typography");
        Map<String, String> response = new HashMap<>();
        
        response.put("font.primary", "Inter");
        response.put("font.secondary", "Merriweather");
        response.put("font.tertiary", "Poppins");

        for (SystemConfig config : configs) {
            response.put(config.getConfigKey(), config.getConfigValue());
        }

        return ResponseEntity.ok(response);
    }
}
