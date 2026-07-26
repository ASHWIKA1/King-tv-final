package com.kingstv.repository;

import com.kingstv.models.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long>, JpaSpecificationExecutor<SubCategory> {
    Optional<SubCategory> findBySlug(String slug);
    List<SubCategory> findByCategoryIdAndStatusOrderByDisplayOrderAsc(Long categoryId, String status);
    List<SubCategory> findByStatusOrderByDisplayOrderAsc(String status);
}
