package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.services.WishService;
import com.kingstv.services.StorageService;
import com.kingstv.repository.DistrictRepository;
import com.kingstv.repository.WishCategoryRepository;
import com.kingstv.repository.WishFrameTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/api/v1/wishes", "/api/wishes"})
public class WishController {

    @Autowired
    private WishService wishService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private WishCategoryRepository wishCategoryRepository;

    @Autowired
    private WishFrameTemplateRepository wishFrameTemplateRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @GetMapping
    public ResponseEntity<?> getWishes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String pincode,
            @RequestParam(required = false) Boolean isSponsored,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Wish> wishes = wishService.getWishes(search, categoryId, districtId, status, pincode, isSponsored, sort, pageable);
        return ResponseEntity.ok(wishes.getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWishById(@PathVariable Long id) {
        Optional<Wish> wishOpt = wishService.getWishById(id);
        if (wishOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Wish not found"));
        }
        Wish wish = wishOpt.get();
        
        // Assemble details map containing comments and gallery photos
        Map<String, Object> details = new HashMap<>();
        details.put("id", wish.getId());
        details.put("uuid", wish.getUuid());
        details.put("recipientName", wish.getRecipientName());
        details.put("recipientPhoto", wish.getRecipientPhoto());
        details.put("senderName", wish.getSenderName());
        details.put("senderProfile", wish.getSenderProfile());
        details.put("relationship", wish.getRelationship());
        details.put("category", wish.getCategory());
        details.put("message", wish.getMessage());
        details.put("district", wish.getDistrict());
        details.put("talukId", wish.getTalukId());
        details.put("pincode", wish.getPincode());
        details.put("latitude", wish.getLatitude());
        details.put("longitude", wish.getLongitude());
        details.put("frameTemplate", wish.getFrameTemplate());
        details.put("scheduledPublishAt", wish.getScheduledPublishAt());
        details.put("publishedAt", wish.getPublishedAt());
        details.put("status", wish.getStatus());
        details.put("isSponsored", wish.getIsSponsored());
        details.put("sponsorName", wish.getSponsorName());
        details.put("sponsorLogo", wish.getSponsorLogo());
        details.put("viewCount", wish.getViewCount());
        details.put("reactionCount", wish.getReactionCount());
        details.put("commentCount", wish.getCommentCount());
        details.put("shareCount", wish.getShareCount());
        
        // Add related lists
        details.put("gallery", wishService.getWishGallery(wish.getId()));
        details.put("comments", wishService.getWishComments(wish.getId()));
        
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<?> createWish(@RequestBody Map<String, Object> request) {
        String recipientName = (String) request.get("recipientName");
        String senderName = (String) request.get("senderName");
        String message = (String) request.get("message");
        
        if (recipientName == null || recipientName.trim().isEmpty() ||
            senderName == null || senderName.trim().isEmpty() ||
            message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Recipient name, sender, and message are required."));
        }

        Wish wish = new Wish();
        wish.setRecipientName(recipientName);
        wish.setSenderName(senderName);
        wish.setMessage(message);
        
        wish.setRecipientPhoto((String) request.get("recipientPhoto"));
        wish.setSenderProfile((String) request.get("senderProfile"));
        wish.setRelationship((String) request.get("relationship"));
        wish.setPincode((String) request.get("pincode"));
        wish.setSponsorName((String) request.get("sponsorName"));
        wish.setSponsorLogo((String) request.get("sponsorLogo"));
        
        if (request.containsKey("categoryId") && request.get("categoryId") != null) {
            Long categoryId = Long.valueOf(request.get("categoryId").toString());
            wishCategoryRepository.findById(categoryId).ifPresent(wish::setCategory);
        }
        
        if (request.containsKey("districtId") && request.get("districtId") != null) {
            Long districtId = Long.valueOf(request.get("districtId").toString());
            districtRepository.findById(districtId).ifPresent(wish::setDistrict);
        }
        
        if (request.containsKey("frameTemplateId") && request.get("frameTemplateId") != null) {
            Long frameId = Long.valueOf(request.get("frameTemplateId").toString());
            wishFrameTemplateRepository.findById(frameId).ifPresent(wish::setFrameTemplate);
        }

        if (request.containsKey("talukId") && request.get("talukId") != null) {
            wish.setTalukId(Long.valueOf(request.get("talukId").toString()));
        }
        if (request.containsKey("latitude") && request.get("latitude") != null) {
            wish.setLatitude(Double.valueOf(request.get("latitude").toString()));
        }
        if (request.containsKey("longitude") && request.get("longitude") != null) {
            wish.setLongitude(Double.valueOf(request.get("longitude").toString()));
        }
        if (request.containsKey("isSponsored")) {
            wish.setIsSponsored((Boolean) request.get("isSponsored"));
        }

        if (request.containsKey("scheduledPublishAt") && request.get("scheduledPublishAt") != null) {
            wish.setScheduledPublishAt(LocalDateTime.parse(request.get("scheduledPublishAt").toString()));
        }
        
        List<String> galleryUrls = (List<String>) request.get("galleryUrls");
        Wish saved = wishService.createWish(wish, galleryUrls);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWish(@PathVariable Long id, @RequestBody Wish wish) {
        try {
            Wish updated = wishService.updateWish(id, wish);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWish(@PathVariable Long id) {
        try {
            wishService.deleteWish(id);
            return ResponseEntity.ok(Map.of("message", "Wish soft-deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reaction")
    public ResponseEntity<?> addReaction(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId,
            @RequestParam String type) {
        try {
            WishReaction reaction = wishService.addReaction(id, userId, sessionId, type);
            return ResponseEntity.ok(reaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/reaction")
    public ResponseEntity<?> removeReaction(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId) {
        wishService.removeReaction(id, userId, sessionId);
        return ResponseEntity.ok(Map.of("message", "Reaction removed successfully"));
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) Long userId,
            @RequestParam String commenterName,
            @RequestParam(required = false) String commenterPhoto,
            @RequestParam String text) {
        try {
            WishComment comment = wishService.addComment(id, parentId, userId, commenterName, commenterPhoto, text);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestParam String text,
            @RequestParam(required = false) Long userId) {
        try {
            WishComment comment = wishService.updateComment(id, text, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        try {
            wishService.deleteComment(id, userId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> logShare(@PathVariable Long id, @RequestParam String platform) {
        wishService.logShare(id, platform);
        return ResponseEntity.ok(Map.of("message", "Share logged successfully"));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> logView(@PathVariable Long id, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        wishService.logView(id, ipAddress, userAgent);
        return ResponseEntity.ok(Map.of("message", "View logged successfully"));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<?> saveWish(@PathVariable Long id, @RequestParam Long userId) {
        wishService.saveWish(id, userId);
        return ResponseEntity.ok(Map.of("message", "Wish bookmarked successfully"));
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<?> unsaveWish(@PathVariable Long id, @RequestParam Long userId) {
        wishService.unsaveWish(id, userId);
        return ResponseEntity.ok(Map.of("message", "Wish bookmark removed successfully"));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportWish(
            @PathVariable Long id,
            @RequestParam String reporterName,
            @RequestParam String reason) {
        wishService.reportWish(id, reporterName, reason);
        return ResponseEntity.ok(Map.of("message", "Wish reported successfully"));
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingWishes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Wish> wishes = wishService.getTrendingWishes(PageRequest.of(page, size));
        return ResponseEntity.ok(wishes.getContent());
    }

    @GetMapping("/popular")
    public ResponseEntity<?> getPopularWishes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Wish> wishes = wishService.getPopularWishes(PageRequest.of(page, size));
        return ResponseEntity.ok(wishes.getContent());
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestWishes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Wish> wishes = wishService.getLatestWishes(PageRequest.of(page, size));
        return ResponseEntity.ok(wishes.getContent());
    }

    @GetMapping("/sponsored")
    public ResponseEntity<?> getSponsoredWishes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Wish> wishes = wishService.getSponsoredWishes(PageRequest.of(page, size));
        return ResponseEntity.ok(wishes.getContent());
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyWishes(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "50.0") Double radius) {
        List<Wish> wishes = wishService.getNearbyWishes(lat, lon, radius);
        return ResponseEntity.ok(wishes);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(wishService.getCategories());
    }

    @GetMapping("/templates")
    public ResponseEntity<?> getTemplates() {
        return ResponseEntity.ok(wishFrameTemplateRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchWishes(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Wish> wishes = wishService.getWishes(query, null, null, "published", null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(wishes.getContent());
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterWishes(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String pincode,
            @RequestParam(required = false) Boolean isSponsored,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Wish> wishes = wishService.getWishes(null, categoryId, districtId, "published", pincode, isSponsored, sort, PageRequest.of(page, size));
        return ResponseEntity.ok(wishes.getContent());
    }

    // --- Dynamic File Upload ---
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        try {
            String url = storageService.uploadFile(file, "wishes");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }

    // --- Admin Wish Frame Templates Management ---
    @PostMapping("/admin/templates")
    public ResponseEntity<?> createWishTemplate(@RequestBody WishFrameTemplate template) {
        if (template.getName() == null || template.getSlug() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and slug are required"));
        }
        if (template.getDeleted() == null) template.setDeleted(false);
        return ResponseEntity.ok(wishFrameTemplateRepository.save(template));
    }

    @PutMapping("/admin/templates/{id}")
    public ResponseEntity<?> updateWishTemplate(@PathVariable Long id, @RequestBody WishFrameTemplate template) {
        Optional<WishFrameTemplate> opt = wishFrameTemplateRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Template not found"));
        }
        WishFrameTemplate existing = opt.get();
        if (template.getName() != null) existing.setName(template.getName());
        if (template.getBackgroundUrl() != null) existing.setBackgroundUrl(template.getBackgroundUrl());
        if (template.getOverlayUrl() != null) existing.setOverlayUrl(template.getOverlayUrl());
        if (template.getBorderColor() != null) existing.setBorderColor(template.getBorderColor());
        if (template.getTextColor() != null) existing.setTextColor(template.getTextColor());
        if (template.getSlug() != null) existing.setSlug(template.getSlug());
        if (template.getDeleted() != null) existing.setDeleted(template.getDeleted());
        return ResponseEntity.ok(wishFrameTemplateRepository.save(existing));
    }

    @DeleteMapping("/admin/templates/{id}")
    public ResponseEntity<?> deleteWishTemplate(@PathVariable Long id) {
        Optional<WishFrameTemplate> opt = wishFrameTemplateRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Template not found"));
        }
        WishFrameTemplate existing = opt.get();
        existing.setDeleted(true);
        wishFrameTemplateRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Template soft-deleted successfully"));
    }
}
