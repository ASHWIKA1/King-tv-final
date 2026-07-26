package com.kingstv.repository;

import com.kingstv.models.ClassifiedImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClassifiedImageRepository extends JpaRepository<ClassifiedImage, Long> {
    List<ClassifiedImage> findByClassifiedId(Long classifiedId);
}
