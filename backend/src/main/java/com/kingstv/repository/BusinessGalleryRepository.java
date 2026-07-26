package com.kingstv.repository;

import com.kingstv.models.BusinessGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusinessGalleryRepository extends JpaRepository<BusinessGallery, Long> {
    List<BusinessGallery> findByListingId(Long listingId);
}
