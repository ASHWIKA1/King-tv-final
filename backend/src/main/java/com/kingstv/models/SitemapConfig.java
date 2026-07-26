package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sitemap_config")
public class SitemapConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_path", nullable = false, unique = true, length = 255)
    private String pagePath;

    @Column(name = "page_label", length = 200)
    private String pageLabel;

    @Column(name = "is_excluded")
    private Boolean isExcluded = false;

    @Column(name = "priority", length = 10)
    private String priority = "0.5";

    @Column(name = "change_freq", length = 20)
    private String changeFreq = "weekly";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPagePath() { return pagePath; }
    public void setPagePath(String pagePath) { this.pagePath = pagePath; }
    public String getPageLabel() { return pageLabel; }
    public void setPageLabel(String pageLabel) { this.pageLabel = pageLabel; }
    public Boolean getIsExcluded() { return isExcluded; }
    public void setIsExcluded(Boolean isExcluded) { this.isExcluded = isExcluded; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getChangeFreq() { return changeFreq; }
    public void setChangeFreq(String changeFreq) { this.changeFreq = changeFreq; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
