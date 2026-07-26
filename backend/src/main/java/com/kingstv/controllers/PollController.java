package com.kingstv.controllers;

import com.kingstv.models.Poll;
import com.kingstv.repository.PollRepository;
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
@RequestMapping("/api/v1/polls")
public class PollController {

    @Autowired
    private PollRepository pollRepository;

    @GetMapping("/getAll")
    public Page<Poll> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Poll> spec = SpecificationBuilder.build(search, status, null, null);
        return pollRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<Poll> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "active", page, size, sortBy, direction);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody Poll entity) {
        if (entity.getQuestion() == null || entity.getQuestionTa() == null || entity.getOption1() == null || entity.getOption2() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Question, Question (Tamil), Option 1, and Option 2 are required"));
        }
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        Poll saved = pollRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody Poll entity) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<Poll> opt = pollRepository.findById(entity.getId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Poll not found"));
        }
        Poll existing = opt.get();
        existing.setQuestion(entity.getQuestion());
        existing.setQuestionTa(entity.getQuestionTa());
        existing.setOption1(entity.getOption1());
        existing.setOption1Ta(entity.getOption1Ta());
        existing.setOption1Votes(entity.getOption1Votes());
        existing.setOption2(entity.getOption2());
        existing.setOption2Ta(entity.getOption2Ta());
        existing.setOption2Votes(entity.getOption2Votes());
        existing.setOption3(entity.getOption3());
        existing.setOption3Ta(entity.getOption3Ta());
        existing.setOption3Votes(entity.getOption3Votes());
        existing.setStatus(entity.getStatus());
        existing.setExpiresAt(entity.getExpiresAt());
        existing.setUpdatedAt(LocalDateTime.now());
        
        Poll saved = pollRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<?> vote(@PathVariable Long id, @RequestParam int optionNum) {
        Optional<Poll> opt = pollRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Poll not found"));
        }
        Poll poll = opt.get();
        if ("closed".equals(poll.getStatus()) || (poll.getExpiresAt() != null && poll.getExpiresAt().isBefore(LocalDateTime.now()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Poll is closed"));
        }
        if (optionNum == 1) {
            poll.setOption1Votes(poll.getOption1Votes() + 1);
        } else if (optionNum == 2) {
            poll.setOption2Votes(poll.getOption2Votes() + 1);
        } else if (optionNum == 3) {
            poll.setOption3Votes(poll.getOption3Votes() + 1);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid option number"));
        }
        poll.setUpdatedAt(LocalDateTime.now());
        Poll saved = pollRepository.save(poll);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<Poll> opt = pollRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Poll not found"));
        }
        Poll existing = opt.get();
        existing.setStatus(status);
        existing.setUpdatedAt(LocalDateTime.now());
        pollRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Poll> opt = pollRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Poll not found"));
        }
        Poll existing = opt.get();
        existing.setStatus("deleted"); // Soft delete
        existing.setUpdatedAt(LocalDateTime.now());
        pollRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Poll soft-deleted successfully"));
    }
}
