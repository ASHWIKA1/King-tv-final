import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './Classifieds.css';

const Classifieds = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Data lists
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  // Selection / Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedLoc, setSelectedLoc] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [selectedType, setSelectedType] = useState('all'); // all, Vehicles, Property, Mobiles, Electronics, Services, More
  const [priceMax, setPriceMax] = useState(1000000);
  const [conditionNew, setConditionNew] = useState(true);
  const [conditionUsed, setConditionUsed] = useState(true);

  // Loading
  const [loading, setLoading] = useState(true);

  // Modals / Panels
  const [selectedAd, setSelectedAd] = useState(null);
  const [adDetails, setAdDetails] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAdObj, setShareAdObj] = useState(null);

  // Create Ad Form states (Multi-Step Form wizard)
  const [postStep, setPostStep] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newSubcatId, setNewSubcatId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newNegotiable, setNewNegotiable] = useState(false);
  const [newCondition, setNewCondition] = useState('Used');
  const [newBrand, setNewBrand] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDistrictId, setNewDistrictId] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');

  // Hot Deal Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, mins: 36, secs: 58 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch lists
  useEffect(() => {
    fetchApi('/classifieds/categories')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
        else setCategories(fallbackCategories);
      })
      .catch(() => setCategories(fallbackCategories));

    fetchApi('/districts')
      .then(data => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch(err => console.warn("Failed to load districts", err));
  }, []);

  // Load Ads
  const loadAds = () => {
    setLoading(true);
    let endpoint = '/classifieds';
    let params = [];

    if (searchQuery.trim() !== '') {
      endpoint = '/classifieds/search';
      params.push(`query=${encodeURIComponent(searchQuery)}`);
    } else {
      endpoint = '/classifieds/filter';
      if (selectedCat !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCat);
        if (catObj) params.push(`categoryId=${catObj.id}`);
      }
      if (selectedLoc !== 'all') {
        params.push(`districtId=${selectedLoc}`);
      }
      if (selectedSort !== 'newest') {
        params.push(`sort=${selectedSort}`);
      }
    }

    const queryString = params.length > 0 ? `?${params.join('&')}` : '';

    fetchApi(`${endpoint}${queryString}`)
      .then(data => {
        setAds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to load ads from API, using fallback", err);
        setAds(fallbackAds);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAds();
  }, [selectedCat, selectedLoc, selectedSort, searchQuery]);

  // Open Details
  const handleOpenDetails = (ad) => {
    setSelectedAd(ad);
    fetchApi(`/classifieds/${ad.id}`)
      .then(data => {
        setAdDetails(data);
        // Log view
        fetchApi(`/classifieds/${ad.id}/view`, { method: 'POST' }).catch(() => {});
      })
      .catch(() => {
        setAdDetails({ listing: ad, images: [] });
      });
  };

  // Submit Ad Wizard Form
  const handlePostAdSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newPhone || !newDesc) {
      alert(lang === 'en' ? 'Please fill all required fields.' : 'தேவையான அனைத்து புலங்களையும் நிரப்பவும்.');
      return;
    }

    const payload = {
      title: newTitle,
      description: newDesc,
      price: parseFloat(newPrice),
      negotiable: newNegotiable,
      categoryId: newCatId || null,
      subcategoryId: newSubcatId || null,
      districtId: newDistrictId || null,
      pincode: newPincode,
      contactPhone: newPhone,
      whatsappNumber: newWhatsapp,
      email: newEmail,
      status: 'active'
    };

    const images = [];
    if (imageUrl1) images.push(imageUrl1);
    if (imageUrl2) images.push(imageUrl2);

    fetchApi(`/classifieds?images=${encodeURIComponent(images.join(','))}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        alert(lang === 'en' ? 'Advertisement posted successfully!' : 'விளம்பரம் வெற்றிகரமாக பதிவிடப்பட்டது!');
        setShowPostModal(false);
        setPostStep(1);
        // Reset states
        setNewTitle('');
        setNewPrice('');
        setNewPhone('');
        setNewDesc('');
        loadAds();
      })
      .catch(err => {
        console.error(err);
        alert(lang === 'en' ? 'Failed to save listing.' : 'விளம்பரத்தைச் சேமிக்க முடியவில்லை.');
      });
  };

  const handleShareClick = (ad, platform) => {
    const pageUrl = window.location.origin + `/classifieds?id=${ad.id}`;
    const shareText = encodeURIComponent(`Check out this deal! ${ad.title} at ${ad.priceDetail}`);
    
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

  const fallbackCategories = [
    { id: 1, name: 'Vehicles', slug: 'vehicles', iconClass: 'fa-car', activeAdCount: 12458 },
    { id: 2, name: 'Property', slug: 'property', iconClass: 'fa-home', activeAdCount: 8923 },
    { id: 3, name: 'Mobiles & Tablets', slug: 'mobiles-tablets', iconClass: 'fa-mobile-alt', activeAdCount: 15267 },
    { id: 4, name: 'Electronics', slug: 'electronics', iconClass: 'fa-laptop', activeAdCount: 6482 },
    { id: 5, name: 'Home & Furniture', slug: 'home-furniture', iconClass: 'fa-couch', activeAdCount: 7351 },
    { id: 6, name: 'Fashion & Lifestyle', slug: 'fashion-lifestyle', iconClass: 'fa-tshirt', activeAdCount: 5632 },
    { id: 7, name: 'Services', slug: 'services', iconClass: 'fa-tools', activeAdCount: 9845 },
    { id: 8, name: 'Jobs', slug: 'jobs', iconClass: 'fa-briefcase', activeAdCount: 2341 }
  ];

  const fallbackAds = [
    { id: 1, title: 'Hyundai i20 Asta 2021', category: 'vehicles', price: 625000, priceDetail: '₹6,25,000', location: 'Namakkal, Tamil Nadu', contactPhone: '9876543210', description: 'Excellent condition, single owner, comprehensive insurance.', featured: true, imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=300' },
    { id: 2, title: '2BHK Independent House', category: 'property', price: 4200000, priceDetail: '₹42,00,000', location: 'Namakkal, Tamil Nadu', contactPhone: '9988776655', description: 'Gated community, 24/7 water supply, close to main highway.', featured: true, imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=300' },
    { id: 3, title: 'iPhone 14 Pro Max 128GB', category: 'mobiles-tablets', price: 89999, priceDetail: '₹89,999', location: 'Namakkal, Tamil Nadu', contactPhone: '9876512345', description: 'Deep purple color, 94% battery health, with original box and cable.', featured: true, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300' },
    { id: 4, title: '3 Seater L Shape Sofa', category: 'home-furniture', price: 18500, priceDetail: '₹18,500', location: 'Namakkal, Tamil Nadu', contactPhone: '9632107412', description: 'Premium suede fabric, brand new, directly from manufacturing factory.', featured: true, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300' }
  ];

  return (
    <main className="container class-module-container" style={{ paddingTop: '20px' }}>
      
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'Classifieds' : 'வகைப்படுத்தப்பட்டவை'}</span>
      </div>

      {/* HERO BANNER SECTION */}
      <section className="class-hero-banner">
        <div className="class-hero-left">
          <h1 className="class-hero-title">
            {lang === 'en' ? 'Buy, Sell & Discover' : 'வாங்க, விற்க & தேட'}
          </h1>
          <p className="class-hero-subtitle">
            {lang === 'en'
              ? 'Find great deals around you. Post your ad in minutes!'
              : 'உங்களைச் சுற்றியுள்ள சிறந்த சலுகைகளைக் கண்டறியவும். சில நிமிடங்களில் விளம்பரத்தைப் பதிவிடவும்!'}
          </p>
          <div className="class-hero-btns">
            <button className="class-hero-btn-find" onClick={loadAds}>
              {lang === 'en' ? 'Explore Ads' : 'விளம்பரங்களை ஆராய்க'}
            </button>
            <button className="class-hero-btn-post" onClick={() => setShowPostModal(true)}>
              {lang === 'en' ? 'Post a Free Ad' : 'இலவச விளம்பரம்'}
            </button>
          </div>
        </div>

        {/* Float stat badges overlay */}
        <div className="class-stat-badge-float active-ads">
          <i className="fas fa-tags"></i>
          <div>
            <div className="class-stat-number">100% Free</div>
            <div className="class-stat-label">{lang === 'en' ? 'To Post Ads' : 'விளம்பரம் பதிவிட'}</div>
          </div>
        </div>
        <div className="class-stat-badge-float verified-users">
          <i className="fas fa-shield-alt"></i>
          <div>
            <div className="class-stat-number">Verified Users</div>
            <div className="class-stat-label">{lang === 'en' ? 'Safe & Trusted' : 'நம்பகமானவர்கள்'}</div>
          </div>
        </div>

        {/* Right side illustration overlay */}
        <div className="class-banner-illustration" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400")' }}></div>
      </section>

      {/* ADVANCED SEARCH FILTER PANEL */}
      <div className="class-filter-panel">
        <div className="class-filter-row">
          <div className="class-filter-input-wrap" style={{ flex: 1.5 }}>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'What are you looking for?' : 'நீங்கள் என்ன தேடுகிறீர்கள்?'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="class-filter-input-wrap">
            <i className="fas fa-tags"></i>
            <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
              <option value="all">{lang === 'en' ? 'All Categories' : 'அனைத்துப் பிரிவுகள்'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="class-filter-input-wrap">
            <i className="fas fa-map-marker-alt"></i>
            <select value={selectedLoc} onChange={(e) => setSelectedLoc(e.target.value)}>
              <option value="all">{lang === 'en' ? 'Location (All)' : 'இடம் (அனைத்தும்)'}</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{lang === 'en' ? d.nameEn : d.nameTa}</option>
              ))}
            </select>
          </div>

          <button className="class-search-action-btn" onClick={loadAds}>
            {lang === 'en' ? 'Search' : 'தேடுக'}
          </button>
        </div>
      </div>

      {/* QUICK CATEGORIES CIRCLE ROW */}
      <div className="class-quick-cats-row">
        {categories.map(c => (
          <button 
            key={c.id} 
            className={`class-quick-cat-btn ${selectedCat === c.slug ? 'active' : ''}`}
            onClick={() => setSelectedCat(c.slug)}
          >
            <i className={`fas ${c.iconClass}`}></i>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* THREE COLUMN GRID LAYOUT */}
      <div className="class-main-layout">
        
        {/* Left Column: Categories List */}
        <div className="class-sidebar-left">
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px' }}>{lang === 'en' ? 'Browse Categories' : 'வகைகளை உலாவுக'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {categories.map(c => (
                <div 
                  className="class-category-sidebar-item" 
                  key={c.id} 
                  style={{ background: selectedCat === c.slug ? '#f8fafc' : 'none' }}
                  onClick={() => setSelectedCat(c.slug)}
                >
                  <div className="class-category-sidebar-item-left">
                    <i className={`fas ${c.iconClass}`}></i>
                    <span>{c.name}</span>
                  </div>
                  <span className="class-category-sidebar-item-right">{c.activeAdCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Main listings content */}
        <div className="class-middle-content">
          
          {/* Featured Ads section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>
              {lang === 'en' ? 'Featured Ads' : 'சிறப்பு விளம்பரங்கள்'}
            </h2>
            <span style={{ fontSize: '12.5px', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setSelectedCat('all')}>
              {lang === 'en' ? 'View all' : 'அனைத்தையும் பார்க்க'} &rarr;
            </span>
          </div>

          <div className="featured-ads-grid">
            {(ads.length > 0 ? ads : fallbackAds).slice(0, 4).map(ad => (
              <div className="featured-ad-card" key={ad.id} onClick={() => handleOpenDetails(ad)}>
                <div className="featured-ad-img-box" style={{ backgroundImage: `url(${ad.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300'})` }}>
                  <span className="featured-ad-badge">Featured</span>
                  <span className="featured-ad-heart" onClick={(e) => { e.stopPropagation(); alert('Ad Bookmarked!'); }}>
                    <i className="far fa-heart"></i>
                  </span>
                </div>
                <div className="featured-ad-body">
                  <h3 className="featured-ad-title">{ad.title}</h3>
                  <div className="featured-ad-price">{ad.priceDetail}</div>
                  <div className="featured-ad-loc">
                    <i className="fas fa-map-marker-alt"></i> {ad.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Ads section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>
              {lang === 'en' ? 'Latest Ads' : 'சமீபத்திய விளம்பரங்கள்'}
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select 
                value={selectedSort} 
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 8px', fontSize: '11.5px', color: '#475569', fontWeight: '600' }}
              >
                <option value="newest">{lang === 'en' ? 'Sort by: Newest First' : 'வரிசைப்படுத்து: சமீபத்தியது'}</option>
                <option value="price_asc">{lang === 'en' ? 'Price: Low to High' : 'விலை: குறைவு முதல் அதிகம்'}</option>
                <option value="price_desc">{lang === 'en' ? 'Price: High to Low' : 'விலை: அதிகம் முதல் குறைவு'}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', color: '#4f46e5' }}></i>
              <p style={{ marginTop: '10px' }}>{lang === 'en' ? 'Loading classifieds list...' : 'விளம்பரங்கள் ஏற்றப்படுகின்றன...'}</p>
            </div>
          ) : (
            <div className="latest-ads-list">
              {(ads.length > 0 ? ads : fallbackAds).map(ad => (
                <div className="latest-ad-row" key={ad.id} onClick={() => handleOpenDetails(ad)}>
                  <div className="latest-ad-left">
                    <div className="latest-ad-img" style={{ backgroundImage: `url(${ad.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300'})` }}></div>
                    <div className="latest-ad-details">
                      <div className="latest-ad-title-row">
                        <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0 }}>{ad.title}</h3>
                        <span className="latest-ad-negotiable-badge">Negotiable</span>
                      </div>
                      <div className="latest-ad-pills-row">
                        <span className="latest-ad-price-lbl">{ad.priceDetail}</span>
                        <span><i className="fas fa-map-marker-alt"></i> {ad.location}</span>
                        <span><i className="fas fa-clock"></i> 2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    <i className="far fa-heart" style={{ cursor: 'pointer', fontSize: '14px' }}></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Alerts & Hot Deals */}
        <div className="class-sidebar-right">
          
          {/* Megaphone Post Free Ad card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <i className="fas fa-bullhorn" style={{ fontSize: '32px', color: '#4f46e5', marginBottom: '12px' }}></i>
            <h4 style={{ fontSize: '13.5px', fontWeight: '800', margin: '0 0 4px 0' }}>Post Your Ad</h4>
            <p style={{ fontSize: '10.5px', color: '#64748b', margin: '0 0 16px 0' }}>Reach thousands of potential local buyers instantly.</p>
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  alert(lang === 'en' ? "Please login or sign up to post an advertisement." : "விளம்பரம் செய்ய தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.");
                  navigate('/login', { state: { from: '/classifieds' } });
                } else {
                  setShowPostModal(true);
                }
              }}
              style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Post Free Ad
            </button>
          </div>

          {/* Hot Deals Carousel Timer */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#ef4444' }}><i className="fas fa-fire"></i> Hot Deals</span>
              <span style={{ fontSize: '10.5px', color: '#4f46e5', fontWeight: 'bold' }}>View All</span>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="hot-deal-timer-row">
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.days}</span>
                  <span className="hot-deal-timer-lbl">Days</span>
                </div>
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.hours}</span>
                  <span className="hot-deal-timer-lbl">Hrs</span>
                </div>
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.mins}</span>
                  <span className="hot-deal-timer-lbl">Mins</span>
                </div>
                <div className="hot-deal-timer-box">
                  <span className="hot-deal-timer-num">{timeLeft.secs}</span>
                  <span className="hot-deal-timer-lbl">Secs</span>
                </div>
              </div>
              
              <div style={{ margin: '14px 0 8px 0', width: '100%', height: '80px', borderRadius: '8px', backgroundImage: 'url("https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <strong style={{ fontSize: '12px', textAlign: 'center' }}>Samsung 55" 4K Smart TV</strong>
              <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>₹39,999 <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontWeight: 'normal', fontSize: '10px' }}>₹62,999</span></div>
            </div>
          </div>

          {/* Search by Filters widget block */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: '800', margin: 0 }}>Search by Filters</h4>
              <span style={{ fontSize: '11px', color: '#4f46e5', cursor: 'pointer' }} onClick={() => setPriceMax(1000000)}>Clear All</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Price Range</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1000000" 
                  value={priceMax} 
                  onChange={(e) => setPriceMax(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#4f46e5', marginTop: '6px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                  <span>₹0</span>
                  <span>₹{priceMax.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Condition</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', fontSize: '11.5px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="checkbox" checked={conditionNew} onChange={(e) => setConditionNew(e.target.checked)} /> New
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="checkbox" checked={conditionUsed} onChange={(e) => setConditionUsed(e.target.checked)} /> Used
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CLASSIFIED DETAILS VIEW MODAL */}
      {selectedAd && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{selectedAd.title}</h3>
              <button className="modal-close" onClick={() => setSelectedAd(null)}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '260px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${selectedAd.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600'})` }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '13px' }}>
                <div><strong>Price:</strong> <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>{selectedAd.priceDetail}</span></div>
                <div><strong>Location:</strong> {selectedAd.location}</div>
                <div><strong>Condition:</strong> Used</div>
                <div><strong>Negotiable:</strong> Yes</div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0' }}>Product Description</h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 }}>{selectedAd.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <a 
                  href={`tel:${selectedAd.contactPhone}`}
                  style={{ flex: 1, textDecoration: 'none', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                >
                  <i className="fas fa-phone-alt"></i> Call Seller
                </a>
                <button 
                  onClick={() => { setShareAdObj(selectedAd); setShowShareModal(true); }}
                  style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13.5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <i className="far fa-share-square"></i> Share Ad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST AD WIZARD MODAL */}
      {showPostModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Post Your Ad (Step {postStep} of 3)</h3>
              <button className="modal-close" onClick={() => { setShowPostModal(false); setPostStep(1); }}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '0' }}>
              <form onSubmit={handlePostAdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {postStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Product Title *</label>
                      <input 
                        type="text" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required 
                        placeholder="e.g. iPhone 14 Pro Max"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Category *</label>
                        <select 
                          value={newCatId}
                          onChange={(e) => setNewCatId(e.target.value)}
                          required
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        >
                          <option value="">-- Choose Category --</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Price (INR) *</label>
                        <input 
                          type="number" 
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          required 
                          placeholder="e.g. 85000"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setPostStep(2)}
                      style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14.5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                    >
                      Next Step
                    </button>
                  </div>
                )}

                {postStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Brand Name</label>
                        <input 
                          type="text" 
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          placeholder="e.g. Apple"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={newNegotiable}
                            onChange={(e) => setNewNegotiable(e.target.checked)}
                          />
                          Price is negotiable
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Product Description *</label>
                      <textarea 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        required 
                        rows="3"
                        placeholder="Provide details about condition, usage, specifications..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                      ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setPostStep(1)}
                        style={{ background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14.5px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPostStep(3)}
                        style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14.5px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {postStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Contact Phone *</label>
                        <input 
                          type="text" 
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          required 
                          placeholder="e.g. 9876543210"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>District Locality</label>
                        <select 
                          value={newDistrictId}
                          onChange={(e) => setNewDistrictId(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
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
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Image URL 1</label>
                        <input 
                          type="text" 
                          value={imageUrl1}
                          onChange={(e) => setImageUrl1(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Image URL 2</label>
                        <input 
                          type="text" 
                          value={imageUrl2}
                          onChange={(e) => setImageUrl2(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => setPostStep(2)}
                        style={{ background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14.5px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14.5px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Publish Listing
                      </button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && shareAdObj && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Share Deal' : 'பகிர்'}</h3>
              <button className="modal-close" onClick={() => { setShowShareModal(false); setShareAdObj(null); }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '16px 0' }}>
              <button onClick={() => handleShareClick(shareAdObj, 'whatsapp')} style={{ padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-whatsapp"></i> WhatsApp
              </button>
              <button onClick={() => handleShareClick(shareAdObj, 'facebook')} style={{ padding: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
            </div>
            <button 
              onClick={() => handleShareClick(shareAdObj, 'copy')} 
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

export default Classifieds;
