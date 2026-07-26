package com.kingstv.services;

import com.kingstv.models.AiConfiguration;
import com.kingstv.services.ai.providers.LLMProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * AI Content Rewriter service.
 * Integrates with a configurable LLM API (e.g., OpenAI, Gemini) for
 * rewrite/paraphrase suggestions. Available to MJ and Institution Login roles.
 */
@Service
public class AiRewriterService {

    @Autowired
    private AiConfigurationService aiConfigurationService;

    /**
     * Rewrites/paraphrases the given text using the configured LLM API.
     */
    public String rewriteContent(String text, String style) {
        Optional<AiConfiguration> activeOpt = aiConfigurationService.getActiveConfigurationDecrypted();
        if (activeOpt.isEmpty() || !Boolean.TRUE.equals(activeOpt.get().getEnableAi()) || !Boolean.TRUE.equals(activeOpt.get().getEnableRewrite())) {
            return "AI Rewriter is not enabled. Please enable it in the AI settings.";
        }

        AiConfiguration activeConfig = activeOpt.get();
        String prompt = buildPrompt(text, style);

        try {
            LLMProvider providerClient = aiConfigurationService.getProviderClient(activeConfig.getProvider());
            if (providerClient == null) {
                return "Unsupported LLM Provider: " + activeConfig.getProvider();
            }
            return providerClient.generateContent(prompt, activeConfig);
        } catch (Exception e) {
            return "AI Rewriter error: " + e.getMessage();
        }
    }

    private String buildPrompt(String text, String style) {
        String styleInstruction = switch (style != null ? style.toLowerCase() : "professional") {
            case "formal" -> "Rewrite in a formal, professional tone suitable for news publishing.";
            case "casual" -> "Rewrite in a conversational, easy-to-read tone.";
            case "concise" -> "Rewrite to be more concise while keeping all key information.";
            case "detailed" -> "Expand and elaborate on the content, adding more context.";
            default -> "Rewrite professionally for a news publication.";
        };
        return styleInstruction + "\n\nOriginal text:\n" + text;
    }
}
