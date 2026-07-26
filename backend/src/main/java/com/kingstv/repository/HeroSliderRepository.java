package com.kingstv.repository;

import com.kingstv.models.HeroSlider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface HeroSliderRepository extends JpaRepository<HeroSlider, Long>, JpaSpecificationExecutor<HeroSlider> {
    long countByStatus(String status);
}
