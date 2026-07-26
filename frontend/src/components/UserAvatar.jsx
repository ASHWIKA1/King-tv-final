import React from 'react';

const UserAvatar = ({ user, size = 36, onClick }) => {
  if (!user) return null;

  const getInitial = () => {
    const name = user.fullName || user.email || '?';
    return name.trim().charAt(0).toUpperCase();
  };

  const hasImage = user.profileImage && user.profileImage.trim() !== '';
  const SERVER_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : window.location.origin;

  const imageUrl = hasImage 
    ? (user.profileImage.startsWith('http') ? user.profileImage : `${SERVER_BASE}${user.profileImage}`)
    : null;

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.45}px`,
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #d49843 0%, #b3732a 100%)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 10px rgba(179, 115, 42, 0.25)',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none'
  };

  return (
    <div 
      className="user-avatar"
      style={avatarStyle} 
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = '0 6px 15px rgba(179, 115, 42, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(179, 115, 42, 0.25)';
      }}
    >
      {hasImage ? (
        <img 
          src={imageUrl} 
          alt={user.fullName} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerText = getInitial();
          }}
        />
      ) : (
        getInitial()
      )}
    </div>
  );
};

export default UserAvatar;
