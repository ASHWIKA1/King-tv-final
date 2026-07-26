package com.kingstv.repository;

import com.kingstv.models.ProfanityWord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProfanityWordRepository extends JpaRepository<ProfanityWord, Long> {
    Optional<ProfanityWord> findByTerm(String term);
    List<ProfanityWord> findByLanguage(String language);
    boolean existsByTerm(String term);
}
