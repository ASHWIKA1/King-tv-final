package com.kingstv.repository;

import com.kingstv.models.PhotoGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PhotoGalleryRepository extends JpaRepository<PhotoGallery, Long>, JpaSpecificationExecutor<PhotoGallery> {
}
