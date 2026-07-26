package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wish_comments")
public class WishComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wish_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Wish wish;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private WishComment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("createdAt ASC")
    private java.util.List<WishComment> replies = new java.util.ArrayList<>();

    public java.util.List<WishComment> getReplies() { return replies; }
    public void setReplies(java.util.List<WishComment> replies) { this.replies = replies; }

    @Column(name = "commenter_name", nullable = false)
    private String commenterName;

    @Column(name = "commenter_photo")
    private String commenterPhoto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Boolean deleted = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Wish getWish() { return wish; }
    public void setWish(Wish wish) { this.wish = wish; }

    public WishComment getParent() { return parent; }
    public void setParent(WishComment parent) { this.parent = parent; }

    public String getCommenterName() { return commenterName; }
    public void setCommenterName(String commenterName) { this.commenterName = commenterName; }

    public String getCommenterPhoto() { return commenterPhoto; }
    public void setCommenterPhoto(String commenterPhoto) { this.commenterPhoto = commenterPhoto; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Integer getLikeCount() { return likeCount; }
    public void setLikeCount(Integer likeCount) { this.likeCount = likeCount; }

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
}
