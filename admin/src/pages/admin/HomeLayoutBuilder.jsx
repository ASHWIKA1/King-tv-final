import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api';
import { 
  Save, CheckCircle, Plus, Trash2, Edit2, Eye, EyeOff, Layout, 
  Settings, ArrowUp, ArrowDown, Info, HelpCircle, X, Sliders, PlayCircle
} from 'lucide-react';

const PREDEFINED_SECTIONS = [
  { key: 'news_ticker',      label: 'Breaking News Ticker',       desc: 'Top marquee ticker showing latest active breaking news alerts.' },
  { key: 'hero',             label: 'Hero Grid Section',          desc: 'Main banner card stacked next to three secondary content cards.' },
  { key: 'quick_access',     label: 'Quick Access Bar',           desc: 'Horizontal list of category icons for quick mobile/web navigation.' },
  { key: 'latest_news',      label: 'Latest News Grid',           desc: 'Responsive grid rendering the newest published general articles.' },
  { key: 'video_news',       label: 'Video News Player',          desc: 'Multi-category video news carousel with integrated popup video player.' },
  { key: 'web_stories',      label: 'Web Stories Block',          desc: 'Horizontal visual card deck with interactive mobile web stories.' },
  { key: 'trending_sidebar', label: 'Trending News Sidebar',      desc: 'Right sidebar list of highest viewed articles on the site.' },
  { key: 'weather',          label: 'Weather Information Widget', desc: 'Displays current local temperature and condition for the visitor.' },
  { key: 'business_case',    label: 'Business Case Studies',      desc: 'Special case studies banner promoting registered businesses.' },
  { key: 'crowd_reporter',   label: 'Citizen Crowd Reporter box', desc: 'Prominent box inviting users to submit ground news reports.' },
  { key: 'news_digest',      label: 'News Digest Summary',        desc: 'Curated editorial summaries or newsletter signup widget.' }
];

