package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/admin/jobs", "/api/v1/admin/jobs"})
public class JobAdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobReportRepository jobReportRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return userRepository.findByEmail(auth.getName().toLowerCase()).orElse(null);
    }

    private boolean isNotAdmin(User user) {
        if (user == null) return true;
        String role = user.getRole();
        return !"SUPER_ADMIN".equalsIgnoreCase(role) && !"CHIEF_EDITOR".equalsIgnoreCase(role);
    }

    // 1. GET /api/admin/jobs/employers - list all employer accounts
    @GetMapping("/employers")
    public ResponseEntity<?> listEmployers() {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        List<Company> companies = companyRepository.findAll();
        List<Map<String, Object>> result = companies.stream().map(company -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", company.getId());
            map.put("companyName", company.getCompanyName());
            map.put("logo", company.getLogo());
            String email = cleanField(company.getEmail());
            String phone = cleanField(company.getPhone());
            map.put("contact", email + " / " + phone);
            map.put("activeJobPostings", jobRepository.countByCompanyAndDeletedFalseAndStatus(company, "active"));
            map.put("dateJoined", company.getCreatedAt());
            String status = company.getStatus();
            if (status == null || status.trim().isEmpty() || "null".equalsIgnoreCase(status.trim())) {
                status = "active";
            }
            map.put("status", status);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // 2. GET /api/admin/jobs/employers/{id} - detail view
    @GetMapping("/employers/{id}")
    public ResponseEntity<?> getEmployerDetail(@PathVariable Long id) {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Employer not found."));
        }

        Company company = companyOpt.get();
        List<JobPosting> postings = jobRepository.findByCompanyAndDeletedFalse(company);
        
        List<Map<String, Object>> postingsWithAppCount = postings.stream().map(job -> {
            Map<String, Object> jobMap = new HashMap<>();
            jobMap.put("id", job.getId());
            jobMap.put("title", job.getTitle());
            jobMap.put("location", job.getLocation());
            jobMap.put("applicantCount", job.getApplicantCount());
            jobMap.put("createdAt", job.getCreatedAt());
            jobMap.put("status", job.getStatus());
            return jobMap;
        }).collect(Collectors.toList());

        List<Long> postingIds = postings.stream().map(JobPosting::getId).collect(Collectors.toList());
        List<JobReport> reports = postingIds.isEmpty() ? Collections.emptyList() : jobReportRepository.findByJobIdIn(postingIds);

        Map<String, Object> result = new HashMap<>();
        result.put("company", company);
        result.put("postings", postingsWithAppCount);
        result.put("reports", reports);

        return ResponseEntity.ok(result);
    }

    // 3. GET /api/admin/jobs/candidates - list all candidate accounts
    @GetMapping("/candidates")
    public ResponseEntity<?> listCandidates() {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        List<Candidate> candidates = candidateRepository.findAll();
        List<Map<String, Object>> result = candidates.stream().map(candidate -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", candidate.getId());
            map.put("name", candidate.getName());
            map.put("email", candidate.getEmail());
            map.put("location", candidate.getLocation() != null ? candidate.getLocation() : "—");
            map.put("applicationsCount", jobApplicationRepository.countByCandidateId(candidate.getId()));
            map.put("dateJoined", candidate.getCreatedAt());
            String status = candidate.getStatus();
            if (status == null || status.trim().isEmpty() || "null".equalsIgnoreCase(status.trim())) {
                status = "active";
            }
            map.put("status", status);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // 4. GET /api/admin/jobs/candidates/{id} - detail view
    @GetMapping("/candidates/{id}")
    public ResponseEntity<?> getCandidateDetail(@PathVariable Long id) {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        Optional<Candidate> candidateOpt = candidateRepository.findById(id);
        if (candidateOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Candidate not found."));
        }

        Candidate candidate = candidateOpt.get();
        List<JobApplication> applications = jobApplicationRepository.findByCandidateId(id);

        List<Map<String, Object>> enrichedApps = applications.stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("appliedAt", app.getAppliedAt());
            map.put("status", app.getApplicationStatus());
            
            Optional<JobPosting> jobOpt = jobRepository.findById(app.getJobId());
            if (jobOpt.isPresent()) {
                JobPosting job = jobOpt.get();
                map.put("jobTitle", job.getTitle());
                if (job.getCompany() != null) {
                    map.put("companyName", job.getCompany().getCompanyName());
                } else {
                    map.put("companyName", "Unknown Company");
                }
            } else {
                map.put("jobTitle", "Unknown Job");
                map.put("companyName", "Unknown Company");
            }
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("candidate", candidate);
        result.put("applications", enrichedApps);

        return ResponseEntity.ok(result);
    }

    // 5. PATCH /api/admin/jobs/employers/{id}/suspend
    @PatchMapping("/employers/{id}/suspend")
    public ResponseEntity<?> suspendEmployer(@PathVariable Long id, @RequestParam String reason) {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Employer not found."));
        }

        Company company = companyOpt.get();
        company.setStatus("suspended");
        companyRepository.save(company);

        // Save Audit Log
        AuditLog log = new AuditLog();
        log.setActorId(admin.getId());
        log.setActorRole(admin.getRole());
        log.setActorEmail(admin.getEmail());
        log.setActionType("EMPLOYER_SUSPEND");
        log.setEntityType("Company");
        log.setEntityId(company.getId());
        log.setDetails("Employer suspended. Reason: " + reason);
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of("message", "Employer suspended successfully."));
    }

    // 6. PATCH /api/admin/jobs/employers/{id}/unsuspend
    @PatchMapping("/employers/{id}/unsuspend")
    public ResponseEntity<?> unsuspendEmployer(@PathVariable Long id) {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Employer not found."));
        }

        Company company = companyOpt.get();
        company.setStatus("active");
        companyRepository.save(company);

        // Save Audit Log
        AuditLog log = new AuditLog();
        log.setActorId(admin.getId());
        log.setActorRole(admin.getRole());
        log.setActorEmail(admin.getEmail());
        log.setActionType("EMPLOYER_UNSUSPEND");
        log.setEntityType("Company");
        log.setEntityId(company.getId());
        log.setDetails("Employer unsuspended.");
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of("message", "Employer unsuspended successfully."));
    }

    // 7. PATCH /api/admin/jobs/candidates/{id}/suspend
    @PatchMapping("/candidates/{id}/suspend")
    public ResponseEntity<?> suspendCandidate(@PathVariable Long id, @RequestParam String reason) {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        Optional<Candidate> candidateOpt = candidateRepository.findById(id);
        if (candidateOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Candidate not found."));
        }

        Candidate candidate = candidateOpt.get();
        candidate.setStatus("suspended");
        candidateRepository.save(candidate);

        // Save Audit Log
        AuditLog log = new AuditLog();
        log.setActorId(admin.getId());
        log.setActorRole(admin.getRole());
        log.setActorEmail(admin.getEmail());
        log.setActionType("CANDIDATE_SUSPEND");
        log.setEntityType("Candidate");
        log.setEntityId(candidate.getId());
        log.setDetails("Candidate suspended. Reason: " + reason);
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of("message", "Candidate suspended successfully."));
    }

    // 8. PATCH /api/admin/jobs/candidates/{id}/unsuspend
    @PatchMapping("/candidates/{id}/unsuspend")
    public ResponseEntity<?> unsuspendCandidate(@PathVariable Long id) {
        User admin = getAuthenticatedUser();
        if (isNotAdmin(admin)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Forbidden: Admin access required."));
        }

        Optional<Candidate> candidateOpt = candidateRepository.findById(id);
        if (candidateOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Candidate not found."));
        }

        Candidate candidate = candidateOpt.get();
        candidate.setStatus("active");
        candidateRepository.save(candidate);

        // Save Audit Log
        AuditLog log = new AuditLog();
        log.setActorId(admin.getId());
        log.setActorRole(admin.getRole());
        log.setActorEmail(admin.getEmail());
        log.setActionType("CANDIDATE_UNSUSPEND");
        log.setEntityType("Candidate");
        log.setEntityId(candidate.getId());
        log.setDetails("Candidate unsuspended.");
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of("message", "Candidate unsuspended successfully."));
    }

    private String cleanField(String value) {
        if (value == null || value.trim().isEmpty() || "null".equalsIgnoreCase(value.trim())) {
            return "—";
        }
        return value.trim();
    }
}
