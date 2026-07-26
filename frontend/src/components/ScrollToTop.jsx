import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down past 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      <button
        onClick={scrollToTop}
        aria-label="Scroll to Top"
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '30px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary, #B3732A) 0%, #D97706 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          zIndex: 996,
          transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
          opacity: isVisible ? '1' : '0',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          pointerEvents: isVisible ? 'all' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 119, 6, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(217, 119, 6, 0.4)';
        }}
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* Responsive positioning overrides */}
      <style>{`
        @media (max-width: 768px) {
          [aria-label="Scroll to Top"] {
            bottom: 200px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ScrollToTop;
