package com.kingstv.repository;

import com.kingstv.models.SeoTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SeoTemplateRepository extends JpaRepository<SeoTemplate, Long> {
    Optional<SeoTemplate> findByTemplateKey(String templateKey);
}
