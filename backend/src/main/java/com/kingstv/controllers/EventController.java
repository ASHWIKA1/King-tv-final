package com.kingstv.controllers;

import com.kingstv.models.Event;
import com.kingstv.repository.EventRepository;
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
@RequestMapping("/api/v1/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/getAll")
    public Page<Event> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Event> spec = SpecificationBuilder.build(search, status, null, null);
        return eventRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<Event> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "eventDate") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        return getAll(search, "upcoming", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody Event entity) {
        if (entity.getTitle() == null || entity.getTitleTa() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title and Title (Tamil) are required"));
        }
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        Event saved = eventRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody Event entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<Event> opt = eventRepository.findById(entity.getId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Event not found"));
        }
        Event existing = opt.get();
        existing.setTitle(entity.getTitle());
        existing.setTitleTa(entity.getTitleTa());
        existing.setDescription(entity.getDescription());
        existing.setDescriptionTa(entity.getDescriptionTa());
        existing.setEventDate(entity.getEventDate());
        existing.setLocation(entity.getLocation());
        existing.setImageUrl(entity.getImageUrl());
        existing.setStatus(entity.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        
        Event saved = eventRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<Event> opt = eventRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Event not found"));
        }
        Event existing = opt.get();
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        eventRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Event> opt = eventRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Event not found"));
        }
        Event existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        existing.setUpdatedAt(LocalDateTime.now());
        eventRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Event soft-deleted successfully"));
    }
}
