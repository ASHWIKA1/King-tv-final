import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { resolveHandleToChannelId, fetchChannelVideos } from '../services/youtubeService';
import './Videos.css';

const Videos = () => {
  const { lang } = useContext(LanguageContext);
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Helper function to assign categoryId matching system tabs
  const categorizeVideo = (title = '', description = '') => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('tvk') || text.includes('dmk') || text.includes('admk') || text.includes('bjp') || text.includes('election') || text.includes('politics') || text.includes('அரசியல்') || text.includes('தேர்தல்') || text.includes('அமைச்சர்')) {
      return 1; // politics
    }
    if (text.includes('gold') || text.includes('rate') || text.includes('price') || text.includes('market') || text.includes('budget') || text.includes('business') || text.includes('தங்கம்') || text.includes('விலை') || text.includes('வணிகம்')) {
      return 2; // business
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
    // Default to regional
    return 6; 
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const getVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Resolve channel handle @king24x7
        const channelId = await resolveHandleToChannelId('@king24x7');
        
        // 2. Fetch latest 20 videos
        const fetched = await fetchChannelVideos(channelId, 20);
        
        // 3. Map categories and translate if needed
        const categorized = fetched.map(vid => ({
          ...vid,
          categoryId: categorizeVideo(vid.title, vid.description)
        }));

        setVideos(categorized);
        
        const selectId = location.state?.selectVideoId;
        const found = categorized.find(v => v.id === selectId);
        if (found) {
          setSelectedVideo(found);
        } else if (categorized.length > 0) {
          setSelectedVideo(categorized[0]); // Auto load newest video in player
        }
      } catch (err) {
        console.error("Error loading YouTube videos:", err);
        setError(err.message || "Failed to fetch videos from YouTube. Please check your API key and connection.");
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, []);

  // Categories mapping matching the Category ID
  const catIdMap = {
    'all': null,
    'politics': 1,
    'business': 2,
    'sports': 3,
    'cinema': 4,
    'tech': 5,
    'regional': 6,
    'international': 7
  };

  const filteredVideos = activeTab === 'all' 
    ? videos 
    : videos.filter(vid => vid.categoryId === catIdMap[activeTab]);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setIsDescExpanded(false);
    // Scroll to the main player on mobile
    const playerEl = document.getElementById('main-video-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="videos-page">
      <div className="container">
        {/* Page Header */}
        <div className="videos-header">
          <h1>
            <i className="fas fa-play-circle text-primary"></i> 
            {lang === 'en' ? ' Video Dashboard' : ' வீடியோ தளம்'}
          </h1>
          <p className="subtitle">
            {lang === 'en' 
              ? 'Watch latest news coverage, live television and trending report analysis.' 
              : 'சமீபத்திய செய்திகள், நேரடித் தொலைக்காட்சி மற்றும் ட்ரெண்டிங் அலசல்களைக் காணுங்கள்.'}
          </p>
        </div>

        {error && (
          <div className="error-message-banner" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '20px' }}></i>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>
                {lang === 'en' ? 'API Connection Error' : 'API இணைப்புப் பிழை'}
              </h4>
              <p style={{ fontSize: '13px' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Main Section: Video Player & Up Next List */}
        {loading ? (
          <div className="main-video-layout">
            {/* Left Player skeleton */}
            <div className="video-player-container">
              <div className="skeleton-player-video skeleton"></div>
              <div className="skeleton-player-title skeleton"></div>
              <div className="skeleton-player-meta skeleton"></div>
              <div className="skeleton-player-desc skeleton"></div>
              <div className="skeleton-player-desc skeleton" style={{ width: '80%' }}></div>
            </div>
            {/* Right Playlist skeleton */}
            <div className="side-playlist-container">
              <h3>{lang === 'en' ? 'Up Next' : 'அடுத்ததாக'}</h3>
              <div className="side-playlist">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-sidebar-item">
                    <div className="skeleton-sidebar-thumb skeleton"></div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div className="skeleton-sidebar-text1 skeleton"></div>
                      <div className="skeleton-sidebar-text2 skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="empty-videos-message" style={{ margin: '40px 0' }}>
            <i className="fas fa-video-slash"></i>
            <h3>{lang === 'en' ? 'No Videos Found' : 'வீடியோக்கள் எதுவும் இல்லை'}</h3>
            <p>{lang === 'en' ? 'Currently there are no videos available from this channel.' : 'இந்த சேனலில் தற்சமயம் வீடியோக்கள் எதுவும் கிடைக்கவில்லை.'}</p>
          </div>
        ) : (
          <div className="main-video-layout" id="main-video-player">
            {/* Main Video Player Panel */}
            <div className="video-player-container">
              {selectedVideo ? (
                <div className="responsive-iframe-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="no-video-placeholder">
                  <i className="fas fa-video-slash"></i>
                  <p>{lang === 'en' ? 'Select a video to start watching' : 'பார்க்க ஒரு வீடியோவைத் தேர்ந்தெடுக்கவும்'}</p>
                </div>
              )}
              {selectedVideo && (() => {
                const isLongDesc = selectedVideo.description && selectedVideo.description.length > 180;
                const displayDesc = isLongDesc && !isDescExpanded 
                  ? selectedVideo.description.slice(0, 180) + '...' 
                  : selectedVideo.description;
                return (
                  <div className="player-details">
                    {selectedVideo.isLive && (
                      <span className="badge-live"><i className="fas fa-broadcast-tower"></i> LIVE</span>
                    )}
                    <h2>{selectedVideo.title}</h2>
                    <div className="player-meta">
                      {selectedVideo.publishedAt && (
                        <span><i className="far fa-calendar-alt"></i> {new Date(selectedVideo.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="description" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-gray)' }}>
                      {displayDesc}
                    </p>
                    {isLongDesc && (
                      <button 
                        onClick={() => setIsDescExpanded(!isDescExpanded)} 
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          padding: '4px 0',
                          marginTop: '8px',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isDescExpanded ? (
                          <>{lang === 'en' ? 'Show Less' : 'குறைவாகக் காட்டு'} <i className="fas fa-chevron-up"></i></>
                        ) : (
                          <>{lang === 'en' ? 'See More' : 'மேலும் காண்க'} <i className="fas fa-chevron-down"></i></>
                        )}
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Right Sidebar column container */}
            <div className="side-column-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Comments Card Panel */}
              {selectedVideo && (
                <VideoComments videoId={selectedVideo.id} lang={lang} />
              )}

              {/* Up Next List Side Panel */}
              <div className="side-playlist-container" style={{ maxHeight: '450px' }}>
                <h3>{lang === 'en' ? 'Up Next' : 'அடுத்ததாக'}</h3>
                <div className="side-playlist">
                  {videos.filter(vid => vid.id !== selectedVideo?.id).map((vid) => (
                    <div 
                      key={vid.id}
                      className="playlist-item"
                      onClick={() => handleSelectVideo(vid)}
                    >
                      <div className="item-thumb">
                        <img 
                          src={vid.thumbnailUrl} 
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300'; }}
                          alt={vid.title} 
                        />
                        {vid.isLive ? (
                          <span className="duration-tag live">LIVE</span>
                        ) : (
                          <span className="duration-tag">{vid.duration || '3:15'}</span>
                        )}
                      </div>
                      <div className="item-info">
                        <h4>{vid.title}</h4>
                        {vid.isLive ? (
                          <span className="live-label"><i className="fas fa-circle"></i> Live Now</span>
                        ) : (
                          <span>{new Date(vid.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Video Catalog Grid Section */}
        <div className="video-catalog-section">
          <div className="section-header">
            <h2>{lang === 'en' ? 'Browse Videos' : 'வீடியோக்களை உலாவுக'}</h2>
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="videos-grid-container">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid-video-card" style={{ cursor: 'default' }}>
                  <div className="skeleton-grid-thumb skeleton"></div>
                  <div className="skeleton-grid-title skeleton"></div>
                  <div className="skeleton-grid-desc skeleton"></div>
                  <div className="skeleton-grid-meta skeleton"></div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="videos-grid-container">
              {filteredVideos.map((vid) => (
                <div 
                  key={vid.id} 
                  className="grid-video-card"
                  onClick={() => handleSelectVideo(vid)}
                >
                  <div className="card-thumb">
                    <img 
                      src={vid.thumbnailUrl} 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500'; }}
                      alt={vid.title} 
                    />
                    <div className="play-btn-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                    {vid.isLive ? (
                      <span className="duration-label" style={{ backgroundColor: '#EF4444' }}>LIVE</span>
                    ) : (
                      <span className="duration-label">{vid.duration || '3:15'}</span>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{vid.title}</h3>
                    <p className="desc-text">{vid.description}</p>
                    <div className="card-meta-info">
                      <span>{new Date(vid.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-videos-message">
              <i className="fas fa-video-slash"></i>
              <h3>{lang === 'en' ? 'No Videos Found' : 'வீடியோக்கள் எதுவும் இல்லை'}</h3>
              <p>{lang === 'en' ? 'Currently there are no videos in this category.' : 'இந்த பிரிவில் தற்சமயம் வீடியோக்கள் எதுவும் பதிவேற்றப்படவில்லை.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoComments = ({ videoId, lang }) => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  // Load comments when videoId changes
  useEffect(() => {
    const storageKey = `comments_video_${videoId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      // Mock initial comments for a premium feel!
      const initialMock = [
        {
          id: 1,
          name: lang === 'en' ? 'Kumar' : 'குமார்',
          text: lang === 'en' 
            ? 'Very informative video! Thanks for the clean analysis.' 
            : 'மிகவும் பயனுள்ள வீடியோ! தெளிவான அலசலுக்கு நன்றி.',
          date: new Date(Date.now() - 3600000 * 2).toLocaleDateString(), // 2 hours ago
        },
        {
          id: 2,
          name: lang === 'en' ? 'Meena' : 'மீனா',
          text: lang === 'en' 
            ? 'Good explanation. Looking forward to more updates.' 
            : 'நல்ல விளக்கம். அடுத்தடுத்த அப்டேட்டுகளுக்காக காத்திருக்கிறேன்.',
          date: new Date(Date.now() - 3600000 * 5).toLocaleDateString(), // 5 hours ago
        }
      ];
      setComments(initialMock);
      localStorage.setItem(storageKey, JSON.stringify(initialMock));
    }
  }, [videoId, lang]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_video_${videoId}`, JSON.stringify(updated));

    // Reset form
    setName('');
    setText('');
  };

  return (
    <div className="side-playlist-container video-comments-container">
      <h3 style={{ margin: 0, marginBottom: '12px' }}>
        <span>
          <i className="far fa-comments text-primary" style={{ marginRight: '8px' }}></i>
          {lang === 'en' ? 'Comments' : 'கருத்துக்கள்'}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 'normal', float: 'right' }}>
          ({comments.length})
        </span>
      </h3>

      {/* List of comments */}
      <div className="side-playlist" style={{ maxHeight: '180px', marginBottom: '15px' }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text-gray)', textAlign: 'center', padding: '15px 0' }}>
            {lang === 'en' ? 'Be the first to comment!' : 'முதல் நபராக கருத்து தெரிவியுங்கள்!'}
          </p>
        ) : (
          comments.map(c => {
            const initial = (c.name || 'K').charAt(0).toUpperCase();
            return (
              <div key={c.id} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  {initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <h5 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: 'var(--text-dark)' }}>{c.name}</h5>
                    <span style={{ fontSize: '9px', color: 'var(--text-gray)' }}>{c.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-gray)', lineHeight: '1.4' }}>{c.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input 
          type="text" 
          placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'} 
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea 
          placeholder={lang === 'en' ? 'Add a public comment...' : 'கருத்து தெரிவிக்கவும்...'} 
          value={text}
          onChange={e => setText(e.target.value)}
          required
          rows="2"
          style={{ resize: 'none' }}
        />
        <button 
          type="submit" 
          className="comment-submit-btn"
        >
          {lang === 'en' ? 'Comment' : 'கருத்து'}
        </button>
      </form>
    </div>
  );
};

export default Videos;
