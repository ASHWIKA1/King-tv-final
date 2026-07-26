package com.kingstv.repository;

import com.kingstv.models.RfqQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RfqQuoteRepository extends JpaRepository<RfqQuote, Long> {
    List<RfqQuote> findByRfqId(Long rfqId);
    List<RfqQuote> findBySellerBusinessId(Long sellerBusinessId);
}
