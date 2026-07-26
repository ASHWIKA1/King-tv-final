import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coins, Save, Check, AlertTriangle, User, FileText, Calendar, DollarSign } from 'lucide-react';

const RewardSystem = () => {
  const [config, setConfig] = useState({ costPerView: '0.01' });
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const configRes = await axios.get('/api/v1/admin/rewards/config', { headers: { Authorization: `Bearer ${token}` } });
      if (configRes.data) {
        setConfig(configRes.data);
      }
      
      const ledgerRes = await axios.get('/api/v1/admin/rewards/ledgers', { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(ledgerRes.data)) {
        setLedgers(ledgerRes.data);
      }
    } catch (error) {
      console.error('Error fetching reward data', error);
      showMsg('Failed to load reward settings or ledger data', true);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/v1/admin/rewards/config', config, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Earning configuration saved successfully');
    } catch (error) {
      console.error('Error updating config', error);
      showMsg('Failed to save configuration', true);
    }
  };

  if (loading) {
    return <div className="animate-fade-in" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading reward configurations...</div>;
  }

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'var(--body-bg)',
    color: 'var(--text-dark)',
    fontSize: '0.9rem',
    outline: 'none',
    width: '200px',
    transition: 'border-color 0.15s'
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coins size={24} color="var(--primary)" /> Reward System & Earnings
          </h1>
          <p className="text-secondary" style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage monetization settings, click/view payouts, and audit transactional logs across the portal.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
          padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
          background: toast.isError ? '#EF4444' : '#10B981', color: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          {toast.isError ? <AlertTriangle size={16} /> : <Check size={16} />}
          {toast.text}
        </div>
      )}

      {/* Grid Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Panel: Configuration */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Earning Configuration
          </h3>
          
          <form onSubmit={handleConfigUpdate} style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Cost Per Unique View ($)
              </label>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>$</span>
                <input 
                  type="number" 
                  step="0.001" 
                  value={config.costPerView} 
                  onChange={e => setConfig({ costPerView: e.target.value })} 
                  style={{ ...inputStyle, paddingLeft: '24px' }}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', height: '41px' }}
            >
              <Save size={15} /> Save Config
            </button>
          </form>
        </div>

        {/* Ledger Panel */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Recent Earnings Ledger
          </h3>

          {ledgers.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
              <Coins size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No earnings recorded yet</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>Payouts will appear once unique article reads occur.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Author</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Article context</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Transaction Type</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgers.slice(0, 100).map(ledger => (
                    <tr key={ledger.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}>
                      {/* Date */}
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} color="var(--primary)" />
                        {new Date(ledger.createdAt).toLocaleString()}
                      </td>

                      {/* Author ID */}
                      <td style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} style={{ opacity: 0.6 }} />
                          User ID: {ledger.authorId}
                        </span>
                      </td>

                      {/* Article ID */}
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {ledger.articleId ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FileText size={12} style={{ opacity: 0.6 }} />
                            Article ID: {ledger.articleId}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                        )}
                      </td>

                      {/* Transaction Type */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)',
                          fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)',
                          textTransform: 'uppercase', color: 'var(--text-secondary)'
                        }}>
                          {ledger.transactionType || 'VIEW_PAYOUT'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          +${parseFloat(ledger.amount || 0).toFixed(4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default RewardSystem;
