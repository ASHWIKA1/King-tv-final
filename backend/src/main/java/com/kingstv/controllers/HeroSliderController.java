package com.kingstv.controllers;

import com.kingstv.models.HeroSlider;
import com.kingstv.repository.HeroSliderRepository;
import com.kingstv.models.Role;
import com.kingstv.security.RequiresPermission;
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
import java.util.List;

@RestController
@RequestMapping("/api/v1/hero-slider")
public class HeroSliderController {

    @Autowired
    private HeroSliderRepository heroSliderRepository;

    @GetMapping({"", "/", "/getAll"})
    public Page<HeroSlider> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "displayOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<HeroSlider> spec = SpecificationBuilder.build(search, status, null, null);
        return heroSliderRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public ResponseEntity<?> getAllWeb() {
        List<HeroSlider> items = heroSliderRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder"));
        List<HeroSlider> activeItems = items.stream()
            .filter(item -> "Active".equalsIgnoreCase(item.getStatus()) 
                || ("Scheduled".equalsIgnoreCase(item.getStatus()) 
                    && (item.getScheduleDate() == null || item.getScheduleDate().isBefore(LocalDateTime.now()))
                    && (item.getExpiryDate() == null || item.getExpiryDate().isAfter(LocalDateTime.now()))))
            .toList();
        return ResponseEntity.ok(activeItems);
    }

    @PostMapping({"/saveUpdate", "", "/"})
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.SUB_EDITOR})
    public ResponseEntity<?> save(@RequestBody HeroSlider entity) {
        if (entity.getHeadline() == null || entity.getHeadline().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Headline is required"));
        }
        
        if (entity.getDisplayOrder() == null) {
            entity.setDisplayOrder(1);
        }
        
        if (entity.getStatus() == null || entity.getStatus().isEmpty()) {
            entity.setStatus("Active");
        }

        if (entity.getId() != null) {
            Optional<HeroSlider> existingOpt = heroSliderRepository.findById(entity.getId());
            if (existingOpt.isPresent()) {
                HeroSlider existing = existingOpt.get();
                existing.setImageUrl(entity.getImageUrl());
                existing.setHeadline(entity.getHeadline());
                existing.setCategoryTag(entity.getCategoryTag());
                existing.setDescription(entity.getDescription());
                existing.setButtonText(entity.getButtonText());
                existing.setButtonLink(entity.getButtonLink());
                existing.setDisplayOrder(entity.getDisplayOrder());
                existing.setStatus(entity.getStatus());
                existing.setScheduleDate(entity.getScheduleDate());
                existing.setExpiryDate(entity.getExpiryDate());
                existing.setUpdatedAt(LocalDateTime.now());
                HeroSlider saved = heroSliderRepository.save(existing);
                return ResponseEntity.ok(saved);
            }
        }
        
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedAt(LocalDateTime.now());
        HeroSlider saved = heroSliderRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping({"/saveUpdate", "", "/"})
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.SUB_EDITOR})
    public ResponseEntity<?> update(@RequestBody HeroSlider entity) {
        return save(entity);
    }

    @DeleteMapping("/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.SUB_EDITOR})
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<HeroSlider> existingOpt = heroSliderRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        heroSliderRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Slide deleted successfully"));
    }
}
