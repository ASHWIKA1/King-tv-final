package com.kingstv.services;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to track failed login attempts per email/IP and enforce lockouts.
 */
@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 3;
    private static final int LOCKOUT_MINUTES = 15;

    // Tracks failed login attempts per key (email or IP)
    private final Map<String, Attempts> attemptsCache = new ConcurrentHashMap<>();

    private static class Attempts {
        int count;
        LocalDateTime lockoutTime;

        Attempts(int count) {
            this.count = count;
        }
    }

    /**
     * Clears failed login attempts for a key upon successful login.
     */
    public void loginSucceeded(String key) {
        if (key != null) {
            attemptsCache.remove(key.toLowerCase().trim());
        }
    }

    /**
     * Increments failed attempts and triggers lockout if max limit reached.
     */
    public void loginFailed(String key) {
        if (key == null) return;
        String cacheKey = key.toLowerCase().trim();
        Attempts attempts = attemptsCache.get(cacheKey);
        if (attempts == null) {
            attempts = new Attempts(1);
        } else {
            attempts.count++;
            if (attempts.count >= MAX_ATTEMPTS) {
                attempts.lockoutTime = LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES);
            }
        }
        attemptsCache.put(cacheKey, attempts);
    }

    /**
     * Checks if a key (email or IP) is locked out.
     */
    public boolean isBlocked(String key) {
        if (key == null) return false;
        String cacheKey = key.toLowerCase().trim();
        Attempts attempts = attemptsCache.get(cacheKey);
        if (attempts == null) {
            return false;
        }

        if (attempts.lockoutTime != null) {
            if (attempts.lockoutTime.isAfter(LocalDateTime.now())) {
                return true;
            } else {
                // Lockout expired, clean up the cache entry
                attemptsCache.remove(cacheKey);
                return false;
            }
        }
        return false;
    }

    /**
     * Returns remaining attempts before lockout.
     */
    public int getRemainingAttempts(String key) {
        if (key == null) return MAX_ATTEMPTS;
        String cacheKey = key.toLowerCase().trim();
        Attempts attempts = attemptsCache.get(cacheKey);
        if (attempts == null) {
            return MAX_ATTEMPTS;
        }
        return Math.max(0, MAX_ATTEMPTS - attempts.count);
    }
}
