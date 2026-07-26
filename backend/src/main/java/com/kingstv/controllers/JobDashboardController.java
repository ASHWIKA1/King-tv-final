package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.services.JobService;
import com.kingstv.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;

@RestController
@RequestMapping({"/api/v1", "/api"})
public class JobDashboardController {

    @Autowired
    private JobService jobService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobRepository jobRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return userRepository.findByEmail(auth.getName().toLowerCase()).orElse(null);
    }

    @PostMapping("/resume/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam Long candidateId,
            @RequestParam String fileUrl,
            @RequestParam(required = false) String parsedData,
            @RequestParam(required = false) Integer atsScore) {
        Resume resume = jobService.uploadResume(candidateId, fileUrl, parsedData, atsScore);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/resume/update")
    public ResponseEntity<?> updateResume(
            @RequestParam Long candidateId,
            @RequestParam String fileUrl,
            @RequestParam(required = false) String parsedData,
            @RequestParam(required = false) Integer atsScore) {
        Resume resume = jobService.uploadResume(candidateId, fileUrl, parsedData, atsScore);
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/candidate/dashboard")
    public ResponseEntity<?> getCandidateDashboard() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        CandidateProfile profile = jobService.getCandidateProfile(user.getId());
        List<JobApplication> applications = jobService.getCandidateApplications(profile.getId());
        List<SavedJob> savedJobs = jobService.getSavedJobs(profile.getId());

        // Enrich applications with job info for frontend representation
        List<Map<String, Object>> appsWithJobDetails = new java.util.ArrayList<>();
        for (JobApplication app : applications) {
            Optional<JobPosting> jpOpt = jobService.getJobById(app.getJobId());
            Map<String, Object> appMap = new HashMap<>();
            appMap.put("applicationId", app.getId());
            appMap.put("jobId", app.getJobId());
            appMap.put("appliedAt", app.getAppliedAt());
            appMap.put("applicationStatus", app.getApplicationStatus());
            appMap.put("applicantName", app.getApplicantName());
            appMap.put("applicantPhone", app.getApplicantPhone());
            appMap.put("experience", app.getExperience());
            appMap.put("summary", app.getSummary());
            if (jpOpt.isPresent()) {
                JobPosting jp = jpOpt.get();
                appMap.put("jobTitle", jp.getTitle());
                appMap.put("companyName", jp.getCompanyName());
                appMap.put("location", jp.getLocation());
            } else {
                appMap.put("jobTitle", "Unknown Job");
                appMap.put("companyName", "Unknown Company");
                appMap.put("location", "N/A");
            }
            appsWithJobDetails.add(appMap);
        }

        // Get candidate's resume
        Optional<Resume> resumeOpt = resumeRepository.findByCandidateId(profile.getId());

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("profile", profile);
        dashboard.put("applications", appsWithJobDetails);
        dashboard.put("savedJobs", savedJobs);
        dashboard.put("resume", resumeOpt.orElse(null));
        dashboard.put("recommendedJobs", List.of());
        dashboard.put("user", Map.of(
            "fullName", user.getFullName(),
            "email", user.getEmail()
        ));

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/candidate/profile")
    public ResponseEntity<?> getCandidateProfile() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        CandidateProfile profile = jobService.getCandidateProfile(user.getId());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/candidate/profile")
    public ResponseEntity<?> createOrUpdateCandidateProfile(@RequestBody CandidateProfile updated) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        CandidateProfile profile = jobService.updateCandidateProfile(user.getId(), updated);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/candidate/applications/{id}")
    public ResponseEntity<?> withdrawApplication(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job application not found"));
        }
        
        JobApplication app = appOpt.get();
        CandidateProfile cp = jobService.getCandidateProfile(user.getId());
        if (!app.getCandidateId().equals(cp.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized action"));
        }
        
        jobApplicationRepository.delete(app);
        
        // Decrement applicant count in job posting
        jobService.getJobById(app.getJobId()).ifPresent(job -> {
            job.setApplicantCount(Math.max(0, job.getApplicantCount() - 1));
            jobRepository.save(job);
        });
        
        return ResponseEntity.ok(Map.of("message", "Application withdrawn successfully"));
    }

    @GetMapping("/employer/profile")
    public ResponseEntity<?> getEmployerProfile() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        Optional<Company> companyOpt = companyRepository.findByUserId(user.getId());
        if (companyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Company not found"));
        }
        return ResponseEntity.ok(companyOpt.get());
    }

    @PostMapping("/employer/profile")
    public ResponseEntity<?> createOrUpdateEmployerProfile(@RequestBody Company companyData) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<Company> existingOpt = companyRepository.findByUserId(user.getId());
        Company company = existingOpt.orElseGet(Company::new);
        
        company.setUserId(user.getId());
        company.setCompanyName(companyData.getCompanyName());
        company.setLogo(companyData.getLogo());
        company.setIndustry(companyData.getIndustry());
        company.setWebsite(companyData.getWebsite());
        company.setAddress(companyData.getAddress());
        company.setAbout(companyData.getAbout());
        company.setEmail(user.getEmail()); 
        company.setPhone(companyData.getPhone());
        
        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/employer/dashboard")
    public ResponseEntity<?> getEmployerDashboard() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<Company> companyOpt = companyRepository.findByUserId(user.getId());
        if (companyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Employer profile does not exist. Please create one."));
        }
        
        Company company = companyOpt.get();
        List<JobPosting> jobs = jobService.getEmployerJobs(user.getId());

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("company", company);
        dashboard.put("jobs", jobs);
        dashboard.put("analytics", Map.of(
            "totalPostings", jobs.size(),
            "totalApplications", jobs.stream().mapToInt(JobPosting::getApplicantCount).sum()
        ));

        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/employer/jobs")
    public ResponseEntity<?> employerPostJob(@RequestBody JobPosting job) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<Company> companyOpt = companyRepository.findByUserId(user.getId());
        if (companyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Create employer company profile first."));
        }
        
        job.setCompany(companyOpt.get());
        job.setRecruiterId(user.getId());
        
        JobPosting saved = jobService.createJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/employer/jobs/{id}")
    public ResponseEntity<?> employerUpdateJob(@PathVariable Long id, @RequestBody JobPosting jobData) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<JobPosting> existingOpt = jobService.getJobById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job posting not found"));
        }
        
        JobPosting existing = existingOpt.get();
        if (!existing.getRecruiterId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized action"));
        }
        
        try {
            JobPosting updated = jobService.updateJob(id, jobData);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/employer/jobs/{id}")
    public ResponseEntity<?> employerDeleteJob(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<JobPosting> existingOpt = jobService.getJobById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job posting not found"));
        }
        
        JobPosting existing = existingOpt.get();
        if (!existing.getRecruiterId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized action"));
        }
        
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/employer/jobs/{id}/applicants")
    public ResponseEntity<?> getJobApplicantsList(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<JobPosting> jobOpt = jobService.getJobById(id);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job posting not found"));
        }
        
        JobPosting job = jobOpt.get();
        if (!job.getRecruiterId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized action"));
        }
        
        List<JobApplication> applications = jobService.getJobApplications(id);
        
        List<Map<String, Object>> enrichedApps = new java.util.ArrayList<>();
        for (JobApplication app : applications) {
            Map<String, Object> map = new HashMap<>();
            map.put("applicationId", app.getId());
            map.put("jobId", app.getJobId());
            map.put("applicantName", app.getApplicantName());
            map.put("applicantPhone", app.getApplicantPhone());
            map.put("experience", app.getExperience());
            map.put("summary", app.getSummary());
            map.put("appliedAt", app.getAppliedAt());
            map.put("applicationStatus", app.getApplicationStatus());
            
            CandidateProfile cp = candidateProfileRepository.findById(app.getCandidateId()).orElse(null);
            if (cp != null) {
                userRepository.findById(cp.getUserId()).ifPresent(u -> {
                    map.put("email", u.getEmail());
                });
                
                Optional<Resume> resumeOpt = resumeRepository.findByCandidateId(app.getCandidateId());
                resumeOpt.ifPresent(resume -> map.put("resumeUrl", resume.getFileUrl()));
            }
            enrichedApps.add(map);
        }
        
        return ResponseEntity.ok(enrichedApps);
    }

    @PostMapping("/employer/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not authenticated"));
        }
        
        Optional<JobApplication> appOpt = jobApplicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job application not found"));
        }
        
        JobApplication app = appOpt.get();
        Optional<JobPosting> jobOpt = jobService.getJobById(app.getJobId());
        if (jobOpt.isPresent() && !jobOpt.get().getRecruiterId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Unauthorized action"));
        }
        
        app.setApplicationStatus(status);
        JobApplication saved = jobApplicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/jobs/admin/applications/{id}")
    public ResponseEntity<?> getJobApplicationsForAdmin(@PathVariable Long id) {
        List<JobApplication> applications = jobService.getJobApplications(id);
        List<Map<String, Object>> enrichedApps = new java.util.ArrayList<>();
        for (JobApplication app : applications) {
            Map<String, Object> map = new HashMap<>();
            map.put("applicationId", app.getId());
            map.put("jobId", app.getJobId());
            map.put("applicantName", app.getApplicantName());
            map.put("applicantPhone", app.getApplicantPhone());
            map.put("experience", app.getExperience());
            map.put("summary", app.getSummary());
            map.put("appliedAt", app.getAppliedAt());
            map.put("applicationStatus", app.getApplicationStatus());
            map.put("resumeId", app.getResumeId());
            enrichedApps.add(map);
        }
        return ResponseEntity.ok(enrichedApps);
    }
}
