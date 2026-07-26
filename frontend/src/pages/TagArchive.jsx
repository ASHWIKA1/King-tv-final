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

const TagArchive = () => {
  const { tagName } = useParams();
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi(`/articles/getAllWeb?tag=${tagName}&size=20`)
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
        console.warn("Could not fetch tagged articles", err);
        setArticles([]);
        setLoading(false);
      });
  }, [tagName]);

  return (
    <main className="news-section" style={{ width: '100%', minHeight: '60vh' }}>
      {/* HEADER BLOCK */}
      <div className="category-header" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', padding: '40px 0', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumbs */}
          <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
            <Link to="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 600 }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
            <span>{lang === 'en' ? 'Tags' : 'குறிச்சொற்கள்'}</span>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
            <span style={{ color: 'white' }}>#{tagName}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>
            {lang === 'en' ? `Topic: #${tagName}` : `தலைப்பு: #${tagName}`}
          </h1>
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
            <div>{lang === 'en' ? 'Loading topic feeds...' : 'செய்திகள் ஏற்றப்படுகின்றன...'}</div>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="fas fa-folder-open fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
            <h3>{lang === 'en' ? 'No articles found under this topic.' : 'இந்த தலைப்பில் செய்திகள் ஏதும் இல்லை.'}</h3>
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
              <i className="fas fa-arrow-left"></i> {lang === 'en' ? 'Back to Home' : 'முகப்பிற்குத் திரும்புக'}
            </Link>
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
    </main>
  );
};

export default TagArchive;
