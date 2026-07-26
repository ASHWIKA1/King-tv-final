import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullScreen = false }) => {
  const { lang } = useContext(LanguageContext);
  const text = lang === 'en' ? 'Loading...' : 'ஏற்றப்படுகிறது...';

  return (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner-wrapper">
        <div className="glow-ring"></div>
        <div className="spinner-center"></div>
      </div>
      <span className="loading-text">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
