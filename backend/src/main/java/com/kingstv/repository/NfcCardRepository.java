package com.kingstv.repository;

import com.kingstv.models.NfcCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NfcCardRepository extends JpaRepository<NfcCard, Long> {
    Optional<NfcCard> findByListingId(Long listingId);
    Optional<NfcCard> findByShortCode(String shortCode);
}
