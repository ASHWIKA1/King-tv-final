package com.kingstv.controllers;

import com.kingstv.models.PdfContent;
import com.kingstv.repository.PdfRepository;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/pdfs")
public class PdfController {

    @Autowired
    private PdfRepository pdfRepository;

    // --- KEEP Existing Front-End Endpoint Map ---
    @GetMapping
    public List<PdfContent> getPdfs() {
        return pdfRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPdfById(@PathVariable Long id) {
        Optional<PdfContent> pdfOpt = pdfRepository.findById(id);
        if (pdfOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "PDF not found"));
        }
        return ResponseEntity.ok(pdfOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createPdf(@RequestBody PdfContent pdf) {
        if (pdf.getTitle() == null || pdf.getTitleTa() == null || pdf.getPdfUrl() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title, Tamil Title, and PDF URL are required"));
        }
        if (pdf.getPublishDate() == null) {
            pdf.setPublishDate(LocalDateTime.now());
        }
        PdfContent saved = pdfRepository.save(pdf);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // --- NEW Standardized API Standard Endpoints ---
    @GetMapping("/getAll")
    public Page<PdfContent> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pdfId") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<PdfContent> spec = SpecificationBuilder.build(search, status, null, null);
        return pdfRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<PdfContent> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pdfId") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "published", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody PdfContent entity) {
        return createPdf(entity);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody PdfContent entity) {
        if (entity.getPdfId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "pdfId is required for update"));
        }
        Optional<PdfContent> pdfOpt = pdfRepository.findById(entity.getPdfId());
        if (pdfOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "PDF not found"));
        }
        PdfContent pdf = pdfOpt.get();
        pdf.setTitle(entity.getTitle());
        pdf.setTitleTa(entity.getTitleTa());
        pdf.setPdfUrl(entity.getPdfUrl());
        pdf.setFileSize(entity.getFileSize());
        
        PdfContent updated = pdfRepository.save(pdf);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<PdfContent> opt = pdfRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "PDF not found"));
        }
        PdfContent existing = opt.get();
        existing.setStatus(status);
        pdfRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePdf(@PathVariable Long id) {
        Optional<PdfContent> pdfOpt = pdfRepository.findById(id);
        if (pdfOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "PDF not found"));
        }
        PdfContent existing = pdfOpt.get();
        existing.setStatus("deleted"); // Soft delete
        pdfRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "PDF soft-deleted successfully"));
    }
}
