package com.kingstv.controllers;

import com.kingstv.services.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/market")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/live-rates")
    public ResponseEntity<?> getLiveRates() {
        Map<String, Object> response = new HashMap<>();
        
        // Fetch Gold and Silver rates
        Map<String, String> goldData = marketDataService.getLatestGoldRates();
        response.put("gold", goldData);
        
        return ResponseEntity.ok(response);
    }
}
