package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "page_contents")
public class PageContent {
    @Id
    @Column(name = "page_key", length = 50)
    private String pageKey;

    @Column(name = "title_ta", nullable = false)
    private String titleTa;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "content_ta", columnDefinition = "TEXT")
    private String contentTa;

    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "contact_address", columnDefinition = "TEXT")
    private String contactAddress;

    @Column(name = "google_map_url", columnDefinition = "TEXT")
    private String googleMapUrl;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getPageKey() { return pageKey; }
    public void setPageKey(String pageKey) { this.pageKey = pageKey; }
    public String getTitleTa() { return titleTa; }
    public void setTitleTa(String titleTa) { this.titleTa = titleTa; }
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getContentTa() { return contentTa; }
    public void setContentTa(String contentTa) { this.contentTa = contentTa; }
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactAddress() { return contactAddress; }
    public void setContactAddress(String contactAddress) { this.contactAddress = contactAddress; }
    public String getGoogleMapUrl() { return googleMapUrl; }
    public void setGoogleMapUrl(String googleMapUrl) { this.googleMapUrl = googleMapUrl; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
