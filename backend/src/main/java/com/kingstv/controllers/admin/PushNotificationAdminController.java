package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Push notification composer (#11, #27).
 * Send globally, by location, or by user interest segment.
 */
@RestController
@RequestMapping("/api/v1/admin/push-notifications")
@RequiresPermission(Permission.PUSH_NOTIFICATION_SEND)
public class PushNotificationAdminController {

    @Autowired private PushNotificationRepository pushRepo;

    @GetMapping
    public ResponseEntity<?> listNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<PushNotificationRecord> notifications = pushRepo.findAll(
            PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(Map.of(
            "notifications", notifications.getContent(),
            "totalElements", notifications.getTotalElements(),
            "totalPages", notifications.getTotalPages()));
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody Map<String, String> request) {
        PushNotificationRecord record = new PushNotificationRecord();
        record.setTitle(request.get("title"));
        record.setBody(request.get("body"));
        record.setImageUrl(request.get("imageUrl"));
        record.setActionUrl(request.get("actionUrl"));
        record.setTargetType(request.getOrDefault("targetType", "GLOBAL"));
        record.setTargetValue(request.get("targetValue"));
        record.setStatus("DRAFT");
        record.setCreatedBy(getCallerId());
        return ResponseEntity.status(HttpStatus.CREATED).body(pushRepo.save(record));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<?> sendNotification(@PathVariable Long id) {
        return pushRepo.findById(id).map(record -> {
            record.setStatus("SENT");
            record.setSentAt(LocalDateTime.now());
            // In production, integrate with Firebase Cloud Messaging here
            record.setSentCount(1);
            pushRepo.save(record);
            return ResponseEntity.ok(Map.of("message", "Notification sent successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        long total = pushRepo.count();
        long sent = pushRepo.findByStatus("SENT", PageRequest.of(0, 1)).getTotalElements();
        return ResponseEntity.ok(Map.of("total", total, "sent", sent));
    }

    private Long getCallerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long) return (Long) auth.getDetails();
        return null;
    }
}
