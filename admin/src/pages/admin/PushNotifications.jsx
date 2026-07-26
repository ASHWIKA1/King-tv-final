import React, { useState } from 'react';
import api from '../../api';
import { Send, Bell, Users, Map } from 'lucide-react';

const PushNotifications = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    url: '',
    imageUrl: '',
    targetSegment: 'GLOBAL',
    districts: []
  });
  const [loading, setLoading] = useState(false);

  const TN_DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSend = async (e) => {
    e.preventDefault();
    if(!window.confirm("Send this push notification? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        body: formData.message,
        imageUrl: formData.imageUrl,
        actionUrl: formData.url,
        targetType: formData.targetSegment,
        targetValue: formData.targetSegment === 'LOCALIZED' ? formData.districts.join(',') : null
      };
      const response = await api.post('/admin/push-notifications', payload);
      const createdNotification = response.data;
      
      // Auto-trigger broadcast on the created draft record
      await api.post(`/admin/push-notifications/${createdNotification.id}/send`);
      
      alert("Notification broadcasted successfully!");
      setFormData({ title: '', message: '', url: '', imageUrl: '', targetSegment: 'GLOBAL', districts: [] });
    } catch (error) {
      console.error(error);
      alert("Failed to send notification.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Push Notification Composer</h1>
        <p className="text-secondary">Send instant web push alerts to readers globally or by segment.</p>
      </div>

      <form className="glass-panel" style={{ padding: '2rem' }} onSubmit={handleSend}>
        <div className="form-group">
          <label className="form-label">Notification Title</label>
          <input 
            type="text" name="title" className="form-control" 
            value={formData.title} onChange={handleChange} required
            placeholder="Breaking News"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Message Body</label>
          <textarea 
            name="message" className="form-control" rows="3"
            value={formData.message} onChange={handleChange} required
            placeholder="A short description of the news..."
            maxLength={150}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Click URL (Optional)</label>
          <input 
            type="url" name="url" className="form-control" 
            value={formData.url} onChange={handleChange} 
            placeholder="https://king24x7.com/news/123"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Big Image URL (Optional)</label>
          <input 
            type="url" name="imageUrl" className="form-control" 
            value={formData.imageUrl} onChange={handleChange} 
            placeholder="https://king24x7.com/assets/images/banner.jpg"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Target Audience Segment</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer', flex: 1 }}>
              <input type="radio" name="targetSegment" value="GLOBAL" checked={formData.targetSegment === 'GLOBAL'} onChange={handleChange} />
              <Bell size={16} color="var(--primary)" /> Global
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer', flex: 1 }}>
              <input type="radio" name="targetSegment" value="SUBSCRIBERS" checked={formData.targetSegment === 'SUBSCRIBERS'} onChange={handleChange} />
              <Users size={16} color="var(--success)" /> Subscribers
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', cursor: 'pointer', flex: 1 }}>
              <input type="radio" name="targetSegment" value="LOCALIZED" checked={formData.targetSegment === 'LOCALIZED'} onChange={handleChange} />
              <Map size={16} color="var(--warning)" /> By District
            </label>
          </div>
        </div>

        {formData.targetSegment === 'LOCALIZED' && (
          <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <label className="form-label">Select Target Districts</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {TN_DISTRICTS.map(district => (
                <label key={district} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.districts.includes(district)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, districts: [...formData.districts, district] });
                      } else {
                        setFormData({ ...formData, districts: formData.districts.filter(d => d !== district) });
                      }
                    }}
                    style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                  />
                  <span>{district}</span>
                </label>
              ))}
            </div>
            {formData.districts.length === 0 && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Please select at least one district.</div>}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }} disabled={loading || (formData.targetSegment === 'LOCALIZED' && formData.districts.length === 0)}>
          <Send size={18} /> {loading ? 'Sending...' : 'Broadcast Notification'}
        </button>
      </form>
    </div>
  );
};

export default PushNotifications;
