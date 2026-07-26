import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const PrivacyPolicy = () => {
  const { lang } = useContext(LanguageContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApi('/pages/privacy-policy')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch page details from backend, falling back", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3>{lang === 'en' ? 'Loading Page Details...' : 'பக்கம் ஏற்றப்படுகிறது...'}</h3>
      </div>
    );
  }

  const pageTitle = data ? (lang === 'en' ? data.titleEn : data.titleTa) : (lang === 'en' ? 'Privacy Policy' : 'தனியுரிமைக் கொள்கை');
  
  const fallbackEn = `At KINGS 24x7, we prioritize the confidentiality of our visitors. This Privacy Policy details how we collect, store, and process your personal information.

1. Information We Collect
We collect email addresses and contact information voluntarily submitted during comment registration, wishes, directory submissions, or contact forms.

2. How We Use Information
We use your details to verify directory entries, publish requested public greetings, and communicate support updates. We do not sell or share your data with third parties.

3. Cookies and Analytics
We use standard cookies and analytics trackers to improve user experience, monitor load performance, and display targeted advertisements.`;

  const fallbackTa = `கிங்ஸ் 24x7 இணையதளத்தில் வாசகர்களின் தரவுப் பாதுகாப்பு மற்றும் தனியுரிமையை நாங்கள் மதிக்கிறோம். இந்த கொள்கை நாங்கள் எவ்வாறு வாசகர் தரவைச் சேகரிக்கிறோம் என்பதை விளக்குகிறது.

1. நாங்கள் சேகரிக்கும் தகவல்கள்
கருத்துகள், வாழ்த்துகள், விளம்பரப் பதிவுகள் அல்லது தொடர்புப் படிவங்கள் மூலமாக நீங்கள் எமக்குத் தரும் மின்னஞ்சல் மற்றும் தொலைபேசி எண்களை மட்டுமே நாங்கள் சேகரிக்கிறோம்.

2. தரவுப் பயன்பாடு
சேகரிக்கப்பட்ட தகவல்கள் உங்களது பதிவுகளை சரிபார்க்கவும், ஆதரவு வழங்கவும் மட்டுமே பயன்படுத்தப்படுகின்றன. இவை யாருடனும் வணிக ரீதியாகப் பகிரப்பட மாட்டாது.

3. குக்கீகள் மற்றும் அனலிட்டிக்ஸ்
இணையதளத்தின் வேகத்தை அதிகரிக்கவும் சிறந்த பயனர் அனுபவத்தை வழங்கவும் குக்கீகள் மற்றும் பகுப்பாய்வுக் கருவிகள் பயன்படுத்தப்படுகின்றன.`;

  const pageContent = data 
    ? (lang === 'en' ? data.contentEn : data.contentTa) 
    : (lang === 'en' ? fallbackEn : fallbackTa);

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ marginBottom: '20px' }}>
        <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '10px', margin: '0 8px' }}></i>
        <span>{pageTitle}</span>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ marginBottom: '15px', color: '#111', fontSize: '2rem', borderBottom: '3px solid var(--primary-color, #3B82F6)', display: 'inline-block', paddingBottom: '5px' }}>
          {pageTitle}
        </h1>
        <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#444', whiteSpace: 'pre-line', marginTop: '15px' }}>
          {pageContent}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
