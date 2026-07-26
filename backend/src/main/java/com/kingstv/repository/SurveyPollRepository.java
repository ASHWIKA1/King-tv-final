package com.kingstv.repository;

import com.kingstv.models.SurveyPoll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyPollRepository extends JpaRepository<SurveyPoll, Long> {
    Page<SurveyPoll> findByStatus(String status, Pageable pageable);
    Page<SurveyPoll> findByTargetModule(String targetModule, Pageable pageable);
}
