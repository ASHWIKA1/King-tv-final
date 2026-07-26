package com.kingstv.controllers;

import com.kingstv.models.UserPreference;
import com.kingstv.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users/preferences")
public class PreferenceController {

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getPreferences(@PathVariable Long userId) {
        Optional<UserPreference> prefOpt = userPreferenceRepository.findById(userId);
        if (prefOpt.isEmpty()) {
            UserPreference defaultPref = new UserPreference();
            defaultPref.setUserId(userId);
            return ResponseEntity.ok(defaultPref);
        }
        return ResponseEntity.ok(prefOpt.get());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updatePreferences(@PathVariable Long userId, @RequestBody UserPreference newPref) {
        newPref.setUserId(userId);
        UserPreference saved = userPreferenceRepository.save(newPref);
        return ResponseEntity.ok(Map.of("message", "Preferences saved successfully", "preferences", saved));
    }
}
