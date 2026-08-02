import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useI18n } from '../../context/I18nContext';
import { Plus, Edit2, Trash2, X, GripVertical, Menu, Layers } from 'lucide-react';

const NavbarManager = () => {
  const { t } = useI18n();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Drag and Drop States
  const [dragEnabled, setDragEnabled] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    titleEn: '',
    titleTa: '',
    linkUrl: '',
    parentId: '',
    displayOrder: 0,
    isActive: true
  });

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/menus');
      setMenus(response.data || []);
    } catch (error) {
      console.error("Failed to fetch menus", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.post('/admin/menus/publish');
      clearFrontCache();
      alert("Navigation menu published successfully! All changes are now live on the public site.");
    } catch (error) {
      console.error("Failed to publish navigation menu", error);
      alert("Failed to publish navigation menu: " + (error.response?.data?.message || error.message));
    } finally {
      setPublishing(false);
    }
  };

  const clearFrontCache = () => {
    // Clear frontend API caches so the new navbar shows up instantly for public users
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('api_cache_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.setItem('layout_updated_at', Date.now().toString());
    window.dispatchEvent(new Event('layoutUpdated'));
  };

  const handleOpenCreate = () => {
    // Find highest displayOrder among main items
    const mainItems = menus.filter(m => !m.parentId);
    const nextOrder = mainItems.length > 0 
      ? Math.max(...mainItems.map(m => m.displayOrder || 0)) + 1 
      : 0;

    setFormData({
      id: null,
      titleEn: '',
      titleTa: '',
      linkUrl: '',
      parentId: '',
      displayOrder: nextOrder,
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setFormData({
      id: item.id,
      titleEn: item.titleEn,
      titleTa: item.titleTa,
      linkUrl: item.linkUrl,
      parentId: item.parentId || '',
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        parentId: formData.parentId ? parseInt(formData.parentId) : null
      };

      if (formData.id) {
        await api.put(`/admin/menus/${formData.id}`, payload);
      } else {
        await api.post('/admin/menus', payload);
      }
      clearFrontCache();
      setShowModal(false);
      fetchMenus();
    } catch (error) {
      console.error("Failed to save menu item", error);
      alert("Failed to save menu item: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item? Any submenus will be converted to main menu items.")) {
      try {
        await api.delete(`/admin/menus/${id}`);
        clearFrontCache();
        fetchMenus();
      } catch (error) {
        console.error("Failed to delete menu item", error);
        alert("Failed to delete menu item");
      }
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, item, index) => {
    setDraggedItem(item);
    setDraggedIndex(index);
    
    // Crucial for Firefox and cross-browser HTML5 dragging support
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(item.id));
    
    // Set opacity on the drag source container with a 0ms timeout so the ghost preview remains fully opaque
    const container = e.currentTarget;
    setTimeout(() => {
      if (container) {
        container.style.opacity = '0.3';
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDraggedIndex(null);
    setDragOverId(null);
    setDragEnabled(false);
  };

  const handleDragOver = (e, targetParentId) => {
    // Limit drop target alignment to identical hierarchy levels
    if (draggedItem && draggedItem.parentId === targetParentId) {
      e.preventDefault();
    }
  };

  const handleDragEnter = (e, targetId, targetParentId) => {
    if (draggedItem && draggedItem.parentId === targetParentId) {
      setDragOverId(targetId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = async (e, targetItem, targetIndex) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedItem || draggedItem.id === targetItem.id) return;
    if (draggedItem.parentId !== targetItem.parentId) return;

    // Filter siblings at this hierarchy level
    const siblings = menus
      .filter(m => m.parentId === draggedItem.parentId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Reorder siblings array
    const reordered = [...siblings];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    // Prepare sequential displayOrder updates (1-indexed)
    const updates = reordered.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    try {
      setLoading(true);
      // Save displayOrder positions sequentially to DB
      for (const item of updates) {
        await api.put(`/admin/menus/${item.id}`, item);
      }
      clearFrontCache();
      await fetchMenus();
    } catch (error) {
      console.error("Failed to save reordered positions", error);
      alert("Failed to save reordered positions");
    } finally {
      setLoading(false);
    }
  };

  // Build tree hierarchy for rendering
  const mainMenus = menus.filter(m => !m.parentId).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const getSubmenus = (parentId) => {
    return menus
      .filter(m => m.parentId === parentId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  };

  const getPossibleParents = (currentId) => {
    if (!currentId) return mainMenus;
    return mainMenus.filter(m => m.id !== currentId);
  };

  return (
    <div className="page-container" style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--text-primary)' }}>
            <Menu size={24} style={{ color: 'var(--primary)' }} />
            Navigation Bar Management
          </h1>
          <p className="page-description" style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '0.25rem', marginBottom: 0 }}>
            Drag using the handle icon (⋮⋮) to reorder main positions and nested submenu sequences.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn" 
            onClick={handlePublish}
            disabled={publishing}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: 'var(--success, #10b981)',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: publishing ? 'not-allowed' : 'pointer',
              opacity: publishing ? 0.7 : 1
            }}
          >
            {publishing ? 'Publishing...' : 'Publish Changes'}
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Add Menu Item
          </button>
        </div>
      </div>

      {loading && menus.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading menu structure...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mainMenus.map((main, mainIdx) => {
            const subs = getSubmenus(main.id);
            const isDragOver = dragOverId === main.id;

            return (
              <div 
                key={main.id} 
                className="glass-panel" 
                draggable={dragEnabled}
                onDragStart={(e) => handleDragStart(e, main, mainIdx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, main.parentId)}
                onDragEnter={(e) => handleDragEnter(e, main.id, main.parentId)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, main, mainIdx)}
                style={{ 
                  borderLeft: main.isActive ? '4px solid var(--primary)' : '4px solid var(--border-color)', 
                  overflow: 'hidden',
                  borderTop: isDragOver ? '2px dashed var(--primary)' : 'none',
                  borderBottom: isDragOver ? '2px dashed var(--primary)' : 'none',
                  transform: isDragOver ? 'scale(1.005)' : 'scale(1)',
                  transition: 'transform 0.15s ease, border 0.15s ease'
                }}
              >
                {/* Main Item Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  
                  {/* Content & Handle Container */}
                  <div style={{ pointerEvents: draggedItem ? 'none' : 'auto', display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1 }}>
                    {/* Drag Handle */}
                    <div 
                      onMouseDown={() => setDragEnabled(true)}
                      onMouseUp={() => setDragEnabled(false)}
                      onMouseLeave={() => setDragEnabled(false)}
                      style={{ 
                        color: 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'grab', 
                        padding: '0.5rem 0.25rem' 
                      }}
                      title="Drag handle"
                    >
                      <GripVertical size={18} />
                    </div>

                    {/* Metadata */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{main.titleEn}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({main.titleTa})</span>
                        {!main.isActive && (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>
                            Inactive
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{main.linkUrl}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button className="icon-btn" onClick={() => handleOpenEdit(main)} title="Edit">
                      <Edit2 size={15} style={{ color: '#3b82f6' }} />
                    </button>
                    <button className="icon-btn" onClick={() => handleDelete(main.id)} title="Delete">
                      <Trash2 size={15} style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </div>

                {/* Submenu List */}
                <div style={{ padding: '0.75rem 1.25rem 1.25rem 3.5rem', background: 'rgba(0, 0, 0, 0.05)' }}>
                  {subs.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                      No submenus configured. Edit a sub-item and select this menu as its parent to add.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {subs.map((sub, subIdx) => {
                        const isSubDragOver = dragOverId === sub.id;

                        return (
                          <div 
                            key={sub.id} 
                            draggable={dragEnabled}
                            onDragStart={(e) => handleDragStart(e, sub, subIdx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, sub.parentId)}
                            onDragEnter={(e) => handleDragEnter(e, sub.id, sub.parentId)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, sub, subIdx)}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              padding: '0.75rem 1rem', 
                              background: 'var(--bg-secondary)', 
                              border: isSubDragOver ? '2px dashed var(--primary)' : '1px solid var(--border-color)', 
                              borderRadius: '6px',
                              transform: isSubDragOver ? 'scale(1.005)' : 'scale(1)',
                              transition: 'transform 0.15s ease, border 0.15s ease'
                            }}
                          >
                            {/* Sub Content & Handle */}
                            <div style={{ pointerEvents: draggedItem ? 'none' : 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexGrow: 1 }}>
                              {/* Sub Drag Handle */}
                              <div 
                                onMouseDown={() => setDragEnabled(true)}
                                onMouseUp={() => setDragEnabled(false)}
                                onMouseLeave={() => setDragEnabled(false)}
                                style={{ 
                                  color: 'var(--text-muted)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  cursor: 'grab', 
                                  padding: '0.25rem 0.125rem' 
                                }}
                                title="Drag handle"
                              >
                                <GripVertical size={15} />
                              </div>
                              <Layers size={14} style={{ color: 'var(--text-secondary)' }} />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{sub.titleEn}</span>
                                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>({sub.titleTa})</span>
                                  {!sub.isActive && (
                                    <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontSize: '0.75rem', padding: '0.05rem 0.25rem', borderRadius: '3px' }}>
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{sub.linkUrl}</span>
                              </div>
                            </div>

                            {/* Sub Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button className="icon-btn" onClick={() => handleOpenEdit(sub)} title="Edit">
                                <Edit2 size={13} style={{ color: '#3b82f6' }} />
                              </button>
                              <button className="icon-btn" onClick={() => handleDelete(sub.id)} title="Delete">
                                <Trash2 size={13} style={{ color: '#ef4444' }} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label>Title (English)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.titleEn} 
                  onChange={e => setFormData({ ...formData, titleEn: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Title (Tamil)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.titleTa} 
                  onChange={e => setFormData({ ...formData, titleTa: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Link URL</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.linkUrl} 
                  onChange={e => setFormData({ ...formData, linkUrl: e.target.value })} 
                  placeholder="/category/politics, http://..." 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Hierarchy Level (Parent Item)</label>
                <select 
                  className="form-control"
                  value={formData.parentId} 
                  onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <option value="">None (Make Main Menu Item)</option>
                  {getPossibleParents(formData.id).map(p => (
                    <option key={p.id} value={p.id}>{p.titleEn} ({p.titleTa})</option>
                  ))}
                </select>
                <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Choose None to display as a top-level nav tab, or select an existing main item to make this a nested submenu item.
                </small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Display Order</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.displayOrder} 
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} 
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.isActive} 
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })} 
                    />
                    Is Active
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Menu Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarManager;
