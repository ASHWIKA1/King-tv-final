package com.kingstv.controllers;

import com.kingstv.models.ReportNews;
import com.kingstv.repository.ReportNewsRepository;
import com.kingstv.services.EmailService;
import com.kingstv.security.RequiresPermission;
import com.kingstv.models.Role;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.kingstv.repository.SpecificationBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/report-news")
public class ReportNewsController {

    @Autowired
    private ReportNewsRepository reportNewsRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/getAll")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public Page<ReportNews> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<ReportNews> spec = SpecificationBuilder.build(search, status, null, null);
        return reportNewsRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<ReportNews> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "approved", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@Valid @RequestBody ReportNews entity) {
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        ReportNews saved = reportNewsRepository.save(entity);
        try {
            String emailText = String.format(
                "A new crowd news report has been submitted.\n\n" +
                "Reporter: %s\n" +
                "Contact: %s\n" +
                "Title: %s\n" +
                "Details: %s\n" +
                "Status: Pending Review\n",
                saved.getReporterName(),
                saved.getReporterContact(),
                saved.getTitle(),
                saved.getDetails()
            );
            emailService.sendSimpleMessage("editor@kingstv.com", "New Crowd News Report: " + saved.getTitle(), emailText);
        } catch (Exception e) {
            System.err.println("Failed to trigger email notification for news report submission: " + e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public ResponseEntity<?> update(@Valid @RequestBody ReportNews entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<ReportNews> opt = reportNewsRepository.findById(entity.getId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Report not found"));
        }
        ReportNews existing = opt.get();
        existing.setReporterName(entity.getReporterName());
        existing.setReporterContact(entity.getReporterContact());
        existing.setTitle(entity.getTitle());
        existing.setDetails(entity.getDetails());
        existing.setImageUrl(entity.getImageUrl());
        existing.setVideoUrl(entity.getVideoUrl());
        existing.setStatus(entity.getStatus());
        
        ReportNews saved = reportNewsRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/changeStatus")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<ReportNews> opt = reportNewsRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Report not found"));
        }
        ReportNews existing = opt.get();
        existing.setStatus(status);
        reportNewsRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<ReportNews> opt = reportNewsRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Report not found"));
        }
        ReportNews existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        reportNewsRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Report soft-deleted successfully"));
    }
}
