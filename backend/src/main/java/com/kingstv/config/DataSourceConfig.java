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

        if (!cleanUrl.isEmpty() && !cleanUsername.isEmpty()) {
            log.info("Initializing HikariCP connection pool for primary database at: {}", cleanUrl);
            try {
                HikariConfig hikariConfig = new HikariConfig();
                hikariConfig.setJdbcUrl(cleanUrl);
                hikariConfig.setUsername(cleanUsername);
                hikariConfig.setPassword(cleanPassword);
                hikariConfig.setDriverClassName(mysqlDriver != null && !mysqlDriver.trim().isEmpty() ? mysqlDriver.trim() : "com.mysql.cj.jdbc.Driver");
                hikariConfig.setMaximumPoolSize(maxPoolSize);
                hikariConfig.setMinimumIdle(minIdle);
                hikariConfig.setIdleTimeout(idleTimeout);
                hikariConfig.setMaxLifetime(maxLifetime);
                hikariConfig.setConnectionTimeout(connectionTimeout);
                hikariConfig.setInitializationFailTimeout(connectionTimeout); // Full timeout for primary TiDB/MySQL connection
                hikariConfig.setConnectionInitSql("SET NAMES utf8mb4");

                HikariDataSource ds = new HikariDataSource(hikariConfig);
                try (Connection conn = ds.getConnection()) {
                    log.info("HikariCP connection pool initialized successfully! Primary TiDB/MySQL database connection active.");
                    return ds;
                }
            } catch (Exception e) {
                log.error("CRITICAL: Failed to connect to primary MySQL/TiDB database at {}. Underlying Error: {}", cleanUrl, e.getMessage(), e);
                log.warn("Falling back to embedded H2 database for resilient application startup.");
            }
        } else {
            log.warn("Primary database credentials or URL incomplete. Falling back to embedded H2 database.");
        }

        // Resilient Fallback: Embedded H2 database with full MySQL compatibility
        log.info("Initializing embedded H2 fallback database (MODE=MySQL)...");
        HikariConfig fallbackConfig = new HikariConfig();
        fallbackConfig.setJdbcUrl("jdbc:h2:mem:kingstvdb;DB_CLOSE_DELAY=-1;MODE=MySQL;NON_KEYWORDS=USER,ROLE,VALUE");
        fallbackConfig.setUsername("sa");
        fallbackConfig.setPassword("");
        fallbackConfig.setDriverClassName("org.h2.Driver");
        fallbackConfig.setMaximumPoolSize(maxPoolSize);
        fallbackConfig.setMinimumIdle(minIdle);
        fallbackConfig.setConnectionTimeout(connectionTimeout);

        HikariDataSource fallbackDs = new HikariDataSource(fallbackConfig);
        log.info("Embedded H2 fallback database connection pool initialized successfully!");
        return fallbackDs;
    }
}
