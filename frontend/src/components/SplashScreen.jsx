import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    // Start fade out after 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeClass('fade-out');
    }, 2200);

    // Complete splash screen after 2.7 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      transition: 'opacity 0.5s ease-in-out',
      opacity: fadeClass === 'fade-in' ? 1 : 0,
      pointerEvents: 'none'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        animation: 'splashZoomIn 1s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '20px'
      }}>
        {/* Local keyframe animations style tag */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes splashZoomIn {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}} />

        <img 
          src="assets/images/logo-banner-dark.png" 
          alt="KING Logo" 
          style={{ 
            width: '160px', 
            height: 'auto', 
            objectFit: 'contain',
            marginBottom: '15px'
          }} 
        />
        
        <div style={{ 
          color: '#ffffff', 
          fontSize: '28px', 
          fontWeight: '700', 
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          marginBottom: '16px',
          letterSpacing: '0.5px'
        }}>
          24x7 Multiform TV
        </div>

        <div style={{ 
          color: '#B3732A', 
          fontSize: '20px', 
          fontStyle: 'italic', 
          fontFamily: "'Georgia', serif",
          fontWeight: '500',
          letterSpacing: '0.5px'
        }}>
          மண்ணின்... மனசாட்சி...
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
