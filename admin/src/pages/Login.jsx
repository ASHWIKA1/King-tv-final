import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Zap, Shield, Edit3, Smartphone, Building2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (emailToUse, passwordToUse) => {
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(emailToUse, passwordToUse);
      
      if (result.success) {
        const role = result.role;
        if (role === 'MOBILE_JOURNALIST' || role === 'INSTITUTION_LOGIN') {
          navigate('/journalist/posts');
        } else if (role === 'READER') {
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.location.href = 'http://localhost:5174/';
          } else {
            window.location.href = '/';
          }
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login submit error", err);
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth(email, password);
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleAuth(demoEmail, demoPassword);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '1.5rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/assets/logo-banner-light.png" 
            alt="KING24X7 Logo" 
            className="logo-light-only" 
            style={{ maxHeight: '55px', width: 'auto', marginBottom: '0.5rem' }} 
          />
          <img 
            src="/assets/logo-banner-dark.png" 
            alt="KING24X7 Logo" 
            className="logo-dark-only" 
            style={{ maxHeight: '55px', width: 'auto', marginBottom: '0.5rem' }} 
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>Admin Portal Login</p>
        </div>
        
        {/* Instant 1-Click Login Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(179,115,42,0.15), rgba(245,158,11,0.15))',
          border: '1px solid var(--primary)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '1.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Zap size={14} /> One-Click Quick Login
          </div>
          
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@king24x7.com', 'admin123')}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(179,115,42,0.3)',
              marginBottom: '10px',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={16} /> Log In as Super Admin
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('editor@king24x7.com', 'editor123')}
              disabled={isLoading}
              style={{
                padding: '6px 4px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Edit3 size={12} /> Editor
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('reporter@king24x7.com', 'reporter123')}
              disabled={isLoading}
              style={{
                padding: '6px 4px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Smartphone size={12} /> Journalist
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vendor@king24x7.com', 'vendor123')}
              disabled={isLoading}
              style={{
                padding: '6px 4px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Building2 size={12} /> Vendor
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>or manual sign in</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>
        
        {error && (
          <div style={{ backgroundColor: 'var(--danger-glow)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="admin@king24x7.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '10px', fontWeight: 700 }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
