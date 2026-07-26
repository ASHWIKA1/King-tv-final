package com.kingstv.controllers.admin;

import com.kingstv.models.AiConfiguration;
import com.kingstv.models.Permission;
import com.kingstv.security.RequiresPermission;
import com.kingstv.services.AiConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/ai-config")
@RequiresPermission(Permission.CONFIG_WRITE)
public class AiConfigurationController {

    @Autowired
    private AiConfigurationService aiConfigurationService;

    @GetMapping
    @RequiresPermission(Permission.CONFIG_READ)
    public ResponseEntity<?> getAllConfigs() {
        return ResponseEntity.ok(aiConfigurationService.getAllConfigurations());
    }

    @GetMapping("/{provider}")
    @RequiresPermission(Permission.CONFIG_READ)
    public ResponseEntity<?> getConfig(@PathVariable String provider) {
        return aiConfigurationService.getConfiguration(provider)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{provider}")
    public ResponseEntity<?> updateConfig(@PathVariable String provider, @RequestBody AiConfiguration request) {
        Long userId = getCallerId();
        try {
            AiConfiguration updated = aiConfigurationService.saveConfiguration(provider, request, userId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error saving configuration: " + e.getMessage()));
        }
    }

    @PostMapping("/{provider}/test")
    public ResponseEntity<?> testConnection(@PathVariable String provider, @RequestBody AiConfiguration request) {
        try {
            boolean success = aiConfigurationService.testProviderConnection(provider, request);
            if (success) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Connected Successfully"));
            } else {
                return ResponseEntity.ok(Map.of("success", false, "message", "Connection test returned an empty response"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/{provider}/activate")
    public ResponseEntity<?> activateProvider(@PathVariable String provider) {
        Long userId = getCallerId();
        try {
            aiConfigurationService.activateProvider(provider, userId);
            return ResponseEntity.ok(Map.of("message", provider.toUpperCase() + " provider activated successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error activating provider: " + e.getMessage()));
        }
    }

    @PostMapping("/{provider}/reset")
    public ResponseEntity<?> resetToDefault(@PathVariable String provider) {
        Long userId = getCallerId();
        try {
            AiConfiguration reset = aiConfigurationService.resetToDefault(provider, userId);
            return ResponseEntity.ok(reset);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error resetting config: " + e.getMessage()));
        }
    }

    private Long getCallerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long) return (Long) auth.getDetails();
        return null;
    }
}
