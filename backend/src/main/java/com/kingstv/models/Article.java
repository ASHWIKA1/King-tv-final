package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private Long id;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "subcategory_id")
    private Long subcategoryId;

    @Column(name = "district_id")
    private Long districtId;

    @Column(name = "constituency")
    private String constituency;

    @Column(name = "title_ta", nullable = false)
    private String titleTa;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "content_ta", nullable = false, columnDefinition = "TEXT")
    private String contentTa;

    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;

    @Column(name = "short_desc_ta", columnDefinition = "TEXT")
    private String shortDescTa;

    @Column(name = "short_desc_en", columnDefinition = "TEXT")
    private String shortDescEn;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(nullable = false)
    private String status = "published";

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    // --- SEO & Google News Extension Fields ---
    @Column(name = "meta_title")
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Column(name = "meta_keywords")
    private String metaKeywords;

    @Column(name = "focus_keywords")
    private String focusKeywords;

    @Column(unique = true)
    private String slug;

    @Column(name = "canonical_url")
    private String canonicalUrl;

    @Column(name = "featured_image")
    private String featuredImage;

    @Column(name = "author_name")
    private String authorName = "Kings TV News Desk";

    @Column(name = "seo_status")
    private String seoStatus = "ready";

    @Column(name = "reporter_name")
    private String reporterName;

    @Column(name = "readability_score")
    private Integer readabilityScore;

    @Column(name = "seo_score")
    private Integer seoScore;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // --- GPS Location Visibility ---
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "visibility_radius_km")
    private Double visibilityRadiusKm;

    @Column(name = "telegram_sent")
    private Boolean telegramSent = false;

    @Column(name = "reading_time")
    private Integer readingTime = 1;

    @Column(name = "priority_score")
    private Double priorityScore = 0.0;

    @Column(name = "show_right_column")
    private Boolean showRightColumn = true;

    @Column(name = "is_plugged_in")
    private Boolean isPluggedIn = false;

    @Column(name = "featured_category")
    private String featuredCategory;

    @Transient
    private String authorProfileImage;

    @Transient
    private String structuredDataJson;

    @PrePersist
    protected void onCreate() {
        this.publishedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.readingTime = calculateReadingTime();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.readingTime = calculateReadingTime();
    }

    private int calculateReadingTime() {
        int wordsTa = 0;
        int wordsEn = 0;
        if (contentTa != null && !contentTa.trim().isEmpty()) {
            wordsTa = contentTa.trim().split("\\s+").length;
        }
        if (contentEn != null && !contentEn.trim().isEmpty()) {
            wordsEn = contentEn.trim().split("\\s+").length;
        }
        double timeTa = wordsTa / 130.0;
        double timeEn = wordsEn / 200.0;
        double maxTime = Math.max(timeTa, timeEn);
        return Math.max(1, (int) Math.ceil(maxTime));
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(Long subcategoryId) { this.subcategoryId = subcategoryId; }
    public Long getDistrictId() { return districtId; }
    public void setDistrictId(Long districtId) { this.districtId = districtId; }
    public String getConstituency() { return constituency; }
    public void setConstituency(String constituency) { this.constituency = constituency; }
    public String getTitleTa() { return titleTa; }
    public void setTitleTa(String titleTa) { this.titleTa = titleTa; }
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getContentTa() { return contentTa; }
    public void setContentTa(String contentTa) { this.contentTa = contentTa; }
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    public String getShortDescTa() { return shortDescTa; }
    public void setShortDescTa(String shortDescTa) { this.shortDescTa = shortDescTa; }
    public String getShortDescEn() { return shortDescEn; }
    public void setShortDescEn(String shortDescEn) { this.shortDescEn = shortDescEn; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    // SEO Getters/Setters
    public String getMetaTitle() { return metaTitle; }
    public void setMetaTitle(String metaTitle) { this.metaTitle = metaTitle; }
    public String getMetaDescription() { return metaDescription; }
    public void setMetaDescription(String metaDescription) { this.metaDescription = metaDescription; }
    public String getMetaKeywords() { return metaKeywords; }
    public void setMetaKeywords(String metaKeywords) { this.metaKeywords = metaKeywords; }
    public String getFocusKeywords() { return focusKeywords; }
    public void setFocusKeywords(String focusKeywords) { this.focusKeywords = focusKeywords; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getCanonicalUrl() { return canonicalUrl; }
    public void setCanonicalUrl(String canonicalUrl) { this.canonicalUrl = canonicalUrl; }
    public String getFeaturedImage() { return featuredImage; }
    public void setFeaturedImage(String featuredImage) { this.featuredImage = featuredImage; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getSeoStatus() { return seoStatus; }
    public void setSeoStatus(String seoStatus) { this.seoStatus = seoStatus; }
    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public Integer getReadabilityScore() { return readabilityScore; }
    public void setReadabilityScore(Integer readabilityScore) { this.readabilityScore = readabilityScore; }
    public Integer getSeoScore() { return seoScore; }
    public void setSeoScore(Integer seoScore) { this.seoScore = seoScore; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getVisibilityRadiusKm() { return visibilityRadiusKm; }
    public void setVisibilityRadiusKm(Double visibilityRadiusKm) { this.visibilityRadiusKm = visibilityRadiusKm; }

    public String getStructuredDataJson() { return structuredDataJson; }
    public void setStructuredDataJson(String structuredDataJson) { this.structuredDataJson = structuredDataJson; }

    public Integer getReadingTime() { return readingTime; }
    public void setReadingTime(Integer readingTime) { this.readingTime = readingTime; }

    public String getAuthorProfileImage() { return authorProfileImage; }
    public void setAuthorProfileImage(String authorProfileImage) { this.authorProfileImage = authorProfileImage; }

    public Boolean getTelegramSent() { return telegramSent != null && telegramSent; }
    public void setTelegramSent(Boolean telegramSent) { this.telegramSent = telegramSent; }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }

    public Boolean getShowRightColumn() { return showRightColumn != null ? showRightColumn : true; }
    public void setShowRightColumn(Boolean showRightColumn) { this.showRightColumn = showRightColumn; }

    public Boolean getIsPluggedIn() { return isPluggedIn != null ? isPluggedIn : false; }
    public void setIsPluggedIn(Boolean isPluggedIn) { this.isPluggedIn = isPluggedIn; }

    public String getFeaturedCategory() { return featuredCategory; }
    public void setFeaturedCategory(String featuredCategory) { this.featuredCategory = featuredCategory; }
}
