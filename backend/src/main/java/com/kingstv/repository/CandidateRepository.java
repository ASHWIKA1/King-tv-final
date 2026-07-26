package com.kingstv.repository;

import com.kingstv.models.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByUserId(Long userId);
    Optional<Candidate> findByEmail(String email);
    Optional<Candidate> findByPhone(String phone);
    Optional<Candidate> findByEmailAndPhone(String email, String phone);
}
