package com.kingstv.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pdf_contents")
public class PdfContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pdf_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "title_ta", nullable = false)
    private String titleTa;

    @Column(name = "pdf_url", nullable = false)
    private String pdfUrl;

    @Column(name = "file_size")
    private String fileSize;

    @Column(name = "publish_date")
    private LocalDateTime publishDate = LocalDateTime.now();

    @Column(nullable = false)
    private String status = "published";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPdfId() { return id; }
    public void setPdfId(Long pdfId) { this.id = pdfId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTitleTa() { return titleTa; }
    public void setTitleTa(String titleTa) { this.titleTa = titleTa; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }
    public LocalDateTime getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDateTime publishDate) { this.publishDate = publishDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
