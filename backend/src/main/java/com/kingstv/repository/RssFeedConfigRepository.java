package com.kingstv.repository;

import com.kingstv.models.RssFeedConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RssFeedConfigRepository extends JpaRepository<RssFeedConfig, Long> {
}
