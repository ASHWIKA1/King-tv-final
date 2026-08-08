package com.kingstv.services;

import com.kingstv.models.Article;
import com.kingstv.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Enterprise scheduler — auto-publishes scheduled articles and auto-archives expired ones.
 * Runs every 60 seconds for publish, every hour for archive.
 */
@Service
public class ArticleSchedulerService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private TelegramBotService telegramBotService;

    /**
     * Auto-publish articles whose scheduledAt has passed and embargo has lifted.
     */
    @Scheduled(fixedDelay = 60000)
    public void publishScheduledArticles() {
        try {
            List<Article> scheduled = articleRepository
                .findByStatusAndScheduledAtBefore("scheduled", LocalDateTime.now());
            for (Article article : scheduled) {
                // Skip if still under embargo
                if (article.getEmbargoedUntil() != null
                        && article.getEmbargoedUntil().isAfter(LocalDateTime.now())) {
                    continue;
                }
                article.setStatus("published");
                article.setPublishedAt(LocalDateTime.now());
                articleRepository.save(article);
                if (!article.getTelegramSent()) {
                    try {
                        telegramBotService.pushArticleToChannel(article);
                        article.setTelegramSent(true);
                        articleRepository.save(article);
                    } catch (Exception te) {
                        System.err.println("[ArticleScheduler] Telegram push failed for #" + article.getId() + ": " + te.getMessage());
                    }
                }
                System.out.println("[ArticleScheduler] Auto-published article #" + article.getId() + ": " + article.getTitleTa());
            }
        } catch (Exception e) {
            System.err.println("[ArticleScheduler] publishScheduledArticles error: " + e.getMessage());
        }
    }

    /**
     * Auto-archive published articles whose expiresAt has passed.
     */
    @Scheduled(fixedDelay = 3600000)
    public void archiveExpiredArticles() {
        try {
            List<Article> expired = articleRepository
                .findByStatusAndExpiresAtBefore("published", LocalDateTime.now());
            for (Article article : expired) {
                article.setStatus("archived");
                articleRepository.save(article);
                System.out.println("[ArticleScheduler] Auto-archived article #" + article.getId());
            }
        } catch (Exception e) {
            System.err.println("[ArticleScheduler] archiveExpiredArticles error: " + e.getMessage());
        }
    }
}
