package com.kingstv.repository;

import com.kingstv.models.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
    Optional<SystemConfig> findByConfigKey(String configKey);
    List<SystemConfig> findByConfigGroup(String configGroup);
    boolean existsByConfigKey(String configKey);
}
