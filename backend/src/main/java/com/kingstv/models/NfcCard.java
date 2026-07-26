package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nfc_cards")
public class NfcCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @Column(name = "short_code", nullable = false, unique = true)
    private String shortCode;

    @Column(name = "link_type", nullable = false)
    private String linkType = "profile"; // payment, profile

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "is_payment_enabled")
    private Boolean isPaymentEnabled = false;

    @Column(name = "card_status", nullable = false)
    private String cardStatus = "requested"; // requested, printing, shipped, activated, blocked, reissued

    @Column(name = "upi_name")
    private String upiName;

    @Column(name = "otp_hash")
    private String otpHash;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "processing_at")
    private LocalDateTime processingAt;

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public String getLinkType() { return linkType; }
    public void setLinkType(String linkType) { this.linkType = linkType; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public Boolean getIsPaymentEnabled() { return isPaymentEnabled; }
    public void setIsPaymentEnabled(Boolean isPaymentEnabled) { this.isPaymentEnabled = isPaymentEnabled; }

    public String getCardStatus() { return cardStatus; }
    public void setCardStatus(String cardStatus) { this.cardStatus = cardStatus; }

    public String getUpiName() { return upiName; }
    public void setUpiName(String upiName) { this.upiName = upiName; }

    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getProcessingAt() { return processingAt; }
    public void setProcessingAt(LocalDateTime processingAt) { this.processingAt = processingAt; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
