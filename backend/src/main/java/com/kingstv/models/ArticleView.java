package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "article_views", indexes = {
    @Index(name = "idx_view_article", columnList = "article_id"),
    @Index(name = "idx_view_ip", columnList = "ip_address")
})
public class ArticleView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_id", nullable = false)
    private Long articleId;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "view_date", nullable = false)
    private LocalDateTime viewDate = LocalDateTime.now();

    @Column(name = "is_counted_for_earnings")
    private Boolean isCountedForEarnings = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getArticleId() { return articleId; }
    public void setArticleId(Long articleId) { this.articleId = articleId; }
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public LocalDateTime getViewDate() { return viewDate; }
    public void setViewDate(LocalDateTime viewDate) { this.viewDate = viewDate; }
    public Boolean getIsCountedForEarnings() { return isCountedForEarnings; }
    public void setIsCountedForEarnings(Boolean isCountedForEarnings) { this.isCountedForEarnings = isCountedForEarnings; }
}
