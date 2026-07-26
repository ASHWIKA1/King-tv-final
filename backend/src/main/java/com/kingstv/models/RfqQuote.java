package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rfq_quotes")
public class RfqQuote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rfq_id", nullable = false)
    private Long rfqId;

    @Column(name = "seller_business_id", nullable = false)
    private Long sellerBusinessId;

    @Column(name = "quoted_price", nullable = false)
    private Double quotedPrice;

    @Column(name = "timeline_days", nullable = false)
    private Integer timelineDays;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "proposal_url")
    private String proposalUrl;

    @Column(nullable = false)
    private String status = "pending"; // pending, shortlisted, accepted, rejected, awarded

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

    public Long getRfqId() { return rfqId; }
    public void setRfqId(Long rfqId) { this.rfqId = rfqId; }

    public Long getSellerBusinessId() { return sellerBusinessId; }
    public void setSellerBusinessId(Long sellerBusinessId) { this.sellerBusinessId = sellerBusinessId; }

    public Double getQuotedPrice() { return quotedPrice; }
    public void setQuotedPrice(Double quotedPrice) { this.quotedPrice = quotedPrice; }

    public Integer getTimelineDays() { return timelineDays; }
    public void setTimelineDays(Integer timelineDays) { this.timelineDays = timelineDays; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getProposalUrl() { return proposalUrl; }
    public void setProposalUrl(String proposalUrl) { this.proposalUrl = proposalUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
