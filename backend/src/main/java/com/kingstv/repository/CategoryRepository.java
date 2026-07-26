package com.kingstv.repository;

import com.kingstv.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    Optional<Category> findBySlug(String slug);
    List<Category> findByIsActiveAndIsNavOrderByDisplayOrderAsc(Boolean isActive, Boolean isNav);
}
