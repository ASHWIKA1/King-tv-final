package com.kingstv.controllers;

import com.kingstv.models.Advertisement;
import com.kingstv.repository.AdvertisementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kingstv.security.RequiresPermission;
import com.kingstv.models.Role;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/advertisements")
public class AdvertisementController {

    @Autowired
    private AdvertisementRepository advertisementRepository;

    @GetMapping("/active")
    public ResponseEntity<List<Advertisement>> getActiveAdvertisements() {
        return ResponseEntity.ok(advertisementRepository.findActiveAdvertisements(LocalDateTime.now()));
    }

    @PostMapping("/{id}/impression")
    public ResponseEntity<?> logImpression(@PathVariable Long id) {
        advertisementRepository.incrementImpressions(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/click")
    public ResponseEntity<?> logClick(@PathVariable Long id) {
        advertisementRepository.incrementClicks(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Advertisement>> getAllAdvertisements() {
        return ResponseEntity.ok(advertisementRepository.findAll());
    }

    @PostMapping
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR})
    public ResponseEntity<Advertisement> createAdvertisement(@Valid @RequestBody Advertisement advertisement) {
        return ResponseEntity.ok(advertisementRepository.save(advertisement));
    }

    @PutMapping("/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR})
    public ResponseEntity<?> updateAdvertisement(@PathVariable Long id, @Valid @RequestBody Advertisement advertisement) {
        Optional<Advertisement> existing = advertisementRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        advertisement.setId(id);
        return ResponseEntity.ok(advertisementRepository.save(advertisement));
    }

    @DeleteMapping("/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR})
    public ResponseEntity<?> deleteAdvertisement(@PathVariable Long id) {
        advertisementRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
