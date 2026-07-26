package com.kingstv.repository;

import com.kingstv.models.ObituaryGuestbook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ObituaryGuestbookRepository extends JpaRepository<ObituaryGuestbook, Long> {
    List<ObituaryGuestbook> findByObituaryIdAndStatusOrderByCreatedAtDesc(Long obituaryId, String status);
}
