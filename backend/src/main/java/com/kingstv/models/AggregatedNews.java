package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aggregated_news", indexes = {
    @Index(name = "idx_agg_pub_time", columnList = "published_time"),
    @Index(name = "idx_agg_link", columnList = "external_link")
})
public class AggregatedNews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_name", nullable = false)
    private String sourceName;

    @Column(name = "source_logo", length = 512)
    private String sourceLogo;

    @Column(nullable = false, length = 512)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "external_link", nullable = false, unique = true, length = 512)
    private String externalLink;

    @Column(name = "published_time")
    private LocalDateTime publishedTime;

    @Column(nullable = false)
    private boolean noindex = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceLogo() { return sourceLogo; }
    public void setSourceLogo(String sourceLogo) { this.sourceLogo = sourceLogo; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getExternalLink() { return externalLink; }
    public void setExternalLink(String externalLink) { this.externalLink = externalLink; }

    public LocalDateTime getPublishedTime() { return publishedTime; }
    public void setPublishedTime(LocalDateTime publishedTime) { this.publishedTime = publishedTime; }

    public boolean isNoindex() { return noindex; }
    public void setNoindex(boolean noindex) { this.noindex = noindex; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
