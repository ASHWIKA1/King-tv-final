import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const Advertise = () => {
  const { lang } = useContext(LanguageContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ company: '', contactPerson: '', email: '', phone: '', interest: 'banner', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApi('/pages/advertise')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch advertise page from backend, falling back", err);
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
      setFormData({ company: '', contactPerson: '', email: '', phone: '', interest: 'banner', budget: '', message: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3>{lang === 'en' ? 'Loading Advertise Options...' : 'விவரங்கள் ஏற்றப்படுகிறது...'}</h3>
      </div>
    );
  }

  const pageTitle = data ? (lang === 'en' ? data.titleEn : data.titleTa) : (lang === 'en' ? 'Advertise with Us' : 'விளம்பரம் செய்ய');
  const pageContent = data ? (lang === 'en' ? data.contentEn : data.contentTa) : '';
  const contactPhone = data?.contactPhone || '+91 98765 43211';
  const contactEmail = data?.contactEmail || 'ads@kingstv.com';
  const contactAddress = data?.contactAddress || 'Marketing Dept, 123, Anna Salai, Chennai, Tamil Nadu, India';

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      <div className="breadcrumbs" style={{ marginBottom: '20px' }}>
        <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '10px', margin: '0 8px' }}></i>
        <span>{pageTitle}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <section style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h1 style={{ marginBottom: '15px', color: '#111', fontSize: '2rem', borderBottom: '3px solid #10B981', display: 'inline-block', paddingBottom: '5px' }}>
            {pageTitle}
          </h1>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#444', whiteSpace: 'pre-line' }}>
            {pageContent}
          </p>
        </section>

        {/* Ad Formats and Rates Section */}
        <section style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#111' }}>
            {lang === 'en' ? 'Our Ad Channels & Sizes' : 'எங்களது விளம்பர வழிகள் மற்றும் அளவுகள்'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
              <i className="fas fa-desktop fa-2x" style={{ color: '#10B981', marginBottom: '12px' }}></i>
              <h4 style={{ margin: '0 0 8px 0' }}>{lang === 'en' ? 'Web Banner Ads' : 'இணையதள பேனர் விளம்பரங்கள்'}</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '0' }}>
                {lang === 'en' 
                  ? 'Display ads of sizes 728x90 Leaderboard, 300x250 Sidebar and 970x250 Billboard across category pages.' 
                  : 'இணையதளத்தின் முக்கிய பக்கங்களில் 728x90 லீடர்போர்டு மற்றும் 300x250 சைடுபார்களில் உங்கள் பேனர்களை காட்சிப்படுத்துங்கள்.'}
              </p>
            </div>

            <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
              <i className="fas fa-play-circle fa-2x" style={{ color: '#10B981', marginBottom: '12px' }}></i>
              <h4 style={{ margin: '0 0 8px 0' }}>{lang === 'en' ? 'Live TV Overlay Ads' : 'லைவ் டிவி ஓவர்லே விளம்பரங்கள்'}</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '0' }}>
                {lang === 'en' 
                  ? 'Run L-Band and ticker tape crawler ads directly on our 24x7 Live TV news stream.' 
                  : 'எங்களது 24x7 நேரடி தொலைக்காட்சி செய்தி ஓட்டத்தில் எல்-பேண்ட் மற்றும் கீழ் ஓடும் விளம்பரங்களைப் பெறுங்கள்.'}
              </p>
            </div>

            <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
              <i className="fas fa-mobile-alt fa-2x" style={{ color: '#10B981', marginBottom: '12px' }}></i>
              <h4 style={{ margin: '0 0 8px 0' }}>{lang === 'en' ? 'Sponsored Content' : 'விளம்பர கட்டுரைகள்'}</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '0' }}>
                {lang === 'en' 
                  ? 'Publish feature stories or native article profiles of your brand shared across our social handles.' 
                  : 'உங்கள் நிறுவனத்தின் சிறப்பம்சங்கள் அடங்கிய ஸ்பான்சர் கட்டுரைகள் மற்றும் பிரத்யேக விளம்பரப் பகுதிகள்.'}
              </p>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {/* Ad Contacts Info */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', margin: '0' }}>
              <i className="fas fa-bullhorn" style={{ marginRight: '10px', color: '#10B981' }}></i>
              {lang === 'en' ? 'Ad Sales Contacts' : 'விளம்பர விற்பனைத் தொடர்பு'}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>{lang === 'en' ? 'Sales Hotline' : 'விற்பனைத் தொடர்பு'}</strong>
                <a href={`tel:${contactPhone}`} style={{ color: '#111', textDecoration: 'none', fontWeight: '500' }}>{contactPhone}</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>{lang === 'en' ? 'Email Inquiries' : 'மின்னஞ்சல் முகவரி'}</strong>
                <a href={`mailto:${contactEmail}`} style={{ color: '#111', textDecoration: 'none', fontWeight: '500' }}>{contactEmail}</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>{lang === 'en' ? 'Marketing Office' : 'சந்தைப்படுத்தல் அலுவலகம்'}</strong>
                <span style={{ color: '#111', fontWeight: '500', lineHeight: '1.4' }}>{contactAddress}</span>
              </div>
            </div>
          </div>

          {/* Ad Booking Form */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '0' }}>
              <i className="fas fa-file-contract" style={{ marginRight: '10px', color: '#10B981' }}></i>
              {lang === 'en' ? 'Request Advertising Rates' : 'விளம்பர விவரங்கள் கேட்கவும்'}
            </h3>

            {submitted ? (
              <div style={{ padding: '20px', background: '#DCFCE7', color: '#14532D', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                {lang === 'en' ? 'Thank you! Our ad sales representative will contact you shortly.' : 'நன்றி! எங்களது விளம்பர விற்பனை பிரதிநிதி உங்களைத் தொடர்பு கொள்வார்.'}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {lang === 'en' ? 'Company Name *' : 'நிறுவனத்தின் பெயர் *'}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {lang === 'en' ? 'Contact Person *' : 'தொடர்பு நபர் *'}
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {lang === 'en' ? 'Business Email *' : 'மின்னஞ்சல் *'}
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
                      {lang === 'en' ? 'Phone Number *' : 'தொலைபேசி எண் *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {lang === 'en' ? 'Interest Format' : 'விளம்பர வடிவம்'}
                    </label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                      <option value="banner">{lang === 'en' ? 'Web Banner Ads' : 'இணையதள பேனர்'}</option>
                      <option value="tv">{lang === 'en' ? 'Live TV Stream Ads' : 'நேரடி தொலைக்காட்சி விளம்பரம்'}</option>
                      <option value="sponsored">{lang === 'en' ? 'Sponsored Content' : 'விளம்பரக் கட்டுரை'}</option>
                      <option value="other">{lang === 'en' ? 'Other / Package' : 'இதர விளம்பரங்கள்'}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                      {lang === 'en' ? 'Monthly Budget' : 'மாதாந்திர பட்ஜெட்'}
                    </label>
                    <input
                      type="text"
                      name="budget"
                      placeholder="e.g. 10k - 25k INR"
                      value={formData.budget}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>
                    {lang === 'en' ? 'Additional Notes' : 'கூடுதல் குறிப்புகள்'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your brand and targets..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {lang === 'en' ? 'Send Advertisement Enquiry' : 'விசாரணையை அனுப்பவும்'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;
