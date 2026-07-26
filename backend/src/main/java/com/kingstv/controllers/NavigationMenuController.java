package com.kingstv.controllers;

import com.kingstv.models.NavigationMenu;
import com.kingstv.models.Permission;
import com.kingstv.repository.NavigationMenuRepository;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class NavigationMenuController {

    @Autowired
    private NavigationMenuRepository menuRepository;

    @GetMapping("/public/menus")
    public ResponseEntity<?> getPublicMenus() {
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
        return ResponseEntity.status(HttpStatus.CREATED).body(menuRepository.save(menu));
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
                    return ResponseEntity.ok(menuRepository.save(existing));
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
                    return ResponseEntity.ok(Map.of("message", "Menu item deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
