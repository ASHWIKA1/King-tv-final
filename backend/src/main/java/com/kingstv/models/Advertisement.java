package com.kingstv.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "advertisements")
public class Advertisement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Placement ID is required")
    private String placementId;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    private String title;

    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String customHtml;

    private String targetUrl;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String targetDistrict;
    private String targetDevice; // "desktop", "mobile", "all"

    private boolean active = true;

    private int impressionsCount = 0;
    private int clicksCount = 0;

    private String linkUrl;
    private String status;
    private String placement;
    private String targetGeo;
    private double remainingBudget;
    private double costPerClick;
    private double costPerImpression;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPlacementId() { return placementId; }
    public void setPlacementId(String placementId) { this.placementId = placementId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCustomHtml() { return customHtml; }
    public void setCustomHtml(String customHtml) { this.customHtml = customHtml; }
    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public String getTargetDistrict() { return targetDistrict; }
    public void setTargetDistrict(String targetDistrict) { this.targetDistrict = targetDistrict; }
    public String getTargetDevice() { return targetDevice; }
    public void setTargetDevice(String targetDevice) { this.targetDevice = targetDevice; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public int getImpressionsCount() { return impressionsCount; }
    public void setImpressionsCount(int impressionsCount) { this.impressionsCount = impressionsCount; }
    public int getClicksCount() { return clicksCount; }
    public void setClicksCount(int clicksCount) { this.clicksCount = clicksCount; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPlacement() { return placement; }
    public void setPlacement(String placement) { this.placement = placement; }
    public String getTargetGeo() { return targetGeo; }
    public void setTargetGeo(String targetGeo) { this.targetGeo = targetGeo; }
    public double getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(double remainingBudget) { this.remainingBudget = remainingBudget; }
    public double getCostPerClick() { return costPerClick; }
    public void setCostPerClick(double costPerClick) { this.costPerClick = costPerClick; }
    public double getCostPerImpression() { return costPerImpression; }
    public void setCostPerImpression(double costPerImpression) { this.costPerImpression = costPerImpression; }
}