const HomeLayoutBuilder = () => {
  const [layout, setLayout] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Create state
  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  
  // Modal Edit state
  const [editSection, setEditSection] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editConfigJson, setEditConfigJson] = useState('');

  const fetchLayout = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/layout/web');
      let data = res.data || [];
      data.sort((a, b) => a.displayOrder - b.displayOrder);
      setLayout(data);
    } catch (error) {
      console.error("Failed to load layout", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/taxonomy/categories');
      setCategories(res.data || []);
    } catch {
      api.get('/categories').then(r => setCategories(r.data || [])).catch(() => {});
    }
  };

  useEffect(() => {
    fetchLayout();
    fetchCategories();
  }, []);

  const handleToggle = async (index) => {
    const newLayout = [...layout];
    newLayout[index].isVisible = !newLayout[index].isVisible;
    setLayout(newLayout);
    
    try {
      await api.put(`/admin/layout/${newLayout[index].id}`, {
        isVisible: newLayout[index].isVisible
      });
    } catch (err) {
      console.error("Failed to update section visibility", err);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newLabel || !newKey) return;
    
    setSaving(true);
    const key = newKey.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
    const displayOrder = layout.length > 0 ? Math.max(...layout.map(o => o.displayOrder)) + 1 : 1;
    
    try {
      const res = await api.post('/admin/layout', {
        sectionKey: key,
        sectionLabel: newLabel,
        displayOrder,
        isVisible: true,
        layoutType: 'WEB',
        configJson: '{}'
      });
      setLayout([...layout, res.data]);
      setNewLabel('');
      setNewKey('');
    } catch (err) {
      console.error("Failed to add section", err);
      alert("Error: Key already exists or invalid data.");
    }
    setSaving(false);
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to remove this homepage section?")) return;
    try {
      await api.delete(`/admin/layout/${id}`);
      setLayout(layout.filter(item => item.id !== id));
      if (editSection && editSection.id === id) setEditSection(null);
    } catch (err) {
      console.error("Failed to delete section", err);
    }
  };

  const openEditModal = (section) => {
    setEditSection(section);
    setEditLabel(section.sectionLabel);
    setEditConfigJson(section.configJson || '{}');
  };

  const handleSaveEdit = async () => {
    if (!editSection) return;
    setSaving(true);
    try {
      const res = await api.put(`/admin/layout/${editSection.id}`, {
        sectionLabel: editLabel,
        configJson: editConfigJson
      });
      setLayout(layout.map(item => item.id === editSection.id ? res.data : item));
      setEditSection(null);
    } catch (err) {
      console.error("Failed to save changes", err);
      alert("Invalid JSON format or server error.");
    }
    setSaving(false);
  };

  const moveItem = async (index, direction) => {
    const nextLayout = [...layout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextLayout.length) return;

    // Swap
    const temp = nextLayout[index];
    nextLayout[index] = nextLayout[targetIndex];
    nextLayout[targetIndex] = temp;

    // Re-assign order
    const updated = nextLayout.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));
    setLayout(updated);

    try {
      await api.put('/admin/layout/reorder', updated.map(item => ({
        id: item.id,
        displayOrder: item.displayOrder
      })));
    } catch (err) {
      console.error("Failed to save layout order", err);
    }
  };

  // Group sections by visual columns
  const globalSections = layout.filter(s => !['latest_news', 'video_news', 'web_stories', 'trending_sidebar', 'weather', 'business_case', 'crowd_reporter'].includes(s.sectionKey));
  const mainColSections = layout.filter(s => ['latest_news', 'video_news', 'web_stories'].includes(s.sectionKey));
  const sidebarSections = layout.filter(s => ['trending_sidebar', 'weather', 'business_case', 'crowd_reporter'].includes(s.sectionKey));

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
      
      {/* Left Main Dashboard */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1>Home Page Layout Builder</h1>
            <p className="text-secondary">Rearrange web page sections, toggle visibility, and customize content feeds dynamically.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={15} /> Real-time sync enabled
          </div>
        </div>

        {/* Layout Visualizer Mockup */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Layout size={20} color="var(--primary)" /> Live Page Structure Mockup
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#090d16', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            
            {/* Top / Header Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>Header &amp; Global Banner Sections</div>
              {globalSections.map(s => {
                const layoutIdx = layout.findIndex(item => item.id === s.id);
                return (
                  <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: s.isVisible ? 'rgba(179,115,42,0.1)' : '#111827', padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${s.isVisible ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`, opacity: s.isVisible ? 1 : 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Global</span>
                      <strong style={{ fontSize: '0.85rem' }}>{s.sectionLabel}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn-icon" disabled={layoutIdx === 0} onClick={() => moveItem(layoutIdx, 'up')} style={{ padding: '2px' }}><ArrowUp size={14} /></button>
                      <button className="btn-icon" disabled={layoutIdx === layout.length - 1} onClick={() => moveItem(layoutIdx, 'down')} style={{ padding: '2px' }}><ArrowDown size={14} /></button>
                      <button className="btn-icon" onClick={() => handleToggle(layoutIdx)} style={{ padding: '2px', color: s.isVisible ? '#10B981' : 'var(--text-muted)' }}>{s.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                      <button className="btn-icon" onClick={() => openEditModal(s)} style={{ padding: '2px', color: 'var(--primary)' }}><Edit2 size={14} /></button>
                      <button className="btn-icon" onClick={() => handleDeleteSection(s.id)} style={{ padding: '2px', color: '#EF4444' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Split Column View */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>Left Main Content Column</div>
                {mainColSections.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center', background: '#111827', borderRadius: '8px' }}>Empty</div>
                ) : mainColSections.map(s => {
                  const layoutIdx = layout.findIndex(item => item.id === s.id);
                  return (
                    <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: s.isVisible ? 'rgba(59,130,246,0.1)' : '#111827', padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${s.isVisible ? '#3B82F6' : 'rgba(255,255,255,0.05)'}`, opacity: s.isVisible ? 1 : 0.6 }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.sectionLabel}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Key: <code>{s.sectionKey}</code></div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn-icon" disabled={layoutIdx === 0} onClick={() => moveItem(layoutIdx, 'up')} style={{ padding: '2px' }}><ArrowUp size={14} /></button>
                        <button className="btn-icon" disabled={layoutIdx === layout.length - 1} onClick={() => moveItem(layoutIdx, 'down')} style={{ padding: '2px' }}><ArrowDown size={14} /></button>
                        <button className="btn-icon" onClick={() => handleToggle(layoutIdx)} style={{ padding: '2px', color: s.isVisible ? '#10B981' : 'var(--text-muted)' }}>{s.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                        <button className="btn-icon" onClick={() => openEditModal(s)} style={{ padding: '2px', color: 'var(--primary)' }}><Edit2 size={14} /></button>
                        <button className="btn-icon" onClick={() => handleDeleteSection(s.id)} style={{ padding: '2px', color: '#EF4444' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>Right Sidebar Widget Column</div>
                {sidebarSections.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center', background: '#111827', borderRadius: '8px' }}>Empty</div>
                ) : sidebarSections.map(s => {
                  const layoutIdx = layout.findIndex(item => item.id === s.id);
                  return (
                    <div key={s.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: s.isVisible ? 'rgba(16,185,129,0.1)' : '#111827', padding: '0.75rem', borderRadius: '8px', border: `1px solid ${s.isVisible ? '#10B981' : 'rgba(255,255,255,0.05)'}`, opacity: s.isVisible ? 1 : 0.6 }}>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.sectionLabel}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}><code>{s.sectionKey}</code></div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                        <button className="btn-icon" disabled={layoutIdx === 0} onClick={() => moveItem(layoutIdx, 'up')} style={{ padding: '2px' }}><ArrowUp size={12} /></button>
                        <button className="btn-icon" disabled={layoutIdx === layout.length - 1} onClick={() => moveItem(layoutIdx, 'down')} style={{ padding: '2px' }}><ArrowDown size={12} /></button>
                        <button className="btn-icon" onClick={() => handleToggle(layoutIdx)} style={{ padding: '2px', color: s.isVisible ? '#10B981' : 'var(--text-muted)' }}>{s.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                        <button className="btn-icon" onClick={() => openEditModal(s)} style={{ padding: '2px', color: 'var(--primary)' }}><Edit2 size={12} /></button>
                        <button className="btn-icon" onClick={() => handleDeleteSection(s.id)} style={{ padding: '2px', color: '#EF4444' }}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* Guidelines panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Info size={24} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Important Technical Rule</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              The public web portal integrates layout sections using HTML classes mapped to specific <strong>Section Keys</strong>. If you add a custom section, ensure its key corresponds to a matching element selector in <code>index.html</code> (e.g. <code>news_ticker</code> for the ticker, or <code>hero</code> for the slider).
            </p>
          </div>
        </div>

      </div>

      {/* Right Column Panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Add Section */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={18} color="var(--primary)" /> Add New Section
          </h3>
          <form onSubmit={handleAddSection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Template / Predefined Key</label>
              <select 
                className="form-control"
                onChange={e => {
                  const key = e.target.value;
                  const item = PREDEFINED_SECTIONS.find(p => p.key === key);
                  if (item) {
                    setNewKey(item.key);
                    setNewLabel(item.label);
                  } else {
                    setNewKey('');
                    setNewLabel('');
                  }
                }}
              >
                <option value="">— Custom Section —</option>
                {PREDEFINED_SECTIONS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input 
                type="text" 
                className="form-control" 
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="e.g. My Custom Section"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unique Selector Key</label>
              <input 
                type="text" 
                className="form-control" 
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                placeholder="e.g. custom_news_block"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={saving}>
              <Plus size={15} /> Add to Home Screen
            </button>
          </form>
        </div>

        {/* Predefined section keys list */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <HelpCircle size={15} /> Predefined Keys Reference
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {PREDEFINED_SECTIONS.map(s => (
              <div key={s.key} style={{ fontSize: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>{s.key}</strong>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Large Custom Popup dialogue modal box rendered via Portal */}
      {editSection && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '650px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--primary)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Sliders size={20} color="var(--primary)" /> Configure: {editSection.sectionLabel}
              </h3>
              <button className="btn-toggle" style={{ padding: '0.35rem' }} onClick={() => setEditSection(null)}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label className="form-label">Display Title / Label</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  placeholder="Title shown on the homepage..."
                />
              </div>

              {/* Structured Configuration Form */}
              {(() => {
                let parsedConfig = {};
                try { parsedConfig = JSON.parse(editConfigJson); } catch(e){}
                
                const updateConfig = (key, value) => {
                  parsedConfig[key] = value;
                  setEditConfigJson(JSON.stringify(parsedConfig, null, 2));
                };

                return (
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feed &amp; View Settings</div>
                    
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Display style / Template type</label>
                      <select className="form-control" value={parsedConfig.type || ''} onChange={e => updateConfig('type', e.target.value)}>
                        <option value="">Default theme layout</option>
                        <option value="hero_slider">Hero stack grid</option>
                        <option value="grid">Multi-column news grid</option>
                        <option value="carousel">Horizontal swipe carousel</option>
                        <option value="list">Compact news list</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Limit items count</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={parsedConfig.limit || ''} 
                          onChange={e => updateConfig('limit', parseInt(e.target.value) || 0)} 
                          placeholder="e.g. 6" 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>News Category Filter</label>
                        <select className="form-control" value={parsedConfig.categoryId || ''} onChange={e => updateConfig('categoryId', e.target.value)}>
                          <option value="">All Categories (Latest News)</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.nameTa || 'Tamil'})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="form-group">
                <label className="form-label">Advanced Parameters (Raw config JSON)</label>
                <textarea 
                  className="form-control"
                  style={{ height: '120px', fontFamily: 'monospace', fontSize: '0.8rem', background: '#0b0f19', color: '#10B981', border: '1px solid var(--border-color)', padding: '0.75rem' }}
                  value={editConfigJson}
                  onChange={e => setEditConfigJson(e.target.value)}
                  placeholder="{}"
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Ensure the custom configuration is valid JSON format.</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button onClick={() => setEditSection(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleSaveEdit} className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  <Save size={16} /> Save Changes
                </button>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default HomeLayoutBuilder;
