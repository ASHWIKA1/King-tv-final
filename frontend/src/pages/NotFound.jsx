import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi, getImageUrl } from '../utils/api';

const NotFound = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchApi('/articles/getAllWeb?sortBy=viewsCount&direction=desc&size=3')
      .then(res => {
        if (res && Array.isArray(res.content)) {
          setTrending(res.content);
        }
      })
      .catch(err => console.warn("Failed to load trending items in 404", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="container" style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', minHeight: '70vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="responsive-404-grid">
        {/* Main 404 Card */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '120px',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--primary), #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            404
          </div>
          
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
            {lang === 'en' ? 'Page Not Found' : 'பக்கம் காணப்படவில்லை'}
          </h2>
          
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', marginBottom: '30px', fontSize: '15px' }}>
            {lang === 'en' 
              ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." 
              : "நீங்கள் தேடும் பக்கம் நீக்கப்பட்டிருக்கலாம் அல்லது தற்காலிகமாக கிடைக்காமல் போகலாம். கீழே உள்ள தேடல் பெட்டியை பயன்படுத்தவும்."}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: '460px', gap: '8px', marginBottom: '30px' }}>
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Search news articles...' : 'செய்திகளைத் தேடுங்கள்...'} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--body-bg)',
                color: 'var(--text-dark)',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button 
              type="submit" 
              style={{
                padding: '12px 24px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              <i className="fas fa-search"></i>
            </button>
          </form>

          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
            <i className="fas fa-home"></i> {lang === 'en' ? 'Return Home' : 'முகப்புப் பக்கத்திற்குச் செல்க'}
          </Link>
        </div>

        {/* Sidebar Trending List */}
        {trending.length > 0 && (
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', color: 'var(--primary)' }}>
              {lang === 'en' ? 'Trending Stories' : 'பிரபலமான செய்திகள்'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {trending.map(art => (
                <Link 
                  key={art.id || art.article_id}
                  to={`/article/${art.id || art.article_id}`} 
                  style={{ display: 'flex', gap: '15px', textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                    flexShrink: 0
                  }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 6px 0' }} className="hover-primary">
                      {lang === 'en' ? art.titleEn : art.titleTa}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      <i className="far fa-clock"></i> {art.readingTime || 1} {lang === 'en' ? 'Min Read' : 'நிமிட வாசிப்பு'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .responsive-404-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default NotFound;
