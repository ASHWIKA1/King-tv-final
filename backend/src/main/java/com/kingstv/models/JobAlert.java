package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_alerts")
public class JobAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    private String email;

    @Column(name = "search_keyword")
    private String searchKeyword;

    private String category;
    private String location;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSearchKeyword() { return searchKeyword; }
    public void setSearchKeyword(String searchKeyword) { this.searchKeyword = searchKeyword; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
