import React from 'react';
import UserAvatar from './UserAvatar';

const ProfileCard = ({ user, onEditClick }) => {
  if (!user) return null;

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '40px 30px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const detailsContainerStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  };

  const labelStyle = {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '600'
  };

  const valueStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    textAlign: 'right'
  };

  return (
    <div className="profile-card" style={cardStyle}>
      <div style={{ position: 'relative' }}>
        <UserAvatar user={user} size={110} />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{user.fullName}</h2>
        <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', fontWeight: '800' }}>{user.role}</span>
      </div>

      <div style={detailsContainerStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Email Address</span>
          <span style={valueStyle}>{user.email}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Login Provider</span>
          <span style={{ ...valueStyle, color: user.provider === 'LOCAL' ? '#ffffff' : 'var(--primary)' }}>
            {user.provider}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Verification Status</span>
          <span style={{ ...valueStyle, color: user.isVerified || user.provider !== 'LOCAL' ? '#10B981' : '#F59E0B' }}>
            {user.isVerified || user.provider !== 'LOCAL' ? '✓ Verified' : '⚠ Unverified'}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Account Created</span>
          <span style={valueStyle}>{user.createdAt || 'N/A'}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Last Logged In</span>
          <span style={valueStyle}>{user.lastLogin || 'N/A'}</span>
        </div>
      </div>

      <button 
        onClick={onEditClick}
        style={{
          width: '100%',
          padding: '14px',
          background: 'transparent',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          borderRadius: '8px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '14px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--primary)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.boxShadow = '0 5px 15px rgba(179,115,42,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
