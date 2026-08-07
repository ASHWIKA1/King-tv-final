package com.kingstv.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.cache.annotation.Cacheable;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.HashMap;

@Service
public class MarketDataService {

    private final String goldApiKey = "goldapi-10b7b70fea4f1c38b3cf7eb3c6037ac0-io";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Cache the result to prevent API rate limit exhaustion
    @Cacheable(value = "gold_rates", key = "'latest'")
    public Map<String, String> getLatestGoldRates() {
        Map<String, String> rates = new HashMap<>();
        
        try {
            // Fetch Gold (XAU)
            String goldUrl = "https://www.goldapi.io/api/XAU/INR";
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-access-token", goldApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> goldResponse = restTemplate.exchange(goldUrl, HttpMethod.GET, entity, String.class);
            JsonNode goldJson = objectMapper.readTree(goldResponse.getBody());
            
            if (goldJson.has("price_gram_24k")) {
                rates.put("gold24k", "₹" + Math.round(goldJson.get("price_gram_24k").asDouble()) + "/g");
                rates.put("gold22k", "₹" + Math.round(goldJson.get("price_gram_22k").asDouble()) + "/g");
            }

            // Fetch Silver (XAG)
            String silverUrl = "https://www.goldapi.io/api/XAG/INR";
            ResponseEntity<String> silverResponse = restTemplate.exchange(silverUrl, HttpMethod.GET, entity, String.class);
            JsonNode silverJson = objectMapper.readTree(silverResponse.getBody());
            
            if (silverJson.has("price_gram_24k")) {
                rates.put("silver", "₹" + Math.round(silverJson.get("price_gram_24k").asDouble()) + "/g");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback values if API fails
            rates.put("gold24k", "₹N/A");
            rates.put("gold22k", "₹N/A");
            rates.put("silver", "₹N/A");
        }
        
        return rates;
    }
}
