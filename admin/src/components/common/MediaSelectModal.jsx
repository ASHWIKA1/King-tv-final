import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, X, Loader2, Image as ImageIcon, Film, FileText, Music, Check, FolderOpen
} from 'lucide-react';
import api from '../../api';

const getFileCategory = (fileType = '', fileName = '') => {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.startsWith('video/')) return 'video';
  if (fileType.startsWith('audio/')) return 'audio';
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','csv'].includes(ext)) return 'document';
  return 'other';
};

const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getServerBase = () =>
  (api.defaults.baseURL || 'http://localhost:8080/api/v1')
    .replace(/\/api\/v1\/?$/, '')
    .replace(/\/api\/?$/, '');

const getPreviewUrl = (url) => {
  if (!url) return '';
  let finalUrl = url;
  if (typeof finalUrl === 'string' && finalUrl.includes('kings-tv.onrender.com')) {
    const path = finalUrl.replace(/^https?:\/\/kings-tv\.onrender\.com/, '');
    const cleanPath = path.startsWith('/api/v1') ? path.substring(7) : path;
    const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/api\/?$/, '');
    finalUrl = serverBase + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);
  }
  if (finalUrl.startsWith('http') || finalUrl.startsWith('data:')) return finalUrl;
  return getServerBase() + (finalUrl.startsWith('/') ? finalUrl : '/' + finalUrl);
};

const MediaSelectModal = ({ isOpen, onClose, onSelect }) => {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const loadMedia = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/media/list');
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setAllMedia(list.map(m => ({
        id: m.id || m.url,
        name: m.name || m.fileName || 'Unnamed File',
        url: m.url,
        category: m.category || getFileCategory(m.fileType, m.name),
        size: m.size || m.fileSize,
        uploadedAt: m.uploadedAt || m.createdAt
      })));
    } catch (err) {
      console.error('Failed to load media list', err);
      setError('Could not fetch media files from the server.');
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    loadMedia();
    if (!isOpen) {
      setSelectedItems(new Set());
      setSearchQuery('');
      setFilterCategory('all');
    }
  }, [isOpen, loadMedia]);

  if (!isOpen) return null;

  const toggleSelect = (item) => {
    const next = new Set(selectedItems);
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
    }
    setSelectedItems(next);
  };

  const handleInsert = () => {
    const selectedList = allMedia.filter(m => selectedItems.has(m.id));
    if (selectedList.length > 0) {
      onSelect(selectedList);
    }
    onClose();
  };

  const filteredMedia = allMedia.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'var(--bg-surface, #ffffff)',
        color: 'var(--text-primary, #0f172a)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '850px',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        border: '1px solid var(--border-color, #cbd5e1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid var(--border-color, #cbd5e1)',
          background: 'var(--bg-secondary, #f8fafc)'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderOpen size={20} color="#2563EB" /> Select Media from Library
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary, #64748b)',
            padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s'
          }} onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px 24px',
          borderBottom: '1px solid var(--border-color, #cbd5e1)',
          alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface, #ffffff)'
        }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'image', 'video', 'audio', 'document'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color, #cbd5e1)',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  background: filterCategory === cat ? '#2563EB' : 'var(--bg-secondary, #f8fafc)',
                  color: filterCategory === cat ? '#ffffff' : 'var(--text-primary, #0f172a)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '260px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 32px', borderRadius: '6px',
                border: '1px solid var(--border-color, #cbd5e1)', fontSize: '13px',
                background: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-primary, #0f172a)'
              }}
            />
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-surface, #ffffff)' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
              <Loader2 size={36} className="spin" color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: 'var(--text-secondary, #64748b)', fontSize: '14px' }}>Loading media files...</span>
            </div>
          ) : error ? (
            <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px', fontSize: '14px' }}>{error}</div>
          ) : filteredMedia.length === 0 ? (
            <div style={{ color: 'var(--text-secondary, #64748b)', textAlign: 'center', padding: '40px', fontSize: '14px' }}>
              No media files found matching the criteria.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '16px'
            }}>
              {filteredMedia.map((item) => {
                const isSelected = selectedItems.has(item.id);
                const isImage = item.category === 'image';
                const isVideo = item.category === 'video';
                const isAudio = item.category === 'audio';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item)}
                    style={{
                      border: `2px solid ${isSelected ? '#2563EB' : 'var(--border-color, #e2e8f0)'}`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      background: 'var(--bg-card, #ffffff)',
                      boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Selection Indicator */}
                    <div style={{
                      position: 'absolute', top: '6px', left: '6px', zIndex: 10,
                      width: '18px', height: '18px', borderRadius: '4px',
                      background: isSelected ? '#2563EB' : 'rgba(0,0,0,0.3)',
                      border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                    </div>

                    {/* Preview Image/Icon */}
                    <div style={{
                      height: '95px', background: 'var(--bg-secondary, #f8fafc)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', position: 'relative'
                    }}>
                      {isImage ? (
                        <img
                          src={getPreviewUrl(item.url)}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      ) : isVideo ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Film size={28} color="#f59e0b" />
                          <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', padding: '1px 3px', borderRadius: '2px' }}>VIDEO</span>
                        </div>
                      ) : isAudio ? (
                        <Music size={28} color="#8b5cf6" />
                      ) : (
                        <FileText size={28} color="#64748b" />
                      )}
                    </div>

                    {/* Meta */}
                    <div style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '4px' }}>
                      <div style={{
                        fontSize: '11px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', color: 'var(--text-primary, #0f172a)'
                      }} title={item.name}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-secondary, #64748b)' }}>
                        {formatBytes(item.size)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border-color, #cbd5e1)',
          background: 'var(--bg-secondary, #f8fafc)', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary, #64748b)' }}>
            {selectedItems.size} item(s) selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-color, #cbd5e1)',
                background: '#ffffff', color: 'var(--text-primary, #0f172a)', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedItems.size === 0}
              onClick={handleInsert}
              style={{
                padding: '8px 16px', borderRadius: '6px', border: 'none',
                background: selectedItems.size === 0 ? '#94a3b8' : '#2563EB',
                color: '#ffffff', fontSize: '13px', fontWeight: 600,
                cursor: selectedItems.size === 0 ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Insert Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSelectModal;
