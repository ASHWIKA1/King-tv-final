import React, { useState, useRef } from 'react';
import { userService } from '../services/userService';

const EditProfileModal = ({ user, token, onClose, onSaveSuccess }) => {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [imageFile, setImageFile] = useState(null);
  const SERVER_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : window.location.origin;

  const [imagePreview, setImagePreview] = useState(
    user.profileImage
      ? (user.profileImage.startsWith('http') ? user.profileImage : `${SERVER_BASE}${user.profileImage}`)
      : null
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PNG, JPG, and JPEG images are allowed');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full Name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let updatedUser = { ...user };

      if (imageFile) {
        const uploadRes = await userService.uploadProfileImage(token, imageFile);
        updatedUser.profileImage = uploadRes.profileImage;
      }

      if (fullName.trim() !== user.fullName) {
        const updateRes = await userService.updateProfile(token, fullName);
        updatedUser.fullName = updateRes.fullName;
      }

      onSaveSuccess(updatedUser);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#121212',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '24px' }}>Edit Profile</h3>
        
        {error && (
          <div style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                position: 'relative'
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '32px', color: 'var(--primary)' }}>+</span>
              )}
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                fontSize: '10px',
                textAlign: 'center',
                padding: '2px 0',
                fontWeight: 600
              }}>Change</div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/jpg" 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>
              Full Name
            </label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: 'white',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>
              Email Address (Cannot be edited)
            </label>
            <input 
              type="email" 
              value={user.email} 
              disabled
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                borderRadius: '6px',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '14px',
                cursor: 'not-allowed'
              }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>
              Login Provider / Role (Read Only)
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={user.provider} 
                disabled
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  cursor: 'not-allowed'
                }}
              />
              <input 
                type="text" 
                value={user.role.toUpperCase()} 
                disabled
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button" 
              onClick={onClose}
              disabled={saving}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--primary)',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(179,115,42,0.2)'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
