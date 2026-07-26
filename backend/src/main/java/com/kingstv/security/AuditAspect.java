package com.kingstv.security;

import com.kingstv.models.AuditLog;
import com.kingstv.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * AOP Aspect for automatic audit logging.
 * Intercepts all service methods annotated with @Auditable and writes an
 * append-only audit log entry with the actor, action type, entity info, and timestamp.
 *
 * Developers cannot forget to log — it's automatic via annotation.
 */
@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @AfterReturning(pointcut = "@annotation(auditable)", returning = "result")
    public void logAction(JoinPoint joinPoint, Auditable auditable, Object result) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String actorEmail = "system";
            String actorRole = "SYSTEM";
            Long actorId = null;

            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof String) {
                actorEmail = (String) auth.getPrincipal();
                actorRole = auth.getAuthorities().stream()
                        .filter(a -> a.getAuthority().startsWith("ROLE_"))
                        .map(a -> a.getAuthority().substring(5))
                        .findFirst()
                        .orElse("UNKNOWN");

                // Extract userId from authentication details if available
                Object details = auth.getDetails();
                if (details instanceof Long) {
                    actorId = (Long) details;
                }
            }

            // Try to extract entity ID from the result or method arguments
            Long entityId = extractEntityId(result, joinPoint.getArgs());

            // Build detail string from method arguments
            String details = buildDetails(joinPoint, auditable);

            // Get IP address
            String ipAddress = getClientIp();

            AuditLog log = new AuditLog();
            log.setActorId(actorId);
            log.setActorEmail(actorEmail);
            log.setActorRole(actorRole);
            log.setActionType(auditable.action());
            log.setEntityType(auditable.entity());
            log.setEntityId(entityId);
            log.setDetails(details);
            log.setIpAddress(ipAddress);

            auditLogRepository.save(log);
        } catch (Exception e) {
            // Audit logging should never break the main flow
            System.err.println("Audit log failed: " + e.getMessage());
        }
    }

    private Long extractEntityId(Object result, Object[] args) {
        // Try common patterns for entity ID extraction
        if (result != null) {
            try {
                java.lang.reflect.Method getId = result.getClass().getMethod("getId");
                Object id = getId.invoke(result);
                if (id instanceof Long) return (Long) id;
            } catch (Exception ignored) {}
        }

        // Check first argument for ID
        if (args != null && args.length > 0 && args[0] instanceof Long) {
            return (Long) args[0];
        }

        return null;
    }

    private String buildDetails(JoinPoint joinPoint, Auditable auditable) {
        String methodName = joinPoint.getSignature().getName();
        return String.format("%s.%s - %s %s",
                joinPoint.getTarget().getClass().getSimpleName(),
                methodName,
                auditable.action(),
                auditable.entity());
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xff = request.getHeader("X-Forwarded-For");
                return xff != null ? xff.split(",")[0].trim() : request.getRemoteAddr();
            }
        } catch (Exception ignored) {}
        return "unknown";
    }
}
