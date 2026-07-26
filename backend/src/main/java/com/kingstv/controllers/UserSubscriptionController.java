package com.kingstv.controllers;

import com.kingstv.models.UserSubscription;
import com.kingstv.repository.UserSubscriptionRepository;
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
@RequestMapping("/api/v1/subscriptions")
public class UserSubscriptionController {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @GetMapping("/getAll")
    public Page<UserSubscription> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<UserSubscription> spec = SpecificationBuilder.build(search, status, null, null);
        return subscriptionRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<UserSubscription> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "active", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody UserSubscription entity) {
        if (entity.getUserId() == null || entity.getPlanName() == null || entity.getPrice() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId, planName, and price are required"));
        }
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        if (entity.getEndDate() == null) {
            entity.setEndDate(LocalDateTime.now().plusMonths(1)); // Default 1 month subscription
        }
        entity.setUpdatedAt(LocalDateTime.now());
        UserSubscription saved = subscriptionRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody UserSubscription entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<UserSubscription> opt = subscriptionRepository.findById(entity.getId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Subscription not found"));
        }
        UserSubscription existing = opt.get();
        existing.setUserId(entity.getUserId());
        existing.setPlanName(entity.getPlanName());
        existing.setPrice(entity.getPrice());
        existing.setStatus(entity.getStatus());
        existing.setStartDate(entity.getStartDate());
        existing.setEndDate(entity.getEndDate());
        existing.setUpdatedAt(LocalDateTime.now());
        
        UserSubscription saved = subscriptionRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<UserSubscription> opt = subscriptionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Subscription not found"));
        }
        UserSubscription existing = opt.get();
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<UserSubscription> opt = subscriptionRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Subscription not found"));
        }
        UserSubscription existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        existing.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Subscription soft-deleted successfully"));
    }
}
