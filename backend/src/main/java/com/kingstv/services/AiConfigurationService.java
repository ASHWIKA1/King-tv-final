package com.kingstv.services;

import com.kingstv.models.AiConfiguration;
import com.kingstv.repository.AiConfigurationRepository;
import com.kingstv.services.ai.providers.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AiConfigurationService {

    @Autowired
    private AiConfigurationRepository aiConfigurationRepository;

    @Autowired
    private EncryptionService encryptionService;

    private final Map<String, LLMProvider> providerInstances = new HashMap<>();

    public AiConfigurationService() {
        providerInstances.put("gemini", new GeminiProvider());
        providerInstances.put("openai", new OpenAIProvider());
        providerInstances.put("anthropic", new AnthropicProvider());
        providerInstances.put("groq", new GroqProvider());
        providerInstances.put("openrouter", new OpenRouterProvider());
        providerInstances.put("ollama", new OllamaProvider());
    }

    @PostConstruct
    @Transactional
    public void seedDefaults() {
        // Initialize default configuration templates if table is empty or missing configurations
        List<String> defaultProviders = List.of("gemini", "openai", "anthropic", "groq", "openrouter", "ollama");
        Map<String, String> defaultUrls = Map.of(
            "gemini", "https://generativelanguage.googleapis.com/v1beta",
            "openai", "https://api.openai.com/v1",
            "anthropic", "https://api.anthropic.com/v1",
            "groq", "https://api.groq.com/openai/v1",
            "openrouter", "https://openrouter.ai/api/v1",
            "ollama", "http://localhost:11434/api/chat"
        );
        Map<String, String> defaultModels = Map.of(
            "gemini", "gemini-2.0-flash",
            "openai", "gpt-4o-mini",
            "anthropic", "claude-3-5-sonnet-20241022",
            "groq", "llama-3.3-70b-versatile",
            "openrouter", "google/gemini-2.0-flash-exp:free",
            "ollama", "llama3"
        );

        for (String prov : defaultProviders) {
            Optional<AiConfiguration> existing = aiConfigurationRepository.findByProvider(prov);
            if (existing.isEmpty()) {
                AiConfiguration conf = new AiConfiguration();
                conf.setProvider(prov);
                conf.setBaseUrl(defaultUrls.get(prov));
                conf.setModel(defaultModels.get(prov));
                conf.setTemperature(0.3);
                conf.setMaxTokens(1024);
                conf.setTimeout(30);
                conf.setRetryAttempts(3);
                conf.setEnableAi(false);
                conf.setEnableTranslation(false);
                conf.setEnableSeo(false);
                conf.setEnableSummary(false);
                conf.setEnableRewrite(false);
                conf.setEnableTags(false);
                conf.setEnableKeywords(false);
                conf.setEnableLogging(false);
                conf.setEnableCache(false);
                conf.setIsActive(prov.equals("gemini")); // Make gemini active by default
                conf.setIsEncrypted(false);
                conf.setCreatedAt(LocalDateTime.now());
                conf.setUpdatedAt(LocalDateTime.now());
                aiConfigurationRepository.save(conf);
            }
        }
    }

    public List<AiConfiguration> getAllConfigurations() {
        List<AiConfiguration> configs = aiConfigurationRepository.findAll();
        // Mask API Keys for display security
        for (AiConfiguration c : configs) {
            if (c.getApiKey() != null && !c.getApiKey().isBlank()) {
                c.setApiKey("[SECURED]");
            }
        }
        return configs;
    }

    public Optional<AiConfiguration> getConfiguration(String provider) {
        Optional<AiConfiguration> opt = aiConfigurationRepository.findByProvider(provider.toLowerCase());
        opt.ifPresent(c -> {
            if (c.getApiKey() != null && !c.getApiKey().isBlank()) {
                c.setApiKey("[SECURED]");
            }
        });
        return opt;
    }

    public Optional<AiConfiguration> getActiveConfigurationDecrypted() {
        Optional<AiConfiguration> opt = aiConfigurationRepository.findByIsActiveTrue();
        if (opt.isPresent()) {
            AiConfiguration dec = cloneConfig(opt.get());
            if (dec.getApiKey() != null && !dec.getApiKey().isBlank() && Boolean.TRUE.equals(dec.getIsEncrypted())) {
                try {
                    dec.setApiKey(encryptionService.decrypt(dec.getApiKey()));
                } catch (Exception e) {
                    // Ignore decryption failure if it wasn't valid AES
                }
            }
            return Optional.of(dec);
        }
        return Optional.empty();
    }

    @Transactional
    public AiConfiguration saveConfiguration(String provider, AiConfiguration request, Long userId) throws Exception {
        AiConfiguration existing = aiConfigurationRepository.findByProvider(provider.toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Provider not supported: " + provider));

        existing.setBaseUrl(request.getBaseUrl());
        existing.setModel(request.getModel());
        existing.setTemperature(request.getTemperature());
        existing.setMaxTokens(request.getMaxTokens());
        existing.setTimeout(request.getTimeout());
        existing.setRetryAttempts(request.getRetryAttempts());
        existing.setEnableAi(request.getEnableAi());
        existing.setEnableTranslation(request.getEnableTranslation());
        existing.setEnableSeo(request.getEnableSeo());
        existing.setEnableSummary(request.getEnableSummary());
        existing.setEnableRewrite(request.getEnableRewrite());
        existing.setEnableTags(request.getEnableTags());
        existing.setEnableKeywords(request.getEnableKeywords());
        existing.setEnableLogging(request.getEnableLogging());
        existing.setEnableCache(request.getEnableCache());
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setUpdatedBy(userId);

        // Only update API Key if a new non-masked value is provided
        if (request.getApiKey() != null && !request.getApiKey().isBlank() && !"[SECURED]".equals(request.getApiKey())) {
            existing.setApiKey(encryptionService.encrypt(request.getApiKey()));
            existing.setIsEncrypted(true);
        }

        AiConfiguration saved = aiConfigurationRepository.save(existing);
        // Return masked config
        AiConfiguration response = cloneConfig(saved);
        if (response.getApiKey() != null && !response.getApiKey().isBlank()) {
            response.setApiKey("[SECURED]");
        }
        return response;
    }

    @Transactional
    public void activateProvider(String provider, Long userId) {
        List<AiConfiguration> all = aiConfigurationRepository.findAll();
        for (AiConfiguration c : all) {
            c.setIsActive(c.getProvider().equalsIgnoreCase(provider));
            c.setUpdatedAt(LocalDateTime.now());
            c.setUpdatedBy(userId);
        }
        aiConfigurationRepository.saveAll(all);
    }

    @Transactional
    public AiConfiguration resetToDefault(String provider, Long userId) {
        AiConfiguration config = aiConfigurationRepository.findByProvider(provider.toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Provider not found"));

        Map<String, String> defaultUrls = Map.of(
            "gemini", "https://generativelanguage.googleapis.com/v1beta",
            "openai", "https://api.openai.com/v1",
            "anthropic", "https://api.anthropic.com/v1",
            "groq", "https://api.groq.com/openai/v1",
            "openrouter", "https://openrouter.ai/api/v1",
            "ollama", "http://localhost:11434/api/chat"
        );
        Map<String, String> defaultModels = Map.of(
            "gemini", "gemini-2.0-flash",
            "openai", "gpt-4o-mini",
            "anthropic", "claude-3-5-sonnet-20241022",
            "groq", "llama-3.3-70b-versatile",
            "openrouter", "google/gemini-2.0-flash-exp:free",
            "ollama", "llama3"
        );

        config.setBaseUrl(defaultUrls.get(provider.toLowerCase()));
        config.setModel(defaultModels.get(provider.toLowerCase()));
        config.setTemperature(0.3);
        config.setMaxTokens(1024);
        config.setTimeout(30);
        config.setRetryAttempts(3);
        config.setUpdatedAt(LocalDateTime.now());
        config.setUpdatedBy(userId);

        return aiConfigurationRepository.save(config);
    }

    public boolean testProviderConnection(String provider, AiConfiguration config) throws Exception {
        LLMProvider client = providerInstances.get(provider.toLowerCase());
        if (client == null) {
            throw new IllegalArgumentException("Unsupported connection provider: " + provider);
        }
        
        // Decrypt key if masked or encrypted
        if (config.getApiKey() != null && ("[SECURED]".equals(config.getApiKey()) || config.getIsEncrypted())) {
            AiConfiguration existing = aiConfigurationRepository.findByProvider(provider.toLowerCase()).orElse(null);
            if (existing != null && existing.getApiKey() != null) {
                config.setApiKey(encryptionService.decrypt(existing.getApiKey()));
            }
        }

        return client.testConnection(config);
    }

    public LLMProvider getProviderClient(String provider) {
        return providerInstances.get(provider.toLowerCase());
    }

    private AiConfiguration cloneConfig(AiConfiguration src) {
        AiConfiguration dest = new AiConfiguration();
        dest.setId(src.getId());
        dest.setProvider(src.getProvider());
        dest.setApiKey(src.getApiKey());
        dest.setModel(src.getModel());
        dest.setBaseUrl(src.getBaseUrl());
        dest.setTemperature(src.getTemperature());
        dest.setMaxTokens(src.getMaxTokens());
        dest.setTimeout(src.getTimeout());
        dest.setRetryAttempts(src.getRetryAttempts());
        dest.setEnableAi(src.getEnableAi());
        dest.setEnableTranslation(src.getEnableTranslation());
        dest.setEnableSeo(src.getEnableSeo());
        dest.setEnableSummary(src.getEnableSummary());
        dest.setEnableRewrite(src.getEnableRewrite());
        dest.setEnableTags(src.getEnableTags());
        dest.setEnableKeywords(src.getEnableKeywords());
        dest.setEnableLogging(src.getEnableLogging());
        dest.setEnableCache(src.getEnableCache());
        dest.setIsActive(src.getIsActive());
        dest.setIsEncrypted(src.getIsEncrypted());
        dest.setCreatedAt(src.getCreatedAt());
        dest.setUpdatedAt(src.getUpdatedAt());
        dest.setCreatedBy(src.getCreatedBy());
        dest.setUpdatedBy(src.getUpdatedBy());
        return dest;
    }
}
