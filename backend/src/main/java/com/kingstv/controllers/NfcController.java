package com.kingstv.controllers;

import com.kingstv.models.NfcCard;
import com.kingstv.models.NfcTapHistory;
import com.kingstv.models.DirectoryListing;
import com.kingstv.models.User;
import com.kingstv.models.AuditLog;
import com.kingstv.models.NfcCardAuditLog;
import com.kingstv.models.PaymentStatus;
import com.kingstv.repository.NfcCardRepository;
import com.kingstv.repository.NfcTapHistoryRepository;
import com.kingstv.repository.DirectoryRepository;
import com.kingstv.repository.UserRepository;
import com.kingstv.repository.AuditLogRepository;
import com.kingstv.repository.NfcCardAuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
public class NfcController {

    @Autowired
    private NfcCardRepository nfcCardRepository;

    @Autowired
    private NfcTapHistoryRepository nfcTapHistoryRepository;

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NfcCardAuditLogRepository nfcCardAuditLogRepository;

    // --- Dynamic Shortcode Redirector ---
    @GetMapping("/t/{shortCode}")
    public RedirectView handleNfcTap(@PathVariable String shortCode, @RequestParam(required = false) String name) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findByShortCode(shortCode);
        if (cardOpt.isEmpty() || "blocked".equalsIgnoreCase(cardOpt.get().getCardStatus())) {
            return new RedirectView("http://localhost:5173/error?message=Card%20not%20found%20or%20blocked");
        }

        NfcCard card = cardOpt.get();
        
        // Log the Tap event
        NfcTapHistory tap = new NfcTapHistory();
        tap.setCardId(card.getId());
        tap.setTapType(card.getLinkType());
        tap.setCustomerName(name != null ? name : "Visitor");
        tap.setStatus("success");
        tap.setLocationCity("Anna Nagar, Chennai");
        
        if ("payment".equalsIgnoreCase(card.getLinkType()) && card.getIsPaymentEnabled()) {
            tap.setAmount(150.00); // Simulate mock transaction amount
        } else {
            tap.setAmount(0.0);
        }
        nfcTapHistoryRepository.save(tap);

