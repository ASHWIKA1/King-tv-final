package com.kingstv.repository;

import com.kingstv.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByFullName(String fullName);
    Page<User> findByRole(String role, Pageable pageable);
    List<User> findByRole(String role);
    long countByRole(String role);
    long countByIsActive(Boolean isActive);
    List<User> findByRoleAndIsActive(String role, Boolean isActive);

    @Query("SELECT u FROM User u WHERE (:role IS NULL OR u.role = :role) AND (:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsers(@Param("role") String role, @Param("search") String search, Pageable pageable);
}
