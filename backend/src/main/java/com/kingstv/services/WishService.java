package com.kingstv.services;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class WishService {

    @Autowired
    private WishRepository wishRepository;

    @Autowired
    private WishCategoryRepository wishCategoryRepository;

    @Autowired
    private WishFrameTemplateRepository wishFrameTemplateRepository;

    @Autowired
    private WishGalleryRepository wishGalleryRepository;

    @Autowired
    private WishCommentRepository wishCommentRepository;

    @Autowired
    private WishReactionRepository wishReactionRepository;

    @Autowired
    private WishViewRepository wishViewRepository;

    @Autowired
    private WishShareRepository wishShareRepository;

    @Autowired
    private WishSavedRepository wishSavedRepository;

    @Autowired
    private WishReportRepository wishReportRepository;

    @Autowired
    private WishNotificationRepository wishNotificationRepository;

    public Page<Wish> getWishes(String search, Long categoryId, Long districtId, String status, String pincode, Boolean isSponsored, String sort, Pageable pageable) {
        Specification<Wish> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            } else {
                predicates.add(cb.equal(root.get("status"), "published"));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (districtId != null) {
                predicates.add(cb.equal(root.get("district").get("id"), districtId));
            }

            if (pincode != null && !pincode.isEmpty()) {
                predicates.add(cb.equal(root.get("pincode"), pincode));
            }

            if (isSponsored != null) {
                predicates.add(cb.equal(root.get("isSponsored"), isSponsored));
            }

            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                    cb.like(cb.lower(root.get("recipientName")), searchLower),
                    cb.like(cb.lower(root.get("senderName")), searchLower),
                    cb.like(cb.lower(root.get("message")), searchLower),
                    cb.like(cb.lower(root.get("relationship")), searchLower)
                );
                predicates.add(searchPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Determine sorting
        Sort finalSort = Sort.by(Sort.Direction.DESC, "publishedAt");
        if (sort != null) {
            if (sort.equalsIgnoreCase("oldest")) {
                finalSort = Sort.by(Sort.Direction.ASC, "publishedAt");
            } else if (sort.equalsIgnoreCase("popular")) {
                finalSort = Sort.by(Sort.Direction.DESC, "viewCount");
            } else if (sort.equalsIgnoreCase("shares")) {
                finalSort = Sort.by(Sort.Direction.DESC, "shareCount");
            }
        }
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), finalSort);
        return wishRepository.findAll(spec, sortedPageable);
    }

    public Optional<Wish> getWishById(Long id) {
        return wishRepository.findById(id).filter(w -> !w.getDeleted());
    }

    public Wish createWish(Wish wish, List<String> galleryUrls) {
        wish.setUuid(UUID.randomUUID().toString());
        wish.setCreatedAt(LocalDateTime.now());
        wish.setUpdatedAt(LocalDateTime.now());
        wish.setDeleted(false);
        if (wish.getPublishedAt() == null) {
            wish.setPublishedAt(LocalDateTime.now());
        }
        
        Wish saved = wishRepository.save(wish);
        
        if (galleryUrls != null) {
            for (String url : galleryUrls) {
                WishGallery g = new WishGallery();
                g.setWish(saved);
                g.setImageUrl(url);
                wishGalleryRepository.save(g);
            }
        }
        return saved;
    }

    public Wish updateWish(Long id, Wish entity) {
        Wish existing = wishRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Wish not found"));
        
        existing.setRecipientName(entity.getRecipientName());
        existing.setRecipientPhoto(entity.getRecipientPhoto());
        existing.setSenderName(entity.getSenderName());
        existing.setSenderProfile(entity.getSenderProfile());
        existing.setRelationship(entity.getRelationship());
        existing.setMessage(entity.getMessage());
        existing.setCategory(entity.getCategory());
        existing.setDistrict(entity.getDistrict());
        existing.setTalukId(entity.getTalukId());
        existing.setPincode(entity.getPincode());
        existing.setLatitude(entity.getLatitude());
        existing.setLongitude(entity.getLongitude());
        existing.setFrameTemplate(entity.getFrameTemplate());
        existing.setScheduledPublishAt(entity.getScheduledPublishAt());
        existing.setStatus(entity.getStatus());
        existing.setIsSponsored(entity.getIsSponsored());
        existing.setSponsorName(entity.getSponsorName());
        existing.setSponsorLogo(entity.getSponsorLogo());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return wishRepository.save(existing);
    }

    public void deleteWish(Long id) {
        Wish existing = wishRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Wish not found"));
        existing.setDeleted(true);
        existing.setStatus("deleted");
        wishRepository.save(existing);
    }

    public WishReaction addReaction(Long wishId, Long userId, String sessionId, String type) {
        Wish wish = wishRepository.findById(wishId)
            .orElseThrow(() -> new IllegalArgumentException("Wish not found"));
        
        Optional<WishReaction> existingOpt = Optional.empty();
        if (userId != null) {
            existingOpt = wishReactionRepository.findByWishIdAndUserId(wishId, userId);
        } else if (sessionId != null) {
            existingOpt = wishReactionRepository.findByWishIdAndSessionId(wishId, sessionId);
        }
        
        WishReaction reaction;
        if (existingOpt.isPresent()) {
            reaction = existingOpt.get();
            reaction.setReactionType(type);
            reaction.setUpdatedAt(LocalDateTime.now());
        } else {
            reaction = new WishReaction();
            reaction.setWish(wish);
            reaction.setUserId(userId);
            reaction.setSessionId(sessionId);
            reaction.setReactionType(type);
            
            // Increment reaction count
            wish.setReactionCount(wish.getReactionCount() + 1);
            wishRepository.save(wish);
        }
        
        return wishReactionRepository.save(reaction);
    }

    public void removeReaction(Long wishId, Long userId, String sessionId) {
        Optional<WishReaction> existingOpt = Optional.empty();
        if (userId != null) {
            existingOpt = wishReactionRepository.findByWishIdAndUserId(wishId, userId);
        } else if (sessionId != null) {
            existingOpt = wishReactionRepository.findByWishIdAndSessionId(wishId, sessionId);
        }
        
        if (existingOpt.isPresent()) {
            wishReactionRepository.delete(existingOpt.get());
            Wish wish = wishRepository.findById(wishId).orElse(null);
            if (wish != null && wish.getReactionCount() > 0) {
                wish.setReactionCount(wish.getReactionCount() - 1);
                wishRepository.save(wish);
            }
        }
    }

    public WishComment addComment(Long wishId, Long parentId, Long userId, String commenterName, String commenterPhoto, String text) {
        Wish wish = wishRepository.findById(wishId)
            .orElseThrow(() -> new IllegalArgumentException("Wish not found"));
        
        WishComment comment = new WishComment();
        comment.setWish(wish);
        comment.setCommenterName(commenterName);
        comment.setCommenterPhoto(commenterPhoto);
        comment.setComment(text);
        comment.setCreatedBy(userId);
        
        if (parentId != null) {
            WishComment parent = wishCommentRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
            comment.setParent(parent);
        }
        
        WishComment saved = wishCommentRepository.save(comment);
        
        wish.setCommentCount(wish.getCommentCount() + 1);
        wishRepository.save(wish);
        
        return saved;
    }

    public WishComment updateComment(Long commentId, String text, Long userId) {
        WishComment existing = wishCommentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (userId != null && !userId.equals(existing.getCreatedBy())) {
            throw new IllegalStateException("Unauthorized to edit comment");
        }
        existing.setComment(text);
        existing.setUpdatedAt(LocalDateTime.now());
        return wishCommentRepository.save(existing);
    }

    public void deleteComment(Long commentId, Long userId) {
        WishComment existing = wishCommentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (userId != null && !userId.equals(existing.getCreatedBy())) {
            throw new IllegalStateException("Unauthorized to delete comment");
        }
        existing.setDeleted(true);
        wishCommentRepository.save(existing);
        
        Wish wish = existing.getWish();
        if (wish != null && wish.getCommentCount() > 0) {
            wish.setCommentCount(wish.getCommentCount() - 1);
            wishRepository.save(wish);
        }
    }

    public void logView(Long wishId, String ipAddress, String userAgent) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        if (!wishViewRepository.existsByWishIdAndIpAddressAndCreatedAtAfter(wishId, ipAddress, oneHourAgo)) {
            Wish wish = wishRepository.findById(wishId).orElse(null);
            if (wish != null) {
                WishView view = new WishView();
                view.setWish(wish);
                view.setIpAddress(ipAddress);
                view.setUserAgent(userAgent);
                wishViewRepository.save(view);
                
                wish.setViewCount(wish.getViewCount() + 1);
                wishRepository.save(wish);
            }
        }
    }

    public void logShare(Long wishId, String platform) {
        Wish wish = wishRepository.findById(wishId).orElse(null);
        if (wish != null) {
            WishShare share = new WishShare();
            share.setWish(wish);
            share.setPlatform(platform);
            wishShareRepository.save(share);
            
            wish.setShareCount(wish.getShareCount() + 1);
            wishRepository.save(wish);
        }
    }

    public void saveWish(Long wishId, Long userId) {
        Wish wish = wishRepository.findById(wishId)
            .orElseThrow(() -> new IllegalArgumentException("Wish not found"));
        if (!wishSavedRepository.findByWishIdAndUserId(wishId, userId).isPresent()) {
            WishSaved ws = new WishSaved();
            ws.setWish(wish);
            ws.setUserId(userId);
            wishSavedRepository.save(ws);
        }
    }

    public void unsaveWish(Long wishId, Long userId) {
        wishSavedRepository.findByWishIdAndUserId(wishId, userId)
            .ifPresent(ws -> wishSavedRepository.delete(ws));
    }

    public void reportWish(Long wishId, String reporterName, String reason) {
        Wish wish = wishRepository.findById(wishId)
            .orElseThrow(() -> new IllegalArgumentException("Wish not found"));
        WishReport report = new WishReport();
        report.setWish(wish);
        report.setReporterName(reporterName);
        report.setReason(reason);
        wishReportRepository.save(report);
    }

    public List<WishCategory> getCategories() {
        return wishCategoryRepository.findAll().stream()
            .filter(c -> !c.getDeleted())
            .collect(Collectors.toList());
    }

    public List<WishFrameTemplate> getFrameTemplates() {
        return wishFrameTemplateRepository.findAll().stream()
            .filter(t -> !t.getDeleted())
            .collect(Collectors.toList());
    }

    public List<WishGallery> getWishGallery(Long wishId) {
        return wishGalleryRepository.findByWishId(wishId).stream()
            .filter(g -> !g.getDeleted())
            .collect(Collectors.toList());
    }

    public List<WishComment> getWishComments(Long wishId) {
        return wishCommentRepository.findByWishIdAndParentIsNullOrderByCreatedAtDesc(wishId).stream()
            .filter(c -> !c.getDeleted())
            .collect(Collectors.toList());
    }

    public List<WishComment> getCommentReplies(Long parentId) {
        return wishCommentRepository.findByParentIdOrderByCreatedAtAsc(parentId).stream()
            .filter(c -> !c.getDeleted())
            .collect(Collectors.toList());
    }

    public Page<Wish> getTrendingWishes(Pageable pageable) {
        // Trending: sort by (reactionCount * 3 + commentCount * 5 + shareCount * 10 + viewCount) Desc
        Sort sorting = Sort.by(Sort.Order.desc("reactionCount"), Sort.Order.desc("commentCount"), Sort.Order.desc("shareCount"));
        Pageable p = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sorting);
        return wishRepository.findAll((root, query, cb) -> cb.and(
            cb.equal(root.get("deleted"), false),
            cb.equal(root.get("status"), "published")
        ), p);
    }

    public Page<Wish> getPopularWishes(Pageable pageable) {
        Sort sorting = Sort.by(Sort.Direction.DESC, "viewCount");
        Pageable p = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sorting);
        return wishRepository.findAll((root, query, cb) -> cb.and(
            cb.equal(root.get("deleted"), false),
            cb.equal(root.get("status"), "published")
        ), p);
    }

    public Page<Wish> getLatestWishes(Pageable pageable) {
        Sort sorting = Sort.by(Sort.Direction.DESC, "publishedAt");
        Pageable p = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sorting);
        return wishRepository.findAll((root, query, cb) -> cb.and(
            cb.equal(root.get("deleted"), false),
            cb.equal(root.get("status"), "published")
        ), p);
    }

    public Page<Wish> getSponsoredWishes(Pageable pageable) {
        Sort sorting = Sort.by(Sort.Direction.DESC, "publishedAt");
        Pageable p = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sorting);
        return wishRepository.findAll((root, query, cb) -> cb.and(
            cb.equal(root.get("deleted"), false),
            cb.equal(root.get("status"), "published"),
            cb.equal(root.get("isSponsored"), true)
        ), p);
    }

    public List<Wish> getNearbyWishes(Double lat, Double lon, Double radiusKm) {
        List<Wish> all = wishRepository.findAll().stream()
            .filter(w -> !w.getDeleted() && w.getStatus().equals("published"))
            .filter(w -> w.getLatitude() != null && w.getLongitude() != null)
            .collect(Collectors.toList());
        
        List<Wish> results = new ArrayList<>();
        for (Wish w : all) {
            double distance = calculateDistance(lat, lon, w.getLatitude(), w.getLongitude());
            if (distance <= radiusKm) {
                results.add(w);
            }
        }
        
        results.sort(Comparator.comparing(w -> calculateDistance(lat, lon, w.getLatitude(), w.getLongitude())));
        return results;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double earthRadius = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }
}
