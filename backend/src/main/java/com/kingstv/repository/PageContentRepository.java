package com.kingstv.repository;

import com.kingstv.models.PageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageContentRepository extends JpaRepository<PageContent, String> {
}
