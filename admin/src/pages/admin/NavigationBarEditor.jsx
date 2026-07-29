import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, ArrowDown, Trash2, Plus, Edit3, Check, X, 
  ChevronRight, Layers, Eye, EyeOff, Sparkles, RefreshCw, FolderPlus, CornerDownRight
} from 'lucide-react';

export const DEFAULT_NAV_ITEMS = [
  { id: 'home', slug: 'home', titleEn: 'Home', titleTa: 'முகப்பு', linkUrl: '/', isActive: true, type: 'custom', subcategories: [] },
  { id: 'politics', slug: 'politics', titleEn: 'Politics', titleTa: 'அரசியல்', linkUrl: '/category/politics', isActive: true, type: 'category', subcategories: [] },
  { id: 'business', slug: 'business', titleEn: 'Business', titleTa: 'வணிகம்', linkUrl: '/category/business', isActive: true, type: 'category', subcategories: [] },
  { id: 'sports', slug: 'sports', titleEn: 'Sports', titleTa: 'விளையாட்டு', linkUrl: '/category/sports', isActive: true, type: 'category', subcategories: [] },
  { id: 'cinema', slug: 'cinema', titleEn: 'Cinema', titleTa: 'சினிமா', linkUrl: '/category/cinema', isActive: true, type: 'category', subcategories: [] },
  { id: 'tech', slug: 'tech', titleEn: 'Technology', titleTa: 'தொழில்நுட்பம்', linkUrl: '/category/tech', isActive: true, type: 'category', subcategories: [] },
  { 
    id: 'regional', slug: 'regional', titleEn: 'Regional', titleTa: 'நம்ம ஊர்', linkUrl: '/directory', isActive: true, type: 'category',
    subcategories: [
      { id: 'sub-dir', slug: 'directory', titleEn: 'Local Business Directory', titleTa: 'வணிக அடைவு', linkUrl: '/directory', isActive: true },
      { id: 'sub-deals', slug: 'deals', titleEn: 'Deals & Offers', titleTa: 'சலுகைகள்', linkUrl: '/directory/deals', isActive: true },
      { id: 'sub-rfq', slug: 'rfq', titleEn: 'RFQ & Inquiries', titleTa: 'விசாரணை', linkUrl: '/directory/rfq', isActive: true }
    ] 
  },
  { id: 'international', slug: 'international', titleEn: 'International', titleTa: 'சர்வதேசம்', linkUrl: '/category/international', isActive: true, type: 'category', subcategories: [] },
  { 
    id: 'videos', slug: 'videos', titleEn: 'Videos', titleTa: 'வீடியோ', linkUrl: '/videos', isActive: true, type: 'custom',
    subcategories: [
      { id: 'vid-news', slug: 'news-videos', titleEn: 'News Videos', titleTa: 'செய்தி வீடியோக்கள்', linkUrl: '/videos/news', isActive: true },
      { id: 'vid-ent', slug: 'entertainment-videos', titleEn: 'Entertainment', titleTa: 'சினிமா வீடியோக்கள்', linkUrl: '/videos/entertainment', isActive: true },
      { id: 'vid-sports', slug: 'sports-videos', titleEn: 'Sports Highlights', titleTa: 'விளையாட்டு வீடியோக்கள்', linkUrl: '/videos/sports', isActive: true }
    ]
  },
  { id: 'web-stories', slug: 'web-stories', titleEn: 'Web Stories', titleTa: 'வெப் ஸ்டோரிஸ்', linkUrl: '/web-stories', isActive: true, type: 'custom', subcategories: [] }
];

