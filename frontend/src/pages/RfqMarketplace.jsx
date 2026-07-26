import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './RfqMarketplace.css';
import './Classifieds.css';


const RfqMarketplace = () => {
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const defaultRfqs = [
    {
      rfq: { id: 1, title: "Need 500 Custom Printed T-Shirts", category: "Printing", description: "High quality cotton t-shirts with front and back print. Sizes: S to XXL.", quantity: 500, budget: "50,000 - 80,000", location: "Chennai, TN", deadline: "2026-05-25T23:59:59", status: "open" },
      quotesCount: 12
    },
    {
      rfq: { id: 2, title: "Interior Work for 3BHK Apartment", category: "Interior", description: "Modular kitchen, wardrobes, false ceiling and painting work.", quantity: 1, budget: "2,00,000 - 3,50,000", location: "Tambaram, Chennai", deadline: "2026-05-28T23:59:59", status: "open" },
      quotesCount: 8
    },
    {
      rfq: { id: 3, title: "AC Maintenance for 10 Offices", category: "Services", description: "Quarterly maintenance for 10 split AC units in office spaces.", quantity: 10, budget: "15,000 - 25,000", location: "Guindy, Chennai", deadline: "2026-05-26T23:59:59", status: "open" },
      quotesCount: 5
    }
  ];

  // RFQ Lists State
  const [rfqs, setRfqs] = useState(defaultRfqs);
  const [loading, setLoading] = useState(true);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [quotesList, setQuotesList] = useState([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedLoc, setSelectedLoc] = useState('all');

  // Submit quote state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteTimeline, setQuoteTimeline] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteAttachment, setQuoteAttachment] = useState('');

  // Post RFQ state
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Printing');
  const [newQty, setNewQty] = useState(1);
  const [newBudget, setNewBudget] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [hover1, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchApi('/rfq')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRfqs(data);
        } else {
          setRfqs(defaultRfqs);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setRfqs(defaultRfqs);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRfqClick = (item) => {
    setSelectedRfq(item.rfq);
    
    // Fetch proposals
    fetchApi(`/rfq/${item.rfq.id}/quotes`)
      .then(quotes => {
        if (Array.isArray(quotes)) {
          setQuotesList(quotes);
        }
      })
      .catch(() => {
        // Fallbacks matching mockup bids list
        setQuotesList([
          { quote: { id: 101, rfqId: item.rfq.id, quotedPrice: 48000.0, timelineDays: 10, notes: "We use premium combed cotton with durable screen printing. Delivery is guaranteed within 10 days.", status: "shortlisted" }, seller: { businessName: "Vignesh Printers", addressLocality: "Anna Nagar, Chennai" } },
          { quote: { id: 102, rfqId: item.rfq.id, quotedPrice: 52000.0, timelineDays: 7, notes: "Express delivery support included. Custom tagging available.", status: "pending" }, seller: { businessName: "Chennai Screen Arts", addressLocality: "T. Nagar, Chennai" } }
        ]);
      });
  };

  const handlePostRfq = (e) => {
    e.preventDefault();
    fetchApi('/rfq', {
      method: 'POST',
      body: JSON.stringify({
        title: newTitle,
        category: newCategory,
        quantity: Number(newQty),
        budget: newBudget,
        location: newLoc,
        deadline: newDeadline ? new Date(newDeadline).toISOString() : new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        description: newDesc
      })
    })
      .then(() => {
        setShowRfqModal(false);
        loadData();
        setNewTitle('');
        setNewDesc('');
      })
      .catch(() => {
        // Simulate local append
        const mockRfq = {
          rfq: {
            id: Date.now(),
            title: newTitle,
            category: newCategory,
            quantity: Number(newQty),
            budget: newBudget,
            location: newLoc,
            deadline: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
            description: newDesc,
            status: "open"
          },
          quotesCount: 0
        };
        setRfqs(prev => [mockRfq, ...prev]);
        setShowRfqModal(false);
      });
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!selectedRfq) return;

    fetchApi(`/rfq/${selectedRfq.id}/quotes`, {
      method: 'POST',
      body: JSON.stringify({
        sellerBusinessId: 1, // Assume first merchant business
        quotedPrice: Number(quotePrice),
        timelineDays: Number(quoteTimeline),
        notes: quoteNotes,
        proposalUrl: quoteAttachment
      })
    })
      .then(() => {
        setShowQuoteForm(false);
        setQuotePrice('');
        setQuoteTimeline('');
        setQuoteNotes('');
        handleRfqClick({ rfq: selectedRfq });
      })
      .catch(() => {
        // simulate local addition
        const mockQuote = {
          quote: {
            id: Date.now(),
            quotedPrice: Number(quotePrice),
            timelineDays: Number(quoteTimeline),
            notes: quoteNotes,
            status: "pending"
          },
          seller: { businessName: "My Local Shop", addressLocality: "Chennai" }
        };
        setQuotesList(prev => [mockQuote, ...prev]);
        setShowQuoteForm(false);
        setQuotePrice('');
        setQuoteTimeline('');
        setQuoteNotes('');
      });
  };

  const handleQuoteStatusChange = (quoteId, status) => {
    fetchApi(`/rfq/quotes/${quoteId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
      .then(() => {
        if (selectedRfq) handleRfqClick({ rfq: selectedRfq });
        loadData();
      })
      .catch(() => {
        // local toggle state update fallback
        setQuotesList(prev => prev.map(q => q.quote.id === quoteId ? { ...q, quote: { ...q.quote, status } } : q));
      });
  };

  const filteredRfqs = rfqs.filter(item => {
    const r = item.rfq;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || r.category === selectedCat;
    const matchesLoc = selectedLoc === 'all' || r.location.includes(selectedLoc);
    return matchesSearch && matchesCat && matchesLoc;
  });

  const categories = [
    { name: 'Construction', count: 125, icon: 'fa-building', color: 'text-orange-500' },
    { name: 'Printing', count: 84, icon: 'fa-print', color: 'text-blue-500' },
    { name: 'Fabrication', count: 67, icon: 'fa-tools', color: 'text-green-500' },
    { name: 'Events', count: 53, icon: 'fa-birthday-cake', color: 'text-pink-500' },
    { name: 'IT Services', count: 41, icon: 'fa-laptop-code', color: 'text-indigo-500' }
  ];

  return (
    <div style={{ background: theme === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: '100vh', width: '100%', paddingBottom: '60px' }}>
      
      <div 
        className="class-module-container" 
        style={{ 
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >

        {/* PREMIUM HERO BANNER */}
        <section className="class-hero-banner" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #3730a3 100%)' }}>
          <div className="class-hero-left">
            <h2 className="class-hero-title">
              {lang === 'en' ? 'Get Custom Business Quotes' : 'வணிகங்களிடமிருந்து கட்டண விவரங்களைப் பெறுக'}
            </h2>
            <p className="class-hero-subtitle">
              {lang === 'en' ? 'Compare responses, check ratings, and hire the best professionals for your projects.' : 'கட்டண விவரங்களை ஒப்பிட்டு, மதிப்பீடுகளைச் சரிபார்த்து, உங்கள் திட்டங்களுக்கான சிறந்த நிபுணர்களை நியமிக்கவும்.'}
            </p>
            <div className="class-hero-btns">
              <button className="class-hero-btn-find" style={{ background: '#4f46e5', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => alert("Browsing all open RFQs...")}>
                {lang === 'en' ? 'Browse Requests' : 'கோரிக்கைகளை உலாவுக'}
              </button>
              <button className="class-hero-btn-post" style={{ color: '#4f46e5' }} onClick={() => setShowRfqModal(true)}>
                {lang === 'en' ? 'Post a New RFQ' : 'புதிய கோரிக்கையைத் தொடங்கு'}
              </button>
            </div>
          </div>
          <div className="class-stat-badge-float active-ads">
            <i className="fas fa-file-signature"></i>
            <div>
              <div className="class-stat-number">{rfqs.length}</div>
              <div className="class-stat-label">{lang === 'en' ? 'Open RFQs' : 'செயலில் உள்ளவை'}</div>
            </div>
          </div>
          <div className="class-stat-badge-float verified-users">
            <i className="fas fa-handshake"></i>
            <div>
              <div className="class-stat-number">100% Verified</div>
              <div className="class-stat-label">{lang === 'en' ? 'Local Sellers' : 'சரிபார்க்கப்பட்ட விற்பனையாளர்கள்'}</div>
            </div>
          </div>
          <div className="class-banner-illustration" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400")' }}></div>
        </section>

        {/* HORIZONTAL SEARCH FILTER PANEL */}
        <div className="class-filter-panel">
          <div className="class-filter-row">
            <div className="class-filter-input-wrap" style={{ flex: 1.5 }}>
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search RFQ by title, category, or keyword...' : 'RFQ கோரிக்கைகளைத் தேடுக...'} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="class-filter-input-wrap">
              <i className="fas fa-tags"></i>
              <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                <option value="all">{lang === 'en' ? 'All Categories' : 'அனைத்துப் பிரிவுகள்'}</option>
                <option value="Printing">{lang === 'en' ? 'Printing' : 'அச்சிடுதல்'}</option>
                <option value="Interior">{lang === 'en' ? 'Interior' : 'உள் அலங்காரம்'}</option>
                <option value="Services">{lang === 'en' ? 'Services' : 'சேவைகள்'}</option>
              </select>
            </div>

            <div className="class-filter-input-wrap">
              <i className="fas fa-map-marker-alt"></i>
              <select value={selectedLoc} onChange={(e) => setSelectedLoc(e.target.value)}>
                <option value="all">{lang === 'en' ? 'Location (All)' : 'இடம் (அனைத்தும்)'}</option>
                <option value="Chennai">Chennai</option>
                <option value="TN">Tamil Nadu</option>
              </select>
            </div>

            <button className="class-search-action-btn" style={{ background: '#4f46e5' }} onClick={loadData}>
              {lang === 'en' ? 'Search' : 'தேடுக'}
            </button>
          </div>
        </div>

        {/* QUICK CATEGORIES PILL ROW */}
        <div className="class-quick-cats-row">
          <button 
            className={`class-quick-cat-btn ${selectedCat === 'all' ? 'active' : ''}`}
            onClick={() => { setSelectedCat('all'); setSelectedLoc('all'); }}
            style={{ background: selectedCat === 'all' ? '#4f46e5' : '' }}
          >
            <i className="fas fa-border-all"></i>
            <span>{lang === 'en' ? 'All Categories' : 'அனைத்தும்'}</span>
          </button>
          {categories.map((c, idx) => (
            <button 
              key={idx} 
              className={`class-quick-cat-btn ${selectedCat === c.name ? 'active' : ''}`}
              onClick={() => setSelectedCat(c.name)}
              style={{ background: selectedCat === c.name ? '#4f46e5' : '' }}
            >
              <i className={`fas ${c.icon}`}></i>
              <span>{c.name}</span>
            </button>
          ))}
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
                  style={{ background: selectedCat === 'all' ? (theme === 'dark' ? '#1f2937' : '#f8fafc') : 'none' }}
                  onClick={() => setSelectedCat('all')}
                >
                  <div className="class-category-sidebar-item-left">
                    <i className="fas fa-border-all"></i>
                    <span>{lang === 'en' ? 'All Categories' : 'அனைத்துப் பிரிவுகள்'}</span>
                  </div>
                  <span className="class-category-sidebar-item-right">{rfqs.length}</span>
                </div>
                {categories.map((c, idx) => (
                  <div 
                    className="class-category-sidebar-item" 
                    key={idx} 
                    style={{ background: selectedCat === c.name ? (theme === 'dark' ? '#1f2937' : '#f8fafc') : 'none' }}
                    onClick={() => setSelectedCat(c.name)}
                  >
                    <div className="class-category-sidebar-item-left">
                      <i className={`fas ${c.icon}`}></i>
                      <span>{c.name}</span>
                    </div>
                    <span className="class-category-sidebar-item-right">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: RFQs List */}
          <div className="class-main-content">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
                {lang === 'en' ? `Showing ${filteredRfqs.length} RFQ Requests` : `RFQ கோரிக்கைகள் ${filteredRfqs.length} காட்டப்படுகின்றன`}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
                <span>{lang === 'en' ? 'Sort by:' : 'வரிசைப்படுத்து:'}</span>
                <select className="bg-transparent border-0 font-extrabold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer">
                  <option>{lang === 'en' ? 'Latest' : 'புதியவை'}</option>
                  <option>{lang === 'en' ? 'Budget: High to Low' : 'விலை: உயர்விலிருந்து தாழ்வு'}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map(n => (
                  <div key={n} className="animate-pulse rounded-2xl h-32 bg-gray-500/10 border border-gray-700/10 p-4"></div>
                ))}
              </div>
            ) : filteredRfqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', border: '2px dashed #e2e8f0', borderRadius: '24px' }}>
                <i className="fas fa-file-signature" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '16px' }}></i>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 8px 0' }}>{lang === 'en' ? 'No RFQs found' : 'RFQ கோரிக்கைகள் எதுவும் இல்லை'}</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{lang === 'en' ? 'Try adjusting your filters or search query.' : 'வடிகட்டிகள் அல்லது தேடல் சொல்லை மாற்றவும்.'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredRfqs.map(item => {
                  const r = item.rfq;
                  const isInterior = r.category.toLowerCase() === 'interior';
                  
                  let bannerImg = 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300';
                  if (isInterior) {
                    bannerImg = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300';
                  } else if (r.category.toLowerCase() === 'services') {
                    bannerImg = 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=300';
                  }

                  const catColors = {
                    printing: { bg: '#f5f3ff', text: '#7c3aed' },
                    interior: { bg: '#eff6ff', text: '#2563eb' },
                    services: { bg: '#ecfdf5', text: '#059669' },
                    construction: { bg: '#fff7ed', text: '#ea580c' },
                  };
                  const currentCatColor = catColors[r.category.toLowerCase()] || { bg: '#f1f5f9', text: '#475569' };

                  return (
                    <div 
                      key={r.id}
                      onClick={() => handleRfqClick(item)}
                      className="class-card-item"
                      style={{
                        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
                        border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        gap: '20px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                        transition: 'all 0.3s'
                      }}
                    >
                      <img 
                        src={bannerImg} 
                        alt={r.title} 
                        style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>
                          <span 
                            style={{
                              background: currentCatColor.bg,
                              color: currentCatColor.text,
                              fontSize: '9px',
                              fontWeight: '800',
                              letterSpacing: '0.6px',
                              textTransform: 'uppercase',
                              padding: '3px 8px',
                              borderRadius: '20px',
                              display: 'inline-block'
                            }}
                          >
                            {r.category}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '4px 0 2px 0', color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>{r.title}</h4>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 6px 0', lineHeight: '1.4' }}>{r.description}</p>
                        
                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '10.5px', color: '#475569', fontWeight: '600' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-box text-gray-400"></i> {r.quantity} {r.category === 'Interior' ? 'Project' : 'Units'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-wallet text-gray-400"></i> ₹{r.budget}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-map-marker-alt text-gray-400"></i> {r.location}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', fontSize: '9.5px', color: '#94a3b8', marginTop: '10px', paddingTop: '8px', borderTop: theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9' }}>
                          <span><i className="far fa-clock"></i> Deadline: {new Date(r.deadline).getDate()} {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date(r.deadline).getMonth()]}</span>
                          <span><i className="far fa-comments"></i> {item.quotesCount} {lang === 'en' ? 'proposals' : 'முன்மொழிவுகள்'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderLeft: theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9', paddingLeft: '16px', minWidth: '110px' }}>
                        <strong style={{ fontSize: '16px', fontWeight: '900', color: theme === 'dark' ? '#f8fafc' : '#334155' }}>{item.quotesCount}</strong>
                        <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>{lang === 'en' ? 'Bids' : 'மதிப்பீடுகள்'}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRfqClick(item); }}
                          style={{
                            marginTop: '12px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #4f46e5',
                            color: '#4f46e5',
                            background: 'transparent',
                            fontSize: '9.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {lang === 'en' ? 'View Quotes' : 'விவரங்கள்'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button className="class-load-more-btn" style={{ width: '100%', marginTop: '24px', padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: '#64748b' }}>
              {lang === 'en' ? 'Load More RFQs' : 'மேலும் கோரிக்கைகளை ஏற்றுக'}
            </button>
          </div>

          {/* Right Column: Widgets */}
          <div className="class-sidebar-right">
            
            {/* Quick Action card: Post a Request */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', borderRadius: '16px', padding: '24px', color: 'white', textAlign: 'center', marginBottom: '20px' }}>
              <i className="fas fa-file-invoice" style={{ fontSize: '32px', color: '#fbbf24', marginBottom: '12px' }}></i>
              <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 8px 0' }}>{lang === 'en' ? 'Need a Custom Quote?' : 'கட்டண விவரம் தேவையா?'}</h4>
              <p style={{ fontSize: '11px', opacity: 0.8, margin: '0 0 16px 0', lineHeight: 1.4 }}>{lang === 'en' ? 'Post a Request for Quotation (RFQ) and get quotes from certified suppliers in Chennai.' : 'புதிய கோரிக்கையைத் தொடங்குங்கள், சென்னைக்கு அருகிலுள்ள சரிபார்க்கப்பட்ட விற்பனையாளர்களிடம் சலுகைகளைப் பெறுங்கள்.'}</p>
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: '/rfq' } });
                  } else {
                    setShowRfqModal(true);
                  }
                }}
                style={{ width: '100%', padding: '10px', background: '#fbbf24', color: '#1e1b4b', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
              >
                {lang === 'en' ? '+ Post a New RFQ' : '+ புதிய RFQ கோரிக்கை'}
              </button>
            </div>

            {/* RFQ Stats Widget */}
            <div style={{ background: theme === 'dark' ? '#111827' : '#ffffff', border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', uppercase: true, marginBottom: '16px' }}>{lang === 'en' ? 'Marketplace Stats' : 'சந்தை புள்ளிவிவரங்கள்'}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#f5f3ff', border: '1px solid #ede9fe', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#6d28d9', margin: 0 }}>{rfqs.length}</h4>
                  <p style={{ fontSize: '8px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase', marginTop: '2px', margin: 0 }}>{lang === 'en' ? 'Active RFQs' : 'செயலில் உள்ளவை'}</p>
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#1d4ed8', margin: 0 }}>18</h4>
                  <p style={{ fontSize: '8px', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', marginTop: '2px', margin: 0 }}>{lang === 'en' ? 'Quotes' : 'சலுகைகள்'}</p>
                </div>
              </div>
            </div>

            {/* Recent RFQs */}
            <div style={{ background: theme === 'dark' ? '#111827' : '#ffffff', border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', uppercase: true, marginBottom: '16px' }}>{lang === 'en' ? 'Recent Requests' : 'சமீபத்திய கோரிக்கைகள்'}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '11px', fontWeight: '800', margin: 0, color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>Need LED Sign Board</h5>
                    <p style={{ fontSize: '9px', color: '#94a3b8', margin: '2px 0 0 0' }}>T. Nagar, Chennai</p>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary)' }}>2 Quotes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '11px', fontWeight: '800', margin: 0, color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>Office Cleaning Services</h5>
                    <p style={{ fontSize: '9px', color: '#94a3b8', margin: '2px 0 0 0' }}>Anna Nagar, Chennai</p>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary)' }}>4 Quotes</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* RFQ PROPOSALS DETAILS DIALOG MODAL */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 shadow-2xl border ${
            theme === 'dark' ? 'bg-[#0f172a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold uppercase tracking-wider text-red-500">RFQ Quotation Center</h3>
              <button onClick={() => { setSelectedRfq(null); setQuotesList([]); setShowQuoteForm(false); }} className="text-2xl font-bold">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left detail column */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold mb-2">{selectedRfq.title}</h2>
                  <p className="text-xs text-gray-500">{selectedRfq.description}</p>
                </div>

                {/* Proposals submitted */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm border-b border-gray-800/10 pb-2">Quotes Submitted by Sellers</h3>
                  
                  {quotesList.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No quotes submitted yet. Submit your bid below!</p>
                  ) : (
                    quotesList.map((q, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          padding: '20px',
                          borderRadius: '16px',
                          border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                          marginBottom: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                        }}
                      >
                        <div className="flex justify-between items-start text-xs">
                          <div>
                            <h4 className="font-bold text-sm text-indigo-500">{q.seller.businessName}</h4>
                            <p className="text-[10px] text-gray-500"><i className="fas fa-map-marker-alt"></i> {q.seller.addressLocality}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-red-500">₹{q.quote.quotedPrice.toLocaleString()}</span>
                            <p className="text-[10px] text-gray-400">Timeline: {q.quote.timelineDays} days</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{q.quote.notes}</p>
                        
                        <div 
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            paddingTop: '16px',
                            borderTop: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                            marginTop: '4px'
                          }}
                        >
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            q.quote.status === 'shortlisted' ? 'bg-amber-600/10 text-amber-500' : 
                            q.quote.status === 'accepted' ? 'bg-green-600/10 text-green-500' : 'bg-gray-600/10 text-gray-500'
                          }`}>
                            {q.quote.status}
                          </span>
                          
                          <div className="flex flex-wrap gap-2 justify-end">
                            {q.quote.status === 'pending' && (
                              <button 
                                onClick={() => handleQuoteStatusChange(q.quote.id, 'shortlisted')}
                                className="bg-amber-500 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] hover:bg-amber-600 transition cursor-pointer shadow-sm"
                              >
                                Shortlist
                              </button>
                            )}
                            {(q.quote.status === 'pending' || q.quote.status === 'shortlisted') && (
                              <button 
                                onClick={() => handleQuoteStatusChange(q.quote.id, 'accepted')}
                                className="bg-green-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] hover:bg-green-700 transition cursor-pointer shadow-sm"
                              >
                                Accept &amp; Award
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit bid sidebar form */}
              <div className="space-y-6">
                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm mb-3">Post Your Bid proposal</h3>
                  {!showQuoteForm ? (
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login', { state: { from: '/rfq' } });
                        } else {
                          setShowQuoteForm(true);
                        }
                      }}
                      className="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-red-700 transition"
                    >
                      Submit a Quotation
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitQuote} className="space-y-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Quoted Price (₹) *</label>
                        <input type="number" required placeholder="Price" className="bg-transparent border border-gray-700/30 p-2 rounded focus:outline-none" value={quotePrice} onChange={(e)=>setQuotePrice(e.target.value)}/>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Timeline (Days) *</label>
                        <input type="number" required placeholder="Days to deliver" className="bg-transparent border border-gray-700/30 p-2 rounded focus:outline-none" value={quoteTimeline} onChange={(e)=>setQuoteTimeline(e.target.value)}/>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Proposal Notes</label>
                        <textarea rows="2" placeholder="Tell us why we should choose you..." className="bg-transparent border border-gray-700/30 p-2 rounded focus:outline-none" value={quoteNotes} onChange={(e)=>setQuoteNotes(e.target.value)}></textarea>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">Proposal PDF URL</label>
                        <input type="url" placeholder="https://example.com/proposal.pdf" className="bg-transparent border border-gray-700/30 p-2 rounded focus:outline-none" value={quoteAttachment} onChange={(e)=>setQuoteAttachment(e.target.value)}/>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setShowQuoteForm(false)} className="w-1/2 py-2 rounded border border-gray-700/30 font-bold">Cancel</button>
                        <button type="submit" className="w-1/2 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition">Submit Quote</button>
                      </div>
                    </form>
                  )}
                </div>

                <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className="font-bold text-sm mb-3">RFQ Metadata</h3>
                  <div className="space-y-2 text-xs text-gray-500">
                    <p>Estimated Quantity: <strong className="text-gray-400">{selectedRfq.quantity}</strong></p>
                    <p>Delivery Location: <strong className="text-gray-400">{selectedRfq.location}</strong></p>
                    <p>Expiry Deadline: <strong className="text-gray-400">{new Date(selectedRfq.deadline).toLocaleString()}</strong></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* POST RFQ MODAL */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handlePostRfq} className={`w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-[#0f172a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold uppercase tracking-wider text-red-500">Post RFQ Requirement</h3>
              <button type="button" onClick={() => setShowRfqModal(false)} className="text-2xl font-bold">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold">RFQ Title *</label>
                <input type="text" required placeholder="e.g. Need 500 Custom T-Shirts" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Category *</label>
                <select className={`bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`} value={newCategory} onChange={(e)=>setNewCategory(e.target.value)}>
                  <option value="Printing">{lang === 'en' ? 'Printing' : 'அச்சிடுதல்'}</option>
                  <option value="Construction">{lang === 'en' ? 'Construction' : 'கட்டுமானம்'}</option>
                  <option value="Fabrication">{lang === 'en' ? 'Fabrication' : 'உலோக தயாரிப்பு'}</option>
                  <option value="Events">{lang === 'en' ? 'Events' : 'நிகழ்ச்சிகள்'}</option>
                  <option value="Services">{lang === 'en' ? 'Services' : 'சேவைகள்'}</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Quantity Required *</label>
                <input type="number" required className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newQty} onChange={(e)=>setNewQty(Number(e.target.value))}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Target Budget (₹) *</label>
                <input type="text" required placeholder="e.g. 50,000 - 80,000" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newBudget} onChange={(e)=>setNewBudget(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Delivery Location *</label>
                <input type="text" required placeholder="e.g. Chennai, TN" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newLoc} onChange={(e)=>setNewLoc(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Bidding Deadline *</label>
                <input type="date" required className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newDeadline} onChange={(e)=>setNewDeadline(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold">Detailed Requirements Description *</label>
                <textarea required rows="4" placeholder="Detail out all specifications, dimensions, material quality details, etc..." className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newDesc} onChange={(e)=>setNewDesc(e.target.value)}></textarea>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowRfqModal(false)} className="px-5 py-2.5 rounded-lg border border-gray-700/30">Cancel</button>
              <button type="submit" className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-red-700 transition">Publish RFQ</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RfqMarketplace;
