import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Search, Eye, ShieldAlert, CheckCircle, X, Shield, Lock, Unlock, FileText, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react';

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

const EmployersManagement = () => {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [employerDetail, setEmployerDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Suspend Modal
  const [suspendingEmployer, setSuspendingEmployer] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [submittingSuspend, setSubmittingSuspend] = useState(false);

  const fetchEmployers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/jobs/employers');
      setEmployers(res.data || []);
    } catch (err) {
      console.error("Failed to load employers", err);
      setError("Failed to fetch employer accounts. Please ensure the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const loadEmployerDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await api.get(`/admin/jobs/employers/${id}`);
      setEmployerDetail(res.data);
    } catch (err) {
      alert("Failed to load employer details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleViewDetails = (emp) => {
    setSelectedEmployer(emp);
    loadEmployerDetail(emp.id);
  };

  const openSuspendModal = (emp) => {
    setSuspendingEmployer(emp);
    setSuspendReason('');
  };

  const closeSuspendModal = () => {
    setSuspendingEmployer(null);
    setSuspendReason('');
  };

  const submitSuspend = async () => {
    if (!suspendReason.trim()) {
      alert("Please provide a suspension reason.");
      return;
    }
    if (!window.confirm(`Are you sure you want to suspend the account of "${suspendingEmployer.companyName}"? This will deactivate all their active job postings.`)) {
      return;
    }
    setSubmittingSuspend(true);
    try {
      await api.patch(`/admin/jobs/employers/${suspendingEmployer.id}/suspend?reason=${encodeURIComponent(suspendReason)}`);
      fetchEmployers();
      closeSuspendModal();
      if (selectedEmployer && selectedEmployer.id === suspendingEmployer.id) {
        // refresh detail view too
        loadEmployerDetail(suspendingEmployer.id);
      }
    } catch (err) {
      alert("Failed to suspend employer.");
    } finally {
      setSubmittingSuspend(false);
    }
  };

  const handleUnsuspend = async (emp) => {
    if (!window.confirm(`Are you sure you want to unsuspend "${emp.companyName}"?`)) return;
    try {
      await api.patch(`/admin/jobs/employers/${emp.id}/unsuspend`);
      fetchEmployers();
      if (selectedEmployer && selectedEmployer.id === emp.id) {
        loadEmployerDetail(emp.id);
      }
    } catch (err) {
      alert("Failed to unsuspend employer.");
    }
  };

  // Filter list
  const filteredEmployers = employers.filter(emp => {
    const matchesSearch = emp.companyName?.toLowerCase().includes(search.toLowerCase()) || 
                          emp.contact?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status?.toLowerCase() === statusFilter.toLowerCase();
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Employers Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Oversight and moderation of Jobs Board registered employer profiles.</p>
          </div>
        </div>
        <button className="glass-btn" onClick={fetchEmployers} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            placeholder="Search by company name or contact..."
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

      {/* Employers Table */}
      <div className="table-container" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading employer accounts...</div>
        ) : filteredEmployers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No employers found matching criteria.</div>
        ) : (
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px' }}>Company</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Active Jobs</th>
                <th style={{ padding: '12px 16px' }}>Joined</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployers.map((emp, index) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {renderAvatar(emp.companyName, emp.logo)}
                      <span style={{ fontWeight: 600 }}>{emp.companyName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{emp.contact}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span className="badge badge-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                      {emp.activeJobPostings}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{formatDate(emp.dateJoined)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${emp.status === 'suspended' ? 'badge-danger' : 'badge-success'}`} style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleViewDetails(emp)} title="View Detail Profile">
                        <Eye size={14} /> View
                      </button>
                      {emp.status === 'suspended' ? (
                        <button className="btn btn-secondary text-success" style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid #10b981', color: '#10b981' }} onClick={() => handleUnsuspend(emp)} title="Unsuspend Account">
                          <Unlock size={14} /> Unsuspend
                        </button>
                      ) : (
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ffffff' }} onClick={() => openSuspendModal(emp)} title="Suspend Account">
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

      {/* Employer Detail Modal */}
      {selectedEmployer && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel modal-content" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} className="text-primary" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Employer Profile Details</h3>
              </div>
              <button onClick={() => setSelectedEmployer(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {loadingDetail ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching profile details...</div>
            ) : !employerDetail ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Could not load detail view.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Profile Overview Card */}
                <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {employerDetail.company.logo && (
                    <img src={employerDetail.company.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', background: '#fff', border: '1px solid var(--border-color)' }} />
                  )}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px 0' }}>{employerDetail.company.companyName}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 10px 0' }}>{employerDetail.company.industry || 'No Industry Specified'}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div><strong>Email:</strong> {employerDetail.company.email || '—'}</div>
                      <div><strong>Phone:</strong> {employerDetail.company.phone || '—'}</div>
                      <div><strong>Founded:</strong> {employerDetail.company.foundedYear || '—'}</div>
                      <div><strong>Employees:</strong> {employerDetail.company.employeeCount || '—'}</div>
                      {employerDetail.company.website && (
                        <div><strong>Website:</strong> <a href={employerDetail.company.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{employerDetail.company.website} <ExternalLink size={12} style={{ display: 'inline' }} /></a></div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem' }}>
                  <strong>About:</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>{employerDetail.company.about || 'No details provided.'}</p>
                </div>

                {/* Job Postings */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={18} /> Active Postings ({employerDetail.postings.length})</h4>
                  <div className="glass-panel" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {employerDetail.postings.length === 0 ? (
                      <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No job postings recorded yet.</div>
                    ) : (
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '8px 12px' }}>Job Title</th>
                            <th style={{ padding: '8px 12px' }}>Location</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center' }}>Applications</th>
                            <th style={{ padding: '8px 12px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employerDetail.postings.map(post => (
                            <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 600 }}>{post.title}</td>
                              <td style={{ padding: '8px 12px' }}>{post.location}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700 }}>{post.applicantCount}</td>
                              <td style={{ padding: '8px 12px' }}>
                                <span className={`badge ${post.status === 'active' ? 'badge-success' : 'badge-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                  {post.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Reports Against Employer */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444' }}><ShieldAlert size={18} /> Policy Violations / Reports ({employerDetail.reports.length})</h4>
                  <div className="glass-panel" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {employerDetail.reports.length === 0 ? (
                      <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No policy violations reported against this employer.</div>
                    ) : (
                      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '8px 12px' }}>Reporter</th>
                            <th style={{ padding: '8px 12px' }}>Reason</th>
                            <th style={{ padding: '8px 12px' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employerDetail.reports.map(rep => (
                            <tr key={rep.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 600 }}>{rep.reporterName}</td>
                              <td style={{ padding: '8px 12px', color: '#EF4444' }}>{rep.reason}</td>
                              <td style={{ padding: '8px 12px' }}>{formatDate(rep.createdAt)}</td>
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
      {suspendingEmployer && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="glass-panel modal-content" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EF4444' }}>⚠️ Suspend Employer Account</h3>
              <button onClick={closeSuspendModal} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Please specify the policy violation or abuse handling reason for suspending <strong>{suspendingEmployer.companyName}</strong>. This action will hide all their job postings from public views.
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

export default EmployersManagement;
