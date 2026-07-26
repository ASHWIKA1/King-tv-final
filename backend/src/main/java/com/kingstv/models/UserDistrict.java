package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Tracks user-to-district assignments.
 * District Admins can be assigned unlimited districts.
 */
@Entity
@Table(name = "user_districts", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "district_id"})
})
public class UserDistrict {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "district_id", nullable = false)
    private Long districtId;

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
    public Long getDistrictId() { return districtId; }
    public void setDistrictId(Long districtId) { this.districtId = districtId; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }
}
