package com.kingstv.services.ai.providers;

import com.kingstv.models.AiConfiguration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

public class AnthropicProvider implements LLMProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateContent(String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", config.getApiKey());
        headers.set("anthropic-version", "2023-06-01");

        Map<String, Object> message = Map.of("role", "user", "content", prompt);
        Map<String, Object> body = new HashMap<>();
        body.put("model", config.getModel() != null && !config.getModel().isBlank() ? config.getModel() : "claude-3-5-sonnet-20241022");
        body.put("messages", List.of(message));
        body.put("temperature", config.getTemperature());
        body.put("max_tokens", config.getMaxTokens());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return extractTextFromResponse(response);
    }

    @Override
    public String generateContentMultimodal(byte[] base64Data, String mimeType, String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", config.getApiKey());
        headers.set("anthropic-version", "2023-06-01");

        String base64Str = Base64.getEncoder().encodeToString(base64Data);

        Map<String, Object> source = Map.of("type", "base64", "media_type", mimeType, "data", base64Str);
        Map<String, Object> imageContent = Map.of("type", "image", "source", source);
        Map<String, Object> textContent = Map.of("type", "text", "text", prompt);

        Map<String, Object> message = Map.of("role", "user", "content", List.of(imageContent, textContent));
        Map<String, Object> body = new HashMap<>();
        body.put("model", config.getModel() != null && !config.getModel().isBlank() ? config.getModel() : "claude-3-5-sonnet-20241022");
        body.put("messages", List.of(message));
        body.put("temperature", config.getTemperature());
        body.put("max_tokens", config.getMaxTokens());

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
            throw new Exception("Anthropic connection test failed: " + e.getMessage(), e);
        }
    }

    private String buildUrl(AiConfiguration config) {
        String baseUrl = config.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://api.anthropic.com/v1";
        }
        if (baseUrl.endsWith("/messages")) {
            return baseUrl;
        }
        return baseUrl + (baseUrl.endsWith("/") ? "messages" : "/messages");
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(ResponseEntity<Map> response) throws Exception {
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
            if (content != null && !content.isEmpty()) {
                Map<String, Object> contentBlock = content.get(0);
                if ("text".equals(contentBlock.get("type"))) {
                    return (String) contentBlock.get("text");
                }
            }
        }
        throw new Exception("Invalid response format or code: " + response.getStatusCode());
    }
}
