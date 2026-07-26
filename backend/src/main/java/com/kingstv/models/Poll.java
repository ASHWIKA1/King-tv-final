package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "polls")
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(name = "question_ta", nullable = false)
    private String questionTa;

    @Column(nullable = false)
    private String option1;

    @Column(name = "option1_ta", nullable = false)
    private String option1Ta;

    @Column(name = "option1_votes")
    private Integer option1Votes = 0;

    @Column(nullable = false)
    private String option2;

    @Column(name = "option2_ta", nullable = false)
    private String option2Ta;

    @Column(name = "option2_votes")
    private Integer option2Votes = 0;

    private String option3;

    @Column(name = "option3_ta")
    private String option3Ta;

    @Column(name = "option3_votes")
    private Integer option3Votes = 0;

    @Column(nullable = false)
    private String status = "active"; // active, closed, deleted

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getQuestionTa() { return questionTa; }
    public void setQuestionTa(String questionTa) { this.questionTa = questionTa; }

    public String getOption1() { return option1; }
    public void setOption1(String option1) { this.option1 = option1; }

    public String getOption1Ta() { return option1Ta; }
    public void setOption1Ta(String option1Ta) { this.option1Ta = option1Ta; }

    public Integer getOption1Votes() { return option1Votes; }
    public void setOption1Votes(Integer option1Votes) { this.option1Votes = option1Votes; }

    public String getOption2() { return option2; }
    public void setOption2(String option2) { this.option2 = option2; }

    public String getOption2Ta() { return option2Ta; }
    public void setOption2Ta(String option2Ta) { this.option2Ta = option2Ta; }

    public Integer getOption2Votes() { return option2Votes; }
    public void setOption2Votes(Integer option2Votes) { this.option2Votes = option2Votes; }

    public String getOption3() { return option3; }
    public void setOption3(String option3) { this.option3 = option3; }

    public String getOption3Ta() { return option3Ta; }
    public void setOption3Ta(String option3Ta) { this.option3Ta = option3Ta; }

    public Integer getOption3Votes() { return option3Votes; }
    public void setOption3Votes(Integer option3Votes) { this.option3Votes = option3Votes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
