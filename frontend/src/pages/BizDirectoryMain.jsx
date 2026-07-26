import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './BizDirectoryMain.css';

const BizDirectoryMain = () => {
  const { lang } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const getCategoryLabel = (catName) => {
    const labels = {
      'Restaurant': lang === 'en' ? 'Restaurant' : 'உணவகம்',
      'Health & Medical': lang === 'en' ? 'Health & Medical' : 'சுகாதாரம் & மருத்துவம்',
      'Education': lang === 'en' ? 'Education' : 'கல்வி',
      'Automotive': lang === 'en' ? 'Automotive' : 'வாகனங்கள்',
      'Real Estate': lang === 'en' ? 'Real Estate' : 'ரியல் எஸ்டேட்',
      'Beauty & Salon': lang === 'en' ? 'Beauty & Salon' : 'அழகு நிலையம்',
      'Electronics': lang === 'en' ? 'Electronics' : 'மின்னணுவியல்',
      'Shops': lang === 'en' ? 'Shops' : 'கடைகள்'
    };
    return labels[catName] || catName;
  };
  
  // Data State
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Selected business details modal
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [bizReviews, setBizReviews] = useState([]);
  const [bizGallery, setBizGallery] = useState([]);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  
  // Create business modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizCat, setNewBizCat] = useState('Restaurant');
  const [newBizLoc, setNewBizLoc] = useState('');
  const [newBizStreet, setNewBizStreet] = useState('');
  const [newBizHours, setNewBizHours] = useState('09:00 AM - 09:00 PM');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizDesc, setNewBizDesc] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizWeb, setNewBizWeb] = useState('');
  const [newBizLogo, setNewBizLogo] = useState('');
  const [newBizCover, setNewBizCover] = useState('');

  // Tabs for general users (defaulting to deals as normal user has no listings)
  const [activeDirectoryTab, setActiveDirectoryTab] = useState('deals'); // deals, rfqs, businesses
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [rfqs, setRfqs] = useState([]);
  const [rfqsLoading, setRfqsLoading] = useState(false);

  // RFQ Quote submission form details
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteTimeline, setQuoteTimeline] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [selectedBizIdForQuote, setSelectedBizIdForQuote] = useState('');
  const [quoteError, setQuoteError] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchApi('/directory')
      .then(data => {
        if (Array.isArray(data)) {
          setBusinesses(data);
        } else {
          setBusinesses(fallbackBusinesses);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Error fetching directory, using fallback", err);
        setBusinesses(fallbackBusinesses);
        setLoading(false);
      });
  };

  const loadDeals = () => {
    setDealsLoading(true);
    fetchApi('/deals/public')
      .then(res => {
        if (res && res.content) {
          setDeals(res.content);
        } else if (Array.isArray(res)) {
          setDeals(res);
        } else {
          setDeals([]);
        }
        setDealsLoading(false);
      })
      .catch(() => {
        setDeals([]);
        setDealsLoading(false);
      });
  };

  const loadRfqs = () => {
    setRfqsLoading(true);
    fetchApi('/rfq')
      .then(res => {
        setRfqs(Array.isArray(res) ? res : []);
        setRfqsLoading(false);
      })
      .catch(() => {
        setRfqs([]);
        setRfqsLoading(false);
      });
  };

  const loadUserBusinessesForQuote = () => {
    if (!isAuthenticated) return;
    fetchApi('/directory/my-business')
      .then(res => {
        const approved = Array.isArray(res) ? res.filter(b => b.kycStatus === 'approved') : [];
        setUserBusinesses(approved);
        if (approved.length > 0) {
          setSelectedBizIdForQuote(approved[0].id.toString());
        }
      })
      .catch(() => {
        setUserBusinesses([]);
      });
  };

  const handleOpenQuoteModal = (rfqItem) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/directory' } });
      return;
    }
    setSelectedRfqForQuote(rfqItem);
    setQuoteError('');
    setQuoteSuccess('');
    setQuotePrice('');
    setQuoteTimeline('');
    setQuoteNotes('');
    setShowQuoteModal(true);
    loadUserBusinessesForQuote();
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!selectedRfqForQuote) return;
    if (userBusinesses.length === 0) {
      setQuoteError(lang === 'en' ? 'You must register a business and get KYC approval to submit quotes.' : 'சலுகைகளை சமர்ப்பிக்க நீங்கள் ஒரு வணிகத்தை பதிவு செய்து KYC ஒப்புதல் பெற வேண்டும்.');
      return;
    }

    const payload = {
      sellerBusinessId: parseInt(selectedBizIdForQuote),
      quotedPrice: parseFloat(quotePrice),
      timelineDays: parseInt(quoteTimeline),
      notes: quoteNotes
    };

    fetchApi(`/rfq/${selectedRfqForQuote.id}/quotes`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(() => {
        setQuoteSuccess(lang === 'en' ? 'Quotation submitted successfully!' : 'மதிப்பீட்டு சலுகை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!');
        setTimeout(() => {
          setShowQuoteModal(false);
          loadRfqs();
        }, 2000);
      })
      .catch((err) => {
        setQuoteError(lang === 'en' ? 'Failed to submit quote.' : 'சலுகையை சமர்ப்பிக்க முடியவில்லை.');
      });
  };

  useEffect(() => {
    loadData();
    loadDeals();
    loadRfqs();
  }, []);

  const handleBizClick = (biz) => {
    setSelectedBiz(biz);
    
    // Fetch gallery and reviews
    fetchApi(`/directory/${biz.id}/gallery`)
      .then(g => setBizGallery(Array.isArray(g) ? g : []))
      .catch(() => setBizGallery([
        { id: 101, imageUrl: biz.coverUrl },
        { id: 102, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" }
      ]));

    fetchApi(`/directory/${biz.id}/reviews`)
      .then(r => setBizReviews(Array.isArray(r) ? r : []))
      .catch(() => setBizReviews([
        { id: 201, reviewerName: "Hari Prakash", rating: 5, comment: "Amazing services and absolute professional behaviour!" },
        { id: 202, reviewerName: "Priya Sharma", rating: 4, comment: "Decent ambience and cooperative staff. Worth visiting." }
      ]));
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReviewComment || !newReviewName) return;

    fetchApi(`/directory/${selectedBiz.id}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        reviewerName: newReviewName,
        rating: newReviewRating,
        comment: newReviewComment
      })
    })
      .then(saved => {
        setBizReviews(prev => [saved, ...prev]);
        setNewReviewComment('');
        setNewReviewName('');
        loadData();
      })
      .catch(() => {
        const mockRev = {
          id: Date.now(),
          reviewerName: newReviewName,
          rating: newReviewRating,
          comment: newReviewComment
        };
        setBizReviews(prev => [mockRev, ...prev]);
        setNewReviewComment('');
        setNewReviewName('');
      });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetchApi('/directory/upload', {
        method: 'POST',
        body: formData
      });
      const imageUrl = uploadRes.url;

      // Update the business coverUrl
      const updatedBiz = {
        ...selectedBiz,
        coverUrl: imageUrl
      };

      // Call API to save this update
      await fetchApi('/directory/saveUpdate', {
        method: 'PUT',
        body: JSON.stringify(updatedBiz)
      });

      // Update local states
      setSelectedBiz(updatedBiz);
      setBusinesses(prev => prev.map(b => b.id === selectedBiz.id ? updatedBiz : b));
    } catch (err) {
      console.warn("Failed to upload photo to server, using base64 preview", err);
      // Fallback: use FileReader for local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedBiz = {
          ...selectedBiz,
          coverUrl: event.target.result
        };
        setSelectedBiz(updatedBiz);
        setBusinesses(prev => prev.map(b => b.id === selectedBiz.id ? updatedBiz : b));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBusiness = (e) => {
    e.preventDefault();
    fetchApi('/directory', {
      method: 'POST',
      body: JSON.stringify({
        businessName: newBizName,
        category: newBizCat,
        addressLocality: newBizLoc,
        addressStreet: newBizStreet,
        workingHours: newBizHours,
        phoneNumber: newBizPhone,
        description: newBizDesc,
        email: newBizEmail,
        website: newBizWeb,
        logoUrl: newBizLogo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
        coverUrl: newBizCover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
        status: "active"
      })
    })
      .then(() => {
        setShowAddModal(false);
        loadData();
        setNewBizName('');
        setNewBizLoc('');
        setNewBizPhone('');
      })
      .catch(() => {
        const fallbackBiz = {
          id: Date.now(),
          businessName: newBizName,
          category: newBizCat,
          addressLocality: newBizLoc,
          addressStreet: newBizStreet,
          workingHours: newBizHours,
          phoneNumber: newBizPhone,
          ratingAvg: 5.0,
          ratingCount: 1,
          logoUrl: newBizLogo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
          coverUrl: newBizCover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
          description: newBizDesc
        };
        setBusinesses(prev => [fallbackBiz, ...prev]);
        setShowAddModal(false);
      });
  };

  // Filter listings based on category and searches
  const filtered = businesses.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLoc = b.addressLocality.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesCategory && matchesSearch && matchesLoc;
  });

  const categories = [
    { name: 'Restaurant', icon: 'fa-utensils', color: 'bg-red-50 text-red-500' },
    { name: 'Health & Medical', icon: 'fa-heartbeat', color: 'bg-green-50 text-green-600' },
    { name: 'Education', icon: 'fa-graduation-cap', color: 'bg-purple-50 text-purple-500' },
    { name: 'Automotive', icon: 'fa-car', color: 'bg-blue-50 text-blue-500' },
    { name: 'Real Estate', icon: 'fa-home', color: 'bg-orange-50 text-orange-500' },
    { name: 'Beauty & Salon', icon: 'fa-spa', color: 'bg-pink-50 text-pink-500' },
    { name: 'Electronics', icon: 'fa-laptop', color: 'bg-indigo-50 text-indigo-500' },
    { name: 'Shops', icon: 'fa-shopping-bag', color: 'bg-teal-50 text-teal-500' }
  ];

  const fallbackBusinesses = [
    { id: 1, businessName: "AB's Restaurant", category: "Restaurant", addressLocality: "Anna Nagar, Chennai", addressStreet: "12th Main Road", workingHours: "11:00 AM - 11:00 PM", phoneNumber: "044-1234567", ratingAvg: 4.6, ratingCount: 128, isFeatured: true, isPremium: true, kycStatus: "verified", subscriptionStatus: "premium", logoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100", coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600", description: "Delicious multicuisine dining in the heart of Anna Nagar." },
    { id: 2, businessName: "Sundaram Hospital", category: "Health & Medical", addressLocality: "T. Nagar, Chennai", addressStreet: "GN Chetty Road", workingHours: "24 Hours Service", phoneNumber: "044-7654321", ratingAvg: 4.7, ratingCount: 256, isFeatured: true, isPremium: true, kycStatus: "verified", subscriptionStatus: "premium", logoUrl: "https://images.unsplash.com/photo-1586773860418-d3b3da96ae12?w=100", coverUrl: "https://images.unsplash.com/photo-1586773860418-d3b3da96ae12?w=600", description: "Premier multispeciality medical care clinic." },
    { id: 3, businessName: "Headlines Salon", category: "Beauty & Salon", addressLocality: "Velachery, Chennai", addressStreet: "Bypass Road", workingHours: "09:00 AM - 09:00 PM", phoneNumber: "044-9988776", ratingAvg: 4.5, ratingCount: 98, isFeatured: true, isPremium: false, kycStatus: "verified", subscriptionStatus: "free", logoUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100", coverUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600", description: "Professional beauty treatments and hair styling salon." },
    { id: 4, businessName: "Gadget World", category: "Electronics", addressLocality: "Porur, Chennai", addressStreet: "Mount Poonamallee Road", workingHours: "10:00 AM - 09:30 PM", phoneNumber: "044-5544332", ratingAvg: 4.5, ratingCount: 75, isFeatured: false, isPremium: false, kycStatus: "verified", subscriptionStatus: "free", logoUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100", coverUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600", description: "All kinds of smart gadgets, mobiles, and electronic accessories." }
  ];

  return (
    <main 
      className="biz-module-container" 
      style={{ 
        paddingTop: '20px',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '20px',
        paddingRight: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'Business Directory' : 'வணிக அடைவு'}</span>
      </div>

      {/* DYNAMIC HERO BANNER */}
      <section className="biz-hero-banner">
        <h1 className="biz-hero-title">
          {lang === 'en' ? 'Find the Best Local Businesses Near You' : 'உங்களுக்கு அருகிலுள்ள சிறந்த வணிகங்களைக் கண்டறியவும்'}
        </h1>
        <p className="biz-hero-subtitle">
          {lang === 'en' ? 'Search, discover and connect with trusted local businesses.' : 'நம்பகமான உள்ளூர் வணிகங்களைத் தேடிக் கண்டறிந்து தொடர்பு கொள்ளுங்கள்.'}
        </p>

        {/* Search Bar Inline Input form */}
        <div className="biz-search-bar">
          <div className="biz-search-field">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Search businesses, services...' : 'வணிகங்கள், சேவைகளைத் தேடுக...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="biz-search-field">
            <i className="fas fa-map-marker-alt"></i>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Chennai, Tamil Nadu' : 'சென்னை, தமிழ்நாடு'} 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <button className="biz-search-btn" onClick={loadData}>
            {lang === 'en' ? 'Search' : 'தேடுக'}
          </button>
        </div>

        {/* Highlight widgets under search bar */}
        <div className="biz-highlights-grid">
          <div className="biz-highlight-badge">
            <i className="fas fa-check-circle"></i> KYC Verified
          </div>
          <div className="biz-highlight-badge">
            <i className="fas fa-star"></i> Top Rated Services
          </div>
          <div className="biz-highlight-badge">
            <i className="fas fa-mobile-alt"></i> NFC Tap to Pay
          </div>
          <div className="biz-highlight-badge">
            <i className="fas fa-tags"></i> Great Deals & Offers
          </div>
        </div>
      </section>

      {/* DIRECTORY NAVIGATION TABS */}
      <div className="directory-tabs" style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px', paddingBottom: '2px' }}>
        <button 
          onClick={() => setActiveDirectoryTab('deals')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            fontSize: '15px',
            fontWeight: 'bold',
            color: activeDirectoryTab === 'deals' ? 'var(--primary, #B3732A)' : '#64748B',
            borderBottom: activeDirectoryTab === 'deals' ? '3px solid var(--primary, #B3732A)' : 'none',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-tags" style={{ marginRight: '8px' }}></i>
          {lang === 'en' ? 'Promotional Deals' : 'விளம்பர சலுகைகள்'}
        </button>
        <button 
          onClick={() => setActiveDirectoryTab('rfqs')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            fontSize: '15px',
            fontWeight: 'bold',
            color: activeDirectoryTab === 'rfqs' ? 'var(--primary, #B3732A)' : '#64748B',
            borderBottom: activeDirectoryTab === 'rfqs' ? '3px solid var(--primary, #B3732A)' : 'none',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-gavel" style={{ marginRight: '8px' }}></i>
          {lang === 'en' ? 'Customer RFQs' : 'வாடிக்கையாளர் RFQ கோரிக்கைகள்'}
        </button>
        <button 
          onClick={() => setActiveDirectoryTab('businesses')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            fontSize: '15px',
            fontWeight: 'bold',
            color: activeDirectoryTab === 'businesses' ? 'var(--primary, #B3732A)' : '#64748B',
            borderBottom: activeDirectoryTab === 'businesses' ? '3px solid var(--primary, #B3732A)' : 'none',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-store" style={{ marginRight: '8px' }}></i>
          {lang === 'en' ? 'Verified Listings' : 'சரிபார்க்கப்பட்ட நிறுவனங்கள்'}
        </button>
      </div>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8" style={{ marginBottom: '40px' }}>
        
        {/* Left Column: Tab contents */}
        <div className="flex-grow">
          {activeDirectoryTab === 'deals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '850', margin: 0 }}>
                  {lang === 'en' ? 'Exclusive Promotional Deals' : 'பிரத்யேக விளம்பர சலுகைகள்'}
                </h2>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: '/directory/register' } });
                    } else {
                      fetchApi('/directory/my-business')
                        .then(res => {
                          if (res && res.length > 0) {
                            navigate('/directory/dashboard');
                          } else {
                            navigate('/directory/register');
                          }
                        })
                        .catch(() => {
                          navigate('/directory/register');
                        });
                    }
                  }}
                  style={{ background: 'var(--primary, #B3732A)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {lang === 'en' ? 'Manage My Business' : 'எனது வணிகத்தை நிர்வகி'}
                </button>
              </div>

              {dealsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : deals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', border: '1.5px dashed #cbd5e1', borderRadius: '16px' }}>
                  <i className="fas fa-tags" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px' }}></i>
                  <h3>{lang === 'en' ? 'No deals available' : 'சலுகைகள் எதுவும் இல்லை'}</h3>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {deals.map(deal => (
                    <div className="biz-listing-card" key={deal.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'default' }}>
                      <div className="biz-card-image-cover" style={{ backgroundImage: `url(${deal.bannerUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600'})`, height: '140px' }}>
                        <span className="biz-card-tag" style={{ background: '#ef4444' }}>{deal.discountValue} {deal.discountType === 'percentage' ? '% OFF' : '₹ OFF'}</span>
                      </div>
                      <div className="biz-card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
                        <div>
                          <span className="biz-card-category" style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px' }}>{deal.category}</span>
                          <h3 className="biz-card-name" style={{ fontSize: '15px', fontWeight: 'bold', margin: '8px 0 4px 0', minHeight: '44px' }}>{deal.title}</h3>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>{deal.terms || 'Valid on all services/products.'}</p>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8' }}>{lang === 'en' ? 'Use Coupon' : 'கூப்பன் குறியீடு'}</div>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary, #B3732A)' }}>{deal.couponCode || 'NO CODE NEEDED'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '10px', color: '#94a3b8' }}>{lang === 'en' ? 'Valid Until' : 'காலாவதி தேதி'}</div>
                              <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '500' }}>{new Date(deal.validUntil).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeDirectoryTab === 'rfqs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '850', margin: 0 }}>
                  {lang === 'en' ? 'Procurement Requests (RFQs)' : 'வாங்குதல் கோரிக்கைகள் (RFQ)'}
                </h2>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: '/directory/register' } });
                    } else {
                      fetchApi('/directory/my-business')
                        .then(res => {
                          if (res && res.length > 0) {
                            navigate('/directory/dashboard');
                          } else {
                            navigate('/directory/register');
                          }
                        })
                        .catch(() => {
                          navigate('/directory/register');
                        });
                    }
                  }}
                  style={{ background: 'var(--primary, #B3732A)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {lang === 'en' ? 'Manage My Business' : 'எனது வணிகத்தை நிர்வகி'}
                </button>
              </div>

              {rfqsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : rfqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', border: '1.5px dashed #cbd5e1', borderRadius: '16px' }}>
                  <i className="fas fa-gavel" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px' }}></i>
                  <h3>{lang === 'en' ? 'No RFQs available' : 'RFQ கோரிக்கைகள் எதுவும் இல்லை'}</h3>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {rfqs.map(item => {
                    const r = item.rfq;
                    return (
                      <div className="biz-listing-card" key={r.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'default' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <span className="biz-card-category" style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px' }}>{r.category}</span>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '6px 0 2px 0' }}>{r.title}</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{r.description}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'inline-block' }}>{r.status}</div>
                            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--primary, #B3732A)', marginTop: '6px' }}>₹{r.budget || 'Open'}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <span><i className="fas fa-boxes" style={{ marginRight: '6px' }}></i>Qty: <strong>{r.quantity}</strong></span>
                          <span><i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>Location: <strong>{r.location}</strong></span>
                          <span><i className="fas fa-calendar-alt" style={{ marginRight: '6px' }}></i>Deadline: <strong style={{ color: '#ef4444' }}>{new Date(r.deadline).toLocaleDateString()}</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button 
                            onClick={() => handleOpenQuoteModal(r)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            <i className="fas fa-paper-plane" style={{ marginRight: '6px' }}></i>
                            {lang === 'en' ? 'Submit Quotation Bid' : 'மதிப்பீட்டு சலுகை அளி'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeDirectoryTab === 'businesses' && (
            <div>
              {/* Category Selector */}
              <section className="mb-8">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '850', margin: 0 }}>{lang === 'en' ? 'Browse Categories' : 'வகைகளை உலாவுக'}</h2>
                </div>
                <div className="biz-cat-grid">
                  {categories.map((c, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`biz-cat-card-btn ${selectedCategory === c.name ? 'active' : ''}`}
                    >
                      <div className={`biz-cat-icon-circle ${c.color}`}>
                        <i className={`fas ${c.icon}`}></i>
                      </div>
                      <span className="biz-cat-title-lbl">{getCategoryLabel(c.name)}</span>
                    </button>
                  ))}
                </div>
              </section>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '850', margin: 0 }}>
                  {selectedCategory === 'all' ? (lang === 'en' ? 'Featured Businesses' : 'சிறப்பு வணிகங்கள்') : getCategoryLabel(selectedCategory)}
                </h2>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: '/directory/register' } });
                    } else {
                      fetchApi('/directory/my-business')
                        .then(res => {
                          if (res && res.length > 0) {
                            navigate('/directory/dashboard');
                          } else {
                            navigate('/directory/register');
                          }
                        })
                        .catch(() => {
                          navigate('/directory/register');
                        });
                    }
                  }}
                  style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  + {lang === 'en' ? 'Add Business' : 'வணிகத்தைச் சேர்'}
                </button>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {[1, 2].map(n => (
                    <div key={n} style={{ height: '240px', background: '#f1f5f9', borderRadius: '16px', animation: 'pulse 1.5s infinite' }}></div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', border: '1.5px dashed #cbd5e1', borderRadius: '16px' }}>
                  <i className="fas fa-store-slash" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px' }}></i>
                  <h3>{lang === 'en' ? 'No businesses found' : 'வணிகங்கள் எதுவும் காணப்படவில்லை'}</h3>
                </div>
              ) : (
                <div className="biz-listings-grid">
                  {filtered.map(biz => (
                    <div className="biz-listing-card" key={biz.id} onClick={() => handleBizClick(biz)}>
                      <div className="biz-card-image-cover" style={{ backgroundImage: `url(${biz.coverUrl})` }}>
                        <span className="biz-card-tag">{lang === 'en' ? 'FEATURED' : 'சிறப்பு'}</span>
                        {biz.kycStatus === 'verified' && (
                          <span className="biz-card-kyc-badge">
                            <i className="fas fa-check-circle"></i> {lang === 'en' ? 'Verified' : 'சரிபார்க்கப்பட்டது'}
                          </span>
                        )}
                      </div>

                      <div className="biz-card-body">
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="biz-card-category">{getCategoryLabel(biz.category)}</span>
                            <div className="biz-card-rating">
                              <i className="fas fa-star"></i> {biz.ratingAvg || 5.0} <span>({biz.ratingCount || 0})</span>
                            </div>
                          </div>
                          <h3 className="biz-card-name">{biz.businessName}</h3>
                        </div>

                        <div>
                          <div className="biz-card-info-row">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{biz.addressLocality}</span>
                          </div>
                          <div className="biz-card-info-row">
                            <i className="fas fa-clock"></i>
                            <span>{biz.workingHours}</span>
                          </div>
                          <div className="biz-card-info-row">
                            <i className="fas fa-phone-alt"></i>
                            <span>{biz.phoneNumber}</span>
                          </div>
                        </div>

                        <div className="biz-card-footer">
                          <span className="biz-status-online">
                            <span></span> {lang === 'en' ? 'Open Now' : 'இப்போது திறந்துள்ளது'}
                          </span>
                          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                            {lang === 'en' ? 'View Details' : 'விவரங்களைக் காண்க'} &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-6">

          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: '800', marginBottom: '12px' }}>{lang === 'en' ? 'Popular Locations' : 'பிரபலமான இடங்கள்'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setLocationQuery("Anna Nagar")}>
                <span>{lang === 'en' ? 'Anna Nagar' : 'அண்ணா நகர்'}</span> <span>120+ {lang === 'en' ? 'listings' : 'வணிகங்கள்'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setLocationQuery("T. Nagar")}>
                <span>{lang === 'en' ? 'T. Nagar' : 'தி. நகர்'}</span> <span>95+ {lang === 'en' ? 'listings' : 'வணிகங்கள்'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setLocationQuery("Velachery")}>
                <span>{lang === 'en' ? 'Velachery' : 'வேளச்சேரி'}</span> <span>80+ {lang === 'en' ? 'listings' : 'வணிகங்கள்'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BUSINESS DETAILS MODAL VIEW */}
      {selectedBiz && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{selectedBiz.businessName}</h3>
              <button className="modal-close" onClick={() => setSelectedBiz(null)}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '220px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${selectedBiz.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600'})` }}></div>
              
              <div className="biz-details-info-map-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                  <div><strong>{lang === 'en' ? 'Locality:' : 'பகுதி:'}</strong> {selectedBiz.addressLocality}</div>
                  <div><strong>{lang === 'en' ? 'Street:' : 'தெரு:'}</strong> {selectedBiz.addressStreet}</div>
                  <div><strong>{lang === 'en' ? 'Timings:' : 'நேரம்:'}</strong> {selectedBiz.workingHours}</div>
                  <div><strong>{lang === 'en' ? 'Phone:' : 'தொலைபேசி:'}</strong> {selectedBiz.phoneNumber}</div>
                </div>
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', height: '150px' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: '0', display: 'block' }} 
                    loading="lazy" 
                    allowFullScreen 
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedBiz.businessName + ', ' + (selectedBiz.addressStreet || '') + ', ' + selectedBiz.addressLocality)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0' }}>{lang === 'en' ? 'About Business' : 'வணிகம் பற்றி'}</h4>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>{selectedBiz.description}</p>
              </div>

              {/* Reviews Block */}
              <div>
                <h4 style={{ margin: '0 0 10px 0' }}>{lang === 'en' ? 'Reviews' : 'மதிப்புரைகள்'} ({bizReviews.length})</h4>
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bizReviews.map(r => (
                    <div key={r.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 'bold' }}>
                        <span>{r.reviewerName}</span>
                        <span style={{ color: '#fbbf24' }}>★ {r.rating}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add review form */}
              <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'} 
                      value={newReviewName} 
                      onChange={(e) => setNewReviewName(e.target.value)} 
                      required  
                      style={{ flexGrow: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black', minWidth: '180px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>{lang === 'en' ? 'Rating:' : 'மதிப்பீடு:'}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i 
                            key={star}
                            className={star <= newReviewRating ? "fas fa-star" : "far fa-star"} 
                            onClick={() => setNewReviewRating(star)}
                            style={{ 
                              fontSize: '22px', 
                              color: '#fbbf24', 
                              cursor: 'pointer',
                              transition: 'transform 0.1s'
                            }}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder={lang === 'en' ? 'Write your review message...' : 'உங்கள் மதிப்புரை செய்தியை எழுதுங்கள்...'} 
                    value={newReviewComment} 
                    onChange={(e) => setNewReviewComment(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', color: 'black' }}
                  />
                </div>
                <button type="submit" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {lang === 'en' ? 'Submit Review' : 'மதிப்புரையைச் சமர்ப்பி'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE BUSINESS MODAL */}
      {showAddModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Register New Business' : 'புதிய வணிகத்தைப் பதிவு செய்'}</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreateBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Business Name *' : 'வணிகப் பெயர் *'}</label>
                  <input 
                    type="text" 
                    value={newBizName} 
                    onChange={(e) => setNewBizName(e.target.value)} 
                    required 
                    placeholder={lang === 'en' ? 'e.g. Kannan Coffee' : 'எ.கா. கண்ணன் காபி'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Category *' : 'வகை *'}</label>
                    <select 
                      value={newBizCat} 
                      onChange={(e) => setNewBizCat(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      {categories.map((c, i) => (
                        <option key={i} value={c.name}>{getCategoryLabel(c.name)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Locality *' : 'பகுதி *'}</label>
                    <input 
                      type="text" 
                      value={newBizLoc} 
                      onChange={(e) => setNewBizLoc(e.target.value)} 
                      required 
                      placeholder={lang === 'en' ? 'e.g. Anna Nagar, Chennai' : 'எ.கா. அண்ணா நகர், சென்னை'}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Phone Number *' : 'தொலைபேசி எண் *'}</label>
                    <input 
                      type="text" 
                      value={newBizPhone} 
                      onChange={(e) => setNewBizPhone(e.target.value)} 
                      required 
                      placeholder={lang === 'en' ? 'e.g. 044-1234567' : 'எ.கா. 044-1234567'}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Working Hours' : 'வேலை நேரம்'}</label>
                    <input 
                      type="text" 
                      value={newBizHours} 
                      onChange={(e) => setNewBizHours(e.target.value)} 
                      placeholder="09:00 AM - 09:00 PM"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Company Photo' : 'நிறுவன படம்'}</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await fetchApi('/directory/upload', {
                            method: 'POST',
                            body: formData
                          });
                          setNewBizCover(res.url);
                        } catch (err) {
                          console.warn("Failed to upload photo, using base64 preview", err);
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setNewBizCover(event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ fontSize: '12px', color: '#64748b' }}
                    />
                    {newBizCover && (
                      <img 
                        src={newBizCover} 
                        alt="Preview" 
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
                      />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Description *' : 'விளக்கம் *'}</label>
                  <textarea 
                    value={newBizDesc} 
                    onChange={(e) => setNewBizDesc(e.target.value)} 
                    required 
                    rows="3" 
                    placeholder={lang === 'en' ? 'Enter short details about business services...' : 'வணிக சேவைகளைப் பற்றிய சிறிய விளக்கத்தை உள்ளிடவும்...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                  ></textarea>
                </div>

                <button type="submit" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                  {lang === 'en' ? 'Register Business' : 'வணிகத்தைப் பதிவு செய்'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* RFQ QUOTATION BID MODAL */}
      {showQuoteModal && selectedRfqForQuote && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '95%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Submit Quotation Bid' : 'மதிப்பீட்டு சலுகை சமர்ப்பி'}</h3>
              <button className="modal-close" onClick={() => setShowQuoteModal(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                <strong>RFQ:</strong> {selectedRfqForQuote.title}<br/>
                <strong>Budget:</strong> ₹{selectedRfqForQuote.budget || 'Open'}
              </div>

              {quoteError && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px', fontWeight: '500' }}><i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>{quoteError}</div>}
              {quoteSuccess && <div style={{ background: '#d1fae5', color: '#10b981', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px', fontWeight: '500' }}><i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>{quoteSuccess}</div>}

              {userBusinesses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                    {lang === 'en' ? 'You must have a registered business with approved KYC to quote on RFQ procurement demands.'
                                   : 'RFQ கோரிக்கைகளுக்கு சலுகை அளிக்க சரிபார்க்கப்பட்ட வணிக கணக்கு தேவை.'}
                  </p>
                  <button 
                    onClick={() => {
                      setShowQuoteModal(false);
                      navigate('/directory/register');
                    }}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    + {lang === 'en' ? 'Register Business Now' : 'இப்போது வணிகத்தைப் பதிவு செய்'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{lang === 'en' ? 'Select Bidding Business *' : 'சலுகை அளிக்கும் நிறுவனம் *'}</label>
                    <select 
                      value={selectedBizIdForQuote} 
                      onChange={(e) => setSelectedBizIdForQuote(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      {userBusinesses.map(b => (
                        <option key={b.id} value={b.id}>{b.businessName} ({b.addressLocality})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{lang === 'en' ? 'Quoted Price (₹) *' : 'விலைச் சலுகை (₹) *'}</label>
                      <input 
                        type="number" 
                        value={quotePrice} 
                        onChange={(e) => setQuotePrice(e.target.value)} 
                        required 
                        placeholder={lang === 'en' ? 'e.g. 45000' : 'எ.கா. 45000'}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{lang === 'en' ? 'Delivery Timeline (Days) *' : 'டெலிவரி காலம் (நாட்கள்) *'}</label>
                      <input 
                        type="number" 
                        value={quoteTimeline} 
                        onChange={(e) => setQuoteTimeline(e.target.value)} 
                        required 
                        placeholder={lang === 'en' ? 'e.g. 7' : 'எ.கா. 7'}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>{lang === 'en' ? 'Cover Note / Terms' : 'விளக்கக் குறிப்பு'}</label>
                    <textarea 
                      value={quoteNotes} 
                      onChange={(e) => setQuoteNotes(e.target.value)} 
                      rows="3" 
                      placeholder={lang === 'en' ? 'Write brief terms, delivery conditions, material details...' : 'சலுகையின் நிபந்தனைகள் மற்றும் விபரங்களை குறிப்பிடவும்...'}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    ></textarea>
                  </div>

                  <button type="submit" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                    {lang === 'en' ? 'Submit Bid' : 'சலுகையைச் சமர்ப்பி'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BizDirectoryMain;
