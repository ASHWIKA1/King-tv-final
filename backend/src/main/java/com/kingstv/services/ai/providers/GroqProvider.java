package com.kingstv.services.ai.providers;

import com.kingstv.models.AiConfiguration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

public class GroqProvider implements LLMProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateContent(String prompt, AiConfiguration config) throws Exception {
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(config.getApiKey());

        Map<String, Object> message = Map.of("role", "user", "content", prompt);
        Map<String, Object> body = new HashMap<>();
        body.put("model", config.getModel() != null && !config.getModel().isBlank() ? config.getModel() : "llama-3.3-70b-versatile");
        body.put("messages", List.of(message));
        body.put("temperature", config.getTemperature());
        body.put("max_tokens", config.getMaxTokens());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return extractTextFromResponse(response);
    }

    @Override
    public String generateContentMultimodal(byte[] base64Data, String mimeType, String prompt, AiConfiguration config) throws Exception {
        // Groq text/llama models typically do not support multimodal inputs, but we will adapt using standard OpenAI schema if they support it in the future
        String url = buildUrl(config);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(config.getApiKey());

        String base64Str = Base64.getEncoder().encodeToString(base64Data);
        String dataUrl = "data:" + mimeType + ";base64," + base64Str;

        Map<String, Object> textContent = Map.of("type", "text", "text", prompt);
        Map<String, Object> imageContent = Map.of("type", "image_url", "image_url", Map.of("url", dataUrl));

        Map<String, Object> message = Map.of("role", "user", "content", List.of(textContent, imageContent));
        Map<String, Object> body = new HashMap<>();
        body.put("model", config.getModel() != null && !config.getModel().isBlank() ? config.getModel() : "llama-3.2-11b-vision-preview");
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
            throw new Exception("Groq connection test failed: " + e.getMessage(), e);
        }
    }

    private String buildUrl(AiConfiguration config) {
        String baseUrl = config.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://api.groq.com/openai/v1";
        }
        if (baseUrl.endsWith("/chat/completions")) {
            return baseUrl;
        }
        return baseUrl + (baseUrl.endsWith("/") ? "chat/completions" : "/chat/completions");
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(ResponseEntity<Map> response) throws Exception {
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                if (message != null) {
                    return (String) message.get("content");
                }
            }
        }
        throw new Exception("Invalid response format or code: " + response.getStatusCode());
    }
}
