package com.kingstv.models;

import jakarta.persistence.*;

@Entity
@Table(name = "classified_images")
public class ClassifiedImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "classified_id", nullable = false)
    private Long classifiedId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClassifiedId() { return classifiedId; }
    public void setClassifiedId(Long classifiedId) { this.classifiedId = classifiedId; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
