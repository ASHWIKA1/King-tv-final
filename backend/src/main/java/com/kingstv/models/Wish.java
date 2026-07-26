package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wish")
public class Wish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String uuid = UUID.randomUUID().toString();

    @Column(name = "recipient_name", nullable = false)
    private String recipientName;

    @Column(name = "recipient_photo")
    private String recipientPhoto;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(name = "sender_profile")
    private String senderProfile;

    private String relationship;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private WishCategory category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "district_id")
    private District district;

    @Column(name = "taluk_id")
    private Long talukId;

    private String pincode;
    private Double latitude;
    private Double longitude;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "frame_template_id")
    private WishFrameTemplate frameTemplate;

    @Column(name = "scheduled_publish_at")
    private LocalDateTime scheduledPublishAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    @Column(nullable = false)
    private String status = "published";

    @Column(name = "is_sponsored")
    private Boolean isSponsored = false;

    @Column(name = "sponsor_name")
    private String sponsorName;

    @Column(name = "sponsor_logo")
    private String sponsorLogo;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "reaction_count")
    private Integer reactionCount = 0;

    @Column(name = "comment_count")
    private Integer commentCount = 0;

    @Column(name = "share_count")
    private Integer shareCount = 0;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Boolean deleted = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientPhoto() { return recipientPhoto; }
    public void setRecipientPhoto(String recipientPhoto) { this.recipientPhoto = recipientPhoto; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderProfile() { return senderProfile; }
    public void setSenderProfile(String senderProfile) { this.senderProfile = senderProfile; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public WishCategory getCategory() { return category; }
    public void setCategory(WishCategory category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public District getDistrict() { return district; }
    public void setDistrict(District district) { this.district = district; }

    public Long getTalukId() { return talukId; }
    public void setTalukId(Long talukId) { this.talukId = talukId; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public WishFrameTemplate getFrameTemplate() { return frameTemplate; }
    public void setFrameTemplate(WishFrameTemplate frameTemplate) { this.frameTemplate = frameTemplate; }

    public LocalDateTime getScheduledPublishAt() { return scheduledPublishAt; }
    public void setScheduledPublishAt(LocalDateTime scheduledPublishAt) { this.scheduledPublishAt = scheduledPublishAt; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsSponsored() { return isSponsored; }
    public void setIsSponsored(Boolean isSponsored) { this.isSponsored = isSponsored; }

    public String getSponsorName() { return sponsorName; }
    public void setSponsorName(String sponsorName) { this.sponsorName = sponsorName; }

    public String getSponsorLogo() { return sponsorLogo; }
    public void setSponsorLogo(String sponsorLogo) { this.sponsorLogo = sponsorLogo; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public Integer getReactionCount() { return reactionCount; }
    public void setReactionCount(Integer reactionCount) { this.reactionCount = reactionCount; }

    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }

    public Integer getShareCount() { return shareCount; }
    public void setShareCount(Integer shareCount) { this.shareCount = shareCount; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }
}
