package com.kingstv.controllers.admin;

import com.kingstv.models.EarningLedger;
import com.kingstv.models.SystemConfig;
import com.kingstv.repository.EarningLedgerRepository;
import com.kingstv.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/rewards")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
public class RewardController {

    @Autowired
    private EarningLedgerRepository ledgerRepository;

    @Autowired
    private SystemConfigRepository configRepository;

    @GetMapping("/ledgers")
    public List<EarningLedger> getAllLedgers() {
        return ledgerRepository.findAll();
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<Map<String, Object>> getAuthorEarnings(@PathVariable Long authorId) {
        List<EarningLedger> ledgers = ledgerRepository.findByAuthorId(authorId);
        Double total = ledgerRepository.getTotalEarningsByAuthorId(authorId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalEarnings", total != null ? total : 0.0);
        response.put("ledgers", ledgers);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getRewardConfig() {
        Optional<SystemConfig> config = configRepository.findByConfigKey("cost_per_view");
        Map<String, String> response = new HashMap<>();
        response.put("costPerView", config.map(SystemConfig::getConfigValue).orElse("0.01"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/config")
    public ResponseEntity<Void> updateRewardConfig(@RequestBody Map<String, String> payload) {
        String newRate = payload.get("costPerView");
        if (newRate == null) return ResponseEntity.badRequest().build();

        Optional<SystemConfig> configOpt = configRepository.findByConfigKey("cost_per_view");
        SystemConfig config = configOpt.orElse(new SystemConfig());
        config.setConfigKey("cost_per_view");
        config.setConfigValue(newRate);
        configRepository.save(config);
        
        return ResponseEntity.ok().build();
    }
}
