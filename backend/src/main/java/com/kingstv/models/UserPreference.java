package com.kingstv.models;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreference {
    @Id
    @Column(name = "user_id")
    private Long userId;

    private String theme = "light";

    @Column(name = "primary_color")
    private String primaryColor = "#0057FF";

    @Column(name = "font_size")
    private String fontSize = "medium";

    @Column(name = "widget_width")
    private Integer widgetWidth = 640;

    @Column(name = "slide_speed")
    private Integer slideSpeed = 8;

    private String language = "ta";

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
    public String getFontSize() { return fontSize; }
    public void setFontSize(String fontSize) { this.fontSize = fontSize; }
    public Integer getWidgetWidth() { return widgetWidth; }
    public void setWidgetWidth(Integer widgetWidth) { this.widgetWidth = widgetWidth; }
    public Integer getSlideSpeed() { return slideSpeed; }
    public void setSlideSpeed(Integer slideSpeed) { this.slideSpeed = slideSpeed; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
