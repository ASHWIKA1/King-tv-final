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
        if (mysqlUsername == null || mysqlUsername.trim().isEmpty()) {
            log.error("CRITICAL: Database username ('spring.datasource.username' or 'SPRING_DATASOURCE_USERNAME') is missing!");
            throw new IllegalStateException("Database configuration error: Database username is required. Application startup aborted.");
        }

        log.info("Attempting connection test to TiDB/MySQL database at: {}", mysqlUrl);

        try {
            Class.forName(mysqlDriver);
            DriverManager.setLoginTimeout(5);
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
                log.info("TiDB/MySQL database connection successful! Active pool: HikariCP");
            }
        } catch (Exception e) {
            log.error("CRITICAL: Failed to connect to TiDB/MySQL database at {}: {}", mysqlUrl, e.getMessage());
            throw new IllegalStateException("CRITICAL: Could not establish connection to TiDB/MySQL database. H2 fallback is disabled. Application startup aborted.", e);
        }

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(mysqlUrl);
        hikariConfig.setUsername(mysqlUsername);
        hikariConfig.setPassword(mysqlPassword);
        hikariConfig.setDriverClassName(mysqlDriver);
        hikariConfig.setMaximumPoolSize(maxPoolSize);
        hikariConfig.setMinimumIdle(minIdle);
        hikariConfig.setIdleTimeout(idleTimeout);
        hikariConfig.setMaxLifetime(maxLifetime);
        hikariConfig.setConnectionTimeout(connectionTimeout);
        hikariConfig.setConnectionInitSql("SET NAMES utf8mb4");

        return new HikariDataSource(hikariConfig);
    }
}
