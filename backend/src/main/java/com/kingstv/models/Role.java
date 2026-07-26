package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    public Role() {}

    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Role name constants
    public static final String SUPER_ADMIN = "SUPER_ADMIN";
    public static final String CHIEF_EDITOR = "CHIEF_EDITOR";
    public static final String SECTION_EDITOR = "SECTION_EDITOR";
    public static final String SUB_EDITOR = "SUB_EDITOR";
    public static final String DISTRICT_ADMIN = "DISTRICT_ADMIN";
    public static final String MOBILE_JOURNALIST = "MOBILE_JOURNALIST";
    public static final String INSTITUTION_LOGIN = "INSTITUTION_LOGIN";
    public static final String READER = "READER";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<Permission> getPermissions() { return permissions; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }

    public boolean hasPermission(String permissionName) {
        return permissions.stream().anyMatch(p -> p.getName().equals(permissionName));
    }
}
