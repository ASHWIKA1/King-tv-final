import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ isOpen, onClose, onLogout }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const containerStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '12px',
    width: '200px',
    backgroundColor: '#121212',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(179, 115, 42, 0.1)',
    zIndex: 9999,
    padding: '8px 0',
    animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    overflow: 'hidden'
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 18px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div ref={dropdownRef} className="user-dropdown-menu" style={containerStyle}>
        <button 
          style={itemStyle} 
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(179, 115, 42, 0.15)';
            e.currentTarget.style.paddingLeft = '22px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.paddingLeft = '18px';
          }}
        >
          <span style={{ fontSize: '16px' }}>👤</span> My Profile
        </button>

        <button 
          style={itemStyle} 
          onClick={() => {
            navigate('/directory/dashboard');
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(179, 115, 42, 0.15)';
            e.currentTarget.style.paddingLeft = '22px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.paddingLeft = '18px';
          }}
        >
          <span style={{ fontSize: '16px' }}>💼</span> My Business
        </button>

        <button 
          style={itemStyle} 
          onClick={() => {
            navigate('/my-rfqs');
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(179, 115, 42, 0.15)';
            e.currentTarget.style.paddingLeft = '22px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.paddingLeft = '18px';
          }}
        >
          <span style={{ fontSize: '16px' }}>📋</span> My RFQs
        </button>
        
        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.05)', margin: '4px 0' }}></div>
        
        <button 
          style={itemStyle} 
          onClick={() => {
            onLogout();
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.15)';
            e.currentTarget.style.paddingLeft = '22px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.paddingLeft = '18px';
          }}
        >
          <span style={{ fontSize: '16px' }}>🚪</span> Logout
        </button>
      </div>
    </>
  );
};

export default UserDropdown;
