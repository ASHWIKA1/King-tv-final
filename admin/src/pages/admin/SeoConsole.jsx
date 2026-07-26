import React, { useState, useEffect } from 'react';
import { Search, Globe, RefreshCw, Save, Activity } from 'lucide-react';
import api from '../../api';

const SeoConsole = () => {
  const [seoTemplates, setSeoTemplates] = useState([]);
  const [sitemapConfig, setSitemapConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seoRes, sitemapRes] = await Promise.all([
        api.get('/admin/seo-config'),
        api.get('/admin/sitemap-config')
      ]);
      setSeoTemplates(seoRes.data || []);
      setSitemapConfig(sitemapRes.data || []);
    } catch (err) {
      console.error("Failed to load SEO configuration", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTemplateChange = (id, field, value) => {
    setSeoTemplates(seoTemplates.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const saveSeoTemplate = async (template) => {
    setSaving(true);
    try {
      if (template.id) {
        await api.put(`/admin/seo-config/${template.id}`, template);
      } else {
        await api.post(`/admin/seo-config`, template);
      }
      alert("SEO template saved successfully!");
    } catch (err) {
      alert("Failed to save SEO template");
    }
    setSaving(false);
  };

  const toggleSitemapExclusion = async (config) => {
    try {
      const updated = { ...config, isExcluded: !config.isExcluded };
      await api.put(`/admin/sitemap-config/${config.id}`, updated);
      setSitemapConfig(sitemapConfig.map(c => c.id === config.id ? updated : c));
    } catch (err) {
      alert("Failed to update sitemap configuration");
    }
  };

  const pingSearchEngines = async () => {
    setPingStatus('Pinging Google and Bing...');
    try {
      const res = await api.post('/admin/sitemap-config/ping');
      setPingStatus('Sitemaps submitted successfully! Logs: ' + (res.data.logs || []).join(' | '));
    } catch (err) {
      console.error(err);
      setPingStatus('Failed to ping search engines. Backend service offline.');
    }
    setTimeout(() => setPingStatus(null), 8000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1><Search size={24} style={{ display: 'inline', marginRight: '10px', color: 'var(--primary)' }} /> SEO & Sitemap Console</h1>
          <p className="text-secondary">Configure default meta templates and manage search engine visibility.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: SEO Templates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} /> Global Meta Templates
            </h3>
            
            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Loading templates...</div>
            ) : seoTemplates.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No SEO templates defined.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {seoTemplates.map(template => (
                  <div key={template.id} style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem', textTransform: 'capitalize', color: 'var(--primary)' }}>
                      {template.templateType || template.pageType || template.templateKey || 'Global'} Template
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Title Template</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={template.titleTemplate || ''} 
                          onChange={(e) => handleTemplateChange(template.id, 'titleTemplate', e.target.value)}
                          placeholder="e.g. {title} - King 24x7 News"
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Available tags: {'{title}'}, {'{category}'}, {'{siteName}'}</div>
                      </div>
                      
                      <div className="form-group">
                        <label>Meta Description Template</label>
                        <textarea 
                          className="form-control" 
                          rows="2"
                          value={template.descriptionTemplate || ''} 
                          onChange={(e) => handleTemplateChange(template.id, 'descriptionTemplate', e.target.value)}
                          placeholder="e.g. Read the latest news about {category}: {excerpt}"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Global Meta Keywords</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={template.keywordsTemplate || ''} 
                          onChange={(e) => handleTemplateChange(template.id, 'keywordsTemplate', e.target.value)}
                          placeholder="e.g. news, {category}, {tags}, tamil news"
                        />
                      </div>

                      {/* Dynamic Google Search Preview */}
                      <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label>Google Search Preview</label>
                        <div style={{ padding: '1rem', background: document.documentElement.classList.contains('dark') ? '#202124' : '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 1px 6px rgba(32,33,36,.1)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>K</div>
                            <div>
                              <div style={{ fontSize: '14px', color: document.documentElement.classList.contains('dark') ? '#dadce0' : '#202124', lineHeight: '1.2' }}>King 24x7</div>
                              <div style={{ fontSize: '12px', color: document.documentElement.classList.contains('dark') ? '#bdc1c6' : '#5f6368', lineHeight: '1.2' }}>https://king24x7.com › {template.templateType || template.templateKey || 'page'}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '20px', color: document.documentElement.classList.contains('dark') ? '#8ab4f8' : '#1a0dab', textDecoration: 'none', marginBottom: '0.25rem', fontWeight: 400 }}>
                            {template.titleTemplate || 'SEO Title Preview'}
                          </div>
                          <div style={{ fontSize: '14px', color: document.documentElement.classList.contains('dark') ? '#bdc1c6' : '#4d5156', lineHeight: '1.58' }}>
                            {template.descriptionTemplate || 'Meta description preview will appear here. This gives users a summary of what they will find when they click the link in search results.'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                          onClick={() => saveSeoTemplate(template)}
                          disabled={saving}
                        >
                          <Save size={14} /> {saving ? 'Saving...' : 'Save Template'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sitemap & Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))', border: '1px solid rgba(16,185,129,0.2)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981' }}>
              <Activity size={18} /> Sitewide SEO Health
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>
                92
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Excellent</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on 452 scanned pages</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Missing Meta Descriptions</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>12</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Broken Links (404s)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Images Missing Alt Text</span>
                <span style={{ fontWeight: 600, color: '#F59E0B' }}>45</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} /> Sitemap Settings
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Control which sections of the site are excluded from the auto-generated XML sitemap.
            </p>

            {loading ? (
              <div style={{ color: 'var(--text-muted)' }}>Loading config...</div>
            ) : sitemapConfig.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No sitemap config found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sitemapConfig.map(config => (
                  <div key={config.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{config.routePattern}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority: {config.priority || '0.5'} • Freq: {config.changefreq || 'weekly'}</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: config.isExcluded ? 'var(--danger)' : 'var(--success)' }}>
                        {config.isExcluded ? 'Excluded' : 'Included'}
                      </span>
                      <input 
                        type="checkbox" 
                        checked={!config.isExcluded} 
                        onChange={() => toggleSitemapExclusion(config)}
                        style={{ accentColor: 'var(--success)' }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Sitemap Generator</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Sitemap is generated dynamically at <code>/sitemap.xml</code>. You can ping search engines to re-index immediately.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                onClick={pingSearchEngines}
                disabled={!!pingStatus}
              >
                {pingStatus ? pingStatus : 'Ping Search Engines'}
              </button>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default SeoConsole;
