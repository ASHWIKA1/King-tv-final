import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Activity, Clock, ShieldAlert, CheckCircle2, RefreshCw, Server, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const UptimeStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    try {
      setError(null);
      // Calls VITE_API_BASE + /uptime (resolving to VITE_API_BASE/uptime or VITE_API_BASE/v1/uptime)
      const response = await api.get('/uptime');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching uptime status:', err);
      setError(err.response?.data?.error || 'Failed to load system health status. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchStatus(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', gap: '1rem', borderRadius: '12px' }}>
        <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--primary)', opacity: 0.8 }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Retrieving system status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
          <ShieldAlert size={20} />
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>System Status Unreachable</h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{error}</p>
        <button
          onClick={() => { setLoading(true); fetchStatus(); }}
          style={{
            alignSelf: 'flex-start',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <RefreshCw size={12} /> Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  const isOnline = data.currentStatus === 'Online';
  const lastCheckFormatted = data.lastCheckTime
    ? new Date(data.lastCheckTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'N/A';

  // Prepare data for Recharts sparkline
  const chartData = (data.responseTimeHistory || []).map((item, idx) => ({
    index: idx,
    value: item.value,
  }));

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
          <Server size={16} color="var(--primary)" /> System Monitor
        </h3>
        <button
          onClick={() => fetchStatus(true)}
          disabled={refreshing}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Refresh now"
        >
          <RefreshCw className={refreshing ? 'animate-spin' : ''} size={14} style={{ color: refreshing ? 'var(--primary)' : 'inherit' }} />
        </button>
      </div>

      {/* Main Status & Details Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Status Badge & Name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {data.websiteName}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              fontWeight: 750,
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isOnline ? '#10B981' : '#EF4444',
            }}
          >
            {isOnline ? (
              <>
                <CheckCircle2 size={12} /> Online
              </>
            ) : (
              <>
                <ShieldAlert size={12} /> Offline
              </>
            )}
          </span>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
          <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2px' }}>
              <Zap size={11} /> Uptime Ratio
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.uptimePercentage}%
            </div>
          </div>
          
          <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2px' }}>
              <Activity size={11} /> Avg Response
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.averageResponseTime} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>ms</span>
            </div>
          </div>
        </div>

        {/* Recharts Response Time History Sparkline */}
        {chartData.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Response History (ms)
            </div>
            <div style={{ width: '100%', height: '35px', background: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden', padding: '2px 0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: 'var(--text-primary)' }}>
                            {payload[0].value} ms
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Footer Timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          <Clock size={10} />
          <span>Last checked at {lastCheckFormatted} (auto-refreshes every 60s)</span>
        </div>

      </div>

    </div>
  );
};

export default UptimeStatus;
