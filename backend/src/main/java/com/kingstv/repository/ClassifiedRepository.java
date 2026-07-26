package com.kingstv.repository;

import com.kingstv.models.ClassifiedListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassifiedRepository extends JpaRepository<ClassifiedListing, Long>, JpaSpecificationExecutor<ClassifiedListing> {
}
