package com.kingstv.repository;

import com.kingstv.models.JobReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobReportRepository extends JpaRepository<JobReport, Long> {
    List<JobReport> findByJobId(Long jobId);
    List<JobReport> findByJobIdIn(List<Long> jobIds);
}
