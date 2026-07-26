package com.kingstv.repository;

import com.kingstv.models.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByCandidateId(Long candidateId);
    Optional<JobApplication> findByJobIdAndCandidateId(Long jobId, Long candidateId);
}
