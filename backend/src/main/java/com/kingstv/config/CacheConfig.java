package com.kingstv.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import java.time.Duration;
import java.util.logging.Level;
import java.util.logging.Logger;

@Configuration
public class CacheConfig {

    private static final Logger LOGGER = Logger.getLogger(CacheConfig.class.getName());

    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        try {
            // Test connection to Redis server to confirm it is actually running
            connectionFactory.getConnection().close();

            LOGGER.info("Redis server is online. Configuring RedisCacheManager...");

            RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10)) // Default TTL 10 minutes
                    .disableCachingNullValues();

            return RedisCacheManager.builder(connectionFactory)
                    .cacheDefaults(defaultCacheConfig)
                    .transactionAware()
                    .build();
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Redis connection failed or not configured. Falling back to in-memory ConcurrentMapCacheManager.");
            return new ConcurrentMapCacheManager("articles", "articles_all", "articles_web");
        }
    }
}
