import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, XCircle, AlertOctagon, RefreshCw, Trash2, ExternalLink, Shield } from 'lucide-react';
import api from '../../api';

const CommentsModeration = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [msg, setMsg] = useState(null);

  const showMsg = (text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/comments');
      // Sort newest first
      const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sorted);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatusChange = async (id, newStatus, currentComment) => {
    try {
      await api.put(`/comments/${id}`, { ...currentComment, status: newStatus });
      setComments(comments.map(c => c.id === id ? { ...c, status: newStatus } : c));
      showMsg(`Comment moved to ${newStatus}`);
    } catch (err) {
      showMsg("Failed to update status", true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Are you sure you want to permanently delete this comment?")) {
      try {
        await api.delete(`/comments/${id}`);
        setComments(comments.filter(c => c.id !== id));
        showMsg("Comment deleted permanently");
      } catch (err) {
        showMsg("Failed to delete comment", true);
      }
    }
  };

  const [search, setSearch] = useState('');
  
  const filteredComments = comments.filter(c => 
    (c.status || 'pending') === activeTab &&
    (c.commentorName?.toLowerCase().includes(search.toLowerCase()) || 
     c.commentText?.toLowerCase().includes(search.toLowerCase()) ||
     c.commentorEmail?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ padding: "1.5rem" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", fontSize: "1.75rem", fontWeight: 700 }}>
            <MessageSquare size={26} color="var(--primary)" /> Comments Moderation
          </h1>
          <p className="text-secondary" style={{ color: "var(--text-secondary)" }}>Review and moderate user comments before they appear on articles.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search comments..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: '250px' }}
          />
          <button className="btn btn-secondary" onClick={fetchComments} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: "0.75rem 1rem", marginBottom: "1.5rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem",
          background: msg.isError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          color: msg.isError ? "#EF4444" : "#10B981",
          border: `1px solid ${msg.isError ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}>
          {msg.isError ? <AlertOctagon size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Comments", value: comments.length, color: "var(--primary)", bg: "var(--primary-glow)" },
          { label: "Pending", value: comments.filter(c => (c.status || 'pending') === 'pending').length, color: "var(--primary)", bg: "var(--primary-glow)" },
          { label: "Approved", value: comments.filter(c => c.status === 'approved').length, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
          { label: "Spam", value: comments.filter(c => c.status === 'spam').length, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="glass-panel" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
          <button 
            onClick={() => setActiveTab('pending')}
            style={{ flex: 1, padding: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
                     color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-secondary)', 
                     fontWeight: activeTab === 'pending' ? 600 : 500, 
                     borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : '2px solid transparent' }}
          >
            Pending ({comments.filter(c => (c.status || 'pending') === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            style={{ flex: 1, padding: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
                     color: activeTab === 'approved' ? '#10B981' : 'var(--text-secondary)', 
                     fontWeight: activeTab === 'approved' ? 600 : 500, 
                     borderBottom: activeTab === 'approved' ? '2px solid #10B981' : '2px solid transparent' }}
          >
            Approved ({comments.filter(c => c.status === 'approved').length})
          </button>
          <button 
            onClick={() => setActiveTab('spam')}
            style={{ flex: 1, padding: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
                     color: activeTab === 'spam' ? '#EF4444' : 'var(--text-secondary)', 
                     fontWeight: activeTab === 'spam' ? 600 : 500, 
                     borderBottom: activeTab === 'spam' ? '2px solid #EF4444' : '2px solid transparent' }}
          >
            Spam ({comments.filter(c => c.status === 'spam').length})
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading comments...</div>
          ) : filteredComments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <Shield size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
              <div>No {activeTab} comments found.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredComments.map(c => (
                <div key={c.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{c.commentorName}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.commentorEmail}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Posted on {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a 
                        href={`http://localhost:3000/article/${c.articleId}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem 0.6rem', color: 'var(--text-primary)' }} 
                        title="View Context/Article"
                      >
                        <ExternalLink size={16} />
                      </a>
                      {activeTab !== 'approved' && (
                        <button onClick={() => handleStatusChange(c.id, 'approved', c)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#10B981' }} title="Approve">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {activeTab !== 'spam' && (
                        <button onClick={() => handleStatusChange(c.id, 'spam', c)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#F59E0B' }} title="Mark as Spam">
                          <AlertOctagon size={16} />
                        </button>
                      )}
                      {activeTab !== 'pending' && (
                        <button onClick={() => handleStatusChange(c.id, 'pending', c)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: 'var(--text-secondary)' }} title="Move to Pending">
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(c.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} title="Delete Permanently">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', border: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {c.commentText}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsModeration;
