import React, { createContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('king24x7_theme') || 'light');
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('king24x7_primaryColor') || '#B3732A');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('king24x7_fontSize') || 'medium');
  const [widgetWidth, setWidgetWidth] = useState(() => parseInt(localStorage.getItem('king24x7_widgetWidth')) || 640);
  const [slideSpeed, setSlideSpeed] = useState(() => parseInt(localStorage.getItem('king24x7_slideSpeed')) || 8);
  const [sections, setSections] = useState(() => {
    try {
      const saved = localStorage.getItem('king24x7_sections');
      return saved ? JSON.parse(saved) : {
        hero: true, video: true, stories: true, agri: true,
        election: true, livetv: true, poll: true, digest: true,
        newsletter: true, district: true, business: true
      };
    } catch {
      return {
        hero: true, video: true, stories: true, agri: true,
        election: true, livetv: true, poll: true, digest: true,
        newsletter: true, district: true, business: true
      };
    }
  });

  useEffect(() => {
    // Fetch live layout config from backend API
    fetchApi('/public/layout/web')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const apiSections = {};
          data.forEach(item => {
            apiSections[item.sectionKey] = item.isVisible;
            // Map keys dynamically to support frontend compatibility
            if (item.sectionKey === 'news_ticker') {
              apiSections.news_ticker = item.isVisible;
              apiSections.ticker = item.isVisible;
            }
            if (item.sectionKey === 'video_news') {
              apiSections.video_news = item.isVisible;
              apiSections.video = item.isVisible;
            }
            if (item.sectionKey === 'web_stories') {
              apiSections.web_stories = item.isVisible;
              apiSections.stories = item.isVisible;
            }
            if (item.sectionKey === 'live_tv') {
              apiSections.live_tv = item.isVisible;
              apiSections.livetv = item.isVisible;
            }
            if (item.sectionKey === 'news_digest') {
              apiSections.news_digest = item.isVisible;
              apiSections.digest = item.isVisible;
            }
            if (item.sectionKey === 'business_case') {
              apiSections.business_case = item.isVisible;
              apiSections.business = item.isVisible;
            }
          });
          setSections(prev => ({ ...prev, ...apiSections }));
        }
      })
      .catch(err => console.warn("Failed to fetch layout config", err));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('king24x7_theme', theme);
    
    const favicon = document.getElementById('favicon') || document.querySelector("link[rel*='icon']");
    if (favicon) {
      if (theme === 'dark') {
        favicon.setAttribute('href', '/assets/icons/favicon-dark.png');
        favicon.setAttribute('type', 'image/png');
      } else {
        favicon.setAttribute('href', '/assets/icons/favicon-light.png');
        favicon.setAttribute('type', 'image/png');
      }
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--primary-dark', primaryColor + 'CC');
    document.documentElement.style.setProperty('--primary-light', primaryColor + '1A');
    localStorage.setItem('king24x7_primaryColor', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.body.style.fontSize = sizes[fontSize];
    localStorage.setItem('king24x7_fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('king24x7_widgetWidth', widgetWidth);
  }, [widgetWidth]);

  useEffect(() => {
    localStorage.setItem('king24x7_slideSpeed', slideSpeed);
  }, [slideSpeed]);

  useEffect(() => {
    localStorage.setItem('king24x7_sections', JSON.stringify(sections));
  }, [sections]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const toggleSection = (sectionId) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const resetAll = () => {
    setTheme('light');
    setPrimaryColor('#000000');
    setFontSize('medium');
    setWidgetWidth(640);
    setSlideSpeed(8);
    setSections({
      hero: true, video: true, stories: true, agri: true,
      election: true, livetv: true, poll: true, digest: true,
      newsletter: true, district: true, business: true
    });
  };

  return (
    <ThemeContext.Provider value={{
      theme, setTheme, toggleTheme,
      primaryColor, setPrimaryColor,
      fontSize, setFontSize,
      widgetWidth, setWidgetWidth,
      slideSpeed, setSlideSpeed,
      sections, setSections, toggleSection,
      resetAll
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
