import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';
import './MyRfqs.css';

const MyRfqs = () => {
  const { lang } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rfqList, setRfqList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-rfqs' } });
    }
  }, [isAuthenticated, navigate]);

  const loadMyRfqs = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/rfq/my-rfqs');
      setRfqList(Array.isArray(res) ? res : []);
    } catch (e) {
      setRfqList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMyRfqs();
    }
  }, [isAuthenticated]);

  const handleQuoteStatus = async (quoteId, status) => {
    try {
      await fetchApi(`/rfq/quotes/${quoteId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      triggerToast(
        status === 'accepted' 
          ? (lang === 'en' ? 'Quote awarded and accepted successfully!' : 'மதிப்பீட்டு சலுகை ஏற்கப்பட்டது!') 
          : (lang === 'en' ? `Quote status updated to ${status}` : `சலுகை நிலை ${status} ஆக மாற்றப்பட்டது.`)
      );
      loadMyRfqs();
    } catch (e) {
      triggerToast('Failed to update quote status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container center-spinner" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)' }}></i>
        <p style={{ marginTop: '12px' }}>{lang === 'en' ? 'Loading My RFQ Portal...' : 'எனது RFQ பக்கம் ஏற்றப்படுகிறது...'}</p>
      </div>
    );
  }

  return (
    <main className="container my-rfqs-container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`dashboard-toast ${toastType}`}>
          <i className={`fas ${toastType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <Link to="/rfq" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'RFQ Marketplace' : 'RFQ சந்தை'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span>{lang === 'en' ? 'My RFQ Demands' : 'எனது RFQ கோரிக்கைகள்'}</span>
      </div>

      <div className="my-rfqs-header-bar">
        <div>
          <h1 className="my-rfqs-title">{lang === 'en' ? 'My Submitted RFQ Enquiries' : 'எனது RFQ கோரிக்கைகள்'}</h1>
          <p className="my-rfqs-subtitle">
            {lang === 'en' ? 'Track your active procurement requests, analyze price bids, and award projects to local MSMEs.'
                           : 'உங்கள் கொள்முதல் கோரிக்கைகளைக் கண்காணித்து, சிறந்த விலைச் சலுகைகளைத் தேர்வு செய்து ஆர்டர் வழங்கவும்.'}
          </p>
        </div>
        <button className="wizard-btn-primary" onClick={() => navigate('/rfq')}>
          <i className="fas fa-plus"></i> {lang === 'en' ? 'Post New RFQ' : 'புதிய RFQ போஸ்ட் செய்'}
        </button>
      </div>

      <div className="my-rfqs-list">
        {rfqList.map(rfqData => (
          <div key={rfqData.rfq.id} className="customer-rfq-card">
            {/* RFQ Header details */}
            <div className="customer-rfq-header">
              <div>
                <span className="rfq-category-tag">{rfqData.rfq.category}</span>
                <h3 className="rfq-card-title">{rfqData.rfq.title}</h3>
                <p className="rfq-card-desc">{rfqData.rfq.description}</p>
              </div>
              <div className="rfq-card-status-box">
                <span className={`rfq-status-badge-cust ${rfqData.rfq.status}`}>
                  Status: {rfqData.rfq.status}
                </span>
                <span className="rfq-budget-val">Budget: ₹{rfqData.rfq.budget || 'Open'}</span>
              </div>
            </div>

            <div className="rfq-card-meta-row">
              <span>Quantity: <strong>{rfqData.rfq.quantity}</strong></span>
              <span>Location: <strong>{rfqData.rfq.location}</strong></span>
              <span>Deadline: <strong>{new Date(rfqData.rfq.deadline).toLocaleDateString()}</strong></span>
            </div>

            {/* Received Quotations from local businesses */}
            <div className="rfq-bids-section">
              <h4 className="bids-section-title">
                <i className="fas fa-gavel"></i> {lang === 'en' ? 'Received Quotation Bids' : 'வந்த சலுகைகள்'} ({rfqData.quotes ? rfqData.quotes.length : 0})
              </h4>
              
              <div className="bids-list">
                {rfqData.quotes && rfqData.quotes.map(qData => (
                  <div key={qData.quote.id} className="bid-card">
                    <div className="bid-card-header">
                      <div>
                        <h5 className="bidder-name">{qData.seller ? qData.seller.businessName : 'Verified Merchant'}</h5>
                        <span className="bidder-location"><i className="fas fa-map-marker-alt"></i> {qData.seller ? qData.seller.addressLocality : 'Namakkal'}</span>
                      </div>
                      <div className="bid-price-box">
                        <span className="bid-price">₹{qData.quote.quotedPrice}</span>
                        <span className="bid-timeline">{qData.quote.timelineDays} Days delivery</span>
                      </div>
                    </div>
                    
                    {qData.quote.notes && (
                      <p className="bid-notes">"{qData.quote.notes}"</p>
                    )}

                    <div className="bid-actions-row">
                      <span className={`quote-status-badge ${qData.quote.status}`}>
                        Quote status: {qData.quote.status}
                      </span>
                      
                      <div style={{ flexGrow: 1 }}></div>

                      {qData.quote.status === 'pending' && (
                        <>
                          <button className="bid-btn-shortlist" onClick={() => handleQuoteStatus(qData.quote.id, 'shortlisted')}>
                            Shortlist
                          </button>
                          <button className="bid-btn-accept" onClick={() => handleQuoteStatus(qData.quote.id, 'accepted')}>
                            Accept &amp; Award
                          </button>
                          <button className="bid-btn-reject" onClick={() => handleQuoteStatus(qData.quote.id, 'rejected')}>
                            Reject
                          </button>
                        </>
                      )}
                      
                      {qData.quote.status === 'shortlisted' && (
                        <>
                          <button className="bid-btn-accept" onClick={() => handleQuoteStatus(qData.quote.id, 'accepted')}>
                            Accept &amp; Award
                          </button>
                          <button className="bid-btn-reject" onClick={() => handleQuoteStatus(qData.quote.id, 'rejected')}>
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {(!rfqData.quotes || rfqData.quotes.length === 0) && (
                  <p className="no-bids-message">
                    {lang === 'en' ? 'Awaiting quotation proposals from verified directory businesses...' 
                                   : 'உள்ளூர் வணிகங்களிடம் இருந்து விலைச் சலுகைகள் எதுவும் இதுவரை வரவில்லை...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {rfqList.length === 0 && (
          <div className="no-business-card">
            <i className="fas fa-file-invoice" style={{ fontSize: '50px', color: '#94a3b8', marginBottom: '20px' }}></i>
            <h2>{lang === 'en' ? 'No RFQs Submitted Yet' : 'RFQ கோரிக்கைகள் எதுவும் சமர்ப்பிக்கப்படவில்லை'}</h2>
            <p>{lang === 'en' ? 'Create a custom RFQ describing your needs to receive competitive quotes from local businesses.'
                             : 'உங்கள் தேவைகளை விளக்கும் புதிய RFQ-ஐ சமர்ப்பித்து உள்ளூர் வணிகங்களிடமிருந்து சிறந்த விலைச் சலுகைகளைப் பெறுங்கள்.'}</p>
            <button className="wizard-btn-primary" onClick={() => navigate('/rfq')} style={{ display: 'inline-flex', marginTop: '16px' }}>
              + {lang === 'en' ? 'Create First RFQ' : 'முதல் RFQ-ஐ உருவாக்கு'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyRfqs;
