package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Tracks user-to-category assignments.
 * Restricts which categories a Mobile Journalist or Institution Login can post to.
 */
@Entity
@Table(name = "user_categories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "category_id"})
})
public class UserCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "assigned_by")
    private Long assignedBy;

    @PrePersist
    protected void onCreate() { this.assignedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }
}
