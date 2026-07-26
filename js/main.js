document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ===== SECURE STORAGE UTILITY =====
  const Storage = {
    get(key, fallback) {
      try {
        const val = localStorage.getItem('king24x7_' + key);
        return val ? JSON.parse(val) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try {
        localStorage.setItem('king24x7_' + key, JSON.stringify(value));
        return true;
      } catch { return false; }
    },
    remove(key) {
      try { localStorage.removeItem('king24x7_' + key); } catch {}
    }
  };

  // ===== SANITIZE (XSS prevention) =====
  function sanitize(str) {
    const el = document.createElement('div');
    el.textContent = str;
    return el.textContent;
  }

  // ===== WHITELIST for allowed values =====
  const ALLOWED_COLORS = ['#B3732A','#0057FF','#DC2626','#059669','#7C3AED','#D97706','#EC4899','#06B6D4'];
  const ALLOWED_SIZES = ['small','medium','large'];
  const ALLOWED_WIDGET_WIDTHS = ['520','640','780'];
  const ALLOWED_SLIDE_SPEEDS = ['4','6','8','12'];
  const SECTION_IDS = [
    'news_ticker', 'hero', 'quick_access', 'latest_news', 'video_news', 
    'web_stories', 'trending_sidebar', 'weather', 'live_tv', 
    'business_case', 'crowd_reporter', 'news_digest',
    // Fallback legacy IDs to prevent crashes
    'agri', 'election', 'livetv', 'poll', 'digest', 'newsletter', 'district', 'business'
  ];

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : window.location.origin;

  function getMediaUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return API_BASE + url;
  }

  // ===== INTEGRATE HOME LAYOUT MANAGER WITH BACKEND =====
  async function syncHomepageLayout() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/public/layout/web`);
      if (!response.ok) return;
      const sections = await response.json();
      
      // Selectors mapping sectionKeys to HTML Elements in index.html
      const selectorMap = {
        'news_ticker': '.breaking-news',
        'hero': '#section-hero',
        'quick_access': '.quick-access',
        'latest_news': '.news-section',
        'video_news': '#section-video',
        'web_stories': '#section-stories',
        'trending_sidebar': '.trending-list',
        'weather': '.weather-widget',
        'live_tv': '.header-right .livetv-btn',
        'business_case': '.case-studies-widget',
        'crowd_reporter': '.crowd-reporter-widget',
        'news_digest': '#section-digest'
      };

      sections.forEach(sec => {
        const selector = selectorMap[sec.sectionKey];
        if (selector) {
          const el = document.querySelector(selector);
          if (el) {
            // Apply visibility toggled by Super Admin
            el.style.display = sec.isVisible ? '' : 'none';
          }
        }
      });

      // Implement display reordering based on displayOrder list
      const mainContainer = document.querySelector('.left-content-column');
      const sidebarContainer = document.querySelector('.trending-sidebar');
      
      if (mainContainer && sidebarContainer) {
        // Sort sections by displayOrder Ascending
        sections.sort((a, b) => a.displayOrder - b.displayOrder);
        
        sections.forEach(sec => {
          const selector = selectorMap[sec.sectionKey];
          if (selector) {
            const el = document.querySelector(selector);
            if (el) {
              // Append visible items in sorted order to their respective parent columns
              if (['latest_news', 'video_news', 'web_stories'].includes(sec.sectionKey)) {
                mainContainer.appendChild(el);
              } else if (['trending_sidebar', 'weather', 'business_case', 'crowd_reporter'].includes(sec.sectionKey)) {
                sidebarContainer.appendChild(el);
              }
            }
          }
        });
      }
    } catch (err) {
      console.warn("Failed to synchronize layout builder settings:", err);
    }
  }

  // ===== LOAD DYNAMIC NAV MENU FROM BACKEND CATEGORIES =====
  async function loadDynamicNavMenu() {
    var navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    try {
      var response = await fetch(`${API_BASE}/api/v1/categories/nav`);
      if (!response.ok) return;
      var categories = await response.json();
      if (!Array.isArray(categories) || categories.length === 0) return;

      // Build new nav HTML, always keep home as first item
      var html = '<li class="nav-item active" id="nav-home"><a href="index.html" class="nav-link">' +
        (document.documentElement.lang === 'ta' ? 'முகப்பு' : 'Home') + '</a></li>';

      categories.forEach(function(cat) {
        var displayName = cat.nameTa || cat.name || cat.slug;
        var slug = sanitize(cat.slug || '');
        var hasDropdown = cat.subcategories && cat.subcategories.length > 0;
        if (hasDropdown) {
          html += '<li class="nav-item has-dropdown">' +
            '<a href="category.html?cat=' + slug + '" class="nav-link">' + sanitize(displayName) + ' <i class="fas fa-chevron-down" style="font-size:0.7em"></i></a>' +
            '<ul class="dropdown-menu">';
          cat.subcategories.forEach(function(sub) {
            var subName = sub.nameTa || sub.name;
            var subSlug = sanitize(sub.slug || sub.id);
            html += '<li><a href="category.html?cat=' + slug + '&sub=' + subSlug + '" class="nav-link">' + sanitize(subName) + '</a></li>';
          });
          html += '</ul></li>';
        } else {
          html += '<li class="nav-item" id="nav-' + slug + '">' +
            '<a href="category.html?cat=' + slug + '" class="nav-link">' + sanitize(displayName) + '</a></li>';
        }
      });

      navMenu.innerHTML = html;
    } catch (err) {
      console.warn("Failed to load dynamic nav menu:", err);
    }
  }

  // ===== UPDATE THEME TOGGLE TEXT FOR LOCALIZATION =====
  function updateThemeToggleText() {
    const dt = document.getElementById('darkToggle');
    if (!dt) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const lang = Storage.get('lang', 'en');
    if (lang === 'en') {
      dt.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i> Light' : '<i class="fas fa-moon"></i> Dark';
    } else {
      dt.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i> ஒளி' : '<i class="fas fa-moon"></i> இருள்';
    }
  }

  // ===== UPDATE FAVICON DYNAMICALLY =====
  function updateFavicon(theme) {
    var fav = document.getElementById('favicon');
    if (!fav) {
      fav = document.createElement('link');
      fav.id = 'favicon';
      fav.rel = 'icon';
      fav.type = 'image/png';
      document.head.appendChild(fav);
    }
    fav.href = theme === 'dark' ? 'assets/icons/favicon-dark.png' : 'assets/icons/favicon-light.png';
  }

  // ===== APPLY CUSTOMIZATION =====
  function applyCustomization(opts) {
    const o = opts || {};
    // Theme
    const theme = o.theme;
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
      updateThemeToggleText();
      updateFavicon(theme);
      const cb = document.getElementById('ctrlDarkMode');
      if (cb) cb.checked = theme === 'dark';
    }
    // Primary color (whitelist validated)
    const color = o.primaryColor;
    if (color && ALLOWED_COLORS.includes(color.toLowerCase())) {
      document.documentElement.style.setProperty('--primary', color);
      document.documentElement.style.setProperty('--primary-dark', color + 'CC');
      document.documentElement.style.setProperty('--primary-light', color + '1A');
      document.querySelectorAll('.color-swatch').forEach(function(s) {
        s.classList.toggle('active', s.dataset.color === color);
      });
    }
    // Font size
    const size = o.fontSize;
    if (size && ALLOWED_SIZES.includes(size)) {
      const sizes = { small: '14px', medium: '16px', large: '18px' };
      document.body.style.fontSize = sizes[size];
      document.querySelectorAll('.font-size-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.size === size);
      });
    }
    // Widget width (whitelist validated)
    const ww = o.widgetWidth;
    if (ww && ALLOWED_WIDGET_WIDTHS.includes(String(ww))) {
      const el = document.querySelector('.right-widgets');
      if (el) el.style.maxWidth = ww + 'px';
      const sel = document.getElementById('ctrlWidgetWidth');
      if (sel) sel.value = String(ww);
    }
    // Slide speed (whitelist validated)
    const ss = o.slideSpeed;
    if (ss && ALLOWED_SLIDE_SPEEDS.includes(String(ss))) {
      if (window._widgetInterval) clearInterval(window._widgetInterval);
      window._widgetInterval = setInterval(function() {
        var cur = window._currentSlide || 0;
        var dots = document.querySelectorAll('.widget-dot');
        cur = (cur + 1) % dots.length;
        window._currentSlide = cur;
        var sl = document.getElementById('widgetSlider');
        if (sl) sl.style.transform = 'translateX(-' + (cur * 100) + '%)';
        dots.forEach(function(d, i) { d.classList.toggle('active', i === cur); });
      }, parseInt(ss) * 1000);
      var sel2 = document.getElementById('ctrlSlideSpeed');
      if (sel2) sel2.value = String(ss);
    }
    // Section visibility
    SECTION_IDS.forEach(function(id) {
      var cb = document.querySelector('input[type="checkbox"][data-section="' + id + '"]');
      var section = document.getElementById('section-' + id);
      var visible = true;
      if (o.sections && o.sections[id] !== undefined) visible = o.sections[id];
      if (section) section.style.display = visible ? '' : 'none';
      if (cb) cb.checked = visible;
    });
  }

  // ===== RESET TO DEFAULTS =====
  function resetCustomization() {
    Storage.remove('all');
    document.documentElement.removeAttribute('data-theme');
    updateFavicon('light');
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--primary-dark');
    document.documentElement.style.removeProperty('--primary-light');
    document.body.style.fontSize = '';
    var rw = document.querySelector('.right-widgets');
    if (rw) rw.style.maxWidth = '';
    if (window._widgetInterval) { clearInterval(window._widgetInterval); window._widgetInterval = null; }
    // Reset section visibility
    SECTION_IDS.forEach(function(id) {
      var section = document.getElementById('section-' + id);
      if (section) section.style.display = '';
    });
    // Reset UI controls
    document.querySelectorAll('.color-swatch').forEach(function(s) {
      s.classList.toggle('active', s.dataset.color === '#0057FF');
    });
    document.querySelectorAll('.font-size-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.size === 'medium');
    });
    var ww = document.getElementById('ctrlWidgetWidth');
    if (ww) ww.value = '640';
    var ss = document.getElementById('ctrlSlideSpeed');
    if (ss) ss.value = '8';
    document.querySelectorAll('.section-visibility input[type="checkbox"]').forEach(function(c) { c.checked = true; });
    document.getElementById('ctrlDarkMode').checked = false;
    updateThemeToggleText();
    // Re-init widget slider
    initWidgetSlider();
  }

  // ===== SAVE CUSTOMIZATION =====
  function saveCustomization() {
    var opts = {};
    // Theme
    var cbDark = document.getElementById('ctrlDarkMode');
    if (cbDark) opts.theme = cbDark.checked ? 'dark' : 'light';
    // Color
    var activeColor = document.querySelector('.color-swatch.active');
    if (activeColor) opts.primaryColor = activeColor.dataset.color;
    // Font size
    var activeSize = document.querySelector('.font-size-btn.active');
    if (activeSize) opts.fontSize = activeSize.dataset.size;
    // Widget width
    var wwSel = document.getElementById('ctrlWidgetWidth');
    if (wwSel) opts.widgetWidth = parseInt(wwSel.value);
    // Slide speed
    var ssSel = document.getElementById('ctrlSlideSpeed');
    if (ssSel) opts.slideSpeed = parseInt(ssSel.value);
    // Section visibility
    opts.sections = {};
    SECTION_IDS.forEach(function(id) {
      var cb = document.querySelector('input[type="checkbox"][data-section="' + id + '"]');
      opts.sections[id] = cb ? cb.checked : true;
    });
    Storage.set('all', opts);
    applyCustomization(opts);
  }

  // ===== LOAD SAVED CUSTOMIZATION =====
  function loadCustomization() {
    var saved = Storage.get('all', null);
    if (saved) applyCustomization(saved);
  }

  // ===== INIT WIDGET SLIDER =====
  function initWidgetSlider() {
    var slider = document.getElementById('widgetSlider');
    var dots = document.querySelectorAll('.widget-dot');
    if (!dots.length) return;
    window._currentSlide = 0;
    function goToSlide(idx) {
      if (!slider) return;
      var total = dots.length;
      window._currentSlide = (idx + total) % total;
      slider.style.transform = 'translateX(-' + (window._currentSlide * 100) + '%)';
      dots.forEach(function(d, i) { d.classList.toggle('active', i === window._currentSlide); });
    }
    dots.forEach(function(d) {
      d.addEventListener('click', function() { goToSlide(parseInt(this.dataset.index)); });
    });
    if (window._widgetInterval) clearInterval(window._widgetInterval);
    var saved = Storage.get('all', null);
    var speed = (saved && saved.slideSpeed) ? parseInt(saved.slideSpeed) : 8;
    window._widgetInterval = setInterval(function() { goToSlide(window._currentSlide + 1); }, speed * 1000);
  }

  // ===== DARK MODE =====
  var darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeToggleText();
      updateFavicon(newTheme);
      var cb = document.getElementById('ctrlDarkMode');
      if (cb) cb.checked = !isDark;
      var saved = Storage.get('all', {});
      saved.theme = newTheme;
      Storage.set('all', saved);
    });
  }

  // ===== DATE & TIME CLOCK (MULTILINGUAL) =====
  function updateTamilDateTime() {
    var now = new Date();
    var lang = Storage.get('lang', 'ta');
    if (lang === 'en') {
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var el = document.getElementById('tamilDate');
      if (el) el.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
      var timeEl = document.getElementById('currentTime');
      if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
    } else {
      var days = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி'];
      var months = ['ஜனவரி','பிப்ரவரி','மார்ச்','ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்'];
      var el = document.getElementById('tamilDate');
      if (el) el.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
      var timeEl = document.getElementById('currentTime');
      if (timeEl) timeEl.textContent = now.toLocaleTimeString('ta-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
    }
  }
  updateTamilDateTime();
  setInterval(updateTamilDateTime, 1000);

  // ===== CUSTOMIZATION PANEL =====
  var customizeToggle = document.getElementById('customizeToggle');
  var customizePanel = document.getElementById('customizePanel');
  var closePanel = document.getElementById('closePanel');
  var panelBackdrop = document.getElementById('panelBackdrop');
  if (customizeToggle && customizePanel) {
    customizeToggle.addEventListener('click', function() {
      customizePanel.classList.toggle('open');
      customizeToggle.classList.toggle('open');
      if (panelBackdrop) panelBackdrop.classList.toggle('show');
    });
  }
  if (closePanel) {
    closePanel.addEventListener('click', function() {
      customizePanel.classList.remove('open');
      customizeToggle.classList.remove('open');
      if (panelBackdrop) panelBackdrop.classList.remove('show');
    });
  }
  if (panelBackdrop) {
    panelBackdrop.addEventListener('click', function() {
      customizePanel.classList.remove('open');
      customizeToggle.classList.remove('open');
      panelBackdrop.classList.remove('show');
    });
  }

  // ===== COLOR SWATCH SELECTOR =====
  document.querySelectorAll('.color-swatch').forEach(function(s) {
    s.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      document.querySelectorAll('.color-swatch').forEach(function(x) { x.classList.remove('active'); });
      this.classList.add('active');
    });
    // Custom color input
    var input = s.querySelector('input[type="color"]');
    if (input) {
      input.addEventListener('input', function() {
        var val = this.value;
        if (ALLOWED_COLORS.includes(val.toLowerCase())) {
          s.dataset.color = val;
          s.style.background = val;
          document.querySelectorAll('.color-swatch').forEach(function(x) { x.classList.remove('active'); });
          s.classList.add('active');
        }
      });
    }
  });

  // ===== FONT SIZE SELECTOR =====
  document.querySelectorAll('.font-size-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      document.querySelectorAll('.font-size-btn').forEach(function(x) { x.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // ===== APPLY / RESET BUTTONS =====
  var applyBtn = document.getElementById('applyCustomize');
  if (applyBtn) applyBtn.addEventListener('click', function() { saveCustomization(); });
  var resetBtn = document.getElementById('resetCustomize');
  if (resetBtn) resetBtn.addEventListener('click', function() { resetCustomization(); });

  // ===== BREAKING NEWS CONTROLS =====
  var breakTrack = document.getElementById('breakTrack');
  var breakPrev = document.getElementById('breakPrev');
  var breakNext = document.getElementById('breakNext');
  if (breakPrev && breakTrack) {
    breakPrev.addEventListener('click', function() {
      breakTrack.style.animation = 'none';
      void breakTrack.offsetHeight;
      breakTrack.style.animation = 'scroll-left 40s linear infinite';
    });
  }
  if (breakNext && breakTrack) {
    breakNext.addEventListener('click', function() {
      breakTrack.style.animation = 'none';
      void breakTrack.offsetHeight;
      breakTrack.style.animation = 'scroll-left 40s linear infinite';
    });
  }

  // ===== MOBILE MENU =====
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var navMenu = document.getElementById('navMenu');
  var mobileOverlay = document.getElementById('mobileOverlay');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('show');
    });
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function() {
      navMenu.classList.remove('open');
      mobileOverlay.classList.remove('show');
    });
  }

  // ===== RIVER WATER LEVEL SLIDESHOW =====
  var riverSlides = document.querySelectorAll('.river-slide');
  var riverNavBtns = document.querySelectorAll('.river-nav-btn');
  var currentRiver = 0;
  function showRiver(idx) {
    riverSlides.forEach(function(s) { s.classList.remove('active'); });
    riverNavBtns.forEach(function(b) { b.classList.remove('active'); });
    currentRiver = (idx + riverSlides.length) % riverSlides.length;
    if (riverSlides[currentRiver]) riverSlides[currentRiver].classList.add('active');
    if (riverNavBtns[currentRiver]) riverNavBtns[currentRiver].classList.add('active');
  }
  riverNavBtns.forEach(function(b) {
    b.addEventListener('click', function() { showRiver(parseInt(this.dataset.river)); });
  });
  if (riverSlides.length > 0) setInterval(function() { showRiver(currentRiver + 1); }, 10000);

  // ===== BACK TO TOP =====
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() { backToTop.classList.toggle('show', window.scrollY > 400); });
    backToTop.addEventListener('click', function() { window.scrollTo({ top:0, behavior:'smooth' }); });
  }

  // ===== STICKY NAVIGATION =====
  var mainNav = document.getElementById('mainNav');
  var navTop = mainNav ? mainNav.offsetTop : 0;
  window.addEventListener('resize', function() { if (mainNav) navTop = mainNav.offsetTop; });
  window.addEventListener('scroll', function() {
    if (!mainNav) return;
    if (window.scrollY > navTop) {
      mainNav.style.position = 'fixed';
      mainNav.style.top = '0';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.zIndex = '999';
      document.body.style.paddingTop = mainNav.offsetHeight + 'px';
    } else {
      mainNav.style.position = 'sticky';
      document.body.style.paddingTop = '0';
    }
  });

  // ===== DISTRICT NEWS SELECTOR =====
  function filterDistrict(district) {
    var sectionDistrict = document.getElementById('section-district');
    if (sectionDistrict) {
      var cards = sectionDistrict.querySelectorAll('.news-card');
      var hasVisible = false;
      cards.forEach(function(c) {
        var title = c.querySelector('h3');
        if (!title) return;
        var match = title.textContent.indexOf(district) === 0;
        c.style.display = match ? '' : 'none';
        if (match) hasVisible = true;
      });
      var noResult = document.getElementById('districtNoResult');
      if (!hasVisible) {
        if (!noResult) {
          noResult = document.createElement('div');
          noResult.id = 'districtNoResult';
          noResult.style.cssText = 'grid-column:1/-1;text-align:center;padding:30px;color:var(--text-muted);font-size:14px';
          noResult.textContent = 'இந்த மாவட்டத்திற்கான செய்திகள் இல்லை';
          var grid = sectionDistrict.querySelector('.news-grid');
          if (grid) grid.appendChild(noResult);
        }
        if (noResult) noResult.style.display = '';
      } else if (noResult) {
        noResult.style.display = 'none';
      }
    }
    // Sync both controls
    var topSel = document.getElementById('districtSelector');
    if (topSel) topSel.value = district;
    document.querySelectorAll('.district-btn').forEach(function(b) {
      b.classList.toggle('active', b.textContent.trim() === district);
    });
  }

  // Top bar district dropdown
  var topDistrictSel = document.getElementById('districtSelector');
  if (topDistrictSel) {
    topDistrictSel.addEventListener('change', function() {
      filterDistrict(this.value);
    });
  }

  // District section buttons
  document.querySelectorAll('.district-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      filterDistrict(this.textContent.trim());
    });
  });

  // ===== VIDEO CATEGORIES =====
  document.querySelectorAll('.video-cat-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      document.querySelectorAll('.video-cat-btn').forEach(function(x) { x.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // ===== POLL SUBMIT =====
  var pollForm = document.getElementById('pollForm');
  if (pollForm) {
    pollForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var selected = this.querySelector('input[name="poll"]:checked');
      if (!selected) return alert('தயவுசெய்து ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்');
      alert('உங்கள் வாக்கு பதிவு செய்யப்பட்டது! நன்றி.');
      this.querySelectorAll('.poll-bar-fill').forEach(function(b) {
        b.style.width = Math.floor(Math.random() * 40 + 20) + '%';
      });
    });
  }

  // ===== NEWSLETTER =====
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = this.querySelector('input');
      if (!input.value.trim()) return alert('தயவுசெய்து மின்னஞ்சல் முகவரியை உள்ளிடவும்');
      alert('வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
      input.value = '';
    });
  }

  // ===== LAZY LOADING =====
  if ('IntersectionObserver' in window) {
    var lazyImages = document.querySelectorAll('img[data-src]');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function(img) { observer.observe(img); });
  }

  // ===== SKELETON LOADING =====
  var newsGrid = document.querySelector('.news-grid');
  if (newsGrid && !newsGrid.querySelector('.news-card')) {
    var html = '';
    for (var i = 0; i < 6; i++) {
      html += '<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton-body"><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div></div></div>';
    }
    newsGrid.innerHTML = html;
    setTimeout(function() { }, 1000);
  }

  // ===== INFINITE SCROLL =====
  var loading = false;
  window.addEventListener('scroll', function() {
    if (loading) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
      loading = true;
      var loader = document.getElementById('loadMore');
      if (loader) loader.style.display = 'flex';
      setTimeout(function() {
        if (loader) loader.style.display = 'none';
        loading = false;
      }, 2000);
    }
  });

  // ===== WEATHER =====
  var weatherTemp = document.getElementById('weatherTemp');
  if (weatherTemp) weatherTemp.textContent = Math.floor(Math.random() * 10 + 28) + '°C';
  var topTemp = document.getElementById('topTemp');
  if (topTemp) {
    var temps = ['30°C','31°C','32°C','33°C','29°C'];
    setInterval(function() { topTemp.textContent = temps[Math.floor(Math.random() * temps.length)]; }, 30000);
  }

  // ===== STOCK TICKER =====
  var stockTicker = document.getElementById('stockTicker');
  if (stockTicker) {
    var stockScroll = 0;
    setInterval(function() {
      stockScroll += 1;
      if (stockScroll > stockTicker.scrollWidth / 2) stockScroll = 0;
      stockTicker.style.transform = 'translateX(-' + stockScroll + 'px)';
    }, 50);
  }

  // ===== GOLD RATES REFRESH =====
  var goldRates = document.getElementById('goldRates');
  if (goldRates) {
    setInterval(function() {
      var change = Math.floor(Math.random() * 20 - 10);
      goldRates.innerHTML = '<div class="price-row"><span class="label">22K:</span><span class="value up">₹' + (8950 + change).toLocaleString() + '/g</span></div><div class="price-row"><span class="label">24K:</span><span class="value up">₹' + (9760 + change).toLocaleString() + '/g</span></div><div class="price-row"><span class="label">வெள்ளி:</span><span class="value">₹118/g</span></div>';
    }, 3600000);
  }

  // ===== SEARCH =====
  var searchToggle = document.getElementById('searchToggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', function() {
      var q = prompt('தேடல் வார்த்தையை உள்ளிடவும்...');
      if (q && q.trim()) alert('தேடல் முடிவுகள்: ' + sanitize(q.trim()));
    });
  }

  // ===== TRANSLATION SYSTEM =====
  const translationMap = {
    // Navigation & Categories
    "முகப்பு": "Home",
    "அரசியல்": "Politics",
    "வணிகம்": "Business",
    "விளையாட்டு": "Sports",
    "பொழுதுபோக்கு": "Entertainment",
    "தொழில்நுட்பம்": "Technology",
    "மாநிலம்": "State",
    "சர்வதேசம்": "International",
    "வீдео": "Video",
    "வெப் ஸ்டோரிஸ்": "Web Stories",
    "நம்ம ஊர்": "Regional",
    "செய்திகள்": "News",
    "வாழ்த்து": "Wishes",
    "இரங்கல்": "Obituaries",
    "வேலை": "Jobs",
    "தள்ளுபடி": "Classifieds",

    // Branding
    "தமிழ் நியூஸ்": "Tamil News",
    "உண்மை. பொறுப்புடன். தமிழ்.": "Truth. Responsibility. Tamil.",
    "உண்மை. புரிதல். தமிழில்.": "Truth. Understanding. Tamil.",
    "LIVE TV WATCH NOW": "LIVE TV WATCH NOW",
    "LIVE • TRUE • TAMIL": "LIVE • TRUE • TAMIL",

    // New additions for full translation support
    "சமீபத்திய செய்திகள்": "Latest News",
    "அனைத்தும் காண": "View All",
    "வீдео செய்திகள்": "Video News",
    "மேலும் வீடியோக்கள்": "More Videos",
    "செய்தiமடல் சந்தா": "Newsletter Subscription",
    "செய்திமடல் சந்தா": "Newsletter Subscription",
    "முக்கிய செய்திகள் உங்கள் இமெயிலில் பெறுங்கள்": "Get key news in your email",
    "உங்கள் இமெயில் முகவரி": "Your email address",
    "சந்தா சேர்க்கவும்": "Subscribe",
    "நாங்கள் உங்களை spam செய்யமாட்டோம்.": "We will not spam you.",
    "வணிகக் கேஸ் ஸ்டடிஸ்": "Business Case Studies",
    "அனைத்தையும் பார்க்க": "View All",
    "மக்கள் செய்தியாளர்": "Crowd Reporter",
    "உங்கள் பகுதியில் நடக்கும் நிகழ்வுகளை எங்களோடு பகிர்ந்து கொள்ளுங்கள்! உங்கள் குரல் நாடாகட்டும்.": "Share events happening in your area with us! Let your voice represent the nation.",
    "செய்தி அனுப்பவும்": "Send News",
    "தமிழ் செய்தி சுருக்கம் (இதர ஊடகங்கள்)": "Tamil News Digest (Other Media)",
    "தினமலர்": "Dinamalar",
    "தினத்தந்தி": "Dina Thanthi",
    "புதியதலைமுறை": "Puthiya Thalaimurai",
    "ஒன்இந்தியா": "Oneindia",
    "News18 தமிழ்": "News18 Tamil",
    "விவசாயம்": "Agriculture",
    "விளக்கங்கள்": "Explanations",
    "அனைத்தும்": "All",
    "1 மணி நேரம்": "1 hour ago",
    "2 மணி நேரம்": "2 hours ago",
    "3 மணி நேரம்": "3 hours ago",
    "4 மணி நேரம்": "4 hours ago",
    "5 மணி நேரம்": "5 hours ago",
    "6 மணி நேரம்": "6 hours ago",
    "3 நிமிட வாசிப்பு": "3 min read",
    "4 நிமிட வாசிப்பு": "4 min read",
    "2 நிமிட வாசிப்பு": "2 min read",
    "பார்வைகள்": "views",
    "45K பார்வைகள்": "45K views",
    "18.2K பார்வைகள்": "18.2K views",
    "8.5K பார்வைகள்": "8.5K views",
    "12.1K பார்வைகள்": "12.1K views",
    "PDF": "PDF",

    // Latest News titles & text
    "   தமிழக சட்டப்பேரவையில் புதிய மசோதா தாக்கல் - எதிர்க்கட்சிகள் எதிர்ப்பு": "New Bill Introduced in TN Assembly - Opposition Protests",
    "தமிழக சட்டப்பேரவையில் புதிய மசோதா தாக்கல் - எதிர்க்கட்சிகள் எதிர்ப்பு": "New Bill Introduced in TN Assembly - Opposition Protests",
    "சட்டப்பேரவையில் இன்று தாக்கல் செய்யப்பட்ட புதிய மசோதாவுக்கு எதிர்க்கட்சிகள் கடும் எதிர்ப்பு தெரிவித்துள்ளனர். இந்த மசோதா மக்கள் நலனுக்கு பாதகமானது என கூறியுள்ளனர்.": "Opposition has strongly protested against the new bill introduced in the assembly today, claiming it is against public interest.",
    "சட்டப்பேரவையில் இன்று தாக்கல் செய்யப்பட்ட புதிய மசோதாவுக்கு எதிர்க்கட்சிகள் கடும் எதிர்ப்பு\n                தெரிவித்துள்ளனர். இந்த மசோதா மக்கள் நலனுக்கு பாதகமானது என கூறியுள்ளனர்.": "Opposition has strongly protested against the new bill introduced in the assembly today, claiming it is against public interest.",
    "இந்திய கிரிக்கெட் அணி ஆஸ்திரேலியாவை வீழ்த்தியது - 3-0 அபாரம்": "Indian Cricket Team Beats Australia - Spectacular 3-0",
    "ஆஸ்திரேலியாவுக்கு எதிரான டி20 தொடரை 3-0 என்ற கணக்கில் இந்திய அணி முழுமையாக வென்றது. விராட் கோலி அபார\n                ஆட்டம்.": "India won the T20 series against Australia 3-0. Virat Kohli's spectacular performance.",
    "ஆஸ்திரேலியாவுக்கு எதிரான டி20 தொடரை 3-0 என்ற கணக்கில் இந்திய அணி முழுமையாக வென்றது. விராட் கோலி அபார ஆட்டம்.": "India won the T20 series against Australia 3-0. Virat Kohli's spectacular performance.",
    "பங்குச் சந்தை புதிய உச்சம் - முதலீட்டாளர்களுக்கு வார இறுதி பரிசு": "Stock Market New Peak - Weekend Gift for Investors",
    "சென்செக்ஸ் 82,000 புள்ளிகளை தாண்டி புதிய சாதனை படைத்தது. ஐடி, பேங்கிங் பங்குகள் முன்னணி.": "Sensex set a new record by crossing 82,000 points. IT, banking stocks lead.",
    "செயற்கை நுண்ணறிவில் தமிழக இளைஞர்கள் சாதனை - சர்வதேச அங்கீகாரம்": "Tamil Youth Achieve in Artificial Intelligence - International Recognition",
    "தளபதி விஜய்யின் அடுத்த படம் குறித்த முக்கிய அறிவிப்பு வெளியானது": "Major Announcement Released Regarding Thalapathy Vijay's Next Movie",
    "இயக்குனர் வெங்கட் பிரபு இயக்கத்தில் விஜய் நடிக்கும் 69-வது படம் குறித்த அதிகாரப்பூர்வ தகவல்\n                வெளியாகியுள்ளது.": "Official information has been released regarding Vijay's 69th film, directed by Venkat Prabhu.",
    "இயக்குனர் வெங்கட் பிரபு இயக்கத்தில் விஜய் நடிக்கும் 69-வது படம் குறித்த அதிகாரப்பூர்வ தகவல் வெளியாகியுள்ளது.": "Official information has been released regarding Vijay's 69th film, directed by Venkat Prabhu.",
    "நெல் கொள்முதல் விலை உயர்வு - விவசாயிகள் சங்கம் வரவேற்பு": "Paddy Procurement Price Hike - Farmers Association Welcomes",
    "நெல்லுக்கான குறைந்தபட்ச ஆதரவு விலையை மத்திய அரசு உயர்த்தியுள்ள நிலையில் விவசாயிகள் மகிழ்ச்சி\n                தெரிவித்துள்ளனர்.": "Farmers expressed happiness as the central government increased the minimum support price for paddy.",
    "நெல்லுக்கான குறைந்தபட்ச ஆதரவு விலையை மத்திய அரசு உயர்த்தியுள்ள நிலையில் விவசாயிகள் மகிழ்ச்சி தெரிவித்துள்ளனர்.": "Farmers expressed happiness as the central government increased the minimum support price for paddy.",

    // Hero Section Cards
    "தமிழகத்தில் விரைவில் சட்டமன்ற கூட்டத்தொடர் – முதலமைச்சர் அறிவிப்பு": "TN Assembly Session Soon - Chief Minister's Announcement",
    "தமிழக சட்டமன்றக் கூட்டத்தொடர் விரைவில் தொடங்க உள்ளது. இக்கூட்டத்தொடரில் பல்வேறு முக்கிய மசோதாக்கள் விவாதத்திற்கு வர உள்ளன என முதலமைச்சர் அறிவித்துள்ளார்.": "The Tamil Nadu assembly session is set to begin soon. The Chief Minister announced that various key bills will come up for debate in this session.",
    "பங்குச்சந்தை உயர்வு – முதலீட்டாளர்கள் மகிழ்ச்சி": "Stock Market Rise - Investors Happy",
    "IPL 2025: சென்னை அணி அபார வெற்றி": "IPL 2025: Chennai Team's Spectacular Win",
    "இந்தியா விண்வெளியில் புதிய சாதனை": "India's New Space Milestone",
    "20 மே 2025": "20 May 2025",
    "5 நிமிட வாசிப்பு": "5 min read",

    // Video News section
    "தமிழக பட்ஜெட் 2026 - முக்கிய அம்சங்கள் விளக்கம்": "TN Budget 2026 - Key Highlights Explained",
    "கிரிக்கெட் போட்டி சிறப்பம்சங்கள் - இந்தியா vs ஆஸ்திரேலியா": "Cricket Match Highlights - India vs Australia",
    "விவசாயிகளுக்கான புதிய திட்டங்கள் - நேரடி அறிக்கை": "New Schemes for Farmers - Live Report",
    "பங்குச் சந்தை ஆய்வு - நிபுணர்களின் முக்கிய ஆலோசனை": "Stock Market Analysis - Expert Advice",

    // Web Stories section
    "NEW": "NEW",
    "HOT": "HOT",
    "TREND": "TREND",
    "உலக கோப்பை கிரிக்கெட் 2027 அட்டவணை": "World Cup Cricket 2027 Schedule",
    "ரஜினி அடுத்த படம் - முதல் பார்வை": "Rajini's Next Film - First Look",
    "பாராளுமன்ற தேர்தல் 2029 - முன்னோட்டம்": "Parliamentary Election 2029 - Preview",
    "AI மூலம் மருத்துவ துறையில் புரட்சி": "Revolution in Medicine through AI",
    "கரிம வேளாண்மை - விவசாயிகள் வருமானம்": "Organic Farming - Farmers Income",
    "புதிய முதலீட்டு வாய்ப்புகள் 2026": "New Investment Opportunities 2026",
    "புதிய முதலீட்டு வாய்ப்பப்புகள் 2026": "New Investment Opportunities 2026",

    // Business Case Studies section
    "Infosys: டிஜிட்டல் மாற்றுப் பயணம்": "Infosys: Digital Transformation Journey",
    "TVS Motor: நிலையான வளர்ச்சி": "TVS Motor: Sustainable Growth",
    "Khadi India: பாரம்பரியத்தின் புதுமை": "Khadi India: Innovation in Tradition",

    // News Digest section
    "தமிழக பட்ஜெட் 2026 முக்கிய சிறப்பம்சங்கள் முழு தொகுப்பு": "TN Budget 2026 Key Highlights Complete Collection",
    "நெல் கொள்முதல் விலையை உயர்த்திய அரசு: விவசாயிகள் வரவேற்பு": "Govt Raises Paddy Procurement Price: Farmers Welcome",
    "சட்டமன்றத்தில் இன்று முக்கிய விவாதம் – நேரடித் தகவல்கள்": "Key Debate in Assembly Today - Live Updates",
    "உலகளாவிய பங்குச்சந்தை சரிவு: இந்திய முதலீட்டாளர்களுக்கு பாதிப்பா?": "Global Stock Market Crash: Will It Impact Indian Investors?",
    "சென்னையில் புதிய மேம்பாலங்கள் கட்ட ஒப்புதல்": "Approval for Construction of New Flyovers in Chennai",

    // Calendar Month & Day Translations
    "ஞாயிறு": "Sunday",
    "திங்கள்": "Monday",
    "செவ்வாய்": "Tuesday",
    "புதன்": "Wednesday",
    "வியாழன்": "Thursday",
    "சனி": "Saturday",
    "ஜனவரி": "January",
    "பிப்ரவரி": "February",
    "மார்ச்": "March",
    "ஏப்ரல்": "April",
    " மே ": " May ",
    "ஜூன்": "June",
    "ஜூலை": "July",
    "ஆகஸ்ட்": "August",
    "செப்டம்பர்": "September",
    "அக்டோபர்": "October",
    "நவம்பர்": "November",
    "டிசம்பர்": "December",

    // Substring caption templates
    "படம்:": "Photo:",
    "செய்தித் தொகுப்பு.": "News Compilation.",
    "1 நாள் முன்": "1 day ago",
    "1 நாள் முன்.": "1 day ago.",
    "இப்போது": "Just Now",
    "அரசியல்": "Politics",
    "சட்டமன்றம்": "Assembly",
    "தமிழக பட்ஜெட்": "TN Budget",
    "அரசு கொள்கை": "Govt Policy",

    // Ticker news items
    "🌾 நெல் கொள்முதல் விலை உயர்வு - விவசாயிகள் மகிழ்ச்சி": "🌾 Paddy Procurement Price Hike - Farmers Pleased",
    "🎬 விஜய் 69-வது படம் அறிவிப்பு - ரசிகர்கள் கொண்டாட்டம்": "🎬 Vijay 69 Announcement - Fans Celebrate",
    "📚 +2 தேர்வு முடிவுகள் விரைவில் - கல்வித்துறை தகவல்": "📚 +2 Exam Results Soon - Education Dept Info",
    "⚡ சென்னையில் மின் கட்டணம் உயர்வு - நுகர்வோர் அதிருப்தி": "⚡ Electricity Tariff Hike in Chennai - Consumers Dissatisfied",
    "🚆 புதிய வந்தே பாரத் ரயில் சேவை அறிமுகம் - தெற்கு ரயில்வே": "🚆 New Vande Bharat Rail Service Introduced - Southern Railway",
    "🔴 தமிழகத்தில் நாளை முதல் கனமழை எச்சரிக்கை - வானிலை மையம்": "🔴 Heavy Rain Alert in TN from Tomorrow - Weather Center",
    "🏏 இந்தியா - பாகிஸ்தான் கிரிக்கெட் போட்டி இன்று மாலை 3 மணிக்கு": "🏏 India vs Pakistan Cricket Match Today at 3 PM",
    "💰 பெட்ரோல், டீசல் விலை மாற்றமில்லை - மார்ச் மாத வெளியீடு": "💰 Petrol, Diesel Prices Unchanged - March Release",

    // Weather widget details
    "சென்னை வானிலை": "Chennai Weather",
    "Chennai வானிலை": "Chennai Weather",
    "வானிலை": "Weather",
    "மேகமூட்டம்": "Cloudy",
    "ஈரப்பதம்:": "Humidity:",
    "ஈரப்பதம்: 72%": "Humidity: 72%",
    "காற்ரு:": "Wind:",
    "காற்று:": "Wind:",
    "காற்று: 18 km/h": "Wind: 18 km/h",
    "தி": "Mon",
    "செ": "Tue",
    "பு": "Wed",
    "வி": "Thu",
    "வெ": "Fri",
    "ச": "Sat",
    "ஞா": "Sun",

    // Sidebar Trending news
    "சென்னை பெருநகரில் புதிய மெட்ரோ ரயில் திட்டம் அறிவிப்பு": "New Metro Rail Project Announced in Chennai",
    "Chennai பெருநகரில் புதிய மெட்ரோ ரயில் திட்டம் அறிவிப்பு": "New Metro Rail Project Announced in Chennai",
    "காவிரி நீர் மேலாண்மை குறித்த உச்சநீதிமன்றம் முக்கிய உத்தரவு": "Supreme Court's Key Order on Cauvery Water Management",
    "இணைக்கப்பட்டவை": "Linked",
    "இந்திய பொருளாதாரம் 8% வளர்ச்சி - உலக வங்கி அறிக்கை": "Indian Economy 8% Growth - World Bank Report",
    "தமிழ் சினிமாவில் புதிய படங்களின் அணிவகுப்பு": "Parade of New Movies in Tamil Cinema",
    "பள்ளி மாணவர்களுக்கு காலை உணவு திட்டம் விரிவாக்கம்": "Breakfast Scheme Expansion for School Students",
    "Palli மாணவர்களுக்கு காலை உணவு திட்டம் விரிவாக்கம்": "Breakfast Scheme Expansion for School Students",

    // Digest time labels
    "1 மணி நேரத்திற்கு முன்": "1 hour ago",
    "2 மணி நேரத்திற்கு முன்": "2 hours ago",
    "3 மணி நேரத்திற்கு முன்": "3 hours ago",
    "4 மணி நேரத்திற்கு முன்": "4 hours ago",
    "5 மணி நேரத்திற்கு முன்": "5 hours ago",
    "6 மணி நேரத்திற்கு முன்": "6 hours ago",

    // Footer items
    "செய்டிகள்": "News",
    "செய்திகள்": "News",
    "கூடுதல்": "More",
    "தகவல்": "Info",
    "பதிவிறக்கம்": "Download",
    "பின்தொடர": "Follow Us",
    "தமிழ்நாடு": "Tamil Nadu",
    "இந்தியா": "India",
    "உலகம்": "World",
    "வீдеоக்கள்": "Videos",
    "பாட்காஸ்ட்கள்": "Podcasts",
    "சந்தை விலை": "Market Rates",
    "எங்களைப் பற்றி": "About Us",
    "தொடர்புக்கு": "Contact Us",
    "விளம்பரம்": "Advertise",
    "வேலைவாய்ப்பு": "Careers",
    "தனியுரிமைக் கொள்கை": "Privacy Policy",
    "பயன்பாட்டு விதிமுறைகள்": "Terms of Use",

    // Customizer panel
    "தனிப்பயனாக்கு": "Customize",
    "தீம்": "Theme",
    "இருண்ட பயன்முறை": "Dark Mode",
    "இருண்ட தீமுக்கு மாற்றவும்": "Switch to dark theme",
    "முதன்மை நிறம்": "Primary Color",
    "நீலம் (இயல்புநிலை)": "Blue (Default)",
    "சிவப்பு": "Red",
    "பச்சை": "Green",
    "ஊதா": "Purple",
    "ஆரஞ்சு": "Orange",
    "இளஞ்சிவப்பு": "Pink",
    "சியான்": "Cyan",
    "எழுத்து அளவு": "Font Size",
    "சிறியது": "Small",
    "நடுத்தரம்": "Medium",
    "பெரியது": "Large",
    "விழும் ஸ்லைடு வேகம்": "Auto-Slide Speed",
    "விலை பெட்டி மாறும் நேரம் (வினாடிகள்)": "Transition interval (seconds)",
    "விலைப் பெட்டி மாறும் நேரம் (வினாடிகள்)": "Transition interval (seconds)",
    "பகுதிகளை மறை/காட்டு": "Show/Hide Sections",
    "சிறப்புச் செய்திகள்": "Featured News",
    "வீдео செய்திகள்": "Video News",
    "விவசாயம் & சந்தை": "Agriculture & Market",
    "லைவ் டிவி": "Live TV",
    "கருத்துக் கணிப்பு": "Opinion Poll",
    "செய்தி சுருக்கம்": "News Digest",
    "செய்தி மடல்": "Newsletter",
    "மாவட்ட செய்திகள்": "District News",
    "வணிக டாஷ்போர்டு": "Business Dashboard",
    "விட்ஜெட் அமைப்புகள்": "Widget Settings",
    "விலைப் பெட்டி அகலம்": "Price Box Width",
    "மேலே உள்ள விலைப் பெட்டியின் அகலம்": "Width of top price boxes",
    "சாதாரணம்": "Normal",
    "நீளம் (பரிந்துரைக்கப்படுகிறது)": "Wide (Recommended)",
    "மிக நீளம்": "Very Wide",
    "மீட்டமை": "Reset",
    "பயன்படுத்து": "Apply",
    "4 வினாடிகள்": "4 seconds",
    "6 வினாடிகள்": "6 seconds",
    "8 வினாடிகள்": "8 seconds",
    "12 வினாடிகள்": "12 seconds",

    // Sidebar & details
    "டிரெண்டிங்": "Trending",
    "டிரெண்டிங் News": "Trending News",

    // Ticker & Headers
    "பிரேக்கிங் செய்திகள்": "BREAKING NEWS",
    "தமிழகத்தில் அடுத்த 3 நாட்களுக்கு மழைக்கு வாய்ப்பு – வானிலை ஆய்வு மையம்": "Chance of rain in Tamil Nadu for next 3 days - Meteorological Dept",
    "IPL 2025: சென்னை அணி அபார வெற்றி – ரசிகர்கள் உற்சாகம்": "IPL 2025: Chennai team wins spectacularly - fans excited",
    "பங்குச்சந்தை உயர்வு – முதலீட்டாளர்கள் பெரும் மகிழ்ச்சி": "Stock market rise - investors delighted",
    "தேடல்": "Search",
    "தேடுக": "Search",

    // District Selector
    "சென்னை": "Chennai",
    "கோயம்புத்தூர்": "Coimbatore",
    "மதுரை": "Madurai",
    "சேலம்": "Salem",
    "திருச்சி": "Trichy",
    "திருநெல்வேலி": "Tirunelveli",
    "வேலூர்": "Vellore",
    "ஈரோடு": "Erode",
    "தஞ்சாவூர்": "Thanjavur",
    "கன்னியாகுமரி": "Kanyakumari",

    // Widgets & Sections
    "சென்னை தங்கம் விலை": "Chennai Gold Rate",
    "காய்கறி விலை": "Vegetable Rate",
    "தக்காளி": "Tomato",
    "வெங்காயம்": "Onion",
    "உருளைக்கிழங்கு": "Potato",
    "கேரட்": "Carrot",
    "பங்குச்சந்தை நிலவரம்": "Stock Market Status",
    "நீர்முட்ட நிலவரம்": "River Water Level",
    "மேட்டூர் அணை": "Mettur Dam",
    "பவானிசாகர் அணை": "Bhavanisagar Dam",
    "வைகை அணை": "Vaigai Dam",
    "முல்லைப் பெரியாறு": "Mullaperiyar Dam",
    "அமராவதி அணை": "Amaravathi Dam",
    "சாத்தனூர் அணை": "Sathanur Dam",
    "கிருஷ்ணகிரி அணை": "Krishnagiri Dam",
    "தற்போதைய": "Current",
    "கொள்ளளவு": "Capacity",
    "உள்வரத்து": "Inflow",
    "வெளியேற்றம்": "Outflow",
    "சேமிப்பு": "Storage",
    "உயர்வு": "Rise",
    "இறக்கம்": "Fall",
    "கனஅடி": "cusecs",
    "அடி": "feet",

    // Headlines inside mockup news
    "தமிழகத்தில் புதிய தொழில் பூங்காக்கள் அமைக்க ஒப்புதல்: 50,000 பேருக்கு வேலைவாய்ப்பு": "Approval for new industrial parks in TN: 50,000 jobs",
    "பங்குச்சந்தை வரலாறு காணாத உச்சம்: நிஃப்டி 25,000 புள்ளிகளை கடந்தது": "Stock market hits historic peak: Nifty crosses 25,000 points",
    "இந்திய கிரிக்கெட் அணியின் புதிய பயிற்சியாளராக ராகுல் டிராவிட் மீண்டும் நியமனம்": "Rahul Dravid reappointed as Indian Cricket Team coach",
    "விண்வெளியில் புதிய சாதனை: இஸ்ரோ ஏவிய அதிநவீன செயற்கைக்கோள்": "New record in space: ISRO launches satellite",
    "சென்னையில் சர்வதேச திரைப்பட விழா இன்று தொடங்குகிறது: 50 நாடுகள் பங்கேற்பு": "Chennai International Film Festival starts today: 50 countries participate",
    "விவசாயிகளுக்கான மானியம் இருமடங்காக அதிகரிப்பு: மத்திய பட்ஜெட்டில் அறிவிப்பு": "Subsidies for farmers doubled: announcement in Budget",
    "அரசியல் சூடுபிடிக்கும் தேர்தல் களம்: முக்கிய கட்சிகள் கூட்டணி பேச்சுவார்த்தை": "Election campaign heats up: major parties in talks",
    "வணிக வாய்ப்புகள்": "Business Opportunities",
    "விளையாட்டுச் செய்திகள்": "Sports News",
    "சினிமா அப்டேட்ஸ்": "Cinema Updates",
    "தொழில்நுட்பச் செய்திகள்": "Tech News",

    // Customizer & Sidebars
    "தனிப்பயனாக்கு": "Customize",
    "தீம்": "Theme",
    "இருண்ட பயன்முறை": "Dark Mode",
    "இருண்ட தீமுக்கு மாற்றவும்": "Switch to dark theme",
    "முதன்மை நிறம்": "Primary Color",
    "நீலம் (இயல்புநிலை)": "Blue (Default)",
    "சிவப்பு": "Red",
    "பச்சை": "Green",
    "ஊதா": "Purple",
    "ஆரஞ்சு": "Orange",
    "இளஞ்சிவப்பு": "Pink",
    "சியான்": "Cyan",
    "எழுத்து அளவு": "Font Size",
    "சிறியது": "Small",
    "நடுத்தரம்": "Medium",
    "பெரியது": "Large",
    "பகுதிகளை மறை/காட்டு": "Show/Hide Sections",
    "விளையாட்டுச் செய்திகள்": "Sports News",
    "விவசாயம் & சந்தை": "Agriculture & Market",
    "தேர்தல் மையம்": "Election Center",
    "லைவ் டிவி": "Live TV",
    "கருத்துக் கணிப்பு": "Opinion Poll",
    "செய்தி சுருக்கம்": "News Digest",
    "செய்தி மடல்": "Newsletter",
    " districts": "Districts",
    "விட்ஜெட் அமைப்புகள்": "Widget Settings",
    "விலைப் பெட்டி அகலம்": "Widget Width",
    "சாதாரணம்": "Normal",
    "நீளம் (பரிந்துரைக்கப்படுகிறது)": "Long (Recommended)",
    "மிக நீளம்": "Very Long",
    "விழும் ஸ்லைடு வேகம்": "Slide Speed (Seconds)",
    "4 வினாடிகள்": "4 seconds",
    "6 வினாடிகள்": "6 seconds",
    "8 வினாடிகள்": "8 seconds",
    "12 வினாடிகள்": "12 seconds",
    "மீட்டமை": "Reset",
    "பயன்படுத்து": "Apply",

    // Newsletter & Footer
    "செய்தி மடல்": "Newsletter",
    "தினசரி முக்கிய செய்திகள் உங்கள் மின்னஞ்சலில் நேரடியாக!": "Daily highlights straight to your inbox!",
    "உங்கள் மின்னஞ்சல் முகவரி": "Your email address",
    "பதிவு செய்க": "Subscribe",
    "அனைத்து தலைப்புகள்": "All Headlines",
    "அனைத்து பிரிவுகள்": "All Categories",
    "தேடல் முடிவுகள்": "Search Results",
    "பின்தொடர": "Follow Us",
    "கூடுதல்": "More",
    "தகவல்": "Info",
    "பதிவிறக்கம்": "Download",
    "எங்களைப் பற்றி": "About Us",
    "தொடர்புக்கு": "Contact Us",
    "விளம்பரம்": "Advertise",
    "வேلهவாய்ப்பு": "Careers",
    "வேலைவாய்ப்பு": "Careers",
    "தனியுரிமைக் கொள்கை": "Privacy Policy",
    "பயன்பாட்டு விதிமுறைகள்": "Terms of Use",
    "RSS Feeds": "RSS Feeds",
    "Sitemap": "Sitemap",
    "Accessibility": "Accessibility",
    "Terms": "Terms",
    "All Rights Reserved": "All Rights Reserved",
    "உண்மை. பொறுப்புடன். தமிழ்.": "Truth. Responsibility. Tamil.",

    // article.html details
    "கட்டுரை": "Article",
    "பகிர்க": "Share",
    "நகலெடு": "Copy Link",
    "வாட்ஸ்அப்": "WhatsApp",
    "முகநூல்": "Facebook",
    "트விட்டர்": "Twitter",
    "ட்விட்டர்": "Twitter",
    "டெலிகிராம்": "Telegram",
    "கருத்துகள்": "Comments",
    "கருத்து எழுதவும்": "Leave a Comment",
    "பெயர்": "Name",
    "மின்னஞ்சல் முகவரி": "Email Address",
    "உள்ளடக்கம்": "Comment text",
    "சமர்ப்பி": "Submit",
    "வாசகர் கருத்துகள்": "Reader Comments",
    "விளம்பர விவரங்கள்": "Ad details",
    "தொடர்புடைய கட்டுரைகள்": "Related Articles",
    "தொடர்புடைய செய்திகள்": "Related News",
    "முக்கிய குறிச்சொற்கள்": "Tags",
    "செல்வகுமார்": "Selvakumar",
    "தலைமைச் செய்தி நிருபர்": "Chief News Reporter",
    "வெளியிடப்பட்டது:": "Published:",
    "புதுப்பிக்கப்பட்டது:": "Updated:",
    "படம்: தலைமைச் செயலகம், சென்னை. (கோப்புப் படம்)": "Photo: Secretariat, Chennai. (File Photo)",
    "3 கருத்துக்கள்": "3 Comments",
    "குமரன்": "Kumaran",
    "10 மணி நேரத்திற்கு முன்": "10 hours ago",
    "8 மணி நேரத்திற்கு முன்": "8 hours ago",
    "5 மணி நேரத்திற்கு முன்": "5 hours ago",
    "மகேஷ்வரன்": "Maheshwaran",
    "கவிதா": "Kavitha",
    "சட்டமன்றம்": "Assembly",
    "தமிழக பட்ஜெட்": "TN Budget",
    "அரசு கொள்கை": "Govt Policy",
    "தமிழக அரசின் 2026 பட்ஜெட் கூட்டத்தொடரில் பல முக்கிய அறிவிப்புகள் வெளியிடப்பட்டுள்ளன. குறிப்பாக, கல்வி, விவசாயம் மற்றும் உள்கட்டமைப்பு மேம்பாட்டிற்கு இந்த பட்ஜெட்டில் முக்கியத்துவம் அளிக்கப்பட்டுள்ளது. முதலமைச்சர் சட்டப்பேரவையில் இன்று ஆற்றிய உரையில், ஏழை எளிய மக்களின் வாழ்வாதாரத்தை மேம்படுத்தும் பல புதிய திட்டங்களை அறிவித்தார்.": "Several key announcements have been made in the Tamil Nadu government's 2026 budget session. In particular, importance has been given to education, agriculture, and infrastructure development in this budget. In his speech in the assembly today, the Chief Minister announced several new schemes to improve the livelihood of poor people.",
    "அமைச்சரின் நிதி ஒதுக்கீடு குறித்துப் பேசுகையில், \"மாநிலத்தின் நிதிநிலையைக் கருத்தில் கொண்டு, அதே சமயம் மக்கள் நலத் திட்டங்கள் முடங்கிவிடாமல் இருக்க தகுந்த நடவடிக்கைகள் எடுக்கப்பட்டுள்ளன. அடுத்த சில மாதங்களில் இந்த திட்டங்கள் அனைத்தும் செயல்பாட்டிற்கு வரும்\" என்றார்.": "Speaking on the allocation of funds, the Minister said, \"Keeping in mind the financial state of the state, appropriate measures have been taken to ensure that public welfare schemes are not stalled. All these schemes will come into operation in the next few months.\"",
    "அமைச்சர் நிதி ஒதுக்கீடு குறித்துப் பேசுகையில், \"மாநிலத்தின் நிதிநிலையைக் கருத்தில் கொண்டு, அதே சமயம் மக்கள் நலத் திட்டங்கள் முடங்கிவிடாமல் இருக்க தகுந்த நடவடிக்கைகள் எடுக்கப்பட்டுள்ளன. அடுத்த சில மாதங்களில் இந்த திட்டங்கள் அனைத்தும் செயல்பாட்டிற்கு வரும்\" என்றார்.": "Speaking on the allocation of funds, the Minister said, \"Keeping in mind the financial state of the state, appropriate measures have been taken to ensure that public welfare schemes are not stalled. All these schemes will come into operation in the next few months.\"",
    "எதிர்க்கட்சிகள் பட்ஜெட் நிதிப் பகிர்வு குறித்து சில விமர்சனங்களை எழுப்பிய போதிலும், பெரும்பான்மையான சட்டமன்ற உறுப்பினர்கள் இந்த அறிவிப்புகளுக்கு வரவேற்பு தெரிவித்துள்ளனர். பட்ஜெட் கூட்டத்தொடரின் மீதான விவாதம் இன்னும் சில நாட்களுக்குத் தொடரும் என்று சபாநாயகர் அறிவித்துள்ளார்.": "Despite opposition criticism regarding the budget allocation, the majority of assembly members welcomed these announcements. The Speaker announced that the debate on the budget session will continue for a few more days.",
    "அருமையான பட்ஜெட் அறிவிப்புகள். குறிப்பாக கல்விக்கான நிதி ஒதுக்கீடு உயர்த்தப்பட்டுள்ளது பாராட்டத்தக்கது.": "Excellent budget announcements. Particularly, raising the allocation for education is highly commendable.",
    "விவசாயிகளுக்கான இலவச மின்சாரம் மற்றும் மானியங்கள் தொடருமா என்பதில் சட்டமன்றத்தில் தெளிவுபடுத்த வேண்டும்.": "It must be clarified in the assembly whether the free electricity and subsidies for farmers will continue.",
    "புதிய சாலை மேம்பாட்டுத் திட்டங்கள் போக்குவரத்தை சீரமைக்கும் என நம்புகிறேன்.": "I hope the new road development projects will streamline traffic.",

    // Dynamic corrections for Silver vs Friday, and Our Town
    "வெள்ளி விழா": "Silver Jubilee",
    "வெள்ளி:": "Silver:",
    "நமதூர்": "Our Town",
    "நமது ஊர்": "Our Town",
    "நமது ஊர் வாழ்த்துகளும் கொண்டாட்டங்களும்": "Our Town's Wishes and Celebrations",
    "நமது ஊர் காலமானவர்களின் விபரங்கள் மற்றும் இறுதி அஞ்சலி முன்னறிவிப்புகள்": "Our Town's obituary notices and final tribute announcements",
    "நமது ஊர் மக்கள் அனைவரும் இணைந்து வாழ்த்துக்களைத் தெரிவிக்க இலவசமாகப் பதியுங்கள்.": "Post for free so all our town's people can join together and wish them.",
    "நமது ஊர் மக்கள் அஞ்சலி செலுத்தவும் இறுதிச் சடங்கு விபரங்களை அறியவும் இலவசமாகப் பதியுங்கள்.": "Post for free so all our town's people can pay tributes and know funeral details.",
    "நமது ஊர் மக்கள்": "Our Town's People",
    "நமது ஊரைச் சேர்ந்த": "from our town",
    "நமது அண்ணா நகரைச் சேர்ந்த": "from our Anna Nagar",
    "ட்ரெண்டிங் செய்திகள்": "Trending News",
    "ட்ரெண்டிங்": "Trending",
    "ட்ரெண்டிங் News": "Trending News",

    // subpages: directory.html
    "நம்ம ஊர் வணிகக் கோப்பகம் - KING 24x7 | Local Business Directory": "Regional Business Directory - KING 24x7",
    "நம்ம ஊர் வணிகக் கோப்பகம்": "Regional Business Directory",
    "உள்ளூர் வணிகங்கள், அவசர உதவிகள், மருத்துவமனைகள், பிளம்பர்கள் மற்றும் சேவை வழங்குநர்களின் தொடர்பு விபரங்கள் தமிழில்.": "Local businesses, emergency services, hospitals, plumbers and service providers contact details in Tamil.",
    "உள்ளூர் வணிகங்கள் மற்றும் சேவை வழங்குநர்களின் முழுமையான விபரங்கள்": "Complete details of local businesses and service providers",
    "வகைப்பாடுகள்": "Categories",
    "அனைத்து வணிகங்களும்": "All Businesses",
    "மருத்துவம்": "Medical / Health",
    "அவசர உதவி": "Emergency Support",
    "சேவைகள் & பழுதுபார்ப்பு": "Services & Repair",
    "கடைகள்": "Shops & Retail",
    "உள்ளூர் வணிகங்கள்": "Local Businesses",
    "முகவரி:": "Address:",
    "தொலைபேசி:": "Phone:",
    "தொடர்பு கொள்ள": "Call Now",
    "தகவல் அறிய": "View Info",
    "இலவசமாக பதிவு செய்ய": "Register for Free",
    "புதிய வணிகத்தைப் பதிவு செய்யவும்": "Register New Business",
    "வணிகத்தின் பெயர் *": "Business Name *",
    "தொலைபேசி எண் *": "Phone Number *",
    "முழு முகவரி *": "Full Address *",
    "வணிகத்தின் பெயர்": "Business Name",
    "பிரிவு *": "Category *",
    "சேவை விபரங்கள் *": "Service Details *",
    "வணிகத்தைப் பதிவு செய்": "Register Business",
    "அப்பல்லோ கிளினிக்": "Apollo Clinic",
    "அண்ணா நகர்": "Anna Nagar",
    "ராஜா எலக்ட்ரிக்கல்ஸ் & பிளம்பிங்": "Raja Electricals & Plumbing",
    "காந்தி வீதி": "Gandhi Street",

    // subpages: jobs.html
    "உள்ளூர் வேலைவாய்ப்புகள் - KING 24x7 | Local Jobs Board": "Local Jobs Board - KING 24x7",
    "உள்ளூர் வேலைவாய்ப்புகள்": "Local Job Vacancies",
    "சிறு நகரங்கள் மற்றும் கிராமங்களுக்கான பிரத்யேக வேலைவாய்ப்பு பலகை": "Exclusive jobs board for small towns and villages",
    "வேலை வகை": "Job Category",
    "அனைத்து வேலைகளும்": "All Jobs",
    "விற்பனை / மார்க்கெட்டிங்": "Sales / Marketing",
    "ஓட்டுநர்": "Driver",
    "கணினி / தொழில்நுட்பம்": "Computer / Tech",
    "இதர வேலைகள்": "Other Jobs",
    "சம்பளம்:": "Salary:",
    "அனுபவம்:": "Experience:",
    "இடம்:": "Location:",
    "விண்ணப்பிக்க": "Apply Now",
    "புதிய வேலையைப் பதியவும்": "Post a New Job",
    "வேலை வாய்ப்புப் பதிவு": "Job Vacancy Posting",
    "வேலை தலைப்பு *": "Job Title *",
    "நிறுவனத்தின் பெயர் *": "Company Name *",
    "சம்பளம் (மாதம்) *": "Salary (per month) *",
    "தேவைப்படும் அனுபவம் *": "Required Experience *",
    "வேலை விபரம் *": "Job Description *",
    "வேலையைப் பதிவு செய்": "Post Job",
    "விற்பனை பிரதிநிதி (Sales Representative)": "Sales Representative",
    "கண்ணன் சில்க்ஸ்": "Kannan Silks",
    "பஜார் வீதி": "Bazaar Street",
    "கனரக வாகன ஓட்டுநர் (Heavy Driver)": "Heavy Driver",
    "ஆனந்த் லாஜிஸ்டிக்ஸ்": "Anand Logistics",
    "சேலம் பைபாஸ்": "Salem Bypass",
    "தரவு உள்ளீட்டாளர் (Data Entry Operator)": "Data Entry Operator",
    "விவேகா இன்ஃபோடெக்": "Viveka Infotech",
    "வள்ளலார் நகர்": "Vallalar Nagar",
    "தமிழ் மற்றும் ஆங்கில தட்டச்சு பயிற்சி பெற்றவர்கள் தேவை. MS Office அடிப்படை அறிவு அவசியம்.": "Typists trained in Tamil and English required. Basic knowledge of MS Office is essential.",

    // subpages: classifieds.html
    "விளம்பரங்கள் & Classifieds - KING 24x7 | Local Classifieds": "Local Classifieds - KING 24x7",
    "விளம்பரங்கள் & Classifieds": "Classifieds & Ads",
    "உள்ளூர் மக்களின் தேவைகள், வாடகை, விற்பனை மற்றும் சிறப்புத் தள்ளுபடி விபரங்கள் தமிழில்.": "Local requirements, rentals, sales, and special discounts in Tamil.",
    "வகை": "Type",
    "அனைத்து விளம்பரங்களும்": "All Classifieds",
    "வாடகைக்கு": "For Rent",
    "விற்பனைக்கு": "For Sale",
    "சலுகைகள்": "Offers / Discounts",
    "தொடர்பு நபர்:": "Contact Person:",
    "விளம்பரம் செய்ய": "Post an Ad",
    "Classifieds விளம்பரம் பதியவும்": "Post a Classified Ad",
    "விளம்பரத் தலைப்பு *": "Ad Title *",
    "விளம்பர வகை *": "Ad Type *",
    "தொடர்பு எண் *": "Contact Number *",
    "விளம்பர விவரம் *": "Ad Details *",
    "விளம்பரத்தை வெளியிடு": "Post Ad",
    "2 BHK வீடு வாடகைக்கு": "2 BHK House for Rent",
    "அம்பத்தூர் கேஸ் ஸ்டடி": "Ambattur Case Study",
    "புதிய அடுக்குமாடி குடியிருப்பில் 2 BHK வீடு வாடகைக்கு உள்ளது. குடும்பத்தினருக்கு முன்னுரிமை.": "2 BHK house available for rent in a new apartment complex. Families preferred.",
    "மாருதி ஆல்டோ விற்பனைக்கு": "Maruti Alto for Sale",
    "2018 மாடல், நல்ல நிலையில் உள்ளது. ஒற்றை உரிமையாளர், இன்சூரன்ஸ் நடப்பில் உள்ளது.": "2018 model, excellent condition. Single owner, active insurance.",
    "30% ஆடி தள்ளுபடி சலுகை": "30% Aadi Discount Offer",
    "வசந்த் & கோ கிளைகளில் வீட்டு உபயோகப் பொருட்களுக்கு 30% வரை சிறப்பு ஆடி தள்ளுபடி.": "Special Aadi discount up to 30% on home appliances at Vasanth & Co branches.",

    // subpages: obituaries.html
    "கண்ணீர் அஞ்சலி & இரங்கல் செய்திகள் - KING 24x7 | Obituaries": "Obituaries & Condolences - KING 24x7",
    "கண்ணீர் அஞ்சலி & இரங்கல் செய்திகள்": "Obituaries & Condolences",
    "நமது ஊர் காலமானவர்களின் விபரங்கள் மற்றும் இறுதி அஞ்சலி முன்னறிவிப்புகள்": "Our Town's obituary notices and final tribute announcements",
    "இறப்பு:": "Date of Demise:",
    "இறுதிச் சடங்கு:": "Funeral Details:",
    "கண்ணீர் அஞ்சலி செலுத்த": "Pay Tribute",
    "அஞ்சலிகள் செலுத்தப்பட்டுள்ளன": "tributes have been paid",
    "இரங்கல் பதிவு செய்ய": "Post Obituary",
    "இரங்கல் செய்தி பதிவு": "Post Obituary Notice",
    "காலமானவர் பெயர் *": "Deceased Name *",
    "வயது *": "Age *",
    "வயது": "Age",
    "ஊர் *": "Place / Town *",
    "மறைந்த தேதி *": "Date of Demise *",
    "இறுதிச் சடங்கு விபரங்கள் *": "Funeral Details *",
    "மறைந்தவரைப் பற்றிய சிறு குறிப்பு *": "Brief Description / Obituary note *",
    "பதிவு செய்": "Post Notice",
    "தர்மலிங்கம்": "Dharmalingam",
    "வயது 74 | சேலம்": "Age 74 | Salem",
    "இறப்பு: 30-06-2026": "Demise: 30-06-2026",
    "முன்னாள் அரசு பள்ளி தலைமை ஆசிரியர். அன்னார் தாரமங்கலம் அரசு உயர்நிலைப்பள்ளியில் 30 ஆண்டுகள் பணியாற்றியவர். இவரது இழப்பு குடும்பத்தாருக்கும் மாணவர்களுக்கும் ஈடுசெய்ய முடியாத ஒன்றாகும்.": "Former government school headmaster. He served at Tharamangalam Government High School for 30 years. His loss is irreplaceable to his family and students.",
    "இறுதிச் சடங்கு: 02-07-2026, மாலை 4:00 மணி": "Funeral: 02-07-2026, 4:00 PM",
    "மீனாம்பாள்": "Meenambal",
    "வயது 68 | கோவை": "Age 68 | Coimbatore",
    "இறப்பு: 29-06-2026": "Demise: 29-06-2026",
    "பாலசுப்ரமணியன் அவர்களின் தர்மபத்தினி. சமூக ஆர்வலர் மற்றும் உதவும் கரங்கள் அறக்கட்டளையின் மூத்த உறுப்பினர். பல ஆதரவற்ற குழந்தைகளுக்கு கல்வி கற்க உதவியவர்.": "Beloved wife of Balasubramanian. Social activist and senior member of Helping Hands Foundation. Helped many underprivileged children receive education.",
    "இறுதிச் சடங்கு: 01-07-2026, காலை 10:00 மணி": "Funeral: 01-07-2026, 10:00 AM",
    "RAMANATHAN செட்டியார்": "Ramanathan Chettiar",
    "ராமநாதன் செட்டியார்": "Ramanathan Chettiar",
    "வயது 85 | காரைக்குடி": "Age 85 | Karaikudi",
    "இறுதிச் சடங்கு: 30-06-2026 (முடிந்தது)": "Funeral: 30-06-2026 (Completed)",

    // subpages: wishes.html
    "வாழ்த்துகள் & கொண்டாட்டங்கள் - KING 24x7 | Local Wishes": "Local Wishes & Celebrations - KING 24x7",
    "வாழ்த்துகள் & கொண்டாட்டங்கள்": "Wishes & Celebrations",
    "நமது ஊர் வாழ்த்துகளும் கொண்டாட்டங்களும்": "Our Town's Wishes and Celebrations",
    "உள்ளூர் மக்களின் பிறந்தநாள், திருமண நாள் மற்றும் சாதனையாளர்களை வாழ்த்தி மகிழுங்கள்": "Congratulate and celebrate local people's birthdays, anniversaries, and accomplishments",
    "பெயர் கொண்டு தேடுக...": "Search by name...",
    "பிறந்தநாள்": "Birthday",
    "திருமண நாள்": "Wedding Anniversary",
    "சாதனை": "Achievement",
    "செல்வன். தருண் குமார்": "Master Tarun Kumar",
    "நமது அண்ணா நகரைச் சேர்ந்த செல்வன். தருண் குமார் தனது 10-வது பிறந்தநாளை இன்று கொண்டாடுகிறார். அவர் எல்லா வளமும் பெற்று நீண்ட ஆயுளுடன் வாழ வாழ்த்துகிறோம்!": "Master Tarun Kumar from our Anna Nagar is celebrating his 10th birthday today. We wish him all success, health, and a long life!",
    "✍️ வாழ்த்துபவர்கள்: பெற்றோர் மற்றும் உறவினர்கள்": "✍️ Wished by: Parents and Relatives",
    "வாழ்த்துக்களைத் தெரிவி": "Send Wishes",
    "திரு & திருமதி. விவேகானந்தன்": "Mr. & Mrs. Vivekanandan",
    "தங்களது 25-வது வெள்ளி விழா திருமண நாளை இன்று கொண்டாடும் தாரமங்கலம் விவேகானந்தன்-கலா தம்பதியினர் மென்மேலும் இன்புற்று வாழ வாழ்த்துகிறோம்!": "We wish the couple Vivekanandan & Kala from Tharamangalam, who are celebrating their 25th Silver Jubilee wedding anniversary today, a life filled with joy and happiness!",
    "✍️ வாழ்த்துபவர்கள்: அன்பு மகன்கள் மற்றும் குடும்பத்தினர்": "✍️ Wished by: Loving sons and family",
    "செல்வி. கார்த்திகா தேவி": "Miss Karthika Devi",
    "பத்தாம் வகுப்பு பொதுத்தேர்வில் 492 மதிப்பெண்கள் பெற்று பள்ளியில் முதலிடம் பெற்ற நமது ஊரைச் சேர்ந்த மாணவி கார்த்திகா தேவிக்கு மனமார்ந்த வாழ்த்துகள்!": "Hearty congratulations to student Karthika Devi from our town, who topped the school scoring 492 marks in the 10th grade public exams!",
    "✍️ வாழ்த்துபவர்கள்: நமது ஊர் மக்கள் மற்றும் ஆசிரியர்கள்": "✍️ Wished by: Our town's residents and teachers",
    "பாராட்டுக்களைத் தெரிவி": "Congratulate",
    "உங்கள் குடும்பத்தினரின் பிறந்தநாள் அல்லது திருமண நாட்களைப் பகிர விரும்புகிறீர்களா?": "Want to share your family members' birthdays or wedding anniversaries?",
    "வாழ்த்து அட்டை அனுப்ப": "Send Wishes Card",
    "வாழ்த்து அட்டை பதியவும்": "Post a Wishes Card",
    "வாழ்த்தப் பெறுபவர் பெயர் *": "Celebrant's Name *",
    "வாழ்த்து வகை *": "Wishes Type *",
    "வாழ்த்துச் செய்தி *": "Wishes Message *",
    "வாழ்த்துபவர் பெயர்(கள்) *": "Wisher's Name(s) *",
    "வாழ்த்து அட்டையை வெளியிடு": "Publish Wishes Card",

    // subpages: business-studies.html
    "வணிக வெற்றிக் கதைகள் & திட்டங்கள் - KING 24x7 | Business Case Studies": "Business Case Studies - KING 24x7",
    "வணிக வெற்றிக் கதைகள் & திட்டங்கள்": "Business Case Studies & Success Stories",
    "சிறு நகரங்கள் மற்றும் கிராமப்புற தொழில்முனைவோரின் வெற்றிகரமான வணிக உத்திகள், வழக்கு ஆய்வுகள் மற்றும் வழிகாட்டல்கள் தமிழில்.": "Successful business strategies, case studies, and guides of small town and rural entrepreneurs in Tamil."
};

  function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    Storage.set('lang', lang);
    
    // Update dropdown switches
    document.querySelectorAll('.lang-switcher').forEach(function(select) {
      select.value = lang;
    });

    // Special logic for article.html title toggle
    var artTitleTa = document.getElementById('artTitleTa');
    var artTitleEn = document.getElementById('artTitleEn');
    if (artTitleTa && artTitleEn) {
      if (lang === 'en') {
        artTitleTa.style.display = 'none';
        artTitleEn.style.display = 'block';
      } else {
        artTitleTa.style.display = 'block';
        artTitleEn.style.display = 'none';
      }
    }

    // Update theme toggle text
    updateThemeToggleText();

    // Traverse and translate text nodes
    translateTextNodes(document.body, lang);

    // Update clock immediately
    updateTamilDateTime();
  }

  function translateTextNodes(node, lang) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.nodeValue.trim();
      if (!text) return;

      if (lang === 'en') {
        // Find match in dictionary
        if (translationMap[text]) {
          if (!node.origText) node.origText = node.nodeValue;
          node.nodeValue = node.nodeValue.replace(text, translationMap[text]);
        } else {
          // Check substring replacement with boundary checking
          var newText = node.nodeValue;
          var modified = false;
          for (var key in translationMap) {
            if (translationMap.hasOwnProperty(key) && key.length >= 3) {
              var idx = newText.indexOf(key);
              while (idx !== -1) {
                var charBefore = idx > 0 ? newText[idx - 1] : '';
                var charAfter = idx + key.length < newText.length ? newText[idx + key.length] : '';
                
                var isTamilBefore = /[\u0B80-\u0BFF]/.test(charBefore);
                var isTamilAfter = /[\u0B80-\u0BFF]/.test(charAfter);
                
                if (!isTamilBefore && !isTamilAfter) {
                  if (!node.origText) node.origText = node.nodeValue;
                  newText = newText.substring(0, idx) + translationMap[key] + newText.substring(idx + key.length);
                  modified = true;
                  // Advance index past the replaced text
                  idx = newText.indexOf(key, idx + translationMap[key].length);
                } else {
                  // Advance index past the current match
                  idx = newText.indexOf(key, idx + 1);
                }
              }
            }
          }
          if (modified) node.nodeValue = newText;
        }
      } else {
        // Restore original
        if (node.origText) {
          node.nodeValue = node.origText;
        }
      }
    } else {
      if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE') return;
      
      // Do not translate the select elements' values
      if (node.classList && node.classList.contains('lang-switcher')) return;
      if (node.nodeName === 'OPTION' && node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('lang-switcher')) return;

      // Translate placeholders
      if (node.placeholder) {
        var pText = node.placeholder.trim();
        if (lang === 'en') {
          if (translationMap[pText]) {
            if (!node.origPlaceholder) node.origPlaceholder = node.placeholder;
            node.placeholder = translationMap[pText];
          }
        } else {
          if (node.origPlaceholder) {
            node.placeholder = node.origPlaceholder;
          }
        }
      }

      for (var i = 0; i < node.childNodes.length; i++) {
        translateTextNodes(node.childNodes[i], lang);
      }
    }
  }

  // Hook translation switch event
  document.querySelectorAll('.lang-switcher').forEach(function(select) {
    select.addEventListener('change', function() {
      setLanguage(this.value);
    });
  });

  // ===== RENDER USER LOGIN STATUS IN TOP BAR =====
  function renderUserSession() {
    const tbr = document.querySelector('.top-bar-right');
    if (!tbr) return;

    // Check if dynamic user block already exists
    let userBlock = document.getElementById('topBarUserBlock');
    if (userBlock) userBlock.remove();

    const session = Storage.get('session', null);
    const lang = Storage.get('lang', 'en');

    userBlock = document.createElement('div');
    userBlock.id = 'topBarUserBlock';
    userBlock.style.display = 'inline-flex';
    userBlock.style.alignItems = 'center';
    userBlock.style.gap = '8px';
    userBlock.style.marginLeft = '12px';
    userBlock.style.paddingLeft = '12px';
    userBlock.style.borderLeft = '1px solid var(--top-bar-border)';

    if (session && session.isLoggedIn) {
      // User is logged in — support both old and new role formats
      const roleColors = {
        SUPER_ADMIN: '#EF4444', admin: '#EF4444',
        CHIEF_EDITOR: '#8B5CF6', editor: '#8B5CF6',
        DISTRICT_ADMIN: '#F59E0B', reporter: '#F59E0B',
        MOBILE_JOURNALIST: '#0EA5E9',
        INSTITUTION_LOGIN: '#14B8A6',
        READER: '#3B82F6', user: '#3B82F6',
        vendor: '#10B981'
      };
      const badgeColor = roleColors[session.role] || '#64748B';

      // Friendly display name for role
      const roleFriendly = {
        SUPER_ADMIN: 'Super Admin', CHIEF_EDITOR: 'Chief Editor',
        DISTRICT_ADMIN: 'District Admin', MOBILE_JOURNALIST: 'Journalist',
        INSTITUTION_LOGIN: 'Institution', READER: 'Reader',
        admin: 'Admin', editor: 'Editor', reporter: 'Reporter',
        vendor: 'Vendor', user: 'User'
      };
      const roleLabel = roleFriendly[session.role] || (session.role || 'User');
      const roleText = lang === 'en' ? roleLabel : getTamilRole(session.role);

      const displayName = sanitize(session.username || session.email || 'User');
      const avatarHtml = session.profileImage
        ? `<img src="${session.profileImage}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;" />`
        : `<i class="fas fa-user-circle" style="color:${badgeColor};font-size:18px;"></i>`;

      userBlock.innerHTML = `
        <span style="font-size:12px; font-weight:600; color:var(--top-bar-text); display:flex; align-items:center; gap:6px;">
          ${avatarHtml}
          ${displayName}
          <span style="font-size:10px; background:${badgeColor}; color:white; padding:1px 6px; border-radius:4px; font-weight:700;">${roleText}</span>
        </span>
        <button id="logoutBtn" style="background:transparent; border:none; color:#EF4444; font-size:12px; font-weight:700; cursor:pointer; padding:4px 8px; display:flex; align-items:center; gap:4px; outline:none;">
          <i class="fas fa-sign-out-alt"></i> ${lang === 'en' ? 'Logout' : 'வெளியேறு'}
        </button>
      `;

      tbr.appendChild(userBlock);

      // Add logout listener
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
          Storage.remove('session');
          renderUserSession();
          window.location.reload();
        });
      }
    } else {
      // User is NOT logged in
      userBlock.innerHTML = `
        <a href="login.html" style="font-size:12px; font-weight:700; color:var(--primary); display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:4px; transition:var(--transition);" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='transparent'">
          <i class="fas fa-sign-in-alt"></i> ${lang === 'en' ? 'Login' : 'உள்நுழை'}
        </a>
      `;
      tbr.appendChild(userBlock);
    }
  }

  function getTamilRole(role) {
    const roles = {
      SUPER_ADMIN: 'நிர்வாகி', admin: 'நிர்வாகி',
      CHIEF_EDITOR: 'ஆசிரியர்', editor: 'ஆசிரியர்',
      DISTRICT_ADMIN: 'மாவட்ட நிர்வாகி', reporter: 'செய்தியாளர்',
      MOBILE_JOURNALIST: 'பத்திரிக்கையாளர்',
      INSTITUTION_LOGIN: 'நிறுவனம்',
      READER: 'வாசகர்', user: 'வாசகர்',
      vendor: 'வணிகர்'
    };
    return roles[role] || 'வாசகர்';
  }


  // ===== DYNAMIC DATA LOADER FOR WEB PAGE SECTIONS =====
  
  // Format dates nicely
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const lang = Storage.get('lang', 'en');
      if (lang === 'ta') {
        const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  // 1. Breaking News Ticker
  async function loadBreakingNews() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/breaking-news/getAllWeb?size=10`);
      if (!response.ok) return;
      const data = await response.json();
      const items = data.content || [];
      const track = document.getElementById('breakTrack');
      if (!track || items.length === 0) return;

      const lang = Storage.get('lang', 'en');
      track.innerHTML = items.map(item => {
        const title = lang === 'ta' ? (item.titleTa || item.title) : (item.title || item.titleTa);
        return `<a href="article.html?id=${item.id}">${sanitize(title)}</a>`;
      }).join('');
    } catch (err) {
      console.warn("Failed to load breaking news ticker:", err);
    }
  }

  // 2. Hero Section
  async function loadHeroSection() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/public/news?limit=4`);
      if (!response.ok) return;
      const articles = await response.json();
      if (!articles || articles.length === 0) return;

      const lang = Storage.get('lang', 'en');

      // Main featured card (first article)
      const mainArt = articles[0];
      const featuredCard = document.querySelector('.featured-card');
      if (featuredCard && mainArt) {
        const title = lang === 'ta' ? (mainArt.titleTa || mainArt.titleEn) : (mainArt.titleEn || mainArt.titleTa);
        const desc = lang === 'ta' ? (mainArt.shortDescTa || mainArt.contentTa) : (mainArt.shortDescEn || mainArt.contentEn);
        const bgStyle = mainArt.imageUrl ? `background-image: url('${getMediaUrl(mainArt.imageUrl)}'); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, #1E40AF, #3B82F6);`;
        
        featuredCard.innerHTML = `
          <div class="card-img" style="${bgStyle}"></div>
          <div class="card-overlay">
            <span class="category-badge cat-politics">${lang === 'ta' ? 'செய்திகள்' : 'News'}</span>
            <h2><a href="article.html?id=${mainArt.id}" style="color: inherit; text-decoration: none;">${sanitize(title)}</a></h2>
            <p>${sanitize(desc ? desc.substring(0, 150) + '...' : '')}</p>
            <div class="meta">
              <span><i class="far fa-calendar-alt"></i> ${formatDate(mainArt.publishedAt)}</span>
              <span><i class="far fa-eye"></i> ${mainArt.viewsCount || 0}</span>
            </div>
          </div>
        `;
      }

      // Stack cards (next 3 articles)
      const heroStack = document.querySelector('.hero-stack');
      if (heroStack && articles.length > 1) {
        const stackHTML = articles.slice(1, 4).map(art => {
          const title = lang === 'ta' ? (art.titleTa || art.titleEn) : (art.titleEn || art.titleTa);
          const thumbStyle = art.imageUrl ? `background-image: url('${getMediaUrl(art.imageUrl)}'); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, #F59E0B, #D97706);`;
          return `
            <div class="hero-stack-card" onclick="window.location.href='article.html?id=${art.id}'" style="cursor: pointer;">
              <div class="info">
                <span class="category-badge cat-business">${lang === 'ta' ? 'முக்கியம்' : 'Featured'}</span>
                <h4>${sanitize(title)}</h4>
                <div class="meta"><span><i class="far fa-calendar-alt"></i> ${formatDate(art.publishedAt)}</span></div>
              </div>
              <div class="thumb" style="${thumbStyle}"></div>
            </div>
          `;
        }).join('');
        heroStack.innerHTML = stackHTML;
      }
    } catch (err) {
      console.warn("Failed to load hero section:", err);
    }
  }

  // 4. Latest News
  async function loadLatestNews() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/articles/getAllWeb?size=6`);
      if (!response.ok) return;
      const data = await response.json();
      const articles = data.content || [];
      const grid = document.getElementById('newsGrid');
      if (!grid || articles.length === 0) return;

      const lang = Storage.get('lang', 'en');
      grid.innerHTML = articles.map(art => {
        const title = lang === 'ta' ? (art.titleTa || art.titleEn) : (art.titleEn || art.titleTa);
        const desc = lang === 'ta' ? (art.shortDescTa || art.contentTa) : (art.shortDescEn || art.contentEn);
        const imgStyle = art.imageUrl ? `background-image: url('${getMediaUrl(art.imageUrl)}'); background-size: cover; background-position: center;` : `background: linear-gradient(135deg, #1E40AF, #3B82F6);`;
        return `
          <div class="news-card" onclick="window.location.href='article.html?id=${art.id}'" style="cursor: pointer;">
            <div class="card-img" style="${imgStyle}">
              <span class="cat-badge cat-politics">${lang === 'ta' ? 'சமீபத்தியவை' : 'Latest'}</span>
            </div>
            <div class="card-body">
              <h3>${sanitize(title)}</h3>
              <p>${sanitize(desc ? desc.substring(0, 100) + '...' : '')}</p>
              <div class="card-meta">
                <span><i class="far fa-calendar-alt"></i> ${formatDate(art.publishedAt)}</span>
                <span><i class="far fa-eye"></i> ${art.viewsCount || 0}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.warn("Failed to load latest news:", err);
    }
  }

  // 5. Video News
  async function loadVideoNews() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/videos/getAllWeb?size=4`);
      if (!response.ok) return;
      const data = await response.json();
      const videos = data.content || [];
      const container = document.querySelector('.video-grid-4');
      if (!container || videos.length === 0) return;

      container.innerHTML = videos.map(vid => {
        const thumbUrl = (vid.thumbnailUrl ? getMediaUrl(vid.thumbnailUrl) : null) || `https://img.youtube.com/vi/${vid.youtubeUrl.split('v=')[1] || vid.youtubeUrl.split('/').pop()}/mqdefault.jpg`;
        return `
          <div class="video-card" onclick="window.open('${vid.youtubeUrl}', '_blank')" style="cursor: pointer;">
            <div class="thumb-area">
              <img src="${thumbUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${sanitize(vid.title)}">
              <div class="play-overlay"><i class="fas fa-play"></i></div>
              <span class="duration">${vid.duration || 'Video'}</span>
            </div>
            <div class="body">
              <h5>${sanitize(vid.title)}</h5>
              <div class="meta"><span><i class="far fa-eye"></i> ${vid.viewsCount || 0} views</span></div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.warn("Failed to load video news:", err);
    }
  }

  // 6. Web Stories
  async function loadWebStories() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/web-stories/getAllWeb?size=6`);
      if (!response.ok) return;
      const data = await response.json();
      const stories = data.content || [];
      const track = document.querySelector('.stories-track');
      if (!track || stories.length === 0) return;

      const lang = Storage.get('lang', 'en');
      track.innerHTML = stories.map(story => {
        const title = lang === 'ta' ? (story.titleTa || story.titleEn) : (story.titleEn || story.titleTa);
        const bg = story.backgroundGradient || 'linear-gradient(135deg, #667eea, #764ba2)';
        return `
          <div class="story-card" style="background: ${bg}; cursor: pointer;" onclick="window.location.href='story.html?id=${story.id}'">
            <span class="badge-tag" style="background:#3B82F6">${story.badge || 'STORY'}</span>
            <div class="story-overlay">
              <span class="story-cat cat-politics">${sanitize(story.cat || 'New')}</span>
              <h5>${sanitize(title)}</h5>
              <span class="views"><i class="far fa-eye"></i> ${story.viewsCount || 0}</span>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.warn("Failed to load web stories:", err);
    }
  }

  // 7. Trending Sidebar
  async function loadTrendingNews() {
    try {
      const response = await fetch(`${API_BASE}/api/v1/articles/getAllWeb?size=5&sortBy=viewsCount&direction=desc`);
      if (!response.ok) return;
      const data = await response.json();
      const articles = data.content || [];
      const container = document.querySelector('.trending-list');
      if (!container || articles.length === 0) return;

      const lang = Storage.get('lang', 'en');
      const headerHTML = `<h4 style="font-size:16px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px"><i class="fas fa-fire" style="color:#EF4444"></i> ${lang === 'ta' ? 'ட்ரெண்டிங் செய்திகள்' : 'Trending News'}</h4>`;
      
      const itemsHTML = articles.map((art, index) => {
        const title = lang === 'ta' ? (art.titleTa || art.titleEn) : (art.titleEn || art.titleTa);
        const isTop3 = index < 3 ? 'top3' : '';
        return `
          <div class="trending-item" onclick="window.location.href='article.html?id=${art.id}'" style="cursor: pointer;">
            <span class="rank ${isTop3}">${index + 1}</span>
            <div class="info">
              <h5>${sanitize(title)}</h5>
              <div class="meta"><span><i class="far fa-eye"></i> ${art.viewsCount || 0}</span></div>
            </div>
          </div>
        `;
      }).join('');
      
      container.innerHTML = headerHTML + itemsHTML;
    } catch (err) {
      console.warn("Failed to load trending news:", err);
    }
  }

  // ===== ROLE BASED LOG IN REDIRECTS =====
  // If user accesses the main page but has an admin role, redirect them to the admin portal
  function checkAndRedirectAdminUsers() {
    const token = localStorage.getItem('token') || Storage.get('token', null);
    const user = JSON.parse(localStorage.getItem('user') || 'null') || Storage.get('user', null);
    if (token && user) {
      const adminRoles = ['SUPER_ADMIN', 'CHIEF_EDITOR', 'DISTRICT_ADMIN', 'MOBILE_JOURNALIST', 'INSTITUTION_LOGIN'];
      if (adminRoles.includes(user.role)) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          window.location.href = 'http://localhost:3000/admin/layout';
        } else {
          window.location.href = window.location.origin + '/admin/layout';
        }
      }
    }
  }

  // ===== INIT =====
  initWidgetSlider();
  loadCustomization();
  renderUserSession();
  syncHomepageLayout();
  checkAndRedirectAdminUsers();
  
  // Load dynamic data on DOM ready
  loadBreakingNews();
  loadHeroSection();
  loadLatestNews();
  loadVideoNews();
  loadWebStories();
  loadTrendingNews();
  loadDynamicNavMenu(); // Populate nav from backend categories (Issue #7)
  
  // Apply default language on load
  var defaultLang = Storage.get('lang', 'en');
  setLanguage(defaultLang);
  
  // Sync favicon on load
  var activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateFavicon(activeTheme);

  // Re-run setLanguage on a 0ms timeout to catch and translate dynamically generated DOM items
  setTimeout(function() {
    setLanguage(Storage.get('lang', 'en'));
    renderUserSession();
  }, 0);
});

