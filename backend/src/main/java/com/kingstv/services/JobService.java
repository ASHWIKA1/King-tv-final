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
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobCategoryRepository categoryRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobAlertRepository alertRepository;

    @Autowired
    private JobReportRepository reportRepository;

    @Autowired
    private JobViewRepository viewRepository;

    @Autowired
    private JobShareRepository shareRepository;

    public Page<JobPosting> getJobs(String search, Long companyId, Long categoryId, String employmentType,
                                    String workMode, Long districtId, Integer expMin, Integer expMax,
                                    Double salMin, Double salMax, String sort, Pageable pageable) {
        
        Specification<JobPosting> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));
            predicates.add(cb.equal(root.get("status"), "active"));

            if (companyId != null) {
                predicates.add(cb.equal(root.get("company").get("id"), companyId));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (employmentType != null && !employmentType.isEmpty() && !employmentType.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("employmentType"), employmentType));
            }
            if (workMode != null && !workMode.isEmpty() && !workMode.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("workMode"), workMode));
            }
            if (districtId != null) {
                predicates.add(cb.equal(root.get("districtId"), districtId));
            }
            if (expMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("experienceMin"), expMin));
            }
            if (expMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("experienceMax"), expMax));
            }
            if (salMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMin"), salMin));
            }
            if (salMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salaryMax"), salMax));
            }

            if (search != null && !search.isEmpty()) {
                String likePattern = "%" + search.toLowerCase() + "%";
                Predicate titlePred = cb.like(cb.lower(root.get("title")), likePattern);
                Predicate descPred = cb.like(cb.lower(root.get("description")), likePattern);
                
                // search in company name using join
                Join<JobPosting, Company> companyJoin = root.join("company", JoinType.LEFT);
                Predicate compPred = cb.like(cb.lower(companyJoin.get("companyName")), likePattern);
                
                predicates.add(cb.or(titlePred, descPred, compPred));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "salary_desc":
                    sortOrder = Sort.by(Sort.Direction.DESC, "salaryMax");
                    break;
                case "salary_asc":
                    sortOrder = Sort.by(Sort.Direction.ASC, "salaryMin");
                    break;
                case "most_applied":
                    sortOrder = Sort.by(Sort.Direction.DESC, "applicantCount");
                    break;
                case "newest":
                default:
                    sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
            }
        }

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);
        return jobRepository.findAll(spec, sortedPageable);
    }

    public Optional<JobPosting> getJobById(Long id) {
        return jobRepository.findById(id).filter(j -> !j.getDeleted());
    }

    public JobPosting createJob(JobPosting job) {
        job.setDeleted(false);
        job.setCreatedAt(LocalDateTime.now());
        job.setApplicantCount(0);
        job.setStatus("active");
        return jobRepository.save(job);
    }

    public JobPosting updateJob(Long id, JobPosting updated) throws Exception {
        JobPosting existing = jobRepository.findById(id)
            .orElseThrow(() -> new Exception("Job not found"));

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setResponsibilities(updated.getResponsibilities());
        existing.setRequiredSkills(updated.getRequiredSkills());
        existing.setPreferredSkills(updated.getPreferredSkills());
        existing.setExperienceMin(updated.getExperienceMin());
        existing.setExperienceMax(updated.getExperienceMax());
        existing.setSalaryMin(updated.getSalaryMin());
        existing.setSalaryMax(updated.getSalaryMax());
        existing.setEmploymentType(updated.getEmploymentType());
        existing.setWorkMode(updated.getWorkMode());
        existing.setVacancies(updated.getVacancies());
        existing.setDistrictId(updated.getDistrictId());
        existing.setTalukId(updated.getTalukId());
        existing.setStateId(updated.getStateId());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        existing.setApplicationDeadline(updated.getApplicationDeadline());
        existing.setStatus(updated.getStatus());
        existing.setFeatured(updated.getFeatured());

        return jobRepository.save(existing);
    }

    public void deleteJob(Long id) throws Exception {
        JobPosting existing = jobRepository.findById(id)
            .orElseThrow(() -> new Exception("Job not found"));
        existing.setDeleted(true);
        existing.setStatus("closed");
        jobRepository.save(existing);
    }

    public JobApplication applyToJob(Long jobId, Long candidateId, Long resumeId, String name, String phone, String exp, String summary) throws Exception {
        Optional<JobApplication> existing = applicationRepository.findByJobIdAndCandidateId(jobId, candidateId);
        if (existing.isPresent()) {
            throw new Exception("You have already applied for this job.");
        }

        JobPosting job = jobRepository.findById(jobId)
            .orElseThrow(() -> new Exception("Job posting not found"));

        JobApplication app = new JobApplication();
        app.setJobId(jobId);
        app.setCandidateId(candidateId);
        app.setResumeId(resumeId);
        app.setApplicantName(name);
        app.setApplicantPhone(phone);
        app.setExperience(exp);
        app.setSummary(summary);
        app.setApplicationStatus("Applied");
        app.setAppliedAt(LocalDateTime.now());

        JobApplication saved = applicationRepository.save(app);

        job.setApplicantCount(job.getApplicantCount() + 1);
        jobRepository.save(job);

        return saved;
    }

    public SavedJob saveJob(Long jobId, Long candidateId) throws Exception {
        Optional<SavedJob> existing = savedJobRepository.findByJobIdAndCandidateId(jobId, candidateId);
        if (existing.isPresent()) {
            return existing.get();
        }
        SavedJob sj = new SavedJob();
        sj.setJobId(jobId);
        sj.setCandidateId(candidateId);
        sj.setSavedAt(LocalDateTime.now());
        return savedJobRepository.save(sj);
    }

    public void unsaveJob(Long jobId, Long candidateId) throws Exception {
        savedJobRepository.findByJobIdAndCandidateId(jobId, candidateId)
            .ifPresent(savedJobRepository::delete);
    }

    public List<SavedJob> getSavedJobs(Long candidateId) {
        return savedJobRepository.findByCandidateId(candidateId);
    }

    public List<JobApplication> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<JobApplication> getCandidateApplications(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    public void logView(Long jobId, String ipAddress, String userAgent) {
        JobView view = new JobView();
        view.setJobId(jobId);
        view.setIpAddress(ipAddress);
        view.setUserAgent(userAgent);
        view.setCreatedAt(LocalDateTime.now());
        viewRepository.save(view);
    }

    public void logReport(Long jobId, String reporterName, String reason) {
        JobReport report = new JobReport();
        report.setJobId(jobId);
        report.setReporterName(reporterName);
        report.setReason(reason);
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);
    }

    public void logShare(Long jobId, String platform) {
        JobShare share = new JobShare();
        share.setJobId(jobId);
        share.setPlatform(platform);
        share.setCreatedAt(LocalDateTime.now());
        shareRepository.save(share);
    }

    public List<JobCategory> getCategories() {
        return categoryRepository.findAll();
    }

    public List<Company> getCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public Resume uploadResume(Long candidateId, String fileUrl, String parsedData, Integer score) {
        Optional<Resume> existing = resumeRepository.findByCandidateId(candidateId);
        Resume resume = existing.orElseGet(Resume::new);
        
        resume.setCandidateId(candidateId);
        resume.setFileUrl(fileUrl);
        resume.setParsedData(parsedData);
        resume.setAtsScore(score != null ? score : 75);
        resume.setUploadedAt(LocalDateTime.now());
        
        return resumeRepository.save(resume);
    }

    public CandidateProfile getCandidateProfile(Long userId) {
        return candidateProfileRepository.findByUserId(userId).orElseGet(() -> {
            CandidateProfile cp = new CandidateProfile();
            cp.setUserId(userId);
            cp.setProfileCompletion(25);
            return candidateProfileRepository.save(cp);
        });
    }

    public CandidateProfile updateCandidateProfile(Long userId, CandidateProfile updated) {
        CandidateProfile cp = getCandidateProfile(userId);
        cp.setHeadline(updated.getHeadline());
        cp.setSkills(updated.getSkills());
        cp.setEducation(updated.getEducation());
        cp.setExperience(updated.getExperience());
        cp.setPreferredLocation(updated.getPreferredLocation());
        cp.setExpectedSalary(updated.getExpectedSalary());
        cp.setProfileCompletion(updated.getProfileCompletion() != null ? updated.getProfileCompletion() : 50);
        return candidateProfileRepository.save(cp);
    }

    public List<JobPosting> getEmployerJobs(Long recruiterId) {
        return jobRepository.findAll(Specification.where((root, query, cb) -> 
            cb.and(
                cb.equal(root.get("deleted"), false),
                cb.equal(root.get("recruiterId"), recruiterId)
            )
        ));
    }
}
