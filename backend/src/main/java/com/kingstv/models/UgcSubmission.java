package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Reader UGC submissions that land in Chief Editor review queue.
 */
@Entity
@Table(name = "ugc_submissions")
public class UgcSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submitter_id")
    private Long submitterId;

    @Column(name = "submitter_name", length = 100)
    private String submitterName;

    @Column(name = "submitter_email", length = 100)
    private String submitterEmail;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "district_id")
    private Long districtId;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "review_reason", columnDefinition = "TEXT")
    private String reviewReason;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "published_article_id")
    private Long publishedArticleId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubmitterId() { return submitterId; }
    public void setSubmitterId(Long submitterId) { this.submitterId = submitterId; }
    public String getSubmitterName() { return submitterName; }
    public void setSubmitterName(String submitterName) { this.submitterName = submitterName; }
    public String getSubmitterEmail() { return submitterEmail; }
    public void setSubmitterEmail(String submitterEmail) { this.submitterEmail = submitterEmail; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getDistrictId() { return districtId; }
    public void setDistrictId(Long districtId) { this.districtId = districtId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReviewReason() { return reviewReason; }
    public void setReviewReason(String reviewReason) { this.reviewReason = reviewReason; }
    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public Long getPublishedArticleId() { return publishedArticleId; }
    public void setPublishedArticleId(Long publishedArticleId) { this.publishedArticleId = publishedArticleId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
