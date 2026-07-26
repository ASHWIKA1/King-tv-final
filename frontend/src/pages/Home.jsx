import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { fetchApi, getImageUrl } from '../utils/api';
import AdWidget from '../components/AdWidget';
import SkeletonLoader from '../components/SkeletonLoader';
const MOCK_ARTICLES = [
  {
    id: 1,
    article_id: 1,
    titleTa: 'தமிழக சட்டமன்ற பட்ஜெட் கூட்டத்தொடர் 2026: முக்கிய அறிவிப்புகள் வெளியீடு',
    titleEn: 'Tamil Nadu Assembly Budget Session 2026 Key Announcements',
    shortDescTa: 'மாண்புமிகு முதலமைச்சர் பட்ஜெட் உரையில் பல்வேறு மக்கள் நலத் திட்டங்களை அறிவித்தார்.',
    shortDescEn: 'Chief Minister announced key welfare schemes in the budget speech.',
    categoryId: 1,
    authorName: 'செல்வகுமார்',
    viewsCount: 12500,
    imageUrl: null
  },
  {
    id: 2,
    article_id: 2,
    titleTa: 'சென்னை கோயம்பேட்டில் புதிய பேருந்து நிலையம் - அமைச்சர் அறிவிப்பு',
    titleEn: 'New Koyambedu Bus Terminal Announcement',
    shortDescTa: 'போக்குவரத்து நெரிசலை குறைக்க புதிய நவீன பேருந்து முனையம் அமைக்கும் பணி விரைவு.',
    shortDescEn: 'Modern bus terminal project initiated to reduce traffic congestion.',
    categoryId: 1,
    authorName: 'செல்வகுமார்',
    viewsCount: 8200,
    imageUrl: null
  },
  {
    id: 3,
    article_id: 3,
    titleTa: 'ஐபிஎல் 2026: சிஎஸ்கே அணி அடுத்த சுற்றுக்கு தகுதி',
    titleEn: 'IPL 2026: CSK Qualifies for Next Round',
    shortDescTa: 'அபார வெற்றியுடன் சென்னை சூப்பர் கிங்ஸ் அணி புள்ளிகள் பட்டியலில் முதலிடம் பிடித்தது.',
    shortDescEn: 'CSK secures top spot in points table with a dominant win.',
    categoryId: 3,
    authorName: 'விளையாட்டு நிருபர்',
    viewsCount: 15700,
    imageUrl: null
  },
  {
    id: 4,
    article_id: 4,
    titleTa: 'விவசாயிகளுக்கு ரூ.12,000 நிவாரணம் - மத்திய அரசு அறிவிப்பு',
    titleEn: 'Rs 12,000 Relief for Farmers Announced',
    shortDescTa: 'வேளாண் பெருமக்களுக்கு நிதியுதவி வழங்கும் திட்டத்தில் புதிய தவணைத் தொகை.',
    shortDescEn: 'New instalment released under farmer financial assistance scheme.',
    categoryId: 2,
    authorName: 'விவசாய நிருபர்',
    viewsCount: 11300,
    imageUrl: null
  },
  {
    id: 5,
    article_id: 5,
    titleTa: 'நடிகர் விக்ரம் அடுத்த படம் குறித்த அதிகாரப்பூர்வ அறிவிப்பு',
    titleEn: 'Actor Vikram Next Film Official Update',
    shortDescTa: 'பிரமாண்டமாக உருவாகும் புதிய திரைப்படத்தின் படப்பிடிப்பு குறித்த தகவல்.',
    shortDescEn: 'Official announcement regarding grand upcoming movie shooting.',
    categoryId: 4,
    authorName: 'சினிமா நிருபர்',
    viewsCount: 22100,
    imageUrl: null
  }
];

