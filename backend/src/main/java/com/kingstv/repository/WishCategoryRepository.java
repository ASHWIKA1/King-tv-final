package com.kingstv.repository;

import com.kingstv.models.WishCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WishCategoryRepository extends JpaRepository<WishCategory, Long> {
    Optional<WishCategory> findBySlug(String slug);
}
