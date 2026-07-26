package com.kingstv.repository;

import com.kingstv.models.SuccessStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SuccessStoryRepository extends JpaRepository<SuccessStory, Long>, JpaSpecificationExecutor<SuccessStory> {
}
