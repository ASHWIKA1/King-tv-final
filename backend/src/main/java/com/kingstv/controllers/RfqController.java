package com.kingstv.controllers;

import com.kingstv.models.Rfq;
import com.kingstv.models.RfqQuote;
import com.kingstv.models.DirectoryListing;
import com.kingstv.models.User;
import com.kingstv.repository.RfqRepository;
import com.kingstv.repository.RfqQuoteRepository;
import com.kingstv.repository.DirectoryRepository;
import com.kingstv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/rfq")
public class RfqController {

    @Autowired
    private RfqRepository rfqRepository;

    @Autowired
    private RfqQuoteRepository rfqQuoteRepository;

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Buyer CRUD Endpoints ---
    @PostMapping
    public ResponseEntity<?> createRfq(@RequestBody Rfq rfq, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        // Verify user has an approved business directory listing
        List<DirectoryListing> listings = directoryRepository.findByCreatedBy((long) userOpt.get().getId());
        boolean hasApprovedBusiness = listings.stream().anyMatch(l -> "approved".equalsIgnoreCase(l.getKycStatus()));
        if (!hasApprovedBusiness) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You must have an approved business listing to post an RFQ"));
        }

        if (rfq.getTitle() == null || rfq.getCategory() == null || rfq.getQuantity() == null || rfq.getLocation() == null || rfq.getDeadline() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Required fields are missing"));
        }

        rfq.setBuyerId((long) userOpt.get().getId());
        rfq.setStatus("open");
        
        Rfq saved = rfqRepository.save(rfq);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/my-rfqs")
    public ResponseEntity<?> getMyRfqs(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        List<Rfq> rfqs = rfqRepository.findByBuyerId(userOpt.get().getId());
        List<Map<String, Object>> responses = new ArrayList<>();
        
        for (Rfq rfq : rfqs) {
            if ("deleted".equalsIgnoreCase(rfq.getStatus())) continue;
            List<RfqQuote> quotes = rfqQuoteRepository.findByRfqId(rfq.getId());
            List<Map<String, Object>> quotesDetail = new ArrayList<>();
            for (RfqQuote quote : quotes) {
                Optional<DirectoryListing> dirOpt = directoryRepository.findById(quote.getSellerBusinessId());
                Map<String, Object> qMap = new HashMap<>();
                qMap.put("quote", quote);
                qMap.put("seller", dirOpt.orElse(null));
                quotesDetail.add(qMap);
            }
            Map<String, Object> map = new HashMap<>();
            map.put("rfq", rfq);
            map.put("quotes", quotesDetail);
            responses.add(map);
        }
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRfq(@PathVariable Long id, @RequestBody Rfq entity, Principal principal) {
        Optional<Rfq> rfqOpt = rfqRepository.findById(id);
        if (rfqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "RFQ not found"));
        }
        Rfq rfq = rfqOpt.get();
        rfq.setTitle(entity.getTitle());
        rfq.setCategory(entity.getCategory());
        rfq.setSubCategory(entity.getSubCategory());
        rfq.setDescription(entity.getDescription());
        rfq.setQuantity(entity.getQuantity());
        rfq.setBudget(entity.getBudget());
        rfq.setLocation(entity.getLocation());
        rfq.setAttachmentUrl(entity.getAttachmentUrl());
        rfq.setDeadline(entity.getDeadline());
        
