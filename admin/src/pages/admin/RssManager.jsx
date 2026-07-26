import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rss, Plus, Edit2, Trash2, Save, X, Check, Globe, Folder, AlertTriangle } from 'lucide-react';

const RssManager = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    feedUrl: '',
    categoryId: '',
    language: 'ta',
    autoImageDownload: false,
    autoPublish: false
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/admin/rss-config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfigs(Array.isArray(response.data) ? response.data : (response.data?.content || response.data?.data || []));
    } catch (error) {
      console.error('Error fetching RSS configs:', error);
      showMsg('Failed to load RSS configurations', true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const showMsg = (text, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`/api/v1/admin/rss-config/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMsg('RSS Source updated successfully');
      } else {
        await axios.post('/api/v1/admin/rss-config', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMsg('RSS Source added successfully');
      }
      setFormData({ name: '', feedUrl: '', categoryId: '', language: 'ta', autoImageDownload: false, autoPublish: false });
      setEditingId(null);
      fetchConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      showMsg('Failed to save RSS configuration', true);
    }
  };

  const handleEdit = (config) => {
    setFormData({
      name: config.name || '',
      feedUrl: config.feedUrl || '',
      categoryId: config.categoryId || '',
      language: config.language || 'ta',
      autoImageDownload: !!config.autoImageDownload,
      autoPublish: !!config.autoPublish
    });
    setEditingId(config.id);
    showMsg('Loaded source details for editing');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/v1/admin/rss-config/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMsg('RSS Source deleted successfully');
        fetchConfigs();
      } catch (error) {
        console.error('Error deleting config:', error);
        showMsg('Failed to delete RSS source', true);
      }
    }
  };

  if (loading) {
    return <div className="animate-fade-in" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading RSS sources...</div>;
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'var(--body-bg)',
    color: 'var(--text-dark)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.15s'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: 1,
    minWidth: '220px'
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Rss size={24} color="var(--primary)" /> RSS Feed Manager
          </h1>
          <p className="text-secondary" style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Import and syndicate news feeds automatically from external platforms into designated subcategories.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
          padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
          background: toast.isError ? '#EF4444' : '#10B981', color: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          {toast.isError ? <AlertTriangle size={16} /> : <Check size={16} />}
          {toast.text}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1.75fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Input Form */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {editingId ? <Edit2 size={18} color="var(--primary)" /> : <Plus size={18} color="var(--primary)" />}
            {editingId ? 'Edit RSS Feed Source' : 'Add New RSS Source'}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Source Name */}
            <div>
              <label style={labelStyle}>Source Name</label>
              <input 
                type="text" 
                name="name" 
                style={inputStyle}
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="e.g. Daily News Tamil"
                required 
              />
            </div>

            {/* Feed URL */}
            <div>
              <label style={labelStyle}>Feed URL</label>
              <input 
                type="url" 
                name="feedUrl" 
                style={inputStyle}
                value={formData.feedUrl} 
                onChange={handleInputChange} 
                placeholder="https://example.com/rss.xml"
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              {/* Category ID */}
              <div>
                <label style={labelStyle}>Target Category ID</label>
                <input 
                  type="number" 
                  name="categoryId" 
                  style={inputStyle}
                  value={formData.categoryId} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 5"
                />
              </div>

              {/* Language */}
              <div>
                <label style={labelStyle}>Language</label>
                <select 
                  name="language" 
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formData.language} 
                  onChange={handleInputChange}
                >
                  <option value="ta" style={{ color: '#000', background: '#fff' }}>Tamil</option>
                  <option value="en" style={{ color: '#000', background: '#fff' }}>English</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
              <label style={checkboxContainerStyle}>
                <input 
                  type="checkbox" 
                  name="autoImageDownload" 
                  checked={formData.autoImageDownload} 
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Auto Download Images</span>
              </label>

              <label style={checkboxContainerStyle}>
                <input 
                  type="checkbox" 
                  name="autoPublish" 
                  checked={formData.autoPublish} 
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Auto Publish (No Drafts)</span>
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1.5, padding: '10px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Save size={15} />
                {editingId ? 'Update Source' : 'Add Source'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', feedUrl: '', categoryId: '', language: 'ta', autoImageDownload: false, autoPublish: false });
                  }}
                >
                  <X size={15} />
                  Cancel
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Right: Sources Table/List */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Rss size={18} color="var(--primary)" /> Configured RSS Feeds ({configs.length})
          </h3>

          {configs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
              <Rss size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No RSS feed sources configured</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>Add a source on the left to begin syncing.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Source Name</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Language</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Image / Publish</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map(config => (
                    <tr key={config.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}>
                      {/* Name & URL */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{config.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          {config.feedUrl}
                        </div>
                      </td>

                      {/* Language */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)',
                          fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)',
                          textTransform: 'uppercase'
                        }}>
                          <Globe size={11} color="var(--primary)" />
                          {config.language}
                        </span>
                        {config.categoryId && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                            <Folder size={10} /> Cat ID: {config.categoryId}
                          </div>
                        )}
                      </td>

                      {/* Toggles Status */}
                      <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: config.autoImageDownload ? '#10B981' : 'var(--text-muted)' }}>
                            {config.autoImageDownload ? '✓' : '✕'} Media download
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: config.autoPublish ? '#10B981' : 'var(--text-muted)' }}>
                            {config.autoPublish ? '✓' : '✕'} Auto publish
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleEdit(config)} 
                            style={{
                              background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                              padding: '6px', borderRadius: '4px', display: 'inline-flex', transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Edit Source"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(config.id)} 
                            style={{
                              background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer',
                              padding: '6px', borderRadius: '4px', display: 'inline-flex', transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Delete Source"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default RssManager;
