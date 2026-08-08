package com.kingstv.controllers;

import com.kingstv.models.WebStory;
import com.kingstv.repository.WebStoryRepository;
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
@RequestMapping("/api/v1/web-stories")
public class WebStoryController {

    @Autowired
    private WebStoryRepository webStoryRepository;

    @GetMapping("/getAll")
    public Page<WebStory> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<WebStory> spec = SpecificationBuilder.build(search, status, categoryId, null);
        return webStoryRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<WebStory> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        return getAll(search, "published", categoryId, page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody WebStory story) {
        if (story.getTitleTa() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title (Tamil) is required"));
        }
        if (story.getPublishedAt() == null) {
            story.setPublishedAt(LocalDateTime.now());
        }
        WebStory saved = webStoryRepository.save(story);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody WebStory story) {
        if (story.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<WebStory> existingOpt = webStoryRepository.findById(story.getId());
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Web Story not found"));
        }

        WebStory existing = existingOpt.get();
        existing.setTitleTa(story.getTitleTa());
        existing.setTitleEn(story.getTitleEn());
        existing.setCategoryId(story.getCategoryId());
        existing.setCat(story.getCat());
        existing.setBadge(story.getBadge());
        existing.setBackgroundGradient(story.getBackgroundGradient());
        existing.setViewsCount(story.getViewsCount());
        existing.setStatus(story.getStatus());
        existing.setSlidesJson(story.getSlidesJson());
        existing.setPublishedAt(story.getPublishedAt());

        WebStory updated = webStoryRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();

        Optional<WebStory> opt = webStoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Web Story not found"));
        }
        WebStory existing = opt.get();
        existing.setStatus(status);
        webStoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable Long id) {
        Optional<WebStory> opt = webStoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Web Story not found"));
        }
        WebStory existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        webStoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Web Story soft-deleted successfully"));
    }
}
