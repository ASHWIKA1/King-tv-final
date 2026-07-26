package com.kingstv.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation for RBAC enforcement.
 * Applied to controller methods to declaratively require specific permissions.
 * The RbacInterceptor AOP aspect reads this annotation and checks the authenticated
 * user's permissions from the JWT, returning 403 if the permission is missing.
 *
 * Usage: @RequiresPermission("article:delete")
 * Usage: @RequiresPermission(value = "article:delete", anyOf = {"SUPER_ADMIN", "CHIEF_EDITOR"})
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresPermission {
    /**
     * The permission name required (e.g., "article:delete").
     * If empty, the anyOf roles check is used instead.
     */
    String value() default "";

    /**
     * Alternative: require any of these roles (e.g., {"SUPER_ADMIN", "CHIEF_EDITOR"}).
     * This is checked only if value() is empty.
     */
    String[] anyOf() default {};
}
