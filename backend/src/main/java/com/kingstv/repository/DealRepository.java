package com.kingstv.repository;

import com.kingstv.models.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long>, JpaSpecificationExecutor<Deal> {
    List<Deal> findByListingId(Long listingId);
}
