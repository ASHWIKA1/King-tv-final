package com.kingstv.controllers;

import com.kingstv.models.SuccessStory;
import com.kingstv.repository.SuccessStoryRepository;
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
@RequestMapping("/api/v1/stories")
public class SuccessStoryController {

    @Autowired
    private SuccessStoryRepository successStoryRepository;

    // --- KEEP Existing Front-End Endpoint Map ---
    @GetMapping
    public List<SuccessStory> getStories() {
        return successStoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStoryById(@PathVariable Long id) {
        Optional<SuccessStory> storyOpt = successStoryRepository.findById(id);
        if (storyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Story not found"));
        }
        return ResponseEntity.ok(storyOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createStory(@RequestBody SuccessStory story) {
        if (story.getAuthorName() == null || story.getBusinessName() == null || story.getTitle() == null || story.getDetails() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Required fields are missing"));
        }
        if (story.getCreatedAt() == null) {
            story.setCreatedAt(LocalDateTime.now());
        }
        SuccessStory saved = successStoryRepository.save(story);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // --- NEW Standardized API Standard Endpoints ---
    @GetMapping("/getAll")
    public Page<SuccessStory> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<SuccessStory> spec = SpecificationBuilder.build(search, status, null, null);
        return successStoryRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<SuccessStory> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "published", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody SuccessStory entity) {
        return createStory(entity);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody SuccessStory entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<SuccessStory> storyOpt = successStoryRepository.findById(entity.getId());
        if (storyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Story not found"));
        }
        SuccessStory story = storyOpt.get();
        story.setAuthorName(entity.getAuthorName());
        story.setBusinessName(entity.getBusinessName());
        story.setTitle(entity.getTitle());
        story.setDetails(entity.getDetails());
        story.setIsCaseStudy(entity.getIsCaseStudy());
        story.setPdfUrl(entity.getPdfUrl());
        story.setStatus(entity.getStatus());
        
        SuccessStory updated = successStoryRepository.save(story);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<SuccessStory> opt = successStoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Story not found"));
        }
        SuccessStory existing = opt.get();
        existing.setStatus(status);
        successStoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable Long id) {
        Optional<SuccessStory> storyOpt = successStoryRepository.findById(id);
        if (storyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Story not found"));
        }
        SuccessStory existing = storyOpt.get();
        existing.setStatus("deleted"); // Soft delete
        successStoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Story soft-deleted successfully"));
    }
}
