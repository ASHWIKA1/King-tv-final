import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
  Building2, Wifi, Tag, FileQuestion, Briefcase,
  Heart, Gift, ShoppingBag, Plus, Search, Edit2, Trash2,
  ChevronDown, ExternalLink, Eye, ToggleLeft, ToggleRight, X,
  Check, CheckCircle, AlertCircle, Filter, Shield, Activity,
  FileText, Calendar, MapPin, User, Phone, Mail, Globe, Lock,
  Unlock, Settings, Flag, Clock, DollarSign, ArrowLeft
} from 'lucide-react';

const MODULE_TABS = [
  { key: 'directory', label: 'Business Directory', icon: Building2, endpoint: '/directory/getAll', color: '#3B82F6' },
  { key: 'nfc', label: 'NFC Cards', icon: Wifi, endpoint: '/nfc/admin/all', color: '#14B8A6' },
  { key: 'deals', label: 'Deals', icon: Tag, endpoint: '/deals', color: '#EF4444' },
  { key: 'rfq', label: 'RFQ', icon: FileQuestion, endpoint: '/rfq', color: '#06B6D4' },
  { key: 'classifieds', label: 'Classifieds', icon: ShoppingBag, endpoint: '/classifieds', color: '#F59E0B' },
  { key: 'obituaries', label: 'Obituaries', icon: Heart, endpoint: '/obituaries', color: '#8B5CF6' },
  { key: 'wishes', label: 'Wishes', icon: Gift, endpoint: '/wishes', color: '#EC4899' },
];

