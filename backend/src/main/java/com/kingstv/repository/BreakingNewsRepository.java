package com.kingstv.repository;

import com.kingstv.models.BreakingNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BreakingNewsRepository extends JpaRepository<BreakingNews, Long>, JpaSpecificationExecutor<BreakingNews> {
    long countByStatus(String status);
}
