import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

const Customizer = () => {
  const { lang, t } = useContext(LanguageContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const {
    theme, setTheme,
    primaryColor, setPrimaryColor,
    fontSize, setFontSize,
    widgetWidth, setWidgetWidth,
    slideSpeed, setSlideSpeed,
    sections, toggleSection,
    resetAll
  } = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user || user.role !== 'editor') {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleColorChange = (color) => {
    setPrimaryColor(color);
  };

  const sectionsList = [
    { id: 'hero', ta: 'சிறப்புச் செய்திகள்', en: 'Featured News' },
    { id: 'video', ta: 'வீடியோ செய்திகள்', en: 'Video News' },
    { id: 'stories', ta: 'வெப் ஸ்டோரிஸ்', en: 'Web Stories' },
    { id: 'agri', ta: 'விவசாயம் & சந்தை', en: 'Agriculture & Market' },
    { id: 'election', ta: 'தேர்தல் மையம்', en: 'Election Hub' },
    { id: 'livetv', ta: 'லைவ் டிவி', en: 'Live TV' },
    { id: 'poll', ta: 'கருத்துக் கணிப்பு', en: 'Opinion Poll' },
    { id: 'digest', ta: 'செய்தி சுருக்கம்', en: 'News Digest' },
    { id: 'newsletter', ta: 'செய்தி மடல்', en: 'Newsletter' },
    { id: 'district', ta: 'மாவட்ட செய்திகள்', en: 'District News' },
    { id: 'business', ta: 'வணிக டாஷ்போர்டு', en: 'Business Dashboard' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="panel-backdrop" 
          id="panelBackdrop" 
          style={{ display: 'block' }}
          onClick={handleToggle}
        ></div>
      )}
      
      <button 
        className="customize-toggle" 
        id="customizeToggle" 
        aria-label="Customize"
        onClick={handleToggle}
      >
        <i className="fas fa-sliders-h"></i>
      </button>

      <div className={`customize-panel ${isOpen ? 'open' : ''}`} id="customizePanel">
        <div className="panel-header">
          <h3>
            <i className="fas fa-palette"></i>{' '}
            {lang === 'en' ? 'Customize Design' : 'தனிப்பயனாக்கு'}
          </h3>
          <button 
            className="close-panel" 
            id="closePanel" 
            aria-label="Close"
            onClick={handleToggle}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="panel-body">
          {/* THEME */}
          <div className="customize-group">
            <h4>⭐ {lang === 'en' ? 'Theme' : 'தீம்'}</h4>
            <div className="customize-row">
              <div>
                <label>{lang === 'en' ? 'Dark Mode' : 'இருண்ட பயன்முறை'}</label>
                <div className="custom-desc">
                  {lang === 'en' ? 'Switch to dark theme' : 'இருண்ட தீமுக்கு மாற்றவும்'}
                </div>
              </div>
              <label className="custom-switch">
                <input 
                  type="checkbox" 
                  id="ctrlDarkMode"
                  checked={theme === 'dark'}
                  onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* PRIMARY COLOR */}
          <div className="customize-group">
            <h4>🎨 {lang === 'en' ? 'Primary Color' : 'முதன்மை நிறம்'}</h4>
            <div className="color-picker-row">
              {['#B3732A', '#D97706', '#2563EB', '#16A34A', '#DC2626', '#7C3AED', '#DB2777'].map(c => (
                <span 
                  key={c}
                  className={`color-swatch ${primaryColor === c ? 'active' : ''}`} 
                  style={{ background: c }}
                  onClick={() => handleColorChange(c)}
                >
                  <input type="color" value={c} readOnly style={{ display: 'none' }} />
                </span>
              ))}
            </div>
          </div>

          {/* FONT SIZE */}
          <div className="customize-group">
            <h4>🔤 {lang === 'en' ? 'Font Size' : 'எழுத்து அளவு'}</h4>
            <div className="customize-row">
              <button 
                className={`font-size-btn ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => setFontSize('small')}
              >
                {lang === 'en' ? 'Small' : 'சிறியது'}
              </button>
              <button 
                className={`font-size-btn ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => setFontSize('medium')}
              >
                {lang === 'en' ? 'Medium' : 'நடுத்தரம்'}
              </button>
              <button 
                className={`font-size-btn ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => setFontSize('large')}
              >
                {lang === 'en' ? 'Large' : 'பெரியது'}
              </button>
            </div>
          </div>

          {/* SECTION VISIBILITY */}
          <div className="customize-group">
            <h4>👁️ {lang === 'en' ? 'Show/Hide Sections' : 'பகுதிகளை மறை/காட்டு'}</h4>
            <div className="section-visibility">
              {sectionsList.map(sec => (
                <div className="customize-row" key={sec.id}>
                  <label>{lang === 'en' ? sec.en : sec.ta}</label>
                  <label className="custom-switch">
                    <input 
                      type="checkbox" 
                      checked={sections[sec.id] !== false}
                      onChange={() => toggleSection(sec.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET WIDTH & SLIDE SPEED */}
          <div className="customize-group">
            <h4>📊 {lang === 'en' ? 'Widget Settings' : 'விட்ஜெட் அமைப்புகள்'}</h4>
            <div className="customize-row">
              <div>
                <label>{lang === 'en' ? 'Widget Width' : 'விலைப் பெட்டி அகலம்'}</label>
                <div className="custom-desc">
                  {lang === 'en' ? 'Width of the right sidebar widgets' : 'மேலே உள்ள விலைப் பெட்டியின் அகலம்'}
                </div>
              </div>
              <select 
                id="ctrlWidgetWidth"
                value={widgetWidth}
                onChange={(e) => setWidgetWidth(parseInt(e.target.value))}
                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', background: 'var(--bg-light)', color: 'var(--text-dark)' }}
              >
                <option value="520">{lang === 'en' ? 'Normal' : 'சாதாரணம்'}</option>
                <option value="640">{lang === 'en' ? 'Wide' : 'நீளம்'}</option>
                <option value="780">{lang === 'en' ? 'Very Wide' : 'மிக நீளம்'}</option>
              </select>
            </div>

            <div className="customize-row" style={{ marginTop: '12px' }}>
              <div>
                <label>{lang === 'en' ? 'Slide Interval' : 'விழும் ஸ்லைடு வேகம்'}</label>
                <div className="custom-desc">
                  {lang === 'en' ? 'Duration in seconds for widget changes' : 'விலைப் பெட்டி மாறும் நேரம் (வினாடிகள்)'}
                </div>
              </div>
              <select 
                id="ctrlSlideSpeed"
                value={slideSpeed}
                onChange={(e) => setSlideSpeed(parseInt(e.target.value))}
                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', background: 'var(--bg-light)', color: 'var(--text-dark)' }}
              >
                <option value="4">4 {lang === 'en' ? 'seconds' : 'வினாடிகள்'}</option>
                <option value="6">6 {lang === 'en' ? 'seconds' : 'வினாடிகள்'}</option>
                <option value="8">8 {lang === 'en' ? 'seconds' : 'வினாடிகள்'}</option>
                <option value="12">12 {lang === 'en' ? 'seconds' : 'வினாடிகள்'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="panel-footer" style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '10px' }}>
          <button 
            className="reset-btn" 
            id="resetCustomize"
            onClick={resetAll}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}
          >
            {lang === 'en' ? 'Reset' : 'மீட்டமை'}
          </button>
          <button 
            className="apply-btn" 
            id="applyCustomize"
            onClick={handleToggle}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 700 }}
          >
            {lang === 'en' ? 'Apply' : 'பயன்படுத்து'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Customizer;
