package com.kingstv.repository;

import com.kingstv.models.HomeLayoutHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HomeLayoutHistoryRepository extends JpaRepository<HomeLayoutHistory, Long> {
    List<HomeLayoutHistory> findTop10ByLayoutTypeOrderByCreatedAtDesc(String layoutType);
}
