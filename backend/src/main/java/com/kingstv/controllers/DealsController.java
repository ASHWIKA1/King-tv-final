package com.kingstv.controllers;

import com.kingstv.models.Deal;
import com.kingstv.models.DealRedemption;
import com.kingstv.models.DealFavorite;
import com.kingstv.models.DirectoryListing;
import com.kingstv.models.User;
import com.kingstv.repository.DealRepository;
import com.kingstv.repository.DealRedemptionRepository;
import com.kingstv.repository.DealFavoriteRepository;
import com.kingstv.repository.DirectoryRepository;
import com.kingstv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/deals")
public class DealsController {

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private DealRedemptionRepository dealRedemptionRepository;

    @Autowired
    private DealFavoriteRepository dealFavoriteRepository;

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllDeals() {
        return ResponseEntity.ok(dealRepository.findAll());
    }

    // --- Business Console CRUD ---
    @PostMapping
    public ResponseEntity<?> createDeal(@RequestBody Deal deal, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        if (deal.getListingId() == null || deal.getTitle() == null || deal.getCategory() == null || deal.getDiscountType() == null || deal.getDiscountValue() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Required fields are missing"));
        }
        
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(deal.getListingId());
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Merchant business listing not found"));
        }

        DirectoryListing listing = listingOpt.get();
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty() || !Objects.equals(listing.getCreatedBy(), (long) userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You do not own this business listing"));
        }

