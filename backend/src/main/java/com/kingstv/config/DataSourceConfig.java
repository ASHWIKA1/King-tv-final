package com.kingstv.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String mysqlUrl;

    @Value("${spring.datasource.username}")
    private String mysqlUsername;

    @Value("${spring.datasource.password}")
    private String mysqlPassword;

    @Value("${spring.datasource.driver-class-name}")
    private String mysqlDriver;

    @Value("${spring.datasource.hikari.maximum-pool-size:20}")
    private int maxPoolSize;

    @Value("${spring.datasource.hikari.minimum-idle:5}")
    private int minIdle;

    @Value("${spring.datasource.hikari.idle-timeout:300000}")
    private long idleTimeout;

    @Value("${spring.datasource.hikari.max-lifetime:1800000}")
    private long maxLifetime;

    @Value("${spring.datasource.hikari.connection-timeout:30000}")
    private long connectionTimeout;

    @Bean
    @Primary
    public DataSource dataSource() {
        String cleanUrl = mysqlUrl != null ? mysqlUrl.trim() : "";
        if (cleanUrl.contains("sslMode=VERIFY_IDENTITY")) {
            cleanUrl = cleanUrl.replace("sslMode=VERIFY_IDENTITY", "sslMode=PREFERRED");
        }
        String cleanUsername = mysqlUsername != null ? mysqlUsername.trim() : "";
        String cleanPassword = mysqlPassword != null ? mysqlPassword.trim() : "";

        if (cleanUsername.isEmpty()) {
            log.error("CRITICAL: Database username is missing!");
            throw new IllegalStateException("Database configuration error: Database username is required. Application startup aborted.");
        }

        log.info("Initializing HikariCP connection pool for TiDB/MySQL database at: {}", cleanUrl);

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(cleanUrl);
        hikariConfig.setUsername(cleanUsername);
        hikariConfig.setPassword(cleanPassword);
        hikariConfig.setDriverClassName(mysqlDriver);
        hikariConfig.setMaximumPoolSize(maxPoolSize);
        hikariConfig.setMinimumIdle(minIdle);
        hikariConfig.setIdleTimeout(idleTimeout);
        hikariConfig.setMaxLifetime(maxLifetime);
        hikariConfig.setConnectionTimeout(connectionTimeout);
        hikariConfig.setInitializationFailTimeout(30000); // 30s timeout for Hikari pool initialization
        hikariConfig.setConnectionInitSql("SET NAMES utf8mb4");

        try {
            HikariDataSource ds = new HikariDataSource(hikariConfig);
            log.info("HikariCP connection pool initialized successfully! TiDB/MySQL connection active.");
            return ds;
        } catch (Exception e) {
            log.error("CRITICAL: Failed to initialize HikariCP connection pool to TiDB/MySQL database at {}: {}", cleanUrl, e.getMessage());
            throw new IllegalStateException("CRITICAL: Could not establish connection to TiDB/MySQL database. Application startup aborted.", e);
        }
    }
}
