import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const AboutUs = () => {
  const { lang } = useContext(LanguageContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApi('/pages/about-us')
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

  // Fallback defaults
  const pageTitle = data ? (lang === 'en' ? data.titleEn : data.titleTa) : (lang === 'en' ? 'About Us' : 'எங்களைப் பற்றி');
  
  const fallbackEn = `KINGS 24x7 is a premier digital news portal and television library broadcaster based in Tamil Nadu. Founded with a vision to deliver unbiased, prompt, and accurate news, we provide round-the-clock coverage of politics, business, sports, entertainment, technology, and regional updates. Our motto is: Truth. Responsibility. In Tamil.`;
  const fallbackTa = `கிங்ஸ் 24x7 என்பது தமிழ்நாட்டைச் சேர்ந்த ஒரு முன்னணி டிஜிட்டல் செய்தி போர்டல் மற்றும் தொலைக்காட்சி ஊடகமாகும். நடுநிலையான, விரைவான மற்றும் துல்லியமான செய்திகளை வழங்குவதை லட்சியமாகக் கொண்டு, அரசியல், வணிகம், விளையாட்டு, பொழுதுபோக்கு, தொழில்நுட்பம் மற்றும் உள்ளூர் நிகழ்வுகளை 24 மணி நேரமும் உடனுக்குடன் வழங்கி வருகிறோம். எங்களது தாரக மந்திரம்: உண்மை. பொறுப்புடன். தமிழில்.`;

  const pageContent = data 
    ? (lang === 'en' ? data.contentEn : data.contentTa) 
    : (lang === 'en' ? fallbackEn : fallbackTa);
  const contactPhone = data?.contactPhone || '+91 98765 43210';
  const contactEmail = data?.contactEmail || 'contact@kingstv.com';
  const contactAddress = data?.contactAddress || '123, Anna Salai, Chennai, Tamil Nadu, India';
  const mapUrl = data?.googleMapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8522384501725!2d80.25828457593673!3d13.044983013280456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52663b6a95fdf5%3A0x6b63d76e737c355c!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720420000000!5m2!1sen!2sin';

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ marginBottom: '20px' }}>
        <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '10px', margin: '0 8px' }}></i>
        <span>{pageTitle}</span>
      </div>

      <div className="about-us-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Intro Section */}
        <section className="about-intro" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ marginBottom: '15px', color: '#111', fontSize: '2rem', borderBottom: '3px solid var(--primary-color, #3B82F6)', display: 'inline-block', paddingBottom: '5px' }}>
            {pageTitle}
          </h1>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#444', whiteSpace: 'pre-line' }}>
            {pageContent}
          </p>
        </section>

        {/* Contact Info Section */}
        <section className="about-contact" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {/* Card Left: Contact details */}
          <div className="contact-card" style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', margin: '0' }}>
              <i className="fas fa-address-book" style={{ marginRight: '10px', color: 'var(--primary-color, #3B82F6)' }}></i>
              {lang === 'en' ? 'Contact Details' : 'தொடர்பு விவரங்கள்'}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>{lang === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'}</strong>
                <a href={`tel:${contactPhone}`} style={{ color: '#111', textDecoration: 'none', fontWeight: '500' }}>{contactPhone}</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>{lang === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}</strong>
                <a href={`mailto:${contactEmail}`} style={{ color: '#111', textDecoration: 'none', fontWeight: '500' }}>{contactEmail}</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>{lang === 'en' ? 'Headquarters' : 'தலைமையகம்'}</strong>
                <span style={{ color: '#111', fontWeight: '500', lineHeight: '1.4' }}>{contactAddress}</span>
              </div>
            </div>
          </div>

          {/* Card Right: Map */}
          <div className="map-card" style={{ background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', minHeight: '300px' }}>
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: '0', borderRadius: '8px', minHeight: '270px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Headquarters"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