const formatDate = (val) => {
  if (!val) return '—';
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    return new Date(y, m - 1, d).toLocaleDateString() + ' ' + new Date(y, m - 1, d).toLocaleTimeString();
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

const CommunityModules = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [activeSubTab, setActiveSubTab] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Main items list
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  
  // Secondary items lists for sub-tabs
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [nfcLogs, setNfcLogs] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [reportedQuotes, setReportedQuotes] = useState([]);
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [comments, setComments] = useState([]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals & form states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUnmaskModal, setShowUnmaskModal] = useState(false);
  const [unmaskReason, setUnmaskReason] = useState('');
  const [isUnmasked, setIsUnmasked] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [cardUidInput, setCardUidInput] = useState('');
  const [showCardUidModal, setShowCardUidModal] = useState(false);

  // NFC Extended states
  const [showUndeliveredModal, setShowUndeliveredModal] = useState(false);
  const [undeliveredReason, setUndeliveredReason] = useState('wrong address');
  const [undeliveredNote, setUndeliveredNote] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentStatus: 'UNPAID',
    paymentAmount: '',
    paymentMethod: '',
    paymentReference: '',
    paidAt: ''
  });

  // Template Form (used for Obituary & Wish Frame Templates)
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '', category: '', assetUrl: '', thumbnail: '', isActive: true, displayOrder: 0,
    backgroundUrl: '', overlayUrl: '', borderColor: '', textColor: '', slug: ''
  });

  const activeMod = MODULE_TABS.find(m => m.key === activeTab);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 4000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  // -----------------------------------------------------
  // API Fetch Core
  // -----------------------------------------------------
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'directory') {
        const listingsRes = await api.get('/directory/getAll?size=100');
        setItems(listingsRes.data?.content || listingsRes.data || []);
        
        if (activeSubTab === 'reviews') {
          const revRes = await api.get('/directory/admin/reviews');
          setReviews(revRes.data || []);
        }
      } 
      else if (activeTab === 'nfc') {
        const res = await api.get('/nfc/admin/all');
        setItems(res.data || []);
      } 
      else if (activeTab === 'deals') {
        const dealsRes = await api.get('/deals');
        setItems(dealsRes.data || []);
        if (activeSubTab === 'redemptions') {
          const redRes = await api.get('/deals/admin/redemptions');
          setRedemptions(redRes.data || []);
        }
      } 
      else if (activeTab === 'rfq') {
        const res = await api.get('/rfq');
        setItems(res.data || []);
        if (activeSubTab === 'flagged_quotes') {
          const quotesRes = await api.get('/rfq/admin/quotes/reported');
          setReportedQuotes(quotesRes.data || []);
        }
      } 
      else if (activeTab === 'classifieds') {
        const res = await api.get('/classifieds?size=100');
        setItems(res.data || []);
        if (activeSubTab === 'reports') {
          const repRes = await api.get('/classifieds/admin/reports');
          setReports(repRes.data || []);
        }
      } 
      else if (activeTab === 'jobs') {
        const res = await api.get('/jobs?size=100');
        setItems(res.data || []);
      } 
      else if (activeTab === 'obituaries') {
        const res = await api.get('/obituaries?status=all&size=100');
        setItems(res.data?.content || res.data || []);
        if (activeSubTab === 'reports') {
          const repRes = await api.get('/obituaries/admin/reports');
          setReports(repRes.data || []);
        } else if (activeSubTab === 'frames') {
          const framesRes = await api.get('/obituaries/admin/frames/all');
          setTemplates(framesRes.data || []);
        }
      } 
      else if (activeTab === 'wishes') {
        const res = await api.get('/wishes?status=all&size=100');
        setItems(res.data?.content || res.data || []);
        if (activeSubTab === 'frames') {
          const framesRes = await api.get('/wishes/templates');
          setTemplates(framesRes.data || []);
        }
      }
    } catch (err) {
      showError(`Failed to fetch ${activeMod.label} data. Please ensure the backend server is running.`);
    }
    setLoading(false);
  };

  useEffect(() => {
    setItems([]);
    setSelectedItem(null);
    setSearch('');
    setStatusFilter('all');
    fetchItems();
  }, [activeTab, activeSubTab]);

  // Helper: Delete generic items
  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to permanently delete this item?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      showSuccess('Item deleted successfully');
      fetchItems();
    } catch {
      showError('Failed to delete item');
    }
  };

  // Helper: toggle listing activation
  const handleToggle = async (endpoint, id, current) => {
    try {
      await api.put(`${endpoint}/${id}`, { isActive: !current });
      showSuccess('Status updated');
      fetchItems();
    } catch {
      try {
        await api.patch(`${endpoint}/${id}/toggle`, { active: !current });
        showSuccess('Status updated');
        fetchItems();
      } catch {
        showError('Failed to update status');
      }
    }
  };

  // -----------------------------------------------------
  // Local Business Directory Handlers
  // -----------------------------------------------------
  const handleKycStatus = async (id, status, reason = '') => {
    try {
      await api.patch(`/directory/${id}/kyc`, { status, reason });
      showSuccess(`KYC listing successfully ${status}!`);
      setShowRejectionModal(false);
      setSelectedItem(null);
      fetchItems();
    } catch {
      showError('Failed to update business KYC status.');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await api.put(`/categories/saveUpdate`, { id: editingTemplate.id, ...templateForm });
        showSuccess('Category updated successfully');
      } else {
        await api.post(`/categories`, templateForm);
        showSuccess('Category created successfully');
      }
      setTemplateForm({ name: '', nameTa: '', slug: '', displayOrder: 0, icon: '' });
      setEditingTemplate(null);
      setShowTemplateModal(false);
      fetchItems();
    } catch {
      showError('Failed to save category');
    }
  };

  const handleReviewDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/directory/admin/reviews/${id}`);
      showSuccess('Review deleted');
      fetchItems();
    } catch {
      showError('Failed to delete review');
    }
  };

  // -----------------------------------------------------
  // NFC Card Handlers
  // -----------------------------------------------------
  const handleNfcStatusTransition = async (card, nextStatus, payload = {}) => {
    if (nextStatus === 'issued') {
      setSelectedItem(card);
      setCardUidInput('');
      setShowCardUidModal(true);
      return;
    }
    const cardId = card.card?.id || card.id;
    try {
      const res = await api.patch(`/nfc/${cardId}/status`, { status: nextStatus, ...payload });
      showSuccess(`Card status updated to ${nextStatus}`);
      setSelectedItem(prev => {
        if (prev && (prev.card?.id === cardId || prev.id === cardId)) {
          return { ...prev, card: res.data };
        }
        return prev;
      });
      fetchItems();
      fetchNfcLogs(cardId);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update NFC status');
    }
  };

  const handleNfcIssueSubmit = async (e) => {
    e.preventDefault();
    if (!cardUidInput.trim()) return;
    const cardId = selectedItem.card?.id || selectedItem.id;
    try {
      const res = await api.patch(`/nfc/${cardId}/status`, { status: 'issued', cardUid: cardUidInput });
      showSuccess('Card issued successfully');
      setShowCardUidModal(false);
      setSelectedItem(prev => {
        if (prev && (prev.card?.id === cardId || prev.id === cardId)) {
          return { ...prev, card: res.data };
        }
        return prev;
      });
      fetchItems();
      fetchNfcLogs(cardId);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to issue card');
    }
  };

  const fetchNfcLogs = async (cardId) => {
    try {
      const logRes = await api.get(`/nfc/${cardId}/audit`);
      setNfcLogs(logRes.data || []);
    } catch {
      setNfcLogs([]);
    }
  };

  const handleMarkAsRefunded = async (card) => {
    if (!window.confirm("Mark this payment as Refunded?")) return;
    try {
      const res = await api.post(`/nfc/${card.id}/payment/refund`);
      showSuccess("Payment marked as refunded");
      setSelectedItem(prev => {
        if (prev && prev.card?.id === card.id) {
          return { ...prev, card: res.data };
        }
        return prev;
      });
      fetchItems();
      fetchNfcLogs(card.id);
    } catch {
      showError("Failed to refund payment");
    }
  };

  const handleEditPaymentInfo = (card) => {
    setPaymentForm({
      paymentStatus: card.paymentStatus || 'UNPAID',
      paymentAmount: card.paymentAmount || '',
      paymentMethod: card.paymentMethod || '',
      paymentReference: card.paymentReference || '',
      paidAt: card.paidAt ? card.paidAt.substring(0, 16) : ''
    });
    setShowPaymentModal(true);
  };

  const submitPaymentInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/nfc/${selectedItem.card.id}/payment`, paymentForm);
      showSuccess("Payment info updated");
      setShowPaymentModal(false);
      setSelectedItem(prev => {
        if (prev && prev.card?.id === selectedItem.card.id) {
          return { ...prev, card: res.data };
        }
        return prev;
      });
      fetchItems();
      fetchNfcLogs(selectedItem.card.id);
    } catch {
      showError("Failed to update payment details");
    }
  };

  const submitBlockCard = async (e) => {
    e.preventDefault();
    if (!blockReason.trim()) return;
    try {
      await handleNfcStatusTransition(selectedItem.card, 'blocked', { reason: blockReason });
      setShowBlockModal(false);
      setBlockReason('');
    } catch {
      showError("Failed to block card");
    }
  };

  const submitUndelivered = async (e) => {
    e.preventDefault();
    try {
      await handleNfcStatusTransition(selectedItem.card, 'undelivered', { reason: undeliveredReason, note: undeliveredNote });
      setShowUndeliveredModal(false);
      setUndeliveredNote('');
    } catch {
      showError("Failed to mark card undelivered");
    }
  };

  // -----------------------------------------------------
  // Deals Handlers
  // -----------------------------------------------------
  const handleDeactivateDeal = async (id) => {
    try {
      await api.patch(`/deals/${id}/close`);
      showSuccess('Deal deactivated successfully');
      fetchItems();
    } catch {
      showError('Failed to deactivate deal');
    }
  };

  // -----------------------------------------------------
  // RFQ Handlers
  // -----------------------------------------------------
  const handleRfqClose = async (id) => {
    try {
      await api.delete(`/rfq/${id}`);
      showSuccess('RFQ closed successfully');
      fetchItems();
    } catch {
      showError('Failed to close RFQ');
    }
  };

  const handleQuoteAction = async (quoteId, action) => {
    try {
      if (action === 'dismiss') {
        await api.patch(`/rfq/quotes/${quoteId}/dismiss`);
        showSuccess('Quote report dismissed');
      } else {
        await api.delete(`/rfq/quotes/${quoteId}`);
        showSuccess('Quote removed successfully');
      }
      fetchItems();
    } catch {
      showError('Failed to execute action');
    }
  };

  // -----------------------------------------------------
  // Classifieds Handlers
  // -----------------------------------------------------
  const handleRemoveFeaturedClassified = async (id) => {
    try {
      await api.post(`/classifieds/${id}/boost`); // Toggle/Remove featured status
      showSuccess('Featured status toggled');
      fetchItems();
    } catch {
      showError('Failed to remove featured status');
    }
  };

  const handleClassifiedReportAction = async (reportId, action) => {
    try {
      await api.delete(`/classifieds/admin/reports/${reportId}`);
      showSuccess(action === 'remove' ? 'Listing removed and report resolved' : 'Report dismissed');
      fetchItems();
    } catch {
      showError('Failed to resolve report');
    }
  };

  // -----------------------------------------------------
  // Job Postings applications oversight
  // -----------------------------------------------------
  const loadJobApplications = async (jobId) => {
    try {
      const res = await api.get(`/jobs/admin/applications/${jobId}`);
      setJobApplications(res.data || []);
    } catch {
      setJobApplications([]);
    }
  };

  // -----------------------------------------------------
  // Obituaries Handlers
  // -----------------------------------------------------
  const handleObituaryStatus = async (id, status, reason = '') => {
    try {
      await api.patch(`/obituaries/${id}/status`, { status, reason });
      showSuccess(`Obituary listing successfully ${status}!`);
      setShowRejectionModal(false);
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update obituary status.');
    }
  };

  const handleObituaryReportAction = async (reportId, action) => {
    try {
      await api.delete(`/obituaries/admin/reports/${reportId}`);
      showSuccess(action === 'dismiss' ? 'Report dismissed' : 'Obituary removed');
      fetchItems();
    } catch {
      showError('Failed to resolve report');
    }
  };

  const handleObitGuestbookMod = async (id) => {
    if (!window.confirm('Remove guestbook message?')) return;
    try {
      await api.delete(`/obituaries/guestbook/${id}`);
      showSuccess('Message removed');
      if (selectedItem) {
        // reload details
        const detailsRes = await api.get(`/obituaries/${selectedItem.id}`);
        setSelectedItem({ ...selectedItem, guestbook: detailsRes.data?.guestbook || [] });
      }
    } catch {
      showError('Failed to delete comment');
    }
  };

  const handleUnmaskContact = async (obitId) => {
    if (!unmaskReason.trim()) return;
    try {
      await api.post(`/obituaries/admin/unmask-log`, { obituaryId: obitId, reason: unmaskReason });
      setIsUnmasked(true);
      setShowUnmaskModal(false);
      setUnmaskReason('');
      showSuccess('Contact details unmasked');
    } catch {
      showError('Failed to log audit reason');
    }
  };

  // -----------------------------------------------------
  // Frame Templates creation/edit (Obituaries & Wishes)
  // -----------------------------------------------------
  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    try {
      const basePath = activeTab === 'obituaries' ? '/obituaries/admin/frames' : '/wishes/admin/templates';
      if (editingTemplate) {
        await api.put(`${basePath}/${editingTemplate.id}`, templateForm);
        showSuccess('Frame Template updated');
      } else {
        await api.post(basePath, templateForm);
        showSuccess('Frame Template created');
      }
      setShowTemplateModal(false);
      setEditingTemplate(null);
      setTemplateForm({
        name: '', category: '', assetUrl: '', thumbnail: '', isActive: true, displayOrder: 0,
        backgroundUrl: '', overlayUrl: '', borderColor: '', textColor: '', slug: ''
      });
      fetchItems();
    } catch {
      showError('Failed to save frame template');
    }
  };

  const handleTemplateDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      const basePath = activeTab === 'obituaries' ? '/obituaries/admin/frames' : '/wishes/admin/templates';
      await api.delete(`${basePath}/${id}`);
      showSuccess('Template deleted');
      fetchItems();
    } catch {
      showError('Failed to delete template');
    }
  };

  // -----------------------------------------------------
  // Wish Comments Moderation
  // -----------------------------------------------------
  const handleWishCommentMod = async (id) => {
    if (!window.confirm('Remove comment?')) return;
    try {
      await api.delete(`/wishes/comments/${id}`);
      showSuccess('Comment removed');
      if (selectedItem) {
        const detailsRes = await api.get(`/wishes/${selectedItem.id}`);
        setSelectedItem({ ...selectedItem, comments: detailsRes.data?.comments || [] });
      }
    } catch {
      showError('Failed to delete comment');
    }
  };

  // -----------------------------------------------------
  // Filtering & Search client-side helper
  // -----------------------------------------------------
  const filteredItems = items.filter(item => {
    const text = JSON.stringify(item).toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    
    // Status filters
    if (activeTab === 'directory') {
      const statusMatch = statusFilter === 'all' || 
                         (statusFilter === 'pending' && item.kycStatus === 'pending') ||
                         (statusFilter === 'approved' && item.kycStatus === 'approved') ||
                         (statusFilter === 'rejected' && item.kycStatus === 'rejected');
      return matchesSearch && statusMatch;
    }
    if (activeTab === 'nfc') {
      const statusMatch = statusFilter === 'all' || item.card?.cardStatus?.toLowerCase() === statusFilter.toLowerCase();
      const paymentMatch = paymentStatusFilter === 'all' || item.card?.paymentStatus?.toLowerCase() === paymentStatusFilter.toLowerCase();
      return matchesSearch && statusMatch && paymentMatch;
    }
    if (activeTab === 'obituaries') {
      const statusMatch = statusFilter === 'all' || item.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && statusMatch;
    }
    
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Toast notifications */}
      {success && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(16,185,129,0.95)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-md)' }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}
      {error && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(239,68,68,0.95)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-md)' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1>Community Modules Admin Portal</h1>
        <p className="text-secondary">Oversight, review, moderation, and fulfillment consoles for directory, obituaries, wishes, cards, and marketplace listings.</p>
      </div>

      {/* Module tab pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {MODULE_TABS.map(mod => {
          const Icon = mod.icon;
          const isActive = activeTab === mod.key;
          return (
            <button
              key={mod.key}
              onClick={() => {
                setActiveTab(mod.key);
                setActiveSubTab('default');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '999px',
                border: `1px solid ${isActive ? mod.color : 'var(--border-color)'}`,
                background: isActive ? `${mod.color}22` : 'var(--bg-secondary)',
                color: isActive ? mod.color : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={14} />
              {mod.label}
            </button>
          );
        })}
      </div>

      {/* Active module panel container */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
        
        {/* Module Sub-tabs bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', pb: '1rem', mb: '1.5rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setActiveSubTab('default')} 
              style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'default' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'default' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
            >
              Console Queue
            </button>
            {activeTab === 'directory' && (
              <>
                <button 
                  onClick={() => setActiveSubTab('reviews')} 
                  style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'reviews' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
                >
                  Review Moderation
                </button>
              </>
            )}
            {activeTab === 'deals' && (
              <button 
                onClick={() => setActiveSubTab('redemptions')} 
                style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'redemptions' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'redemptions' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
              >
                Redemptions Log
              </button>
            )}
            {activeTab === 'rfq' && (
              <button 
                onClick={() => setActiveSubTab('flagged_quotes')} 
                style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'flagged_quotes' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'flagged_quotes' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
              >
                Flagged Quotes Queue
              </button>
            )}
            {activeTab === 'classifieds' && (
              <button 
                onClick={() => setActiveSubTab('reports')} 
                style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'reports' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'reports' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
              >
                Report Queue
              </button>
            )}
            {activeTab === 'obituaries' && (
              <>
                <button 
                  onClick={() => setActiveSubTab('reports')} 
                  style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'reports' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'reports' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
                >
                  Report Queue
                </button>
                <button 
                  onClick={() => setActiveSubTab('frames')} 
                  style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'frames' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'frames' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
                >
                  Frame Templates
                </button>
              </>
            )}
            {activeTab === 'wishes' && (
              <button 
                onClick={() => setActiveSubTab('frames')} 
                style={{ background: 'none', border: 'none', borderBottom: activeSubTab === 'frames' ? `2px solid ${activeMod.color}` : 'none', color: activeSubTab === 'frames' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600, paddingBottom: '0.5rem', cursor: 'pointer' }}
              >
                Wish Templates
              </button>
            )}
          </div>
          <button onClick={fetchItems} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            Refresh Data
          </button>
        </div>

        {/* Global Search & Sub-tab Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.2rem', width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '38px' }}
              placeholder={`Search ${activeMod.label}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {(activeTab === 'directory' && activeSubTab === 'default') && (
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: '160px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }}
            >
              <option value="all">KYC: All</option>
              <option value="pending">KYC: Pending</option>
              <option value="approved">KYC: Approved</option>
              <option value="rejected">KYC: Rejected</option>
            </select>
          )}
          {(activeTab === 'nfc' && activeSubTab === 'default') && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="form-control"
                style={{ width: '160px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }}
              >
                <option value="all">Status: All</option>
                <option value="requested">Requested</option>
                <option value="processing">Processing</option>
                <option value="issued">Issued</option>
                <option value="delivered">Delivered</option>
                <option value="undelivered">Undelivered</option>
                <option value="blocked">Blocked</option>
              </select>
              <select 
                value={paymentStatusFilter} 
                onChange={e => setPaymentStatusFilter(e.target.value)}
                className="form-control"
                style={{ width: '180px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }}
              >
                <option value="all">Payment: All</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}
          {(activeTab === 'obituaries' && activeSubTab === 'default') && (
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: '160px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px' }}
            >
              <option value="all">Status: All</option>
              <option value="pending_review">Pending Review</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
          )}
        </div>

        {/* Loading indicators */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Activity size={32} className="animate-pulse" style={{ color: activeMod.color, margin: '0 auto 1rem' }} />
            <p>Loading {activeMod.label} data...</p>
          </div>
        ) : (
          <div>
            {/* -----------------------------------------------------
                SUB-TAB: REVIEWS (Directory Reviews)
                ----------------------------------------------------- */}
            {activeTab === 'directory' && activeSubTab === 'reviews' && (
              <div>
                <h3>Business Directory Reviews ({reviews.length})</h3>
                <div className="table-container">
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Business</th>
                        <th>Reviewer</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(rev => (
                        <tr key={rev.id}>
                          <td>#{rev.id}</td>
                          <td><strong>{rev.business?.businessName || `Listing #${rev.listingId}`}</strong></td>
                          <td>{rev.reviewerName}</td>
                          <td style={{ color: '#F59E0B' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</td>
                          <td>{rev.comment}</td>
                          <td>{formatDate(rev.createdAt)}</td>
                          <td>
                            <button 
                              onClick={() => handleReviewDelete(rev.id)} 
                              className="btn btn-danger" 
                              style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------
                SUB-TAB: REDEMPTIONS LOG (Deals & Discounts)
                ----------------------------------------------------- */}
            {activeTab === 'deals' && activeSubTab === 'redemptions' && (
              <div>
                <h3>Deal Coupon Redemptions ({redemptions.length})</h3>
                <div className="table-container">
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Redemption Code</th>
                        <th>Deal Title</th>
                        <th>Merchant</th>
                        <th>User ID</th>
                        <th>Status</th>
                        <th>Redeemed At</th>
                        <th>Monitoring Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {redemptions.map(r => {
                        const usageSuspicious = r.deal && r.deal.redemptionCount > r.deal.usageLimit;
                        return (
                          <tr key={r.id}>
                            <td>#{r.id}</td>
                            <td><code>{r.redemptionCode}</code></td>
                            <td>{r.deal?.title || `Deal #${r.dealId}`}</td>
                            <td>{r.merchant?.businessName || '—'}</td>
                            <td>User #{r.userId || 'Guest'}</td>
                            <td>
                              <span className={`badge ${r.status === 'used' ? 'badge-success' : 'badge-warning'}`}>
                                {r.status}
                              </span>
                            </td>
                            <td>{formatDate(r.redeemedAt || r.createdAt)}</td>
                            <td>
                              {usageSuspicious ? (
                                <span className="badge badge-danger" style={{ background: '#EF4444', color: 'white' }}>
                                  ⚠️ Suspicious Code Reuse (Limit Exceeded)
                                </span>
                              ) : (
                                <span className="badge badge-success" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                                  ✓ Standard Usage
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------
                SUB-TAB: FLAGGED QUOTES QUEUE (RFQ Marketplace)
                ----------------------------------------------------- */}
            {activeTab === 'rfq' && activeSubTab === 'flagged_quotes' && (
              <div>
                <h3>Flagged quotations ({reportedQuotes.length})</h3>
                <div className="table-container">
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>RFQ Title</th>
                        <th>Seller Business</th>
                        <th>Quoted Price</th>
                        <th>Timeline</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportedQuotes.map(rq => (
                        <tr key={rq.quote?.id}>
                          <td>#{rq.quote?.id}</td>
                          <td>{rq.rfq?.title || `RFQ #${rq.quote?.rfqId}`}</td>
                          <td>{rq.seller?.businessName || `Listing #${rq.quote?.sellerBusinessId}`}</td>
                          <td><strong>₹{rq.quote?.quotedPrice}</strong></td>
                          <td>{rq.quote?.timelineDays} days</td>
                          <td>{rq.quote?.notes}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                onClick={() => handleQuoteAction(rq.quote?.id, 'dismiss')}
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px' }}
                              >
                                Dismiss Report
                              </button>
                              <button 
                                onClick={() => handleQuoteAction(rq.quote?.id, 'remove')}
                                className="btn btn-danger"
                                style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                              >
                                Remove Quote
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------
                SUB-TAB: REPORT QUEUES (Classifieds / Obituaries)
                ----------------------------------------------------- */}
            {(activeTab === 'classifieds' || activeTab === 'obituaries') && activeSubTab === 'reports' && (
              <div>
                <h3>Abuse and Spam Reports ({reports.length})</h3>
                <div className="table-container">
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Listing ID</th>
                        <th>Deceased Name / Classified Title</th>
                        <th>Reporter</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map(rep => {
                        const targetId = activeTab === 'obituaries' ? rep.report?.obituaryId : rep.report?.classifiedId;
                        const title = activeTab === 'obituaries' ? rep.obituary?.deceasedName : rep.classified?.title;
                        const autoFlagged = activeTab === 'obituaries' && rep.obituary?.reportCount >= 3;
                        
                        return (
                          <tr key={rep.report?.id}>
                            <td>#{rep.report?.id}</td>
                            <td>#{targetId}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{title || '—'}</div>
                              {autoFlagged && (
                                <span className="badge badge-danger" style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', marginTop: '4px', display: 'inline-block' }}>
                                  ⚠️ Auto-Flagged (Threshold Exceeded)
                                </span>
                              )}
                            </td>
                            <td>{rep.report?.reporterName}</td>
                            <td>{rep.report?.reason}</td>
                            <td>{formatDate(rep.report?.createdAt)}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={() => {
                                    if (activeTab === 'obituaries') {
                                      handleObituaryReportAction(rep.report?.id, 'dismiss');
                                    } else {
                                      handleClassifiedReportAction(rep.report?.id, 'dismiss');
                                    }
                                  }}
                                  className="btn btn-secondary"
                                  style={{ padding: '4px 8px' }}
                                >
                                  Dismiss
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (activeTab === 'obituaries') {
                                      // Remove listing: Soft delete obituary, then resolve report
                                      await api.delete(`/obituaries/${targetId}`);
                                      handleObituaryReportAction(rep.report?.id, 'remove');
                                    } else {
                                      // Remove listing
                                      await api.delete(`/classifieds/${targetId}`);
                                      handleClassifiedReportAction(rep.report?.id, 'remove');
                                    }
                                  }}
                                  className="btn btn-danger"
                                  style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                                >
                                  Hide & Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------
                SUB-TAB: FRAME TEMPLATES (Obituaries & Wishes)
                ----------------------------------------------------- */}
            {(activeTab === 'obituaries' || activeTab === 'wishes') && activeSubTab === 'frames' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3>Frame Templates ({templates.length})</h3>
                  <button 
                    onClick={() => {
                      setEditingTemplate(null);
                      setTemplateForm({
                        name: '', category: '', assetUrl: '', thumbnail: '', isActive: true, displayOrder: 0,
                        backgroundUrl: '', overlayUrl: '', borderColor: '', textColor: '', slug: ''
                      });
                      setShowTemplateModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ background: activeMod.color, display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none' }}
                  >
                    <Plus size={16} /> Add Frame Template
                  </button>
                </div>
                <div className="table-container">
                  <table className="custom-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        {activeTab === 'obituaries' ? (
                          <>
                            <th>Category</th>
                            <th>Asset URL</th>
                            <th>Status</th>
                          </>
                        ) : (
                          <>
                            <th>Slug</th>
                            <th>BG URL</th>
                            <th>Overlay URL</th>
                            <th>Colors</th>
                          </>
                        )}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map(t => (
                        <tr key={t.id}>
                          <td>#{t.id}</td>
                          <td><strong>{t.name}</strong></td>
                          {activeTab === 'obituaries' ? (
                            <>
                              <td>{t.category}</td>
                              <td><a href={t.assetUrl} target="_blank" rel="noopener noreferrer" style={{ color: activeMod.color, fontSize: '0.8rem' }}>View Link</a></td>
                              <td>
                                <span className={`badge ${t.isActive ? 'badge-success' : 'badge-warning'}`}>
                                  {t.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td><code>{t.slug}</code></td>
                              <td><a href={t.backgroundUrl} target="_blank" rel="noopener noreferrer" style={{ color: activeMod.color, fontSize: '0.8rem' }}>BG</a></td>
                              <td><a href={t.overlayUrl} target="_blank" rel="noopener noreferrer" style={{ color: activeMod.color, fontSize: '0.8rem' }}>Overlay</a></td>
                              <td>
                                <span style={{ fontSize: '0.75rem' }}>Border: <code>{t.borderColor}</code><br/>Text: <code>{t.textColor}</code></span>
                              </td>
                            </>
                          )}
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                onClick={() => {
                                  setEditingTemplate(t);
                                  setTemplateForm(t);
                                  setShowTemplateModal(true);
                                }}
                                className="btn btn-secondary" 
                                style={{ padding: '4px 8px' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleTemplateDelete(t.id)} 
                                className="btn btn-danger" 
                                style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -----------------------------------------------------
                DEFAULT QUEUE VIEWS (ALL 8 MODULES LIST VIEW)
                ----------------------------------------------------- */}
            {activeSubTab === 'default' && (
              <div>
                {filteredItems.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No console entries found for active filters.
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="custom-table" style={{ width: '100%' }}>
                      <thead>
                        {activeTab === 'directory' && (
                          <tr>
                            <th>ID</th>
                            <th>Business Name</th>
                            <th>Category</th>
                            <th>Phone</th>
                            <th>KYC Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                        {activeTab === 'nfc' && (
                          <tr>
                            <th>Business</th>
                            <th>Category</th>
                            <th>Link Type</th>
                            <th>Request Date</th>
                            <th>Card Status</th>
                            <th>Payment Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                        {activeTab === 'deals' && (
                          <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Discount</th>
                            <th>Redemptions</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                        {activeTab === 'rfq' && (
                          <tr>
                            <th>ID</th>
                            <th>Buyer ID</th>
                            <th>Requirement</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                        {activeTab === 'classifieds' && (
                          <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Condition</th>
                            <th>Views</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                        {activeTab === 'obituaries' && (
                          <tr>
                            <th>ID</th>
                            <th>Deceased Name</th>
                            <th>Passing Date</th>
                            <th>City</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                        {activeTab === 'wishes' && (
                          <tr>
                            <th>ID</th>
                            <th>Wish Heading</th>
                            <th>User ID</th>
                            <th>Views</th>
                            <th>Comments</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {filteredItems.map(item => {
                          const id = item.id || item.card?.id || item.listingId;
                          return (
                            <tr key={id}>
                              {/* 1. BUSINESS DIRECTORY ROWS */}
                              {activeTab === 'directory' && (
                                <>
                                  <td>#{item.id}</td>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.businessName}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.addressLocality}</div>
                                  </td>
                                  <td>{item.category}</td>
                                  <td>{item.phoneNumber}</td>
                                  <td>
                                    <span className={`badge ${item.kycStatus === 'approved' ? 'badge-success' : item.kycStatus === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                                      {item.kycStatus || 'pending'}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button 
                                      onClick={() => setSelectedItem(item)}
                                      className="btn btn-secondary" 
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '6px 12px' }}
                                    >
                                      <Eye size={14} /> Review Details
                                    </button>
                                  </td>
                                </>
                              )}

                              {/* 2. NFC CARDS ROWS */}
                              {activeTab === 'nfc' && (
                                <>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.businessName || '—'}</span>
                                    {item.business?.addressLocality && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.business.addressLocality}</div>}
                                  </td>
                                  <td>{item.business?.category || '—'}</td>
                                  <td><code style={{ fontSize: '0.8rem' }}>{item.card?.linkType}</code></td>
                                  <td style={{ fontSize: '0.8rem' }}>{formatDate(item.card?.createdAt)}</td>
                                  <td>
                                    <span className={`badge ${
                                      item.card?.cardStatus === 'delivered' ? 'badge-success' : 
                                      item.card?.cardStatus === 'issued' ? 'badge-info' : 
                                      item.card?.cardStatus === 'processing' ? 'badge-warning' : 
                                      item.card?.cardStatus === 'undelivered' ? 'badge-danger' : 
                                      item.card?.cardStatus === 'blocked' ? 'badge-danger' : 'badge-muted'
                                    }`} style={{ background: item.card?.cardStatus === 'issued' ? 'rgba(59,130,246,0.15)' : '', color: item.card?.cardStatus === 'issued' ? '#3b82f6' : '' }}>
                                      {item.card?.cardStatus || 'requested'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`badge ${
                                      item.card?.paymentStatus === 'PAID' ? 'badge-success' : 
                                      item.card?.paymentStatus === 'REFUNDED' ? 'badge-info' : 
                                      item.card?.paymentStatus === 'FAILED' ? 'badge-danger' : 'badge-warning'
                                    }`}>
                                      {item.card?.paymentStatus || 'UNPAID'}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                      <button 
                                        onClick={async () => {
                                          setSelectedItem(item);
                                          fetchNfcLogs(item.card?.id);
                                        }}
                                        className="btn btn-secondary" 
                                        style={{ padding: '6px 12px' }}
                                      >
                                        Fulfillment
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}

                              {/* 3. DEALS ROWS */}
                              {activeTab === 'deals' && (
                                <>
                                  <td>#{item.id}</td>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.title}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: <code>{item.couponCode}</code></div>
                                  </td>
                                  <td>{item.category}</td>
                                  <td>{item.discountType === 'percentage' ? `${item.discountValue}%` : `₹${item.discountValue}`}</td>
                                  <td>{item.redemptionCount} / {item.usageLimit}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                      {item.status === 'approved' && (
                                        <button 
                                          onClick={() => handleDeactivateDeal(item.id)}
                                          className="btn btn-secondary"
                                          style={{ padding: '4px 8px', color: '#f59e0b' }}
                                        >
                                          Deactivate
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleDelete('/api/v1/deals', item.id)}
                                        className="btn btn-danger"
                                        style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}

                              {/* 4. RFQ ROWS */}
                              {activeTab === 'rfq' && (
                                <>
                                  <td>#{item.id}</td>
                                  <td>User #{item.buyerId}</td>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.title}</span>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{item.description}</p>
                                  </td>
                                  <td>{item.quantity}</td>
                                  <td>
                                    <span className={`badge ${item.status === 'open' ? 'badge-success' : 'badge-muted'}`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                      {item.status === 'open' && (
                                        <button 
                                          onClick={() => handleRfqClose(item.id)}
                                          className="btn btn-secondary"
                                          style={{ padding: '4px 8px' }}
                                        >
                                          Close RFQ
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleDelete('/api/v1/rfq', item.id)}
                                        className="btn btn-danger"
                                        style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                                      >
                                        Remove Spam
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}

                              {/* 5. CLASSIFIEDS ROWS */}
                              {activeTab === 'classifieds' && (
                                <>
                                  <td>#{item.id}</td>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.title}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Locality: {item.location}</div>
                                  </td>
                                  <td><strong>₹{item.price}</strong></td>
                                  <td>{item.itemCondition || '—'}</td>
                                  <td>{item.viewsCount}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button 
                                      onClick={() => handleDelete('/api/classifieds', item.id)}
                                      className="btn btn-danger"
                                      style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                                    >
                                      Remove Listing
                                    </button>
                                  </td>
                                </>
                              )}

                              {/* 7. OBITUARIES ROWS */}
                              {activeTab === 'obituaries' && (
                                <>
                                  <td>#{item.id}</td>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.deceasedName}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age: {item.age}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem' }}>{item.dateOfPassing}</td>
                                  <td>{item.location}</td>
                                  <td>
                                    <span className={`badge ${
                                      item.status === 'published' ? 'badge-success' :
                                      item.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                                    }`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button 
                                      onClick={async () => {
                                        setIsUnmasked(false);
                                        // load details for guestbook
                                        const detailsRes = await api.get(`/obituaries/${item.id}`);
                                        setSelectedItem(detailsRes.data || item);
                                      }}
                                      className="btn btn-secondary" 
                                      style={{ padding: '6px 12px' }}
                                    >
                                      Approve / Review
                                    </button>
                                  </td>
                                </>
                              )}

                              {/* 8. WISHES ROWS */}
                              {activeTab === 'wishes' && (
                                <>
                                  <td>#{item.id}</td>
                                  <td>
                                    <span style={{ fontWeight: 700 }}>{item.heading}</span>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{item.wishText}</p>
                                  </td>
                                  <td>User #{item.userId || 'Guest'}</td>
                                  <td>{item.viewsCount}</td>
                                  <td>{item.commentCount} comments</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button 
                                      onClick={async () => {
                                        const detailsRes = await api.get(`/wishes/${item.id}`);
                                        setSelectedItem(detailsRes.data || item);
                                      }}
                                      className="btn btn-secondary" 
                                      style={{ padding: '6px 12px' }}
                                    >
                                      Moderate comments
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* -----------------------------------------------------
          MODAL OVERLAYS & WORKFLOW DIALOGS
          ----------------------------------------------------- */}
      
      {/* A. Business Directory Details & Moderation Modal */}
      {activeTab === 'directory' && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: activeMod.color, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Building2 /> Review Business Directory Details
                </h2>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {selectedItem.logoUrl && (
                  <img src={selectedItem.logoUrl} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                )}
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedItem.businessName}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Category: <strong>{selectedItem.category}</strong></p>
                  <p style={{ color: 'var(--text-muted)' }}>Location: <strong>{selectedItem.addressLocality}, {selectedItem.addressStreet}</strong></p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.phoneNumber}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Email Address:</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.email || '—'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Website URL:</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.website ? <a href={selectedItem.website} target="_blank" rel="noopener noreferrer" style={{ color: activeMod.color }}>{selectedItem.website}</a> : '—'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Working Hours:</span>
                  <div style={{ fontWeight: 600 }}>{selectedItem.workingHours || '—'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Business Description:</span>
                <p style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginTop: '0.25rem', border: '1px solid var(--border-color)' }}>
                  {selectedItem.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ background: 'rgba(179,115,42,0.06)', border: '1px dashed rgba(179,115,42,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B3732A', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <FileText size={16} /> Submitter KYC Credentials
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  A verification document has been uploaded to support this business registration.
                </p>
                {selectedItem.kycDocumentUrl ? (
                  <a 
                    href={selectedItem.kycDocumentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ExternalLink size={14} /> View / Download KYC Document
                  </a>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: 600 }}>No KYC proof document was uploaded.</span>
                )}
              </div>

              {/* Action Moderation buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button 
                  onClick={() => {
                    const info = window.prompt("Request more info - enter details to request:");
                    if (info) showSuccess("Info requested from business owner.");
                  }}
                  className="btn btn-secondary"
                >
                  Request Info
                </button>
                {selectedItem.kycStatus !== 'rejected' && (
                  <button 
                    onClick={() => {
                      setRejectionReason('');
                      setShowRejectionModal(true);
                    }}
                    className="btn btn-danger"
                    style={{ background: '#EF4444', color: 'white', border: 'none' }}
                  >
                    Reject KYC Listing
                  </button>
                )}
                {selectedItem.kycStatus !== 'approved' && (
                  <button 
                    onClick={() => handleKycStatus(selectedItem.id, 'approved')}
                    className="btn btn-primary"
                    style={{ background: '#10B981', color: 'white', border: 'none' }}
                  >
                    Approve KYC Listing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. NFC Requests Fulfillment Workflows Modal */}
      {activeTab === 'nfc' && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#ffffff', color: '#000000', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #d1d5db', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: activeMod.color, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Wifi /> NFC Fulfillment Dashboard
                </h2>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              {/* Business details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: activeMod.color, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Building2 size={16} /> Business Info</h4>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>{selectedItem.businessName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Category: {selectedItem.business?.category || '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Phone: {selectedItem.business?.phoneNumber || '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.5rem' }}>
                    KYC Status: <span style={{ fontWeight: 600, color: '#10B981' }}>{selectedItem.business?.kycStatus || 'pending'}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {selectedItem.business?.kycDocumentUrl ? (
                      <a 
                        href={selectedItem.business.kycDocumentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#3B82F6', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <ExternalLink size={12} /> View KYC Documents
                      </a>
                    ) : (
                      <span style={{ color: '#EF4444', fontStyle: 'italic' }}>
                        KYC Documents: No document URL stored (gap)
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: activeMod.color, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} /> NFC Profile Submission</h4>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Designation: <strong>Owner</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Email: {selectedItem.business?.email || '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Website: {selectedItem.business?.website || '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Selected Template: <strong>Default Premium Frame</strong></div>
                </div>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: activeMod.color, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><DollarSign size={16} /> Payment</h4>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000000' }}>
                    Status: <span style={{ color: selectedItem.card?.paymentStatus === 'PAID' ? '#10B981' : '#EF4444' }}>{selectedItem.card?.paymentStatus || 'UNPAID'}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Amount: {selectedItem.card?.paymentAmount ? `₹${selectedItem.card.paymentAmount}` : '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Method: {selectedItem.card?.paymentMethod || '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Ref: {selectedItem.card?.paymentReference || '—'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>Paid At: {formatDate(selectedItem.card?.paidAt)}</div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => handleEditPaymentInfo(selectedItem.card)}>
                      Edit Payment
                    </button>
                    {selectedItem.card?.paymentStatus === 'PAID' && (
                      <button className="btn btn-danger" style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }} onClick={() => handleMarkAsRefunded(selectedItem.card)}>
                        Mark Refunded
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tag encoding link */}
              {(selectedItem.card?.cardStatus === 'issued' || selectedItem.card?.cardStatus === 'delivered') && (
                <div style={{ background: 'rgba(20,184,166,0.06)', border: '1px dashed #14B8A6', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#14B8A6', fontSize: '0.95rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Settings size={16} /> Encode NFC Tag Panel
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                    Write this target URL to the physical NFC chip using an NFC encoder:
                  </p>
                  <code style={{ background: '#f3f4f6', padding: '6px 12px', display: 'block', borderRadius: '4px', border: '1px solid #e5e7eb', color: '#14B8A6' }}>
                    https://kings-tv.vercel.app/card/{selectedItem.card?.shortCode}
                  </code>
                </div>
              )}

              {/* Sequenced state workflow tracker */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000000' }}><Clock size={16} /> Order Status Timeline</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: selectedItem.card?.requestedAt ? '#10B981' : '#9ca3af', fontWeight: 700 }}>Requested</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatDate(selectedItem.card?.requestedAt)}</div>
                  </div>
                  <div style={{ color: '#9ca3af' }}>➔</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: selectedItem.card?.processingAt ? '#10B981' : '#9ca3af', fontWeight: 700 }}>Processing</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatDate(selectedItem.card?.processingAt)}</div>
                  </div>
                  <div style={{ color: '#9ca3af' }}>➔</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: selectedItem.card?.issuedAt ? '#3b82f6' : '#9ca3af', fontWeight: 700 }}>Issued</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatDate(selectedItem.card?.issuedAt)}</div>
                  </div>
                  <div style={{ color: '#9ca3af' }}>➔</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: selectedItem.card?.deliveredAt ? '#10B981' : '#9ca3af', fontWeight: 700 }}>Delivered</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatDate(selectedItem.card?.deliveredAt)}</div>
                  </div>
                </div>
              </div>

              {/* Audit Logs list */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#000000' }}>State Audit Log Records ({nfcLogs.length})</h4>
                <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#f9fafb', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#000000' }}>
                  {nfcLogs.length === 0 ? (
                    <div style={{ color: '#9ca3af', padding: '0.5rem' }}>No audit transitions logged.</div>
                  ) : (
                    nfcLogs.map(log => (
                      <div key={log.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Actor: <strong>{log.changedByEmail || 'system'}</strong> ({log.fromStatus} ➔ {log.toStatus} - {log.note})</span>
                        <span style={{ color: '#9ca3af' }}>{formatDate(log.changedAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Fulfill workflow */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {selectedItem.card?.cardStatus !== 'blocked' ? (
                    <button 
                      onClick={() => setShowBlockModal(true)}
                      className="btn btn-danger"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                    >
                      Block Card
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleNfcStatusTransition(selectedItem.card, 'unblocked')}
                      className="btn btn-success"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981' }}
                    >
                      Unblock Card
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {selectedItem.card?.paymentStatus !== 'PAID' && selectedItem.card?.cardStatus === 'requested' && (
                    <span style={{ color: '#F59E0B', fontSize: '0.85rem', alignSelf: 'center', fontWeight: 600 }}>
                      ⚠️ Warning: Payment unpaid
                    </span>
                  )}
                  {selectedItem.card?.cardStatus === 'requested' && (
                    <button 
                      onClick={() => handleNfcStatusTransition(selectedItem.card, 'processing')}
                      className="btn btn-primary"
                      style={{ background: '#F59E0B', color: 'white', border: 'none' }}
                    >
                      Start Processing Order
                    </button>
                  )}
                  {selectedItem.card?.cardStatus === 'processing' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleNfcStatusTransition(selectedItem.card, 'issued')}
                        className="btn btn-primary"
                        style={{ background: '#3B82F6', color: 'white', border: 'none' }}
                      >
                        Generate & Issue UID
                      </button>
                      <button 
                        onClick={() => setShowUndeliveredModal(true)}
                        className="btn btn-danger"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                      >
                        Mark Undelivered
                      </button>
                    </div>
                  )}
                  {selectedItem.card?.cardStatus === 'issued' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleNfcStatusTransition(selectedItem.card, 'delivered')}
                        className="btn btn-primary"
                        style={{ background: '#10B981', color: 'white', border: 'none' }}
                      >
                        Confirm Delivery
                      </button>
                      <button 
                        onClick={() => setShowUndeliveredModal(true)}
                        className="btn btn-danger"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                      >
                        Mark Undelivered
                      </button>
                    </div>
                  )}
                  {selectedItem.card?.cardStatus === 'delivered' && (
                    <button 
                      onClick={() => setShowUndeliveredModal(true)}
                      className="btn btn-danger"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444' }}
                    >
                      Mark Undelivered
                    </button>
                  )}
                  {selectedItem.card?.cardStatus === 'undelivered' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleNfcStatusTransition(selectedItem.card, 'processing', { note: 'Delivery retry initiated by administrator.' })}
                        className="btn btn-primary"
                        style={{ background: '#3B82F6', color: 'white', border: 'none' }}
                      >
                        Retry Delivery
                      </button>
                      <button 
                        onClick={() => {
                          const confirmCancel = window.confirm(
                            selectedItem.card?.paymentStatus === 'PAID' 
                              ? "Refund payment before cancelling request?" 
                              : "Are you sure you want to cancel this request?"
                          );
                          if (confirmCancel) {
                            if (selectedItem.card?.paymentStatus === 'PAID') {
                              handleMarkAsRefunded(selectedItem.card);
                            }
                            handleNfcStatusTransition(selectedItem.card, 'cancelled', { note: 'Request cancelled after delivery failure.' });
                          }
                        }}
                        className="btn btn-danger"
                        style={{ background: '#EF4444', color: 'white', border: 'none' }}
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. Jobs Applications Oversight Modal */}
      {activeTab === 'jobs' && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: activeMod.color, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Briefcase /> Applications Oversight: {selectedItem.jobTitle}
                </h2>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Viewing candidate list submitted from the public job board:
              </div>
              <div className="table-container">
                <table className="custom-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Phone</th>
                      <th>Experience</th>
                      <th>Match Score</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobApplications.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No job applications received yet.</td></tr>
                    ) : (
                      jobApplications.map(app => (
                        <tr key={app.applicationId}>
                          <td>
                            <strong>{app.applicantName}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.summary || 'No summary'}</div>
                          </td>
                          <td>{app.applicantPhone}</td>
                          <td>{app.experience} years</td>
                          <td>
                            <span className="badge badge-success" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                              85% Compatibility
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{formatDate(app.appliedAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D. Obituaries Approval Checklist & Contact Masking Modal */}
      {activeTab === 'obituaries' && selectedItem && !showRejectionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: activeMod.color, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Heart /> Obituary Notice Approval Queue
                </h2>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {selectedItem.photo ? (
                  <img src={selectedItem.photo} alt="Deceased" style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                ) : (
                  <div style={{ width: '100px', height: '120px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', color: 'var(--text-muted)' }}>No Photo</div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>In Loving Memory: {selectedItem.deceasedName}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    <span>Age: <strong>{selectedItem.age}</strong></span>
                    <span>Gender: <strong>{selectedItem.gender}</strong></span>
                    <span>Date of Passing: <strong>{selectedItem.dateOfPassing}</strong></span>
                    <span>Location: <strong>{selectedItem.location}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <strong>Biography:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>{selectedItem.biography}</p>
              </div>

              {/* Submitter and unmasking contact information */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', color: activeMod.color, marginBottom: '0.5rem' }}>Submitter Credentials</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span>Relationship: <strong>{selectedItem.posterRelationship}</strong></span>
                  
                  {/* Contact masking unmasking with audit reason */}
                  <span>
                    Contact Phone:{' '}
                    {isUnmasked ? (
                      <strong>{selectedItem.submitterContact || selectedItem.familyPhone}</strong>
                    ) : (
                      <>
                        <code style={{ color: 'var(--text-muted)' }}>*******{selectedItem.submitterContact ? selectedItem.submitterContact.slice(-4) : '—'}</code>
                        <button 
                          onClick={() => {
                            setUnmaskReason('');
                            setShowUnmaskModal(true);
                          }}
                          className="btn btn-secondary" 
                          style={{ padding: '2px 6px', fontSize: '0.7rem', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <Lock size={10} /> Unmask Contact
                        </button>
                      </>
                    )}
                  </span>
                </div>
                
                {/* Proof document */}
                {selectedItem.proofDocument && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verification Document:</div>
                    <a href={selectedItem.proofDocument} target="_blank" rel="noopener noreferrer" style={{ color: activeMod.color, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <FileText size={12} /> View Submitter Uploaded Proof Document
                    </a>
                  </div>
                )}
              </div>

              {/* Review Checklist */}
              <div style={{ border: '1px solid rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.04)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#8B5CF6', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} /> Verification Checklist
                </h4>
                <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                  <li>Confirm death certificate or demised proof document matches deceased details</li>
                  <li>Confirm phone number and relationship correspond to submitter details</li>
                  <li>Confirm funeral date is accurate and map location is marked correctly</li>
                </ul>
              </div>

              {/* Guestbook comment moderation */}
              {selectedItem.guestbook && selectedItem.guestbook.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Guestbook Comments Moderation ({selectedItem.guestbook.length})</h4>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                    {selectedItem.guestbook.map(msg => (
                      <div key={msg.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><strong>{msg.visitorName}</strong>: {msg.text}</span>
                        <button 
                          onClick={() => handleObitGuestbookMod(msg.id)}
                          className="btn btn-danger" 
                          style={{ padding: '2px 6px', fontSize: '0.7rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval controls */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button 
                  onClick={() => {
                    setRejectionReason('');
                    setShowRejectionModal(true);
                  }}
                  className="btn btn-danger"
                  style={{ background: '#EF4444', color: 'white', border: 'none' }}
                >
                  Reject & Deactivate
                </button>
                <button 
                  onClick={() => handleObituaryStatus(selectedItem.id, 'published')}
                  className="btn btn-primary"
                  style={{ background: '#10B981', color: 'white', border: 'none' }}
                >
                  Approve & Publish Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. Wishes Comments Moderation Modal */}
      {activeTab === 'wishes' && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => setSelectedItem(null)} 
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 style={{ color: activeMod.color, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Gift /> Wish Comment Moderation
                </h2>
              </div>
              <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <strong>Wish Post Content:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedItem.wishText}</p>
              </div>

              <h3>Comments ({selectedItem.comments?.length || 0})</h3>
              <div style={{ maxHeight: '250px', overflowY: 'auto', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                {!selectedItem.comments || selectedItem.comments.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>No comments posted on this wish.</div>
                ) : (
                  selectedItem.comments.map(c => (
                    <div key={c.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><strong>{c.commenterName}</strong>: {c.commentText}</span>
                      <button 
                        onClick={() => handleWishCommentMod(c.id)}
                        className="btn btn-danger" 
                        style={{ padding: '3px 8px', fontSize: '0.7rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444' }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* F. Template CRUD Modal (Used by Categories, Obituary Frames, and Wish templates) */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '550px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem' }}>
              <h3 style={{ margin: 0 }}>
                {editingTemplate ? 'Edit' : 'Add New'} {activeTab === 'directory' ? 'Business Category' : 'Frame Template'}
              </h3>
              <button 
                onClick={() => {
                  setShowTemplateModal(false);
                  setEditingTemplate(null);
                }} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={activeTab === 'directory' ? handleCategorySubmit : handleTemplateSubmit} style={{ padding: '1.5rem' }}>
              {/* Directory Category inputs */}
              {activeTab === 'directory' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category Name (English)</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control"
                      value={templateForm.name} 
                      onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category Name (Tamil)</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control"
                      value={templateForm.nameTa} 
                      onChange={e => setTemplateForm({ ...templateForm, nameTa: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Display Order</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={templateForm.displayOrder} 
                      onChange={e => setTemplateForm({ ...templateForm, displayOrder: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Icon CSS / Lucide Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={templateForm.icon} 
                      onChange={e => setTemplateForm({ ...templateForm, icon: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                </div>
              )}

              {/* Obituary frame inputs */}
              {activeTab === 'obituaries' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Template Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control"
                      value={templateForm.name} 
                      onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category (floral / premium / golden / etc)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={templateForm.category} 
                      onChange={e => setTemplateForm({ ...templateForm, category: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Frame Asset URL (.png frame image)</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control"
                      value={templateForm.assetUrl} 
                      onChange={e => setTemplateForm({ ...templateForm, assetUrl: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Thumbnail URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={templateForm.thumbnail} 
                      onChange={e => setTemplateForm({ ...templateForm, thumbnail: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Display Order</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={templateForm.displayOrder} 
                      onChange={e => setTemplateForm({ ...templateForm, displayOrder: parseInt(e.target.value) || 0 })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                </div>
              )}

              {/* Wish templates inputs */}
              {activeTab === 'wishes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Template Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control"
                      value={templateForm.name} 
                      onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Slug Code (Unique)</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control"
                      value={templateForm.slug} 
                      onChange={e => setTemplateForm({ ...templateForm, slug: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Background Pattern Image URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={templateForm.backgroundUrl} 
                      onChange={e => setTemplateForm({ ...templateForm, backgroundUrl: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Overlay Sticker URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={templateForm.overlayUrl} 
                      onChange={e => setTemplateForm({ ...templateForm, overlayUrl: e.target.value })} 
                      style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Border Color</label>
                      <input 
                        type="text" 
                        placeholder="#ffffff"
                        className="form-control"
                        value={templateForm.borderColor} 
                        onChange={e => setTemplateForm({ ...templateForm, borderColor: e.target.value })} 
                        style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Text Color</label>
                      <input 
                        type="text" 
                        placeholder="#000000"
                        className="form-control"
                        value={templateForm.textColor} 
                        onChange={e => setTemplateForm({ ...templateForm, textColor: e.target.value })} 
                        style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', marginTop: '4px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                  }} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: activeMod.color, border: 'none' }}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* G. Mandatory Rejection Reason Dialog Modal */}
      {showRejectionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#EF4444', marginBottom: '0.5rem' }}>
              <AlertCircle /> Mandatory Rejection Reason Required
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Provide the specific compliance or verification reason why this notice/listing is being rejected. This feedback will be logged.
            </p>
            <textarea 
              required
              className="form-control"
              style={{ width: '100%', minHeight: '80px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', padding: '8px', fontSize: '0.875rem' }}
              placeholder="e.g., Unofficial death certificate copy or incorrect phone number..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setShowRejectionModal(false)} className="btn btn-secondary">Cancel</button>
              <button 
                onClick={() => {
                  if (!rejectionReason.trim()) return;
                  if (activeTab === 'directory') {
                    handleKycStatus(selectedItem.id, 'rejected', rejectionReason);
                  } else if (activeTab === 'obituaries') {
                    handleObituaryStatus(selectedItem.id, 'rejected', rejectionReason);
                  }
                }} 
                disabled={!rejectionReason.trim()}
                className="btn btn-danger"
                style={{ background: '#EF4444', color: 'white', border: 'none' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* H. NFC Encode Card UID Modal */}
      {showCardUidModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <form onSubmit={handleNfcIssueSubmit} className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3B82F6', marginBottom: '0.5rem' }}>
              <Wifi /> Assign Card UID (Encode NFC Tag)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Assign a physical card UID or short-code for redirection before issuing.
            </p>
            <input 
              type="text"
              required
              className="form-control"
              style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', fontSize: '0.875rem' }}
              placeholder="e.g. CARD_94819"
              value={cardUidInput}
              onChange={e => setCardUidInput(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setShowCardUidModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: '#3B82F6', color: 'white', border: 'none' }}>
                Confirm Issue State
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NFC Extended workflow dialog modals */}
      {showUndeliveredModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <form onSubmit={submitUndelivered} className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#EF4444', marginBottom: '0.5rem' }}>
              <Flag /> Report Delivery Failure
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Reason for failure:</label>
              <select 
                value={undeliveredReason} 
                onChange={e => setUndeliveredReason(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px' }}
              >
                <option value="wrong address">Wrong Address / Returned to Sender</option>
                <option value="recipient unavailable">Recipient Unavailable / Delivery Unanswered</option>
                <option value="returned">Refused Delivery / Returned by Agent</option>
                <option value="other">Other reason (explain in note)</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Optional justification note:</label>
              <textarea 
                className="form-control"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', padding: '8px' }}
                rows={3}
                placeholder="Details of delivery attempt..."
                value={undeliveredNote}
                onChange={e => setUndeliveredNote(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowUndeliveredModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-danger" style={{ background: '#EF4444', color: 'white', border: 'none' }}>
                Confirm Failure
              </button>
            </div>
          </form>
        </div>
      )}

      {showBlockModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <form onSubmit={submitBlockCard} className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#EF4444', marginBottom: '0.5rem' }}>
              <Lock /> Block NFC Card
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Blocking this card disables the physical NFC card's redirect link. Please provide a reason:
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Block Reason:</label>
              <select 
                value={blockReason} 
                onChange={e => setBlockReason(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px' }}
              >
                <option value="">-- Select Reason --</option>
                <option value="abuse">Abuse / Terms of service violation</option>
                <option value="fraud">Fraudulent / Suspicious Activity</option>
                <option value="business closed">Business Closed / Listing Deleted</option>
                <option value="other">Other / Manual override</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowBlockModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-danger" style={{ background: '#EF4444', color: 'white', border: 'none' }} disabled={!blockReason}>
                Confirm Block
              </button>
            </div>
          </form>
        </div>
      )}

      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <form onSubmit={submitPaymentInfo} className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', marginBottom: '1rem' }}>
              <DollarSign /> Edit Card Payment Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Status:</label>
                <select 
                  value={paymentForm.paymentStatus} 
                  onChange={e => setPaymentForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                  className="form-control"
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px' }}
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Amount (₹):</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control"
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px' }}
                  value={paymentForm.paymentAmount}
                  onChange={e => setPaymentForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Payment Method:</label>
              <input 
                type="text" 
                placeholder="UPI, NetBanking, Card, COD..." 
                className="form-control"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px' }}
                value={paymentForm.paymentMethod}
                onChange={e => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Payment Reference / Gateway ID:</label>
              <input 
                type="text" 
                placeholder="txn_948190348" 
                className="form-control"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px' }}
                value={paymentForm.paymentReference}
                onChange={e => setPaymentForm(prev => ({ ...prev, paymentReference: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setShowPaymentModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ background: '#10B981', color: 'white', border: 'none' }}>
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* I. Masking Audit Reason Dialog Modal */}
      {showUnmaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ background: '#111827', width: '100%', maxWidth: '420px', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', marginBottom: '0.5rem' }}>
              <Lock /> Audit Reason Required
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              For privacy and security regulations, you must record a brief audit reason before unmasking the family contact details.
            </p>
            <input 
              type="text"
              required
              className="form-control"
              style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '6px', height: '36px', padding: '0 8px', fontSize: '0.875rem' }}
              placeholder="e.g., Calling family to verify obituary details..."
              value={unmaskReason}
              onChange={e => setUnmaskReason(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={() => setShowUnmaskModal(false)} className="btn btn-secondary">Cancel</button>
              <button 
                onClick={() => handleUnmaskContact(selectedItem.id)}
                disabled={!unmaskReason.trim()}
                className="btn btn-primary"
                style={{ background: '#F59E0B', color: 'white', border: 'none' }}
              >
                Log Reason & Unmask
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityModules;
