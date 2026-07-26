package com.kingstv.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        String role = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                role = (String) jwtUtil.extractClaim(jwt, claims -> claims.get("role"));
            } catch (Exception e) {
                logger.warn("JWT validation failed: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(jwt, username)) {
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                    // Add role authority
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

                    // Add permission authorities from JWT for RBAC interceptor
                    List<String> permissions = jwtUtil.extractPermissions(jwt);
                    for (String perm : permissions) {
                        authorities.add(new SimpleGrantedAuthority("PERM_" + perm));
                    }

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, authorities);
                    
                    // Store userId in details for audit logging
                    Long userId = jwtUtil.extractUserId(jwt);
                    authToken.setDetails(userId);
                    
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                logger.warn("JWT authorization context set failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
