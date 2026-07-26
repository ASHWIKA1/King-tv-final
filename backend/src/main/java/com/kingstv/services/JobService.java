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
    private CandidateRepository candidateRepository;

    @Autowired
    private UserRepository userRepository;

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

            // Filter out postings of suspended employers
            Join<JobPosting, Company> companyJoinSpec = root.join("company", JoinType.LEFT);
            predicates.add(cb.or(
                cb.isNull(companyJoinSpec.get("id")),
                cb.notEqual(companyJoinSpec.get("status"), "suspended")
            ));

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

    public Candidate getOrCreateCandidateForUser(Long userId) {
        return candidateRepository.findByUserId(userId).orElseGet(() -> {
            User u = userRepository.findById(userId).orElse(null);
            Candidate c = new Candidate();
            c.setUserId(userId);
            c.setName(u != null ? u.getFullName() : "Unknown");
            c.setEmail(u != null ? u.getEmail() : "");
            c.setPhone(u != null && u.getPhoneNumber() != null ? u.getPhoneNumber() : "");
            c.setLocation(u != null && u.getLocation() != null ? u.getLocation() : "N/A");
            c.setStatus("active");
            
            candidateProfileRepository.findByUserId(userId).ifPresent(cp -> {
                c.setSkills(cp.getSkills());
                c.setLocation(cp.getPreferredLocation() != null ? cp.getPreferredLocation() : c.getLocation());
            });
            
            return candidateRepository.save(c);
        });
    }

    public JobApplication applyToJob(Long jobId, Long candidateId, Long resumeId, String name, String phone, String exp, String summary) throws Exception {
        Candidate candidate = null;
        
        if (candidateId != null) {
            Optional<CandidateProfile> cpOpt = candidateProfileRepository.findById(candidateId);
            if (cpOpt.isPresent()) {
                candidate = getOrCreateCandidateForUser(cpOpt.get().getUserId());
            } else {
                Optional<Candidate> candOpt = candidateRepository.findById(candidateId);
                if (candOpt.isPresent()) {
                    candidate = candOpt.get();
                }
            }
        }
        
        if (candidate == null) {
            Optional<Candidate> existingCand = candidateRepository.findByPhone(phone);
            if (existingCand.isPresent()) {
                candidate = existingCand.get();
            } else {
                candidate = new Candidate();
                candidate.setName(name);
                candidate.setEmail(phone + "@guest.com");
                candidate.setPhone(phone);
                candidate.setLocation("N/A");
                candidate.setStatus("active");
                candidate = candidateRepository.save(candidate);
            }
        }

        if ("suspended".equalsIgnoreCase(candidate.getStatus())) {
            throw new Exception("Your candidate account is suspended for policy violations. You are blocked from applying to jobs.");
        }

        Optional<JobApplication> existing = applicationRepository.findByJobIdAndCandidateId(jobId, candidate.getId());
        if (existing.isPresent()) {
            throw new Exception("You have already applied for this job.");
        }

        JobPosting job = jobRepository.findById(jobId)
            .orElseThrow(() -> new Exception("Job posting not found"));

        if (job.getCompany() != null && "suspended".equalsIgnoreCase(job.getCompany().getStatus())) {
            throw new Exception("This job posting is no longer active.");
        }

        JobApplication app = new JobApplication();
        app.setJobId(jobId);
        app.setCandidateId(candidate.getId());
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

    public SavedJob saveJob(Long jobId, Long profileId) throws Exception {
        Long resolvedCandidateId = profileId;
        Optional<CandidateProfile> cpOpt = candidateProfileRepository.findById(profileId);
        if (cpOpt.isPresent()) {
            Candidate c = getOrCreateCandidateForUser(cpOpt.get().getUserId());
            resolvedCandidateId = c.getId();
        }

        Optional<SavedJob> existing = savedJobRepository.findByJobIdAndCandidateId(jobId, resolvedCandidateId);
        if (existing.isPresent()) {
            return existing.get();
        }
        SavedJob sj = new SavedJob();
        sj.setJobId(jobId);
        sj.setCandidateId(resolvedCandidateId);
        sj.setSavedAt(LocalDateTime.now());
        return savedJobRepository.save(sj);
    }

    public void unsaveJob(Long jobId, Long profileId) throws Exception {
        Long resolvedCandidateId = profileId;
        Optional<CandidateProfile> cpOpt = candidateProfileRepository.findById(profileId);
        if (cpOpt.isPresent()) {
            Candidate c = getOrCreateCandidateForUser(cpOpt.get().getUserId());
            resolvedCandidateId = c.getId();
        }
        savedJobRepository.findByJobIdAndCandidateId(jobId, resolvedCandidateId)
            .ifPresent(savedJobRepository::delete);
    }

    public List<SavedJob> getSavedJobs(Long profileId) {
        Optional<CandidateProfile> cpOpt = candidateProfileRepository.findById(profileId);
        if (cpOpt.isPresent()) {
            Candidate c = getOrCreateCandidateForUser(cpOpt.get().getUserId());
            return savedJobRepository.findByCandidateId(c.getId());
        }
        return savedJobRepository.findByCandidateId(profileId);
    }

    public List<JobApplication> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<JobApplication> getCandidateApplications(Long profileId) {
        Optional<CandidateProfile> cpOpt = candidateProfileRepository.findById(profileId);
        if (cpOpt.isPresent()) {
            Candidate c = getOrCreateCandidateForUser(cpOpt.get().getUserId());
            return applicationRepository.findByCandidateId(c.getId());
        }
        return applicationRepository.findByCandidateId(profileId);
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

    public Resume uploadResume(Long profileId, String fileUrl, String parsedData, Integer score) {
        Optional<Resume> existing = resumeRepository.findByCandidateId(profileId);
        Resume resume = existing.orElseGet(Resume::new);
        
        resume.setCandidateId(profileId);
        resume.setFileUrl(fileUrl);
        resume.setParsedData(parsedData);
        resume.setAtsScore(score != null ? score : 75);
        resume.setUploadedAt(LocalDateTime.now());
        
        Resume saved = resumeRepository.save(resume);

        candidateProfileRepository.findById(profileId).ifPresent(cp -> {
            Candidate c = getOrCreateCandidateForUser(cp.getUserId());
            c.setResumeUrl(fileUrl);
            candidateRepository.save(c);
        });
        
        return saved;
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
