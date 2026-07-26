import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Bell, Mail, Smartphone, Save, AlertCircle, CheckCircle } from 'lucide-react';

const NotificationPreferences = () => {
  const [prefs, setPrefs] = useState({
    email_breaking_news: false,
    email_daily_digest: false,
    sms_breaking_news: false,
    sms_otp_only: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/config/group/notifications');
      if (res.data && Array.isArray(res.data)) {
        const mapped = { ...prefs };
        res.data.forEach(item => {
          if (item.configKey === 'notify.email.breaking') mapped.email_breaking_news = item.configValue === 'true';
          if (item.configKey === 'notify.email.daily') mapped.email_daily_digest = item.configValue === 'true';
          if (item.configKey === 'notify.sms.breaking') mapped.sms_breaking_news = item.configValue === 'true';
          if (item.configKey === 'notify.sms.otp') mapped.sms_otp_only = item.configValue === 'true';
        });
        setPrefs(mapped);
      }
    } catch (e) {
      console.error(e);
      showMsg("Failed to load preferences.", true);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/config/notifications', {
        emailBreaking: prefs.email_breaking_news ? 'true' : 'false',
        emailDaily: prefs.email_daily_digest ? 'true' : 'false',
        smsBreaking: prefs.sms_breaking_news ? 'true' : 'false',
        smsOtp: prefs.sms_otp_only ? 'true' : 'false'
      });
      showMsg('Notification preferences saved successfully.');
    } catch (e) {
      showMsg('Failed to save preferences.', true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>Loading preferences...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", fontSize: "1.75rem", fontWeight: 700 }}>
            <Bell size={26} color="var(--primary)" /> Notification Preferences
          </h1>
          <p className="text-secondary" style={{ color: "var(--text-secondary)" }}>Configure global notification settings for subscribers.</p>
        </div>
      </div>

      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1.5rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem",
          background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          color: msg.isError ? "#EF4444" : "#10B981",
          border: `1px solid ${msg.isError ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}>
          {msg.isError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", borderRadius: "14px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Mail size={20} color="var(--primary)" /> Email Notifications
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" name="email_breaking_news" checked={prefs.email_breaking_news} onChange={handleChange} style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }} />
            <span style={{ fontWeight: 500 }}>Send Breaking News Alerts to all Subscribers</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" name="email_daily_digest" checked={prefs.email_daily_digest} onChange={handleChange} style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }} />
            <span style={{ fontWeight: 500 }}>Send Daily Digest (Automated via cron)</span>
          </label>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", borderRadius: "14px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Smartphone size={20} color="var(--primary)" /> SMS Notifications
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" name="sms_breaking_news" checked={prefs.sms_breaking_news} onChange={handleChange} style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }} />
            <span style={{ fontWeight: 500 }}>Send Breaking News via SMS (High Cost)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
            <input type="checkbox" name="sms_otp_only" checked={prefs.sms_otp_only} onChange={handleChange} style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }} />
            <span style={{ fontWeight: 500 }}>Restrict SMS to OTP/Auth ONLY</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
          <Save size={18} /> {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
