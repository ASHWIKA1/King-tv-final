package com.kingstv.repository;

import com.kingstv.models.ClassifiedFavourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassifiedFavouriteRepository extends JpaRepository<ClassifiedFavourite, Long> {
    List<ClassifiedFavourite> findByUserId(Long userId);
    Optional<ClassifiedFavourite> findByClassifiedIdAndUserId(Long classifiedId, Long userId);
}
