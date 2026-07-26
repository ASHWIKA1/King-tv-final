package com.kingstv.repository;

import com.kingstv.models.LatestNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LatestNewsRepository extends JpaRepository<LatestNews, Long>, JpaSpecificationExecutor<LatestNews> {
}
