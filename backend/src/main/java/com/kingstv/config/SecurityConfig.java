package com.kingstv.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.kingstv.security.JwtAuthenticationFilter;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; media-src 'self' https:; frame-src 'self' https:; connect-src 'self' https:;"))
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(contentType -> {}) // standard spring security default is nosniff anyway
                .referrerPolicy(referrer -> referrer.policy(org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .permissionsPolicy(permissions -> permissions.policy("geolocation=(self), microphone=(), camera=()"))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/api/v1/auth/**", 
                    "/api/auth/**",
                    "/uploads/**",
                    "/api/v1/health", 
                    "/api/v1/breaking-news", "/api/v1/breaking-news/**",
                    "/api/v1/articles", "/api/v1/articles/**",
                    "/api/v1/categories", "/api/v1/categories/**",
                    "/api/v1/videos", "/api/v1/videos/**",
                    "/api/v1/pdfs", "/api/v1/pdfs/**",
                    "/api/v1/jobs", "/api/v1/jobs/**",
                    "/api/jobs", "/api/jobs/**",
                    "/api/resume/**", "/api/candidate/**", "/api/employer/**",
                    "/api/obituaries", "/api/obituaries/**",
                    "/api/v1/classifieds", "/api/v1/classifieds/**",
                    "/api/classifieds", "/api/classifieds/**",
                    "/api/sellers/**", "/api/my-classifieds",
                    "/api/v1/wishes", "/api/v1/wishes/**",
                    "/api/wishes", "/api/wishes/**",
                    "/api/v1/obituaries", "/api/v1/obituaries/**",
                    "/api/v1/directory", "/api/v1/directory/**",
                    "/api/v1/districts", "/api/v1/districts/**",
                    "/api/v1/weather", "/api/v1/weather/**", "/api/weather", "/api/weather/**",
                    "/api/v1/home", "/api/v1/home/**",
                    "/api/v1/stories", "/api/v1/stories/**",
                    "/api/v1/web-stories", "/api/v1/web-stories/**",
                    "/api/v1/pages", "/api/v1/pages/**",
                    "/api/v1/comments", "/api/v1/comments/**",
                    "/api/v1/report-news/saveUpdate",
                    "/t/{shortCode}",
                    "/api/v1/deals", "/api/v1/deals/**",
                    "/api/v1/rfq", "/api/v1/rfq/**",
                    "/api/v1/nfc/stats", "/api/v1/nfc/taps", "/api/v1/nfc/request",
                    "/api/v1/rss-aggregator", "/api/v1/rss-aggregator/**",
                    "/api/v1/analytics/trending-keywords",
                    "/api/v1/advertisements", "/api/v1/advertisements/**",
                    "/robots.txt", "/sitemap.xml", "/rss.xml", "/news/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api/v1/public/**",
                    "/ws/**",
                    "/api/uptime",
                    "/api/v1/uptime",
                    "/error",
                    "/"
                ).permitAll()
                // Admin portal endpoints require authentication
                .requestMatchers("/api/v1/admin/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        org.springframework.web.filter.CharacterEncodingFilter encodingFilter = new org.springframework.web.filter.CharacterEncodingFilter();
        encodingFilter.setEncoding("UTF-8");
        encodingFilter.setForceEncoding(true);
        http.addFilterBefore(encodingFilter, org.springframework.security.web.header.HeaderWriterFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
