package com.kingstv.services;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Uploads a file to the configured storage (S3-compatible bucket or local fallback).
     *
     * @param file The file to upload
     * @param folderType The target folder category (e.g., articles, wishes, profile, obituaries, jobs)
     * @return The public URL of the uploaded file
     */
    String uploadFile(MultipartFile file, String folderType);
}
