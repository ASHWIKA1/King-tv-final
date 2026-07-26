package com.kingstv.controllers;

import com.kingstv.models.User;
import com.kingstv.repository.UserRepository;
import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import dev.samstevens.totp.util.Utils;

@RestController
@RequestMapping("/api/v1/auth/2fa")
public class TwoFactorAuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/generate")
    public ResponseEntity<?> generateTotpSecret(Authentication authentication) throws QrGenerationException {
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByEmail(username);
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User user = optionalUser.get();
        
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        String secret = secretGenerator.generate();
        
        user.setTwoFactorSecret(secret);
        userRepository.save(user);
        
        QrData data = new QrData.Builder()
                .label(user.getEmail())
                .secret(secret)
                .issuer("King 24x7")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();
                
        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData = generator.generate(data);
        String mimeType = generator.getImageMimeType();
        String dataUri = Utils.getDataUriForImage(imageData, mimeType);
        
        Map<String, String> response = new HashMap<>();
        response.put("secret", secret);
        response.put("qrCode", dataUri);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyTotp(@RequestBody Map<String, String> request, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> optionalUser = userRepository.findByEmail(username);
        
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User user = optionalUser.get();
        String code = request.get("code");
        
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        
        boolean successful = verifier.isValidCode(user.getTwoFactorSecret(), code);
        
        if (successful) {
            user.setTwoFactorEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok().body("2FA enabled successfully");
        }
        
        return ResponseEntity.badRequest().body("Invalid code");
    }
}
