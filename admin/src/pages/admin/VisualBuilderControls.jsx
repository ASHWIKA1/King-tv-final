import React from 'react';

const labelStyle = { fontSize: '11px', fontWeight: 600, color: '#94a3b8', width: '90px', flexShrink: 0 };
const inputStyle = { flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', fontSize: '12px' };
const rowStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' };

export const ControlSlider = ({ label, value, onChange, min = 0, max = 100, unit = 'px' }) => (
  <div style={rowStyle}>
    <label style={labelStyle}>{label}</label>
    <input type="range" min={min} max={max} value={value || 0} onChange={e => onChange(e.target.value)} style={{ flex: 1 }} />
    <div style={{ display: 'flex', alignItems: 'center', width: '55px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <input type="number" value={value || 0} onChange={e => onChange(e.target.value)} style={{ width: '35px', padding: '4px', fontSize: '10px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'center', outline: 'none' }} />
      <span style={{ fontSize: '9px', color: '#64748b', paddingRight: '4px' }}>{unit}</span>
    </div>
  </div>
);

export const ControlColor = ({ label, value, onChange }) => (
  <div style={rowStyle}>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }} />
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#000000" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', outline: 'none' }} />
    </div>
  </div>
);

export const ControlSelect = ({ label, value, onChange, options }) => (
  <div style={rowStyle}>
    <label style={labelStyle}>{label}</label>
    <select value={value || ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);

export const ControlText = ({ label, value, onChange }) => (
  <div style={rowStyle}>
    <label style={labelStyle}>{label}</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} />
  </div>
);

export const ControlToggle = ({ label, checked, onChange }) => (
  <div style={{ ...rowStyle, justifyContent: 'space-between' }}>
    <label style={labelStyle}>{label}</label>
    <div 
      onClick={() => onChange(!checked)}
      style={{ width: '36px', height: '20px', background: checked ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
    >
      <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '18px' : '2px', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </div>
  </div>
);

export const updateConfigDeep = (setConfig, section, viewMode, key, val) => {
  setConfig(prev => {
    const sectionObj = prev[section] || {};
    const isResponsive = ['typography', 'layout', 'spacing', 'cards', 'buttons', 'icons'].includes(section);
    
    if (isResponsive) {
      const modeObj = sectionObj[viewMode] || {};
      return {
        ...prev,
        [section]: {
          ...sectionObj,
          [viewMode]: { ...modeObj, [key]: val }
        }
      };
    } else {
      return {
        ...prev,
        [section]: { ...sectionObj, [key]: val }
      };
    }
  });
};

export const Accordion = ({ title, isOpen, onToggle, children }) => (
  <details open={isOpen} onClick={(e) => { e.preventDefault(); onToggle(); }} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
    <summary style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', outline: 'none', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
      {title} <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</span>
    </summary>
    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </details>
);

// --- SPECIFIC EDITORS ---

export const TypographyEditor = ({ config, setConfig, viewMode }) => {
  const t = config.typography?.[viewMode] || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'typography', viewMode, key, val);
  
  return (
    <div>
      <ControlSelect label="Font Family" value={t.fontFamily} onChange={v => update('fontFamily', v)} options={['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 'Serif']} />
      <ControlSlider label="Font Size" value={t.fontSize} onChange={v => update('fontSize', v)} min={10} max={100} unit="px" />
      <ControlSelect label="Weight" value={t.weight} onChange={v => update('weight', v)} options={['300', '400', '500', '600', '700', '800']} />
      <ControlSelect label="Text Align" value={t.textAlign} onChange={v => update('textAlign', v)} options={['left', 'center', 'right', 'justify']} />
      <ControlSlider label="Line Height" value={t.lineHeight} onChange={v => update('lineHeight', v)} min={1} max={3} unit="em" />
      <ControlSlider label="Letter Spacing" value={t.letterSpacing} onChange={v => update('letterSpacing', v)} min={-5} max={10} unit="px" />
      <ControlSelect label="Transform" value={t.textTransform} onChange={v => update('textTransform', v)} options={['none', 'uppercase', 'lowercase', 'capitalize']} />
    </div>
  );
};

export const ColorsEditor = ({ config, setConfig }) => {
  const c = config.colors || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'colors', null, key, val);
  
  return (
    <div>
      <ControlColor label="Background" value={c.background} onChange={v => update('background', v)} />
      <ControlColor label="Text (Primary)" value={c.text} onChange={v => update('text', v)} />
      <ControlColor label="Text (Secondary)" value={c.textSecondary} onChange={v => update('textSecondary', v)} />
      <ControlColor label="Border Color" value={c.border} onChange={v => update('border', v)} />
      <ControlColor label="Button Fill" value={c.button} onChange={v => update('button', v)} />
      <ControlColor label="Button Text" value={c.buttonText} onChange={v => update('buttonText', v)} />
      <ControlColor label="Accent / Hover" value={c.accent} onChange={v => update('accent', v)} />
    </div>
  );
};

export const BackgroundEditor = ({ config, setConfig }) => {
  const b = config.background || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'background', null, key, val);
  
  return (
    <div>
      <ControlSelect label="Type" value={b.type} onChange={v => update('type', v)} options={['solid', 'gradient', 'image', 'glass']} />
      {b.type === 'gradient' && (
        <ControlText label="Gradient (CSS)" value={b.gradient} onChange={v => update('gradient', v)} />
      )}
      {b.type === 'image' && (
        <>
          <ControlText label="Image URL" value={b.imageUrl} onChange={v => update('imageUrl', v)} />
          <ControlSelect label="Size" value={b.backgroundSize} onChange={v => update('backgroundSize', v)} options={['cover', 'contain', 'auto']} />
        </>
      )}
      {b.type === 'glass' && (
        <>
          <ControlSlider label="Blur Radius" value={b.blur} onChange={v => update('blur', v)} min={0} max={50} unit="px" />
          <ControlSlider label="Opacity" value={b.opacity} onChange={v => update('opacity', v)} min={0} max={100} unit="%" />
        </>
      )}
    </div>
  );
};

export const BorderEditor = ({ config, setConfig }) => {
  const b = config.border || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'border', null, key, val);
  
  return (
    <div>
      <ControlSelect label="Border Style" value={b.style} onChange={v => update('style', v)} options={['none', 'solid', 'dashed', 'dotted']} />
      {b.style !== 'none' && (
        <>
          <ControlSlider label="Border Width" value={b.width} onChange={v => update('width', v)} min={0} max={20} unit="px" />
          <ControlColor label="Border Color" value={b.color} onChange={v => update('color', v)} />
        </>
      )}
      <ControlSlider label="Border Radius" value={b.radius} onChange={v => update('radius', v)} min={0} max={100} unit="px" />
      <ControlSlider label="Shadow (Blur)" value={b.shadowBlur} onChange={v => update('shadowBlur', v)} min={0} max={100} unit="px" />
      <ControlSlider label="Shadow (Spread)" value={b.shadowSpread} onChange={v => update('shadowSpread', v)} min={-50} max={100} unit="px" />
    </div>
  );
};

