package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Home page layout configuration with section ordering and delegation.
 */
@Entity
@Table(name = "home_layout_config")
public class HomeLayoutConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_key", nullable = false, unique = true, length = 50)
    private String sectionKey;

    @Column(name = "section_label", length = 100)
    private String sectionLabel;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_visible")
    private Boolean isVisible = true;

    @Column(name = "config_json", columnDefinition = "TEXT")
    private String configJson;

    @Column(name = "delegated_to_chief_editor")
    private Boolean delegatedToChiefEditor = false;

    @Column(name = "layout_type", length = 20)
    private String layoutType = "WEB";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private Long updatedBy;

    @PrePersist
    @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSectionKey() { return sectionKey; }
    public void setSectionKey(String sectionKey) { this.sectionKey = sectionKey; }
    public String getSectionLabel() { return sectionLabel; }
    public void setSectionLabel(String sectionLabel) { this.sectionLabel = sectionLabel; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Boolean getIsVisible() { return isVisible; }
    public void setIsVisible(Boolean isVisible) { this.isVisible = isVisible; }
    public String getConfigJson() { return configJson; }
    public void setConfigJson(String configJson) { this.configJson = configJson; }
    public Boolean getDelegatedToChiefEditor() { return delegatedToChiefEditor; }
    public void setDelegatedToChiefEditor(Boolean delegatedToChiefEditor) { this.delegatedToChiefEditor = delegatedToChiefEditor; }
    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
}
