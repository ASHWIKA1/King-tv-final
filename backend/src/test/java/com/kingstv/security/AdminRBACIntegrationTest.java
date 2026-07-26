package com.kingstv.security;

import com.kingstv.services.RssAggregatorService;
import com.kingstv.repository.AdvertisementRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminRBACIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockBean
    private RssAggregatorService rssAggregatorService;

    @MockBean
    private AdvertisementRepository advertisementRepository;

    @Test
    public void testForceFetchRssUnauthenticated() throws Exception {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
        // Without Authorization header, should be blocked and return 401 Unauthorized by RbacInterceptor
        mockMvc.perform(post("/api/v1/rss-aggregator/sync")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testForceFetchRssAsSuperAdmin() throws Exception {
        // Generate a token for SUPER_ADMIN role with required permissions
        String token = jwtUtil.generateToken("admin", "SUPER_ADMIN", 1L, List.of("ARTICLE_PUBLISH", "ARTICLE_REVIEW"));

        mockMvc.perform(post("/api/v1/rss-aggregator/sync")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Mockito.verify(rssAggregatorService, Mockito.times(1)).fetchAggregatedFeeds();
    }

    @Test
    public void testSaveAdvertisementUnauthenticated() throws Exception {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
        mockMvc.perform(post("/api/v1/advertisements")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"placementId\":\"sidebar\",\"title\":\"Promo Ad\",\"imageUrl\":\"http://example.com/ad.png\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testSaveAdvertisementAsSuperAdminWithInvalidFields() throws Exception {
        // Generate super admin token
        String token = jwtUtil.generateToken("admin", "SUPER_ADMIN", 1L, List.of("ARTICLE_PUBLISH", "ARTICLE_REVIEW"));

        // Validation should trigger 400 Bad Request because fields are missing, but NOT 401/403!
        mockMvc.perform(post("/api/v1/advertisements")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUpdateKycStatusUnauthenticated() throws Exception {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
        // PATCH /api/v1/directory/{id}/kyc has @RequiresPermission, so unauthenticated returns 401
        mockMvc.perform(patch("/api/v1/directory/1/kyc")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"approved\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testRequestNfcUnauthenticated() throws Exception {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
        mockMvc.perform(post("/api/v1/nfc/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"listingId\":1,\"linkType\":\"profile\"}"))
                .andExpect(status().isUnauthorized());
    }
}
