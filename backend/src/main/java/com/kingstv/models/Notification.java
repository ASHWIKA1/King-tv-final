package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "title_ta", nullable = false)
    private String titleTa;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "message_ta", nullable = false, columnDefinition = "TEXT")
    private String messageTa;

    @Column(name = "user_id")
    private Long userId; // Nullable if broadcast to all users

    @Column(nullable = false)
    private String status = "unread"; // unread, read, deleted

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTitleTa() { return titleTa; }
    public void setTitleTa(String titleTa) { this.titleTa = titleTa; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMessageTa() { return messageTa; }
    public void setMessageTa(String messageTa) { this.messageTa = messageTa; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