        if ("payment".equalsIgnoreCase(card.getLinkType()) && card.getIsPaymentEnabled() && card.getUpiId() != null) {
            // Redirect to merchant payment (simulated UPI pay page or external gateway link)
            String upiPayUrl = "upi://pay?pa=" + card.getUpiId() + "&pn=" + (card.getUpiName() != null ? card.getUpiName() : "Merchant") + "&am=150.00&cu=INR";
            return new RedirectView("http://localhost:5173/profile?upiUrl=" + Base64.getEncoder().encodeToString(upiPayUrl.getBytes()));
        } else {
            // Redirect to merchant's public business profile directory listing
            return new RedirectView("http://localhost:5173/directory?business=" + card.getListingId());
        }
    }

    // --- NFC Card CRUD & Lifecycle Endpoints ---
    @PostMapping("/api/v1/nfc/request")
    public ResponseEntity<?> requestCard(@RequestBody Map<String, Object> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        if (!request.containsKey("listingId") || !request.containsKey("linkType")) {
            return ResponseEntity.badRequest().body(Map.of("message", "listingId and linkType are required"));
        }
        
        Long listingId = Long.valueOf(request.get("listingId").toString());
        String linkType = request.get("linkType").toString();
        String upiId = request.getOrDefault("upiId", "").toString();
        String upiName = request.getOrDefault("upiName", "").toString();

        Optional<DirectoryListing> listingOpt = directoryRepository.findById(listingId);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Business listing not found"));
        }

        DirectoryListing listing = listingOpt.get();
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty() || !Objects.equals(listing.getCreatedBy(), (long) uOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You do not own this business listing"));
        }

        if (!"approved".equalsIgnoreCase(listing.getKycStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "NFC Card can only be requested after KYC approval of the business"));
        }

        // Check if card is already requested
        Optional<NfcCard> existing = nfcCardRepository.findByListingId(listingId);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "NFC Card already requested for this business"));
        }

        NfcCard card = new NfcCard();
        card.setListingId(listingId);
        card.setLinkType(linkType);
        card.setUpiId(upiId);
        card.setUpiName(upiName);
        card.setIsPaymentEnabled("payment".equalsIgnoreCase(linkType));
        card.setCardStatus("requested");
        card.setRequestedAt(LocalDateTime.now());
        card.setShortCode(UUID.randomUUID().toString().substring(0, 8));
        card.setOtpHash(String.format("%04d", new Random().nextInt(10000))); // Plain 4-digit code simulated
        
        NfcCard saved = nfcCardRepository.save(card);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/api/v1/nfc/{id}/upi")
    public ResponseEntity<?> updateUpi(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "NFC Card not found"));
        }
        NfcCard card = cardOpt.get();
        card.setUpiId(request.get("upiId"));
        card.setUpiName(request.get("upiName"));
        if (request.containsKey("linkType")) {
            card.setLinkType(request.get("linkType"));
            card.setIsPaymentEnabled("payment".equalsIgnoreCase(request.get("linkType")));
        }
        NfcCard saved = nfcCardRepository.save(card);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/api/v1/nfc/{id}/status")
    public ResponseEntity<?> changeCardStatus(@PathVariable Long id, @RequestBody Map<String, String> request, Principal principal) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "NFC Card not found"));
        }
        NfcCard card = cardOpt.get();
        String status = request.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        
        String current = card.getCardStatus() != null ? card.getCardStatus().toLowerCase() : "requested";
        String next = status.toLowerCase();
        String note = request.getOrDefault("note", "");
        String reason = request.getOrDefault("reason", "");
        String cardUid = request.get("cardUid");
        
        boolean isValid = false;
        
        if (next.equals("processing")) {
            if (current.equals("requested") || current.equals("undelivered")) {
                isValid = true;
                card.setProcessingAt(LocalDateTime.now());
            }
        } else if (next.equals("issued")) {
            if (current.equals("processing") || current.equals("undelivered")) {
                isValid = true;
                card.setIssuedAt(LocalDateTime.now());
                if (cardUid != null && !cardUid.trim().isEmpty()) {
                    card.setShortCode(cardUid);
                }
            }
        } else if (next.equals("delivered")) {
            if (current.equals("issued")) {
                isValid = true;
                card.setDeliveredAt(LocalDateTime.now());
            }
        } else if (next.equals("undelivered")) {
            if (current.equals("issued") || current.equals("processing") || current.equals("delivered")) {
                isValid = true;
            }
        } else if (next.equals("cancelled")) {
            if (current.equals("requested") || current.equals("undelivered")) {
                isValid = true;
            }
        } else if (next.equals("blocked")) {
            if (!current.equals("blocked")) {
                isValid = true;
                card.setStatusBeforeBlock(card.getCardStatus());
            }
        } else if (next.equals("unblocked")) {
            if (current.equals("blocked")) {
                isValid = true;
                String restoreTo = card.getStatusBeforeBlock();
                if (restoreTo == null || restoreTo.trim().isEmpty()) {
                    restoreTo = "delivered";
                }
                next = restoreTo.toLowerCase();
            }
        } else if (next.equals("reissued")) {
            isValid = true;
        }

        if (!isValid) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid workflow transition from " + current + " to " + next));
        }

        card.setCardStatus(next);
        NfcCard saved = nfcCardRepository.save(card);

        // Audit Logging
        try {
            String actorEmail = principal != null ? principal.getName() : "system";
            User actorUser = principal != null ? userRepository.findByEmail(actorEmail).orElse(null) : null;
            
            NfcCardAuditLog auditLog = new NfcCardAuditLog();
            auditLog.setCardId(card.getId());
            auditLog.setFromStatus(current);
            auditLog.setToStatus(next);
            if (actorUser != null) {
                auditLog.setChangedById((long) actorUser.getId());
                auditLog.setChangedByEmail(actorUser.getEmail());
            } else {
                auditLog.setChangedByEmail(actorEmail);
            }
            
            StringBuilder sb = new StringBuilder();
            if (reason != null && !reason.trim().isEmpty()) {
                sb.append("Reason: ").append(reason);
            }
            if (note != null && !note.trim().isEmpty()) {
                if (sb.length() > 0) sb.append(". ");
                sb.append("Note: ").append(note);
            }
            if (sb.length() == 0) {
                sb.append("Status updated by administrator.");
            }
            auditLog.setNote(sb.toString());
            nfcCardAuditLogRepository.save(auditLog);
        } catch (Exception e) {
            // ignore
        }

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/api/v1/nfc/{id}/activate-otp")
    public ResponseEntity<?> activateCardOtp(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "NFC Card not found"));
        }
        NfcCard card = cardOpt.get();
        String otp = request.get("otp");
        if (otp == null || !otp.equals(card.getOtpHash())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid activation OTP code"));
        }
        card.setCardStatus("activated");
        NfcCard saved = nfcCardRepository.save(card);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/api/v1/nfc/{id}/reissue")
    public ResponseEntity<?> reissueCard(@PathVariable Long id) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "NFC Card not found"));
        }
        NfcCard card = cardOpt.get();
        card.setCardStatus("reissued");
        nfcCardRepository.save(card);

        // Request a new card automatically
        NfcCard newCard = new NfcCard();
        newCard.setListingId(card.getListingId());
        newCard.setLinkType(card.getLinkType());
        newCard.setUpiId(card.getUpiId());
        newCard.setUpiName(card.getUpiName());
        newCard.setIsPaymentEnabled(card.getIsPaymentEnabled());
        newCard.setCardStatus("requested");
        newCard.setShortCode(UUID.randomUUID().toString().substring(0, 8));
        newCard.setOtpHash(String.format("%04d", new Random().nextInt(10000)));

        NfcCard saved = nfcCardRepository.save(newCard);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // --- Analytics & Tap Statistics ---
    @GetMapping("/api/v1/nfc/stats")
    public ResponseEntity<?> getCardStats(@RequestParam Long listingId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(listingId);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Business listing not found"));
        }
        DirectoryListing listing = listingOpt.get();
        if (!Objects.equals(listing.getCreatedBy(), (long) uOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Access denied"));
        }

        Optional<NfcCard> cardOpt = nfcCardRepository.findByListingId(listingId);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "totalTaps", 0,
                "totalPayments", 0.0,
                "successfulPayments", 0,
                "todaysTaps", 0,
                "card", Map.of("cardStatus", "none")
            ));
        }

        NfcCard card = cardOpt.get();
        List<NfcTapHistory> taps = nfcTapHistoryRepository.findByCardId(card.getId());
        
        int totalTaps = taps.size();
        double totalPayments = 0.0;
        int successfulPayments = 0;
        int todaysTaps = 0;
        
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);

        for (NfcTapHistory tap : taps) {
            if ("payment".equalsIgnoreCase(tap.getTapType()) && "success".equalsIgnoreCase(tap.getStatus())) {
                totalPayments += tap.getAmount();
                successfulPayments++;
            }
            if (tap.getTappedAt().isAfter(startOfDay)) {
                todaysTaps++;
            }
        }

        return ResponseEntity.ok(Map.of(
            "totalTaps", totalTaps,
            "totalPayments", totalPayments,
            "successfulPayments", successfulPayments,
            "todaysTaps", todaysTaps,
            "card", card
        ));
    }

    @GetMapping("/api/v1/nfc/taps")
    public ResponseEntity<?> getTapHistory(@RequestParam Long listingId) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findByListingId(listingId);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(nfcTapHistoryRepository.findByCardId(cardOpt.get().getId()));
    }

    // --- Admin Dashboard Fulfillment APIs ---
    @GetMapping("/api/v1/nfc/admin/all")
    public ResponseEntity<?> getAllCardsForAdmin() {
        List<NfcCard> cards = nfcCardRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        for (NfcCard card : cards) {
            Optional<DirectoryListing> dirOpt = directoryRepository.findById(card.getListingId());
            if (dirOpt.isPresent() && "approved".equalsIgnoreCase(dirOpt.get().getKycStatus())) {
                Map<String, Object> map = new HashMap<>();
                map.put("card", card);
                map.put("business", dirOpt.get());
                map.put("businessName", dirOpt.get().getBusinessName());
                responses.add(map);
            }
        }
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/api/v1/nfc/{id}/audit")
    public ResponseEntity<?> getCardAuditLogs(@PathVariable Long id) {
        return ResponseEntity.ok(nfcCardAuditLogRepository.findByCardIdOrderByChangedAtDesc(id));
    }

    @PostMapping("/api/v1/nfc/{id}/payment/refund")
    public ResponseEntity<?> refundPayment(@PathVariable Long id, Principal principal) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "NFC Card not found"));
        }
        NfcCard card = cardOpt.get();
        card.setPaymentStatus(PaymentStatus.REFUNDED);
        NfcCard saved = nfcCardRepository.save(card);

        // Log Audit Trail
        try {
            String actorEmail = principal != null ? principal.getName() : "system";
            User actorUser = principal != null ? userRepository.findByEmail(actorEmail).orElse(null) : null;
            NfcCardAuditLog auditLog = new NfcCardAuditLog();
            auditLog.setCardId(card.getId());
            auditLog.setFromStatus(card.getCardStatus());
            auditLog.setToStatus(card.getCardStatus());
            if (actorUser != null) {
                auditLog.setChangedById((long) actorUser.getId());
                auditLog.setChangedByEmail(actorUser.getEmail());
            } else {
                auditLog.setChangedByEmail(actorEmail);
            }
            auditLog.setNote("Payment status marked as REFUNDED by administrator.");
            nfcCardAuditLogRepository.save(auditLog);
        } catch (Exception e) {}

        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/api/v1/nfc/{id}/payment")
    public ResponseEntity<?> updatePaymentInfo(@PathVariable Long id, @RequestBody Map<String, Object> request, Principal principal) {
        Optional<NfcCard> cardOpt = nfcCardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "NFC Card not found"));
        }
        NfcCard card = cardOpt.get();
        if (request.containsKey("paymentStatus")) {
            card.setPaymentStatus(PaymentStatus.valueOf(request.get("paymentStatus").toString().toUpperCase()));
        }
        if (request.containsKey("paymentAmount") && request.get("paymentAmount") != null) {
            card.setPaymentAmount(new java.math.BigDecimal(request.get("paymentAmount").toString()));
        }
        if (request.containsKey("paymentMethod")) {
            card.setPaymentMethod((String) request.get("paymentMethod"));
        }
        if (request.containsKey("paymentReference")) {
            card.setPaymentReference((String) request.get("paymentReference"));
        }
        if (request.containsKey("paidAt") && request.get("paidAt") != null) {
            try {
                card.setPaidAt(LocalDateTime.parse(request.get("paidAt").toString()));
            } catch (Exception e) {
                card.setPaidAt(LocalDateTime.now());
            }
        } else if (card.getPaymentStatus() == PaymentStatus.PAID && card.getPaidAt() == null) {
            card.setPaidAt(LocalDateTime.now());
        }

        NfcCard saved = nfcCardRepository.save(card);

        // Log Audit Trail
        try {
            String actorEmail = principal != null ? principal.getName() : "system";
            User actorUser = principal != null ? userRepository.findByEmail(actorEmail).orElse(null) : null;
            NfcCardAuditLog auditLog = new NfcCardAuditLog();
            auditLog.setCardId(card.getId());
            auditLog.setFromStatus(card.getCardStatus());
            auditLog.setToStatus(card.getCardStatus());
            if (actorUser != null) {
                auditLog.setChangedById((long) actorUser.getId());
                auditLog.setChangedByEmail(actorUser.getEmail());
            } else {
                auditLog.setChangedByEmail(actorEmail);
            }
            auditLog.setNote("Payment information updated by administrator: status=" + card.getPaymentStatus());
            nfcCardAuditLogRepository.save(auditLog);
        } catch (Exception e) {}

        return ResponseEntity.ok(saved);
    }
}
