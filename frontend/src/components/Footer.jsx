import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

const Footer = () => {
  const { lang } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/assets/icons/logo-icon-light.png" alt="KING 24x7" style={{ height: '40px', width: 'auto' }} className="logo-light-only" />
              <img src="/assets/icons/logo-icon-dark.png" alt="KING 24x7" style={{ height: '40px', width: 'auto' }} className="logo-dark-only" />
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>KING 24x7</span>
            </div>
            <div className="tagline" style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
              {lang === 'en' ? 'Truth. Responsibility. In Tamil.' : 'உண்மை. பொறுப்புடன். தமிழ்.'}
            </div>
            <p style={{ marginTop: '12px' }}>
              {lang === 'en'
                ? 'KING 24x7 is a leading Tamil news portal. We deliver instant, reliable news from Tamil Nadu, India, and across the globe.'
                : 'KING 24x7 ஒரு முன்னணி தமிழ் செய்தி போர்டல். தமிழகம், இந்தியா மற்றும் உலகம் முழுவதும் இருந்து தமிழில் உடனடி, நம்பகமான செய்திகளை வழங்குகிறோம்.'}
            </p>
          </div>

          <div className="footer-col">
            <h5>{lang === 'en' ? 'News' : 'செய்திகள்'}</h5>
            <Link to="/category/politics">{lang === 'en' ? 'Politics' : 'அரசியல்'}</Link>
            <Link to="/category/business">{lang === 'en' ? 'Business' : 'வணிகம்'}</Link>
            <Link to="/category/sports">{lang === 'en' ? 'Sports' : 'விளையாட்டு'}</Link>
            <Link to="/category/cinema">{lang === 'en' ? 'Cinema' : 'சினிமா'}</Link>
            <Link to="/category/tech">{lang === 'en' ? 'Technology' : 'தொழில்நுட்பம்'}</Link>
            <Link to="/directory">{lang === 'en' ? 'Regional' : 'மாநிலம்'}</Link>
            <Link to="/category/international">{lang === 'en' ? 'International' : 'சர்வதேசம்'}</Link>
          </div>

          <div className="footer-col">
            <h5>{lang === 'en' ? 'Download' : 'பதிவிறக்கம்'}</h5>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-google-play"></i> Google Play</a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-apple"></i> App Store</a>
          </div>

          <div className="footer-col">
            <h5>{lang === 'en' ? 'Followers' : 'பின்தொடர'}</h5>
            <div className="footer-social" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a href="https://www.facebook.com/profile.php?id=61551357861905" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://x.com/onlinethamizhan" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/king24x7/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://www.youtube.com/@king24x7" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
          <div>© {currentYear} <strong>KING 24x7</strong> - All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/about-us" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}>{lang === 'en' ? 'About Us' : 'எங்களைப் பற்றி'}</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/contact" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}>{lang === 'en' ? 'Contact' : 'தொடர்புக்கு'}</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/advertise" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}>{lang === 'en' ? 'Advertise' : 'விளம்பரம் செய்ய'}</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/careers" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}>{lang === 'en' ? 'Careers' : 'வேலைவாய்ப்பு'}</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}>{lang === 'en' ? 'Privacy Policy' : 'தனியுரிமைக் கொள்கை'}</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/terms-of-use" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px' }}>{lang === 'en' ? 'Terms & Conditions' : 'விதிமுறைகள்'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
