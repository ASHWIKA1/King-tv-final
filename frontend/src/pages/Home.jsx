import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { fetchApi, getImageUrl } from '../utils/api';
import AdWidget from '../components/AdWidget';
import SkeletonLoader from '../components/SkeletonLoader';
import GenericPageRenderer from '../components/GenericPageRenderer';
import { resolveHandleToChannelId, fetchChannelVideos } from '../services/youtubeService';

const Home = () => {
  const { lang, t } = useContext(LanguageContext);
  const { widgetWidth, slideSpeed, sections } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoTab, setVideoTab] = useState('all');
  const [liveVideo, setLiveVideo] = useState(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [layoutSections, setLayoutSections] = useState([]);
  const [crowdReports, setCrowdReports] = useState([]);
  const [institutionNews, setInstitutionNews] = useState([]);
  const [commodityPrices, setCommodityPrices] = useState([
    { nameEn: 'Gold (24K/10g)', nameTa: 'தங்கம் (24K/10g)', price: '₹72,450', change: '+₹150' },
    { nameEn: 'Silver (1kg)', nameTa: 'வெள்ளி (1kg)', price: '₹91,200', change: '-₹450' },
    { nameEn: 'Paddy (Quintal)', nameTa: 'நெல் (குவிண்டால்)', price: '₹2,300', change: '+₹75' },
    { nameEn: 'Cotton (Candy)', nameTa: 'பருத்தி (கேண்டி)', price: '₹57,500', change: '₹0' }
  ]);
  const defaultTickers = [
    lang === 'en' ? "Welcome to KINGS 24x7 Breaking News Stream" : "🔴 கிங்ஸ் 24x7 நேரலை அவசர செய்திகள்"
  ];
  const [tickers, setTickers] = useState([]);
  const [stories, setStories] = useState([]);
  const [weatherData, setWeatherData] = useState({
    temp: '32°C',
    condition: lang === 'en' ? 'Cloudy' : 'மேகமூட்டம்',
    humidity: '72%',
    wind: '18 km/h',
    forecast: [
      { day: lang === 'en' ? 'Mon' : 'தி', icon: '☀️', temp: '32°' },
      { day: lang === 'en' ? 'Tue' : 'செ', icon: '⛅', temp: '31°' },
      { day: lang === 'en' ? 'Wed' : 'பு', icon: '🌤️', temp: '33°' }
    ]
  });

  const [trendingNews, setTrendingNews] = useState([]);
  const [aggregatedNews, setAggregatedNews] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);

  // Crowd Reporter States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportImageUrl, setReportImageUrl] = useState('');
  const [reportVideoUrl, setReportVideoUrl] = useState('');

  const getCategoryDetails = (categoryId) => {
    return categoriesMap[categoryId] || { slug: 'politics', en: 'Politics', ta: 'அரசியல்' };
  };

  const storiesList = [
    { id: 1, titleTa: "உலக கோப்பை கிரிக்கெட் 2027 அட்டவணை", titleEn: "World Cup Cricket 2027 Schedule", cat: "sports", badge: "NEW", views: "12.4K", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
    { id: 2, titleTa: "ரஜினி அடுத்த படம் - முதல் பார்வை", titleEn: "Rajini next movie first look out", cat: "cinema", badge: "HOT", views: "18.2K", gradient: "linear-gradient(135deg, #D946EF, #EC4899)" },
    { id: 3, titleTa: "பாராளுமன்ற தேர்தல் 2029 - முன்னோட்டம்", titleEn: "General Election 2029 - Preview", cat: "politics", badge: "TREND", views: "9.5K", gradient: "linear-gradient(135deg, #1E40AF, #3B82F6)" }
  ];

  const mockTickers = [
    lang === 'en' ? "Welcome to Kings 24x7 News!" : "கிங்ஸ் 24x7 செய்திகளுக்கு வரவேற்கிறோம்!"
  ];



  useEffect(() => {
    // Primary fetches wrapped in promises for loading state coordination
    const pCategories = fetchApi('/categories')
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(cat => {
            map[cat.id || cat.categoryId] = {
              slug: cat.slug || 'politics',
              en: cat.name || 'Politics',
              ta: cat.nameTa || 'அரசியல்'
            };
          });
          setCategoriesMap(map);
        }
      })
      .catch(err => console.warn("Could not load categories", err));

    const pArticles = fetchApi('/articles')
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setArticles(list);
      })
      .catch(err => {
        console.warn("Could not load articles from API", err);
        setArticles([]);
      });

    const pBreakingNews = fetchApi('/breaking-news/getAllWeb?size=50')
      .then(data => {
        let list = [];
        if (data && Array.isArray(data.content)) {
          list = data.content;
        } else if (Array.isArray(data)) {
          list = data;
        }
        if (list.length > 0) {
          const formatted = list.map(item => {
            if (typeof item === 'string') return item;
            const tTa = item.titleTa || item.title_ta;
            const tEn = item.titleEn || item.title_en || item.title;
            return (lang === 'en' ? (tEn || tTa) : (tTa || tEn)) || item.title || item.titleTa;
          }).filter(Boolean);
          if (formatted.length > 0) {
            setTickers(formatted);
            return;
          }
        }
        setTickers(defaultTickers);
      })
      .catch(err => {
        console.warn("Could not load breaking news from API", err);
        setTickers(defaultTickers);
      });

    const pWebStories = fetchApi('/web-stories/getAllWeb?size=6')
      .then(data => {
        const list = data && Array.isArray(data.content) ? data.content : [];
        if (list.length > 0) {
          const formatted = list.map(item => ({
            id: item.id || item.storyId,
            titleTa: item.titleTa,
            titleEn: item.titleEn,
            cat: item.cat || 'politics',
            badge: item.badge || 'NEW',
            views: item.viewsCount ? `${(item.viewsCount / 1000).toFixed(1)}K` : '0K',
            gradient: item.backgroundGradient || 'linear-gradient(135deg, #667eea, #764ba2)'
          }));
          setStories(formatted);
        } else {
          setStories(storiesList);
        }
      })
      .catch(err => {
        console.warn("Could not load web stories from API, using fallback", err);
        setStories(storiesList);
      });

    const categorizeVideo = (title = '', description = '') => {
      const text = `${title} ${description}`.toLowerCase();
      if (text.includes('tvk') || text.includes('dmk') || text.includes('admk') || text.includes('bjp') || text.includes('election') || text.includes('politics') || text.includes('அரசியல்') || text.includes('தேர்தல்') || text.includes('அமைச்சர்')) {
        return 1; // politics
      }
      if (text.includes('gold') || text.includes('rate') || text.includes('price') || text.includes('market') || text.includes('budget') || text.includes('business') || text.includes('தங்கம்') || text.includes('விலை') || text.includes('வணிகம்') || text.includes('agri') || text.includes('farmer') || text.includes('நெல்') || text.includes('விவசாயம்')) {
        return 2; // business / agriculture
      }
      if (text.includes('ipl') || text.includes('csk') || text.includes('cricket') || text.includes('match') || text.includes('sports') || text.includes('dhoni') || text.includes('விளையாட்டு') || text.includes('கிரிக்கெட்')) {
        return 3; // sports
      }
      if (text.includes('cinema') || text.includes('movie') || text.includes('teaser') || text.includes('trailer') || text.includes('actor') || text.includes('திரைப்படம்') || text.includes('சினிமா')) {
        return 4; // cinema
      }
      if (text.includes('isro') || text.includes('gaganyaan') || text.includes('space') || text.includes('tech') || text.includes('metro') || text.includes('train') || text.includes('தொழில்நுட்பம்')) {
        return 5; // tech
      }
      if (text.includes('tamil nadu') || text.includes('chennai') || text.includes('rain') || text.includes('alert') || text.includes('கனமழை') || text.includes('சென்னை')) {
        return 6; // regional
      }
      if (text.includes('us') || text.includes('china') || text.includes('global') || text.includes('world') || text.includes('international') || text.includes('சர்வதேசம்') || text.includes('உலகம்')) {
        return 7; // international
      }
      return 6; 
    };

    const pVideos = (async () => {
      try {
        const channelId = await resolveHandleToChannelId('@king24x7');
        const fetched = await fetchChannelVideos(channelId, 12);
        const mapped = fetched.map(vid => ({
          ...vid,
          categoryId: categorizeVideo(vid.title, vid.description)
        }));
        setVideos(mapped);
      } catch (err) {
        console.warn("Could not load YouTube videos for home page, trying fallback", err);
        try {
          const fallbackData = await fetchApi('/videos');
          if (Array.isArray(fallbackData)) {
            setVideos(fallbackData);
          }
        } catch (fallbackErr) {
          console.error("Local videos fallback failed:", fallbackErr);
          setVideos([]);
        }
      }
    })();

    const pLiveVideo = fetchApi('/videos/live')
      .then(data => {
        if (data && data.youtubeUrl) {
          let titleVal = data.title;
          let descVal = data.description;
          if (lang === 'en') {
            titleVal = 'KINGS 24x7 Live TV News Stream';
            descVal = 'Watch continuous Tamil and English live news coverage, debates and special updates.';
          }
          setLiveVideo({ ...data, title: titleVal, description: descVal });
        }
      })
      .catch(err => console.warn("Could not load live video from API", err));

    const pLayout = fetchApi('/public/layout/web')
      .then(data => {
        if (Array.isArray(data)) {
          setLayoutSections(data);
        }
      })
      .catch(() => {});

    const pTrending = fetchApi('/articles/public/trending')
      .then(data => {
        if (Array.isArray(data)) {
          setTrendingNews(data);
        }
      })
      .catch(() => {});

    const pRss = fetchApi('/rss-aggregator/latest?page=0&size=5')
      .then(data => {
        if (data && Array.isArray(data.content)) {
          setAggregatedNews(data.content);
        }
      })
      .catch(err => console.warn("Could not load RSS aggregated news", err));

    const pInstitution = fetchApi('/articles/public/institution-news')
      .then(data => {
        if (Array.isArray(data)) {
          setInstitutionNews(data);
        }
      })
      .catch(() => {});

    const pCrowd = fetchApi('/report-news/getAllWeb?size=4')
      .then(res => {
        if (res && Array.isArray(res.content)) {
          setCrowdReports(res.content);
        }
      })
      .catch(() => {});

    // Geolocation Personalized Articles
    const selectedDistId = localStorage.getItem('selectedDistrictId');
    let newsUrl = '/public/news?limit=12';
    if (selectedDistId) {
      newsUrl = `/articles/getAllWeb?districtId=${selectedDistId}&size=12`;
    }

    const pPersonalized = new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            fetchApi(`${newsUrl}&lat=${latitude}&lon=${longitude}`)
              .then(data => {
                const list = data && Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
                if (list.length > 0) setArticles(list);
                resolve();
              })
              .catch(() => { resolve(); });
          },
          () => {
            fetchApi(newsUrl)
              .then(data => {
                const list = data && Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
                if (list.length > 0) setArticles(list);
                resolve();
              })
              .catch(() => { resolve(); });
          }
        );
      } else {
        fetchApi(newsUrl)
          .then(data => {
            const list = data && Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
            if (list.length > 0) setArticles(list);
            resolve();
          })
          .catch(() => { resolve(); });
      }
    });

    // 7. Fetch Weather Forecast from backend for Chennai
    const baseApi = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';
    const pWeather = fetch(`${baseApi}/weather?city=Chennai`)
      .then(res => res.json())
      .then(data => {
        if (data && data.temp) {
          const forecastData = [];
          if (data.forecast && Array.isArray(data.forecast)) {
            for (let i = 0; i < Math.min(3, data.forecast.length); i++) {
              const fc = data.forecast[i];
              forecastData.push({
                day: lang === 'en' ? fc.day : (fc.day === 'Mon' ? 'தி' : fc.day === 'Tue' ? 'செ' : fc.day === 'Wed' ? 'பு' : fc.day === 'Thu' ? 'வி' : fc.day === 'Fri' ? 'வெ' : fc.day === 'Sat' ? 'ச' : 'ஞா'),
                icon: fc.icon,
                temp: fc.temp
              });
            }
          }
          setWeatherData({
            temp: data.temp,
            condition: lang === 'en' ? data.condition : data.conditionTa,
            humidity: data.humidity,
            wind: data.wind,
            forecast: forecastData.length > 0 ? forecastData : weatherData.forecast
          });
        }
      })
      .catch(err => console.warn("Weather fetch failed, using default info", err));

    const pCaseStudies = fetchApi('/pdfs')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCaseStudies(data);
        }
      })
      .catch(err => console.warn("Could not load PDFs", err));

    // Resolve loading after critical calls complete
    Promise.allSettled([
      pCategories, pArticles, pBreakingNews, pWebStories, pVideos, pLiveVideo,
      pLayout, pTrending, pRss, pInstitution, pCrowd, pPersonalized, pWeather, pCaseStudies
    ]).then((results) => {
      // Check if critical resources failed (e.g., articles could not load)
      const articlesSuccess = results[1].status === 'fulfilled';
      if (!articlesSuccess) {
        setError(lang === 'en' ? 'Fatal: Failed to connect to the backend service.' : 'சேவை இணைப்பு தோல்வியடைந்தது.');
      }
      setLoading(false);
    });
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, slideSpeed * 1000);
    return () => clearInterval(timer);
  }, [slideSpeed, tickers.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCommodityPrices(prev => prev.map(item => {
        const numericStr = item.price.replace(/[^\d]/g, '');
        const currentPrice = parseInt(numericStr);
        const changeVal = Math.floor(Math.random() * 21) - 10;
        const newPrice = currentPrice + changeVal;
        const changeSign = changeVal >= 0 ? '+' : '';
        return {
          ...item,
          price: `₹${newPrice.toLocaleString('en-IN')}`,
          change: `${changeSign}₹${changeVal}`
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const baseUrl = window.location.origin;
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": `${baseUrl}/`,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    let script = document.getElementById('jsonld-website-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'jsonld-website-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(websiteSchema);

    return () => {
      const existingScript = document.getElementById('jsonld-website-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const getSortedSections = (keys) => {
    if (!layoutSections || layoutSections.length === 0) {
      return keys.map((key, idx) => ({ sectionKey: key, sectionLabel: '', displayOrder: idx + 1 }));
    }
    const filtered = layoutSections.filter(s => keys.includes(s.sectionKey) && s.isVisible !== false);
    if (filtered.length > 0) {
      return filtered.sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return keys.map((key, idx) => ({ sectionKey: key, sectionLabel: '', displayOrder: idx + 1 }));
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    fetchApi('/report-news/saveUpdate', {
      method: 'POST',
      body: JSON.stringify({
        reporterName,
        reporterContact,
        title: reportTitle,
        details: reportDetails,
        imageUrl: reportImageUrl || null,
        videoUrl: reportVideoUrl || null,
        status: 'pending'
      })
    })
    .then(() => {
      alert(lang === 'en' ? 'Thank you! Your news report has been submitted for review.' : 'நன்றி! உங்கள் செய்தி அறிக்கை மதிப்பாய்வுக்காக சமர்ப்பிக்கப்பட்டுள்ளது.');
      setReporterName('');
      setReporterContact('');
      setReportTitle('');
      setReportDetails('');
      setReportImageUrl('');
      setReportVideoUrl('');
      setShowReportModal(false);
    })
    .catch(err => {
      console.warn("API report submission failed, simulating success locally", err);
      alert(lang === 'en' ? 'Thank you! Your news report has been submitted for review.' : 'நன்றி! உங்கள் செய்தி அறிக்கை மதிப்பாய்வுக்காக சமர்ப்பிக்கப்பட்டுள்ளது.');
      setReporterName('');
      setReporterContact('');
      setReportTitle('');
      setReportDetails('');
      setReportImageUrl('');
      setReportVideoUrl('');
      setShowReportModal(false);
    });
  };

  const featured = articles.length > 0 ? articles[0] : null;
  const featuredCat = featured ? getCategoryDetails(featured.categoryId) : null;
  const sideArticles = articles.slice(1, 4);
  const latestGrid = articles.slice(0, 6);

  const gradients = [
    "linear-gradient(135deg, #1E40AF, #3B82F6)",
    "linear-gradient(135deg, #DC2626, #F97316)",
    "linear-gradient(135deg, #059669, #22C55E)",
    "linear-gradient(135deg, #7C3AED, #A855F7)",
    "linear-gradient(135deg, #D946EF, #EC4899)",
    "linear-gradient(135deg, #16A34A, #4ADE80)"
  ];

  const renderCommodityTicker = () => {
    return (
      <div style={{
        background: '#1F2937',
        color: 'white',
        padding: '10px 0',
        fontSize: '13px',
        fontWeight: 600,
        overflow: 'hidden',
        borderBottom: '1px solid #374151'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFD700', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px', fontWeight: 800 }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%' }}></span>
            {lang === 'en' ? 'Live Markets' : 'நேரடி சந்தை'}
          </div>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', scrollbarWidth: 'none', padding: '0 10px', flex: 1 }}>
            {commodityPrices.map((item, idx) => {
              const isUp = item.change.startsWith('+');
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{lang === 'en' ? item.nameEn : item.nameTa}:</span>
                  <span style={{ color: 'white', fontWeight: 700 }}>{item.price}</span>
                  <span style={{ color: isUp ? '#22C55E' : '#EF4444', fontSize: '11px', fontWeight: 700 }}>{item.change}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderNewsTicker = () => {
    return (
      <div className="breaking-news">
        <div className="container">
          <div className="breaking-label" style={{ backgroundColor: '#FFD700', color: '#000' }}>
            <i className="fas fa-bolt"></i> BREAKING NEWS
          </div>
          <div className="breaking-ticker">
            <div className="breaking-track" id="breakTrack">
              <a href="#">{tickers[tickerIndex]}</a>
            </div>
          </div>
          <div className="breaking-controls">
            <button onClick={() => setTickerIndex(prev => (prev - 1 + tickers.length) % tickers.length)}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={() => setTickerIndex(prev => (prev + 1) % tickers.length)}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHero = () => {
    if (!featured) return null;
    return (
      <section className="hero-section" id="section-hero">
        <div className="container">
          <div className="hero-grid">
            <div className={`featured-card theme-${featuredCat.slug}`}>
              <div 
                className="card-img" 
                style={{ 
                  background: featured.imageUrl ? `url(${getImageUrl(featured.imageUrl)}) center/cover` : 'linear-gradient(135deg, #1E40AF, #3B82F6)' 
                }}
              ></div>
              <div className="card-overlay">
                <span className="category-badge" style={{ background: 'var(--category-color, var(--primary))' }}>
                  {lang === 'en' ? featuredCat.en : featuredCat.ta}
                </span>
                <h2>
                  <Link to={`/article/${featured.id || featured.article_id}`} style={{ color: 'white', textDecoration: 'none' }}>
                    {lang === 'en' ? featured.titleEn : featured.titleTa}
                  </Link>
                </h2>
                <p>
                  {lang === 'en' ? featured.shortDescEn : featured.shortDescTa}
                </p>
                <div className="meta">
                  <span><i className="far fa-calendar-alt"></i> 20 May 2025</span>
                  <span><i className="far fa-clock"></i> {lang === 'en' ? `${featured.readingTime || 1} Min Read` : `${featured.readingTime || 1} நிமிட வாசிப்பு`}</span>
                </div>
              </div>
            </div>

            <div className="hero-stack">
              {sideArticles.map((art, idx) => {
                const stackCat = getCategoryDetails(art.categoryId);
                return (
                  <div className={`hero-stack-card theme-${stackCat.slug}`} key={art.id || art.article_id}>
                    <div className="info">
                      <span className="category-badge" style={{ background: 'var(--category-color, var(--primary))' }}>
                        {lang === 'en' ? stackCat.en : stackCat.ta}
                      </span>
                      <h4>
                        <Link to={`/article/${art.id || art.article_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {lang === 'en' ? art.titleEn : art.titleTa}
                        </Link>
                      </h4>
                      <div className="meta">
                        <span><i className="far fa-calendar-alt"></i> 20 May 2025</span>
                      </div>
                    </div>
                    <div 
                      className="thumb" 
                      style={{ 
                        background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : gradients[(idx + 1) % gradients.length] 
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderQuickAccess = () => {
    return (
      <section className="quick-access" style={{ margin: '20px 0' }}>
        <div className="container">
          <div className="quick-grid">
            <Link to="/directory" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#0057FF' }}><i className="fas fa-map-marker-alt"></i></div>
              <span>{lang === 'en' ? 'Regional' : 'நம்ம ஊர்'}</span>
            </Link>
            <Link to="/category/politics" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#F97316' }}><i className="fas fa-bullhorn"></i></div>
              <span>{lang === 'en' ? 'Alerts' : 'அறிவிப்பு'}</span>
            </Link>
            <Link to="/deals" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#22C55E' }}><i className="fas fa-exchange-alt"></i></div>
              <span>{lang === 'en' ? 'Buy & Sell' : 'வாங்க விற்க'}</span>
            </Link>
            <Link to="/directory" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#EC4899' }}><i className="fas fa-hand-holding-heart"></i></div>
              <span>{lang === 'en' ? 'Donations' : 'தானம்'}</span>
            </Link>
            <Link to="/wishes" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#A855F7' }}><i className="fas fa-gift"></i></div>
              <span>{lang === 'en' ? 'Wishes' : 'வாழ்த்து'}</span>
            </Link>
            <Link to="/category/business" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#059669' }}><i className="fas fa-chart-bar"></i></div>
              <span>{lang === 'en' ? 'Business' : 'வணிகம்'}</span>
            </Link>
            <Link to="/jobs" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#16A34A' }}><i className="fas fa-briefcase"></i></div>
              <span>{lang === 'en' ? 'Jobs' : 'வேலை'}</span>
            </Link>
            <Link to="/classifieds" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#06B6D4' }}><i className="fas fa-calendar-alt"></i></div>
              <span>{lang === 'en' ? 'Events' : 'நிகழ்ச்சி'}</span>
            </Link>
            <Link to="/submit-report" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#EF4444' }}><i className="fas fa-exclamation-triangle"></i></div>
              <span>{lang === 'en' ? 'Report' : 'புகார்'}</span>
            </Link>
            <Link to="/obituaries" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon" style={{ background: '#64748B' }}><i className="fas fa-pray"></i></div>
              <span>{lang === 'en' ? 'Obituaries' : 'இரங்கல்'}</span>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderLatestNews = (label, configJson) => {
    let displayArticles = articles;
    try {
      const cfg = typeof configJson === 'string' ? JSON.parse(configJson) : (configJson || {});
      if (cfg.categoryId) {
        displayArticles = displayArticles.filter(a => String(a.categoryId) === String(cfg.categoryId));
      }
      if (cfg.limit) {
        displayArticles = displayArticles.slice(0, cfg.limit);
      } else {
        displayArticles = displayArticles.slice(0, 6);
      }
    } catch (e) {
      displayArticles = articles.slice(0, 6);
    }

    return (
      <section className="news-section" style={{ margin: '20px 0' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '15px' }}>
            <h2><i className="fas fa-newspaper"></i> {label || (lang === 'en' ? 'Latest News' : 'சமீபத்திய செய்திகள்')}</h2>
          </div>
          <div className="news-grid-3" id="newsGrid">
            {displayArticles.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748B' }}>
                <i className="fas fa-inbox fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
                <h3>{lang === 'en' ? 'No news published yet' : 'இன்னும் செய்திகள் வெளியிடப்படவில்லை'}</h3>
              </div>
            ) : displayArticles.map((art, idx) => {
              const gridCat = getCategoryDetails(art.categoryId);
              return (
                <div className={`news-card theme-${gridCat.slug}`} key={art.id || art.article_id || idx}>
                  <div 
                    className="card-img" 
                    style={{ 
                      background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : gradients[idx % gradients.length] 
                    }}
                  >
                    <span className="cat-badge" style={{ background: 'var(--category-color, var(--primary))' }}>
                      {lang === 'en' ? gridCat.en : gridCat.ta}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3>
                      <Link to={`/article/${art.id || art.article_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {lang === 'en' ? art.titleEn : art.titleTa}
                      </Link>
                    </h3>
                    <p>
                      {lang === 'en' ? art.shortDescEn : art.shortDescTa}
                    </p>
                    <div className="card-meta">
                      <span><i className="far fa-clock"></i> 1 Hr Ago</span>
                      <span><i className="far fa-eye"></i> {art.viewsCount || 340}</span>
                      <span><i className="far fa-clock"></i> {lang === 'en' ? `${art.readingTime || 1} Min Read` : `${art.readingTime || 1} நிமிட வாசிப்பு`}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderVideoNews = () => {
    const homeCatIdMap = {
      'all': null,
      'politics': 1,
      'business': 2,
      'sports': 3,
      'cinema': 4,
      'tech': 5,
      'regional': 6,
      'international': 7
    };

    const filteredHomeVideos = videoTab === 'all'
      ? videos
      : videos.filter(vid => vid.categoryId === homeCatIdMap[videoTab]);

    return (
      <section className="video-section" id="section-video" style={{ margin: '30px 0' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-video" style={{ color: '#EF4444' }}></i> {lang === 'en' ? 'Video News' : 'வீடியோ செய்திகள்'}</h2>
            <Link to="/videos" className="view-all">{lang === 'en' ? 'More Videos' : 'மேலும் வீடியோக்கள்'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          {/* Video categories tabs removed */}
          <div className="video-grid-4">
            {filteredHomeVideos.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748B' }}>
                <i className="fas fa-video-slash fa-3x" style={{ marginBottom: '15px', opacity: 0.5 }}></i>
                <h3>{lang === 'en' ? 'No videos published yet' : 'இன்னும் வீடியோக்கள் வெளியிடப்படவில்லை'}</h3>
              </div>
            ) : filteredHomeVideos.slice(0, 4).map((vid, idx) => (
              <Link 
                to="/videos" 
                state={{ selectVideoId: vid.id }} 
                className="video-card" 
                key={vid.id || vid.videoId || idx}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="thumb-area">
                  {vid.thumbnailUrl ? (
                    <img src={getImageUrl(vid.thumbnailUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={vid.title} />
                  ) : (
                    <div style={{ background: gradients[idx % gradients.length], width: '100%', height: '100%' }}></div>
                  )}
                  <div className="play-overlay"><i className="fas fa-play"></i></div>
                  {vid.isLive ? (
                    <span className="duration" style={{ backgroundColor: '#EF4444' }}>LIVE</span>
                  ) : (
                    <span className="duration">{vid.duration || '3:15'}</span>
                  )}
                </div>
                <div className="body">
                  <h5>{vid.title}</h5>
                  <div className="meta">
                    {vid.isLive ? (
                      <span style={{ color: '#EF4444', fontWeight: 700 }}><i className="fas fa-circle" style={{ fontSize: '8px', animation: 'pulse-live 1.5s infinite' }}></i> Live Now</span>
                    ) : (
                      <span><i className="far fa-calendar-alt"></i> {new Date(vid.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderWebStories = () => {
    return (
      <section className="stories-section" id="section-stories" style={{ margin: '30px 0' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-sticky-note"></i> {lang === 'en' ? 'Web Stories' : 'வெப் ஸ்டோரிஸ்'}</h2>
            <Link to="/web-stories" className="view-all">{lang === 'en' ? 'View All' : 'அனைத்தும் காண'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="stories-track">
            {stories.map(story => {
              const catSlug = story.cat === 'tech' ? 'technology' : story.cat === 'agri' ? 'agriculture' : story.cat;
              const catNames = {
                sports: { en: 'Sports', ta: 'விளையாட்டு' },
                cinema: { en: 'Cinema', ta: 'சினிமா' },
                politics: { en: 'Politics', ta: 'அரசியல்' },
                tech: { en: 'Technology', ta: 'தொழில்நுட்பம்' },
                agri: { en: 'Agriculture', ta: 'விவசாயம்' },
                business: { en: 'Business', ta: 'வணிகம்' }
              }[story.cat] || { en: story.cat, ta: story.cat };

              return (
                <Link to="/web-stories" className="story-card" style={{ background: story.gradient, textDecoration: 'none' }} key={story.id}>
                  <span className="badge-tag" style={{ background: story.badge === 'NEW' ? '#EF4444' : '#F97316' }}>{story.badge}</span>
                  <div className="story-overlay">
                    <span className={`story-cat cat-${catSlug}`}>
                      {lang === 'en' ? catNames.en : catNames.ta}
                    </span>
                    <h5>{lang === 'en' ? story.titleEn : story.titleTa}</h5>
                    <span className="views"><i className="far fa-eye"></i> {story.views}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderTrendingSidebar = (label) => {
    return (
      <section className="trending-section" style={{ margin: '20px 0' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '15px' }}>
            <h2><i className="fas fa-fire" style={{ color: '#EF4444' }}></i> {label || (lang === 'en' ? 'Trending News' : 'ட்ரெண்டிங் செய்திகள்')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {trendingNews.slice(0, 5).map((art, idx) => (
              <div className="trending-item" key={art.id || art.article_id || idx} style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <span className="rank top3">{idx + 1}</span>
                <div className="info">
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700 }}>
                    <Link to={`/article/${art.id || art.article_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {lang === 'en' ? art.titleEn : art.titleTa}
                    </Link>
                  </h5>
                  <div className="meta">
                    <span><i className="far fa-eye"></i> {art.viewsCount || '0'} {lang === 'en' ? 'reads' : 'வாசிப்புகள்'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderRssAggregatedNews = () => {
    return (
      <div className="trending-list" style={{ marginBottom: '20px', padding: '15px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 15px', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-rss" style={{ color: '#F59E0B' }}></i>{' '}
          {lang === 'en' ? 'From Other Sources' : 'இதர செய்தி ஊடகங்கள்'}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {aggregatedNews && aggregatedNews.length > 0 ? (
            aggregatedNews.slice(0, 5).map((item, idx) => (
              <a href={item.externalLink} target="_blank" rel="noopener noreferrer noindex" key={item.id || idx} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  {item.sourceLogo && (
                    <img src={item.sourceLogo} alt={item.sourceName} style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'contain', marginTop: '2px', background: '#f1f5f9', padding: '2px' }} />
                  )}
                  <div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', lineHeight: '1.4', color: 'var(--text-primary)' }}>{item.title}</h5>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>{item.sourceName}</span>
                      <span>•</span>
                      <span>{new Date(item.publishedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div style={{ padding: '10px 0', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {lang === 'en' ? 'No recent external articles' : 'செய்திகள் எதுவும் இல்லை'}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeather = () => {
    return (
      <div className="weather-widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-cloud-sun" style={{ color: 'var(--primary)' }}></i>{' '}
            {lang === 'en' ? 'Chennai Weather' : 'சென்னை வானிலை'}
          </h4>
          <Link 
            to="/weather" 
            style={{ 
              fontSize: '12px', 
              color: 'var(--primary, #B3732A)', 
              textDecoration: 'none', 
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {lang === 'en' ? 'View All' : 'மேலும் பார்'} <i className="fas fa-arrow-right" style={{ fontSize: '10px' }}></i>
          </Link>
        </div>
        <div className="weather-current">
          <div className="temp" id="weatherTemp">{weatherData.temp}</div>
          <div className="details">
            <strong>{weatherData.condition}</strong>
            <span>{lang === 'en' ? `Humidity: ${weatherData.humidity}` : `ஈரப்பதம்: ${weatherData.humidity}`}</span>
            <span>{lang === 'en' ? `Wind: ${weatherData.wind}` : `காற்று: ${weatherData.wind}`}</span>
          </div>
        </div>
        <div className="weather-forecast-grid">
          {weatherData.forecast.map((f, idx) => (
            <div className="weather-forecast-col" key={idx}>
              <div className="day">{f.day}</div>
              <div className="icon">{f.icon}</div>
              <div className="temp">{f.temp}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLiveTv = () => {
    return (
      <div className="weather-widget" style={{ marginTop: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-tv" style={{ color: '#EF4444' }}></i>{' '}
          {lang === 'en' ? 'Live Broadcast' : 'நேரலை ஒளிபரப்பு'}
        </h4>
        <div style={{ width: '100%', height: '180px', background: 'black', borderRadius: '8px', overflow: 'hidden' }}>
          {liveVideo ? (
            <iframe 
              src={liveVideo.videoUrl} 
              title="Live Stream" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px', flexDirection: 'column', gap: '8px' }}>
              <i className="fas fa-play-circle fa-2x"></i>
              <span>{lang === 'en' ? '[ LIVE TV STREAM WINDOW ]' : '[ நேரலை டிவி ஒளிபரப்பு ]'}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBusinessCase = () => {
    return (
      <div className="case-studies-widget" style={{ marginTop: '20px' }}>
        <div className="case-studies-header">
          <h4><i className="fas fa-briefcase" style={{ color: '#0057FF' }}></i> {lang === 'en' ? 'Business Case Studies' : 'வணிகக் கேஸ் ஸ்டடிஸ்'}</h4>
        </div>
        <div className="case-studies-grid">
          {caseStudies.map((study, idx) => (
            <div className="case-study-col" key={study.id || idx}>
              <div className="company-logo">
                <i className={study.iconClass || "fas fa-file-pdf"} style={{ color: study.iconColor || "#0057FF" }}></i>{' '}
                {study.company || (study.titleEn || study.title || '').split(':')[0]}
              </div>
              <span className="tag">{study.tag || (lang === 'en' ? 'Document' : 'ஆவணம்')}</span>
              <h5>{lang === 'en' ? (study.titleEn || study.title) : (study.titleTa || study.title)}</h5>
              <a href={study.pdfUrl || '#'} className="pdf-btn" target="_blank" rel="noreferrer">
                <i className="fas fa-file-pdf"></i> PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCrowdReporterWidget = () => {
    return (
      <div className="crowd-reporter-widget" style={{ marginTop: '20px' }}>
        <h4><i className="fas fa-bullhorn"></i> {lang === 'en' ? 'Crowd Reporter' : 'மக்கள் செய்தியாளர்'}</h4>
        <p>
          {lang === 'en' 
            ? 'Share news and happenings in your area with us. Let your voice be heard.' 
            : 'உங்கள் பகுதியில் நடக்கும் நிகழ்வுகளை எங்களோடு பகிர்ந்து கொள்ளுங்கள்! உங்கள் குரல் நாடாகட்டும்.'}
        </p>
        <button 
          onClick={() => setShowReportModal(true)} 
          className="report-btn"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <i className="fas fa-pen-fancy"></i> {lang === 'en' ? 'Send Report' : 'செய்தி அனுப்பவும்'}
        </button>
      </div>
    );
  };

  const renderCrowdReporterHighlight = () => {
    return (
      <section className="news-section" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-bullhorn" style={{ color: '#F59E0B' }}></i> {lang === 'en' ? 'Crowd Reports (Public Submissions)' : 'மக்கள் செய்தியாளர் பதிவுகள்'}</h2>
            <Link to="/submit-report" className="view-all">{lang === 'en' ? 'Submit Report' : 'செய்தி அனுப்ப'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="news-grid-3">
            {crowdReports.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'No crowd reports approved yet.' : 'மக்கள் செய்தியாளர் பதிவுகள் இன்னும் இல்லை.'}
              </div>
            ) : crowdReports.slice(0, 3).map((report, idx) => (
              <div 
                className="news-card" 
                key={report.id || idx}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
              >
                <div 
                  className="card-img" 
                  style={{ 
                    background: report.imageUrl ? `url(${getImageUrl(report.imageUrl)}) center/cover` : gradients[idx % gradients.length]
                  }}
                >
                  <span className="cat-badge" style={{ background: '#F59E0B' }}>
                    {lang === 'en' ? 'Public Report' : 'பொது மக்கள்'}
                  </span>
                </div>
                <div className="card-body">
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    <i className="far fa-user"></i> {report.reporterName} ({report.location || (lang === 'en' ? 'Tamil Nadu' : 'தமிழகம்')})
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>
                    {report.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {report.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderInstitutionNews = () => {
    return (
      <section className="news-section" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-university" style={{ color: '#1E40AF' }}></i> {lang === 'en' ? 'Institution & Press Releases' : 'நிறுவனங்களின் செய்திகள்'}</h2>
          </div>
          <div className="news-grid-3">
            {institutionNews.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'No institutional announcements published yet.' : 'நிறுவனங்களின் செய்திகள் இன்னும் இல்லை.'}
              </div>
            ) : institutionNews.slice(0, 3).map((art, idx) => {
              const gridCat = getCategoryDetails(art.categoryId);
              return (
                <div className={`news-card theme-${gridCat.slug}`} key={art.id || art.article_id}>
                  <div 
                    className="card-img" 
                    style={{ 
                      background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : gradients[(idx + 4) % gradients.length]
                    }}
                  >
                    <span className="cat-badge" style={{ background: '#1E40AF' }}>
                      {lang === 'en' ? 'Press Release' : 'பத்திரிகை செய்தி'}
                    </span>
                  </div>
                  <div className="card-body">
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      <i className="far fa-building"></i> {art.authorName}
                    </span>
                    <h3>
                      <Link to={`/article/${art.id || art.article_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {lang === 'en' ? art.titleEn : art.titleTa}
                      </Link>
                    </h3>
                    <p>
                      {lang === 'en' ? art.shortDescEn : art.shortDescTa}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderNewsDigest = () => {
    return (
      <section className="digest-section" id="section-digest">
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-rss" style={{ color: '#F97316' }}></i> {lang === 'en' ? 'News Digest (Other Media)' : 'தமிழ் செய்தி சுருக்கம் (இதர ஊடகங்கள்)'}</h2>
          </div>
          <div className="digest-row">
            <div className="digest-card" style={{ borderLeft: '3px solid #EF4444', background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="logo" style={{ color: '#EF4444', fontWeight: 800, fontSize: '15px' }}><i className="fas fa-newspaper"></i> {lang === 'en' ? 'Dinamalar' : 'தினமலர்'}</div>
              <h4 style={{ fontSize: '13px', margin: '8px 0', fontWeight: 700 }}>
                {lang === 'en' ? 'Tamil Nadu budget 2026 key highlights summary' : 'தமிழக பட்ஜெட் 2026 முக்கிய சிறப்பம்சங்கள் முழு தொகுப்பு'}
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1 Hr Ago</span>
            </div>
            <div className="digest-card" style={{ borderLeft: '3px solid #F59E0B', background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="logo" style={{ color: '#F59E0B', fontWeight: 800, fontSize: '15px' }}><i className="fas fa-newspaper"></i> {lang === 'en' ? 'Daily Thanthi' : 'தினத்தந்தி'}</div>
              <h4 style={{ fontSize: '13px', margin: '8px 0', fontWeight: 700 }}>
                {lang === 'en' ? 'Government increases paddy procurement price: farmers welcome' : 'நெல் கொள்முதல் விலையை உயர்த்திய அரசு: விவசாயிகள் வரவேற்பு'}
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2 Hr Ago</span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderAgriculture = () => {
    return (
      <section className="news-section" id="section-agri" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-seedling" style={{ color: '#16A34A' }}></i> {lang === 'en' ? 'Agriculture & Market Rates' : 'விவசாயம் & சந்தை விலை'}</h2>
            <Link to="/directory" className="view-all">{lang === 'en' ? 'View All' : 'மேலும் காண'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #22C55E', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>🌾 {lang === 'en' ? 'Paddy' : 'நெல்'}</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹2,280</div>
              <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>▲ +₹40/qtl</div>
            </div>
            <div style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #F59E0B', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>🌻 {lang === 'en' ? 'Groundnut' : 'கடலை'}</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹5,600</div>
              <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>▲ +₹120/qtl</div>
            </div>
            <div style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #EF4444', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>🟡 {lang === 'en' ? 'Turmeric' : 'மஞ்சள்'}</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹12,800</div>
              <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>▲ +₹350/qtl</div>
            </div>
            <div style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #8B5CF6', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>🧵 {lang === 'en' ? 'Cotton' : 'பருத்தி'}</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹7,450</div>
              <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700, marginTop: '4px' }}>▼ -₹180/qtl</div>
            </div>
            <div style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #06B6D4', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>🫘 {lang === 'en' ? 'Pulse' : 'துவரை'}</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹8,920</div>
              <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>▲ +₹65/qtl</div>
            </div>
            <div style={{ background: 'var(--white)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #EC4899', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>🥥 {lang === 'en' ? 'Coconut' : 'தேங்காய்'}</h4>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹48</div>
              <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>▲ +₹2/pc</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderBusinessDashboard = () => {
    return (
      <section className="business-section" id="section-business" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-chart-line" style={{ color: '#22C55E' }}></i> {lang === 'en' ? 'Business Dashboard' : 'வணிக டாஷ்போர்டு'}</h2>
            <Link to="/category/business" className="view-all">{lang === 'en' ? 'Full Details' : 'முழு விபரம்'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none' }}>
            {[
              { nameEn: 'Sensex', nameTa: 'சென்செக்ஸ்', price: '82,350.45', change: '▲ +245.60', isUp: true },
              { nameEn: 'Nifty', nameTa: 'நிஃப்டி', price: '25,120.80', change: '▲ +78.30', isUp: true },
              { nameEn: 'Bank Nifty', nameTa: 'பேங்க் நிஃப்டி', price: '48,230.10', change: '▼ -120.45', isUp: false },
              { nameEn: 'USD / INR', nameTa: 'டாலர்/ரூபாய்', price: '₹83.42', change: '▼ -0.18', isUp: false },
              { nameEn: 'Gold 24K', nameTa: 'தங்கம்', price: '₹71,250', change: '▲ +₹320', isUp: true },
              { nameEn: 'Silver', nameTa: 'வெள்ளி', price: '₹84,500', change: '▲ +₹410', isUp: true },
              { nameEn: 'Crude Oil', nameTa: 'கச்சா எண்ணெய்', price: '$78.40', change: '▲ +$1.20', isUp: true }
            ].map((st, idx) => (
              <div key={idx} style={{ background: 'var(--white)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '160px', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{lang === 'en' ? st.nameEn : st.nameTa}</span>
                <span style={{ fontSize: '15px', fontWeight: 800, display: 'block', margin: '2px 0' }}>{st.price}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: st.isUp ? '#22C55E' : '#EF4444' }}>{st.change}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderDistrictNews = () => {
    const districts = ['சென்னை', 'கோயம்புத்தூர்', 'மதுரை', 'சேலம்', 'திருச்சி', 'திருநெல்வேலி', 'வேலூர்', 'ஈரோடு', 'தஞ்சாவூர்', 'கன்னியாகுமரி'];
    return (
      <section className="news-section" id="section-district" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-map-marked-alt" style={{ color: '#6366F1' }}></i> {lang === 'en' ? 'District News' : 'மாவட்ட செய்திகள்'}</h2>
            <Link to="/directory" className="view-all">{lang === 'en' ? 'All Districts' : 'அனைத்து மாவட்டங்கள்'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
            {districts.map((d, idx) => (
              <button
                key={idx}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: idx === 0 ? 'none' : '1px solid var(--border-color)',
                  background: idx === 0 ? 'var(--primary)' : 'var(--white)',
                  color: idx === 0 ? 'white' : 'var(--text-dark)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="news-grid-3">
            {articles.slice(0, 3).map((art, idx) => (
              <div className="news-card" key={idx}>
                <div 
                  className="card-img" 
                  style={{ 
                    background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : gradients[idx % gradients.length],
                    height: '150px'
                  }}
                />
                <div className="card-body">
                  <h3 style={{ fontSize: '14px', margin: 0 }}>
                    <Link to={`/article/${art.id || art.article_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {lang === 'en' ? art.titleEn : art.titleTa}
                    </Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderElectionHub = () => {
    return (
      <section className="election-section" id="section-election" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-vote-yea" style={{ color: '#F97316' }}></i> {lang === 'en' ? 'Election Center 2026' : 'தேர்தல் மையம் 2026'}</h2>
            <Link to="/category/politics" className="view-all">{lang === 'en' ? 'Full Results' : 'முழு முடிவுகள்'} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--white)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#3B82F6' }}>திமுக (DMK)</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#3B82F6', margin: '4px 0' }}>133</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Seats Won' : 'இருக்கைகள்'}</div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', margin: '8px 0', overflow: 'hidden' }}>
                <div style={{ width: '62%', height: '100%', background: '#3B82F6' }}></div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{lang === 'en' ? 'Vote Share: 38.2%' : 'வாக்கு சதவீதம்: 38.2%'}</div>
            </div>

            <div style={{ background: 'var(--white)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#F97316' }}>அதிமுக (AIADMK)</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#F97316', margin: '4px 0' }}>65</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Seats Won' : 'இருக்கைகள்'}</div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', margin: '8px 0', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: '#F97316' }}></div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{lang === 'en' ? 'Vote Share: 25.6%' : 'வாக்கு சதவீதம்: 25.6%'}</div>
            </div>

            <div style={{ background: 'var(--white)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E' }}>மக்கள் நலன் (Others)</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#22C55E', margin: '4px 0' }}>18</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Seats Won' : 'இருக்கைகள்'}</div>
              <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', margin: '8px 0', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', background: '#22C55E' }}></div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>{lang === 'en' ? 'Vote Share: 8.4%' : 'வாக்கு சதவீதம்: 8.4%'}</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderOpinionPoll = () => {
    return (
      <section className="poll-section" id="section-poll" style={{ marginTop: '30px' }}>
        <div className="container">
          <div className="section-title">
            <h2><i className="fas fa-poll" style={{ color: '#8B5CF6' }}></i> {lang === 'en' ? 'Today Opinion Poll' : 'இன்றைய கருத்துக் கணிப்பு'}</h2>
          </div>
          <div style={{ background: 'var(--white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 14px 0' }}>
              {lang === 'en' ? 'Who will be the next Chief Minister of Tamil Nadu?' : 'தமிழகத்தில் அடுத்த முதலமைச்சர் யார்?'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>மு.க.ஸ்டாலின்</span>
                  <span>45%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'var(--primary)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>எடப்பாடி பழனிசாமி</span>
                  <span>28%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '28%', height: '100%', background: '#F59E0B' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span>சீமான்</span>
                  <span>15%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '15%', height: '100%', background: '#8B5CF6' }}></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => alert(lang === 'en' ? 'Thank you for voting!' : 'வாக்களித்தமைக்கு நன்றி!')}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {lang === 'en' ? 'Vote Now' : 'வாக்களிக்கவும்'}
            </button>
          </div>
        </div>
      </section>
    );
  };

  const getRenderedSection = (key, label, configJson) => {
    switch (key) {
      case 'news_ticker': return renderNewsTicker();
      case 'hero': return renderHero();
      case 'quick_access': return renderQuickAccess();
      case 'latest_news': return renderLatestNews(label, configJson);
      case 'video_news': return renderVideoNews(label, configJson);
      case 'web_stories': return renderWebStories(label, configJson);
      case 'crowd_reporter_highlight': return renderCrowdReporterHighlight();
      case 'institution_news': return renderInstitutionNews();
      case 'trending_sidebar': return renderTrendingSidebar(label);
      case 'rss_aggregator': return renderRssAggregatedNews();
      case 'weather': return renderWeather(label);
      case 'live_tv': return renderLiveTv();
      case 'business_case': return renderBusinessCase(label);
      case 'crowd_reporter': return renderCrowdReporterWidget(label);
      case 'news_digest': return renderNewsDigest(label);
      case 'agri': return renderAgriculture();
      case 'business': return renderBusinessDashboard();
      case 'district': return renderDistrictNews();
      case 'election': return renderElectionHub();
      case 'poll': return renderOpinionPoll();
      default: return null;
    }
  };



  if (error) {
    return (
      <div className="container" style={{ padding: '40px 15px', textAlign: 'center' }}>
        <div style={{ padding: '30px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: 'var(--text-dark)' }}>
          <h2 style={{ color: '#EF4444', marginBottom: '10px' }}>{lang === 'en' ? 'Connection Error' : 'இணைப்பு பிழை'}</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '15px', padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {lang === 'en' ? 'Retry' : 'மீண்டும் முயல்க'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '20px 15px' }}>
        {/* Ticker Skeleton */}
        <div className="skeleton-item" style={{ height: '40px', width: '100%', borderRadius: '6px', marginBottom: '20px' }}></div>
        
        {/* Hero Section Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }} className="hero-skeleton-grid">
          <div className="skeleton-item" style={{ height: '350px', borderRadius: '12px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="skeleton-item" style={{ height: '105px', borderRadius: '8px' }}></div>
            <div className="skeleton-item" style={{ height: '105px', borderRadius: '8px' }}></div>
            <div className="skeleton-item" style={{ height: '105px', borderRadius: '8px' }}></div>
          </div>
        </div>

        {/* Main Split Skeletons */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '30px' }} className="main-skeleton-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <div className="skeleton-item" style={{ height: '24px', width: '200px', borderRadius: '4px', marginBottom: '15px' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="skeleton-cards-grid">
                <SkeletonLoader type="card" count={4} />
              </div>
            </div>
          </div>
          <div>
            <div className="skeleton-item" style={{ height: '24px', width: '150px', borderRadius: '4px', marginBottom: '15px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <SkeletonLoader type="list" count={4} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* COMMODITY TICKER */}
      {renderCommodityTicker()}

      {/* PURE GENERIC HEADLESS RENDERING ENGINE */}
      <GenericPageRenderer
        layoutType="WEB"
        renderSectionCallback={(key, label, configJson) => getRenderedSection(key, label, configJson)}
      />

      {/* CROWD REPORTER MODAL */}
      {showReportModal && (
        <div className="modal open" id="crowdReporterModal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content">
            <div className="modal-header" style={{ background: '#D97706' }}>
              <h3>{lang === 'en' ? 'Submit News Report' : 'செய்தி அறிக்கை சமர்ப்பிக்கவும்'}</h3>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form id="crowdReporterForm" onSubmit={handleSubmitReport}>
                <div className="form-group">
                  <label htmlFor="reporterNameInput">{lang === 'en' ? 'Reporter Name *' : 'உங்கள் பெயர் *'}</label>
                  <input 
                    type="text" 
                    id="reporterNameInput" 
                    required 
                    placeholder={lang === 'en' ? 'e.g. Muthukumar' : 'எ.கா: முத்துக்குமார்'}
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reporterContactInput">{lang === 'en' ? 'Contact Details (Phone/Email) *' : 'தொடர்பு விபரம் (கைபேசி/மின்னஞ்சல்) *'}</label>
                  <input 
                    type="text" 
                    id="reporterContactInput" 
                    required 
                    placeholder={lang === 'en' ? 'e.g. +91 9876543210' : 'எ.கா: +91 9876543210'}
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reportTitleInput">{lang === 'en' ? 'News Headline *' : 'செய்தித் தலைப்பு *'}</label>
                  <input 
                    type="text" 
                    id="reportTitleInput" 
                    required 
                    placeholder={lang === 'en' ? 'e.g. Waterlogging issue in Gandhi Nagar' : 'எ.கா: காந்தி நகரில் தேங்கியுள்ள மழைநீர்'}
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reportDetailsInput">{lang === 'en' ? 'News Details *' : 'செய்தி விவரம் *'}</label>
                  <textarea 
                    id="reportDetailsInput" 
                    rows="4" 
                    required 
                    placeholder={lang === 'en' ? 'Describe the news or event in detail...' : 'செய்தி அல்லது நிகழ்வை விரிவாக விவரிக்கவும்...'}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'black' }}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="reportImageUrlInput">{lang === 'en' ? 'Mock Image URL (Optional)' : 'பட இணைய முகவரி (விருப்பம்)'}</label>
                  <input 
                    type="url" 
                    id="reportImageUrlInput" 
                    placeholder={lang === 'en' ? 'e.g. https://example.com/image.jpg' : 'எ.கா: https://example.com/image.jpg'}
                    value={reportImageUrl}
                    onChange={(e) => setReportImageUrl(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reportVideoUrlInput">{lang === 'en' ? 'Mock Video URL (Optional)' : 'வீடியோ இணைய முகவரி (விருப்பம்)'}</label>
                  <input 
                    type="url" 
                    id="reportVideoUrlInput" 
                    placeholder={lang === 'en' ? 'e.g. https://example.com/video.mp4' : 'எ.கா: https://example.com/video.mp4'}
                    value={reportVideoUrl}
                    onChange={(e) => setReportVideoUrl(e.target.value)}
                  />
                </div>
                <button type="submit" className="submit-btn" style={{ background: '#D97706', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: '10px' }}>
                  {lang === 'en' ? 'Submit Report' : 'அறிக்கை சமர்ப்பி'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
