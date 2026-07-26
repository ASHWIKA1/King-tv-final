import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi, getImageUrl } from '../utils/api';

const subcatEnTranslations = {
  'மாநிலம்': 'State',
  'தேசியம்': 'National',
  'சர்வதேசம்': 'International',
  'அரசு கொள்கைகள்': 'Governance',
  'சந்தை': 'Markets',
  'நிறுவனங்கள்': 'Companies',
  'முதலீடு': 'Investment',
  'ஸ்டார்ட்அப்': 'Startups',
  'கிரிக்கெட்': 'Cricket',
  'கால்பந்து': 'Football',
  'டென்னிஸ்': 'Tennis',
  'உள்ளூர்': 'Local Sports',
  'கோலிவுட்': 'Kollywood',
  'பாலிவுட்': 'Bollywood',
  'விமர்சனங்கள்': 'Reviews',
  'இசை': 'Music',
  'ஸ்மார்ட்போன்': 'Smartphones',
  'மென்பொருள்': 'Software',
  'AI': 'AI',
  'விண்வெளி': 'Space',
  'உலக செய்திகள்': 'World News'
};

const AuthorProfile = () => {
  const { authorName } = useParams();
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 1. Fetch Author Profile Meta Details
    fetchApi(`/articles/public/authors/${encodeURIComponent(authorName)}`)
      .then(profData => {
        setProfile(profData);
        // 2. Fetch all articles written by this author
        return fetchApi(`/articles/getAllWeb?authorId=${encodeURIComponent(authorName)}&size=12`);
      })
      .then(res => {
        const list = res && Array.isArray(res.content) ? res.content : [];
        const formatted = list.map(item => ({
          id: item.id || item.article_id,
          titleTa: item.titleTa,
          titleEn: item.titleEn,
          descTa: item.shortDescTa,
          descEn: item.shortDescEn,
          subcatTa: item.districtId ? 'மாநிலம்' : 'தேசியம்',
          subcatEn: item.districtId ? 'State' : 'National',
          dateTa: '1 மணி நேரம்',
          dateEn: '1 Hr Ago',
          readingTime: item.readingTime || 1,
          imageUrl: item.imageUrl,
          gradient: 'linear-gradient(135deg, #1E40AF, #3B82F6)'
        }));
        setArticles(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not retrieve author profile data", err);
        setLoading(false);
      });
  }, [authorName]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
          <div>{lang === 'en' ? 'Loading journalist profile...' : 'செய்தியாளர் சுயவிவரம் ஏற்றப்படுகிறது...'}</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-circle fa-3x" style={{ marginBottom: '15px', color: 'var(--primary)' }}></i>
          <h3>{lang === 'en' ? 'Journalist Profile Not Found' : 'செய்தியாளர் சுயவிவரம் கண்டறியப்படவில்லை'}</h3>
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
            <i className="fas fa-arrow-left"></i> {lang === 'en' ? 'Back to Home' : 'முகப்பிற்குத் திரும்புக'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="news-section" style={{ width: '100%' }}>
      {/* BIO CARD HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #0F172A)', padding: '50px 0', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumbs */}
          <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
            <Link to="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 600 }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
            <span>{lang === 'en' ? 'Journalists' : 'செய்தியாளர்கள்'}</span>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
            <span style={{ color: 'white' }}>{profile.fullName}</span>
          </div>

          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }} className="author-card-row">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.fullName} 
                style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255, 255, 255, 0.2)' }}
              />
            ) : (
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A', fontSize: '36px', fontWeight: 800, border: '3px solid rgba(255, 255, 255, 0.2)' }}>
                {profile.fullName.charAt(0)}
              </div>
            )}

            <div style={{ flex: 1, minWidth: '260px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {profile.role.replace('ROLE_', '').replace('_', ' ')}
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0 10px 0' }}>{profile.fullName}</h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px', lineHeight: 1.6, maxWidth: '600px', margin: '0 0 16px 0' }}>
                {profile.bio}
              </p>
              
              {/* Contact / Social links */}
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                <span><i className="fas fa-map-marker-alt"></i> {profile.location}</span>
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.8 }}><i className="fab fa-twitter"></i></a>
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.8 }}><i className="fab fa-facebook-f"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES LISTING */}
      <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '25px', color: 'var(--text-dark)' }}>
          {lang === 'en' ? `Articles by ${profile.fullName}` : `${profile.fullName} எழுதிய கட்டுரைகள்`}
        </h2>

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="far fa-newspaper fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
            <div>{lang === 'en' ? 'No articles published by this journalist yet.' : 'இந்த செய்தியாளர் இன்னும் கட்டுரைகள் எதுவும் எழுதவில்லை.'}</div>
          </div>
        ) : (
          <div className="news-grid">
            {articles.map(art => (
              <div 
                className="news-card" 
                key={art.id}
                onClick={() => navigate(`/article/${art.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="card-img" 
                  style={{ 
                    background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : art.gradient 
                  }}
                >
                  <span className="cat-badge" style={{ background: 'var(--primary)' }}>
                    {lang === 'en' ? (subcatEnTranslations[art.subcatTa] || art.subcatEn) : art.subcatTa}
                  </span>
                </div>
                <div className="card-body">
                  <h3>{lang === 'en' ? art.titleEn : art.titleTa}</h3>
                  <p>{lang === 'en' ? art.descEn : art.descTa}</p>
                  <div className="card-meta">
                    <span><i className="far fa-clock"></i> {lang === 'en' ? art.dateEn : art.dateTa}</span>
                    <span><i className="far fa-clock"></i> {lang === 'en' ? `${art.readingTime} Min Read` : `${art.readingTime} நிமிட வாசிப்பு`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 575px) {
          .author-card-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </main>
  );
};

export default AuthorProfile;
