import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import './Wishes.css';

const Wishes = () => {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Data lists
  const [wishes, setWishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Selection / Filters
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [pincodeFilter, setPincodeFilter] = useState('');
  
  // Loading & Pagination
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [coords, setCoords] = useState(null);
  
  // Modals
  const [selectedWish, setSelectedWish] = useState(null);
  const [wishDetails, setWishDetails] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareWish, setShareWish] = useState(null);
  const [activeReactionWishId, setActiveReactionWishId] = useState(null);

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhoto, setRecipientPhoto] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderProfile, setSenderProfile] = useState('');
  const [relationship, setRelationship] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDistrict, setFormDistrict] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formTemplate, setFormTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorLogo, setSponsorLogo] = useState('');
  const [scheduledPublishAt, setScheduledPublishAt] = useState('');
  const [galleryUrls, setGalleryUrls] = useState([]);
  
  // Upload statuses
  const [uploadingRecipient, setUploadingRecipient] = useState(false);
  const [uploadingSender, setUploadingSender] = useState(false);
  const [uploadingSponsor, setUploadingSponsor] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Comment input
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyCommenterName, setReplyCommenterName] = useState('');

  // Persistent session ID for reactions
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('wish_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('wish_session_id', id);
    }
    return id;
  });

  // Fetch initial setup lists
  useEffect(() => {
    // Fetch categories
    fetchApi('/wishes/categories')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(fallbackCategories);
        }
      })
      .catch(() => setCategories(fallbackCategories));

    // Fetch districts
    fetchApi('/districts')
      .then(data => {
        if (Array.isArray(data)) setDistricts(data);
      })
      .catch(err => console.warn("Failed to load districts", err));

    // Fetch templates
    fetchApi('/wishes/templates')
      .then(data => {
        if (Array.isArray(data)) setTemplates(data);
      })
      .catch(err => console.warn("Failed to load templates", err));
  }, []);

  // Geolocation watch
  useEffect(() => {
    if (selectedSort === 'nearby') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords(position.coords);
          },
          (error) => {
            console.warn("Geolocation permission error", error);
            setSelectedSort('newest');
            alert(lang === 'en' ? "Please enable location services to use Nearby filter." : "அருகிலுள்ள வாழ்த்துகளைக் காண இருப்பிடச் சேவைகளை அனுமதிக்கவும்.");
          }
        );
      } else {
        setSelectedSort('newest');
      }
    }
  }, [selectedSort]);

  // Load Wishes main function
  const loadWishes = () => {
    setLoading(true);
    let endpoint = '/wishes';
    let params = [];

    if (searchQuery.trim() !== '') {
      endpoint = '/wishes/search';
      params.push(`query=${encodeURIComponent(searchQuery)}`);
    } else if (selectedSort === 'trending') {
      endpoint = '/wishes/trending';
    } else if (selectedSort === 'popular') {
      endpoint = '/wishes/popular';
    } else if (selectedSort === 'nearby' && coords) {
      endpoint = '/wishes/nearby';
      params.push(`lat=${coords.latitude}`);
      params.push(`lon=${coords.longitude}`);
      params.push(`radius=100.0`);
    } else {
      endpoint = '/wishes/filter';
      if (selectedCat !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCat);
        if (catObj) params.push(`categoryId=${catObj.id}`);
      }
      if (selectedDistrict !== 'all') {
        params.push(`districtId=${selectedDistrict}`);
      }
      if (pincodeFilter.trim() !== '') {
        params.push(`pincode=${encodeURIComponent(pincodeFilter)}`);
      }
      if (selectedSort !== 'newest') {
        params.push(`sort=${selectedSort}`);
      }
    }

    params.push(`page=${page}`);
    params.push(`size=${size}`);

    const queryString = params.length > 0 ? `?${params.join('&')}` : '';

    fetchApi(`${endpoint}${queryString}`)
      .then(data => {
        setWishes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to load wishes from backend", err);
        setWishes([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWishes();
  }, [selectedCat, selectedDistrict, selectedSort, searchQuery, pincodeFilter, page, coords]);

  // Open details
  const handleOpenDetails = (wish) => {
    setSelectedWish(wish);
    setCommentText('');
    setCommenterName('');
    setReplyingToCommentId(null);
    setReplyText('');
    setReplyCommenterName('');

    fetchApi(`/wishes/${wish.id}`)
      .then(data => {
        setWishDetails(data);
        // Log view
        fetchApi(`/wishes/${wish.id}/view`, { method: 'POST' }).catch(() => {});
      })
      .catch(() => {
        setWishDetails(wish);
      });
  };

  const handleCloseDetails = () => {
    setSelectedWish(null);
    setWishDetails(null);
    loadWishes();
  };

  // File Upload helper
  const uploadImage = async (e, setUploadState, setUrlState) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadState(true);
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = `${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'}/wishes/upload`;
    const session = JSON.parse(localStorage.getItem('king24x7_session') || 'null');
    const headers = {};
    if (session && session.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    }

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setUrlState(data.url);
    } catch (err) {
      console.error("File upload error", err);
      alert(lang === 'en' ? "Image upload failed. Please try again." : "படம் பதிவேற்றம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setUploadState(false);
    }
  };

  // Submit new greeting card
  const handleCreateWishSubmit = (e) => {
    e.preventDefault();
    if (!recipientName || !senderName || !message || !formCategory || !formDistrict) {
      alert(lang === 'en' ? "Please fill all required fields." : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்.");
      return;
    }

    const payload = {
      recipientName,
      recipientPhoto,
      senderName,
      senderProfile,
      relationship,
      categoryId: formCategory,
      districtId: formDistrict,
      pincode: formPincode,
      frameTemplateId: formTemplate || null,
      message,
      isSponsored,
      sponsorName,
      sponsorLogo,
      scheduledPublishAt: scheduledPublishAt || null,
      galleryUrls
    };

    fetchApi('/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        alert(lang === 'en' ? "Wish published successfully!" : "வாழ்த்து வெற்றிகரமாக வெளியிடப்பட்டது!");
        setShowCreateModal(false);
        // Reset states
        setRecipientName('');
        setRecipientPhoto('');
        setSenderName('');
        setSenderProfile('');
        setRelationship('');
        setFormCategory('');
        setFormDistrict('');
        setFormPincode('');
        setFormTemplate('');
        setMessage('');
        setIsSponsored(false);
        setSponsorName('');
        setSponsorLogo('');
        setScheduledPublishAt('');
        setGalleryUrls([]);
        loadWishes();
      })
      .catch(err => {
        console.error("Failed to create wish", err);
        alert(lang === 'en' ? "Failed to save wish. Please try again." : "வாழ்த்தைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
      });
  };

  // Reactions Logic
  const handleAddReaction = (wishId, reactionType) => {
    fetchApi(`/wishes/${wishId}/reaction?sessionId=${sessionId}&type=${reactionType}`, {
      method: 'POST'
    })
      .then(() => {
        setActiveReactionWishId(null);
        if (selectedWish && selectedWish.id === wishId) {
          fetchApi(`/wishes/${wishId}`).then(setWishDetails);
        } else {
          loadWishes();
        }
      })
      .catch(err => console.error("Failed to submit reaction", err));
  };

  // Comments submit
  const handleAddCommentSubmit = (e) => {
    e.preventDefault();
    if (!commenterName.trim() || !commentText.trim()) return;

    fetchApi(`/wishes/${selectedWish.id}/comment?commenterName=${encodeURIComponent(commenterName)}&text=${encodeURIComponent(commentText)}`, {
      method: 'POST'
    })
      .then(() => {
        setCommentText('');
        fetchApi(`/wishes/${selectedWish.id}`).then(setWishDetails);
      })
      .catch(err => console.error("Comment submission failed", err));
  };

  // Reply submit
  const handleAddReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!replyCommenterName.trim() || !replyText.trim()) return;

    fetchApi(`/wishes/${selectedWish.id}/comment?parentId=${parentId}&commenterName=${encodeURIComponent(replyCommenterName)}&text=${encodeURIComponent(replyText)}`, {
      method: 'POST'
    })
      .then(() => {
        setReplyText('');
        setReplyingToCommentId(null);
        fetchApi(`/wishes/${selectedWish.id}`).then(setWishDetails);
      })
      .catch(err => console.error("Reply submission failed", err));
  };

  // Translations and mappings
  const getCategoryLabel = (slug) => {
    const matched = categories.find(c => c.slug === slug);
    if (matched) return lang === 'en' ? matched.name : matched.nameTa;
    return slug;
  };

  const getGradient = (slug) => {
    const grads = {
      birthday: 'linear-gradient(135deg, #a5b4fc 0%, #fbcfe8 100%)',
      anniversary: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      wedding: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      newborn: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      festival: 'linear-gradient(135deg, #1e1b4b 0%, #311005 100%)',
      achievement: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      graduation: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      'house-warming': 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
      retirement: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
      general: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
    };
    return grads[slug] || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
  };

  const getCardEmojis = (slug) => {
    const emojis = {
      birthday: '🎈 🍰 🎂',
      anniversary: '🌹 💑 ✨',
      wedding: '💖 💍 💐',
      newborn: '👶 🍼 🧸',
      festival: '🪔 ✨ 🌟',
      achievement: '🏆 ⭐ 🎖️',
      graduation: '🎓 📜 ✨',
      'house-warming': '🏡 🔑 🌸',
      retirement: '🏖️ ☕ 🍃',
      general: '🎁 ✨ 💐'
    };
    return emojis[slug] || '✨';
  };

  const getCategoryIcon = (slug) => {
    const icons = {
      all: 'fa-th-large',
      birthday: 'fa-birthday-cake',
      anniversary: 'fa-heart',
      wedding: 'fa-ring',
      newborn: 'fa-baby',
      festival: 'fa-star',
      achievement: 'fa-trophy',
      retirement: 'fa-umbrella-beach',
      graduation: 'fa-graduation-cap',
      'house-warming': 'fa-home',
      general: 'fa-gift'
    };
    return icons[slug] || 'fa-smile';
  };

  // Emojis mapping
  const reactionEmojis = {
    LIKE: '👍',
    LOVE: '❤️',
    CELEBRATE: '🎉',
    CONGRATULATIONS: '👏',
    BLESSINGS: '🙏'
  };

  const fallbackCategories = [
    { id: 1, slug: 'birthday', name: 'Birthday', nameTa: 'பிறந்தநாள்', icon: 'fa-birthday-cake' },
    { id: 2, slug: 'anniversary', name: 'Anniversary', nameTa: 'திருமண ஆண்டு', icon: 'fa-heart' },
    { id: 3, slug: 'newborn', name: 'Newborn', nameTa: 'புதிய குழந்தை', icon: 'fa-baby' },
    { id: 4, slug: 'festival', name: 'Festival', nameTa: 'விழா வாழ்த்து', icon: 'fa-star' },
    { id: 5, slug: 'achievement', name: 'Achievement', nameTa: 'சாதனை', icon: 'fa-trophy' },
    { id: 6, slug: 'retirement', name: 'Retirement', nameTa: 'ஓய்வு பெறுதல்', icon: 'fa-umbrella-beach' },
    { id: 7, slug: 'graduation', name: 'Graduation', nameTa: 'படிப்பு சாதனை', icon: 'fa-graduation-cap' },
    { id: 8, slug: 'house-warming', name: 'House Warming', nameTa: 'வீடு புகுவிழா', icon: 'fa-home' },
    { id: 9, slug: 'general', name: 'General', nameTa: 'பொது வாழ்த்து', icon: 'fa-gift' }
  ];

  // Comment tree node renderer
  const renderCommentNode = (comment) => {
    const isReplying = replyingToCommentId === comment.id;

    return (
      <div className="comment-node" key={comment.id} style={{ marginLeft: comment.parent ? '16px' : '0', borderLeft: '1px solid #e2e8f0', paddingLeft: '12px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <strong style={{ fontSize: '12px', color: '#1e293b' }}>{comment.commenterName}</strong>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#475569' }}>{comment.comment}</p>
        <div style={{ display: 'flex', gap: '12px', fontSize: '10.5px', marginBottom: '6px' }}>
          <button
            onClick={() => setReplyingToCommentId(isReplying ? null : comment.id)}
            style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontWeight: '600' }}
          >
            {lang === 'en' ? 'Reply' : 'பதில்'}
          </button>
        </div>

        {isReplying && (
          <form onSubmit={(e) => handleAddReplySubmit(e, comment.id)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '6px 0', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
              value={replyCommenterName}
              onChange={(e) => setReplyCommenterName(e.target.value)}
              style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            />
            <textarea
              placeholder={lang === 'en' ? 'Write a reply...' : 'பதில் எழுதவும்...'}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="2"
              style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              required
            ></textarea>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="submit" style={{ fontSize: '11px', padding: '4px 8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {lang === 'en' ? 'Reply' : 'பதில் அளி'}
              </button>
              <button type="button" onClick={() => setReplyingToCommentId(null)} style={{ fontSize: '11px', padding: '4px 8px', background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                {lang === 'en' ? 'Cancel' : 'ரத்து'}
              </button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.map(reply => renderCommentNode(reply))}
      </div>
    );
  };

  const handleShareClick = (wish, platform) => {
    fetchApi(`/wishes/${wish.id}/share?platform=${platform}`, { method: 'POST' }).catch(() => {});
    
    const pageUrl = window.location.origin + `/wishes?id=${wish.id}`;
    const shareText = encodeURIComponent(`${lang === 'en' ? 'Check out this local greeting!' : 'இந்த உள்ளூர் வாழ்த்தைப் பாருங்கள்!'} - ${wish.recipientName}`);
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${shareText}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(pageUrl);
      alert(lang === 'en' ? 'Link copied to clipboard!' : 'இணைப்பு நகலெடுக்கப்பட்டது!');
    }
    setShowShareModal(false);
  };

  return (
    <main className="container wishes-module-container" style={{ paddingTop: '20px' }}>
      {/* Dynamic Header Breadcrumbs */}
      <div className="stories-header" style={{ marginBottom: '20px' }}>
        <div className="breadcrumbs" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lang === 'en' ? 'Home' : 'முகப்பு'}</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '9px', margin: '0 8px' }}></i>
          <span>{lang === 'en' ? 'Local Wishes' : 'ஊர் வாழ்த்துகள்'}</span>
        </div>
      </div>

      {/* HERO BANNER SECTION WITH COUNTER STATS BLOCK */}
      <section className="wishes-hero-banner">
        <div className="wishes-hero-content">
          <div className="wishes-hero-left">
            <h1>
              {lang === 'en' ? 'Wishes & Greetings' : 'வாழ்த்துகள் & நல்வாழ்த்துகள்'}
            </h1>
            <p>
              {lang === 'en'
                ? 'Share heartfelt wishes with your loved ones on special occasions.'
                : 'உங்கள் அன்பானவர்களுக்கு சிறப்பான தருணங்களில் மனமார்ந்த வாழ்த்துகளை பகிருங்கள்'}
            </p>
            <button className="wishes-hero-btn" onClick={() => {
              if (!isAuthenticated) {
                alert(lang === 'en' ? "Please login or sign up to send a greeting." : "வாழ்த்து அனுப்ப தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.");
                navigate('/login', { state: { from: '/wishes' } });
              } else {
                setShowCreateModal(true);
              }
            }}>
              <i className="fas fa-plus"></i>
              {lang === 'en' ? 'Send Greeting' : 'வாழ்த்து அனுப்புங்கள்'}
            </button>
          </div>

          <div className="wishes-hero-center">
            {/* Exactly aligned pink greeting child mockup card */}
            <div className="wishes-banner-mockup-card">
              <span className="mockup-decoration deco-balloon-1">🎈</span>
              <span className="mockup-decoration deco-balloon-2">🎈</span>
              <span className="mockup-decoration deco-gift">🎁</span>
              <span className="mockup-decoration deco-cake">🎂</span>
              
              <div className="mockup-avatar-frame">
                <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150" alt="child mockup portrait" />
              </div>
              <div className="mockup-card-text">
                {lang === 'en' ? 'Happy Birthday!' : 'பிறந்தநாள் வாழ்த்துகள்!'}
              </div>
            </div>
          </div>

          </div>
      </section>

      {/* FILTER CONTROLS BAR */}
      <div className="wishes-filter-bar">
        <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{lang === 'en' ? 'Recent Wishes' : 'சமீபத்திய வாழ்த்துகள்'}</h2>
      </div>

      {/* WISHES GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)' }}></i>
          <p style={{ marginTop: '10px' }}>{lang === 'en' ? 'Loading local greetings...' : 'வாழ்த்துக்கள் பதிவேற்றப்படுகின்றன...'}</p>
        </div>
      ) : wishes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px', border: '1px dashed #ccc' }}>
          <i className="far fa-frown" style={{ fontSize: '48px', color: '#aaa', marginBottom: '10px' }}></i>
          <p>{lang === 'en' ? 'No local greetings found matching your filters.' : 'உங்கள் வடிகட்டலுக்கு ஏற்ப வாழ்த்துக்கள் எதுவும் காணப்படவில்லை.'}</p>
        </div>
      ) : (
        <section className="wishes-grid">
          {wishes.map((wish) => {
            const isReactionPopoverOpen = activeReactionWishId === wish.id;
            const categorySlug = wish.category?.slug || 'general';
            return (
              <div className="wish-card-premium" key={wish.id}>
                {/* Dynamic greeting card cover visual */}
                <div 
                  className={`wish-card-visual-frame bg-variant-${categorySlug}`} 
                  onClick={() => handleOpenDetails(wish)}
                >
                  <span className="wish-card-badge">
                    {getCategoryLabel(categorySlug)}
                  </span>
                  
                  <div className="wish-card-visual-text">
                    <p className="wish-card-visual-message">
                      {wish.message}
                    </p>
                    <span className="wish-card-visual-recipient">
                      {getCardEmojis(categorySlug)} {wish.recipientName}
                    </span>
                  </div>
                  
                  <div className="wish-profiles-overlay">
                    <div className="wish-recipient-badge">
                      {wish.recipientPhoto ? (
                        <img src={wish.recipientPhoto} alt={wish.recipientName} className="wish-recipient-thumb" />
                      ) : (
                        <div className="wish-recipient-thumb" style={{ background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px' }}>
                          {wish.recipientName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Metric Row */}
                <div className="wish-card-footer-row">
                  <div className="sender-details-block">
                    {wish.senderProfile ? (
                      <img src={wish.senderProfile} alt={wish.senderName} className="sender-thumb-img" />
                    ) : (
                      <div className="sender-thumb-img" style={{ background: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                        {wish.senderName.charAt(0)}
                      </div>
                    )}
                    <span className="sender-name-lbl">{wish.senderName}</span>
                  </div>

                  <div className="wish-action-metrics">
                    <div className="wish-metric-group" onClick={() => setActiveReactionWishId(isReactionPopoverOpen ? null : wish.id)}>
                      <i className="fas fa-heart wish-heart-active"></i>
                      <span>{wish.reactionCount || 0}</span>
                    </div>
                    <div className="wish-metric-group" onClick={() => handleOpenDetails(wish)}>
                      <i className="far fa-comment"></i>
                      <span>{wish.commentCount || 0}</span>
                    </div>
                    <div className="wish-metric-group" onClick={() => { setShareWish(wish); setShowShareModal(true); }}>
                      <i className="fas fa-share-alt"></i>
                      <span>{wish.shareCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Reactions list */}
                {isReactionPopoverOpen && (
                  <div className="reaction-popover" onMouseLeave={() => setActiveReactionWishId(null)}>
                    {Object.entries(reactionEmojis).map(([type, emoji]) => (
                      <span
                        key={type}
                        className="reaction-popover-item"
                        onClick={() => handleAddReaction(wish.id, type)}
                        title={type}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}



      {/* GREETING MODAL */}
      {selectedWish && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '850px', width: '90%', padding: '0', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Greeting Details' : 'வாழ்த்து அட்டை விவரங்கள்'}</h3>
              <button className="modal-close" onClick={handleCloseDetails}>&times;</button>
            </div>
            
            <div className="modal-body" style={{ padding: '0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', overflowY: 'auto' }}>
              {/* Column 1: Greeting frame preview */}
              <div style={{ background: '#f8fafc', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #e2e8f0' }}>
                <div
                  className="greeting-preview-frame"
                  style={{
                    border: wishDetails?.frameTemplate ? `12px solid ${wishDetails.frameTemplate.borderColor}` : '10px solid #eab308',
                    color: '#fff',
                    background: getGradient(wishDetails?.category?.slug || 'general')
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 'bold', alignSelf: 'flex-start', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '3px 8px', borderRadius: '4px' }}>
                    {getCategoryLabel(wishDetails?.category?.slug)}
                  </span>
                  
                  <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    {wishDetails?.recipientPhoto ? (
                      <div className="greeting-preview-photo-frame">
                        <img src={wishDetails.recipientPhoto} alt="Recipient" className="greeting-preview-photo" />
                      </div>
                    ) : (
                      <div style={{ fontSize: '64px', margin: '20px 0' }}>🎂</div>
                    )}
                    <h2 style={{ fontSize: '20px', fontWeight: '800', marginTop: '12px', color: '#fff', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>{wishDetails?.recipientName}</h2>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b', padding: '16px', borderRadius: '12px', fontSize: '13.5px', lineHeight: '1.4', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    {wishDetails?.message}
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', marginTop: '10px', textAlign: 'right' }}>
                    ✍️ {lang === 'en' ? 'From: ' : 'வாழ்த்துபவர்: '} {wishDetails?.senderName}
                  </div>
                </div>
              </div>

              {/* Column 2: Comments & Actions */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i>
                      <span>
                        {wishDetails?.district ? (lang === 'en' ? wishDetails.district.nameEn : wishDetails.district.nameTa) : ''} 
                        {wishDetails?.pincode && ` - ${wishDetails.pincode}`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#475569' }}>
                      <span><i className="far fa-eye"></i> {wishDetails?.viewCount || 0} {lang === 'en' ? 'Views' : 'பார்வைகள்'}</span>
                      <span><i className="far fa-heart"></i> {wishDetails?.reactionCount || 0} {lang === 'en' ? 'Reactions' : 'வாழ்த்துகள்'}</span>
                    </div>
                  </div>

                  {/* Reaction buttons bar */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {Object.entries(reactionEmojis).map(([type, emoji]) => (
                      <button
                        key={type}
                        onClick={() => handleAddReaction(selectedWish.id, type)}
                        style={{ flex: 1, padding: '8px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}
                        title={type}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Comments lists */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b' }}>{lang === 'en' ? 'Conversations' : 'கருத்துரையாடல்'}</h4>
                    <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                      {wishDetails?.comments && wishDetails.comments.length > 0 ? (
                        wishDetails.comments.filter(c => !c.parent).map(comment => renderCommentNode(comment))
                      ) : (
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{lang === 'en' ? 'No comments yet. Write one below!' : 'முதல் கருத்துரையை இங்கு எழுதுங்கள்!'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit comment */}
                <form onSubmit={handleAddCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      required
                      style={{ fontSize: '12.5px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Write a comment...' : 'கருத்து எழுதவும்...'}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      style={{ fontSize: '12.5px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                  <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {lang === 'en' ? 'Submit Comment' : 'கருத்தை அனுப்பு'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE DIALOG */}
      {showShareModal && shareWish && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifycontent: 'center', zIndex: '1100' }}>
          <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Share Greeting' : 'வாழ்த்தைப் பகிர்க'}</h3>
              <button className="modal-close" onClick={() => { setShowShareModal(false); setShareWish(null); }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '16px 0' }}>
              <button onClick={() => handleShareClick(shareWish, 'whatsapp')} style={{ padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-whatsapp"></i> WhatsApp
              </button>
              <button onClick={() => handleShareClick(shareWish, 'facebook')} style={{ padding: '10px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
              <button onClick={() => handleShareClick(shareWish, 'twitter')} style={{ padding: '10px', background: '#1DA1F2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-twitter"></i> Twitter
              </button>
              <button onClick={() => handleShareClick(shareWish, 'telegram')} style={{ padding: '10px', background: '#0088cc', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-telegram-plane"></i> Telegram
              </button>
            </div>
            <button 
              onClick={() => handleShareClick(shareWish, 'copy')} 
              style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <i className="far fa-copy"></i> {lang === 'en' ? 'Copy Link' : 'நகலெடுக்க'}
            </button>
          </div>
        </div>
      )}

      {/* CREATE DIALOG */}
      {showCreateModal && (
        <div className="modal open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div className="modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{lang === 'en' ? 'Create New Wish' : 'புதிய வாழ்த்து உருவாக்கு'}</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '0' }}>
              <form onSubmit={handleCreateWishSubmit} className="space-y-4 text-left" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Recipient Name *' : 'வாழ்த்தைப் பெறுபவர் பெயர் *'}</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      placeholder="e.g. Priyan"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Recipient Photo' : 'வாழ்த்தைப் பெறுபவர் படம்'}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e, setUploadingRecipient, setRecipientPhoto)}
                      style={{ width: '100%', padding: '6px', fontSize: '12px' }}
                    />
                    {uploadingRecipient && <span style={{ fontSize: '11px', color: 'var(--primary)' }}>Uploading image...</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Sender Name *' : 'வாழ்த்துபவர் பெயர் *'}</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      placeholder="e.g. Friends Group"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Relationship' : 'உறவுமுறை'}</label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Friends, Brother"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Category *' : 'வகை *'}</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{lang === 'en' ? c.name : c.nameTa}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Border Frame Template' : 'வாழ்த்து அட்டை கட்டமைப்பு (Frame)'}</label>
                    <select
                      value={formTemplate}
                      onChange={(e) => setFormTemplate(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      <option value="">-- Choose Template --</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'District *' : 'மாவட்டம் *'}</label>
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    >
                      <option value="">-- Choose District --</option>
                      {districts.map(d => (
                        <option key={d.id} value={d.id}>{lang === 'en' ? d.nameEn : d.nameTa}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Pincode' : 'அஞ்சல் குறியீடு'}</label>
                    <input
                      type="text"
                      value={formPincode}
                      onChange={(e) => setFormPincode(e.target.value)}
                      placeholder="e.g. 637001"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 'bold' }}>{lang === 'en' ? 'Greeting Message *' : 'வாழ்த்துச் செய்தி *'}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows="3"
                    placeholder={lang === 'en' ? 'Write your warm message here...' : 'வாழ்த்து வரிகளை இங்கு எழுதவும்...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: 'black' }}
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                  {lang === 'en' ? 'Publish Wish' : 'வாழ்த்து அட்டையை வெளியிடு'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Wishes;
