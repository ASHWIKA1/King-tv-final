package com.kingstv.repository;

import com.kingstv.models.JobView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobViewRepository extends JpaRepository<JobView, Long> {
}
