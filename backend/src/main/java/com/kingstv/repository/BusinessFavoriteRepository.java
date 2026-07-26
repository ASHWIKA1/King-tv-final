package com.kingstv.repository;

import com.kingstv.models.BusinessFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessFavoriteRepository extends JpaRepository<BusinessFavorite, Long> {
    List<BusinessFavorite> findByUserId(Long userId);
    Optional<BusinessFavorite> findByUserIdAndListingId(Long userId, Long listingId);
}
