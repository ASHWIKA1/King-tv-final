package com.kingstv.services.ai.providers;

import com.kingstv.models.AiConfiguration;

public interface LLMProvider {
    String generateContent(String prompt, AiConfiguration config) throws Exception;
    String generateContentMultimodal(byte[] base64Data, String mimeType, String prompt, AiConfiguration config) throws Exception;
    boolean testConnection(AiConfiguration config) throws Exception;
}
