package com.kingstv.repository;

import com.kingstv.models.UgcSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UgcSubmissionRepository extends JpaRepository<UgcSubmission, Long> {
    long countByStatus(String status);
    Page<UgcSubmission> findByStatus(String status, Pageable pageable);
    Page<UgcSubmission> findBySubmitterId(Long submitterId, Pageable pageable);
}
