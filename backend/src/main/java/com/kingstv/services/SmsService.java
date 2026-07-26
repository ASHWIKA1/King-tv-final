package com.kingstv.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

@Service
public class SmsService {
    private static final Logger LOGGER = Logger.getLogger(SmsService.class.getName());
    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private SystemConfigService systemConfigService;

    public boolean sendOtpSms(String phoneNumber, String otpCode) {
        String gatewayUrl = systemConfigService.getConfigValue("sms.gateway_url");
        String apiKey = systemConfigService.getConfigValue("sms.gateway_api_key");

        if (gatewayUrl == null || gatewayUrl.isBlank()) {
            // Default to Fast2SMS URL pattern if URL is not configured
            gatewayUrl = "https://www.fast2sms.com/dev/bulkV2?authorization={api_key}&route=otp&variables_values={otp}&numbers={phone}";
        }

        if (apiKey == null || apiKey.isBlank() || "òòòòòòòò".equals(apiKey)) {
            LOGGER.warning("SMS Gateway API Key is not configured. Falling back to sandbox console print.");
            LOGGER.info("========================================");
            LOGGER.info("SMS OTP for " + phoneNumber + " is: " + otpCode);
            LOGGER.info("========================================");
            return false;
        }

        try {
            // Clean phone number to ensure digits only
            String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
            
            // Build the URL by replacing placeholders
            String url = gatewayUrl
                .replace("{api_key}", URLEncoder.encode(apiKey, StandardCharsets.UTF_8))
                .replace("{otp}", URLEncoder.encode(otpCode, StandardCharsets.UTF_8))
                .replace("{phone}", URLEncoder.encode(cleanPhone, StandardCharsets.UTF_8));

            LOGGER.info("Sending SMS OTP to " + cleanPhone + " via URL: " + url.replaceAll("authorization=[^&]+", "authorization=***"));
            String response = restTemplate.getForObject(url, String.class);
            LOGGER.info("SMS Gateway Response: " + response);
            return true;
        } catch (Exception e) {
            LOGGER.severe("Failed to send SMS OTP: " + e.getMessage());
            return false;
        }
    }
}
