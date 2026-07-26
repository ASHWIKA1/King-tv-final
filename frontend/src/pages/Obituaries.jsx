import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './Obituaries.css';

const Obituaries = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Data lists
  const [obits, setObits] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [frames, setFrames] = useState([]);
  
  // Selection / Filters
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  // Loading & Pagination
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [coords, setCoords] = useState(null);
  
  // Modals
  const [selectedObit, setSelectedObit] = useState(null);
  const [obitDetails, setObitDetails] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareObit, setShareObit] = useState(null);

  // Form states
  const [deceasedName, setDeceasedName] = useState('');
  const [photo, setPhoto] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfPassing, setDateOfPassing] = useState('');
  const [religion, setReligion] = useState('');
  const [nativePlace, setNativePlace] = useState('');
  const [formDistrict, setFormDistrict] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [funeralDatetime, setFuneralDatetime] = useState('');
  const [funeralVenue, setFuneralVenue] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [familyContactName, setFamilyContactName] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [posterRelationship, setPosterRelationship] = useState('');
  const [biography, setBiography] = useState('');
  const [formFrame, setFormFrame] = useState('');
  const [galleryUrls, setGalleryUrls] = useState([]);

  // Upload states
  const [uploadingDeceased, setUploadingDeceased] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isCelebrity, setIsCelebrity] = useState(false);

  // Submitter Verification & Reporting states
  const [submitterContact, setSubmitterContact] = useState('');
  const [proofDocument, setProofDocument] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('False information');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Background body scroll lock effect when modal is active
  useEffect(() => {
    if (showCreateModal || selectedObit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCreateModal, selectedObit]);

  // Guestbook inputs
  const [visitorName, setVisitorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyVisitorName, setReplyVisitorName] = useState('');

  // Show contact map flag
  const [revealedContacts, setRevealedContacts] = useState({});

  // Session ID for tributes
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('obit_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('obit_session_id', id);
    }
    return id;
  });

  // Fetch initial setup lists
  useEffect(() => {
    // Fetch districts
    fetchApi('/districts')
      .then(data => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch(err => console.warn("Failed to load districts", err));

    // Fetch frame templates
    fetchApi('/obituaries/frames')
      .then(data => {
        if (Array.isArray(data)) setFrames(data);
      })
      .catch(err => console.warn("Failed to load frames", err));
  }, []);

  // Geolocation watch
  useEffect(() => {
    if (selectedCat === 'nearby') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords(position.coords);
          },
          (error) => {
            console.warn("Geolocation permission error", error);
            setSelectedCat('all');
            alert(lang === 'en' ? "Please enable location services to use Nearby filter." : "அருகிலுள்ள இரங்கல்களைக் காண இருப்பிடச் சேவைகளை அனுமதிக்கவும்.");
          }
        );
      } else {
        setSelectedCat('all');
      }
    }
  }, [selectedCat]);

  // Load Obituaries
  const loadObituaries = () => {
    setLoading(true);
    let endpoint = '/obituaries';
    let params = [];

    if (searchQuery.trim() !== '') {
      endpoint = '/obituaries/search';
      params.push(`query=${encodeURIComponent(searchQuery)}`);
    } else if (selectedCat === 'nearby' && coords) {
      endpoint = '/obituaries/nearby';
      params.push(`lat=${coords.latitude}`);
      params.push(`lon=${coords.longitude}`);
      params.push(`radius=100.0`);
    } else {
      endpoint = '/obituaries/filter';
      if (selectedDistrict !== 'all') {
        params.push(`districtId=${selectedDistrict}`);
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
        setObits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to load obituaries, using fallbacks", err);
        setObits(fallbackObits);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadObituaries();
  }, [selectedCat, selectedDistrict, selectedSort, searchQuery, page, coords]);

  // Open details
  const handleOpenDetails = (obit) => {
    setSelectedObit(obit);
    setVisitorName('');
    setCommentText('');
    setReplyingToCommentId(null);
    setReplyText('');
    setReplyVisitorName('');

    fetchApi(`/obituaries/${obit.id}`)
      .then(data => {
        setObitDetails(data);
        // Log view
        fetchApi(`/obituaries/${obit.id}/view`, { method: 'POST' }).catch(() => {});
      })
      .catch(() => {
        setObitDetails(obit);
      });
  };

  const handleCloseDetails = () => {
    setSelectedObit(null);
    setObitDetails(null);
    loadObituaries();
  };

  // Pay Tribute / Light Candle / Offer Flowers
  const handlePayTribute = (obitId, type) => {
    fetchApi(`/obituaries/${obitId}/tribute?sessionId=${sessionId}&type=${type}`, {
      method: 'POST'
    })
      .then(() => {
        if (selectedObit && selectedObit.id === obitId) {
          fetchApi(`/obituaries/${obitId}`).then(setObitDetails);
        } else {
          loadObituaries();
        }
      })
      .catch(err => {
        console.warn("Tribute submit error", err);
        alert(lang === 'en' ? "You have already paid tribute to this memorial." : "இந்த நினைவேந்தலுக்கு நீங்கள் ஏற்கனவே அஞ்சலி செலுத்தியுள்ளீர்கள்.");
      });
  };

  // Submit condolence comment
  const handleAddCommentSubmit = (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !commentText.trim()) return;

    fetchApi(`/obituaries/${selectedObit.id}/guestbook?visitorName=${encodeURIComponent(visitorName)}&text=${encodeURIComponent(commentText)}`, {
      method: 'POST'
    })
      .then(() => {
        setCommentText('');
        fetchApi(`/obituaries/${selectedObit.id}`).then(setObitDetails);
      })
      .catch(err => console.error("Condolence post failed", err));
  };

  // Nested comment reply
  const handleAddReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!replyVisitorName.trim() || !replyText.trim()) return;

    fetchApi(`/obituaries/${selectedObit.id}/guestbook?parentId=${parentId}&visitorName=${encodeURIComponent(replyVisitorName)}&text=${encodeURIComponent(replyText)}`, {
      method: 'POST'
    })
      .then(() => {
        setReplyText('');
        setReplyingToCommentId(null);
        fetchApi(`/obituaries/${selectedObit.id}`).then(setObitDetails);
      })
      .catch(err => console.error("Reply condolence failed", err));
  };

  // File Upload Helper
  const uploadImage = async (e, setUploadState, setUrlState) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadState(true);
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/obituaries/upload`;
    const session = JSON.parse(localStorage.getItem('king24x7_session') || 'null');
    const headers = {};
    if (session && session.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    }

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setUrlState(data.url);
    } catch (err) {
      console.error("Image upload error", err);
      alert(lang === 'en' ? "Image upload failed. Please try again." : "படம் பதிவேற்றம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setUploadState(false);
    }
  };

  // Save new Obituary Notice
  const handleCreateObituarySubmit = (e) => {
    e.preventDefault();
    if (!deceasedName || !dateOfPassing || !nativePlace || !posterRelationship || !submitterContact) {
      alert(lang === 'en' ? "Please fill all required fields." : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்.");
      return;
    }
    if (!confirmationChecked) {
      alert(lang === 'en' ? "You must confirm the accuracy declaration checkbox before submitting." : "சமர்ப்பிக்கும் முன் தகவலின் துல்லியம் பற்றிய அறிவிப்புப் பெட்டியை உறுதிப்படுத்த வேண்டும்.");
      return;
    }

    const payload = {
      deceasedName,
      photo,
      age: age || 0,
      gender,
      dateOfBirth: dateOfBirth || null,
      dateOfPassing: dateOfPassing,
      location: nativePlace,
      religion,
      nativePlace,
      districtId: formDistrict || null,
      pincode: formPincode,
      funeralDatetime: funeralDatetime || null,
      funeralVenue,
      mapLink,
      familyContactName,
      familyPhone,
      posterRelationship,
      submitterContact,
      proofDocument,
      biography: biography || "In loving memory.",
      frameTemplateId: formFrame || null,
      galleryUrls,
      isCelebrity
    };

    fetchApi('/obituaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        alert(lang === 'en' 
          ? "Your submission is under review and will be published once verified." 
          : "உங்கள் பதிவு பரிசீலனையில் உள்ளது, சரிபார்க்கப்பட்டவுடன் வெளியிடப்படும்.");
        setShowCreateModal(false);
        // Reset states
        setDeceasedName('');
        setPhoto('');
        setAge('');
        setGender('male');
        setDateOfBirth('');
        setDateOfPassing('');
        setReligion('');
        setNativePlace('');
        setFormDistrict('');
        setFormPincode('');
        setFuneralDatetime('');
        setFuneralVenue('');
        setMapLink('');
        setFamilyContactName('');
        setFamilyPhone('');
        setPosterRelationship('');
        setSubmitterContact('');
        setProofDocument('');
        setConfirmationChecked(false);
        setBiography('');
        setFormFrame('');
        setGalleryUrls([]);
        setIsCelebrity(false);
        loadObituaries();
      })
      .catch(err => {
        console.error("Failed to create obituary", err);
        alert(lang === 'en' ? "Failed to save obituary. Please try again." : "இரங்கல் செய்தியைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
      });
  };

  // Submit Report
  const handleReportSubmit = (e) => {
    e.preventDefault();
    setSubmittingReport(true);
    const payload = {
      reporterName: reporterContact || 'Anonymous',
      reason: reportReason,
      details: reportDetails,
      contact: reporterContact
    };
    fetchApi(`/obituaries/${selectedObit?.id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        alert(lang === 'en' ? "Thank you — we will review this and take appropriate action." : "நன்றி — நாங்கள் இதை பரிசீலித்து உரிய நடவடிக்கை எடுப்போம்.");
        setShowReportModal(false);
        setReportDetails('');
        setReporterContact('');
        setReportReason('False information');
      })
      .catch(err => {
        console.error("Failed to report obituary", err);
        alert(lang === 'en' ? "Failed to submit report. Please try again." : "புகார் சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
      })
      .finally(() => {
        setSubmittingReport(false);
      });
  };

  // Show Deceased Contact (Logging Access)
  const handleRevealContact = (obitId) => {
    setRevealedContacts(prev => ({ ...prev, [obitId]: true }));
    // Fire analytical logging view request
    fetchApi(`/obituaries/${obitId}/share-card`, { method: 'POST' }).catch(() => {});
  };

  // Comment Replies Node Renderer
  const renderCommentNode = (comment) => {
    const isReplying = replyingToCommentId === comment.id;

    return (
      <div className="comment-node" key={comment.id} style={{ marginLeft: comment.parent ? '16px' : '0', borderLeft: '1px solid #e2e8f0', paddingLeft: '12px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <strong style={{ fontSize: '12px', color: '#1e293b' }}>{comment.visitorName}</strong>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#475569' }}>{comment.message}</p>
        <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', marginBottom: '6px' }}>
          <button
            onClick={() => setReplyingToCommentId(isReplying ? null : comment.id)}
            style={{ border: 'none', background: 'none', color: '#7c3aed', cursor: 'pointer', padding: 0, fontWeight: '600' }}
          >
            {lang === 'en' ? 'Reply' : 'பதில்'}
          </button>
        </div>

        {isReplying && (
          <form onSubmit={(e) => handleAddReplySubmit(e, comment.id)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '6px 0', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
              value={replyVisitorName}
              onChange={(e) => setReplyVisitorName(e.target.value)}
              style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
            <textarea
              placeholder={lang === 'en' ? 'Write a reply...' : 'பதில் எழுதவும்...'}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="2"
              style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            ></textarea>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="submit" style={{ fontSize: '11px', padding: '4px 8px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {lang === 'en' ? 'Reply' : 'பதில் அளி'}
              </button>
              <button type="button" onClick={() => setReplyingToCommentId(null)} style={{ fontSize: '11px', padding: '4px 8px', background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {lang === 'en' ? 'Cancel' : 'ரத்து'}
              </button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.map(reply => renderCommentNode(reply))}
      </div>
    );
  };

  const handleShareClick = (obit, platform) => {
    const pageUrl = window.location.origin + `/obituaries?id=${obit.id}`;
    const shareText = encodeURIComponent(`${lang === 'en' ? 'Tribute and Memorial page' : 'நினைவு அஞ்சலி பக்கம்'} - ${obit.deceasedName}`);
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${shareText}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl);
      alert(lang === 'en' ? 'Link copied!' : 'இணைப்பு நகலெடுக்கப்பட்டது!');
    }
    setShowShareModal(false);
  };

  const fallbackObits = [
    { id: 1, deceasedName: 'பொன்னம்மாள்', age: 78, location: 'திருவாரூர், தமிழ்நாடு', demiseDate: '2025-07-15', dateOfPassing: '2025-07-15', dateOfBirth: '1946-01-10', shortDescription: 'அன்புத்தாய் பொன்னம்மாள் இயற்கை எய்தினார். இவரது ஆத்மா சாந்தியடைய பிரார்த்திக்கிறோம்.', tributeCount: 128, guestbookCount: 24, isCelebrity: true },
    { id: 2, deceasedName: 'சுப்பிரமணியன்', age: 85, location: 'சேலம், தமிழ்நாடு', demiseDate: '2025-07-14', dateOfPassing: '2025-07-14', dateOfBirth: '1940-03-02', shortDescription: 'மதிப்பிற்குரிய சுப்பிரமணியன் இயற்கை எய்தினார். இவரது இறுதிச் சடங்குகள் சேலத்தில் நடைபெறும்.', tributeCount: 256, guestbookCount: 42, isCelebrity: false },
    { id: 3, deceasedName: 'லட்சுமி அம்மாள்', age: 72, location: 'கோவை, தமிழ்நாடு', demiseDate: '2025-07-13', dateOfPassing: '2025-07-13', dateOfBirth: '1953-06-12', shortDescription: 'கோவை லட்சுமி அம்மாள் இயற்கை எய்தினார்.', tributeCount: 198, guestbookCount: 31, isCelebrity: true },
    { id: 4, deceasedName: 'முருகேசன்', age: 80, location: 'மதுரை, தமிழ்நாடு', demiseDate: '2025-07-12', dateOfPassing: '2025-07-12', dateOfBirth: '1944-09-05', shortDescription: 'மதுரை முருகேசன் இயற்கை எய்தினார்.', tributeCount: 143, guestbookCount: 18, isCelebrity: false }
  ];

  const renderObitCard = (obit) => {
    const frameClass = obit.frameTemplate?.category || 'golden';
    return (
      <div className="memorial-card" key={obit.id} style={{ width: '100%' }}>
        <div className="memorial-card-header">
          <span>2 {lang === 'en' ? 'hours ago' : 'மணி நேரத்திற்கு முன்'}</span>
          <i className="far fa-bookmark memorial-card-flag"></i>
        </div>

        <div className="memorial-photo-frame-container" onClick={() => handleOpenDetails(obit)}>
          <div className="memorial-portrait-circle">
            {obit.photo ? (
              <img src={obit.photo} alt={obit.deceasedName} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-user" style={{ fontSize: '42px', color: '#cbd5e1' }}></i>
              </div>
            )}
            <div className={`frame-overlay frame-overlay-${frameClass}`}></div>
          </div>
        </div>

        <div className="memorial-card-body">
          <div>
            <h3 className="memorial-deceased-name">{obit.deceasedName}</h3>
            <span className="memorial-deceased-age">{lang === 'en' ? 'Age ' : 'வயது '} {obit.age}</span>
            <div className="memorial-deceased-loc">{obit.location || obit.nativePlace}</div>
            <div className="memorial-deceased-dates">
              {obit.dateOfBirth ? new Date(obit.dateOfBirth).toLocaleDateString() : 'N/A'} - {obit.dateOfPassing ? new Date(obit.dateOfPassing).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div className="memorial-card-metrics">
            <span><i className="fas fa-fire" style={{ color: '#d97706' }}></i> {obit.tributeCount || 0} {lang === 'en' ? 'Tributes' : 'இரங்கல்கள்'}</span>
            <span><i className="far fa-comment"></i> {obit.guestbookCount || 0} {lang === 'en' ? 'Condolences' : 'செய்திகள்'}</span>
            <button className="memorial-details-btn" onClick={() => handleOpenDetails(obit)}>
              {lang === 'en' ? 'Details' : 'விவரங்கள்'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <main className="container obits-module-container" style={{ paddingTop: '20px' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'Obituaries' : 'இரங்கல்கள்'}</span>
      </div>

      {/* HERO BANNER SECTION */}
      <section className="obits-hero-banner">
        <div className="obits-hero-content">
          <div className="obits-hero-left">
            <div className="obits-hero-title-row">
              <i className="fas fa-fire"></i>
              <h1>{lang === 'en' ? 'Obituaries' : 'இரங்கல்கள்'}</h1>
            </div>
            <p>
              {lang === 'en' 
                ? 'A place to remember beloved lives. Their memories will live in our hearts forever.'
                : 'அன்பு உயிர்களை நினைவுகூரும் இடம் இது. அவர்களின் நினைவுகள் என்றும் நம் இதயங்களில் வாழ்க.'}
            </p>

            {/* Inline search bar */}
            <div className="obits-search-inline-bar">
              <div className="obits-search-field">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder={lang === 'en' ? 'Search deceased name...' : 'மறைந்தவர் பெயர்...'} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="obits-search-select"
                value={selectedDistrict}
                onChange={(e) => { setSelectedDistrict(e.target.value); setPage(0); }}
              >
                <option value="all">{lang === 'en' ? 'All Districts' : 'அனைத்து மாவட்டங்கள்'}</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{lang === 'en' ? d.nameEn : d.nameTa}</option>
                ))}
              </select>
              <button className="obits-search-btn" onClick={loadObituaries}>
                {lang === 'en' ? 'Search' : 'தேடு'}
              </button>
            </div>
          </div>

          </div>
      </section>

      {/* QUICK CATEGORIES SLIDER ROW */}
      <div className="obits-slider-row">
        <div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '750', color: '#4b5563' }}>
            {lang === 'en' ? 'Popular Searches' : 'பிரபல தேடல்கள்'}
          </h4>
          <div className="obits-slider-container">
            <button className={`obits-slide-btn ${selectedCat === 'all' ? 'active' : ''}`} onClick={() => { setSelectedCat('all'); setSearchQuery(''); }}>
              <i className="far fa-calendar-check"></i> {lang === 'en' ? 'Today' : 'இன்று'}
            </button>
            <button className={`obits-slide-btn ${selectedCat === 'week' ? 'active' : ''}`} onClick={() => { setSelectedCat('week'); setSelectedSort('newest'); }}>
              <i className="far fa-clock"></i> {lang === 'en' ? 'This Week' : 'இந்த வாரம்'}
            </button>
            <button className={`obits-slide-btn ${selectedCat === 'month' ? 'active' : ''}`} onClick={() => { setSelectedCat('month'); setSelectedSort('newest'); }}>
              <i className="far fa-calendar"></i> {lang === 'en' ? 'This Month' : 'இந்த மாதம்'}
            </button>
            <button className={`obits-slide-btn ${selectedCat === 'recent' ? 'active' : ''}`} onClick={() => { setSelectedCat('recent'); setSelectedSort('newest'); }}>
              <i className="fas fa-fire-alt"></i> {lang === 'en' ? 'Recently Added' : 'சமீபத்தியவை'}
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="obits-main-layout">
        
        {/* Left Column: Grid list */}
        <div className="obits-left-content">
          <div className="obits-disclaimer-banner" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', color: '#991b1b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '18px', color: '#ef4444' }}></i>
            <div>
              {lang === 'en' 
                ? "User-submitted obituaries are reviewed before publication. If you believe an obituary is inaccurate or has been published in error, please report it immediately. We will investigate and take appropriate action."
                : "பயனர்களால் சமர்ப்பிக்கப்பட்ட இரங்கல்கள் வெளியிடுவதற்கு முன்பு சரிபார்க்கப்படுகின்றன. ஏதேனும் இரங்கல் செய்தி தவறானது அல்லது பிழையாக வெளியிடப்பட்டுள்ளது என நீங்கள் கருதினால், உடனடியாக புகாரளிக்கவும். நாங்கள் விசாரித்து உரிய நடவடிக்கை எடுப்போம்."}
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '850', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{lang === 'en' ? 'Recent Memorials' : 'சமீபத்திய இரங்கல்கள்'}</span>
            <button onClick={() => {
              if (!isAuthenticated) {
                alert(lang === 'en' ? "Please login or sign up to post a memorial." : "இரங்கல் அஞ்சலி பதிவு செய்ய தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.");
                navigate('/login', { state: { from: '/obituaries' } });
              } else {
                setShowCreateModal(true);
              }
            }} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}>
              + {lang === 'en' ? 'Post Memorial' : 'நினைவு பதிவு செய்ய'}
            </button>
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', color: '#7c3aed' }}></i>
              <p style={{ marginTop: '10px' }}>{lang === 'en' ? 'Loading obituaries...' : 'பதிவுகள் ஏற்றப்படுகின்றன...'}</p>
            </div>
          ) : obits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px', border: '1px dashed #ccc' }}>
              <i className="far fa-folder-open" style={{ fontSize: '48px', color: '#aaa', marginBottom: '10px' }}></i>
              <p>{lang === 'en' ? 'No obituaries found.' : 'பதிவுகள் எதுவும் காணப்படவில்லை.'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Celebrity Column */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#7c3aed', marginBottom: '16px', borderBottom: '2px solid #7c3aed', paddingBottom: '6px' }}>
                  {lang === 'en' ? 'Celebrity Memorials' : 'பிரபலங்களின் இரங்கல்கள்'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {obits.filter(o => o.isCelebrity).length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>{lang === 'en' ? 'No celebrity memorials.' : 'பிரபலங்கள் இரங்கல் பதிவு இல்லை.'}</p>
                  ) : (
                    obits.filter(o => o.isCelebrity).map(obit => renderObitCard(obit))
                  )}
                </div>
              </div>

              {/* Normal People Column */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#4b5563', marginBottom: '16px', borderBottom: '2px solid #cbd5e1', paddingBottom: '6px' }}>
                  {lang === 'en' ? 'General Memorials' : 'பொது இரங்கல்கள்'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {obits.filter(o => !o.isCelebrity).length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>{lang === 'en' ? 'No general memorials.' : 'பொது இரங்கல் பதிவு இல்லை.'}</p>
                  ) : (
                    obits.filter(o => !o.isCelebrity).map(obit => renderObitCard(obit))
                  )}
                </div>
              </div>
            </div>
          )}

          {obits.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                onClick={() => setPage(page + 1)}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '30px', padding: '10px 24px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <i className="fas fa-sync-alt"></i> {lang === 'en' ? 'View More' : 'மேலும் பார்க்க'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="obituaries-right-sidebar">
          
          {/* Most Tributes Column */}
          <div className="obits-sidebar-block">
            <h3 className="obits-sidebar-title">
              {lang === 'en' ? 'Most Mourned Deceased' : 'மிகவும் இரங்கல் செய்யப்பட்டவர்கள்'}
            </h3>
            <div className="obits-sidebar-item">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" className="obits-sidebar-avatar" alt="thumb 1" />
              <div>
                <strong style={{ fontSize: '12.5px' }}>சப்பம்மாள்</strong>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>356 {lang === 'en' ? 'Tributes' : 'இரங்கல்கள்'}</div>
              </div>
            </div>
            <div className="obits-sidebar-item">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="obits-sidebar-avatar" alt="thumb 2" />
              <div>
                <strong style={{ fontSize: '12.5px' }}>ராமசாமி ஐயா</strong>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>298 {lang === 'en' ? 'Tributes' : 'இரங்கல்கள்'}</div>
              </div>
            </div>
            <div className="obits-sidebar-item">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="obits-sidebar-avatar" alt="thumb 3" />
              <div>
                <strong style={{ fontSize: '12.5px' }}>செல்வி விஜயலட்சுமி</strong>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>267 {lang === 'en' ? 'Tributes' : 'இரங்கல்கள்'}</div>
              </div>
            </div>
          </div>

          {/* Help Guides Card */}
          <div className="obits-sidebar-block">
            <h3 className="obits-sidebar-title">{lang === 'en' ? 'Help & Guide' : 'உதவி & வழிகாட்டி'}</h3>
            <div className="obits-sidebar-link-item" onClick={() => alert(lang === 'en' ? 'Help guides coming soon!' : 'வழிகாட்டி உதவிகள் விரைவில்!')}>
              <i className="fas fa-info-circle"></i> {lang === 'en' ? 'How to post obituary?' : 'இரங்கல் பதிவு செய்வது எப்படி?'}
            </div>
            <div className="obits-sidebar-link-item" onClick={() => alert(lang === 'en' ? 'Help guides coming soon!' : 'வழிகாட்டி உதவிகள் விரைவில்!')}>
              <i className="far fa-file-alt"></i> {lang === 'en' ? 'How to create memorial card?' : 'படம் & நினைவு அட்டை உருவாக்குவது எப்படி?'}
            </div>
            <div className="obits-sidebar-link-item" onClick={() => alert(lang === 'en' ? 'FAQs page coming soon!' : 'கேள்வி பதில்கள் விரைவில்!')}>
              <i className="far fa-question-circle"></i> {lang === 'en' ? 'Frequently Asked Questions' : 'அடிக்கடி கேட்கப்படும் கேள்விகள்'}
            </div>
            <div className="obits-sidebar-link-item" onClick={() => alert(lang === 'en' ? 'Support contacts coming soon!' : 'தொடர்பு கொள்ளவும்!')}>
              <i className="far fa-envelope"></i> {lang === 'en' ? 'Contact Us' : 'தொடர்பு கொள்ளவும்'}
            </div>
          </div>

          {/* Create memorial card visual helper */}
          <div className="obits-sidebar-block" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #edd9ff 100%)', border: '1px solid #d8b4fe' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '800', color: '#7c3aed' }}>
              {lang === 'en' ? 'Create Custom Card' : 'நினைவு அட்டை உருவாக்குங்கள்'}
            </h4>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 12px 0' }}>
              {lang === 'en' ? 'Select floral frames, input dates, and download high resolution cards.' : 'அன்னாரின் நினைவாக அழகான பிரேம் தேர்வு செய்து, உயர்தர கார்டை பதிவிறக்கம் செய்யுங்கள்.'}
            </p>
            <button onClick={() => setShowCreateModal(true)} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
              {lang === 'en' ? 'Create Card' : 'அட்டை உருவாக்கு'}
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL VIEW MODAL */}
      {selectedObit && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '850px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Memorial Details' : 'நினைவேந்தல் விவரங்கள்'}</h3>
              <button className="modal-close" onClick={handleCloseDetails}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', overflowY: 'auto' }}>
              
              {/* Column 1: Portrait frame preview */}
              <div style={{ background: '#f8fafc', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e2e8f0' }}>
                <div className="memorial-portrait-circle" style={{ width: '150px', height: '150px', marginBottom: '20px' }}>
                  {obitDetails?.photo ? (
                    <img src={obitDetails.photo} alt={obitDetails.deceasedName} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-user" style={{ fontSize: '48px', color: '#94a3b8' }}></i>
                    </div>
                  )}
                  <div className={`frame-overlay frame-overlay-${obitDetails?.frameTemplate?.category || 'golden'}`} style={{ inset: '-12px' }}></div>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0' }}>{obitDetails?.deceasedName}</h2>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>{lang === 'en' ? 'Age ' : 'வயது '} {obitDetails?.age}</span>

                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginTop: '16px', fontSize: '13px', color: '#334155', width: '100%', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px 0' }}><strong>{lang === 'en' ? 'Birth - Passing' : 'பிறப்பு - இறப்பு'}:</strong></p>
                  <div>{obitDetails?.dateOfBirth ? new Date(obitDetails.dateOfBirth).toLocaleDateString() : 'N/A'} - {obitDetails?.dateOfPassing ? new Date(obitDetails.dateOfPassing).toLocaleDateString() : 'N/A'}</div>
                  {obitDetails?.nativePlace && <div style={{ marginTop: '6px' }}><strong>{lang === 'en' ? 'Native' : 'சொந்த ஊர்'}:</strong> {obitDetails.nativePlace}</div>}
                </div>

                <div style={{ marginTop: '16px', width: '100%' }}>
                  <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', margin: 0, background: '#f1f5f9', borderRadius: '8px', padding: '10px' }}>
                    <strong>{lang === 'en' ? 'Biography' : 'சுயசரிதை'}:</strong><br/>
                    {obitDetails?.biography || obitDetails?.shortDescription}
                  </p>
                </div>

                {/* Show Contact info (with "Show Contact" click logging mask!) */}
                {obitDetails?.familyPhone && (
                  <div style={{ marginTop: '16px', width: '100%', textAlign: 'center' }}>
                    {revealedContacts[obitDetails.id] ? (
                      <div style={{ fontSize: '13px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px', borderRadius: '8px', color: '#065f46' }}>
                        <strong>{obitDetails.familyContactName || (lang === 'en' ? 'Contact' : 'தொடர்பு நபர்')}:</strong> {obitDetails.familyPhone}
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleRevealContact(obitDetails.id)}
                        style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        {lang === 'en' ? 'Show Contact Details' : 'தொடர்பு எண்ணைக் காட்டு'}
                      </button>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '20px', borderTop: '1px solid #cbd5e1', paddingTop: '15px', width: '100%', textAlign: 'center' }}>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-flag"></i> {lang === 'en' ? 'Report Obituary' : 'தவறான பதிவை புகாரளி'}
                  </button>
                </div>
              </div>

              {/* Column 2: Tributes & Condolences lists */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#475569' }}>
                      <span><i className="fas fa-fire" style={{ color: '#d97706' }}></i> {obitDetails?.tributeCount || 0} {lang === 'en' ? 'Tributes' : 'இரங்கல்கள்'}</span>
                      <span><i className="far fa-comment"></i> {obitDetails?.guestbookCount || 0} {lang === 'en' ? 'Condolences' : 'செய்திகள்'}</span>
                    </div>
                  </div>

                  {/* Pay Tributes candlelight triggers bar */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button 
                      onClick={() => handlePayTribute(obitDetails.id, 'Candle')}
                      style={{ flex: 1, padding: '10px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                    >
                      🕯️ <span>{lang === 'en' ? 'Light Candle' : 'மெழுகுவர்த்தி'}</span>
                    </button>
                    <button 
                      onClick={() => handlePayTribute(obitDetails.id, 'Flower')}
                      style={{ flex: 1, padding: '10px', background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                    >
                      🌸 <span>{lang === 'en' ? 'Offer Flowers' : 'மலர் அஞ்சலி'}</span>
                    </button>
                    <button 
                      onClick={() => handlePayTribute(obitDetails.id, 'Tribute')}
                      style={{ flex: 1, padding: '10px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                    >
                      🤝 <span>{lang === 'en' ? 'Tribute' : 'அஞ்சலி'}</span>
                    </button>
                  </div>

                  {/* Condolences lists */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b' }}>
                      {lang === 'en' ? 'Guestbook messages' : 'அஞ்சலி செய்திகள்'}
                    </h4>
                    <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                      {obitDetails?.guestbook && obitDetails.guestbook.length > 0 ? (
                        obitDetails.guestbook.filter(c => !c.parent).map(comment => renderCommentNode(comment))
                      ) : (
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                          {lang === 'en' ? 'No messages yet. Send your condolence!' : 'செய்திகள் எதுவும் பதிவாகவில்லை. முதல் அஞ்சலி செய்தி எழுதுங்கள்!'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Send guestbook condolence */}
                <form onSubmit={handleAddCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      required
                      style={{ fontSize: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Write a message...' : 'அஞ்சலி செய்தி எழுதவும்...'}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      style={{ fontSize: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {lang === 'en' ? 'Send Message' : 'அனுப்புக'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CREATE OBITUARY MODAL */}
      {showCreateModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Create Obituary Notice' : 'புதிய இரங்கல் செய்தி உருவாக்கு'}</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#b45309', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-info-circle" style={{ fontSize: '16px', color: '#d97706' }}></i>
              <div>
                {lang === 'en' 
                  ? "User-submitted obituaries are reviewed before publication. If you believe an obituary is inaccurate or has been published in error, please report it immediately. We will investigate and take appropriate action."
                  : "பயனர்களால் சமர்ப்பிக்கப்பட்ட இரங்கல்கள் வெளியிடுவதற்கு முன்பு சரிபார்க்கப்படுகின்றன. ஏதேனும் இரங்கல் செய்தி தவறானது அல்லது பிழையாக வெளியிடப்பட்டுள்ளது என நீங்கள் கருதினால், உடனடியாக புகாரளிக்கவும். நாங்கள் விசாரித்து உரிய நடவடிக்கை எடுப்போம்."}
              </div>
            </div>

            <div className="modal-body" style={{ padding: '0' }}>
              <form onSubmit={handleCreateObituarySubmit} className="space-y-4 text-left" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Deceased Name *' : 'மறைந்தவர் பெயர் *'}</label>
                    <input
                      type="text"
                      value={deceasedName}
                      onChange={(e) => setDeceasedName(e.target.value)}
                      required
                      placeholder="e.g. Subbiah"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Portrait Photo' : 'அன்னாரின் புகைப்படம்'}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e, setUploadingDeceased, setPhoto)}
                      style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                    />
                    {uploadingDeceased && <span style={{ fontSize: '11px', color: '#7c3aed' }}>Uploading...</span>}
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isCelebrityCheckbox"
                    checked={isCelebrity}
                    onChange={(e) => setIsCelebrity(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isCelebrityCheckbox" style={{ fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {lang === 'en' ? 'Is Celebrity / VIP Person' : 'பிரபல நபர் / முக்கிய பிரமுகர்'}
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Age' : 'வயது'}</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 80"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Gender' : 'பாலினம்'}</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      <option value="male">{lang === 'en' ? 'Male' : 'ஆண்'}</option>
                      <option value="female">{lang === 'en' ? 'Female' : 'பெண்'}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Religion' : 'மதம்'}</label>
                    <input
                      type="text"
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      placeholder="e.g. Hindu"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Birth Date' : 'பிறந்த தேதி'}</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Date of Passing *' : 'மறைந்த தேதி *'}</label>
                    <input
                      type="date"
                      value={dateOfPassing}
                      onChange={(e) => setDateOfPassing(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'City / Location *' : 'சொந்த ஊர் / இடம் *'}</label>
                    <input
                      type="text"
                      value={nativePlace}
                      onChange={(e) => setNativePlace(e.target.value)}
                      required
                      placeholder="e.g. Chennai / Karaikudi"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'District' : 'மாவட்டம்'}</label>
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      <option value="">-- Choose District --</option>
                      {districts.map(d => (
                        <option key={d.id} value={d.id}>{lang === 'en' ? d.nameEn : d.nameTa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Submitter Relationship *' : 'சமர்ப்பிப்பவர் உறவு முறை *'}</label>
                    <select
                      value={posterRelationship}
                      onChange={(e) => setPosterRelationship(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      <option value="">-- Select Relationship --</option>
                      <option value="Family Member">{lang === 'en' ? 'Family Member' : 'குடும்ப உறுப்பினர்'}</option>
                      <option value="Friend">{lang === 'en' ? 'Friend' : 'நண்பர்'}</option>
                      <option value="Organization">{lang === 'en' ? 'Organization' : 'நிறுவனம்/அமைப்பு'}</option>
                      <option value="Other">{lang === 'en' ? 'Other' : 'இதர'}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Submitter Contact (Phone or Email) *' : 'சமர்ப்பிப்பவர் தொடர்பு விபரம் *'}</label>
                    <input
                      type="text"
                      value={submitterContact}
                      onChange={(e) => setSubmitterContact(e.target.value)}
                      required
                      placeholder="e.g. +919876543210 or email@domain.com"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'Proof Document (Optional)' : 'ஆதார ஆவணம் (விருப்பத்தேர்வு)'}
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal', display: 'block' }}>
                      {lang === 'en' 
                        ? 'Upload death certificate, funeral notice, or hospital confirmation. Visible ONLY to admins.' 
                        : 'இறப்புச் சான்றிதழ், இறுதிச் சடங்கு அறிவிப்பு அல்லது மருத்துவமனை உறுதிப்படுத்தலைப் பதிவேற்றவும். நிர்வாகிகளுக்கு மட்டுமே காட்டப்படும்.'}
                    </span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => uploadImage(e, setUploadingProof, setProofDocument)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                  {uploadingProof && <span style={{ fontSize: '11px', color: '#7c3aed' }}>Uploading proof...</span>}
                  {proofDocument && <span style={{ fontSize: '11px', color: '#059669', display: 'block', marginTop: '4px' }}>✓ Proof document uploaded successfully.</span>}
                </div>

                <fieldset style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', marginTop: '4px' }}>
                  <legend style={{ fontSize: '12px', fontWeight: 'bold', padding: '0 6px', color: '#475569' }}>
                    {lang === 'en' ? 'Funeral & Family Details (Optional)' : 'இறுதிச் சடங்கு & குடும்ப விவரங்கள் (விருப்பத்தேர்வு)'}
                  </legend>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{lang === 'en' ? 'Funeral Date & Time' : 'இறுதிச் சடங்கு நேரம்'}</label>
                      <input
                        type="datetime-local"
                        value={funeralDatetime}
                        onChange={(e) => setFuneralDatetime(e.target.value)}
                        style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black', fontSize: '12.5px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{lang === 'en' ? 'Funeral Venue' : 'இறுதிச் சடங்கு இடம்'}</label>
                      <input
                        type="text"
                        value={funeralVenue}
                        onChange={(e) => setFuneralVenue(e.target.value)}
                        placeholder="e.g. Crematorium grounds"
                        style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black', fontSize: '12.5px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{lang === 'en' ? 'Family Contact Name' : 'குடும்ப தொடர்பு நபர்'}</label>
                      <input
                        type="text"
                        value={familyContactName}
                        onChange={(e) => setFamilyContactName(e.target.value)}
                        placeholder="e.g. Son"
                        style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black', fontSize: '12.5px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{lang === 'en' ? 'Family Contact Phone' : 'தொடர்பு தொலைபேசி'}</label>
                      <input
                        type="text"
                        value={familyPhone}
                        onChange={(e) => setFamilyPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black', fontSize: '12.5px' }}
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Detailed Biography' : 'வாழ்க்கைக் குறிப்பு / சுயசரிதை'}</label>
                  <textarea
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    rows="2"
                    placeholder={lang === 'en' ? 'Brief details about achievements...' : 'அன்னாரது சாதனைகள், குடும்ப விவரங்கள் இங்கே எழுதவும்...'}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                  ></textarea>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    id="declarationCheckbox"
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                    required
                    style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px' }}
                  />
                  <label htmlFor="declarationCheckbox" style={{ fontSize: '11.5px', cursor: 'pointer', color: '#475569', lineHeight: '1.4' }}>
                    {lang === 'en'
                      ? "I confirm that the information provided is true and accurate to the best of my knowledge. I understand that submitting false, misleading, or defamatory information may result in rejection, account suspension, removal of content, and legal action where applicable."
                      : "வழங்கப்பட்ட தகவல்கள் எனது அறிவுக்கு எட்டிய வரையில் உண்மையானவை மற்றும் துல்லியமானவை என்று நான் உறுதிப்படுத்துகிறேன். தவறான, தவறாக வழிநடத்தும் அல்லது அவதூறான தகவல்களைச் சமர்ப்பிப்பது நிராகரிப்பு, கணக்கு இடைநிறுத்தம், உள்ளடக்கத்தை அகற்றுதல் மற்றும் பொருந்தக்கூடிய இடங்களில் சட்ட நடவடிக்கைக்கு வழிவகுக்கும் என்பதை நான் புரிந்துகொள்கிறேன்."}
                  </label>
                </div>

                <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                  {lang === 'en' ? 'Submit Obituary for Review' : 'மதிப்பாய்விற்கு சமர்ப்பிக்கவும்'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
      
      {/* REPORT OBITUARY MODAL */}
      {showReportModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '450px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Report Obituary' : 'புகார் அளிக்கவும்'}</h3>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Reason for reporting *' : 'புகாருக்கான காரணம் *'}</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                >
                  <option value="False information">False information</option>
                  <option value="Person is alive">Person is alive</option>
                  <option value="Wrong identity">Wrong identity</option>
                  <option value="Offensive content">Offensive content</option>
                  <option value="Duplicate post">Duplicate post</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Optional Details' : 'கூடுதல் விபரம் (விருப்பத்தேர்வு)'}</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows="3"
                  placeholder={lang === 'en' ? 'Provide any additional details or evidence...' : 'கூடுதல் தகவல்களை இங்கே குறிப்பிடவும்...'}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                ></textarea>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{lang === 'en' ? 'Your Contact (Optional)' : 'தொடர்பு விபரம் (விருப்பத்தேர்வு)'}</label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder={lang === 'en' ? 'Email or phone for follow-up' : 'மின்னஞ்சல் அல்லது தொலைபேசி எண்'}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                />
              </div>
              <button type="submit" disabled={submittingReport} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                {submittingReport ? 'Submitting...' : (lang === 'en' ? 'Submit Report' : 'புகார் சமர்ப்பி')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Obituaries;
