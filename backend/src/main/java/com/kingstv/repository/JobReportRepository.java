package com.kingstv.repository;

import com.kingstv.models.JobReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobReportRepository extends JpaRepository<JobReport, Long> {
}
