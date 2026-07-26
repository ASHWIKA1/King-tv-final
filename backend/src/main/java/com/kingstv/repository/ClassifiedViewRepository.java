package com.kingstv.repository;

import com.kingstv.models.ClassifiedView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassifiedViewRepository extends JpaRepository<ClassifiedView, Long> {
}
