package com.kingstv.repository;

import com.kingstv.models.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findByEmailAndOtpCode(String email, String otpCode);
    List<PasswordResetOtp> findByEmail(String email);
    void deleteByEmail(String email);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query("DELETE FROM PasswordResetOtp p WHERE p.expiryTime < :now")
    void deleteExpiredOtps(@org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now);
}