export const PRESET_NAV_CONFIGS = {
  standard: DEFAULT_NAV_ITEMS,
  regional_first: [
    { id: 'home', slug: 'home', titleEn: 'Home', titleTa: 'முகப்பு', linkUrl: '/', isActive: true, subcategories: [] },
    { 
      id: 'regional', slug: 'regional', titleEn: 'Regional', titleTa: 'நம்ம ஊர்', linkUrl: '/directory', isActive: true,
      subcategories: [
        { id: 'sub-dir', slug: 'directory', titleEn: 'Local Business Directory', titleTa: 'வணிக அடைவு', linkUrl: '/directory', isActive: true },
        { id: 'sub-deals', slug: 'deals', titleEn: 'Deals & Offers', titleTa: 'சலுகைகள்', linkUrl: '/directory/deals', isActive: true }
      ]
    },
    { id: 'tamilnadu', slug: 'tamilnadu', titleEn: 'Tamil Nadu', titleTa: 'தமிழ்நாடு', linkUrl: '/category/tamilnadu', isActive: true, subcategories: [] },
    { id: 'india', slug: 'india', titleEn: 'India', titleTa: 'இந்தியா', linkUrl: '/category/india', isActive: true, subcategories: [] },
    { id: 'politics', slug: 'politics', titleEn: 'Politics', titleTa: 'அரசியல்', linkUrl: '/category/politics', isActive: true, subcategories: [] },
    { id: 'business', slug: 'business', titleEn: 'Business', titleTa: 'வணிகம்', linkUrl: '/category/business', isActive: true, subcategories: [] },
    { id: 'sports', slug: 'sports', titleEn: 'Sports', titleTa: 'விளையாட்டு', linkUrl: '/category/sports', isActive: true, subcategories: [] },
    { id: 'cinema', slug: 'cinema', titleEn: 'Cinema', titleTa: 'சினிமா', linkUrl: '/category/cinema', isActive: true, subcategories: [] }
  ],
  entertainment: [
    { id: 'home', slug: 'home', titleEn: 'Home', titleTa: 'முகப்பு', linkUrl: '/', isActive: true, subcategories: [] },
    { id: 'cinema', slug: 'cinema', titleEn: 'Cinema', titleTa: 'சினிமா', linkUrl: '/category/cinema', isActive: true, subcategories: [] },
    { id: 'sports', slug: 'sports', titleEn: 'Sports', titleTa: 'விளையாட்டு', linkUrl: '/category/sports', isActive: true, subcategories: [] },
    { 
      id: 'videos', slug: 'videos', titleEn: 'Videos', titleTa: 'வீடியோ', linkUrl: '/videos', isActive: true,
      subcategories: [
        { id: 'vid-news', slug: 'news-videos', titleEn: 'News Videos', titleTa: 'செய்தி வீடியோக்கள்', linkUrl: '/videos/news', isActive: true }
      ]
    },
    { id: 'web-stories', slug: 'web-stories', titleEn: 'Web Stories', titleTa: 'வெப் ஸ்டோரிஸ்', linkUrl: '/web-stories', isActive: true, subcategories: [] }
  ]
};

