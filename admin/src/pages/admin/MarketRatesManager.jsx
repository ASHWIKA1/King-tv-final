import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Save, Trash2, RefreshCw, TrendingUp, TrendingDown, Minus, Leaf } from 'lucide-react';

const COMMODITY_ICONS = {
  'நெல்': '🌾', 'rice': '🌾', 'paddy': '🌾',
  'கடலை': '🌻', 'groundnut': '🌻',
  'மஞ்சள்': '🟡', 'turmeric': '🟡',
  'பருத்தி': '🧵', 'cotton': '🧵',
  'துவரை': '🫘', 'toor': '🫘', 'dal': '🫘',
  'தேங்காய்': '🥥', 'coconut': '🥥',
  'வாழை': '🍌', 'banana': '🍌',
  'தக்காளி': '🍅', 'tomato': '🍅',
  'வெங்காயம்': '🧅', 'onion': '🧅',
  'தங்கம்': '🪙', 'gold': '🪙',
  'வெள்ளி': '⚪', 'silver': '⚪',
};

function getIcon(name) {
  if (!name) return '📦';
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(COMMODITY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '📦';
}

const defaultEntry = {
  nameEn: '', nameTa: '', price: '', unit: 'kg',
  change: '', changePercent: '', trend: 'stable', category: 'agriculture',
};

const MarketRatesManager = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(defaultEntry);
  const [goldData, setGoldData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRates();
    fetchGoldData();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/market-rates/getAll?size=50');
      setRates(res.data?.content || res.data || []);
    } catch (err) {
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoldData = async () => {
    try {
      const res = await api.get('/api/v1/market/live-rates');
      setGoldData(res.data);
    } catch {
      setGoldData(null);
    }
  };

  const handleSave = async () => {
    if (!form.nameTa && !form.nameEn) { setError('பண்டத்தின் பெயர் தேவை'); return; }
    if (!form.price) { setError('விலை தேவை'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      if (editingId) {
        await api.put(`/api/v1/market-rates/saveUpdate`, { ...form, id: editingId });
      } else {
        await api.post('/api/v1/market-rates/saveUpdate', form);
      }
      setSuccess('வெற்றிகரமாக சேமிக்கப்பட்டது!');
      setShowAddForm(false); setForm(defaultEntry); setEditingId(null);
      fetchRates();
    } catch (err) {
      setError(err.response?.data?.message || 'சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rate) => {
    setForm({ ...rate });
    setEditingId(rate.id);
    setShowAddForm(true);
    setError(''); setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('இந்த விலையை நீக்கவா?')) return;
    try {
      await api.delete(`/api/v1/market-rates/${id}`);
      setSuccess('நீக்கப்பட்டது!');
      fetchRates();
    } catch {
      setError('நீக்க முடியவில்லை.');
    }
  };

  const trendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={14} style={{ color: '#16A34A' }} />;
    if (trend === 'down') return <TrendingDown size={14} style={{ color: '#EF4444' }} />;
    return <Minus size={14} style={{ color: '#94A3B8' }} />;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #16A34A, #4ADE80)', borderRadius: '10px', padding: '10px', display: 'flex' }}>
            <Leaf size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>சந்தை விலை மேலாண்மை</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Market Rates Manager — விவசாய பண்ட விலைகளை புதுப்பிக்கவும்</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchRates} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
            <RefreshCw size={14} /> புதுப்பி
          </button>
          <button onClick={() => { setShowAddForm(!showAddForm); setForm(defaultEntry); setEditingId(null); setError(''); setSuccess(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'linear-gradient(135deg, #16A34A, #4ADE80)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'white', fontWeight: 600 }}>
            <Plus size={14} /> புதிய விலை சேர்
          </button>
        </div>
      </div>

      {/* Live Gold/Silver Widget */}
      {goldData && (
        <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🪙 நேரலை தங்க/வெள்ளி விலை:
          </div>
          {goldData.gold && Object.entries(goldData.gold).map(([k, v]) => (
            <span key={k} style={{ fontSize: '13px', color: '#78350F', fontWeight: 600 }}>{k}: ₹{v}/g</span>
          ))}
          {goldData.silver && <span style={{ fontSize: '13px', color: '#78350F', fontWeight: 600 }}>🥈 வெள்ளி: ₹{goldData.silver.price || goldData.silver}/g</span>}
        </div>
      )}

      {/* Messages */}
      {error && <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#16A34A', fontSize: '13px', marginBottom: '16px' }}>{success}</div>}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', color: 'var(--text-primary)' }}>
            {editingId ? '✏️ விலை திருத்து' : '➕ புதிய விலை சேர்'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { key: 'nameTa', label: 'பண்ட பெயர் (தமிழ்) *', placeholder: 'நெல், கடலை, மஞ்சள்...' },
              { key: 'nameEn', label: 'Commodity Name (English)', placeholder: 'Rice, Groundnut...' },
              { key: 'price', label: 'விலை *', placeholder: '₹2,280' },
              { key: 'unit', label: 'அலகு', placeholder: 'kg, g, litre...' },
              { key: 'change', label: 'மாற்றம்', placeholder: '+₹40 or -₹20' },
              { key: 'changePercent', label: 'மாற்றம் %', placeholder: '+1.8 or -0.5' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>{f.label}</label>
                <input
                  value={form[f.key] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>போக்கு</label>
              <select value={form.trend || 'stable'} onChange={e => setForm(p => ({ ...p, trend: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <option value="up">↑ உயர்வு (Up)</option>
                <option value="down">↓ தாழ்வு (Down)</option>
                <option value="stable">→ மாற்றமில்லை (Stable)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>வகை</label>
              <select value={form.category || 'agriculture'} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <option value="agriculture">விவசாயம்</option>
                <option value="metals">தாதுக்கள்</option>
                <option value="vegetables">காய்கறிகள்</option>
                <option value="fruits">பழங்கள்</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #16A34A, #4ADE80)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontSize: '13px', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
              <Save size={14} /> {saving ? 'சேமிக்கிறது...' : 'சேமி'}
            </button>
            <button onClick={() => { setShowAddForm(false); setForm(defaultEntry); setEditingId(null); }}
              style={{ padding: '10px 20px', background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}>
              ரத்து
            </button>
          </div>
        </div>
      )}

      {/* Rates Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '10px' }}>விலைகள் ஏற்றுகிறது...</p>
        </div>
      ) : rates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--glass-bg)', borderRadius: '12px', border: '2px dashed var(--border-color)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌾</div>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px' }}>இன்னும் விலைகள் சேர்க்கப்படவில்லை</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 20px' }}>
            மேலே "புதிய விலை சேர்" என்ற பொத்தானை அழுத்தி விவசாய பண்ட விலைகளை சேர்க்கவும்.
          </p>
          <button onClick={() => setShowAddForm(true)}
            style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #16A34A, #4ADE80)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontSize: '13px', fontWeight: 600 }}>
            <Plus size={14} /> புதிய விலை சேர்
          </button>
        </div>
      ) : (
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)' }}>
                {['பண்டம்', 'விலை', 'மாற்றம்', 'போக்கு', 'வகை', 'செயல்கள்'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, i) => (
                <tr key={rate.id} style={{ borderBottom: '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : 'var(--sidebar-bg)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{getIcon(rate.nameTa || rate.nameEn)}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{rate.nameTa || rate.nameEn}</div>
                        {rate.nameTa && rate.nameEn && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rate.nameEn}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '15px', color: 'var(--primary)' }}>₹{rate.price}/{rate.unit || 'kg'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: rate.trend === 'up' ? '#16A34A' : rate.trend === 'down' ? '#EF4444' : '#94A3B8', fontWeight: 600 }}>
                    {rate.change || '—'} {rate.changePercent ? `(${rate.changePercent}%)` : ''}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{trendIcon(rate.trend)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: 600 }}>{rate.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(rate)} style={{ padding: '6px 10px', background: 'var(--primary-bg)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>✏️ திருத்து</button>
                      <button onClick={() => handleDelete(rate.id)} style={{ padding: '6px 10px', background: '#FEF2F2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: 600 }}>🗑️ நீக்கு</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketRatesManager;
