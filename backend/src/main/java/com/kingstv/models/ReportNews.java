package com.kingstv.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_news")
public class ReportNews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporter_name", nullable = false)
    @NotBlank(message = "Reporter name is required")
    @Size(max = 100, message = "Reporter name cannot exceed 100 characters")
    private String reporterName;

    @Column(name = "reporter_contact", nullable = false)
    @NotBlank(message = "Reporter contact is required")
    @Size(max = 50, message = "Reporter contact cannot exceed 50 characters")
    private String reporterContact;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Details are required")
    @Size(max = 2000, message = "Details cannot exceed 2000 characters")
    private String details;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(nullable = false)
    private String status = "pending"; // pending, approved, rejected, deleted

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterContact() { return reporterContact; }
    public void setReporterContact(String reporterContact) { this.reporterContact = reporterContact; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
