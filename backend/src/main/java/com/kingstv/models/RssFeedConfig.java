package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rss_feed_configs")
public class RssFeedConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "feed_url", nullable = false)
    private String feedUrl;

    @Column(name = "category_id")
    private Long categoryId;

    @Column
    private String language; // "ta" or "en"

    @Column(name = "auto_image_download")
    private Boolean autoImageDownload = false;

    @Column(name = "auto_publish")
    private Boolean autoPublish = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getFeedUrl() { return feedUrl; }
    public void setFeedUrl(String feedUrl) { this.feedUrl = feedUrl; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public Boolean getAutoImageDownload() { return autoImageDownload; }
    public void setAutoImageDownload(Boolean autoImageDownload) { this.autoImageDownload = autoImageDownload; }
    public Boolean getAutoPublish() { return autoPublish; }
    public void setAutoPublish(Boolean autoPublish) { this.autoPublish = autoPublish; }
}
