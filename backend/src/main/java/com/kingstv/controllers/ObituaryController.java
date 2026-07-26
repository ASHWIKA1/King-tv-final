package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.services.ObituaryService;
import com.kingstv.services.StorageService;
import com.kingstv.repository.DistrictRepository;
import com.kingstv.repository.ObituaryFrameTemplateRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/api/obituaries", "/api/v1/obituaries"})
public class ObituaryController {

    @Autowired
    private ObituaryService obituaryService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private ObituaryFrameTemplateRepository frameTemplateRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private com.kingstv.repository.ObituaryRepository obituaryRepository;

    @Autowired
    private com.kingstv.repository.ObituaryReportRepository obituaryReportRepository;

    @Autowired
    private com.kingstv.repository.UserRepository userRepository;

    @Autowired
    private com.kingstv.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private com.kingstv.repository.ObituaryGuestbookRepository guestbookRepository;

    @GetMapping
    public ResponseEntity<?> getObituaries(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String pincode,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Obituary> obituaries = obituaryService.getObituaries(search, districtId, status, pincode, sort, pageable);
        return ResponseEntity.ok(obituaries.getContent());
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingMemorials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Obituary> obits = obituaryService.getObituaries(null, null, "published", null, "popular", PageRequest.of(page, size));
        return ResponseEntity.ok(obits.getContent());
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentMemorials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Obituary> obits = obituaryService.getObituaries(null, null, "published", null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(obits.getContent());
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyMemorials(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "50.0") Double radius) {
        List<Obituary> obits = obituaryService.getNearbyMemorials(lat, lon, radius);
        return ResponseEntity.ok(obits);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchObituaries(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Obituary> obits = obituaryService.getObituaries(query, null, "published", null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(obits.getContent());
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterObituaries(
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String pincode,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Obituary> obits = obituaryService.getObituaries(null, districtId, "published", pincode, sort, PageRequest.of(page, size));
        return ResponseEntity.ok(obits.getContent());
    }

    @GetMapping("/frames")
    public ResponseEntity<?> getFrames() {
        return ResponseEntity.ok(frameTemplateRepository.findByIsActiveTrueOrderByDisplayOrderAsc());
    }

    // --- Dynamic File Upload ---
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        try {
            String url = storageService.uploadFile(file, "obituaries");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }

    // Put /{id} dynamic path mappings at the very bottom
    @GetMapping("/{id}")
    public ResponseEntity<?> getObituaryById(@PathVariable Long id) {
        Optional<Obituary> obitOpt = obituaryService.getObituaryById(id);
        if (obitOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Memorial not found"));
        }
        Obituary obit = obitOpt.get();

        Map<String, Object> details = new HashMap<>();
        details.put("id", obit.getId());
        details.put("uuid", obit.getUuid());
        details.put("deceasedName", obit.getDeceasedName());
        details.put("photo", obit.getPhoto());
        details.put("age", obit.getAge());
        details.put("gender", obit.getGender());
        details.put("dateOfBirth", obit.getDateOfBirth());
        details.put("dateOfPassing", obit.getDateOfPassing());
        details.put("demiseDate", obit.getDemiseDate());
        details.put("religion", obit.getReligion());
        details.put("nativePlace", obit.getNativePlace());
        details.put("location", obit.getLocation());
        details.put("district", obit.getDistrict());
        details.put("talukId", obit.getTalukId());
        details.put("pincode", obit.getPincode());
        details.put("latitude", obit.getLatitude());
        details.put("longitude", obit.getLongitude());
        details.put("funeralDatetime", obit.getFuneralDatetime());
        details.put("funeralVenue", obit.getFuneralVenue());
        details.put("funeralDetails", obit.getFuneralDetails());
        details.put("mapLink", obit.getMapLink());
        details.put("familyContactName", obit.getFamilyContactName());
        details.put("familyPhone", obit.getFamilyPhone());
        details.put("posterRelationship", obit.getPosterRelationship());
        details.put("biography", obit.getBiography());
        details.put("shortDescription", obit.getShortDescription());
        details.put("frameTemplate", obit.getFrameTemplate());
        details.put("tributeCount", obit.getTributeCount());
        details.put("guestbookCount", obit.getGuestbookCount());
        details.put("reportCount", obit.getReportCount());
        details.put("status", obit.getStatus());
        details.put("createdAt", obit.getCreatedAt());
        details.put("isCelebrity", obit.getIsCelebrity());

        details.put("gallery", obituaryService.getObituaryGallery(obit.getId()));
        details.put("guestbook", obituaryService.getObituaryGuestbook(obit.getId()));

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> {
            String r = a.getAuthority();
            return r.equals("ROLE_ADMIN") || r.equals("ROLE_EDITOR") || r.equals("admin") || r.equals("editor");
        });
        if (isAdmin) {
            details.put("proofDocument", obit.getProofDocument());
            details.put("submitterContact", obit.getSubmitterContact());
        }

        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<?> createObituary(@RequestBody Map<String, Object> request) {
        String deceasedName = (String) request.get("deceasedName");
        Integer age = request.get("age") != null ? Integer.valueOf(request.get("age").toString()) : 0;
        String biography = request.get("biography") != null ? (String) request.get("biography") : "In loving memory.";
        String location = (String) request.get("location");
        String dateOfPassingStr = (String) request.get("dateOfPassing");
        String posterRelationship = (String) request.get("posterRelationship");
        String submitterContact = (String) request.get("submitterContact");

        if (deceasedName == null || deceasedName.trim().isEmpty() ||
            dateOfPassingStr == null || dateOfPassingStr.trim().isEmpty() ||
            location == null || location.trim().isEmpty() ||
            posterRelationship == null || posterRelationship.trim().isEmpty() ||
            submitterContact == null || submitterContact.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name of deceased, date of passing, location, relationship, and submitter contact are required."));
        }

        Obituary obit = new Obituary();
        obit.setDeceasedName(deceasedName);
        obit.setAge(age);
        obit.setBiography(biography);

        obit.setPhoto((String) request.get("photo"));
        obit.setGender((String) request.get("gender"));
        obit.setReligion((String) request.get("religion"));
        obit.setNativePlace(location);
        obit.setLocation(location);
        obit.setPincode((String) request.get("pincode"));
        obit.setFuneralVenue((String) request.get("funeralVenue"));
        obit.setMapLink((String) request.get("mapLink"));
        obit.setFamilyContactName((String) request.get("familyContactName"));
        obit.setFamilyPhone((String) request.get("familyPhone"));
        obit.setPosterRelationship(posterRelationship);
        obit.setSubmitterContact(submitterContact);
        obit.setProofDocument((String) request.get("proofDocument"));
        obit.setStatus("pending_review");
        if (request.containsKey("isCelebrity") && request.get("isCelebrity") != null) {
            obit.setIsCelebrity(Boolean.valueOf(request.get("isCelebrity").toString()));
        }

        if (request.containsKey("dateOfBirth") && request.get("dateOfBirth") != null) {
            obit.setDateOfBirth(LocalDate.parse(request.get("dateOfBirth").toString()));
        }
        if (request.containsKey("dateOfPassing") && request.get("dateOfPassing") != null) {
            obit.setDateOfPassing(LocalDate.parse(request.get("dateOfPassing").toString()));
        }
        if (request.containsKey("districtId") && request.get("districtId") != null) {
            Long dId = Long.valueOf(request.get("districtId").toString());
            districtRepository.findById(dId).ifPresent(obit::setDistrict);
        }
        if (request.containsKey("frameTemplateId") && request.get("frameTemplateId") != null) {
            Long fId = Long.valueOf(request.get("frameTemplateId").toString());
            frameTemplateRepository.findById(fId).ifPresent(obit::setFrameTemplate);
        }
        if (request.containsKey("funeralDatetime") && request.get("funeralDatetime") != null) {
            obit.setFuneralDatetime(LocalDateTime.parse(request.get("funeralDatetime").toString()));
        }
        if (request.containsKey("latitude") && request.get("latitude") != null) {
            obit.setLatitude(Double.valueOf(request.get("latitude").toString()));
        }
        if (request.containsKey("longitude") && request.get("longitude") != null) {
            obit.setLongitude(Double.valueOf(request.get("longitude").toString()));
        }

        List<String> galleryUrls = (List<String>) request.get("galleryUrls");
        Obituary saved = obituaryService.createObituary(obit, galleryUrls);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateObituary(@PathVariable Long id, @RequestBody Obituary obituary) {
        try {
            Obituary updated = obituaryService.updateObituary(id, obituary);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteObituary(@PathVariable Long id) {
        try {
            obituaryService.deleteObituary(id);
            return ResponseEntity.ok(Map.of("message", "Obituary soft-deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/tribute")
    public ResponseEntity<?> payTribute(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId,
            @RequestParam(defaultValue = "Tribute") String type) {
        try {
            ObituaryTribute tribute = obituaryService.addTribute(id, userId, sessionId, type);
            return ResponseEntity.ok(tribute);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/guestbook")
    public ResponseEntity<?> addGuestbookMessage(
            @PathVariable Long id,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) Long userId,
            @RequestParam String visitorName,
            @RequestParam String text) {
        try {
            ObituaryGuestbook gb = obituaryService.addGuestbookMessage(id, parentId, userId, visitorName, text);
            return ResponseEntity.ok(gb);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/guestbook/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestParam String text,
            @RequestParam(required = false) Long userId) {
        try {
            ObituaryGuestbook gb = obituaryService.updateComment(id, text, userId);
            return ResponseEntity.ok(gb);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/guestbook/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        try {
            obituaryService.deleteComment(id, userId);
            return ResponseEntity.ok(Map.of("message", "Guestbook message deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> logView(@PathVariable Long id, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        obituaryService.logView(id, ipAddress, userAgent);
        return ResponseEntity.ok(Map.of("message", "View logged successfully"));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> logReport(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String reporterName,
            @RequestParam(required = false) String reason) {
        
        String name = reporterName;
        String fullReason = reason;

        if (body != null) {
            name = body.getOrDefault("reporterName", body.getOrDefault("contact", name));
            String dropReason = body.getOrDefault("reason", "");
            String details = body.getOrDefault("details", "");
            String contact = body.getOrDefault("contact", "");
            
            StringBuilder sb = new StringBuilder();
            sb.append("Reason: ").append(dropReason);
            if (details != null && !details.trim().isEmpty()) {
                sb.append(" | Details: ").append(details);
            }
            if (contact != null && !contact.trim().isEmpty()) {
                sb.append(" | Contact: ").append(contact);
            }
            fullReason = sb.toString();
        }

        if (name == null || name.trim().isEmpty()) {
            name = "Anonymous";
        }

        obituaryService.logReport(id, name, fullReason);
        return ResponseEntity.ok(Map.of("message", "Thank you — we will review this and take appropriate action."));
    }

    @PostMapping("/{id}/share-card")
    public ResponseEntity<?> logShareCard(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Share card logged successfully"));
    }

    // --- Template Management CRUD ---
    @GetMapping("/admin/frames/all")
    public ResponseEntity<?> getAllFramesForAdmin() {
        return ResponseEntity.ok(frameTemplateRepository.findAll());
    }

    @PostMapping("/admin/frames")
    public ResponseEntity<?> createFrameTemplate(@RequestBody ObituaryFrameTemplate template) {
        if (template.getName() == null || template.getAssetUrl() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and asset url are required"));
        }
        if (template.getIsActive() == null) template.setIsActive(true);
        if (template.getDisplayOrder() == null) template.setDisplayOrder(0);
        return ResponseEntity.ok(frameTemplateRepository.save(template));
    }

    @PutMapping("/admin/frames/{id}")
    public ResponseEntity<?> updateFrameTemplate(@PathVariable Long id, @RequestBody ObituaryFrameTemplate template) {
        Optional<ObituaryFrameTemplate> opt = frameTemplateRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Template not found"));
        }
        ObituaryFrameTemplate existing = opt.get();
        if (template.getName() != null) existing.setName(template.getName());
        if (template.getCategory() != null) existing.setCategory(template.getCategory());
        if (template.getAssetUrl() != null) existing.setAssetUrl(template.getAssetUrl());
        if (template.getThumbnail() != null) existing.setThumbnail(template.getThumbnail());
        if (template.getIsActive() != null) existing.setIsActive(template.getIsActive());
        if (template.getDisplayOrder() != null) existing.setDisplayOrder(template.getDisplayOrder());
        return ResponseEntity.ok(frameTemplateRepository.save(existing));
    }

    @DeleteMapping("/admin/frames/{id}")
    public ResponseEntity<?> deleteFrameTemplate(@PathVariable Long id) {
        if (!frameTemplateRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Template not found"));
        }
        frameTemplateRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Template deleted successfully"));
    }

    // --- Admin Moderation Endpoints ---
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateObituaryStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Obituary> obitOpt = obituaryRepository.findById(id);
        if (obitOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Obituary not found"));
        }
        Obituary obit = obitOpt.get();
        String status = request.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        obit.setStatus(status);
        if ("rejected".equalsIgnoreCase(status)) {
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Rejection reason is required"));
            }
            obit.setRejectionReason(reason);
        } else if ("published".equalsIgnoreCase(status)) {
            obit.setRejectionReason(null);
        }
        Obituary saved = obituaryRepository.save(obit);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/admin/reports")
    public ResponseEntity<?> getReports() {
        List<ObituaryReport> reports = obituaryReportRepository.findAll();
        List<Map<String, Object>> responses = new java.util.ArrayList<>();
        for (ObituaryReport r : reports) {
            Optional<Obituary> obitOpt = obituaryRepository.findById(r.getObituaryId());
            Map<String, Object> map = new HashMap<>();
            map.put("report", r);
            map.put("obituary", obitOpt.orElse(null));
            responses.add(map);
        }
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/admin/reports/{id}")
    public ResponseEntity<?> dismissReport(@PathVariable Long id) {
        if (!obituaryReportRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Report not found"));
        }
        obituaryReportRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Report dismissed"));
    }

    @PostMapping("/admin/unmask-log")
    public ResponseEntity<?> logUnmaskReason(@RequestBody Map<String, String> body, Principal principal) {
        String reason = body.get("reason");
        String obitId = body.get("obituaryId");
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reason is required for unmasking contact info"));
        }
        
        try {
            String actorEmail = principal != null ? principal.getName() : "system";
            User actorUser = principal != null ? userRepository.findByEmail(actorEmail).orElse(null) : null;
            AuditLog auditLog = new AuditLog();
            if (actorUser != null) {
                auditLog.setActorId((long) actorUser.getId());
                auditLog.setActorRole(actorUser.getRole());
                auditLog.setActorEmail(actorUser.getEmail());
            } else {
                auditLog.setActorEmail(actorEmail);
            }
            auditLog.setActionType("OBITUARY_UNMASK_CONTACT");
            auditLog.setEntityType("Obituary");
            if (obitId != null) {
                auditLog.setEntityId(Long.valueOf(obitId));
            }
            auditLog.setDetails("Admin unmasked contact details. Reason: " + reason);
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            // ignore
        }
        return ResponseEntity.ok(Map.of("message", "Logged successfully"));
    }
}
