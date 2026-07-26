package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nfc_tap_history")
public class NfcTapHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "card_id", nullable = false)
    private Long cardId;

    @Column(name = "tap_type", nullable = false)
    private String tapType; // payment, profile

    private Double amount = 0.0;

    @Column(nullable = false)
    private String status = "success"; // success, failed

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "location_city")
    private String locationCity;

    @Column(name = "tapped_at")
    private LocalDateTime tappedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCardId() { return cardId; }
    public void setCardId(Long cardId) { this.cardId = cardId; }

    public String getTapType() { return tapType; }
    public void setTapType(String tapType) { this.tapType = tapType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getLocationCity() { return locationCity; }
    public void setLocationCity(String locationCity) { this.locationCity = locationCity; }

    public LocalDateTime getTappedAt() { return tappedAt; }
    public void setTappedAt(LocalDateTime tappedAt) { this.tappedAt = tappedAt; }
}
