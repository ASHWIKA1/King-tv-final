import React, { useState, useEffect } from 'react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#EF4444',
      color: 'white',
      textAlign: 'center',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: 700,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <i className="fas fa-wifi-slash" style={{ animation: 'blink 1.5s infinite' }}></i>
      <span>You are currently offline. Viewing cached articles and layouts.</span>
      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OfflineBanner;
