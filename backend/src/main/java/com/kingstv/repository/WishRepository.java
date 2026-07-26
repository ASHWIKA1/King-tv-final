package com.kingstv.repository;

import com.kingstv.models.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WishRepository extends JpaRepository<Wish, Long>, JpaSpecificationExecutor<Wish> {
}
