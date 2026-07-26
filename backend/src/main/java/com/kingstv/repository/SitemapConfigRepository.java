package com.kingstv.repository;

import com.kingstv.models.SitemapConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SitemapConfigRepository extends JpaRepository<SitemapConfig, Long> {
    Optional<SitemapConfig> findByPagePath(String pagePath);
    List<SitemapConfig> findByIsExcludedFalse();
}