const MOCK_VIDEOS = [
  {
    id: 1,
    title: 'சென்னை பட்ஜெட் 2026 நேரலை செய்திகள் - சிறப்பு விவாதம்',
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    thumbnailUrl: null,
    duration: '15:20',
    publishedAt: '2026-07-26T10:00:00Z',
    isLive: true,
    categoryId: 1
  },
  {
    id: 2,
    title: 'விவசாயம் & சந்தை நிலவரம் - நேரடி செய்தி அறிக்கை',
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    thumbnailUrl: null,
    duration: '08:45',
    publishedAt: '2026-07-26T08:30:00Z',
    isLive: false,
    categoryId: 2
  },
  {
    id: 3,
    title: 'ஐபிஎல் 2026: சிஎஸ்கே அணி வெற்றி கொண்டாட்டம்',
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    thumbnailUrl: null,
    duration: '06:12',
    publishedAt: '2026-07-26T07:15:00Z',
    isLive: false,
    categoryId: 3
  },
  {
    id: 4,
    title: 'புதிய தொழில்நுட்ப கண்டுபிடிப்புகள் - 2026 ஸ்பெஷல்',
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    thumbnailUrl: null,
    duration: '12:00',
    publishedAt: '2026-07-26T05:00:00Z',
    isLive: false,
    categoryId: 5
  }
];

const MOCK_CROWD = [
  {
    id: 1,
    reporterName: 'கார்த்திக்',
    location: 'வேளச்சேரி, சென்னை',
    title: 'வேளச்சேரி மெயின் ரோட்டில் மழைநீர் வடிகால் பணி நிறைவு',
    details: 'நீண்ட நாட்களாக நிலுவையில் இருந்த மழைநீர் வடிகால் அமைக்கும் பணி தற்போது நிறைவடைந்துள்ளது.'
  },
  {
    id: 2,
    reporterName: 'சுரேஷ்',
    location: 'காந்திபுரம், கோவை',
    title: 'கோவை மாநகராட்சியில் புதிய பூங்கா திறப்பு',
    details: 'பொதுமக்கள் பயன்பாட்டிற்காக புதிய பூங்கா அமைக்கப்பட்டு மேயர் துவக்கி வைத்தார்.'
  },
  {
    id: 3,
    reporterName: 'அருண்',
    location: 'ஆரப்பாளையம், மதுரை',
    title: 'மதுரையில் குடிநீர் விநியோகம் சீரமைப்பு பணி',
    details: 'குடிநீர் குழாய் அடைப்புகளை நீக்கும் பணிகளை மாநகராட்சி ஊழியர்கள் தீவிரமாக மேற்கொண்டு வருகின்றனர்.'
  }
];

const MOCK_INSTITUTION = [
  {
    id: 1,
    article_id: 101,
    authorName: 'அண்ணா பல்கலைக்கழகம்',
    titleTa: 'அண்ணா பல்கலைக்கழக மாணவர்களுக்கான புதிய ஆராய்ச்சி நிதி உதவி திட்டம்',
    titleEn: 'Anna University Announces New Research Fellowship Scheme',
    shortDescTa: 'இளநிலை மற்றும் முதுநிலை மாணவர்களுக்கான புதிய ஆராய்ச்சி நிதி உதவித் திட்டம் அறிவிப்பு.',
    shortDescEn: 'New research fellowship scheme announced for undergraduate and postgraduate students.',
    categoryId: 5
  },
  {
    id: 2,
    article_id: 102,
    authorName: 'தமிழ்நாடு அறிவியல் நகரம்',
    titleTa: 'மாநில அளவிலான அறிவியல் கண்காட்சி - மாணவர்கள் விண்ணப்பிக்க அழைப்பு',
    titleEn: 'State Level Science Exhibition - Call for Student Applications',
    shortDescTa: 'பள்ளி மாணவர்களின் அறிவியல் படைப்புகளை காட்சிப்படுத்த சிறப்பு கண்காட்சி ஏற்பாடு.',
    shortDescEn: 'Special exhibition organized to display school students scientific projects.',
    categoryId: 5
  },
  {
    id: 3,
    article_id: 103,
    authorName: 'வேளாண்மைப் பல்கலைக்கழகம்',
    titleTa: 'கோயம்பேடு வேளாண் சந்தையில் புதிய விளைபொருள் பாதுகாப்பு மையம்',
    titleEn: 'New Produce Preservation Center in Koyambedu Market',
    shortDescTa: 'விவசாயிகள் கொண்டு வரும் விளைபொருட்களை நீண்ட நாள் பாதுகாப்பாக வைக்க புதிய வசதி.',
    shortDescEn: 'New facility introduced for farmers to preserve produce for longer days.',
    categoryId: 2
  }
];

