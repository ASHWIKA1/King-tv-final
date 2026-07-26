package com.kingstv.repository;

import com.kingstv.models.WishReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishReportRepository extends JpaRepository<WishReport, Long> {
}
