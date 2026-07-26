package com.kingstv.repository;

import com.kingstv.models.ObituaryTribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ObituaryTributeRepository extends JpaRepository<ObituaryTribute, Long> {
    Optional<ObituaryTribute> findByObituaryIdAndSessionId(Long obituaryId, String sessionId);
    Optional<ObituaryTribute> findByObituaryIdAndUserId(Long obituaryId, Long userId);
}
