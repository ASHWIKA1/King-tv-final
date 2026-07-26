package com.kingstv.repository;

import com.kingstv.models.WishFrameTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WishFrameTemplateRepository extends JpaRepository<WishFrameTemplate, Long> {
    Optional<WishFrameTemplate> findBySlug(String slug);
}
