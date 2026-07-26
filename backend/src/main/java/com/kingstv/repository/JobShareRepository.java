package com.kingstv.repository;

import com.kingstv.models.JobShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobShareRepository extends JpaRepository<JobShare, Long> {
}
