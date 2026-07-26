package com.kingstv.repository;

import com.kingstv.models.ObituaryReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObituaryReportRepository extends JpaRepository<ObituaryReport, Long> {
}
