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
    @Autowired private HomeLayoutHistoryRepository historyRepository;

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

    @GetMapping("/history")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> getLayoutHistory(@RequestParam(defaultValue = "WEB") String layoutType) {
        return ResponseEntity.ok(historyRepository.findTop10ByLayoutTypeOrderByCreatedAtDesc(layoutType));
    }

    @PostMapping("/rollback/{historyId}")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> rollbackLayout(@PathVariable Long historyId) {
        return historyRepository.findById(historyId)
            .map(history -> {
                String layoutType = history.getLayoutType();
                String dataJson = history.getLayoutDataJson();

                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    List<Map<String, Object>> sections = mapper.readValue(dataJson, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {});

                    List<HomeLayoutConfig> existing = layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc(layoutType);
                    layoutRepository.deleteAll(existing);

                    List<HomeLayoutConfig> restoredList = new ArrayList<>();
                    int order = 1;
                    for (Map<String, Object> s : sections) {
                        HomeLayoutConfig section = new HomeLayoutConfig();
                        section.setSectionKey((String) s.get("sectionKey"));
                        section.setSectionLabel((String) s.get("sectionLabel"));
                        section.setDisplayOrder(order++);
                        section.setIsVisible(s.containsKey("isVisible") ? (Boolean) s.get("isVisible") : true);
                        section.setConfigJson(s.containsKey("configJson") && s.get("configJson") != null ? (String) s.get("configJson") : "{}");
                        section.setLayoutType(layoutType);
                        restoredList.add(layoutRepository.save(section));
                    }
                    return ResponseEntity.ok(restoredList);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to parse history snapshot data"));
                }
            })
            .orElse(ResponseEntity.notFound().build());
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
            if (s.containsKey("id") && s.get("id") != null) {
                Long id = ((Number) s.get("id")).longValue();
                int order = (Integer) s.get("displayOrder");
                layoutRepository.findById(id).ifPresent(section -> {
                    section.setDisplayOrder(order);
                    layoutRepository.save(section);
                });
            }
        }
        return ResponseEntity.ok(Map.of("message", "Layout reordered successfully"));
    }

    @PutMapping("/bulk-save")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> bulkSaveLayout(@RequestBody List<Map<String, Object>> sections) {
        String layoutType = "WEB";
        if (!sections.isEmpty() && sections.get(0).containsKey("layoutType") && sections.get(0).get("layoutType") != null) {
            layoutType = (String) sections.get(0).get("layoutType");
        }

        List<HomeLayoutConfig> existing = layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc(layoutType);
        layoutRepository.deleteAll(existing);

        List<HomeLayoutConfig> savedList = new ArrayList<>();
        int order = 1;
        for (Map<String, Object> s : sections) {
            HomeLayoutConfig section = new HomeLayoutConfig();
            section.setSectionKey((String) s.get("sectionKey"));
            section.setSectionLabel((String) s.get("sectionLabel"));
            section.setDisplayOrder(order++);
            section.setIsVisible(s.containsKey("isVisible") ? (Boolean) s.get("isVisible") : true);
            section.setConfigJson(s.containsKey("configJson") && s.get("configJson") != null ? (String) s.get("configJson") : "{}");
            section.setLayoutType(layoutType);
            savedList.add(layoutRepository.save(section));
        }

        // Save a version history snapshot
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String snapshotJson = mapper.writeValueAsString(savedList);
            String versionLabel = "Layout published on " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a"));
            historyRepository.save(new HomeLayoutHistory(layoutType, versionLabel, snapshotJson, "Super Admin"));
        } catch (Exception e) {
            // Log snapshot save error non-blockingly
        }

        return ResponseEntity.ok(savedList);
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
