import React, { useState } from 'react';
import { Sparkles, X, Wand2, CheckCircle2, ArrowRight } from 'lucide-react';
import { WIDGET_REGISTRY } from '../utils/WidgetRegistry';

const AiWidgetAssistantModal = ({ isOpen, onClose, onAddWidget, categories = [] }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!isOpen) return null;

  const handleParsePrompt = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      const lower = prompt.toLowerCase();

      // 1. Detect Widget Type
      let widgetType = 'latest_news';
      if (lower.includes('video')) widgetType = 'video_news';
      else if (lower.includes('ticker') || lower.includes('breaking')) widgetType = 'news_ticker';
      else if (lower.includes('hero') || lower.includes('banner')) widgetType = 'hero';
      else if (lower.includes('trending') || lower.includes('viral')) widgetType = 'trending_sidebar';
      else if (lower.includes('weather')) widgetType = 'weather';
      else if (lower.includes('story') || lower.includes('stories')) widgetType = 'web_stories';
      else if (lower.includes('business')) widgetType = 'business_case';
      else if (lower.includes('digest')) widgetType = 'news_digest';

      // 2. Detect Category
      let matchedCategory = null;
      for (const cat of categories) {
        const catNameLower = (cat.name || '').toLowerCase();
        const catTaLower = (cat.nameTa || '').toLowerCase();
        const catSlugLower = (cat.slug || '').toLowerCase();

        if (lower.includes(catNameLower) || lower.includes(catTaLower) || lower.includes(catSlugLower)) {
          matchedCategory = cat;
          break;
        }
      }

      // Special fallback category keywords if categories array is simple
      if (!matchedCategory) {
        if (lower.includes('sport')) matchedCategory = { id: '3', name: 'Sports' };
        else if (lower.includes('politic')) matchedCategory = { id: '1', name: 'Politics' };
        else if (lower.includes('business')) matchedCategory = { id: '2', name: 'Business' };
        else if (lower.includes('cinema') || lower.includes('movie')) matchedCategory = { id: '4', name: 'Cinema' };
        else if (lower.includes('tech')) matchedCategory = { id: '5', name: 'Technology' };
      }

      // 3. Detect Item Limit
      let limit = 6;
      const numberMatch = lower.match(/(\d+)\s*(articles|items|stories|news|posts|rows)?/);
      if (numberMatch) {
        limit = parseInt(numberMatch[1], 10);
      }

      // 4. Detect Display Variant
      let displayType = 'grid';
      if (lower.includes('carousel') || lower.includes('slider')) displayType = 'carousel';
      else if (lower.includes('list') || lower.includes('compact')) displayType = 'list';
      else if (lower.includes('masonry')) displayType = 'masonry';

      // Construct section title
      const meta = WIDGET_REGISTRY[widgetType] || WIDGET_REGISTRY.latest_news;
      const catTitle = matchedCategory ? `${matchedCategory.name} ` : '';
      const sectionLabel = `${catTitle}${meta.name}`;

      const configJson = JSON.stringify({
        categoryId: matchedCategory ? matchedCategory.id : '',
        limit: limit,
        type: displayType,
        provider: matchedCategory ? 'category_feed' : 'latest_news'
      });

      setParsedResult({
        widgetType,
        sectionLabel,
        configJson,
        summary: `Created ${meta.name} (${catTitle || 'All Categories'}) with ${limit} items in ${displayType.toUpperCase()} template style.`
      });

      setIsProcessing(false);
    }, 600);
  };

  const handleApplyAiWidget = () => {
    if (!parsedResult) return;
    onAddWidget(parsedResult.widgetType, parsedResult.sectionLabel, parsedResult.configJson);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg-surface, #fff)', width: '560px', maxWidth: '92vw', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Sparkles size={20} color="#8B5CF6" /> AI Homepage Widget Assistant
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Type a natural language instruction to generate and configure a homepage widget instance automatically.
        </p>

        {/* Prompt Input Form */}
        <form onSubmit={handleParsePrompt} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              rows="3"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "Create a Sports section with 10 articles" or "Add a compact Cinema video news list"'
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', fontSize: '13px', resize: 'none', fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg-secondary, #F8FAFC)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span onClick={() => setPrompt("Create a Sports news grid with 8 items")} style={{ fontSize: '11px', background: '#F3E8FF', color: '#7E22CE', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Sports Grid</span>
              <span onClick={() => setPrompt("Add a compact Cinema video news carousel")} style={{ fontSize: '11px', background: '#FEF3C7', color: '#B45309', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Cinema Videos</span>
              <span onClick={() => setPrompt("Add 5 trending stories")} style={{ fontSize: '11px', background: '#FEE2E2', color: '#B91C1C', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Trending List</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !prompt.trim()}
              className="btn btn-primary"
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', background: '#8B5CF6', borderColor: '#8B5CF6', color: '#fff', borderRadius: '8px', opacity: prompt.trim() ? 1 : 0.6 }}
            >
              <Wand2 size={16} /> {isProcessing ? 'Generating...' : 'Generate Widget'}
            </button>
          </div>
        </form>

        {/* Parsed Result Box */}
        {parsedResult && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 700, fontSize: '14px' }}>
              <CheckCircle2 size={18} /> Widget Configuration Ready
            </div>
            <div style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>
              {parsedResult.summary}
            </div>
            <button
              type="button"
              onClick={handleApplyAiWidget}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', padding: '10px', background: '#16A34A', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              Insert Configured Widget onto Homepage Canvas <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AiWidgetAssistantModal;
