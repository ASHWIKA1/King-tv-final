import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import UserAvatar from './UserAvatar';
import UserDropdown from './UserDropdown';
import HeaderWidgetSlider from './HeaderWidgetSlider';

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
  'உலக செய்திகள்': 'World News',
  'state': 'State',
  'national': 'National',
  'international': 'International',
  'governance': 'Governance',
  'markets': 'Markets',
  'companies': 'Companies',
  'investment': 'Investment',
  'startups': 'Startups',
  'cricket': 'Cricket',
  'football': 'Football',
  'tennis': 'Tennis',
  'local sports': 'Local Sports',
  'kollywood': 'Kollywood',
  'bollywood': 'Bollywood',
  'reviews': 'Reviews',
  'music': 'Music',
  'smartphones': 'Smartphones',
  'software': 'Software',
  'space': 'Space',
  'world news': 'World News'
};

const Header = () => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { session, logout, user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const unauthDropdownRef = useRef(null);

  const getSubcatEn = (s) => {
    if (!s) return '';
    const nameStr = s.name || '';
    const nameTaStr = s.nameTa || '';
    return subcatEnTranslations[nameStr] || subcatEnTranslations[nameTaStr] || subcatEnTranslations[nameStr.toLowerCase()] || nameStr;
  };

  const handleLogout = async () => {
    setShowUserDropdown(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showUserDropdown && unauthDropdownRef.current && !unauthDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showUserDropdown]);



  const regionalPaths = ['/directory', '/wishes', '/obituaries', '/jobs', '/classifieds', '/deals', '/rfq', '/my-rfqs'];
  const isRegionalPage = regionalPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));

  const [timeStr, setTimeStr] = useState('');
  const [district, setDistrict] = useState('சென்னை');
  const [weatherTemp, setWeatherTemp] = useState('32°C');

  useEffect(() => {
    fetchApi('/weather?city=Chennai')
      .then(data => {
        if (data && data.temp) {
          setWeatherTemp(data.temp);
        }
      })
      .catch(err => console.warn("Failed to fetch default temp", err));
  }, []);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navCategories, setNavCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showHeaderSubcatDropdown, setShowHeaderSubcatDropdown] = useState(false);
  const [districtsList, setDistrictsList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const toggleDropdown = (e, itemId) => {
    const parent = e.currentTarget.closest('.nav-item-wrapper');
    const navElement = document.querySelector('.main-nav');
    if (parent && navElement) {
      const navRect = navElement.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      const dropdownWidth = 220;
      const maxLeft = window.innerWidth - dropdownWidth - 16;
      const leftOffset = Math.max(16, Math.min(maxLeft, parentRect.left - navRect.left));
      setDropdownLeft(leftOffset);
    }
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };
  const [dropdownTimer, setDropdownTimer] = useState(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.header-subcat-dropdown')) {
        setShowHeaderSubcatDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.nav-item-wrapper')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const fallbackSubcats = {
    politics: {
      ta: ['அனைத்தும்', 'மாநிலம்', 'தேசியம்', 'சர்வதேசம்', 'அரசு கொள்கைகள்'],
      en: ['All', 'State', 'National', 'International', 'Governance']
    },
    business: {
      ta: ['அனைத்தும்', 'சந்தை', 'நிறுவனங்கள்', 'முதலீடு', 'ஸ்டார்ட்அப்'],
      en: ['All', 'Markets', 'Companies', 'Investment', 'Startups']
    },
    sports: {
      ta: ['அனைத்தும்', 'கிரிக்கெட்', 'கால்பந்து', 'டென்னிஸ்', 'உள்ளூர்'],
      en: ['All', 'Cricket', 'Football', 'Tennis', 'Local Sports']
    },
    cinema: {
      ta: ['அனைத்தும்', 'கோலிவுட்', 'பாலிவுட்', 'விமர்சனங்கள்', 'இசை'],
      en: ['All', 'Kollywood', 'Bollywood', 'Reviews', 'Music']
    },
    tech: {
      ta: ['அனைத்தும்', 'ஸ்மார்ட்போன்', 'மென்பொருள்', 'AI', 'விண்வெளி'],
      en: ['All', 'Smartphones', 'Software', 'AI', 'Space']
    },
    international: {
      ta: ['அனைத்தும்', 'தேசியம்', 'சர்வதேசம்', 'உலக செய்திகள்'],
      en: ['All', 'National', 'International', 'World News']
    },
    world: {
      ta: ['அனைத்தும்', 'தேசியம்', 'சர்வதேசம்', 'உலக செய்திகள்'],
      en: ['All', 'National', 'International', 'World News']
    }
  };

  const matches = location.pathname.match(/\/category\/([^/]+)/);
  const activeCategorySlug = matches ? matches[1] : null;
  const isCategoryPage = !!activeCategorySlug;

  const activeCat = navCategories.find(c => c && c.slug === activeCategorySlug);
  const resolvedSubcategories = activeCat
    ? (lang === 'en'
      ? ['All', ...(activeCat.subcategories || []).map(s => getSubcatEn(s))]
      : ['அனைத்தும்', ...(activeCat.subcategories || []).map(s => s ? s.nameTa : '')])
    : (fallbackSubcats[activeCategorySlug]
      ? (lang === 'en' ? fallbackSubcats[activeCategorySlug].en : fallbackSubcats[activeCategorySlug].ta)
      : []);

  const searchParams = new URLSearchParams(location.search);
  const selectedSubcat = searchParams.get('subcat') || (lang === 'en' ? 'All' : 'அனைத்தும்');

  const handleSubcatSelect = (subName) => {
    if (subName === 'All' || subName === 'அனைத்தும்') {
      navigate(`/category/${activeCategorySlug}`);
    } else {
      navigate(`/category/${activeCategorySlug}?subcat=${subName}`);
    }
    setShowHeaderSubcatDropdown(false);
  };

  const getDynamicNavItems = () => {
    if (menuItems && menuItems.length > 0) {
      return menuItems.filter(Boolean).map(item => ({
        id: item.id,
        path: item.linkUrl,
        label: lang === 'en' ? item.titleEn : item.titleTa,
        subcategories: (item.subcategories || []).filter(Boolean).map(sub => ({
          id: sub.id,
          path: sub.linkUrl,
          name: sub.titleEn,
          nameTa: sub.titleTa,
          subcategories: (sub.subcategories || []).filter(Boolean).map(subsub => ({
            id: subsub.id,
            path: subsub.linkUrl,
            name: subsub.titleEn,
            nameTa: subsub.titleTa
          }))
        }))
      }));
    }

    let dynamicItems = [];
    if (navCategories && navCategories.length > 0) {
      const dbItems = navCategories.map(cat => {
        const catSlug = cat.slug || '';
        let path = `/category/${catSlug}`;
        if (catSlug === 'web-stories') path = '/web-stories';
        else if (catSlug === 'video') path = '/videos';
        else if (catSlug === 'regional') path = '/directory';

        const enTranslations = {
          'politics': 'Politics',
          'business': 'Business',
          'sports': 'Sports',
          'cinema': 'Cinema',
          'tech': 'Technology',
          'technology': 'Technology',
          'regional': 'Regional',
          'international': 'International',
          'world': 'International',
          'video': 'Videos',
          'videos': 'Videos',
          'web-stories': 'Web Stories'
        };

        const labelVal = lang === 'en'
          ? (enTranslations[catSlug.toLowerCase()] || cat.name)
          : cat.nameTa;

        return {
          id: cat.id,
          slug: catSlug,
          path,
          label: labelVal,
          subcategories: cat.subcategories || []
        };
      });

      const findDbItem = (slug) => dbItems.find(item => item.slug === slug);

      // Home
      dynamicItems.push({
        id: 'home',
        path: '/',
        label: lang === 'en' ? 'Home' : 'முகப்பு',
        subcategories: []
      });

      // Add all other active categories dynamically from DB in order
      dbItems.forEach(item => {
        if (!['regional', 'video', 'videos', 'web-stories'].includes(item.slug)) {
          dynamicItems.push(item);
        }
      });

      // Regional Directory (with dropdown chevron containing all items)
      const regional = findDbItem('regional');
      const regionalSubcategories = [
        {
          id: 'reg-dir',
          slug: 'directory',
          path: '/directory',
          name: 'Local Business Directory',
          nameTa: 'நம்ம ஊர்',
          subcategories: [
            { id: 'reg-deals', slug: 'deals', path: '/deals', name: 'Deals', nameTa: 'சலுகைகள்' },
            { id: 'reg-rfq', slug: 'rfq', path: '/rfq', name: 'RFQ', nameTa: 'கோரிக்கைகள்' }
          ]
        },
        { id: 'reg-wishes', slug: 'wishes', path: '/wishes', name: 'Wishes', nameTa: 'வாழ்த்து' },
        { id: 'reg-obituaries', slug: 'obituaries', path: '/obituaries', name: 'Obituaries', nameTa: 'இரங்கல்' },
        { id: 'reg-jobs', slug: 'jobs', path: '/jobs', name: 'Jobs', nameTa: 'வேலை' },
        { id: 'reg-classifieds', slug: 'classifieds', path: '/classifieds', name: 'Classifieds', nameTa: 'தள்ளுபடி' }
      ];
      dynamicItems.push(regional ? { ...regional, label: lang === 'en' ? 'Regional' : 'நம்ம ஊர்', subcategories: regionalSubcategories } : {
        id: 'regional',
        path: '/directory',
        label: lang === 'en' ? 'Regional' : 'நம்ம ஊர்',
        subcategories: regionalSubcategories
      });

      // Videos (with dropdown chevron)
      const videos = findDbItem('video') || findDbItem('videos');
      dynamicItems.push(videos || {
        id: 'videos',
        path: '/videos',
        label: lang === 'en' ? 'Videos' : 'வீடியோ',
        subcategories: [
          { id: 'v-state', slug: 'v-state', name: 'State', nameTa: 'மாநிலம்' },
          { id: 'v-national', slug: 'v-national', name: 'National', nameTa: 'தேசியம்' },
          { id: 'v-cinema', slug: 'v-cinema', name: 'Cinema', nameTa: 'சினிமா' }
        ]
      });

      // Web Stories (No dropdown chevron)
      const webStories = findDbItem('web-stories');
      dynamicItems.push(webStories || {
        id: 'web-stories',
        path: '/web-stories',
        label: lang === 'en' ? 'Web Stories' : 'வெப் ஸ்டோரிஸ்',
        subcategories: []
      });
    }

    return dynamicItems.length > 0 ? dynamicItems : [
      { path: '/', label: lang === 'en' ? 'Home' : 'முகப்பு', subcategories: [] },
      { path: '/category/politics', label: lang === 'en' ? 'Politics' : 'அரசியல்', subcategories: [{ id: 'fp-1', slug: 'state', name: 'State', nameTa: 'மாநிலம்' }] },
      { path: '/category/business', label: lang === 'en' ? 'Business' : 'வணிகம்', subcategories: [{ id: 'fb-1', slug: 'markets', name: 'Markets', nameTa: 'சந்தை' }] },
      { path: '/category/sports', label: lang === 'en' ? 'Sports' : 'விளையாட்டு', subcategories: [{ id: 'fs-1', slug: 'cricket', name: 'Cricket', nameTa: 'கிரிக்கெட்' }] },
      { path: '/category/cinema', label: lang === 'en' ? 'Cinema' : 'பொழுதுபோக்கு', subcategories: [{ id: 'fc-1', slug: 'kollywood', name: 'Kollywood', nameTa: 'கோலிவுட்' }] },
      { path: '/category/tech', label: lang === 'en' ? 'Technology' : 'தொழில்நுட்பம்', subcategories: [{ id: 'ft-1', slug: 'smartphones', name: 'Smartphones', nameTa: 'ஸ்மார்ட் போன்' }] },

      {
        id: 'regional',
        path: '/directory',
        label: lang === 'en' ? 'Regional' : 'நம்ம ஊர்',
        subcategories: [
          {
            id: 'reg-dir',
            slug: 'directory',
            path: '/directory',
            name: 'Local Business Directory',
            nameTa: 'நம்ம ஊர்',
            subcategories: [
              { id: 'reg-deals', slug: 'deals', path: '/deals', name: 'Deals', nameTa: 'சலுகைகள்' },
              { id: 'reg-rfq', slug: 'rfq', path: '/rfq', name: 'RFQ', nameTa: 'கோரிக்கைகள்' }
            ]
          },
          { id: 'reg-wishes', slug: 'wishes', path: '/wishes', name: 'Wishes', nameTa: 'வாழ்த்து' },
          { id: 'reg-obituaries', slug: 'obituaries', path: '/obituaries', name: 'Obituaries', nameTa: 'இரங்கல்' },
          { id: 'reg-jobs', slug: 'jobs', path: '/jobs', name: 'Jobs', nameTa: 'வேலை' },
          { id: 'reg-classifieds', slug: 'classifieds', path: '/classifieds', name: 'Classifieds', nameTa: 'தள்ளுபடி' }
        ]
      },
      { path: '/category/international', label: lang === 'en' ? 'International' : 'சர்வதேசம்', subcategories: [{ id: 'fi-1', slug: 'world-news', name: 'World News', nameTa: 'உலக செய்திகள்' }] },
      {
        path: '/videos', label: lang === 'en' ? 'Video' : 'வீடியோ', subcategories: [
          { id: 'v-state', slug: 'v-state', name: 'State', nameTa: 'மாநிலம்' },
          { id: 'v-national', slug: 'v-national', name: 'National', nameTa: 'தேசியம்' },
          { id: 'v-cinema', slug: 'v-cinema', name: 'Cinema', nameTa: 'சினிமா' }
        ]
      },
      { path: '/web-stories', label: lang === 'en' ? 'Web Stories' : 'வெப் ஸ்டோரிஸ்', subcategories: [] }
    ];
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [allArticles, setAllArticles] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [allBusinesses, setAllBusinesses] = useState([]);

  const fallbackBusinesses = [
    { id: 1, businessName: "AB's Restaurant", category: "Restaurant", addressLocality: "Anna Nagar, Chennai" },
    { id: 2, businessName: "Sundaram Hospital", category: "Health & Medical", addressLocality: "T. Nagar, Chennai" },
    { id: 3, businessName: "Headlines Salon", category: "Beauty & Salon", addressLocality: "Velachery, Chennai" },
    { id: 4, businessName: "Gadget World", category: "Electronics", addressLocality: "Porur, Chennai" }
  ];

  const fallbackArticles = [
    {
      id: "demo-1",
      titleTa: "தமிழக சட்டப்பேரவையில் புதிய மசோதா தாக்கல் - எதிர்க்கட்சிகள் எதிர்ப்பு",
      titleEn: "New bill tabled in TN assembly - opposition registers strong protest",
      shortDescTa: "சட்டப்பேரவையில் இன்று தாக்கல் செய்யப்பட்ட புதிய மசோதாவுக்கு எதிர்க்கட்சிகள் கடும் எதிர்ப்பு தெரிவித்துள்ளனர். இந்த மசோதா மக்கள் நலனுக்கு பாதகமானது என கூறியுள்ளனர்.",
      shortDescEn: "Opposition parties voiced strong protests against the new bill tabled in the assembly today, calling it detrimental to public welfare."
    },
    {
      id: "demo-2",
      titleTa: "இந்திய கிரிக்கெட் அணி ஆஸ்திரேலியாவை வீழ்த்தியது - 3-0 அபாரம்",
      titleEn: "Indian cricket team beats Australia 3-0 in T20 series",
      shortDescTa: "ஆஸ்திரேலியாவுக்கு எதிரான டி20 தொடரை 3-0 என்ற கணக்கில் இந்திய அணி முழுமையாக வென்றது. விராட் கோலி அபார ஆட்டம்.",
      shortDescEn: "India clean sweeps T20 series against Australia 3-0. Virat Kohli shines with a brilliant match-winning performance."
    },
    {
      id: "demo-3",
      titleTa: "பங்குச் சந்தை புதிய உச்சம் - முதலீட்டாளர்களுக்கு வார இறுதி பரிசு",
      titleEn: "Share market reaches new peak - weekend gift for investors",
      shortDescTa: "சென்செக்ஸ் 82,000 புள்ளிகளை தாண்டி புதிய சாதனை படைத்தது. ஐடி, பேங்கிங் பங்குகள் முன்னணி.",
      shortDescEn: "Sensex creates new record by crossing 82,000 points. IT and Banking sectors lead the gainers list."
    },
    {
      id: "demo-4",
      titleTa: "செயற்கை நுண்ணறிவில் தமிழக இளைஞர்கள் சாதனை - சர்வதேச அங்கீகாரம்",
      titleEn: "Tamil Nadu youth excel in AI research - receive international awards",
      shortDescTa: "செயற்கை நுண்ணறிவில் தமிழக இளைஞர்கள் செய்த புதிய கண்டுபிடிப்புகளுக்கு சர்வதேச அறிவியல் சபை விருது வழங்கி கௌரவித்துள்ளது.",
      shortDescEn: "International science council honors youth from Tamil Nadu for their ground-breaking developments in AI."
    },
    {
      id: "demo-5",
      titleTa: "தளபதி விஜய்யின் அடுத்த படம் குறித்த முக்கிய அறிவிப்பு வெளியானது",
      titleEn: "Major update released on Thalapathy Vijay's upcoming movie",
      shortDescTa: "இயக்குனர் வெங்கட் பிரபு இயக்கத்தில் விஜய் நடிக்கும் 69-வது படம் குறித்த அதிகாரப்பூர்வ தகவல் வெளியாகியுள்ளது.",
      shortDescEn: "Official details and title launch info released for Vijay's 69th film directed by Venkat Prabhu."
    },
    {
      id: "demo-6",
      titleTa: "நெல் கொள்முதல் விலை உயர்வு - விவசாயிகள் சங்கம் வரவேற்பு",
      titleEn: "Paddy procurement price increased - farmers association welcomes move",
      shortDescTa: "நெல்லுக்கான குறைந்தபட்ச ஆதரவு விலையை மத்திய அரசு உயர்த்தியுள்ள நிலையில் விவசாயிகள் மகிழ்ச்சி தெரிவித்துள்ளனர்.",
      shortDescEn: "Farmers express joy as central government increases the minimum support price (MSP) for paddy procurement."
    }
  ];

  const fallbackVideos = [
    { id: "demo-1", title: "தமிழக பட்ஜெட் 2026 - முக்கிய அம்சங்கள் விளக்கம்" },
    { id: "demo-2", title: "கிரிக்கெட் போட்டி சிறப்பம்சங்கள் - இந்தியா vs ஆஸ்திரேலியா" },
    { id: "demo-3", title: "விவசாயிகளுக்கான புதிய திட்டங்கள் - நேரடி அறிக்கை" },
    { id: "demo-4", title: "பங்குச் சந்தை ஆய்வு - நிபுணர்களின் முக்கிய ஆலோசனை" }
  ];

  useEffect(() => {
    fetchApi('/articles')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllArticles([...data, ...fallbackArticles]);
        } else {
          setAllArticles(fallbackArticles);
        }
      })
      .catch(err => {
        console.warn("Header normal search failed to load articles", err);
        setAllArticles(fallbackArticles);
      });

    fetchApi('/categories/nav')
      .then(data => {
        if (Array.isArray(data)) {
          setNavCategories(data);
        }
      })
      .catch(err => console.warn("Header failed to load categories", err));

    fetchApi('/public/menus')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        }
      })
      .catch(err => console.warn("Header failed to load public menus", err));

    fetchApi('/videos')
      .then(data => {
        const translatedFallbackVideos = fallbackVideos.map(vid => {
          let titleVal = vid.title;
          if (lang === 'en') {
            if (vid.title.includes('பட்ஜெட்')) titleVal = 'Tamil Nadu Budget 2026 - Key Highlights Explained';
            else if (vid.title.includes('கிரிக்கெட்')) titleVal = 'Cricket Match Highlights - India vs Australia';
            else if (vid.title.includes('விவசாயிகளுக்கான')) titleVal = 'New Schemes for Farmers - Ground Report';
            else if (vid.title.includes('பங்கு')) titleVal = 'Stock Market Analysis - Expert Advice';
          }
          return { ...vid, title: titleVal };
        });
        if (Array.isArray(data) && data.length > 0) {
          setAllVideos([...data, ...translatedFallbackVideos]);
        } else {
          setAllVideos(translatedFallbackVideos);
        }
      })
      .catch(err => {
        console.warn("Header normal search failed to load videos", err);
        const translatedFallbackVideos = fallbackVideos.map(vid => {
          let titleVal = vid.title;
          if (lang === 'en') {
            if (vid.title.includes('பட்ஜெட்')) titleVal = 'Tamil Nadu Budget 2026 - Key Highlights Explained';
            else if (vid.title.includes('கிரிக்கெட்')) titleVal = 'Cricket Match Highlights - India vs Australia';
            else if (vid.title.includes('விவசாயிகளுக்கான')) titleVal = 'New Schemes for Farmers - Ground Report';
            else if (vid.title.includes('பங்கு')) titleVal = 'Stock Market Analysis - Expert Advice';
          }
          return { ...vid, title: titleVal };
        });
        setAllVideos(translatedFallbackVideos);
      });

    fetchApi('/directory')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllBusinesses(data);
        } else {
          setAllBusinesses(fallbackBusinesses);
        }
      })
      .catch(err => {
        console.warn("Header normal search failed to load directory", err);
        setAllBusinesses(fallbackBusinesses);
      });
  }, [lang]);

  const getFilteredResults = () => {
    if (!searchQuery.trim()) return { articles: [], videos: [], businesses: [] };
    const query = searchQuery.toLowerCase().trim();

    const filteredArts = allArticles.filter(art =>
      (art.titleEn || '').toLowerCase().includes(query) ||
      (art.titleTa || '').toLowerCase().includes(query) ||
      (art.shortDescEn || '').toLowerCase().includes(query) ||
      (art.shortDescTa || '').toLowerCase().includes(query)
    );

    const filteredVids = allVideos.filter(vid =>
      (vid.title || '').toLowerCase().includes(query)
    );

    const filteredBiz = allBusinesses.filter(b =>
      (b.businessName || '').toLowerCase().includes(query) ||
      (b.category || '').toLowerCase().includes(query) ||
      (b.addressLocality || '').toLowerCase().includes(query)
    );

    return {
      articles: filteredArts.slice(0, 5),
      videos: filteredVids.slice(0, 3),
      businesses: filteredBiz.slice(0, 4)
    };
  };

  const { articles: searchArticles, videos: searchVideos, businesses: searchBusinesses } = getFilteredResults();

  useEffect(() => {
    const handleToggleDrawer = () => {
      setDrawerOpen(prev => !prev);
    };
    window.addEventListener('toggle-side-drawer', handleToggleDrawer);
    return () => window.removeEventListener('toggle-side-drawer', handleToggleDrawer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const daysTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
      const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthsTa = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
      const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const d = new Date();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      const secs = String(d.getSeconds()).padStart(2, '0');

      if (lang === 'en') {
        const day = daysEn[d.getDay()];
        const date = d.getDate();
        const month = monthsEn[d.getMonth()];
        const year = d.getFullYear();
        setTimeStr(`${day}, ${month} ${date}, ${year} | ${hours}:${mins}:${secs}`);
      } else {
        const day = daysTa[d.getDay()];
        const date = d.getDate();
        const month = monthsTa[d.getMonth()];
        const year = d.getFullYear();
        setTimeStr(`${day}, ${month} ${date}, ${year} | ${hours}:${mins}:${secs}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const handleDistrictChange = (selected) => {
    setDistrict(selected);
    const cityMap = {
      'சென்னை': 'Chennai',
      'கோயம்புத்தூர்': 'Coimbatore',
      'மதுரை': 'Madurai',
      'சேலம்': 'Salem',
      'திருச்சி': 'Trichy',
      'ஈரோடு': 'Erode'
    };
    const engCity = cityMap[selected];
    if (engCity) {
      const baseApi = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';
      fetch(`${baseApi}/weather?city=${engCity}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.temp) {
            setWeatherTemp(data.temp);
          }
        })
        .catch(err => console.warn("Failed to fetch changed district temp", err));
    } else {
      const temps = {
        'திருநெல்வேலி': '35°C',
        'வேலூர்': '33°C',
        'தஞ்சாவூர்': '32°C',
        'கன்னியாகுமரி': '29°C',
        'நாமக்கல்': '31°C'
      };
      setWeatherTemp(temps[selected] || '32°C');
    }
  };

  const getTamilRole = (role) => {
    const roles = {
      admin: 'நிர்வாகி',
      vendor: 'வணிகர்',
      editor: 'ஆசிரியர்',
      reporter: 'செய்தியாளர்',
      user: 'வாசகர்'
    };
    return roles[role] || 'வாசகர்';
  };

  const roleColors = {
    admin: '#EF4444',
    vendor: '#10B981',
    editor: '#8B5CF6',
    reporter: '#F59E0B',
    user: '#3B82F6'
  };

  const getCurrentDistrictName = (key) => {
    const districtNames = {
      'சென்னை': { en: 'Chennai', ta: 'சென்னை' },
      'கோயம்புத்தூர்': { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
      'மதுரை': { en: 'Madurai', ta: 'மதுரை' },
      'சேலம்': { en: 'Salem', ta: 'சேலம்' },
      'திருச்சி': { en: 'Trichy', ta: 'திருச்சி' },
      'திருநெல்வேலி': { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
      'வேலூர்': { en: 'Vellore', ta: 'வேலூர்' },
      'ஈரோடு': { en: 'Erode', ta: 'ஈரோடு' },
      'தஞ்சாவூர்': { en: 'Tanjore', ta: 'தஞ்சாவூர்' },
      'கன்னியாகுமரி': { en: 'Kanyakumari', ta: 'கன்னியாகுமரி' },
      'நாமக்கல்': { en: 'Namakkal', ta: 'நாமக்கல்' }
    };
    const item = districtNames[key];
    return item ? (lang === 'en' ? item.en : item.ta) : key;
  };

  const renderLogo = (size = 'normal', forceDark = false) => {
    const isDark = forceDark || theme === 'dark';
    const logoUrl = isDark ? "assets/images/logo-banner-dark.png" : "assets/images/logo-banner-light.png";
    return (
      <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img
          src={logoUrl}
          alt="KING 24x7"
          className="header-logo-img"
          style={{ height: size === 'small' ? '30px' : '55px', width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </Link>
    );
  };

  const renderLiveTvBtn = () => (
    <>
      <style>{`
        @keyframes live-tv-blink {
          0% {
            opacity: 0.5;
            box-shadow: 0 0 4px rgba(239, 68, 68, 0.4);
          }
          100% {
            opacity: 1;
            box-shadow: 0 0 16px #EF4444, 0 0 6px rgba(239, 68, 68, 0.6);
          }
        }
        @keyframes live-dot-white-pulse {
          0% {
            transform: scale(0.65);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
      <Link to="/live-tv" className="livetv-btn" style={{
        background: '#EF4444',
        border: '1px solid #B91C1C',
        color: '#FFFFFF',
        padding: '3px 10px 3px 8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '800',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        height: '24px',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        boxShadow: 'inset 0 0 3px rgba(255,255,255,0.2)',
        animation: 'live-tv-blink 1s infinite alternate ease-in-out'
      }}>
        <i className="fas fa-tv" style={{ fontSize: '10px', color: '#FFFFFF' }}></i>
        <span style={{
          display: 'inline-block',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: '#FFFFFF',
          animation: 'live-dot-white-pulse 0.5s infinite alternate ease-in-out'
        }}></span>
      </Link>
    </>
  );

  const renderProfileIcon = () => {
    if (isAuthenticated && user) {
      return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <UserAvatar user={user} size={30} onClick={() => setShowUserDropdown(!showUserDropdown)} />
          <UserDropdown
            isOpen={showUserDropdown}
            onClose={() => setShowUserDropdown(false)}
            onLogout={handleLogout}
          />
        </div>
      );
    }

    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '20px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', padding: '2px' }}
          aria-label="User Account"
        >
          <i className="fas fa-user-circle"></i>
        </button>
        {showUserDropdown && (
          <div
            ref={unauthDropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              width: '160px',
              backgroundColor: '#121212',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              padding: '6px 0',
              overflow: 'hidden'
            }}
          >
            <Link
              to="/login"
              onClick={() => setShowUserDropdown(false)}
              style={{
                display: 'block',
                padding: '10px 16px',
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(179, 115, 42, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setShowUserDropdown(false)}
              style={{
                display: 'block',
                padding: '10px 16px',
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(179, 115, 42, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    );
  };

  const renderDistrictSelector = (isHeader = false) => (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
        className="header-district-btn"
        style={{
          background: 'transparent',
          border: 'none',
          color: isHeader ? '#FFFFFF' : (theme === 'dark' ? '#FFFFFF' : '#1A1A1A'),
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          padding: isHeader ? '4px 6px 1px 6px' : '6px 10px',
          borderRadius: '4px',
          transition: 'background 0.2s',
          whiteSpace: 'nowrap'
        }}
      >
        <span>{getCurrentDistrictName(district)} 24x7</span>
        <i className="fas fa-pencil-alt" style={{ fontSize: '10px', color: isHeader ? '#FFFFFF' : '#666' }}></i>
      </button>
      {showDistrictDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          background: theme === 'dark' ? '#1E293B' : '#ffffff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '6px',
          padding: '4px 0',
          zIndex: 9999,
          minWidth: '160px',
          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          marginTop: '6px'
        }}>
          {[
            { key: 'சென்னை', en: 'Chennai', ta: 'சென்னை' },
            { key: 'கோயம்புத்தூர்', en: 'Coimbatore', ta: 'Coimbatore' },
            { key: 'மதுரை', en: 'Madurai', ta: 'மதுரை' },
            { key: 'சேலம்', en: 'Salem', ta: 'சேலம்' },
            { key: 'திருச்சி', en: 'Trichy', ta: 'திருச்சி' },
            { key: 'திருநெல்வேலி', en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
            { key: 'வேலூர்', en: 'Vellore', ta: 'வேலூர்' },
            { key: 'ஈரோடு', en: 'Erode', ta: 'ஈரோடு' },
            { key: 'தஞ்சாவூர்', en: 'Tanjore', ta: 'தஞ்சாவூர்' },
            { key: 'கன்னியாகுமரி', en: 'Kanyakumari', ta: 'கன்னியாகுமரி' },
            { key: 'நாமக்கல்', en: 'Namakkal', ta: 'நாமக்கல்' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => {
                handleDistrictChange(item.key);
                setShowDistrictDropdown(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: district === item.key ? (theme === 'dark' ? '#334155' : '#EFF6FF') : 'transparent',
                color: district === item.key ? '#3B82F6' : (theme === 'dark' ? '#FFFFFF' : '#1E293B'),
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'block'
              }}
            >
              {lang === 'en' ? item.en : item.ta}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderSocials = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <a href="https://www.facebook.com/profile.php?id=61551357861905" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
      <a href="https://x.com/onlinethamizhan" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
      <a href="https://www.instagram.com/king24x7/" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
      <a href="https://www.youtube.com/@king24x7" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
    </div>
  );

  const renderAuthSection = () => {
    if (session && session.isLoggedIn) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--top-bar-text)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fas fa-user-circle" style={{ color: roleColors[session.role] || '#64748B' }}></i>
            {session.username}
          </span>
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      );
    }
    return (
      <Link to="/login" style={{
        fontSize: '12px',
        fontWeight: 700,
        color: 'var(--primary)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        textDecoration: 'none'
      }}>
        <i className="fas fa-sign-in-alt"></i> {lang === 'en' ? 'Login' : 'உள்நுழை'}
      </Link>
    );
  };

  const renderScrollNavMenu = (onLinkClick = () => { }) => {
    const navItems = getDynamicNavItems();

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: '15px',
        width: '100%',
        padding: '8px 0'
      }}>
        {navItems.map((item, idx) => {
          const isActive = (item.id === 'regional' && isRegionalPage) ||
                           location.pathname === item.path ||
                           (item.path !== '/' && location.pathname.startsWith(item.path));

          const handleLinkClick = (e) => {
            onLinkClick();
            if (item.subcategories && item.subcategories.length > 0) {
              if (isActive) {
                // If already active, toggle dropdown menu
                e.preventDefault();
                toggleDropdown(e, item.id);
              } else {
                setActiveDropdown(null);
              }
            } else {
              setActiveDropdown(null);
            }
          };

          return (
            <div
              key={idx}
              className="nav-item-wrapper"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                borderBottom: isActive ? '3px solid var(--primary, #B3732A)' : '3px solid transparent'
              }}
            >
              <Link
                to={item.path}
                onClick={handleLinkClick}
                style={{
                  color: isActive
                    ? (theme === 'dark' ? '#FFFFFF' : '#000000')
                    : (theme === 'dark' ? '#94A3B8' : '#71717A'),
                  background: 'transparent',
                  padding: '8px 4px 6px 12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  display: 'inline-block'
                }}
              >
                {item.label}
              </Link>
              {item.subcategories && item.subcategories.length > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDropdown(e, item.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 12px 6px 4px',
                    cursor: 'pointer',
                    color: isActive
                      ? (theme === 'dark' ? '#FFFFFF' : '#000000')
                      : (theme === 'dark' ? '#94A3B8' : '#71717A'),
                    transition: 'all 0.2s'
                  }}
                  aria-label="Toggle subcategories"
                >
                  <i className="fas fa-chevron-down" style={{ fontSize: '8px', opacity: 0.7 }}></i>
                </button>
              )}

              {/* Subcategories Dropdown directly below this link */}
              {activeDropdown === item.id && item.subcategories && item.subcategories.length > 0 && (
                <div
                  className="category-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: window.innerWidth <= 768 ? `${dropdownLeft}px` : '50%',
                    transform: window.innerWidth <= 768 ? 'none' : 'translateX(-50%)',
                    background: theme === 'dark' ? '#1E293B' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    padding: '8px 0',
                    zIndex: 9999,
                    minWidth: '220px',
                    marginTop: '8px',
                    textAlign: 'left'
                  }}
                >
                  <style>{`
                    .dropdown-sub-container {
                      position: relative;
                    }
                    .dropdown-sub-link {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 10px 16px;
                      color: ${theme === 'dark' ? '#cbd5e1' : '#334155'};
                      text-decoration: none;
                      font-size: 13.5px;
                      font-weight: 600;
                      transition: all 0.2s ease;
                      white-space: nowrap;
                    }
                    .dropdown-sub-link:hover {
                      background: ${theme === 'dark' ? '#334155' : '#EFF6FF'};
                      color: var(--primary, #B3732A);
                    }
                    .nested-dropdown {
                      position: absolute;
                      top: 0;
                      left: 100%;
                      background: ${theme === 'dark' ? '#1E293B' : '#ffffff'};
                      border: ${theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'};
                      border-radius: 8px;
                      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                      padding: 6px 0;
                      min-width: 180px;
                      margin-left: 2px;
                      display: none;
                      z-index: 10001;
                    }
                    .dropdown-sub-container:hover .nested-dropdown {
                      display: block;
                    }
                    .dropdown-nested-link {
                      display: block;
                      padding: 8px 16px;
                      color: ${theme === 'dark' ? '#e2e8f0' : '#334155'};
                      text-decoration: none;
                      font-size: 13px;
                      font-weight: 600;
                      transition: all 0.2s ease;
                      white-space: nowrap;
                      text-align: left;
                    }
                    .dropdown-nested-link:hover {
                      background: ${theme === 'dark' ? '#334155' : '#EFF6FF'};
                      color: var(--primary, #B3732A);
                    }
                  `}</style>
                  {/* Prepend 'All' option */}
                  <div className="dropdown-sub-container">
                    <Link
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className="dropdown-sub-link"
                      style={{ fontWeight: '700', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                      <span>{lang === 'en' ? 'All' : 'அனைத்தும்'}</span>
                    </Link>
                  </div>

                  {item.subcategories.map(sub => {
                    const subcatName = lang === 'en' ? getSubcatEn(sub) : sub.nameTa;
                    const catSlug = item.path.split('/category/')[1];
                    const subcatLinkPath = sub.path || `/category/${catSlug}?subcat=${subcatName}`;
                    return (
                      <div key={sub.id} className="dropdown-sub-container">
                        <Link
                          to={subcatLinkPath}
                          onClick={() => setActiveDropdown(null)}
                          className="dropdown-sub-link"
                        >
                          <span>{subcatName}</span>
                          {sub.subcategories && sub.subcategories.length > 0 && (
                            <i className="fas fa-chevron-right" style={{ fontSize: '9px', opacity: 0.6 }}></i>
                          )}
                        </Link>

                        {/* Nested Sub-dropdown Overlay */}
                        {sub.subcategories && sub.subcategories.length > 0 && (
                          <div className="nested-dropdown">
                            {sub.subcategories.map(child => {
                              const isChildActive = location.pathname === child.path;
                              return (
                                <Link
                                  key={child.id}
                                  to={child.path || `/category/${child.slug}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className={`dropdown-nested-link ${isChildActive ? 'active' : ''}`}
                                  style={isChildActive ? {
                                    background: theme === 'dark' ? '#334155' : '#EFF6FF',
                                    color: 'var(--primary, #B3732A)'
                                  } : {}}
                                >
                                  {lang === 'en' ? getSubcatEn(child) : child.nameTa}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderNavMenuVertical = (onLinkClick = () => { }) => {
    const navItems = getDynamicNavItems();

    return (
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: 0, listStyle: 'none', margin: 0 }}>
        {navItems.map((item, idx) => {
          const isActive = (item.id === 'regional' && isRegionalPage) ||
                           location.pathname === item.path ||
                           (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <li key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  to={item.path}
                  onClick={onLinkClick}
                  style={{
                    color: isActive ? 'var(--primary, #B3732A)' : 'inherit',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'block',
                    padding: '4px 0',
                    flex: 1
                  }}
                >
                  {item.label}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <header className="header-mobile-app-style" style={{ position: 'relative', background: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '100%' }}>
      {/* Minimal top bar */}
      {isSearchOpen ? (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px', background: theme === 'dark' ? '#1E293B' : '#1e1e1e', padding: '6px 12px', borderRadius: '24px' }}>
            <i className="fas fa-search" style={{ color: '#888888', fontSize: '14px' }}></i>
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search news, videos...' : 'செய்திகள், வீடியோக்களைத் தேடுக...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#888888', padding: '2px' }}
              >
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#ffffff', padding: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}
            aria-label="Cancel Search"
          >
            {lang === 'en' ? 'Cancel' : 'ரத்து'}
          </button>
        </div>
      ) : (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                color: '#ffffff',
                cursor: 'pointer',
                paddingRight: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Open side drawer menu"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="logo-district-container" style={{ display: 'flex', gap: '8px' }}>
              {renderLogo('small', true)}
              {renderDistrictSelector(true)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ffffff', padding: '4px' }}
              aria-label="Search"
            >
              <i className="fas fa-search"></i>
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'inline-flex', alignItems: 'center' }}
              title={lang === 'en' ? 'Switch to Tamil' : 'தமிழுக்கு மாற்றவும்'}
              aria-label="Toggle Language"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                {/* Top Left Circle */}
                <circle cx="9.5" cy="9.5" r="6.5" fill="#ffffff" stroke="#ffffff" strokeWidth="1" />
                <text x="9.5" y="12.5" fontSize="9.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fill="#000000" textAnchor="middle">A</text>

                {/* Bottom Right Circle */}
                <circle cx="15.5" cy="15.5" r="6.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
                <text x="15.5" y="18.5" fontSize="8.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fill="#ffffff" textAnchor="middle">அ</text>

                {/* Bottom Arrow */}
                <path d="M 8 14.5 C 8 17.5, 10 18.5, 12 17.5" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                <path d="M 10.5 18.5 L 12.5 17.5 L 12 15.5" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinejoin="round" />

                {/* Top Arrow */}
                <path d="M 16 9.5 C 16 6.5, 14 5.5, 12 6.5" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                <path d="M 13.5 5.5 L 11.5 6.5 L 12 8.5" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ffffff', padding: '4px', display: 'inline-flex', alignItems: 'center' }}
              aria-label="Toggle Theme"
            >
              <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'} style={{ color: '#ffffff' }}></i>
            </button>
            {renderLiveTvBtn()}
            {renderProfileIcon()}
          </div>
        </div>
      )}

      {/* Normal Search Results Dropdown Overlay */}
      {isSearchOpen && searchQuery.trim() !== '' && (
        <div style={{
          position: 'absolute',
          top: '55px',
          left: 0,
          right: 0,
          background: theme === 'dark' ? '#121212' : '#ffffff',
          borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 99999,
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '12px 16px'
        }}>
          {searchArticles.length === 0 && searchVideos.length === 0 && (!searchBusinesses || searchBusinesses.length === 0) ? (
            <div style={{ padding: '16px', textAlign: 'center', color: theme === 'dark' ? '#888888' : '#666666', fontSize: '14px' }}>
              {lang === 'en' ? 'No results found.' : 'தேடல் முடிவுகள் எதுவும் இல்லை.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {searchBusinesses && searchBusinesses.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Regional Directory' : 'வட்டார கோப்பகம்'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchBusinesses.map((biz) => (
                      <Link
                        key={biz.id}
                        to="/directory"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                        className="search-result-item"
                      >
                        <i className="fas fa-store" style={{ color: 'var(--primary, #B3732A)', flexShrink: 0 }}></i>
                        <span style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {biz.businessName} - <span style={{ fontSize: '11px', color: '#888888' }}>{biz.category} ({biz.addressLocality})</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {searchArticles.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'News Articles' : 'செய்தி கட்டுரைகள்'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchArticles.map((art) => (
                      <Link
                        key={art.id || art.article_id}
                        to={`/article/${art.id || art.article_id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                        className="search-result-item"
                      >
                        <i className="far fa-newspaper" style={{ color: 'var(--primary, #B3732A)', flexShrink: 0 }}></i>
                        <span style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lang === 'en' ? (art.titleEn || art.titleTa) : (art.titleTa || art.titleEn)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchVideos.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Videos' : 'வீடியோக்கள்'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchVideos.map((vid) => (
                      <Link
                        key={vid.id}
                        to="/videos"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          textDecoration: 'none',
                          color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: 'background 0.2s',
                          cursor: 'pointer'
                        }}
                        className="search-result-item"
                      >
                        <i className="fas fa-play-circle" style={{ color: '#EF4444', flexShrink: 0 }}></i>
                        <span style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {vid.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Horizontal scrollable category navigation bar in single line */}
      <style>{`
        @media (min-width: 769px) {
          .main-nav-desktop-overflow {
            overflow: visible !important;
            overflow-x: visible !important;
          }
          .main-nav-container-desktop {
            overflow: visible !important;
          }
        }
        @media (max-width: 768px) {
          .logo-district-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: center !important;
            gap: 2px !important;
          }
          .header-logo-img {
            height: 30px !important;
          }
          .header-district-btn {
            font-size: 11px !important;
            padding: 2px 0px !important;
          }
        }
        @media (min-width: 769px) {
          .logo-district-container {
            flex-direction: row !important;
            align-items: center !important;
            gap: 12px !important;
          }
          .header-logo-img {
            height: 40px !important;
          }
          .header-district-btn {
            font-size: 13px !important;
            padding: 4px 6px 1px 6px !important;
          }
        }
         @media (max-width: 768px) {
          .nav-item-wrapper {
            position: static !important;
          }
          .category-dropdown-menu {
            transform: none !important;
            margin-top: 8px !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
          }
        }
      `}</style>
      {/* Desktop Main Top Header (Blue Top Bar + Logo Header + Right Market/Dam Widget Slider) */}
      <div className="header-desktop-wrapper" style={{ display: 'block' }}>
        {/* Blue Top Bar */}
        <div style={{ background: '#0040B8', color: '#ffffff', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span><i className="far fa-calendar-alt"></i> {new Date().toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span><i className="far fa-clock"></i> {new Date().toLocaleTimeString(lang === 'ta' ? 'ta-IN' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="fas fa-map-marker-alt"></i> {renderDistrictSelector(true)}
              </span>
              <span><i className="fas fa-thermometer-half"></i> 30°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}><i className="fab fa-facebook-f"></i></a>
              <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}><i className="fab fa-twitter"></i></a>
              <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}><i className="fab fa-instagram"></i></a>
              <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}><i className="fab fa-youtube"></i></a>
              <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}><i className="fab fa-whatsapp"></i></a>
              <a href="#" style={{ color: '#ffffff', textDecoration: 'none' }}><i className="fab fa-telegram"></i></a>
              <button onClick={toggleTheme} style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: '#ffffff', padding: '3px 8px', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i> {theme === 'light' ? 'இருள்' : 'ஒளி'}
              </button>
              <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: '#ffffff', padding: '3px 8px', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                {lang === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </div>
        </div>

        {/* White Logo & Market Slider Header Area */}
        <div style={{ background: theme === 'dark' ? '#0f172a' : '#ffffff', padding: '14px 0', borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {renderLogo('large', false)}
              <div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary, #0057FF)', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
                  KING <span style={{ color: '#EF4444' }}>24x7</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', fontWeight: 600, marginTop: '2px' }}>
                  {lang === 'en' ? 'Truth. Understanding. In Tamil.' : 'உண்மை. புரிதல். தமிழில்.'}
                </div>
              </div>
            </div>
            <HeaderWidgetSlider />
          </div>
        </div>
      </div>

      <nav
        className={`main-nav ${isRegionalPage ? 'regional-theme' : ''}`}
        style={{
          position: 'relative',
          overflow: 'visible',
          whiteSpace: 'nowrap',
          borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB',
          background: theme === 'dark' ? '#000000' : '#FFFFFF'
        }}
      >
        <div
          className="container main-nav-container-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '0 16px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {renderScrollNavMenu()}
        </div>
      </nav>

      {/* Side Drawer Panel */}
      <div
        className={`side-drawer-container ${drawerOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          visibility: drawerOpen ? 'visible' : 'hidden',
          zIndex: 99999,
          transition: 'visibility 0.3s'
        }}
      >
        {/* Overlay */}
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            opacity: drawerOpen ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
        {/* Drawer Content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%',
          background: theme === 'dark' ? '#000000' : '#ffffff',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          gap: '20px',
          color: theme === 'dark' ? '#ffffff' : '#1e293b',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {renderLogo('small')}
            <button onClick={() => setDrawerOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: 'inherit', cursor: 'pointer' }}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Profile section below the logo */}
          <div style={{
            marginTop: '5px',
            padding: '12px',
            borderRadius: '8px',
            background: theme === 'dark' ? '#1E293B' : '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {isAuthenticated && user ? (
              <UserAvatar user={user} size={36} onClick={() => {
                navigate('/profile');
                setDrawerOpen(false);
              }} />
            ) : (
              <Link
                to="/login"
                onClick={() => setDrawerOpen(false)}
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#1e293b',
                  fontSize: '28px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
                aria-label="User Account"
              >
                <i className="fas fa-user-circle"></i>
              </Link>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {isAuthenticated && user ? (
                <>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>{user.fullName}</span>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <Link
                      to="/profile"
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        color: 'var(--primary)',
                        fontSize: '11px',
                        fontWeight: '700',
                        textDecoration: 'none'
                      }}
                    >
                      {lang === 'en' ? 'Profile' : 'சுயவிவரம்'}
                    </Link>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>|</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDrawerOpen(false);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left'
                      }}
                    >
                      {lang === 'en' ? 'Logout' : 'வெளியேறு'}
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--primary, #B3732A)',
                    textDecoration: 'none'
                  }}
                >
                  {lang === 'en' ? 'Login / Register' : 'உள்நுழை / பதிவு செய்'}
                </Link>
              )}
            </div>
          </div>

          {/* Drawer category items list */}
          <div style={{ borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1', paddingBottom: '15px', marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {lang === 'en' ? 'Sections' : 'பிரிவுகள்'}
            </h4>
            {renderNavMenuVertical(() => setDrawerOpen(false))}
          </div>

          {/* Utility elements inside sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'District News' : 'மாவட்ட செய்திகள்'}
              </h4>
              {renderDistrictSelector()}
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'Weather' : 'வானிலை'}
              </h4>
              <span><i className="fas fa-thermometer-half"></i> {weatherTemp}</span>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'Settings' : 'அமைப்புகள்'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{lang === 'en' ? 'Theme Mode' : 'பின்னணி'}</span>
                  <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>
                    <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{lang === 'en' ? 'Language' : 'மொழி'}</span>
                  <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '4px', borderRadius: '4px', border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1', background: 'transparent', color: 'inherit' }}>
                    <option value="ta">தமிழ்</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>


            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {lang === 'en' ? 'Follow Us' : 'எங்களை பின்தொடர'}
              </h4>
              {renderSocials()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
