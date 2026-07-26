package com.kingstv.repository;

import com.kingstv.models.EarningLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EarningLedgerRepository extends JpaRepository<EarningLedger, Long> {
    List<EarningLedger> findByAuthorId(Long authorId);
    
    @Query("SELECT SUM(e.amount) FROM EarningLedger e WHERE e.authorId = :authorId")
    Double getTotalEarningsByAuthorId(Long authorId);
}
