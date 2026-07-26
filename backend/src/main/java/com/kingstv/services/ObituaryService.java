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

@Service
@Transactional
public class ObituaryService {

    @Autowired
    private ObituaryRepository obituaryRepository;

    @Autowired
    private ObituaryFrameTemplateRepository frameTemplateRepository;

    @Autowired
    private ObituaryGalleryRepository galleryRepository;

    @Autowired
    private ObituaryGuestbookRepository guestbookRepository;

    @Autowired
    private ObituaryGuestbookLikeRepository guestbookLikeRepository;

    @Autowired
    private ObituaryTributeRepository tributeRepository;

    @Autowired
    private ObituaryViewRepository viewRepository;

    @Autowired
    private ObituaryReportRepository reportRepository;

    @Autowired
    private ObituaryNotificationRepository notificationRepository;

    @Autowired
    private DistrictRepository districtRepository;

    public Page<Obituary> getObituaries(String search, Long districtId, String status, String pincode, String sort, Pageable pageable) {
        Specification<Obituary> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));

            if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            } else if (status == null || status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), "published"));
            }

            if (districtId != null) {
                predicates.add(cb.equal(root.get("district").get("id"), districtId));
            }

            if (pincode != null && !pincode.isEmpty()) {
                predicates.add(cb.equal(root.get("pincode"), pincode));
            }

            if (search != null && !search.isEmpty()) {
                String likePattern = "%" + search.toLowerCase() + "%";
                Predicate namePred = cb.like(cb.lower(root.get("deceasedName")), likePattern);
                Predicate nativePred = cb.like(cb.lower(root.get("nativePlace")), likePattern);
                Predicate locPred = cb.like(cb.lower(root.get("location")), likePattern);
                predicates.add(cb.or(namePred, nativePred, locPred));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Create sort order based on sort parameter
        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "oldest":
                    sortOrder = Sort.by(Sort.Direction.ASC, "createdAt");
                    break;
                case "popular":
                case "views":
                    sortOrder = Sort.by(Sort.Direction.DESC, "tributeCount"); // fallback sorting
                    break;
                case "tributes":
                case "most_tributes":
                    sortOrder = Sort.by(Sort.Direction.DESC, "tributeCount");
                    break;
                case "latest":
                default:
                    sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
            }
        }

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);
        return obituaryRepository.findAll(spec, sortedPageable);
    }

    public Optional<Obituary> getObituaryById(Long id) {
        return obituaryRepository.findById(id).filter(o -> !o.getDeleted());
    }

    public Obituary createObituary(Obituary obit, List<String> galleryUrls) {
        obit.setDeleted(false);
        obit.setCreatedAt(LocalDateTime.now());
        obit.setTributeCount(0);
        obit.setGuestbookCount(0);
        obit.setReportCount(0);

        Obituary saved = obituaryRepository.save(obit);

        if (galleryUrls != null) {
            int order = 0;
            for (String url : galleryUrls) {
                ObituaryGallery gallery = new ObituaryGallery();
                gallery.setObituaryId(saved.getId());
                gallery.setImageUrl(url);
                gallery.setDisplayOrder(order++);
                galleryRepository.save(gallery);
            }
        }

        return saved;
    }

    public Obituary updateObituary(Long id, Obituary updated) throws Exception {
        Obituary existing = obituaryRepository.findById(id)
            .orElseThrow(() -> new Exception("Obituary not found"));

        existing.setDeceasedName(updated.getDeceasedName());
        existing.setPhoto(updated.getPhoto());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setDateOfPassing(updated.getDateOfPassing());
        existing.setReligion(updated.getReligion());
        existing.setNativePlace(updated.getNativePlace());
        existing.setDistrict(updated.getDistrict());
        existing.setTalukId(updated.getTalukId());
        existing.setPincode(updated.getPincode());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        existing.setFuneralDatetime(updated.getFuneralDatetime());
        existing.setFuneralVenue(updated.getFuneralVenue());
        existing.setMapLink(updated.getMapLink());
        existing.setFamilyContactName(updated.getFamilyContactName());
        existing.setFamilyPhone(updated.getFamilyPhone());
        existing.setPosterRelationship(updated.getPosterRelationship());
        existing.setBiography(updated.getBiography());
        existing.setFrameTemplate(updated.getFrameTemplate());
        existing.setStatus(updated.getStatus());

        return obituaryRepository.save(existing);
    }

    public void deleteObituary(Long id) throws Exception {
        Obituary existing = obituaryRepository.findById(id)
            .orElseThrow(() -> new Exception("Obituary not found"));
        existing.setDeleted(true);
        existing.setStatus("deleted");
        obituaryRepository.save(existing);
    }

    public ObituaryTribute addTribute(Long id, Long userId, String sessionId, String type) throws Exception {
        // Validate duplicates
        Optional<ObituaryTribute> existingTribute = Optional.empty();
        if (userId != null) {
            existingTribute = tributeRepository.findByObituaryIdAndUserId(id, userId);
        } else if (sessionId != null) {
            existingTribute = tributeRepository.findByObituaryIdAndSessionId(id, sessionId);
        }

        if (existingTribute.isPresent()) {
            throw new Exception("You have already paid tribute to this memorial.");
        }

        Obituary obituary = obituaryRepository.findById(id)
            .orElseThrow(() -> new Exception("Obituary not found"));

        ObituaryTribute tribute = new ObituaryTribute();
        tribute.setObituaryId(id);
        tribute.setUserId(userId);
        tribute.setSessionId(sessionId);
        tribute.setTributeType(type != null ? type : "Tribute");
        tribute.setCreatedAt(LocalDateTime.now());

        ObituaryTribute saved = tributeRepository.save(tribute);

        obituary.setTributeCount(obituary.getTributeCount() + 1);
        obituaryRepository.save(obituary);

        return saved;
    }

    public ObituaryGuestbook addGuestbookMessage(Long id, Long parentId, Long userId, String visitorName, String message) throws Exception {
        Obituary obituary = obituaryRepository.findById(id)
            .orElseThrow(() -> new Exception("Obituary not found"));

        ObituaryGuestbook gb = new ObituaryGuestbook();
        gb.setObituaryId(id);
        gb.setUserId(userId);
        gb.setVisitorName(visitorName);
        gb.setMessage(message);
        gb.setCreatedAt(LocalDateTime.now());
        gb.setStatus("approved");

        if (parentId != null) {
            guestbookRepository.findById(parentId).ifPresent(gb::setParent);
        }

        ObituaryGuestbook saved = guestbookRepository.save(gb);

        obituary.setGuestbookCount(obituary.getGuestbookCount() + 1);
        obituaryRepository.save(obituary);

        return saved;
    }

    public ObituaryGuestbook updateComment(Long id, String text, Long userId) throws Exception {
        ObituaryGuestbook existing = guestbookRepository.findById(id)
            .orElseThrow(() -> new Exception("Message not found"));
        existing.setMessage(text);
        return guestbookRepository.save(existing);
    }

    public void deleteComment(Long id, Long userId) throws Exception {
        ObituaryGuestbook existing = guestbookRepository.findById(id)
            .orElseThrow(() -> new Exception("Message not found"));
        
        Optional<Obituary> obitOpt = obituaryRepository.findById(existing.getObituaryId());
        if (obitOpt.isPresent()) {
            Obituary obit = obitOpt.get();
            obit.setGuestbookCount(Math.max(0, obit.getGuestbookCount() - 1));
            obituaryRepository.save(obit);
        }

        guestbookRepository.delete(existing);
    }

    public void logView(Long obituaryId, String ipAddress, String userAgent) {
        ObituaryView view = new ObituaryView();
        view.setObituaryId(obituaryId);
        view.setIpAddress(ipAddress);
        view.setUserAgent(userAgent);
        view.setCreatedAt(LocalDateTime.now());
        viewRepository.save(view);

        obituaryRepository.findById(obituaryId).ifPresent(o -> {
            obituaryRepository.save(o); // triggers pre-update views logic
        });
    }

    public void logReport(Long obituaryId, String reporterName, String reason) {
        ObituaryReport report = new ObituaryReport();
        report.setObituaryId(obituaryId);
        report.setReporterName(reporterName);
        report.setReason(reason);
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);

        obituaryRepository.findById(obituaryId).ifPresent(o -> {
            o.setReportCount(o.getReportCount() + 1);
            obituaryRepository.save(o);
        });
    }

    public List<ObituaryGallery> getObituaryGallery(Long obituaryId) {
        return galleryRepository.findByObituaryIdOrderByDisplayOrderAsc(obituaryId);
    }

    public List<ObituaryGuestbook> getObituaryGuestbook(Long obituaryId) {
        return guestbookRepository.findByObituaryIdAndStatusOrderByCreatedAtDesc(obituaryId, "approved");
    }

    public List<Obituary> getNearbyMemorials(Double lat, Double lon, Double radiusKm) {
        // Fallback distance calculation using simple box bounds
        double latRange = radiusKm / 111.0;
        double lonRange = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));

        Specification<Obituary> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            predicates.add(cb.equal(root.get("status"), "published"));
            
            predicates.add(cb.between(root.get("latitude"), lat - latRange, lat + latRange));
            predicates.add(cb.between(root.get("longitude"), lon - lonRange, lon + lonRange));
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return obituaryRepository.findAll(spec);
    }
}