        if (!"approved".equalsIgnoreCase(listing.getKycStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Deals can only be created for KYC approved business listings"));
        }

        deal.setStatus("approved");
        deal.setRedemptionCount(0);
        deal.setViewCount(0);
        
        if (deal.getValidFrom() == null) deal.setValidFrom(LocalDateTime.now());
        if (deal.getValidUntil() == null) deal.setValidUntil(LocalDateTime.now().plusDays(30));
        
        Deal saved = dealRepository.save(deal);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeal(@PathVariable Long id, @RequestBody Deal entity, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Deal not found"));
        }
        Deal deal = dealOpt.get();
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(deal.getListingId());
        if (listingOpt.isPresent()) {
            DirectoryListing listing = listingOpt.get();
            Optional<User> userOpt = userRepository.findByEmail(principal.getName());
            if (userOpt.isEmpty() || !Objects.equals(listing.getCreatedBy(), (long) userOpt.get().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You do not own the business listing for this deal"));
            }
        }

        deal.setTitle(entity.getTitle());
        deal.setCategory(entity.getCategory());
        deal.setSubCategory(entity.getSubCategory());
        deal.setDiscountType(entity.getDiscountType());
        deal.setDiscountValue(entity.getDiscountValue());
        deal.setOriginalPrice(entity.getOriginalPrice());
        deal.setDiscountedPrice(entity.getDiscountedPrice());
        deal.setCouponCode(entity.getCouponCode());
        deal.setTerms(entity.getTerms());
        deal.setBannerUrl(entity.getBannerUrl());
        deal.setValidFrom(entity.getValidFrom());
        deal.setValidUntil(entity.getValidUntil());
        deal.setUsageLimit(entity.getUsageLimit());
        
        Deal saved = dealRepository.save(deal);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeal(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Deal not found"));
        }
        Deal deal = dealOpt.get();
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(deal.getListingId());
        if (listingOpt.isPresent()) {
            DirectoryListing listing = listingOpt.get();
            Optional<User> userOpt = userRepository.findByEmail(principal.getName());
            if (userOpt.isEmpty() || !Objects.equals(listing.getCreatedBy(), (long) userOpt.get().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You do not own the business listing for this deal"));
            }
        }
        dealRepository.delete(deal);
        return ResponseEntity.ok(Map.of("message", "Deal deleted successfully"));
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<?> getDealsByListing(@PathVariable Long listingId) {
        List<Deal> deals = dealRepository.findByListingId(listingId);
        return ResponseEntity.ok(deals);
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<?> closeDeal(@PathVariable Long id) {
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Deal not found"));
        }
        Deal deal = dealOpt.get();
        deal.setStatus("expired");
        dealRepository.save(deal);
        return ResponseEntity.ok(Map.of("message", "Deal closed successfully"));
    }

    @PatchMapping("/{id}/renew")
    public ResponseEntity<?> renewDeal(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Deal not found"));
        }
        Deal deal = dealOpt.get();
        deal.setStatus("approved");
        if (request.containsKey("validUntil")) {
            deal.setValidUntil(LocalDateTime.parse(request.get("validUntil")));
        } else {
            deal.setValidUntil(LocalDateTime.now().plusDays(30));
        }
        dealRepository.save(deal);
        return ResponseEntity.ok(Map.of("message", "Deal renewed successfully, awaiting approval"));
    }

    // --- Public Queries (Dynamic Lists) ---
    @GetMapping("/public")
    public ResponseEntity<?> getActiveDeals(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String discountType,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean expiringSoon,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
            
        // Build JPA specifications or simple filters
        List<Deal> activeDeals = dealRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        
        for (Deal deal : activeDeals) {
            if (!"approved".equalsIgnoreCase(deal.getStatus())) continue;
            
            // Filters logic
            if (category != null && !category.equalsIgnoreCase(deal.getCategory())) continue;
            if (discountType != null && !discountType.equalsIgnoreCase(deal.getDiscountType())) continue;
            if (featured != null && !deal.getIsFeatured()) continue;
            if (expiringSoon != null && deal.getValidUntil().isAfter(LocalDateTime.now().plusDays(7))) continue;
            if (search != null && !deal.getTitle().toLowerCase().contains(search.toLowerCase())) continue;
            
            Optional<DirectoryListing> dirOpt = directoryRepository.findById(deal.getListingId());
            Map<String, Object> map = new HashMap<>();
            map.put("deal", deal);
            map.put("merchant", dirOpt.orElse(null));
            responses.add(map);
        }
        
        // Dynamic Pagination mock
        int start = Math.min(page * size, responses.size());
        int end = Math.min(start + size, responses.size());
        List<Map<String, Object>> content = responses.subList(start, end);
        
        return ResponseEntity.ok(Map.of(
            "content", content,
            "totalElements", responses.size(),
            "totalPages", (int) Math.ceil((double)responses.size() / size),
            "number", page
        ));
    }

    @GetMapping("/day")
    public ResponseEntity<?> getDealOfTheDay() {
        List<Deal> deals = dealRepository.findAll();
        for (Deal d : deals) {
            if ("approved".equalsIgnoreCase(d.getStatus()) && d.getIsFeatured()) {
                Optional<DirectoryListing> dirOpt = directoryRepository.findById(d.getListingId());
                return ResponseEntity.ok(Map.of("deal", d, "merchant", dirOpt.orElse(null)));
            }
        }
        // Fallback to first approved deal
        for (Deal d : deals) {
            if ("approved".equalsIgnoreCase(d.getStatus())) {
                Optional<DirectoryListing> dirOpt = directoryRepository.findById(d.getListingId());
                return ResponseEntity.ok(Map.of("deal", d, "merchant", dirOpt.orElse(null)));
            }
        }
        return ResponseEntity.notFound().build();
    }

    // --- Redemptions & Coupons ---
    @PostMapping("/{id}/redeem")
    public ResponseEntity<?> redeemDeal(@PathVariable Long id, Principal principal) {
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty() || !"approved".equalsIgnoreCase(dealOpt.get().getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Deal is not active"));
        }
        
        Deal deal = dealOpt.get();
        if (deal.getRedemptionCount() >= deal.getUsageLimit()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usage limit reached for this deal"));
        }

        DealRedemption redemption = new DealRedemption();
        redemption.setDealId(id);
        redemption.setStatus("active");
        redemption.setRedemptionCode("DEAL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        if (principal != null) {
            Optional<User> uOpt = userRepository.findByEmail(principal.getName());
            uOpt.ifPresent(user -> redemption.setUserId((long) user.getId()));
        }
        
        DealRedemption saved = dealRedemptionRepository.save(redemption);
        
        // Update deal counts
        deal.setRedemptionCount(deal.getRedemptionCount() + 1);
        dealRepository.save(deal);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateRedemption(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Redemption code is required"));
        }
        
        Optional<DealRedemption> redOpt = dealRedemptionRepository.findByRedemptionCode(code);
        if (redOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Invalid redemption coupon code"));
        }
        
        DealRedemption red = redOpt.get();
        if (!"active".equalsIgnoreCase(red.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Coupon code is already " + red.getStatus()));
        }
        
        red.setStatus("used");
        red.setRedeemedAt(LocalDateTime.now());
        dealRedemptionRepository.save(red);
        
        Optional<Deal> dealOpt = dealRepository.findById(red.getDealId());
        return ResponseEntity.ok(Map.of(
            "message", "Coupon redeemed successfully!",
            "redemption", red,
            "deal", dealOpt.orElse(null)
        ));
    }

    // --- Saved Favorites Endpoints ---
    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        
        Optional<DealFavorite> existing = dealFavoriteRepository.findByUserIdAndDealId((long) uOpt.get().getId(), id);
        if (existing.isPresent()) {
            dealFavoriteRepository.delete(existing.get());
            return ResponseEntity.ok(Map.of("message", "Removed deal from saved favorites"));
        }
        
        DealFavorite fav = new DealFavorite();
        fav.setUserId((long) uOpt.get().getId());
        fav.setDealId(id);
        dealFavoriteRepository.save(fav);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Saved deal to favorites successfully"));
    }

    // --- Admin Endpoints ---
    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<?> changeDealStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Deal> dealOpt = dealRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Deal not found"));
        }
        Deal deal = dealOpt.get();
        String status = request.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        deal.setStatus(status);
        if (request.containsKey("isFeatured")) {
            deal.setIsFeatured(Boolean.parseBoolean(request.get("isFeatured")));
        }
        Deal saved = dealRepository.save(deal);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/admin/redemptions")
    public ResponseEntity<?> getAllRedemptions() {
        List<DealRedemption> redemptions = dealRedemptionRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        for (DealRedemption r : redemptions) {
            Optional<Deal> dealOpt = dealRepository.findById(r.getDealId());
            Map<String, Object> map = new HashMap<>();
            map.put("redemption", r);
            if (dealOpt.isPresent()) {
                Deal deal = dealOpt.get();
                map.put("deal", deal);
                Optional<DirectoryListing> listingOpt = directoryRepository.findById(deal.getListingId());
                map.put("merchant", listingOpt.orElse(null));
            } else {
                map.put("deal", null);
                map.put("merchant", null);
            }
            responses.add(map);
        }
        return ResponseEntity.ok(responses);
    }
}
