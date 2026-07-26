package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_configuration")
public class AiConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String provider; // e.g., gemini, openai, anthropic, groq, openrouter, ollama

    @Column(name = "api_key", columnDefinition = "TEXT")
    private String apiKey;

    @Column(length = 100)
    private String model;

    @Column(name = "base_url", length = 255)
    private String baseUrl;

    @Column(nullable = false)
    private Double temperature = 0.3;

    @Column(name = "max_tokens", nullable = false)
    private Integer maxTokens = 1024;

    @Column(nullable = false)
    private Integer timeout = 30;

    @Column(name = "retry_attempts", nullable = false)
    private Integer retryAttempts = 3;

    @Column(name = "enable_ai", nullable = false)
    private Boolean enableAi = false;

    @Column(name = "enable_translation", nullable = false)
    private Boolean enableTranslation = false;

    @Column(name = "enable_seo", nullable = false)
    private Boolean enableSeo = false;

    @Column(name = "enable_summary", nullable = false)
    private Boolean enableSummary = false;

    @Column(name = "enable_rewrite", nullable = false)
    private Boolean enableRewrite = false;

    @Column(name = "enable_tags", nullable = false)
    private Boolean enableTags = false;

    @Column(name = "enable_keywords", nullable = false)
    private Boolean enableKeywords = false;

    @Column(name = "enable_logging", nullable = false)
    private Boolean enableLogging = false;

    @Column(name = "enable_cache", nullable = false)
    private Boolean enableCache = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false; // Is this provider the globally active one?

    @Column(name = "is_encrypted", nullable = false)
    private Boolean isEncrypted = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Integer getMaxTokens() { return maxTokens; }
    public void setMaxTokens(Integer maxTokens) { this.maxTokens = maxTokens; }

    public Integer getTimeout() { return timeout; }
    public void setTimeout(Integer timeout) { this.timeout = timeout; }

    public Integer getRetryAttempts() { return retryAttempts; }
    public void setRetryAttempts(Integer retryAttempts) { this.retryAttempts = retryAttempts; }

    public Boolean getEnableAi() { return enableAi; }
    public void setEnableAi(Boolean enableAi) { this.enableAi = enableAi; }

    public Boolean getEnableTranslation() { return enableTranslation; }
    public void setEnableTranslation(Boolean enableTranslation) { this.enableTranslation = enableTranslation; }

    public Boolean getEnableSeo() { return enableSeo; }
    public void setEnableSeo(Boolean enableSeo) { this.enableSeo = enableSeo; }

    public Boolean getEnableSummary() { return enableSummary; }
    public void setEnableSummary(Boolean enableSummary) { this.enableSummary = enableSummary; }

    public Boolean getEnableRewrite() { return enableRewrite; }
    public void setEnableRewrite(Boolean enableRewrite) { this.enableRewrite = enableRewrite; }

    public Boolean getEnableTags() { return enableTags; }
    public void setEnableTags(Boolean enableTags) { this.enableTags = enableTags; }

    public Boolean getEnableKeywords() { return enableKeywords; }
    public void setEnableKeywords(Boolean enableKeywords) { this.enableKeywords = enableKeywords; }

    public Boolean getEnableLogging() { return enableLogging; }
    public void setEnableLogging(Boolean enableLogging) { this.enableLogging = enableLogging; }

    public Boolean getEnableCache() { return enableCache; }
    public void setEnableCache(Boolean enableCache) { this.enableCache = enableCache; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsEncrypted() { return isEncrypted; }
    public void setIsEncrypted(Boolean isEncrypted) { this.isEncrypted = isEncrypted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
}
