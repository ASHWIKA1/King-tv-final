package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "jobs")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String uuid = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private JobCategory categoryObj;

    @Column(nullable = false)
    private String title;

    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(name = "required_skills")
    private String requiredSkills; // comma separated skills

    @Column(name = "preferred_skills")
    private String preferredSkills;

    @Column(name = "experience_min")
    private Integer experienceMin = 0;

    @Column(name = "experience_max")
    private Integer experienceMax = 10;

    @Column(name = "salary_min")
    private Double salaryMin = 3.0;

    @Column(name = "salary_max")
    private Double salaryMax = 12.0;

    @Column(name = "employment_type")
    private String employmentType = "Full Time"; // Full Time, Part Time, Internship

    @Column(name = "work_mode")
    private String workMode = "Work From Office"; // Remote, Hybrid, Work From Office

    private Integer vacancies = 1;

    @Column(name = "district_id")
    private Long districtId;

    @Column(name = "taluk_id")
    private Long talukId;

    @Column(name = "state_id")
    private Long stateId;

    private Double latitude;
    private Double longitude;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(nullable = false)
    private String status = "active"; // active, closed, draft

    private Boolean featured = false;

    @Column(name = "recruiter_id")
    private Long recruiterId;

    @Column(name = "applicant_count")
    private Integer applicantCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Boolean deleted = false;

    // Compatibility fields to store old strings from DataInitializer
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "location")
    private String location;

    @Column(name = "category_name")
    private String categoryName;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        if (uuid == null) {
            uuid = UUID.randomUUID().toString();
        }
        if (slug == null && title != null) {
            slug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        }
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public JobCategory getCategoryObj() { return categoryObj; }
    public void setCategoryObj(JobCategory categoryObj) { this.categoryObj = categoryObj; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public Integer getExperienceMin() { return experienceMin; }
    public void setExperienceMin(Integer experienceMin) { this.experienceMin = experienceMin; }

    public Integer getExperienceMax() { return experienceMax; }
    public void setExperienceMax(Integer experienceMax) { this.experienceMax = experienceMax; }

    public Double getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Double salaryMin) { this.salaryMin = salaryMin; }

    public Double getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Double salaryMax) { this.salaryMax = salaryMax; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public Integer getVacancies() { return vacancies; }
    public void setVacancies(Integer vacancies) { this.vacancies = vacancies; }

    public Long getDistrictId() { return districtId; }
    public void setDistrictId(Long districtId) { this.districtId = districtId; }

    public Long getTalukId() { return talukId; }
    public void setTalukId(Long talukId) { this.talukId = talukId; }

    public Long getStateId() { return stateId; }
    public void setStateId(Long stateId) { this.stateId = stateId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public Integer getApplicantCount() { return applicantCount; }
    public void setApplicantCount(Integer applicantCount) { this.applicantCount = applicantCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    // Compatibility getters & setters
    public String getCompanyName() {
        return company != null ? company.getCompanyName() : companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSalaryRange() {
        return salaryMin != null ? "₹ " + salaryMin + " - " + salaryMax + " LPA" : salaryRange;
    }
    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public String getLocation() {
        return company != null ? company.getAddress() : location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return categoryObj != null ? categoryObj.getSlug() : categoryName;
    }
    public void setCategory(String category) {
        this.categoryName = category;
    }
}
