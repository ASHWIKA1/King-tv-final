package com.kingstv.repository;

import com.kingstv.models.AiConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AiConfigurationRepository extends JpaRepository<AiConfiguration, Long> {
    Optional<AiConfiguration> findByProvider(String provider);
    Optional<AiConfiguration> findByIsActiveTrue();
}
