import React, { useState } from 'react';
import { Upload, X, Eye, Image as ImageIcon } from 'lucide-react';
import api from '../../api';

export const getPreviewUrl = (url) => {
  if (!url) return '';
  let finalUrl = url;
  if (typeof finalUrl === 'string' && finalUrl.includes('kings-tv.onrender.com')) {
    const path = finalUrl.replace(/^https?:\/\/kings-tv\.onrender\.com/, '');
    const cleanPath = path.startsWith('/api/v1') ? path.substring(7) : path;
    const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
      .replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
    finalUrl = serverBase + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);
  }
  if (finalUrl.startsWith('data:')) return finalUrl;
  if (finalUrl.startsWith('http://localhost') || finalUrl.startsWith('https://localhost')) {
    const path = finalUrl.replace(/^https?:\/\/[^\/]+/, '');
    const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
      .replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
    return serverBase + path;
  }
  if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) return finalUrl;
  const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
    .replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
  const normalizedUrl = finalUrl.startsWith('/') ? finalUrl : '/' + finalUrl;
  return serverBase + normalizedUrl;
};

const ImageUploadPreview = ({
  label = "Featured Image",
  value = "",
  onChange,
  uploadEndpoint = "/articles/upload",
  accept = "image/*",
  placeholder = "Image URL or upload file...",
  isVideo = false,
  required = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        setError('Upload succeeded but server did not return a valid URL.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = getPreviewUrl(value);

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    boxSizing: 'border-box',
    outline: 'none'
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          type="text"
          style={{ ...inputStyle, flex: 1 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <label
          className="btn btn-secondary"
          style={{
            cursor: uploading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0 0.85rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
          <input
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      {value && (
        <div
          style={{
            position: 'relative',
            marginTop: '0.6rem',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            maxHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isVideo ? (
            <video
              src={previewSrc}
              controls
              onError={(e) => {
                e.target.style.display = 'none';
                setError('Failed to load video preview from URL.');
              }}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          ) : (
            <img
              src={previewSrc}
              alt="Upload Preview"
              onError={(e) => {
                e.target.style.display = 'none';
                setError('Failed to load image preview from URL.');
              }}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          )}

          <div
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              display: 'flex',
              gap: '4px',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 6px',
              borderRadius: '6px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px' }}
              title="Preview Image"
            >
              <Eye size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
              title="Remove Image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {zoomOpen && value && (
        <div
          onClick={() => setZoomOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '2rem'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={previewSrc} alt="Full Preview" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', objectFit: 'contain' }} />
            <button
              onClick={() => setZoomOpen(false)}
              style={{ position: 'absolute', top: '-12px', right: '-12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
