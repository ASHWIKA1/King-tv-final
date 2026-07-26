package com.kingstv.models;

import jakarta.persistence.*;

@Entity
@Table(name = "job_categories")
public class JobCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String icon;

    @Column(name = "active_job_count")
    private Integer activeJobCount = 0;

    @Column(name = "companies_hiring_count")
    private Integer companiesHiringCount = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Integer getActiveJobCount() { return activeJobCount; }
    public void setActiveJobCount(Integer activeJobCount) { this.activeJobCount = activeJobCount; }

    public Integer getCompaniesHiringCount() { return companiesHiringCount; }
    public void setCompaniesHiringCount(Integer companiesHiringCount) { this.companiesHiringCount = companiesHiringCount; }
}
