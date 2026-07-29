package com.kingstv.controllers.admin;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kingstv.models.HomeLayoutHistory;
import com.kingstv.models.Permission;
import com.kingstv.repository.HomeLayoutHistoryRepository;
import com.kingstv.security.RequiresPermission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * TEST-ONLY DUMMY LAYOUT INTEGRATION — safe to remove after layout testing.
 *
 * Stores dummy layout as a JSON snapshot in home_layout_history
 * (layoutType = "DUMMY_WEB"). Zero conflict with production "WEB" rows.
 *
 * REMOVAL: Delete this file + remove the permitAll entry in SecurityConfig.java +
 *          DELETE FROM home_layout_history WHERE layout_type = 'DUMMY_WEB';
 */
@RestController
@RequestMapping("/api/v1/admin/layout/dummy")
public class DummyLayoutController {

    private static final String DUMMY_LAYOUT_TYPE = "DUMMY_WEB";
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private HomeLayoutHistoryRepository historyRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/v1/admin/layout/dummy  (public — no auth needed)
    // Returns the latest dummy layout as a JSON array of section objects.
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getDummyLayout() {
        try {
            Optional<HomeLayoutHistory> latest =
                historyRepository.findFirstByLayoutTypeOrderByCreatedAtDesc(DUMMY_LAYOUT_TYPE);

            if (latest.isEmpty() || latest.get().getLayoutDataJson() == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<Map<String, Object>> sections =
                mapper.readValue(latest.get().getLayoutDataJson(), new TypeReference<>() {});
            return ResponseEntity.ok(sections);

        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/v1/admin/layout/dummy  (admin auth required)
    // Saves the current staged editor layout as the dummy test snapshot.
    // NEVER touches layout_type = 'WEB' rows.
    // ─────────────────────────────────────────────────────────────────────────
    @PutMapping
    @Transactional
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> saveDummyLayout(@RequestBody List<Map<String, Object>> sections) {

        if (sections == null || sections.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Layout payload is empty."));
        }

        // 1. Serialize layout to JSON
        String layoutJson;
        try {
            layoutJson = mapper.writeValueAsString(sections);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Serialization failed: " + e.getMessage()));
        }

        // 2. Delete any existing DUMMY_WEB entries using direct JPQL (no entity load)
        historyRepository.deleteByLayoutType(DUMMY_LAYOUT_TYPE);

        // 3. Save fresh snapshot using the 4-arg constructor
        HomeLayoutHistory snapshot = new HomeLayoutHistory(
            DUMMY_LAYOUT_TYPE,
            "Dummy Test " + LocalDateTime.now(),
            layoutJson,
            "admin"
        );
        historyRepository.save(snapshot);

        return ResponseEntity.ok(Map.of(
            "message", "Dummy layout saved. Production layout was NOT changed.",
            "sections", sections.size(),
            "savedAt", LocalDateTime.now().toString()
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/v1/admin/layout/dummy  (admin auth required)
    // Wipes all DUMMY_WEB snapshots — resets dummy page to placeholder state.
    // NEVER touches production WEB records.
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping
    @Transactional
    @RequiresPermission(Permission.HOME_LAYOUT_MANAGE)
    public ResponseEntity<?> resetDummyLayout() {
        historyRepository.deleteByLayoutType(DUMMY_LAYOUT_TYPE);
        return ResponseEntity.ok(Map.of(
            "message", "Dummy layout reset. Production layout was NOT changed."
        ));
    }
}
