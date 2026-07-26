package com.kingstv.repository;

import com.kingstv.models.ClassifiedSellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClassifiedSellerProfileRepository extends JpaRepository<ClassifiedSellerProfile, Long> {
    Optional<ClassifiedSellerProfile> findByUserId(Long userId);
}
