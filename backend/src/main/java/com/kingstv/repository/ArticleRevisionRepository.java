package com.kingstv.repository;

import com.kingstv.models.ArticleRevision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ArticleRevisionRepository extends JpaRepository<ArticleRevision, Long> {
    List<ArticleRevision> findByArticleIdOrderByRevisionNumberDesc(Long articleId);
    Optional<ArticleRevision> findTopByArticleIdOrderByRevisionNumberDesc(Long articleId);
    long countByArticleId(Long articleId);
}
