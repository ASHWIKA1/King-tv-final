package com.kingstv.repository;

import com.kingstv.models.DirectoryListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DirectoryRepository extends JpaRepository<DirectoryListing, Long>, JpaSpecificationExecutor<DirectoryListing> {
    List<DirectoryListing> findByCategoryAndAddressLocality(String category, String addressLocality);
    List<DirectoryListing> findByCreatedBy(Long createdBy);
}
