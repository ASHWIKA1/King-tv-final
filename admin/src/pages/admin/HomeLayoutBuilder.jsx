import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api';
import { WIDGET_REGISTRY, getWidgetMeta } from '../../utils/WidgetRegistry';
import { DATA_PROVIDERS } from '../../utils/DataProviderRegistry';
import { TEMPLATE_VARIANTS } from '../../utils/TemplateEngine';
import AiWidgetAssistantModal from '../../components/AiWidgetAssistantModal';
import { 
  TypographyEditor, ColorsEditor, BackgroundEditor, 
  BorderEditor, AnimationEditor, LayoutEditor, 
  SpacingEditor, Accordion, ControlText, ControlToggle,
  TextEditor, ButtonEditor, ControlColor
} from './VisualBuilderControls';
import { ComponentLibraryModal } from './ComponentLibraryModal';
import { DynamicComponentRenderer } from './DynamicComponentRenderer';
import { findNode, deleteNode, updateNode, insertNode, removeAndGetNode } from '../../utils/TreeHelpers';
import { 
  Save, Eye, EyeOff, Trash2, Sliders, CheckCircle, 
  RotateCcw, Undo2, X, PlusCircle, ArrowUp, ArrowDown, Settings, 
  HelpCircle, Sparkles, Move, History, FileText, Wand2, Layers
} from 'lucide-react';

const PREDEFINED_SECTIONS = Object.values(WIDGET_REGISTRY).map(w => ({
  key: w.type,
  label: w.name,
  color: w.color,
  desc: w.description
}));

export const generateBlockStyles = (configStr, viewMode = 'desktop') => {
  let styles = {};
  try {
    const config = typeof configStr === 'string' ? JSON.parse(configStr || '{}') : (configStr || {});
    
    // Background
    if (config.background) {
      if (config.background.type === 'color') styles.backgroundColor = config.background.color;
      if (config.background.type === 'gradient') styles.backgroundImage = config.background.gradient;
      if (config.background.type === 'image') {
        styles.backgroundImage = `url(${config.background.image})`;
        styles.backgroundSize = config.background.size || 'cover';
        styles.backgroundPosition = config.background.position || 'center';
        styles.backgroundRepeat = config.background.repeat || 'no-repeat';
      }
    }
    
    // Border
    if (config.border) {
      if (config.border.width && config.border.style && config.border.color) {
        styles.border = `${config.border.width}px ${config.border.style} ${config.border.color}`;
      }
      if (config.border.radius) {
        styles.borderRadius = `${config.border.radius}px`;
      }
    }

    // Typography (simplified, as it might apply to children too)
    if (config.typography && config.typography[viewMode]) {
      const typo = config.typography[viewMode];
      if (typo.fontSize) styles.fontSize = `${typo.fontSize}px`;
      if (typo.fontWeight) styles.fontWeight = typo.fontWeight;
      if (typo.textAlign) styles.textAlign = typo.textAlign;
    }
    
    // Colors
    if (config.colors) {
      if (config.colors.text) styles.color = config.colors.text;
    }

    return styles;
  } catch(e) {
    return {};
  }
};

