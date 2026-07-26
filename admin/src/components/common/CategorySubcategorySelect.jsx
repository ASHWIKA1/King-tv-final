import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';

const CategorySubcategorySelect = ({
  categoryId = "",
  subcategoryId = "",
  onCategoryChange,
  onSubcategoryChange,
  required = false,
  labelSuffix = null
}) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const isInitialLoadRef = useRef(true);

  // Fetch categories on mount
  useEffect(() => {
    setLoadingCats(true);
    api.get('/categories')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        setCategories(list);
      })
      .catch(() => {
        // Fallback to admin endpoint
        api.get('/admin/taxonomy/categories')
          .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
          .catch(() => setCategories([]));
      })
      .finally(() => setLoadingCats(false));
  }, []);

  // Dynamically load subcategories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      setLoadingSubs(true);
      api.get(`/subcategories/getAllWeb?categoryId=${categoryId}&size=200`)
        .then(res => {
          let list = [];
          if (res.data && Array.isArray(res.data.content)) {
            list = res.data.content;
          } else if (Array.isArray(res.data)) {
            list = res.data;
          }
          setSubcategories(list);
        })
        .catch(() => {
          api.get(`/admin/taxonomy/subcategories`)
            .then(res => {
              const allSubs = Array.isArray(res.data) ? res.data : [];
              const filtered = allSubs.filter(sc => String(sc.categoryId || sc.category?.id) === String(categoryId));
              setSubcategories(filtered);
            })
            .catch(() => setSubcategories([]));
        })
        .finally(() => setLoadingSubs(false));
    } else {
      setSubcategories([]);
    }

    // Clear subcategory ONLY if category is changed by user after initial load
    if (!isInitialLoadRef.current) {
      onSubcategoryChange("");
    } else {
      isInitialLoadRef.current = false;
    }
  }, [categoryId]);

  const selectStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    cursor: 'pointer'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
    display: 'block'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Category Select */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
        <label style={labelStyle}>
          Category {required && <span style={{ color: '#EF4444' }}>*</span>} {labelSuffix}
        </label>
        <select
          style={selectStyle}
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="" style={{ color: '#000000', backgroundColor: '#ffffff' }}>
            {loadingCats ? 'Loading categories...' : '— Select Category —'}
          </option>
          {categories.map((c) => {
            const isIconString = typeof c?.icon === 'string';
            const cleanLabel = (isIconString && !c.icon.startsWith('fa') && !c.icon.includes('fa-'))
              ? `${c.icon} ${c.nameTa ? `${c.nameTa} / ${c.name}` : c.name}`
              : (c.nameTa ? `${c.nameTa} / ${c.name}` : c.name);
            return (
              <option key={c.id} value={c.id} style={{ color: '#000000', backgroundColor: '#ffffff' }}>
                {cleanLabel}
              </option>
            );
          })}
        </select>
      </div>

      {/* Subcategory Select */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
        <label style={labelStyle}>
          Subcategory {!categoryId && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>(select category first)</span>}
        </label>
        <select
          style={{
            ...selectStyle,
            cursor: categoryId ? 'pointer' : 'not-allowed',
            opacity: categoryId ? 1 : 0.5
          }}
          value={subcategoryId}
          onChange={(e) => onSubcategoryChange(e.target.value)}
          disabled={!categoryId || loadingSubs}
        >
          <option value="" style={{ color: '#000000', backgroundColor: '#ffffff' }}>
            {loadingSubs ? 'Loading subcategories...' : '— Select Subcategory —'}
          </option>
          {subcategories.map((sc) => {
            const scId = sc.subcategoryId || sc.id;
            return (
              <option key={scId} value={scId} style={{ color: '#000000', backgroundColor: '#ffffff' }}>
                {sc.nameTa ? `${sc.nameTa} / ${sc.name}` : sc.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default CategorySubcategorySelect;
