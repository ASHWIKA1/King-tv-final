import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import './DashboardLayout.css';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const { lang } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdowns state
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Selected location
  const [selectedLoc, setSelectedLoc] = useState('Chennai, Tamil Nadu');

  // Locations list
  const locations = [
    'Chennai, Tamil Nadu',
    'Coimbatore, Tamil Nadu',
    'Namakkal, Tamil Nadu',
    'Madurai, Tamil Nadu',
    'Salem, Tamil Nadu'
  ];

  // Ref for click outside
  const locationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePath = location.pathname;

  // Dynamic page title details
  const getHeaderDetails = () => {
    if (activePath === '/nfc') {
      return {
        type: 'title',
        title: 'NFC Business Card',
        subtitle: 'Manage your NFC card and tap-to-pay profile'
      };
    } else if (activePath === '/rfq') {
      return {
        type: 'title',
        title: 'RFQ - Request for Quote',
        subtitle: 'Post what you need. Get multiple quotes from verified businesses.'
      };
    } else if (activePath === '/deals') {
      return {
        type: 'search',
        placeholder: 'Search deals, businesses, offers...'
      };
    }
    return { type: 'title', title: 'Dashboard', subtitle: 'Manage your merchant portal' };
  };

  const headerDetails = getHeaderDetails();

  return (
    <div className={`db-layout-wrapper ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      
      {/* Main container */}
      <div className="db-main-container">
        
        {/* Top Header */}
        {activePath === '/rfq' ? (
          <Header />
        ) : (
          <header className="db-header">
          <div className="db-header-left">
            {headerDetails.type === 'title' ? (
              <div className="db-header-titles">
                <h1 className="db-header-title">{headerDetails.title}</h1>
                <p className="db-header-subtitle">{headerDetails.subtitle}</p>
              </div>
            ) : (
              <div className="db-header-search-box">
                <i className="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  placeholder={headerDetails.placeholder} 
                  onChange={(e) => {
                    window.dispatchEvent(new CustomEvent('db-search', { detail: e.target.value }));
                  }}
                />
                <span className="search-shortcut">⌘K</span>
              </div>
            )}
          </div>

          <div className="db-header-right">
            {/* Location selector dropdown */}
            <div className="db-location-selector" ref={locationRef}>
              <button 
                className="db-location-btn" 
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <i className="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                <span>{selectedLoc}</span>
                <i className="fas fa-chevron-down ml-2" style={{ fontSize: '9px', opacity: 0.8 }}></i>
              </button>
              
              {showLocationDropdown && (
                <div className="db-dropdown-menu">
                  {locations.map((loc, i) => (
                    <button 
                      key={i} 
                      className={`db-dropdown-item ${loc === selectedLoc ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedLoc(loc);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Icons: Heart, Notification, Help */}
            <button className="db-icon-btn">
              <i className="far fa-heart"></i>
            </button>

            <button className="db-icon-btn relative">
              <i className="far fa-bell"></i>
              <span className="db-notification-badge">{activePath === '/nfc' ? 3 : 1}</span>
            </button>

            {activePath === '/nfc' && (
              <button className="db-icon-btn">
                <i className="far fa-question-circle"></i>
              </button>
            )}

            {/* Profile Avatar / Dropdown */}
            <div className="db-profile-menu" ref={profileRef}>
              <button 
                className="db-profile-btn"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                {activePath === '/nfc' ? (
                  <div className="db-avatar-circle bg-yellow-500">KC</div>
                ) : (
                  <div className="db-avatar-circle bg-purple-600">SJ</div>
                )}
                <div className="db-profile-details">
                  <span className="db-profile-user-name">
                    {activePath === '/nfc' ? 'King Cafe' : 'Sharmitha J'}
                  </span>
                  <span className="db-profile-user-role">
                    {activePath === '/nfc' ? 'Business Account' : 'Premium'}
                  </span>
                </div>
                <i className="fas fa-chevron-down" style={{ fontSize: '9px', opacity: 0.8 }}></i>
              </button>

              {showProfileDropdown && (
                <div className="db-dropdown-menu right-aligned">
                  <Link to="/profile" className="db-dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                    My Profile
                  </Link>
                  <Link to="/directory" className="db-dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                    My Business
                  </Link>
                  <Link to="/profile" className="db-dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                    Settings
                  </Link>
                  <hr className="db-dropdown-divider" />
                  <button className="db-dropdown-item text-red-500" onClick={() => navigate('/login')}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>
        )}

        {/* Dashboard Main Content area */}
        <main className="db-content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
