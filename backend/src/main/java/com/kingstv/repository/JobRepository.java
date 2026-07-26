package com.kingstv.repository;

import com.kingstv.models.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<JobPosting, Long>, JpaSpecificationExecutor<JobPosting> {
}
