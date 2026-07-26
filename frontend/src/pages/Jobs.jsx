import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './Jobs.css';

const Jobs = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, token } = useContext(AuthContext);

  // View States
  const [activeView, setActiveView] = useState('list'); // 'list', 'seeker-dashboard', 'seeker-profile-create', 'employer-dashboard', 'employer-profile-create'
  const [seekerDashboardData, setSeekerDashboardData] = useState(null);
  const [employerDashboardData, setEmployerDashboardData] = useState(null);
  const [employerSubView, setEmployerSubView] = useState('dashboard'); // 'dashboard', 'post-job', 'manage-jobs', 'manage-applicants', 'company-profile'

  // Seeker Profile Form States
  const [seekerHeadline, setSeekerHeadline] = useState('');
  const [seekerSkills, setSeekerSkills] = useState('');
  const [seekerEducation, setSeekerEducation] = useState('');
  const [seekerExperience, setSeekerExperience] = useState('1 Year');
  const [seekerPrefLoc, setSeekerPrefLoc] = useState('');
  const [seekerSalary, setSeekerSalary] = useState('');
  const [seekerResumeUrl, setSeekerResumeUrl] = useState('');

  // Employer Profile Form States
  const [empCompanyName, setEmpCompanyName] = useState('');
  const [empCompanyLogo, setEmpCompanyLogo] = useState('');
  const [empIndustry, setEmpIndustry] = useState('');
  const [empWebsite, setEmpWebsite] = useState('');
  const [empAddress, setEmpAddress] = useState('');
  const [empAbout, setEmpAbout] = useState('');
  const [empPhone, setEmpPhone] = useState('');

  // Selected Job for Applicants & list of applicants
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Confirmation dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogConfirmAction, setDialogConfirmAction] = useState(null);
  
  // Data lists
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  // Selection / Filters
  const [activeTab, setActiveTab] = useState('jobs'); // jobs, candidates
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedDist, setSelectedDist] = useState('all');
  const [selectedExp, setSelectedExp] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all, Full Time, Part Time, Work From Home, Internship
  const [selectedSort, setSelectedSort] = useState('newest');

  // Loading & Pagination
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);

  // Modals / Panels
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [dashboardRole, setDashboardRole] = useState('candidate'); // candidate, employer
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareJob, setShareJob] = useState(null);

  // Apply Form
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantExp, setApplicantExp] = useState('1yr');
  const [applicantSummary, setApplicantSummary] = useState('');
  const [resumeFile, setResumeFile] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  // Post Job Form
  const [newTitle, setNewTitle] = useState('');
  const [newCompanyId, setNewCompanyId] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newExpMin, setNewExpMin] = useState(1);
  const [newExpMax, setNewExpMax] = useState(5);
  const [newSalMin, setNewSalMin] = useState(4.0);
  const [newSalMax, setNewSalMax] = useState(8.0);
  const [newTypeSelect, setNewTypeSelect] = useState('Full Time');
  const [newModeSelect, setNewModeSelect] = useState('Work From Office');
  const [newVacancies, setNewVacancies] = useState(1);
  const [newDistrictId, setNewDistrictId] = useState('');

  // ATS match simulation
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState([]);

  // Fetch Category lists and Districts
  useEffect(() => {
    fetchApi('/jobs/categories')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(fallbackCategories);
        }
      })
      .catch(() => setCategories(fallbackCategories));

    fetchApi('/districts')
      .then(data => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch(err => console.warn("Failed to load districts", err));
  }, []);

  // Fetch Jobs
  const loadJobs = () => {
    setLoading(true);
    let endpoint = '/jobs';
    let params = [];

    if (searchQuery.trim() !== '') {
      endpoint = '/jobs/search';
      params.push(`query=${encodeURIComponent(searchQuery)}`);
    } else {
      endpoint = '/jobs/filter';
      if (selectedCat !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCat);
        if (catObj) params.push(`categoryId=${catObj.id}`);
      }
      if (selectedDist !== 'all') {
        params.push(`districtId=${selectedDist}`);
      }
      if (selectedType !== 'all') {
        params.push(`employmentType=${selectedType}`);
      }
      if (selectedSort !== 'newest') {
        params.push(`sort=${selectedSort}`);
      }
    }

    params.push(`page=${page}`);
    params.push(`size=${size}`);

    const queryString = params.length > 0 ? `?${params.join('&')}` : '';

    fetchApi(`${endpoint}${queryString}`)
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to load jobs from API, using fallback", err);
        setJobs(fallbackJobs);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadJobs();
  }, [selectedCat, selectedDist, selectedType, selectedSort, searchQuery, page]);

  // ==========================================================================
  // RECRUITMENT PLATFORM HANDLER METHODS
  // ==========================================================================

  // Helper to show custom alerts
  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper for confirm dialog
  const confirmAction = (title, message, action) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogConfirmAction(() => () => {
      action();
      setDialogOpen(false);
    });
    setDialogOpen(true);
  };

  // Upload file helper
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadUrl = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1'}/jobs/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error("File upload failed");
    const data = await response.json();
    return data.url;
  };

  // Handle redirects on load if arriving after auth redirection
  useEffect(() => {
    if (isAuthenticated && location.state?.openJobRole) {
      const role = location.state.openJobRole;
      window.history.replaceState({}, document.title);
      handleZoneClick(role);
    }
  }, [isAuthenticated, location.state]);

  const handleZoneClick = async (role) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/jobs', jobRole: role } });
      return;
    }

    if (role === 'seeker') {
      setLoading(true);
      try {
        const profile = await fetchApi('/candidate/profile');
        if (profile && profile.skills && profile.education) {
          await fetchSeekerDashboard();
        } else {
          if (profile) {
            setSeekerHeadline(profile.headline || '');
            setSeekerSkills(profile.skills || '');
            setSeekerEducation(profile.education || '');
            setSeekerExperience(profile.experience || '1 Year');
            setSeekerPrefLoc(profile.preferredLocation || '');
            setSeekerSalary(profile.expectedSalary || '');
          }
          setActiveView('seeker-profile-create');
        }
      } catch (err) {
        console.error("Failed to load candidate profile", err);
        setActiveView('seeker-profile-create');
      } finally {
        setLoading(false);
      }
    } else if (role === 'employer') {
      setLoading(true);
      try {
        const company = await fetchApi('/employer/profile');
        if (company && company.companyName) {
          await fetchEmployerDashboard();
        } else {
          setActiveView('employer-profile-create');
        }
      } catch (err) {
        console.error("Failed to load company profile", err);
        setActiveView('employer-profile-create');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSeekerDashboard = async () => {
    try {
      const data = await fetchApi('/candidate/dashboard');
      setSeekerDashboardData(data);
      if (data.profile) {
        setSeekerHeadline(data.profile.headline || '');
        setSeekerSkills(data.profile.skills || '');
        setSeekerEducation(data.profile.education || '');
        setSeekerExperience(data.profile.experience || '1 Year');
        setSeekerPrefLoc(data.profile.preferredLocation || '');
        setSeekerSalary(data.profile.expectedSalary || '');
        if (data.resume) {
          setSeekerResumeUrl(data.resume.fileUrl || '');
        }
      }
      setActiveView('seeker-dashboard');
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to load candidate dashboard" : "தேடுபவர் கட்டுப்பாட்டுப் பலகை ஏற்ற முடியவில்லை", 'error');
    }
  };

  const fetchEmployerDashboard = async () => {
    try {
      const data = await fetchApi('/employer/dashboard');
      setEmployerDashboardData(data);
      if (data.company) {
        setEmpCompanyName(data.company.companyName || '');
        setEmpCompanyLogo(data.company.logo || '');
        setEmpIndustry(data.company.industry || '');
        setEmpWebsite(data.company.website || '');
        setEmpAddress(data.company.address || '');
        setEmpAbout(data.company.about || '');
        setEmpPhone(data.company.phone || '');
      }
      setActiveView('employer-dashboard');
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to load employer dashboard" : "நிறுவன கட்டுப்பாட்டுப் பலகை ஏற்ற முடியவில்லை", 'error');
    }
  };

  const handleSeekerProfileSave = async (e) => {
    e.preventDefault();
    if (!seekerHeadline || !seekerSkills || !seekerEducation || !seekerPrefLoc) {
      showToast(lang === 'en' ? "Please fill all required fields" : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்", 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        headline: seekerHeadline,
        skills: seekerSkills,
        education: seekerEducation,
        experience: seekerExperience,
        preferredLocation: seekerPrefLoc,
        expectedSalary: seekerSalary ? parseFloat(seekerSalary) : null
      };

      const profile = await fetchApi('/candidate/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (seekerResumeUrl) {
        await fetchApi(`/resume/upload?candidateId=${profile.id}&fileUrl=${encodeURIComponent(seekerResumeUrl)}&atsScore=85&parsedData=${encodeURIComponent(seekerSkills)}`, {
          method: 'POST'
        });
      }

      showToast(lang === 'en' ? "Profile saved successfully!" : "சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!");
      await fetchSeekerDashboard();
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to save profile" : "சுயவிவரத்தை சேமிக்க முடியவில்லை", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    setLoading(true);
    try {
      await fetchApi(`/candidate/applications/${appId}`, {
        method: 'DELETE'
      });
      showToast(lang === 'en' ? "Application withdrawn successfully." : "விண்ணப்பம் வெற்றிகரமாக திரும்பப் பெறப்பட்டது.");
      await fetchSeekerDashboard();
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to withdraw application." : "விண்ணப்பத்தை திரும்பப் பெற முடியவில்லை.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerProfileSave = async (e) => {
    e.preventDefault();
    if (!empCompanyName || !empIndustry || !empAddress || !empAbout) {
      showToast(lang === 'en' ? "Please fill all required fields" : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்", 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        companyName: empCompanyName,
        logo: empCompanyLogo,
        industry: empIndustry,
        website: empWebsite,
        address: empAddress,
        about: empAbout,
        phone: empPhone
      };

      await fetchApi('/employer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      showToast(lang === 'en' ? "Company profile saved successfully!" : "நிறுவன விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டது!");
      await fetchEmployerDashboard();
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to save company profile" : "நிறுவன விவரங்களை சேமிக்க முடியவில்லை", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e, isDraft = false) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newCatId || !newDistrictId || !newSkills) {
      showToast(lang === 'en' ? "Please fill all required fields" : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்", 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: newTitle,
        description: newDesc,
        categoryObj: { id: newCatId },
        experienceMin: newExpMin,
        experienceMax: newExpMax,
        salaryMin: newSalMin,
        salaryMax: newSalMax,
        employmentType: newTypeSelect,
        workMode: newModeSelect,
        vacancies: newVacancies,
        districtId: newDistrictId || null,
        requiredSkills: newSkills,
        status: isDraft ? 'draft' : 'active'
      };

      await fetchApi('/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      showToast(isDraft ? (lang === 'en' ? "Job draft saved!" : "வரைவு சேமிக்கப்பட்டது!") : (lang === 'en' ? "Job vacancy published!" : "வேலை வாய்ப்பு வெளியிடப்பட்டது!"));
      
      // Reset form fields
      setNewTitle('');
      setNewDesc('');
      setNewSkills('');
      setNewDistrictId('');
      
      await fetchEmployerDashboard();
      setEmployerSubView('manage-jobs');
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to publish job vacancy" : "வேலை வாய்ப்பை வெளியிட முடியவில்லை", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    setLoading(true);
    try {
      await fetchApi(`/employer/jobs/${jobId}`, {
        method: 'DELETE'
      });
      showToast(lang === 'en' ? "Job vacancy closed/deleted successfully." : "வேலை வாய்ப்பு வெற்றிகரமாக மூடப்பட்டது.");
      await fetchEmployerDashboard();
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to close job vacancy." : "வேலை வாய்ப்பை மூட முடியவில்லை.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (job) => {
    setLoading(true);
    setSelectedJobForApplicants(job);
    try {
      const data = await fetchApi(`/employer/jobs/${job.id}/applicants`);
      setApplicantsList(data);
      setEmployerSubView('manage-applicants');
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to retrieve applicants list" : "விண்ணப்பதாரர்களின் பட்டியலை பெற முடியவில்லை", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicantStatus = async (appId, newStatus) => {
    setLoading(true);
    try {
      await fetchApi(`/employer/applications/${appId}/status?status=${encodeURIComponent(newStatus)}`, {
        method: 'POST'
      });
      showToast(lang === 'en' ? `Candidate status updated to: ${newStatus}` : `வேட்பாளர் நிலை மாற்றப்பட்டது: ${newStatus}`);
      
      // Update local applicants list state
      setApplicantsList(prev => prev.map(a => a.applicationId === appId ? { ...a, applicationStatus: newStatus } : a));
    } catch (err) {
      console.error(err);
      showToast(lang === 'en' ? "Failed to update status." : "நிலையை புதுப்பிக்க முடியவில்லை.", 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open job details
  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    fetchApi(`/jobs/${job.id}`)
      .then(data => {
        setJobDetails(data);
        // Log view
        fetchApi(`/jobs/${job.id}/view`, { method: 'POST' }).catch(() => {});
      })
      .catch(() => {
        setJobDetails(job);
      });
  };

  // Upload Resume & ATS score analysis simulation
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/jobs/upload`;
    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error("Resume upload failed");
      const data = await response.json();
      setResumeFile(data.url);

      // Simulate ATS Parser Skill Gap scoring
      setTimeout(() => {
        setAtsScore(84);
        setAtsFeedback([
          "✓ ATS Readable Format detected.",
          "✓ Found core skills: React, Javascript, REST APIs.",
          "⚠ Suggestion: Add Cloud platforms or AWS deployment details to hit 95% match."
        ]);
        alert(lang === 'en' ? "Resume parsed successfully! Score: 84%" : "விவரக்குறிப்பு பகுப்பாய்வு செய்யப்பட்டது! தகுதி மதிப்பெண்: 84%");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert(lang === 'en' ? "Failed to upload resume." : "விவரக்குறிப்பு பதிவேற்ற முடியவில்லை.");
    } finally {
      setUploadingResume(false);
    }
  };

  // Submit Job Application
  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert(lang === 'en' ? "Please fill name and phone." : "பெயர் மற்றும் தொலைபேசி எண்ணை நிரப்பவும்.");
      return;
    }

    const targetJobId = selectedJob.id;
    fetchApi(`/jobs/${targetJobId}/apply?applicantName=${encodeURIComponent(applicantName)}&applicantPhone=${encodeURIComponent(applicantPhone)}&experience=${encodeURIComponent(applicantExp)}&summary=${encodeURIComponent(applicantSummary)}`, {
      method: 'POST'
    })
      .then(() => {
        alert(lang === 'en' ? "Application submitted successfully!" : "வேலைக்கு வெற்றிகரமாக விண்ணப்பிக்கப்பட்டது!");
        setShowApplyModal(false);
        setApplicantName('');
        setApplicantPhone('');
        setApplicantSummary('');
        loadJobs();
      })
      .catch(err => {
        console.error(err);
        alert(lang === 'en' ? "You have already applied for this job." : "இந்த வேலைக்கு நீங்கள் ஏற்கனவே விண்ணப்பித்துள்ளீர்கள்.");
      });
  };

  // Submit new Job vacancy (Employer Form)
  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newCompanyId || !newCatId) {
      alert(lang === 'en' ? "Please fill all required fields." : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்.");
      return;
    }

    const payload = {
      title: newTitle,
      description: newDesc,
      company: { id: newCompanyId },
      categoryObj: { id: newCatId },
      experienceMin: newExpMin,
      experienceMax: newExpMax,
      salaryMin: newSalMin,
      salaryMax: newSalMax,
      employmentType: newTypeSelect,
      workMode: newModeSelect,
      vacancies: newVacancies,
      districtId: newDistrictId || null,
      requiredSkills: newSkills
    };

    fetchApi('/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        alert(lang === 'en' ? "Job posted successfully!" : "வேலை வாய்ப்பு வெற்றிகரமாக பதிவிடப்பட்டது!");
        setShowPostModal(false);
        setNewTitle('');
        setNewDesc('');
        setNewSkills('');
        loadJobs();
      })
      .catch(err => {
        console.error(err);
        alert(lang === 'en' ? "Failed to save job posting." : "வேலை வாய்ப்பை சேமிக்க முடியவில்லை.");
      });
  };

  const handleShareClick = (job, platform) => {
    const pageUrl = window.location.origin + `/jobs?id=${job.id}`;
    const shareText = encodeURIComponent(`Check out this job opportunity! ${job.title} at ${job.companyName}`);
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl);
      alert(lang === 'en' ? 'Link copied!' : 'இணைப்பு நகலெடுக்கப்பட்டது!');
    }
    setShowShareModal(false);
  };

  // ==========================================================================
  // CANDIDATE & EMPLOYER VIEW RENDERERS
  // ==========================================================================

  const renderSeekerDashboard = () => {
    if (!seekerDashboardData) return <div style={{ padding: '80px 0', textAlign: 'center' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#2563eb' }}></i></div>;

    const { profile, applications, user: userData } = seekerDashboardData;

    const totalApps = applications.length;
    const pendingApps = applications.filter(a => a.applicationStatus === 'Applied' || a.applicationStatus === 'Pending').length;
    const shortlistedApps = applications.filter(a => a.applicationStatus === 'Shortlisted').length;
    const interviewApps = applications.filter(a => a.applicationStatus === 'Interview Scheduled' || a.applicationStatus === 'Interview').length;
    const selectedApps = applications.filter(a => a.applicationStatus === 'Selected').length;
    const rejectedApps = applications.filter(a => a.applicationStatus === 'Rejected').length;

    return (
      <div className="job-dashboard-view text-left" style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
        <div className="job-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800 }}>{lang === 'en' ? 'Candidate Dashboard' : 'வேட்பாளர் கட்டுப்பாட்டுப் பலகை'}</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              Welcome back, {userData?.fullName}! Keep track of your job applications.
            </p>
          </div>
          <button className="dashboard-back-btn" onClick={() => setActiveView('list')}>
            <i className="fas fa-arrow-left"></i> {lang === 'en' ? 'Back to Jobs' : 'வேலைகளுக்குத் திரும்பு'}
          </button>
        </div>

        <div className="seeker-stats-grid">
          <div className="metric-card primary">
            <span className="metric-value">{totalApps}</span>
            <span className="metric-label">{lang === 'en' ? 'Total Applied' : 'விண்ணப்பித்தது'}</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{pendingApps}</span>
            <span className="metric-label">{lang === 'en' ? 'Pending' : 'நிலுவையில்'}</span>
          </div>
          <div className="metric-card warning">
            <span className="metric-value">{shortlistedApps}</span>
            <span className="metric-label">{lang === 'en' ? 'Shortlisted' : 'பரிசீலனையில்'}</span>
          </div>
          <div className="metric-card success">
            <span className="metric-value">{interviewApps}</span>
            <span className="metric-label">{lang === 'en' ? 'Interviews' : 'நேர்காணல்'}</span>
          </div>
          <div className="metric-card primary" style={{ background: '#dcfce7', borderColor: '#bbf7d0' }}>
            <span className="metric-value" style={{ color: '#15803d' }}>{selectedApps}</span>
            <span className="metric-label" style={{ color: '#15803d' }}>{lang === 'en' ? 'Selected' : 'தேர்வு'}</span>
          </div>
          <div className="metric-card danger">
            <span className="metric-value">{rejectedApps}</span>
            <span className="metric-label">{lang === 'en' ? 'Rejected' : 'நிராகரிக்கப்பட்டது'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
          
          <div className="dashboard-widget-card">
            <h3 className="dashboard-widget-title">
              <i className="fas fa-file-invoice" style={{ color: '#2563eb' }}></i>
              {lang === 'en' ? 'Job Applications History' : 'விண்ணப்ப வரலாறு'}
            </h3>
            
            {applications.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <i className="fas fa-folder-open" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
                {lang === 'en' ? 'You have not applied for any jobs yet.' : 'நீங்கள் இன்னும் எந்த வேலைக்கும் விண்ணப்பிக்கவில்லை.'}
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>{lang === 'en' ? 'Job Title' : 'பணி'}</th>
                      <th>{lang === 'en' ? 'Company' : 'நிறுவனம்'}</th>
                      <th>{lang === 'en' ? 'Applied Date' : 'விண்ணப்பித்த நாள்'}</th>
                      <th>{lang === 'en' ? 'Status' : 'நிலை'}</th>
                      <th style={{ textAlign: 'center' }}>{lang === 'en' ? 'Action' : 'செயல்'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.applicationId}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{app.jobTitle}</td>
                        <td>{app.companyName}</td>
                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${app.applicationStatus.toLowerCase().replace(' ', '_')}`}>
                            {app.applicationStatus}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '4px 10px', fontSize: '11px' }}
                              onClick={() => handleOpenDetails({ id: app.jobId, title: app.jobTitle, companyName: app.companyName, location: app.location })}
                            >
                              {lang === 'en' ? 'View' : 'விவரம்'}
                            </button>
                            {app.applicationStatus !== 'Selected' && app.applicationStatus !== 'Rejected' && (
                              <button 
                                className="btn-primary" 
                                style={{ padding: '4px 10px', fontSize: '11px', background: '#dc2626' }}
                                onClick={() => confirmAction(
                                  lang === 'en' ? 'Withdraw Application?' : 'விண்ணப்பத்தைத் திரும்பப் பெறவா?',
                                  lang === 'en' ? 'Are you sure you want to withdraw your application? This action cannot be undone.' : 'விண்ணப்பத்தைத் திரும்பப் பெற விரும்புகிறீர்களா? இதை மாற்ற முடியாது.',
                                  () => handleWithdrawApplication(app.applicationId)
                                )}
                              >
                                {lang === 'en' ? 'Withdraw' : 'திரும்பப் பெறு'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="dashboard-widget-card">
              <h3 className="dashboard-widget-title">
                <i className="fas fa-bolt" style={{ color: '#fbbf24' }}></i>
                {lang === 'en' ? 'Quick Actions' : 'விரைவுச் செயல்கள்'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn-primary" onClick={() => setActiveView('list')} style={{ width: '100%' }}>
                  <i className="fas fa-search"></i> {lang === 'en' ? 'Browse Jobs' : 'வேலை தேடுக'}
                </button>
                <button className="btn-secondary" onClick={() => setActiveView('seeker-profile-create')} style={{ width: '100%' }}>
                  <i className="fas fa-user-edit"></i> {lang === 'en' ? 'Edit Profile' : 'சுயவிவரம் திருத்துக'}
                </button>
              </div>
            </div>

            <div className="dashboard-widget-card">
              <h3 className="dashboard-widget-title">
                <i className="fas fa-user-tie" style={{ color: '#db2777' }}></i>
                {lang === 'en' ? 'Profile Details' : 'சுயவிவர விவரங்கள்'}
              </h3>
              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <strong style={{ color: '#475569' }}>{lang === 'en' ? 'Current Headline:' : 'தற்போதைய பணி:'}</strong>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>{profile.headline || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>{lang === 'en' ? 'Skills:' : 'திறன்கள்:'}</strong>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {profile.skills ? profile.skills.split(',').map(s => (
                      <span key={s} style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{s.trim()}</span>
                    )) : 'N/A'}
                  </div>
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>{lang === 'en' ? 'Education:' : 'கல்வி:'}</strong>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>{profile.education || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>{lang === 'en' ? 'Experience:' : 'அனுபவம்:'}</strong>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>{profile.experience || 'N/A'}</div>
                </div>
                {seekerResumeUrl && (
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '10px' }}>
                    <a 
                      href={seekerResumeUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <i className="fas fa-file-pdf" style={{ fontSize: '16px', color: '#dc2626' }}></i>
                      {lang === 'en' ? 'View Uploaded Resume' : 'பதிவேற்றிய விவரக்குறிப்பு'}
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  };

  const renderSeekerProfileCreate = () => {
    return (
      <div className="job-dashboard-view text-left" style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
        <div className="job-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800 }}>
              {seekerDashboardData?.profile?.skills
                ? (lang === 'en' ? 'Edit Candidate Profile' : 'சுயவிவரத்தைத் திருத்துக')
                : (lang === 'en' ? 'Create Candidate Profile' : 'வேட்பாளர் சுயவிவரம் உருவாக்கு')}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              Name, Email, and Phone are auto-filled and read-only. Provide your job details.
            </p>
          </div>
          <button className="dashboard-back-btn" onClick={() => {
            if (seekerDashboardData?.profile?.skills) {
              setActiveView('seeker-dashboard');
            } else {
              setActiveView('list');
            }
          }}>
            <i className="fas fa-arrow-left"></i> {lang === 'en' ? 'Cancel' : 'ரத்து செய்'}
          </button>
        </div>

        <form onSubmit={handleSeekerProfileSave} className="recruitment-form">
          <div className="profile-form-grid">
            
            <div>
              <label>{lang === 'en' ? 'Full Name' : 'பெயர்'}</label>
              <input type="text" value={user?.fullName || 'Candidate User'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>

            <div>
              <label>{lang === 'en' ? 'Email Address' : 'மின்னஞ்சல்'}</label>
              <input type="email" value={user?.email || 'candidate@gmail.com'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>

            <div>
              <label>{lang === 'en' ? 'Phone Number' : 'கைபேசி எண்'}</label>
              <input type="text" value={user?.phone || '+91 98765 43210'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>

            <div>
              <label>{lang === 'en' ? 'Current Headline / Target Role *' : 'தற்போதைய பதவி / இலக்கு பணி *'}</label>
              <input 
                type="text" 
                placeholder="e.g. Software Engineer, React Specialist" 
                value={seekerHeadline} 
                onChange={(e) => setSeekerHeadline(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>{lang === 'en' ? 'Work Experience *' : 'வேலை அனுபவம் *'}</label>
              <select value={seekerExperience} onChange={(e) => setSeekerExperience(e.target.value)}>
                <option value="Fresher">Fresher (0 - 1 Year)</option>
                <option value="1-3 Years">1 - 3 Years</option>
                <option value="3-6 Years">3 - 6 Years</option>
                <option value="6+ Years">6+ Years</option>
              </select>
            </div>

            <div>
              <label>{lang === 'en' ? 'Highest Education Qualification *' : 'கல்வித் தகுதி *'}</label>
              <input 
                type="text" 
                placeholder="e.g. B.E. Computer Science, MCA, B.Sc" 
                value={seekerEducation} 
                onChange={(e) => setSeekerEducation(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>{lang === 'en' ? 'Skills * (Comma separated)' : 'திறன்கள் * (காற்புள்ளியால் பிரிக்கவும்)'}</label>
              <input 
                type="text" 
                placeholder="e.g. React, Java, Spring Boot, SQL" 
                value={seekerSkills} 
                onChange={(e) => setSeekerSkills(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>{lang === 'en' ? 'Preferred Location *' : 'விரும்பும் பணி இடம் *'}</label>
              <select value={seekerPrefLoc} onChange={(e) => setSeekerPrefLoc(e.target.value)} required>
                <option value="">Select Preferred Location</option>
                {districts.map(d => (
                  <option key={d.districtId} value={lang === 'en' ? d.nameEn : d.nameTa}>{lang === 'en' ? d.nameEn : d.nameTa}</option>
                ))}
              </select>
            </div>

            <div>
              <label>{lang === 'en' ? 'Expected Monthly Salary (INR - Optional)' : 'எதிர்பார்க்கும் மாதச் சம்பளம் (விருப்பம்)'}</label>
              <input 
                type="number" 
                placeholder="e.g. 50000" 
                value={seekerSalary} 
                onChange={(e) => setSeekerSalary(e.target.value)} 
              />
            </div>

            <div className="form-group-full">
              <label>{lang === 'en' ? 'Resume Attachment (PDF/DOC/DOCX) *' : 'விவரக்குறிப்பு கோப்பு (PDF/DOC/DOCX) *'}</label>
              
              <div 
                className="drag-drop-zone"
                onClick={() => document.getElementById('candidate-resume-file').click()}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <div>
                  <strong>{lang === 'en' ? 'Drag and drop resume here' : 'விவரக்குறிப்பை இங்கே இழுத்து விடுங்கள்'}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Or click to browse files from your computer
                  </div>
                </div>
                
                {seekerResumeUrl && (
                  <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '13px', marginTop: '8px' }}>
                    <i className="fas fa-check-circle"></i> {lang === 'en' ? 'Resume Attached Successfully' : 'விவரக்குறிப்பு இணைக்கப்பட்டது!'}
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                id="candidate-resume-file" 
                accept=".pdf,.doc,.docx" 
                style={{ display: 'none' }} 
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  try {
                    showToast(lang === 'en' ? "Uploading resume..." : "பதிவேற்றப்படுகிறது...");
                    const url = await handleFileUpload(file);
                    setSeekerResumeUrl(url);
                    showToast(lang === 'en' ? "Resume uploaded! Saving profile will parse details." : "விவரக்குறிப்பு பதிவேற்றப்பட்டது!");
                  } catch (err) {
                    console.error(err);
                    showToast(lang === 'en' ? "Upload failed" : "பதிவேற்றம் தோல்வியடைந்தது", 'error');
                  }
                }}
              />
            </div>

          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> {lang === 'en' ? 'Save Profile' : 'சுயவிவரம் சேமி'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderEmployerProfileCreate = () => {
    return (
      <div className="job-dashboard-view text-left" style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
        <div className="job-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800 }}>{lang === 'en' ? 'Create Employer Profile' : 'நிறுவன சுயவிவரத்தை உருவாக்கு'}</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              Name, Email are auto-filled. Fill in your business details.
            </p>
          </div>
          <button className="dashboard-back-btn" onClick={() => setActiveView('list')}>
            <i className="fas fa-arrow-left"></i> {lang === 'en' ? 'Cancel' : 'ரத்து செய்'}
          </button>
        </div>

        <form onSubmit={handleEmployerProfileSave} className="recruitment-form">
          <div className="profile-form-grid">
            
            <div>
              <label>{lang === 'en' ? 'Recruiter Name' : 'பதிவாளர் பெயர்'}</label>
              <input type="text" value={user?.fullName || 'Employer User'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>

            <div>
              <label>{lang === 'en' ? 'Recruiter Email' : 'பதிவாளர் மின்னஞ்சல்'}</label>
              <input type="email" value={user?.email || 'employer@gmail.com'} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>

            <div>
              <label>{lang === 'en' ? 'Company Name *' : 'நிறுவனத்தின் பெயர் *'}</label>
              <input 
                type="text" 
                placeholder="e.g. TCS, Zoho, HDFC Bank" 
                value={empCompanyName} 
                onChange={(e) => setEmpCompanyName(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>{lang === 'en' ? 'Industry Type *' : 'தொழில்துறை வகை *'}</label>
              <input 
                type="text" 
                placeholder="e.g. IT & Software, Banking, Healthcare" 
                value={empIndustry} 
                onChange={(e) => setEmpIndustry(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>{lang === 'en' ? 'Company Website URL' : 'இணையதள முகவரி'}</label>
              <input 
                type="url" 
                placeholder="e.g. https://www.tcs.com" 
                value={empWebsite} 
                onChange={(e) => setEmpWebsite(e.target.value)} 
              />
            </div>

            <div>
              <label>{lang === 'en' ? 'Company Phone Number' : 'தொலைபேசி எண்'}</label>
              <input 
                type="text" 
                placeholder="e.g. +91 44 2824 1000" 
                value={empPhone} 
                onChange={(e) => setEmpPhone(e.target.value)} 
              />
            </div>

            <div className="form-group-full">
              <label>{lang === 'en' ? 'Company Logo (Optional)' : 'நிறுவனத்தின் லோகோ (விருப்பம்)'}</label>
              <div 
                className="drag-drop-zone"
                onClick={() => document.getElementById('company-logo-file').click()}
                style={{ padding: '20px' }}
              >
                <i className="fas fa-image"></i>
                <div>
                  <strong>{lang === 'en' ? 'Click to upload Company Logo image' : 'நிறுவன லோகோ படத்தை பதிவேற்ற கிளிக் செய்யவும்'}</strong>
                </div>
                {empCompanyLogo && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={empCompanyLogo} alt="Logo preview" style={{ height: '40px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                id="company-logo-file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  try {
                    showToast(lang === 'en' ? "Uploading image..." : "பதிவேற்றப்படுகிறது...");
                    const url = await handleFileUpload(file);
                    setEmpCompanyLogo(url);
                    showToast(lang === 'en' ? "Logo uploaded!" : "லோகோ பதிவேற்றப்பட்டது!");
                  } catch (err) {
                    console.error(err);
                    showToast(lang === 'en' ? "Logo upload failed" : "பதிவேற்றம் தோல்வியடைந்தது", 'error');
                  }
                }}
              />
            </div>

            <div className="form-group-full">
              <label>{lang === 'en' ? 'Company Office Address *' : 'அலுவலக முகவரி *'}</label>
              <input 
                type="text" 
                placeholder="e.g. Ramanujan IT Park, Chennai, Tamil Nadu" 
                value={empAddress} 
                onChange={(e) => setEmpAddress(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group-full">
              <label>{lang === 'en' ? 'Company About / Description *' : 'நிறுவனத்தின் விவரம் *'}</label>
              <textarea 
                rows="4" 
                placeholder="Briefly describe your company's business and hiring goals..." 
                value={empAbout} 
                onChange={(e) => setEmpAbout(e.target.value)} 
                required
              />
            </div>

          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> {lang === 'en' ? 'Create Profile' : 'சுயவிவரத்தை சேமி'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderEmployerDashboard = () => {
    if (!employerDashboardData) return <div style={{ padding: '80px 0', textAlign: 'center' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#2563eb' }}></i></div>;

    const { company, jobs: postedJobs, analytics } = employerDashboardData;

    return (
      <div className="job-dashboard-view text-left" style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px' }}>
        <div className="job-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800 }}>
              {company.companyName} - {lang === 'en' ? 'Recruitment Console' : 'வேலை வழங்குபவர் பிரிவு'}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              Manage your jobs listings and review candidates applications.
            </p>
          </div>
          <button className="dashboard-back-btn" onClick={() => setActiveView('list')}>
            <i className="fas fa-arrow-left"></i> {lang === 'en' ? 'Back to Jobs' : 'வேலைகளுக்குத் திரும்பு'}
          </button>
        </div>

        <div className="dashboard-split-layout">
          
          <div className="dashboard-sidebar-menu">
            <button className={`dashboard-menu-item ${employerSubView === 'dashboard' ? 'active' : ''}`} onClick={() => setEmployerSubView('dashboard')}>
              <i className="fas fa-chart-line"></i> {lang === 'en' ? 'Overview' : 'கட்டுப்பாட்டுப் பலகை'}
            </button>
            <button className={`dashboard-menu-item ${employerSubView === 'post-job' ? 'active' : ''}`} onClick={() => setEmployerSubView('post-job')}>
              <i className="fas fa-plus-circle"></i> {lang === 'en' ? 'Post a Job' : 'வேலை வாய்ப்பு பதிவிடு'}
            </button>
            <button className={`dashboard-menu-item ${employerSubView === 'manage-jobs' ? 'active' : ''}`} onClick={() => setEmployerSubView('manage-jobs')}>
              <i className="fas fa-briefcase"></i> {lang === 'en' ? 'Manage Jobs' : 'வேலைகளை நிர்வகி'}
            </button>
            <button className={`dashboard-menu-item ${employerSubView === 'manage-applicants' ? 'active' : ''}`} onClick={() => setEmployerSubView('manage-applicants')}>
              <i className="fas fa-users"></i> {lang === 'en' ? 'Manage Candidates' : 'வேட்பாளர்களை நிர்வகி'}
            </button>
            <button className={`dashboard-menu-item ${employerSubView === 'company-profile' ? 'active' : ''}`} onClick={() => setEmployerSubView('company-profile')}>
              <i className="fas fa-building"></i> {lang === 'en' ? 'Company Profile' : 'நிறுவன சுயவிவரம்'}
            </button>
          </div>

          <div className="dashboard-main-panel">
            
            {employerSubView === 'dashboard' && (
              <div>
                <div className="recruiter-stats-grid">
                  <div className="metric-card primary">
                    <span className="metric-value">{analytics.totalPostings}</span>
                    <span className="metric-label">{lang === 'en' ? 'Jobs Posted' : 'மொத்த வேலைகள்'}</span>
                  </div>
                  <div className="metric-card success">
                    <span className="metric-value">{analytics.totalApplications}</span>
                    <span className="metric-label">{lang === 'en' ? 'Applications' : 'விண்ணப்பங்கள்'}</span>
                  </div>
                  <div className="metric-card warning">
                    <span className="metric-value">
                      {postedJobs.filter(j => j.status === 'active' || j.status === 'Active').length}
                    </span>
                    <span className="metric-label">{lang === 'en' ? 'Active Listings' : 'செயலில் உள்ளவை'}</span>
                  </div>
                </div>

                <div className="dashboard-widget-card" style={{ marginTop: '24px' }}>
                  <h3 className="dashboard-widget-title">
                    <i className="fas fa-chart-bar" style={{ color: '#2563eb' }}></i>
                    {lang === 'en' ? 'Applications Distribution' : 'விண்ணப்பங்களின் பரவல்'}
                  </h3>
                  
                  {postedJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      {lang === 'en' ? 'No job vacancies posted yet.' : 'வேலை வாய்ப்புகள் எதுவும் இன்னும் பதிவிடப்படவில்லை.'}
                    </div>
                  ) : (
                    <div className="chart-bar-container">
                      {postedJobs.slice(0, 5).map(job => {
                        const totalApp = analytics.totalApplications || 1;
                        const pct = Math.min(100, Math.max(10, (job.applicantCount / totalApp) * 100));
                        return (
                          <div className="chart-bar-row" key={job.id}>
                            <div className="chart-bar-label">{job.title}</div>
                            <div className="chart-bar-wrapper">
                              <div className="chart-bar-fill" style={{ width: `${pct}%` }}></div>
                            </div>
                            <div className="chart-bar-value">{job.applicantCount}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {employerSubView === 'company-profile' && (
              <form onSubmit={handleEmployerProfileSave} className="recruitment-form" style={{ marginTop: 0 }}>
                <div className="profile-form-grid">
                  <div>
                    <label>{lang === 'en' ? 'Company Name *' : 'நிறுவனத்தின் பெயர் *'}</label>
                    <input type="text" value={empCompanyName} onChange={(e) => setEmpCompanyName(e.target.value)} required />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Industry Type *' : 'தொழில்துறை வகை *'}</label>
                    <input type="text" value={empIndustry} onChange={(e) => setEmpIndustry(e.target.value)} required />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Website URL' : 'இணையதள முகவரி'}</label>
                    <input type="url" value={empWebsite} onChange={(e) => setEmpWebsite(e.target.value)} />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Contact Phone' : 'தொலைபேசி எண்'}</label>
                    <input type="text" value={empPhone} onChange={(e) => setEmpPhone(e.target.value)} />
                  </div>
                  <div className="form-group-full">
                    <label>{lang === 'en' ? 'Company Logo URL' : 'நிறுவன லோகோ முகவரி'}</label>
                    <input type="text" value={empCompanyLogo} onChange={(e) => setEmpCompanyLogo(e.target.value)} />
                  </div>
                  <div className="form-group-full">
                    <label>{lang === 'en' ? 'Office Address *' : 'முகவரி *'}</label>
                    <input type="text" value={empAddress} onChange={(e) => setEmpAddress(e.target.value)} required />
                  </div>
                  <div className="form-group-full">
                    <label>{lang === 'en' ? 'Company Description *' : 'விவரம் *'}</label>
                    <textarea rows="4" value={empAbout} onChange={(e) => setEmpAbout(e.target.value)} required />
                  </div>
                </div>
                <div className="form-actions-row">
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-save"></i> {lang === 'en' ? 'Save Changes' : 'சுயவிவரம் சேமி'}
                  </button>
                </div>
              </form>
            )}

            {employerSubView === 'post-job' && (
              <form onSubmit={(e) => handlePostJob(e, false)} className="recruitment-form" style={{ marginTop: 0 }}>
                <div className="profile-form-grid">
                  <div>
                    <label>{lang === 'en' ? 'Job Title *' : 'வேலை தலைப்பு *'}</label>
                    <input type="text" placeholder="e.g. Senior Java Developer" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Job Category *' : 'பிரிவு *'}</label>
                    <select value={newCatId} onChange={(e) => setNewCatId(e.target.value)} required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Employment Type *' : 'பணி வகை *'}</label>
                    <select value={newTypeSelect} onChange={(e) => setNewTypeSelect(e.target.value)}>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Work From Home">Work From Home</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Work Mode *' : 'பணி முறை *'}</label>
                    <select value={newModeSelect} onChange={(e) => setNewModeSelect(e.target.value)}>
                      <option value="Work From Office">Work From Office</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Required Skills * (Comma separated)' : 'தேவைப்படும் திறன்கள் *'}</label>
                    <input type="text" placeholder="e.g. Java, Spring Boot, Hibernate" value={newSkills} onChange={(e) => setNewSkills(e.target.value)} required />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'District Location *' : 'பணி மாவட்டம் *'}</label>
                    <select value={newDistrictId} onChange={(e) => setNewDistrictId(e.target.value)} required>
                      <option value="">Select District</option>
                      {districts.map(d => <option key={d.districtId} value={d.districtId}>{lang === 'en' ? d.nameEn : d.nameTa}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Min Experience (Years)' : 'குறைந்தபட்ச அனுபவம்'}</label>
                    <input type="number" min="0" value={newExpMin} onChange={(e) => setNewExpMin(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Max Experience (Years)' : 'அதிகபட்ச அனுபவம்'}</label>
                    <input type="number" min="0" value={newExpMax} onChange={(e) => setNewExpMax(parseInt(e.target.value))} />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Min Salary Range (Lakhs/Year)' : 'குறைந்தபட்ச சம்பளம் (லட்சங்களில்/ஆண்டு)'}</label>
                    <input type="number" step="0.1" value={newSalMin} onChange={(e) => setNewSalMin(parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Max Salary Range (Lakhs/Year)' : 'அதிகபட்ச சம்பளம் (லட்சங்களில்/ஆண்டு)'}</label>
                    <input type="number" step="0.1" value={newSalMax} onChange={(e) => setNewSalMax(parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label>{lang === 'en' ? 'Vacancies Count' : 'காலியிடங்கள் எண்ணிக்கை'}</label>
                    <input type="number" min="1" value={newVacancies} onChange={(e) => setNewVacancies(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group-full">
                    <label>{lang === 'en' ? 'Job Description *' : 'பணி বিবরণ *'}</label>
                    <textarea rows="4" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} required />
                  </div>
                </div>
                <div className="form-actions-row">
                  <button type="button" className="btn-secondary" onClick={(e) => handlePostJob(e, true)}>
                    {lang === 'en' ? 'Save as Draft' : 'வரைவாக சேமி'}
                  </button>
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-paper-plane"></i> {lang === 'en' ? 'Publish Job' : 'வேலையை வெளியிடு'}
                  </button>
                </div>
              </form>
            )}

            {employerSubView === 'manage-jobs' && (
              <div className="dashboard-widget-card" style={{ marginTop: 0 }}>
                <h3 className="dashboard-widget-title">
                  <i className="fas fa-briefcase" style={{ color: '#2563eb' }}></i>
                  {lang === 'en' ? 'Manage Job Listings' : 'வேலை வாய்ப்புகளை நிர்வகி'}
                </h3>
                
                {postedJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    {lang === 'en' ? 'No job vacancies posted yet.' : 'வேலை வாய்ப்புகள் எதுவும் இன்னும் பதிவிடப்படவில்லை.'}
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>{lang === 'en' ? 'Job Title' : 'வேலை தலைப்பு'}</th>
                          <th>{lang === 'en' ? 'Views' : 'பார்வைகள்'}</th>
                          <th>{lang === 'en' ? 'Applicants' : 'விண்ணப்பங்கள்'}</th>
                          <th>{lang === 'en' ? 'Status' : 'நிலை'}</th>
                          <th style={{ textAlign: 'center' }}>{lang === 'en' ? 'Action' : 'செயல்'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postedJobs.map(job => (
                          <tr key={job.id}>
                            <td style={{ fontWeight: 700 }}>{job.title}</td>
                            <td>{job.viewsCount || 0}</td>
                            <td style={{ fontWeight: 700, color: '#2563eb' }}>{job.applicantCount || 0}</td>
                            <td>
                              <span className={`status-badge ${job.status === 'active' || job.status === 'Active' ? 'selected' : 'rejected'}`}>
                                {job.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11.5px' }} onClick={() => handleViewApplicants(job)}>
                                  <i className="fas fa-users"></i> {lang === 'en' ? 'Applicants' : 'வேட்பாளர்கள்'}
                                </button>
                                {job.status !== 'closed' && job.status !== 'Closed' && (
                                  <button 
                                    className="btn-primary" 
                                    style={{ padding: '4px 10px', fontSize: '11.5px', background: '#dc2626' }}
                                    onClick={() => confirmAction(
                                      lang === 'en' ? 'Close Job Posting?' : 'பணியை மூட விரும்புகிறீர்களா?',
                                      lang === 'en' ? 'Are you sure you want to close this job vacancy? It will no longer receive applications.' : 'வேலை வாய்ப்பை மூட விரும்புகிறீர்களா? இனி விண்ணப்பங்கள் வராது.',
                                      () => handleCloseJob(job.id)
                                    )}
                                  >
                                    {lang === 'en' ? 'Close' : 'மூடு'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {employerSubView === 'manage-applicants' && (
              <div className="dashboard-widget-card" style={{ marginTop: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="dashboard-widget-title" style={{ margin: 0 }}>
                    <i className="fas fa-users" style={{ color: '#2563eb' }}></i>
                    {selectedJobForApplicants 
                      ? `${lang === 'en' ? 'Candidates for' : 'விண்ணப்பதாரர்கள்:'} ${selectedJobForApplicants.title}` 
                      : (lang === 'en' ? 'Select a job to view candidates' : 'விண்ணப்பதாரர்களைக் காண வேலையைத் தேர்வு செய்யவும்')}
                  </h3>
                  
                  <select 
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', maxWidth: '240px' }}
                    value={selectedJobForApplicants?.id || ''}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value);
                      const selectedObj = postedJobs.find(j => j.id === selectedId);
                      if (selectedObj) handleViewApplicants(selectedObj);
                    }}
                  >
                    <option value="">{lang === 'en' ? 'Select Job' : 'வேலையைத் தெரிவு செய்க'}</option>
                    {postedJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>

                {!selectedJobForApplicants ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    {lang === 'en' ? 'Please select a job from the dropdown above to manage candidates.' : 'வேட்பாளர்களை நிர்வகிக்க மேலே உள்ள விருப்பத்திலிருந்து வேலையைத் தேர்ந்தெடுக்கவும்.'}
                  </div>
                ) : applicantsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    {lang === 'en' ? 'No applications received for this job vacancy yet.' : 'இந்த வேலைக்கு இன்னும் விண்ணப்பங்கள் எதுவும் வரவில்லை.'}
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>{lang === 'en' ? 'Candidate Name' : 'பெயர்'}</th>
                          <th>{lang === 'en' ? 'Email / Phone' : 'தொடர்பு'}</th>
                          <th>{lang === 'en' ? 'Resume' : 'சுயவிவரக்குறிப்பு'}</th>
                          <th>{lang === 'en' ? 'Applied Date' : 'தேதி'}</th>
                          <th>{lang === 'en' ? 'Status' : 'நிலை'}</th>
                          <th style={{ textAlign: 'center' }}>{lang === 'en' ? 'Update Status' : 'நிலை மாற்றுக'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicantsList.map(app => (
                          <tr key={app.applicationId}>
                            <td style={{ fontWeight: 700 }}>{app.applicantName}</td>
                            <td style={{ fontSize: '11.5px' }}>
                              <div>{app.email || 'N/A'}</div>
                              <div style={{ color: '#64748b' }}>{app.applicantPhone || 'N/A'}</div>
                            </td>
                            <td>
                              {app.resumeUrl ? (
                                <a 
                                  href={app.resumeUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                  <i className="fas fa-file-pdf" style={{ color: '#dc2626' }}></i> {lang === 'en' ? 'Resume' : 'கோப்பு'}
                                </a>
                              ) : 'No attachment'}
                            </td>
                            <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${app.applicationStatus.toLowerCase().replace(' ', '_')}`}>
                                {app.applicationStatus}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <select 
                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11.5px', background: 'white' }}
                                value={app.applicationStatus}
                                onChange={(e) => handleUpdateApplicantStatus(app.applicationId, e.target.value)}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    );
  };

  const fallbackCategories = [
    { id: 1, name: 'IT & Software', slug: 'it-software', icon: 'fa-laptop-code', activeJobCount: 2845, companiesHiringCount: 120 },
    { id: 2, name: 'Sales & Marketing', slug: 'sales-marketing', icon: 'fa-bullhorn', activeJobCount: 4126, companiesHiringCount: 180 },
    { id: 3, name: 'Education', slug: 'education', icon: 'fa-book-reader', activeJobCount: 3245, companiesHiringCount: 95 },
    { id: 4, name: 'Healthcare', slug: 'healthcare', icon: 'fa-heartbeat', activeJobCount: 2087, companiesHiringCount: 60 },
    { id: 5, name: 'Engineering', slug: 'engineering', icon: 'fa-cog', activeJobCount: 3789, companiesHiringCount: 140 },
    { id: 6, name: 'Government', slug: 'government', icon: 'fa-landmark', activeJobCount: 1678, companiesHiringCount: 20 },
    { id: 7, name: 'Banking & Finance', slug: 'banking-finance', icon: 'fa-money-check-alt', activeJobCount: 2345, companiesHiringCount: 75 },
    { id: 8, name: 'Others', slug: 'others', icon: 'fa-th-large', activeJobCount: 5678, companiesHiringCount: 300 }
  ];

  const fallbackJobs = [
    { id: 1, title: 'Java Full Stack Developer', companyName: 'Tata Consultancy Services', experienceMin: 3, experienceMax: 6, salaryMin: 5, salaryMax: 9, location: 'Coimbatore, Tamil Nadu', employmentType: 'Full Time', workMode: 'Work From Office', requiredSkills: 'Java, Spring Boot, React, SQL', featured: true },
    { id: 2, title: 'Software Engineer', companyName: 'Zoho Corporation', experienceMin: 1, experienceMax: 3, salaryMin: 4, salaryMax: 7, location: 'Chennai, Tamil Nadu', employmentType: 'Full Time', workMode: 'Work From Office', requiredSkills: 'JavaScript, Java, C++', featured: true },
    { id: 3, title: 'Relationship Manager', companyName: 'HDFC Bank', experienceMin: 2, experienceMax: 5, salaryMin: 4, salaryMax: 8, location: 'Salem, Tamil Nadu', employmentType: 'Full Time', workMode: 'Work From Office', requiredSkills: 'Sales, Customer Relationship', featured: true },
    { id: 4, title: 'Staff Nurse', companyName: 'Apollo Hospitals', experienceMin: 0, experienceMax: 2, salaryMin: 2, salaryMax: 4, location: 'Trichy, Tamil Nadu', employmentType: 'Full Time', workMode: 'Work From Office', requiredSkills: 'Nursing, Patient Care', featured: true }
  ];

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/jobs' } });
      return;
    }
    setApplicantName(user?.fullName || '');
    setApplicantPhone(user?.phone || '');
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handlePostJobHeroClick = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/jobs', jobRole: 'employer' } });
      return;
    }
    
    setLoading(true);
    try {
      const company = await fetchApi('/employer/profile');
      if (company && company.companyName) {
        await fetchEmployerDashboard();
        setEmployerSubView('post-job');
      } else {
        setActiveView('employer-profile-create');
      }
    } catch (err) {
      console.error(err);
      setActiveView('employer-profile-create');
    } finally {
      setLoading(false);
    }
  };

  if (activeView === 'seeker-dashboard') {
    return (
      <main className="container jobs-module-container" style={{ paddingTop: '20px' }}>
        <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setActiveView('list')}>{lang === 'en' ? 'Jobs Board' : 'வேலைவாய்ப்பு'}</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span>{lang === 'en' ? 'Candidate Dashboard' : 'வேட்பாளர் பலகை'}</span>
        </div>
        {renderSeekerDashboard()}
        {toastMessage && (
          <div className={`recruitment-toast ${toastType}`}>
            <i className={toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
            {toastMessage}
          </div>
        )}
        {dialogOpen && (
          <div className="recruitment-dialog-overlay">
            <div className="recruitment-dialog text-left">
              <h3 style={{ margin: '0 0 10px 0' }}>{dialogTitle}</h3>
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 20px 0' }}>{dialogMessage}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setDialogOpen(false)}>{lang === 'en' ? 'Cancel' : 'ரத்து செய்'}</button>
                <button className="btn-primary" style={{ background: '#dc2626' }} onClick={dialogConfirmAction}>{lang === 'en' ? 'Confirm' : 'உறுதி செய்'}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  if (activeView === 'seeker-profile-create') {
    return (
      <main className="container jobs-module-container" style={{ paddingTop: '20px' }}>
        <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setActiveView('list')}>{lang === 'en' ? 'Jobs Board' : 'வேலைவாய்ப்பு'}</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span>{lang === 'en' ? 'Candidate Profile' : 'வேட்பாளர் சுயவிவரம்'}</span>
        </div>
        {renderSeekerProfileCreate()}
        {toastMessage && (
          <div className={`recruitment-toast ${toastType}`}>
            <i className={toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
            {toastMessage}
          </div>
        )}
      </main>
    );
  }

  if (activeView === 'employer-dashboard') {
    return (
      <main className="container jobs-module-container" style={{ paddingTop: '20px' }}>
        <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setActiveView('list')}>{lang === 'en' ? 'Jobs Board' : 'வேலைவாய்ப்பு'}</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span>{lang === 'en' ? 'Employer Dashboard' : 'வேலை வழங்குபவர் பலகை'}</span>
        </div>
        {renderEmployerDashboard()}
        {toastMessage && (
          <div className={`recruitment-toast ${toastType}`}>
            <i className={toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
            {toastMessage}
          </div>
        )}
        {dialogOpen && (
          <div className="recruitment-dialog-overlay">
            <div className="recruitment-dialog text-left">
              <h3 style={{ margin: '0 0 10px 0' }}>{dialogTitle}</h3>
              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 20px 0' }}>{dialogMessage}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setDialogOpen(false)}>{lang === 'en' ? 'Cancel' : 'ரத்து செய்'}</button>
                <button className="btn-primary" style={{ background: '#dc2626' }} onClick={dialogConfirmAction}>{lang === 'en' ? 'Confirm' : 'உறுதி செய்'}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  if (activeView === 'employer-profile-create') {
    return (
      <main className="container jobs-module-container" style={{ paddingTop: '20px' }}>
        <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setActiveView('list')}>{lang === 'en' ? 'Jobs Board' : 'வேலைவாய்ப்பு'}</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span>{lang === 'en' ? 'Employer Profile' : 'நிறுவன சுயவிவரம்'}</span>
        </div>
        {renderEmployerProfileCreate()}
        {toastMessage && (
          <div className={`recruitment-toast ${toastType}`}>
            <i className={toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
            {toastMessage}
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="container jobs-module-container" style={{ paddingTop: '20px' }}>
      
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'Jobs Board' : 'வேலைவாய்ப்பு'}</span>
      </div>

      {/* HERO BANNER SECTION */}
      <section className="jobs-hero-banner">
        <div className="jobs-hero-left">
          <h1 className="jobs-hero-title">
            {lang === 'en' ? 'Find Jobs. Build Your Future.' : 'வேலை தேடுங்கள். எதிர்காலத்தை உருவாக்குங்கள்.'}
          </h1>
          <p className="jobs-hero-subtitle">
            {lang === 'en'
              ? 'Discover opportunities that match your skills and grow your career.'
              : 'உங்கள் திறமைக்கு ஏற்ற வேலை வாய்ப்புகளைக் கண்டறிந்து உங்கள் வாழ்க்கையை மேம்படுத்துங்கள்.'}
          </p>
          <div className="jobs-hero-btns">
            <button className="jobs-hero-btn-find" onClick={loadJobs}>
              {lang === 'en' ? 'Find Jobs' : 'வேலை தேடுக'}
            </button>
            <button className="jobs-hero-btn-post" onClick={handlePostJobHeroClick}>
              {lang === 'en' ? 'Post a Job' : 'வேலைவாய்ப்பு பதிவிட'}
            </button>
          </div>
        </div>

        {/* Float stat badges overlay */}
        <div className="jobs-stat-badge-float active-jobs">
          <i className="fas fa-briefcase"></i>
          <div>
            <div className="jobs-stat-number">50K+</div>
            <div className="jobs-stat-label">{lang === 'en' ? 'Active Jobs' : 'செயலில் உள்ள வேலைகள்'}</div>
          </div>
        </div>
        <div className="jobs-stat-badge-float employers">
          <i className="fas fa-building"></i>
          <div>
            <div className="jobs-stat-number">25K+</div>
            <div className="jobs-stat-label">{lang === 'en' ? 'Employers' : 'நிறுவனங்கள்'}</div>
          </div>
        </div>

        {/* Right side background candidate illustration */}
        <div className="jobs-banner-illustration" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400")' }}></div>
      </section>

      {/* SEARCH TABS & FILTER PANEL BAR */}
      <div className="jobs-search-tabs-bar">
        <button className={`jobs-search-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <i className="fas fa-search"></i> {lang === 'en' ? 'Search Jobs' : 'வேலை தேடல்'}
        </button>
        <button className={`jobs-search-tab-btn ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
          <i className="fas fa-user-tie"></i> {lang === 'en' ? 'Search Candidates' : 'வேட்பாளர் தேடல்'}
        </button>
      </div>

      <div className="jobs-filter-panel">
        <div className="jobs-filter-row">
          <div className="jobs-filter-input-wrap">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Job title, keywords or company...' : 'வேலை தலைப்பு, நிறுவனம்...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="jobs-filter-input-wrap">
            <i className="fas fa-laptop-code"></i>
            <select value={selectedCat} onChange={(e) => { setSelectedCat(e.target.value); setPage(0); }}>
              <option value="all">{lang === 'en' ? 'All Categories' : 'அனைத்து பிரிவுகள்'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="jobs-filter-input-wrap">
            <i className="fas fa-user-clock"></i>
            <select value={selectedExp} onChange={(e) => setSelectedExp(e.target.value)}>
              <option value="all">{lang === 'en' ? 'Experience (All)' : 'அனுபவம் (அனைத்தும்)'}</option>
              <option value="fresher">{lang === 'en' ? '0-1 Years' : '0-1 ஆண்டுகள்'}</option>
              <option value="mid">{lang === 'en' ? '1-3 Years' : '1-3 ஆண்டுகள்'}</option>
              <option value="senior">{lang === 'en' ? '3-6 Years' : '3-6 ஆண்டுகள்'}</option>
            </select>
          </div>

          <div className="jobs-filter-input-wrap">
            <i className="fas fa-rupee-sign"></i>
            <select value={selectedSalary} onChange={(e) => setSelectedSalary(e.target.value)}>
              <option value="all">{lang === 'en' ? 'Salary Range' : 'சம்பள வரம்பு'}</option>
              <option value="low">₹3 - ₹5 LPA</option>
              <option value="mid">₹5 - ₹8 LPA</option>
              <option value="high">₹8+ LPA</option>
            </select>
          </div>

          <button className="jobs-search-action-btn" onClick={loadJobs}>
            {lang === 'en' ? 'Search Jobs' : 'தேடுக'}
          </button>
        </div>

        {/* Popular Searches keyword tags */}
        <div className="jobs-popular-keywords-row">
          <span>{lang === 'en' ? 'Popular Searches:' : 'பிரபல தேடல்கள்:'}</span>
          <span className="jobs-keyword-badge" onClick={() => setSearchQuery('Sales')}>Sales Executive</span>
          <span className="jobs-keyword-badge" onClick={() => setSearchQuery('Driver')}>Delivery Driver</span>
          <span className="jobs-keyword-badge" onClick={() => setSearchQuery('Developer')}>Software Developer</span>
          <span className="jobs-keyword-badge" onClick={() => setSearchQuery('Teacher')}>Teacher</span>
          <span className="jobs-keyword-badge" onClick={() => setSearchQuery('Nurse')}>Nurse</span>
          <span className="jobs-keyword-badge" onClick={() => setSearchQuery('Accountant')}>Accountant</span>
        </div>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="jobs-main-layout">
        
        {/* Left Content column */}
        <div className="jobs-left-content">
          
          {/* Featured Jobs Row Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>
              {lang === 'en' ? 'Featured Jobs' : 'சிறப்பு வேலைவாய்ப்புகள்'}
            </h2>
            <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedSort('newest')}>
              {lang === 'en' ? 'View all' : 'அனைத்தையும் பார்க்க'} &rarr;
            </span>
          </div>

          <div className="featured-jobs-grid">
            {(jobs.length > 0 ? jobs : fallbackJobs).slice(0, 4).map(job => (
              <div className="featured-job-card" key={job.id} onClick={() => handleOpenDetails(job)}>
                <span className="featured-card-badge">Featured</span>
                <div>
                  <div className="featured-job-card-top">
                    <div className="featured-job-logo-box">
                      {job.company?.logo ? <img src={job.company.logo} alt="logo" /> : job.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className="featured-job-company">{job.companyName} <i className="fas fa-check-circle" style={{ color: '#2563eb', fontSize: '10px' }}></i></div>
                      <h3 className="featured-job-title">{job.title}</h3>
                    </div>
                  </div>
                  <div className="featured-job-loc">
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i> {job.location}
                  </div>
                </div>

                <div className="featured-job-meta-row">
                  <span className="featured-job-meta-pill">{job.experienceMin}-{job.experienceMax} Yrs</span>
                  <span className="featured-job-meta-pill">{job.salaryRange}</span>
                </div>

                <div className="featured-job-footer">
                  <span>2 days ago</span>
                  <i className="far fa-bookmark" style={{ cursor: 'pointer', fontSize: '13px' }}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Jobs Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>
              {lang === 'en' ? 'Latest Jobs' : 'சமீபத்திய வேலைகள்'}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['all', 'Full Time', 'Part Time', 'Work From Home', 'Internship'].map(t => (
                  <button 
                    key={t}
                    onClick={() => { setSelectedType(t); setPage(0); }}
                    style={{ border: 'none', background: selectedType === t ? '#eff6ff' : 'none', color: selectedType === t ? '#2563eb' : '#64748b', fontSize: '11px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}
                  >
                    {t === 'all' ? (lang === 'en' ? 'Latest' : 'அனைத்தும்') : t}
                  </button>
                ))}
              </div>

              <select 
                value={selectedSort} 
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 8px', fontSize: '11.5px', color: '#475569', fontWeight: '600' }}
              >
                <option value="newest">{lang === 'en' ? 'Sort by: Newest' : 'வரிசைப்படுத்து: சமீபத்தியது'}</option>
                <option value="salary_desc">{lang === 'en' ? 'Salary: High to Low' : 'சம்பளம்: அதிக முதல் குறைவு'}</option>
                <option value="most_applied">{lang === 'en' ? 'Most applied' : 'அதிகம் விண்ணப்பித்தவை'}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', color: '#2563eb' }}></i>
              <p style={{ marginTop: '10px' }}>{lang === 'en' ? 'Loading jobs list...' : 'பணிகள் ஏற்றப்படுகின்றன...'}</p>
            </div>
          ) : (
            <div className="latest-jobs-list">
              {(jobs.length > 0 ? jobs : fallbackJobs).map(job => (
                <div className="latest-job-row" key={job.id} onClick={() => handleOpenDetails(job)}>
                  <div className="latest-job-left">
                    <div className="featured-job-logo-box" style={{ width: '48px', height: '48px', fontSize: '20px' }}>
                      {job.company?.logo ? <img src={job.company.logo} alt="logo" /> : job.companyName.charAt(0)}
                    </div>
                    <div className="latest-job-details-block">
                      <div className="latest-job-title-row">
                        <h3 style={{ fontSize: '14.5px', fontWeight: '800', margin: 0 }}>{job.title}</h3>
                        <span className="latest-job-badge-pill">{job.employmentType}</span>
                      </div>
                      <div className="latest-job-pills-row">
                        <span><strong>{job.companyName}</strong> <i className="fas fa-check-circle" style={{ color: '#2563eb', fontSize: '9px' }}></i></span>
                        <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                        <span><i className="fas fa-briefcase"></i> {job.experienceMin}-{job.experienceMax} Yrs</span>
                        <span><i className="fas fa-rupee-sign"></i> {job.salaryRange}</span>
                      </div>
                    </div>
                  </div>

                  <div className="latest-job-right-meta">
                    <span>5 hours ago</span>
                    <i className="far fa-bookmark" style={{ cursor: 'pointer', fontSize: '13px' }}></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="jobs-right-sidebar">
          
          {/* Job Seeker Zone */}
          <div className="jobs-sidebar-card">
            <div className="jobs-sidebar-zone-details">
              <div className="jobs-zone-icon-box seeker">
                <i className="fas fa-user-circle"></i>
              </div>
              <div>
                <h4 className="jobs-sidebar-zone-title">{lang === 'en' ? 'Job Seeker Zone' : 'வேலை தேடுபவர் பகுதி'}</h4>
                <div className="jobs-sidebar-zone-desc">{lang === 'en' ? 'Create profile and get best job matches.' : 'சுயவிவரம் அமைத்து தகுதியான பணிகளைப் பெறுங்கள்.'}</div>
              </div>
            </div>
            <button className="jobs-sidebar-zone-btn" onClick={() => handleZoneClick('seeker')}>
              {lang === 'en' ? 'Job Seeker Zone' : 'சுயவிவரம்'}
            </button>
          </div>

          {/* Employer Zone */}
          <div className="jobs-sidebar-card">
            <div className="jobs-sidebar-zone-details">
              <div className="jobs-zone-icon-box employer">
                <i className="fas fa-building"></i>
              </div>
              <div>
                <h4 className="jobs-sidebar-zone-title">{lang === 'en' ? 'Employer Zone' : 'வேலை வழங்குபவர் பகுதி'}</h4>
                <div className="jobs-sidebar-zone-desc">{lang === 'en' ? 'Post jobs and manage candidates.' : 'வேலைகளைப் பதிவிட்டு விண்ணப்பதாரர்களை நிர்வகியுங்கள்.'}</div>
              </div>
            </div>
            <button className="jobs-sidebar-zone-btn" onClick={() => handleZoneClick('employer')}>
              {lang === 'en' ? 'Employer Zone' : 'உள்நுழைக'}
            </button>
          </div>

          {/* Jobs by Category hiring lists */}
          <div className="jobs-sidebar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>{lang === 'en' ? 'Jobs by Category' : 'பிரிவுகள் வாரியாக வேலைகள்'}</h4>
              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedCat('all')}>View all</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {categories.slice(0, 8).map(c => (
                <div className="jobs-category-list-item" key={c.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedCat(c.slug); setPage(0); }}>
                  <div className="jobs-category-list-item-left">
                    <i className={`fas ${c.icon}`}></i>
                    <span>{c.name}</span>
                  </div>
                  <span className="jobs-category-list-item-right">{c.activeJobCount} jobs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Get Job Alerts alert button widget */}
          <div className="jobs-sidebar-card" style={{ background: '#fffbeb', border: '1.5px solid #fef3c7', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <i className="far fa-bell" style={{ fontSize: '20px', color: '#d97706' }}></i>
              <div>
                <strong style={{ fontSize: '12.5px', color: '#1e293b' }}>{lang === 'en' ? 'Get Job Alerts' : 'வேலைவாய்ப்பு அறிவிப்புகள்'}</strong>
                <p style={{ fontSize: '10.5px', color: '#6b7280', margin: '4px 0 0 0' }}>Never miss an opportunity. Get alerts to mobile.</p>
              </div>
            </div>
            <button 
              onClick={() => alert(lang === 'en' ? 'Alerts successfully enabled!' : 'அறிவிப்புகள் வெற்றிகரமாக செயல்படுத்தப்பட்டது!')}
              style={{ width: '100%', padding: '8px', border: '1px solid #f59e0b', background: 'white', color: '#d97706', borderRadius: '8px', fontSize: '11.5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px' }}
            >
              Enable Alerts &gt;
            </button>
          </div>

          {/* Top Employers log banner list */}
          <div className="jobs-sidebar-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>{lang === 'en' ? 'Top Employers' : 'முன்னணி நிறுவனங்கள்'}</h4>
              <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>View all</span>
            </div>
            <div className="jobs-employers-logo-row">
              <span className="jobs-employer-logo-badge">TCS</span>
              <span className="jobs-employer-logo-badge">Infosys</span>
              <span className="jobs-employer-logo-badge">Wipro</span>
              <span className="jobs-employer-logo-badge">HCL</span>
              <span className="jobs-employer-logo-badge">Zoho</span>
            </div>
          </div>

        </div>
      </div>

      {/* JOB DETAILS MODAL VIEW */}
      {selectedJob && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Job vacancy Detail' : 'வேலை வாய்ப்பு விவரங்கள்'}</h3>
              <button className="modal-close" onClick={() => setSelectedJob(null)}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="featured-job-logo-box" style={{ width: '56px', height: '56px', fontSize: '24px' }}>
                  {selectedJob.company?.logo ? <img src={selectedJob.company.logo} alt="logo" /> : selectedJob.companyName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>{selectedJob.title}</h2>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{selectedJob.companyName} <i className="fas fa-check-circle" style={{ color: '#2563eb', fontSize: '11px' }}></i></span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '12.5px', color: '#475569' }}>
                <div><strong>Location:</strong> {selectedJob.location}</div>
                <div><strong>Salary range:</strong> {selectedJob.salaryRange}</div>
                <div><strong>Experience:</strong> {selectedJob.experienceMin}-{selectedJob.experienceMax} Years</div>
                <div><strong>Shift/Type:</strong> {selectedJob.employmentType}</div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', color: '#1e293b' }}>Job Description</h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>{selectedJob.description}</p>
              </div>

              {selectedJob.requiredSkills && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', color: '#1e293b' }}>Required Skills</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {selectedJob.requiredSkills.split(',').map(s => (
                      <span key={s} style={{ background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px' }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button 
                  onClick={() => handleApplyClick(selectedJob)}
                  style={{ flex: 2, background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Quick Apply
                </button>
                <button 
                  onClick={() => { setShareJob(selectedJob); setShowShareModal(true); }}
                  style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Share Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK APPLY MODAL */}
      {showApplyModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Apply for {selectedJob?.title}</h3>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Your Full Name *</label>
                <input 
                  type="text" 
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required 
                  placeholder="e.g. Priya"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Phone Number *</label>
                <input 
                  type="text" 
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  required 
                  placeholder="e.g. +91 9876543210"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Work Experience *</label>
                <select 
                  value={applicantExp}
                  onChange={(e) => setApplicantExp(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                >
                  <option value="fresher">Fresher (0-1 Yrs)</option>
                  <option value="1yr">1-3 Years</option>
                  <option value="2-3yr">3-6 Years</option>
                  <option value="4+yr">6+ Years</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Cover Note / Summary</label>
                <textarea 
                  value={applicantSummary}
                  onChange={(e) => setApplicantSummary(e.target.value)}
                  rows="3"
                  placeholder="Brief summary of skills..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                ></textarea>
              </div>

              <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE DIALOG */}
      {showShareModal && shareJob && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Share Job' : 'வேலையைப் பகிர்க'}</h3>
              <button className="modal-close" onClick={() => { setShowShareModal(false); setShareJob(null); }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '16px 0' }}>
              <button onClick={() => handleShareClick(shareJob, 'whatsapp')} style={{ padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-whatsapp"></i> WhatsApp
              </button>
              <button onClick={() => handleShareClick(shareJob, 'facebook')} style={{ padding: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
            </div>
            <button 
              onClick={() => handleShareClick(shareJob, 'copy')} 
              style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <i className="far fa-copy"></i> {lang === 'en' ? 'Copy Link' : 'நகலெடுக்க'}
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default Jobs;
