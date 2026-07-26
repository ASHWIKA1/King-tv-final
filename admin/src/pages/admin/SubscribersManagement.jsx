import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Trash2, UserCheck, UserX, Mail, Phone, Search, Download, Users, TrendingUp, UserMinus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const formatDate = (val) => {
  if (!val) return '—';
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    return new Date(y, m - 1, d).toLocaleDateString();
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

const SubscribersManagement = () => {
  const { user: currentUser } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, size: 20 });
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      const res = await api.get(`/newsletter/getAll?${params}`);
      const data = res.data;
      const list = data.content || data || [];
      setSubscribers(list);
      setTotal(data.totalElements || list.length);
      setTotalPages(data.totalPages || Math.ceil((data.totalElements || list.length) / 20));
      // Calculate stats from data
      if (data.totalElements) {
        setStats(prev => ({ ...prev, total: data.totalElements }));
      }
    } catch (err) {
      console.error('Failed to fetch subscribers', err);
      setError('Failed to connect to the server. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchSubscribers();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Change status to ${newStatus}?`)) return;
    try {
      await api.patch('/newsletter/changeStatus', { id, status: newStatus });
      fetchSubscribers();
    } catch {
      alert('Failed to update status');
    }
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm('Delete this subscription permanently?')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      fetchSubscribers();
    } catch {
      alert('Failed to delete subscriber');
    }
  };

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const inactiveCount = subscribers.filter(s => s.status !== 'active').length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={26} color="var(--primary)" /> Subscribers
          </h1>
          <p className="text-secondary">Manage newsletter and push notification subscribers.</p>
        </div>
        <button
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
          onClick={() => {
            const csv = [
              ['Name', 'Email', 'Mobile', 'Status', 'Subscribed On'],
              ...subscribers.map(s => [s.name || '', s.email || '', s.mobile || '', s.status || '', formatDate(s.createdAt)])
            ].map(r => r.join(',')).join('\n');
            const a = document.createElement('a');
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            a.download = 'subscribers.csv';
            a.click();
          }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Subscribers', value: total, icon: Users, color: 'var(--primary)' },
          { label: 'Active', value: subscribers.filter(s => s.status === 'active').length, icon: UserCheck, color: '#10B981' },
          { label: 'Inactive / Suspended', value: subscribers.filter(s => s.status !== 'active').length, icon: UserMinus, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search row */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.2rem' }}
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
        <select
          className="form-control"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
          style={{ maxWidth: '160px' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel table-container" style={{ padding: 0 }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Subscribed On</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</td></tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Users size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.25 }} />
                  <div style={{ color: 'var(--text-muted)' }}>No subscribers found.</div>
                </td>
              </tr>
            ) : (
              subscribers.map(sub => {
                const isActive = sub.status === 'active';
                return (
                  <tr key={sub.subscriberId || sub.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sub.name || 'Anonymous'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {sub.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                            <Mail size={12} color="var(--text-muted)" /> {sub.email}
                          </div>
                        )}
                        {sub.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Phone size={12} /> {sub.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`}>
                        {sub.status || 'unknown'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {formatDate(sub.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem' }}
                          title={isActive ? 'Suspend' : 'Activate'}
                          onClick={() => toggleStatus(sub.subscriberId || sub.id, sub.status)}
                        >
                          {isActive ? <UserX size={15} color="#F59E0B" /> : <UserCheck size={15} color="#10B981" />}
                        </button>
                        <button
                          className="btn"
                          style={{ padding: '0.35rem', background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                          title="Delete"
                          onClick={() => deleteSubscriber(sub.subscriberId || sub.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {page + 1} of {totalPages} · {total} total subscribers
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <button className="btn btn-secondary" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribersManagement;
