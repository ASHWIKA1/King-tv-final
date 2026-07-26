import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

const DMCAPolicy = () => {
  const { lang } = useContext(LanguageContext);

  return (
    <main className="container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
        <span>{lang === 'en' ? 'DMCA Policy' : 'பதிப்புரிமை கொள்கை'}</span>
      </div>

      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
          {lang === 'en' ? 'DMCA Copyright Policy' : 'டிஎம்சிஏ பதிப்புரிமைக் கொள்கை'}
        </h1>

        <div style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-dark)' }}>
          <p>
            {lang === 'en'
              ? "Kings TV respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond quickly to claims of copyright infringement committed on our website."
              : "கிங்ஸ் டிவி மற்றவர்களின் அறிவுசார் சொத்துரிமைகளை மதிக்கிறது. டிஜிட்டல் மில்லினியம் பதிப்புரிமைச் சட்டத்தின் (DMCA) படி, எங்கள் இணையதளத்தில் செய்யப்படும் பதிப்புரிமை மீறல் புகார்களுக்கு நாங்கள் விரைவாக பதிலளிப்போம்."}
          </p>

          <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '30px', marginBottom: '10px' }}>
            {lang === 'en' ? '1. Filing an Infringement Notice' : '1. மீறல் அறிவிப்பை தாக்கல் செய்தல்'}
          </h3>
          <p>
            {lang === 'en'
              ? "If you are a copyright owner or authorized agent, please send a written notice to us containing:"
              : "நீங்கள் ஒரு பதிப்புரிமை உரிமையாளராகவோ அல்லது அங்கீகரிக்கப்பட்ட முகவராகவோ இருந்தால், பின்வருவனவற்றை உள்ளடக்கிய எழுத்துப்பூர்வ அறிவிப்பை எங்களுக்கு அனுப்பவும்:"}
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>{lang === 'en' ? "Identification of the copyrighted work claimed to have been infringed." : "மீறப்பட்டதாகக் கூறப்படும் பதிப்புரிமை பெற்ற படைப்பின் அடையாளம்."}</li>
            <li>{lang === 'en' ? "The URL/location of the infringing material on our site." : "எங்கள் தளத்தில் பதிப்புரிமை மீறப்பட்ட பொருளின் இணைய முகவரி (URL)."}</li>
            <li>{lang === 'en' ? "Your contact information (name, address, email, telephone)." : "உங்களின் தொடர்பு விவரங்கள் (பெயர், முகவரி, மின்னஞ்சல், தொலைபேசி)."}</li>
            <li>{lang === 'en' ? "A statement that you have a good faith belief that use of the material is not authorized." : "பொருளின் பயன்பாடு அங்கீகரிக்கப்படவில்லை என்று நீங்கள் நம்புகிறீர்கள் என்பதற்கான அறிக்கை."}</li>
          </ul>

          <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '30px', marginBottom: '10px' }}>
            {lang === 'en' ? '2. Contact Information' : '2. தொடர்பு விவரங்கள்'}
          </h3>
          <p>
            {lang === 'en'
              ? "Please submit your DMCA notice to our designated copyright officer at:"
              : "உங்களது பதிப்புரிமை மீறல் அறிவிப்பை எங்கள் மின்னஞ்சல் முகவரிக்கு அனுப்பவும்:"}
          </p>
          <div style={{
            background: 'var(--body-bg)',
            padding: '16px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontFamily: 'monospace',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Email: dmca@kingstv.com<br />
            Address: Kings TV Media Group, Chennai, Tamil Nadu, India.
          </div>
        </div>
      </div>
    </main>
  );
};

export default DMCAPolicy;
