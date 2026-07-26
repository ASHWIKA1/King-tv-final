package com.kingstv.repository;

import com.kingstv.models.JobAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobAlertRepository extends JpaRepository<JobAlert, Long> {
    List<JobAlert> findByCandidateId(Long candidateId);
}
