package com.kingstv.services.ai.providers;

import com.kingstv.models.AiConfiguration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

public class OllamaProvider implements LLMProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateContent(String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> message = Map.of("role", "user", "content", prompt);
        
        Map<String, Object> options = Map.of("temperature", config.getTemperature());
        Map<String, Object> body = new HashMap<>();
        body.put("model", config.getModel() != null && !config.getModel().isBlank() ? config.getModel() : "llama3");
        body.put("messages", List.of(message));
        body.put("stream", false);
        body.put("options", options);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return extractTextFromResponse(response);
    }

    @Override
    public String generateContentMultimodal(byte[] base64Data, String mimeType, String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String base64Str = Base64.getEncoder().encodeToString(base64Data);

        // Ollama multimodal structure: images is a list of base64 strings under message
        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        message.put("images", List.of(base64Str));

        Map<String, Object> options = Map.of("temperature", config.getTemperature());
        Map<String, Object> body = new HashMap<>();
        body.put("model", config.getModel() != null && !config.getModel().isBlank() ? config.getModel() : "llama3-vision");
        body.put("messages", List.of(message));
        body.put("stream", false);
        body.put("options", options);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return extractTextFromResponse(response);
    }

    @Override
    public boolean testConnection(AiConfiguration config) throws Exception {
        try {
            String res = generateContent("say test", config);
            return res != null && !res.isBlank();
        } catch (Exception e) {
            throw new Exception("Ollama connection test failed (make sure Ollama is running locally): " + e.getMessage(), e);
        }
    }

    private String buildUrl(AiConfiguration config) {
        String baseUrl = config.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://localhost:11434/api/chat";
        }
        if (baseUrl.endsWith("/api/chat")) {
            return baseUrl;
        }
        return baseUrl + (baseUrl.endsWith("/") ? "api/chat" : "/api/chat");
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(ResponseEntity<Map> response) throws Exception {
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> message = (Map<String, Object>) response.getBody().get("message");
            if (message != null) {
                return (String) message.get("content");
            }
        }
        throw new Exception("Invalid response format or code from Ollama: " + response.getStatusCode());
    }
}