export default function NavigationBarEditor({ items = [], categories = [], onChange }) {
  const [navItems, setNavItems] = useState(() => {
    return (items && items.length > 0) ? items : DEFAULT_NAV_ITEMS;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addingSubIndex, setAddingSubIndex] = useState(null);
  
  // New Item Form State
  const [itemType, setItemType] = useState('category'); // 'category', 'custom'
  const [selectedCatId, setSelectedCatId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleTa, setTitleTa] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (items && items.length > 0) {
      setNavItems(items);
    }
  }, [items]);

  const updateItems = (newItems) => {
    setNavItems(newItems);
    if (onChange) {
      onChange(newItems);
    }
  };

  // --- Parent Category Reordering ---
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...navItems];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    updateItems(updated);
  };

  const moveDown = (index) => {
    if (index === navItems.length - 1) return;
    const updated = [...navItems];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    updateItems(updated);
  };

  const toggleActive = (index) => {
    const updated = [...navItems];
    updated[index] = { ...updated[index], isActive: !updated[index].isActive };
    updateItems(updated);
  };

  const deleteItem = (index) => {
    if (window.confirm("Remove this category item and all its subcategories from navigation?")) {
      const updated = navItems.filter((_, i) => i !== index);
      updateItems(updated);
    }
  };

  // --- Subcategory Reordering & Actions ---
  const moveSubUp = (parentIdx, subIdx) => {
    if (subIdx === 0) return;
    const updated = [...navItems];
    const subs = [...(updated[parentIdx].subcategories || [])];
    const temp = subs[subIdx - 1];
    subs[subIdx - 1] = subs[subIdx];
    subs[subIdx] = temp;
    updated[parentIdx] = { ...updated[parentIdx], subcategories: subs };
    updateItems(updated);
  };

  const moveSubDown = (parentIdx, subIdx) => {
    const parentSubs = navItems[parentIdx].subcategories || [];
    if (subIdx === parentSubs.length - 1) return;
    const updated = [...navItems];
    const subs = [...parentSubs];
    const temp = subs[subIdx + 1];
    subs[subIdx + 1] = subs[subIdx];
    subs[subIdx] = temp;
    updated[parentIdx] = { ...updated[parentIdx], subcategories: subs };
    updateItems(updated);
  };

  const toggleSubActive = (parentIdx, subIdx) => {
    const updated = [...navItems];
    const subs = [...(updated[parentIdx].subcategories || [])];
    subs[subIdx] = { ...subs[subIdx], isActive: !subs[subIdx].isActive };
    updated[parentIdx] = { ...updated[parentIdx], subcategories: subs };
    updateItems(updated);
  };

  const deleteSub = (parentIdx, subIdx) => {
    const updated = [...navItems];
    const subs = (updated[parentIdx].subcategories || []).filter((_, i) => i !== subIdx);
    updated[parentIdx] = { ...updated[parentIdx], subcategories: subs };
    updateItems(updated);
  };

  const handleAddCategorySelect = (catId) => {
    const cat = categories.find(c => String(c.id) === String(catId));
    if (cat) {
      setSelectedCatId(catId);
      setTitleEn(cat.name || '');
      setTitleTa(cat.nameTa || cat.name || '');
      const slug = cat.slug || cat.name.toLowerCase();
      if (slug === 'regional') setLinkUrl('/directory');
      else setLinkUrl(`/category/${slug}`);
    }
  };

  const handleSaveItem = () => {
    if (!titleEn && !titleTa) return;

    if (addingSubIndex !== null) {
      // Adding a subcategory to an existing parent category item
      const newSub = {
        id: 'sub-' + Date.now(),
        slug: (titleEn || 'sub').toLowerCase().replace(/\s+/g, '-'),
        titleEn: titleEn || titleTa,
        titleTa: titleTa || titleEn,
        linkUrl: linkUrl || '/',
        isActive: true
      };
      const updated = [...navItems];
      const currentSubs = updated[addingSubIndex].subcategories || [];
      updated[addingSubIndex] = {
        ...updated[addingSubIndex],
        subcategories: [...currentSubs, newSub]
      };
      updateItems(updated);
      setAddingSubIndex(null);
    } else if (editingIndex !== null) {
      // Editing existing category item
      const updated = [...navItems];
      updated[editingIndex] = {
        ...updated[editingIndex],
        titleEn: titleEn || titleTa,
        titleTa: titleTa || titleEn,
        linkUrl: linkUrl || '/'
      };
      updateItems(updated);
      setEditingIndex(null);
    } else {
      // Adding new top-level category item
      const newItem = {
        id: 'nav-' + Date.now(),
        slug: (titleEn || 'item').toLowerCase().replace(/\s+/g, '-'),
        titleEn: titleEn || titleTa,
        titleTa: titleTa || titleEn,
        linkUrl: linkUrl || '/',
        isActive: true,
        type: itemType,
        subcategories: []
      };

      // Auto populate DB subcategories if available
      if (selectedCatId) {
        const cat = categories.find(c => String(c.id) === String(selectedCatId));
        if (cat && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
          newItem.subcategories = cat.subcategories.map((sub, i) => ({
            id: sub.id || `sub-${Date.now()}-${i}`,
            slug: sub.slug || sub.name?.toLowerCase(),
            titleEn: sub.name || sub.nameEn,
            titleTa: sub.nameTa || sub.name,
            linkUrl: `/category/${sub.slug || sub.name?.toLowerCase()}`,
            isActive: true
          }));
        }
      }

      updateItems([...navItems, newItem]);
    }

    // Reset Form
    setIsAddModalOpen(false);
    setTitleEn('');
    setTitleTa('');
    setLinkUrl('');
    setSelectedCatId('');
  };

  const handleApplyPreset = (presetKey) => {
    const preset = PRESET_NAV_CONFIGS[presetKey];
    if (preset) {
      updateItems(preset);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header & Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} /> CATEGORY & SUBCATEGORY NAV BUILDER
        </div>
        <button
          onClick={() => {
            setEditingIndex(null);
            setAddingSubIndex(null);
            setTitleEn('');
            setTitleTa('');
            setLinkUrl('');
            setIsAddModalOpen(true);
          }}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={13} /> Add Category
        </button>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleApplyPreset('standard')}
          style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
        >
          ⚡ Standard Preset
        </button>
        <button
          onClick={() => handleApplyPreset('regional_first')}
          style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
        >
          📍 Regional First
        </button>
        <button
          onClick={() => handleApplyPreset('entertainment')}
          style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
        >
          🎬 Cinema & Sports
        </button>
      </div>

      {/* Nav Items List (Categories & Subcategories Tree) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
        {navItems.map((item, index) => {
          const subs = item.subcategories || [];
          return (
            <div key={item.id || index} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: item.isActive ? 'rgba(30, 41, 59, 0.9)' : 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '8px' }}>
              
              {/* Parent Category Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', opacity: item.isActive ? 1 : 0.6 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', minWidth: '18px' }}>
                  #{index + 1}
                </span>

                {/* Label & Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {item.titleEn} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({item.titleTa})</span>
                    {subs.length > 0 && <span style={{ fontSize: '10px', background: '#3b82f6', color: '#fff', padding: '1px 5px', borderRadius: '10px', fontWeight: 700 }}>▼ {subs.length} sub</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.linkUrl}
                  </div>
                </div>

                {/* Parent Actions: Add Sub, Up, Down, Toggle Active, Edit, Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button
                    onClick={() => {
                      setAddingSubIndex(index);
                      setEditingIndex(null);
                      setTitleEn('');
                      setTitleTa('');
                      setLinkUrl(item.linkUrl ? `${item.linkUrl}/sub` : '/');
                      setIsAddModalOpen(true);
                    }}
                    style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    title="Add Subcategory"
                  >
                    <Plus size={11} /> Sub
                  </button>
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    style={{ background: 'transparent', border: 'none', color: index === 0 ? '#475569' : '#94a3b8', cursor: index === 0 ? 'default' : 'pointer', padding: '3px' }}
                    title="Move Category Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === navItems.length - 1}
                    style={{ background: 'transparent', border: 'none', color: index === navItems.length - 1 ? '#475569' : '#94a3b8', cursor: index === navItems.length - 1 ? 'default' : 'pointer', padding: '3px' }}
                    title="Move Category Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    onClick={() => toggleActive(index)}
                    style={{ background: 'transparent', border: 'none', color: item.isActive ? '#10b981' : '#64748b', cursor: 'pointer', padding: '3px' }}
                    title={item.isActive ? "Visible" : "Hidden"}
                  >
                    {item.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={() => deleteItem(index)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '3px' }}
                    title="Delete Category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              {subs.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', paddingLeft: '16px', borderLeft: '2px solid rgba(56, 189, 248, 0.3)' }}>
                  {subs.map((sub, subIdx) => (
                    <div 
                      key={sub.id || subIdx} 
                      style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', 
                        padding: '4px 8px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.04)', opacity: sub.isActive ? 1 : 0.5 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
                        <CornerDownRight size={11} color="#38bdf8" />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.titleEn} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({sub.titleTa})</span>
                        </span>
                      </div>

                      {/* Subcategory Reordering & Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button
                          onClick={() => moveSubUp(index, subIdx)}
                          disabled={subIdx === 0}
                          style={{ background: 'transparent', border: 'none', color: subIdx === 0 ? '#475569' : '#94a3b8', cursor: subIdx === 0 ? 'default' : 'pointer', padding: '2px' }}
                          title="Move Subcategory Up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          onClick={() => moveSubDown(index, subIdx)}
                          disabled={subIdx === subs.length - 1}
                          style={{ background: 'transparent', border: 'none', color: subIdx === subs.length - 1 ? '#475569' : '#94a3b8', cursor: subIdx === subs.length - 1 ? 'default' : 'pointer', padding: '2px' }}
                          title="Move Subcategory Down"
                        >
                          <ArrowDown size={11} />
                        </button>
                        <button
                          onClick={() => toggleSubActive(index, subIdx)}
                          style={{ background: 'transparent', border: 'none', color: sub.isActive ? '#10b981' : '#64748b', cursor: 'pointer', padding: '2px' }}
                          title={sub.isActive ? "Visible" : "Hidden"}
                        >
                          {sub.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                        </button>
                        <button
                          onClick={() => deleteSub(index, subIdx)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          title="Delete Subcategory"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category or Subcategory Form Dialog */}
      {isAddModalOpen && (
        <div style={{ background: '#1e293b', border: '1px solid #38bdf8', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '2px' }}>
            {addingSubIndex !== null
              ? `Add Subcategory under "${navItems[addingSubIndex]?.titleEn}"`
              : editingIndex !== null
                ? 'Edit Navigation Item'
                : 'Add New Top Category'}
          </div>

          {/* Type Selector (only for top-level categories) */}
          {addingSubIndex === null && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setItemType('category')}
                style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: itemType === 'category' ? '#3b82f6' : '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}
              >
                Category from DB
              </button>
              <button
                onClick={() => setItemType('custom')}
                style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, background: itemType === 'custom' ? '#3b82f6' : '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}
              >
                Custom Link / Page
              </button>
            </div>
          )}

          {addingSubIndex === null && itemType === 'category' && (
            <select
              value={selectedCatId}
              onChange={(e) => handleAddCategorySelect(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '12px' }}
            >
              <option value="">-- Select Category from DB --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.nameTa || 'Tamil'})</option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Title in English (e.g. Regional or Local Business Directory)"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '12px' }}
          />

          <input
            type="text"
            placeholder="Title in Tamil (e.g. நம்ம ஊர் or வணிக அடைவு)"
            value={titleTa}
            onChange={(e) => setTitleTa(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '12px' }}
          />

          <input
            type="text"
            placeholder="Target URL Path (e.g. /directory or /category/politics)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', fontSize: '12px' }}
          />

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              onClick={handleSaveItem}
              style={{ flex: 1, padding: '8px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Save Item
            </button>
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setAddingSubIndex(null);
                setEditingIndex(null);
              }}
              style={{ flex: 1, padding: '8px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
