package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sub_categories")
public class SubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subcategory_id")
    private Long subcategoryId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_ta", nullable = false)
    private String nameTa;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private String status = "active";

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(Long subcategoryId) { this.subcategoryId = subcategoryId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameTa() { return nameTa; }
    public void setNameTa(String nameTa) { this.nameTa = nameTa; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
