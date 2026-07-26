import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Languages, Type, Save, RefreshCw, Check, Globe } from 'lucide-react';

const GOOGLE_FONTS = [
  { name: 'Noto Sans Tamil', value: 'Noto+Sans+Tamil', preview: 'நட்சத்திரம்', isTamil: true },
  { name: 'Catamaran', value: 'Catamaran', preview: 'வணக்கம்', isTamil: true },
  { name: 'Mukta Malar', value: 'Mukta+Malar', preview: 'தமிழ்நாடு', isTamil: true },
  { name: 'Latha', value: 'Latha', preview: 'அரசியல்', isTamil: true },
  { name: 'Inter', value: 'Inter', preview: 'Kings TV News', isTamil: false },
  { name: 'Roboto', value: 'Roboto', preview: 'Kings TV News', isTamil: false },
  { name: 'Outfit', value: 'Outfit', preview: 'Kings TV News', isTamil: false },
  { name: 'Poppins', value: 'Poppins', preview: 'Kings TV News', isTamil: false },
  { name: 'Manrope', value: 'Manrope', preview: 'Kings TV News', isTamil: false },
];

const LANGUAGES = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
];

const FontPreview = ({ fontName, fontValue, text }) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontValue}:wght@400;600;700&display=swap`;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, [fontValue]);

  return (
    <span style={{ fontFamily: `'${fontName}', sans-serif`, fontSize: '1.1rem' }}>{text}</span>
  );
};

const LanguageFontSettings = () => {
  const [settings, setSettings] = useState({
    defaultLanguage: 'ta',
    primaryFontEn: 'Inter',
    primaryFontTa: 'Noto Sans Tamil',
    bodyFontSize: '16',
    headingFontSize: '28',
    lineHeight: '1.7',
    enableLanguageSwitcher: true,
    enableRTL: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from system config
    api.get('/admin/config')
      .then(res => {
        if (Array.isArray(res.data)) {
          const merged = { ...settings };
          res.data.forEach(item => {
            const k = item.configKey?.replace('lang.', '').replace('font.', '');
            if (k && item.configValue) merged[k] = item.configValue;
          });
          setSettings(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Save as key-value pairs to system config
      const configs = Object.entries(settings).map(([key, value]) => ({
        configKey: `lang.${key}`,
        configValue: String(value),
        configGroup: 'Language & Fonts',
        isPublic: true,
      }));
      // Try bulk update endpoint first
      await api.post('/admin/config/bulk', configs).catch(async () => {
        // Fallback: update individually
        for (const c of configs) {
          await api.post('/admin/config', c).catch(() => {});
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to save settings. Please try again.');
    }
    setSaving(false);
  };

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const sectionStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Languages size={24} color="var(--primary)" /> Language &amp; Font Settings
          </h1>
          <p className="text-secondary">Configure site language defaults, typography, and font families.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {saved ? <><Check size={16} /> Saved!</> : saving ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>

      {/* Language Settings */}
      <div style={sectionStyle}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Globe size={18} /> Language Configuration
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Default Site Language</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => set('defaultLanguage', lang.code)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '10px',
                    border: `2px solid ${settings.defaultLanguage === lang.code ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: settings.defaultLanguage === lang.code ? 'rgba(99,102,241,0.1)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{lang.flag}</div>
                  <div style={{ fontWeight: 700, color: settings.defaultLanguage === lang.code ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {lang.nativeName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Language Switcher</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show Tamil/English toggle in navbar</div>
              </div>
              <input type="checkbox" checked={settings.enableLanguageSwitcher}
                onChange={e => set('enableLanguageSwitcher', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>RTL Support</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Right-to-left text direction (for Arabic/Urdu)</div>
              </div>
              <input type="checkbox" checked={settings.enableRTL}
                onChange={e => set('enableRTL', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
            </label>
          </div>
        </div>
      </div>

      {/* Font Settings */}
      <div style={sectionStyle}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Type size={18} /> Typography & Fonts
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Tamil Font */}
          <div>
            <label style={labelStyle}>Tamil Content Font</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {GOOGLE_FONTS.filter(f => f.isTamil).map(font => (
                <label
                  key={font.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${settings.primaryFontTa === font.name ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: settings.primaryFontTa === font.name ? 'rgba(99,102,241,0.07)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  <input type="radio" name="fontTa" value={font.name} checked={settings.primaryFontTa === font.name}
                    onChange={() => set('primaryFontTa', font.name)} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ flex: 1, marginLeft: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {font.name}
                  </span>
                  <FontPreview fontName={font.name} fontValue={font.value} text={font.preview} />
                </label>
              ))}
            </div>
          </div>

          {/* English Font */}
          <div>
            <label style={labelStyle}>English Content Font</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {GOOGLE_FONTS.filter(f => !f.isTamil).map(font => (
                <label
                  key={font.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${settings.primaryFontEn === font.name ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: settings.primaryFontEn === font.name ? 'rgba(99,102,241,0.07)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                >
                  <input type="radio" name="fontEn" value={font.name} checked={settings.primaryFontEn === font.name}
                    onChange={() => set('primaryFontEn', font.name)} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ flex: 1, marginLeft: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {font.name}
                  </span>
                  <FontPreview fontName={font.name} fontValue={font.value} text={font.preview} />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Font size controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {[
            { key: 'bodyFontSize', label: 'Body Font Size (px)', min: 12, max: 22, step: 1 },
            { key: 'headingFontSize', label: 'Heading Font Size (px)', min: 18, max: 48, step: 2 },
            { key: 'lineHeight', label: 'Line Height', min: 1.2, max: 2.4, step: 0.1 },
          ].map(ctrl => (
            <div key={ctrl.key}>
              <label style={labelStyle}>{ctrl.label}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="range"
                  min={ctrl.min} max={ctrl.max} step={ctrl.step}
                  value={parseFloat(settings[ctrl.key]) || ctrl.min}
                  onChange={e => set(ctrl.key, e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--primary)' }}
                />
                <span className="badge badge-primary" style={{ minWidth: '44px', textAlign: 'center' }}>
                  {settings[ctrl.key]}
                </span>
              </div>
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: `${settings[ctrl.key]}px`, margin: 0, color: 'var(--text-primary)', lineHeight: settings.lineHeight }}>
                  {ctrl.key === 'headingFontSize' ? 'Breaking News Today' : 'Sample article preview text appears here.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.04))' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} /> Live Preview
        </h3>
        <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h2 style={{
            fontFamily: `'${settings.defaultLanguage === 'ta' ? settings.primaryFontTa : settings.primaryFontEn}', sans-serif`,
            fontSize: `${settings.headingFontSize}px`,
            marginBottom: '0.75rem',
          }}>
            {settings.defaultLanguage === 'ta' ? 'தமிழகத்தில் முக்கிய செய்திகள்' : 'Kings TV — Breaking News'}
          </h2>
          <p style={{
            fontFamily: `'${settings.defaultLanguage === 'ta' ? settings.primaryFontTa : settings.primaryFontEn}', sans-serif`,
            fontSize: `${settings.bodyFontSize}px`,
            lineHeight: settings.lineHeight,
            color: 'var(--text-secondary)',
          }}>
            {settings.defaultLanguage === 'ta'
              ? 'இன்றைய முக்கிய செய்திகள் மற்றும் சமீபத்திய நிகழ்வுகள் பற்றிய விரிவான அறிக்கை. Kings TV உங்களுக்கு நேரடியாக தகவல் வழங்குகிறது.'
              : 'This is a sample article preview showing how your content will look with the selected font and size settings. Kings TV delivers news directly to you.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageFontSettings;
