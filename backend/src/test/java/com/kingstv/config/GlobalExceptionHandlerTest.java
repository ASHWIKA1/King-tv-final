package com.kingstv.config;

import com.kingstv.dto.ErrorResponse;
import com.kingstv.exception.BadRequestException;
import com.kingstv.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;
    private WebRequest webRequest;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/test");
        webRequest = new ServletWebRequest(request);
    }

    @Test
    void handleResourceNotFoundException() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Article not found");
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleResourceNotFoundException(ex, webRequest);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Article not found", response.getBody().getMessage());
        assertEquals("/api/v1/test", response.getBody().getPath());
    }

    @Test
    void handleBadRequestException() {
        BadRequestException ex = new BadRequestException("Invalid payload format");
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleBadRequestException(ex, webRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Invalid payload format", response.getBody().getMessage());
    }
}
