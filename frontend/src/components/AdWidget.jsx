import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

const AdWidget = ({ placement = 'sidebar' }) => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const ads = await fetchApi(`/advertisements/active?placement=${placement}`);
        if (Array.isArray(ads) && ads.length > 0) {
          // Select first ad (backend returns them shuffled for rotation)
          const selectedAd = ads[0];
          setAd(selectedAd);
          
          // Record impression automatically in background
          fetchApi(`/advertisements/${selectedAd.id}/impression`, {
            method: 'POST'
          }).catch(() => {});
        }
      } catch (error) {
        console.warn(`Failed to fetch ad for placement: ${placement}`, error);
      }
    };
    fetchAd();
  }, [placement]);
 
  const handleAdClick = () => {
    if (ad) {
      // Record click count in background
      fetchApi(`/advertisements/${ad.id}/click`, {
        method: 'POST'
      }).catch(() => {});

      // Open campaign link in new tab
      if (ad.linkUrl) {
        window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  if (!ad) return null;

  // Render ad styling depending on the placement position
  const isHeader = placement === 'header';
  const isSidebar = placement === 'sidebar';

  return (
    <div 
      className="ad-widget-wrapper animate-fade-in"
      style={{
        width: '100%',
        margin: isHeader ? '0 auto 20px auto' : '20px 0',
        padding: '8px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        cursor: 'pointer',
        textAlign: 'center',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onClick={handleAdClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', padding: '0 4px' }}>
        <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Sponsored
        </span>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', opacity: 0.7 }}>
          Ad Info
        </span>
      </div>
      
      <img 
        src={ad.imageUrl} 
        alt={ad.title} 
        style={{
          width: '100%',
          maxHeight: isHeader ? '90px' : '250px',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />
      {isSidebar && (
        <div style={{ padding: '8px 4px 4px 4px', textAlign: 'left' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ad.title}
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
            Learn more &rarr;
          </span>
        </div>
      )}
    </div>
  );
};

export default AdWidget;
