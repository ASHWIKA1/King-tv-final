package com.kingstv.repository;

import com.kingstv.models.MediaAsset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    
    /**
             * Finds media assets filtered by category and a case-insensitive filename search.
             *
             * @param category the category to filter by, or {@code null} or {@code "all"} for every category
             * @param search the filename text to match, or {@code null} or an empty string for every filename
             * @param pageable pagination and sorting settings
             * @return a page of matching media assets
             */
            @Query("SELECT m FROM MediaAsset m WHERE " +
           "(:category IS NULL OR :category = 'all' OR m.category = :category) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(m.filename) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MediaAsset> findByCategoryAndSearch(
            @Param("category") String category, 
            @Param("search") String search, 
            Pageable pageable);

    /**
 * Finds a media asset by its URL.
 *
 * @param url the URL associated with the media asset
 * @return the matching media asset, if one exists
 */
Optional<MediaAsset> findByUrl(String url);
}

