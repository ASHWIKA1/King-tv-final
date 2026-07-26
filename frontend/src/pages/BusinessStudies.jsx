import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';

const BusinessStudies = () => {
  const { t } = useContext(LanguageContext);
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [authorName, setAuthorName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const fallbackStories = [
    { id: 'demo-1', author_name: 'Murugan', business_name: 'Murugan Coffee Works', title: 'How We Built a Traditional Brand Online', details: 'Using simple social media marketing...' }
  ];

  const loadData = () => {
    fetchApi('/stories')
      .then(data => {
        const formatted = Array.isArray(data) ? data.map(item => ({
          id: item.id || item.story_id,
          author_name: item.authorName || item.author_name,
          business_name: item.businessName || item.business_name,
          title: item.title,
          details: item.details
        })) : [];
        setStories([...formatted, ...fallbackStories]);
      })
      .catch((err) => {
        console.warn("Could not fetch stories from API, using fallback", err);
        setStories(fallbackStories);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApi('/stories', {
      method: 'POST',
      body: JSON.stringify({
        authorName, businessName, title, details, isCaseStudy: false
      })
    })
    .then(() => {
      setAuthorName('');
      setBusinessName('');
      setTitle('');
      setDetails('');
      setShowForm(false);
      loadData();
    })
    .catch(err => {
      console.warn("API write failed, updating UI locally", err);
      setStories(prev => [
        ...prev,
        { id: Date.now(), author_name: authorName, business_name: businessName, title, details }
      ]);
      setAuthorName('');
      setBusinessName('');
      setTitle('');
      setDetails('');
      setShowForm(false);
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)' }}>📈 {t('வணிக வெற்றி கதைகள்')}</h2>
        <button onClick={() => setShowForm(prev => !prev)} className="btn" style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
          {t('புதிய பதிவு')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Author Name *</label>
              <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'black' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Business Name *</label>
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'black' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Story Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'black' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>Story Details (விவரம்) *</label>
            <textarea value={details} onChange={e => setDetails(e.target.value)} required rows="4" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'black' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '12px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
            {t('சமர்ப்பி')}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {stories.map(st => (
          <div key={st.id} className="card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>{st.title}</h3>
            <h4 style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '16px' }}>{st.business_name} - <span style={{ fontStyle: 'italic' }}>By {st.author_name}</span></h4>
            <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: 1.6 }}>{st.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessStudies;
