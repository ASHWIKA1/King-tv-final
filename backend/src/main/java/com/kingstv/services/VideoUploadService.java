package com.kingstv.services;

import com.kingstv.models.SystemConfig;
import com.kingstv.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Video upload validation service.
 * Validates video duration against the configured limit from system config.
 * Default: 55 seconds.
 */
@Service
public class VideoUploadService {

    private static final int DEFAULT_MAX_DURATION_SECONDS = 55;

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    /**
     * Gets the current maximum video duration in seconds from system config.
     */
    public int getMaxDurationSeconds() {
        Optional<SystemConfig> config = systemConfigRepository
                .findByConfigKey(SystemConfig.VIDEO_MAX_DURATION_SECONDS);
        if (config.isPresent()) {
            try {
                return Integer.parseInt(config.get().getConfigValue());
            } catch (NumberFormatException e) {
                return DEFAULT_MAX_DURATION_SECONDS;
            }
        }
        return DEFAULT_MAX_DURATION_SECONDS;
    }

    /**
     * Validates video duration against the configured limit.
     * @throws VideoTooLongException if duration exceeds the limit
     */
    public void validateDuration(int durationSeconds) {
        int maxDuration = getMaxDurationSeconds();
        if (durationSeconds > maxDuration) {
            throw new VideoTooLongException(
                "Video duration (" + durationSeconds + "s) exceeds the maximum allowed duration (" +
                maxDuration + "s). Please trim your video and try again.");
        }
    }

    public static class VideoTooLongException extends RuntimeException {
        public VideoTooLongException(String message) {
            super(message);
        }
    }
}
