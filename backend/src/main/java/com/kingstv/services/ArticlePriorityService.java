package com.kingstv.services;

import com.kingstv.models.Article;
import com.kingstv.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ArticlePriorityService {

    @Autowired
    private ArticleRepository articleRepository;

    /**
     * Runs every hour to update priority scores for recent articles.
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void calculatePriorityScores() {
        // Only consider articles from the last 7 days to avoid processing the whole DB
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        List<Article> recentArticles = articleRepository.findByPublishedAtAfter(threshold);

        for (Article article : recentArticles) {
            double views = article.getViewsCount() != null ? article.getViewsCount() : 0.0;
            
            // Age factor: older articles lose priority
            long hoursOld = ChronoUnit.HOURS.between(article.getPublishedAt(), LocalDateTime.now());
            double ageFactor = 1.0;
            if (hoursOld > 0) {
                ageFactor = 1.0 / Math.pow((hoursOld + 2), 1.5);
            }
            
            // Base priority score calculation
            double score = (views * 0.5) * ageFactor;
            
            // Bonus for having images or videos (content length proxy)
            if (article.getImageUrl() != null && !article.getImageUrl().isEmpty()) {
                score += 5.0;
            }

            article.setPriorityScore(score);
            articleRepository.save(article);
        }
    }
}
