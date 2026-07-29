/**
 * TEST-ONLY DUMMY LAYOUT INTEGRATION — safe to remove after layout testing.
 *
 * Reads layout data from GET /api/v1/admin/layout/dummy (layoutType = "DUMMY_WEB").
 * Falls back to static placeholder data if API is unavailable or returns empty.
 * Does NOT read from production /api/v1/admin/layout/web.
 *
 * REMOVAL: Delete this file and the /dummy-layout route in src/App.jsx.
 */
import React, { useState, useEffect } from 'react';
import {
  dummyNavItems, dummyCategories, dummyLatestNewsCards, dummyLowerGridCards
} from './dummyLayoutData';
import { generateBlockStyles } from '../utils/styleHelper';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';
const DUMMY_API_URL = `${API_BASE}/admin/layout/dummy`;

// Section key → human readable label map for the canvas blocks
const SECTION_LABEL_MAP = {
  website_navigation: 'Navigation Bar',
  news_ticker: 'News Ticker',
  hero: 'Hero Section',
  quick_access: 'Quick Access',
  latest_news: 'Latest News',
  video_news: 'Video News',
  web_stories: 'Web Stories',
  trending_sidebar: 'Trending Sidebar',
  weather: 'Weather Widget',
  crowd_reporter: 'Crowd Reporter',
  business_case: 'Business Section',
  news_digest: 'News Digest',
  custom_builder: 'Custom Block',
};

// Section key → accent color
const SECTION_ACCENT_MAP = {
  website_navigation: '#000000',
  hero:               '#3b82f6',
  quick_access:       '#0f172a',
  latest_news:        '#3b82f6',
  video_news:         '#ef4444',
  web_stories:        '#8b5cf6',
  trending_sidebar:   '#f59e0b',
  weather:            '#06b6d4',
  crowd_reporter:     '#10b981',
  business_case:      '#ec4899',
  news_digest:        '#6366f1',
  news_ticker:        '#e11d48',
  custom_builder:     '#64748b',
};

/**
 * Renders a single canvas block for a given layout section.
 * Uses the section's configJson for styling hints where available.
 */
