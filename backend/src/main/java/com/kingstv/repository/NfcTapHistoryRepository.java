package com.kingstv.repository;

import com.kingstv.models.NfcTapHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NfcTapHistoryRepository extends JpaRepository<NfcTapHistory, Long> {
    List<NfcTapHistory> findByCardId(Long cardId);
}
