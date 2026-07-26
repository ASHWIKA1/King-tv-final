package com.kingstv.repository;

import com.kingstv.models.BusinessReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusinessReviewRepository extends JpaRepository<BusinessReview, Long> {
    List<BusinessReview> findByListingIdAndStatus(Long listingId, String status);
    List<BusinessReview> findByListingId(Long listingId);
}
