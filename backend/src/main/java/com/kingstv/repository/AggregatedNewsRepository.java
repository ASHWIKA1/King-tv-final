package com.kingstv.repository;

import com.kingstv.models.AggregatedNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AggregatedNewsRepository extends JpaRepository<AggregatedNews, Long> {
    Optional<AggregatedNews> findByExternalLink(String externalLink);
    boolean existsByExternalLink(String externalLink);
    Page<AggregatedNews> findAllByOrderByPublishedTimeDesc(Pageable pageable);
}