const LayoutSectionBlockContent = ({ section, index }) => {
  let config = {};
  try { config = JSON.parse(section.configJson || '{}'); } catch { /* ignore */ }

  const accent = SECTION_ACCENT_MAP[section.sectionKey] || '#3b82f6';
  const label  = section.sectionLabel || SECTION_LABEL_MAP[section.sectionKey] || section.sectionKey;

  if (section.sectionKey === 'website_navigation') {
    return (
      <div style={{
        backgroundColor: config.background?.color || '#000000',
        padding: '6px 16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: '12px',
        overflowX: 'hidden', whiteSpace: 'nowrap'
      }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#334155', fontSize: '11px', fontWeight: 'bold' }}>‹</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, overflowX: 'hidden' }}>
          {dummyNavItems.map(item => (
            <span key={item.id} style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              {item.label}
            </span>
          ))}
        </div>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#334155', fontSize: '11px', fontWeight: 'bold' }}>›</span>
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'hero') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.1fr)', gap: '12px', padding: '0 20px' }}>
        <div style={{
          backgroundColor: config.background?.color || '#0f172a',
          borderRadius: '8px', borderTop: `4px solid ${accent}`,
          padding: '20px', height: '145px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box'
        }}>
          <span style={{ backgroundColor: accent, color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '6px' }}>All</span>
          <span style={{ color: config.typography?.color || '#ffffff', fontSize: config.typography?.fontSize || '14px', fontWeight: 700 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '42px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'quick_access') {
    return (
      <div style={{
        backgroundColor: config.background?.color || '#0f172a',
        borderRadius: '8px', margin: '0 20px',
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '28px', overflowX: 'auto'
      }}>
        {dummyCategories.map(cat => (
          <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: accent }}></div>
            <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.sectionKey === 'latest_news') {
    const cols = config.grid?.columns || config.columns || 6;
    const cardCount = config.limit || dummyLatestNewsCards.length;
    return (
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '14px', backgroundColor: accent, borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{label}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
          {dummyLatestNewsCards.slice(0, cardCount).map(card => (
            <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '82px' }}></div>
              <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 500 }}>{card.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'news_ticker') {
    return (
      <div style={{ backgroundColor: accent, padding: '6px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>BREAKING</span>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Latest breaking news ticker — test layout
        </span>
      </div>
    );
  }

  if (section.sectionKey === 'video_news') {
    return (
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '14px', backgroundColor: accent, borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{label}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ backgroundColor: '#1e293b', borderRadius: '6px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: accent, fontSize: '20px' }}>▶</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'web_stories') {
    return (
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '14px', backgroundColor: accent, borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ minWidth: '80px', height: '120px', borderRadius: '12px', background: `linear-gradient(135deg, ${accent}55, ${accent}22)`, border: `2px solid ${accent}`, flexShrink: 0 }}></div>
          ))}
        </div>
      </div>
    );
  }

  // Generic fallback block for any other section key
  return (
    <div style={{
      margin: '0 20px',
      backgroundColor: `${accent}0D`,
      border: `1px dashed ${accent}55`,
      borderRadius: '8px', padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: '12px'
    }}>
      <div style={{ width: '10px', height: '40px', backgroundColor: accent, borderRadius: '4px', flexShrink: 0 }}></div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{label}</div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
          Section #{index + 1} · {section.isVisible ? 'Visible' : 'Hidden'}
        </div>
      </div>
    </div>
  );
};

const LayoutSectionBlock = ({ section, index }) => {
  let config = {};
  try { config = JSON.parse(section.configJson || '{}'); } catch { /* ignore */ }
  const blockStyles = generateBlockStyles(config, 'desktop', section.sectionKey === 'custom_builder');

  return (
    <div style={blockStyles}>
      <LayoutSectionBlockContent section={section} index={index} />
    </div>
  );
};

const DummyLayoutPage = () => {
  // TEST-ONLY DUMMY LAYOUT INTEGRATION — fetch from isolated DUMMY_WEB API.
  const [dummySections, setDummySections]   = useState([]);
  const [loadState, setLoadState]           = useState('loading'); // 'loading' | 'live' | 'fallback' | 'error'
  const [lastFetchedAt, setLastFetchedAt]   = useState(null);
  const [errorMsg, setErrorMsg]             = useState('');

  useEffect(() => {
    const loadDummy = async () => {
      // First check local storage (if running on same origin)
      try {
        const localData = localStorage.getItem('dummy_layout_config');
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDummySections(parsed.filter(s => s.isVisible !== false));
            setLoadState('live');
            setLastFetchedAt(new Date());
            return;
          }
        }
      } catch (e) { /* ignore */ }

      // Fallback to API fetch
      try {
        const res = await fetch(DUMMY_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const visible = data.filter(s => s.isVisible !== false);
          setDummySections(visible);
          setLoadState('live');
          setLastFetchedAt(new Date());
        } else {
          setLoadState('fallback');
        }
      } catch (err) {
        console.warn('[DUMMY PAGE] Could not reach dummy API, using fallback:', err.message);
        setErrorMsg(err.message);
        setLoadState('fallback');
      }
    };
    loadDummy();
    window.addEventListener('storage', loadDummy);
    return () => window.removeEventListener('storage', loadDummy);
  }, []);
  // END TEST-ONLY DUMMY LAYOUT INTEGRATION

  const isLive = loadState === 'live' && dummySections.length > 0;

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      backgroundColor: '#0b1120',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', boxSizing: 'border-box',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* Main Browser-Style Container */}
      <div style={{
        width: '100%', maxWidth: '1240px',
        backgroundColor: '#ffffff', borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>

        {/* 1. Light Grey Browser Top Bar */}
        <div style={{
          backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0',
          padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ width: '60px' }}></div>

          <div style={{
            backgroundColor: '#e2e8f0', padding: '4px 24px', borderRadius: '6px',
            fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.3px'
          }}>
            kings24×7.com — Dummy Preview
          </div>

          {/* Status badge */}
          <div style={{ width: '60px', display: 'flex', justifyContent: 'flex-end' }}>
            {loadState === 'loading' && (
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Loading…</span>
            )}
            {loadState === 'live' && (
              <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>● Live</span>
            )}
            {loadState === 'fallback' && (
              <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }} title={errorMsg || 'No dummy config saved yet.'}>
                ⚡ Default
              </span>
            )}
          </div>
        </div>

        {/* 2. Main Inner Preview Canvas */}
        <div style={{ backgroundColor: '#ffffff', position: 'relative', paddingBottom: '20px' }}>

          {/* Optional Visual Side Handle */}
          <div style={{
            position: 'absolute', left: '0px', top: '220px',
            width: '18px', height: '36px', backgroundColor: '#0284c7',
            borderTopRightRadius: '6px', borderBottomRightRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontSize: '10px', zIndex: 20,
            boxShadow: '2px 0 6px rgba(0,0,0,0.2)', cursor: 'default'
          }}>▶</div>

          {/* 3. Top Black Header (always shown) */}
          <div style={{
            backgroundColor: '#000000', padding: '12px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '20px', cursor: 'pointer' }}>≡</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '16px', cursor: 'pointer' }}>🔍</span>
              <span style={{ fontSize: '15px', cursor: 'pointer' }}>文A</span>
              <span style={{ fontSize: '16px', cursor: 'pointer' }}>🌙</span>
              <div style={{
                backgroundColor: '#ef4444', color: '#ffffff',
                padding: '4px 12px', borderRadius: '6px',
                fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
              }}>🖥 LIVE</div>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '14px', color: '#000' }}>👤</span>
              </div>
            </div>
          </div>

          {/* ── DYNAMIC SECTION RENDERING ── */}
          {/* When dummy config has been applied from the Admin Portal, render it.   */}
          {/* Otherwise, fall back to static placeholder sections.                   */}

          {loadState === 'loading' && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              Loading Dummy Layout…
            </div>
          )}

          {isLive && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px', paddingBottom: '20px' }}>
              {dummySections.map((section, idx) => (
                <LayoutSectionBlock key={section.id || idx} section={section} index={idx} />
              ))}

              {/* Last tested timestamp */}
              {lastFetchedAt && (
                <div style={{ padding: '4px 20px', textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    Dummy config fetched: {lastFetchedAt.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Static Fallback — shown when no dummy config exists yet or API is down */}
          {(loadState === 'fallback' || loadState === 'error') && (
            <>
              {/* Fallback notice */}
              <div style={{ padding: '8px 20px', backgroundColor: '#fef9c3', borderBottom: '1px solid #fde68a' }}>
                <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>
                  ℹ No dummy layout has been applied yet. Showing default placeholder preview.
                  Go to Admin Portal → Home Layout → "Go for Test in Dummy Panel" to apply a test layout.
                </span>
              </div>

              {/* 4. Horizontal Navigation Bar (static) */}
              <div style={{
                backgroundColor: '#000000', padding: '4px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                  <span style={{ color: '#334155', fontSize: '12px', fontWeight: 'bold' }}>‹</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                  {dummyNavItems.map(item => (
                    <span key={item.id} style={{ color: '#ffffff', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      {item.label}
                      {item.hasDropdown && <span style={{ fontSize: '10px', opacity: 0.8 }}>▾</span>}
                    </span>
                  ))}
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                  <span style={{ color: '#334155', fontSize: '12px', fontWeight: 'bold' }}>›</span>
                </div>
              </div>

              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 5. Hero Layout Area */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.1fr)', gap: '14px' }}>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', borderTop: '4px solid #3b82f6', padding: '24px 20px', height: '145px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                    <span style={{ backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '6px' }}>All</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700 }}>Hero Section</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between' }}>
                    <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '42px' }}></div>
                    <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '42px' }}></div>
                    <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '42px' }}></div>
                  </div>
                </div>

                {/* 6. Category Shortcut Row */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '32px', overflowX: 'auto' }}>
                  {dummyCategories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                      <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat.label}</span>
                    </div>
                  ))}
                </div>

                {/* 7. Latest News Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '14px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Latest News</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                    {dummyLatestNewsCards.map(card => (
                      <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '85px' }}></div>
                        <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 500 }}>{card.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. Lower Placeholder Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginTop: '4px' }}>
                  {dummyLowerGridCards.map(card => (
                    <div key={card.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #ec4899', borderRadius: '6px', height: '75px', background: 'linear-gradient(to bottom, #f1f5f9 0%, #ffffff 100%)' }}></div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div style={{ backgroundColor: '#0f172a', padding: '16px 24px', color: '#94a3b8', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>
            © KINGS 24×7 — Dummy Layout Preview · Not the live website
          </div>
        </div>
      </div>
    </div>
  );
};

export default DummyLayoutPage;
