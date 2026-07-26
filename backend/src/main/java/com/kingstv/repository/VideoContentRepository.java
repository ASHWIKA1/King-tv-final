package com.kingstv.repository;

import com.kingstv.models.VideoContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoContentRepository extends JpaRepository<VideoContent, Long>, JpaSpecificationExecutor<VideoContent> {
    List<VideoContent> findByIsLiveTvOrderByPublishedAtDesc(Integer isLiveTv);
}
