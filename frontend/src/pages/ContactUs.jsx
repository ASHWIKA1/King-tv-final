import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const ContactUs = () => {
  const { lang } = useContext(LanguageContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApi('/pages/contact')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch contact page from backend, falling back", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3>{lang === 'en' ? 'Loading Contact Details...' : 'விவரங்கள் ஏற்றப்படுகிறது...'}</h3>
      </div>
    );
  }

  const pageTitle = data ? (lang === 'en' ? data.titleEn : data.titleTa) : (lang === 'en' ? 'Contact Us' : 'தொடர்புக்கு');
  const pageContent = data ? (lang === 'en' ? data.contentEn : data.contentTa) : '';
  const contactPhone = data?.contactPhone || '+91 98765 43210';
  const contactEmail = data?.contactEmail || 'contact@kingstv.com';
  const contactAddress = data?.contactAddress || '123, Anna Salai, Chennai, Tamil Nadu, India';
  const mapUrl = data?.googleMapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8522384501725!2d80.25828457593673!3d13.044983013280456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52663b6a95fdf5%3A0x6b63d76e737c355c!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720420000000!5m2!1sen!2sin';

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      <div className="breadcrumbs" style={{ marginBottom: '20px' }}>
        <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '10px', margin: '0 8px' }}></i>
        <span>{pageTitle}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <section style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ marginBottom: '15px', color: '#111', fontSize: '2rem', borderBottom: '3px solid var(--primary-color, #3B82F6)', display: 'inline-block', paddingBottom: '5px' }}>
            {pageTitle}
          </h1>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#444', whiteSpace: 'pre-line' }}>
            {pageContent}
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {/* Contact Details Card */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', margin: '0' }}>
              <i className="fas fa-address-book" style={{ marginRight: '10px', color: '#3B82F6' }}></i>
              {lang === 'en' ? 'Reach Us' : 'எங்களை அடைய'}
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

            {mapUrl && (
              <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginTop: '10px' }}>
                <iframe
                  title="Google Maps Location"
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>

          {/* Contact Form Card */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '0' }}>
              <i className="fas fa-paper-plane" style={{ marginRight: '10px', color: '#3B82F6' }}></i>
              {lang === 'en' ? 'Send a Message' : 'செய்தி அனுப்பவும்'}
            </h3>

            {submitted ? (
              <div style={{ padding: '20px', background: '#DCFCE7', color: '#14532D', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                {lang === 'en' ? 'Your message has been sent successfully!' : 'உங்கள் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!'}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                    {lang === 'en' ? 'Full Name *' : 'முழு பெயர் *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                    {lang === 'en' ? 'Email Address *' : 'மின்னஞ்சல் முகவரி *'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                    {lang === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                    {lang === 'en' ? 'Message *' : 'செய்தி *'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    background: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {lang === 'en' ? 'Submit Enquiry' : 'விசாரணையை சமர்ப்பி'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
