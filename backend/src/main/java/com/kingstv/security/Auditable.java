package com.kingstv.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation for automatic audit logging.
 * Applied to service methods to automatically write an audit log entry
 * via the AuditAspect AOP aspect.
 *
 * Usage: @Auditable(action = "CREATE", entity = "Article")
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
    String entity();
}
