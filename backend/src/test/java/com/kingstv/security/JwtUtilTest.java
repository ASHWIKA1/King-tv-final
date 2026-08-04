package com.kingstv.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", "test_super_secret_key_minimum_32_bytes_long_string_12345");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 3600000L);
        jwtUtil.init();
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = jwtUtil.generateToken("user@kingstv.com", "ADMIN", 42L);
        assertNotNull(token);

        assertTrue(jwtUtil.validateToken(token, "user@kingstv.com"));
        assertEquals("user@kingstv.com", jwtUtil.extractUsername(token));
        assertEquals(42L, jwtUtil.extractUserId(token));
    }

    @Test
    void testPermissionsInToken() {
        List<String> perms = List.of("ARTICLE_CREATE", "ARTICLE_PUBLISH");
        String token = jwtUtil.generateToken("editor@kingstv.com", "EDITOR", 100L, perms);

        List<String> extractedPerms = jwtUtil.extractPermissions(token);
        assertEquals(2, extractedPerms.size());
        assertTrue(extractedPerms.contains("ARTICLE_CREATE"));
    }

    @Test
    void testInvalidTokenValidation() {
        String token = jwtUtil.generateToken("user@kingstv.com", "READER", 1L);
        assertFalse(jwtUtil.validateToken(token, "otheruser@kingstv.com"));
    }
}
