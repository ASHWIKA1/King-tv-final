import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Folder, MapPin, Edit2, Trash2, X } from 'lucide-react';

const TaxonomyManager = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCatModal, setShowCatModal] = useState(false);
  const [catFormData, setCatFormData] = useState({ id: null, name: '', nameTa: '', slug: '', icon: '', color: '#3B82F6', isNav: true, isActive: true, displayOrder: 0 });
  
  const [showSubCatModal, setShowSubCatModal] = useState(false);
  const [subCatFormData, setSubCatFormData] = useState({ id: null, categoryId: '', name: '', nameTa: '', slug: '', displayOrder: 0, status: 'active' });

  const [showLocModal, setShowLocModal] = useState(false);
  const [locFormData, setLocFormData] = useState({ id: null, nameEn: '', nameTa: '' });

  const fetchTaxonomies = async () => {
    setLoading(true);
    try {
      const catRes = await api.get('/admin/taxonomy/categories');
      const subRes = await api.get('/admin/taxonomy/subcategories');
      const locRes = await api.get('/admin/taxonomy/districts');
      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);
      setLocations(locRes.data || []);
    } catch (error) {
      console.error("Failed to load taxonomies", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTaxonomies();
  }, []);

  // --- Category Handlers ---
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (catFormData.id) {
        await api.put(`/admin/taxonomy/categories/${catFormData.id}`, catFormData);
      } else {
        await api.post('/admin/taxonomy/categories', catFormData);
      }
      setShowCatModal(false);
      fetchTaxonomies();
    } catch (err) {
      alert("Failed to save category");
    }
  };

  const handleCatDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/taxonomy/categories/${id}`);
        fetchTaxonomies();
      } catch (err) {
        alert("Failed to delete category");
      }
    }
  };

  // --- SubCategory Handlers ---
  const handleSubCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (subCatFormData.id) {
        await api.put(`/admin/taxonomy/subcategories/${subCatFormData.id}`, subCatFormData);
      } else {
        await api.post('/admin/taxonomy/subcategories', subCatFormData);
      }
      setShowSubCatModal(false);
      fetchTaxonomies();
    } catch (err) {
      alert("Failed to save subcategory");
    }
  };

  const handleSubCatDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await api.delete(`/admin/taxonomy/subcategories/${id}`);
        fetchTaxonomies();
      } catch (err) {
        alert("Failed to delete subcategory");
      }
    }
  };

  // --- District Handlers ---
  const handleLocSubmit = async (e) => {
    e.preventDefault();
    try {
      if (locFormData.id) {
        // District update endpoint might not exist, but let's try POST if no PUT
        // Since backend doesn't have PUT /districts, we may just have to delete & recreate or rely on it not being there
        await api.post('/admin/taxonomy/districts', locFormData); 
      } else {
        await api.post('/admin/taxonomy/districts', locFormData);
      }
      setShowLocModal(false);
      fetchTaxonomies();
    } catch (err) {
      alert("Failed to save district");
    }
  };

  const handleLocDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this district?")) {
      try {
        await api.delete(`/admin/taxonomy/districts/${id}`);
        fetchTaxonomies();
      } catch (err) {
        alert("Failed to delete district");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Taxonomy Management</h1>
        <p className="text-secondary">Manage site categories, sub-categories, and geographical districts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Categories Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Folder size={18} color="var(--primary)" /> Categories</h3>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => { setCatFormData({ id: null, name: '', nameTa: '', slug: '', icon: '', isNav: true, isActive: true, displayOrder: 0 }); setShowCatModal(true); }}
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loading ? <div style={{ color: 'var(--text-muted)' }}>Loading...</div> : categories.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No categories found.</div>
            ) : categories.map(c => (
              <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.color || 'var(--primary)' }}></div>
                    <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{c.name} ({c.nameTa})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.2rem', color: 'var(--primary)', fontSize: '0.75rem' }}
                      onClick={() => { setSubCatFormData({ id: null, categoryId: c.id, name: '', nameTa: '', slug: '', displayOrder: 0, status: 'active' }); setShowSubCatModal(true); }}
                      title="Add Subcategory"
                    ><Plus size={14} /></button>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.2rem', color: 'var(--text-primary)' }}
                      onClick={() => { setCatFormData(c); setShowCatModal(true); }}
                    ><Edit2 size={14} /></button>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.2rem', color: 'var(--danger)' }}
                      onClick={() => handleCatDelete(c.id)}
                    ><Trash2 size={14} /></button>
                  </div>
                </div>

                {/* Subcategories render */}
                {subcategories.filter(sub => sub.categoryId === c.id).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                    {subcategories.filter(sub => sub.categoryId === c.id).map(sub => (
                      <div key={sub.subcategoryId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.85rem' }}>↳ {sub.name} ({sub.nameTa})</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.15rem', color: 'var(--text-primary)', border: 'none', background: 'transparent' }}
                            onClick={() => { setSubCatFormData({ id: sub.subcategoryId, ...sub }); setShowSubCatModal(true); }}
                          ><Edit2 size={12} /></button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.15rem', color: 'var(--danger)', border: 'none', background: 'transparent' }}
                            onClick={() => handleSubCatDelete(sub.subcategoryId)}
                          ><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Locations Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} color="var(--warning)" /> Locations & Districts</h3>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => { setLocFormData({ id: null, nameEn: '', nameTa: '' }); setShowLocModal(true); }}
            >
              <Plus size={14} /> Add District
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loading ? <div style={{ color: 'var(--text-muted)' }}>Loading...</div> : locations.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No locations found.</div>
            ) : locations.map(l => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 500 }}>{l.nameEn} ({l.nameTa})</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.2rem', color: 'var(--danger)' }}
                    onClick={() => handleLocDelete(l.id)}
                  ><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      {/* Category Modal */}
      {showCatModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>{catFormData.id ? 'Edit Category' : 'Add Category'}</h2>
              <button className="icon-btn" onClick={() => setShowCatModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCatSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>English Name</label>
                <input type="text" className="form-control" value={catFormData.name} onChange={e => setCatFormData({...catFormData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tamil Name</label>
                <input type="text" className="form-control" value={catFormData.nameTa} onChange={e => setCatFormData({...catFormData, nameTa: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input type="text" className="form-control" value={catFormData.slug} onChange={e => setCatFormData({...catFormData, slug: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" className="form-control" value={catFormData.displayOrder} onChange={e => setCatFormData({...catFormData, displayOrder: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Theme Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="color" value={catFormData.color || '#3B82F6'} onChange={e => setCatFormData({...catFormData, color: e.target.value})} style={{ width: '40px', height: '36px', padding: '0', border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
                    <input type="text" className="form-control" value={catFormData.color || '#3B82F6'} onChange={e => setCatFormData({...catFormData, color: e.target.value})} placeholder="#3B82F6" />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={catFormData.isNav} onChange={e => setCatFormData({...catFormData, isNav: e.target.checked})} /> Show in Navigation
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={catFormData.isActive} onChange={e => setCatFormData({...catFormData, isActive: e.target.checked})} /> Active
                </label>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCatModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* District Modal */}
      {showLocModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Add District</h2>
              <button className="icon-btn" onClick={() => setShowLocModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleLocSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>English Name</label>
                <input type="text" className="form-control" value={locFormData.nameEn} onChange={e => setLocFormData({...locFormData, nameEn: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tamil Name</label>
                <input type="text" className="form-control" value={locFormData.nameTa} onChange={e => setLocFormData({...locFormData, nameTa: e.target.value})} required />
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLocModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save District</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SubCategory Modal */}
      {showSubCatModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>{subCatFormData.id ? 'Edit Subcategory' : 'Add Subcategory'}</h2>
              <button className="icon-btn" onClick={() => setShowSubCatModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubCatSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>English Name</label>
                <input type="text" className="form-control" value={subCatFormData.name} onChange={e => setSubCatFormData({...subCatFormData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tamil Name</label>
                <input type="text" className="form-control" value={subCatFormData.nameTa} onChange={e => setSubCatFormData({...subCatFormData, nameTa: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input type="text" className="form-control" value={subCatFormData.slug} onChange={e => setSubCatFormData({...subCatFormData, slug: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input type="number" className="form-control" value={subCatFormData.displayOrder} onChange={e => setSubCatFormData({...subCatFormData, displayOrder: parseInt(e.target.value)})} />
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubCatModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Subcategory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxonomyManager;
