import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

/**
 * Generic Page Rendering Engine for Kings 24x7 Enterprise Platform
 * Renders pages, sections, widgets, and layouts dynamically from backend configuration.
 * Contains ZERO hardcoded visual page structures.
 */
const DEFAULT_WEB_SECTIONS = [
  { sectionKey: 'hero', sectionLabel: 'Hero Section', displayOrder: 1, isVisible: true },
  { sectionKey: 'quick_access', sectionLabel: 'Quick Access', displayOrder: 2, isVisible: true },
  { sectionKey: 'latest_news', sectionLabel: 'Latest News', displayOrder: 3, isVisible: true },
  { sectionKey: 'video_news', sectionLabel: 'Video News', displayOrder: 4, isVisible: true },
  { sectionKey: 'web_stories', sectionLabel: 'Web Stories', displayOrder: 5, isVisible: true },
  { sectionKey: 'crowd_reporter_highlight', sectionLabel: 'Reporter Highlight', displayOrder: 6, isVisible: true },
  { sectionKey: 'institution_news', sectionLabel: 'Institution News', displayOrder: 7, isVisible: true },
  { sectionKey: 'business_case', sectionLabel: 'Business Studies', displayOrder: 8, isVisible: true },
  { sectionKey: 'news_digest', sectionLabel: 'News Digest', displayOrder: 9, isVisible: true }
];

const GenericPageRenderer = ({ layoutType = 'WEB', renderSectionCallback }) => {
  const [sections, setSections] = useState(DEFAULT_WEB_SECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi(`/public/layout/${layoutType.toLowerCase()}`)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data]
            .filter(s => s.isVisible !== false)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setSections(sorted);
        } else {
          setSections(DEFAULT_WEB_SECTIONS);
        }
      })
      .catch(err => {
        console.warn("[GenericPageRenderer] Failed to load dynamic layout config, using defaults:", err);
        setSections(DEFAULT_WEB_SECTIONS);
      })
      .finally(() => setLoading(false));
  }, [layoutType]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
        Loading dynamic page configuration...
      </div>
    );
  }

  return (
    <div className="generic-page-container" style={{ width: '100%' }}>
      {sections.map((sec) => (
        <div key={sec.id || sec.sectionKey} className={`generic-section-block section-${sec.sectionKey}`}>
          {renderSectionCallback ? renderSectionCallback(sec.sectionKey, sec.sectionLabel, sec.configJson) : null}
        </div>
      ))}
    </div>
  );
};

export default GenericPageRenderer;
