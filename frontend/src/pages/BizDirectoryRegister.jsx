import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';
import './BizDirectoryRegister.css';

const BizDirectoryRegister = () => {
  const { lang } = useContext(LanguageContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/directory/register' } });
    }
  }, [isAuthenticated, navigate]);

  // Steps definition
  const steps = [
    { num: 1, nameEn: 'Business Details', nameTa: 'வணிக விவரங்கள்', icon: 'fa-briefcase' },
    { num: 2, nameEn: 'Branding', nameTa: 'அடையாளம் (Branding)', icon: 'fa-palette' },
    { num: 3, nameEn: 'Contact Info', nameTa: 'தொடர்பு விவரங்கள்', icon: 'fa-address-card' },
    { num: 4, nameEn: 'Location & Address', nameTa: 'இருப்பிடம் & முகவரி', icon: 'fa-map-marker-alt' },
    { num: 5, nameEn: 'Hours & Services', nameTa: 'நேரம் & சேவைகள்', icon: 'fa-clock' },
    { num: 6, nameEn: 'KYC Verification', nameTa: 'KYC சரிபார்ப்பு', icon: 'fa-file-shield' },
    { num: 7, nameEn: 'Review & Terms', nameTa: 'மதிப்பாய்வு & விதிமுறைகள்', icon: 'fa-check-double' }
  ];

  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields State
  const [bizName, setBizName] = useState('');
  const [bizCat, setBizCat] = useState('Restaurant');
  const [bizDesc, setBizDesc] = useState('');

  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizWebsite, setBizWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [locality, setLocality] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [latitude, setLatitude] = useState(11.2189); // Default Namakkal Lat
  const [longitude, setLongitude] = useState(78.1672); // Default Namakkal Long
  const [mapsQuery, setMapsQuery] = useState('');

  const [workingHours, setWorkingHours] = useState('09:00 AM - 09:00 PM');
  const [servicesInput, setServicesInput] = useState('');
  const [servicesList, setServicesList] = useState([]);

  const [kycDocName, setKycDocName] = useState('');
  const [kycDocBase64, setKycDocBase64] = useState('');
  const [kycDragOver, setKycDragOver] = useState(false);

  const [agreedTerms, setAgreedTerms] = useState(false);

  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Categories list
  const categories = [
    'Restaurant',
    'Health & Medical',
    'Education',
    'Automotive',
    'Real Estate',
    'Beauty & Salon',
    'Electronics',
    'Shops'
  ];

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('king24x7_biz_draft');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        if (d.bizName) setBizName(d.bizName);
        if (d.bizCat) setBizCat(d.bizCat);
        if (d.bizDesc) setBizDesc(d.bizDesc);
        if (d.logoUrl) setLogoUrl(d.logoUrl);
        if (d.coverUrl) setCoverUrl(d.coverUrl);
        if (d.bizPhone) setBizPhone(d.bizPhone);
        if (d.bizEmail) setBizEmail(d.bizEmail);
        if (d.bizWebsite) setBizWebsite(d.bizWebsite);
        if (d.facebook) setFacebook(d.facebook);
        if (d.twitter) setTwitter(d.twitter);
        if (d.instagram) setInstagram(d.instagram);
        if (d.linkedin) setLinkedin(d.linkedin);
        if (d.locality) setLocality(d.locality);
        if (d.streetAddress) setStreetAddress(d.streetAddress);
        if (d.latitude) setLatitude(d.latitude);
        if (d.longitude) setLongitude(d.longitude);
        if (d.workingHours) setWorkingHours(d.workingHours);
        if (d.servicesList) setServicesList(d.servicesList);
        if (d.kycDocName) setKycDocName(d.kycDocName);
      } catch (e) {
        console.warn("Failed to parse draft", e);
      }
    }
  }, []);

  // Save draft to localStorage on change
  useEffect(() => {
    const draftData = {
      bizName, bizCat, bizDesc, logoUrl, coverUrl, bizPhone, bizEmail,
      bizWebsite, facebook, twitter, instagram, linkedin, locality,
      streetAddress, latitude, longitude, workingHours, servicesList, kycDocName
    };
    localStorage.setItem('king24x7_biz_draft', JSON.stringify(draftData));
  }, [
    bizName, bizCat, bizDesc, logoUrl, coverUrl, bizPhone, bizEmail,
    bizWebsite, facebook, twitter, instagram, linkedin, locality,
    streetAddress, latitude, longitude, workingHours, servicesList, kycDocName
  ]);

  // Image Upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetchApi('/directory/upload', {
        method: 'POST',
        body: formData
      });
      setLogoUrl(res.url);
    } catch (err) {
      // Fallback preview
      const reader = new FileReader();
      reader.onload = (event) => setLogoUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetchApi('/directory/upload', {
        method: 'POST',
        body: formData
      });
      setCoverUrl(res.url);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => setCoverUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop KYC document handler
  const handleDragOver = (e) => {
    e.preventDefault();
    setKycDragOver(true);
  };

  const handleDragLeave = () => {
    setKycDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setKycDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setKycDocName(file.name);
      // Simulate file reading
      const reader = new FileReader();
      reader.onload = (event) => setKycDocBase64(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKycDocName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => setKycDocBase64(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Maps pin drop simulator
  const handleSimulatePinDrop = (latOffset, lngOffset) => {
    setLatitude(prev => parseFloat((prev + latOffset).toFixed(5)));
    setLongitude(prev => parseFloat((prev + lngOffset).toFixed(5)));
  };

  // Adding/removing services
  const addService = () => {
    if (servicesInput.trim() && !servicesList.includes(servicesInput.trim())) {
      setServicesList(prev => [...prev, servicesInput.trim()]);
      setServicesInput('');
    }
  };

  const removeService = (service) => {
    setServicesList(prev => prev.filter(s => s !== service));
  };

  // Validation before step change
  const handleNextStep = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!bizName.trim()) {
        setValidationError(lang === 'en' ? 'Business Name is required' : 'வணிகப் பெயர் தேவை');
        return;
      }
      if (!bizDesc.trim()) {
        setValidationError(lang === 'en' ? 'Business Description is required' : 'வணிக விளக்கம் தேவை');
        return;
      }
    }
    if (currentStep === 3) {
      if (!bizPhone.trim()) {
        setValidationError(lang === 'en' ? 'Contact Phone number is required' : 'தொடர்பு தொலைபேசி எண் தேவை');
        return;
      }
    }
    if (currentStep === 4) {
      if (!locality.trim()) {
        setValidationError(lang === 'en' ? 'Locality/City is required' : 'நகரம்/இருப்பிடம் தேவை');
        return;
      }
      if (!streetAddress.trim()) {
        setValidationError(lang === 'en' ? 'Street Address is required' : 'தெரு முகவரி தேவை');
        return;
      }
    }
    if (currentStep === 6) {
      if (!kycDocName) {
        setValidationError(lang === 'en' ? 'Please upload KYC document for business verification' : 'வணிக சரிபார்ப்பிற்கு KYC ஆவணத்தைப் பதிவேற்றவும்');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevStep = () => {
    setValidationError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = async () => {
    if (!agreedTerms) {
      setValidationError(lang === 'en' ? 'You must agree to the Terms & Conditions' : 'விதிமுறைகள் மற்றும் நிபந்தனைகளை நீங்கள் ஏற்க வேண்டும்');
      return;
    }
    setSubmitting(true);
    setValidationError('');

    const payload = {
      businessName: bizName,
      category: bizCat,
      addressLocality: locality,
      addressStreet: streetAddress,
      workingHours,
      phoneNumber: bizPhone,
      description: bizDesc,
      email: bizEmail,
      website: bizWebsite,
      facebook,
      twitter,
      instagram,
      linkedin,
      latitude,
      longitude,
      logoUrl: logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
      coverUrl: coverUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
      kycDocumentUrl: kycDocName
    };

    try {
      await fetchApi('/directory', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      // Clear draft on successful submission
      localStorage.removeItem('king24x7_biz_draft');
      navigate('/directory/dashboard');
    } catch (err) {
      setValidationError(lang === 'en' ? 'Failed to submit registration. Please try again.' : 'பதிவைச் சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
      setSubmitting(false);
    }
  };

  return (
    <main className="container register-wizard-container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <Link to="/directory" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Business Directory' : 'வணிக அடைவு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'Register Business' : 'வணிகப் பதிவு'}</span>
      </div>

      <div className="wizard-card">
        {/* Header */}
        <div className="wizard-header">
          <h1 className="wizard-title">
            {lang === 'en' ? 'Register Your Local MSME Business' : 'உங்கள் உள்ளூர் MSME வணிகத்தை பதிவு செய்யவும்'}
          </h1>
          <p className="wizard-subtitle">
            {lang === 'en' ? 'Expand your digital presence. Get verified, tap into NFC cards, create promotional deals, and bid on customer RFQs.' 
                           : 'உங்கள் டிஜிட்டல் இருப்பை விரிவாக்குங்கள். சரிபார்ப்பு பெற்று, NFC அட்டைகளைப் பயன்படுத்தி, விளம்பரச் சலுகைகளை உருவாக்கி, வாடிக்கையாளர் RFQ-க்களில் பங்கேற்கவும்.'}
          </p>
        </div>

        {/* Stepper Indicators */}
        <div className="wizard-stepper">
          {steps.map(s => (
            <div key={s.num} className={`step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}>
              <div className="step-circle">
                {currentStep > s.num ? <i className="fas fa-check"></i> : <i className={`fas ${s.icon}`}></i>}
              </div>
              <span className="step-label">{lang === 'en' ? s.nameEn : s.nameTa}</span>
            </div>
          ))}
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="validation-alert">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body steps */}
        <div className="wizard-step-content">
          {/* STEP 1: Details */}
          {currentStep === 1 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-briefcase"></i> {lang === 'en' ? 'Core Business Details' : 'முக்கிய வணிக விவரங்கள்'}</h2>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Business Name *' : 'வணிகப் பெயர் *'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={lang === 'en' ? 'Enter official business name' : 'அதிகாரப்பூர்வ வணிகப் பெயரை உள்ளிடவும்'}
                  value={bizName} 
                  onChange={(e) => setBizName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Business Category *' : 'வணிக வகை *'}</label>
                <select className="form-control" value={bizCat} onChange={(e) => setBizCat(e.target.value)}>
                  {categories.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Business Description *' : 'வணிக விளக்கம் *'}</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder={lang === 'en' ? 'Describe your services, products, and specialties...' : 'உங்கள் சேவைகள், தயாரிப்புகள் மற்றும் சிறப்புகளைப் பற்றி விளக்கவும்...'}
                  value={bizDesc}
                  onChange={(e) => setBizDesc(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Branding */}
          {currentStep === 2 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-palette"></i> {lang === 'en' ? 'Branding & Assets' : 'அடையாளச் சின்னங்கள் மற்றும் சொத்துக்கள்'}</h2>
              
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Logo Graphic' : 'வணிகச் சின்னம் (Logo)'}</label>
                  <div className="upload-preview-container">
                    <img src={logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100"} alt="Logo Preview" className="logo-preview-img" />
                    <div className="upload-btn-wrapper">
                      <button className="wizard-upload-btn">{lang === 'en' ? 'Choose Image' : 'படத்தைத் தேர்ந்தெடு'}</button>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Cover Banner Image' : 'அட்டை பேனர் படம் (Cover Banner)'}</label>
                  <div className="upload-preview-container flex-col">
                    <img src={coverUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600"} alt="Cover Preview" className="cover-preview-img" />
                    <div className="upload-btn-wrapper" style={{ marginTop: '12px' }}>
                      <button className="wizard-upload-btn">{lang === 'en' ? 'Choose Banner' : 'பேனரைத் தேர்ந்தெடு'}</button>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Info */}
          {currentStep === 3 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-address-card"></i> {lang === 'en' ? 'Contact Details' : 'தொடர்பு விவரங்கள்'}</h2>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Phone Number *' : 'தொலைபேசி எண் *'}</label>
                  <input type="text" className="form-control" placeholder="e.g., 044-2451563" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}</label>
                  <input type="email" className="form-control" placeholder="e.g., info@company.com" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Website URL' : 'இணையதள முகவரி'}</label>
                <input type="url" className="form-control" placeholder="e.g., https://www.company.com" value={bizWebsite} onChange={(e) => setBizWebsite(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Social Network Mappings' : 'சமூக வலைப்பின்னல் இணைப்புகள்'}</label>
                <div className="social-inputs-grid">
                  <div className="social-input-group">
                    <span className="social-addon fb"><i className="fab fa-facebook-f"></i></span>
                    <input type="text" className="form-control" placeholder="Facebook username/URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                  </div>
                  <div className="social-input-group">
                    <span className="social-addon tw"><i className="fab fa-twitter"></i></span>
                    <input type="text" className="form-control" placeholder="Twitter/X handle" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                  </div>
                  <div className="social-input-group">
                    <span className="social-addon ig"><i className="fab fa-instagram"></i></span>
                    <input type="text" className="form-control" placeholder="Instagram handle" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                  </div>
                  <div className="social-input-group">
                    <span className="social-addon ln"><i className="fab fa-linkedin-in"></i></span>
                    <input type="text" className="form-control" placeholder="LinkedIn profile URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {currentStep === 4 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-map-marker-alt"></i> {lang === 'en' ? 'Business Location & Address' : 'வணிக இருப்பிடம் மற்றும் முகவரி'}</h2>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Locality/City *' : 'நகரம்/இருப்பிடம் *'}</label>
                  <input type="text" className="form-control" placeholder="e.g., Namakkal Town" value={locality} onChange={(e) => setLocality(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{lang === 'en' ? 'Street Address *' : 'தெரு முகவரி *'}</label>
                  <input type="text" className="form-control" placeholder="e.g., 24 Trichy Road" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                </div>
              </div>
              
              {/* Google Maps Pin Picker Simulator */}
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Pin Location on Google Maps' : 'கூகுள் மேப்பில் இருப்பிடத்தைக் குறிக்கவும்'}</label>
                <div className="mock-maps-container">
                  <div className="maps-header">
                    <i className="fas fa-map"></i> <span>Google Maps API (Simulated Interface)</span>
                    <div className="map-search">
                      <input type="text" placeholder="Search locality..." value={mapsQuery} onChange={(e)=>setMapsQuery(e.target.value)} />
                      <button className="map-search-btn" onClick={()=>setLocality(mapsQuery || locality)}><i className="fas fa-search"></i></button>
                    </div>
                  </div>
                  <div className="maps-body" style={{ background: '#e2e8f0', height: '220px', borderRadius: '0 0 12px 12px', position: 'relative', overflow: 'hidden' }}>
                    {/* Simulated grid lines */}
                    <div className="map-grid-line h"></div>
                    <div className="map-grid-line v"></div>
                    
                    {/* Marker Pin */}
                    <div className="map-marker-pin" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', color: '#ef4444', fontSize: '32px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                      <i className="fas fa-map-marker-alt"></i>
                      <div className="marker-dot" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', background: '#000', borderRadius: '50%' }}></div>
                    </div>

                    {/* Controls overlay */}
                    <div className="map-controls">
                      <button className="map-ctrl-btn" onClick={() => handleSimulatePinDrop(0.00012, 0.00008)}><i className="fas fa-plus"></i></button>
                      <button className="map-ctrl-btn" onClick={() => handleSimulatePinDrop(-0.00012, -0.00008)}><i className="fas fa-minus"></i></button>
                    </div>

                    {/* Coordinates box overlay */}
                    <div className="map-coordinates-box">
                      <span><strong>Lat:</strong> {latitude.toFixed(5)}</span>
                      <span><strong>Lng:</strong> {longitude.toFixed(5)}</span>
                    </div>

                    <span className="map-instruction-label">Drag or tap map to re-center pin position</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Hours & Services */}
          {currentStep === 5 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-clock"></i> {lang === 'en' ? 'Operating Hours & Services' : 'இயக்க நேரம் மற்றும் சேவைகள்'}</h2>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Working Hours' : 'வேலை நேரம்'}</label>
                <input type="text" className="form-control" placeholder="e.g., 09:00 AM - 09:00 PM, Sunday Closed" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Services Offered (Add Tags)' : 'வழங்கப்படும் சேவைகள் (குறிச்சொற்கள்)'}</label>
                <div className="tag-input-wrapper">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Free Wi-Fi, Card Payment, Delivery" 
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  />
                  <button className="tag-add-btn" onClick={addService}>{lang === 'en' ? 'Add' : 'சேர்'}</button>
                </div>
                <div className="tags-container" style={{ marginTop: '12px' }}>
                  {servicesList.map((tag, i) => (
                    <span key={i} className="service-tag">
                      {tag}
                      <button className="tag-delete-btn" onClick={() => removeService(tag)}>&times;</button>
                    </span>
                  ))}
                  {servicesList.length === 0 && (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {lang === 'en' ? 'No tags added yet. Type service name and click Add.' : 'குறிச்சொற்கள் எதுவும் சேர்க்கப்படவில்லை.'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: KYC Verification */}
          {currentStep === 6 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-file-shield"></i> {lang === 'en' ? 'KYC Business Verification Documents' : 'KYC வணிக சரிபார்ப்பு ஆவணங்கள்'}</h2>
              <p className="step-pane-desc">
                {lang === 'en' ? 'To ensure safety and build customer trust, please upload files supporting your business ownership (e.g., GST certificate, Incorporation License, or Utility bill).'
                               : 'வாடிக்கையாளர் நம்பிக்கையை உறுதிப்படுத்த, தயவுசெய்து உங்கள் வணிக உரிம ஆவணங்களை (GST சான்றிதழ், வணிக உரிமம் அல்லது மின் கட்டண ரசீது) பதிவேற்றவும்.'}
              </p>
              
              <div className="form-group">
                <label className="form-label">{lang === 'en' ? 'Upload Certificate / ID *' : 'ஆவணத்தைப் பதிவேற்றவும் *'}</label>
                <div 
                  className={`drag-drop-zone ${kycDragOver ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="fas fa-cloud-upload-alt upload-icon"></i>
                  {kycDocName ? (
                    <div className="file-info-container">
                      <span className="file-name-label">{kycDocName}</span>
                      <button className="file-clear-btn" onClick={() => {setKycDocName(''); setKycDocBase64('');}}>{lang === 'en' ? 'Remove' : 'நீக்கு'}</button>
                    </div>
                  ) : (
                    <>
                      <span className="drag-instruction">{lang === 'en' ? 'Drag and drop your file here, or' : 'உங்கள் கோப்பை இங்கே இழுத்து விடவும், அல்லது'}</span>
                      <div className="upload-btn-wrapper" style={{ marginTop: '8px' }}>
                        <button className="wizard-upload-btn">{lang === 'en' ? 'Browse Files' : 'கோப்புகளைத் தேர்ந்தெடு'}</button>
                        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileSelect} />
                      </div>
                      <span className="file-format-lbl">Supports PDF, PNG, JPG (Max 5MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Review & Terms */}
          {currentStep === 7 && (
            <div className="form-step-pane animate-fade-in">
              <h2 className="step-pane-title"><i className="fas fa-check-double"></i> {lang === 'en' ? 'Review & Submit' : 'மதிப்பாய்வு செய்து சமர்ப்பிக்கவும்'}</h2>
              
              <div className="review-summary-card">
                <div className="review-header">
                  <img src={logoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100"} alt="Logo" className="review-logo" />
                  <div className="review-header-details">
                    <h3>{bizName}</h3>
                    <span className="review-category-badge">{bizCat}</span>
                  </div>
                </div>
                <div className="review-body">
                  <div className="review-item"><strong>{lang === 'en' ? 'Description:' : 'விளக்கம்:'}</strong> <span>{bizDesc}</span></div>
                  <div className="review-item"><strong>{lang === 'en' ? 'Phone:' : 'தொலைபேசி:'}</strong> <span>{bizPhone}</span></div>
                  <div className="review-item"><strong>{lang === 'en' ? 'Address:' : 'முகவரி:'}</strong> <span>{streetAddress}, {locality}</span></div>
                  <div className="review-item"><strong>{lang === 'en' ? 'Working Hours:' : 'வேலை நேரம்:'}</strong> <span>{workingHours}</span></div>
                  <div className="review-item"><strong>{lang === 'en' ? 'KYC File:' : 'KYC ஆவணம்:'}</strong> <span>{kycDocName}</span></div>
                </div>
              </div>

              <div className="terms-checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="agreedTerms" 
                  checked={agreedTerms} 
                  onChange={(e) => setAgreedTerms(e.target.checked)} 
                />
                <label htmlFor="agreedTerms">
                  {lang === 'en' ? 'I certify that the information provided is accurate. I agree to KINGS 24x7 Terms of Service and Verification rules.' 
                                 : 'வழங்கப்பட்ட தகவல்கள் சரியானவை என்று சான்றளிக்கிறேன். KINGS 24x7 விதிமுறைகள் மற்றும் நிபந்தனைகளை நான் ஏற்கிறேன்.'}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="wizard-actions">
          {currentStep > 1 && (
            <button className="wizard-btn-secondary" onClick={handlePrevStep} disabled={submitting}>
              <i className="fas fa-chevron-left"></i> {lang === 'en' ? 'Back' : 'பின்செல்'}
            </button>
          )}
          
          <div style={{ flexGrow: 1 }}></div>

          {currentStep < steps.length ? (
            <button className="wizard-btn-primary" onClick={handleNextStep}>
              {lang === 'en' ? 'Next' : 'அடுத்து'} <i className="fas fa-chevron-right"></i>
            </button>
          ) : (
            <button className="wizard-btn-submit" onClick={handleSubmitRegistration} disabled={submitting}>
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> {lang === 'en' ? 'Submitting...' : 'சமர்ப்பிக்கிறது...'}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> {lang === 'en' ? 'Submit Registration' : 'பதிவைச் சமர்ப்பி'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default BizDirectoryRegister;
