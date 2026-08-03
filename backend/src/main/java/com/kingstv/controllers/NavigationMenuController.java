package com.kingstv.controllers;

import com.kingstv.models.NavigationMenu;
import com.kingstv.models.Permission;
import com.kingstv.models.HomeLayoutConfig;
import com.kingstv.repository.NavigationMenuRepository;
import com.kingstv.repository.HomeLayoutConfigRepository;
import com.kingstv.security.RequiresPermission;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class NavigationMenuController {

    @Autowired
    private NavigationMenuRepository menuRepository;

    @Autowired
    private HomeLayoutConfigRepository layoutRepository;

    @GetMapping("/public/menus")
    public ResponseEntity<?> getPublicMenus() {
        // 1. Check if website_navigation section exists and has published navItems
        Optional<HomeLayoutConfig> optSec = layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("WEB")
                .stream()
                .filter(s -> "website_navigation".equals(s.getSectionKey()))
                .findFirst();

        if (optSec.isPresent()) {
            HomeLayoutConfig navSection = optSec.get();
            String currentJson = navSection.getConfigJson();
            if (currentJson != null && !currentJson.trim().isEmpty()) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, Object> config = mapper.readValue(currentJson, Map.class);
                    if (config.containsKey("navItems")) {
                        Object navItemsObj = config.get("navItems");
                        return ResponseEntity.ok(navItemsObj);
                    }
                } catch (Exception e) {
                    // Fallback to table if parsing fails
                }
            }
        }

        // 2. Fallback to active items from the database table (initial or draft state)
        List<NavigationMenu> allActive = menuRepository.findByIsActiveOrderByDisplayOrderAsc(true);
        
        // Group menu items hierarchically
        List<Map<String, Object>> result = new ArrayList<>();
        Map<Long, Map<String, Object>> lookup = new HashMap<>();

        for (NavigationMenu menu : allActive) {
            Map<String, Object> node = new HashMap<>();
            node.put("id", menu.getId());
            node.put("titleTa", menu.getTitleTa());
            node.put("titleEn", menu.getTitleEn());
            node.put("linkUrl", menu.getLinkUrl());
            node.put("displayOrder", menu.getDisplayOrder());
            node.put("parentId", menu.getParentId());
            node.put("subcategories", new ArrayList<>()); // Matching existing frontend key name for children!

            lookup.put(menu.getId(), node);
        }

        for (NavigationMenu menu : allActive) {
            Map<String, Object> node = lookup.get(menu.getId());
            if (menu.getParentId() != null && lookup.containsKey(menu.getParentId())) {
                Map<String, Object> parentNode = lookup.get(menu.getParentId());
                List<Map<String, Object>> subs = (List<Map<String, Object>>) parentNode.get("subcategories");
                subs.add(node);
            } else if (menu.getParentId() == null) {
                result.add(node);
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/menus")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> getAllMenusAdmin() {
        return ResponseEntity.ok(menuRepository.findByOrderByDisplayOrderAsc());
    }

    @PostMapping("/admin/menus")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> createMenuAdmin(@RequestBody NavigationMenu menu) {
        if (menu.getDisplayOrder() == null) {
            menu.setDisplayOrder(0);
        }
        if (menu.getIsActive() == null) {
            menu.setIsActive(true);
        }
        NavigationMenu saved = menuRepository.save(menu);
        publishMenusInternal();
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/admin/menus/{id}")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> updateMenuAdmin(@PathVariable Long id, @RequestBody NavigationMenu updated) {
        return menuRepository.findById(id)
                .map(existing -> {
                    existing.setTitleTa(updated.getTitleTa());
                    existing.setTitleEn(updated.getTitleEn());
                    existing.setLinkUrl(updated.getLinkUrl());
                    existing.setDisplayOrder(updated.getDisplayOrder());
                    existing.setParentId(updated.getParentId());
                    if (updated.getIsActive() != null) {
                        existing.setIsActive(updated.getIsActive());
                    }
                    NavigationMenu saved = menuRepository.save(existing);
                    publishMenusInternal();
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/menus/{id}")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> deleteMenuAdmin(@PathVariable Long id) {
        return menuRepository.findById(id)
                .map(menu -> {
                    menuRepository.delete(menu);
                    // Orphan children: set parentId = null for menus whose parent was deleted
                    List<NavigationMenu> children = menuRepository.findByParentIdAndIsActiveOrderByDisplayOrderAsc(id, true);
                    for (NavigationMenu child : children) {
                        child.setParentId(null);
                        menuRepository.save(child);
                    }
                    publishMenusInternal();
                    return ResponseEntity.ok(Map.of("message", "Menu item deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/testMenus")
    public ResponseEntity<?> testMenus() {
        return ResponseEntity.ok(menuRepository.findAll());
    }

    @PostMapping("/admin/menus/publish")
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> publishMenus() {
        boolean success = publishMenusInternal();
        if (!success) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to publish navigation menu"));
        }
        return ResponseEntity.ok(Map.of("message", "Navigation menu published successfully to layout config"));
    }

    public boolean publishMenusInternal() {
        try {
            List<NavigationMenu> allActive = menuRepository.findByIsActiveOrderByDisplayOrderAsc(true);
            List<Map<String, Object>> hierarchicalMenus = new ArrayList<>();
            Map<Long, Map<String, Object>> lookup = new HashMap<>();

            for (NavigationMenu menu : allActive) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", menu.getId());
                node.put("titleTa", menu.getTitleTa());
                node.put("titleEn", menu.getTitleEn());
                node.put("linkUrl", menu.getLinkUrl());
                node.put("displayOrder", menu.getDisplayOrder());
                node.put("parentId", menu.getParentId());
                node.put("isActive", menu.getIsActive());
                node.put("subcategories", new ArrayList<>());

                lookup.put(menu.getId(), node);
            }

            for (NavigationMenu menu : allActive) {
                Map<String, Object> node = lookup.get(menu.getId());
                if (menu.getParentId() != null && lookup.containsKey(menu.getParentId())) {
                    Map<String, Object> parentNode = lookup.get(menu.getParentId());
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> subs = (List<Map<String, Object>>) parentNode.get("subcategories");
                    subs.add(node);
                } else if (menu.getParentId() == null) {
                    hierarchicalMenus.add(node);
                }
            }

            Optional<HomeLayoutConfig> optSec = layoutRepository.findByLayoutTypeOrderByDisplayOrderAsc("WEB")
                    .stream()
                    .filter(s -> "website_navigation".equals(s.getSectionKey()))
                    .findFirst();

            HomeLayoutConfig navSection;
            if (optSec.isPresent()) {
                navSection = optSec.get();
            } else {
                navSection = new HomeLayoutConfig();
                navSection.setSectionKey("website_navigation");
                navSection.setSectionLabel("⚡ Website Navigation");
                navSection.setLayoutType("WEB");
                navSection.setDisplayOrder(0);
                navSection.setIsVisible(true);
            }

            Map<String, Object> config = new HashMap<>();
            String currentJson = navSection.getConfigJson();
            if (currentJson != null && !currentJson.trim().isEmpty()) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    config = mapper.readValue(currentJson, Map.class);
                } catch (Exception e) { }
            }

            config.put("navItems", hierarchicalMenus);

            ObjectMapper mapper = new ObjectMapper();
            String updatedJson = mapper.writeValueAsString(config);
            navSection.setConfigJson(updatedJson);
            layoutRepository.save(navSection);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

