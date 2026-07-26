package com.kingstv.models;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "name_ta", nullable = false)
    private String nameTa;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "icon")
    private String icon;

    @Column(name = "color")
    private String color = "#3B82F6";

    @Column(name = "is_nav")
    private Boolean isNav = true;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameTa() { return nameTa; }
    public void setNameTa(String nameTa) { this.nameTa = nameTa; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Boolean getIsNav() { return isNav; }
    public void setIsNav(Boolean isNav) { this.isNav = isNav; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
