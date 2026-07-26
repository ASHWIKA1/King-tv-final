import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { fetchApi } from '../utils/api';
import './MyQuotes.css';

const MyQuotes = () => {
  const { lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quotesList, setQuotesList] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-quotes' } });
    }
  }, [isAuthenticated, navigate]);

  const loadMyQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/rfq/my-quotes');
      setQuotesList(Array.isArray(res) ? res : []);
    } catch (e) {
      setQuotesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMyQuotes();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="container center-spinner" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)' }}></i>
        <p style={{ marginTop: '12px', color: '#64748b' }}>{lang === 'en' ? 'Loading My Quotations...' : 'எனது விலைச் சலுகைகள் ஏற்றப்படுகிறது...'}</p>
      </div>
    );
  }

  return (
    <main className="container my-quotes-container" style={{ padding: '40px 20px', minHeight: '80vh', background: theme === 'dark' ? '#0b0f19' : '#f8fafc' }}>
      
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <Link to="/rfq" style={{ color: '#4f46e5', textDecoration: 'none' }}>{lang === 'en' ? 'RFQ Marketplace' : 'RFQ சந்தை'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
        <span style={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>{lang === 'en' ? 'My Quotations' : 'எனது விலைச் சலுகைகள்'}</span>
      </div>

      <div className="my-quotes-header-bar" style={{ marginBottom: '30px' }}>
        <div>
          <h1 className="my-quotes-title" style={{ fontSize: '26px', fontWeight: '850', color: theme === 'dark' ? '#ffffff' : '#0f172a', margin: '0 0 6px 0' }}>
            {lang === 'en' ? 'My Submitted Quotations' : 'எனது விலைச் சலுகைகள்'}
          </h1>
          <p className="my-quotes-subtitle" style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            {lang === 'en' ? 'Oversight and status tracker for all the quotation bids you have submitted to customer RFQs.'
                           : 'நீங்கள் சமர்ப்பித்த விலைச் சலுகைகளின் தற்போதைய நிலையை கண்காணிக்கும் பக்கம்.'}
          </p>
        </div>
      </div>

      <div className="my-quotes-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {quotesList.map(qData => (
          <div 
            key={qData.id} 
            className="my-quote-card" 
            style={{ 
              padding: '24px', 
              borderRadius: '16px', 
              border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0', 
              backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span 
                  style={{ 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    letterSpacing: '0.6px', 
                    textTransform: 'uppercase', 
                    background: '#ede9fe', 
                    color: '#6d28d9', 
                    padding: '3px 8px', 
                    borderRadius: '20px' 
                  }}
                >
                  RFQ Quotation Bid
                </span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: '800', color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
                  {qData.rfqTitle}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span className={`quote-status-badge ${qData.status}`}>
                  {qData.status === 'accepted' ? 'approved' : qData.status}
                </span>
                <strong style={{ fontSize: '18px', color: '#ef4444', fontWeight: '900' }}>₹{qData.quotedPrice.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
              <span>Timeline: <strong>{qData.timelineDays} Days to deliver</strong></span>
              <span>Submitted on: <strong>{new Date(qData.createdAt).toLocaleDateString()}</strong></span>
            </div>

            {qData.notes && (
              <div style={{ marginTop: '6px', paddingTop: '12px', borderTop: theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
                  "{qData.notes}"
                </p>
              </div>
            )}
          </div>
        ))}

        {quotesList.length === 0 && (
          <div className="no-quotes-card" style={{ padding: '60px 20px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '24px' }}>
            <i className="fas fa-gavel" style={{ fontSize: '50px', color: '#94a3b8', marginBottom: '20px' }}></i>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: theme === 'dark' ? '#f8fafc' : '#1e293b' }}>
              {lang === 'en' ? 'No Quotations Submitted Yet' : 'சலுகைகள் எதுவும் இதுவரை சமர்ப்பிக்கப்படவில்லை'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '8px auto 20px auto' }}>
              {lang === 'en' ? 'You have not submitted any price quotations to open customer RFQs yet.'
                             : 'திறந்த வாடிக்கையாளர் RFQ கோரிக்கைகளுக்கு நீங்கள் எந்த சலுகையும் இதுவரை சமர்ப்பிக்கவில்லை.'}
            </p>
            <button className="wizard-btn-primary" onClick={() => navigate('/rfq')} style={{ display: 'inline-flex' }}>
              {lang === 'en' ? 'Browse RFQ Marketplace' : 'RFQ சந்தையை உலாவு'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyQuotes;
