package com.kingstv.controllers;

import com.kingstv.models.ContactRequest;
import com.kingstv.repository.ContactRequestRepository;
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
@RequestMapping("/api/v1/contact-us")
public class ContactRequestController {

    @Autowired
    private ContactRequestRepository contactRequestRepository;

    @GetMapping("/getAll")
    public Page<ContactRequest> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<ContactRequest> spec = SpecificationBuilder.build(search, status, null, null);
        return contactRequestRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<ContactRequest> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "new", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody ContactRequest entity) {
        if (entity.getName() == null || entity.getEmail() == null || entity.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "name, email, and message are required"));
        }
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        ContactRequest saved = contactRequestRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody ContactRequest entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<ContactRequest> opt = contactRequestRepository.findById(entity.getId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Contact request not found"));
        }
        ContactRequest existing = opt.get();
        existing.setName(entity.getName());
        existing.setEmail(entity.getEmail());
        existing.setPhone(entity.getPhone());
        existing.setSubject(entity.getSubject());
        existing.setMessage(entity.getMessage());
        existing.setStatus(entity.getStatus());
        
        ContactRequest saved = contactRequestRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<ContactRequest> opt = contactRequestRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Contact request not found"));
        }
        ContactRequest existing = opt.get();
        existing.setStatus(status);
        contactRequestRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<ContactRequest> opt = contactRequestRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Contact request not found"));
        }
        ContactRequest existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        contactRequestRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Contact request soft-deleted successfully"));
    }
}
