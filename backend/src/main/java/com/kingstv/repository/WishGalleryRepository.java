package com.kingstv.repository;

import com.kingstv.models.WishGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WishGalleryRepository extends JpaRepository<WishGallery, Long> {
    List<WishGallery> findByWishId(Long wishId);
}
