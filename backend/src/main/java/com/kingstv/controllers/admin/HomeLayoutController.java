package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * Home page layout builder (#10, #26) and Mobile App layout (#22).
 * Structured config with ordering controls and delegation flag.
 */
@RestController
@RequestMapping("/api/v1/admin/layout")
public class HomeLayoutController {

    @Autowired private HomeLayoutConfigRepository layoutRepository;

    @GetMapping("/web")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> getWebLayout() {
        return ResponseEntity.ok(layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("WEB"));
    }

    @GetMapping("/mobile")
    @RequiresPermission(Permission.MOBILE_APP_LAYOUT_MANAGE)
    public ResponseEntity<?> getMobileLayout() {
        return ResponseEntity.ok(layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("MOBILE"));
    }

    @PutMapping("/{id}")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> updateSection(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return layoutRepository.findById(id)
            .map(section -> {
                if (request.containsKey("displayOrder")) section.setDisplayOrder((Integer) request.get("displayOrder"));
                if (request.containsKey("isVisible")) section.setIsVisible((Boolean) request.get("isVisible"));
                if (request.containsKey("configJson")) section.setConfigJson((String) request.get("configJson"));
                if (request.containsKey("sectionLabel")) section.setSectionLabel((String) request.get("sectionLabel"));
                if (request.containsKey("delegatedToChiefEditor")) section.setDelegatedToChiefEditor((Boolean) request.get("delegatedToChiefEditor"));
                return ResponseEntity.ok((Object) layoutRepository.save(section));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> addSection(@RequestBody Map<String, Object> request) {
        HomeLayoutConfig section = new HomeLayoutConfig();
        section.setSectionKey((String) request.get("sectionKey"));
        section.setSectionLabel((String) request.get("sectionLabel"));
        section.setDisplayOrder(request.containsKey("displayOrder") ? (Integer) request.get("displayOrder") : 0);
        section.setIsVisible(request.containsKey("isVisible") ? (Boolean) request.get("isVisible") : true);
        section.setConfigJson((String) request.get("configJson"));
        section.setLayoutType((String) request.getOrDefault("layoutType", "WEB"));
        return ResponseEntity.status(HttpStatus.CREATED).body(layoutRepository.save(section));
    }

    @PutMapping("/reorder")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> reorderSections(@RequestBody List<Map<String, Object>> sections) {
        for (Map<String, Object> s : sections) {
            Long id = ((Number) s.get("id")).longValue();
            int order = (Integer) s.get("displayOrder");
            layoutRepository.findById(id).ifPresent(section -> {
                section.setDisplayOrder(order);
                layoutRepository.save(section);
            });
        }
        return ResponseEntity.ok(Map.of("message", "Layout reordered successfully"));
    }

    @DeleteMapping("/{id}")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        return layoutRepository.findById(id)
            .map(section -> {
                layoutRepository.delete(section);
                return ResponseEntity.ok(Map.of("message", "Section deleted successfully"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
