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

const monthsTa = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

const monthsEn = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ArchiveListing = () => {
  const { year, month } = useParams();
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Archive select navigation states
  const [selectedYear, setSelectedYear] = useState(year || '2026');
  const [selectedMonth, setSelectedMonth] = useState(month || '1');

  useEffect(() => {
    setLoading(true);
    let url = `/articles/getAllWeb?year=${year}&size=24`;
    if (month) {
      url += `&month=${month}`;
    }

    fetchApi(url)
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
        console.warn("Archive fetch failed", err);
        setArticles([]);
        setLoading(false);
      });
  }, [year, month]);

  const handleNavigate = (e) => {
    e.preventDefault();
    if (selectedMonth) {
      navigate(`/archive/${selectedYear}/${selectedMonth}`);
    } else {
      navigate(`/archive/${selectedYear}`);
    }
  };

  const getMonthLabel = (mIndex) => {
    const idx = parseInt(mIndex) - 1;
    if (idx >= 0 && idx < 12) {
      return lang === 'en' ? monthsEn[idx] : monthsTa[idx];
    }
    return '';
  };

  return (
    <main className="news-section" style={{ width: '100%', minHeight: '65vh' }}>
      {/* HEADER SECTION */}
      <div className="category-header" style={{ background: 'linear-gradient(135deg, #1F2937, #111827)', padding: '40px 0', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumbs */}
          <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
            <Link to="/" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 600 }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
            <span>{lang === 'en' ? 'Archives' : 'செய்தி காப்பகம்'}</span>
            <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
            <span style={{ color: 'white' }}>{year}{month ? ` - ${getMonthLabel(month)}` : ''}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>
            {lang === 'en'
              ? `News Archive: ${getMonthLabel(month)} ${year}`
              : `செய்தி காப்பகம்: ${getMonthLabel(month)} ${year}`}
          </h1>
        </div>
      </div>

      {/* FILTER BAR & RESULTS */}
      <div className="container" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {/* Archive Jumper */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '30px',
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>
            <i className="far fa-calendar-alt"></i> {lang === 'en' ? 'Select Date:' : 'தேதியினைத் தேர்வு செய்க:'}
          </span>
          
          <form onSubmit={handleNavigate} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)' }}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)' }}
            >
              <option value="">{lang === 'en' ? 'Whole Year' : 'முழு வருடம்'}</option>
              {monthsEn.map((m, idx) => (
                <option key={idx} value={String(idx + 1)}>
                  {lang === 'en' ? m : monthsTa[idx]}
                </option>
              ))}
            </select>

            <button 
              type="submit" 
              style={{
                padding: '8px 16px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {lang === 'en' ? 'Go' : 'செல்'}
            </button>
          </form>
        </div>

        {/* List Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
            <div>{lang === 'en' ? 'Loading archives...' : 'காப்பக செய்திகள் ஏற்றப்படுகின்றன...'}</div>
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="fas fa-folder-open fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
            <h3>{lang === 'en' ? 'No articles found for this archive period.' : 'இந்த காப்பக காலத்தில் செய்திகள் எதுவும் இல்லை.'}</h3>
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

export default ArchiveListing;
