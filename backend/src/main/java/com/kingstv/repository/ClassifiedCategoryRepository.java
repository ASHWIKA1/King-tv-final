package com.kingstv.repository;

import com.kingstv.models.ClassifiedCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClassifiedCategoryRepository extends JpaRepository<ClassifiedCategory, Long> {
    Optional<ClassifiedCategory> findBySlug(String slug);
}
