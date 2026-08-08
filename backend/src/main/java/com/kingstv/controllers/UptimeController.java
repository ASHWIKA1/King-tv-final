package com.kingstv.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
public class UptimeController {

    private static final Logger LOGGER = Logger.getLogger(UptimeController.class.getName());

    @Value("${UPTIMEROBOT_API_KEY:}")
    private String apiKey;

    @GetMapping({"/api/uptime", "/api/v1/uptime"})
    public ResponseEntity<?> getUptimeStatus() {
        try {
            if (apiKey == null || apiKey.trim().isEmpty() || apiKey.startsWith("${")) {
                LOGGER.warning("UptimeRobot API Key is missing or unconfigured.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "UptimeRobot API Key is not configured on the server."));
            }

            HttpClient httpClient = HttpClient.newHttpClient();
            String jsonPayload = String.format("{\"api_key\":\"%s\",\"format\":\"json\",\"response_times\":1}", apiKey.trim());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.uptimerobot.com/v2/getMonitors"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            LOGGER.info("Sending request to UptimeRobot getMonitors API...");
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                LOGGER.severe("UptimeRobot response error. Status: " + response.statusCode() + ", Body: " + response.body());
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", "Failed to retrieve status from UptimeRobot. Service returned code " + response.statusCode()));
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.body());

            String stat = rootNode.path("stat").asText();
            if (!"ok".equalsIgnoreCase(stat)) {
                String errorMessage = rootNode.path("error").path("message").asText("UptimeRobot API returned an error status.");
                LOGGER.severe("UptimeRobot API error: " + errorMessage);
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", errorMessage));
            }

            JsonNode monitors = rootNode.path("monitors");
            if (!monitors.isArray() || monitors.size() == 0) {
                LOGGER.warning("No monitors returned from UptimeRobot.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No website monitors found in the UptimeRobot account."));
            }

            // Extract the first monitor (which maps to the website)
            JsonNode monitor = monitors.get(0);
            String websiteName = monitor.path("friendly_name").asText("Kings TV News Portal");
            int statusVal = monitor.path("status").asInt(0);
            
            // UptimeRobot Statuses: 2 is Up/Online. All others are down/paused/not checked.
            String currentStatus = (statusVal == 2) ? "Online" : "Offline";
            String uptimePercentage = monitor.path("all_time_uptime_ratio").asText("100");

            // Extract response times history
            JsonNode responseTimesNode = monitor.path("response_times");
            List<Map<String, Object>> responseTimeHistory = new ArrayList<>();
            int totalResponseTime = 0;
            int responseTimeCount = 0;
            long lastCheckEpoch = 0;

            if (responseTimesNode.isArray() && responseTimesNode.size() > 0) {
                for (JsonNode node : responseTimesNode) {
                    long datetime = node.path("datetime").asLong();
                    int val = node.path("value").asInt();
                    
                    Map<String, Object> historyItem = new HashMap<>();
                    historyItem.put("datetime", datetime);
                    historyItem.put("value", val);
                    responseTimeHistory.add(historyItem);

                    totalResponseTime += val;
                    responseTimeCount++;
                    if (datetime > lastCheckEpoch) {
                        lastCheckEpoch = datetime;
                    }
                }
            }

            int avgResponseTime = (responseTimeCount > 0) ? (totalResponseTime / responseTimeCount) : 0;
            String lastCheckTime = (lastCheckEpoch > 0) 
                    ? Instant.ofEpochSecond(lastCheckEpoch).toString() 
                    : Instant.now().toString();

            Map<String, Object> result = new HashMap<>();
            result.put("websiteName", websiteName);
            result.put("currentStatus", currentStatus);
            result.put("uptimePercentage", uptimePercentage);
            result.put("averageResponseTime", avgResponseTime);
            result.put("lastCheckTime", lastCheckTime);
            result.put("responseTimeHistory", responseTimeHistory);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Exception inside UptimeController: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
}
