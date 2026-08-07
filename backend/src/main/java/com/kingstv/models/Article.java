package com.kingstv.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "articles")
public class Article implements Serializable {
    private static final long serialVersionUID = 1L;

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

    @Column(name = "title_ta", nullable = false, columnDefinition = "TEXT")
    private String titleTa;

    @Column(name = "title_en", columnDefinition = "TEXT")
    private String titleEn;

    @Column(name = "content_ta", nullable = false, columnDefinition = "TEXT")
    private String contentTa;

    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;

    @Column(name = "short_desc_ta", columnDefinition = "TEXT")
    private String shortDescTa;

    @Column(name = "short_desc_en", columnDefinition = "TEXT")
    private String shortDescEn;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(nullable = false)
    private String status = "published";

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    // --- SEO & Google News Extension Fields ---
    @Column(name = "meta_title", columnDefinition = "TEXT")
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Column(name = "meta_keywords", columnDefinition = "TEXT")
    private String metaKeywords;

    @Column(name = "focus_keywords", columnDefinition = "TEXT")
    private String focusKeywords;

    @Column(unique = true)
    private String slug;

    @Column(name = "canonical_url", columnDefinition = "TEXT")
    private String canonicalUrl;

    @Column(name = "featured_image", columnDefinition = "TEXT")
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

