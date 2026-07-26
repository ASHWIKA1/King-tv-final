package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "web_stories")
public class WebStory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "story_id")
    private Long id;

    @Column(name = "title_ta", nullable = false)
    private String titleTa;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "title")
    private String title;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "cat")
    private String cat;

    @Column(name = "badge")
    private String badge = "NEW";

    @Column(name = "background_gradient")
    private String backgroundGradient = "linear-gradient(135deg, #1E40AF, #3B82F6)";

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "status", nullable = false)
    private String status = "published";

    @Column(name = "slides_json", columnDefinition = "TEXT")
    private String slidesJson;

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitleTa() { return titleTa; }
    public void setTitleTa(String titleTa) { this.titleTa = titleTa; }
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCat() { return cat; }
    public void setCat(String cat) { this.cat = cat; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    public String getBackgroundGradient() { return backgroundGradient; }
    public void setBackgroundGradient(String backgroundGradient) { this.backgroundGradient = backgroundGradient; }
    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSlidesJson() { return slidesJson; }
    public void setSlidesJson(String slidesJson) { this.slidesJson = slidesJson; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
