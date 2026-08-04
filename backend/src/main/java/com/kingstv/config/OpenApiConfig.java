package com.kingstv.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "BearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("King-TV CMS API")
                        .description("REST API for King-TV News Portal")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("King-TV Development Team")
                                .email("admin@kingstv.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://king24x7.com")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token to authorize protected API endpoints.")))
                .tags(List.of(
                        new Tag().name("Authentication").description("User Registration, Login, 2FA, OTP, Refresh Tokens"),
                        new Tag().name("Users").description("User Profile & Account Management"),
                        new Tag().name("Roles").description("Role-based Access Control & Permissions"),
                        new Tag().name("News").description("Articles, Stories, Drafts & Publishing Workflows"),
                        new Tag().name("Categories").description("Category & Subcategory Taxonomy Management"),
                        new Tag().name("Tags").description("Article Tags & Keywords"),
                        new Tag().name("Media").description("Image WebP Compression, S3 Storage & Video Transcoding"),
                        new Tag().name("Advertisements").description("Ad Banners & Campaign Management"),
                        new Tag().name("Breaking News").description("Ticker & Breaking News Alerts"),
                        new Tag().name("Live TV").description("Video & Live Stream Content Management"),
                        new Tag().name("Comments").description("Article Comments & Moderation"),
                        new Tag().name("Polls").description("Surveys & Audience Polls"),
                        new Tag().name("SEO").description("Meta Descriptions, AMP Pages, Sitemap & SEO Optimization"),
                        new Tag().name("Dashboard").description("Admin Portal Overview & Summary Metrics"),
                        new Tag().name("Analytics").description("Audience Views, Trending Topics & Keyword Analytics"),
                        new Tag().name("Notifications").description("Push Notifications & User System Alerts"),
                        new Tag().name("Settings").description("System & Application Configuration Settings")
                ));
    }
}
