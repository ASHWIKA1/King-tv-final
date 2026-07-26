package com.kingstv.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(name = "article_id", nullable = false)
    @NotNull(message = "Article ID is required")
    private Long articleId;

    @Column(name = "commentor_name", nullable = false)
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String commentorName;

    @Column(name = "commentor_email")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String commentorEmail;

    @Column(name = "comment_text", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Comment text is required")
    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String commentText;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "status")
    private String status = "pending";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getArticleId() { return articleId; }
    public void setArticleId(Long articleId) { this.articleId = articleId; }
    public String getCommentorName() { return commentorName; }
    public void setCommentorName(String commentorName) { this.commentorName = commentorName; }
    public String getCommentorEmail() { return commentorEmail; }
    public void setCommentorEmail(String commentorEmail) { this.commentorEmail = commentorEmail; }
    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
