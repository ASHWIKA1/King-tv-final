import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image as ImageIcon, Film, FileText, Download, Copy, Trash2, Search, Filter,
  Grid, List, Upload, X, ChevronLeft, ChevronRight, Eye, Check, AlertTriangle, Link2, ChevronDown
} from 'lucide-react';
import api from '../../api';

// ── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;
const SIZE_LIMITS = { image: 10 * 1024 * 1024, video: 100 * 1024 * 1024, document: 20 * 1024 * 1024 };
const SIZE_LABELS = { image: '10 MB', video: '100 MB', document: '20 MB' };
const ACCEPT_MAP = {
  all: 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv',
  image: 'image/*',
  video: 'video/*',
  document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv',
};

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

// ── Category icons ──────────────────────────────────────────────────────────
const CategoryIcon = ({ category, size = 36 }) => {
  const props = { size, strokeWidth: 1.5 };
  if (category === 'image') return <ImageIcon {...props} color="#3B82F6" />;
  if (category === 'video') return <Film {...props} color="#F59E0B" />;
  if (category === 'audio') return <Film {...props} color="#8B5CF6" />;
  return <FileText {...props} color="#6B7280" />;
};

// ── Media Card (Grid) ───────────────────────────────────────────────────────
const MediaCard = ({ item, onCopy, onDelete, onPreview, selected, onSelect }) => {
  const isImage = item.category === 'image';
  const isVideo = item.category === 'video';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '10px',
        border: `1px solid ${selected ? 'var(--primary)' : 'var(--border-color)'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s',
        boxShadow: selected ? '0 0 0 2px var(--primary)' : '0 2px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
      }}
      onClick={() => onSelect(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection checkbox (optional, kept for functionality if needed) */}
      {selected && (
        <div
          style={{
            position: 'absolute', top: '8px', left: '8px', zIndex: 3,
            width: '20px', height: '20px', borderRadius: '4px',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { e.stopPropagation(); onSelect(item); }}
        >
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      )}

      {/* Preview area */}
      <div style={{ height: '160px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {isImage ? (
          <img
            src={getPreviewUrl(item.url)}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.fallback-icon')?.style?.setProperty('display', 'flex'); }}
          />
        ) : isVideo ? (
          <video
            src={getPreviewUrl(item.url)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
        ) : (
          <CategoryIcon category={item.category} size={48} />
        )}
        
        {/* Hover Overlay Actions */}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', zIndex: 2
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(item); }}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
            title="Preview"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCopy(item.url); }}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
            title="Copy URL"
          >
            <Link2 size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Meta (Name, Size, Date) */}
      <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'var(--bg-card)' }}>
        <div
          style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}
          title={item.name}
        >
          {item.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formatBytes(item.size)} - {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
        </div>
      </div>
    </div>
  );
};

// ── Media Row (List) ────────────────────────────────────────────────────────
const MediaRow = ({ item, onCopy, onDelete, onPreview, selected, onSelect }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
      background: selected ? 'rgba(var(--primary-rgb),0.06)' : 'var(--bg-card)',
      borderRadius: '8px', border: `1px solid ${selected ? 'var(--primary)' : 'var(--border-color)'}`,
      cursor: 'pointer', transition: 'all 0.1s',
    }}
    onClick={() => onSelect(item)}
  >
    <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {item.category === 'image' ? (
        <img src={getPreviewUrl(item.url)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <CategoryIcon category={item.category} size={22} />
      )}
    </div>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.category.toUpperCase()} · {formatBytes(item.size)} · {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : '—'}</div>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
      {(item.category === 'image' || item.category === 'video' || item.name?.toLowerCase().endsWith('.pdf')) ? (
        <button onClick={(e) => { e.stopPropagation(); onPreview(item); }} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Eye size={13} /> Preview
        </button>
      ) : (
        <a href={getPreviewUrl(item.url)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
          <Download size={13} /> Download
        </a>
      )}
      <button onClick={(e) => { e.stopPropagation(); onCopy(item.url); }} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <Copy size={13} /> Copy URL
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(item); }} style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center' }}>
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const MediaLibrary = () => {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(new Set());
  const [previewItem, setPreviewItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = useCallback((text, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch real media from backend (images/uploads listing)
  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      // Try to fetch from backend media listing endpoint
      const res = await api.get('/media/list');
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setAllMedia(list.map(m => ({
        id: m.id || m.url,
        name: m.filename || m.name || m.url?.split('/').pop() || 'unknown',
        url: m.url || m.path,
        size: m.size || m.fileSize,
        category: getFileCategory(m.mimeType || m.type || '', m.filename || m.name || ''),
        uploadedAt: m.uploadedAt || m.createdAt || null,
      })));
    } catch {
      // No media listing endpoint yet — start with empty list
      // Media will appear after uploads in this session
      setAllMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  // Derived filtered+searched+paginated list
  const filtered = allMedia
    .filter(m => filterCategory === 'all' || m.category === filterCategory)
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when filter/search changes
  useEffect(() => setPage(1), [filterCategory, search]);

  // ── Upload handler ──────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    const errors = [];
    const toUpload = [];

    Array.from(files).forEach(file => {
      const category = getFileCategory(file.type, file.name);
      const limit = SIZE_LIMITS[category] || SIZE_LIMITS.document;
      if (file.size > limit) {
        errors.push(`${file.name}: exceeds ${SIZE_LABELS[category] || '20 MB'} limit`);
      } else {
        toUpload.push(file);
      }
    });

    setUploadErrors(errors);
    if (toUpload.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const uploaded = [];

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await api.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.url) {
          uploaded.push({
            id: res.data.id || (Date.now() + i),
            name: res.data.filename || file.name,
            url: res.data.url,
            size: res.data.fileSize || file.size,
            category: res.data.category || getFileCategory(file.type, file.name),
            uploadedAt: res.data.uploadedAt || new Date().toISOString(),
          });
        }
      } catch (err) {
        errors.push(`${file.name}: upload failed — ${err.response?.data?.message || err.message}`);
      }

      setUploadProgress(Math.round(((i + 1) / toUpload.length) * 100));
    }

    setAllMedia(prev => [...uploaded, ...prev]);
    setUploading(false);
    setUploadProgress(0);
    if (uploaded.length > 0) showToast(`✅ ${uploaded.length} file(s) uploaded successfully`);
    if (errors.length > 0) setUploadErrors(errors);
  }, [showToast]);

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const copyUrl = (url) => {
    navigator.clipboard.writeText(getPreviewUrl(url));
    showToast('URL copied to clipboard!');
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/media/${item.id}`).catch(() => {}); // best-effort backend delete
    } finally {
      setAllMedia(prev => prev.filter(m => m.id !== item.id));
      setSelected(prev => { const s = new Set(prev); s.delete(item.id); return s; });
      showToast('File removed from library');
    }
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} selected file(s)?`)) return;
    for (const id of selected) {
      await api.delete(`/media/${id}`).catch(() => {});
    }
    setAllMedia(prev => prev.filter(m => !selected.has(m.id)));
    setSelected(new Set());
    showToast(`Deleted ${selected.size} file(s)`);
  };

  const toggleSelect = (item) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(item.id)) s.delete(item.id);
      else s.add(item.id);
      return s;
    });
  };

  const categoryCounts = { all: allMedia.length };
  ['image', 'video', 'audio', 'document'].forEach(cat => {
    categoryCounts[cat] = allMedia.filter(m => m.category === cat).length;
  });

  return (
    <div
      className="animate-fade-in"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Header (Optional actions if selected) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem', minHeight: '32px' }}>
        {selected.size > 0 && (
          <button onClick={deleteSelected} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            <Trash2 size={14} /> Delete ({selected.size})
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem',
          background: toast.isError ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          color: toast.isError ? '#EF4444' : '#10B981',
          border: `1px solid ${toast.isError ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {toast.text}
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}><X size={14} /></button>
        </div>
      )}

      {/* Upload errors */}
      {uploadErrors.length > 0 && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={15} /> Upload Errors</span>
            <button onClick={() => setUploadErrors([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><X size={14} /></button>
          </div>
          {uploadErrors.map((e, i) => <div key={i} style={{ fontSize: '0.8rem' }}>• {e}</div>)}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>Uploading...</span><span>{uploadProgress}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--primary)', width: `${uploadProgress}%`, transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      {/* Static Upload Area (Always visible) */}
      <div 
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: '12px',
          padding: '2.5rem',
          textAlign: 'center',
          background: isDragging ? 'rgba(var(--primary-rgb),0.05)' : 'transparent',
          marginBottom: '1.5rem',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); e.currentTarget.style.borderColor = 'var(--primary)'; }}
        onDragLeave={(e) => { setIsDragging(false); e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          e.currentTarget.style.borderColor = 'var(--border-color)';
          uploadFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Drop files here to upload</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Supports JPG, PNG, WebP, GIF, SVG, PDF - Max 10MB per file
        </p>
        <input
          id="media-lib-upload-static"
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT_MAP[filterCategory] || ACCEPT_MAP.all}
          style={{ display: 'none' }}
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search media files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', borderRadius: '8px',
                border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.85rem', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box'
              }}
            />
          </div>
          {/* Filters */}
          <div style={{ position: 'relative' }}>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: '0.65rem 2.5rem 0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.85rem', outline: 'none', appearance: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select 
              style={{ padding: '0.65rem 2.5rem 0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', fontSize: '0.85rem', outline: 'none', appearance: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <option value="all">All Folders</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* View Toggle and Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button onClick={() => setViewMode('grid')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <List size={18} />
            </button>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {filtered.length} files
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
          <div>Loading media library...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="glass-panel"
          style={{ padding: '4rem', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        >
          <Upload size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {search ? 'No files match your search' : 'No media uploaded yet'}
          </div>
          <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {search ? 'Try a different search term or clear the filter.' : 'Drag & drop files here, or click "Upload Files" to get started.'}
          </div>
          {!search && (
            <label htmlFor="media-lib-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'var(--primary)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              <Upload size={16} /> Upload Files
            </label>
          )}
        </div>
      ) : (
        <>
          {/* Results info */}
          {selected.size > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{selected.size} selected</span>
            </div>
          )}

          {/* Grid or List */}
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {pageItems.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onCopy={copyUrl}
                  onDelete={deleteItem}
                  onPreview={setPreviewItem}
                  selected={selected.has(item.id)}
                  onSelect={toggleSelect}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {pageItems.map(item => (
                <MediaRow
                  key={item.id}
                  item={item}
                  onCopy={copyUrl}
                  onDelete={deleteItem}
                  onPreview={setPreviewItem}
                  selected={selected.has(item.id)}
                  onSelect={toggleSelect}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: 'var(--text-primary)', opacity: currentPage === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) => p === '...' ? (
                  <span key={`ellipsis-${idx}`} style={{ padding: '6px 8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)',
                      background: currentPage === p ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: currentPage === p ? '#fff' : 'var(--text-primary)',
                      cursor: 'pointer', fontWeight: currentPage === p ? 700 : 400, fontSize: '0.85rem',
                    }}
                  >{p}</button>
                ))
              }

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: 'var(--text-primary)', opacity: currentPage === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight size={16} />
              </button>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                Page {currentPage} of {totalPages} · {filtered.length} total
              </span>
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setPreviewItem(null)}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-surface)', borderRadius: '12px', overflow: 'hidden', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>{previewItem.name}</div>
              <button onClick={() => setPreviewItem(null)} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', minHeight: '200px', maxHeight: '70vh' }}>
              {previewItem.category === 'image' ? (
                <img src={getPreviewUrl(previewItem.url)} alt={previewItem.name} style={{ maxWidth: '100%', maxHeight: '65vh', borderRadius: '8px', objectFit: 'contain' }} />
              ) : previewItem.category === 'video' ? (
                <video controls src={getPreviewUrl(previewItem.url)} style={{ maxWidth: '100%', maxHeight: '65vh', borderRadius: '8px' }} />
              ) : previewItem.name?.toLowerCase().endsWith('.pdf') ? (
                <iframe src={getPreviewUrl(previewItem.url)} style={{ width: '100%', minWidth: '60vw', height: '65vh', border: 'none', borderRadius: '8px' }} />
              ) : null}
            </div>
            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => copyUrl(previewItem.url)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Copy size={14} /> Copy URL
              </button>
              <a href={getPreviewUrl(previewItem.url)} download={previewItem.name} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                <Download size={14} /> Download
              </a>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                {formatBytes(previewItem.size)} · {previewItem.category.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