    // --- Article Locking ---
    @Column(name = "locked_by_user_id")
    private Long lockedByUserId;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "lock_expires_at")
    private LocalDateTime lockExpiresAt;

    // --- Scheduling & Embargo ---
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "embargoed_until")
    private LocalDateTime embargoedUntil;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // --- Editorial Metadata ---
    @Column(name = "fact_check_status")
    private String factCheckStatus = "NOT_CHECKED";

    @Column(name = "fact_check_note", columnDefinition = "TEXT")
    private String factCheckNote;

    @Column(name = "requires_legal_review")
    private Boolean requiresLegalReview = false;

    @Column(name = "legal_cleared_at")
    private LocalDateTime legalClearedAt;

    @Column(name = "content_type")
    private String contentType = "NEWS";

    @Column(name = "is_breaking")
    private Boolean isBreaking = false;

    @Column(name = "is_premium")
    private Boolean isPremium = false;

    @Column(name = "is_sponsored")
    private Boolean isSponsored = false;

    @Column(name = "sponsor_name")
    private String sponsorName;

    // --- AI Disclosure ---
    @Column(name = "is_ai_generated")
    private Boolean isAiGenerated = false;

    @Column(name = "is_ai_assisted")
    private Boolean isAiAssisted = false;

    // --- Revision Tracking ---
    @Column(name = "revision_number")
    private Integer revisionNumber = 1;

    // --- Correction ---
    @Column(name = "last_corrected_at")
    private LocalDateTime lastCorrectedAt;

    @Column(name = "correction_note", columnDefinition = "TEXT")
    private String correctionNote;

    // --- Social / OG Metadata ---
    @Column(name = "og_image")
    private String ogImage;

    @Column(name = "og_title")
    private String ogTitle;

    @Column(name = "og_description", columnDefinition = "TEXT")
    private String ogDescription;

    @Transient
    private String authorProfileImage;

    @Transient
    private String structuredDataJson;

    @Transient
    private String subCategoryName;

    @Transient
    private String subCategoryNameTa;

    @Transient
    private String subCategorySlug;

    @Transient
    private String categoryName;

    @Transient
    private String categoryNameTa;

    @Transient
    private String categorySlug;

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

    public Integer getViewsCount() { return viewsCount != null ? viewsCount : 0; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

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
    @com.fasterxml.jackson.annotation.JsonProperty("imageUrl")
    public String getImageUrl() {
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            return imageUrl;
        }
        return featuredImage;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        if (this.featuredImage == null || this.featuredImage.trim().isEmpty()) {
            this.featuredImage = imageUrl;
        }
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getFeaturedImage() {
        if (featuredImage != null && !featuredImage.trim().isEmpty()) {
            return featuredImage;
        }
        return imageUrl;
    }

    public void setFeaturedImage(String featuredImage) {
        this.featuredImage = featuredImage;
        if (this.imageUrl == null || this.imageUrl.trim().isEmpty()) {
            this.imageUrl = featuredImage;
        }
    }

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

    // --- Locking ---
    public Long getLockedByUserId() { return lockedByUserId; }
    public void setLockedByUserId(Long lockedByUserId) { this.lockedByUserId = lockedByUserId; }
    public LocalDateTime getLockedAt() { return lockedAt; }
    public void setLockedAt(LocalDateTime lockedAt) { this.lockedAt = lockedAt; }
    public LocalDateTime getLockExpiresAt() { return lockExpiresAt; }
    public void setLockExpiresAt(LocalDateTime lockExpiresAt) { this.lockExpiresAt = lockExpiresAt; }

    // --- Scheduling ---
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public LocalDateTime getEmbargoedUntil() { return embargoedUntil; }
    public void setEmbargoedUntil(LocalDateTime embargoedUntil) { this.embargoedUntil = embargoedUntil; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    // --- Editorial ---
    public String getFactCheckStatus() { return factCheckStatus; }
    public void setFactCheckStatus(String factCheckStatus) { this.factCheckStatus = factCheckStatus; }
    public String getFactCheckNote() { return factCheckNote; }
    public void setFactCheckNote(String factCheckNote) { this.factCheckNote = factCheckNote; }
    public Boolean getRequiresLegalReview() { return requiresLegalReview != null ? requiresLegalReview : false; }
    public void setRequiresLegalReview(Boolean requiresLegalReview) { this.requiresLegalReview = requiresLegalReview; }
    public LocalDateTime getLegalClearedAt() { return legalClearedAt; }
    public void setLegalClearedAt(LocalDateTime legalClearedAt) { this.legalClearedAt = legalClearedAt; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Boolean getIsBreaking() { return isBreaking != null ? isBreaking : false; }
    public void setIsBreaking(Boolean isBreaking) { this.isBreaking = isBreaking; }
    public Boolean getIsPremium() { return isPremium != null ? isPremium : false; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }
    public Boolean getIsSponsored() { return isSponsored != null ? isSponsored : false; }
    public void setIsSponsored(Boolean isSponsored) { this.isSponsored = isSponsored; }
    public String getSponsorName() { return sponsorName; }
    public void setSponsorName(String sponsorName) { this.sponsorName = sponsorName; }

    // --- AI Disclosure ---
    public Boolean getIsAiGenerated() { return isAiGenerated != null ? isAiGenerated : false; }
    public void setIsAiGenerated(Boolean isAiGenerated) { this.isAiGenerated = isAiGenerated; }
    public Boolean getIsAiAssisted() { return isAiAssisted != null ? isAiAssisted : false; }
    public void setIsAiAssisted(Boolean isAiAssisted) { this.isAiAssisted = isAiAssisted; }

    // --- Revision ---
    public Integer getRevisionNumber() { return revisionNumber != null ? revisionNumber : 1; }
    public void setRevisionNumber(Integer revisionNumber) { this.revisionNumber = revisionNumber; }

    // --- Correction ---
    public LocalDateTime getLastCorrectedAt() { return lastCorrectedAt; }
    public void setLastCorrectedAt(LocalDateTime lastCorrectedAt) { this.lastCorrectedAt = lastCorrectedAt; }
    public String getCorrectionNote() { return correctionNote; }
    public void setCorrectionNote(String correctionNote) { this.correctionNote = correctionNote; }

    // --- OG / Social ---
    public String getOgImage() { return ogImage; }
    public void setOgImage(String ogImage) { this.ogImage = ogImage; }
    public String getOgTitle() { return ogTitle; }
    public void setOgTitle(String ogTitle) { this.ogTitle = ogTitle; }
    public String getOgDescription() { return ogDescription; }
    public void setOgDescription(String ogDescription) { this.ogDescription = ogDescription; }

    public String getSubCategoryName() { return subCategoryName; }
    public void setSubCategoryName(String subCategoryName) { this.subCategoryName = subCategoryName; }
    public String getSubCategoryNameTa() { return subCategoryNameTa; }
    public void setSubCategoryNameTa(String subCategoryNameTa) { this.subCategoryNameTa = subCategoryNameTa; }
    public String getSubCategorySlug() { return subCategorySlug; }
    public void setSubCategorySlug(String subCategorySlug) { this.subCategorySlug = subCategorySlug; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getCategoryNameTa() { return categoryNameTa; }
    public void setCategoryNameTa(String categoryNameTa) { this.categoryNameTa = categoryNameTa; }
    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }
}

