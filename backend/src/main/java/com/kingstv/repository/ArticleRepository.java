package com.kingstv.repository;

import com.kingstv.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long>, JpaSpecificationExecutor<Article> {
    long countByStatus(String status);
    List<Article> findByStatusOrderByPublishedAtDesc(String status);
    List<Article> findTop50ByStatusOrderByPublishedAtDesc(String status);
    List<Article> findByPublishedAtAfter(java.time.LocalDateTime date);
    Optional<Article> findBySlug(String slug);
    boolean existsByCanonicalUrl(String canonicalUrl);
    org.springframework.data.domain.Page<Article> findByStatus(String status, org.springframework.data.domain.Pageable pageable);
    List<Article> findTop5ByStatusOrderByViewsCountDesc(String status);
    List<Article> findByAuthorNameInAndStatusOrderByPublishedAtDesc(List<String> authorNames, String status);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Article a SET a.viewsCount = COALESCE(a.viewsCount, 0) + 1 WHERE a.id = :id")
    void incrementViewsCount(@Param("id") Long id);

    @Query(value = "SELECT * FROM articles WHERE status = 'published' AND (" +
           "latitude IS NULL OR longitude IS NULL OR " +
           "(6371 * acos(cos(radians(:userLat)) * cos(radians(latitude)) * " +
           "cos(radians(longitude) - radians(:userLon)) + " +
           "sin(radians(:userLat)) * sin(radians(latitude)))) <= COALESCE(visibility_radius_km, :defaultRadius)) " +
           "ORDER BY published_at DESC LIMIT :limit", nativeQuery = true)
    List<Article> findNearbyArticles(@Param("userLat") Double userLat, @Param("userLon") Double userLon, @Param("defaultRadius") Double defaultRadius, @Param("limit") int limit);
    List<Article> findTop10ByStatusAndCategoryIdAndIdNotOrderByPublishedAtDesc(String status, Long categoryId, Long id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("DELETE FROM Article a WHERE (a.status = 'draft' OR a.status = 'UGC_draft') AND a.updatedAt < :threshold")
    void deleteOlderDrafts(@Param("threshold") java.time.LocalDateTime threshold);
}
