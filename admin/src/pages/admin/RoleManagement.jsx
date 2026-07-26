import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Plus, Edit2, Check, X, ShieldAlert, Key, Trash2 } from 'lucide-react';

const RoleManagement = () => {
  const { user: currentUser } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', permissions: [] });
  
  useEffect(() => {
    if (currentUser?.role === 'SUPER_ADMIN') {
      fetchRoles();
      fetchPermissions();
    } else {
      setError("Unauthorized access. Only Super Admins can manage roles.");
      setLoading(false);
    }
  }, [currentUser]);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/admin/roles');
      setRoles(res.data.roles);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      setError("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get('/admin/roles/permissions');
      setPermissions(res.data.modules);
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setIsEditing(true);
      setFormData({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => p.name)
      });
    } else {
      setIsEditing(false);
      setFormData({ id: null, name: '', description: '', permissions: [] });
    }
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permName) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(permName)
        ? prev.permissions.filter(p => p !== permName)
        : [...prev.permissions, permName];
      return { ...prev, permissions: perms };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/admin/roles/${formData.id}`, formData);
      } else {
        await api.post('/admin/roles', formData);
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (role) => {
    if (role.name === 'SUPER_ADMIN') {
      alert('Cannot delete the SUPER_ADMIN role.');
      return;
    }
    if (!window.confirm(`Delete the "${role.name}" role? This action cannot be undone.`)) return;
    try {
      await api.delete(`/admin/roles/${role.id}`);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete role.');
    }
  };

  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return (
      <div className="animate-fade-in">
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger)' }}>
          <ShieldAlert size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h2>Access Denied</h2>
          <p>Only Super Administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={24} /> Roles & Permissions
          </h1>
          <p className="text-secondary">Manage system roles and their specific access permissions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={16} /> Create Role
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--danger-glow)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="glass-panel table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
              <th>Permissions Count</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : roles.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No roles found.</td></tr>
            ) : (
              roles.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={16} color="var(--primary)" />
                      {r.name.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="text-secondary">{r.description}</td>
                  <td>
                    <span className="badge badge-primary">{r.permissions.length} permissions</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem' }} 
                        title="Edit Role"
                        onClick={() => handleOpenModal(r)}
                        disabled={r.name === 'SUPER_ADMIN'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn"
                        style={{ padding: '0.4rem', background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                        title="Delete Role"
                        onClick={() => handleDelete(r)}
                        disabled={r.name === 'SUPER_ADMIN'}
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

      {isModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '800px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>{isEditing ? 'Edit Role' : 'Create New Role'}</h3>
              <button className="btn-toggle" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Role Name {isEditing && '(Cannot be changed)'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  disabled={isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required
                />
              </div>

              <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Permissions Matrix</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(permissions).map(([module, perms]) => (
                  <div key={module} style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{module}</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {perms.map(p => (
                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                          <input 
                            type="checkbox" 
                            checked={formData.permissions.includes(p.name)}
                            onChange={() => handleTogglePermission(p.name)}
                            disabled={formData.name === 'SUPER_ADMIN'}
                          />
                          {p.description}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formData.name === 'SUPER_ADMIN'}>
                  <Check size={16} /> Save Role
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RoleManagement;
