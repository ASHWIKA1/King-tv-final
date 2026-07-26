import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';
import './BizDirectoryDashboard.css';

const BizDirectoryDashboard = () => {
  const { lang } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication Lock
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // General States
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, nfc, deals, rfq
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Activate appropriate tab based on URL path
  useEffect(() => {
    if (location.pathname === '/nfc') {
      setActiveTab('nfc');
    }
  }, [location.pathname]);

  // Tab States - NFC
  const [nfcStats, setNfcStats] = useState(null);
  const [nfcLoading, setNfcLoading] = useState(false);
  const [nfcLinkType, setNfcLinkType] = useState('profile');
  const [nfcUpiId, setNfcUpiId] = useState('');
  const [nfcUpiName, setNfcUpiName] = useState('');
  const [nfcPlan, setNfcPlan] = useState('Monthly (₹299)');
  const [nfcAddress, setNfcAddress] = useState('');
  const [nfcDetails, setNfcDetails] = useState('Classic Gold NFC Card');
  const [agreeNfcTerms, setAgreeNfcTerms] = useState(false);

  // Tab States - Deals
  const [dealsList, setDealsList] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [showAddDealForm, setShowAddDealForm] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealDiscountType, setNewDealDiscountType] = useState('percentage'); // percentage, amount
  const [newDealDiscountVal, setNewDealDiscountVal] = useState('');
  const [newDealCode, setNewDealCode] = useState('');
  const [newDealLimit, setNewDealLimit] = useState(100);
  const [newDealOrigPrice, setNewDealOrigPrice] = useState('');
  const [newDealDiscPrice, setNewDealDiscPrice] = useState('');
  const [newDealTerms, setNewDealTerms] = useState('');
  const [newDealBanner, setNewDealBanner] = useState('');

  // Tab States - RFQ
  const [openRfqs, setOpenRfqs] = useState([]);
  const [sentQuotes, setSentQuotes] = useState([]);
  const [rfqLoading, setRfqLoading] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  
  // Post RFQ States
  const [showPostRfqModal, setShowPostRfqModal] = useState(false);
  const [newRfqTitle, setNewRfqTitle] = useState('');
  const [newRfqCategory, setNewRfqCategory] = useState('Printing');
  const [newRfqQty, setNewRfqQty] = useState(1);
  const [newRfqBudget, setNewRfqBudget] = useState('');
  const [newRfqLoc, setNewRfqLoc] = useState('');
  const [newRfqDeadline, setNewRfqDeadline] = useState('');
  const [newRfqDesc, setNewRfqDesc] = useState('');

  // Trigger alert toast
  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load owned business listing
  const loadBusiness = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/directory/my-business');
      if (res && res.length > 0) {
        setBusiness(res[0]);
      } else {
        setBusiness(null);
      }
    } catch (e) {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusiness();
  }, []);

  // Check tab loads
  useEffect(() => {
    if (!business || business.kycStatus !== 'approved') return;

    if (activeTab === 'nfc') {
      loadNfcDetails();
    } else if (activeTab === 'deals') {
      loadDeals();
    } else if (activeTab === 'rfq') {
      loadRfqsAndQuotes();
    }
  }, [activeTab, business]);

  // Simulate Admin KYC approval
  const handleSimulateKycApproval = async () => {
    if (!business) return;
    try {
      await fetchApi(`/directory/${business.id}/approve-kyc`, {
        method: 'POST'
      });
      triggerToast(lang === 'en' ? 'KYC Verification Approved successfully!' : 'KYC சரிபார்ப்பு வெற்றிகரமாக அங்கீகரிக்கப்பட்டது!');
      loadBusiness();
    } catch (e) {
      triggerToast('Simulation failed', 'error');
    }
  };

  // NFC Operations
  const loadNfcDetails = async () => {
    setNfcLoading(true);
    try {
      const stats = await fetchApi(`/nfc/stats?listingId=${business.id}`);
      setNfcStats(stats);
    } catch (e) {
      setNfcStats(null);
    } finally {
      setNfcLoading(false);
    }
  };

  const handleRequestNfc = async (e) => {
    e.preventDefault();
    if (!agreeNfcTerms) {
      triggerToast(lang === 'en' ? 'Please agree to terms' : 'விதிமுறைகளை ஏற்கவும்', 'error');
      return;
    }
    setNfcLoading(true);
    const payload = {
      listingId: business.id,
      linkType: nfcLinkType,
      upiId: nfcUpiId,
      upiName: nfcUpiName,
      deliveryAddress: nfcAddress,
      subscriptionPlan: nfcPlan,
      cardDetails: nfcDetails,
      paymentInfo: 'Simulated COD/In-App Payment'
    };

    try {
      await fetchApi('/nfc/request', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      triggerToast(lang === 'en' ? 'NFC Card requested successfully!' : 'NFC அட்டை வெற்றிகரமாக கோரப்பட்டது!');
      loadNfcDetails();
    } catch (err) {
      triggerToast('NFC request failed', 'error');
    } finally {
      setNfcLoading(false);
    }
  };

  // Deals Operations
  const loadDeals = async () => {
    setDealsLoading(true);
    try {
      const res = await fetchApi(`/deals/listing/${business.id}`);
      setDealsList(Array.isArray(res) ? res : []);
    } catch (e) {
      setDealsList([]);
    } finally {
      setDealsLoading(false);
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    if (!newDealTitle.trim() || !newDealCode.trim()) return;

    setDealsLoading(true);
    const payload = {
      listingId: business.id,
      title: newDealTitle,
      category: business.category,
      discountType: newDealDiscountType === 'percentage' ? 'percentage' : 'amount',
      discountValue: parseFloat(newDealDiscountVal) || 0.0,
      originalPrice: parseFloat(newDealOrigPrice) || null,
      discountedPrice: parseFloat(newDealDiscPrice) || null,
      couponCode: newDealCode.toUpperCase(),
      usageLimit: parseInt(newDealLimit) || 100,
      terms: newDealTerms,
      bannerUrl: newDealBanner || "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600"
    };

    try {
      await fetchApi('/deals', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      triggerToast(lang === 'en' ? 'Promo Deal created successfully!' : 'விளம்பர சலுகை வெற்றிகரமாக உருவாக்கப்பட்டது!');
      setShowAddDealForm(false);
      setNewDealTitle('');
      setNewDealCode('');
      setNewDealDiscountVal('');
      setNewDealOrigPrice('');
      setNewDealDiscPrice('');
      setNewDealTerms('');
      loadDeals();
    } catch (err) {
      triggerToast('Deal creation failed', 'error');
    } finally {
      setDealsLoading(false);
    }
  };

  // RFQ Operations
  const loadRfqsAndQuotes = async () => {
    setRfqLoading(true);
    try {
      // Get all owner's posted RFQs
      const rfqs = await fetchApi('/rfq/my-rfqs');
      setOpenRfqs(Array.isArray(rfqs) ? rfqs : []);

      // Get quotations sent by this seller business (acting as seller elsewhere)
      const quotes = await fetchApi(`/rfq/seller/quotes?businessId=${business.id}`);
      setSentQuotes(Array.isArray(quotes) ? quotes : []);
    } catch (e) {
      setOpenRfqs([]);
      setSentQuotes([]);
    } finally {
      setRfqLoading(false);
    }
  };

  const handlePostRfq = async (e) => {
    e.preventDefault();
    try {
      setRfqLoading(true);
      await fetchApi('/rfq', {
        method: 'POST',
        body: JSON.stringify({
          title: newRfqTitle,
          category: newRfqCategory,
          quantity: Number(newRfqQty),
          budget: newRfqBudget,
          location: newRfqLoc,
          deadline: newRfqDeadline ? new Date(newRfqDeadline).toISOString() : new Date(Date.now() + 7*24*60*60*1000).toISOString(),
          description: newRfqDesc
        })
      });
      triggerToast(lang === 'en' ? 'RFQ posted successfully!' : 'RFQ வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!');
      setShowPostRfqModal(false);
      setNewRfqTitle('');
      setNewRfqDesc('');
      setNewRfqQty(1);
      setNewRfqBudget('');
      setNewRfqLoc('');
      setNewRfqDeadline('');
      loadRfqsAndQuotes();
    } catch (err) {
      triggerToast(err.message || 'Failed to post RFQ', 'error');
    } finally {
      setRfqLoading(false);
    }
  };

  const handleUpdateQuoteStatus = async (quoteId, status) => {
    try {
      setRfqLoading(true);
      await fetchApi(`/rfq/quotes/${quoteId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      triggerToast(lang === 'en' ? `Quote status updated to ${status}!` : `சலுகை நிலை ${status} ஆக மாற்றப்பட்டது!`);
      // Reload selected RFQ and overall RFQs
      const rfqs = await fetchApi('/rfq/my-rfqs');
      setOpenRfqs(Array.isArray(rfqs) ? rfqs : []);
      const updatedRfq = rfqs.find(r => r.rfq.id === selectedRfq.rfq.id);
      if (updatedRfq) {
        setSelectedRfq(updatedRfq);
      } else {
        setSelectedRfq(null);
      }
    } catch (err) {
      triggerToast('Failed to update quote status', 'error');
    } finally {
      setRfqLoading(false);
    }
  };

  // NFC Status Tracker Stepper helper
  const getNfcStatusStep = (status) => {
    const sequence = ['Pending', 'Approved', 'Printing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    const idx = sequence.findIndex(s => s.toLowerCase() === (status || 'Pending').toLowerCase());
    return idx >= 0 ? idx : 0;
  };

  if (loading) {
    return (
      <div className="container center-spinner" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)' }}></i>
        <p style={{ marginTop: '12px' }}>{lang === 'en' ? 'Loading Business Profile...' : 'வணிகச் சுயவிவரம் ஏற்றப்படுகிறது...'}</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="no-business-card">
          <i className="fas fa-store-slash" style={{ fontSize: '50px', color: '#94a3b8', marginBottom: '20px' }}></i>
          <h2>{lang === 'en' ? 'No Registered Business Found' : 'பதிவுசெய்யப்பட்ட வணிகம் எதுவும் இல்லை'}</h2>
          <p>{lang === 'en' ? 'Create your official MSME directory profile to launch promotional deals, buy NFC cards, and submit RFQ proposals.'
                           : 'சலுகைகளைத் தொடங்கவும், NFC அட்டைகளைப் பெறவும், வாடிக்கையாளர் RFQ-க்களில் பங்கேற்கவும் உங்கள் MSME அடைவுச் சுயவிவரத்தை உருவாக்கவும்.'}</p>
          <button className="wizard-btn-primary" onClick={() => navigate('/directory/register')} style={{ display: 'inline-flex', marginTop: '16px' }}>
            + {lang === 'en' ? 'Register Business Now' : 'இப்போதே வணிகத்தை பதிவு செய்'}
          </button>
        </div>
      </div>
    );
  }

  const isPendingKyc = business.kycStatus !== 'approved';

  return (
    <main className="container biz-dashboard-container" style={{ padding: '30px 20px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`dashboard-toast ${toastType}`}>
          <i className={`fas ${toastType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="dashboard-banner">
        <div className="db-banner-overlay">
          <div className="flex-row items-center gap-4">
            <img src={business.logoUrl} alt="Logo" className="db-profile-logo" />
            <div>
              <h1 className="db-biz-name">{business.businessName}</h1>
              <div className="flex-row items-center gap-2" style={{ marginTop: '4px' }}>
                <span className="db-cat-badge">{business.category}</span>
                <span className={`db-status-badge ${business.kycStatus}`}>
                  {business.kycStatus === 'approved' ? 'KYC Verified' : `KYC Verification: ${business.kycStatus}`}
                </span>
              </div>
            </div>
          </div>
          
          {isPendingKyc && (
            <div className="sim-approve-box">
              <span className="sim-label">Developer Sandbox Override:</span>
              <button className="sim-btn" onClick={handleSimulateKycApproval}>
                <i className="fas fa-user-check"></i> Approve KYC Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Tab Controls */}
      <div className="dashboard-layout">
        {/* Left Sidebar Menu */}
        <aside className="db-sidebar">
          <button className={`sidebar-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fas fa-chart-line"></i> {lang === 'en' ? 'Business Overview' : 'வணிக மேலோட்டம்'}
          </button>
          <button className={`sidebar-tab ${activeTab === 'nfc' ? 'active' : ''}`} onClick={() => setActiveTab('nfc')}>
            <i className="fas fa-mobile-alt"></i> {lang === 'en' ? 'NFC Smart Card' : 'NFC ஸ்மார்ட் அட்டை'}
            {isPendingKyc && <i className="fas fa-lock tab-lock-icon"></i>}
          </button>
          <button className={`sidebar-tab ${activeTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveTab('deals')}>
            <i className="fas fa-tags"></i> {lang === 'en' ? 'Promo Deals' : 'விளம்பர சலுகைகள்'}
            {isPendingKyc && <i className="fas fa-lock tab-lock-icon"></i>}
          </button>
          <button className={`sidebar-tab ${activeTab === 'rfq' ? 'active' : ''}`} onClick={() => setActiveTab('rfq')}>
            <i className="fas fa-comments-dollar"></i> {lang === 'en' ? 'RFQ Proposals' : 'RFQ சலுகைகள்'}
          </button>
        </aside>

        {/* Right Content Pane */}
        <section className="db-content-pane">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane-content">
              <h2 className="pane-title">{lang === 'en' ? 'Business Dashboard Overview' : 'வணிக டாஷ்போர்டு மேலோட்டம்'}</h2>
              
              {isPendingKyc && (
                <div className="kyc-warning-banner">
                  <i className="fas fa-shield-halved"></i>
                  <div>
                    <h4>{lang === 'en' ? 'Verification Pending' : 'சரிபார்ப்பு நிலுவையில் உள்ளது'}</h4>
                    <p>{lang === 'en' ? 'Your business is currently undergoing KYC verification. NFC, Deals, and RFQ sections will unlock immediately upon verification.'
                                     : 'உங்கள் வணிகம் KYC சரிபார்ப்பில் உள்ளது. சரிபார்ப்பு முடிந்ததும் NFC, சலுகைகள் மற்றும் RFQ பிரிவுகள் திறக்கப்படும்.'}</p>
                  </div>
                </div>
              )}

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-lbl">{lang === 'en' ? 'Directory Rating' : 'அடைவு மதிப்பீடு'}</span>
                    <i className="fas fa-star text-gold"></i>
                  </div>
                  <div className="stat-val">{business.ratingAvg ? business.ratingAvg.toFixed(1) : '5.0'}</div>
                  <span className="stat-desc">{business.ratingCount || 0} reviews total</span>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-lbl">{lang === 'en' ? 'NFC Card Status' : 'NFC அட்டை நிலை'}</span>
                    <i className="fas fa-mobile-alt text-blue"></i>
                  </div>
                  <div className="stat-val" style={{ fontSize: '20px', fontWeight: 'bold', paddingTop: '10px' }}>
                    {nfcStats?.card?.cardStatus ? nfcStats.card.cardStatus : (isPendingKyc ? 'Locked' : 'None requested')}
                  </div>
                  <span className="stat-desc">Smart tap connectivity</span>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-lbl">{lang === 'en' ? 'Active Offers' : 'செயலில் உள்ள சலுகைகள்'}</span>
                    <i className="fas fa-tags text-green"></i>
                  </div>
                  <div className="stat-val">{dealsList.length}</div>
                  <span className="stat-desc">Promotional deals published</span>
                </div>
              </div>

              <div className="biz-details-card" style={{ marginTop: '24px' }}>
                <h3 className="sub-title">{lang === 'en' ? 'Registered Details' : 'பதிவுசெய்யப்பட்ட விவரங்கள்'}</h3>
                <div className="detail-row"><strong>{lang === 'en' ? 'Phone:' : 'தொலைபேசி:'}</strong> <span>{business.phoneNumber}</span></div>
                <div className="detail-row"><strong>{lang === 'en' ? 'Locality:' : 'இருப்பிடம்:'}</strong> <span>{business.addressLocality}</span></div>
                <div className="detail-row"><strong>{lang === 'en' ? 'Street Address:' : 'தெரு முகவரி:'}</strong> <span>{business.addressStreet}</span></div>
                <div className="detail-row"><strong>{lang === 'en' ? 'Working Hours:' : 'வேலை நேரம்:'}</strong> <span>{business.workingHours}</span></div>
                <div className="detail-row"><strong>{lang === 'en' ? 'Email:' : 'மின்னஞ்சல்:'}</strong> <span>{business.email || 'None'}</span></div>
                <div className="detail-row"><strong>{lang === 'en' ? 'Website:' : 'இணையதளம்:'}</strong> <span>{business.website || 'None'}</span></div>
              </div>
            </div>
          )}

          {/* TAB: NFC */}
          {activeTab === 'nfc' && (
            <div className="tab-pane-content relative-pane">
              {isPendingKyc && (
                <div className="module-lock-overlay">
                  <div className="lock-overlay-content">
                    <i className="fas fa-lock lock-icon"></i>
                    <h3>{lang === 'en' ? 'Module Locked' : 'பிரிவு பூட்டப்பட்டுள்ளது'}</h3>
                    <p>{lang === 'en' ? 'Locked until KYC approval.' : 'KYC சரிபார்ப்பு முடியும் வரை பூட்டப்பட்டிருக்கும்.'}</p>
                  </div>
                </div>
              )}

              <h2 className="pane-title">{lang === 'en' ? 'NFC Smart Tap Card Manager' : 'NFC ஸ்மார்ட் கார்டு மேலாளர்'}</h2>
              
              {nfcLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : nfcStats?.card && nfcStats.card.cardStatus !== 'none' ? (
                <div>
                  {/* Status Tracker */}
                  <div className="nfc-tracker-card">
                    <h4>NFC Card Delivery Status: <span className="text-primary">{nfcStats.card.cardStatus}</span></h4>
                    
                    {/* Horizontal Tracking Stepper */}
                    <div className="tracker-steps">
                      {['Pending', 'Approved', 'Printing', 'Dispatched', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                        const currentIdx = getNfcStatusStep(nfcStats.card.cardStatus);
                        return (
                          <div key={idx} className={`tracker-step-item ${currentIdx === idx ? 'current' : ''} ${currentIdx > idx ? 'done' : ''}`}>
                            <div className="tracker-step-dot"></div>
                            <span className="tracker-step-label">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Info and Statistics */}
                  <div className="grid-2" style={{ marginTop: '24px' }}>
                    <div className="biz-details-card">
                      <h3 className="sub-title">Card details</h3>
                      <div className="detail-row"><strong>Card Type:</strong> <span>{nfcStats.card.cardDetails || 'Classic Gold Card'}</span></div>
                      <div className="detail-row"><strong>Subscription Plan:</strong> <span>{nfcStats.card.subscriptionPlan || 'Monthly'}</span></div>
                      <div className="detail-row"><strong>Redirect Type:</strong> <span>{nfcStats.card.linkType}</span></div>
                      {nfcStats.card.upiId && <div className="detail-row"><strong>UPI ID:</strong> <span>{nfcStats.card.upiId}</span></div>}
                      <div className="detail-row"><strong>Tracking Code:</strong> <span>{nfcStats.card.shortCode}</span></div>
                    </div>
                    
                    <div className="biz-details-card">
                      <h3 className="sub-title">Taps Stats</h3>
                      <div className="detail-row"><strong>Total Taps:</strong> <span className="text-xl bold text-blue">{nfcStats.totalTaps}</span></div>
                      {nfcStats.card.isPaymentEnabled && (
                        <div className="detail-row"><strong>Payments Collected:</strong> <span className="text-xl bold text-green">₹{nfcStats.totalPayments.toFixed(2)}</span></div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Request Form */
                <form className="nfc-request-form" onSubmit={handleRequestNfc}>
                  <div className="form-group">
                    <label className="form-label">Redirect Link Functionality *</label>
                    <select className="form-control" value={nfcLinkType} onChange={(e)=>setNfcLinkType(e.target.value)}>
                      <option value="profile">Redirect to Business Profile Directory Page</option>
                      <option value="payment">Direct UPI Tap-to-Pay Payment Gateway</option>
                    </select>
                  </div>

                  {nfcLinkType === 'payment' && (
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">UPI ID for Payments *</label>
                        <input type="text" className="form-control" placeholder="e.g., business@upi" value={nfcUpiId} onChange={(e)=>setNfcUpiId(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Merchant Name *</label>
                        <input type="text" className="form-control" placeholder="e.g., Sundaram Stores" value={nfcUpiName} onChange={(e)=>setNfcUpiName(e.target.value)} required />
                      </div>
                    </div>
                  )}

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Subscription Plan *</label>
                      <select className="form-control" value={nfcPlan} onChange={(e)=>setNfcPlan(e.target.value)}>
                        <option value="Weekly (₹99)">Weekly (₹99)</option>
                        <option value="Monthly (₹299)">Monthly (₹299)</option>
                        <option value="Yearly (₹2499)">Yearly (₹2499)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">NFC Card Styling *</label>
                      <select className="form-control" value={nfcDetails} onChange={(e)=>setNfcDetails(e.target.value)}>
                        <option value="Classic Gold NFC Card">Classic Gold Branding Card</option>
                        <option value="Minimalist Black Matte NFC Card">Minimalist Matte Black Card</option>
                        <option value="Premium Wooden NFC Card">Eco-friendly Wooden Premium Card</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Address *</label>
                    <textarea className="form-control" rows="3" placeholder="Enter complete address for card delivery..." value={nfcAddress} onChange={(e)=>setNfcAddress(e.target.value)} required />
                  </div>

                  <div className="terms-checkbox-wrapper" style={{ marginBottom: '20px' }}>
                    <input type="checkbox" id="agreeNfc" checked={agreeNfcTerms} onChange={(e)=>setAgreeNfcTerms(e.target.checked)} />
                    <label htmlFor="agreeNfc">I agree to the KINGS NFC Premium Subscription Terms and automatic billing rules.</label>
                  </div>

                  <button className="wizard-btn-submit" type="submit">
                    <i className="fas fa-credit-card"></i> Order NFC Card & Subscribe
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: DEALS */}
          {activeTab === 'deals' && (
            <div className="tab-pane-content relative-pane">
              {isPendingKyc && (
                <div className="module-lock-overlay">
                  <div className="lock-overlay-content">
                    <i className="fas fa-lock lock-icon"></i>
                    <h3>{lang === 'en' ? 'Module Locked' : 'பிரிவு பூட்டப்பட்டுள்ளது'}</h3>
                    <p>{lang === 'en' ? 'Locked until KYC approval.' : 'KYC சரிபார்ப்பு முடியும் வரை பூட்டப்பட்டிருக்கும்.'}</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="pane-title">{lang === 'en' ? 'Promotional Offers & Deals Manager' : 'விளம்பர சலுகைகள் & டீல்கள் மேலாளர்'}</h2>
                {!showAddDealForm && (
                  <button className="wizard-btn-primary" onClick={() => setShowAddDealForm(true)}>
                    + {lang === 'en' ? 'Create Offer' : 'சலுகையை உருவாக்கு'}
                  </button>
                )}
              </div>

              {dealsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : showAddDealForm ? (
                /* Create Deal Form */
                <form className="nfc-request-form animate-fade-in" onSubmit={handleCreateDeal}>
                  <div className="form-group">
                    <label className="form-label">Deal/Offer Title *</label>
                    <input type="text" className="form-control" placeholder="e.g., Get 20% off on all main courses" value={newDealTitle} onChange={(e)=>setNewDealTitle(e.target.value)} required />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Discount Type *</label>
                      <select className="form-control" value={newDealDiscountType} onChange={(e)=>setNewDealDiscountType(e.target.value)}>
                        <option value="percentage">Percentage Discount (%)</option>
                        <option value="amount">Fixed Price Cut (INR)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discount Value *</label>
                      <input type="number" className="form-control" placeholder="e.g., 20 or 150" value={newDealDiscountVal} onChange={(e)=>setNewDealDiscountVal(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Original Price (optional)</label>
                      <input type="number" className="form-control" placeholder="e.g., 500" value={newDealOrigPrice} onChange={(e)=>setNewDealOrigPrice(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discounted Price (optional)</label>
                      <input type="number" className="form-control" placeholder="e.g., 400" value={newDealDiscPrice} onChange={(e)=>setNewDealDiscPrice(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Coupon Promo Code *</label>
                      <input type="text" className="form-control" placeholder="e.g., RAJA20" value={newDealCode} onChange={(e)=>setNewDealCode(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Redemption Quantity Limit *</label>
                      <input type="number" className="form-control" value={newDealLimit} onChange={(e)=>setNewDealLimit(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deal Banner Image URL (optional)</label>
                    <input type="text" className="form-control" placeholder="Image link or leave empty for default" value={newDealBanner} onChange={(e)=>setNewDealBanner(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Terms & Conditions</label>
                    <textarea className="form-control" rows="3" placeholder="e.g., Valid only on weekdays. Cannot be combined with other offers." value={newDealTerms} onChange={(e)=>setNewDealTerms(e.target.value)} />
                  </div>

                  <div className="wizard-actions">
                    <button className="wizard-btn-secondary" type="button" onClick={() => setShowAddDealForm(false)}>Cancel</button>
                    <button className="wizard-btn-submit" type="submit">Create Offer & Publish</button>
                  </div>
                </form>
              ) : (
                /* Deals List */
                <div className="deals-dashboard-grid">
                  {dealsList.map(deal => (
                    <div key={deal.id} className="dashboard-deal-card">
                      <img src={deal.bannerUrl} alt="Deal Banner" className="deal-dashboard-banner" />
                      <div className="deal-dashboard-details">
                        <h4>{deal.title}</h4>
                        <div className="flex-row items-center gap-2" style={{ margin: '6px 0' }}>
                          <span className="deal-code-badge">{deal.couponCode}</span>
                          <span className="deal-type-badge">{deal.discountValue}% Off</span>
                        </div>
                        <div className="deal-redemption-progress">
                          <span>Redemptions: <strong>{deal.redemptionCount || 0}</strong> / {deal.usageLimit}</span>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${((deal.redemptionCount || 0) / deal.usageLimit) * 100}%` }}></div>
                          </div>
                        </div>
                        <span className="deal-validity-lbl">Status: <strong className={deal.status}>{deal.status}</strong></span>
                      </div>
                    </div>
                  ))}

                  {dealsList.length === 0 && (
                    <div className="empty-panel" style={{ gridColumn: '1 / -1' }}>
                      <i className="fas fa-tag"></i>
                      <p>{lang === 'en' ? 'No promotional offers created yet. Get started by clicking Create Offer.' : 'சலுகைகள் எதுவும் இன்னும் உருவாக்கப்படவில்லை.'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: RFQ */}
          {activeTab === 'rfq' && (
            <div className="tab-pane-content relative-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 className="pane-title">{lang === 'en' ? 'RFQ Proposals & Demands' : 'எனது RFQ கோரிக்கைகள்'}</h2>
                <button 
                  className="wizard-btn-primary" 
                  disabled={isPendingKyc} 
                  onClick={() => setShowPostRfqModal(true)}
                  title={isPendingKyc ? "Complete KYC verification to post an RFQ" : ""}
                  style={{ opacity: isPendingKyc ? 0.6 : 1, cursor: isPendingKyc ? 'not-allowed' : 'pointer' }}
                >
                  <i className="fas fa-plus"></i> {lang === 'en' ? 'Post an RFQ' : 'புதிய RFQ போஸ்ட் செய்'}
                </button>
              </div>
              
              {rfqLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : selectedRfq ? (
                /* Review Quotes View */
                <div className="nfc-request-form animate-fade-in" style={{ maxWidth: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="sub-title" style={{ margin: 0 }}>Review Quotes for: {selectedRfq.rfq.title}</h3>
                    <button className="wizard-btn-secondary" type="button" onClick={() => setSelectedRfq(null)}>Back to Dashboard</button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{selectedRfq.rfq.description}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(!selectedRfq.quotes || selectedRfq.quotes.length === 0) ? (
                      <div className="empty-panel" style={{ padding: '30px' }}>
                        <i className="fas fa-gavel"></i>
                        <p>No quotation proposals received for this RFQ yet.</p>
                      </div>
                    ) : (
                      selectedRfq.quotes.map(qData => (
                        <div key={qData.quote.id} style={{ padding: '20px', borderRadius: '16px', border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <h4 style={{ margin: 0, color: '#4f46e5', fontWeight: 'bold' }}>{qData.seller ? qData.seller.businessName : 'Anonymous Submitter'}</h4>
                              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                                <i className="fas fa-map-marker-alt"></i> {qData.seller ? qData.seller.addressLocality : 'Local'}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>₹{qData.quote.quotedPrice.toLocaleString()}</span>
                              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>Timeline: {qData.quote.timelineDays} days</p>
                            </div>
                          </div>
                          {qData.quote.notes && (
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '12px 0 0 0', fontStyle: 'italic' }}>
                              "{qData.quote.notes}"
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                              qData.quote.status === 'shortlisted' ? 'bg-amber-600/10 text-amber-500' : 
                              (qData.quote.status === 'accepted' || qData.quote.status === 'approved') ? 'bg-green-600/10 text-green-500' : 
                              qData.quote.status === 'rejected' ? 'bg-red-600/10 text-red-500' : 'bg-gray-600/10 text-gray-500'
                            }`}>
                              {qData.quote.status === 'accepted' ? 'approved' : qData.quote.status}
                            </span>
                            
                            {(qData.quote.status === 'pending' || qData.quote.status === 'shortlisted') && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  type="button" 
                                  className="wizard-btn-primary" 
                                  style={{ padding: '6px 12px', fontSize: '11px' }}
                                  onClick={() => handleUpdateQuoteStatus(qData.quote.id, 'approved')}
                                >
                                  Accept &amp; Award
                                </button>
                                <button 
                                  type="button" 
                                  className="wizard-btn-secondary" 
                                  style={{ padding: '6px 12px', fontSize: '11px', color: '#ef4444', borderColor: '#ef4444' }}
                                  onClick={() => handleUpdateQuoteStatus(qData.quote.id, 'rejected')}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Posted RFQs and Sent Quotes lists */
                <div>
                  <h3 className="sub-title" style={{ marginTop: '16px' }}><i className="fas fa-bullhorn text-gold"></i> Open Customer RFQs ({openRfqs.length})</h3>
                  <div className="rfq-marketplace-list">
                    {openRfqs.map(rfqData => (
                      <div key={rfqData.rfq.id} className="rfq-market-card" style={{ padding: '20px', borderRadius: '16px', border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', marginBottom: '16px' }}>
                        <div className="rfq-market-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontWeight: 'bold' }}>{rfqData.rfq.title}</h4>
                          <span className="rfq-budget-badge">Budget: ₹{rfqData.rfq.budget || 'Open'}</span>
                        </div>
                        <p className="rfq-market-desc" style={{ fontSize: '13px', color: '#64748b', margin: '10px 0' }}>{rfqData.rfq.description}</p>
                        <div className="rfq-market-meta" style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#94a3b8' }}>
                          <span>Qty: <strong>{rfqData.rfq.quantity}</strong></span>
                          <span>Location: <strong>{rfqData.rfq.location}</strong></span>
                          <span>Deadline: <strong>{new Date(rfqData.rfq.deadline).toLocaleDateString()}</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                            <i className="far fa-comments"></i> {rfqData.quotes ? rfqData.quotes.length : 0} quotations received
                          </span>
                          <button 
                            className="quote-action-btn" 
                            style={{ padding: '6px 16px', background: '#4f46e5', color: '#white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                            onClick={() => setSelectedRfq(rfqData)}
                          >
                            Review Quotes
                          </button>
                        </div>
                      </div>
                    ))}

                    {openRfqs.length === 0 && (
                      <div className="empty-panel">
                        <i className="fas fa-comments-dollar"></i>
                        <p>You have not posted any RFQ requests yet.</p>
                      </div>
                    )}
                  </div>

                  <h3 className="sub-title" style={{ marginTop: '30px' }}><i className="fas fa-paper-plane text-blue"></i> Sent Quotes & Statuses ({sentQuotes.length})</h3>
                  <div className="sent-quotes-list">
                    {sentQuotes.map(quoteData => (
                      <div key={quoteData.quote.id} className="sent-quote-card">
                        <div className="rfq-market-header">
                          <h4>{quoteData.rfq?.title || 'RFQ Enquiry'}</h4>
                          <span className={`quote-status-badge ${quoteData.quote.status}`}>
                            {quoteData.quote.status}
                          </span>
                        </div>
                        <div className="rfq-market-meta" style={{ marginTop: '8px' }}>
                          <span>My Price: <strong>₹{quoteData.quote.quotedPrice}</strong></span>
                          <span>Timeline: <strong>{quoteData.quote.timelineDays} Days</strong></span>
                          <span>Submitted: <strong>{new Date(quoteData.quote.createdAt).toLocaleDateString()}</strong></span>
                        </div>
                        {quoteData.quote.notes && <p className="quote-notes-text">Notes: "{quoteData.quote.notes}"</p>}
                      </div>
                    ))}

                    {sentQuotes.length === 0 && (
                      <div className="empty-panel">
                        <i className="fas fa-history"></i>
                        <p>No quote proposals submitted yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* POST RFQ FORM MODAL */}
              {showPostRfqModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <form onSubmit={handlePostRfq} className={`w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border max-h-[90vh] overflow-y-auto ${
                    theme === 'dark' ? 'bg-[#0f172a] text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-md font-bold uppercase tracking-wider text-red-500">Post RFQ Requirement</h3>
                      <button type="button" onClick={() => setShowPostRfqModal(false)} className="text-2xl font-bold">&times;</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="font-bold">RFQ Title *</label>
                        <input type="text" required placeholder="e.g. Need 500 Custom T-Shirts" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newRfqTitle} onChange={(e)=>setNewRfqTitle(e.target.value)}/>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Category *</label>
                        <select className={`bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'}`} value={newRfqCategory} onChange={(e)=>setNewRfqCategory(e.target.value)}>
                          <option value="Printing">{lang === 'en' ? 'Printing' : 'அச்சிடுதல்'}</option>
                          <option value="Construction">{lang === 'en' ? 'Construction' : 'கட்டுமானம்'}</option>
                          <option value="Fabrication">{lang === 'en' ? 'Fabrication' : 'உலோக தயாரிப்பு'}</option>
                          <option value="Events">{lang === 'en' ? 'Events' : 'நிகழ்ச்சிகள்'}</option>
                          <option value="Services">{lang === 'en' ? 'Services' : 'சேவைகள்'}</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Quantity Required *</label>
                        <input type="number" required className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newRfqQty} onChange={(e)=>setNewRfqQty(Number(e.target.value))}/>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Target Budget (₹) *</label>
                        <input type="text" required placeholder="e.g. 50,000 - 80,000" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newRfqBudget} onChange={(e)=>setNewRfqBudget(e.target.value)}/>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Delivery Location *</label>
                        <input type="text" required placeholder="e.g. Chennai, TN" className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newRfqLoc} onChange={(e)=>setNewRfqLoc(e.target.value)}/>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold">Bidding Deadline *</label>
                        <input type="date" required className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newRfqDeadline} onChange={(e)=>setNewRfqDeadline(e.target.value)}/>
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="font-bold">Detailed Requirements Description *</label>
                        <textarea required rows="4" placeholder="Detail out all specifications, dimensions, material quality details, etc..." className="bg-transparent border border-gray-700/30 p-2.5 rounded-lg focus:outline-none" value={newRfqDesc} onChange={(e)=>setNewRfqDesc(e.target.value)}></textarea>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button type="button" onClick={() => setShowPostRfqModal(false)} className="px-5 py-2.5 rounded-lg border border-gray-700/30">Cancel</button>
                      <button type="submit" className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-red-700 transition">Publish RFQ</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BizDirectoryDashboard;
