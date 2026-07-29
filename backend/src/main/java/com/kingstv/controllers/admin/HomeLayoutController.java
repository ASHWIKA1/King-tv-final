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

    @GetMapping("/public/home-layout")
    public ResponseEntity<?> getPublicLayout() {
        return ResponseEntity.ok(layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("WEB"));
    }

    @GetMapping("/web")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> getWebLayout() {
        return ResponseEntity.ok(layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("WEB"));
    }

    @PutMapping("/bulk-save")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> bulkSaveLayout(@RequestBody List<Map<String, Object>> sections) {
        List<HomeLayoutConfig> result = new ArrayList<>();
        for (int i = 0; i < sections.size(); i++) {
            Map<String, Object> req = sections.get(i);
            HomeLayoutConfig section = null;
            if (req.containsKey("id") && req.get("id") != null) {
                try {
                    Long id = ((Number) req.get("id")).longValue();
                    section = layoutRepository.findById(id).orElse(null);
                } catch (Exception e) {}
            }
            if (section == null) {
                section = new HomeLayoutConfig();
            }
            if (req.containsKey("sectionKey")) section.setSectionKey((String) req.get("sectionKey"));
            if (req.containsKey("sectionLabel")) section.setSectionLabel((String) req.get("sectionLabel"));
            section.setDisplayOrder(i + 1);
            if (req.containsKey("isVisible")) section.setIsVisible((Boolean) req.get("isVisible"));
            if (req.containsKey("configJson")) {
                Object cfg = req.get("configJson");
                section.setConfigJson(cfg instanceof String ? (String) cfg : cfg.toString());
            }
            section.setLayoutType("WEB");
            result.add(layoutRepository.save(section));
        }
        return ResponseEntity.ok(result);
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
