package com.kingstv.services.ai.providers;

import com.kingstv.models.AiConfiguration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

public class GeminiProvider implements LLMProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateContent(String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> contentsPart = Map.of("parts", List.of(textPart));
        Map<String, Object> body = Map.of("contents", List.of(contentsPart));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return extractTextFromResponse(response);
    }

    @Override
    public String generateContentMultimodal(byte[] base64Data, String mimeType, String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Standard Gemini Multimodal format
        String base64Str = Base64.getEncoder().encodeToString(base64Data);
        Map<String, Object> inlineData = Map.of("data", base64Str, "mimeType", mimeType);
        Map<String, Object> inlinePart = Map.of("inlineData", inlineData);
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> contentsPart = Map.of("parts", List.of(inlinePart, textPart));
        Map<String, Object> body = Map.of("contents", List.of(contentsPart));

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
            throw new Exception("Gemini connection test failed: " + e.getMessage(), e);
        }
    }

    private String buildUrl(AiConfiguration config) {
        String baseUrl = config.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://generativelanguage.googleapis.com/v1beta";
        }
        String model = config.getModel();
        if (model == null || model.isBlank()) {
            model = "gemini-2.0-flash";
        }
        return baseUrl + "/models/" + model + ":generateContent?key=" + config.getApiKey();
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(ResponseEntity<Map> response) throws Exception {
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                if (content != null) {
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        }
        throw new Exception("Invalid response format or code: " + response.getStatusCode());
    }
}
