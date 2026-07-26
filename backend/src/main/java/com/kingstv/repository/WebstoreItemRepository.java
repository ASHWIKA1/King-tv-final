package com.kingstv.repository;

import com.kingstv.models.WebstoreItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WebstoreItemRepository extends JpaRepository<WebstoreItem, Long> {
    Page<WebstoreItem> findByStatus(String status, Pageable pageable);
    Page<WebstoreItem> findByCategory(String category, Pageable pageable);
}
