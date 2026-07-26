package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Tracks edit count per post for max-2-edits enforcement.
 */
@Entity
@Table(name = "content_edit_log", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"content_type", "content_id"})
})
public class ContentEditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_type", nullable = false, length = 50)
    private String contentType;

    @Column(name = "content_id", nullable = false)
    private Long contentId;

    @Column(name = "edit_count", nullable = false)
    private Integer editCount = 0;

    @Column(name = "last_edited_at")
    private LocalDateTime lastEditedAt;

    @Column(name = "last_edited_by")
    private Long lastEditedBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }
    public Integer getEditCount() { return editCount; }
    public void setEditCount(Integer editCount) { this.editCount = editCount; }
    public LocalDateTime getLastEditedAt() { return lastEditedAt; }
    public void setLastEditedAt(LocalDateTime lastEditedAt) { this.lastEditedAt = lastEditedAt; }
    public Long getLastEditedBy() { return lastEditedBy; }
    public void setLastEditedBy(Long lastEditedBy) { this.lastEditedBy = lastEditedBy; }

    public void incrementEditCount() {
        this.editCount++;
        this.lastEditedAt = LocalDateTime.now();
    }
}
