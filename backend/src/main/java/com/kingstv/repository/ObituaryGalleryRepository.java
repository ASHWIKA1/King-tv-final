package com.kingstv.repository;

import com.kingstv.models.ObituaryGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObituaryGalleryRepository extends JpaRepository<ObituaryGallery, Long> {
    List<ObituaryGallery> findByObituaryIdOrderByDisplayOrderAsc(Long obituaryId);
}
