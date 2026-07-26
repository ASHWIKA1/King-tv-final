package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "success_stories")
public class SuccessStory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "story_id")
    private Long id;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @Column(name = "is_case_study")
    private Boolean isCaseStudy = false;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private String status = "published";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Boolean getIsCaseStudy() { return isCaseStudy; }
    public void setIsCaseStudy(Boolean isCaseStudy) { this.isCaseStudy = isCaseStudy; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
