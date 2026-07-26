package com.kingstv.controllers.admin;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import com.kingstv.security.Auditable;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Super Admin & Chief Editor user management endpoints.
 * Full CRUD for all user accounts (#1, #23), assign districts (#2, #24),
 * assign categories (#32, #43).
 * Delete of MJ/Institution posts restricted to Super Admin only (#21).
 */
@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private UserDistrictRepository userDistrictRepository;
    @Autowired private UserCategoryRepository userCategoryRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuditLogRepository auditLogRepository;

    /**
     * List all users with optional filters
     */
    @GetMapping
    @RequiresPermission(Permission.USER_READ)
    public ResponseEntity<?> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {

        Page<User> users;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());

        if ((role != null && !role.isEmpty()) || (search != null && !search.isEmpty())) {
            String roleParam = (role != null && !role.isEmpty()) ? role : null;
            String searchParam = (search != null && !search.isEmpty()) ? search : null;
            users = userRepository.searchUsers(roleParam, searchParam, pageRequest);
        } else {
            users = userRepository.findAll(pageRequest);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("users", users.getContent().stream().map(this::toUserResponse).collect(Collectors.toList()));
        response.put("totalElements", users.getTotalElements());
        response.put("totalPages", users.getTotalPages());
        response.put("currentPage", page);
        return ResponseEntity.ok(response);
    }

    /**
     * Get single user details with districts and categories
     */
    @GetMapping("/{id}")
    @RequiresPermission(Permission.USER_READ)
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        Map<String, Object> response = toUserResponse(userOpt.get());
        response.put("districts", userDistrictRepository.findByUserId(id));
        response.put("categories", userCategoryRepository.findByUserId(id));
        return ResponseEntity.ok(response);
    }

    private static final java.util.regex.Pattern EMAIL_PATTERN = 
            java.util.regex.Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final java.util.regex.Pattern PHONE_PATTERN = 
            java.util.regex.Pattern.compile("^\\+?[0-9]{10,15}$");

    /**
     * Create a new user account (#1, #23, #30)
     */
    @PostMapping
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> request) {
        String email = request.get("email") != null ? ((String) request.get("email")).trim().toLowerCase() : null;
        String fullName = request.get("fullName") != null ? ((String) request.get("fullName")).trim() : null;
        String password = (String) request.get("password");
        String role = (String) request.get("role");

        if (email == null || fullName == null || password == null || role == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "email, fullName, password, and role are required"));
        }

        if (fullName.length() < 2) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Full Name must be at least 2 characters long"));
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email address format (e.g. user@example.com)"));
        }

        if (password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must be at least 6 characters long"));
        }

        // Validate role exists
        List<String> validRoles = List.of(
            Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN,
            Role.MOBILE_JOURNALIST, Role.INSTITUTION_LOGIN, Role.READER
        );
        if (!validRoles.contains(role.toUpperCase())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid role: " + role));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered"));
        }

        String callerRole = getCallerRole();
        if (Role.DISTRICT_ADMIN.equals(callerRole)) {
            if (!Role.MOBILE_JOURNALIST.equals(role.toUpperCase())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "District Admin can only create Mobile Journalist accounts"));
            }
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role.toUpperCase());
        user.setProvider("LOCAL");
        user.setIsVerified(true);
        user.setIsActive(true);

        if (request.containsKey("phoneNumber") && request.get("phoneNumber") != null) {
            String rawPhone = ((String) request.get("phoneNumber")).trim().replaceAll("[\\s\\-()]", "");
            if (!rawPhone.isEmpty()) {
                if (!PHONE_PATTERN.matcher(rawPhone).matches()) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Invalid phone number format. Please enter 10 to 15 digits (e.g. 9876543210 or +919876543210)."));
                }
                user.setPhoneNumber(rawPhone);
            }
        }

        if (request.containsKey("websiteUrl"))
            user.setWebsiteUrl((String) request.get("websiteUrl"));
        if (request.containsKey("location"))
            user.setLocation((String) request.get("location"));

        User saved = userRepository.save(user);

        // Log audit
        logAudit("CREATE", "User", saved.getId(), "Created user: " + email + " with role: " + role);

        return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(saved));
    }

    /**
     * Update user account (#1, #23, #31)
     */
    @PutMapping("/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        String callerRole = getCallerRole();
        if (Role.DISTRICT_ADMIN.equals(callerRole)) {
            if (!Role.MOBILE_JOURNALIST.equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "District Admin can only update Mobile Journalist accounts"));
            }
            if (request.containsKey("role") && request.get("role") != null) {
                String newRole = ((String) request.get("role")).toUpperCase();
                if (!Role.MOBILE_JOURNALIST.equals(newRole)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("message", "District Admin cannot change role to anything other than Mobile Journalist"));
                }
            }
        }

        if (request.containsKey("fullName") && request.get("fullName") != null) {
            String cleanName = ((String) request.get("fullName")).trim();
            if (cleanName.length() < 2) {
                return ResponseEntity.badRequest().body(Map.of("message", "Full Name must be at least 2 characters long"));
            }
            user.setFullName(cleanName);
        }

        if (request.containsKey("role") && request.get("role") != null) {
            user.setRole(((String) request.get("role")).toUpperCase());
        }

        if (request.containsKey("isActive") && request.get("isActive") != null) {
            user.setIsActive((Boolean) request.get("isActive"));
        }

        if (request.containsKey("phoneNumber") && request.get("phoneNumber") != null) {
            String rawPhone = ((String) request.get("phoneNumber")).trim().replaceAll("[\\s\\-()]", "");
            if (!rawPhone.isEmpty()) {
                if (!PHONE_PATTERN.matcher(rawPhone).matches()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid phone number format. Please enter 10 to 15 digits (e.g. 9876543210 or +919876543210)."));
                }
                user.setPhoneNumber(rawPhone);
            } else {
                user.setPhoneNumber("");
            }
        }

        if (request.containsKey("websiteUrl")) user.setWebsiteUrl((String) request.get("websiteUrl"));
        if (request.containsKey("location")) user.setLocation((String) request.get("location"));
        
        if (request.containsKey("password") && request.get("password") != null) {
            String pass = (String) request.get("password");
            if (pass.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters long"));
            }
            user.setPassword(passwordEncoder.encode(pass));
        }

        User saved = userRepository.save(user);
        logAudit("UPDATE", "User", saved.getId(), "Updated user: " + user.getEmail());
        return ResponseEntity.ok(toUserResponse(saved));
    }

    /**
     * Suspend user account (#31 - District Admin can suspend MJ)
     */
    @PatchMapping("/{id}/suspend")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN, Role.CHIEF_EDITOR, Role.DISTRICT_ADMIN})
    public ResponseEntity<?> suspendUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        String callerRole = getCallerRole();
        if (Role.DISTRICT_ADMIN.equals(callerRole)) {
            if (!Role.MOBILE_JOURNALIST.equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "District Admin can only suspend Mobile Journalist accounts"));
            }
        }

        user.setIsActive(false);
        userRepository.save(user);
        logAudit("SUSPEND", "User", id, "Suspended user: " + user.getEmail());
        return ResponseEntity.ok(Map.of("message", "User suspended successfully"));
    }

    /**
     * Delete user account - Super Admin only (#21)
     */
    @DeleteMapping("/{id}")
    @RequiresPermission(anyOf = {Role.SUPER_ADMIN})
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        logAudit("DELETE", "User", id, "Deleted user: " + userOpt.get().getEmail());
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    /**
     * Assign districts to a user (#2, #24, #30)
     */
    @PostMapping("/{id}/districts")
    @RequiresPermission(Permission.USER_UPDATE)
    public ResponseEntity<?> assignDistricts(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        @SuppressWarnings("unchecked")
        List<Number> districtIds = (List<Number>) request.get("districtIds");
        if (districtIds == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "districtIds is required"));
        }

        Long callerId = getCallerId();

        // Clear existing and reassign
        List<UserDistrict> existing = userDistrictRepository.findByUserId(id);
        userDistrictRepository.deleteAll(existing);

        List<UserDistrict> newAssignments = new ArrayList<>();
        for (Number dId : districtIds) {
            UserDistrict ud = new UserDistrict();
            ud.setUserId(id);
            ud.setDistrictId(dId.longValue());
            ud.setAssignedBy(callerId);
            newAssignments.add(ud);
        }
        userDistrictRepository.saveAll(newAssignments);

        logAudit("ASSIGN_DISTRICTS", "User", id, "Assigned " + districtIds.size() + " districts");
        return ResponseEntity.ok(Map.of("message", "Districts assigned successfully", "districts", newAssignments));
    }

    /**
     * Assign categories to a user (#32, #43)
     */
    @PostMapping("/{id}/categories")
    @RequiresPermission(Permission.USER_UPDATE)
    public ResponseEntity<?> assignCategories(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        @SuppressWarnings("unchecked")
        List<Number> categoryIds = (List<Number>) request.get("categoryIds");
        if (categoryIds == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "categoryIds is required"));
        }

        Long callerId = getCallerId();

        List<UserCategory> existing = userCategoryRepository.findByUserId(id);
        userCategoryRepository.deleteAll(existing);

        List<UserCategory> newAssignments = new ArrayList<>();
        for (Number cId : categoryIds) {
            UserCategory uc = new UserCategory();
            uc.setUserId(id);
            uc.setCategoryId(cId.longValue());
            uc.setAssignedBy(callerId);
            newAssignments.add(uc);
        }
        userCategoryRepository.saveAll(newAssignments);

        logAudit("ASSIGN_CATEGORIES", "User", id, "Assigned " + categoryIds.size() + " categories");
        return ResponseEntity.ok(Map.of("message", "Categories assigned successfully", "categories", newAssignments));
    }

    // ---- Helper methods ----

    private Map<String, Object> toUserResponse(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getFullName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("provider", user.getProvider());
        map.put("isActive", user.getIsActive());
        map.put("isVerified", user.getIsVerified());
        map.put("profileImage", user.getProfileImage());
        map.put("lastLogin", user.getLastLogin());
        map.put("createdAt", user.getCreatedAt());
        // Note: phoneNumber and websiteUrl are intentionally excluded from
        // public-facing responses (#39, #45). They are only included in admin views.
        map.put("phoneNumber", user.getPhoneNumber());
        map.put("websiteUrl", user.getWebsiteUrl());
        map.put("location", user.getLocation());
        return map;
    }

    private String getCallerRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getAuthorities().stream()
                    .filter(a -> a.getAuthority().startsWith("ROLE_"))
                    .map(a -> a.getAuthority().substring(5))
                    .findFirst().orElse("READER");
        }
        return "READER";
    }

    private Long getCallerId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Long) {
            return (Long) auth.getDetails();
        }
        return null;
    }

    private void logAudit(String action, String entity, Long entityId, String details) {
        try {
            AuditLog log = new AuditLog();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                log.setActorEmail((String) auth.getPrincipal());
                log.setActorRole(getCallerRole());
                if (auth.getDetails() instanceof Long) log.setActorId((Long) auth.getDetails());
            }
            log.setActionType(action);
            log.setEntityType(entity);
            log.setEntityId(entityId);
            log.setDetails(details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Audit log write failed: " + e.getMessage());
        }
    }
}
