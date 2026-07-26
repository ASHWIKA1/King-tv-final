package com.kingstv.repository;

import com.kingstv.models.ClassifiedSubcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassifiedSubcategoryRepository extends JpaRepository<ClassifiedSubcategory, Long> {
    List<ClassifiedSubcategory> findByCategoryId(Long categoryId);
}
