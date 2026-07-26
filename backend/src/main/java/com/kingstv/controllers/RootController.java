package com.kingstv.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.RequestDispatcher;
import java.util.Map;

@RestController
public class RootController implements ErrorController {

    @GetMapping("/")
    public Map<String, Object> getRootInfo() {
        return Map.of(
            "status", "UP",
            "message", "Kings TV News Portal Backend API is running successfully.",
            "healthCheck", "/api/v1/health",
            "documentation", "https://github.com/VishalavDEV/Kings-TV"
        );
    }

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request, HttpServletResponse response) {
        Object statusCodeObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        if (statusCodeObj != null) {
            statusCode = Integer.parseInt(statusCodeObj.toString());
        }

        HttpStatus httpStatus = HttpStatus.resolve(statusCode);
        if (httpStatus == null) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        Object exceptionObj = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        String details = (exceptionObj != null) ? exceptionObj.toString() : "No exception details available";

        Object messageObj = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        String message = (messageObj != null && !messageObj.toString().isEmpty()) 
            ? messageObj.toString() 
            : "An unexpected error occurred or authentication was denied.";

        return ResponseEntity.status(httpStatus).body(Map.of(
            "status", statusCode,
            "error", httpStatus.getReasonPhrase(),
            "message", message,
            "details", details
        ));
    }
}
