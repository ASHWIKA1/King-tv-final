package com.kingstv.repository;

import com.kingstv.models.ClassifiedShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassifiedShareRepository extends JpaRepository<ClassifiedShare, Long> {
}
