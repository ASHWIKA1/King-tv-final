package com.kingstv.repository;

import com.kingstv.models.HomeLayoutConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HomeLayoutConfigRepository extends JpaRepository<HomeLayoutConfig, Long> {
    Optional<HomeLayoutConfig> findBySectionKey(String sectionKey);
    List<HomeLayoutConfig> findByLayoutTypeOrderByDisplayOrderAsc(String layoutType);
    List<HomeLayoutConfig> findByIsVisibleTrueAndLayoutTypeOrderByDisplayOrderAsc(String layoutType);
}
