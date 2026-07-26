package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "local_business_directory")
public class DirectoryListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listing_id")
    private Long id;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String category;

    @Column(name = "address_locality", nullable = false)
    private String addressLocality;

    @Column(name = "address_street", nullable = false)
    private String addressStreet;

    @Column(name = "working_hours")
    private String workingHours;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private String status = "active";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "cover_url")
    private String coverUrl;

    private Double latitude;
    private Double longitude;

    private String email;
    private String website;
    private String facebook;
    private String twitter;
    private String instagram;
    private String linkedin;

    @Column(name = "rating_avg")
    private Double ratingAvg = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_premium")
    private Boolean isPremium = false;

    @Column(name = "kyc_status")
    private String kycStatus = "pending";

    @Column(name = "kyc_document_url")
    private String kycDocumentUrl;

    @Column(name = "subscription_status")
    private String subscriptionStatus = "free";

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAddressLocality() { return addressLocality; }
    public void setAddressLocality(String addressLocality) { this.addressLocality = addressLocality; }
    public String getAddressStreet() { return addressStreet; }
    public void setAddressStreet(String addressStreet) { this.addressStreet = addressStreet; }
    public String getWorkingHours() { return workingHours; }
    public void setWorkingHours(String workingHours) { this.workingHours = workingHours; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getFacebook() { return facebook; }
    public void setFacebook(String facebook) { this.facebook = facebook; }
    public String getTwitter() { return twitter; }
    public void setTwitter(String twitter) { this.twitter = twitter; }
    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }
    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }
    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }
    public String getSubscriptionStatus() { return subscriptionStatus; }
    public void setSubscriptionStatus(String subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }
    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getKycDocumentUrl() { return kycDocumentUrl; }
    public void setKycDocumentUrl(String kycDocumentUrl) { this.kycDocumentUrl = kycDocumentUrl; }
}
