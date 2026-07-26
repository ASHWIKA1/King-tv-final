package com.kingstv.repository;

import com.kingstv.models.WebStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WebStoryRepository extends JpaRepository<WebStory, Long>, JpaSpecificationExecutor<WebStory> {
}
