import React, { useState } from 'react';
import { 
  X, Search, Layout, Type, MousePointer2, Image as ImageIcon, 
  Newspaper, Layers, Zap, Code 
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'containers', name: 'Containers', icon: <Layout size={16} /> },
  { id: 'basic', name: 'Basic Elements', icon: <Type size={16} /> },
  { id: 'buttons', name: 'Buttons', icon: <MousePointer2 size={16} /> },
  { id: 'media', name: 'Media', icon: <ImageIcon size={16} /> },
  { id: 'news', name: 'News Components', icon: <Newspaper size={16} /> },
  { id: 'widgets', name: 'Widgets', icon: <Layers size={16} /> },
  { id: 'interactive', name: 'Interactive', icon: <Zap size={16} /> },
  { id: 'custom', name: 'Custom', icon: <Code size={16} /> }
];

export const COMPONENTS = [
  // Containers
  { id: 'section', name: 'Section', category: 'containers', type: 'container', defaultProps: {} },
  { id: 'container', name: 'Container', category: 'containers', type: 'container', defaultProps: {} },
  { id: 'row', name: 'Row', category: 'containers', type: 'container', defaultProps: { display: 'flex', flexDirection: 'row' } },
  { id: 'column', name: 'Column', category: 'containers', type: 'container', defaultProps: { display: 'flex', flexDirection: 'column' } },
  { id: 'grid', name: 'Grid', category: 'containers', type: 'container', defaultProps: { display: 'grid' } },
  { id: 'flex', name: 'Flex Layout', category: 'containers', type: 'container', defaultProps: { display: 'flex' } },
  { id: 'spacer', name: 'Spacer', category: 'containers', type: 'element', defaultProps: { height: '50px' } },
  { id: 'divider', name: 'Divider', category: 'containers', type: 'element', defaultProps: {} },

  // Basic Elements
  { id: 'heading', name: 'Heading', category: 'basic', type: 'element', defaultProps: { text: 'Heading', level: 'h2' } },
  { id: 'paragraph', name: 'Paragraph', category: 'basic', type: 'element', defaultProps: { text: 'Enter your text here...' } },
  { id: 'rich_text', name: 'Rich Text', category: 'basic', type: 'element', defaultProps: { text: '<p>Rich Text content</p>' } },
  { id: 'quote', name: 'Quote', category: 'basic', type: 'element', defaultProps: { text: 'Inspirational quote' } },
  { id: 'list', name: 'List', category: 'basic', type: 'element', defaultProps: { items: ['Item 1', 'Item 2'] } },
  { id: 'badge', name: 'Badge', category: 'basic', type: 'element', defaultProps: { text: 'New' } },
  { id: 'label', name: 'Label', category: 'basic', type: 'element', defaultProps: { text: 'Label' } },

  // Buttons
  { id: 'primary_button', name: 'Primary Button', category: 'buttons', type: 'element', defaultProps: { text: 'Click Here', variant: 'primary' } },
  { id: 'secondary_button', name: 'Secondary Button', category: 'buttons', type: 'element', defaultProps: { text: 'Click Here', variant: 'secondary' } },
  { id: 'icon_button', name: 'Icon Button', category: 'buttons', type: 'element', defaultProps: { icon: 'arrow-right' } },
  { id: 'cta_button', name: 'CTA Button', category: 'buttons', type: 'element', defaultProps: { text: 'Subscribe Now' } },
  { id: 'floating_button', name: 'Floating Button', category: 'buttons', type: 'element', defaultProps: {} },

  // Media
  { id: 'image', name: 'Image', category: 'media', type: 'element', defaultProps: { src: 'placeholder.jpg' } },
  { id: 'video', name: 'Video', category: 'media', type: 'element', defaultProps: { src: '' } },
  { id: 'gallery', name: 'Gallery', category: 'media', type: 'container', defaultProps: {} },
  { id: 'slider', name: 'Slider', category: 'media', type: 'container', defaultProps: {} },
  { id: 'banner', name: 'Banner', category: 'media', type: 'container', defaultProps: {} },
  { id: 'logo', name: 'Logo', category: 'media', type: 'element', defaultProps: {} },

  // News Components
  { id: 'latest_news', name: 'Latest News', category: 'news', type: 'element', defaultProps: {} },
  { id: 'trending_news', name: 'Trending News', category: 'news', type: 'element', defaultProps: {} },
  { id: 'category_news', name: 'Category News', category: 'news', type: 'element', defaultProps: {} },
  { id: 'featured_news', name: 'Featured News', category: 'news', type: 'element', defaultProps: {} },
  { id: 'breaking_news', name: 'Breaking News', category: 'news', type: 'element', defaultProps: {} },
  { id: 'live_ticker', name: 'Live Ticker', category: 'news', type: 'element', defaultProps: {} },

  // Widgets
  { id: 'weather', name: 'Weather', category: 'widgets', type: 'element', defaultProps: {} },
  { id: 'calendar', name: 'Calendar', category: 'widgets', type: 'element', defaultProps: {} },
  { id: 'poll', name: 'Poll', category: 'widgets', type: 'element', defaultProps: {} },
  { id: 'advertisement', name: 'Advertisement', category: 'widgets', type: 'element', defaultProps: {} },
  { id: 'social_links', name: 'Social Links', category: 'widgets', type: 'element', defaultProps: {} },
  { id: 'contact_card', name: 'Contact Card', category: 'widgets', type: 'element', defaultProps: {} },

  // Interactive
  { id: 'search_bar', name: 'Search Bar', category: 'interactive', type: 'element', defaultProps: {} },
  { id: 'tabs', name: 'Tabs', category: 'interactive', type: 'container', defaultProps: {} },
  { id: 'accordion', name: 'Accordion', category: 'interactive', type: 'container', defaultProps: {} },
  { id: 'faq', name: 'FAQ', category: 'interactive', type: 'container', defaultProps: {} },
  { id: 'timeline', name: 'Timeline', category: 'interactive', type: 'container', defaultProps: {} },
  { id: 'cards', name: 'Cards', category: 'interactive', type: 'container', defaultProps: {} },
  { id: 'statistics_counter', name: 'Statistics Counter', category: 'interactive', type: 'element', defaultProps: {} },

  // Custom
  { id: 'html_block', name: 'HTML Block', category: 'custom', type: 'element', defaultProps: { html: '<div>Custom HTML</div>' } },
  { id: 'markdown_block', name: 'Markdown Block', category: 'custom', type: 'element', defaultProps: { markdown: '# Custom Markdown' } },
  { id: 'custom_widget', name: 'Custom Widget Placeholder', category: 'custom', type: 'element', defaultProps: {} },
];

export const ComponentLibraryModal = ({ onClose, onSelectComponent }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('containers');

  const filteredComponents = COMPONENTS.filter(c => 
    (activeCategory === 'all' || c.category === activeCategory) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000 }}>
      <div style={{ width: '800px', height: '600px', background: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Add New Component</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Search components..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '220px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' }}>
            <div style={{ padding: '12px' }}>
              <button 
                onClick={() => setActiveCategory('all')}
                style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: activeCategory === 'all' ? '#3b82f6' : 'transparent', color: activeCategory === 'all' ? '#fff' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textAlign: 'left', marginBottom: '4px' }}
              >
                All Components
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: activeCategory === cat.id ? '#3b82f6' : 'transparent', color: activeCategory === cat.id ? '#fff' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textAlign: 'left', marginBottom: '4px' }}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#0f172a' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {filteredComponents.map(comp => (
                <button 
                  key={comp.id}
                  onClick={() => onSelectComponent(comp)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    {CATEGORIES.find(c => c.id === comp.category)?.icon || <Code size={20} />}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', textAlign: 'center' }}>{comp.name}</span>
                </button>
              ))}
            </div>
            {filteredComponents.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px', fontSize: '14px' }}>
                No components found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
