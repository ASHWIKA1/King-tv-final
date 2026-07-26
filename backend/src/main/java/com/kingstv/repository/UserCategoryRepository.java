package com.kingstv.repository;

import com.kingstv.models.UserCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserCategoryRepository extends JpaRepository<UserCategory, Long> {
    List<UserCategory> findByUserId(Long userId);
    List<UserCategory> findByCategoryId(Long categoryId);
    void deleteByUserIdAndCategoryId(Long userId, Long categoryId);
    boolean existsByUserIdAndCategoryId(Long userId, Long categoryId);
}
