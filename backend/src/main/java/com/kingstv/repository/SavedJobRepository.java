package com.kingstv.repository;

import com.kingstv.models.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    Optional<SavedJob> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    List<SavedJob> findByCandidateId(Long candidateId);
}
