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
  TextEditor, ButtonEditor, ControlColor, ControlSelect, ControlSlider, GridLayoutEditor
} from './VisualBuilderControls';
import { ComponentLibraryModal } from './ComponentLibraryModal';
import { DynamicComponentRenderer } from './DynamicComponentRenderer';
import { findNode, deleteNode, updateNode, insertNode, removeAndGetNode } from '../../utils/TreeHelpers';
import {
  Save, Eye, EyeOff, Trash2, Sliders, CheckCircle,
  RotateCcw, Undo2, X, PlusCircle, ArrowUp, ArrowDown, Settings,
  HelpCircle, Sparkles, Move, History, FileText, Wand2, Layers,
  Menu, Edit2, Search, Languages, Moon, Monitor, User, ChevronRight, ChevronLeft,
  FlaskConical, RotateCw
} from 'lucide-react';
// TEST-ONLY DUMMY LAYOUT INTEGRATION — safe to remove after layout testing.
import { applyLayoutToDummy, resetDummyLayout } from '../dummyLayoutService';
// END TEST-ONLY IMPORT
import NavigationBarEditor from './NavigationBarEditor';

const PREDEFINED_SECTIONS = Object.values(WIDGET_REGISTRY).map(w => ({
  key: w.type,
  label: w.name,
  color: w.color,
  desc: w.description
}));

export const generateBlockStyles = (configStr, viewMode = 'desktop', includeGrid = false) => {
  let styles = {};
  try {
    const config = typeof configStr === 'string' ? JSON.parse(configStr || '{}') : (configStr || {});

    // Background
    const bg = config.background || {};
    const bgColor = bg.color || config.colors?.background;
    const bgType = bg.type || (bgColor ? 'solid' : undefined);

    if (bgType === 'solid' || bgType === 'color') {
      if (bgColor) styles.backgroundColor = bgColor;
    } else if (bgType === 'gradient') {
      if (bg.gradient) styles.backgroundImage = bg.gradient;
    } else if (bgType === 'image') {
      if (bg.imageUrl || bg.image) {
        styles.backgroundImage = `url(${bg.imageUrl || bg.image})`;
        styles.backgroundSize = bg.backgroundSize || bg.size || 'cover';
        styles.backgroundPosition = bg.position || 'center';
        styles.backgroundRepeat = bg.repeat || 'no-repeat';
      }
    } else if (bgType === 'glass') {
      const blur = bg.blur !== undefined ? bg.blur : 10;
      const opacity = bg.opacity !== undefined ? bg.opacity / 100 : 0.8;
      styles.backdropFilter = `blur(${blur}px)`;
      styles.WebkitBackdropFilter = `blur(${blur}px)`;
      styles.backgroundColor = bgColor ? `${bgColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(255, 255, 255, ${opacity})`;
    } else if (bgColor) {
      styles.backgroundColor = bgColor;
    }

    // Border
    const b = config.border || {};
    const bColor = b.color || config.colors?.border;
    if (b.style && b.style !== 'none') {
      const bWidth = b.width !== undefined ? b.width : 1;
      styles.border = `${bWidth}px ${b.style} ${bColor || '#cbd5e1'}`;
    } else if (bColor) {
      styles.borderColor = bColor;
    }
    if (b.radius !== undefined) {
      styles.borderRadius = `${b.radius}px`;
    }
    const shadowBlur = parseInt(b.shadowBlur || 0, 10);
    const shadowSpread = parseInt(b.shadowSpread || 0, 10);
    if (shadowBlur > 0 || shadowSpread > 0) {
      styles.boxShadow = `0 4px ${shadowBlur}px ${shadowSpread}px ${b.shadowColor || 'rgba(0, 0, 0, 0.15)'}`;
    }

    // Typography
    const typo = (config.typography && (config.typography[viewMode] || config.typography['desktop'])) || {};
    if (typo.fontFamily) styles.fontFamily = typo.fontFamily;
    if (typo.fontSize) styles.fontSize = `${typo.fontSize}px`;
    if (typo.weight || typo.fontWeight) styles.fontWeight = typo.weight || typo.fontWeight;
    if (typo.textAlign) styles.textAlign = typo.textAlign;
    if (typo.lineHeight) styles.lineHeight = `${typo.lineHeight}em`;
    if (typo.letterSpacing) styles.letterSpacing = `${typo.letterSpacing}px`;
    if (typo.textTransform && typo.textTransform !== 'none') styles.textTransform = typo.textTransform;

    // Colors & CSS variables cascading override
    if (config.colors) {
      if (config.colors.text) {
        styles.color = config.colors.text;
        styles['--text-dark'] = config.colors.text;
        styles['--text-primary'] = config.colors.text;
        styles['--header-text'] = config.colors.text;
      }
      if (config.colors.textSecondary) {
        styles['--text-muted'] = config.colors.textSecondary;
        styles['--text-secondary'] = config.colors.textSecondary;
      }
      if (config.colors.accent) {
        styles['--primary'] = config.colors.accent;
        styles['--accent'] = config.colors.accent;
        styles['--hover-color'] = config.colors.accent;
      }
      if (config.colors.border) {
        styles['--border-color'] = config.colors.border;
      }
      if (config.colors.background) {
        styles['--white'] = config.colors.background;
        styles['--bg-card'] = config.colors.background;
        styles['--bg-secondary'] = config.colors.background;
        styles['--section-bg'] = config.colors.background;
      }
      if (config.colors.button) {
        styles['--button-bg'] = config.colors.button;
        styles['--btn-primary-bg'] = config.colors.button;
      }
      if (config.colors.buttonText) {
        styles['--button-text'] = config.colors.buttonText;
        styles['--btn-primary-text'] = config.colors.buttonText;
      }
    }

    // Spacing (Margins, Paddings, Gaps)
    const sp = (config.spacing && (config.spacing[viewMode] || config.spacing['desktop'])) || {};
    const u = config.spacing?.unit || 'px';
    if (sp.marginTop !== undefined && sp.marginTop !== 0) styles.marginTop = `${sp.marginTop}${u}`;
    if (sp.marginBottom !== undefined && sp.marginBottom !== 0) styles.marginBottom = `${sp.marginBottom}${u}`;
    if (sp.marginLeft !== undefined && sp.marginLeft !== 0) styles.marginLeft = `${sp.marginLeft}${u}`;
    if (sp.marginRight !== undefined && sp.marginRight !== 0) styles.marginRight = `${sp.marginRight}${u}`;
    if (sp.paddingTop !== undefined && sp.paddingTop !== 0) styles.paddingTop = `${sp.paddingTop}${u}`;
    if (sp.paddingBottom !== undefined && sp.paddingBottom !== 0) styles.paddingBottom = `${sp.paddingBottom}${u}`;
    if (sp.paddingLeft !== undefined && sp.paddingLeft !== 0) styles.paddingLeft = `${sp.paddingLeft}${u}`;
    if (sp.paddingRight !== undefined && sp.paddingRight !== 0) styles.paddingRight = `${sp.paddingRight}${u}`;
    if (sp.rowGap !== undefined && sp.rowGap > 0) styles.rowGap = `${sp.rowGap}${u}`;
    if (sp.columnGap !== undefined && sp.columnGap > 0) styles.columnGap = `${sp.columnGap}${u}`;

    // Layout
    const lay = (config.layout && (config.layout[viewMode] || config.layout['desktop'])) || {};
    if (lay.display) styles.display = lay.display;
    if (lay.justifyContent) styles.justifyContent = lay.justifyContent;
    if (lay.alignItems) styles.alignItems = lay.alignItems;
    if (lay.width) styles.width = `${lay.width}%`;
    if (lay.minHeight) styles.minHeight = `${lay.minHeight}px`;
    if (lay.overflowHidden) styles.overflow = 'hidden';

    // Visibility
    if (config.visibility && config.visibility[viewMode] === false) {
      styles.opacity = 0.3;
      styles.filter = 'grayscale(100%)';
    }

    // Grid Layout
    if (includeGrid && config.gridLayout) {
      const g = config.gridLayout[viewMode] || config.gridLayout['desktop'] || {};
      const displayMode = g.displayMode || 'grid';
      const columns = g.columns || 1;
      const rows = g.rows !== undefined ? g.rows : 1;
      const gap = g.gap !== undefined ? g.gap : 16;

      if (displayMode === 'carousel' || displayMode === 'horizontal-slider') {
        styles.display = 'flex';
        styles.gap = `${gap}px`;
        styles.overflowX = 'auto';
        styles.scrollSnapType = 'x mandatory';
        styles.paddingBottom = '8px';
        styles.WebkitOverflowScrolling = 'touch';
        styles.scrollbarWidth = 'none';
        styles.msOverflowStyle = 'none';
      } else if (displayMode === 'stack') {
        styles.display = 'flex';
        styles.flexDirection = 'column';
        styles.gap = `${gap}px`;
      } else if (columns > 0 || rows > 0) {
        styles.display = 'grid';
        if (columns > 0) styles.gridTemplateColumns = `repeat(${columns}, minmax(min(120px, 100%), 1fr))`;
        if (rows > 0) styles.gridTemplateRows = `repeat(${rows}, 1fr)`;
        styles.gap = `${gap}px`;
        styles.overflowX = 'auto';
        styles.WebkitOverflowScrolling = 'touch';
      } else {
        styles.display = 'flex';
        styles.flexDirection = 'column';
        styles.gap = `${gap}px`;
      }
    }

    return styles;
  } catch (e) {
    return {};
  }
};
const PremiumScrollContainer = ({ children, style, className }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Velocity tracking
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastXRef = useRef(0);
  const rafRef = useRef(null);

  const updateScrollArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => updateScrollArrows());
    observer.observe(el);
    updateScrollArrows();
    window.addEventListener('resize', updateScrollArrows);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollArrows);
    };
  }, [children]);

  useEffect(() => {
    const el = scrollRef.current;
    const handleNativeWheel = (e) => {
      // If user is scrolling vertically with wheel, map it to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    if (el) {
      el.addEventListener('wheel', handleNativeWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    velocityRef.current = 0;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    velocityRef.current = 0;
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
  };

  const handleMouseLeave = () => {
    if (isDragging) applyMomentum();
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    if (isDragging) applyMomentum();
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    if (isDragging) applyMomentum();
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const dx = e.pageX - lastXRef.current;
      velocityRef.current = dx / dt;
    }
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const dx = e.touches[0].pageX - lastXRef.current;
      velocityRef.current = dx / dt;
    }
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = now;
  };

  const applyMomentum = () => {
    let velocity = velocityRef.current * 15; // scalar

    const momentumLoop = () => {
      if (Math.abs(velocity) > 0.5) {
        scrollRef.current.scrollLeft -= velocity;
        velocity *= 0.92; // friction
        rafRef.current = requestAnimationFrame(momentumLoop);
      }
    };
    rafRef.current = requestAnimationFrame(momentumLoop);
  };

  const scrollByAmount = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', ...style }} className={className}>
      {/* Left Gradient & Arrow */}
      {showLeft && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px',
          background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 10, display: 'flex', alignItems: 'center', pointerEvents: 'none'
        }}>
          <button
            onClick={() => scrollByAmount(-350)}
            style={{
              pointerEvents: 'auto', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '50%',
              width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <ChevronLeft size={16} color="#374151" />
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          width: '100%',
          padding: '0 10px',
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onScroll={updateScrollArrows}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {children}
      </div>

      {/* Right Gradient & Arrow */}
      {showRight && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px',
          background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none'
        }}>
          <button
            onClick={() => scrollByAmount(350)}
            style={{
              pointerEvents: 'auto', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '50%',
              width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginRight: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <ChevronRight size={16} color="#374151" />
          </button>
        </div>
      )}
    </div>
  );
};

