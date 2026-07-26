import React, { useState } from 'react';
import { generateBlockStyles } from './HomeLayoutBuilder'; // We will need to export this or move it

const extractStyles = (config) => {
  // Use the existing generateBlockStyles function by faking a layout item
  // But wait, generateBlockStyles takes a stringified configJson.
  // We can just use it or write a simpler one for nodes.
  return generateBlockStyles(JSON.stringify(config || {}));
};

export const DynamicComponentRenderer = ({ 
  node, 
  activeNodeId, 
  onSelectNode, 
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
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

  const styles = extractStyles(node.config);
  
  // Base outline for edit mode
  const editorStyles = {
    position: 'relative',
    outline: isActive ? '2px solid #3b82f6' : isHovered ? '1px dashed #94a3b8' : '1px dashed transparent',
    outlineOffset: '-1px',
    transition: 'outline 0.2s',
    minHeight: node.type.includes('container') || ['section', 'row', 'column', 'grid', 'flex'].includes(node.type) ? '50px' : 'auto',
    cursor: 'pointer'
  };

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
            style={{ ...styles, ...editorStyles, margin: 0 }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {node.config.text || 'Heading'}
          </Tag>
        );
      }
      case 'paragraph':
        return (
          <p 
            style={{ ...styles, ...editorStyles, margin: 0 }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {node.config.text || 'Paragraph text...'}
          </p>
        );
      case 'primary_button':
      case 'secondary_button':
      case 'cta_button':
        return (
          <button 
            style={{ 
              ...styles, ...editorStyles, 
              padding: styles.padding || '10px 20px', 
              background: node.type === 'primary_button' ? '#3b82f6' : node.type === 'secondary_button' ? '#475569' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px'
            }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {node.config.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <div 
            style={{ ...styles, ...editorStyles, display: 'inline-block' }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <img src={node.config.src || 'https://via.placeholder.com/150'} alt="placeholder" style={{ maxWidth: '100%', display: 'block' }} />
          </div>
        );
      
      case 'spacer':
        return (
          <div 
            style={{ ...styles, ...editorStyles, height: node.config.height || '50px', width: '100%' }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        );
        
      case 'divider':
        return (
          <div 
            style={{ ...styles, ...editorStyles, padding: '10px 0' }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e2e8f0' }} />
          </div>
        );

      default:
        // Generic fallback for custom widgets/news blocks
        return (
          <div 
            style={{ ...styles, ...editorStyles, padding: '20px', background: 'rgba(59, 130, 246, 0.05)' }}
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
