package com.kingstv.security;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AOP Aspect that enforces RBAC on every endpoint annotated with @RequiresPermission.
 * This is the single, reusable middleware — no duplicated role checks per-endpoint.
 *
 * It reads the authenticated user's authorities (set by JwtAuthenticationFilter) and
 * checks them against the required permission or roles declared in the annotation.
 */
@Aspect
@Component
public class RbacInterceptor {

    @Around("@annotation(requiresPermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, RequiresPermission requiresPermission) throws Throwable {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required"));
        }

        Set<String> userAuthorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String userRole = extractRole(userAuthorities);

        // Super Admin bypasses all permission checks
        if ("SUPER_ADMIN".equals(userRole)) {
            return joinPoint.proceed();
        }

        // Check specific permission
        String requiredPermission = requiresPermission.value();
        if (!requiredPermission.isEmpty()) {
            String permAuthority = "PERM_" + requiredPermission;
            if (!userAuthorities.contains(permAuthority)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied. Required permission: " + requiredPermission,
                                     "error", "FORBIDDEN"));
            }
            return joinPoint.proceed();
        }

        // Check role-based access
        String[] anyOfRoles = requiresPermission.anyOf();
        if (anyOfRoles.length > 0) {
            boolean hasRole = false;
            for (String role : anyOfRoles) {
                if (role.equals(userRole)) {
                    hasRole = true;
                    break;
                }
            }
            if (!hasRole) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied. Required roles: " + Arrays.toString(anyOfRoles),
                                     "error", "FORBIDDEN"));
            }
        }

        return joinPoint.proceed();
    }

    /**
     * Also support class-level @RequiresPermission
     */
    @Around("@within(requiresPermission)")
    public Object checkClassPermission(ProceedingJoinPoint joinPoint, RequiresPermission requiresPermission) throws Throwable {
        // Check if method has its own annotation (method-level takes precedence)
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        if (method.isAnnotationPresent(RequiresPermission.class)) {
            // Method-level annotation will be handled by the other @Around advice
            return joinPoint.proceed();
        }
        return checkPermission(joinPoint, requiresPermission);
    }

    private String extractRole(Set<String> authorities) {
        return authorities.stream()
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .findFirst()
                .orElse("READER");
    }
}
