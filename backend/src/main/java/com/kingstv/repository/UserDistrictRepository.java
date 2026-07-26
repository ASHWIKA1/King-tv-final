package com.kingstv.repository;

import com.kingstv.models.UserDistrict;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserDistrictRepository extends JpaRepository<UserDistrict, Long> {
    List<UserDistrict> findByUserId(Long userId);
    List<UserDistrict> findByDistrictId(Long districtId);
    void deleteByUserIdAndDistrictId(Long userId, Long districtId);
    boolean existsByUserIdAndDistrictId(Long userId, Long districtId);
}
