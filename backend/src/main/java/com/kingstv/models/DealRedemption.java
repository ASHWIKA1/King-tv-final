package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deal_redemptions")
public class DealRedemption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "deal_id", nullable = false)
    private Long dealId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "redemption_code", nullable = false, unique = true)
    private String redemptionCode;

    @Column(nullable = false)
    private String status = "active"; // active, used, expired

    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDealId() { return dealId; }
    public void setDealId(Long dealId) { this.dealId = dealId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getRedemptionCode() { return redemptionCode; }
    public void setRedemptionCode(String redemptionCode) { this.redemptionCode = redemptionCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRedeemedAt() { return redeemedAt; }
    public void setRedeemedAt(LocalDateTime redeemedAt) { this.redeemedAt = redeemedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
