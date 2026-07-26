package com.kingstv.controllers;

import com.kingstv.models.NewsletterSubscriber;
import com.kingstv.repository.NewsletterSubscriberRepository;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterSubscriberRepository subscriberRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String mobile = request.get("mobile");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        Optional<NewsletterSubscriber> opt = subscriberRepository.findByEmail(email);
        if (opt.isPresent()) {
            NewsletterSubscriber sub = opt.get();
            if (sub.getStatus().equals("active")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Already subscribed"));
            }
            sub.setStatus("active");
            sub.setUpdatedAt(LocalDateTime.now());
            subscriberRepository.save(sub);
            return ResponseEntity.ok(Map.of("message", "Resubscribed successfully", "subscriberId", sub.getSubscriberId()));
        }

        NewsletterSubscriber newSub = new NewsletterSubscriber();
        newSub.setEmail(email);
        newSub.setName(name);
        newSub.setMobile(mobile);
        newSub.setStatus("active");
        newSub.setVerificationToken(UUID.randomUUID().toString());
        newSub.setVerified(true); // Auto verify for testing purposes
        newSub.setCreatedAt(LocalDateTime.now());
        newSub.setUpdatedAt(LocalDateTime.now());

        NewsletterSubscriber saved = subscriberRepository.save(newSub);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Subscribed successfully", "subscriberId", saved.getSubscriberId()));
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        Optional<NewsletterSubscriber> opt = subscriberRepository.findByEmail(email);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Subscriber not found"));
        }

        NewsletterSubscriber sub = opt.get();
        sub.setStatus("inactive");
        sub.setUpdatedAt(LocalDateTime.now());
        subscriberRepository.save(sub);
        return ResponseEntity.ok(Map.of("message", "Unsubscribed successfully"));
    }

    @GetMapping("/getAll")
    public Page<NewsletterSubscriber> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "subscriberId") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<NewsletterSubscriber> spec = SpecificationBuilder.build(search, status, null, null);
        return subscriberRepository.findAll(spec, pageable);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<NewsletterSubscriber> opt = subscriberRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Subscriber not found"));
        }
        NewsletterSubscriber existing = opt.get();
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        subscriberRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "subscriberId", id, "status", status));
    }
}
