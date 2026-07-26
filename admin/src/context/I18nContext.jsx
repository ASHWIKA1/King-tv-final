import React, { createContext, useState, useContext, useEffect } from 'react';

const I18nContext = createContext(null);

const translations = {
  en: {
    dashboard: 'Dashboard',
    users: 'User Management',
    settings: 'System Configuration',
    profanity: 'Profanity Manager',
    layout: 'Home Layout',
    push: 'Push Notifications',
    seo: 'SEO Settings',
    sitemap: 'Sitemap',
    fonts: 'Font Manager',
    taxonomy: 'Taxonomy (Categories/Districts)',
    surveys: 'Surveys & Polls',
    webstore: 'Webstore',
    audit: 'Audit Logs',
    logout: 'Log Out',
    welcome: 'Welcome back',
    tamil: 'Tamil',
    english: 'English',
    save: 'Save Changes',
    cancel: 'Cancel',
    status: 'Status',
    action: 'Action',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create New',
    suspend: 'Suspend',
    active: 'Active',
    suspended: 'Suspended',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    review: 'Review Content',
    ugc: 'UGC Queue',
    aiRewrite: 'AI Paraphrase',
    analytics: 'Reports & Analytics',
    videoLength: 'Max Video Length',
    gpsRadius: 'GPS Target Radius (KM)',
    recentLogs: 'Recent Action Logs',
    main: 'Main',
    management: 'Management',
    workspace: 'Workspace',
    myPosts: 'My Posts',
    engagementLayout: 'Engagement & Layout',
    configuration: 'Configuration',
    rolesPermissions: 'Roles & Permissions',
    personal: 'Personal',
    myProfile: 'My Profile',
    userAccounts: 'User Accounts',
    contentQueue: 'Content Queue',
    newsroom: 'Newsroom',
    editorialCalendar: 'Editorial Calendar',
    newsManagement: 'News Management',
    createArticle: 'Create Article',
    ugcQueue: 'UGC Queue',
    breakingNews: 'Breaking News',
    content: 'Content',
    engagement: 'Engagement & Layout',
    monetization: 'Monetization',
    adManagement: 'Ad Management',
    administration: 'Administration',
    viewNewsSite: 'View News Site',
    dashboardOverview: 'Dashboard Overview',
    metricsSummary: 'Summary of your KING24X7 portal metrics.',
    totalUsers: 'Total Users',
    fromLastMonth: '+12% from last month',
    pendingReview: 'Pending Review',
    awaitApproval: 'Articles await approval',
    activeStreams: 'Active Streams',
    liveBroadcasts: 'Live broadcasts',
    profanityAlerts: 'Profanity Alerts',
    requiresAttention: 'Requires attention',
    recentActivity: 'Recent Activity',
    activityFeedPlaceholder: 'Activity feed goes here (integrated with audit logs).'
  },
  ta: {
    dashboard: 'முகப்பு பலகை',
    users: 'பயனர்கள் மேலாண்மை',
    settings: 'அமைப்புகள் திருத்தம்',
    profanity: 'தவறான சொற்கள் தடுப்பான்',
    layout: 'முகப்பு தள அமைப்பு',
    push: 'புஷ் அறிவிப்புகள்',
    seo: 'தேடுபொறி உகந்ததாக்கல்',
    sitemap: 'தள வரைபடம்',
    fonts: 'எழுத்துரு மேலாண்மை',
    taxonomy: 'வகைப்பாடு (பகுப்புகள்/மாவட்டங்கள்)',
    surveys: 'கருத்துக்கணிப்புகள்',
    webstore: 'வலை அங்காடி',
    audit: 'தணிக்கை பதிவுகள்',
    logout: 'வெளியேறு',
    welcome: 'நல்வரவு',
    tamil: 'தமிழ்',
    english: 'ஆங்கிலம்',
    save: 'மாற்றங்களைச் சேமி',
    cancel: 'ரத்து செய்',
    status: 'நிலை',
    action: 'செயல்பாடு',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    role: 'பொறுப்பு',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    create: 'புதியதாக உருவாக்கு',
    suspend: 'தற்காலிக நிறுத்தம்',
    active: 'செயலில்',
    suspended: 'நிறுத்தப்பட்டது',
    pending: 'காத்திருக்கிறது',
    approved: 'ஏற்கப்பட்டது',
    rejected: 'நிராகரிக்கப்பட்டது',
    review: 'உள்ளடக்க மதிப்பாய்வு',
    ugc: 'வாசகர் செய்திகள்',
    aiRewrite: 'செயற்கை நுண்ணறிவு திருத்தம்',
    analytics: 'அறிக்கைகள் & பகுப்பாய்வு',
    videoLength: 'அதிகபட்ச வீடியோ நீளம்',
    gpsRadius: 'ஜிபிஎஸ் எல்லை (கிமீ)',
    recentLogs: 'சமீபத்திய தணிக்கை குறிப்புகள்',
    main: 'முதன்மை',
    management: 'மேலாண்மை',
    workspace: 'பணியிடம்',
    myPosts: 'எனது பதிவுகள்',
    engagementLayout: 'பயனர் ஈடுபாடு & அமைப்பு',
    configuration: 'கட்டமைப்பு',
    rolesPermissions: 'பங்கு மற்றும் அனுமதிகள்',
    personal: 'தனிப்பட்டவை',
    myProfile: 'எனது சுயவிவரம்',
    userAccounts: 'பயனர் கணக்குகள்',
    contentQueue: 'உள்ளடக்க வரிசை',
    newsroom: 'செய்தியறை',
    editorialCalendar: 'ஆசிரியர் நாட்காட்டி',
    newsManagement: 'செய்தி மேலாண்மை',
    createArticle: 'கட்டுரை உருவாக்கு',
    ugcQueue: 'வாசகர் செய்திகள் வரிசை',
    breakingNews: 'அவசர செய்தி',
    content: 'உள்ளடக்கம்',
    engagement: 'பயனர் ஈடுபாடு & அமைப்பு',
    monetization: 'வருவாய்',
    adManagement: 'விளம்பர மேலாண்மை',
    administration: 'நிர்வாகம்',
    viewNewsSite: 'செய்தி தளம் காண்க',
    dashboardOverview: 'கட்டுப்பாட்டு அறை மேலோட்டம்',
    metricsSummary: 'உங்களது KING24X7 போர்டல் புள்ளிவிவரங்களின் சுருக்கம்.',
    totalUsers: 'மொத்த பயனர்கள்',
    fromLastMonth: 'கடந்த மாதத்தை விட +12%',
    pendingReview: 'மதிப்பாய்விற்காக காத்திருப்பவை',
    awaitApproval: 'கட்டுரைகள் ஒப்புதலுக்காக காத்திருக்கின்றன',
    activeStreams: 'செயலில் உள்ள ஒளிபரப்புகள்',
    liveBroadcasts: 'நேரடி ஒளிபரப்புகள்',
    profanityAlerts: 'தவறான வார்த்தை எச்சரிக்கைகள்',
    requiresAttention: 'கவனம் தேவை',
    recentActivity: 'சமீபத்திய செயல்பாடுகள்',
    activityFeedPlaceholder: 'சமீபத்திய செயல்பாடுகள் இங்கே காட்டப்படும் (தணிக்கை பதிவுகளுடன் இணைக்கப்பட்டுள்ளது).'
  }
};

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('admin_lang') || 'en');

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const toggleLang = (targetLang) => {
    const nextLang = targetLang || (lang === 'en' ? 'ta' : 'en');
    setLang(nextLang);
    localStorage.setItem('admin_lang', nextLang);
  };

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
