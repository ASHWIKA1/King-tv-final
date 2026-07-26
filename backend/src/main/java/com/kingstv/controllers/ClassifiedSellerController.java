package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.services.ClassifiedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ClassifiedSellerController {

    @Autowired
    private ClassifiedService classifiedService;

    @GetMapping("/api/sellers/{id}")
    public ResponseEntity<?> getSellerProfile(@PathVariable Long id) {
        ClassifiedSellerProfile profile = classifiedService.getSellerProfile(id);
        List<ClassifiedListing> listings = classifiedService.getMyClassifieds(id);

        Map<String, Object> details = new HashMap<>();
        details.put("profile", profile);
        details.put("listings", listings);

        return ResponseEntity.ok(details);
    }

    @PutMapping("/api/sellers/{id}")
    public ResponseEntity<?> updateSellerProfile(@PathVariable Long id, @RequestBody ClassifiedSellerProfile profile) {
        ClassifiedSellerProfile updated = classifiedService.updateSellerProfile(id, profile);
        return ResponseEntity.ok(updated);
    }

    @GetMapping({"/api/my-classifieds", "/api/v1/my-classifieds"})
    public ResponseEntity<?> getMyClassifieds(@RequestParam Long userId) {
        List<ClassifiedListing> listings = classifiedService.getMyClassifieds(userId);
        return ResponseEntity.ok(listings);
    }
}
