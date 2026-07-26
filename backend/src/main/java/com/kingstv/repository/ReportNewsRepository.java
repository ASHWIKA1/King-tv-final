package com.kingstv.repository;

import com.kingstv.models.ReportNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportNewsRepository extends JpaRepository<ReportNews, Long>, JpaSpecificationExecutor<ReportNews> {
}
