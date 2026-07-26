package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.services.ClassifiedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import java.util.*;

@RestController
@RequestMapping({"/api/classifieds", "/api/v1/classifieds"})
public class ClassifiedController {

    @Autowired
    private ClassifiedService classifiedService;

    @Autowired
    private com.kingstv.repository.ClassifiedRepository classifiedRepository;

    @Autowired
    private com.kingstv.repository.ClassifiedReportRepository classifiedReportRepository;

    @GetMapping
    public ResponseEntity<?> getClassifieds(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) Boolean negotiable,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Page<ClassifiedListing> ads = classifiedService.getClassifieds(
            search, categoryId, subcategoryId, districtId, priceMin, priceMax, condition, negotiable, sort, PageRequest.of(page, size)
        );
        return ResponseEntity.ok(ads.getContent());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchAds(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<ClassifiedListing> ads = classifiedService.getClassifieds(query, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(ads.getContent());
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterAds(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<ClassifiedListing> ads = classifiedService.getClassifieds(null, categoryId, subcategoryId, districtId, priceMin, priceMax, null, null, sort, PageRequest.of(page, size));
        return ResponseEntity.ok(ads.getContent());
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeatured(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<ClassifiedListing> ads = classifiedService.getClassifieds(null, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(ads.getContent());
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatest(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<ClassifiedListing> ads = classifiedService.getClassifieds(null, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(ads.getContent());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(classifiedService.getCategories());
    }

    @GetMapping("/subcategories")
    public ResponseEntity<?> getSubcategories(@RequestParam Long categoryId) {
        return ResponseEntity.ok(classifiedService.getSubcategories(categoryId));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        try {
            Path uploadPath = Paths.get("uploads/classifieds");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = "ad_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(Map.of("url", "/uploads/classifieds/" + fileName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload file: " + e.getMessage()));
        }
    }

    // Dynamic path variable mappings at the bottom
    @GetMapping("/{id}")
    public ResponseEntity<?> getClassifiedById(@PathVariable Long id) {
        Optional<ClassifiedListing> adOpt = classifiedService.getClassifiedById(id);
        if (adOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Listing not found"));
        }
        
        ClassifiedListing listing = adOpt.get();
        List<ClassifiedImage> images = classifiedService.getImages(id);
        
        Map<String, Object> details = new HashMap<>();
        details.put("listing", listing);
        details.put("images", images);
        
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<?> createClassified(@RequestBody ClassifiedListing classified, @RequestParam(required = false) List<String> images) {
        if (classified.getTitle() == null || classified.getDescription() == null || classified.getPrice() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title, description, and price are required."));
        }
        ClassifiedListing saved = classifiedService.createClassified(classified, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClassified(@PathVariable Long id, @RequestBody ClassifiedListing ad) {
        try {
            ClassifiedListing updated = classifiedService.updateClassified(id, ad);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClassified(@PathVariable Long id) {
        try {
            classifiedService.deleteClassified(id);
            return ResponseEntity.ok(Map.of("message", "Listing deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<?> saveAd(@PathVariable Long id, @RequestParam Long userId) {
        try {
            ClassifiedFavourite fav = classifiedService.saveAd(id, userId);
            return ResponseEntity.ok(fav);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<?> unsaveAd(@PathVariable Long id, @RequestParam Long userId) {
        try {
            classifiedService.unsaveAd(id, userId);
            return ResponseEntity.ok(Map.of("message", "Listing unsaved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareAd(@PathVariable Long id, @RequestParam String platform) {
        classifiedService.logShare(id, platform);
        return ResponseEntity.ok(Map.of("message", "Share logged successfully"));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportAd(
            @PathVariable Long id,
            @RequestParam String reporterName,
            @RequestParam String reason) {
        classifiedService.logReport(id, reporterName, reason);
        return ResponseEntity.ok(Map.of("message", "Report logged successfully"));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> logView(@PathVariable Long id, HttpServletRequest request) {
        classifiedService.logView(id, request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.ok(Map.of("message", "View logged successfully"));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<?> renewAd(@PathVariable Long id) {
        try {
            classifiedService.renewAd(id);
            return ResponseEntity.ok(Map.of("message", "Listing renewed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/boost")
    public ResponseEntity<?> boostAd(@PathVariable Long id) {
        try {
            classifiedService.boostAd(id);
            return ResponseEntity.ok(Map.of("message", "Listing boosted to featured successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    // --- Admin Moderation Endpoints ---
    @GetMapping("/admin/reports")
    public ResponseEntity<?> getReports() {
        List<ClassifiedReport> reports = classifiedReportRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        for (ClassifiedReport r : reports) {
            Optional<ClassifiedListing> listOpt = classifiedRepository.findById(r.getClassifiedId());
            Map<String, Object> map = new HashMap<>();
            map.put("report", r);
            map.put("classified", listOpt.orElse(null));
            responses.add(map);
        }
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/admin/reports/{id}")
    public ResponseEntity<?> dismissReport(@PathVariable Long id) {
        if (!classifiedReportRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Report not found"));
        }
        classifiedReportRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Report dismissed"));
    }
}
