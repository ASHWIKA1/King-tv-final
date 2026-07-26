package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profanity_violations")
public class ProfanityViolation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_type", nullable = false, length = 50)
    private String contentType;

    @Column(name = "content_id")
    private Long contentId;

    @Column(name = "content_title", length = 255)
    private String contentTitle;

    @Column(name = "matched_terms", columnDefinition = "TEXT")
    private String matchedTerms;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "author_email", length = 100)
    private String authorEmail;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }
    public String getContentTitle() { return contentTitle; }
    public void setContentTitle(String contentTitle) { this.contentTitle = contentTitle; }
    public String getMatchedTerms() { return matchedTerms; }
    public void setMatchedTerms(String matchedTerms) { this.matchedTerms = matchedTerms; }
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
