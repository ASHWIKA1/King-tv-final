package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "home_layout_history")
public class HomeLayoutHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "layout_type", nullable = false)
    private String layoutType = "WEB";

    @Column(name = "version_label")
    private String versionLabel;

    @Column(name = "layout_data_json", columnDefinition = "TEXT")
    private String layoutDataJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by")
    private String createdBy;

    public HomeLayoutHistory() {}

    public HomeLayoutHistory(String layoutType, String versionLabel, String layoutDataJson, String createdBy) {
        this.layoutType = layoutType;
        this.versionLabel = versionLabel;
        this.layoutDataJson = layoutDataJson;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLayoutType() { return layoutType; }
    public void setLayoutType(String layoutType) { this.layoutType = layoutType; }

    public String getVersionLabel() { return versionLabel; }
    public void setVersionLabel(String versionLabel) { this.versionLabel = versionLabel; }

    public String getLayoutDataJson() { return layoutDataJson; }
    public void setLayoutDataJson(String layoutDataJson) { this.layoutDataJson = layoutDataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
