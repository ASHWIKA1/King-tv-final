package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "font_config")
public class FontConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "font_role", nullable = false, unique = true, length = 30)
    private String fontRole;

    @Column(name = "font_family", nullable = false, length = 200)
    private String fontFamily;

    @Column(name = "font_source", length = 30)
    private String fontSource = "GOOGLE";

    @Column(name = "font_weight", length = 50)
    private String fontWeight = "400";

    @Column(name = "font_url", length = 500)
    private String fontUrl;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onSave() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFontRole() { return fontRole; }
    public void setFontRole(String fontRole) { this.fontRole = fontRole; }
    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
    public String getFontSource() { return fontSource; }
    public void setFontSource(String fontSource) { this.fontSource = fontSource; }
    public String getFontWeight() { return fontWeight; }
    public void setFontWeight(String fontWeight) { this.fontWeight = fontWeight; }
    public String getFontUrl() { return fontUrl; }
    public void setFontUrl(String fontUrl) { this.fontUrl = fontUrl; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
