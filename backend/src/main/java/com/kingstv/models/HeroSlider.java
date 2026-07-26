package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hero_slider")
public class HeroSlider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 500)
    private String headline;

    @Column(name = "category_tag", length = 100)
    private String categoryTag = "Breaking News";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "button_text", length = 100)
    private String buttonText = "Read More";

    @Column(name = "button_link", length = 500)
    private String buttonLink;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @Column(nullable = false, length = 50)
    private String status = "Active"; // Active, Scheduled, Inactive

    @Column(name = "schedule_date")
    private LocalDateTime scheduleDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getButtonText() { return buttonText; }
    public void setButtonText(String buttonText) { this.buttonText = buttonText; }

    public String getButtonLink() { return buttonLink; }
    public void setButtonLink(String buttonLink) { this.buttonLink = buttonLink; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getScheduleDate() { return scheduleDate; }
    public void setScheduleDate(LocalDateTime scheduleDate) { this.scheduleDate = scheduleDate; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCategoryTag() { return categoryTag; }
    public void setCategoryTag(String categoryTag) { this.categoryTag = categoryTag; }
}
