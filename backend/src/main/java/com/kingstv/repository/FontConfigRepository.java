package com.kingstv.repository;

import com.kingstv.models.FontConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FontConfigRepository extends JpaRepository<FontConfig, Long> {
    Optional<FontConfig> findByFontRole(String fontRole);
}
