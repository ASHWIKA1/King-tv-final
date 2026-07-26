import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-item skeleton-image"></div>
            <div className="skeleton-item skeleton-title"></div>
            <div className="skeleton-item skeleton-line"></div>
            <div className="skeleton-item skeleton-line" style={{ width: '90%' }}></div>
            <div className="skeleton-item skeleton-meta"></div>
          </div>
        );
      case 'list':
        return (
          <div className="skeleton-list-item" style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <div className="skeleton-item" style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <div className="skeleton-item" style={{ height: '16px', width: '85%', borderRadius: '4px' }}></div>
              <div className="skeleton-item" style={{ height: '12px', width: '50%', borderRadius: '4px' }}></div>
            </div>
          </div>
        );
      case 'detail':
        return (
          <div className="skeleton-detail" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div className="skeleton-item skeleton-title" style={{ height: '32px', width: '90%', borderRadius: '6px' }}></div>
            <div className="skeleton-item skeleton-meta" style={{ height: '16px', width: '30%', borderRadius: '4px' }}></div>
            <div className="skeleton-item skeleton-image" style={{ height: '400px', borderRadius: 'var(--radius-md)' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div className="skeleton-item skeleton-line"></div>
              <div className="skeleton-item skeleton-line"></div>
              <div className="skeleton-item skeleton-line" style={{ width: '95%' }}></div>
              <div className="skeleton-item skeleton-line" style={{ width: '85%' }}></div>
              <div className="skeleton-item skeleton-line" style={{ width: '90%' }}></div>
            </div>
          </div>
        );
      case 'text':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <div className="skeleton-item" style={{ height: '14px', width: '100%', borderRadius: '4px' }}></div>
            <div className="skeleton-item" style={{ height: '14px', width: '95%', borderRadius: '4px' }}></div>
            <div className="skeleton-item" style={{ height: '14px', width: '90%', borderRadius: '4px' }}></div>
          </div>
        );
    }
  };

  return (
    <>
      {items.map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