const HomeLayoutBuilder = () => {
  const getMappedName = (name) => {
    return name;
  };
  const [layout, setLayout] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [draggedKey, setDraggedKey] = useState(null);

  // View Mode: 'desktop' | 'mobile'
  const [viewMode, setViewMode] = useState('desktop');

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
  const [activeConfigSection, setActiveConfigSection] = useState(null);
  const [insertIndex, setInsertIndex] = useState(null); // Now stores the entire selected node (or root section if id < 100000)
  const [configTitle, setConfigTitle] = useState('');
  const [configParams, setConfigParams] = useState({ limit: 6, categoryId: '', type: 'grid', provider: 'latest_news' });

  // Dynamic DND State
  const [dynamicDraggedNodeId, setDynamicDraggedNodeId] = useState(null);

  // UI/UX Settings
  const [openAccordion, setOpenAccordion] = useState('General');
  const settingsScrollRef = useRef(null);
  const sectionRefs = useRef({});

  // UI/UX Enhancements: Sidebar Collapse State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return sessionStorage.getItem('layout_builder_sidebar') !== 'false';
  });

  // ── TEST-ONLY DUMMY LAYOUT INTEGRATION STATE ─────────────────────────────
  // Safe to remove after layout testing. See dummyLayoutService.js.
  const [hasUntestedChanges, setHasUntestedChanges] = useState(false);
  const [isApplyingToDummy, setIsApplyingToDummy] = useState(false);
  // dummyTestStatus: 'idle' | 'not_tested' | 'applying' | 'tested' | 'failed'
  const [dummyTestStatus, setDummyTestStatus] = useState('idle');
  const [lastDummyTestedAt, setLastDummyTestedAt] = useState(null);
  const [showDummyConfirmModal, setShowDummyConfirmModal] = useState(false);
  const [showDummySuccessModal, setShowDummySuccessModal] = useState(false);
  const [showDummyResetConfirm, setShowDummyResetConfirm] = useState(false);
  const [dummyErrorMessage, setDummyErrorMessage] = useState('');
  // ── END TEST-ONLY DUMMY LAYOUT INTEGRATION STATE ──────────────────────────

  useEffect(() => {
    if (isSidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    sessionStorage.setItem('layout_builder_sidebar', isSidebarCollapsed);

    return () => {
      // Clean up when unmounting
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isSidebarCollapsed]);

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
    // TEST-ONLY: Mark dummy as needing a new test whenever the layout changes.
    setHasUntestedChanges(true);
    if (dummyTestStatus === 'tested') setDummyTestStatus('not_tested');
    // END TEST-ONLY
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
    // Automatically apply current configuration parameters if sidebar editor is open/active
    let layoutToSave = [...layout];
    if (activeConfigSection) {
      layoutToSave = layoutToSave.map(item => {
        if (item.id === activeConfigSection.id) {
          return {
            ...item,
            sectionLabel: configTitle,
            configJson: JSON.stringify(configParams)
          };
        }
        return item;
      });
    }

    // Inject current taxonomy categories and custom navItems into website_navigation block before saving
    const navIndex = layoutToSave.findIndex(item => item.sectionKey === 'website_navigation');
    if (navIndex !== -1) {
      let config = {};
      try {
        config = typeof layoutToSave[navIndex].configJson === 'string'
          ? JSON.parse(layoutToSave[navIndex].configJson || '{}')
          : (layoutToSave[navIndex].configJson || {});
      } catch (e) { }

      config.categories = categories;
      const activeNavParams = activeConfigSection?.sectionKey === 'website_navigation' ? configParams : config;
      if (activeNavParams && activeNavParams.navItems) {
        config.navItems = activeNavParams.navItems;
      }
      layoutToSave[navIndex] = { ...layoutToSave[navIndex], configJson: JSON.stringify(config) };
    }

    // Sync to local storage & broadcast layoutUpdated event for instant zero-delay sync across tabs
    try {
      localStorage.setItem('dummy_layout_config', JSON.stringify(layoutToSave));
      window.dispatchEvent(new Event('layoutUpdated'));
    } catch (e) { }

    // 1. Instantly show alert popup and clear unsaved state (0ms delay!)
    setUnsavedChanges(false);
    setUndoStack([]);
    alert("Home layout changes published live successfully!");

    // 2. Perform background DB sync
    setSaving(true);
    try {
      let saved = false;
      try {
        const res = await api.put('/admin/layout/bulk-save', layoutToSave);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLayout(res.data);
          saved = true;
        }
      } catch (bulkErr) {
        console.warn("Bulk save endpoint fallback engaged", bulkErr);
      }

      if (!saved) {
        const reorderPayload = layoutToSave
          .filter(item => item.id && typeof item.id === 'number' && item.id < 1000000000)
          .map((item, idx) => ({
            id: item.id,
            displayOrder: idx + 1
          }));
        if (reorderPayload.length > 0) {
          await api.put('/admin/layout/reorder', reorderPayload);
        }

        for (let i = 0; i < layoutToSave.length; i++) {
          const item = layoutToSave[i];
          if (item.id && typeof item.id === 'number' && item.id < 1000000000) {
            await api.put(`/admin/layout/${item.id}`, {
              displayOrder: i + 1,
              isVisible: item.isVisible !== false,
              sectionLabel: item.sectionLabel,
              configJson: item.configJson
            }).catch(() => { });
          }
        }
      }
    } catch (err) {
      console.error("Failed to save layout changes", err);
    } finally {
      setSaving(false);
    }
  };

  // Add section from library
  const handleAddSectionKey = (key, insertAt = null) => {
    const predefined = PREDEFINED_SECTIONS.find(p => p.key === key);
    if (!predefined) return;

    // Check if key already exists in layout
    if (layout.some(item => item.sectionKey === key)) {
      alert(`${predefined.label} is already added to the homepage.`);
      return;
    }

    const newSection = {
      id: Date.now(), // Temp unique ID for React keys before save
      sectionKey: key,
      sectionLabel: predefined.label,
      displayOrder: layout.length + 1,
      isVisible: true,
      layoutType: 'WEB',
      configJson: JSON.stringify({ limit: 6, categoryId: '', type: 'grid' }),
      isNew: true // Flag to insert via API on Save
    };

    // Automatically trigger backend post to create, then reload layout
    api.post('/admin/layout', {
      sectionKey: newSection.sectionKey,
      sectionLabel: newSection.sectionLabel,
      displayOrder: newSection.displayOrder,
      isVisible: newSection.isVisible,
      layoutType: 'WEB',
      configJson: newSection.configJson
    }).then(() => {
      fetchLayout(); // Refresh from backend to ensure accurate state
    }).catch(err => {
      console.error("Failed to append section key", err);
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

      pushUndo(layoutToSave.filter(item => item.id !== id));

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
    // Auto-save previous active configuration before switching
    if (activeConfigSection) {
      let updated = [];
      if (activeRootSectionId && activeRootSectionId !== activeConfigSection.id) {
        updated = layout.map(item => {
          if (item.id === activeRootSectionId) {
            const parsed = JSON.parse(item.configJson || '{}');
            const children = parsed.children || [];
            const updatedChildren = updateNode(children, activeConfigSection.id, {
              name: configTitle,
              config: configParams
            });
            return { ...item, configJson: JSON.stringify({ ...parsed, children: updatedChildren }) };
          }
          return item;
        });
      } else {
        updated = layout.map(item => {
          if (item.id === activeConfigSection.id) {
            return {
              ...item,
              sectionLabel: configTitle,
              configJson: JSON.stringify(configParams)
            };
          }
          return item;
        });
      }
      setLayout(updated);
    }

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
      sectionLabel: 'Custom Section',
      displayOrder: layout.length + 1,
      isVisible: true,
      layoutType: 'WEB',
      configJson: JSON.stringify({ children: [newNode] }),
      isNew: true
    };

    api.post('/admin/layout', {
      sectionKey: newSection.sectionKey,
      sectionLabel: newSection.sectionLabel,
      displayOrder: newSection.displayOrder,
      isVisible: newSection.isVisible,
      layoutType: 'WEB',
      configJson: newSection.configJson
    }).then(() => {
      fetchLayout();
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



  // Grid Layout Helper
  const applyGridStyles = (config, currentViewMode) => {
    const defaultStyles = { display: 'flex', flexWrap: 'wrap', gap: '16px' };
    if (!config || !config.gridLayout) return defaultStyles;

    // Fallbacks if current view mode isn't explicitly set, cascade down from desktop
    const g = config.gridLayout[currentViewMode] || config.gridLayout['desktop'] || {};

    const displayMode = g.displayMode || 'grid';
    const columns = g.columns || 1;
    const rows = g.rows !== undefined ? g.rows : 1;
    const gap = g.gap !== undefined ? g.gap : 16;

    if (displayMode === 'carousel' || displayMode === 'horizontal-slider') {
      return {
        display: 'flex',
        gap: `${gap}px`,
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch',
        // Hide scrollbar for a cleaner mock look
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      };
    } else if (displayMode === 'stack') {
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`
      };
    } else if (columns > 0 || rows > 0) {
      // Default Grid
      const gridStyles = {
        display: 'grid',
        gap: `${gap}px`,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      };
      if (columns > 0) gridStyles.gridTemplateColumns = `repeat(${columns}, minmax(min(120px, 100%), 1fr))`;
      if (rows > 0) gridStyles.gridTemplateRows = `repeat(${rows}, 1fr)`;
      return gridStyles;
    } else {
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`
      };
    }
  };

  // Render mock HTML preview elements inside canvas
  const renderVisualMock = (sectionKey, label, configJsonStr, viewMode) => {
    const config = typeof configJsonStr === 'string' ? JSON.parse(configJsonStr || '{}') : (configJsonStr || {});
    // themeColor picks up from accent, button fill, or themeColor property
    const themeColor = config.themeColor || config.colors?.accent || config.colors?.button || '#3B82F6';
    const textColor = config.colors?.text;
    const textSecondaryColor = config.colors?.textSecondary;
    const bgColor = config.colors?.background || config.background?.color;
    const borderColor = config.colors?.border;
    const buttonFillColor = config.colors?.button;
    const buttonTextColor = config.colors?.buttonText;

    // Helper to find selected category from state
    const selectedCat = config.categoryId ? categories.find(c => String(c.id) === String(config.categoryId)) : null;

    // Helper to get limit count from grid/limit config
    const getLimitCount = (defaultLimit = 6) => {
      if (config.limit && parseInt(config.limit, 10) > 0) return parseInt(config.limit, 10);
      const cols = config.gridLayout?.[viewMode]?.columns || config.gridLayout?.['desktop']?.columns || 0;
      const rows = config.gridLayout?.[viewMode]?.rows !== undefined ? config.gridLayout?.[viewMode]?.rows : (config.gridLayout?.['desktop']?.rows !== undefined ? config.gridLayout?.['desktop']?.rows : 0);
      if (cols > 0 && rows > 0) return cols * rows;
      if (cols > 0) return cols * 2;
      return defaultLimit;
    };

    switch (sectionKey) {
      case 'website_navigation': {
        const navStyle = config.navStyle || 'horizontal';
        const align = config.alignment || 'left';
        let jc = 'flex-start';
        if (align === 'center') jc = 'center';
        if (align === 'right') jc = 'flex-end';

        // Navigation items to render
        const configuredNavItems = (config.navItems && Array.isArray(config.navItems) && config.navItems.length > 0)
          ? config.navItems.filter(i => i.isActive !== false)
          : null;

        const navBg = bgColor || '#000000';
        const navTextColor = textColor || '#ffffff';
        const navBorderColor = borderColor || 'rgba(255,255,255,0.1)';

        return (
          <div style={{ fontFamily: '"Inter", "Mukta Malar", sans-serif', width: '100%', overflow: 'hidden' }}>
            {/* Top Black/Custom Header */}
            <div style={{ background: navBg, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: navTextColor, borderBottom: `1px solid ${navBorderColor}` }}>

              {/* Left Side: Menu, Logo, Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Menu size={24} color={navTextColor} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src="/assets/logo-banner-dark.png"
                      alt="KING 24x7"
                      style={{ height: '40px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/logo-banner-dark.png'; // fallback
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Icons & Live TV */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Search size={20} color={navTextColor} />
                <Languages size={20} color={navTextColor} />
                <Moon size={20} color={navTextColor} />
                <div style={{
                  background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
                }}>
                  <Monitor size={14} /> LIVE
                </div>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#000" />
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div style={{ background: navBg, padding: '0 16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <PremiumScrollContainer
                style={{ display: 'flex', gap: navStyle === 'pills' ? '8px' : '0', alignItems: 'center', justifyContent: jc, margin: 0, width: '100%', padding: '6px 0' }}
                className="hide-scrollbar"
              >
                {configuredNavItems ? (
                  configuredNavItems.map((item, idx) => {
                    const isPill = navStyle === 'pills';
                    const isUnderline = navStyle === 'underline' || navStyle === 'classic';
                    const isFirst = idx === 0;
                    const activeSubs = (item.subcategories || []).filter(s => s.isActive !== false);
                    const hasSubs = activeSubs.length > 0;
                    return (
                      <div
                        key={item.id || idx}
                        style={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          borderBottom: (isUnderline && isFirst) ? `3px solid ${themeColor}` : '3px solid transparent',
                          borderRadius: isPill ? '20px' : '0',
                          background: (isPill && isFirst) ? themeColor : isPill ? 'rgba(255,255,255,0.1)' : 'transparent',
                          padding: isPill ? '4px 12px' : '0',
                          flexShrink: 0
                        }}
                      >
                        <div style={{ color: (isPill && isFirst) ? '#FFFFFF' : isFirst ? '#FFFFFF' : '#94A3B8', padding: isPill ? '4px 6px' : '8px 4px 6px 12px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>{item.titleEn || item.name || item.titleTa}</span>
                          {item.titleTa && <span style={{ fontSize: '11px', opacity: 0.7 }}>({item.titleTa})</span>}
                          {hasSubs && <span style={{ fontSize: '10px', color: isFirst ? '#ffffff' : '#38bdf8', marginLeft: '2px' }}>▼</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', borderBottom: `3px solid ${themeColor}`, flexShrink: 0 }}>
                      <div style={{ color: '#FFFFFF', padding: '8px 4px 6px 12px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', display: 'inline-block' }}>
                        Home
                      </div>
                    </div>
                    {(categories.length > 0 ? categories : [
                      { id: 1, name: 'Politics' }, { id: 2, name: 'Business' }, { id: 3, name: 'Sports' },
                      { id: 4, name: 'Cinema' }, { id: 5, name: 'Tech' }, { id: 6, name: 'Regional', hasSubs: true }
                    ]).map((cat, index) => (
                      <div key={cat.id || index} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', borderBottom: '3px solid transparent', flexShrink: 0 }}>
                        <div style={{ color: '#94A3B8', padding: '8px 4px 6px 12px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>{cat.name || cat.nameEn}</span>
                          {(cat.hasSubs || cat.slug === 'regional' || cat.slug === 'videos') && <span style={{ fontSize: '10px', color: '#38bdf8' }}>▼</span>}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </PremiumScrollContainer>
            </div>
          </div>
        );
      }
      case 'news_ticker': {
        const tickerContent = config.content || config.text || config.tickerText || "தங்கம் (24K/10g): ₹72,429 • நெல் கொள்முதல் விலை உயர்வு...";
        return (
          <div style={{ background: bgColor || config.colors?.background || '#FEF3C7', color: textColor || config.colors?.text || '#D97706', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: `4px solid ${themeColor}`, fontWeight: 600 }}>
            <span style={{ background: themeColor, color: buttonTextColor || '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>{label || "LIVE TICKER"}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tickerContent}</span>
          </div>
        );
      }
      case 'hero': {
        const sideCount = getLimitCount(3);
        const catBadge = selectedCat ? selectedCat.name.toUpperCase() : (config.tag || 'FEATURED');
        return (
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'mobile' ? '1fr' : '2fr 1.2fr', gap: '10px', minHeight: '130px' }}>
            <div style={{ background: bgColor ? bgColor : 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '6px', padding: '16px', display: 'flex', alignItems: 'flex-end', color: textColor || '#ffffff', borderTop: `4px solid ${themeColor}` }}>
              <div>
                <span style={{ fontSize: '9px', background: themeColor, color: buttonTextColor || '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{catBadge}</span>
                <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px', lineHeight: 1.3 }}>{label || config.content || "Breaking News: Key updates unfolding live across Tamil Nadu..."}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Array.from({ length: sideCount }).map((_, i) => (
                <div key={i} style={{ flex: 1, background: bgColor || '#F1F5F9', borderRadius: '4px', padding: '8px 10px', border: `1px solid ${borderColor || '#E2E8F0'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: themeColor, flexShrink: 0 }}></div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: textColor || '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Top Story #{i + 1}: Important announcement published...
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'quick_access': {
        const items = config.items || (categories.length > 0 ? categories.slice(0, 8).map(c => c.name) : ['All', 'Directory', 'Wishes', 'Obituaries', 'Jobs', 'Classifieds']);
        return (
          <div style={{ ...applyGridStyles(config, viewMode), background: bgColor || 'var(--bg-secondary)', padding: '10px', borderRadius: '6px', border: `1px solid ${borderColor || 'var(--border-color)'}` }}>
            {items.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 600, color: textSecondaryColor || textColor || 'var(--text-secondary)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: buttonFillColor || themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: buttonTextColor || '#fff', fontSize: '10px', fontWeight: 700 }}>
                  {(typeof cat === 'string' ? cat : cat.name || '')[0] || '★'}
                </div>
                <span>{typeof cat === 'string' ? cat : cat.name || cat.nameEn}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'latest_news': {
        const count = getLimitCount(6);
        const gridTitle = label || (selectedCat ? `${selectedCat.name} News` : 'Latest News Grid');
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '4px', height: '14px', background: themeColor, borderRadius: '2px' }}></div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: textColor || '#334155' }}>{gridTitle}</div>
            </div>
            <div style={applyGridStyles(config, viewMode)}>
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{ border: `1px solid ${borderColor || 'var(--border-color)'}`, borderRadius: '6px', overflow: 'hidden', background: bgColor || 'var(--bg-card)', minWidth: config.gridLayout?.[viewMode]?.displayMode === 'carousel' ? '200px' : 'auto', scrollSnapAlign: 'start' }}>
                  <div style={{ height: '80px', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '10px' }}>
                    Article Image #{i + 1}
                  </div>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '9px', color: themeColor, fontWeight: 700 }}>{selectedCat ? selectedCat.name.toUpperCase() : 'NEWS'}</span>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: textColor || '#1e293b', lineHeight: 1.3 }}>
                      {selectedCat ? `${selectedCat.name} update #${i + 1}...` : `Headline news story #${i + 1}...`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'video_news': {
        const count = getLimitCount(4);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '4px', height: '14px', background: themeColor, borderRadius: '2px' }}></div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: textColor || '#334155' }}>{label || 'Video Gallery'}</div>
            </div>
            <div style={applyGridStyles(config, viewMode)}>
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{ border: `1px solid ${borderColor || 'var(--border-color)'}`, borderRadius: '6px', overflow: 'hidden', background: bgColor || 'var(--bg-card)', minWidth: config.gridLayout?.[viewMode]?.displayMode === 'carousel' ? '220px' : 'auto', scrollSnapAlign: 'start' }}>
                  <div style={{ height: '90px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff', position: 'relative' }}>
                    ▶
                    <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '9px', padding: '2px 4px', borderRadius: '3px' }}>04:15</span>
                  </div>
                  <div style={{ padding: '8px', fontSize: '10px', fontWeight: 600, color: textColor || '#1e293b' }}>
                    {selectedCat ? `${selectedCat.name} Video #${i + 1}` : `Exclusive Video Broadcast #${i + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'web_stories': {
        const count = getLimitCount(6);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '4px', height: '14px', background: themeColor, borderRadius: '2px' }}></div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: textColor || '#334155' }}>{label || 'Web Stories'}</div>
            </div>
            <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{ minWidth: '85px', height: '125px', borderRadius: '8px', background: bgColor ? `linear-gradient(to top, ${bgColor}ee, transparent)` : 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', border: `2px solid ${themeColor}`, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '6px', scrollSnapAlign: 'start' }}>
                  <span style={{ fontSize: '9px', color: textColor || '#fff', fontWeight: 700, lineHeight: 1.2 }}>Story #{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'trending_sidebar': {
        const count = getLimitCount(5);
        return (
          <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
            <div style={{ background: bgColor || 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', border: `1px solid ${borderColor || 'var(--border-color)'}`, width: '100%' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: themeColor, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 {label || config.content || 'TRENDING NEWS'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} style={{ fontSize: '10px', borderBottom: i < count - 1 ? `1px solid ${borderColor || 'var(--border-color)'}` : 'none', paddingBottom: '6px', color: textColor || 'var(--text-primary)', fontWeight: 600 }}>
                    {i + 1}. Trending headline story item #{i + 1}...
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'weather': {
        const city = config.city || config.location || config.content || 'Chennai, TN';
        const temp = config.temperature || '32°C';
        const condition = config.condition || 'Partly Cloudy';
        return (
          <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
            <div style={{ background: bgColor || '#F0F9FF', border: `1px solid ${borderColor || '#B9E6FE'}`, padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: textColor || '#0369A1', width: '100%' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{city}</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>{condition}</div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: themeColor }}>{temp} 🌤️</div>
            </div>
          </div>
        );
      }
      case 'crowd_reporter': {
        const title = label || config.title || '📢 CITIZEN CROWD REPORTER';
        const subtitle = config.content || config.subtitle || 'Submit ground breaking news alerts directly here!';
        return (
          <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
            <div style={{ border: `1.5px dashed ${themeColor}`, background: bgColor || '#FEF3C7', padding: '14px', borderRadius: '8px', textAlign: 'center', color: textColor || '#D97706', width: '100%' }}>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>{title}</div>
              <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9 }}>{subtitle}</div>
            </div>
          </div>
        );
      }
      case 'business_case': {
        const count = getLimitCount(3);
        return (
          <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
            <div style={{ background: bgColor || '#F5F3FF', border: `1px solid ${borderColor || '#DDD6FE'}`, padding: '12px', borderRadius: '8px', color: textColor || '#6D28D9', width: '100%' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>💼 {label || 'Local Business Spotlights'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: '8px' }}>
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} style={{ height: '36px', background: '#fff', borderRadius: '4px', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600 }}>
                    Business #{i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'news_digest': {
        const digestText = config.content || 'Summarized news briefs generated automatically by AI editors.';
        return (
          <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
            <div style={{ background: bgColor || '#ECFDF5', border: `1px solid ${borderColor || '#A7F3D0'}`, padding: '12px', borderRadius: '8px', color: textColor || '#047857', width: '100%' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>📬 {label || 'Curated News Digest'}</div>
              <div style={{ fontSize: '10px', opacity: 0.9 }}>{digestText}</div>
            </div>
          </div>
        );
      }
      default: {
        const count = getLimitCount(1);
        return (
          <div style={applyGridStyles(config, viewMode)} className="horizontal-scroll-grid">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} style={{ flex: 1, padding: '20px', background: bgColor || '#F1F5F9', border: `1px dashed ${borderColor || '#CBD5E1'}`, borderRadius: '6px', textAlign: 'center', color: textColor || '#64748B', fontSize: '12px', fontWeight: 600, minWidth: config.gridLayout?.[viewMode]?.displayMode === 'carousel' ? '200px' : 'auto', scrollSnapAlign: 'start' }}>
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>🧩</div>
                {label || sectionKey} Component {i + 1}
              </div>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <>
      <style>{`
  body {
    overflow: hidden !important;
  }
  .builder-section-wrapper:hover .section-hover-toolbar {
    opacity: 1 !important;
  }
`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: 'calc(100vw - var(--sidebar-width))', position: 'fixed', top: 0, left: 'var(--sidebar-width)', backgroundColor: '#0f172a', fontFamily: 'Inter, sans-serif', color: '#f8fafc', overflow: 'hidden', zIndex: 100, transition: 'left 250ms ease, width 250ms ease' }}>

        {/* Floating Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderLeft: 'none',
            color: '#38bdf8',
            padding: '16px 6px',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '4px 0 15px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)'; e.currentTarget.style.color = '#38bdf8'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isSidebarCollapsed ? (
              <>▶</>
            ) : (
              <>◀</>
            )}
          </div>
        </button>

        {/* Premium Top Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
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
            {/* Preview on Homepage button - saves layout to localStorage and opens frontend */}
            <button
              onClick={() => {
                // Auto-commit active section config before previewing
                const layoutToPreview = layout.map(item => {
                  const isActive = activeConfigSection && activeConfigSection.id === item.id;
                  return isActive
                    ? { ...item, configJson: JSON.stringify(configParams) }
                    : item;
                });
                try {
                  localStorage.setItem('dummy_layout_config', JSON.stringify(layoutToPreview));
                } catch (e) {
                  console.warn('Could not save to localStorage', e);
                }
                window.open('http://localhost:5173/', '_blank');
              }}
              title="Save current layout as preview and open it on the actual homepage"
              style={{
                padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff', border: 'none', borderRadius: '6px',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.35)'; }}
            >
              👁 Preview on Homepage
            </button>
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

          {/* Left/Center Column for Breadcrumb and Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#94a3b8' }}>
              Home Layout
              {activeConfigSection && (
                <>
                  <ChevronRight size={14} /> <span style={{ color: '#fff', fontWeight: 600 }}>{activeConfigSection.sectionLabel || activeConfigSection.sectionKey}</span>
                </>
              )}
            </div>

            {/* Center Panel: Live Canvas Workspace */}
            <div id="canvas-scroll-container" style={{ flex: 1, overflow: 'hidden', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', position: 'relative' }}>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflow: 'hidden' }}>

                <div style={{
                  width: viewMode === 'mobile' ? '390px' : viewMode === 'tablet' ? '834px' : '100%',
                  maxWidth: viewMode === 'mobile' ? '390px' : viewMode === 'tablet' ? '834px' : '1440px',
                  background: '#ffffff', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {/* Simulated Browser Frame Header */}
                  <div onClick={(e) => e.stopPropagation()} style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
                    </div>
                    <div style={{ background: '#e2e8f0', padding: '4px 20px', borderRadius: '4px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      kings24x7.com
                    </div>
                    <div style={{ width: '40px' }}></div>
                  </div>

                  {/* Inner Scrollable Webpage Content */}
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="custom-scrollbar">

                    {/* Canvas Blocks */}
                    <div style={{ background: '#fff', padding: '0', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
                      {loading ? (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>Loading visual homepage editor...</div>
                      ) : layout.length === 0 ? (
                        <div onClick={(e) => { e.stopPropagation(); setShowComponentLibrary(true); setInsertIndex(0); }} style={{ padding: '80px', textAlign: 'center', color: '#3b82f6', background: '#eff6ff', margin: '24px', border: '2px dashed #bfdbfe', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'} onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}>
                          <PlusCircle size={32} style={{ margin: '0 auto 12px' }} />
                          <div style={{ fontSize: '16px', fontWeight: 600 }}>Homepage canvas is empty</div>
                          <div style={{ fontSize: '13px', color: '#60a5fa', marginTop: '4px' }}>Click to add your first section</div>
                        </div>
                      ) : (<>
                        {layout.map((item, idx) => {
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
                          } catch (e) { }

                          return (
                            <React.Fragment key={item.id}>

                              {/* Inline Add Button Before Item */}
                              <div
                                onClick={(e) => { e.stopPropagation(); setShowComponentLibrary(true); setInsertIndex(idx); }}
                                style={{
                                  height: '24px', margin: '-12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', zIndex: 10, position: 'relative', cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                              >
                                <div style={{ width: '100%', height: '2px', background: '#3b82f6' }}></div>
                                <div style={{ position: 'absolute', background: '#3b82f6', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                  <PlusCircle size={16} />
                                </div>
                              </div>

                              <div
                                key={item.id + '_box'}
                                ref={(el) => (sectionRefs.current[item.id] = el)}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, idx)}
                                onClick={(e) => { e.stopPropagation(); handleOpenConfig(item); }}
                                style={{
                                  position: 'relative',
                                  border: isActive ? '2px solid #3b82f6' : '1px solid transparent',
                                  background: item.isVisible ? '#ffffff' : '#f8fafc',
                                  opacity: item.isVisible ? 1 : 0.5,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  maxWidth: '100%',
                                  boxSizing: 'border-box',
                                  ...spacingStyle
                                }}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.border = '1px dashed #94a3b8'; }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.border = '1px solid transparent'; }}
                                className="builder-section-wrapper"
                              >
                                {/* Floating Action Toolbar */}
                                <div className="section-hover-toolbar" style={{
                                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                                  display: 'flex', alignItems: 'center', background: '#1e293b', color: '#fff',
                                  padding: '4px 12px', borderRadius: '20px', gap: '12px', zIndex: 20,
                                  opacity: isActive ? 1 : 0, transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  maxWidth: '95%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none'
                                }}>
                                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.sectionLabel}</span>
                                  <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}></div>

                                  <button onClick={(e) => { e.stopPropagation(); handleOpenConfig(item); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }} title="Edit" onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                    ✏ Edit
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleOpenConfig(item); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }} title="Settings" onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                    ⚙ Settings
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setShowComponentLibrary(true); setInsertIndex(idx + 1); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }} title="Add Below" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                    ＋ Add Below
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDuplicateSection(item.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }} title="Duplicate" onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                    ⧉ Duplicate
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleRemoveSection(item.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }} title="Delete" onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                                    🗑 Delete
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

                                <div className="horizontal-scroll-grid" style={{ pointerEvents: item.sectionKey === 'custom_builder' ? 'auto' : 'none', position: 'relative', zIndex: 3, ...(isActive ? generateBlockStyles(JSON.stringify(configParams), viewMode, item.sectionKey === 'custom_builder') : generateBlockStyles(item.configJson, viewMode, item.sectionKey === 'custom_builder')) }}>
                                  {item.sectionKey === 'custom_builder' ? (
                                    (JSON.parse(item.configJson || '{}').children || []).length > 0 ? (
                                      (JSON.parse(item.configJson || '{}').children || []).map(node => (
                                        <DynamicComponentRenderer
                                          key={node.id}
                                          node={node}
                                          viewMode={viewMode}
                                          activeNodeId={activeConfigSection?.id}
                                          activeConfigParams={configParams}
                                          onSelectNode={(nodeId) => {
                                            const found = findNode(JSON.parse(item.configJson || '{}').children || [], nodeId);
                                            if (found) handleOpenConfig(found, true, item.id);
                                          }}
                                          onUpdateNode={() => { }}
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
                                    renderVisualMock(item.sectionKey, item.sectionLabel, isActive ? JSON.stringify(configParams) : item.configJson, viewMode)
                                  )}
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                        {layout.length > 0 && (
                          <div
                            onClick={(e) => { e.stopPropagation(); setShowComponentLibrary(true); setInsertIndex(layout.length); }}
                            style={{
                              height: '24px', margin: '-12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', zIndex: 10, position: 'relative', cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                          >
                            <div style={{ width: '100%', height: '2px', background: '#3b82f6' }}></div>
                            <div style={{ position: 'absolute', background: '#3b82f6', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                              <PlusCircle size={16} />
                            </div>
                          </div>
                        )}
                      </>)}
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

                  </div> {/* End Inner Scrollable Content */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Properties */}
          <div style={{ width: '320px', background: 'rgba(30, 41, 59, 0.4)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', zIndex: 5, transition: 'width 0.3s ease' }}>
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

                  <Accordion title="Layout & Grid" isOpen={openAccordion === 'Grid'} onToggle={() => setOpenAccordion(openAccordion === 'Grid' ? '' : 'Grid')}>
                    <GridLayoutEditor config={configParams} setConfig={setConfigParams} viewMode={viewMode} />
                  </Accordion>

                  <Accordion title="Data Source" isOpen={openAccordion === 'DataSource'} onToggle={() => setOpenAccordion(openAccordion === 'DataSource' ? '' : 'DataSource')}>
                    {activeConfigSection.type === 'heading' || activeConfigSection.type === 'paragraph' ? (
                      <TextEditor config={configParams} setConfig={setConfigParams} />
                    ) : activeConfigSection.type === 'button' ? (
                      <ButtonEditor config={configParams} setConfig={setConfigParams} />
                    ) : activeConfigSection.sectionKey === 'website_navigation' ? (
                      <NavigationBarEditor
                        items={configParams.navItems}
                        categories={categories}
                        onChange={(newNavItems) => {
                          setConfigParams(prev => ({ ...prev, navItems: newNavItems }));
                          setLayout(prevLayout => prevLayout.map(sec => {
                            if (sec.sectionKey === 'website_navigation') {
                              let cfg = {};
                              try { cfg = typeof sec.configJson === 'string' ? JSON.parse(sec.configJson || '{}') : (sec.configJson || {}); } catch (e) { }
                              cfg.navItems = newNavItems;
                              return { ...sec, configJson: JSON.stringify(cfg) };
                            }
                            return sec;
                          }));
                          setUnsavedChanges(true);
                        }}
                      />
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
                        { value: 'horizontal', label: 'Horizontal' },
                        { value: 'classic', label: 'Classic News Portal' },
                        { value: 'pills', label: 'Modern Pills' },
                        { value: 'minimal', label: 'Minimal' },
                        { value: 'underline', label: 'Underline Active' }
                      ]} />
                      <ControlSelect label="Alignment" value={configParams.alignment} onChange={v => setConfigParams(prev => ({ ...prev, alignment: v }))} options={[
                        { value: 'left', label: 'Left' },
                        { value: 'center', label: 'Center' },
                        { value: 'right', label: 'Right' }
                      ]} />
                      <ControlSelect label="Width" value={configParams.width} onChange={v => setConfigParams(prev => ({ ...prev, width: v }))} options={[
                        { value: 'full', label: 'Full Width' },
                        { value: 'container', label: 'Container' }
                      ]} />
                      <ControlSelect label="Position" value={configParams.position} onChange={v => setConfigParams(prev => ({ ...prev, position: v }))} options={[
                        { value: 'fixed', label: 'Fixed' },
                        { value: 'sticky', label: 'Sticky Top' },
                        { value: 'static', label: 'Standard' }
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

                  <Accordion title="Shadow" isOpen={openAccordion === 'Shadow'} onToggle={() => setOpenAccordion(openAccordion === 'Shadow' ? '' : 'Shadow')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', width: '90px', flexShrink: 0 }}>Shadow Blur</label>
                      <input type="range" min={0} max={100} value={configParams.border?.shadowBlur || 0} onChange={e => { const val = e.target.value; setConfigParams(prev => ({ ...prev, border: { ...(prev.border || {}), shadowBlur: val } })); }} style={{ flex: 1 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', width: '90px', flexShrink: 0 }}>Shadow Spread</label>
                      <input type="range" min={-50} max={100} value={configParams.border?.shadowSpread || 0} onChange={e => { const val = e.target.value; setConfigParams(prev => ({ ...prev, border: { ...(prev.border || {}), shadowSpread: val } })); }} style={{ flex: 1 }} />
                    </div>
                  </Accordion>

                  <Accordion title="Visibility" isOpen={openAccordion === 'Visibility'} onToggle={() => setOpenAccordion(openAccordion === 'Visibility' ? '' : 'Visibility')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Show on Desktop</label>
                      <input type="checkbox" checked={configParams.visibility?.desktop !== false} onChange={e => { const val = e.target.checked; setConfigParams(prev => ({ ...prev, visibility: { ...(prev.visibility || {}), desktop: val } })); }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Show on Tablet</label>
                      <input type="checkbox" checked={configParams.visibility?.tablet !== false} onChange={e => { const val = e.target.checked; setConfigParams(prev => ({ ...prev, visibility: { ...(prev.visibility || {}), tablet: val } })); }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Show on Mobile</label>
                      <input type="checkbox" checked={configParams.visibility?.mobile !== false} onChange={e => { const val = e.target.checked; setConfigParams(prev => ({ ...prev, visibility: { ...(prev.visibility || {}), mobile: val } })); }} />
                    </div>
                  </Accordion>

                  <Accordion title="SEO" isOpen={openAccordion === 'SEO'} onToggle={() => setOpenAccordion(openAccordion === 'SEO' ? '' : 'SEO')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', width: '90px' }}>Heading Tag</label>
                      <input type="text" value={configParams.seo?.headingTag || ''} onChange={e => { const val = e.target.value; setConfigParams(prev => ({ ...prev, seo: { ...(prev.seo || {}), headingTag: val } })); }} style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', fontSize: '12px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', width: '90px' }}>Aria Label</label>
                      <input type="text" value={configParams.seo?.ariaLabel || ''} onChange={e => { const val = e.target.value; setConfigParams(prev => ({ ...prev, seo: { ...(prev.seo || {}), ariaLabel: val } })); }} style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', fontSize: '12px' }} />
                    </div>
                  </Accordion>

                  <Accordion title="Advanced" isOpen={openAccordion === 'Advanced'} onToggle={() => setOpenAccordion(openAccordion === 'Advanced' ? '' : 'Advanced')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', width: '90px' }}>Custom CSS Class</label>
                      <input type="text" value={configParams.advanced?.customClass || ''} onChange={e => { const val = e.target.value; setConfigParams(prev => ({ ...prev, advanced: { ...(prev.advanced || {}), customClass: val } })); }} style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', fontSize: '12px' }} />
                    </div>
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

        {/* ── TEST-ONLY DUMMY LAYOUT INTEGRATION MODALS ────────────────────────
           Remove all three modal blocks below to cleanly delete this feature.
           Also remove the button block in the toolbar above marked TEST-ONLY. */}

        {/* 1. Confirmation Modal — "Test changes on Dummy Layout Page?" */}
        {showDummyConfirmModal && createPortal(
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ background: '#1e293b', width: '480px', maxWidth: '90vw', borderRadius: '14px', padding: '28px', boxShadow: '0 25px 60px -10px rgba(0,0,0,0.6)', border: '1px solid rgba(124,58,237,0.3)', color: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FlaskConical size={20} color="#a78bfa" />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Test changes on Dummy Layout Page?</h3>
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                These changes will be applied <strong style={{ color: '#a78bfa' }}>only to the Dummy Layout Page</strong> for testing.
                <br /><br />
                <span style={{ color: '#10b981' }}>✓</span> The original public website <strong>will not be modified.</strong>
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDummyConfirmModal(false)}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                >Cancel</button>
                <button
                  onClick={async () => {
                    setShowDummyConfirmModal(false);
                    setIsApplyingToDummy(true);
                    setDummyTestStatus('applying');
                    setDummyErrorMessage('');
                    try {
                      let layoutToTest = layout;
                      if (activeConfigSection) {
                        layoutToTest = layout.map(item => {
                          if (item.id === activeConfigSection.id) {
                            return {
                              ...item,
                              sectionLabel: configTitle,
                              configJson: JSON.stringify(configParams)
                            };
                          }
                          return item;
                        });
                      }
                      await applyLayoutToDummy(layoutToTest);
                      setDummyTestStatus('tested');
                      setLastDummyTestedAt(new Date());
                      setHasUntestedChanges(false);
                      setShowDummySuccessModal(true);
                    } catch (err) {
                      console.error('[DUMMY LAYOUT] Apply to dummy failed:', err);
                      setDummyTestStatus('failed');
                      setDummyErrorMessage(
                        err?.response?.data?.error ||
                        err?.message ||
                        'Unknown error occurred.'
                      );
                    } finally {
                      setIsApplyingToDummy(false);
                    }
                  }}
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
                >
                  <FlaskConical size={14} /> Apply to Dummy
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* 2. Success Modal — shown after dummy apply succeeds */}
        {showDummySuccessModal && createPortal(
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ background: '#1e293b', width: '480px', maxWidth: '90vw', borderRadius: '14px', padding: '28px', boxShadow: '0 25px 60px -10px rgba(0,0,0,0.6)', border: '1px solid rgba(16,185,129,0.3)', color: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={22} color="#10b981" />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#10b981' }}>Dummy Layout Applied Successfully</h3>
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '8px' }}>
                Test layout applied successfully to the <strong style={{ color: '#a78bfa' }}>Dummy Layout Page</strong>.
              </p>
              <p style={{ fontSize: '13px', color: '#10b981', marginBottom: '24px' }}>
                ✓ The original public website was <strong>not changed</strong>.
              </p>
              {lastDummyTestedAt && (
                <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>
                  Last tested on Dummy: {new Date(lastDummyTestedAt).toLocaleString()}
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDummySuccessModal(false)}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                >Continue Editing</button>
                <button
                  onClick={() => { window.open('/dummy-layout', '_blank'); setShowDummySuccessModal(false); }}
                  style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <FlaskConical size={14} /> Open Dummy Layout Page
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* 3. Reset Dummy Confirm Modal */}
        {showDummyResetConfirm && createPortal(
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ background: '#1e293b', width: '440px', maxWidth: '90vw', borderRadius: '14px', padding: '28px', boxShadow: '0 25px 60px -10px rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.2)', color: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RotateCw size={20} color="#f87171" />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Reset Dummy Layout?</h3>
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                This will clear the Dummy Layout Page back to its empty placeholder state.
                <br /><br />
                <span style={{ color: '#10b981' }}>✓</span> The production layout and original public website <strong>will not be affected.</strong>
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDummyResetConfirm(false)}
                  style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
                >Cancel</button>
                <button
                  onClick={async () => {
                    setShowDummyResetConfirm(false);
                    try {
                      await resetDummyLayout();
                      setDummyTestStatus('idle');
                      setLastDummyTestedAt(null);
                      setHasUntestedChanges(true);
                      setDummyErrorMessage('');
                      alert('Dummy Layout Page has been reset. The production layout was not changed.');
                    } catch (err) {
                      console.error('[DUMMY LAYOUT] Reset failed:', err);
                      alert('Failed to reset dummy layout: ' + (err?.message || 'Unknown error'));
                    }
                  }}
                  style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                >Reset Dummy Layout</button>
              </div>
            </div>
          </div>,
          document.body
        )}
        {/* ── END TEST-ONLY DUMMY LAYOUT INTEGRATION MODALS ────────────────── */}

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
    </>
  );
};

export default HomeLayoutBuilder;
