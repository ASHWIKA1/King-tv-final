package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seo_templates")
public class SeoTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "template_key", nullable = false, unique = true, length = 100)
    private String templateKey;

    @Column(name = "template_type", length = 30)
    private String templateType;

    @Column(name = "title_template", columnDefinition = "TEXT")
    private String titleTemplate;

    @Column(name = "description_template", columnDefinition = "TEXT")
    private String descriptionTemplate;

    @Column(name = "keywords_template", columnDefinition = "TEXT")
    private String keywordsTemplate;

    @Column(name = "prompt_template", columnDefinition = "TEXT")
    private String promptTemplate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTemplateKey() { return templateKey; }
    public void setTemplateKey(String templateKey) { this.templateKey = templateKey; }
    public String getTemplateType() { return templateType; }
    public void setTemplateType(String templateType) { this.templateType = templateType; }
    public String getTitleTemplate() { return titleTemplate; }
    public void setTitleTemplate(String titleTemplate) { this.titleTemplate = titleTemplate; }
    public String getDescriptionTemplate() { return descriptionTemplate; }
    public void setDescriptionTemplate(String descriptionTemplate) { this.descriptionTemplate = descriptionTemplate; }
    public String getKeywordsTemplate() { return keywordsTemplate; }
    public void setKeywordsTemplate(String keywordsTemplate) { this.keywordsTemplate = keywordsTemplate; }
    public String getPromptTemplate() { return promptTemplate; }
    public void setPromptTemplate(String promptTemplate) { this.promptTemplate = promptTemplate; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
