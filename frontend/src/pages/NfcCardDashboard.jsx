import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { fetchApi } from '../utils/api';
import './NfcCardDashboard.css';


const NfcCardDashboard = () => {
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  // Card & Stats state
  const [stats, setStats] = useState({
    totalTaps: 248,
    totalPayments: 45680.0,
    successfulPayments: 236,
    todaysTaps: 12,
    card: {
      id: 1,
      cardStatus: 'activated',
      shortCode: 'KCARD-10024',
      linkType: 'payment',
      upiId: 'kingcafe@upi',
      upiName: 'King Cafe',
      trackingNumber: 'TRK-987654321',
      updatedAt: '2025-05-20T12:00:00'
    }
  });

  const [tapsList, setTapsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiNameInput, setUpiNameInput] = useState('');
  const [linkTypeInput, setLinkTypeInput] = useState('payment');

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestLinkType, setRequestLinkType] = useState('profile');
  const [requestUpi, setRequestUpi] = useState('');
  const [requestUpiName, setRequestUpiName] = useState('');

  // Selected merchant directory business id
  const [merchantBizId, setMerchantBizId] = useState(1);

  const loadData = () => {
    setLoading(true);
    fetchApi(`/nfc/stats?listingId=${merchantBizId}`)
      .then(data => {
        if (data && data.card && data.card.cardStatus !== 'none') {
          setStats(prev => ({
            ...prev,
            ...data,
            totalTaps: data.totalTaps || prev.totalTaps,
            totalPayments: data.totalPayments || prev.totalPayments,
            successfulPayments: data.successfulPayments || prev.successfulPayments,
            todaysTaps: data.todaysTaps !== undefined && data.todaysTaps !== 0 ? data.todaysTaps : prev.todaysTaps,
            card: {
              ...prev.card,
              ...data.card
            }
          }));
          setUpiIdInput(data.card.upiId || '');
          setUpiNameInput(data.card.upiName || '');
          setLinkTypeInput(data.card.linkType || 'payment');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    fetchApi(`/nfc/taps?listingId=${merchantBizId}`)
      .then(taps => {
        if (Array.isArray(taps) && taps.length > 0) {
          setTapsList(taps);
        } else {
          setTapsList([
            { id: 1, tappedAt: "2025-05-24T11:32:00", tapType: "payment", customerName: "Hari Prakash", amount: 250.00, status: "success", locationCity: "Anna Nagar, Chennai" },
            { id: 2, tappedAt: "2025-05-24T10:15:00", tapType: "profile", customerName: "Unknown", amount: 0.0, status: "success", locationCity: "T. Nagar, Chennai" },
            { id: 3, tappedAt: "2025-05-23T19:45:00", tapType: "payment", customerName: "Priya Sharma", amount: 1120.00, status: "success", locationCity: "Anna Nagar, Chennai" },
            { id: 4, tappedAt: "2025-05-23T18:20:00", tapType: "payment", customerName: "Vignesh R", amount: 560.00, status: "success", locationCity: "Anna Nagar, Chennai" }
          ]);
        }
      })
      .catch(() => {
        setTapsList([
          { id: 1, tappedAt: "2025-05-24T11:32:00", tapType: "payment", customerName: "Hari Prakash", amount: 250.00, status: "success", locationCity: "Anna Nagar, Chennai" },
          { id: 2, tappedAt: "2025-05-24T10:15:00", tapType: "profile", customerName: "Unknown", amount: 0.0, status: "success", locationCity: "T. Nagar, Chennai" },
          { id: 3, tappedAt: "2025-05-23T19:45:00", tapType: "payment", customerName: "Priya Sharma", amount: 1120.00, status: "success", locationCity: "Anna Nagar, Chennai" },
          { id: 4, tappedAt: "2025-05-23T18:20:00", tapType: "payment", customerName: "Vignesh R", amount: 560.00, status: "success", locationCity: "Anna Nagar, Chennai" }
        ]);
      });
  };

  useEffect(() => {
    fetchApi('/directory')
      .then(listings => {
        if (Array.isArray(listings) && listings.length > 0) {
          const kingCafe = listings.find(item => item.businessName === 'King Cafe') || listings[0];
          setMerchantBizId(kingCafe.id);
        }
      })
      .catch(() => {
        setMerchantBizId(1);
      });
  }, []);

  useEffect(() => {
    if (merchantBizId) {
      loadData();
    }
  }, [merchantBizId]);

  const handleUpdateUpi = (e) => {
    e.preventDefault();
    if (!stats.card || !stats.card.id) return;
    
    fetchApi(`/nfc/${stats.card.id}/upi`, {
      method: 'PUT',
      body: JSON.stringify({
        upiId: upiIdInput,
        upiName: upiNameInput,
        linkType: linkTypeInput
      })
    })
      .then(updated => {
        setStats(prev => ({
          ...prev,
          card: updated
        }));
        setShowUpiModal(false);
        loadData();
      })
      .catch(() => {
        // Local simulate update
        setStats(prev => ({
          ...prev,
          card: {
            ...prev.card,
            upiId: upiIdInput,
            upiName: upiNameInput,
            linkType: linkTypeInput
          }
        }));
        setShowUpiModal(false);
      });
  };

  const handleRequestCard = (e) => {
    e.preventDefault();
    fetchApi('/nfc/request', {
      method: 'POST',
      body: JSON.stringify({
        listingId: merchantBizId,
        linkType: requestLinkType,
        upiId: requestUpi,
        upiName: requestUpiName
      })
    })
      .then(() => {
        setShowRequestModal(false);
        loadData();
      })
      .catch(() => {
        // Local simulate order request
        setStats(prev => ({
          ...prev,
          card: {
            id: Date.now(),
            cardStatus: 'requested',
            shortCode: 'KC-REQ-' + Math.floor(1000 + Math.random() * 9000),
            linkType: requestLinkType,
            upiId: requestUpi,
            upiName: requestUpiName,
            updatedAt: new Date().toISOString()
          }
        }));
        setShowRequestModal(false);
      });
  };

  const handleBlockCard = () => {
    if (!stats.card || !stats.card.id) return;
    if (!window.confirm("Are you sure you want to block this NFC card?")) return;

    fetchApi(`/nfc/${stats.card.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'blocked' })
    })
      .then(updated => {
        setStats(prev => ({ ...prev, card: updated }));
      })
      .catch(() => {
        setStats(prev => ({ ...prev, card: { ...prev.card, cardStatus: 'blocked' } }));
      });
  };

  const handleReissueCard = () => {
    if (!stats.card || !stats.card.id) return;
    if (!window.confirm("Do you want to request card reissue? Current card will be blocked.")) return;

    fetchApi(`/nfc/${stats.card.id}/reissue`, {
      method: 'POST'
    })
      .then(() => {
        loadData();
      })
      .catch(() => {
        setStats(prev => ({
          ...prev,
          card: {
            ...prev.card,
            cardStatus: 'requested',
            shortCode: 'KCARD-REISSUE'
          }
        }));
      });
  };

  // Mock OTP Activation code generator for demo purposes
  const handleVerifyOtp = () => {
    const code = window.prompt("Enter 4-digit activation code (check your order status):");
    if (!code) return;
    fetchApi(`/nfc/${stats.card.id}/activate-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp: code })
    })
      .then(updated => {
        setStats(prev => ({ ...prev, card: updated }));
        alert("NFC Card Activated successfully!");
      })
      .catch((err) => {
        alert("Activation failed or invalid activation code");
      });
  };

  const card = stats.card || {};
  const statusSteps = ['requested', 'printing', 'shipped', 'activated'];
  const currentStepIdx = statusSteps.indexOf((card.cardStatus || 'requested').toLowerCase());

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ta-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatStepDate = (step) => {
    if (!card || !card.createdAt) return '';
    const created = new Date(card.createdAt);
    let stepDate = new Date(created);

    const stepIdx = statusSteps.indexOf(step);
    if (stepIdx > currentStepIdx || currentStepIdx === -1) {
      return '';
    }

    if (step === 'requested') {
      stepDate = created;
    } else if (step === 'printing') {
      stepDate.setDate(created.getDate() + 1);
    } else if (step === 'shipped') {
      stepDate.setDate(created.getDate() + 2);
    } else if (step === 'activated') {
      stepDate = card.updatedAt ? new Date(card.updatedAt) : new Date(created.getTime() + 3 * 24 * 3600 * 1000);
    }

    return stepDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'ta-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const t = {
    title: lang === 'en' ? 'NFC Business Card' : 'என்எஃப்சி வணிக அட்டை',
    sub: lang === 'en' ? 'Manage your NFC card and tap-to-pay profile' : 'உங்கள் என்எஃப்சி கார்டு மற்றும் கட்டண சுயவிவரத்தை நிர்வகிக்கவும்',
    reqCard: lang === 'en' ? 'Request New Card' : 'புதிய கார்டு கோரவும்',
    cardLayout: lang === 'en' ? 'NFC Digital Card Layout' : 'என்எஃப்சி டிஜிட்டல் கார்டு வடிவமைப்பு',
    cardStatus: lang === 'en' ? 'Card Status' : 'கார்டு நிலை',
    linkedAccount: lang === 'en' ? 'Linked Payment Account' : 'இணைக்கப்பட்ட கட்டண கணக்கு',
    updatePayment: lang === 'en' ? 'Update Payment Details' : 'கட்டண விவரங்களை மாற்றவும்',
    summary: lang === 'en' ? 'Tap & Transaction Summary' : 'தட்டல் மற்றும் பரிவர்த்தனை சுருக்கம்',
    quickActions: lang === 'en' ? 'Quick Actions' : 'விரைவான செயல்கள்',
    history: lang === 'en' ? 'Recent Tap & Payment History' : 'சமீபத்திய தட்டல் மற்றும் கட்டண வரலாறு',
    viewAll: lang === 'en' ? 'View All Transactions' : 'அனைத்து பரிவர்த்தனைகளையும் காண்க',
    
    totalTaps: lang === 'en' ? 'Total Taps' : 'மொத்த தட்டல்கள்',
    totalPayments: lang === 'en' ? 'Total Payments' : 'மொத்த கட்டணங்கள்',
    successPayments: lang === 'en' ? 'Successful Payments' : 'வெற்றிகரமான கட்டணங்கள்',
    todayTaps: lang === 'en' ? "Today's Taps" : 'இன்றைய தட்டல்கள்',
    
    viewPreview: lang === 'en' ? 'View Card Preview' : 'கார்டு மாதிரியைக் காண்க',
    downloadQr: lang === 'en' ? 'Download QR Code' : 'QR குறியீட்டைப் பதிவிறக்குக',
    blockCard: lang === 'en' ? 'Block This Card' : 'இந்த கார்டை முடக்கவும்',
    reqReissue: lang === 'en' ? 'Request Reissue' : 'மறுபதிப்பு கோரவும்',
    
    dateTime: lang === 'en' ? 'Date & Time' : 'தேதி மற்றும் நேரம்',
    type: lang === 'en' ? 'Type' : 'வகை',
    customer: lang === 'en' ? 'Customer' : 'வாடிக்கையாளர்',
    amount: lang === 'en' ? 'Amount' : 'தொகை',
    status: lang === 'en' ? 'Status' : 'நிலை',
    location: lang === 'en' ? 'Location' : 'இருப்பிடம்',
    
    requested: lang === 'en' ? 'Requested' : 'கோரப்பட்டது',
    printing: lang === 'en' ? 'Printing' : 'அச்சிடப்படுகிறது',
    shipped: lang === 'en' ? 'Shipped' : 'அனுப்பப்பட்டது',
    activated: lang === 'en' ? 'Activated' : 'செயல்படுத்தப்பட்டது'
  };

  return (
    <main className="container mx-auto nfc-module-container">
      

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px' }}></i>
        <Link to="/directory">{lang === 'en' ? 'Local Business Directory' : 'நம்ம ஊர்'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'NFC Card' : 'என்எஃப்சி கார்டு'}</span>
      </div>

      {/* HEADER SECTION */}
      <div className="nfc-header-flex">
        <div className="nfc-header-left">
          <div className="nfc-signal-icon-circle">
            <i className="fas fa-wifi rotate-90"></i>
          </div>
          <div>
            <h1 className="nfc-header-title">{t.title}</h1>
            <p className="nfc-header-sub">{t.sub}</p>
          </div>
        </div>
        <button className="nfc-req-card-btn" onClick={() => setShowRequestModal(true)}>
          <i className="fas fa-plus"></i> {t.reqCard}
        </button>
      </div>

      {/* ROW 1: Card info & Timeline / UPI Details */}
      <div className="nfc-grid-cols-3">
        
        {/* Card Mockup Visual (Column 1) */}
        <div className="nfc-dashboard-card">
          <div>
            <h3 className="nfc-card-title-muted">{t.cardLayout}</h3>
            
            {/* NFC Card Mockup */}
            <div className="nfc-physical-card-mock">
              <i className="fas fa-wifi nfc-card-wave-icon"></i>
              
              <div></div>
              
              <div className="nfc-card-branding-center">
                <i className="fas fa-crown"></i>
                <div className="nfc-card-king-text">
                  KING <span className="nfc-card-tag-yellow">24x7</span>
                </div>
                <div className="nfc-card-business-sub">LOCAL BUSINESS</div>
              </div>
              
              <div className="nfc-card-bottom-actions">
                Tap &nbsp;•&nbsp; Pay &nbsp;•&nbsp; Connect
              </div>
            </div>
            
            <div className="nfc-card-id-row">
              <span>Card ID: {card.shortCode || 'N/A'}</span>
              <button 
                onClick={() => {
                  if (card.shortCode) {
                    navigator.clipboard.writeText(card.shortCode);
                    alert(lang === 'en' ? 'Card ID copied to clipboard!' : 'கார்டு ஐடி நகலெடுக்கப்பட்டது!');
                  }
                }}
                className="nfc-copy-btn"
                title="Copy Card ID"
              >
                <i className="far fa-copy"></i>
              </button>
            </div>
            
            <div className="nfc-card-status-badge-row">
              <div className="nfc-status-pill-green">
                <i className="fas fa-check-circle"></i>
                <span>Status: {card.cardStatus ? t[card.cardStatus.toLowerCase()] || card.cardStatus : t.requested}</span>
              </div>
              <span className="nfc-activated-date-lbl">Activated on 20 May 2025</span>
            </div>
          </div>
        </div>

        {/* Timeline Status & UPI Config (Column 2-3) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card Dispatch Timeline */}
          <div className="nfc-dashboard-card" style={{ minHeight: '190px', justifyContent: 'center' }}>
            <h3 className="nfc-card-title-muted">{t.cardStatus}</h3>
            
            <div className="nfc-stepper-container">
              {/* Connecting Line aligned to circle centers */}
              <div className="nfc-stepper-line"></div>
              
              {statusSteps.map((step, i) => {
                const isActive = i <= currentStepIdx;
                const isCompleted = i <= currentStepIdx;
                const isLast = step === 'activated';
                
                let iconClass = 'far fa-file-alt';
                if (step === 'printing') iconClass = 'fas fa-cogs';
                if (step === 'shipped') iconClass = 'fas fa-truck';
                if (step === 'activated') iconClass = 'fas fa-check';

                let nodeClass = '';
                if (isCompleted) nodeClass = 'completed';
                else if (isActive) nodeClass = 'active';

                return (
                  <div key={step} className={`nfc-step-node ${nodeClass}`}>
                    <div className="nfc-step-circle">
                      <i className={iconClass}></i>
                    </div>
                    <span className="nfc-step-lbl">{t[step]}</span>
                    <span className="nfc-step-date">{formatStepDate(step)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linked Payment Account details */}
          <div className="nfc-dashboard-card">
            <h3 className="nfc-card-title-muted">
              <i className="fas fa-shield-alt nfc-linked-shield-icon"></i> &nbsp;{t.linkedAccount}
            </h3>
            
            <div className="nfc-linked-account-grid">
              <div>
                <p className="nfc-linked-label">UPI ID</p>
                <p className="nfc-linked-val">{card.upiId || 'Not linked'}</p>
              </div>
              <div>
                <p className="nfc-linked-label">Account Type</p>
                <p className="nfc-linked-val">UPI</p>
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <button className="nfc-update-payment-btn" onClick={() => setShowUpiModal(true)}>
                <i className="fas fa-pen"></i> {t.updatePayment}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 2: Tap & Transaction Summary & Quick Actions */}
      <div className="nfc-grid-cols-3">
        
        {/* Left side: Metrics (spans 2 columns) */}
        <div className="nfc-dashboard-card">
          <h3 className="nfc-card-title-muted">{t.summary}</h3>
          
          <div className="nfc-stat-cards-grid">
            
            {/* Card 1: Total Taps */}
            <div className="nfc-metric-card nfc-purple-card">
              <div className="nfc-metric-card-top">
                <div className="nfc-metric-card-icon-wrap">
                  <i className="fas fa-fingerprint"></i>
                </div>
                <span className="nfc-metric-card-label">{t.totalTaps}</span>
              </div>
              <div className="nfc-metric-card-bottom">
                <span className="nfc-metric-card-value">{stats.totalTaps}</span>
                <span className="nfc-metric-card-trend-up">
                  <i className="fas fa-arrow-up"></i> 18% this month
                </span>
              </div>
            </div>

            {/* Card 2: Total Payments */}
            <div className="nfc-metric-card nfc-blue-card">
              <div className="nfc-metric-card-top">
                <div className="nfc-metric-card-icon-wrap">
                  <i className="fas fa-wallet"></i>
                </div>
                <span className="nfc-metric-card-label">{t.totalPayments}</span>
              </div>
              <div className="nfc-metric-card-bottom">
                <span className="nfc-metric-card-value">₹{stats.totalPayments.toLocaleString()}</span>
                <span className="nfc-metric-card-trend-up">
                  <i className="fas fa-arrow-up"></i> 22% this month
                </span>
              </div>
            </div>

            {/* Card 3: Successful Payments */}
            <div className="nfc-metric-card nfc-green-card">
              <div className="nfc-metric-card-top">
                <div className="nfc-metric-card-icon-wrap">
                  <i className="fas fa-check"></i>
                </div>
                <span className="nfc-metric-card-label">{t.successPayments}</span>
              </div>
              <div className="nfc-metric-card-bottom">
                <span className="nfc-metric-card-value">{stats.successfulPayments}</span>
                <span className="nfc-metric-card-trend-up">
                  <i className="fas fa-arrow-up"></i> 20% this month
                </span>
              </div>
            </div>

            {/* Card 4: Today's Taps */}
            <div className="nfc-metric-card nfc-orange-card">
              <div className="nfc-metric-card-top">
                <div className="nfc-metric-card-icon-wrap">
                  <i className="fas fa-bolt"></i>
                </div>
                <span className="nfc-metric-card-label">{t.todayTaps}</span>
              </div>
              <div className="nfc-metric-card-bottom">
                <span className="nfc-metric-card-value">{stats.todaysTaps}</span>
                <span className="nfc-metric-card-sub">Updated just now</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side: Quick Actions (spans 1 column) */}
        <div className="nfc-dashboard-card">
          <h3 className="nfc-card-title-muted">{t.quickActions}</h3>
          
          <div className="nfc-quick-actions-list">
            <button className="nfc-quick-action-btn-row" onClick={() => alert(`Redirect link: http://localhost:5173/t/${card.shortCode}`)}>
              <div className="nfc-quick-action-btn-left">
                <i className="far fa-eye"></i>
                <span>{t.viewPreview}</span>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>

            <button className="nfc-quick-action-btn-row" onClick={() => alert("Downloading QR code...")}>
              <div className="nfc-quick-action-btn-left">
                <i className="fas fa-qrcode"></i>
                <span>{t.downloadQr}</span>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>

            <button className="nfc-quick-action-btn-row" onClick={handleBlockCard}>
              <div className="nfc-quick-action-btn-left">
                <i className="fas fa-ban"></i>
                <span>{t.blockCard}</span>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>

            <button className="nfc-quick-action-btn-row" onClick={handleReissueCard}>
              <div className="nfc-quick-action-btn-left">
                <i className="fas fa-redo"></i>
                <span>{t.reqReissue}</span>
              </div>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

      </div>

      {/* ROW 3: Tap History Table List */}
      <div className="nfc-dashboard-card" style={{ display: 'block' }}>
        <div className="nfc-table-header-row">
          <h3 className="nfc-card-title-muted" style={{ margin: 0 }}>{t.history}</h3>
          <a href="#" className="nfc-table-view-all-link" onClick={(e) => { e.preventDefault(); alert("Viewing all transactions..."); }}>
            {t.viewAll}
          </a>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="nfc-table-wrap">
            <thead>
              <tr>
                <th className="nfc-th">{t.dateTime}</th>
                <th className="nfc-th">{t.type}</th>
                <th className="nfc-th">{t.customer}</th>
                <th className="nfc-th">{t.amount}</th>
                <th className="nfc-th">{t.status}</th>
                <th className="nfc-th">{t.location}</th>
              </tr>
            </thead>
            <tbody>
              {tapsList.map((tap, i) => (
                <tr key={i} className="nfc-tr">
                  <td className="nfc-td">{formatDate(tap.tappedAt)}</td>
                  <td className="nfc-td">
                    <div className="nfc-td-type-badge">
                      {tap.tapType === 'payment' ? (
                        <>
                          <div className="nfc-mini-circle-icon payment">
                            <i className="fas fa-wallet"></i>
                          </div>
                          <span>Payment</span>
                        </>
                      ) : (
                        <>
                          <div className="nfc-mini-circle-icon tap">
                            <i className="fas fa-wifi rotate-90"></i>
                          </div>
                          <span>Tap Only</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="nfc-td nfc-td-customer-bold">{tap.customerName}</td>
                  <td className="nfc-td nfc-td-amount-bold">{tap.amount > 0 ? `₹${tap.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '—'}</td>
                  <td className="nfc-td">
                    {tap.amount > 0 ? (
                      <span className="nfc-badge-success-pill">Success</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td className="nfc-td">{tap.locationCity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPI MODAL */}
      {showUpiModal && (
        <div className="nfc-modal-overlay">
          <form onSubmit={handleUpdateUpi} className="nfc-modal-form">
            <h3 className="nfc-modal-title">Link Payment Account</h3>
            <div className="nfc-modal-body">
              <div className="nfc-form-group">
                <label>UPI ID *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. merchant@ybl" 
                  className="nfc-form-input"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                />
              </div>
              <div className="nfc-form-group">
                <label>Merchant Name (UPI Payee) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. King Cafe" 
                  className="nfc-form-input"
                  value={upiNameInput}
                  onChange={(e) => setUpiNameInput(e.target.value)}
                />
              </div>
              <div className="nfc-form-group">
                <label>NFC Action Routing *</label>
                <select 
                  className="nfc-form-select"
                  value={linkTypeInput}
                  onChange={(e) => setLinkTypeInput(e.target.value)}
                >
                  <option value="payment">Direct Payment Request</option>
                  <option value="profile">Redirect to Business Directory Profile</option>
                </select>
              </div>
            </div>
            <div className="nfc-modal-footer">
              <button type="button" onClick={() => setShowUpiModal(false)} className="nfc-btn-secondary">Cancel</button>
              <button type="submit" className="nfc-btn-primary">Save Link Details</button>
            </div>
          </form>
        </div>
      )}

      {/* REQUEST CARD MODAL */}
      {showRequestModal && (
        <div className="nfc-modal-overlay">
          <form onSubmit={handleRequestCard} className="nfc-modal-form">
            <h3 className="nfc-modal-title">Request NFC Business Card</h3>
            <div className="nfc-modal-body">
              <div className="nfc-form-group">
                <label>Card Functionality *</label>
                <select 
                  className="nfc-form-select"
                  value={requestLinkType}
                  onChange={(e) => setRequestLinkType(e.target.value)}
                >
                  <option value="profile">Profile Card (Showroom/Digital Portfolio)</option>
                  <option value="payment">Payment Enabled Card (Link UPI Account)</option>
                </select>
              </div>
              {requestLinkType === 'payment' && (
                <>
                  <div className="nfc-form-group">
                    <label>UPI Account Payee ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="merchant@upi"
                      className="nfc-form-input"
                      value={requestUpi}
                      onChange={(e) => setRequestUpi(e.target.value)}
                    />
                  </div>
                  <div className="nfc-form-group">
                    <label>Merchant Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Registered business bank name"
                      className="nfc-form-input"
                      value={requestUpiName}
                      onChange={(e) => setRequestUpiName(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="nfc-modal-footer">
              <button type="button" onClick={() => setShowRequestModal(false)} className="nfc-btn-secondary">Cancel</button>
              <button type="submit" className="nfc-btn-primary">Place NFC Order</button>
            </div>
          </form>
        </div>
      )}

    </main>
  );
};

export default NfcCardDashboard;

