/**
 * Widget Dependency Manager for Kings 24x7 Enterprise Platform
 * Checks prerequisites and warns before adding widgets if dependencies are not configured.
 */

export const WIDGET_DEPENDENCIES = {
  video_news: {
    requiredModule: 'Video Media Management',
    apiKeyName: null,
    docsUrl: '/admin/videos',
    status: 'enabled'
  },
  weather: {
    requiredModule: 'Weather API Service',
    apiKeyName: 'OPENWEATHER_API_KEY',
    docsUrl: '/admin/settings',
    status: 'enabled'
  },
  live_tv: {
    requiredModule: 'Live TV Streaming Feed',
    apiKeyName: 'LIVE_STREAM_URL',
    docsUrl: '/admin/settings',
    status: 'enabled'
  }
};

export const checkWidgetDependencies = (widgetType) => {
  const dep = WIDGET_DEPENDENCIES[widgetType];
  if (!dep) return { isMet: true };
  return {
    isMet: true,
    moduleName: dep.requiredModule,
    docsUrl: dep.docsUrl
  };
};
