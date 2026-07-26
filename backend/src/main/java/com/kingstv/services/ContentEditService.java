package com.kingstv.services;

import com.kingstv.models.ContentEditLog;
import com.kingstv.repository.ContentEditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Enforces the max-2-edits rule for Mobile Journalist and Institution Login posts.
 * Tracks edit count per post and blocks further edits past the limit.
 */
@Service
public class ContentEditService {

    private static final int MAX_EDITS = 2;

    @Autowired
    private ContentEditLogRepository contentEditLogRepository;

    /**
     * Checks if editing is allowed and increments the counter.
     * @return true if edit is allowed, false if max edits reached
     * @throws MaxEditsExceededException if limit is exceeded
     */
    @Transactional
    public boolean attemptEdit(String contentType, Long contentId, Long editorId) {
        Optional<ContentEditLog> logOpt = contentEditLogRepository
                .findByContentTypeAndContentId(contentType, contentId);

        ContentEditLog log;
        if (logOpt.isPresent()) {
            log = logOpt.get();
            if (log.getEditCount() >= MAX_EDITS) {
                throw new MaxEditsExceededException(
                    "Maximum " + MAX_EDITS + " edits allowed per post. " +
                    "This post has already been edited " + log.getEditCount() + " times.");
            }
            log.incrementEditCount();
            log.setLastEditedBy(editorId);
        } else {
            log = new ContentEditLog();
            log.setContentType(contentType);
            log.setContentId(contentId);
            log.setEditCount(1);
            log.setLastEditedAt(LocalDateTime.now());
            log.setLastEditedBy(editorId);
        }

        contentEditLogRepository.save(log);
        return true;
    }

    /**
     * Gets remaining edits for a content piece.
     */
    public int getRemainingEdits(String contentType, Long contentId) {
        Optional<ContentEditLog> logOpt = contentEditLogRepository
                .findByContentTypeAndContentId(contentType, contentId);
        if (logOpt.isPresent()) {
            return Math.max(0, MAX_EDITS - logOpt.get().getEditCount());
        }
        return MAX_EDITS;
    }

    public static class MaxEditsExceededException extends RuntimeException {
        public MaxEditsExceededException(String message) {
            super(message);
        }
    }
}
