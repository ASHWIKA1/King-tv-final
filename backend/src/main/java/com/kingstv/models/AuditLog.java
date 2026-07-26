package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Append-only audit log entity.
 * No update or delete operations are permitted on this table for any role, including Super Admin.
 * The entity intentionally has no setter for id and updatedAt to enforce immutability.
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_actor", columnList = "actor_id"),
    @Index(name = "idx_audit_action", columnList = "action_type"),
    @Index(name = "idx_audit_entity", columnList = "entity_type"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long id;

    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "actor_email", length = 100)
    private String actorEmail;

    @Column(name = "actor_role", length = 50)
    private String actorRole;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Only getters - this entity is append-only
    public Long getId() { return id; }
    public Long getActorId() { return actorId; }
    public String getActorEmail() { return actorEmail; }
    public String getActorRole() { return actorRole; }
    public String getActionType() { return actionType; }
    public String getEntityType() { return entityType; }
    public Long getEntityId() { return entityId; }
    public String getDetails() { return details; }
    public String getIpAddress() { return ipAddress; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // Setters only for initial creation (used by AuditAspect)
    public void setActorId(Long actorId) { this.actorId = actorId; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public void setDetails(String details) { this.details = details; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
