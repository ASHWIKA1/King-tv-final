/**
 * Data Provider Registry for Kings 24x7 Enterprise Platform
 * Decouples content fetching logic from widget rendering.
 */

export const DATA_PROVIDERS = {
  latest_news: {
    id: 'latest_news',
    name: 'Latest Global News Feed',
    description: 'Pulls newest published articles across all categories.',
    paramsSchema: [{ name: 'limit', label: 'Item Count Limit', type: 'number', default: 6 }]
  },
  category_feed: {
    id: 'category_feed',
    name: 'Category Specific Feed',
    description: 'Pulls articles filtered by a specific news category.',
    paramsSchema: [
      { name: 'categoryId', label: 'News Category', type: 'category_select', required: true },
      { name: 'limit', label: 'Item Count Limit', type: 'number', default: 6 }
    ]
  },
  tag_feed: {
    id: 'tag_feed',
    name: 'Keyword & Tag Feed',
    description: 'Pulls articles matching specific focus keywords or tags.',
    paramsSchema: [
      { name: 'tag', label: 'Focus Tag / Keyword', type: 'text', placeholder: 'e.g. election, chennai' },
      { name: 'limit', label: 'Item Count Limit', type: 'number', default: 6 }
    ]
  },
  manual_selection: {
    id: 'manual_selection',
    name: 'Manual Hand-Picked Selection',
    description: 'Hand-pick specific article IDs to highlight.',
    paramsSchema: [
      { name: 'articleIds', label: 'Comma-Separated Article IDs', type: 'text', placeholder: '101, 102, 105' }
    ]
  },
  trending_feed: {
    id: 'trending_feed',
    name: 'Trending Viral Stories',
    description: 'Pulls highest viewed articles within the past 24 hours.',
    paramsSchema: [{ name: 'limit', label: 'Top Items Count', type: 'number', default: 5 }]
  },
  external_api: {
    id: 'external_api',
    name: 'External Weather & Market API',
    description: 'Pulls real-time commodity rates, weather or RSS feeds.',
    paramsSchema: [{ name: 'feedType', label: 'Feed Type', type: 'select', options: ['weather', 'commodity', 'rss'] }]
  },
  ai_generated: {
    id: 'ai_generated',
    name: 'AI Automated Digest Feed',
    description: 'Pulls daily AI-generated news briefs and summaries.',
    paramsSchema: [{ name: 'limit', label: 'Digest Items', type: 'number', default: 5 }]
  }
};

export const getDataProvider = (providerId) => {
  return DATA_PROVIDERS[providerId] || DATA_PROVIDERS.latest_news;
};
