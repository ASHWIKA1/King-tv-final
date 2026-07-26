package com.kingstv.repository;

import com.kingstv.models.WishShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishShareRepository extends JpaRepository<WishShare, Long> {
}
