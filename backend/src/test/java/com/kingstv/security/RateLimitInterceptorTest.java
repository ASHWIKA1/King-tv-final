package com.kingstv.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import static org.junit.jupiter.api.Assertions.*;

public class RateLimitInterceptorTest {

    @Test
    public void testRateLimitingUnderLimit() throws Exception {
        RateLimitInterceptor interceptor = new RateLimitInterceptor();
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/comments");
        request.setRemoteAddr("127.0.0.1");
        MockHttpServletResponse response = new MockHttpServletResponse();

        boolean result = interceptor.preHandle(request, response, new Object());
        assertTrue(result, "Request should be permitted within limit");
        assertEquals(200, response.getStatus(), "HTTP status should be 200");
    }

    @Test
    public void testRateLimitingExceeded() throws Exception {
        RateLimitInterceptor interceptor = new RateLimitInterceptor();
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/report-news");
        request.setRemoteAddr("127.0.0.2");

        // The capacity for CROWD_REPORT_POST is 10 requests. Consume all.
        for (int i = 0; i < 10; i++) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            boolean result = interceptor.preHandle(request, response, new Object());
            assertTrue(result, "Consumption should succeed at attempt " + (i + 1));
        }

        // 11th request should exceed the limit and be blocked
        MockHttpServletResponse blockedResponse = new MockHttpServletResponse();
        boolean result = interceptor.preHandle(request, blockedResponse, new Object());
        assertFalse(result, "11th request should be blocked by rate limiter");
        assertEquals(429, blockedResponse.getStatus(), "Response status should be 429 Too Many Requests");
        assertTrue(blockedResponse.getContentAsString().contains("Too many requests"), "Error response body should contain warning message");
    }
}
