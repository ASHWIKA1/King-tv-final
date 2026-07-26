package com.kingstv.controllers;

import com.kingstv.models.*;
import com.kingstv.services.JobService;
import com.kingstv.services.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/api/jobs", "/api/v1/jobs"})
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private StorageService storageService;

    @GetMapping
    public ResponseEntity<?> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Integer expMin,
            @RequestParam(required = false) Integer expMax,
            @RequestParam(required = false) Double salMin,
            @RequestParam(required = false) Double salMax,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Page<JobPosting> jobs = jobService.getJobs(
            search, companyId, categoryId, employmentType, workMode, districtId,
            expMin, expMax, salMin, salMax, sort, PageRequest.of(page, size)
        );
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<JobPosting> jobs = jobService.getJobs(query, null, null, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterJobs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<JobPosting> jobs = jobService.getJobs(null, null, categoryId, employmentType, workMode, districtId, null, null, null, null, sort, PageRequest.of(page, size));
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeatured(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        // featured filter logic
        Page<JobPosting> jobs = jobService.getJobs(null, null, null, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatest(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<JobPosting> jobs = jobService.getJobs(null, null, null, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/recommended")
    public ResponseEntity<?> getRecommended(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<JobPosting> jobs = jobService.getJobs(null, null, null, null, null, null, null, null, null, null, "newest", PageRequest.of(page, size));
        return ResponseEntity.ok(jobs.getContent());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(jobService.getCategories());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        try {
            String url = storageService.uploadFile(file, "jobs");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload file: " + e.getMessage()));
        }
    }

    // Wildcard path mappings at the very bottom
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        Optional<JobPosting> jobOpt = jobService.getJobById(id);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Job posting not found"));
        }
        return ResponseEntity.ok(jobOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobPosting job) {
        if (job.getTitle() == null || job.getDescription() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title and description are required."));
        }
        JobPosting saved = jobService.createJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobPosting job) {
        try {
            JobPosting updated = jobService.updateJob(id, job);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyToJob(
            @PathVariable Long id,
            @RequestParam(required = false) Long candidateId,
            @RequestParam(required = false) Long resumeId,
            @RequestParam String applicantName,
            @RequestParam String applicantPhone,
            @RequestParam String experience,
            @RequestParam(required = false) String summary) {
        try {
            JobApplication app = jobService.applyToJob(id, candidateId, resumeId, applicantName, applicantPhone, experience, summary);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<?> saveJob(@PathVariable Long id, @RequestParam Long candidateId) {
        try {
            SavedJob sj = jobService.saveJob(id, candidateId);
            return ResponseEntity.ok(sj);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<?> unsaveJob(@PathVariable Long id, @RequestParam Long candidateId) {
        try {
            jobService.unsaveJob(id, candidateId);
            return ResponseEntity.ok(Map.of("message", "Job unsaved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareJob(@PathVariable Long id, @RequestParam String platform) {
        jobService.logShare(id, platform);
        return ResponseEntity.ok(Map.of("message", "Share logged successfully"));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportJob(
            @PathVariable Long id,
            @RequestParam String reporterName,
            @RequestParam String reason) {
        jobService.logReport(id, reporterName, reason);
        return ResponseEntity.ok(Map.of("message", "Report logged successfully"));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> logView(@PathVariable Long id, HttpServletRequest request) {
        jobService.logView(id, request.getRemoteAddr(), request.getHeader("User-Agent"));
        return ResponseEntity.ok(Map.of("message", "View logged successfully"));
    }
}
