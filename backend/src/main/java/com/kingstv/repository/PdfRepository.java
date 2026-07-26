package com.kingstv.repository;

import com.kingstv.models.PdfContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PdfRepository extends JpaRepository<PdfContent, Long>, JpaSpecificationExecutor<PdfContent> {
}
