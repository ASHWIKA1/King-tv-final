package com.kingstv.repository;

import com.kingstv.models.Rfq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RfqRepository extends JpaRepository<Rfq, Long>, JpaSpecificationExecutor<Rfq> {
    List<Rfq> findByBuyerId(Long buyerId);
}
