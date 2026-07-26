/**
 * Widget Registry for Kings 24x7 Headless Homepage Builder
 * Defines self-contained widget primitives, icons, labels, and repeatable instance options.
 */

export const WIDGET_REGISTRY = {
  website_navigation: {
    type: 'website_navigation',
    name: 'Website Navigation',
    description: 'Auto-syncing top navigation header using Taxonomy categories.',
    icon: 'fas fa-bars',
    color: '#0EA5E9', // Sky Blue
    allowMultiple: false,
    defaultConfig: {
      navStyle: 'horizontal',
      alignment: 'center',
      width: 'full',
      position: 'fixed'
    }
  },
  news_ticker: {
    type: 'news_ticker',
    name: 'Breaking News Ticker',
    description: 'Top marquee ticker showing active breaking news alerts.',
    icon: 'fas fa-bolt',
    color: '#D97706',
    allowMultiple: false,
    defaultConfig: { speed: 'medium', displayCount: 5 }
  },
  hero: {
    type: 'hero',
    name: 'Top News Slider (Hero Grid)',
    description: 'Main banner card stacked next to three secondary story cards.',
    icon: 'fas fa-layer-group',
    color: '#7C3AED',
    allowMultiple: false,
    defaultConfig: { categoryId: '', readingTime: true }
  },
  quick_access: {
    type: 'quick_access',
    name: 'Quick Access Bar',
    description: 'Horizontal category icon pills for quick mobile/web navigation.',
    icon: 'fas fa-th-large',
    color: '#059669',
    allowMultiple: false,
    defaultConfig: { style: 'pills' }
  },
  latest_news: {
    type: 'latest_news',
    name: 'News Grid',
    description: 'Responsive news card grid supporting category and tag filtering.',
    icon: 'fas fa-newspaper',
    color: '#2563EB',
    allowMultiple: true,
    defaultConfig: { limit: 6, categoryId: '', displayVariant: 'grid' }
  },
  video_news: {
    type: 'video_news',
    name: 'Video News Player',
    description: 'Multi-category video news carousel with integrated popup player.',
    icon: 'fas fa-video',
    color: '#EA580C',
    allowMultiple: true,
    defaultConfig: { limit: 4, categoryId: '' }
  },
  web_stories: {
    type: 'web_stories',
    name: 'Web Stories Deck',
    description: 'Bite-sized visual story cards with view counters.',
    icon: 'fas fa-sticky-note',
    color: '#EC4899',
    allowMultiple: true,
    defaultConfig: { limit: 6 }
  },
  trending_sidebar: {
    type: 'trending_sidebar',
    name: 'Trending News List',
    description: 'Ranked list of top-performing viral news stories.',
    icon: 'fas fa-fire',
    color: '#EF4444',
    allowMultiple: true,
    defaultConfig: { limit: 5 }
  },
  weather: {
    type: 'weather',
    name: 'Weather Widget',
    description: 'Localized current temperature and 3-day weather forecast.',
    icon: 'fas fa-cloud-sun',
    color: '#0284C7',
    allowMultiple: true,
    defaultConfig: { city: 'Chennai' }
  },
  business_case: {
    type: 'business_case',
    name: 'Business Case Studies',
    description: 'Document and pdf download cards for business analysis.',
    icon: 'fas fa-briefcase',
    color: '#4F46E5',
    allowMultiple: true,
    defaultConfig: { limit: 4 }
  },
  crowd_reporter: {
    type: 'crowd_reporter',
    name: 'Crowd Reporter Box',
    description: 'Interactive citizen reporting callout widget.',
    icon: 'fas fa-bullhorn',
    color: '#D97706',
    allowMultiple: false,
    defaultConfig: {}
  },
  news_digest: {
    type: 'news_digest',
    name: 'Tamil News Digest',
    description: 'Full-width bottom summary rows for daily news roundup.',
    icon: 'fas fa-rss',
    color: '#F97316',
    allowMultiple: false,
    defaultConfig: { limit: 5 }
  }
};

export const getWidgetMeta = (type) => {
  return WIDGET_REGISTRY[type] || {
    type,
    name: type,
    description: 'Custom widget block',
    icon: 'fas fa-cube',
    color: '#64748B',
    allowMultiple: true,
    defaultConfig: {}
  };
};