export const AnimationEditor = ({ config, setConfig }) => {
  const a = config.animation || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'animation', null, key, val);
  
  return (
    <div>
      <ControlSelect label="Entrance Anim" value={a.entrance} onChange={v => update('entrance', v)} options={['none', 'fade', 'slide-up', 'zoom-in', 'bounce']} />
      <ControlSlider label="Duration" value={a.duration} onChange={v => update('duration', v)} min={100} max={3000} unit="ms" />
      <ControlSlider label="Delay" value={a.delay} onChange={v => update('delay', v)} min={0} max={3000} unit="ms" />
      <ControlSelect label="Hover Anim" value={a.hover} onChange={v => update('hover', v)} options={['none', 'grow', 'shrink', 'lift']} />
    </div>
  );
};

export const LayoutEditor = ({ config, setConfig, viewMode }) => {
  const l = config.layout?.[viewMode] || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'layout', viewMode, key, val);
  
  return (
    <div>
      <ControlSelect label="Display" value={l.display} onChange={v => update('display', v)} options={['block', 'flex', 'grid', 'none']} />
      {(l.display === 'flex' || l.display === 'grid') && (
        <>
          <ControlSelect label="Justify" value={l.justifyContent} onChange={v => update('justifyContent', v)} options={['flex-start', 'center', 'flex-end', 'space-between']} />
          <ControlSelect label="Align Items" value={l.alignItems} onChange={v => update('alignItems', v)} options={['flex-start', 'center', 'flex-end', 'stretch']} />
        </>
      )}
      <ControlSlider label="Width" value={l.width} onChange={v => update('width', v)} min={10} max={100} unit="%" />
      <ControlSlider label="Min Height" value={l.minHeight} onChange={v => update('minHeight', v)} min={0} max={1000} unit="px" />
      <ControlToggle label="Overflow Hidden" checked={l.overflowHidden} onChange={v => update('overflowHidden', v)} />
    </div>
  );
};

