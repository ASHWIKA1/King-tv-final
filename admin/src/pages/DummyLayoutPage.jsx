/**
 * TEST-ONLY DUMMY LAYOUT INTEGRATION — safe to remove after layout testing.
 *
 * Reads the dummy layout from localStorage (key: dummy_layout_config),
 * which is written by HomeLayoutBuilder when "Apply to Dummy" is confirmed.
 *
 * Since this page and HomeLayoutBuilder share the same origin (localhost:3000),
 * localStorage is shared — no backend required.
 *
 * REMOVAL: Delete this file + the /dummy-layout and /admin/dummy-layout routes
 *          from admin/src/App.jsx.
 */
import React, { useState, useEffect } from 'react';
import { getDummyLayout, getDummyMeta } from './dummyLayoutService';
import {
  dummyNavItems, dummyCategories, dummyLatestNewsCards, dummyLowerGridCards
} from './dummyLayoutData';

// Accent colours per section key
const ACCENT = {
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

const LABEL = {
  website_navigation: 'Navigation Bar',
  hero:               'Hero Section',
  quick_access:       'Quick Access',
  latest_news:        'Latest News',
  video_news:         'Video News',
  web_stories:        'Web Stories',
  trending_sidebar:   'Trending Sidebar',
  weather:            'Weather Widget',
  crowd_reporter:     'Crowd Reporter',
  business_case:      'Business Section',
  news_digest:        'News Digest',
  news_ticker:        'News Ticker',
  custom_builder:     'Custom Block',
};

const LayoutSectionBlock = ({ section, index }) => {
  let config = {};
  try { config = JSON.parse(section.configJson || '{}'); } catch {}

  const accent = ACCENT[section.sectionKey] || '#3b82f6';
  const label  = section.sectionLabel || LABEL[section.sectionKey] || section.sectionKey;

  if (section.sectionKey === 'website_navigation') {
    const navItemsToDisplay = (config && config.navItems && config.navItems.length > 0)
      ? config.navItems.filter(i => i.isActive !== false)
      : dummyNavItems;

    return (
      <div style={{ backgroundColor: config.background?.color || '#000', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flex: 1 }}>
          {navItemsToDisplay.map((item, idx) => (
            <span key={item.id || idx} style={{ color: (item.slug === 'regional' || item.linkUrl === '/directory') ? '#38bdf8' : '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {item.titleEn || item.label || item.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'hero') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.1fr)', gap: '12px', padding: '0 20px' }}>
        <div style={{ backgroundColor: config.background?.color || '#0f172a', borderRadius: '8px', borderTop: `4px solid ${accent}`, padding: '20px', height: '145px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
          <span style={{ backgroundColor: accent, color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '6px' }}>All</span>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[0,1,2].map(i => <div key={i} style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '42px' }}></div>)}
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'quick_access') {
    return (
      <div style={{ backgroundColor: config.background?.color || '#0f172a', borderRadius: '8px', margin: '0 20px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '28px', overflowX: 'auto' }}>
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
    const count = config.limit || dummyLatestNewsCards.length;
    return (
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '14px', backgroundColor: accent, borderRadius: '2px' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{label}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
          {dummyLatestNewsCards.slice(0, count).map(card => (
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
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Latest breaking news ticker — dummy layout test</span>
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

  // Generic fallback for any other section
  return (
    <div style={{ margin: '0 20px', backgroundColor: `${accent}0D`, border: `1px dashed ${accent}55`, borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '10px', height: '40px', backgroundColor: accent, borderRadius: '4px', flexShrink: 0 }}></div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{label}</div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>Section #{index + 1} · {section.isVisible ? 'Visible' : 'Hidden'}</div>
      </div>
    </div>
  );
};

const DummyLayoutPage = () => {
  const [sections, setSections] = useState([]);
  const [meta, setMeta]         = useState(null);
  const [hasData, setHasData]   = useState(false);

  useEffect(() => {
    const load = () => {
      const data = getDummyLayout();
      const m    = getDummyMeta();
      if (data && data.length > 0) {
        setSections(data.filter(s => s.isVisible !== false));
        setMeta(m);
        setHasData(true);
      } else {
        setHasData(false);
      }
    };
    load();
    // Also refresh if another tab or builder fires layout updates
    window.addEventListener('storage', load);
    window.addEventListener('layoutUpdated', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('layoutUpdated', load);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '1240px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>

        {/* Browser Top Bar */}
        <div style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: '60px' }}></div>
          <div style={{ backgroundColor: '#e2e8f0', padding: '4px 24px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
            kings24×7.com — Dummy Preview
          </div>
          <div style={{ width: '60px', display: 'flex', justifyContent: 'flex-end' }}>
            {hasData
              ? <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>● Live</span>
              : <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>⚡ Default</span>
            }
          </div>
        </div>

        {/* Canvas */}
        <div style={{ backgroundColor: '#ffffff', position: 'relative', paddingBottom: '20px' }}>

          {/* Side handle */}
          <div style={{ position: 'absolute', left: 0, top: '220px', width: '18px', height: '36px', backgroundColor: '#0284c7', borderTopRightRadius: '6px', borderBottomRightRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', zIndex: 20, boxShadow: '2px 0 6px rgba(0,0,0,0.2)' }}>▶</div>

          {/* Top Black Header (always shown) */}
          <div style={{ backgroundColor: '#000', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
            <span style={{ fontSize: '20px' }}>≡</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '16px' }}>🔍</span>
              <span style={{ fontSize: '15px' }}>文A</span>
              <span style={{ fontSize: '16px' }}>🌙</span>
              <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 10px rgba(239,68,68,0.4)' }}>🖥 LIVE</div>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '14px', color: '#000' }}>👤</span>
              </div>
            </div>
          </div>

          {/* ── LIVE DUMMY LAYOUT (from localStorage) ── */}
          {hasData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px', paddingBottom: '20px' }}>
              {sections.map((section, idx) => (
                <LayoutSectionBlock key={section.id || idx} section={section} index={idx} />
              ))}
              {meta?.savedAt && (
                <div style={{ padding: '4px 20px', textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    Last applied from Admin Portal: {new Date(meta.savedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Notice banner */}
              <div style={{ padding: '8px 20px', backgroundColor: '#fef9c3', borderBottom: '1px solid #fde68a' }}>
                <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>
                  ℹ No dummy layout has been applied yet. Go to Admin Portal → Home Layout → click "Go for Test in Dummy Panel" to send a test layout here.
                </span>
              </div>

              {/* Static placeholder nav */}
              <div style={{ backgroundColor: '#000', padding: '4px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#334155', fontSize: '12px', fontWeight: 'bold' }}>‹</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                  {dummyNavItems.map(item => (
                    <span key={item.id} style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                      {item.label}{item.hasDropdown && <span style={{ fontSize: '10px', opacity: 0.8 }}>▾</span>}
                    </span>
                  ))}
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#334155', fontSize: '12px', fontWeight: 'bold' }}>›</span>
                </div>
              </div>

              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Hero */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.1fr)', gap: '14px' }}>
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', borderTop: '4px solid #3b82f6', padding: '24px 20px', height: '145px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                    <span style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '6px' }}>All</span>
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>Hero Section</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[0,1,2].map(i => <div key={i} style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', height: '42px' }}></div>)}
                  </div>
                </div>

                {/* Category row */}
                <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '32px', overflowX: 'auto' }}>
                  {dummyCategories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                      <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Latest News */}
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

                {/* Lower grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                  {dummyLowerGridCards.map(card => (
                    <div key={card.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #ec4899', borderRadius: '6px', height: '75px', background: 'linear-gradient(to bottom, #f1f5f9 0%, #ffffff 100%)' }}></div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ backgroundColor: '#0f172a', padding: '16px 24px', color: '#94a3b8', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>
            © KINGS 24×7 — Dummy Layout Preview · Not the live website
          </div>
        </div>
      </div>
    </div>
  );
};

export default DummyLayoutPage;
