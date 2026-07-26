import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-side-drawer'));
  };

  const isActive = (path) => location.pathname === path;

  const activeColor = '#B3732A'; // Gold/Primary
  const inactiveColor = '#000000'; // Black

  return (
    <div className="mobile-bottom-nav-bar">
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-bottom-nav-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: #ffffff;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
          z-index: 9999;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
        }

        .mobile-bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          color: ${inactiveColor};
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .mobile-bottom-nav-item:active {
          transform: scale(0.9);
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav-bar {
            display: flex;
          }
          /* Add padding to body/footer so bottom bar doesn't cover content */
          body {
            padding-bottom: 60px !important;
          }
        }
      `}} />

      {/* Button 1: Home */}
      <Link 
        to="/" 
        className="mobile-bottom-nav-item" 
        style={{ color: isActive('/') ? activeColor : inactiveColor }}
        aria-label="Home"
      >
        <i className="fas fa-home" style={{ fontSize: '20px' }}></i>
      </Link>

      {/* Button 2: Live TV */}
      <Link 
        to="/live-tv" 
        className="mobile-bottom-nav-item" 
        style={{ color: isActive('/live-tv') ? activeColor : inactiveColor }}
        aria-label="Live TV"
      >
        <i className="fas fa-bolt" style={{ fontSize: '20px' }}></i>
      </Link>

      {/* Button 3: Web Stories (Aperture SVG) */}
      <Link 
        to="/web-stories" 
        className="mobile-bottom-nav-item" 
        style={{ color: isActive('/web-stories') ? activeColor : inactiveColor }}
        aria-label="Web Stories"
      >
        <svg 
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
          <line x1="9.69" y1="8" x2="21.17" y2="8" />
          <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
          <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
          <line x1="14.31" y1="16" x2="2.83" y2="16" />
          <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
        </svg>
      </Link>

      {/* Button 4: Videos (YouTube style play icon) */}
      <Link 
        to="/videos" 
        className="mobile-bottom-nav-item" 
        style={{ color: isActive('/videos') ? activeColor : inactiveColor }}
        aria-label="Videos"
      >
        <svg 
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="5" ry="5" />
          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
        </svg>
      </Link>

      {/* Button 5: Sidebar Toggle Menu */}
      <button 
        onClick={handleMenuClick} 
        className="mobile-bottom-nav-item"
        style={{ color: inactiveColor }}
        aria-label="Open Menu"
      >
        <i className="fas fa-bars" style={{ fontSize: '20px' }}></i>
      </button>
    </div>
  );
};

export default MobileBottomNav;
