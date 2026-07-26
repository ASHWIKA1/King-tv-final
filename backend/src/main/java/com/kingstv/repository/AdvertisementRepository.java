package com.kingstv.repository;

import com.kingstv.models.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    @Query("SELECT a FROM Advertisement a WHERE a.active = true AND a.startDate <= :now AND a.endDate >= :now")
    List<Advertisement> findActiveAdvertisements(LocalDateTime now);

    @Modifying
    @Transactional
    @Query("UPDATE Advertisement a SET a.impressionsCount = a.impressionsCount + 1 WHERE a.id = :id")
    void incrementImpressions(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Advertisement a SET a.clicksCount = a.clicksCount + 1 WHERE a.id = :id")
    void incrementClicks(Long id);
}
