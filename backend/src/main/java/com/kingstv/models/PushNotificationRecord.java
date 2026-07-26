package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "push_notification_records")
public class PushNotificationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "action_url", length = 500)
    private String actionUrl;

    @Column(name = "target_type", nullable = false, length = 30)
    private String targetType = "GLOBAL";

    @Column(name = "target_value", length = 255)
    private String targetValue;

    @Column(nullable = false, length = 20)
    private String status = "DRAFT";

    @Column(name = "sent_count")
    private Integer sentCount = 0;

    @Column(name = "delivered_count")
    private Integer deliveredCount = 0;

    @Column(name = "opened_count")
    private Integer openedCount = 0;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getTargetValue() { return targetValue; }
    public void setTargetValue(String targetValue) { this.targetValue = targetValue; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getSentCount() { return sentCount; }
    public void setSentCount(Integer sentCount) { this.sentCount = sentCount; }
    public Integer getDeliveredCount() { return deliveredCount; }
    public void setDeliveredCount(Integer deliveredCount) { this.deliveredCount = deliveredCount; }
    public Integer getOpenedCount() { return openedCount; }
    public void setOpenedCount(Integer openedCount) { this.openedCount = openedCount; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
