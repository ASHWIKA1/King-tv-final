package com.kingstv.repository;

import com.kingstv.models.ProfanityViolation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfanityViolationRepository extends JpaRepository<ProfanityViolation, Long> {
    Page<ProfanityViolation> findByStatus(String status, Pageable pageable);
    Page<ProfanityViolation> findByAuthorId(Long authorId, Pageable pageable);
    long countByStatus(String status);
}
