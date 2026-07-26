package com.kingstv.repository;

import com.kingstv.models.Company;
import com.kingstv.models.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobPosting, Long>, JpaSpecificationExecutor<JobPosting> {
    long countByCompanyAndDeletedFalseAndStatus(Company company, String status);
    List<JobPosting> findByCompanyAndDeletedFalse(Company company);
}
