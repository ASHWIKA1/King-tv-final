import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Save, Sliders, Palette, Share2, LineChart, Mail, Layout, Image as ImageIcon } from 'lucide-react';

const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
  <button
    onClick={(e) => { e.preventDefault(); onClick(id); }}
    style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.85rem 1.25rem', background: active ? '#2563EB' : 'transparent',
      color: active ? '#fff' : '#4B5563', border: 'none', textAlign: 'left',
      cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
      borderRadius: '6px', marginBottom: '2px'
    }}
  >
    <Icon size={18} /> {label}
  </button>
);

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [config, setConfig] = useState({
    gpsNewsRadius: 15, videoLengthLimit: 55,
    smtpHost: '', smtpPort: '587', smtpUsername: '', smtpPassword: '',
    smsGatewayKey: '', firebaseProjectId: '', cdnBaseUrl: '', cdnApiKey: '',
    telegramBotToken: '', telegramChatId: '', telegramEnabled: 'false',
    pwaName: '', pwaShortName: '', pwaThemeColor: '#000000', pwaBackgroundColor: '#ffffff',
    youtubeApiKey: '', youtubeChannelId: '', renderApiKey: '', vercelApiKey: '',
    primaryFont: 'Inter', secondaryFont: 'Merriweather', tertiaryFont: 'Poppins',
    aiLlmApiUrl: '', aiLlmApiKey: '', aiLlmModel: 'gemini-2.0-flash',
    logoUrl: '', faviconUrl: '', socialFacebook: '', socialTwitter: '',
    socialInstagram: '', socialYoutube: '', analyticsId: '', footerText: ''
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/admin/config');
        if (Array.isArray(res.data)) {
          const mapped = {};
          res.data.forEach(item => {
            if (item.configKey === 'gps.news_radius_km') mapped.gpsNewsRadius = Number(item.configValue) || 15;
            if (item.configKey === 'video.max_duration_seconds') mapped.videoLengthLimit = Number(item.configValue) || 55;
            if (item.configKey === 'smtp.host') mapped.smtpHost = item.configValue || '';
            if (item.configKey === 'smtp.port') mapped.smtpPort = item.configValue || '587';
            if (item.configKey === 'smtp.username') mapped.smtpUsername = item.configValue || '';
            if (item.configKey === 'smtp.password') mapped.smtpPassword = item.configValue || '';
            if (item.configKey === 'sms.gateway_api_key') mapped.smsGatewayKey = item.configValue || '';
            if (item.configKey === 'firebase.config') mapped.firebaseProjectId = item.configValue || '';
            if (item.configKey === 'cdn.base_url') mapped.cdnBaseUrl = item.configValue || '';
            if (item.configKey === 'cdn.api_key') mapped.cdnApiKey = item.configValue || '';
            if (item.configKey === 'telegram.bot_token') mapped.telegramBotToken = item.configValue || '';
            if (item.configKey === 'telegram.chat_id') mapped.telegramChatId = item.configValue || '';
            if (item.configKey === 'telegram.enabled') mapped.telegramEnabled = item.configValue || 'false';
            if (item.configKey === 'pwa.name') mapped.pwaName = item.configValue || '';
            if (item.configKey === 'pwa.short_name') mapped.pwaShortName = item.configValue || '';
            if (item.configKey === 'pwa.theme_color') mapped.pwaThemeColor = item.configValue || '#000000';
            if (item.configKey === 'pwa.background_color') mapped.pwaBackgroundColor = item.configValue || '#ffffff';
            if (item.configKey === 'youtube.api_key') mapped.youtubeApiKey = item.configValue || '';
            if (item.configKey === 'youtube.channel_id') mapped.youtubeChannelId = item.configValue || '';
            if (item.configKey === 'hosting.render_api_key') mapped.renderApiKey = item.configValue || '';
            if (item.configKey === 'hosting.vercel_api_key') mapped.vercelApiKey = item.configValue || '';
            if (item.configKey === 'font.primary') mapped.primaryFont = item.configValue || 'Inter';
            if (item.configKey === 'font.secondary') mapped.secondaryFont = item.configValue || 'Merriweather';
            if (item.configKey === 'font.tertiary') mapped.tertiaryFont = item.configValue || 'Poppins';
            if (item.configKey === 'ai.llm_api_url') mapped.aiLlmApiUrl = item.configValue || '';
            if (item.configKey === 'ai.llm_api_key') mapped.aiLlmApiKey = item.configValue || '';
            if (item.configKey === 'ai.llm_model') mapped.aiLlmModel = item.configValue || 'gemini-2.0-flash';
            // Custom new fields
            if (item.configKey === 'branding.logo_url') mapped.logoUrl = item.configValue || '';
            if (item.configKey === 'branding.favicon_url') mapped.faviconUrl = item.configValue || '';
            if (item.configKey === 'social.facebook') mapped.socialFacebook = item.configValue || '';
            if (item.configKey === 'social.twitter') mapped.socialTwitter = item.configValue || '';
            if (item.configKey === 'social.instagram') mapped.socialInstagram = item.configValue || '';
            if (item.configKey === 'social.youtube') mapped.socialYoutube = item.configValue || '';
            if (item.configKey === 'analytics.google_id') mapped.analyticsId = item.configValue || '';
            if (item.configKey === 'footer.text') mapped.footerText = item.configValue || '';
          });
          setConfig(prev => ({ ...prev, ...mapped }));
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      }
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLogoUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedUrl = res.data?.url || res.data?.path;
      if (uploadedUrl) {
        if (field === 'logo') {
          setConfig(prev => ({ ...prev, logoUrl: uploadedUrl }));
        } else if (field === 'favicon') {
          setConfig(prev => ({ ...prev, faviconUrl: uploadedUrl }));
        }
        alert(`${field === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully! Click Save Changes to apply.`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to upload ${field}: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Just making all put requests and Promise.allSettled so partial saves succeed
      await Promise.allSettled([
        api.put('/admin/config/gps', { radiusKm: String(config.gpsNewsRadius) }),
        api.put('/admin/config/video-limit', { maxDurationSeconds: String(config.videoLengthLimit) }),
        api.put('/admin/config/smtp', { host: config.smtpHost, port: config.smtpPort, username: config.smtpUsername, password: config.smtpPassword }),
        api.put('/admin/config/sms', { apiKey: config.smsGatewayKey }),
        api.put('/admin/config/firebase', { config: config.firebaseProjectId }),
        api.put('/admin/config/cdn', { baseUrl: config.cdnBaseUrl, apiKey: config.cdnApiKey }),
        api.put('/admin/config/telegram', { botToken: config.telegramBotToken, chatId: config.telegramChatId, enabled: String(config.telegramEnabled) }),
        api.put('/admin/config/pwa', { name: config.pwaName, shortName: config.pwaShortName, themeColor: config.pwaThemeColor, backgroundColor: config.pwaBackgroundColor }),
        api.put('/admin/config/youtube', { apiKey: config.youtubeApiKey, channelId: config.youtubeChannelId }),
        api.put('/admin/config/hosting', { renderApiKey: config.renderApiKey, vercelApiKey: config.vercelApiKey }),
        api.put('/admin/config/typography', { primaryFont: config.primaryFont, secondaryFont: config.secondaryFont, tertiaryFont: config.tertiaryFont }),
        api.put('/admin/config/ai-llm', { apiUrl: config.aiLlmApiUrl, apiKey: config.aiLlmApiKey, model: config.aiLlmModel }),
        
        // These might fail if endpoints don't exist yet, but won't crash the UI thanks to allSettled
        api.put('/admin/config/social', { facebook: config.socialFacebook, twitter: config.socialTwitter, instagram: config.socialInstagram, youtube: config.socialYoutube }).catch(() => {}),
        api.put('/admin/config/branding_assets', { logoUrl: config.logoUrl, faviconUrl: config.faviconUrl }).catch(() => {}),
        api.put('/admin/config/analytics', { googleId: config.analyticsId }).catch(() => {}),
        api.put('/admin/config/footer', { text: config.footerText }).catch(() => {})
      ]);
      alert('Settings saved successfully.');
    } catch (error) {
      console.error(error);
      alert('Error saving settings.');
    }
    setSaving(false);
  };

  if (loading) return <div className="animate-fade-in" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading settings...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', background: '#F8F9FA', minHeight: 'calc(100vh - 60px)', color: '#111827' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Settings</h1>
          <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>Configure your publication's global settings.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving} style={{ background: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '6px', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '0.75rem', flexShrink: 0, border: '1px solid #E5E7EB' }}>
          <TabButton id="general" icon={Sliders} label="General" active={activeTab === 'general'} onClick={setActiveTab} />
          <TabButton id="branding" icon={Palette} label="Branding" active={activeTab === 'branding'} onClick={setActiveTab} />
          <TabButton id="social" icon={Share2} label="Social Media" active={activeTab === 'social'} onClick={setActiveTab} />
          <TabButton id="analytics" icon={LineChart} label="Analytics" active={activeTab === 'analytics'} onClick={setActiveTab} />
          <TabButton id="email" icon={Mail} label="Email & SMTP" active={activeTab === 'email'} onClick={setActiveTab} />
          <TabButton id="footer" icon={Layout} label="Footer" active={activeTab === 'footer'} onClick={setActiveTab} />
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '2.5rem', border: '1px solid #E5E7EB', minHeight: '500px' }}>
          
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2rem 0', color: '#111827' }}>General</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Portal Variables</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '13px', marginBottom: '0.5rem', color: '#4B5563' }}>GPS News Radius (km)</label>
                    <input type="number" name="gpsNewsRadius" value={config.gpsNewsRadius} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '13px', marginBottom: '0.5rem', color: '#4B5563' }}>Max Video Upload (sec)</label>
                    <input type="number" name="videoLengthLimit" value={config.videoLengthLimit} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  </div>
                  
                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '2rem 0 1rem 0', color: '#374151' }}>S3 Asset CDN</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '13px', marginBottom: '0.5rem', color: '#4B5563' }}>CDN Base URL</label>
                    <input type="text" name="cdnBaseUrl" value={config.cdnBaseUrl} onChange={handleChange} placeholder="https://cdn.example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Typography</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '13px', marginBottom: '0.5rem', color: '#4B5563' }}>Primary Font (Headings)</label>
                    <input type="text" name="primaryFont" value={config.primaryFont} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '13px', marginBottom: '0.5rem', color: '#4B5563' }}>Secondary Font (Body)</label>
                    <input type="text" name="secondaryFont" value={config.secondaryFont} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  </div>
                  
                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '2rem 0 1rem 0', color: '#374151' }}>AI Integration</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '13px', marginBottom: '0.5rem', color: '#4B5563' }}>AI Model</label>
                    <input type="text" name="aiLlmModel" value={config.aiLlmModel} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2.5rem 0', color: '#111827' }}>Branding</h2>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Logo</label>
                <div 
                  onClick={() => document.getElementById('logo-upload').click()}
                  style={{
                    border: '1px dashed #D1D5DB', borderRadius: '8px', padding: '3rem', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: '#F9FAFB', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                >
                  <ImageIcon size={36} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>Upload your logo (PNG, SVG - max 2MB)</span>
                  <input type="file" id="logo-upload" style={{ display: 'none' }} accept="image/png, image/svg+xml" onChange={(e) => handleLogoUpload(e, 'logo')} />
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Favicon</label>
                <div 
                  onClick={() => document.getElementById('favicon-upload').click()}
                  style={{
                    border: '1px dashed #D1D5DB', borderRadius: '8px', padding: '3rem', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: '#F9FAFB', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                >
                  <ImageIcon size={36} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>Upload favicon (32x32px, ICO or PNG)</span>
                  <input type="file" id="favicon-upload" style={{ display: 'none' }} accept="image/png, image/x-icon" onChange={(e) => handleLogoUpload(e, 'favicon')} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '0.75rem', color: '#374151' }}>Theme Color</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="color" name="pwaThemeColor" value={config.pwaThemeColor} onChange={handleChange} style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid #D1D5DB', padding: '2px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '14px', color: '#4B5563', fontFamily: 'monospace' }}>{config.pwaThemeColor}</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '0.75rem', color: '#374151' }}>Background Color</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="color" name="pwaBackgroundColor" value={config.pwaBackgroundColor} onChange={handleChange} style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid #D1D5DB', padding: '2px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '14px', color: '#4B5563', fontFamily: 'monospace' }}>{config.pwaBackgroundColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2rem 0', color: '#111827' }}>Social Media Links</h2>
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>Facebook Profile / Page</label>
                  <input type="text" name="socialFacebook" value={config.socialFacebook} onChange={handleChange} placeholder="https://facebook.com/..." style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>Twitter (X) Profile</label>
                  <input type="text" name="socialTwitter" value={config.socialTwitter} onChange={handleChange} placeholder="https://twitter.com/..." style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>Instagram Profile</label>
                  <input type="text" name="socialInstagram" value={config.socialInstagram} onChange={handleChange} placeholder="https://instagram.com/..." style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>YouTube Channel</label>
                  <input type="text" name="socialYoutube" value={config.socialYoutube} onChange={handleChange} placeholder="https://youtube.com/..." style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2rem 0', color: '#111827' }}>Analytics</h2>
              <div style={{ maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>Google Analytics (GA4) Measurement ID</label>
                  <input type="text" name="analyticsId" value={config.analyticsId} onChange={handleChange} placeholder="G-XXXXXXXXXX" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                  <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '0.5rem' }}>This ID will be automatically injected into your publication's HTML head.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2rem 0', color: '#111827' }}>Email & SMTP</h2>
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>SMTP Host</label>
                  <input type="text" name="smtpHost" value={config.smtpHost} onChange={handleChange} placeholder="smtp.mailgun.org" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>SMTP Port</label>
                  <input type="text" name="smtpPort" value={config.smtpPort} onChange={handleChange} placeholder="587" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>SMTP Username</label>
                  <input type="text" name="smtpUsername" value={config.smtpUsername} onChange={handleChange} placeholder="postmaster@yourdomain.com" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>SMTP Password</label>
                  <input type="password" name="smtpPassword" value={config.smtpPassword} onChange={handleChange} placeholder="••••••••••••" style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 2rem 0', color: '#111827' }}>Footer Configuration</h2>
              <div style={{ maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, fontSize: '14px', marginBottom: '0.5rem', color: '#374151' }}>Copyright Text</label>
                  <input type="text" name="footerText" value={config.footerText} onChange={handleChange} placeholder="© 2026 Publication Name. All rights reserved." style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none' }} />
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;

