package com.kingstv.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Value;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String mysqlUrl;

    @Value("${spring.datasource.username}")
    private String mysqlUsername;

    @Value("${spring.datasource.password}")
    private String mysqlPassword;

    @Value("${spring.datasource.driver-class-name}")
    private String mysqlDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        try {
            // Load driver class
            Class.forName(mysqlDriver);
            // Verify connection with a short timeout
            DriverManager.setLoginTimeout(3);
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
                System.out.println(">>> MySQL database connection successful! Using MySQL database.");
                return DataSourceBuilder.create()
                        .url(mysqlUrl)
                        .username(mysqlUsername)
                        .password(mysqlPassword)
                        .driverClassName(mysqlDriver)
                        .build();
            }
        } catch (Exception e) {
            System.err.println(">>> MySQL connection failed: " + e.getMessage());
            System.out.println(">>> FALLING BACK TO IN-MEMORY H2 DATABASE FOR LOCAL EXECUTION.");
            
            // Expose fallback properties
            return DataSourceBuilder.create()
                    .url("jdbc:h2:mem:kings_tv_db;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_UPPER=false")
                    .username("sa")
                    .password("")
                    .driverClassName("org.h2.Driver")
                    .build();
        }
    }
}
