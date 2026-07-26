package com.kingstv.services;

import com.kingstv.models.AiConfiguration;
import com.kingstv.services.ai.providers.LLMProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * AI Assistant service for news journalists.
 * Uses dynamic LLM provider client delegation strategy (Gemini, OpenAI, Anthropic, etc.)
 * configured dynamically by the Super Admin in system settings.
 */
@Service
public class AiAssistService {

    @Autowired
    private AiConfigurationService aiConfigurationService;

    /**
     * Main entry point: dispatch to the right prompt based on action type.
     */
    public Map<String, Object> assist(String action, String text, String context) {
        Optional<AiConfiguration> activeOpt = aiConfigurationService.getActiveConfigurationDecrypted();
        if (activeOpt.isEmpty() || !Boolean.TRUE.equals(activeOpt.get().getEnableAi())) {
            return Map.of("error", true, "result",
                    "AI Assistant is not configured or disabled. Please enable it in AI Settings.");
        }

        AiConfiguration activeConfig = activeOpt.get();

        // Enforce individual feature toggles
        if ("seo".equalsIgnoreCase(action) && !Boolean.TRUE.equals(activeConfig.getEnableSeo())) {
            return Map.of("error", true, "result", "SEO generation AI is disabled in settings.");
        }
        if ("translate".equalsIgnoreCase(action) && !Boolean.TRUE.equals(activeConfig.getEnableTranslation())) {
            return Map.of("error", true, "result", "Translation AI is disabled in settings.");
        }
        if ("summarize".equalsIgnoreCase(action) && !Boolean.TRUE.equals(activeConfig.getEnableSummary())) {
            return Map.of("error", true, "result", "Summarization AI is disabled in settings.");
        }
        if ("rewrite".equalsIgnoreCase(action) && !Boolean.TRUE.equals(activeConfig.getEnableRewrite())) {
            return Map.of("error", true, "result", "AI rewrite is disabled in settings.");
        }
        if ("tags".equalsIgnoreCase(action) && !Boolean.TRUE.equals(activeConfig.getEnableTags())) {
            return Map.of("error", true, "result", "Auto tags AI is disabled in settings.");
        }

        String prompt = buildPrompt(action, text, context);
        try {
            LLMProvider providerClient = aiConfigurationService.getProviderClient(activeConfig.getProvider());
            if (providerClient == null) {
                return Map.of("error", true, "result", "LLM Provider client not available: " + activeConfig.getProvider());
            }
            String result = providerClient.generateContent(prompt, activeConfig);
            return Map.of("error", false, "result", result, "action", action);
        } catch (Exception e) {
            return Map.of("error", true, "result", "AI error: " + e.getMessage());
        }
    }

    /**
     * Check if AI is configured and available.
     */
    public boolean isAvailable() {
        return aiConfigurationService.getActiveConfigurationDecrypted()
                .map(AiConfiguration::getEnableAi)
                .orElse(false);
    }

    private String buildPrompt(String action, String text, String context) {
        return switch (action != null ? action.toLowerCase() : "") {
            case "headlines" -> """
                    You are a senior news editor for a Tamil-English bilingual news channel called "KINGS 24x7".
                    Generate exactly 5 compelling headline options for the following topic/idea.
                    For each headline, provide both Tamil and English versions.
                    Format each as:
                    1. [Tamil headline] | [English headline]
                    2. [Tamil headline] | [English headline]
                    ... and so on.
                    Make them attention-grabbing, SEO-friendly, and suitable for a major news website.
                    
                    Topic/Idea: """ + text;

            case "expand" -> """
                    You are a professional news journalist. Expand the following text into a detailed,
                    well-structured news paragraph (3-5 sentences). Maintain journalistic tone.
                    Keep the same language as the input (Tamil or English).
                    Do NOT add any prefix or explanation — return only the expanded content.
                    
                    Text to expand: """ + text;

            case "summarize" -> """
                    Summarize the following news content into a concise 2-3 sentence summary.
                    Keep the same language as the input. This will be used as a short description / teaser.
                    Do NOT add any prefix — return only the summary.
                    
                    Content: """ + text;

            case "grammar" -> """
                    You are a professional copy editor. Review the following news text for grammar,
                    spelling, punctuation, and style errors. Return the corrected version only.
                    Keep the same language as the input. Do NOT add explanations.
                    
                    Text: """ + text;

            case "tags" -> """
                    You are an SEO specialist for a news website. Read the following article content
                    and suggest 8-12 relevant news tags/keywords separated by commas.
                    Include a mix of broad and specific tags. Return ONLY the comma-separated tags, nothing else.
                    
                    Article content: """ + text;

            case "seo" -> """
                    You are an SEO specialist for a Tamil news website called "KINGS 24x7".
                    Based on the following article content, generate:
                    1. SEO Title in Tamil (60-70 characters)
                    2. Meta Description in Tamil (150-160 characters)
                    3. URL Slug in transliterated English/Latin characters (lowercase, hyphens, no special characters, e.g. puthiya-indhiya-ani-...)
                    4. Focus Keywords: 5-8 relevant focus keywords (comma separated)
                    5. Tags: 5-8 relevant tags (comma separated)
                    
                    Format your response exactly as:
                    SEO_TITLE: [Tamil title]
                    META_DESC: [Tamil description]
                    SLUG: [transliterated-slug]
                    KEYWORDS: [comma, separated, focus, keywords]
                    TAGS: [comma, separated, tags]
                    
                    Article content: """ + text;

            case "translate" -> {
                String direction = context != null && context.equalsIgnoreCase("en2ta") ? "English to Tamil" : "Tamil to English";
                yield """
                        Translate the following text from %s.
                        Return ONLY the translated text, no explanations or prefixes.
                        Maintain the original formatting, paragraphs, and structure.
                        
                        Text: """.formatted(direction) + text;
            }

            case "rewrite" -> {
                String style = context != null ? context : "professional";
                yield """
                        Rewrite the following news text in a %s style.
                        Keep the same language. Return ONLY the rewritten text.
                        
                        Text: """.formatted(style) + text;
            }

            default -> "You are a helpful assistant. " + text;
        };
    }


}
