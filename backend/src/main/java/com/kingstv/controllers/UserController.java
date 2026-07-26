package com.kingstv.controllers;

import com.kingstv.models.User;
import com.kingstv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.kingstv.services.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/api/v1/user", "/api/user"})
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private StorageService storageService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "fullName", user.getFullName(),
            "email", user.getEmail(),
            "provider", user.getProvider(),
            "role", user.getRole(),
            "profileImage", user.getProfileImage() != null ? user.getProfileImage() : "",
            "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString().substring(0, 10) : LocalDateTime.now().toString().substring(0, 10),
            "lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString().substring(0, 10) : LocalDateTime.now().toString().substring(0, 10)
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Principal principal, @RequestBody Map<String, String> request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        String fullName = request.get("fullName");
        if (fullName == null || fullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Full Name is required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        user.setFullName(fullName);
        User saved = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "id", saved.getId(),
            "fullName", saved.getFullName(),
            "email", saved.getEmail(),
            "provider", saved.getProvider(),
            "role", saved.getRole(),
            "profileImage", saved.getProfileImage() != null ? saved.getProfileImage() : "",
            "createdAt", saved.getCreatedAt() != null ? saved.getCreatedAt().toString().substring(0, 10) : LocalDateTime.now().toString().substring(0, 10),
            "lastLogin", saved.getLastLogin() != null ? saved.getLastLogin().toString().substring(0, 10) : LocalDateTime.now().toString().substring(0, 10)
        ));
    }

    @PutMapping("/profile/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody Map<String, String> request) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        if (oldPassword == null || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Old password and new password are required"));
        }
        
        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password must be at least 8 characters long"));
        }

        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect old password"));
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(Principal principal, @RequestParam("file") MultipartFile file) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File cannot be empty"));
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("message", "File size exceeds the limit of 5MB"));
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/png") && !contentType.equals("image/jpeg") && !contentType.equals("image/jpg"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only PNG, JPG, and JPEG images are allowed"));
        }

        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        try {
            String url = storageService.uploadFile(file, "profile");
            user.setProfileImage(url);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "profileImage", url,
                "message", "Profile picture updated successfully"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to store file: " + e.getMessage()));
        }
    }
}
