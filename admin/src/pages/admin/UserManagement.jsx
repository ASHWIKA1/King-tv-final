import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api';
import { Plus, Edit2, Trash2, Shield, UserX, UserCheck, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Helper: handles LocalDateTime array [y,m,d,h,min,s] or ISO string or epoch ms
const formatDate = (val, opts = {}) => {
  if (!val) return '—';
  let d;
  if (Array.isArray(val)) {
    // Java LocalDateTime serialized as [year, month, day, hour, minute, second, nano]
    const [year, month, day, hour = 0, min = 0, sec = 0] = val;
    d = new Date(year, month - 1, day, hour, min, sec);
  } else if (typeof val === 'number') {
    // Epoch milliseconds
    d = new Date(val > 1e10 ? val : val * 1000);
  } else {
    d = new Date(val);
  }
  if (isNaN(d.getTime())) return '—';
  return opts.full ? d.toLocaleString() : d.toLocaleDateString();
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', role: '', phoneNumber: '', websiteUrl: '', location: '', districtId: '', password: '' });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', fullName: '', role: 'MOBILE_JOURNALIST', password: '', phoneNumber: '', location: '', districtId: '' });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [districts, setDistricts] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({ page: page, size: 20 });
      if (search) queryParams.append('search', search);
      if (roleFilter) queryParams.append('role', roleFilter);

      const res = await api.get(`/admin/users?${queryParams.toString()}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Failed to connect to the server. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchAvailableRoles();
    api.get('/districts')
      .then(res => setDistricts(res.data || []))
      .catch(err => console.warn("Failed to load districts", err));
  }, []);

  const fetchAvailableRoles = async () => {
    try {
      const res = await api.get('/admin/roles');
      setAvailableRoles(res.data.roles);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    if(window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) {
      try {
        await api.put(`/admin/users/${id}`, { isActive: !currentStatus });
        fetchUsers();
      } catch (e) {
        alert("Failed to update status");
      }
    }
  };

  const deleteUser = async (id) => {
    if(window.confirm("CRITICAL: Delete this user permanently?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (e) {
        alert("Failed to delete user");
      }
    }
  };

  const openEditModal = async (u) => {
    setEditingUser(u);
    let districtId = '';
    try {
      const res = await api.get(`/admin/users/${u.id}`);
      if (res.data && res.data.districts && res.data.districts.length > 0) {
        districtId = res.data.districts[0].districtId;
      }
    } catch (err) {
      console.warn("Failed to load user district details", err);
    }
    
    setEditFormData({ 
      fullName: u.fullName || '', 
      role: u.role, 
      phoneNumber: u.phoneNumber || '', 
      websiteUrl: u.websiteUrl || '',
      location: u.location || '',
      districtId: districtId,
      password: '' // empty means don't change
    });
  };

  const submitEditUser = async () => {
    if (editingUser) {
      try {
        const payload = { ...editFormData };
        if (!payload.password) delete payload.password; // Don't send empty password

        await api.put(`/admin/users/${editingUser.id}`, payload);
        
        if (payload.districtId) {
          await api.post(`/admin/users/${editingUser.id}/districts`, {
            districtIds: [parseInt(payload.districtId)]
          });
        }
        
        fetchUsers();
        setEditingUser(null);
      } catch (e) {
        alert("Failed to update user");
      }
    }
  };

  const submitNewUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post(`/admin/users`, newUser);
      const createdUser = res.data;

      if (newUser.districtId && createdUser && createdUser.id) {
        await api.post(`/admin/users/${createdUser.id}/districts`, {
          districtIds: [parseInt(newUser.districtId)]
        });
      }

      fetchUsers();
      setIsAddingUser(false);
      setNewUser({ email: '', fullName: '', role: 'MOBILE_JOURNALIST', password: '', phoneNumber: '', location: '', districtId: '' });
      alert("User added successfully!");
    } catch (e) {
      alert("Failed to create user. Email may already exist.");
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>User Management</h1>
          <p className="text-secondary">Manage staff, journalists, and admin accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddingUser(true)}>
          <Plus size={16} /> Add User
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select 
          className="form-control" 
          value={roleFilter} 
          onChange={e => setRoleFilter(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="CHIEF_EDITOR">Chief Editor</option>
          <option value="DISTRICT_ADMIN">District Admin</option>
          <option value="MOBILE_JOURNALIST">Mobile Journalist</option>
          <option value="SUBSCRIBER">Subscriber</option>
          <option value="READER">Reader</option>
        </select>
      </div>

      <div className="glass-panel table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--danger)' }}>{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}><UserX size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} /><br/>No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.fullName || u.email.split('@')[0]}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'SUPER_ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                      <Shield size={12} style={{ marginRight: '4px' }} />
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-warning'}`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td><div style={{ fontSize: '0.9rem' }}>{formatDate(u.createdAt)}</div></td>
                  <td>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {u.lastLogin ? formatDate(u.lastLogin, { full: true }) : 'Never'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {currentUser?.role === 'SUPER_ADMIN' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem' }} 
                          title="Edit Role"
                          onClick={() => openEditModal(u)}
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem', color: u.isActive ? 'var(--warning)' : 'var(--success)' }} 
                        title={u.isActive ? "Suspend" : "Activate"}
                        onClick={() => toggleStatus(u.id, u.isActive)}
                      >
                        {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem', color: 'var(--danger)' }} 
                        title="Delete"
                        onClick={() => deleteUser(u.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Edit User</h3>
              <button className="btn-toggle" onClick={() => setEditingUser(null)}><X size={18} /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email (Cannot be changed)</label>
              <input type="text" className="form-control" value={editingUser.email} disabled style={{opacity: 0.7}} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={editFormData.fullName} onChange={e => setEditFormData({...editFormData, fullName: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}>
                {availableRoles.map(r => (
                  <option key={r.id} value={r.name}>{r.name.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={editFormData.phoneNumber} onChange={e => setEditFormData({...editFormData, phoneNumber: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" value={editFormData.location} onChange={e => setEditFormData({...editFormData, location: e.target.value})} placeholder="e.g. Chennai, TN" />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned District</label>
              <select className="form-control" value={editFormData.districtId} onChange={e => setEditFormData({...editFormData, districtId: e.target.value})}>
                <option value="">— Select District —</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.nameEn}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reset Password (leave blank to keep current)</label>
              <input type="password" className="form-control" value={editFormData.password} onChange={e => setEditFormData({...editFormData, password: e.target.value})} placeholder="New password" />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitEditUser}>Save Changes</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add User Modal */}
      {isAddingUser && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Add New User</h3>
              <button className="btn-toggle" onClick={() => setIsAddingUser(false)}><X size={18} /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} placeholder="e.g. John Doe" />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="john@example.com" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Temporary Password</label>
              <input type="password" className="form-control" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="********" />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-control" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                {availableRoles.map(r => (
                  <option key={r.id} value={r.name}>{r.name.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={newUser.phoneNumber} onChange={e => setNewUser({...newUser, phoneNumber: e.target.value})} placeholder="e.g. +91 98765 43210" />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" value={newUser.location} onChange={e => setNewUser({...newUser, location: e.target.value})} placeholder="e.g. Coimbatore, TN" />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned District</label>
              <select className="form-control" value={newUser.districtId} onChange={e => setNewUser({...newUser, districtId: e.target.value})}>
                <option value="">— Select District —</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.nameEn}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddingUser(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitNewUser}>Create User</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserManagement;
