package com.kingstv.repository;

import com.kingstv.models.RefreshToken;
import com.kingstv.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    void deleteByUser(User user);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query("DELETE FROM RefreshToken r WHERE r.expiryDate < :now")
    void deleteExpiredTokens(@org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now);
}
