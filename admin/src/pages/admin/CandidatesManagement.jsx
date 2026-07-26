import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Search, Eye, ShieldAlert, CheckCircle, X, Shield, Lock, Unlock, FileText, Download, RefreshCw, ArrowLeft, User } from 'lucide-react';

const formatDate = (val) => {
  if (!val) return '—';
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    return new Date(y, m - 1, d).toLocaleDateString();
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

const renderAvatar = (name, logoUrl) => {
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={name} 
        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)', backgroundColor: '#ffffff' }} 
      />
    );
  }
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
  const charCodeSum = name ? name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : 0;
  const bgColor = colors[charCodeSum % colors.length];

  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: bgColor,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '0.85rem'
    }}>
      {initial}
    </div>
  );
};

const CandidatesManagement = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDetail, setCandidateDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Suspend Modal
  const [suspendingCandidate, setSuspendingCandidate] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [submittingSuspend, setSubmittingSuspend] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/jobs/candidates');
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Failed to load candidates", err);
      setError("Failed to fetch candidate accounts. Please ensure the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const loadCandidateDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await api.get(`/admin/jobs/candidates/${id}`);
      setCandidateDetail(res.data);
    } catch (err) {
      alert("Failed to load candidate details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleViewDetails = (cand) => {
    setSelectedCandidate(cand);
    loadCandidateDetail(cand.id);
  };

  const openSuspendModal = (cand) => {
    setSuspendingCandidate(cand);
    setSuspendReason('');
  };

  const closeSuspendModal = () => {
    setSuspendingCandidate(null);
    setSuspendReason('');
  };

  const submitSuspend = async () => {
    if (!suspendReason.trim()) {
      alert("Please provide a suspension reason.");
      return;
    }
    if (!window.confirm(`Are you sure you want to suspend candidate "${suspendingCandidate.name}"? This action will block them from submitting further applications.`)) {
      return;
    }
    setSubmittingSuspend(true);
    try {
      await api.patch(`/admin/jobs/candidates/${suspendingCandidate.id}/suspend?reason=${encodeURIComponent(suspendReason)}`);
      fetchCandidates();
      closeSuspendModal();
      if (selectedCandidate && selectedCandidate.id === suspendingCandidate.id) {
        loadCandidateDetail(suspendingCandidate.id);
      }
    } catch (err) {
      alert("Failed to suspend candidate.");
    } finally {
      setSubmittingSuspend(false);
    }
  };

  const handleUnsuspend = async (cand) => {
    if (!window.confirm(`Are you sure you want to unsuspend candidate "${cand.name}"?`)) return;
    try {
      await api.patch(`/admin/jobs/candidates/${cand.id}/unsuspend`);
      fetchCandidates();
      if (selectedCandidate && selectedCandidate.id === cand.id) {
        loadCandidateDetail(cand.id);
      }
    } catch (err) {
      alert("Failed to unsuspend candidate.");
    }
  };

  // Filter list
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name?.toLowerCase().includes(search.toLowerCase()) || 
                          cand.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cand.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page" style={{ padding: '1.5rem', color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => navigate('/admin/community')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
            title="Back to Community Modules"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Candidates Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Oversight and moderation of Jobs Board registered applicant profiles.</p>
          </div>
        </div>
        <button className="glass-btn" onClick={fetchCandidates} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px', color: '#EF4444', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="glass-input"
            placeholder="Search by candidate name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
          <select className="glass-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Candidates Table & Empty State wrapper */}
      <div className="table-container" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading candidate profiles...</div>
        ) : filteredCandidates.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <User size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No candidates found matching criteria</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Try adjusting your search query or status filter.</p>
            {(search || statusFilter !== 'all') && (
              <button 
                className="btn btn-secondary" 
                onClick={() => { setSearch(''); setStatusFilter('all'); }}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px' }}>Name</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Applications</th>
                <th style={{ padding: '12px 16px' }}>Joined</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((cand, index) => (
                <tr key={cand.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {renderAvatar(cand.name, null)}
                      <span style={{ fontWeight: 600 }}>{cand.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{cand.email}</td>
                  <td style={{ padding: '12px 16px' }}>{cand.location}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className="badge badge-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                      {cand.applicationsCount}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{formatDate(cand.dateJoined)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${cand.status === 'suspended' ? 'badge-danger' : 'badge-success'}`} style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      {cand.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleViewDetails(cand)} title="View Applications Profile">
                        <Eye size={14} /> View
                      </button>
                      {cand.status === 'suspended' ? (
                        <button className="btn btn-secondary text-success" style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid #10b981', color: '#10b981' }} onClick={() => handleUnsuspend(cand)} title="Unsuspend Account">
                          <Unlock size={14} /> Unsuspend
                        </button>
                      ) : (
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ffffff' }} onClick={() => openSuspendModal(cand)} title="Suspend Account">
                          <Lock size={14} /> Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel modal-content" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} className="text-primary" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Candidate Profile details</h3>
              </div>
              <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {loadingDetail ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching candidate details...</div>
            ) : !candidateDetail ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Could not load details view.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Profile Overview Card */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0' }}>{candidateDetail.candidate.name}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div><strong>Email:</strong> {candidateDetail.candidate.email || '—'}</div>
                    <div><strong>Phone:</strong> {candidateDetail.candidate.phone || '—'}</div>
                    <div><strong>Location:</strong> {candidateDetail.candidate.location || 'N/A'}</div>
                    <div><strong>Skills / Tags:</strong> {candidateDetail.candidate.skills || 'None Listed'}</div>
                  </div>

                  {candidateDetail.candidate.resumeUrl && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> Resume Uploaded</span>
                      <a href={candidateDetail.candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="glass-btn btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                        <Download size={12} /> View/Download Resume
                      </a>
                    </div>
                  )}
                </div>

                {/* Application History */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={18} /> Full Application History ({candidateDetail.applications.length})</h4>
                  <div className="glass-panel" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {candidateDetail.applications.length === 0 ? (
                      <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No job applications recorded yet.</div>
                    ) : (
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '8px 12px' }}>Job Title</th>
                            <th style={{ padding: '8px 12px' }}>Company</th>
                            <th style={{ padding: '8px 12px' }}>Applied Date</th>
                            <th style={{ padding: '8px 12px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidateDetail.applications.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 600 }}>{app.jobTitle}</td>
                              <td style={{ padding: '8px 12px' }}>{app.companyName}</td>
                              <td style={{ padding: '8px 12px' }}>{formatDate(app.appliedAt)}</td>
                              <td style={{ padding: '8px 12px' }}>
                                <span className={`badge ${app.status === 'Applied' ? 'badge-primary' : app.status === 'Selected' ? 'badge-success' : 'badge-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                  {app.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* Suspend Reason Modal */}
      {suspendingCandidate && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="glass-panel modal-content" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EF4444' }}>⚠️ Suspend Candidate Account</h3>
              <button onClick={closeSuspendModal} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Please specify the policy violation or abuse handling reason for suspending candidate <strong>{suspendingCandidate.name}</strong>. This action will block them from submitting further applications.
            </p>
            <textarea
              className="glass-input"
              rows={4}
              placeholder="Provide a valid reason (required, logged to audit system)..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', marginBottom: '1.5rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="glass-btn" onClick={closeSuspendModal}>Cancel</button>
              <button className="btn btn-danger" onClick={submitSuspend} disabled={submittingSuspend} style={{ color: 'white' }}>
                {submittingSuspend ? 'Suspending...' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CandidatesManagement;
