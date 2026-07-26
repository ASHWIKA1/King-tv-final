package com.kingstv.repository;

import com.kingstv.models.ClassifiedReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassifiedReviewRepository extends JpaRepository<ClassifiedReview, Long> {
    List<ClassifiedReview> findBySellerId(Long sellerId);
}
