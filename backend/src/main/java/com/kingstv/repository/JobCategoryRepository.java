package com.kingstv.repository;

import com.kingstv.models.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {
    Optional<JobCategory> findBySlug(String slug);
}
