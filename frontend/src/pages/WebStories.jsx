import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { fetchApi } from '../utils/api';
import './WebStories.css';

const WebStories = () => {
  const { lang, t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/web-stories/getAllWeb')
      .then(data => {
        const contentList = data && data.content ? data.content : (Array.isArray(data) ? data : []);
        if (contentList.length > 0) {
          const formatted = contentList.map(story => {
            let slides = [];
            try {
              slides = story.slidesJson ? JSON.parse(story.slidesJson) : [];
            } catch(e) {
              console.warn("Failed to parse slides JSON", e);
            }
            return {
              id: story.id,
              cat: story.cat || 'general',
              badge: story.badge || 'NEW',
              titleTa: story.titleTa,
              titleEn: story.titleEn || story.titleTa,
              views: story.viewsCount > 1000 ? `${(story.viewsCount/1000).toFixed(1)}K` : `${story.viewsCount}`,
              gradient: story.backgroundGradient || 'linear-gradient(135deg, #1E40AF, #3B82F6)',
              slides: slides
            };
          });
          setStories(formatted);
        } else {
          setStories([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch stories from database", err);
        setStories([]);
        setLoading(false);
      });
  }, []);




  const getCategoryDetails = (catSlug) => {
    const categories = {
      politics: { en: 'Politics', ta: 'அரசியல்', color: '#1E3A8A' },
      business: { en: 'Business', ta: 'வணிகம்', color: '#065F46' },
      sports: { en: 'Sports', ta: 'விளையாட்டு', color: '#C2410C' },
      cinema: { en: 'Cinema', ta: 'திரைப்படம்', color: '#BE185D' },
      tech: { en: 'Technology', ta: 'தொழில்நுட்பம்', color: '#6D28D9' },
      regional: { en: 'Regional', ta: 'மாநிலம்', color: '#4B5563' },
      international: { en: 'International', ta: 'சர்வதேசம்', color: '#0D9488' }
    };
    return categories[catSlug] || { en: catSlug, ta: catSlug, color: '#3B82F6' };
  };

  const filteredStories = activeTab === 'all'
    ? stories
    : stories.filter(story => story.cat === activeTab);

  // Handle open viewer
  const handleOpenViewer = (story, listIndex) => {
    setSelectedStory(story);
    setActiveStoryIndex(listIndex);
    setActiveSlideIndex(0);
    setProgress(0);
  };

  // Handle close viewer
  const handleCloseViewer = () => {
    setSelectedStory(null);
    setProgress(0);
  };

  // Navigate viewer between stories
  const handleNextStory = () => {
    if (activeStoryIndex < filteredStories.length - 1) {
      const nextIdx = activeStoryIndex + 1;
      setActiveStoryIndex(nextIdx);
      setSelectedStory(filteredStories[nextIdx]);
      setActiveSlideIndex(0);
      setProgress(0);
    } else {
      handleCloseViewer();
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      const prevIdx = activeStoryIndex - 1;
      setActiveStoryIndex(prevIdx);
      setSelectedStory(filteredStories[prevIdx]);
      // Set to the last slide of the previous story
      const prevStory = filteredStories[prevIdx];
      setActiveSlideIndex(prevStory.slides.length - 1);
      setProgress(0);
    }
  };

  // Slide navigation inside the current story
  const handleNextSlide = () => {
    if (selectedStory && activeSlideIndex < selectedStory.slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Last slide completed, move to next story
      handleNextStory();
    }
  };

  const handlePrevSlide = () => {
    if (selectedStory && activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      // First slide, go to the previous story
      handlePrevStory();
    }
  };

  // Autoplay / Progress bar timer
  useEffect(() => {
    if (!selectedStory) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + 2; // Increments to hit 100% in 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, [selectedStory, activeStoryIndex, activeSlideIndex, filteredStories]);

  return (
    <div className="web-stories-page">
      <div className="container">
        {/* Page Header */}
        <div className="stories-header">
          <div className="breadcrumbs">
            <Link to="/">{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '10px', margin: '0 8px' }}></i>
            <span>{lang === 'en' ? 'Web Stories' : 'வெப் ஸ்டோரிஸ்'}</span>
          </div>

          <h1>
            <i className="fas fa-bolt text-primary-gold"></i>
            {lang === 'en' ? ' Web Stories' : ' வெப் ஸ்டோரிஸ்'}
          </h1>
          <p className="subtitle">
            {lang === 'en'
              ? 'Swipe through short, visual news snapshots and quick updates.'
              : 'குறுகிய, காட்சிப் செய்திப் பதிவுகள் மற்றும் விரைவான தகவல்களை உடனுக்குடன் பாருங்கள்.'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="stories-tabs-container">
          <div className="stories-tabs">
            {['all', 'politics', 'business', 'sports', 'cinema', 'tech', 'regional', 'international'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && (lang === 'en' ? 'All Stories' : 'அனைத்தும்')}
                {tab === 'politics' && (lang === 'en' ? 'Politics' : 'அரசியல்')}
                {tab === 'business' && (lang === 'en' ? 'Business' : 'வணிகம்')}
                {tab === 'sports' && (lang === 'en' ? 'Sports' : 'விளையாட்டு')}
                {tab === 'cinema' && (lang === 'en' ? 'Cinema' : 'திரைப்படம்')}
                {tab === 'tech' && (lang === 'en' ? 'Technology' : 'தொழில்நுட்பம்')}
                {tab === 'regional' && (lang === 'en' ? 'Regional' : 'மாநிலம்')}
                {tab === 'international' && (lang === 'en' ? 'International' : 'சர்வதேசம்')}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="stories-grid">
            {filteredStories.map((story, index) => {
              const catDetails = getCategoryDetails(story.cat);
              return (
                <div
                  key={story.id}
                  className="story-card-item"
                  style={{ background: story.gradient }}
                  onClick={() => handleOpenViewer(story, index)}
                >
                  <span className="badge-tag" style={{ background: story.badge === 'NEW' ? '#EF4444' : '#F97316' }}>
                    {story.badge}
                  </span>
                  <div className="story-card-overlay">
                    <span className="story-cat-badge" style={{ background: catDetails.color }}>
                      {lang === 'en' ? catDetails.en : catDetails.ta}
                    </span>
                    <h3>{lang === 'en' ? story.titleEn : story.titleTa}</h3>
                    <span className="story-views-badge"><i className="far fa-eye"></i> {story.views}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-stories">
            <i className="far fa-sticky-note fa-3x"></i>
            <p>{lang === 'en' ? 'No web stories found in this category.' : 'இவ்வகையில் வெப் ஸ்டோரிஸ் ஏதும் இல்லை.'}</p>
          </div>
        )}
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {selectedStory && (
        <div className="story-viewer-modal">
          <div className="story-viewer-backdrop" onClick={handleCloseViewer}></div>
          
          {/* Main Story Card container */}
          <div className="story-viewer-card" style={{ background: selectedStory.gradient }}>
            {/* Top Progress bar representing slides in the selected story */}
            <div className="story-viewer-header">
              <div className="progress-bars-container">
                {selectedStory.slides.map((s, idx) => {
                  let widthPercent = 0;
                  if (idx < activeSlideIndex) widthPercent = 100;
                  else if (idx === activeSlideIndex) widthPercent = progress;
                  return (
                    <div className="progress-bar-bg" key={idx}>
                      <div className="progress-bar-fill" style={{ width: `${widthPercent}%` }}></div>
                    </div>
                  );
                })}
              </div>

              <div className="header-meta">
                <span className="category-pill" style={{ background: getCategoryDetails(selectedStory.cat).color }}>
                  {lang === 'en' ? getCategoryDetails(selectedStory.cat).en : getCategoryDetails(selectedStory.cat).ta}
                </span>
                <span className="views-pill"><i className="far fa-eye"></i> {selectedStory.views}</span>
                <button className="close-viewer-btn" onClick={handleCloseViewer} aria-label="Close stories">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Tap areas for next/prev navigation inside the slide deck */}
            <div className="story-tap-areas">
              <div className="tap-left" onClick={handlePrevSlide}></div>
              <div className="tap-right" onClick={handleNextSlide}></div>
            </div>

            {/* Story Text Content (Dynamic based on active slide) */}
            <div className="story-viewer-content">
              <h2>{lang === 'en' ? selectedStory.slides[activeSlideIndex].titleEn : selectedStory.slides[activeSlideIndex].titleTa}</h2>
              <p>{lang === 'en' ? selectedStory.slides[activeSlideIndex].descEn : selectedStory.slides[activeSlideIndex].descTa}</p>
            </div>

            {/* Bottom Navigation Indicators */}
            <div className="story-viewer-footer">
              <button 
                className="nav-btn prev" 
                onClick={handlePrevSlide} 
                disabled={activeStoryIndex === 0 && activeSlideIndex === 0}
                style={{ opacity: (activeStoryIndex === 0 && activeSlideIndex === 0) ? 0.3 : 1 }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="slide-indicator">
                {activeSlideIndex + 1} / {selectedStory.slides.length}
              </span>
              <button className="nav-btn next" onClick={handleNextSlide}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebStories;