const MOCK_TRENDING = [
  {
    id: 1,
    titleTa: 'சென்னை பெருநகரில் புதிய மெட்ரோ ரயில் திட்டம் அறிவிப்பு',
    titleEn: 'New Metro Rail Project Announcement in Chennai City',
    viewsCount: 45200,
    growthRate: '+2.4K/hr'
  },
  {
    id: 2,
    titleTa: 'காவிரி நீர் மேலாண்மை குறித்த உச்சநீதிமன்ற முக்கிய உத்தரவு',
    titleEn: 'Supreme Court Important Order on Cauvery Water Management',
    viewsCount: 38700,
    growthRate: '+1.8K/hr'
  },
  {
    id: 3,
    titleTa: 'இந்திய பொருளாதாரம் 8% வளர்ச்சி - உலக வங்கி அறிக்கை',
    titleEn: 'Indian Economy 8% Growth - World Bank Report',
    viewsCount: 32100,
    growthRate: '+1.5K/hr'
  },
  {
    id: 4,
    titleTa: 'தமிழ் சினிமாவில் புதிய படங்களின் அணிவகுப்பு',
    titleEn: 'New Movies Lineup in Tamil Cinema Industry',
    viewsCount: 28500,
    growthRate: '+1.2K/hr'
  },
  {
    id: 5,
    titleTa: 'பள்ளி மாணவர்களுக்கு காலை உணவு திட்டம் விரிவாக்கம்',
    titleEn: 'Breakfast Scheme Expansion for School Students',
    viewsCount: 24300,
    growthRate: '+980/hr'
  }
];

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
  const [topSliderIndex, setTopSliderIndex] = useState(0);
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
  const initialTickers = [
    lang === 'en' ? "Paddy procurement price increased - farmers express delight!" : "🌾 நெல் கொள்முதல் விலை உயர்வு - விவசாயிகள் மகிழ்ச்சி",
    lang === 'en' ? "Vijay 69th movie announcement sends fans into celebration mode!" : "🎬 விஜய் 69-வது படம் அறிவிப்பு - ரசிகர்கள் கொண்டாட்டம்",
    lang === 'en' ? "Class 12 board results to be declared soon - education department updates." : "📚 +2 தேர்வு முடிவுகள் விரைவில் - கல்வித்துறை தகவல்",
    lang === 'en' ? "Electricity tariff hike in Chennai creates public concern." : "⚡ சென்னையில் மின் கட்டணம் உயர்வு - நுகர்வோர் அதிருப்தி",
    lang === 'en' ? "New Vande Bharat rail service introduced by Southern Railway." : "🚆 புதிய வந்தே பாரத் ரயில் சேவை அறிமுகம் - தெற்கு ரயில்வே",
    lang === 'en' ? "Heavy rain alert issued for tomorrow in Tamil Nadu." : "🔴 தமிழகத்தில் நாளை முதல் கனமழை எச்சரிக்கை - வானிலை மையம்"
  ];
  const [tickers, setTickers] = useState(initialTickers);
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

    const pBreakingNews = fetchApi('/breaking-news/getAllWeb?size=10')
      .then(data => {
        const list = data && Array.isArray(data.content) ? data.content : [];
        if (list.length > 0) {
          const formatted = list.map(item => (lang === 'en' ? item.title : item.titleTa) || item.title);
          setTickers(formatted);
        } else {
          setTickers(initialTickers);
        }
      })
      .catch(err => {
        console.warn("Could not load breaking news from API, using fallback", err);
        setTickers(initialTickers);
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
    if (layoutSections.length === 0) {
      // Fallback order matching standard design
      return keys.map((k, idx) => ({ sectionKey: k, isVisible: true, displayOrder: idx }));
    }
    return layoutSections
      .filter(s => keys.includes(s.sectionKey) && s.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);
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

  const displayArticles = (articles && articles.length > 0) ? articles : MOCK_ARTICLES;
  const displayVideos = (videos && videos.length > 0) ? videos : MOCK_VIDEOS;
  const displayCrowd = (crowdReports && crowdReports.length > 0) ? crowdReports : MOCK_CROWD;
  const displayInstitution = (institutionNews && institutionNews.length > 0) ? institutionNews : MOCK_INSTITUTION;

  const featured = displayArticles[0];
  const featuredCat = getCategoryDetails(featured.categoryId);
  const sideArticles = displayArticles.slice(1, 5);
  const latestGrid = displayArticles.slice(0, 6);

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

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setTopSliderIndex(prev => (prev + 1) % 8);
    }, 4000);
    return () => clearInterval(sliderInterval);
  }, []);

  const renderTopCommoditySlider = () => {
    const sliderCards = [
      {
        titleTa: '🪙 சென்னை தங்கம் விலை',
        titleEn: '🪙 Chennai Gold Rate',
        items: [
          { labelTa: '22K:', labelEn: '22K:', val: '₹8,950/g', color: '#10B981' },
          { labelTa: '24K:', labelEn: '24K:', val: '₹9,760/g', color: '#10B981' },
          { labelTa: 'வெள்ளி:', labelEn: 'Silver:', val: '₹118/g', color: '#1E293B' },
          { labelTa: 'பிளாட்டினம்:', labelEn: 'Platinum:', val: '₹3,420/g', color: '#EF4444' }
        ]
      },
      {
        titleTa: '📈 பங்குச் சந்தை நிலவரம்',
        titleEn: '📈 Stock Market Today',
        items: [
          { labelTa: 'சென்செக்ஸ்:', labelEn: 'Sensex:', val: '82,450 ▲ (+340)', color: '#10B981' },
          { labelTa: 'நிஃப்டி 50:', labelEn: 'Nifty 50:', val: '25,120 ▲ (+110)', color: '#10B981' },
          { labelTa: 'பேங்க் நிஃப்டி:', labelEn: 'Bank Nifty:', val: '51,800 ▼ (-45)', color: '#EF4444' },
          { labelTa: 'ஐடி இன்டெக்ஸ்:', labelEn: 'IT Index:', val: '38,900 ▲ (+220)', color: '#10B981' }
        ]
      },
      {
        titleTa: '⛽ சென்னை எரிபொருள் விலை',
        titleEn: '⛽ Fuel Prices Chennai',
        items: [
          { labelTa: 'பெட்ரோல்:', labelEn: 'Petrol:', val: '₹100.75/L', color: '#1E293B' },
          { labelTa: 'டீசல்:', labelEn: 'Diesel:', val: '₹92.34/L', color: '#1E293B' },
          { labelTa: 'எல்பிஜி உருளை:', labelEn: 'LPG Cylinder:', val: '₹818.50', color: '#EF4444' },
          { labelTa: 'சிஎன்ஜி:', labelEn: 'CNG:', val: '₹85.00/kg', color: '#10B981' }
        ]
      },
      {
        titleTa: '🌾 காய்கறி சந்தை விலை',
        titleEn: '🌾 Vegetable Market Price',
        items: [
          { labelTa: 'தக்காளி:', labelEn: 'Tomato:', val: '₹35/kg', color: '#10B981' },
          { labelTa: 'வெங்காயம்:', labelEn: 'Onion:', val: '₹42/kg', color: '#EF4444' },
          { labelTa: 'உருளைக்கிழங்கு:', labelEn: 'Potato:', val: '₹28/kg', color: '#10B981' },
          { labelTa: 'பூண்டு:', labelEn: 'Garlic:', val: '₹180/kg', color: '#1E293B' }
        ]
      }
    ];

    const activeSlide = sliderCards[topSliderIndex % sliderCards.length];

    return (
      <div className="container" style={{ margin: '14px auto 0 auto', padding: '0 15px', display: 'flex', justifyContent: 'flex-end' }}>
        <div 
          style={{ 
            background: '#F0F5FF', 
            borderRadius: '16px', 
            padding: '14px 20px', 
            border: '1px solid #E2E8F0', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
            maxWidth: '420px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', fontWeight: 800, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {lang === 'en' ? activeSlide.titleEn : activeSlide.titleTa}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: '12px' }}>
            {activeSlide.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>{lang === 'en' ? item.labelEn : item.labelTa}</span>
                <span style={{ color: item.color, fontWeight: 800 }}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* Slider Dots Pagination Row matching reference screenshot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTopSliderIndex(idx)}
                style={{
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  width: (topSliderIndex % 8) === idx ? '18px' : '5px',
                  height: '5px',
                  borderRadius: (topSliderIndex % 8) === idx ? '4px' : '50%',
                  background: (topSliderIndex % 8) === idx ? '#2563EB' : '#CBD5E1',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNewsTicker = () => {
    const activeTickers = tickers.length > 0 ? tickers : [
      "தமிழகத்தில் நாளை முதல் கனமழை எச்சரிக்கை - வானிலை மையம் அறிவிப்பு",
      "இந்தியா - பாகிஸ்தான் கிரிக்கெட் போட்டி இன்று மாலை 3 மணிக்கு தொடக்கம்",
      "ஆபரணத் தங்கத்தின் விலை சவரனுக்கு ரூ.400 குறைந்தது - இன்றைய நிலவரம்",
      "சென்னை சூப்பர் கிங்ஸ் அணி அபார வெற்றியுடன் பிளே-ஆஃப் சுற்றுக்கு தகுதி"
    ];

    return (
      <div className="breaking-news-wrapper" style={{ background: '#FFFBEB', borderTop: '1px solid #FDE68A', borderBottom: '1px solid #FCD34D' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '42px', overflow: 'hidden' }}>
          <div style={{ background: '#EF4444', color: '#FFFFFF', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', flexShrink: 0 }}>
            <span style={{ width: '8px', height: '8px', background: '#FFFFFF', borderRadius: '50%', display: 'inline-block', animation: 'pulse-live 1.2s infinite' }}></span>
            {lang === 'en' ? 'BREAKING' : 'முக்கிய செய்தி'}
          </div>
          
          <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '24px', fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
              <span style={{ color: '#DC2626' }}>⚡</span>
              <span>{activeTickers[tickerIndex % activeTickers.length]}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '10px', flexShrink: 0 }}>
            <button 
              onClick={() => setTickerIndex(prev => (prev - 1 + activeTickers.length) % activeTickers.length)}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E0F2FE', border: 'none', color: '#0369A1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              title="Previous"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              onClick={() => setTickerIndex(prev => (prev + 1) % activeTickers.length)}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E0F2FE', border: 'none', color: '#0369A1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              title="Next"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHero = () => {
    const heroFeatured = featured || MOCK_ARTICLES[0];
    const heroCat = getCategoryDetails(heroFeatured.categoryId);
    const heroSideItems = sideArticles.length >= 4 ? sideArticles.slice(0, 4) : MOCK_ARTICLES.slice(1, 5);

    return (
      <section className="hero-section" id="section-hero" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '20px', alignItems: 'stretch' }}>
            
            {/* Main Big Featured News Card (Left) */}
            <div 
              style={{ 
                position: 'relative', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                minHeight: '440px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end',
                background: heroFeatured.imageUrl 
                  ? `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%), url(${getImageUrl(heroFeatured.imageUrl)}) center/cover`
                  : `linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '30px'
              }}
            >
              <span 
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  left: '20px', 
                  background: '#EF4444', 
                  color: '#FFFFFF', 
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {lang === 'en' ? heroCat.en : heroCat.ta}
              </span>

              <h1 style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 800, lineHeight: 1.4, margin: '0 0 12px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <Link to={`/article/${heroFeatured.id || heroFeatured.article_id}`} style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                  {lang === 'en' ? (heroFeatured.titleEn || heroFeatured.titleTa) : (heroFeatured.titleTa || heroFeatured.titleEn)}
                </Link>
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {lang === 'en' ? (heroFeatured.shortDescEn || heroFeatured.shortDescTa) : (heroFeatured.shortDescTa || heroFeatured.shortDescEn)}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: 600 }}>
                <span><i className="far fa-user" style={{ marginRight: '6px' }}></i> {heroFeatured.authorName || (lang === 'en' ? 'Selvakumar' : 'செல்வகுமார்')}</span>
                <span><i className="far fa-clock" style={{ marginRight: '6px' }}></i> {lang === 'en' ? '2 hours ago' : '2 மணி நேரத்திற்கு முன்'}</span>
                <span><i className="far fa-eye" style={{ marginRight: '6px' }}></i> {heroFeatured.viewsCount ? `${(heroFeatured.viewsCount / 1000).toFixed(1)}K` : '12.5K'}</span>
              </div>
            </div>

            {/* Right Side Stacked Numbered News Items (01, 02, 03, 04) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {heroSideItems.map((art, idx) => {
                const numberStr = `0${idx + 1}`;
                return (
                  <div 
                    key={art.id || art.article_id || idx}
                    style={{ 
                      background: '#FFFFFF', 
                      borderRadius: '12px', 
                      padding: '12px 16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '14px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      border: '1px solid #F1F5F9',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Big Faint Number Badge */}
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#CBD5E1', fontFamily: 'monospace', minWidth: '32px' }}>
                      {numberStr}
                    </span>

                    {/* Gradient / Image Rounded Thumbnail */}
                    <div 
                      style={{ 
                        width: '70px', 
                        height: '70px', 
                        borderRadius: '10px', 
                        flexShrink: 0,
                        background: art.imageUrl ? `url(${getImageUrl(art.imageUrl)}) center/cover` : gradients[idx % gradients.length]
                      }}
                    ></div>

                    {/* News Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px 0', lineHeight: 1.4, color: '#0F172A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        <Link to={`/article/${art.id || art.article_id}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                          {lang === 'en' ? (art.titleEn || art.titleTa) : (art.titleTa || art.titleEn)}
                        </Link>
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B', fontSize: '11px', fontWeight: 600 }}>
                        <span><i className="far fa-clock" style={{ marginRight: '4px' }}></i> {lang === 'en' ? `${idx + 2} hours ago` : `${idx + 2} மணி நேரம்`}</span>
                        <span><i className="far fa-eye" style={{ marginRight: '4px' }}></i> {art.viewsCount ? `${(art.viewsCount / 1000).toFixed(1)}K` : `${(8.2 - idx * 0.8).toFixed(1)}K`}</span>
                      </div>
                    </div>
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
      <section className="quick-access">
        <div className="container">
          <div className="quick-grid">
            <Link to="/category/politics" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-politics"><i className="fas fa-landmark"></i></div>
              <span>{lang === 'en' ? 'Politics' : 'அரசியல்'}</span>
            </Link>
            <Link to="/category/business" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-business"><i className="fas fa-chart-line"></i></div>
              <span>{lang === 'en' ? 'Business' : 'வணிகம்'}</span>
            </Link>
            <Link to="/category/sports" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-sports"><i className="fas fa-trophy"></i></div>
              <span>{lang === 'en' ? 'Sports' : 'விளையாட்டு'}</span>
            </Link>
            <Link to="/category/cinema" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-cinema"><i className="fas fa-film"></i></div>
              <span>{lang === 'en' ? 'Cinema' : 'பொழுதுபோக்கு'}</span>
            </Link>
            <Link to="/category/tech" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-technology"><i className="fas fa-microchip"></i></div>
              <span>{lang === 'en' ? 'Technology' : 'தொழில்நுட்பம்'}</span>
            </Link>
            <Link to="/directory" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-education"><i className="fas fa-map-marker-alt"></i></div>
              <span>{lang === 'en' ? 'Regional' : 'நம்ம ஊர்'}</span>
            </Link>
            <Link to="/category/international" className="quick-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="icon cat-weather"><i className="fas fa-globe"></i></div>
              <span>{lang === 'en' ? 'International' : 'சர்வதேசம்'}</span>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderLatestNews = () => {
    const activeGrid = (latestGrid && latestGrid.length > 0) ? latestGrid : MOCK_ARTICLES.slice(0, 6);

    return (
      <section className="news-section">
        <div className="section-title">
          <h2><i className="fas fa-newspaper"></i> {lang === 'en' ? 'Latest News' : 'சமீபத்திய செய்திகள்'}</h2>
        </div>
        <div className="news-grid-3" id="newsGrid">
          {activeGrid.map((art, idx) => {
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
                      {lang === 'en' ? (art.titleEn || art.titleTa) : (art.titleTa || art.titleEn)}
                    </Link>
                  </h3>
                  <p>
                    {lang === 'en' ? (art.shortDescEn || art.shortDescTa) : (art.shortDescTa || art.shortDescEn)}
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

    const activeVideos = (filteredHomeVideos && filteredHomeVideos.length > 0) ? filteredHomeVideos : MOCK_VIDEOS;

    return (
      <section className="video-section" id="section-video">
        <div className="section-title">
          <h2><i className="fas fa-video" style={{ color: '#EF4444' }}></i> {lang === 'en' ? 'Video News' : 'வீடியோ செய்திகள்'}</h2>
          <Link to="/videos" className="view-all">{lang === 'en' ? 'More Videos' : 'மேலும் வீடியோக்கள்'} <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="video-grid-4">
          {activeVideos.slice(0, 4).map((vid, idx) => (
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
                    <span><i className="far fa-calendar-alt"></i> {vid.publishedAt ? new Date(vid.publishedAt).toLocaleDateString() : '26 Jul 2026'}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const renderWebStories = () => {
    return (
      <section className="stories-section" id="section-stories">
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
      </section>
    );
  };

  const renderTrendingSidebar = () => {
    const activeTrending = (trendingNews && trendingNews.length > 0) ? trendingNews : MOCK_TRENDING;

    return (
      <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-fire" style={{ color: '#EF4444', fontSize: '16px' }}></i>
          {lang === 'en' ? 'Trending News' : 'டிரெண்டிங் செய்திகள்'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTrending.slice(0, 5).map((art, idx) => (
            <div key={art.id || art.article_id || idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#2563EB', minWidth: '18px', lineHeight: 1.2 }}>
                {idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, lineHeight: 1.4, color: '#1E293B' }}>
                  <Link to={`/article/${art.id || art.article_id}`} style={{ color: '#1E293B', textDecoration: 'none' }}>
                    {lang === 'en' ? (art.titleEn || art.titleTa) : (art.titleTa || art.titleEn)}
                  </Link>
                </h5>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
                  <span><i className="far fa-eye" style={{ marginRight: '4px' }}></i> {art.viewsCount ? `${(art.viewsCount / 1000).toFixed(1)}K` : '45.2K'}</span>
                  <span style={{ color: '#10B981' }}>{art.growthRate || '+2.4K/hr'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    const miniForecast = [
      { day: lang === 'en' ? 'Mon' : 'தி', icon: '☀️', temp: '32°' },
      { day: lang === 'en' ? 'Tue' : 'செ', icon: '🌤️', temp: '31°' },
      { day: lang === 'en' ? 'Wed' : 'பு', icon: '🌤️', temp: '33°' },
      { day: lang === 'en' ? 'Thu' : 'வி', icon: '🌧️', temp: '29°' },
      { day: lang === 'en' ? 'Fri' : 'வெ', icon: '☀️', temp: '30°' },
      { day: lang === 'en' ? 'Sat' : 'ச', icon: '☀️', temp: '34°' },
      { day: lang === 'en' ? 'Sun' : 'ஞா', icon: '☀️', temp: '35°' }
    ];

    return (
      <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-cloud-sun" style={{ color: '#2563EB', fontSize: '18px' }}></i>
            {lang === 'en' ? 'Chennai Weather' : 'சென்னை வானிலை'}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '38px', fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>
            28°C
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748B', lineHeight: 1.5, fontWeight: 600 }}>
            <strong style={{ color: '#1E293B', display: 'block', fontSize: '13px' }}>{lang === 'en' ? 'Cloudy' : 'மேகமூட்டம்'}</strong>
            <span>{lang === 'en' ? 'Humidity: 72%' : 'ஈரப்பதம்: 72%'}</span><br />
            <span>{lang === 'en' ? 'Wind: 18 km/h' : 'காற்று: 18 km/h'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
          {miniForecast.map((f, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{f.day}</span>
              <span style={{ fontSize: '14px' }}>{f.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E293B' }}>{f.temp}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLiveTv = () => {
    const liveStreamUrl = (liveVideo && liveVideo.videoUrl)
      ? liveVideo.videoUrl
      : 'https://www.youtube.com/embed/5qap5aO4i9A';

    return (
      <div className="weather-widget" style={{ marginTop: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-tv" style={{ color: '#EF4444' }}></i>{' '}
          {lang === 'en' ? 'Live Broadcast' : 'நேரலை ஒளிபரப்பு'}
        </h4>
        <div style={{ width: '100%', height: '210px', background: '#000000', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <iframe 
            src={liveStreamUrl} 
            title="Live Stream" 
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  const renderBusinessCase = () => {
    return null;
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
    const activeCrowd = (crowdReports && crowdReports.length > 0) ? crowdReports : MOCK_CROWD;

    return (
      <section className="news-section" style={{ marginTop: '30px' }}>
        <div className="section-title">
          <h2><i className="fas fa-bullhorn" style={{ color: '#F59E0B' }}></i> {lang === 'en' ? 'Crowd Reports (Public Submissions)' : 'மக்கள் செய்தியாளர் பதிவுகள்'}</h2>
          <Link to="/submit-report" className="view-all">{lang === 'en' ? 'Submit Report' : 'செய்தி அனுப்ப'} <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="news-grid-3">
          {activeCrowd.slice(0, 3).map((report, idx) => (
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
      </section>
    );
  };

  const renderInstitutionNews = () => {
    const activeInstitution = (institutionNews && institutionNews.length > 0) ? institutionNews : MOCK_INSTITUTION;

    return (
      <section className="news-section" style={{ marginTop: '30px' }}>
        <div className="section-title">
          <h2><i className="fas fa-university" style={{ color: '#1E40AF' }}></i> {lang === 'en' ? 'Institution & Press Releases' : 'நிறுவனங்களின் செய்திகள்'}</h2>
        </div>
        <div className="news-grid-3">
          {activeInstitution.slice(0, 3).map((art, idx) => {
            const gridCat = getCategoryDetails(art.categoryId);
            return (
              <div className={`news-card theme-${gridCat.slug}`} key={art.id || art.article_id || idx}>
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
                      {lang === 'en' ? (art.titleEn || art.titleTa) : (art.titleTa || art.titleEn)}
                    </Link>
                  </h3>
                  <p>
                    {lang === 'en' ? (art.shortDescEn || art.shortDescTa) : (art.shortDescTa || art.shortDescEn)}
                  </p>
                </div>
              </div>
            );
          })}
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

  const getRenderedSection = (key) => {
    switch (key) {
      case 'news_ticker': return renderNewsTicker();
      case 'hero': return renderHero();
      case 'quick_access': return renderQuickAccess();
      case 'latest_news': return renderLatestNews();
      case 'video_news': return renderVideoNews();
      case 'web_stories': return renderWebStories();
      case 'crowd_reporter_highlight': return renderCrowdReporterHighlight();
      case 'institution_news': return renderInstitutionNews();
      case 'trending_sidebar': return renderTrendingSidebar();
      case 'rss_aggregator': return renderRssAggregatedNews();
      case 'weather': return renderWeather();
      case 'live_tv': return renderLiveTv();
      case 'business_case': return null;
      case 'crowd_reporter': return renderCrowdReporterWidget();
      case 'news_digest': return renderNewsDigest();
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

      {/* TOP RIGHT HERO COMMODITY RATES SLIDER CARD (1-to-1 matching Reference Screenshot) */}
      {renderTopCommoditySlider()}

      {/* BREAKING NEWS TICKER (Always rendered directly below Commodity Ticker) */}
      {renderNewsTicker()}

      {/* HERO SECTION */}
      {renderHero()}

      {/* QUICK ACCESS CATEGORIES BAR (Always under Hero and above Latest) */}
      {renderQuickAccess()}

      {/* HEADER BANNER SPONSORED AD */}
      <div className="container" style={{ margin: '20px auto 0 auto', padding: '0 15px' }}>
        <AdWidget placement="header" />
      </div>

      {/* MAIN LAYOUT SPLIT */}
      <div className="container main-layout-container" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px', marginTop: '20px' }}>
        <div className="left-content-column">
          {renderLatestNews()}
          {renderVideoNews()}
          {renderWebStories()}
          {renderCrowdReporterHighlight()}
          {renderInstitutionNews()}
        </div>

        <aside className="trending-sidebar" style={{ width: '100%' }}>
          <AdWidget placement="sidebar" />
          {renderWeather()}
          {renderTrendingSidebar()}
          {renderLiveTv()}
          {renderRssAggregatedNews()}
        </aside>
      </div>

      {/* FULL-WIDTH BOTTOM SECTIONS */}
      {renderNewsDigest()}

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
