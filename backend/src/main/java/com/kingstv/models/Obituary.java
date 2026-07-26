package com.kingstv.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "local_obituaries")
public class Obituary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "obit_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String uuid = UUID.randomUUID().toString();

    @Column(name = "deceased_name", nullable = false)
    private String deceasedName;

    private String photo;

    @Column(nullable = false)
    private Integer age;

    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "date_of_passing")
    private LocalDate dateOfPassing;

    // Demise date column maps to date_of_passing for backwards compatibility
    @Column(name = "demise_date")
    private LocalDate demiseDate;

    private String religion;

    @Column(name = "native_place")
    private String nativePlace;

    @Column(nullable = false)
    private String location = "Tamil Nadu"; // Fallback for backwards compatibility

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "district_id")
    private District district;

    @Column(name = "taluk_id")
    private Long talukId;

    private String pincode;
    private Double latitude;
    private Double longitude;

    @Column(name = "funeral_datetime")
    private LocalDateTime funeralDatetime;

    @Column(name = "funeral_venue")
    private String funeralVenue;

    // Funeral details column maps for backwards compatibility
    @Column(name = "funeral_details", columnDefinition = "TEXT")
    private String funeralDetails;

    @Column(name = "map_link")
    private String mapLink;

    @Column(name = "family_contact_name")
    private String familyContactName;

    @Column(name = "family_phone")
    private String familyPhone;

    @Column(name = "poster_relationship")
    private String posterRelationship;

    @Column(columnDefinition = "TEXT")
    private String biography;

    // Short description column maps for backwards compatibility
    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "frame_template_id")
    private ObituaryFrameTemplate frameTemplate;

    @Column(name = "tribute_count")
    private Integer tributeCount = 0;

    @Column(name = "guestbook_count")
    private Integer guestbookCount = 0;

    @Column(name = "report_count")
    private Integer reportCount = 0;

    @JsonIgnore
    @Column(name = "submitter_contact")
    private String submitterContact;

    @JsonIgnore
    @Column(name = "proof_document")
    private String proofDocument;

    @Column(nullable = false)
    private String status = "published";

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "is_celebrity")
    private Boolean isCelebrity = false;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Boolean deleted = false;

    @PrePersist
    @PreUpdate
    public void syncCompatibleFields() {
        if (this.uuid == null) {
            this.uuid = UUID.randomUUID().toString();
        }
        if (this.dateOfPassing != null) {
            this.demiseDate = this.dateOfPassing;
        } else if (this.demiseDate != null) {
            this.dateOfPassing = this.demiseDate;
        }
        if (this.biography != null && !this.biography.trim().isEmpty()) {
            this.shortDescription = this.biography;
        } else if (this.shortDescription != null && !this.shortDescription.trim().isEmpty()) {
            this.biography = this.shortDescription;
        }
        if (this.funeralDatetime != null && this.funeralVenue != null) {
            this.funeralDetails = this.funeralDatetime.toString() + " at " + this.funeralVenue;
        } else if (this.funeralDetails != null && !this.funeralDetails.trim().isEmpty()) {
            this.funeralVenue = this.funeralDetails;
        }
        if (this.district != null) {
            this.location = this.district.getNameEn();
        }
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }

    public String getDeceasedName() { return deceasedName; }
    public void setDeceasedName(String deceasedName) { this.deceasedName = deceasedName; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public LocalDate getDateOfPassing() { return dateOfPassing; }
    public void setDateOfPassing(LocalDate dateOfPassing) { this.dateOfPassing = dateOfPassing; }

    public LocalDate getDemiseDate() { return demiseDate; }
    public void setDemiseDate(LocalDate demiseDate) { this.demiseDate = demiseDate; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getNativePlace() { return nativePlace; }
    public void setNativePlace(String nativePlace) { this.nativePlace = nativePlace; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

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

    public LocalDateTime getFuneralDatetime() { return funeralDatetime; }
    public void setFuneralDatetime(LocalDateTime funeralDatetime) { this.funeralDatetime = funeralDatetime; }

    public String getFuneralVenue() { return funeralVenue; }
    public void setFuneralVenue(String funeralVenue) { this.funeralVenue = funeralVenue; }

    public String getFuneralDetails() { return funeralDetails; }
    public void setFuneralDetails(String funeralDetails) { this.funeralDetails = funeralDetails; }

    public String getMapLink() { return mapLink; }
    public void setMapLink(String mapLink) { this.mapLink = mapLink; }

    public String getFamilyContactName() { return familyContactName; }
    public void setFamilyContactName(String familyContactName) { this.familyContactName = familyContactName; }

    public String getFamilyPhone() { return familyPhone; }
    public void setFamilyPhone(String familyPhone) { this.familyPhone = familyPhone; }

    public String getPosterRelationship() { return posterRelationship; }
    public void setPosterRelationship(String posterRelationship) { this.posterRelationship = posterRelationship; }

    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public ObituaryFrameTemplate getFrameTemplate() { return frameTemplate; }
    public void setFrameTemplate(ObituaryFrameTemplate frameTemplate) { this.frameTemplate = frameTemplate; }

    public Integer getTributeCount() { return tributeCount; }
    public void setTributeCount(Integer tributeCount) { this.tributeCount = tributeCount; }

    public Integer getGuestbookCount() { return guestbookCount; }
    public void setGuestbookCount(Integer guestbookCount) { this.guestbookCount = guestbookCount; }

    public Integer getReportCount() { return reportCount; }
    public void setReportCount(Integer reportCount) { this.reportCount = reportCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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

    public Boolean getIsCelebrity() { return isCelebrity; }
    public void setIsCelebrity(Boolean isCelebrity) { this.isCelebrity = isCelebrity; }

    public String getSubmitterContact() { return submitterContact; }
    public void setSubmitterContact(String submitterContact) { this.submitterContact = submitterContact; }

    public String getProofDocument() { return proofDocument; }
    public void setProofDocument(String proofDocument) { this.proofDocument = proofDocument; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
