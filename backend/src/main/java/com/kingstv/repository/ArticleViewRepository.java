package com.kingstv.repository;

import com.kingstv.models.ArticleView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArticleViewRepository extends JpaRepository<ArticleView, Long> {
    Optional<ArticleView> findByArticleIdAndIpAddress(Long articleId, String ipAddress);
}
