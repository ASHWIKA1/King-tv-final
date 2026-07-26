package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "video_contents")
public class VideoContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "video_id")
    private Long id;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false)
    private String title;

    @Column(name = "youtube_url", nullable = false)
    private String youtubeUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_live_tv")
    private Integer isLiveTv = 0;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Column(nullable = false)
    private String status = "published";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getYoutubeUrl() { return youtubeUrl; }
    public void setYoutubeUrl(String youtubeUrl) { this.youtubeUrl = youtubeUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getIsLiveTv() { return isLiveTv; }
    public void setIsLiveTv(Integer isLiveTv) { this.isLiveTv = isLiveTv; }
    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDuration() {
        if (durationSeconds == null || durationSeconds == 0) return "3:15";
        int mins = durationSeconds / 60;
        int secs = durationSeconds % 60;
        return String.format("%d:%02d", mins, secs);
    }
}
