package com.kingstv.controllers;

import com.kingstv.models.Article;
import com.kingstv.repository.ArticleRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
public class SeoPreRenderController {

    @Autowired
    private ArticleRepository articleRepository;

    @GetMapping(value = "/news/{idOrSlug}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> renderSeoFriendlyPage(@PathVariable String idOrSlug, HttpServletRequest request) {
        Optional<Article> artOpt = Optional.empty();
        
        if (idOrSlug.matches("^\\d+$")) {
            artOpt = articleRepository.findById(Long.parseLong(idOrSlug));
        }
        
        if (artOpt.isEmpty()) {
            artOpt = articleRepository.findBySlug(idOrSlug);
        }

        if (artOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("<html><body><h1>Article Not Found</h1></body></html>");
        }

        Article article = artOpt.get();
        String requestUrl = request.getRequestURL().toString();
        
        // Read index.html from Vite project
        String htmlContent = "";
        try {
            // Check relative path from backend running directory
            Path indexPath = Path.of("../frontend/index.html");
            if (Files.exists(indexPath)) {
                htmlContent = Files.readString(indexPath);
            } else {
                indexPath = Path.of("src/main/resources/static/index.html");
                if (Files.exists(indexPath)) {
                    htmlContent = Files.readString(indexPath);
                } else {
                    htmlContent = getFallbackHtml();
                }
            }
        } catch (IOException e) {
            htmlContent = getFallbackHtml();
        }

        String preRenderedHtml = injectMetaTags(htmlContent, article, requestUrl);
        return ResponseEntity.ok(preRenderedHtml);
    }

    private String injectMetaTags(String html, Article article, String requestUrl) {
        String title = article.getMetaTitle() != null ? article.getMetaTitle() : article.getTitleTa();
        String desc = article.getMetaDescription() != null ? article.getMetaDescription() : "";
        String keywords = article.getMetaKeywords() != null ? article.getMetaKeywords() : "";
        String image = article.getFeaturedImage() != null ? article.getFeaturedImage() : article.getImageUrl();
        String canonical = article.getCanonicalUrl() != null ? article.getCanonicalUrl() : requestUrl;
        
        StringBuilder seoTags = new StringBuilder();
        seoTags.append("\n    <!-- SEO Dynamic Metadata -->\n");
        seoTags.append("    <meta name=\"description\" content=\"").append(desc.replace("\"", "&quot;")).append("\" />\n");
        seoTags.append("    <meta name=\"keywords\" content=\"").append(keywords.replace("\"", "&quot;")).append("\" />\n");
        seoTags.append("    <link rel=\"canonical\" href=\"").append(canonical).append("\" />\n");
        
        // Open Graph Tags
        seoTags.append("    <meta property=\"og:title\" content=\"").append(title.replace("\"", "&quot;")).append("\" />\n");
        seoTags.append("    <meta property=\"og:description\" content=\"").append(desc.replace("\"", "&quot;")).append("\" />\n");
        if (image != null && !image.trim().isEmpty()) {
            seoTags.append("    <meta property=\"og:image\" content=\"").append(image).append("\" />\n");
        }
        seoTags.append("    <meta property=\"og:url\" content=\"").append(requestUrl).append("\" />\n");
        seoTags.append("    <meta property=\"og:type\" content=\"article\" />\n");
        
        // Twitter Card Tags
        seoTags.append("    <meta name=\"twitter:card\" content=\"summary_large_image\" />\n");
        seoTags.append("    <meta name=\"twitter:title\" content=\"").append(title.replace("\"", "&quot;")).append("\" />\n");
        seoTags.append("    <meta name=\"twitter:description\" content=\"").append(desc.replace("\"", "&quot;")).append("\" />\n");
        if (image != null && !image.trim().isEmpty()) {
            seoTags.append("    <meta name=\"twitter:image\" content=\"").append(image).append("\" />\n");
        }
        
        // JSON-LD Structured Data
        String jsonLd = generateJsonLd(article, requestUrl);
        seoTags.append("    <script type=\"application/ld+json\">\n").append(jsonLd).append("\n    </script>\n");
        seoTags.append("  </head>");
        
        String modifiedHtml = html.replaceAll("<title>.*?</title>", "<title>" + title + "</title>");
        modifiedHtml = modifiedHtml.replace("</head>", seoTags.toString());
        return modifiedHtml;
    }

    private String generateJsonLd(Article article, String requestUrl) {
        String headline = article.getTitleTa() != null ? article.getTitleTa() : article.getTitleEn();
        String description = article.getMetaDescription() != null ? article.getMetaDescription() : "";
        String imageUrl = article.getImageUrl() != null ? article.getImageUrl() : "";
        String pubDate = article.getPublishedAt() != null ? article.getPublishedAt().toString() : LocalDateTime.now().toString();
        String modDate = article.getUpdatedAt() != null ? article.getUpdatedAt().toString() : pubDate;
        String author = article.getAuthorName() != null ? article.getAuthorName() : "Kings TV News Desk";
        
        headline = headline.replace("\"", "\\\"");
        description = description.replace("\"", "\\\"");
        author = author.replace("\"", "\\\"");
        
        String logoUrl = "";
        if (requestUrl != null && requestUrl.contains("/news/")) {
            logoUrl = requestUrl.substring(0, requestUrl.indexOf("/news/")) + "/assets/icons/logo.png";
        }
        
        return "{\n" +
                "  \"@context\": \"https://schema.org\",\n" +
                "  \"@type\": \"NewsArticle\",\n" +
                "  \"headline\": \"" + headline + "\",\n" +
                "  \"description\": \"" + description + "\",\n" +
                "  \"image\": [\n" +
                "    \"" + imageUrl + "\"\n" +
                "  ],\n" +
                "  \"datePublished\": \"" + pubDate + "\",\n" +
                "  \"dateModified\": \"" + modDate + "\",\n" +
                "  \"author\": [{\n" +
                "    \"@type\": \"Person\",\n" +
                "    \"name\": \"" + author + "\"\n" +
                "  }],\n" +
                "  \"publisher\": {\n" +
                "    \"@type\": \"Organization\",\n" +
                "    \"name\": \"KINGS 24x7\",\n" +
                "    \"logo\": {\n" +
                "      \"@type\": \"ImageObject\",\n" +
                "      \"url\": \"" + logoUrl + "\"\n" +
                "    }\n" +
                "  }\n" +
                "}";
    }

    private String getFallbackHtml() {
        return "<!doctype html>\n" +
                "<html lang=\"en\">\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\" />\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n" +
                "    <title>KINGS 24x7</title>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "    <div id=\"root\"></div>\n" +
                "  </body>\n" +
                "</html>";
    }
}