        Rfq saved = rfqRepository.save(rfq);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRfq(@PathVariable Long id) {
        Optional<Rfq> rfqOpt = rfqRepository.findById(id);
        if (rfqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "RFQ not found"));
        }
        Rfq rfq = rfqOpt.get();
        rfq.setStatus("deleted");
        rfqRepository.save(rfq);
        return ResponseEntity.ok(Map.of("message", "RFQ deleted successfully"));
    }

    // --- Search & Marketplace Queries ---
    @GetMapping
    public ResponseEntity<?> searchRfqs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {
            
        List<Rfq> rfqs = rfqRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        
        for (Rfq rfq : rfqs) {
            if ("deleted".equalsIgnoreCase(rfq.getStatus())) continue;
            
            // Apply filtering logic
            if (status != null && !status.equalsIgnoreCase(rfq.getStatus())) continue;
            if (category != null && !category.equalsIgnoreCase(rfq.getCategory())) continue;
            if (location != null && !location.equalsIgnoreCase(rfq.getLocation())) continue;
            if (search != null && !rfq.getTitle().toLowerCase().contains(search.toLowerCase())) continue;
            
            // Check deadline auto-closing
            if ("open".equalsIgnoreCase(rfq.getStatus()) && rfq.getDeadline().isBefore(LocalDateTime.now())) {
                rfq.setStatus("closed");
                rfqRepository.save(rfq);
            }
            
            List<RfqQuote> quotes = rfqQuoteRepository.findByRfqId(rfq.getId());
            Map<String, Object> map = new HashMap<>();
            map.put("rfq", rfq);
            map.put("quotesCount", quotes.size());
            responses.add(map);
        }
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRfqDetails(@PathVariable Long id, Principal principal) {
        Optional<Rfq> rfqOpt = rfqRepository.findById(id);
        if (rfqOpt.isEmpty() || "deleted".equalsIgnoreCase(rfqOpt.get().getStatus())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "RFQ not found"));
        }
        
        Rfq rfq = rfqOpt.get();
        Optional<User> buyerOpt = userRepository.findById(rfq.getBuyerId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("rfq", rfq);
        
        // Hide buyer contact unless the current user is shortlisted/authorized
        if (buyerOpt.isPresent()) {
            User buyer = buyerOpt.get();
            boolean isAuthorized = false;
            
            if (principal != null) {
                if (buyer.getEmail().equals(principal.getName())) {
                    isAuthorized = true;
                } else {
                    // Check if current user has a shortlisted quote
                    Optional<User> currentUserOpt = userRepository.findByEmail(principal.getName());
                    if (currentUserOpt.isPresent()) {
                        // Locate business listing of the seller
                        List<DirectoryListing> listings = directoryRepository.findAll();
                        for (DirectoryListing dl : listings) {
                            if (dl.getCreatedBy() != null && dl.getCreatedBy().equals(currentUserOpt.get().getId())) {
                                List<RfqQuote> quotes = rfqQuoteRepository.findByRfqId(id);
                                for (RfqQuote quote : quotes) {
                                    if (quote.getSellerBusinessId().equals(dl.getId()) && 
                                        ("shortlisted".equalsIgnoreCase(quote.getStatus()) || "accepted".equalsIgnoreCase(quote.getStatus()))) {
                                        isAuthorized = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            Map<String, Object> buyerInfo = new HashMap<>();
            buyerInfo.put("username", buyer.getFullName());
            if (isAuthorized) {
                buyerInfo.put("email", buyer.getEmail());
            } else {
                buyerInfo.put("email", "Contact info hidden until shortlisted");
            }
            response.put("buyer", buyerInfo);
        }
        
        return ResponseEntity.ok(response);
    }

    // --- Quotations Submission & Review ---
    @PostMapping("/{id}/quotes")
    public ResponseEntity<?> submitQuote(@PathVariable Long id, @RequestBody Map<String, Object> payload, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        
        Optional<Rfq> rfqOpt = rfqRepository.findById(id);
        if (rfqOpt.isEmpty() || !"open".equalsIgnoreCase(rfqOpt.get().getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "RFQ is not open for quotes"));
        }

        Object quotedPriceObj = payload.get("quotedPrice");
        Object timelineDaysObj = payload.get("timelineDays");
        if (quotedPriceObj == null || timelineDaysObj == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Required fields are missing"));
        }

        // Resolve or create DirectoryListing for this user (no KYC check required for submission)
        List<DirectoryListing> listings = directoryRepository.findByCreatedBy((long) userOpt.get().getId());
        DirectoryListing sellerListing;
        if (!listings.isEmpty()) {
            sellerListing = listings.get(0);
        } else {
            String name = (String) payload.get("name");
            if (name == null || name.trim().isEmpty()) {
                name = userOpt.get().getFullName() + "'s Business";
            }
            sellerListing = new DirectoryListing();
            sellerListing.setBusinessName(name);
            sellerListing.setCategory(rfqOpt.get().getCategory());
            sellerListing.setAddressLocality(rfqOpt.get().getLocation());
            sellerListing.setAddressStreet("Default Address");
            sellerListing.setPhoneNumber(userOpt.get().getPhoneNumber() != null ? userOpt.get().getPhoneNumber() : "0000000000");
            sellerListing.setCreatedBy((long) userOpt.get().getId());
            sellerListing.setKycStatus("pending");
            sellerListing.setStatus("active");
            sellerListing = directoryRepository.save(sellerListing);
        }

        RfqQuote quote = new RfqQuote();
        quote.setRfqId(id);
        quote.setSellerBusinessId(sellerListing.getId());
        
        if (quotedPriceObj instanceof Number) {
            quote.setQuotedPrice(((Number) quotedPriceObj).doubleValue());
        } else {
            quote.setQuotedPrice(Double.parseDouble(quotedPriceObj.toString()));
        }
        
        if (timelineDaysObj instanceof Number) {
            quote.setTimelineDays(((Number) timelineDaysObj).intValue());
        } else {
            quote.setTimelineDays(Integer.parseInt(timelineDaysObj.toString()));
        }
        
        quote.setNotes((String) payload.get("notes"));
        quote.setProposalUrl((String) payload.get("proposalUrl"));
        quote.setStatus("pending");
        
        RfqQuote saved = rfqQuoteRepository.save(quote);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}/quotes")
    public ResponseEntity<?> getQuotesForRfq(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        
        Optional<Rfq> rfqOpt = rfqRepository.findById(id);
        if (rfqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "RFQ not found"));
        }
        
        Rfq rfq = rfqOpt.get();
        List<RfqQuote> quotes = rfqQuoteRepository.findByRfqId(id);
        List<Map<String, Object>> responses = new ArrayList<>();
        
        for (RfqQuote quote : quotes) {
            Optional<DirectoryListing> dirOpt = directoryRepository.findById(quote.getSellerBusinessId());
            Map<String, Object> map = new HashMap<>();
            map.put("quote", quote);
            map.put("seller", dirOpt.orElse(null));
            responses.add(map);
        }
        
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/quotes/{quoteId}/status")
    public ResponseEntity<?> changeQuoteStatus(@PathVariable Long quoteId, @RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        Optional<RfqQuote> quoteOpt = rfqQuoteRepository.findById(quoteId);
        if (quoteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quote not found"));
        }
        
        RfqQuote quote = quoteOpt.get();
        Optional<Rfq> rfqOpt = rfqRepository.findById(quote.getRfqId());
        if (rfqOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "RFQ not found"));
        }
        Rfq rfq = rfqOpt.get();

        // Security check: Only the buyer who created the RFQ can change the status of this quote
        if (!rfq.getBuyerId().equals((long) userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Only the RFQ owner can update the status of this quote"));
        }

        String status = request.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        
        // Normalize status to lowercase, mapping accepted to approved
        String normalizedStatus = status.toLowerCase();
        if ("accepted".equals(normalizedStatus)) {
            normalizedStatus = "approved";
        }
        quote.setStatus(normalizedStatus);
        RfqQuote saved = rfqQuoteRepository.save(quote);
        
        // If approved/accepted/awarded, update the parent RFQ status
        if ("approved".equals(normalizedStatus) || "accepted".equals(normalizedStatus) || "awarded".equals(normalizedStatus)) {
            rfq.setStatus("awarded");
            rfqRepository.save(rfq);
        }
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my-quotes")
    public ResponseEntity<?> getMySubmittedQuotes(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        List<DirectoryListing> listings = directoryRepository.findByCreatedBy((long) userOpt.get().getId());
        if (listings.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Map<String, Object>> responseList = new ArrayList<>();
        for (DirectoryListing listing : listings) {
            List<RfqQuote> quotes = rfqQuoteRepository.findBySellerBusinessId(listing.getId());
            for (RfqQuote quote : quotes) {
                Optional<Rfq> rfqOpt = rfqRepository.findById(quote.getRfqId());
                Map<String, Object> map = new HashMap<>();
                map.put("id", quote.getId());
                map.put("quotedPrice", quote.getQuotedPrice());
                map.put("timelineDays", quote.getTimelineDays());
                map.put("notes", quote.getNotes());
                map.put("status", quote.getStatus());
                map.put("createdAt", quote.getCreatedAt());
                map.put("rfqTitle", rfqOpt.map(Rfq::getTitle).orElse("Unknown RFQ"));
                responseList.add(map);
            }
        }
        return ResponseEntity.ok(responseList);
    }

    // --- Merchant Console List ---
    @GetMapping("/seller/quotes")
    public ResponseEntity<?> getSellerQuotes(@RequestParam Long businessId) {
        List<RfqQuote> quotes = rfqQuoteRepository.findBySellerBusinessId(businessId);
        List<Map<String, Object>> responses = new ArrayList<>();
        for (RfqQuote quote : quotes) {
            Optional<Rfq> rfqOpt = rfqRepository.findById(quote.getRfqId());
            Map<String, Object> map = new HashMap<>();
            map.put("quote", quote);
            map.put("rfq", rfqOpt.orElse(null));
            responses.add(map);
        }
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/admin/quotes/reported")
    public ResponseEntity<?> getReportedQuotes() {
        List<RfqQuote> quotes = rfqQuoteRepository.findAll();
        List<Map<String, Object>> responses = new ArrayList<>();
        for (RfqQuote q : quotes) {
            if ("reported".equalsIgnoreCase(q.getStatus())) {
                Map<String, Object> map = new HashMap<>();
                map.put("quote", q);
                Optional<Rfq> rfqOpt = rfqRepository.findById(q.getRfqId());
                map.put("rfq", rfqOpt.orElse(null));
                Optional<DirectoryListing> sellerOpt = directoryRepository.findById(q.getSellerBusinessId());
                map.put("seller", sellerOpt.orElse(null));
                responses.add(map);
            }
        }
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/quotes/{id}/dismiss")
    public ResponseEntity<?> dismissQuoteReport(@PathVariable Long id) {
        Optional<RfqQuote> qOpt = rfqQuoteRepository.findById(id);
        if (qOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quote not found"));
        }
        RfqQuote q = qOpt.get();
        if ("reported".equalsIgnoreCase(q.getStatus())) {
            q.setStatus("pending");
            rfqQuoteRepository.save(q);
        }
        return ResponseEntity.ok(Map.of("message", "Report dismissed successfully"));
    }

    @DeleteMapping("/quotes/{id}")
    public ResponseEntity<?> deleteQuote(@PathVariable Long id) {
        if (!rfqQuoteRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quote not found"));
        }
        rfqQuoteRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Quote deleted successfully"));
    }

    @PatchMapping("/quotes/{id}/report")
    public ResponseEntity<?> reportQuote(@PathVariable Long id) {
        Optional<RfqQuote> qOpt = rfqQuoteRepository.findById(id);
        if (qOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quote not found"));
        }
        RfqQuote q = qOpt.get();
        q.setStatus("reported");
        rfqQuoteRepository.save(q);
        return ResponseEntity.ok(Map.of("message", "Quote reported successfully"));
    }
}
