package com.kingstv.services;

import com.kingstv.repository.ArticleRepository;
import com.kingstv.repository.PasswordResetOtpRepository;
import com.kingstv.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class DbCleanupService {

    private static final Logger LOGGER = Logger.getLogger(DbCleanupService.class.getName());

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private ArticleRepository articleRepository;

    // Run automatically every Sunday at 3:00 AM
    @Scheduled(cron = "0 0 3 * * SUN")
    public void runWeeklyCleanup() {
        LOGGER.info("Starting scheduled weekly DB cleanup routine...");
        executeCleanup();
    }

    public void executeCleanup() {
        LocalDateTime now = LocalDateTime.now();
        
        // 1. Prune expired reset OTPs
        try {
            LOGGER.info("Pruning expired password reset OTPs...");
            otpRepository.deleteExpiredOtps(now);
        } catch (Exception e) {
            LOGGER.severe("Failed to prune expired OTPs: " + e.getMessage());
        }

        // 2. Prune expired refresh token sessions
        try {
            LOGGER.info("Pruning expired refresh token sessions...");
            refreshTokenRepository.deleteExpiredTokens(now);
        } catch (Exception e) {
            LOGGER.severe("Failed to prune expired refresh tokens: " + e.getMessage());
        }

        // 3. Prune old unassociated draft records (drafts updated > 30 days ago)
        try {
            LocalDateTime threshold = now.minusDays(30);
            LOGGER.info("Pruning unassociated draft records updated before: " + threshold);
            articleRepository.deleteOlderDrafts(threshold);
        } catch (Exception e) {
            LOGGER.severe("Failed to prune old drafts: " + e.getMessage());
        }

        LOGGER.info("Weekly DB cleanup routine completed.");
    }
}