const HomeLayoutBuilder = () => {
  const [layout, setLayout] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [draggedKey, setDraggedKey] = useState(null);

  // View Mode: 'desktop' | 'tablet' | 'mobile'
  const [viewMode, setViewMode] = useState('desktop');
  const [canvasTheme, setCanvasTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('admin_theme') || 'dark';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') || localStorage.getItem('admin_theme') || 'dark';
      setCanvasTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // AI Widget Assistant & Modal State
  const [showAiModal, setShowAiModal] = useState(false);

  // Layout history and draft state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [draftSavedAlert, setDraftSavedAlert] = useState(false);
  const [trashBin, setTrashBin] = useState([]);

  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [activeRootSectionId, setActiveRootSectionId] = useState(null);
  
  // Configuration sidebar state
  const [activeConfigSection, setActiveConfigSection] = useState(null); // Now stores the entire selected node (or root section if id < 100000)
  const [configTitle, setConfigTitle] = useState('');
  const [configParams, setConfigParams] = useState({ limit: 6, categoryId: '', type: 'grid', provider: 'latest_news' });

  // Dynamic DND State
  const [dynamicDraggedNodeId, setDynamicDraggedNodeId] = useState(null);

  // UI/UX Settings
  const [openAccordion, setOpenAccordion] = useState('General');
  const settingsScrollRef = useRef(null);
  const sectionRefs = useRef({});

  const fetchLayout = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/layout/web');
      let data = res.data || [];
      if (Array.isArray(data) && data.length >= 4) {
        data.sort((a, b) => a.displayOrder - b.displayOrder);
        // Automatically inject website_navigation if it doesn't exist
        if (!data.find(item => item.sectionKey === 'website_navigation')) {
          data.unshift({
            id: Date.now(), // Unique ID
            sectionKey: 'website_navigation',
            sectionLabel: 'Website Navigation',
            displayOrder: 0,
            isVisible: true,
            layoutType: 'WEB',
            configJson: '{}'
          });
        }
        setLayout(data);
      } else {
        const defaultInit = PREDEFINED_SECTIONS.slice(0, 8).map((p, idx) => ({
          id: idx + 1,
          sectionKey: p.key,
          sectionLabel: p.label,
          displayOrder: idx + 1,
          isVisible: true,
          layoutType: 'WEB',
          configJson: '{}'
        }));
        setLayout(defaultInit);
      }
      setUndoStack([]);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to load layout", error);
      const defaultInit = PREDEFINED_SECTIONS.slice(0, 8).map((p, idx) => ({
        id: idx + 1,
        sectionKey: p.key,
        sectionLabel: p.label,
        displayOrder: idx + 1,
        isVisible: true,
        layoutType: 'WEB',
        configJson: '{}'
      }));
      setLayout(defaultInit);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/nav');
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/admin/layout/history?layoutType=WEB');
      setHistoryList(res.data || []);
    } catch (err) {
      console.error("Failed to load layout history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRollback = async (historyId) => {
    if (!window.confirm("Restore this historical homepage layout snapshot? Current unpublished changes will be replaced.")) return;
    try {
      const res = await api.post(`/admin/layout/rollback/${historyId}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLayout(res.data);
      }
      setShowHistoryModal(false);
      setUnsavedChanges(false);
      setUndoStack([]);
      alert("Layout snapshot restored successfully!");
    } catch (err) {
      console.error("Rollback error", err);
      alert("Failed to restore layout snapshot. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('kings_layout_draft_web', JSON.stringify(layout));
      setDraftSavedAlert(true);
      setTimeout(() => setDraftSavedAlert(false), 3000);
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  };

  useEffect(() => {
    // Force a fresh fetch from the database to restore UI state via HMR
    fetchLayout();
    fetchCategories();
  }, []);

  const pushUndo = (newLayout) => {
    setUndoStack(prev => [...prev.slice(-9), JSON.stringify(layout)]);
    setLayout(newLayout);
    setUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = JSON.parse(undoStack[undoStack.length - 1]);
    setUndoStack(prevStack => prevStack.slice(0, -1));
    setLayout(prev);
    if (undoStack.length === 1) {
      setUnsavedChanges(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved layout changes?")) {
      fetchLayout();
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = layout.map((item, idx) => ({
        ...item,
        displayOrder: idx + 1,
        isVisible: item.isVisible !== false,
        configJson: typeof item.configJson === 'string' ? item.configJson : JSON.stringify(item.configJson || {})
      }));

      const res = await api.put('/admin/layout/bulk-save', payload);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLayout(res.data);
      }
      setUnsavedChanges(false);
      setUndoStack([]);
      alert("Home layout changes published live successfully!");
    } catch (err) {
      console.error("Failed to publish layout changes", err);
      alert("Failed to publish layout changes. Please check connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  // Add section from library
  const handleAddSectionKey = (key) => {
    const predefined = PREDEFINED_SECTIONS.find(p => p.key === key);
    if (!predefined) return;

    const existingCount = layout.filter(item => item.sectionKey === key).length;
    const label = existingCount > 0 ? `${predefined.label} (${existingCount + 1})` : predefined.label;

    const newSection = {
      id: Date.now(),
      sectionKey: key,
      sectionLabel: label,
      displayOrder: layout.length + 1,
      isVisible: true,
      layoutType: 'WEB',
      configJson: JSON.stringify({ limit: 6, categoryId: '', type: 'grid' })
    };

    pushUndo([...layout, newSection]);

    api.post('/admin/layout', {
      sectionKey: newSection.sectionKey,
      sectionLabel: newSection.sectionLabel,
      displayOrder: newSection.displayOrder,
      isVisible: newSection.isVisible,
      layoutType: 'WEB',
      configJson: newSection.configJson
    }).then(res => {
      if (res.data && res.data.id) {
        setLayout(prev => prev.map(item => item.id === newSection.id ? { ...item, id: res.data.id } : item));
      }
    }).catch(err => {
      console.error("Failed to persist new section key", err);
    });
  };

  const handleRemoveSection = (id) => {
    if (window.confirm("Remove this section from the homepage?")) {
      const target = layout.find(item => item.id === id);
      
      if (target) {
        setTrashBin(prev => [...prev, target]);
        // If it was the active section being configured, close the properties panel
        if (activeConfigSection?.id === id) {
          setActiveConfigSection(null);
        }
      }
      
      pushUndo(layout.filter(item => item.id !== id));
      
      // Perform DB delete instantly to stay synchronized
      if (target && !target.isNew) {
        api.delete(`/admin/layout/${id}`).catch(err => console.error("Failed to sync delete", err));
      }
    }
  };

  const handleDuplicateSection = (id) => {
    const target = layout.find(item => item.id === id);
    if (!target) return;
    
    api.post('/admin/layout', {
      sectionKey: target.sectionKey,
      sectionLabel: target.sectionLabel + ' (Copy)',
      displayOrder: layout.length + 1,
      isVisible: target.isVisible,
      layoutType: 'WEB',
      configJson: target.configJson
    }).then(() => {
      fetchLayout();
    }).catch(err => {
      console.error("Failed to duplicate section", err);
    });
  };


  const handleRestoreSection = (trashedItem) => {
    api.post('/admin/layout', {
      sectionKey: trashedItem.sectionKey,
      sectionLabel: trashedItem.sectionLabel,
      displayOrder: layout.length + 1,
      isVisible: trashedItem.isVisible,
      layoutType: 'WEB',
      configJson: trashedItem.configJson
    }).then(() => {
      setTrashBin(prev => prev.filter(item => item.id !== trashedItem.id));
      fetchLayout(); // Refresh from backend to ensure accurate state
    }).catch(err => {
      console.error("Failed to restore section", err);
    });
  };

  const handleToggleVisibility = (id) => {
    const updated = layout.map(item => {
      if (item.id === id) {
        return { ...item, isVisible: !item.isVisible };
      }
      return item;
    });
    pushUndo(updated);
  };

  // Drag and drop sorting
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    setDraggedKey(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const copy = [...layout];
    const [removed] = copy.splice(sourceIndex, 1);
    copy.splice(targetIndex, 0, removed);

    // Reorder displayOrder
    const updated = copy.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    pushUndo(updated);
    setDraggedKey(null);
  };

  // Handle AI Assistant auto-generated widget
  const handleAddAiWidget = (type, label, configJson) => {
    const newSection = {
      id: Date.now(),
      sectionKey: type,
      sectionLabel: label,
      displayOrder: layout.length + 1,
      isVisible: true,
      layoutType: 'WEB',
      configJson: configJson
    };
    pushUndo([...layout, newSection]);
    
    setTimeout(() => {
      const container = document.getElementById('canvas-scroll-container');
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  // Open plain-language sidebar configuration
  const handleOpenConfig = (section, isDynamicNode = false, rootSectionId = null) => {
    setActiveConfigSection(section);
    setActiveRootSectionId(rootSectionId || section.id);
    setConfigTitle(isDynamicNode ? (section.name || section.type) : section.sectionLabel);
    
    // UI Behaviors: Open General
    setOpenAccordion('General');
    
    // Auto-scroll after render cycle
    setTimeout(() => {
      if (settingsScrollRef.current) {
        settingsScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (sectionRefs.current && sectionRefs.current[section.id]) {
        sectionRefs.current[section.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
    
    try {
      const parsed = JSON.parse(section.configJson || '{}');
      setConfigParams({
        limit: parsed.limit || 6,
        categoryId: parsed.categoryId || '',
        type: parsed.type || 'grid',
        provider: parsed.provider || (parsed.categoryId ? 'category_feed' : 'latest_news'),
        tag: parsed.tag || '',
        spacing: parsed.spacing || {
          desktop: { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, rowGap: 0, columnGap: 0 },
          mobile: { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, rowGap: 0, columnGap: 0 },
          unit: 'px',
          preset: 'custom'
        }
      });
    } catch (e) {
      setConfigParams({ 
        limit: 6, categoryId: '', type: 'grid', provider: 'latest_news', tag: '',
        spacing: {
          desktop: { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, rowGap: 0, columnGap: 0 },
          mobile: { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, rowGap: 0, columnGap: 0 },
          unit: 'px',
          preset: 'custom'
        }
      });
    }
  };

  const handleSaveConfig = () => {
    if (!activeConfigSection) return;
    
    if (activeRootSectionId && activeRootSectionId !== activeConfigSection.id) {
      // It's a nested dynamic node inside a custom builder root section
      const updated = layout.map(item => {
        if (item.id === activeRootSectionId) {
          const parsed = JSON.parse(item.configJson || '{}');
          const children = parsed.children || [];
          
          const updatedChildren = updateNode(children, activeConfigSection.id, {
            name: configTitle,
            config: configParams
          });
          
          return {
            ...item,
            configJson: JSON.stringify({ ...parsed, children: updatedChildren })
          };
        }
        return item;
      });
      pushUndo(updated);
      setActiveConfigSection(null);
      setActiveRootSectionId(null);
      return;
    }
    
    const updated = layout.map(item => {
      if (item.id === activeConfigSection.id) {
        return {
          ...item,
          sectionLabel: configTitle,
          configJson: JSON.stringify(configParams)
        };
      }
      return item;
    });
    pushUndo(updated);
    setActiveConfigSection(null);
    setActiveRootSectionId(null);
  };
  
  // -- DYNAMIC COMPONENT HELPERS --
  
  const handleAddDynamicComponent = (compDef) => {
    setShowComponentLibrary(false);
    
    const newNode = {
      id: `dyn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: compDef.id,
      name: compDef.name,
      config: compDef.defaultProps || {},
      children: compDef.type === 'container' ? [] : undefined
    };
    
    // If a custom section is selected, add to it. Otherwise create a new custom root section.
    if (activeRootSectionId) {
      const rootItem = layout.find(i => i.id === activeRootSectionId);
      if (rootItem && rootItem.sectionKey === 'custom_builder') {
        const parsed = JSON.parse(rootItem.configJson || '{}');
        
        // If a container node is actively selected, append to it. Else append to root.
        let updatedChildren;
        if (activeConfigSection && activeConfigSection.id !== activeRootSectionId && activeConfigSection.children) {
          updatedChildren = insertNode(parsed.children || [], activeConfigSection.id, newNode);
        } else {
          updatedChildren = [...(parsed.children || []), newNode];
        }
        
        pushUndo(layout.map(item => item.id === activeRootSectionId ? {
          ...item,
          configJson: JSON.stringify({ ...parsed, children: updatedChildren })
        } : item));
        
        handleOpenConfig(newNode, true, activeRootSectionId);
        return;
      }
    }
    
    // Create new root custom section
    const newSection = {
      id: Date.now(),
      sectionKey: 'custom_builder',
      sectionLabel: compDef.name ? `Custom Section - ${compDef.name}` : 'Custom Section',
      displayOrder: layout.length + 1,
      isVisible: true,
      layoutType: 'WEB',
      configJson: JSON.stringify({ children: [newNode] })
    };
    
    pushUndo([...layout, newSection]);

    api.post('/admin/layout', {
      sectionKey: newSection.sectionKey,
      sectionLabel: newSection.sectionLabel,
      displayOrder: newSection.displayOrder,
      isVisible: newSection.isVisible,
      layoutType: 'WEB',
      configJson: newSection.configJson
    }).then(res => {
      if (res.data && res.data.id) {
        setLayout(prev => prev.map(item => item.id === newSection.id ? { ...item, id: res.data.id } : item));
      }
    }).catch(err => console.error("Failed to append custom section", err));
  };
  
  const handleDeleteDynamicNode = (rootId, nodeId) => {
    if (!window.confirm("Remove this component?")) return;
    const updated = layout.map(item => {
      if (item.id === rootId) {
        const parsed = JSON.parse(item.configJson || '{}');
        return {
          ...item,
          configJson: JSON.stringify({ ...parsed, children: deleteNode(parsed.children || [], nodeId) })
        };
      }
      return item;
    });
    pushUndo(updated);
    if (activeConfigSection?.id === nodeId) {
      setActiveConfigSection(null);
      setActiveRootSectionId(null);
    }
  };
  
  const handleDuplicateDynamicNode = (rootId, nodeId) => {
    const root = layout.find(i => i.id === rootId);
    if (!root) return;
    
    const parsed = JSON.parse(root.configJson || '{}');
    const targetNode = findNode(parsed.children || [], nodeId);
    if (!targetNode) return;
    
    const deepClone = (node) => ({
      ...node,
      id: `dyn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      children: node.children ? node.children.map(deepClone) : undefined
    });
    
    const cloned = deepClone(targetNode);
    cloned.name = cloned.name + ' (Copy)';
    
    // Just append to the root children for simplicity right now
    const updatedChildren = [...(parsed.children || []), cloned];
    
    pushUndo(layout.map(item => item.id === rootId ? {
      ...item,
      configJson: JSON.stringify({ ...parsed, children: updatedChildren })
    } : item));
  };
  
  const handleDynamicDrop = (e, rootId, targetNodeId) => {
    e.preventDefault();
    if (!dynamicDraggedNodeId) return;
    if (dynamicDraggedNodeId === targetNodeId) return;
    
    const updated = layout.map(item => {
      if (item.id === rootId) {
        const parsed = JSON.parse(item.configJson || '{}');
        let children = parsed.children || [];
        
        const result = { node: null };
        children = removeAndGetNode(children, dynamicDraggedNodeId, result);
        
        if (result.node) {
          if (targetNodeId === rootId) {
            children.push(result.node);
          } else {
            // Target MUST be a container
            const targetNode = findNode(children, targetNodeId);
            if (targetNode && targetNode.children) {
              children = insertNode(children, targetNodeId, result.node);
            } else {
              // If not a container, just push to root
              children.push(result.node);
            }
          }
        }
        
        return {
          ...item,
          configJson: JSON.stringify({ ...parsed, children })
        };
      }
      return item;
    });
    
    pushUndo(updated);
    setDynamicDraggedNodeId(null);
  };



  // Render mock HTML preview elements inside canvas
  const renderVisualMock = (sectionKey, label, configJsonStr) => {
    const config = typeof configJsonStr === 'string' ? JSON.parse(configJsonStr || '{}') : {};
    const themeColor = config.themeColor || '#3B82F6';
    
    switch (sectionKey) {
      case 'website_navigation':
        const navStyle = config.navStyle || 'horizontal';
        const align = config.alignment || 'left';
        let jc = 'flex-start';
        if (align === 'center') jc = 'center';
        if (align === 'right') jc = 'flex-end';
        
        return (
          <div style={{ fontFamily: '"Mukta Malar", sans-serif' }}>
            {/* Top Logo Header Area */}
            <div style={{ background: canvasTheme === 'dark' ? '#000000' : '#ffffff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${canvasTheme === 'dark' ? '#1e293b' : '#e2e8f0'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 75V40C20 31.7157 26.7157 25 35 25C43.2843 25 50 31.7157 50 40V75" stroke="url(#mock-logo-grad)" strokeWidth="14" strokeLinecap="round"/>
                  <path d="M50 75V55C50 46.7157 56.7157 40 65 40C73.2843 40 80 46.7157 80 55V75" stroke="url(#mock-logo-grad)" strokeWidth="14" strokeLinecap="round"/>
                  <circle cx="35" cy="12" r="7" fill="#F59E0B"/>
                  <defs>
                    <linearGradient id="mock-logo-grad" x1="20" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B"/>
                      <stop offset="1" stopColor="#D97706"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span style={{ fontSize: '16px', fontWeight: 800, color: canvasTheme === 'dark' ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  சென்னை 24x7 <span style={{ fontSize: '11px', color: '#64748b' }}>✏️</span>
                </span>
              </div>
              <div>
                <div style={{ background: '#EF4444', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>▶</span> LIVE TV WATCH NOW
                </div>
              </div>
            </div>
            {/* Navigation Bar */}
            <div style={{ background: '#B67C2F', padding: '0 30px', borderTop: '4px solid #FACC15' }}>
              <div style={{ display: 'flex', gap: '0', alignItems: 'center', justifyContent: jc, flexWrap: 'wrap', margin: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#000', cursor: 'pointer', background: '#fff', padding: '12px 20px', flexShrink: 0 }}>Home</div>
                {categories.map(cat => (
                  <React.Fragment key={cat.id}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', padding: '12px 20px', flexShrink: 0 }}>
                      {cat.nameTa || cat.name}
                    </div>
                    {cat.subcategories && cat.subcategories.map(sub => (
                      <div key={`sub-${sub.id}`} style={{ fontSize: '13px', fontWeight: 600, color: '#facc15', cursor: 'pointer', whiteSpace: 'nowrap', padding: '14px 15px', flexShrink: 0, opacity: 0.9 }}>
                        ↳ {sub.nameTa || sub.name}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
                <div style={{ marginLeft: 'auto', padding: '12px 20px', color: '#fff', flexShrink: 0 }}>🔍</div>
              </div>
            </div>
          </div>
        );
      case 'news_ticker':
        return (
          <div style={{ background: '#FEF3C7', color: '#D97706', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: `4px solid ${themeColor}`, fontWeight: 600 }}>
            <span style={{ background: themeColor, color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>LIVE TICKER</span>
            <span>தங்கம் (24K/10g): ₹72,429 • நெல் கொள்முதல் விலை உயர்வு...</span>
          </div>
        );
      case 'hero':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '10px', minHeight: '130px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '6px', padding: '16px', display: 'flex', alignItems: 'flex-end', color: '#ffffff', borderTop: `4px solid ${themeColor}` }}>
              <div>
                <span style={{ fontSize: '9px', background: themeColor, padding: '2px 6px', borderRadius: '4px' }}>அரசியல்</span>
                <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '4px' }}>{label || "Hero Headline..."}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '4px', height: '36px', border: '1px solid #E2E8F0' }}></div>
              <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '4px', height: '36px', border: '1px solid #E2E8F0' }}></div>
              <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '4px', height: '36px', border: '1px solid #E2E8F0' }}></div>
            </div>
          </div>
        );
      case 'quick_access':
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            {['அரசியல்', 'வணிகம்', 'விளையாட்டு', 'சினிமா', 'தொழில்நுட்பம்'].map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: themeColor }}></div>
                {cat}
              </div>
            ))}
          </div>
        );
      case 'latest_news':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '4px', height: '14px', background: themeColor, borderRadius: '2px' }}></div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{label || 'News Grid'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg-card)' }}>
                  <div style={{ height: '40px', background: '#E2E8F0' }}></div>
                  <div style={{ padding: '6px', fontSize: '10px', fontWeight: 600 }}>news summary card...</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'video_news':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '4px', height: '14px', background: themeColor, borderRadius: '2px' }}></div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{label || 'Video Gallery'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div style={{ height: '70px', background: '#334155', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>▶</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '20px', background: '#1E293B', borderRadius: '2px' }}></div>
                <div style={{ height: '20px', background: '#1E293B', borderRadius: '2px' }}></div>
                <div style={{ height: '20px', background: '#1E293B', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        );
      case 'web_stories':
        return (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'hidden' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: '1', height: '80px', borderRadius: '6px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', border: '1px solid #EC4899', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '6px' }}>
                <span style={{ fontSize: '8px', color: '#fff', fontWeight: 700 }}>web story...</span>
              </div>
            ))}
          </div>
        );
      case 'trending_sidebar':
        return (
          <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>🔥 TRENDING TOP 5</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '9px', borderBottom: '1px solid var(--border-color)', pb: '4px' }}>1. Gold rates drop sharply in Chennai...</div>
              <div style={{ fontSize: '9px' }}>2. Heavy rain warning for districts...</div>
            </div>
          </div>
        );
      case 'weather':
        return (
          <div style={{ background: '#F0F9FF', border: '1px solid #B9E6FE', padding: '10px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifycontent: 'space-between', color: '#0369A1' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700 }}>Coimbatore, TN</div>
              <div style={{ fontSize: '9px' }}>Heavy Rain Showers</div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>31°C 🌧️</div>
          </div>
        );
      case 'crowd_reporter':
        return (
          <div style={{ border: '1.5px dashed #F59E0B', background: '#FEF3C7', padding: '10px', borderRadius: '6px', textAlign: 'center', color: '#D97706' }}>
            <div style={{ fontSize: '11px', fontWeight: 700 }}>📢 CITIZEN CROWD REPORTER</div>
            <div style={{ fontSize: '9px', marginTop: '2px' }}>Submit ground breaking news alerts directly here!</div>
          </div>
        );
      case 'business_case':
        return (
          <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '10px', borderRadius: '6px', color: '#6D28D9' }}>
            <div style={{ fontSize: '10px', fontWeight: 700 }}>💼 Local Business Spotlights</div>
            <div style={{ height: '30px', background: '#fff', borderRadius: '4px', marginTop: '4px' }}></div>
          </div>
        );
      case 'news_digest':
        return (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px', borderRadius: '6px', color: '#047857' }}>
            <div style={{ fontSize: '11px', fontWeight: 700 }}>📬 Curated News Digest</div>
            <div style={{ fontSize: '9px' }}>Summarized news briefs generated automatically by AI editors.</div>
          </div>
        );
      default:
        return (
          <div style={{ padding: '20px', background: '#F1F5F9', border: '1px dashed #CBD5E1', borderRadius: '6px', textAlign: 'center', color: '#64748B', fontSize: '12px', fontWeight: 600 }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>🧩</div>
            {label || sectionKey} Component Placeholder
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', width: '100%', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${canvasTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, backgroundColor: canvasTheme === 'dark' ? '#0f172a' : '#ffffff', fontFamily: 'Inter, sans-serif', color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a' }}>
      
      {/* Premium Top Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: canvasTheme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : '#ffffff', backdropFilter: 'blur(12px)', padding: '12px 24px', borderBottom: `1px solid ${canvasTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', padding: '6px 10px', borderRadius: '8px' }}>
            <Sparkles size={18} color="#fff" /> 
            <span style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.5px' }}>KING CMS</span>
          </div>
          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>Home Layout Builder</span>
          {draftSavedAlert && (
            <span style={{ fontSize: '11px', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
              ✓ Draft saved locally
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Viewport Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setViewMode('desktop')}
              style={{
                padding: '6px 12px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer',
                background: viewMode === 'desktop' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === 'desktop' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              🖥️ Desktop
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              style={{
                padding: '6px 12px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer',
                background: viewMode === 'tablet' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === 'tablet' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              💻 Tablet
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              style={{
                padding: '6px 12px', fontSize: '12px', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer',
                background: viewMode === 'mobile' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === 'mobile' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              📱 Mobile
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowAiModal(true)}
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Wand2 size={14} /> AI Assistant
          </button>
          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }}></div>
          <button
            onClick={handleUndo} disabled={undoStack.length === 0}
            style={{ padding: '8px', background: 'transparent', border: 'none', color: undoStack.length ? '#fff' : '#475569', cursor: undoStack.length ? 'pointer' : 'not-allowed' }}
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={() => { setShowHistoryModal(true); fetchHistory(); }}
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer' }}
          >
            <History size={14} /> History
          </button>
          <button
            onClick={handleSaveDraft}
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer' }}
          >
            <FileText size={14} /> Draft
          </button>
          <button
            onClick={handleDiscard} disabled={!unsavedChanges}
            style={{ padding: '8px 14px', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: unsavedChanges ? '#ef4444' : '#7f1d1d', borderRadius: '6px', cursor: unsavedChanges ? 'pointer' : 'not-allowed', opacity: unsavedChanges ? 1 : 0.5 }}
          >
            Discard
          </button>
          <button
            onClick={handleSaveAll} disabled={!unsavedChanges && !saving}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', background: '#f97316', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: (!unsavedChanges && !saving) ? 'not-allowed' : 'pointer', opacity: (!unsavedChanges && !saving) ? 0.5 : 1, boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.39)' }}
          >
            <Save size={14} /> Publish Live
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Panel: Component Library & Navigator */}
        <div style={{ width: '280px', background: canvasTheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#f8fafc', borderRight: `1px solid ${canvasTheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a', display: 'flex', flexDirection: 'column', zIndex: 5 }}>
          
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}><PlusCircle size={16} color="#f59e0b" /> Add to Homepage</h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>Click any visual block type below to insert it onto the live canvas layout.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '45vh', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
              {PREDEFINED_SECTIONS.map(s => {
                return (
                  <div
                    key={s.key}
                    onClick={() => handleAddSectionKey(s.key)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease', position: 'relative'
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderRadius: '6px', background: s.color, textAlign: 'center', color: '#fff', fontSize: '12px', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                      {s.label}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{s.label}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Page Navigator
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{layout.length} Blocks</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
              {layout.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', background: activeConfigSection?.id === item.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent', border: `1px solid ${activeConfigSection?.id === item.id ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s' }} onClick={() => handleOpenConfig(item)}>
                  <Move size={12} color="#64748b" style={{ cursor: 'grab' }} draggable="true" onDragStart={(e) => handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, idx)} />
                  <span style={{ fontSize: '12px', fontWeight: activeConfigSection?.id === item.id ? 700 : 500, color: activeConfigSection?.id === item.id ? '#38bdf8' : '#cbd5e1', flex: 1 }}>
                    {item.sectionLabel}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); handleToggleVisibility(item.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.isVisible ? '#10b981' : '#64748b' }}>
                    {item.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
              ))}
              {layout.length === 0 && <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '20px' }}>No blocks added yet.</div>}
            </div>
          </div>
        </div>

        {/* Center Panel: Live Canvas Workspace */}
        <div id="canvas-scroll-container" style={{ flex: 1, overflowY: 'auto', background: canvasTheme === 'dark' ? 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' : '#e2e8f0', position: 'relative' }} className="custom-scrollbar">
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
            
            <div style={{
              width: viewMode === 'mobile' ? '414px' : viewMode === 'tablet' ? '768px' : '100%',
              maxWidth: viewMode === 'mobile' ? '414px' : viewMode === 'tablet' ? '768px' : '1200px',
              background: canvasTheme === 'dark' ? '#0f172a' : '#ffffff',
              color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a',
              borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
            {/* Simulated Browser Frame Header */}
            <div style={{ background: canvasTheme === 'dark' ? '#1e293b' : '#f1f5f9', borderBottom: `1px solid ${canvasTheme === 'dark' ? '#334155' : '#e2e8f0'}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              </div>
              <div style={{ background: canvasTheme === 'dark' ? '#0f172a' : '#e2e8f0', padding: '4px 20px', borderRadius: '4px', fontSize: '11px', color: canvasTheme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                king-tv.test-technoprint.online
              </div>
              <div style={{ width: '40px' }}></div>
            </div>

            {/* Canvas Blocks */}
            <div style={{ background: canvasTheme === 'dark' ? '#0f172a' : '#fff', padding: '0', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
              {loading ? (
                <div style={{ padding: '80px', textAlign: 'center', color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>Loading visual homepage editor...</div>
              ) : layout.length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center', color: '#94a3b8', background: canvasTheme === 'dark' ? '#1e293b' : '#f8fafc', margin: '24px', border: '2px dashed #cbd5e1', borderRadius: '12px' }}>
                  Homepage canvas is empty.<br/>Click components from the left library to add.
                </div>
              ) : (
                layout.map((item, idx) => {
                  const isActive = activeConfigSection?.id === item.id;
                  let spacingStyle = { padding: '16px', margin: '0' };
                  let sData = null;
                  try {
                    const parsed = isActive ? configParams : JSON.parse(item.configJson || '{}');
                    if (parsed.spacing) {
                      sData = parsed.spacing;
                      const sp = parsed.spacing[viewMode] || {};
                      const u = parsed.spacing.unit || 'px';
                      spacingStyle = {
                        marginTop: `${sp.marginTop || 0}${u}`,
                        marginBottom: `${sp.marginBottom || 0}${u}`,
                        marginLeft: `${sp.marginLeft || 0}${u}`,
                        marginRight: `${sp.marginRight || 0}${u}`,
                        paddingTop: `${sp.paddingTop || 0}${u}`,
                        paddingBottom: `${sp.paddingBottom || 0}${u}`,
                        paddingLeft: `${sp.paddingLeft || 0}${u}`,
                        paddingRight: `${sp.paddingRight || 0}${u}`,
                      };
                    }
                  } catch(e) {}
                  
                  return (
                    <div
                      key={item.id}
                      ref={(el) => (sectionRefs.current[item.id] = el)}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      onClick={() => handleOpenConfig(item)}
                      style={{
                        position: 'relative',
                        border: isActive ? '2px solid #3b82f6' : '1px solid transparent',
                        background: item.isVisible ? (canvasTheme === 'dark' ? '#1e293b' : '#ffffff') : (canvasTheme === 'dark' ? '#0f172a' : '#f8fafc'),
                        opacity: item.isVisible ? 1 : 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        ...spacingStyle
                      }}
                      onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.border = '1px dashed #94a3b8'; }}
                      onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.border = '1px solid transparent'; }}
                    >
                      {/* Floating Action Toolbar */}
                      <div style={{ 
                        position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', 
                        display: 'flex', alignItems: 'center', background: '#1e293b', color: '#fff', 
                        padding: '4px 8px', borderRadius: '20px', gap: '12px', zIndex: 20, 
                        opacity: isActive ? 1 : 0, transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.1)' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'grab', color: '#94a3b8' }} title="Drag to reorder">
                          <Move size={14} />
                        </div>
                        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)' }}></div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap' }}>{item.sectionLabel}</span>
                        <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)' }}></div>
                        
                        <button onClick={(e) => { e.stopPropagation(); handleDuplicateSection(item.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex' }} title="Duplicate Block" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                          <Layers size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleToggleVisibility(item.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex' }} title="Toggle Visibility" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                          {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveSection(item.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex' }} title="Delete Block" onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      {/* Spacing Visualizers (Margin/Padding Overlay) */}
                      {isActive && sData && (
                        <>
                          <div style={{ position: 'absolute', inset: `-${sData[viewMode].marginTop || 0}${sData.unit || 'px'} -${sData[viewMode].marginRight || 0}${sData.unit || 'px'} -${sData[viewMode].marginBottom || 0}${sData.unit || 'px'} -${sData[viewMode].marginLeft || 0}${sData.unit || 'px'}`, background: 'rgba(245, 158, 11, 0.1)', border: '1px dashed #f59e0b', pointerEvents: 'none', zIndex: 1 }}></div>
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', pointerEvents: 'none', zIndex: 1 }}></div>
                          <div style={{ position: 'absolute', inset: `${sData[viewMode].paddingTop || 0}${sData.unit || 'px'} ${sData[viewMode].paddingRight || 0}${sData.unit || 'px'} ${sData[viewMode].paddingBottom || 0}${sData.unit || 'px'} ${sData[viewMode].paddingLeft || 0}${sData.unit || 'px'}`, background: '#fff', pointerEvents: 'none', zIndex: 2 }}></div>
                        </>
                      )}

                      <div style={{ pointerEvents: item.sectionKey === 'custom_builder' ? 'auto' : 'none', position: 'relative', zIndex: 3, ...(isActive ? generateBlockStyles(JSON.stringify(configParams)) : generateBlockStyles(item.configJson)) }}>
                        {item.sectionKey === 'custom_builder' ? (
                          (JSON.parse(item.configJson || '{}').children || []).length > 0 ? (
                            (JSON.parse(item.configJson || '{}').children || []).map(node => (
                              <DynamicComponentRenderer 
                                key={node.id}
                                node={node}
                                activeNodeId={activeConfigSection?.id}
                                onSelectNode={(nodeId) => {
                                  const found = findNode(JSON.parse(item.configJson || '{}').children || [], nodeId);
                                  if (found) handleOpenConfig(found, true, item.id);
                                }}
                                onUpdateNode={() => {}} 
                                onDeleteNode={(nodeId) => handleDeleteDynamicNode(item.id, nodeId)}
                                onDuplicateNode={(nodeId) => handleDuplicateDynamicNode(item.id, nodeId)}
                                draggedNodeId={dynamicDraggedNodeId}
                                onDragStart={(e, nodeId) => {
                                  e.dataTransfer.setData('text/plain', nodeId);
                                  setDynamicDraggedNodeId(nodeId);
                                }}
                                onDragOver={(e, nodeId) => {
                                  e.preventDefault();
                                }}
                                onDrop={(e, nodeId) => handleDynamicDrop(e, item.id, nodeId)}
                              />
                            ))
                          ) : (
                            <div 
                              style={{ padding: '40px', border: '2px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', color: '#64748b', cursor: 'pointer' }}
                              onClick={() => { setActiveRootSectionId(item.id); setShowComponentLibrary(true); }}
                              onDragOver={(e) => { e.preventDefault(); }}
                              onDrop={(e) => handleDynamicDrop(e, item.id, item.id)}
                            >
                              Drag & Drop Components Here
                            </div>
                          )
                        ) : (
                          renderVisualMock(item.sectionKey, item.sectionLabel, item.configJson)
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            

            <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
              <button 
                onClick={() => { setActiveRootSectionId(null); setShowComponentLibrary(true); }}
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', 
                  borderRadius: '30px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, 
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                }}
              >
                <PlusCircle size={18} /> Add Component
              </button>
            </div>
            {/* Footer Mock */}
            <div style={{ background: '#0f172a', padding: '24px', color: '#94a3b8', fontSize: '12px', textAlign: 'center' }}>
              © 2024 KINGS 24x7 — Global Footer
            </div>
          </div>
          </div>
        </div>

        {/* Right Panel: Properties */}
        <div style={{ width: '320px', background: canvasTheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#ffffff', borderLeft: `1px solid ${canvasTheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a', display: 'flex', flexDirection: 'column', zIndex: 5, transition: 'width 0.3s ease' }}>
        {activeConfigSection ? (
          <>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
                <Sliders size={16} color="#38bdf8" /> Section Settings
              </h3>
              <button onClick={() => setActiveConfigSection(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
            </div>

            <div ref={settingsScrollRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
              
              <Accordion title="General" isOpen={openAccordion === 'General'} onToggle={() => setOpenAccordion(openAccordion === 'General' ? '' : 'General')}>
                <ControlText label="Display Title" value={configTitle} onChange={setConfigTitle} />
              </Accordion>
              
              <Accordion title="Data Source" isOpen={openAccordion === 'DataSource'} onToggle={() => setOpenAccordion(openAccordion === 'DataSource' ? '' : 'DataSource')}>
                {activeConfigSection.type === 'heading' || activeConfigSection.type === 'paragraph' ? (
                  <TextEditor config={configParams} setConfig={setConfigParams} />
                ) : activeConfigSection.type === 'button' ? (
                  <ButtonEditor config={configParams} setConfig={setConfigParams} />
                ) : activeConfigSection.sectionKey === 'website_navigation' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>NAVIGATION SOURCE</div>
                      <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 600 }}>Taxonomy Management</div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.4 }}>This component automatically syncs with your live categories.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {categories.map(cat => (
                        <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                          <span style={{ color: '#10b981' }}>✓</span> {cat.name} {cat.nameTa ? `(${cat.nameTa})` : ''}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => window.open('/admin/taxonomy', '_blank')}
                      style={{ marginTop: '8px', background: '#334155', color: '#fff', border: '1px solid #475569', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      Open Taxonomy Management
                    </button>
                  </div>
                ) : (
                  <>
                    <select value={configParams.provider || 'latest_news'} onChange={e => setConfigParams(prev => ({ ...prev, provider: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30, 41, 59, 0.9)', color: '#f8fafc', fontSize: '13px', appearance: 'none', marginBottom: '10px' }}>
                      {Object.values(DATA_PROVIDERS).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select value={configParams.categoryId || ''} onChange={e => {
                        const catId = e.target.value;
                        const selectedCat = categories.find(c => String(c.id) === String(catId));
                        const newColor = selectedCat && selectedCat.color ? selectedCat.color : null;
                        setConfigParams(prev => ({ ...prev, categoryId: catId, provider: catId ? 'category_feed' : prev.provider, themeColor: newColor || prev.themeColor || '' }));
                      }} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30, 41, 59, 0.9)', color: '#f8fafc', fontSize: '13px', appearance: 'none', marginBottom: '10px' }}>
                      <option value="">All Categories (Latest News)</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name} ({cat.nameTa || 'Tamil'})</option>)}
                    </select>
                    <div style={{ marginTop: '10px' }}>
                      <ControlColor 
                        label="Theme Color" 
                        value={configParams.themeColor || '#e11d48'} 
                        onChange={v => setConfigParams(prev => ({ ...prev, themeColor: v }))} 
                      />
                    </div>
                  </>
                )}
              </Accordion>

              {activeConfigSection.sectionKey === 'website_navigation' && (
                <Accordion title="Navigation Style" isOpen={openAccordion === 'NavStyle'} onToggle={() => setOpenAccordion(openAccordion === 'NavStyle' ? '' : 'NavStyle')}>
                  <ControlSelect label="Style" value={configParams.navStyle} onChange={v => setConfigParams(prev => ({ ...prev, navStyle: v }))} options={[
                    {value: 'horizontal', label: 'Horizontal'},
                    {value: 'classic', label: 'Classic News Portal'},
                    {value: 'pills', label: 'Modern Pills'},
                    {value: 'minimal', label: 'Minimal'},
                    {value: 'underline', label: 'Underline Active'}
                  ]} />
                  <ControlSelect label="Alignment" value={configParams.alignment} onChange={v => setConfigParams(prev => ({ ...prev, alignment: v }))} options={[
                    {value: 'left', label: 'Left'},
                    {value: 'center', label: 'Center'},
                    {value: 'right', label: 'Right'}
                  ]} />
                  <ControlSelect label="Width" value={configParams.width} onChange={v => setConfigParams(prev => ({ ...prev, width: v }))} options={[
                    {value: 'full', label: 'Full Width'},
                    {value: 'container', label: 'Container'}
                  ]} />
                  <ControlSelect label="Position" value={configParams.position} onChange={v => setConfigParams(prev => ({ ...prev, position: v }))} options={[
                    {value: 'fixed', label: 'Fixed'},
                    {value: 'sticky', label: 'Sticky Top'},
                    {value: 'static', label: 'Standard'}
                  ]} />
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
                    Note: Transparent background can be set in the Colors tab. Mobile view automatically converts to a hamburger menu.
                  </div>
                </Accordion>
              )}

              <Accordion title="Layout" isOpen={openAccordion === 'Layout'} onToggle={() => setOpenAccordion(openAccordion === 'Layout' ? '' : 'Layout')}>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '4px', marginBottom: '16px' }}>
                  <button onClick={() => setViewMode('desktop')} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: viewMode === 'desktop' ? '#3b82f6' : 'transparent', color: viewMode === 'desktop' ? '#fff' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Desktop</button>
                  <button onClick={() => setViewMode('mobile')} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: viewMode === 'mobile' ? '#3b82f6' : 'transparent', color: viewMode === 'mobile' ? '#fff' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mobile</button>
                </div>
                <LayoutEditor config={configParams} setConfig={setConfigParams} viewMode={viewMode} />
              </Accordion>

              <Accordion title="Spacing" isOpen={openAccordion === 'Spacing'} onToggle={() => setOpenAccordion(openAccordion === 'Spacing' ? '' : 'Spacing')}>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '4px', marginBottom: '16px' }}>
                  <button onClick={() => setViewMode('desktop')} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: viewMode === 'desktop' ? '#3b82f6' : 'transparent', color: viewMode === 'desktop' ? '#fff' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Desktop</button>
                  <button onClick={() => setViewMode('mobile')} style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: viewMode === 'mobile' ? '#3b82f6' : 'transparent', color: viewMode === 'mobile' ? '#fff' : '#94a3b8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Mobile</button>
                </div>
                <SpacingEditor config={configParams} setConfig={setConfigParams} viewMode={viewMode} />
              </Accordion>

              <Accordion title="Typography" isOpen={openAccordion === 'Typography'} onToggle={() => setOpenAccordion(openAccordion === 'Typography' ? '' : 'Typography')}>
                <TypographyEditor config={configParams} setConfig={setConfigParams} viewMode={viewMode} />
              </Accordion>

              <Accordion title="Colors" isOpen={openAccordion === 'Colors'} onToggle={() => setOpenAccordion(openAccordion === 'Colors' ? '' : 'Colors')}>
                <ColorsEditor config={configParams} setConfig={setConfigParams} />
              </Accordion>

              <Accordion title="Background" isOpen={openAccordion === 'Background'} onToggle={() => setOpenAccordion(openAccordion === 'Background' ? '' : 'Background')}>
                <BackgroundEditor config={configParams} setConfig={setConfigParams} />
              </Accordion>

              <Accordion title="Border" isOpen={openAccordion === 'Border'} onToggle={() => setOpenAccordion(openAccordion === 'Border' ? '' : 'Border')}>
                <BorderEditor config={configParams} setConfig={setConfigParams} />
              </Accordion>

              <Accordion title="Animation" isOpen={openAccordion === 'Animation'} onToggle={() => setOpenAccordion(openAccordion === 'Animation' ? '' : 'Animation')}>
                <AnimationEditor config={configParams} setConfig={setConfigParams} />
              </Accordion>

            </div>

            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', background: 'rgba(15, 23, 42, 0.8)' }}>
              <button onClick={() => setActiveConfigSection(null)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveConfig} style={{ flex: 1, padding: '10px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Apply</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', color: '#64748b' }}>
              <Settings size={32} opacity={0.5} style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '13px', lineHeight: 1.5 }}>Select a block from the canvas or page navigator to edit its properties.</p>
            </div>
          </>
        )}
        
        {/* Recently Deleted / Restore Section (Always Visible if not empty) */}
        {trashBin.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15, 23, 42, 0.95)' }}>
             <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={14} color="#ef4444" /> Views / Recently Deleted</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }} className="custom-scrollbar">
               {trashBin.map(t => (
                 <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                   <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{t.sectionLabel}</span>
                   <button onClick={() => handleRestoreSection(t)} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Restore</button>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
      </div>

      {/* Version History Modal */}
      {showHistoryModal && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#1e293b', width: '600px', maxWidth: '90vw', borderRadius: '12px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '16px', color: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={20} color="#38bdf8" /> Version History
              </h3>
              <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }} className="custom-scrollbar">
              {historyLoading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading layout snapshots...</div>
              ) : historyList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No published history snapshots recorded yet.</div>
              ) : (
                historyList.map(h => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{h.versionLabel || `Snapshot #${h.id}`}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Published by <strong>{h.createdBy || 'System'}</strong> on {new Date(h.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button onClick={() => handleRollback(h.id)} style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '6px', cursor: 'pointer' }}>
                      <RotateCcw size={14} /> Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* AI Assistant Modal */}
      <AiWidgetAssistantModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onAddWidget={handleAddAiWidget} categories={categories} />

      {/* Component Library Modal */}
      {showComponentLibrary && createPortal(
        <ComponentLibraryModal 
          onClose={() => setShowComponentLibrary(false)} 
          onSelectComponent={handleAddDynamicComponent} 
        />,
        document.body
      )}

      {/* Global Styles for Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default HomeLayoutBuilder;
