import React, { useState, useEffect } from 'react';
import api from '../../api';
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';

const ContentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/content-review/articles');
      setQueue(res.data.articles || []);
    } catch (error) {
      console.error("Failed to fetch queue", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (id, action) => {
    const isApprove = action === 'approve';
    let reason = '';
    
    if (!isApprove) {
      reason = window.prompt("Enter reason for rejection:");
      if (reason === null) return; // User cancelled
    } else {
      if(!window.confirm("Approve and publish this content?")) return;
    }

    try {
      await api.put(`/admin/content-review/articles/${id}/${action}`, { reason });
      fetchQueue();
    } catch (e) {
      alert(`Failed to ${action} content`);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Content Review Queue</h1>
        <p className="text-secondary">Review submissions from Mobile Journalists, Institution Logins, and public UGC.</p>
      </div>

      <div className="glass-panel table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title / Content</th>
              <th>Submitter Info</th>
              <th>Type</th>
              <th>Submitted Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading queue...</td></tr>
            ) : queue.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                  <CheckCircle size={48} color="var(--success)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <div style={{ color: 'var(--text-muted)' }}>The review queue is empty. You're all caught up!</div>
                </td>
              </tr>
            ) : (
              queue.map(item => (
                <tr key={item.id}>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.summary || item.contentSnippet}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.authorName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{item.authorRole.replace('_', ' ')}</div>
                  </td>
                  <td>
                    <span className={`badge ${item.contentType === 'VIDEO' ? 'badge-warning' : 'badge-primary'}`}>
                      {item.contentType}
                    </span>
                    {item.profanityFlagged && (
                      <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }} title="Profanity detected!">
                        <AlertCircle size={12} />
                      </span>
                    )}
                  </td>
                  <td>{new Date(item.submittedAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="Preview Content">
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem', color: 'var(--success)' }} 
                        title="Approve & Publish"
                        onClick={() => handleAction(item.id, 'approve')}
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem', color: 'var(--danger)' }} 
                        title="Reject"
                        onClick={() => handleAction(item.id, 'reject')}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentQueue;
