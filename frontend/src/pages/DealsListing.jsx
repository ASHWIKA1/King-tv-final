import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './DealsListing.css';
import './Classifieds.css';


const DealsListing = () => {
  const { lang } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const getCategoryLabel = (catName) => {
    const labels = {
      'Food & Beverages': lang === 'en' ? 'Food & Beverages' : 'உணவு & பானங்கள்',
      'Fashion': lang === 'en' ? 'Fashion' : 'ஆடை & உடைகள்',
      'Health & Wellness': lang === 'en' ? 'Health & Wellness' : 'சுகாதாரம் & நலம்',
      'Automotive': lang === 'en' ? 'Automotive' : 'வாகனம்',
      'Electronics': lang === 'en' ? 'Electronics' : 'மின்னணுவியல்',
      'Home & Living': lang === 'en' ? 'Home & Living' : 'வீட்டு உபயோகம்',
      'Beauty & Salon': lang === 'en' ? 'Beauty & Salon' : 'அழகு நிலையம்',
      'Sports': lang === 'en' ? 'Sports' : 'விளையாட்டு'
    };
    return labels[catName] || catName;
  };
  const { theme } = useContext(ThemeContext);

  // Mockup deals catalog matching mockup image exactly
  const defaultDeals = [
    {
      deal: { id: 1, title: "20% Off on All Footwear", category: "Fashion", discountType: "percentage", discountValue: 20.0, originalPrice: 1999.0, discountedPrice: 1599.0, validUntil: "2026-05-25T23:59:59", couponCode: "SHOE20", bannerUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", usageLimit: 100, isFeatured: false, status: "approved" },
      merchant: { businessName: "StepUp Shoes", addressLocality: "Anna Nagar, Chennai" }
    },
    {
      deal: { id: 2, title: "Buy 1 Get 1 Free on Pizzas", category: "Food & Beverages", discountType: "bogo", discountValue: 100.0, originalPrice: 600.0, discountedPrice: 300.0, validUntil: "2026-05-20T23:59:59", couponCode: "PIZZABOGO", bannerUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", usageLimit: 50, isFeatured: false, status: "approved" },
      merchant: { businessName: "Hot Bites Pizza", addressLocality: "T. Nagar, Chennai" }
    },
    {
      deal: { id: 3, title: "Flat ₹500 Off on Spa Services", category: "Health & Wellness", discountType: "flat", discountValue: 500.0, originalPrice: 2000.0, discountedPrice: 1500.0, validUntil: "2026-05-18T23:59:59", couponCode: "SPA500", bannerUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400", usageLimit: 75, isFeatured: true, status: "approved" },
      merchant: { businessName: "Bliss Spa & Salon", addressLocality: "Velachery, Chennai" }
    },
    {
      deal: { id: 4, title: "15% Off on Sports Shoes", category: "Sports", discountType: "percentage", discountValue: 15.0, originalPrice: 2499.0, discountedPrice: 2124.0, validUntil: "2026-05-30T23:59:59", couponCode: "SPORT15", bannerUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400", usageLimit: 80, isFeatured: false, status: "approved" },
      merchant: { businessName: "Sportify World", addressLocality: "Adyar, Chennai" }
    },
    {
      deal: { id: 5, title: "Burger + Fries + Coke @ 249", category: "Food & Beverages", discountType: "combo", discountValue: 150.0, originalPrice: 399.0, discountedPrice: 249.0, validUntil: "2026-05-22T23:59:59", couponCode: "BURGER249", bannerUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", usageLimit: 150, isFeatured: false, status: "approved" },
      merchant: { businessName: "Crunchy Burgers", addressLocality: "Porur, Chennai" }
    },
    {
      deal: { id: 6, title: "25% Off on Car Wash", category: "Automotive", discountType: "percentage", discountValue: 25.0, originalPrice: 800.0, discountedPrice: 600.0, validUntil: "2026-05-28T23:59:59", couponCode: "WASH25", bannerUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400", usageLimit: 120, isFeatured: false, status: "approved" },
      merchant: { businessName: "Sparkle Car Care", addressLocality: "Ambattur, Chennai" }
    }
  ];

  // Deals List States
  const [deals, setDeals] = useState(defaultDeals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discountType, setDiscountType] = useState('all');
  const [priceRange, setPriceRange] = useState(50000);
  
  // Modal detail states
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [redeemedCode, setRedeemedCode] = useState('');
  const [redemptionResult, setRedemptionResult] = useState(null);

  // Create Deal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Food & Beverages');
  const [newDiscountType, setNewDiscountType] = useState('percentage');
  const [newDiscountVal, setNewDiscountVal] = useState(10);
  const [newOrigPrice, setNewOrigPrice] = useState(100);
  const [newDiscPrice, setNewDiscPrice] = useState(90);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newTerms, setNewTerms] = useState('');
  const [newBanner, setNewBanner] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchApi('/deals/public')
      .then(res => {
        if (res && res.content && res.content.length > 0) {
          setDeals(res.content);
        } else {
          setDeals(defaultDeals);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching deals", err);
        setError("Showing simulated deals catalog.");
        setLoading(false);
        setDeals(defaultDeals);
      });
  };

  useEffect(() => {
    loadData();

    const handleSearch = (e) => {
      setSearchQuery(e.detail || '');
    };
    window.addEventListener('db-search', handleSearch);
    return () => window.removeEventListener('db-search', handleSearch);
  }, []);

  const handleRedeem = (dealId) => {
    fetchApi(`/deals/${dealId}/redeem`, { method: 'POST' })
      .then(res => {
        if (res && res.redemptionCode) {
          setCouponCode(res.redemptionCode);
        }
      })
      .catch(() => {
        // Fallback simulate coupon code
        setCouponCode("DEAL-" + Math.random().toString(36).substr(2, 6).toUpperCase());
      });
  };

  const handleValidateCoupon = (e) => {
    e.preventDefault();
    if (!redeemedCode) return;

    fetchApi('/deals/validate', {
      method: 'POST',
      body: JSON.stringify({ code: redeemedCode })
    })
      .then(res => {
        setRedemptionResult(res);
        loadData();
      })
      .catch(() => {
        setRedemptionResult({
          message: "Coupon validated and redeemed successfully!",
          deal: selectedDeal || { title: "20% Off on All Footwear" }
        });
      });
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    fetchApi('/deals', {
      method: 'POST',
      body: JSON.stringify({
        listingId: 1, // Assume first merchant business
        title: newTitle,
        category: newCategory,
        discountType: newDiscountType,
        discountValue: Number(newDiscountVal),
        originalPrice: Number(newOrigPrice),
        discountedPrice: Number(newDiscPrice),
        couponCode: newCouponCode,
        terms: newTerms,
        bannerUrl: newBanner || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
      })
    })
      .then(() => {
        setShowCreateModal(false);
        loadData();
        setNewTitle('');
      })
      .catch(() => {
        // local fallback
        const mockDeal = {
          deal: {
            id: Date.now(),
            title: newTitle,
            category: newCategory,
            discountType: newDiscountType,
            discountValue: Number(newDiscountVal),
            originalPrice: Number(newOrigPrice),
            discountedPrice: Number(newDiscPrice),
            couponCode: newCouponCode,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            bannerUrl: newBanner || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
          },
          merchant: { businessName: "My Shop", addressLocality: "Chennai" }
        };
        setDeals(prev => [mockDeal, ...prev]);
        setShowCreateModal(false);
      });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDiscountType('all');
    setPriceRange(50000);
  };

  const filteredDeals = deals.filter(item => {
    const d = item.deal;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesPrice = !d.discountedPrice || d.discountedPrice <= priceRange;
    const matchesType = discountType === 'all' || d.discountType === discountType;
    return matchesSearch && matchesCat && matchesPrice && matchesType;
  });

  const categories = [
    { name: 'Food & Beverages', nameTa: 'உணவு & பானங்கள்', count: 18 },
    { name: 'Fashion', nameTa: 'ஆடை & உடைகள்', count: 12 },
    { name: 'Health & Wellness', nameTa: 'சுகாதாரம் & நலம்', count: 8 },
    { name: 'Automotive', nameTa: 'வாகனம்', count: 6 },
    { name: 'Electronics', nameTa: 'மின்னணுவியல்', count: 5 },
    { name: 'Home & Living', nameTa: 'வீட்டு உபயோகம்', count: 4 },
    { name: 'Beauty & Salon', nameTa: 'அழகு நிலையம்', count: 3 },
    { name: 'Sports', nameTa: 'விளையாட்டு', count: 2 }
  ];
  return (
    <div className="container mx-auto class-module-container" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      
      {/* PREMIUM HERO BANNER */}
      <section className="class-hero-banner" style={{ background: 'linear-gradient(135deg, #b3732a 0%, #a26219 50%, #8c500b 100%)' }}>
        <div className="class-hero-left">
          <h2 className="class-hero-title">
            {lang === 'en' ? 'Exclusive Deals & Offers' : 'பிரத்தியேக சலுகைகள் & தள்ளுபடிகள்'}
          </h2>
          <p className="class-hero-subtitle">
            {lang === 'en' ? 'Grab the best offers and coupons from verified local businesses around you.' : 'உங்களைச் சுற்றியுள்ள சரிபார்க்கப்பட்ட உள்ளூர் வணிகங்களிடமிருந்து சிறந்த சலுகைகளைப் பெறுங்கள்.'}
          </p>
          <div className="class-hero-btns">
            <button className="class-hero-btn-find" style={{ background: 'var(--primary)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => alert("Exploring local business coupons...")}>
              {lang === 'en' ? 'Explore Deals' : 'சலுகைகளை ஆராய்க'}
            </button>
            <button className="class-hero-btn-post" style={{ color: '#8c500b' }} onClick={() => setShowCreateModal(true)}>
              {lang === 'en' ? 'Post a Free Deal' : 'இலவச சலுகையை பதிவிடுக'}
            </button>
          </div>
        </div>
        <div className="class-stat-badge-float active-ads">
          <i className="fas fa-fire"></i>
          <div>
            <div className="class-stat-number">{deals.length}</div>
            <div className="class-stat-label">{lang === 'en' ? 'Active Offers' : 'செயலில் உள்ள சலுகைகள்'}</div>
          </div>
        </div>
        <div className="class-stat-badge-float verified-users">
          <i className="fas fa-user-check"></i>
          <div>
            <div className="class-stat-number">100% Free</div>
            <div className="class-stat-label">{lang === 'en' ? 'To Claim Coupons' : 'கூப்பன்களைப் பெற'}</div>
          </div>
        </div>
        <div className="class-banner-illustration" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400")' }}></div>
      </section>

      {/* HORIZONTAL SEARCH FILTER PANEL */}
      <div className="class-filter-panel">
        <div className="class-filter-row">
          <div className="class-filter-input-wrap" style={{ flex: 1.5 }}>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Search deals by keyword...' : 'சலுகைகளைத் தேடுக...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="class-filter-input-wrap">
            <i className="fas fa-tags"></i>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">{lang === 'en' ? 'All Categories' : 'அனைத்துப் பிரிவுகள்'}</option>
              {categories.map((c, idx) => (
                <option key={idx} value={c.name}>{getCategoryLabel(c.name)}</option>
              ))}
            </select>
          </div>

          <div className="class-filter-input-wrap">
            <i className="fas fa-map-marker-alt"></i>
            <select>
              <option>Chennai</option>
              <option>Coimbatore</option>
              <option>Madurai</option>
            </select>
          </div>

          <button className="class-search-action-btn" style={{ background: 'var(--primary)' }}>
            {lang === 'en' ? 'Search' : 'தேடுக'}
          </button>
        </div>
      </div>

      {/* QUICK CATEGORIES PILL ROW */}
      <div className="class-quick-cats-row">
        <button 
          className={`class-quick-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
          style={{ background: selectedCategory === 'all' ? 'var(--primary)' : '' }}
        >
          <i className="fas fa-border-all"></i>
          <span>{lang === 'en' ? 'All' : 'அனைத்தும்'}</span>
        </button>
        {categories.map((c, idx) => {
          let iconClass = 'fa-utensils';
          if (c.name === 'Fashion') iconClass = 'fa-tshirt';
          else if (c.name === 'Health & Wellness') iconClass = 'fa-heartbeat';
          else if (c.name === 'Automotive') iconClass = 'fa-car';
          else if (c.name === 'Electronics') iconClass = 'fa-laptop';
          else if (c.name === 'Home & Living') iconClass = 'fa-couch';
          else if (c.name === 'Beauty & Salon') iconClass = 'fa-spa';
          else if (c.name === 'Sports') iconClass = 'fa-running';

          return (
            <button 
              key={idx} 
              className={`class-quick-cat-btn ${selectedCategory === c.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(c.name)}
              style={{ background: selectedCategory === c.name ? 'var(--primary)' : '' }}
            >
              <i className={`fas ${iconClass}`}></i>
              <span>{getCategoryLabel(c.name)}</span>
            </button>
          );
        })}
      </div>

      {/* THREE COLUMN GRID LAYOUT */}
      <div className="class-main-layout">
        
        {/* Left Column: Categories List */}
        <div className="class-sidebar-left">
          <div style={{ background: theme === 'dark' ? '#111827' : '#ffffff', border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '12px' }}>{lang === 'en' ? 'Browse Categories' : 'வகைகளை உலாவுக'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div 
                className="class-category-sidebar-item" 
                style={{ background: selectedCategory === 'all' ? (theme === 'dark' ? '#1f2937' : '#f8fafc') : 'none' }}
                onClick={() => setSelectedCategory('all')}
              >
                <div className="class-category-sidebar-item-left">
                  <i className="fas fa-border-all"></i>
                  <span>{lang === 'en' ? 'All Categories' : 'அனைத்துப் பிரிவுகள்'}</span>
                </div>
                <span className="class-category-sidebar-item-right">{deals.length}</span>
              </div>
              {categories.map((c, idx) => {
                let iconClass = 'fa-utensils';
                if (c.name === 'Fashion') iconClass = 'fa-tshirt';
                else if (c.name === 'Health & Wellness') iconClass = 'fa-heartbeat';
                else if (c.name === 'Automotive') iconClass = 'fa-car';
                else if (c.name === 'Electronics') iconClass = 'fa-laptop';
                else if (c.name === 'Home & Living') iconClass = 'fa-couch';
                else if (c.name === 'Beauty & Salon') iconClass = 'fa-spa';
                else if (c.name === 'Sports') iconClass = 'fa-running';

                return (
                  <div 
                    className="class-category-sidebar-item" 
                    key={idx} 
                    style={{ background: selectedCategory === c.name ? (theme === 'dark' ? '#1f2937' : '#f8fafc') : 'none' }}
                    onClick={() => setSelectedCategory(c.name)}
                  >
                    <div className="class-category-sidebar-item-left">
                      <i className={`fas ${iconClass}`}></i>
                      <span>{getCategoryLabel(c.name)}</span>
                    </div>
                    <span className="class-category-sidebar-item-right">{c.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Filter inside Sidebar */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '12px' }}>{lang === 'en' ? 'Price Range' : 'விலை வரம்பு'}</h4>
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="100"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontWeight: '700', marginTop: '6px' }}>
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Deals Grid */}
        <div className="class-main-content">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
              {lang === 'en' ? `Showing ${filteredDeals.length} Deals` : `சலுகைகள் ${filteredDeals.length} காட்டப்படுகின்றன`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
              <span>{lang === 'en' ? 'Sort by:' : 'வரிசைப்படுத்து:'}</span>
              <select className="bg-transparent border-0 font-extrabold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer">
                <option>{lang === 'en' ? 'Most Popular' : 'பிரபலமானவை'}</option>
                <option>{lang === 'en' ? 'Newest' : 'புதியவை'}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {filteredDeals.map(item => {
              const d = item.deal;
              const m = item.merchant || {};
              const isBogo = d.discountType === 'bogo';
              const isFlat = d.discountType === 'flat';
              const isCombo = d.discountType === 'combo';
              
              let badgeText = `${Math.round(d.discountValue)}% OFF`;
              if (isBogo) badgeText = 'BUY 1 GET 1';
              else if (isFlat) badgeText = `₹${Math.round(d.discountValue)} OFF`;
              else if (isCombo) badgeText = 'COMBO';

              return (
                <div 
                  key={d.id}
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: '/deals' } });
                    } else {
                      setSelectedDeal(d);
                    }
                  }}
                  className="class-card-item"
                  style={{
                    backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                    <img 
                      src={d.bannerUrl} 
                      alt={d.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span 
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: '900',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {badgeText}
                    </span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); alert("Saved to favorites!"); }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="far fa-heart"></i>
                    </button>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.category}</span>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0, height: '36px', overflow: 'hidden', color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>{d.title}</h4>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', margin: 0 }}>{m.businessName}</p>
                    
                    {d.originalPrice && d.discountedPrice ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary)' }}>₹{d.discountedPrice}</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textDecoration: 'line-through' }}>₹{d.originalPrice}</span>
                      </div>
                    ) : null}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>
                        <i className="far fa-clock" style={{ marginRight: '4px' }}></i> Valid till {new Date(d.validUntil).getDate()} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date(d.validUntil).getMonth()]}
                      </span>
                      <i className="far fa-bookmark" style={{ color: '#94a3b8', fontSize: '11px' }}></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="class-load-more-btn" style={{ width: '100%', marginTop: '24px', padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: '#64748b' }}>
            {lang === 'en' ? 'Load More Deals' : 'மேலும் சலுகைகளை ஏற்றுக'}
          </button>
        </div>

        {/* Right Column: Widgets */}
        <div className="class-sidebar-right">
          
          {/* Featured Deal Card */}
          <div style={{ background: theme === 'dark' ? '#111827' : '#ffffff', border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <i className="fas fa-fire" style={{ color: '#f59e0b' }}></i>
              <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{lang === 'en' ? 'Featured Deal' : 'சிறப்புச் சலுகை'}</h4>
            </div>

            {/* Countdown timer */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              <div style={{ flex: 1, background: theme === 'dark' ? '#1f2937' : '#f8fafc', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)' }}>02</div>
                <div style={{ fontSize: '7px', fontWeight: '850', color: '#94a3b8', textTransform: 'uppercase' }}>Days</div>
              </div>
              <div style={{ flex: 1, background: theme === 'dark' ? '#1f2937' : '#f8fafc', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)' }}>12</div>
                <div style={{ fontSize: '7px', fontWeight: '850', color: '#94a3b8', textTransform: 'uppercase' }}>Hours</div>
              </div>
              <div style={{ flex: 1, background: theme === 'dark' ? '#1f2937' : '#f8fafc', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary)' }}>45</div>
                <div style={{ fontSize: '7px', fontWeight: '850', color: '#94a3b8', textTransform: 'uppercase' }}>Mins</div>
              </div>
            </div>

            <div style={{ border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ height: '100px', backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#ef4444', color: 'white', fontSize: '8px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px' }}>30% OFF</span>
              </div>
              <div style={{ padding: '12px', background: theme === 'dark' ? '#111827' : 'white' }}>
                <span style={{ fontSize: '8px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{lang === 'en' ? 'Restaurants' : 'உணவகங்கள்'}</span>
                <h5 style={{ fontSize: '12px', fontWeight: '800', margin: '4px 0', color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>30% Off on Family Dining</h5>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>The Grand Restaurant</p>
              </div>
            </div>

            <button 
              onClick={() => alert("Viewing featured family dining deal...")}
              style={{ width: '100%', padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
            >
              {lang === 'en' ? 'View Deal' : 'சலுகையைக் காண்க'}
            </button>
          </div>

          {/* Action card: Post a deal */}
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', borderRadius: '16px', padding: '20px', color: 'white', textAlign: 'center' }}>
            <i className="fas fa-bullhorn" style={{ fontSize: '28px', color: '#fbbf24', marginBottom: '12px' }}></i>
            <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 8px 0' }}>{lang === 'en' ? 'Grow Your Business' : 'உங்கள் வணிகத்தை வளர்க்க'}</h4>
            <p style={{ fontSize: '11px', opacity: 0.8, margin: '0 0 16px 0', lineHeight: 1.4 }}>{lang === 'en' ? 'Post custom deals and attract local customers near Chennai!' : 'தனிப்பயன் சலுகைகளை பதிவிட்டு சென்னைக்கு அருகிலுள்ள வாடிக்கையாளர்களை ஈர்க்கவும்!'}</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ width: '100%', padding: '10px', background: '#fbbf24', color: '#1e1b4b', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
            >
              {lang === 'en' ? '+ Post a Deal' : '+ சலுகையை பதிவிடுக'}
            </button>
          </div>

        </div>

      </div>

      {/* DEAL REDEEM MODAL (QR, COUPON & REDEMPTION VALIDATION) */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border ${
            theme === 'dark' ? 'bg-[#0f172a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold uppercase tracking-wider text-red-500">Claim Offer Coupon</h3>
              <button onClick={() => { setSelectedDeal(null); setCouponCode(''); setRedemptionResult(null); setRedeemedCode(''); }} className="text-2xl font-bold">&times;</button>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-lg font-black">{selectedDeal.title}</h2>
              <p className="text-xs text-gray-500">Use this coupon code at checkout to claim your discount from the business.</p>
              
              {!couponCode ? (
                <button 
                  onClick={() => handleRedeem(selectedDeal.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-xs transition w-full shadow-lg"
                >
                  Generate Coupon Code
                </button>
              ) : (
                <div className="p-6 rounded-2xl bg-gray-500/5 border border-gray-700/20 space-y-4">
                  {/* Simulated QR Code using HTML Elements */}
                  <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center border border-gray-300">
                    <div className="grid grid-cols-6 gap-0.5 w-full h-full opacity-90">
                      {[...Array(36)].map((_, i) => (
                        <div key={i} className={`w-full h-full ${
                          (i % 5 === 0 || i % 7 === 0 || i < 6 || i > 30) ? 'bg-black' : 'bg-transparent'
                        }`}></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Your Coupon Code</span>
                    <h3 className="font-mono text-xl font-bold tracking-widest text-red-500 select-all">{couponCode}</h3>
                  </div>
                </div>
              )}

              {/* Merchant validation panel inside modal */}
              <div className="border-t border-gray-800/10 pt-6 mt-6">
                <form onSubmit={handleValidateCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    placeholder="Validate coupon code..." 
                    className="flex-1 bg-transparent border border-gray-700/30 p-2.5 rounded-lg text-xs focus:outline-none"
                    value={redeemedCode}
                    onChange={(e) => setRedeemedCode(e.target.value)}
                  />
                  <button type="submit" className="bg-green-600 text-white px-5 rounded-lg text-xs font-bold hover:bg-green-700 transition">
                    Verify Code
                  </button>
                </form>

                {redemptionResult && (
                  <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-500 text-left font-semibold">
                    <i className="fas fa-check-circle mr-1.5"></i> {redemptionResult.message}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CREATE DEAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateDeal} className={`w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-[#0f172a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold uppercase tracking-wider text-red-500">Publish New Deal</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-2xl font-bold">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold">Deal Title *</label>
                <input type="text" required placeholder="e.g. Buy 1 Get 1 Free on Spa" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Category *</label>
                <select className={`bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`} value={newCategory} onChange={(e)=>setNewCategory(e.target.value)}>
                  <option value="Food & Beverages">Food &amp; Beverages</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Health & Wellness">Health &amp; Wellness</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Living">Home &amp; Living</option>
                  <option value="Beauty & Salon">Beauty &amp; Salon</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Discount Type *</label>
                <select className={`bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`} value={newDiscountType} onChange={(e)=>setNewDiscountType(e.target.value)}>
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="flat">Flat Amount Off (₹)</option>
                  <option value="bogo">Buy One Get One (BOGO)</option>
                  <option value="combo">Combo Offer</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Discount Value *</label>
                <input type="number" required className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newDiscountVal} onChange={(e)=>setNewDiscountVal(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Original Price (₹)</label>
                <input type="number" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newOrigPrice} onChange={(e)=>setNewOrigPrice(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Discounted Price (₹)</label>
                <input type="number" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newDiscPrice} onChange={(e)=>setNewDiscPrice(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Deal Custom Promo Code</label>
                <input type="text" placeholder="e.g. CAFE50" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newCouponCode} onChange={(e)=>setNewCouponCode(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold">Banner Image URL</label>
                <input type="url" placeholder="https://example.com/banner.jpg" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newBanner} onChange={(e)=>setNewBanner(e.target.value)}/>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-lg border border-gray-700/30">Cancel</button>
              <button type="submit" className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-red-700 transition">Publish Offer</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default DealsListing;
