package com.kingstv.models;

import jakarta.persistence.*;

@Entity
@Table(name = "obituary_gallery")
public class ObituaryGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "obituary_id", nullable = false)
    private Long obituaryId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getObituaryId() { return obituaryId; }
    public void setObituaryId(Long obituaryId) { this.obituaryId = obituaryId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
