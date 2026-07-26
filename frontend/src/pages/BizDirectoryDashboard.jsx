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
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteTimeline, setQuoteTimeline] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

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
      // Get all marketplace RFQs
      const rfqs = await fetchApi('/rfq');
      // Filter for this business's category
      const filtered = rfqs.filter(r => r.rfq && r.rfq.category.toLowerCase() === business.category.toLowerCase());
      setOpenRfqs(filtered);

      // Get quotations sent by this seller business
      const quotes = await fetchApi(`/rfq/seller/quotes?businessId=${business.id}`);
      setSentQuotes(Array.isArray(quotes) ? quotes : []);
    } catch (e) {
      setOpenRfqs([]);
      setSentQuotes([]);
    } finally {
      setRfqLoading(false);
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!selectedRfq || !quotePrice || !quoteTimeline) return;

    setRfqLoading(true);
    const payload = {
      sellerBusinessId: business.id,
      quotedPrice: parseFloat(quotePrice),
      timelineDays: parseInt(quoteTimeline),
      notes: quoteNotes,
      proposalUrl: ''
    };

    try {
      await fetchApi(`/rfq/${selectedRfq.rfq.id}/quotes`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      triggerToast(lang === 'en' ? 'Quote submitted successfully!' : 'மதிப்பீட்டு சலுகை சமர்ப்பிக்கப்பட்டது!');
      setSelectedRfq(null);
      setQuotePrice('');
      setQuoteTimeline('');
      setQuoteNotes('');
      loadRfqsAndQuotes();
    } catch (err) {
      triggerToast('Quote submission failed', 'error');
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
            {isPendingKyc && <i className="fas fa-lock tab-lock-icon"></i>}
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
              {isPendingKyc && (
                <div className="module-lock-overlay">
                  <div className="lock-overlay-content">
                    <i className="fas fa-lock lock-icon"></i>
                    <h3>{lang === 'en' ? 'Module Locked' : 'பிரிவு பூட்டப்பட்டுள்ளது'}</h3>
                    <p>{lang === 'en' ? 'Locked until KYC approval.' : 'KYC சரிபார்ப்பு முடியும் வரை பூட்டப்பட்டிருக்கும்.'}</p>
                  </div>
                </div>
              )}

              <h2 className="pane-title">{lang === 'en' ? 'Request for Quotations (RFQ) Marketplace' : 'வாடிக்கையாளர் RFQ சந்தை'}</h2>
              
              {rfqLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : selectedRfq ? (
                /* Submit Quote Form */
                <form className="nfc-request-form animate-fade-in" onSubmit={handleSubmitQuote}>
                  <h3 className="sub-title">Submit Quote for: {selectedRfq.rfq.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{selectedRfq.rfq.description}</p>
                  
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Quoted Price (INR) *</label>
                      <input type="number" className="form-control" placeholder="e.g., 25000" value={quotePrice} onChange={(e)=>setQuotePrice(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Timeline to Deliver (Days) *</label>
                      <input type="number" className="form-control" placeholder="e.g., 5" value={quoteTimeline} onChange={(e)=>setQuoteTimeline(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Proposal Notes / Cover Letter</label>
                    <textarea className="form-control" rows="4" placeholder="Detail your experience, materials used, warranty, etc..." value={quoteNotes} onChange={(e)=>setQuoteNotes(e.target.value)} />
                  </div>

                  <div className="wizard-actions">
                    <button className="wizard-btn-secondary" type="button" onClick={() => setSelectedRfq(null)}>Back to Marketplace</button>
                    <button className="wizard-btn-submit" type="submit">Submit Quotation Proposal</button>
                  </div>
                </form>
              ) : (
                /* Open RFQs and Sent Quotes lists */
                <div>
                  <h3 className="sub-title" style={{ marginTop: '16px' }}><i className="fas fa-bullhorn text-gold"></i> Open Customer RFQs ({openRfqs.length})</h3>
                  <div className="rfq-marketplace-list">
                    {openRfqs.map(rfqData => (
                      <div key={rfqData.rfq.id} className="rfq-market-card">
                        <div className="rfq-market-header">
                          <h4>{rfqData.rfq.title}</h4>
                          <span className="rfq-budget-badge">Budget: {rfqData.rfq.budget || 'Open'}</span>
                        </div>
                        <p className="rfq-market-desc">{rfqData.rfq.description}</p>
                        <div className="rfq-market-meta">
                          <span>Qty: <strong>{rfqData.rfq.quantity}</strong></span>
                          <span>Location: <strong>{rfqData.rfq.location}</strong></span>
                          <span>Deadline: <strong>{new Date(rfqData.rfq.deadline).toLocaleDateString()}</strong></span>
                        </div>
                        <button className="quote-action-btn" onClick={() => setSelectedRfq(rfqData)}>
                          Submit Quote
                        </button>
                      </div>
                    ))}

                    {openRfqs.length === 0 && (
                      <div className="empty-panel">
                        <i className="fas fa-comments-dollar"></i>
                        <p>No open customer RFQs match your category ({business.category}) at the moment.</p>
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BizDirectoryDashboard;
