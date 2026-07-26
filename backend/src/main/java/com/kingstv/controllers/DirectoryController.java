package com.kingstv.controllers;

import com.kingstv.models.DirectoryListing;
import com.kingstv.models.BusinessGallery;
import com.kingstv.models.BusinessReview;
import com.kingstv.models.BusinessFavorite;
import com.kingstv.models.User;
import com.kingstv.repository.DirectoryRepository;
import com.kingstv.repository.BusinessGalleryRepository;
import com.kingstv.repository.BusinessReviewRepository;
import com.kingstv.repository.BusinessFavoriteRepository;
import com.kingstv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import com.kingstv.repository.SpecificationBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;
import java.util.ArrayList;
import java.util.HashMap;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/directory")
public class DirectoryController {

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private BusinessGalleryRepository galleryRepository;

    @Autowired
    private BusinessReviewRepository reviewRepository;

    @Autowired
    private BusinessFavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    // --- KEEP Existing Front-End Endpoint Map ---
    @GetMapping
    public List<DirectoryListing> getListings() {
        return directoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable Long id) {
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        return ResponseEntity.ok(listingOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createListing(@RequestBody DirectoryListing listing, Principal principal) {
        if (listing.getBusinessName() == null || listing.getCategory() == null || listing.getPhoneNumber() == null || listing.getAddressLocality() == null || listing.getAddressStreet() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Required fields are missing"));
        }
        if (listing.getCreatedAt() == null) {
            listing.setCreatedAt(LocalDateTime.now());
        }
        if (principal != null) {
            Optional<User> uOpt = userRepository.findByEmail(principal.getName());
            uOpt.ifPresent(user -> listing.setCreatedBy((long) user.getId()));
        }
        listing.setKycStatus("pending");
        DirectoryListing saved = directoryRepository.save(listing);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // --- NEW Standardized API Standard Endpoints ---
    @GetMapping("/getAll")
    public Page<DirectoryListing> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<DirectoryListing> spec = SpecificationBuilder.build(search, status, null, null);
        return directoryRepository.findAll(spec, pageable);
    }

    @GetMapping("/getAllWeb")
    public Page<DirectoryListing> getAllWeb(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        return getAll(search, "active", page, size, sortBy, direction);
    }

    @GetMapping("/my-business")
    public ResponseEntity<?> getMyBusiness(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        List<DirectoryListing> listings = directoryRepository.findByCreatedBy((long) uOpt.get().getId());
        return ResponseEntity.ok(listings);
    }

    @PostMapping("/saveUpdate")
    public ResponseEntity<?> save(@RequestBody DirectoryListing entity, Principal principal) {
        return createListing(entity, principal);
    }

    @PutMapping("/saveUpdate")
    public ResponseEntity<?> update(@RequestBody DirectoryListing entity, Principal principal) {
        if (entity.getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id is required for update"));
        }
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(entity.getId());
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        DirectoryListing listing = listingOpt.get();
        if (principal != null) {
            Optional<User> uOpt = userRepository.findByEmail(principal.getName());
            if (uOpt.isEmpty() || !Objects.equals(listing.getCreatedBy(), (long) uOpt.get().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You do not own this business listing"));
            }
        }
        listing.setBusinessName(entity.getBusinessName());
        listing.setCategory(entity.getCategory());
        listing.setAddressLocality(entity.getAddressLocality());
        listing.setAddressStreet(entity.getAddressStreet());
        listing.setWorkingHours(entity.getWorkingHours());
        listing.setPhoneNumber(entity.getPhoneNumber());
        listing.setStatus(entity.getStatus());
        listing.setCoverUrl(entity.getCoverUrl());
        listing.setLogoUrl(entity.getLogoUrl());
        listing.setDescription(entity.getDescription());
        if (entity.getKycDocumentUrl() != null) {
            listing.setKycDocumentUrl(entity.getKycDocumentUrl());
        }
        
        DirectoryListing updated = directoryRepository.save(listing);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/approve-kyc")
    public ResponseEntity<?> simulateApproveKyc(@PathVariable Long id) {
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        DirectoryListing listing = listingOpt.get();
        listing.setKycStatus("approved");
        listing.setStatus("active");
        directoryRepository.save(listing);
        return ResponseEntity.ok(Map.of("message", "KYC Approved"));
    }

    @PatchMapping("/{id}/kyc")
    @com.kingstv.security.RequiresPermission(anyOf = {com.kingstv.models.Role.SUPER_ADMIN, com.kingstv.models.Role.CHIEF_EDITOR})
    public ResponseEntity<?> updateKycStatus(@PathVariable Long id, @RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        String newStatus = request.get("status");
        if (newStatus == null || (!newStatus.equalsIgnoreCase("approved") && !newStatus.equalsIgnoreCase("rejected") && !newStatus.equalsIgnoreCase("pending"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid KYC status. Must be approved, rejected, or pending"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        Long adminId = uOpt.map(user -> (long) user.getId()).orElse(null);
        DirectoryListing listing = listingOpt.get();
        listing.setKycStatus(newStatus.toLowerCase());
        listing.setApprovedBy(adminId);
        listing.setApprovedAt(LocalDateTime.now());
        if ("approved".equalsIgnoreCase(newStatus)) {
            listing.setStatus("active");
        } else {
            listing.setStatus("inactive");
        }
        DirectoryListing saved = directoryRepository.save(listing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        try {
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads/directory");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            String contentType = file.getContentType();
            String extension = ".jpg";
            if (contentType != null && contentType.equals("image/png")) {
                extension = ".png";
            }
            String fileName = "biz_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000) + extension;
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(Map.of("url", "/uploads/directory/" + fileName));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }

    @PatchMapping("/changeStatus")
    public ResponseEntity<?> changeStatus(@RequestBody Map<String, Object> request) {
        if (!request.containsKey("id") || !request.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("message", "id and status are required"));
        }
        Long id = Long.valueOf(request.get("id").toString());
        String status = request.get("status").toString();
        
        Optional<DirectoryListing> opt = directoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        DirectoryListing existing = opt.get();
        existing.setStatus(status);
        directoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully", "id", id, "status", status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id) {
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        DirectoryListing existing = listingOpt.get();
        existing.setStatus("deleted"); // Soft delete
        directoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Directory soft-deleted successfully"));
    }

    // --- Gallery Endpoints ---
    @GetMapping("/{id}/gallery")
    public ResponseEntity<?> getGallery(@PathVariable Long id) {
        return ResponseEntity.ok(galleryRepository.findByListingId(id));
    }

    @PostMapping("/{id}/gallery")
    public ResponseEntity<?> addGalleryImage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String imageUrl = request.get("imageUrl");
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "imageUrl is required"));
        }
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        BusinessGallery bg = new BusinessGallery();
        bg.setListingId(id);
        bg.setImageUrl(imageUrl);
        BusinessGallery saved = galleryRepository.save(bg);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // --- Reviews & Ratings Endpoints ---
    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewRepository.findByListingIdAndStatus(id, "approved"));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody BusinessReview review, Principal principal) {
        if (review.getReviewerName() == null || review.getRating() == null || review.getComment() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Required fields are missing"));
        }
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Directory listing not found"));
        }
        
        review.setListingId(id);
        if (principal != null) {
            Optional<User> uOpt = userRepository.findByEmail(principal.getName());
            uOpt.ifPresent(user -> review.setUserId((long) user.getId()));
        }
        
        review.setStatus("approved");
        BusinessReview savedReview = reviewRepository.save(review);
        
        // Recalculate average rating for the directory listing
        List<BusinessReview> reviews = reviewRepository.findByListingIdAndStatus(id, "approved");
        double sum = 0.0;
        for (BusinessReview r : reviews) {
            sum += r.getRating();
        }
        double avg = reviews.isEmpty() ? 0.0 : sum / reviews.size();
        
        DirectoryListing listing = listingOpt.get();
        listing.setRatingAvg(avg);
        listing.setRatingCount(reviews.size());
        directoryRepository.save(listing);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    // --- Favorites Endpoints ---
    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        List<BusinessFavorite> favs = favoriteRepository.findByUserId((long) uOpt.get().getId());
        return ResponseEntity.ok(favs);
    }

    @PostMapping("/favorites/{id}")
    public ResponseEntity<?> addFavorite(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        
        Optional<BusinessFavorite> existing = favoriteRepository.findByUserIdAndListingId((long) uOpt.get().getId(), id);
        if (existing.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Already added to favorites"));
        }
        
        BusinessFavorite fav = new BusinessFavorite();
        fav.setUserId((long) uOpt.get().getId());
        fav.setListingId(id);
        favoriteRepository.save(fav);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Added to favorites successfully"));
    }

    @DeleteMapping("/favorites/{id}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> uOpt = userRepository.findByEmail(principal.getName());
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        
        Optional<BusinessFavorite> existing = favoriteRepository.findByUserIdAndListingId((long) uOpt.get().getId(), id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Favorite not found"));
        }
        
        favoriteRepository.delete(existing.get());
        return ResponseEntity.ok(Map.of("message", "Removed from favorites successfully"));
    }

    @GetMapping("/admin/reviews")
    public ResponseEntity<?> getAllReviewsForAdmin() {
        List<BusinessReview> reviews = reviewRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        for (BusinessReview r : reviews) {
            Optional<DirectoryListing> listingOpt = directoryRepository.findById(r.getListingId());
            Map<String, Object> map = new HashMap<>();
            map.put("review", r);
            map.put("business", listingOpt.orElse(null));
            responses.add(map);
        }
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<?> deleteReviewForAdmin(@PathVariable Long id) {
        Optional<BusinessReview> revOpt = reviewRepository.findById(id);
        if (revOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Review not found"));
        }
        BusinessReview review = revOpt.get();
        reviewRepository.delete(review);
        
        // Recalculate average rating
        Optional<DirectoryListing> listingOpt = directoryRepository.findById(review.getListingId());
        if (listingOpt.isPresent()) {
            DirectoryListing listing = listingOpt.get();
            List<BusinessReview> reviews = reviewRepository.findByListingIdAndStatus(listing.getId(), "approved");
            double sum = 0.0;
            for (BusinessReview r : reviews) {
                sum += r.getRating();
            }
            double avg = reviews.isEmpty() ? 0.0 : sum / reviews.size();
            listing.setRatingAvg(avg);
            listing.setRatingCount(reviews.size());
            directoryRepository.save(listing);
        }
        
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
