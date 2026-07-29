import React, { useState } from 'react';
import { generateBlockStyles } from './HomeLayoutBuilder'; // We will need to export this or move it

const extractStyles = (config, viewMode) => {
  return generateBlockStyles(JSON.stringify(config || {}), viewMode, true);
};

export const DynamicComponentRenderer = ({ 
  node, 
  activeNodeId, 
  onSelectNode, 
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  viewMode = 'desktop',
  activeConfigParams,
  // Drag and drop props
  draggedNodeId,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = activeNodeId === node.id;
  
  const handleDragStart = (e) => {
    e.stopPropagation();
    onDragStart(e, node.id);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(e, node.id);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(e, node.id);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelectNode(node.id);
  };

  const configToUse = (activeNodeId === node.id && activeConfigParams) ? activeConfigParams : node.config;
  const styles = extractStyles(configToUse, viewMode);
  
  // Base outline for edit mode
  const editorStyles = {
    position: 'relative',
    outline: isActive ? '2px solid #3b82f6' : isHovered ? '1px dashed #94a3b8' : '1px dashed transparent',
    outlineOffset: '-1px',
    transition: 'outline 0.2s',
    minHeight: node.type.includes('container') || ['section', 'row', 'column', 'grid', 'flex'].includes(node.type) ? '50px' : 'auto',
    cursor: 'pointer'
  };
  const getWrapperProps = () => ({
    onClick: handleSelect,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    draggable: true,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  });

  const renderContent = () => {
    switch (node.type) {
      // Containers
      case 'section':
      case 'container':
      case 'row':
      case 'column':
      case 'grid':
      case 'flex':
      case 'gallery':
      case 'slider':
      case 'banner':
      case 'tabs':
      case 'accordion':
      case 'faq':
      case 'timeline':
      case 'cards':
        return (
          <div 
            style={{ ...styles, ...editorStyles }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {(!node.children || node.children.length === 0) && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                Drag components here
              </div>
            )}
            {node.children && node.children.map(child => (
              <DynamicComponentRenderer 
                key={child.id}
                node={child}
                activeNodeId={activeNodeId}
                onSelectNode={onSelectNode}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                viewMode={viewMode}
                activeConfigParams={activeConfigParams}
                draggedNodeId={draggedNodeId}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
              />
            ))}
          </div>
        );

      // Elements
      case 'heading': {
        const Tag = node.config.level || 'h2';
        return (
          <Tag 
            {...getWrapperProps()}
            style={{ ...styles, ...editorStyles, margin: 0 }}
          >
            {node.config.text || 'Heading'}
          </Tag>
        );
      }
      case 'paragraph':
        return (
          <p 
            {...getWrapperProps()}
            style={{ ...styles, ...editorStyles, margin: 0 }}
          >
            {node.config.text || 'Paragraph text...'}
          </p>
        );
      case 'primary_button':
      case 'secondary_button':
      case 'cta_button':
        return (
          <button 
            {...getWrapperProps()}
            style={{ 
              ...styles, ...editorStyles, 
              padding: styles.padding || '10px 20px', 
              background: node.type === 'primary_button' ? '#3b82f6' : node.type === 'secondary_button' ? '#475569' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px'
            }}
          >
            {node.config.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <div 
            {...getWrapperProps()}
            style={{ ...styles, ...editorStyles, display: 'inline-block' }}
          >
            <img src={node.config.src || 'https://via.placeholder.com/150'} alt="placeholder" style={{ maxWidth: '100%', display: 'block' }} />
          </div>
        );
      
      case 'spacer':
        return (
          <div 
            {...getWrapperProps()}
            style={{ ...styles, ...editorStyles, height: node.config.height || '50px', width: '100%' }}
          />
        );
        
      case 'divider':
        return (
          <div 
            {...getWrapperProps()}
            style={{ ...styles, ...editorStyles, padding: '10px 0' }}
          >
            <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e2e8f0' }} />
          </div>
        );

      // --- Typography & Basic ---
      case 'rich_text':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, padding: '10px' }}>
            {configToUse.content || configToUse.text ? (
              <div dangerouslySetInnerHTML={{ __html: configToUse.content || configToUse.text }} />
            ) : (
              <>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Rich Text Block</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>This is a rich text area where you can format text, add links, and more.</p>
              </>
            )}
          </div>
        );
      case 'quote':
        return (
          <blockquote {...getWrapperProps()} style={{ ...styles, ...editorStyles, borderLeft: '4px solid #3b82f6', margin: '10px 0', padding: '10px 20px', fontStyle: 'italic', background: 'rgba(59, 130, 246, 0.05)' }}>
            "{node.config.text || 'The best preparation for tomorrow is doing your best today.'}"
          </blockquote>
        );
      case 'list':
        return (
          <ul {...getWrapperProps()} style={{ ...styles, ...editorStyles, paddingLeft: '20px', margin: '10px 0' }}>
            {(node.config.items || ['List Item 1', 'List Item 2', 'List Item 3']).map((item, i) => (
              <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{item}</li>
            ))}
          </ul>
        );
      case 'badge':
        return (
          <span {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'inline-block', background: '#ef4444', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            {node.config.text || 'New'}
          </span>
        );
      case 'label':
        return (
          <label {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'inline-block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
            {node.config.text || 'Field Label'}
          </label>
        );

      // --- Buttons ---
      case 'icon_button':
        return (
          <button {...getWrapperProps()} style={{ ...styles, ...editorStyles, width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '16px' }}>★</span>
          </button>
        );
      case 'floating_button':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, position: 'relative', display: 'inline-block', padding: '10px' }}>
            <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#10b981', color: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              +
            </button>
            <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          </div>
        );

      // --- Media ---
      case 'video':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, width: '100%', height: '200px', background: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid #fff', marginLeft: '5px' }}></div>
            </div>
            <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '12px', padding: '2px 6px', borderRadius: '4px' }}>10:42</span>
          </div>
        );
      case 'logo':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#facc15', borderRadius: '8px' }}></div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#facc15', letterSpacing: '-0.5px' }}>KINGS<span style={{ color: '#fff' }}>24x7</span></span>
          </div>
        );

      // --- News Components ---
      case 'latest_news':
      case 'trending_news':
      case 'category_news':
      case 'featured_news':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, padding: '20px', background: '#fff', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #3b82f6', paddingBottom: '10px', marginBottom: '-12px' }}>
                {node.name || 'Latest News'}
              </h3>
              <span style={{ fontSize: '12px', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>View All →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#e2e8f0', borderRadius: '8px' }}></div>
                  <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>CATEGORY</span>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b', lineHeight: '1.4' }}>This is a placeholder title for a news article</h4>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>2 hours ago</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'breaking_news':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'flex', alignItems: 'center', background: '#ef4444', color: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: '#b91c1c', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap' }}>BREAKING</div>
            <div style={{ padding: '8px 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Major event happens in the city today, authorities are responding immediately...
            </div>
          </div>
        );
      case 'live_ticker':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'flex', alignItems: 'center', background: '#1e293b', color: '#e2e8f0', padding: '10px', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' }}>
            <div style={{ fontWeight: 700, color: '#facc15', marginRight: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> LIVE
            </div>
            <div style={{ flex: 1, fontSize: '14px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ marginRight: '40px' }}>• Market reaches all time high today</span>
              <span style={{ marginRight: '40px' }}>• Sports team wins championship</span>
              <span style={{ marginRight: '40px' }}>• Weather alert for heavy rain</span>
            </div>
          </div>
        );

      // --- Widgets ---
      case 'weather':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: 'linear-gradient(to bottom, #38bdf8, #0284c7)', color: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>Chennai, IN</div>
              <div style={{ fontSize: '36px', fontWeight: 700, margin: '5px 0' }}>32°C</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Partly Cloudy</div>
            </div>
            <div style={{ fontSize: '48px' }}>🌤️</div>
          </div>
        );
      case 'calendar':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>{'<'}</button>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>August 2026</span>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>{'>'}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px' }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} style={{ color: '#94a3b8', fontWeight: 600, paddingBottom: '8px' }}>{d}</div>)}
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} style={{ padding: '6px', borderRadius: '50%', background: i === 14 ? '#3b82f6' : 'transparent', color: i === 14 ? '#fff' : '#1e293b', fontWeight: i === 14 ? 700 : 400 }}>{i + 1}</div>
              ))}
            </div>
          </div>
        );
      case 'poll':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '16px' }}>What is your favorite news category?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Politics', 'Technology', 'Sports', 'Entertainment'].map((opt, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', cursor: 'pointer', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }}>
                  <input type="radio" name="mock_poll" /> {opt}
                </label>
              ))}
            </div>
            <button style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', marginTop: '16px', fontWeight: 600 }}>Vote</button>
          </div>
        );
      case 'advertisement':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: '#f1f5f9', border: '1px dashed #cbd5e1', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600, letterSpacing: '1px' }}>ADVERTISEMENT SPACE</span>
          </div>
        );
      case 'social_links':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'flex', gap: '12px', padding: '10px' }}>
            {['#1877f2', '#1da1f2', '#e1306c', '#ff0000'].map((color, i) => (
              <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                ★
              </div>
            ))}
          </div>
        );
      case 'contact_card':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#cbd5e1' }}></div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>John Doe</h4>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Chief Editor</div>
              <div style={{ fontSize: '13px', color: '#3b82f6' }}>contact@kings24x7.com</div>
            </div>
          </div>
        );

      // --- Interactive ---
      case 'search_bar':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, display: 'flex', width: '100%', maxWidth: '500px' }}>
            <input type="text" placeholder="Search news..." style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px' }} disabled />
            <button style={{ padding: '0 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', fontWeight: 600 }}>Search</button>
          </div>
        );
      case 'statistics_counter':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#3b82f6', lineHeight: 1 }}>2.5M+</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Readers</div>
          </div>
        );

      // --- Custom ---
      case 'html_block':
      case 'markdown_block':
        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: '#1e293b', color: '#a78bfa', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
            {`<!-- ${node.name} -->`}
            <br/>
            {`<div class="custom-content">...</div>`}
          </div>
        );

      case 'website_navigation': {
        const navItemsToRender = (configToUse && configToUse.navItems && configToUse.navItems.length > 0)
          ? configToUse.navItems.filter(i => i.isActive !== false)
          : [
              { titleEn: 'Home', titleTa: 'முகப்பு', linkUrl: '/' },
              { titleEn: 'Regional', titleTa: 'நம்ம ஊர்', linkUrl: '/directory' },
              { titleEn: 'Politics', titleTa: 'அரசியல்', linkUrl: '/category/politics' },
              { titleEn: 'Business', titleTa: 'வணிகம்', linkUrl: '/category/business' },
              { titleEn: 'Sports', titleTa: 'விளையாட்டு', linkUrl: '/category/sports' },
              { titleEn: 'Cinema', titleTa: 'சினிமா', linkUrl: '/category/cinema' },
              { titleEn: 'Technology', titleTa: 'தொழில்நுட்பம்', linkUrl: '/category/tech' }
            ];

        return (
          <div {...getWrapperProps()} style={{ ...styles, ...editorStyles, background: '#000000', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', overflowX: 'auto', borderBottom: '2px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 700 }}>
              {navItemsToRender.map((item, idx) => (
                <div key={item.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: (item.slug === 'regional' || item.linkUrl === '/directory') ? '#38bdf8' : '#ffffff', cursor: 'pointer' }}>
                  <span>{item.titleEn || item.name}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>({item.titleTa || item.nameTa})</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        // Generic fallback for unknown widgets
        return (
          <div 
            {...getWrapperProps()}
            style={{ ...styles, ...editorStyles, padding: '20px', background: 'rgba(59, 130, 246, 0.05)' }}
          >
            <div style={{ textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
              [{node.name || node.type}] Component
            </div>
          </div>
        );
    }
  };

  return renderContent();
};
