package com.kingstv.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(RateLimitInterceptor.class);

    private final Map<String, TokenBucket> ipBuckets = new ConcurrentHashMap<>();

    private static class TokenBucket {
        private final long capacity;
        private final long refillIntervalMs;
        private final double refillRate; // tokens per millisecond
        private double tokens;
        private long lastRefillTime;

        public TokenBucket(long capacity, long refillIntervalMs) {
            this.capacity = capacity;
            this.refillIntervalMs = refillIntervalMs;
            this.tokens = capacity;
            this.refillRate = (double) capacity / refillIntervalMs;
            this.lastRefillTime = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsed = now - lastRefillTime;
            if (elapsed > 0) {
                tokens = Math.min(capacity, tokens + (elapsed * refillRate));
                lastRefillTime = now;
            }
        }

        public synchronized boolean isStale() {
            return (System.currentTimeMillis() - lastRefillTime) > 600000; // 10 minutes inactive
        }
    }

    @Scheduled(fixedRate = 600000) // Cleanup every 10 minutes
    public void cleanupStaleBuckets() {
        int beforeSize = ipBuckets.size();
        ipBuckets.entrySet().removeIf(entry -> entry.getValue().isStale());
        log.debug("Cleaned up stale rate limit buckets. Before: {}, After: {}", beforeSize, ipBuckets.size());
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = getClientIp(request);

        String category = getRateLimitCategory(path, method);
        if (category == null) {
            return true; // No rate limit category matched
        }

        String bucketKey = clientIp + ":" + category;
        TokenBucket bucket = ipBuckets.computeIfAbsent(bucketKey, k -> createBucketForCategory(category));

        if (!bucket.tryConsume()) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\": \"Too many requests. Please try again later.\"}");
            return false;
        }

        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private String getRateLimitCategory(String path, String method) {
        if (path.contains("/api/v1/auth") || path.contains("/api/auth")) {
            return "AUTH";
        }
        if (path.contains("/api/v1/comments") && "POST".equalsIgnoreCase(method)) {
            return "COMMENT_POST";
        }
        if (path.contains("/api/v1/report-news") && "POST".equalsIgnoreCase(method)) {
            return "CROWD_REPORT_POST";
        }
        if (path.contains("/api/v1/articles/getAll") ||
            path.contains("/api/v1/articles/getAllWeb") ||
            path.contains("/api/v1/public/news") ||
            path.contains("/api/v1/articles/public/news") ||
            path.contains("/api/v1/public/news/search")) {
            return "SEARCH";
        }
        return null;
    }

    private TokenBucket createBucketForCategory(String category) {
        switch (category) {
            case "AUTH":
                // 10 requests per minute
                return new TokenBucket(10, 60000);
            case "COMMENT_POST":
                // 20 requests per minute
                return new TokenBucket(20, 60000);
            case "CROWD_REPORT_POST":
                // 10 requests per minute
                return new TokenBucket(10, 60000);
            case "SEARCH":
                // 30 requests per minute
                return new TokenBucket(30, 60000);
            default:
                return new TokenBucket(60, 60000);
        }
    }
}
