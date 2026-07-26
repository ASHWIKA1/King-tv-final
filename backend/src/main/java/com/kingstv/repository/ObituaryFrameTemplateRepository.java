package com.kingstv.repository;

import com.kingstv.models.ObituaryFrameTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObituaryFrameTemplateRepository extends JpaRepository<ObituaryFrameTemplate, Long> {
    List<ObituaryFrameTemplate> findByIsActiveTrueOrderByDisplayOrderAsc();
}
