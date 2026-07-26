package com.kingstv.repository;

import com.kingstv.models.MediaAsset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    
    @Query("SELECT m FROM MediaAsset m WHERE " +
           "(:category IS NULL OR :category = 'all' OR m.category = :category) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(m.filename) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MediaAsset> findByCategoryAndSearch(
            @Param("category") String category, 
            @Param("search") String search, 
            Pageable pageable);
}
