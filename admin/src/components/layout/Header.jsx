import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import api from '../../api';
import { LogOut, User, Moon, Sun, Search, Bell, Settings, ChevronDown, Activity, AlertCircle, Users, Inbox } from 'lucide-react';

const Header = () => {
  const { user, logout, hasAnyRole } = useAuth();
  const { toggleLang, t } = useI18n();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [counts, setCounts] = useState({ pendingArticles: 0, pendingUgc: 0, activeBreaking: 0, pendingProfanity: 0 });

  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [searchOpen]);

  // Fetch notifications/badge counts
  const fetchCounts = async () => {
    if (!user) return;
    try {
      const res = await api.get('/admin/sidebar/counts');
      setCounts(res.data || {});
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notificationsOpen, profileOpen, searchOpen]);

  // Handle Search Input Change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await api.get(`/articles/getAll?search=${encodeURIComponent(searchQuery)}&size=5`);
        setSearchResults(res.data?.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const totalNotifications = (counts.pendingArticles || 0) + (counts.pendingUgc || 0) + (counts.pendingProfanity || 0);

  // Available page links to quick jump to
  const getNavigablePages = () => {
    const pages = [
      { name: 'Dashboard', path: '/admin/dashboard', roles: ['SUPER_ADMIN', 'CHIEF_EDITOR', 'MOBILE_JOURNALIST', 'INSTITUTION_LOGIN'] },
      { name: 'Editorial Calendar', path: '/admin/editorial-calendar', roles: ['SUPER_ADMIN', 'CHIEF_EDITOR'] },
      { name: 'News Management', path: '/admin/news', roles: ['SUPER_ADMIN', 'CHIEF_EDITOR'] },
      { name: 'Create Article', path: '/admin/news/create', roles: ['SUPER_ADMIN', 'CHIEF_EDITOR'] },
      { name: 'UGC Review Queue', path: '/admin/ugc-queue', roles: ['SUPER_ADMIN', 'CHIEF_EDITOR', 'SUB_EDITOR'] },
      { name: 'Ad Placement Manager', path: '/admin/ads', roles: ['SUPER_ADMIN'] },
      { name: 'User Management', path: '/admin/users', roles: ['SUPER_ADMIN', 'CHIEF_EDITOR'] },
      { name: 'System Configuration Settings', path: '/admin/settings', roles: ['SUPER_ADMIN'] },
      { name: 'Profanity Manager', path: '/admin/profanity', roles: ['SUPER_ADMIN'] },
    ];
    return pages.filter(p => hasAnyRole(p.roles));
  };

  const filteredPages = getNavigablePages().filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="app-header">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Ctrl+K search trigger button */}
          <button 
            className="btn-toggle" 
            onClick={() => setSearchOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '0.4rem 1rem', width: '220px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left' }}
          >
            <Search size={14} />
            <span style={{ fontSize: '0.8rem', flex: 1 }}>{t('search')}...</span>
            <kbd style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem', background: 'var(--border-color)', borderRadius: '4px', fontFamily: 'monospace' }}>Ctrl K</kbd>
          </button>
        </div>
        
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Language toggle */}
          <button 
            onClick={() => toggleLang()} 
            className="btn-toggle" 
            title="Toggle Language"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9.5" cy="9.5" r="6.5" fill="var(--text-primary)" stroke="var(--text-primary)" strokeWidth="1"/>
              <text x="9.5" y="12.5" fontSize="9.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fill="var(--bg-primary)" textAnchor="middle">A</text>
              
              <circle cx="15.5" cy="15.5" r="6.5" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeWidth="1"/>
              <text x="15.5" y="18.5" fontSize="8.5" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fill="var(--text-primary)" textAnchor="middle">அ</text>

              <path d="M 8 14.5 C 8 17.5, 10 18.5, 12 17.5" stroke="var(--text-primary)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              <path d="M 10.5 18.5 L 12.5 17.5 L 12 15.5" stroke="var(--text-primary)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>

              <path d="M 16 9.5 C 16 6.5, 14 5.5, 12 6.5" stroke="var(--text-primary)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              <path d="M 13.5 5.5 L 11.5 6.5 L 12 8.5" stroke="var(--text-primary)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="btn-toggle" style={{ padding: '0.5rem' }} title="Toggle Theme">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notifications drop down */}
          <div style={{ position: 'relative' }} ref={notificationsRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)} 
              className="btn-toggle" 
              style={{ padding: '0.5rem', position: 'relative' }}
              title="Notifications"
            >
              <Bell size={16} />
              {totalNotifications > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger)', color: 'white', borderRadius: '50%', fontSize: '0.65rem', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {totalNotifications}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '280px', padding: '1rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: 0, color: 'var(--text-primary)' }}>System Alerts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {counts.pendingArticles > 0 && (
                    <Link to="/admin/content" onClick={() => setNotificationsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.25rem 0' }}>
                      <Inbox size={14} color="var(--primary)" />
                      <span>{counts.pendingArticles} Submitted news articles</span>
                    </Link>
                  )}
                  {counts.pendingUgc > 0 && (
                    <Link to="/admin/ugc-queue" onClick={() => setNotificationsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.25rem 0' }}>
                      <Users size={14} color="#10B981" />
                      <span>{counts.pendingUgc} UGC posts pending review</span>
                    </Link>
                  )}
                  {counts.pendingProfanity > 0 && (
                    <Link to="/admin/profanity" onClick={() => setNotificationsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.25rem 0' }}>
                      <AlertCircle size={14} color="#EF4444" />
                      <span>{counts.pendingProfanity} Profanity alerts flagged</span>
                    </Link>
                  )}
                  {totalNotifications === 0 && (
                    <div style={{ padding: '0.5rem 0', color: 'var(--text-muted)', textAlign: 'center' }}>No new system notifications.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown info */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--primary)' }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown size={14} className={`sidebar-chevron ${profileOpen ? 'sidebar-chevron--open' : ''}`} />
            </button>

            {profileOpen && (
              <div className="glass-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '200px', padding: '0.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '2px' }}>{user?.role?.replace('_', ' ')}</div>
                </div>
                <Link to="/admin/profile" onClick={() => setProfileOpen(false)} className="nav-link" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                  <User size={14} /> My Profile
                </Link>
                {hasAnyRole(['SUPER_ADMIN']) && (
                  <Link to="/admin/settings" onClick={() => setProfileOpen(false)} className="nav-link" style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                    <Settings size={14} /> System Settings
                  </Link>
                )}
                <div className="sidebar-divider" style={{ margin: '0.25rem 0' }} />
                <button onClick={() => { setProfileOpen(false); logout(); }} className="nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Ctrl+K Search Modal overlay */}
      {searchOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="glass-panel" ref={searchRef} style={{ width: '90%', maxWidth: '550px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <Search size={18} color="var(--primary)" />
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, categories, settings..." 
                style={{ width: '100%', border: 'none', background: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem' }}
              />
              <button 
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ESC
              </button>
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Pages section */}
              {filteredPages.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Navigation Jump</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {filteredPages.map(page => (
                      <Link 
                        key={page.path}
                        to={page.path}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="nav-link"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                      >
                        <Activity size={14} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem' }}>{page.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles result section */}
              {searchQuery && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Articles</div>
                  {searchLoading ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {searchResults.map(art => (
                        <Link
                          key={art.id}
                          to={`/admin/news/${art.id}/edit`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          className="nav-link"
                          style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
                        >
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{art.titleTa || art.titleEn}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status: {art.status} · Author: {art.authorName || 'Desk'}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No articles match your query.</div>
                  )}
                </div>
              )}

              {!searchQuery && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                  Type to query news articles, UGC review posts, user accounts, and system configuration settings.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

