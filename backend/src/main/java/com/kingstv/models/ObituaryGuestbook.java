package com.kingstv.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "obituary_guestbook")
public class ObituaryGuestbook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "obituary_id", nullable = false)
    private Long obituaryId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "visitor_name", nullable = false)
    private String visitorName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String status = "approved"; // approved, pending, spam

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private ObituaryGuestbook parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ObituaryGuestbook> replies = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getObituaryId() { return obituaryId; }
    public void setObituaryId(Long obituaryId) { this.obituaryId = obituaryId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public ObituaryGuestbook getParent() { return parent; }
    public void setParent(ObituaryGuestbook parent) { this.parent = parent; }

    public List<ObituaryGuestbook> getReplies() { return replies; }
    public void setReplies(List<ObituaryGuestbook> replies) { this.replies = replies; }
}
