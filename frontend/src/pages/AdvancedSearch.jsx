import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi, getImageUrl } from '../utils/api';

const categoryOptions = [
  { id: '', en: 'All Categories', ta: 'அனைத்து பிரிவுகள்' },
  { id: '1', en: 'Politics', ta: 'அரசியல்' },
  { id: '2', en: 'Business', ta: 'வணிகம்' },
  { id: '3', en: 'Sports', ta: 'விளையாட்டு' },
  { id: '4', en: 'Entertainment', ta: 'பொழுதுபோக்கு' },
  { id: '5', en: 'Technology', ta: 'தொழில்நுட்பம்' },
  { id: '6', en: 'International', ta: 'சர்வதேசம்' }
];

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

const AdvancedSearch = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [authorName, setAuthorName] = useState(searchParams.get('author') || '');
  const [startDate, setStartDate] = useState(searchParams.get('start') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end') || '');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [trendingKeywords, setTrendingKeywords] = useState([]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'ta-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (e) => {
      const voiceResult = e.results[0][0].transcript;
      setSearchQuery(voiceResult);
    };

    recognition.start();
  };

  const executeSearch = (qVal, catVal, autVal, startVal, endVal) => {
    setLoading(true);
    let url = `/articles/getAllWeb?size=24`;
    if (qVal) url += `&search=${encodeURIComponent(qVal)}`;
    if (catVal) url += `&categoryId=${encodeURIComponent(catVal)}`;
    if (autVal) url += `&authorId=${encodeURIComponent(autVal)}`;
    if (startVal) url += `&startDateStr=${encodeURIComponent(startVal)}`;
    if (endVal) url += `&endDateStr=${encodeURIComponent(endVal)}`;

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
        console.warn("Search fetch failed", err);
        setArticles([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const author = searchParams.get('author') || '';
    const start = searchParams.get('start') || '';
    const end = searchParams.get('end') || '';

    setSearchQuery(q);
    setCategoryId(category);
    setAuthorName(author);
    setStartDate(start);
    setEndDate(end);

    executeSearch(q, category, author, start, end);
  }, [searchParams]);

  useEffect(() => {
    fetchApi('/analytics/trending-keywords')
      .then(data => {
        if (Array.isArray(data)) {
          setTrendingKeywords(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (categoryId) params.category = categoryId;
    if (authorName.trim()) params.author = authorName.trim();
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;

    setSearchParams(params);
  };

  return (
    <main className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '70vh' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
        <i className="fas fa-chevron-right" style={{ fontSize: '8px', margin: '0 8px', opacity: 0.5 }}></i>
        <span>{lang === 'en' ? 'Advanced Search' : 'செய்திகள் தேடல்'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="search-layout-grid">
        {/* Search Control Panel */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          height: 'fit-content',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', color: 'var(--text-dark)' }}>
            <i className="fas fa-filter"></i> {lang === 'en' ? 'Search Filters' : 'தேடல் வடிகட்டிகள்'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Query */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                {lang === 'en' ? 'Search Text' : 'தேட வேண்டிய வார்த்தை'}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder={lang === 'en' ? 'Keywords...' : 'முக்கிய வார்த்தைகள்...'}
                  style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)', fontSize: '14px' }}
                />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: isListening ? '#EF4444' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={lang === 'en' ? 'Voice Search' : 'குரல் வழித் தேடல்'}
                >
                  <i className={isListening ? "fas fa-microphone-alt" : "fas fa-microphone"}></i>
                </button>
              </div>
              {/* Trending Tags cloud */}
              {trendingKeywords.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {lang === 'en' ? 'Trending:' : 'பிரபலமானவை:'}
                  </span>
                  {trendingKeywords.map((kwObj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(kwObj.keyword);
                        const params = {};
                        params.q = kwObj.keyword;
                        if (categoryId) params.category = categoryId;
                        if (authorName.trim()) params.author = authorName.trim();
                        if (startDate) params.start = startDate;
                        if (endDate) params.end = endDate;
                        setSearchParams(params);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--body-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-block'
                      }}
                    >
                      #{kwObj.keyword}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                {lang === 'en' ? 'Category' : 'செய்திப் பிரிவு'}
              </label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)', fontSize: '14px' }}
              >
                {categoryOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {lang === 'en' ? opt.en : opt.ta}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                {lang === 'en' ? 'Author / Journalist' : 'படைப்பாளர் / நிருபர்'}
              </label>
              <input 
                type="text" 
                value={authorName} 
                onChange={(e) => setAuthorName(e.target.value)} 
                placeholder={lang === 'en' ? 'Reporter Name...' : 'நிருபர் பெயர்...'}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)', fontSize: '14px' }}
              />
            </div>

            {/* Start Date */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                {lang === 'en' ? 'Published After' : 'இதற்குப் பிறகு வெளியிடப்பட்டது'}
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)', fontSize: '14px' }}
              />
            </div>

            {/* End Date */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                {lang === 'en' ? 'Published Before' : 'இதற்கு முன் வெளியிடப்பட்டது'}
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--body-bg)', color: 'var(--text-dark)', fontSize: '14px' }}
              />
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                marginTop: '10px'
              }}
            >
              {lang === 'en' ? 'Search Articles' : 'செய்திகளைத் தேடு'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '25px', color: 'var(--text-dark)' }}>
            {lang === 'en' ? 'Search Results' : 'தேடல் முடிவுகள்'}
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <i className="fas fa-spinner fa-spin fa-2x" style={{ marginBottom: '10px' }}></i>
              <div>{lang === 'en' ? 'Searching news vault...' : 'செய்திகள் தேடப்படுகின்றன...'}</div>
            </div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '16px', background: 'var(--card-bg)' }}>
              <i className="fas fa-search-minus fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
              <h3>{lang === 'en' ? 'No matching articles found.' : 'பொருந்தக்கூடிய செய்திகள் எதுவும் இல்லை.'}</h3>
              <p style={{ fontSize: '14px', maxWidth: '360px', margin: '10px auto 0 auto' }}>
                {lang === 'en' ? 'Try adjusting your text keywords or modifying the date range.' : 'முக்கிய வார்த்தைகளை மாற்றியோ அல்லது தேதியினை மாற்றியோ மீண்டும் தேடவும்.'}
              </p>
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
      </div>

      <style>{`
        @media (min-width: 768px) {
          .search-layout-grid {
            grid-template-columns: 300px 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default AdvancedSearch;
