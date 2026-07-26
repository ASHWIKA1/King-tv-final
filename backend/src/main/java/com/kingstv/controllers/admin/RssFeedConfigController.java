package com.kingstv.controllers.admin;

import com.kingstv.models.RssFeedConfig;
import com.kingstv.repository.RssFeedConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/rss-config")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
public class RssFeedConfigController {

    @Autowired
    private RssFeedConfigRepository repository;

    @GetMapping
    public List<RssFeedConfig> getAllConfigs() {
        return repository.findAll();
    }

    @PostMapping
    public RssFeedConfig createConfig(@RequestBody RssFeedConfig config) {
        return repository.save(config);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RssFeedConfig> updateConfig(@PathVariable Long id, @RequestBody RssFeedConfig updated) {
        return repository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setFeedUrl(updated.getFeedUrl());
            existing.setCategoryId(updated.getCategoryId());
            existing.setLanguage(updated.getLanguage());
            existing.setAutoImageDownload(updated.getAutoImageDownload());
            existing.setAutoPublish(updated.getAutoPublish());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfig(@PathVariable Long id) {
        if(repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
