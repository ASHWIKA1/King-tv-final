package com.kingstv.controllers;

import com.kingstv.models.SubCategory;
import com.kingstv.repository.SubCategoryRepository;
import com.kingstv.services.SlugService;
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
@RequestMapping("/api/v1/subcategories")
public class SubCategoryController {

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private SlugService slugService;

    @GetMapping("/getAll")
    public Page<SubCategory> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "subcategoryId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<SubCategory> spec = SpecificationBuilder.build(search, status, categoryId, null);
        return subCategoryRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<SubCategory> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "displayOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        return getAll(search, "active", categoryId, page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody SubCategory entity) {
        if (entity.getName() == null || entity.getNameTa() == null || entity.getCategoryId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "name, nameTa, and categoryId are required"));
        }
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        slugService.generateAndSetSlug(entity);
        SubCategory saved = subCategoryRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody SubCategory entity) {
        if (entity.getSubcategoryId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "subcategoryId is required for update"));
        }
        Optional<SubCategory> opt = subCategoryRepository.findById(entity.getSubcategoryId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "SubCategory not found"));
        }
        SubCategory existing = opt.get();
        existing.setName(entity.getName());
        existing.setNameTa(entity.getNameTa());
        existing.setSlug(entity.getSlug());
        existing.setCategoryId(entity.getCategoryId());
        existing.setDisplayOrder(entity.getDisplayOrder());
        existing.setStatus(entity.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        
        slugService.generateAndSetSlug(existing);
        SubCategory saved = subCategoryRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<SubCategory> opt = subCategoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "SubCategory not found"));
        }
        SubCategory existing = opt.get();
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        subCategoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "subcategoryId", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<SubCategory> opt = subCategoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "SubCategory not found"));
        }
        SubCategory existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        existing.setUpdatedAt(LocalDateTime.now());
        subCategoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "SubCategory soft-deleted successfully"));
    }
}
