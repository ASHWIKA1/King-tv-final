package com.kingstv.services;

import com.kingstv.models.AggregatedNews;
import com.kingstv.models.RssFeedConfig;
import com.kingstv.repository.AggregatedNewsRepository;
import com.kingstv.repository.RssFeedConfigRepository;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class RssAggregatorService {

    private static final Logger LOGGER = Logger.getLogger(RssAggregatorService.class.getName());

    @Autowired
    private AggregatedNewsRepository aggregatedNewsRepository;

    @Autowired
    private RssFeedConfigRepository rssFeedConfigRepository;

    @Autowired
    private com.kingstv.repository.ArticleRepository articleRepository;

    // Run automatically every 3 hours
    @Scheduled(cron = "0 0 */3 * * *")
    public void fetchAggregatedFeeds() {
        LOGGER.info("Starting scheduled RSS news aggregation ingestion job...");
        int totalIngested = 0;

        List<RssFeedConfig> configs = rssFeedConfigRepository.findAll();

        for (RssFeedConfig config : configs) {
            try {
                LOGGER.info("Fetching RSS feed from: " + config.getName() + " (" + config.getFeedUrl() + ")");
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(URI.create(config.getFeedUrl()))
                    .GET()
                    .build();
                java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
                String xml = response.body();
                
                // Strip DOCTYPE declaration to prevent SAXParseException disallow-doctype-decl
                xml = xml.replaceAll("(?i)<!DOCTYPE[^>]*>", "");
                
                SyndFeedInput input = new SyndFeedInput();
                SyndFeed feed = input.build(new XmlReader(new java.io.ByteArrayInputStream(xml.getBytes(java.nio.charset.StandardCharsets.UTF_8))));

                int count = 0;
                for (SyndEntry entry : feed.getEntries()) {
                    String link = entry.getLink();
                    if (link == null || link.trim().isEmpty()) {
                        continue;
                    }

                    // Check if already aggregated by checking canonicalUrl or something, 
                    // for simplicity let's check if an article with this external link (stored in canonicalUrl) exists
                    if (articleRepository.existsByCanonicalUrl(link)) {
                        continue;
                    }

                    com.kingstv.models.Article item = new com.kingstv.models.Article();
                    
                    String title = entry.getTitle() != null ? entry.getTitle().trim() : "Untitled";
                    if ("ta".equals(config.getLanguage())) {
                        item.setTitleTa(title);
                        item.setContentTa(link); // store link somewhere safe
                    } else {
                        item.setTitleEn(title);
                        item.setContentEn(link);
                    }
                    
                    String desc = "";
                    if (entry.getDescription() != null) {
                        desc = entry.getDescription().getValue();
                    }
                    
                    if ("ta".equals(config.getLanguage())) {
                        item.setShortDescTa(desc);
                        item.setContentTa(desc); // Map description to content for RSS
                    } else {
                        item.setShortDescEn(desc);
                        item.setContentEn(desc);
                    }
                    
                    item.setCanonicalUrl(link);
                    item.setCategoryId(config.getCategoryId());
                    item.setStatus(config.getAutoPublish() ? "published" : "draft");
                    item.setAuthorName(config.getName());

                    // Find Image if auto download is true
                    if (config.getAutoImageDownload() != null && config.getAutoImageDownload()) {
                        if (!entry.getEnclosures().isEmpty()) {
                            item.setImageUrl(entry.getEnclosures().get(0).getUrl());
                            item.setFeaturedImage(entry.getEnclosures().get(0).getUrl());
                        }
                    }

                    Date pubDate = entry.getPublishedDate();
                    if (pubDate != null) {
                        item.setPublishedAt(LocalDateTime.ofInstant(pubDate.toInstant(), ZoneId.systemDefault()));
                    } else {
                        item.setPublishedAt(LocalDateTime.now());
                    }
                    
                    // Fallback to generate a slug
                    item.setSlug(java.util.UUID.randomUUID().toString());

                    articleRepository.save(item);
                    count++;
                    totalIngested++;
                }
                LOGGER.info("Successfully ingested " + count + " new items from " + config.getName());
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to ingest RSS feed from: " + config.getName(), e);
            }
        }
        LOGGER.info("RSS news aggregation completed. Total new items ingested: " + totalIngested);
    }

    public List<AggregatedNews> getLatestItems() {
        return aggregatedNewsRepository.findAll();
    }
}
