package com.kingstv.services;

import com.kingstv.models.Article;
import com.kingstv.models.SystemConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ForkJoinPool;
import java.util.logging.Logger;

@Service
public class TelegramBotService {

    private static final Logger LOGGER = Logger.getLogger(TelegramBotService.class.getName());
    private final HttpClient httpClient = HttpClient.newBuilder().build();

    @Autowired
    private SystemConfigService configService;

    public void pushArticleToChannel(Article article) {
        boolean enabled = Boolean.parseBoolean(configService.getConfigValueOrDefault(SystemConfig.TELEGRAM_ENABLED, "false"));
        if (!enabled) {
            LOGGER.info("Telegram integration is disabled. Skipping broadcast.");
            return;
        }

        String botToken = configService.getConfigValue(SystemConfig.TELEGRAM_BOT_TOKEN);
        String chatId = configService.getConfigValue(SystemConfig.TELEGRAM_CHAT_ID);

        if (botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
            LOGGER.warning("Telegram Bot Token or Chat ID is not configured. Skipping broadcast.");
            return;
        }

        ForkJoinPool.commonPool().submit(() -> {
            try {
                String title = article.getTitleEn() != null && !article.getTitleEn().isBlank()
                        ? article.getTitleEn()
                        : article.getTitleTa();
                
                String cleanTitle = title.replace("_", "\\_").replace("*", "\\*").replace("[", "\\[").replace("`", "\\`");
                
                String appUrl = configService.getConfigValueOrDefault("app.web_url", "http://localhost:5173");
                String articleLink = appUrl + "/news/" + article.getId();

                String message = "*🔥 KINGS 24x7 News Alert *\n\n" +
                        "*" + cleanTitle + "*\n\n" +
                        "👉 [Read full article online](" + articleLink + ")";

                String urlString = "https://api.telegram.org/bot" + botToken + "/sendMessage?chat_id=" + chatId +
                        "&parse_mode=Markdown&text=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(urlString))
                        .POST(HttpRequest.BodyPublishers.noBody())
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    LOGGER.info("Successfully pushed article alert to Telegram: " + article.getId());
                } else {
                    LOGGER.severe("Failed to push article alert to Telegram. Status: " + response.statusCode() + ", Response: " + response.body());
                }
            } catch (Exception e) {
                LOGGER.severe("Exception during Telegram alert push: " + e.getMessage());
            }
        });
    }
}
