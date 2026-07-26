package com.kingstv.services;

import com.kingstv.models.ProfanityViolation;
import com.kingstv.models.ProfanityWord;
import com.kingstv.repository.ProfanityViolationRepository;
import com.kingstv.repository.ProfanityWordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Profanity scanning service. Called automatically before any content publish.
 * Blocks publishing on match, creates a violation report, and flags for dashboard alert.
 */
@Service
public class ProfanityService {

    @Autowired
    private ProfanityWordRepository profanityWordRepository;

    @Autowired
    private ProfanityViolationRepository profanityViolationRepository;

    /**
     * Scans content for profanity matches.
     * @return list of matched terms, empty if clean
     */
    public List<String> scanContent(String content) {
        if (content == null || content.isEmpty()) {
            return List.of();
        }

        List<ProfanityWord> dictionary = profanityWordRepository.findAll();
        String lowerContent = content.toLowerCase();

        return dictionary.stream()
                .filter(word -> lowerContent.contains(word.getTerm().toLowerCase()))
                .map(ProfanityWord::getTerm)
                .collect(Collectors.toList());
    }

    /**
     * Scans all text fields of a content piece and blocks if violations found.
     * @return ProfanityCheckResult with status and matched terms
     */
    public ProfanityCheckResult checkContent(String contentType, Long contentId, String contentTitle,
                                              Long authorId, String authorEmail, String... textFields) {
        List<String> allMatches = new ArrayList<>();

        for (String text : textFields) {
            allMatches.addAll(scanContent(text));
        }

        allMatches = allMatches.stream().distinct().collect(Collectors.toList());

        if (!allMatches.isEmpty()) {
            // Create violation report
            ProfanityViolation violation = new ProfanityViolation();
            violation.setContentType(contentType);
            violation.setContentId(contentId);
            violation.setContentTitle(contentTitle);
            violation.setMatchedTerms(String.join(", ", allMatches));
            violation.setAuthorId(authorId);
            violation.setAuthorEmail(authorEmail);
            violation.setStatus("PENDING");
            profanityViolationRepository.save(violation);

            return new ProfanityCheckResult(false, allMatches);
        }

        return new ProfanityCheckResult(true, List.of());
    }

    /**
     * Result of a profanity check.
     */
    public static class ProfanityCheckResult {
        private final boolean clean;
        private final List<String> matchedTerms;

        public ProfanityCheckResult(boolean clean, List<String> matchedTerms) {
            this.clean = clean;
            this.matchedTerms = matchedTerms;
        }

        public boolean isClean() { return clean; }
        public List<String> getMatchedTerms() { return matchedTerms; }
    }
}