export const SpacingEditor = ({ config, setConfig, viewMode }) => {
  const s = config.spacing?.[viewMode] || {};
  const update = (key, val) => updateConfigDeep(setConfig, 'spacing', viewMode, key, val);
  
  return (
    <div>
      <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700, marginBottom: '8px' }}>MARGIN (OUTSIDE)</div>
      <ControlSlider label="Top" value={s.marginTop} onChange={v => update('marginTop', v)} min={0} max={150} unit="px" />
      <ControlSlider label="Bottom" value={s.marginBottom} onChange={v => update('marginBottom', v)} min={0} max={150} unit="px" />
      <ControlSlider label="Left" value={s.marginLeft} onChange={v => update('marginLeft', v)} min={0} max={150} unit="px" />
      <ControlSlider label="Right" value={s.marginRight} onChange={v => update('marginRight', v)} min={0} max={150} unit="px" />
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '12px 0' }}></div>
      <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, marginBottom: '8px' }}>PADDING (INSIDE)</div>
      <ControlSlider label="Top" value={s.paddingTop} onChange={v => update('paddingTop', v)} min={0} max={150} unit="px" />
      <ControlSlider label="Bottom" value={s.paddingBottom} onChange={v => update('paddingBottom', v)} min={0} max={150} unit="px" />
      <ControlSlider label="Left" value={s.paddingLeft} onChange={v => update('paddingLeft', v)} min={0} max={150} unit="px" />
      <ControlSlider label="Right" value={s.paddingRight} onChange={v => update('paddingRight', v)} min={0} max={150} unit="px" />
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '12px 0' }}></div>
      <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>GAPS</div>
      <ControlSlider label="Row Gap" value={s.rowGap} onChange={v => update('rowGap', v)} min={0} max={100} unit="px" />
      <ControlSlider label="Column Gap" value={s.columnGap} onChange={v => update('columnGap', v)} min={0} max={100} unit="px" />
    </div>
  );
};

export const TextEditor = ({ config, setConfig }) => {
  return (
    <div>
      <ControlText label="Content" value={config.content} onChange={v => setConfig(prev => ({ ...prev, content: v }))} />
      <ControlSelect label="HTML Tag" value={config.tag} onChange={v => setConfig(prev => ({ ...prev, tag: v }))} options={['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span']} />
    </div>
  );
};

export const ButtonEditor = ({ config, setConfig }) => {
  return (
    <div>
      <ControlText label="Button Text" value={config.text} onChange={v => setConfig(prev => ({ ...prev, text: v }))} />
      <ControlText label="URL / Link" value={config.link} onChange={v => setConfig(prev => ({ ...prev, link: v }))} />
    </div>
  );
};

export const GridLayoutEditor = ({ config, setConfig, viewMode }) => {
  const g = config.gridLayout?.[viewMode] || {};
  // Fallback defaults
  const columns = g.columns || 1;
  const rows = g.rows !== undefined ? g.rows : 1;
  const gap = g.gap !== undefined ? g.gap : 16;
  const displayMode = g.displayMode || 'grid';
  const cardWidth = g.cardWidth || 'auto';
  
  const update = (key, val) => {
    setConfig(prev => {
      const gl = prev.gridLayout || {};
      const modeObj = gl[viewMode] || {};
      return {
        ...prev,
        gridLayout: {
          ...gl,
          [viewMode]: { ...modeObj, [key]: val }
        }
      };
    });
  };
  
  return (
    <div>
      <ControlSelect 
        label="Display Type" 
        value={displayMode} 
        onChange={v => update('displayMode', v)} 
        options={['grid', 'carousel', 'horizontal-slider', 'stack']} 
      />
      {displayMode === 'grid' && (
        <>
          <ControlSelect 
            label="Columns" 
            value={columns} 
            onChange={v => update('columns', parseInt(v, 10))} 
            options={[0, 1, 2, 3, 4, 5, 6]} 
          />
          <ControlSelect 
            label="Rows" 
            value={rows} 
            onChange={v => update('rows', parseInt(v, 10))} 
            options={[0, 1, 2, 3, 4, 5, 6]} 
          />
        </>
      )}
      <ControlSlider label="Gap" value={gap} onChange={v => update('gap', v)} min={0} max={100} unit="px" />
      <ControlSelect 
        label="Card Width" 
        value={cardWidth} 
        onChange={v => update('cardWidth', v)} 
        options={['auto', 'stretch', 'fixed']} 
      />
    </div>
  );
};

