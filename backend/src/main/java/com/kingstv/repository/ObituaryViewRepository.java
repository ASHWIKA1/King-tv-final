package com.kingstv.repository;

import com.kingstv.models.ObituaryView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObituaryViewRepository extends JpaRepository<ObituaryView, Long> {
}
