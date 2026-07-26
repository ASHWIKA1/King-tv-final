import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Edit2, Trash2, HelpCircle, X, PlusCircle, MinusCircle } from 'lucide-react';

const SurveyBuilder = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', status: 'ACTIVE', options: ['Option 1', 'Option 2'], targetModule: 'GLOBAL' });

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/surveys');
      setSurveys(res.data.content || []);
    } catch (error) {
      console.error("Failed to load surveys", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        targetModule: formData.targetModule,
        optionsJson: JSON.stringify(formData.options)
      };

      if (formData.id) {
        await api.put(`/admin/surveys/${formData.id}`, payload);
      } else {
        await api.post('/admin/surveys', payload);
      }
      setShowModal(false);
      fetchSurveys();
    } catch (err) {
      alert("Failed to save survey");
    }
  };

  const handleDelete = async (id) => {
    // Note: Backend might not have a DELETE /admin/surveys endpoint yet.
    // If not, we can just set status to CLOSED or rely on a generic delete.
    if (window.confirm("Are you sure you want to delete this poll? (It will be hidden from users)")) {
      try {
        await api.put(`/admin/surveys/${id}`, { status: 'CLOSED' });
        fetchSurveys();
      } catch (err) {
        alert("Failed to close/delete poll");
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, `Option ${formData.options.length + 1}`] });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Survey & Poll Builder</h1>
            <p className="text-secondary">Create interactive polls and embed them in articles or the homepage.</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => { setFormData({ id: null, title: '', description: '', status: 'ACTIVE', options: ['Option 1', 'Option 2'], targetModule: 'GLOBAL' }); setShowModal(true); }}
          >
            <Plus size={16} /> Create New Poll
          </button>
        </div>

        <div className="glass-panel table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Status</th>
                <th>Created At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading surveys...</td></tr>
              ) : surveys.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                    <HelpCircle size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <div style={{ color: 'var(--text-muted)' }}>No surveys created yet.</div>
                  </td>
                </tr>
              ) : (
                surveys.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td>
                      <span className={`badge ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem' }}
                          onClick={() => {
                            const parsedOptions = s.optionsJson ? JSON.parse(s.optionsJson) : ['Option 1', 'Option 2'];
                            setFormData({ id: s.id, title: s.title, description: s.description || '', status: s.status, options: parsedOptions, targetModule: s.targetModule || 'GLOBAL' });
                            setShowModal(true);
                          }}
                        ><Edit2 size={16} /></button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem', color: 'var(--danger)' }}
                          onClick={() => handleDelete(s.id)}
                        ><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Poll' : 'Create Poll'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>Question (Title)</label>
                <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" />
              </div>
              
              <div className="form-group">
                <label>Options</label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="form-control" value={opt} onChange={e => handleOptionChange(idx, e.target.value)} required />
                    <button type="button" className="btn btn-secondary" onClick={() => removeOption(idx)} disabled={formData.options.length <= 2}>
                      <MinusCircle size={16} color="var(--danger)" />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addOption} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', marginTop: '0.5rem' }}>
                  <PlusCircle size={14} /> Add Option
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Status</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Target Module</label>
                  <select className="form-control" value={formData.targetModule} onChange={e => setFormData({...formData, targetModule: e.target.value})}>
                    <option value="GLOBAL">Global / Homepage</option>
                    <option value="ARTICLE">Article Page</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Poll</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyBuilder;
