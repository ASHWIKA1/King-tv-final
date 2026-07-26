package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wish_frame_templates")
public class WishFrameTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "background_url")
    private String backgroundUrl;

    @Column(name = "overlay_url")
    private String overlayUrl;

    @Column(name = "border_color")
    private String borderColor;

    @Column(name = "text_color")
    private String textColor;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Boolean deleted = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBackgroundUrl() { return backgroundUrl; }
    public void setBackgroundUrl(String backgroundUrl) { this.backgroundUrl = backgroundUrl; }

    public String getOverlayUrl() { return overlayUrl; }
    public void setOverlayUrl(String overlayUrl) { this.overlayUrl = overlayUrl; }

    public String getBorderColor() { return borderColor; }
    public void setBorderColor(String borderColor) { this.borderColor = borderColor; }

    public String getTextColor() { return textColor; }
    public void setTextColor(String textColor) { this.textColor = textColor; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
