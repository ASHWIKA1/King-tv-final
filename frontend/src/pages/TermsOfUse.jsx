import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const TermsOfUse = () => {
  const { lang } = useContext(LanguageContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApi('/pages/terms-of-use')
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

  const pageTitle = data ? (lang === 'en' ? data.titleEn : data.titleTa) : (lang === 'en' ? 'Terms of Use' : 'பயன்பாட்டு விதிமுறைகள்');
  
  const fallbackEn = `Welcome to KINGS 24x7. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions of use.

1. Intellectual Property
All content, articles, branding, images, layouts, logos, and video broadcasts published on this site are the exclusive intellectual property of KINGS 24x7. Unauthorized redistribution or modification is strictly prohibited.

2. User Conduct
Users agree to use our portal solely for lawful purposes. You shall not submit defamatory, offensive, or infringing comments or materials to our public feeds.

3. Limitation of Liability
KINGS 24x7 provides all news articles and directories on an 'as-is' basis without warranties. We are not liable for any discrepancies or damages arising from the use of this portal.`;

  const fallbackTa = `கிங்ஸ் 24x7 செய்தி ஊடகத்திற்கு உங்களை வரவேற்கிறோம். எங்கள் இணையதளத்தைப் பயன்படுத்தும்போது கீழே குறிப்பிடப்பட்டுள்ள விதிமுறைகளை நீங்கள் முழுமையாக ஒப்புக்கொள்கிறீர்கள்.

1. பதிப்புரிமை மற்றும் அறிவுசார் சொத்து
இங்கு பதிவேற்றப்படும் செய்திகள், தகவல்கள், லோகோக்கள் மற்றும் வீடியோக்கள் அனைத்தும் கிங்ஸ் 24x7 இன் பதிப்புரிமை பெற்றவை. உரிய அனுமதியின்றி இவற்றை நகலெடுக்கவோ அல்லது பகிரவோ கூடாது.

2. பயனர் நடத்தை
வாசகர்கள் எமது தளத்தை முறையான நோக்கங்களுக்காக மட்டுமே பயன்படுத்த வேண்டும். அநாகரிகமான அல்லது அவதூறான கருத்துக்களைப் பதிவிட அனுமதியில்லை.

3. பொறுப்புத் துறப்பு
இங்குள்ள தகவல்கள் துல்லியமாக வழங்கப்பட்டாலும், தொழில்நுட்பக் குறைபாடுகள் அல்லது வெளிப்புறக் காரணிகளால் ஏற்படும் இழப்புகளுக்கு கிங்ஸ் 24x7 பொறுப்பேற்காது.`;

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

export default TermsOfUse;
