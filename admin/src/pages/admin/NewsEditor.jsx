import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Save, ArrowLeft, Send, CheckCircle, MapPin, Image, Video, Copy, Plus, Sparkles, X, RefreshCw, Zap } from 'lucide-react';
import ImageUploadPreview from '../../components/common/ImageUploadPreview';
import CategorySubcategorySelect from '../../components/common/CategorySubcategorySelect';
import DatePickerInput from '../../components/common/DatePickerInput';
import { useAuth } from '../../context/AuthContext';

// ── Gemini AI helper ─────────────────────────────────────────────────────────
export let activeAiConfig = {
  apiKey: '',
  apiUrl: '',
  model: 'gemini-2.0-flash'
};

export const getGeminiUrl = () => {
  const model = activeAiConfig.model || 'gemini-2.0-flash';
  const apiKey = activeAiConfig.apiKey || '';
  if (activeAiConfig.apiUrl) {
    return `${activeAiConfig.apiUrl}?key=${apiKey}`;
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
};

const callGemini = async (prompt) => {
  const url = getGeminiUrl();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
};

const stripHtml = (html) => (html || '').replace(/<[^>]*>/gm, ' ').replace(/\s+/g, ' ').trim();
const hashStr  = (s) => s.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0).toString(36);

// ── AI Suggestion Box ─────────────────────────────────────────────────────────
const AiSuggestionBox = ({ fieldId, suggestion, loading, onUse, onDismiss, onRegenerate, source }) => {
  if (!loading && !suggestion) return null;
  return (
    <div style={{
      marginTop: '0.5rem', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.3)',
      background: 'rgba(139,92,246,0.04)', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.45rem 0.75rem', borderBottom: '1px solid rgba(139,92,246,0.15)',
        background: 'rgba(139,92,246,0.07)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          <Sparkles size={11} /> AI Suggestion
          {source && <span style={{ fontWeight: 400, opacity: 0.7, textTransform: 'none' }}>· from {source}</span>}
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button onClick={onRegenerate} title="Regenerate" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5CF6', padding: '2px', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={12} />
          </button>
          <button onClick={onDismiss} title="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}>
            <X size={12} />
          </button>
        </div>
      </div>
      <div style={{ padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        {loading ? (
          <span style={{ fontSize: '0.8rem', color: '#8B5CF6', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #8B5CF6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            Generating…
          </span>
        ) : (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.5', flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{suggestion}</span>
        )}
        {!loading && suggestion && (
          <button
            onClick={onUse}
            style={{
              flexShrink: 0, padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 700,
              background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: '6px',
              cursor: 'pointer', letterSpacing: '0.02em', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Use
          </button>
        )}
      </div>
    </div>
  );
};

// ── Tag Suggestion Row ────────────────────────────────────────────────────────
const TagSuggestionBox = ({ tags, loading, onUseOne, onUseAll, onDismiss, onRegenerate }) => {
  if (!loading && (!tags || tags.length === 0)) return null;
  return (
    <div style={{
      marginTop: '0.5rem', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.3)',
      background: 'rgba(139,92,246,0.04)', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.45rem 0.75rem', borderBottom: '1px solid rgba(139,92,246,0.15)',
        background: 'rgba(139,92,246,0.07)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          <Sparkles size={11} /> AI Suggestion · Tags <span style={{ fontWeight: 400, opacity: 0.7, textTransform: 'none' }}>· from Content</span>
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {!loading && tags?.length > 0 && <button onClick={onUseAll} style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}>Use All</button>}
          <button onClick={onRegenerate} title="Regenerate" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5CF6', padding: '2px', display: 'flex', alignItems: 'center' }}><RefreshCw size={12} /></button>
          <button onClick={onDismiss} title="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
        </div>
      </div>
      <div style={{ padding: '0.6rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {loading ? (
          <span style={{ fontSize: '0.8rem', color: '#8B5CF6', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #8B5CF6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            Generating…
          </span>
        ) : tags?.map((tag, i) => (
          <button key={i} onClick={() => onUseOne(tag)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: 'var(--bg-secondary)', border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.78rem',
            cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#8B5CF6'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

const TABS = ['Tamil', 'English', 'SEO', 'Settings'];

const slugify = (text) =>
  (text || '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const NewsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { user } = useAuth();

  const getPreviewUrl = (url) => {
    if (!url) return '';
    let finalUrl = url;
    if (typeof finalUrl === 'string' && finalUrl.includes('kings-tv.onrender.com')) {
      const path = finalUrl.replace(/^https?:\/\/kings-tv\.onrender\.com/, '');
      const cleanPath = path.startsWith('/api/v1') ? path.substring(7) : path;
      const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
        .replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '');
      finalUrl = serverBase + (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath);
    }
    if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://') || finalUrl.startsWith('data:')) return finalUrl;
    const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/api\/?$/, '');
    const normalizedUrl = finalUrl.startsWith('/') ? finalUrl : '/' + finalUrl;
    return serverBase + normalizedUrl;
  };

  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [reporters, setReporters] = useState([]);

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAction, setAiAction] = useState('expand');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [lastSavedTime, setLastSavedTime] = useState(null);
  
  // AI SEO Assistant state
  const [aiSeoLoading, setAiSeoLoading] = useState(false);
  const [aiSeoSuggestions, setAiSeoSuggestions] = useState(null);
  const [linkSuggestions, setLinkSuggestions] = useState([]);

  // ── Inline AI Suggestion — state only (logic after form is declared) ──────
  const [aiEnabled, setAiEnabled] = useState(false);
  const [suggestions, setSuggestions] = useState({});
  const [suggLoading, setSuggLoading] = useState({});
  const [suggDismissed, setSuggDismissed] = useState({});
  const lastGenHash = useRef('');
  const debounceTimer = useRef(null);

  const [userEditedFields, setUserEditedFields] = useState({});
  const [aiFieldStates, setAiFieldStates] = useState({
    titleTa: 'idle', titleEn: 'idle', shortDescTa: 'idle', shortDescEn: 'idle',
    contentTa: 'idle', contentEn: 'idle', metaTitle: 'idle', metaDescription: 'idle',
    metaKeywords: 'idle', focusKeywords: 'idle', slug: 'idle', categoryId: 'idle'
  });
  const [showAiNote, setShowAiNote] = useState(false);
  const [docUploadProgress, setDocUploadProgress] = useState({ ta: '', en: '' });

  const [form, setForm] = useState({
    titleTa: '', titleEn: '', contentTa: '', contentEn: '',
    shortDescTa: '', shortDescEn: '', imageUrl: '', featuredImage: '',
    authorName: user?.name || user?.username || 'Kings TV News Desk', 
    reporterName: '', readabilityScore: '', seoScore: '', status: 'draft',
    categoryId: '', subcategoryId: '',
    districtId: '', constituency: '',
    metaTitle: '', metaDescription: '', metaKeywords: '', focusKeywords: '', slug: '', canonicalUrl: '',
    latitude: '', longitude: '', visibilityRadiusKm: '',
    publishedAt: '',
    showRightColumn: true, isPluggedIn: false, featuredCategory: '',
    aiAutomationEnabled: false,
  });

  // ── Gemini Multimodal OCR helper ──────────────────────────────────────────
  const callGeminiMultimodal = async (base64Data, mimeType, prompt) => {
    const url = getGeminiUrl();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt }
          ]
        }]
      }),
    });
    if (!res.ok) throw new Error(`Gemini Multimodal failed: ${res.status}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  };

  // ── SEO & Readability Score Calculators (Rule-based, non-hallucinated) ─────
  const calculateReadabilityScore = (text, isTamil) => {
    if (!text) return 0;
    const clean = text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    const words = clean ? clean.split(/\s+/).length : 0;
    if (words === 0) return 0;
    
    if (isTamil) {
      const charCount = clean.replace(/\s+/g, '').length;
      const avgWordLength = charCount / words;
      const score = Math.max(0, Math.min(100, Math.round(130 - (avgWordLength * 12))));
      return score;
    } else {
      const sentences = clean.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
      const syllables = clean.length / 3; // rough estimate
      const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
      return Math.max(0, Math.min(100, Math.round(score)));
    }
  };

  const calculateSeoScore = (formState) => {
    let score = 0;
    const titleLen = (formState.metaTitle || formState.titleEn || formState.titleTa || '').length;
    if (titleLen >= 40 && titleLen <= 60) score += 20;
    else if (titleLen > 0) score += 10;
    
    const descLen = (formState.metaDescription || '').length;
    if (descLen >= 120 && descLen <= 160) score += 20;
    else if (descLen > 0) score += 10;
    
    const focusKw = (formState.focusKeywords || '').toLowerCase().trim();
    const content = ((formState.contentTa || '') + ' ' + (formState.contentEn || '')).toLowerCase();
    if (focusKw && content.includes(focusKw)) {
      score += 20;
      const index = content.replace(/<[^>]*>?/gm, ' ').indexOf(focusKw);
      if (index >= 0 && index < 200) score += 10;
    }
    
    const title = ((formState.titleEn || '') + ' ' + (formState.titleTa || '')).toLowerCase();
    if (focusKw && title.includes(focusKw)) {
      score += 15;
    }
    
    const slug = (formState.slug || '');
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      score += 15;
    }
    
    return score;
  };

  // ── Inline AI Suggestion — full logic (after form is declared) ────────────
  const SUGG_SOURCE = {
    excerpt: 'Title + Content', metaTitle: 'Title', focusKeyword: 'Content',
    metaDescription: 'Content', slug: 'Title', tags: 'Content', category: 'Content',
  };

  const setFieldSugg = (field, val) => setSuggestions(p => ({ ...p, [field]: val }));
  const setFieldLoad = (field, v)  => setSuggLoading(p => ({ ...p, [field]: v }));
  const dismissField = (field)      => setSuggDismissed(p => ({ ...p, [field]: true }));
  const undismissAll = ()           => setSuggDismissed({});

  const logUse = (field, value, hash) => {
    try {
      const log = JSON.parse(localStorage.getItem('ai_use_log') || '[]');
      log.unshift({ field, value: String(value).slice(0, 200), contentHash: hash, ts: new Date().toISOString() });
      localStorage.setItem('ai_use_log', JSON.stringify(log.slice(0, 100)));
    } catch {}
  };

  const resyncField = (fieldName) => {
    setUserEditedFields(prev => ({ ...prev, [fieldName]: false }));
    setAiFieldStates(prev => ({ ...prev, [fieldName]: 'generating' }));
    triggerFieldGeneration(fieldName);
  };

  const handleToggleAiAutomation = (checked) => {
    setForm(f => ({ ...f, aiAutomationEnabled: checked }));
    if (checked) {
      setShowAiNote(true);
      setTimeout(() => setShowAiNote(false), 10000);
      const title = form.titleEn || form.titleTa || '';
      const content = form.contentTa || form.contentEn || '';
      if (title || content) {
        triggerAiAutomation(form.contentTa ? 'contentTa' : 'contentEn', form.contentTa || form.contentEn);
      }
    } else {
      setShowAiNote(false);
    }
  };

  const triggerFieldGeneration = async (field) => {
    setAiFieldStates(prev => ({ ...prev, [field]: 'generating' }));
    try {
      const title = form.titleEn || form.titleTa || '';
      const content = stripHtml(form.contentEn || form.contentTa || '');
      const contentShort = content.slice(0, 2000);
      let resValue = null;
      
      if (field === 'titleEn') {
        const prompt = `You are localizing a Tamil news headline into natural, idiomatic English for a news website. Do not transliterate — write it the way an English news editor would title this story. Tamil title: "${form.titleTa}"\nArticle content for context: "${contentShort.substring(0, 500)}"\nReturn only the English title, max 15 words, no quotes, no explanation.`;
        resValue = await callGemini(prompt);
      } else if (field === 'titleTa') {
        const prompt = `You are localizing an English news headline into natural, idiomatic Tamil for a news website. Do not transliterate — write it the way a Tamil news editor would title this story. English title: "${form.titleEn}"\nArticle content for context: "${contentShort.substring(0, 500)}"\nReturn only the Tamil title, max 15 words, no quotes, no explanation.`;
        resValue = await callGemini(prompt);
      } else if (field === 'contentEn') {
        const prompt = `Translate and localize the following Tamil news content into natural, idiomatic English. Retain original paragraphs. Tamil content:\n"${form.contentTa}"`;
        resValue = await callGemini(prompt);
        if (resValue && window.tinymce?.get('tinymce-contentEn')) {
          window.tinymce.get('tinymce-contentEn').setContent(resValue);
        }
      } else if (field === 'contentTa') {
        const prompt = `Translate and localize the following English news content into natural, idiomatic Tamil. Retain original paragraphs. English content:\n"${form.contentEn}"`;
        resValue = await callGemini(prompt);
        if (resValue && window.tinymce?.get('tinymce-contentTa')) {
          window.tinymce.get('tinymce-contentTa').setContent(resValue);
        }
      } else if (field === 'shortDescTa') {
        const prompt = `Summarize the following news article in Tamil in exactly 1-2 sentences, suitable for a "short description" field on a news CMS. Content: "${form.contentTa || contentShort}"\nReturn only the Tamil summary text.`;
        resValue = await callGemini(prompt);
      } else if (field === 'shortDescEn') {
        const prompt = `Summarize the following news article in English in exactly 1-2 sentences, suitable for a "short description" field on a news CMS. Content: "${form.contentEn || contentShort}"\nReturn only the English summary text.`;
        resValue = await callGemini(prompt);
      } else if (field === 'categoryId') {
        const categoryNames = categories.map(c => `${c.id}:${c.nameEn || c.name}`).join(', ');
        const prompt = `Given this news content, suggest the single best-fit category ID from this list: ${categoryNames}.\nReturn JSON: {"categoryId": "...", "confidence": 0-1}\nContent: "${contentShort}"`;
        const raw = await callGemini(prompt);
        try {
          const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
          if (parsed.categoryId && parsed.confidence >= 0.5) {
            resValue = parsed.categoryId;
          }
        } catch {}
      } else if (['metaTitle', 'metaDescription', 'metaKeywords', 'focusKeywords', 'slug'].includes(field)) {
        const lang = form.contentTa ? 'Tamil' : 'English';
        const contentVal = form.contentTa || form.contentEn || '';
        const prompt = `Given this news article content in ${lang}, generate SEO metadata as JSON only, no markdown, no explanation:
{
  "seo_title": "max 60 characters, keyword-forward",
  "meta_description": "max 160 characters",
  "meta_keywords": ["term1", "term2", ...] (5-8 terms),
  "focus_keywords": ["term1", "term2", "term3"] (1-3 terms),
  "url_slug": "lowercase-hyphenated-ascii"
}
Content: "${contentVal.substring(0, 2000)}"`;
        const raw = await callGemini(prompt);
        try {
          const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
          const map = {
            metaTitle: parsed.seo_title,
            metaDescription: parsed.meta_description,
            metaKeywords: Array.isArray(parsed.meta_keywords) ? parsed.meta_keywords.join(', ') : '',
            focusKeywords: Array.isArray(parsed.focus_keywords) ? parsed.focus_keywords.join(', ') : '',
            slug: parsed.url_slug
          };
          
          setForm(f => {
            const updates = {};
            Object.keys(map).forEach(k => {
              if (!userEditedFields[k]) {
                updates[k] = map[k];
                setAiFieldStates(prev => ({ ...prev, [k]: 'done' }));
              }
            });
            const updated = { ...f, ...updates };
            const readScore = calculateReadabilityScore(updated.contentTa || updated.contentEn, !!updated.contentTa);
            const seoScoreVal = calculateSeoScore(updated);
            updated.readabilityScore = readScore || '';
            updated.seoScore = seoScoreVal || '';
            return updated;
          });
          return;
        } catch {}
      }
      
      if (resValue !== null) {
        setForm(f => {
          const updated = { ...f, [field]: resValue };
          const readScore = calculateReadabilityScore(updated.contentTa || updated.contentEn, !!updated.contentTa);
          const seoScoreVal = calculateSeoScore(updated);
          updated.readabilityScore = readScore || '';
          updated.seoScore = seoScoreVal || '';
          return updated;
        });
        setAiFieldStates(prev => ({ ...prev, [field]: 'done' }));
      } else {
        setAiFieldStates(prev => ({ ...prev, [field]: 'idle' }));
      }
    } catch (e) {
      setAiFieldStates(prev => ({ ...prev, [field]: 'idle' }));
    }
  };

  const triggerAiAutomation = async (sourceField, value) => {
    if (!form.aiAutomationEnabled) return;
    const title   = form.titleEn || form.titleTa || '';
    const content = stripHtml(form.contentEn || form.contentTa || '');
    if (!title && !content) return;
    
    const hash = hashStr(title + content);
    if (hash === lastGenHash.current) return;
    lastGenHash.current = hash;
    
    const targets = [];
    if (sourceField === 'contentTa' && value) {
      if (!userEditedFields.contentEn) targets.push('contentEn');
      if (!userEditedFields.titleTa) targets.push('titleTa');
      if (!userEditedFields.shortDescTa) targets.push('shortDescTa');
      if (!userEditedFields.shortDescEn) targets.push('shortDescEn');
      if (!userEditedFields.categoryId) targets.push('categoryId');
      ['metaTitle', 'metaDescription', 'metaKeywords', 'focusKeywords', 'slug'].forEach(k => {
        if (!userEditedFields[k]) targets.push(k);
      });
    } else if (sourceField === 'contentEn' && value) {
      if (!userEditedFields.contentTa) targets.push('contentTa');
      if (!userEditedFields.titleEn) targets.push('titleEn');
      if (!userEditedFields.shortDescEn) targets.push('shortDescEn');
      if (!userEditedFields.shortDescTa) targets.push('shortDescTa');
      if (!userEditedFields.categoryId) targets.push('categoryId');
      ['metaTitle', 'metaDescription', 'metaKeywords', 'focusKeywords', 'slug'].forEach(k => {
        if (!userEditedFields[k]) targets.push(k);
      });
    } else if (sourceField === 'titleTa' && value) {
      if (!userEditedFields.titleEn) targets.push('titleEn');
      if (!userEditedFields.slug) targets.push('slug');
    } else if (sourceField === 'titleEn' && value) {
      if (!userEditedFields.titleTa) targets.push('titleTa');
      if (!userEditedFields.slug) targets.push('slug');
    }
    
    if (targets.length === 0) return;
    setAiFieldStates(prev => {
      const next = { ...prev };
      targets.forEach(t => { next[t] = 'generating'; });
      return next;
    });
    
    await Promise.allSettled(
      targets.map(t => triggerFieldGeneration(t))
    );
  };

  const generateSuggestions = useCallback(async (overrideHash) => {
    const title   = form.titleEn || form.titleTa || '';
    const content = stripHtml(form.contentEn || form.contentTa || '');
    if (!title && !content) return;
    const hash = overrideHash || hashStr(title + content);
    if (hash === lastGenHash.current && !overrideHash) return;
    lastGenHash.current = hash;
    undismissAll();
    const contentShort = content.slice(0, 2000);
    const categoryNames = categories.map(c => c.nameTa ? `${c.name} (${c.nameTa})` : c.name).join(', ');
    const prompts = {
      excerpt:         `Write a 1-2 sentence excerpt for this news article. Max 300 characters. Neutral, factual tone.\nTitle: "${title}"\nContent: "${contentShort}"\nReturn only the excerpt text.`,
      metaTitle:       `Generate an SEO meta title. Max 60 chars, keyword-forward.\nTitle: "${title}"\nReturn only the meta title.`,
      focusKeyword:    `Suggest the single primary focus keyword or phrase.\nTitle: "${title}"\nContent: "${contentShort}"\nReturn only the keyword.`,
      metaDescription: `Write an SEO meta description. Max 155 chars, compelling but factual.\nTitle: "${title}"\nContent: "${contentShort}"\nReturn only the meta description.`,
      slug:            `Generate a URL slug. Lowercase, hyphenated, ASCII only, max 70 chars.\nTitle: "${title}"\nReturn only the slug.`,
      tags:            `Suggest 3-6 relevant tags as a JSON array of short lowercase strings.\nTitle: "${title}"\nContent: "${contentShort}"\nReturn only the JSON array.`,
      category:        categoryNames ? `Suggest the best-fit category from: ${categoryNames}.\nReturn JSON: {"category": "...", "confidence": 0.0}. If confidence < 0.5 return {"category": null}.\nTitle: "${title}"\nContent: "${contentShort}"` : null,
    };
    await Promise.allSettled(
      Object.entries(prompts).map(async ([field, prompt]) => {
        if (!prompt) return;
        setFieldLoad(field, true); setFieldSugg(field, null);
        try {
          const raw = await callGemini(prompt);
          if (field === 'tags') {
            try { const a = JSON.parse(raw.replace(/```json|```/g, '').trim()); setFieldSugg(field, Array.isArray(a) ? a : []); }
            catch { setFieldSugg(field, []); }
          } else if (field === 'category') {
            try { const o = JSON.parse(raw.replace(/```json|```/g, '').trim()); setFieldSugg(field, o.category && o.confidence >= 0.5 ? o.category : null); }
            catch { setFieldSugg(field, null); }
          } else { setFieldSugg(field, raw); }
        } catch { setFieldSugg(field, null); }
        finally { setFieldLoad(field, false); }
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.titleEn, form.titleTa, form.contentEn, form.contentTa, categories]);

  // Debounce trigger on title/content change
  useEffect(() => {
    if (!aiEnabled) return;
    if (!(form.titleEn || form.titleTa) && !(form.contentEn || form.contentTa)) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => generateSuggestions(), 2500);
    return () => clearTimeout(debounceTimer.current);
  }, [aiEnabled, form.titleEn, form.titleTa, form.contentEn, form.contentTa]); // eslint-disable-line

  // Clear all when AI turned off
  useEffect(() => {
    if (!aiEnabled) { setSuggestions({}); setSuggLoading({}); setSuggDismissed({}); lastGenHash.current = ''; }
  }, [aiEnabled]);

  const useSuggestion = (formKey, fieldKey, value) => {
    setForm(f => ({ ...f, [formKey]: value }));
    logUse(fieldKey, value, lastGenHash.current);
    dismissField(fieldKey);
  };

  const useTagChip = (tag) => {
    const cur = (form.metaKeywords || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!cur.includes(tag)) { setForm(f => ({ ...f, metaKeywords: [...cur, tag].join(', ') })); logUse('tags_chip', tag, lastGenHash.current); }
  };

  const useAllTags = () => {
    if (!suggestions.tags?.length) return;
    const cur = (form.metaKeywords || '').split(',').map(s => s.trim()).filter(Boolean);
    const merged = [...new Set([...cur, ...suggestions.tags])].join(', ');
    setForm(f => ({ ...f, metaKeywords: merged })); logUse('tags_all', merged, lastGenHash.current); dismissField('tags');
  };

  const handleDocUpload = async (e, lang) => {
    const file = e.target.files[0];
    if (!file) return;
    const setProgress = (text) => setDocUploadProgress(prev => ({ ...prev, [lang]: text }));
    setProgress('Reading document…');
    try {
      let extractedText = '';
      if (file.type === 'text/plain') {
        extractedText = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsText(file);
        });
      } else if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        setProgress('Running OCR via AI…');
        const ocrPrompt = `Extract all text from this file. Retain original paragraph formatting. Do not summarize, just extract the exact text.`;
        extractedText = await callGeminiMultimodal(base64Data, file.type, ocrPrompt);
      } else {
        alert('Format not supported. Please upload a .pdf, .txt or an image file.');
        setProgress('');
        return;
      }
      if (!extractedText || extractedText.trim().length === 0) {
        setProgress('⚠️ Extraction failed (empty content)');
        setTimeout(() => setProgress(''), 4000);
        return;
      }
      const wordCount = extractedText.split(/\s+/).length;
      setProgress(`Extracted ${wordCount} words`);
      const targetField = lang === 'ta' ? 'contentTa' : 'contentEn';
      const editorId = lang === 'ta' ? 'tinymce-contentTa' : 'tinymce-contentEn';
      setForm(f => ({ ...f, [targetField]: extractedText }));
      if (window.tinymce?.get(editorId)) {
        window.tinymce.get(editorId).setContent(extractedText);
      }
      if (form.aiAutomationEnabled) {
        setProgress('Generating...');
        await triggerAiAutomation(targetField, extractedText);
      }
      setTimeout(() => setProgress(''), 4000);
    } catch (err) {
      console.error('Doc extraction error:', err);
      setProgress('⚠️ Error reading document');
      setTimeout(() => setProgress(''), 4000);
    }
  };

  const renderAiIndicator = (field) => {
    if (!form.aiAutomationEnabled) return null;
    const state = aiFieldStates[field] || 'idle';
    if (state === 'generating') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginLeft: '6px', fontSize: '0.72rem', color: '#8B5CF6', fontWeight: 600 }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid #8B5CF6', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          Auto-generating…
        </span>
      );
    }
    if (state === 'done') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginLeft: '6px', fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }} title="AI successfully generated this field.">
          ✨ Auto-filled
        </span>
      );
    }
    if (state === 'userEdited') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: '6px', fontSize: '0.72rem', color: '#F59E0B', fontWeight: 600 }}>
          <span>⚠️ Edited (AI paused)</span>
          <button
            type="button"
            onClick={() => resyncField(field)}
            style={{
              background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '4px', padding: '1px 6px', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            🔄 Resync
          </button>
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginLeft: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }} title="AI is monitoring this field.">
        ✨
      </span>
    );
  };


  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // Auto-save logic
  useEffect(() => {
    if (!isEdit) {
      const savedDraft = localStorage.getItem('newsEditorDraft');
      if (savedDraft) {
        if (window.confirm('You have an unsaved draft. Do you want to restore it?')) {
          try {
            const parsed = JSON.parse(savedDraft);
            setForm(parsed);
          } catch (e) {
            console.error('Failed to parse draft', e);
          }
        } else {
          localStorage.removeItem('newsEditorDraft');
        }
      }
    }
  }, [isEdit]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (!isEdit && (formRef.current.titleTa || formRef.current.contentTa)) {
        localStorage.setItem('newsEditorDraft', JSON.stringify(formRef.current));
        setLastSavedTime(new Date());
      }
    }, 30000); // 30 seconds
    return () => clearInterval(autoSaveInterval);
  }, [isEdit]);

  // Load Categories & Districts Data
  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data || [])).catch(() => {});
    api.get('/districts').then(r => setDistricts(r.data || [])).catch(() => {});
    // Fetch reporters/journalists for the reporter name dropdown
    api.get('/admin/users?role=MOBILE_JOURNALIST&size=100').then(r => {
      const users = r.data?.users || [];
      setReporters(users);
    }).catch(() => {
      // Also try fetching all journalist-type roles
      api.get('/admin/users?size=200').then(r => {
        const users = (r.data?.users || []).filter(u => 
          ['MOBILE_JOURNALIST', 'DISTRICT_ADMIN', 'CHIEF_EDITOR', 'INSTITUTION_LOGIN'].includes(u.role)
        );
        setReporters(users);
      }).catch(() => {});
    });
    api.get('/admin/config')
      .then(res => {
        if (Array.isArray(res.data)) {
          res.data.forEach(item => {
            if (item.configKey === 'ai.llm_api_key' && item.configValue) {
              activeAiConfig.apiKey = item.configValue;
            }
            if (item.configKey === 'ai.llm_api_url' && item.configValue) {
              activeAiConfig.apiUrl = item.configValue;
            }
            if (item.configKey === 'ai.llm_model' && item.configValue) {
              activeAiConfig.model = item.configValue;
            }
          });
        }
      })
      .catch(() => {});
    
    if (isEdit) {
      api.get(`/articles/${id}`).then(r => {
        const a = r.data;
        const formObj = {
          titleTa: a.titleTa || '', titleEn: a.titleEn || '',
          contentTa: a.contentTa || '', contentEn: a.contentEn || '',
          shortDescTa: a.shortDescTa || '', shortDescEn: a.shortDescEn || '',
          imageUrl: a.imageUrl || '', featuredImage: a.featuredImage || '',
          authorName: a.authorName || 'Kings TV News Desk', 
          reporterName: a.reporterName || '',
          readabilityScore: a.readabilityScore || '',
          seoScore: a.seoScore || '',
          status: a.status || 'draft',
          categoryId: a.categoryId || '', subcategoryId: a.subcategoryId || '',
          districtId: a.districtId || '', constituency: a.constituency || '',
          metaTitle: a.metaTitle || '', metaDescription: a.metaDescription || '',
          metaKeywords: a.metaKeywords || '', focusKeywords: a.focusKeywords || '', slug: a.slug || '', canonicalUrl: a.canonicalUrl || '',
          latitude: a.latitude || '', longitude: a.longitude || '',
          visibilityRadiusKm: a.visibilityRadiusKm || '',
          publishedAt: a.publishedAt ? a.publishedAt.substring(0, 16) : '',
          showRightColumn: a.showRightColumn !== false,
          isPluggedIn: a.isPluggedIn === true,
          featuredCategory: a.featuredCategory || '',
        };
        setForm(formObj);
        
        // Sync TinyMCE content if ready
        if (window.tinymce) {
          const editorTa = window.tinymce.get('tinymce-contentTa');
          if (editorTa) editorTa.setContent(a.contentTa || '');
          const editorEn = window.tinymce.get('tinymce-contentEn');
          if (editorEn) editorEn.setContent(a.contentEn || '');
        }
      }).catch(() => {});
    }
  }, [id, isEdit]);

  // Dynamically load subcategories when category changes
  useEffect(() => {
    if (form.categoryId) {
      // Reset subcategory when category changes
      setForm(prev => ({ ...prev, subcategoryId: '' }));
      // Load up to 200 subcategories to avoid pagination cutoff
      api.get(`/subcategories/getAllWeb?categoryId=${form.categoryId}&size=200`)
        .then(r => {
          if (r.data && r.data.content) {
            setSubCategories(r.data.content);
          } else if (Array.isArray(r.data)) {
            setSubCategories(r.data);
          } else {
            setSubCategories([]);
          }
        })
        .catch(() => setSubCategories([]));
    } else {
      setSubCategories([]);
    }
  }, [form.categoryId]);

  // Dynamic Internal Linking Suggestions
  useEffect(() => {
    if (form.focusKeywords) {
      api.get('/articles')
        .then(res => {
          const list = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.content) ? res.data.content : []);
          const matchKeywords = form.focusKeywords.toLowerCase().split(/[\s,]+/);
          const suggestions = list.filter(art => {
            if (art.id === parseInt(id)) return false;
            const title = ((art.titleEn || '') + ' ' + (art.titleTa || '')).toLowerCase();
            return matchKeywords.some(kw => kw.length > 2 && title.includes(kw));
          }).slice(0, 4);
          setLinkSuggestions(suggestions);
        })
        .catch(() => {});
    } else {
      setLinkSuggestions([]);
    }
  }, [form.focusKeywords, id]);

  // Initialize TinyMCE editors
  useEffect(() => {
    let active = true;
    
    const initTinyMCE = () => {
      if (!window.tinymce) return;

      // Clean up previous editors to prevent duplicate key errors
      if (window.tinymce.get('tinymce-contentTa')) {
        window.tinymce.get('tinymce-contentTa').destroy();
      }
      if (window.tinymce.get('tinymce-contentEn')) {
        window.tinymce.get('tinymce-contentEn').destroy();
      }

      const imagesUploadHandler = (blobInfo, progress) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        const baseApi = api.defaults.baseURL || 'http://localhost:8080/api/v1';
        xhr.open('POST', `${baseApi}/articles/upload`);
        
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (e) => {
          progress(e.loaded / e.total * 100);
        };

        xhr.onload = () => {
          if (xhr.status === 403 || xhr.status === 401) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
          }
          const json = JSON.parse(xhr.responseText);
          if (!json || typeof json.url !== 'string') {
            reject('Invalid JSON: ' + xhr.responseText);
            return;
          }
          const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
            .replace(/\/api\/v1\/?$/, '')
            .replace(/\/api\/?$/, '');
          resolve(serverBase + json.url);
        };

        xhr.onerror = () => {
          reject('Image upload failed due to a network error.');
        };

        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      });

      const commonConfig = {
        height: 600,
        menubar: 'file edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount',
          'emoticons', 'codesample', 'quickbars', 'directionality', 'nonbreaking',
          'pagebreak', 'accordion', 'visualchars', 'template'
        ],
        toolbar1: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
        toolbar2: 'bullist numlist outdent indent | link image media table | emoticons charmap | removeformat fullscreen preview | template',
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        quickbars_insert_toolbar: 'quickimage quicktable',
        contextmenu: 'link image table',
        templates: [
          { title: 'Breaking News', description: 'Standard breaking news layout', content: '<h3><strong>BREAKING NEWS</strong></h3><p>[Lead paragraph goes here. Keep it punchy and to the point.]</p><p>[Additional details.]</p>' },
          { title: 'Press Release', description: 'Formal press release format', content: '<h3><strong>PRESS RELEASE</strong></h3><p><strong>FOR IMMEDIATE RELEASE</strong></p><p>[City, Date] &mdash; [Company/Organization] today announced...</p>' },
          { title: 'Interview / Q&A', description: 'Q&A format', content: '<p><strong>Interviewer:</strong> [Question here]</p><p><strong>Guest:</strong> [Answer here]</p>' }
        ],
        skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
        content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        content_style: 'body { font-family:Inter,Outfit,-apple-system,BlinkMacSystemFont,sans-serif; font-size:16px; line-height: 1.6; background-color: var(--bg-surface); color: var(--text-primary); } img { border-radius: 8px; }',
        images_upload_handler: imagesUploadHandler,
        image_advtab: true,
        image_caption: true,
        toolbar_sticky: true,
        toolbar_sticky_offset: 60
      };

      window.tinymce.init({
        ...commonConfig,
        selector: '#tinymce-contentTa',
        setup: (editor) => {
          editor.on('change keyup blur', () => {
            setForm(f => ({ ...f, contentTa: editor.getContent() }));
          });
        },
        init_instance_callback: (editor) => {
          if (active && formRef.current.contentTa) {
            editor.setContent(formRef.current.contentTa);
          }
        }
      });

      window.tinymce.init({
        ...commonConfig,
        selector: '#tinymce-contentEn',
        setup: (editor) => {
          editor.on('change keyup blur', () => {
            setForm(f => ({ ...f, contentEn: editor.getContent() }));
          });
        },
        init_instance_callback: (editor) => {
          if (active && formRef.current.contentEn) {
            editor.setContent(formRef.current.contentEn);
          }
        }
      });
    };

    const checkInterval = setInterval(() => {
      if (window.tinymce) {
        clearInterval(checkInterval);
        initTinyMCE();
      }
    }, 100);

    return () => {
      active = false;
      clearInterval(checkInterval);
      if (window.tinymce) {
        if (window.tinymce.get('tinymce-contentTa')) {
          window.tinymce.get('tinymce-contentTa').destroy();
        }
        if (window.tinymce.get('tinymce-contentEn')) {
          window.tinymce.get('tinymce-contentEn').destroy();
        }
      }
    };
  }, []);

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadProgress(0);
    const uploadedItems = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await api.post('/articles/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data && res.data.url) {
          const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
            .replace(/\/api\/v1\/?$/, '')
            .replace(/\/api\/?$/, '');
          uploadedItems.push({
            name: file.name,
            url: serverBase + res.data.url,
            type: file.type
          });
        }
      } catch (err) {
        console.error("Upload failed for file", file.name, err);
      }
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }
    
    setMediaList(prev => [...prev, ...uploadedItems]);
    setUploadProgress(null);
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/articles/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        const serverBase = (api.defaults.baseURL || 'http://localhost:8080/api/v1')
          .replace(/\/api\/v1\/?$/, '')
          .replace(/\/api\/?$/, '');
        set('imageUrl', serverBase + res.data.url);
        showMsg('Featured image uploaded successfully!');
      }
    } catch (err) {
      showMsg('Failed to upload featured image.', true);
    }
  };

  const insertMediaIntoTinyMCE = (url, type) => {
    if (!window.tinymce) return;
    const activeEditorId = activeTab === 0 ? 'tinymce-contentTa' : 'tinymce-contentEn';
    const editor = window.tinymce.get(activeEditorId);
    if (!editor) {
      showMsg('Please click inside the Tamil or English editor first.', true);
      return;
    }
    
    let html = '';
    if (type.startsWith('video/')) {
      html = `<video controls style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;"><source src="${url}" type="${type}">Your browser does not support the video tag.</video><p>&nbsp;</p>`;
    } else {
      html = `<img src="${url}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;" /><p>&nbsp;</p>`;
    }
    editor.insertContent(html);
    
    // update form state immediately
    if (activeTab === 0) {
      set('contentTa', editor.getContent());
    } else {
      set('contentEn', editor.getContent());
    }
    showMsg('Media inserted successfully!');
  };

  const set = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      const readScore = calculateReadabilityScore(next.contentTa || next.contentEn, !!next.contentTa);
      const seoScoreVal = calculateSeoScore(next);
      next.readabilityScore = readScore || '';
      next.seoScore = seoScoreVal || '';
      return next;
    });
  };

  const handleUserEdit = (fieldName, value) => {
    setForm(f => {
      const next = { ...f, [fieldName]: value };
      const readScore = calculateReadabilityScore(next.contentTa || next.contentEn, !!next.contentTa);
      const seoScoreVal = calculateSeoScore(next);
      next.readabilityScore = readScore || '';
      next.seoScore = seoScoreVal || '';
      return next;
    });
    setUserEditedFields(prev => ({ ...prev, [fieldName]: true }));
    setAiFieldStates(prev => ({ ...prev, [fieldName]: 'userEdited' }));
    if (form.aiAutomationEnabled) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        triggerAiAutomation(fieldName, value);
      }, 2500);
    }
  };

  const autoSlug = () => {
    if (!form.slug && form.titleEn) set('slug', slugify(form.titleEn));
  };

  // ─── Client-side AI fallback (used when backend has no LLM configured) ─────
  const clientSideAiFallback = (action, text, title) => {
    const cleanText = (text || '').replace(/<[^>]*>/gm, ' ').replace(/\s+/g, ' ').trim();
    const cleanTitle = (title || '').replace(/<[^>]*>/gm, '').trim();

    switch (action) {
      case 'headlines': {
        const base = cleanTitle || cleanText.substring(0, 80);
        return [
          base,
          `Breaking: ${base.substring(0, 60)}`,
          `Update: ${base.substring(0, 55)} — Latest News`,
          `Exclusive: ${base.substring(0, 55)}`,
        ].filter(Boolean).join('\n');
      }
      case 'summarize': {
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
        return sentences.slice(0, 3).map(s => s.trim()).join('. ') + (sentences.length > 3 ? '...' : '.');
      }
      case 'tags': {
        const words = cleanText.toLowerCase().split(/\s+/);
        const stopWords = new Set(['the','a','an','is','are','was','were','to','of','in','on','at','and','or','but','for','with','as','by','from','that','this','these','those','it','its','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','not','no','so','if','then','than','when','where','who','which','what','how','all','any','both','each','few','more','most','other','such','into','through','during','before','after','above','below','between']);
        const freq = {};
        words.forEach(w => {
          const clean = w.replace(/[^\w]/g, '');
          if (clean.length > 3 && !stopWords.has(clean)) freq[clean] = (freq[clean] || 0) + 1;
        });
        return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w).join(', ');
      }
      case 'seo': {
        const title60 = cleanTitle.substring(0, 60) || cleanText.substring(0, 60);
        const desc = cleanText.substring(0, 155) + (cleanText.length > 155 ? '...' : '');
        const words2 = cleanText.toLowerCase().split(/\s+/);
        const stopWords2 = new Set(['the','a','an','is','are','was','to','of','in','on','and','or','for','with','this','that','it']);
        const freq2 = {};
        words2.forEach(w => {
          const c = w.replace(/[^\w]/g, '');
          if (c.length > 3 && !stopWords2.has(c)) freq2[c] = (freq2[c] || 0) + 1;
        });
        const kws = Object.entries(freq2).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w).join(', ');
        const slugBase = title60.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return 'SEO_TITLE:' + title60 + '\nMETA_DESC:' + desc + '\nKEYWORDS:' + kws + '\nSLUG:' + slugBase + '\nTAGS:' + kws;
      }
      case 'expand': {
        return `${cleanText}\n\n[AI expansion not available — LLM credentials not configured. The above is your original content. Please configure an LLM API key in System Settings to enable AI expansion.]`;
      }
      case 'grammar': {
        return `Your text (${cleanText.split(' ').length} words) has been reviewed locally. For full grammar checking, please configure an LLM API key in System Settings > AI Configuration.\n\nOriginal text preview:\n${cleanText.substring(0, 300)}...`;
      }
      case 'translate': {
        return `Translation requires an LLM API key. Please configure one in System Settings > AI Configuration.\n\nYour text (${cleanText.split(' ').length} words) is ready to translate once configured.`;
      }
      default:
        return 'Action not supported in local fallback mode.';
    }
  };

  const runAiAction = async () => {
    if (!aiPrompt && !['seo', 'tags'].includes(aiAction)) {
      showMsg('Please provide some text or context for the AI.', true);
      return;
    }
    
    setAiLoading(true);
    setAiResult('');
    
    let textToProcess = aiPrompt;
    if (aiAction === 'seo' || aiAction === 'tags') {
       textToProcess = form.contentTa || form.contentEn;
       if (!textToProcess) {
         showMsg('Please write some article content first.', true);
         setAiLoading(false);
         return;
       }
    }

    try {
      let prompt = '';
      switch (aiAction) {
        case 'headlines':
          prompt = `Suggest 5 compelling, factual news headlines for this article content: "${textToProcess}". Return only the headlines listed 1 to 5.`;
          break;
        case 'expand':
          prompt = `Expand this text professionally into a more detailed, well-written article: "${textToProcess}". Keep the same language.`;
          break;
        case 'summarize':
          prompt = `Provide a concise summary (max 3 sentences) of this text: "${textToProcess}".`;
          break;
        case 'grammar':
          prompt = `Review and correct any grammar, spelling, or styling issues in this text. Provide only the corrected version: "${textToProcess}".`;
          break;
        case 'tags':
          prompt = `Suggest 5-8 relevant tags as a comma-separated list of short lowercase strings for this text: "${textToProcess}".`;
          break;
        case 'seo':
          prompt = `Given this news article, generate SEO fields. Return EXACTLY this format, nothing else:
SEO_TITLE: [title under 60 chars]
META_DESC: [description under 155 chars]
KEYWORDS: [focus keywords comma separated]
SLUG: [lowercase URL slug]
TAGS: [tags comma separated]

Article: "${textToProcess}"`;
          break;
        case 'translate':
          prompt = `Translate this text accurately. If it is in Tamil, translate to English. If it is in English, translate to Tamil. Return only the translated text: "${textToProcess}"`;
          break;
        default:
          throw new Error('Unsupported action');
      }

      const result = await callGemini(prompt);
      setAiResult(result);
    } catch (err) {
      const fallback = clientSideAiFallback(aiAction, textToProcess, form.titleEn || form.titleTa);
      setAiResult('ℹ️ [Local Analysis — Gemini failed]\n\n' + fallback);
    } finally {
      setAiLoading(false);
    }
  };

  const generateAiSeoSuggestions = async () => {
    const textToAnalyze = form.contentTa || form.contentEn || form.titleTa;
    if (!textToAnalyze) {
      showMsg('Please write some content first to generate SEO suggestions.', true);
      return;
    }
    setAiSeoLoading(true);
    try {
      const seoPrompt = `Given this news article, generate SEO fields. Return EXACTLY this format, nothing else:
SEO_TITLE: [title under 60 chars]
META_DESC: [description under 155 chars]

Article: "${textToAnalyze}"`;

      const headlinesPrompt = `Suggest 5 compelling, factual news headlines for this article content: "${form.titleTa || form.titleEn || textToAnalyze.substring(0, 100)}". Return only the headlines listed 1 to 5.`;

      const tagsPrompt = `Suggest 3-6 relevant tags for this news article as a comma-separated list of short lowercase strings.
Article: "${textToAnalyze}"`;

      const [seoRes, headlinesRes, tagsRes] = await Promise.allSettled([
        callGemini(seoPrompt),
        callGemini(headlinesPrompt),
        callGemini(tagsPrompt)
      ]);

      const suggestions = { titles: [], descriptions: [], tags: [] };

      if (seoRes.status === 'fulfilled' && seoRes.value) {
        const lines = seoRes.value.split('\n');
        lines.forEach(line => {
          if (line.startsWith('SEO_TITLE:')) {
            suggestions.titles.push(line.replace('SEO_TITLE:', '').trim());
          } else if (line.startsWith('META_DESC:')) {
            suggestions.descriptions.push(line.replace('META_DESC:', '').trim());
          }
        });
      }

      if (headlinesRes.status === 'fulfilled' && headlinesRes.value) {
        const lines = headlinesRes.value.split('\n');
        lines.forEach(line => {
          const cleaned = line.replace(/^\d+\.\s*/, '').trim();
          if (cleaned) {
            const parts = cleaned.split('|');
            const headline = parts[1] ? parts[1].trim() : parts[0].trim();
            suggestions.titles.push(headline);
          }
        });
      }

      if (tagsRes.status === 'fulfilled' && tagsRes.value) {
        suggestions.tags = tagsRes.value
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0);
      }

      suggestions.titles = [...new Set(suggestions.titles)].filter(t => t.length > 0);
      if (suggestions.descriptions.length === 0) {
        suggestions.descriptions.push(textToAnalyze.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...');
      }

      setAiSeoSuggestions(suggestions);
      showMsg('Successfully generated AI SEO suggestions!');
    } catch (err) {
      showMsg('Failed to fetch AI recommendations.', true);
    } finally {
      setAiSeoLoading(false);
    }
  };

  // Auto-generate tags/keywords on entering SEO tab
  useEffect(() => {
    if (activeTab === 2 && !form.metaKeywords && (form.contentTa || form.contentEn)) {
      const autoGenTags = async () => {
        try {
          const tagsPrompt = `Suggest 3-6 relevant tags for this news article as a comma-separated list of short lowercase strings.
Article: "${form.contentTa || form.contentEn}"`;
          const result = await callGemini(tagsPrompt);
          if (result) {
            const cleanedTags = result.split(',').map(s=>s.trim()).filter(s=>s).join(', ');
            set('metaKeywords', cleanedTags);
            showMsg('AI automatically generated keywords/tags for you!', false);
          }
        } catch (e) {
          console.warn('Auto-generation of keywords failed', e);
        }
      };
      autoGenTags();
    }
  }, [activeTab]);

  const autoFillSeoWithAi = async () => {
    const textToAnalyze = form.contentTa || form.contentEn || form.titleTa;
    if (!textToAnalyze) {
      showMsg('Please write some content first to generate SEO suggestions.', true);
      return;
    }
    setAiSeoLoading(true);
    
    const applyParsedSeo = (result) => {
      const lines = result.split('\n');
      let updates = {};
      lines.forEach(line => {
        if (line.startsWith('SEO_TITLE:')) updates.metaTitle = line.replace('SEO_TITLE:', '').trim();
        else if (line.startsWith('META_DESC:')) updates.metaDescription = line.replace('META_DESC:', '').trim();
        else if (line.startsWith('SLUG:')) updates.slug = line.replace('SLUG:', '').trim();
        else if (line.startsWith('KEYWORDS:')) updates.focusKeywords = line.replace('KEYWORDS:', '').trim();
        else if (line.startsWith('TAGS:')) updates.metaKeywords = line.replace('TAGS:', '').trim();
      });
      return updates;
    };

    try {
      const seoPrompt = `Given this news article content, generate SEO fields. Return EXACTLY this format, nothing else:
SEO_TITLE: [title under 60 chars]
META_DESC: [description under 155 chars]
SLUG: [lowercase URL slug]
KEYWORDS: [focus keywords comma separated]
TAGS: [tags comma separated]

Article: "${textToAnalyze}"`;
      const result = await callGemini(seoPrompt);
      if (result) {
        const updates = applyParsedSeo(result);
        setForm(f => {
          const nf = { ...f, ...updates };
          const readScore = calculateReadabilityScore(nf.contentTa || nf.contentEn, !!nf.contentTa);
          const seoScoreVal = calculateSeoScore(nf);
          nf.readabilityScore = readScore || '';
          nf.seoScore = seoScoreVal || '';
          formRef.current = nf;
          return nf;
        });
        showMsg('✨ AI successfully auto-filled all SEO fields!');
      } else {
        throw new Error('No result');
      }
    } catch (err) {
      const fallbackRaw = clientSideAiFallback('seo', textToAnalyze, form.titleEn || form.titleTa);
      const updates = applyParsedSeo(fallbackRaw);
      setForm(f => {
        const nf = { ...f, ...updates };
        const readScore = calculateReadabilityScore(nf.contentTa || nf.contentEn, !!nf.contentTa);
        const seoScoreVal = calculateSeoScore(nf);
        nf.readabilityScore = readScore || '';
        nf.seoScore = seoScoreVal || '';
        formRef.current = nf;
        return nf;
      });
      showMsg('ℹ️ SEO fields filled using local analysis. Configure an LLM for AI-powered results.');
    } finally {
      setAiSeoLoading(false);
    }
  };

  const showMsg = (text, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  const save = async (statusOverride) => {
    let payload = { ...form };
    if (statusOverride) payload.status = statusOverride;
    if (isEdit) payload.id = parseInt(id);
    if (!payload.slug && payload.titleEn) payload.slug = slugify(payload.titleEn);
    if (!payload.titleTa) { showMsg('Tamil title is required.', true); setActiveTab(0); return; }

    setSaving(true);
    
    // Auto-SEO on publish
    if (payload.status === 'published') {
      try {
        let seoUpdates = {};
        let needsSeo = false;
        if (!payload.metaTitle) {
          seoUpdates.metaTitle = payload.titleEn || payload.titleTa;
          needsSeo = true;
        }
        if (!payload.metaDescription && payload.contentTa) {
          const summarizePrompt = `Write a concise 1-2 sentence meta description summarizing this Tamil news article. Max 155 characters. Content: "${payload.contentTa}"`;
          const result = await callGemini(summarizePrompt);
          if (result) seoUpdates.metaDescription = result;
          needsSeo = true;
        }
        if (!payload.metaKeywords && payload.contentTa) {
          const tagsPrompt = `Suggest 3-6 relevant tags for this news article as a comma-separated list of short lowercase strings. Content: "${payload.contentTa}"`;
          const result = await callGemini(tagsPrompt);
          if (result) seoUpdates.metaKeywords = result.split(',').map(s=>s.trim()).filter(s=>s).join(', ');
          needsSeo = true;
        }
        
        if (needsSeo) {
           payload = { ...payload, ...seoUpdates };
           setForm(f => ({ ...f, ...seoUpdates }));
           showMsg('AI auto-generated SEO fields.', false);
        }
      } catch (err) {
        console.warn('Auto-SEO failed', err);
      }
    }

    try {
      if (isEdit) {
        await api.put('/articles/saveUpdate', payload);
        showMsg('Article updated successfully!');
        setTimeout(() => navigate('/admin/news'), 1500);
      } else {
        await api.post('/articles/saveUpdate', payload);
        showMsg('Article created successfully!');
        setTimeout(() => navigate('/admin/news'), 1500);
      }
    } catch (err) {
      showMsg(err.response?.data?.message || 'Save failed.', true);
    } finally {
      setSaving(false);
    }
  };

  const calcStats = (html) => {
    if (!html) return { words: 0, chars: 0, readingTime: 0, readability: { score: 0, label: 'N/A', color: 'gray' } };
    const text = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    const chars = text.length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute avg

    const sentences = text.split(/[.!?]+/).length || 1;
    const syllables = text.length / 3; // rough estimate
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / (words || 1));
    const normalized = Math.max(0, Math.min(100, score));
    let readability = { score: Math.round(normalized), label: 'Difficult', color: '#EF4444' };
    if (normalized > 70) readability = { score: Math.round(normalized), label: 'Easy to Read', color: '#10B981' };
    else if (normalized > 50) readability = { score: Math.round(normalized), label: 'Standard', color: '#F59E0B' };

    return { words, chars, readingTime, readability };
  };

  const getDensity = () => {
    const kw = form.focusKeywords ? form.focusKeywords.trim().toLowerCase() : '';
    if (!kw) return { count: 0, percent: 0, status: 'Neutral', color: 'gray' };
    const text = ((form.contentTa || '') + ' ' + (form.contentEn || '')).toLowerCase();
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length || 1;
    
    let count = 0;
    let pos = cleanText.indexOf(kw);
    while (pos !== -1) {
      count++;
      pos = cleanText.indexOf(kw, pos + kw.length);
    }
    
    const percent = parseFloat(((count / wordCount) * 100).toFixed(2));
    let status = 'Good';
    let color = '#10B981';
    if (percent < 0.5) {
      status = 'Too Low (<0.5%)';
      color = '#F59E0B';
    } else if (percent > 2.5) {
      status = 'Keyword Stuffing (>2.5%)';
      color = '#EF4444';
    }
    return { count, percent, status, color, wordCount };
  };

  const density = getDensity();

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    border: '1px solid var(--border-color)', background: 'var(--bg-surface)',
    color: 'var(--text-primary)', fontSize: '0.875rem', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const taStyle = { ...inputStyle, minHeight: '140px', resize: 'vertical', fontFamily: 'inherit' };
  const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' };

  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const renderPipeline = () => {
    const steps = [
      { id: 'draft', label: 'Draft' },
      { id: 'pending', label: 'Review' },
      { id: 'published', label: 'Published' }
    ];
    let currentStepIdx = steps.findIndex(s => s.id === form.status);
    if (currentStepIdx === -1) currentStepIdx = 0;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', zIndex: 2 }}>
              <div style={{ 
                width: '28px', height: '28px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: idx <= currentStepIdx ? 'var(--primary)' : 'var(--bg-secondary)',
                color: idx <= currentStepIdx ? '#fff' : 'var(--text-muted)',
                fontSize: '12px', fontWeight: 'bold', border: `2px solid ${idx <= currentStepIdx ? 'var(--primary)' : 'var(--border-color)'}`
              }}>
                {idx < currentStepIdx ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: idx <= currentStepIdx ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: '3px', background: idx < currentStepIdx ? 'var(--primary)' : 'var(--border-color)', margin: '0 -4px', alignSelf: 'center', marginBottom: '18px', zIndex: 1 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin/news')}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ marginBottom: '0.15rem' }}>{isEdit ? '✏️ Edit Article' : '📝 Create Article'}</h1>
            <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isEdit ? `Editing ID #${id}` : 'New article — Tamil required'}
              {lastSavedTime && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                  Autosaved at {lastSavedTime.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* ── Enable AI Automation Toggle ─────────────── */}
          <label
            title={form.aiAutomationEnabled ? 'AI Automation is ON — click to disable' : 'Enable AI Automation'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              padding: '0.45rem 0.9rem', borderRadius: '8px',
              background: form.aiAutomationEnabled ? 'rgba(16,185,129,0.12)' : 'var(--bg-secondary)',
              border: `1px solid ${form.aiAutomationEnabled ? 'rgba(16,185,129,0.45)' : 'var(--border-color)'}`,
              color: form.aiAutomationEnabled ? '#10B981' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 700, userSelect: 'none', transition: 'all 0.2s',
            }}
          >
            <input
              type="checkbox" checked={form.aiAutomationEnabled}
              onChange={e => handleToggleAiAutomation(e.target.checked)}
              style={{ accentColor: '#10B981', width: '14px', height: '14px' }}
            />
            <Sparkles size={13} style={{ color: form.aiAutomationEnabled ? '#10B981' : 'var(--text-secondary)' }} />
            {form.aiAutomationEnabled ? 'AI: ON' : 'AI: OFF'}
          </label>

          <button onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', background: aiPanelOpen ? 'var(--primary)' : '', color: aiPanelOpen ? '#fff' : '' }}>
            <Zap size={14} /> AI Assistant
          </button>
          <button onClick={() => save('draft')} disabled={saving}
            className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Save size={15} /> Save Draft
          </button>
          <button onClick={() => save('pending')} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem',
              borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
              border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer' }}>
            <Send size={15} /> Submit for Review
          </button>
          <button onClick={() => save('published')} disabled={saving}
            className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <CheckCircle size={15} /> {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>

      {/* AI Automation Note Banner */}
      {showAiNote && (
        <div style={{
          padding: '0.6rem 1rem', background: 'rgba(16,185,129,0.1)', color: '#10B981',
          border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px',
          fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <Sparkles size={14} /> AI will auto-fill and translate fields as you write. You can still edit anything manually.
        </div>
      )}

      {/* Alert */}
      {msg && (
        <div style={{
          padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600,
          background: msg.isError ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          color: msg.isError ? '#EF4444' : '#10B981',
          border: `1px solid ${msg.isError ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
        }}>{msg.text}</div>
      )}

      {/* AI Assistant Inline Panel — above tabs */}
      {aiPanelOpen && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '10px', border: '2px solid var(--primary)', background: 'var(--bg-surface)', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>✨ AI Assistant</h4>
              <button onClick={() => setAiPanelOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', padding: 0 }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <select style={{ ...inputStyle, cursor: 'pointer', flex: 1 }} value={aiAction} onChange={e => setAiAction(e.target.value)}>
                <option value="headlines">🪄 Generate Headlines</option>
                <option value="expand">✍️ Expand Text</option>
                <option value="summarize">📝 Summarize</option>
                <option value="grammar">🔤 Grammar Check</option>
                <option value="tags">🏷️ Generate Tags</option>
                <option value="seo">🔍 SEO Optimizer</option>
                <option value="translate">🌐 Translate (Ta↔En)</option>
              </select>
            </div>
            {['headlines', 'expand', 'summarize', 'grammar', 'translate'].includes(aiAction) && (
              <textarea
                style={{ ...taStyle, minHeight: '80px', marginBottom: '0.5rem' }}
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Enter text or rough idea..."
              />
            )}
            <button onClick={runAiAction} disabled={aiLoading} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              {aiLoading ? '🤖 Generating...' : '🚀 Run AI Action'}
            </button>
          </div>
          <div>
            {aiResult ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>AI Output</label>
                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto', flex: 1 }}>
                  {aiResult}
                </div>
                <button onClick={() => { navigator.clipboard.writeText(aiResult); showMsg('AI Output copied!'); }}
                  className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Copy size={12} /> Copy Output
                </button>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                Select an action and run it to see AI output here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', alignItems: 'center' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            style={{
              padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              background: 'transparent', borderBottom: activeTab === i ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === i ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '-2px', transition: 'all 0.2s'
            }}>
            {tab === 'Tamil' && '🇮🇳 '}{tab === 'English' && '🌐 '}{tab === 'SEO' && '🔍 '}{tab === 'Settings' && '⚙️ '}{tab}
          </button>
        ))}
        {/* Inline media insert button in tab bar */}
        <button
          onClick={() => setMediaModalOpen(true)}
          title="Open Media Insert Library"
          style={{ marginLeft: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <Image size={15} /> Media
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', position: 'relative', minHeight: '500px' }}>
            {/* Tamil Tab */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              visibility: activeTab === 0 ? 'visible' : 'hidden',
              height: activeTab === 0 ? 'auto' : 0,
              overflow: activeTab === 0 ? 'visible' : 'hidden',
              position: activeTab === 0 ? 'relative' : 'absolute',
              width: '100%',
              left: 0,
              top: activeTab === 0 ? 0 : '1.75rem',
              padding: activeTab === 0 ? 0 : '0 1.75rem',
              boxSizing: 'border-box',
              opacity: activeTab === 0 ? 1 : 0
            }}>
              <div>
                <label style={labelStyle}>Tamil Title <span style={{ color: '#EF4444' }}>*</span> {renderAiIndicator('titleTa')}</label>
                <input style={inputStyle} value={form.titleTa}
                  onChange={e => handleUserEdit('titleTa', e.target.value)} placeholder="தமிழ் தலைப்பு..." />
              </div>
              <div>
                <label style={labelStyle}>Short Description / Excerpt (Tamil) {renderAiIndicator('shortDescTa')}</label>
                <textarea style={taStyle} value={form.shortDescTa}
                  onChange={e => handleUserEdit('shortDescTa', e.target.value)} placeholder="சுருக்கமான விளக்கம்..." rows={3} />
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['excerpt'] && (
                  <AiSuggestionBox
                    fieldId="excerpt"
                    suggestion={suggestions['excerpt']}
                    loading={suggLoading['excerpt']}
                    source={SUGG_SOURCE['excerpt']}
                    onUse={() => useSuggestion('shortDescTa', 'excerpt', suggestions['excerpt'])}
                    onDismiss={() => dismissField('excerpt')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Content (Tamil) <span style={{ color: '#EF4444' }}>*</span> {renderAiIndicator('contentTa')}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="doc-upload-ta" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', margin: 0 }}>
                      📎 Attach source document
                    </label>
                    <input
                      type="file"
                      id="doc-upload-ta"
                      style={{ display: 'none' }}
                      accept=".pdf,.txt,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => handleDocUpload(e, 'ta')}
                    />
                    {docUploadProgress.ta && <span style={{ fontSize: '0.72rem', color: '#8B5CF6', fontStyle: 'italic' }}>{docUploadProgress.ta}</span>}
                  </div>
                </div>
                <textarea id="tinymce-contentTa" style={{ ...taStyle, minHeight: '350px' }} value={form.contentTa}
                  onChange={e => handleUserEdit('contentTa', e.target.value)} placeholder="செய்தி உள்ளடக்கம்..." />
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                  <span>📊 {calcStats(form.contentTa).words} words</span>
                  <span>📖 ~{calcStats(form.contentTa).readingTime} min read</span>
                  <span>🔤 {calcStats(form.contentTa).chars} characters</span>
                  <span style={{ color: calcStats(form.contentTa).readability.color, fontWeight: 600 }}>🧠 {calcStats(form.contentTa).readability.label}</span>
                </div>
              </div>
            </div>

            {/* English Tab */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              visibility: activeTab === 1 ? 'visible' : 'hidden',
              height: activeTab === 1 ? 'auto' : 0,
              overflow: activeTab === 1 ? 'visible' : 'hidden',
              position: activeTab === 1 ? 'relative' : 'absolute',
              width: '100%',
              left: 0,
              top: activeTab === 1 ? 0 : '1.75rem',
              padding: activeTab === 1 ? 0 : '0 1.75rem',
              boxSizing: 'border-box',
              opacity: activeTab === 1 ? 1 : 0
            }}>
              <div>
                <label style={labelStyle}>English Title {renderAiIndicator('titleEn')}</label>
                <input style={inputStyle} value={form.titleEn}
                  onChange={e => { handleUserEdit('titleEn', e.target.value); if (!form.slug) set('slug', slugify(e.target.value)); }}
                  placeholder="English headline..." />
              </div>
              <div>
                <label style={labelStyle}>Short Description / Excerpt (English) {renderAiIndicator('shortDescEn')}</label>
                <textarea style={taStyle} value={form.shortDescEn}
                  onChange={e => handleUserEdit('shortDescEn', e.target.value)} placeholder="Brief summary..." rows={3} />
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['excerpt'] && (
                  <AiSuggestionBox
                    fieldId="excerpt_en"
                    suggestion={suggestions['excerpt']}
                    loading={suggLoading['excerpt']}
                    source={SUGG_SOURCE['excerpt']}
                    onUse={() => useSuggestion('shortDescEn', 'excerpt', suggestions['excerpt'])}
                    onDismiss={() => dismissField('excerpt')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Content (English) {renderAiIndicator('contentEn')}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="doc-upload-en" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', margin: 0 }}>
                      📎 Attach source document
                    </label>
                    <input
                      type="file"
                      id="doc-upload-en"
                      style={{ display: 'none' }}
                      accept=".pdf,.txt,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => handleDocUpload(e, 'en')}
                    />
                    {docUploadProgress.en && <span style={{ fontSize: '0.72rem', color: '#8B5CF6', fontStyle: 'italic' }}>{docUploadProgress.en}</span>}
                  </div>
                </div>
                <textarea id="tinymce-contentEn" style={{ ...taStyle, minHeight: '350px' }} value={form.contentEn}
                  onChange={e => handleUserEdit('contentEn', e.target.value)} placeholder="Full article content..." />
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                  <span>📊 {calcStats(form.contentEn).words} words</span>
                  <span>📖 ~{calcStats(form.contentEn).readingTime} min read</span>
                  <span>🔤 {calcStats(form.contentEn).chars} characters</span>
                  <span style={{ color: calcStats(form.contentEn).readability.color, fontWeight: 600 }}>🧠 {calcStats(form.contentEn).readability.label}</span>
                </div>
              </div>
            </div>

            {/* SEO Tab */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              visibility: activeTab === 2 ? 'visible' : 'hidden',
              height: activeTab === 2 ? 'auto' : 0,
              overflow: activeTab === 2 ? 'visible' : 'hidden',
              position: activeTab === 2 ? 'relative' : 'absolute',
              width: '100%',
              left: 0,
              top: activeTab === 2 ? 0 : '1.75rem',
              padding: activeTab === 2 ? 0 : '0 1.75rem',
              boxSizing: 'border-box',
              opacity: activeTab === 2 ? 1 : 0
            }}>
              {/* AI SEO Assistant Widget */}
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(179, 115, 42, 0.08)', border: '1px solid var(--primary)', borderRadius: '10px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 700 }}>
                  ✨ AI News SEO Assistant
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 1rem 0' }}>
                  Analyze your article to automatically suggest titles, meta descriptions, and search tags.
                </p>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={autoFillSeoWithAi} disabled={aiSeoLoading} className="btn btn-primary" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {aiSeoLoading ? 'Auto-filling...' : '✨ One-Click AI Auto-Fill (All Fields)'}
                  </button>
                  <button onClick={generateAiSeoSuggestions} disabled={aiSeoLoading} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                    🔍 Generate & Suggest Options
                  </button>
                </div>

                {aiSeoSuggestions && (
                  <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {aiSeoSuggestions.titles && aiSeoSuggestions.titles.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>🎯 Suggested SEO Titles:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {aiSeoSuggestions.titles.map((t, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', gap: '1rem' }}>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{t}</span>
                              <button onClick={() => { set('metaTitle', t); showMsg('Meta Title updated!'); }} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Use</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiSeoSuggestions.descriptions && aiSeoSuggestions.descriptions.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>📝 Suggested Meta Descriptions:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {aiSeoSuggestions.descriptions.map((d, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', gap: '1rem' }}>
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{d}</span>
                              <button onClick={() => { set('metaDescription', d); showMsg('Meta Description updated!'); }} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Use</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiSeoSuggestions.tags && aiSeoSuggestions.tags.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>🏷️ Suggested Search Tags:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {aiSeoSuggestions.tags.map((tag, idx) => (
                            <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '15px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                              <span>#{tag}</span>
                              <button onClick={() => {
                                const currentTags = form.metaKeywords ? form.metaKeywords.split(',').map(s=>s.trim()).filter(s=>s) : [];
                                if (!currentTags.includes(tag)) {
                                  const newTags = [...currentTags, tag].join(', ');
                                  set('metaKeywords', newTags);
                                  showMsg(`Added tag #${tag}`);
                                }
                              }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 700, fontSize: '0.8rem' }}>+</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Live Google Search Preview</label>
                <div style={{ padding: '1rem', background: document.documentElement.classList.contains('dark') ? '#202124' : '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 1px 6px rgba(32,33,36,.1)', width: '600px', maxWidth: '100%', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>K</div>
                    <div>
                      <div style={{ fontSize: '14px', color: document.documentElement.classList.contains('dark') ? '#dadce0' : '#202124', lineHeight: '1.2' }}>King 24x7</div>
                      <div style={{ fontSize: '12px', color: document.documentElement.classList.contains('dark') ? '#bdc1c6' : '#5f6368', lineHeight: '1.2' }}>https://king24x7.com › news › {form.slug || 'article-slug'}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', color: document.documentElement.classList.contains('dark') ? '#8ab4f8' : '#1a0dab', textDecoration: 'none', marginBottom: '0.25rem', fontWeight: 400 }}>
                    {form.metaTitle || form.titleEn || form.titleTa || 'SEO Title Preview'}
                  </div>
                  <div style={{ fontSize: '14px', color: document.documentElement.classList.contains('dark') ? '#bdc1c6' : '#4d5156', lineHeight: '1.58' }}>
                    {form.metaDescription || 'Meta description preview will appear here. This gives users a summary of what they will find when they click the link in search results.'}
                  </div>
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>SEO Title <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(max 60 chars)</span> {renderAiIndicator('metaTitle')}</label>
                <input style={inputStyle} value={form.metaTitle}
                  onChange={e => handleUserEdit('metaTitle', e.target.value)} placeholder="SEO optimized title..." maxLength={60} />
                <div style={{ fontSize: '0.75rem', color: form.metaTitle.length > 55 ? '#F59E0B' : 'var(--text-muted)', marginTop: '4px' }}>
                  {form.metaTitle.length}/60 characters
                </div>
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['metaTitle'] && (
                  <AiSuggestionBox
                    fieldId="metaTitle"
                    suggestion={suggestions['metaTitle']}
                    loading={suggLoading['metaTitle']}
                    source={SUGG_SOURCE['metaTitle']}
                    onUse={() => useSuggestion('metaTitle', 'metaTitle', suggestions['metaTitle'])}
                    onDismiss={() => dismissField('metaTitle')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
              </div>
              <div>
                <label style={labelStyle}>Meta Description <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(max 160 chars)</span> {renderAiIndicator('metaDescription')}</label>
                <textarea style={{ ...taStyle, minHeight: '80px' }} value={form.metaDescription}
                  onChange={e => handleUserEdit('metaDescription', e.target.value)} placeholder="Meta description for search engines..." maxLength={160} />
                <div style={{ fontSize: '0.75rem', color: form.metaDescription.length > 150 ? '#F59E0B' : 'var(--text-muted)', marginTop: '4px' }}>
                  {form.metaDescription.length}/160 characters
                </div>
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['metaDescription'] && (
                  <AiSuggestionBox
                    fieldId="metaDescription"
                    suggestion={suggestions['metaDescription']}
                    loading={suggLoading['metaDescription']}
                    source={SUGG_SOURCE['metaDescription']}
                    onUse={() => useSuggestion('metaDescription', 'metaDescription', suggestions['metaDescription'])}
                    onDismiss={() => dismissField('metaDescription')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
              </div>
              <div>
                <label style={labelStyle}>Meta Keywords / Search Tags {renderAiIndicator('metaKeywords')}</label>
                <input style={inputStyle} value={form.metaKeywords}
                  onChange={e => handleUserEdit('metaKeywords', e.target.value)} placeholder="news, tamil, politics..." />
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['tags'] && (
                  <TagSuggestionBox
                    tags={suggestions['tags']}
                    loading={suggLoading['tags']}
                    onUseOne={useTagChip}
                    onUseAll={useAllTags}
                    onDismiss={() => dismissField('tags')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
              </div>
              <div>
                <label style={labelStyle}>Focus Keywords {renderAiIndicator('focusKeywords')}</label>
                <input style={inputStyle} value={form.focusKeywords}
                  onChange={e => handleUserEdit('focusKeywords', e.target.value)} placeholder="e.g. புதிய இந்திய அணி, இளம் வீரர்கள்..." />
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['focusKeyword'] && (
                  <AiSuggestionBox
                    fieldId="focusKeyword"
                    suggestion={suggestions['focusKeyword']}
                    loading={suggLoading['focusKeyword']}
                    source={SUGG_SOURCE['focusKeyword']}
                    onUse={() => useSuggestion('focusKeywords', 'focusKeyword', suggestions['focusKeyword'])}
                    onDismiss={() => dismissField('focusKeyword')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
                {form.focusKeywords && (
                  <div style={{ marginTop: '0.75rem', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 600 }}>Focus Keyword Density:</span>
                      <span style={{ color: density.color, fontWeight: 'bold' }}>{density.percent}% ({density.status})</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Found {density.count} occurrences in {density.wordCount} words. Target: 0.5% - 2.5%
                    </div>
                  </div>
                )}
                {linkSuggestions.length > 0 && (
                  <div style={{ marginTop: '0.75rem', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Suggested Internal Links:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {linkSuggestions.map(art => (
                        <div key={art.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px', color: 'var(--text-primary)' }}>
                            {art.titleEn || art.titleTa}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(`/news/${art.slug}`);
                              showMsg('Internal link copied to clipboard!');
                            }}
                            className="btn btn-secondary" 
                            style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                          >
                            Copy Link
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>URL Slug {renderAiIndicator('slug')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={form.slug}
                    onChange={e => handleUserEdit('slug', e.target.value)} placeholder="auto-generated-from-title" />
                  <button onClick={autoSlug} className="btn btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    Auto-generate
                  </button>
                </div>
                {!form.aiAutomationEnabled && aiEnabled && !suggDismissed['slug'] && (
                  <AiSuggestionBox
                    fieldId="slug"
                    suggestion={suggestions['slug']}
                    loading={suggLoading['slug']}
                    source={SUGG_SOURCE['slug']}
                    onUse={() => useSuggestion('slug', 'slug', suggestions['slug'])}
                    onDismiss={() => dismissField('slug')}
                    onRegenerate={() => generateSuggestions(Date.now().toString())}
                  />
                )}
              </div>
              <div>
                <label style={labelStyle}>Canonical URL</label>
                <input style={inputStyle} value={form.canonicalUrl}
                  onChange={e => handleUserEdit('canonicalUrl', e.target.value)} placeholder="https://king24x7.com/news/slug" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Readability Score (0-100)</label>
                  <input style={inputStyle} type="number" min="0" max="100" value={form.readabilityScore}
                    onChange={e => set('readabilityScore', e.target.value)} placeholder="e.g. 85" />
                </div>
                <div>
                  <label style={labelStyle}>SEO Score (0-100)</label>
                  <input style={inputStyle} type="number" min="0" max="100" value={form.seoScore}
                    onChange={e => set('seoScore', e.target.value)} placeholder="e.g. 92" />
                </div>
              </div>
            </div>

            {/* Settings Tab */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              visibility: activeTab === 3 ? 'visible' : 'hidden',
              height: activeTab === 3 ? 'auto' : 0,
              overflow: activeTab === 3 ? 'visible' : 'hidden',
              position: activeTab === 3 ? 'relative' : 'absolute',
              width: '100%',
              left: 0,
              top: activeTab === 3 ? 0 : '1.75rem',
              padding: activeTab === 3 ? 0 : '0 1.75rem',
              boxSizing: 'border-box',
              opacity: activeTab === 3 ? 1 : 0
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Author Name</label>
                  <input style={inputStyle} value={form.authorName}
                    onChange={e => set('authorName', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Reporter Name</label>
                  <input
                    list="reporter-list"
                    style={inputStyle}
                    value={form.reporterName}
                    onChange={e => set('reporterName', e.target.value)}
                    placeholder="Select or type reporter name..."
                  />
                  <datalist id="reporter-list">
                    {reporters.map(r => (
                      <option key={r.id} value={r.fullName || r.email}>
                        {r.fullName ? `${r.fullName} (${r.role?.replace(/_/g, ' ')})` : r.email}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
              <div>
                <DatePickerInput
                  label="Schedule Publish Date"
                  value={form.publishedAt ? form.publishedAt.substring(0, 10) : ''}
                  onChange={val => set('publishedAt', val ? val + 'T00:00' : '')}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ ...labelStyle, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <MapPin size={14} /> GPS Visibility (optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Latitude</label>
                    <input type="number" style={inputStyle} value={form.latitude}
                      onChange={e => set('latitude', e.target.value)} placeholder="11.0168" step="any" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Longitude</label>
                    <input type="number" style={inputStyle} value={form.longitude}
                      onChange={e => set('longitude', e.target.value)} placeholder="76.9558" step="any" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Radius (km)</label>
                    <input type="number" style={inputStyle} value={form.visibilityRadiusKm}
                      onChange={e => set('visibilityRadiusKm', e.target.value)} placeholder="50" />
                  </div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ ...labelStyle, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  Layout & Featured Controls
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={form.showRightColumn}
                      onChange={e => set('showRightColumn', e.target.checked)} />
                    Show Right Sidebar (Ads & Widgets)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={form.isPluggedIn}
                      onChange={e => set('isPluggedIn', e.target.checked)} />
                    Plug into Homepage Top Banner
                  </label>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Featured Section Override (Optional)</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.featuredCategory} onChange={e => set('featuredCategory', e.target.value)}>
                      <option value="">None</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.nameTa ? `${c.nameTa} / ${c.name}` : c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Media Assets Library Modal */}
        {mediaModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Image size={20} style={{ color: 'var(--primary)' }} /> Insert Media
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Upload images & videos, then insert them into your article content.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>
                    <label htmlFor="media-helper-upload" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                      <Plus size={14} /> Upload Files
                    </label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*,video/*" 
                      onChange={handleMediaUpload} 
                      style={{ display: 'none' }} 
                      id="media-helper-upload" 
                    />
                  </div>
                  <button onClick={() => setMediaModalOpen(false)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    Close
                  </button>
                </div>
              </div>

              {uploadProgress !== null && (
                <div style={{ width: '100%', background: 'var(--border-color)', height: '6px', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, background: 'var(--primary)', height: '100%', transition: 'width 0.2s' }} />
                </div>
              )}

              {mediaList.length === 0 ? (
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No media files available. Upload files to use them in the editor.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                  {mediaList.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <div style={{ height: '120px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.type.startsWith('image/') ? (
                          <img src={getPreviewUrl(item.url)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Video size={32} style={{ color: '#fff' }} />
                        )}
                      </div>
                      <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.name}>
                          {item.name}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button 
                              onClick={() => {
                                insertMediaIntoTinyMCE(item.url, item.type);
                                setMediaModalOpen(false);
                              }}
                              style={{ flex: 1, padding: '4px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Insert
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                showMsg('URL copied to clipboard!');
                              }}
                              style={{ padding: '4px 8px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                              title="Copy Link"
                            >
                              <Copy size={12} />
                            </button>
                            <button 
                              onClick={() => {
                                if(window.confirm('Delete this media item?')) {
                                  setMediaList(mediaList.filter((_, i) => i !== idx));
                                }
                              }}
                              style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', color: '#EF4444' }}
                              title="Remove from list"
                            >
                              ✕
                            </button>
                          </div>
                          {item.type && item.type.startsWith('image/') && (
                            <button 
                              onClick={() => { set('imageUrl', item.url); showMsg('✅ Set as featured image!'); }}
                              style={{ width: '100%', padding: '6px', background: form.imageUrl === item.url ? '#10B981' : 'rgba(16,185,129,0.15)', color: form.imageUrl === item.url ? '#fff' : '#10B981', border: '1px solid #10B981', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                              title="Set as Featured Image"
                            >
                              {form.imageUrl === item.url ? '✅ Featured Image' : '⭐ Set as Featured Image'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
            {renderPipeline()}
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft" style={{ color: '#000000', backgroundColor: '#ffffff' }}>📝 Draft</option>
              <option value="pending" style={{ color: '#000000', backgroundColor: '#ffffff' }}>⏳ Pending Review</option>
              <option value="published" style={{ color: '#000000', backgroundColor: '#ffffff' }}>✅ Published</option>
              <option value="rejected" style={{ color: '#000000', backgroundColor: '#ffffff' }}>❌ Rejected</option>
              <option value="archived" style={{ color: '#000000', backgroundColor: '#ffffff' }}>📦 Archived</option>
            </select>
          </div>

          {/* Category & Subcategory Cascading Select */}
          <CategorySubcategorySelect
            categoryId={form.categoryId}
            subcategoryId={form.subcategoryId}
            onCategoryChange={val => handleUserEdit('categoryId', val)}
            onSubcategoryChange={val => set('subcategoryId', val)}
            required={true}
            labelSuffix={renderAiIndicator('categoryId')}
          />

          {/* District */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
            <label style={labelStyle}>District</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.districtId} onChange={e => set('districtId', e.target.value)}>
              <option value="" style={{ color: '#000000', backgroundColor: '#ffffff' }}>— Select District —</option>
              {districts.map(d => (
                <option key={d.id} value={d.id} style={{ color: '#000000', backgroundColor: '#ffffff' }}>
                  {d.nameTa ? `${d.nameTa} / ${d.nameEn}` : d.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Constituency */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
            <label style={labelStyle}>Constituency</label>
            <input 
              style={inputStyle} 
              value={form.constituency}
              onChange={e => set('constituency', e.target.value)} 
              placeholder="e.g. Coimbatore South" 
            />
          </div>

          {/* Featured Image Upload with Instant Preview */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
            <ImageUploadPreview
              label="Featured Image"
              value={form.imageUrl}
              onChange={val => set('imageUrl', val)}
              uploadEndpoint="/articles/upload"
              placeholder="Image URL or upload file..."
            />
          </div>

          {/* News Tags */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px' }}>
            <label style={labelStyle}>News Tags (comma-separated) {renderAiIndicator('metaKeywords')}</label>
            <input 
              style={inputStyle} 
              value={form.metaKeywords}
              onChange={e => handleUserEdit('metaKeywords', e.target.value)} 
              placeholder="e.g. Budget, Assembly, Chennai" 
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
              {(form.metaKeywords || '').split(',').map(s => s.trim()).filter(Boolean).map((t, idx) => (
                <span key={idx} style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Save actions */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRadius: '12px' }}>
            <button onClick={() => save()} disabled={saving}
              className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => navigate('/admin/news')}
              className="btn btn-secondary" style={{ width: '100%' }}>Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsEditor;