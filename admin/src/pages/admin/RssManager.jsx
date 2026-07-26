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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Rss size={24} color="var(--primary)" /> RSS Feed Manager
        </h1>
        <p className="text-secondary">Import and syndicate news feeds automatically from external platforms into designated subcategories.</p>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Input Form */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {editingId ? <Edit2 size={18} color="var(--primary)" /> : <Plus size={18} color="var(--primary)" />}
            {editingId ? 'Edit RSS Feed Source' : 'Add New RSS Source'}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="form-group">
              <label className="form-label">Source Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control"
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="e.g. Daily News Tamil"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Feed URL</label>
              <input 
                type="url" 
                name="feedUrl" 
                className="form-control"
                value={formData.feedUrl} 
                onChange={handleInputChange} 
                placeholder="https://example.com/rss.xml"
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Category ID</label>
                <input 
                  type="number" 
                  name="categoryId" 
                  className="form-control"
                  value={formData.categoryId} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select 
                  name="language" 
                  className="form-control"
                  value={formData.language} 
                  onChange={handleInputChange}
                >
                  <option value="ta">Tamil</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                <input 
                  type="checkbox" 
                  name="autoImageDownload" 
                  checked={formData.autoImageDownload} 
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Auto Download Images</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', flex: 1 }}>
                <input 
                  type="checkbox" 
                  name="autoPublish" 
                  checked={formData.autoPublish} 
                  onChange={handleInputChange}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Auto Publish</span>
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1.5, display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                <Save size={16} />
                {editingId ? 'Update Source' : 'Add Source'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.4rem' }} onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', feedUrl: '', categoryId: '', language: 'ta', autoImageDownload: false, autoPublish: false });
                }}>
                  <X size={16} /> Cancel
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Right: Sources Table/List */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Source Name</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Language</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Settings</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map(config => (
                    <tr key={config.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{config.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          {config.feedUrl}
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)' }}>
                          <Globe size={11} color="var(--primary)" /> {config.language.toUpperCase()}
                        </span>
                        {config.categoryId && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                            <Folder size={12} /> ID: {config.categoryId}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: config.autoImageDownload ? '#10B981' : 'var(--text-muted)' }}>
                            {config.autoImageDownload ? '✓' : '✕'} Media
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: config.autoPublish ? '#10B981' : 'var(--text-muted)' }}>
                            {config.autoPublish ? '✓' : '✕'} Publish
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button className="btn-icon" onClick={() => handleEdit(config)} title="Edit Source"><Edit2 size={16} /></button>
                          <button className="btn-icon" onClick={() => handleDelete(config.id)} title="Delete Source" style={{ color: '#EF4444' }}><Trash2 size={16} /></button>
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
