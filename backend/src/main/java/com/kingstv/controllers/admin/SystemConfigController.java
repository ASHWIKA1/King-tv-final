package com.kingstv.controllers.admin;

import com.kingstv.models.SystemConfig;
import com.kingstv.security.RequiresPermission;
import com.kingstv.services.SystemConfigService;
import com.kingstv.services.DbCleanupService;
import com.kingstv.models.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * System configuration controller.
 * GPS radius (#3), Firebase/SMTP/SMS (#4), API failover (#5),
 * YouTube API (#7), video limit (#9), CDN (#13), live stream (#14),
 * PWA (#17), AI LLM config.
 */
@RestController
@RequestMapping("/api/v1/admin/config")
@RequiresPermission(Permission.CONFIG_WRITE)
public class SystemConfigController {

    @Autowired
    private SystemConfigService configService;

    @Autowired
    private DbCleanupService dbCleanupService;

    @GetMapping
    @RequiresPermission(Permission.CONFIG_READ)
    public ResponseEntity<?> getAllConfigs() {
        return ResponseEntity.ok(configService.getAllConfigs());
    }

    @GetMapping("/group/{group}")
    @RequiresPermission(Permission.CONFIG_READ)
    public ResponseEntity<?> getConfigsByGroup(@PathVariable String group) {
        return ResponseEntity.ok(configService.getConfigsByGroup(group));
    }

    @GetMapping("/{key}")
    @RequiresPermission(Permission.CONFIG_READ)
    public ResponseEntity<?> getConfig(@PathVariable String key) {
        String value = configService.getConfigValue(key);
        if (value == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }

    // --- GPS / Location Config (#3) ---
    @PutMapping("/gps")
    public ResponseEntity<?> updateGpsConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setConfigValue(SystemConfig.GPS_NEWS_RADIUS_KM, request.get("radiusKm"), "gps", "GPS news radius in km", userId);
        return ResponseEntity.ok(Map.of("message", "GPS config updated"));
    }

    // --- Firebase Config (#4) ---
    @PutMapping("/firebase")
    public ResponseEntity<?> updateFirebaseConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setConfigValue(SystemConfig.FIREBASE_CONFIG, request.get("config"), "firebase", "Firebase configuration JSON", userId);
        return ResponseEntity.ok(Map.of("message", "Firebase config updated"));
    }

    // --- SMTP Config (#4) ---
    @PutMapping("/smtp")
    public ResponseEntity<?> updateSmtpConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.SMTP_HOST, request.getOrDefault("host", ""),
            SystemConfig.SMTP_PORT, request.getOrDefault("port", "587"),
            SystemConfig.SMTP_USERNAME, request.getOrDefault("username", ""),
            SystemConfig.SMTP_PASSWORD, request.getOrDefault("password", "")
        ), "smtp", userId);
        return ResponseEntity.ok(Map.of("message", "SMTP config updated"));
    }

    // --- SMS/OTP Gateway Config (#4) ---
    @PutMapping("/sms")
    public ResponseEntity<?> updateSmsConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.SMS_GATEWAY_URL, request.getOrDefault("gatewayUrl", ""),
            SystemConfig.SMS_GATEWAY_API_KEY, request.getOrDefault("apiKey", "")
        ), "sms", userId);
        return ResponseEntity.ok(Map.of("message", "SMS gateway config updated"));
    }

    // --- API Failover Config (#5) ---
    @PutMapping("/api-failover")
    public ResponseEntity<?> updateApiFailover(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.API_FAILOVER_PRIMARY_URL, request.getOrDefault("primaryUrl", ""),
            SystemConfig.API_FAILOVER_SECONDARY_URL, request.getOrDefault("secondaryUrl", "")
        ), "api_failover", userId);
        return ResponseEntity.ok(Map.of("message", "API failover config updated"));
    }

    // --- YouTube API Config (#7) ---
    @PutMapping("/youtube")
    public ResponseEntity<?> updateYoutubeConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.YOUTUBE_API_KEY, request.getOrDefault("apiKey", ""),
            SystemConfig.YOUTUBE_CHANNEL_ID, request.getOrDefault("channelId", "")
        ), "youtube", userId);
        return ResponseEntity.ok(Map.of("message", "YouTube config updated"));
    }

    // --- Video Length Limit (#9) ---
    @PutMapping("/video-limit")
    public ResponseEntity<?> updateVideoLimit(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setConfigValue(SystemConfig.VIDEO_MAX_DURATION_SECONDS, request.get("maxDurationSeconds"), "video", "Max video duration in seconds", userId);
        return ResponseEntity.ok(Map.of("message", "Video limit updated"));
    }

    // --- CDN Config (#13) ---
    @PutMapping("/cdn")
    public ResponseEntity<?> updateCdnConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.CDN_BASE_URL, request.getOrDefault("baseUrl", ""),
            SystemConfig.CDN_API_KEY, request.getOrDefault("apiKey", "")
        ), "cdn", userId);
        return ResponseEntity.ok(Map.of("message", "CDN config updated"));
    }

    // --- Hosting Config ---
    @PutMapping("/hosting")
    public ResponseEntity<?> updateHostingConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.RENDER_API_KEY, request.getOrDefault("renderApiKey", ""),
            SystemConfig.VERCEL_API_KEY, request.getOrDefault("vercelApiKey", "")
        ), "hosting", userId);
        return ResponseEntity.ok(Map.of("message", "Hosting config updated"));
    }

    // --- Live Stream Config (#14) ---
    @PutMapping("/livestream")
    public ResponseEntity<?> updateLivestreamConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.LIVE_STREAM_SERVER_URL, request.getOrDefault("serverUrl", ""),
            SystemConfig.LIVE_STREAM_BROADCAST_URL, request.getOrDefault("broadcastUrl", ""),
            SystemConfig.LIVE_STREAM_KEY, request.getOrDefault("streamKey", "")
        ), "livestream", userId);
        return ResponseEntity.ok(Map.of("message", "Livestream config updated"));
    }

    // --- PWA Config (#17) ---
    @PutMapping("/pwa")
    public ResponseEntity<?> updatePwaConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.PWA_NAME, request.getOrDefault("name", ""),
            SystemConfig.PWA_SHORT_NAME, request.getOrDefault("shortName", ""),
            SystemConfig.PWA_THEME_COLOR, request.getOrDefault("themeColor", ""),
            SystemConfig.PWA_BACKGROUND_COLOR, request.getOrDefault("backgroundColor", "")
        ), "pwa", userId);
        return ResponseEntity.ok(Map.of("message", "PWA config updated"));
    }

    // --- Typography Config ---
    @PutMapping("/typography")
    public ResponseEntity<?> updateTypographyConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.FONT_PRIMARY, request.getOrDefault("primaryFont", "Inter"),
            SystemConfig.FONT_SECONDARY, request.getOrDefault("secondaryFont", "Merriweather"),
            SystemConfig.FONT_TERTIARY, request.getOrDefault("tertiaryFont", "Poppins")
        ), "typography", userId);
        return ResponseEntity.ok(Map.of("message", "Typography config updated"));
    }

    // --- Notification Preferences ---
    @PutMapping("/notifications")
    public ResponseEntity<?> updateNotificationPreferences(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.NOTIFY_EMAIL_BREAKING, request.getOrDefault("emailBreaking", "false"),
            SystemConfig.NOTIFY_EMAIL_DAILY, request.getOrDefault("emailDaily", "false"),
            SystemConfig.NOTIFY_SMS_BREAKING, request.getOrDefault("smsBreaking", "false"),
            SystemConfig.NOTIFY_SMS_OTP, request.getOrDefault("smsOtp", "true")
        ), "notifications", userId);
        return ResponseEntity.ok(Map.of("message", "Notification preferences updated"));
    }

    // --- AI/LLM Config (#46) ---
    @PutMapping("/ai-llm")
    public ResponseEntity<?> updateAiLlmConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.AI_LLM_API_URL, request.getOrDefault("apiUrl", ""),
            SystemConfig.AI_LLM_API_KEY, request.getOrDefault("apiKey", ""),
            SystemConfig.AI_LLM_MODEL, request.getOrDefault("model", "gpt-3.5-turbo")
        ), "ai", userId);
        return ResponseEntity.ok(Map.of("message", "AI/LLM config updated"));
    }

    private Long getCallerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long) return (Long) auth.getDetails();
        return null;
    }

    // --- Telegram Config ---
    @PutMapping("/telegram")
    public ResponseEntity<?> updateTelegramConfig(@RequestBody Map<String, String> request) {
        Long userId = getCallerId();
        configService.setMultipleConfigs(Map.of(
            SystemConfig.TELEGRAM_BOT_TOKEN, request.getOrDefault("botToken", ""),
            SystemConfig.TELEGRAM_CHAT_ID, request.getOrDefault("chatId", ""),
            SystemConfig.TELEGRAM_ENABLED, request.getOrDefault("enabled", "false")
        ), "telegram", userId);
        return ResponseEntity.ok(Map.of("message", "Telegram config updated"));
    }

    @PostMapping("/db-cleanup")
    public ResponseEntity<?> runManualDbCleanup() {
        dbCleanupService.executeCleanup();
        return ResponseEntity.ok(Map.of("message", "Database cleanup routine executed successfully."));
    }
}
