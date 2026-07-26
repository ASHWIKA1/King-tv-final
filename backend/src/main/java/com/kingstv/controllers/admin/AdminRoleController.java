package com.kingstv.controllers.admin;

import com.kingstv.models.Permission;
import com.kingstv.models.Role;
import com.kingstv.repository.PermissionRepository;
import com.kingstv.repository.RoleRepository;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Super Admin Role and Permission Management endpoints.
 */
@RestController
@RequestMapping("/api/v1/admin/roles")
public class AdminRoleController {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    /**
     * List all roles with their permissions
     */
    @GetMapping
    @RequiresPermission(anyOf = {"SUPER_ADMIN"})
    public ResponseEntity<?> listRoles() {
        List<Role> roles = roleRepository.findAll();
        List<Map<String, Object>> response = roles.stream().map(this::toRoleResponse).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("roles", response));
    }

    /**
     * Get single role details
     */
    @GetMapping("/{id}")
    @RequiresPermission(anyOf = {"SUPER_ADMIN"})
    public ResponseEntity<?> getRole(@PathVariable Long id) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Role not found"));
        }
        return ResponseEntity.ok(toRoleResponse(roleOpt.get()));
    }

    /**
     * Create a new custom role
     */
    @PostMapping
    @RequiresPermission(anyOf = {"SUPER_ADMIN"})
    public ResponseEntity<?> createRole(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        List<String> permissionNames = (List<String>) request.get("permissions");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role name is required"));
        }

        // Convert to standard format, no spaces
        String formattedName = name.trim().toUpperCase().replace(" ", "_");

        if (roleRepository.existsByName(formattedName)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role already exists"));
        }

        Role newRole = new Role(formattedName, description);

        if (permissionNames != null && !permissionNames.isEmpty()) {
            Set<Permission> assignedPermissions = new HashSet<>();
            for (String permName : permissionNames) {
                permissionRepository.findByName(permName).ifPresent(assignedPermissions::add);
            }
            newRole.setPermissions(assignedPermissions);
        }

        Role savedRole = roleRepository.save(newRole);
        return ResponseEntity.ok(toRoleResponse(savedRole));
    }

    /**
     * Update an existing role
     */
    @PutMapping("/{id}")
    @RequiresPermission(anyOf = {"SUPER_ADMIN"})
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Role not found"));
        }

        Role role = roleOpt.get();
        
        // Prevent editing SUPER_ADMIN permissions or name
        if (Role.SUPER_ADMIN.equals(role.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Cannot modify SUPER_ADMIN role"));
        }

        String description = (String) request.get("description");
        if (description != null) {
            role.setDescription(description);
        }

        List<String> permissionNames = (List<String>) request.get("permissions");
        if (permissionNames != null) {
            Set<Permission> assignedPermissions = new HashSet<>();
            for (String permName : permissionNames) {
                permissionRepository.findByName(permName).ifPresent(assignedPermissions::add);
            }
            role.setPermissions(assignedPermissions);
        }

        Role updatedRole = roleRepository.save(role);
        return ResponseEntity.ok(toRoleResponse(updatedRole));
    }

    /**
     * Delete a custom role (SUPER_ADMIN role is protected)
     */
    @DeleteMapping("/{id}")
    @RequiresPermission(anyOf = {"SUPER_ADMIN"})
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Role not found"));
        }
        Role role = roleOpt.get();
        // Protect system-critical roles from deletion
        List<String> protectedRoles = List.of("SUPER_ADMIN", "CHIEF_EDITOR", "MOBILE_JOURNALIST");
        if (protectedRoles.contains(role.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Cannot delete system-critical role: " + role.getName()));
        }
        roleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Role deleted successfully"));
    }

    @GetMapping("/permissions")
    @RequiresPermission(anyOf = {"SUPER_ADMIN"})
    /**
     * List all available permissions grouped by module
     */
    public ResponseEntity<?> listPermissions() {
        List<Permission> permissions = permissionRepository.findAll();
        
        // Group by module
        Map<String, List<Map<String, Object>>> groupedPermissions = new HashMap<>();
        
        for (Permission p : permissions) {
            String module = p.getModule() != null ? p.getModule() : "Other";
            
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("id", p.getId());
            pMap.put("name", p.getName());
            pMap.put("description", p.getDescription());
            pMap.put("module", p.getModule());
            
            groupedPermissions.computeIfAbsent(module, k -> new ArrayList<>()).add(pMap);
        }
        
        return ResponseEntity.ok(Map.of("modules", groupedPermissions));
    }

    private Map<String, Object> toRoleResponse(Role role) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", role.getId());
        map.put("name", role.getName());
        map.put("description", role.getDescription());
        
        List<Map<String, Object>> perms = role.getPermissions().stream().map(p -> {
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("id", p.getId());
            pMap.put("name", p.getName());
            pMap.put("description", p.getDescription());
            pMap.put("module", p.getModule());
            return pMap;
        }).collect(Collectors.toList());
        
        map.put("permissions", perms);
        return map;
    }
}
