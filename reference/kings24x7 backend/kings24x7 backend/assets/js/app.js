/* ===== News Magazine CMS - Main Application Script ===== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    try {
      initLoadingOverlay();
      initBrokenImages();
      initTheme();
      initSidebar();
      initTooltips();
      initTableSearch();
      initSelectAll();
      initCharts();
      initMobileSearch();
      initNotifications();
      initDatePicker();
      initSlugGenerator();
      initAnimatedCounters();
      initCurrentYear();
      initHeaderSearch();
      initLogoutHandlers();
    } catch (e) {
      console.error('NewsCMS initialization error:', e);
    }
  });

  /* ===== Loading Overlay ===== */
  function initLoadingOverlay() {
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    // Hide immediately on DOM ready
    overlay.style.display = 'none';
    overlay.classList.add('d-none');
    // Also hide on full window load (in case it was shown again)
    window.addEventListener('load', function () {
      overlay.style.display = 'none';
      overlay.classList.add('d-none');
    });
    // Max fallback: hide after 2 seconds no matter what
    setTimeout(function () {
      overlay.style.display = 'none';
      overlay.classList.add('d-none');
    }, 2000);
  }

  /* ===== Broken Image Fix ===== */
  function initBrokenImages() {
    // Replace any external images that fail to load with inline SVG placeholders
    document.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      if (src.indexOf('http') === 0 || src.indexOf('//') === 0) {
        // Already broken (naturalWidth=0 on complete images)
        if (img.complete && img.naturalWidth === 0) {
          replaceImagePlaceholder(img);
        } else {
          img.addEventListener('error', function () { replaceImagePlaceholder(img); });
          // Also handle if image loads but fails visually
          img.addEventListener('load', function () {
            if (img.naturalWidth === 0) replaceImagePlaceholder(img);
          });
        }
      }
    });
  }

  function replaceImagePlaceholder(img) {
    var text = img.alt ? img.alt.charAt(0).toUpperCase() : '?';
    var w = img.getAttribute('width') || img.width || 40;
    var h = img.getAttribute('height') || img.height || 40;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="100%" height="100%" fill="#E2E8F0"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#64748B" font-size="' + Math.floor(Math.min(w, h) / 2) + '" font-weight="600" font-family="Inter">' + text + '</text></svg>';
    img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  /* ===== Theme Management ===== */
  function initTheme() {
    var savedTheme = localStorage.getItem('cms-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    var toggleBtns = document.querySelectorAll('[data-theme-toggle]');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('cms-theme', next);
        updateThemeIcon(this, next);
        toggleBtns.forEach(function (b) { updateThemeIcon(b, next); });
      });
    });
  }

  function updateThemeIcon(el, theme) {
    var icon = el.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
  }

  /* ===== Sidebar ===== */
  function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var toggleBtn = document.getElementById('sidebarToggle');
    var backdrop = document.getElementById('sidebarBackdrop');
    if (!sidebar) return;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        if (window.innerWidth < 992) {
          sidebar.classList.add('show');
          if (backdrop) backdrop.classList.add('show');
          document.body.style.overflow = 'hidden';
        } else {
          sidebar.classList.toggle('collapsed');
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        sidebar.classList.remove('show');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) {
        sidebar.classList.remove('show');
        if (backdrop) backdrop.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  /* ===== Tooltips ===== */
  function initTooltips() {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      var triggers = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      triggers.map(function (el) { return new bootstrap.Tooltip(el); });
    }
  }

  /* ===== Table Search ===== */
  function initTableSearch() {
    document.querySelectorAll('[data-table-search]').forEach(function (input) {
      input.addEventListener('keyup', function () {
        var tableId = this.getAttribute('data-table-search');
        var table = document.getElementById(tableId);
        if (!table) return;
        var term = this.value.toLowerCase();
        var rows = table.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
          row.style.display = row.textContent.toLowerCase().indexOf(term) > -1 ? '' : 'none';
        });
      });
    });
  }

  /* ===== Select All ===== */
  function initSelectAll() {
    document.querySelectorAll('[data-select-all]').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var tableId = this.getAttribute('data-select-all');
        var table = document.getElementById(tableId);
        if (!table) return;
        var cbs = table.querySelectorAll('tbody input[type="checkbox"]');
        cbs.forEach(function (cb) { cb.checked = checkbox.checked; });
      });
    });
  }

  /* ===== Charts (Chart.js) ===== */
  function initCharts() {
    if (typeof Chart === 'undefined') return;

    try {
      var trafficCtx = document.getElementById('trafficChart');
      if (trafficCtx) {
        new Chart(trafficCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Visitors',
              data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37,99,235,0.08)',
              fill: true, tension: 0.4, pointRadius: 4,
              pointBackgroundColor: '#2563EB', pointBorderColor: '#fff',
              pointBorderWidth: 2, borderWidth: 3
            }, {
              label: 'Page Views',
              data: [25000, 35000, 28000, 45000, 42000, 55000, 52000],
              borderColor: '#16A34A',
              backgroundColor: 'rgba(22,163,74,0.08)',
              fill: true, tension: 0.4, pointRadius: 4,
              pointBackgroundColor: '#16A34A', pointBorderColor: '#fff',
              pointBorderWidth: 2, borderWidth: 3
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top', labels: { usePointStyle: true, boxWidth: 6, font: { size: 12, family: 'Inter' } } },
              tooltip: { backgroundColor: '#1E293B', titleFont: { size: 13, family: 'Inter' }, bodyFont: { size: 12, family: 'Inter' }, padding: 10, cornerRadius: 8 }
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8' } },
              y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8', callback: function (v) { return v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v; } } }
            }
          }
        });
      }

      var viewsCtx = document.getElementById('viewsChart');
      if (viewsCtx) {
        new Chart(viewsCtx, {
          type: 'bar',
          data: {
            labels: ['Technology', 'Politics', 'Business', 'Sports', 'Health', 'Entertainment'],
            datasets: [{
              label: 'Views', data: [45000, 38000, 32000, 28000, 22000, 18000],
              backgroundColor: ['rgba(37,99,235,0.8)', 'rgba(22,163,74,0.8)', 'rgba(245,158,11,0.8)', 'rgba(220,38,38,0.8)', 'rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)'],
              borderRadius: 6, borderSkipped: false, barThickness: 28
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1E293B', titleFont: { size: 13, family: 'Inter' }, bodyFont: { size: 12, family: 'Inter' }, padding: 10, cornerRadius: 8 } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8' } },
              y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8', callback: function (v) { return v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v; } } }
            }
          }
        });
      }
    } catch (e) {
      console.error('Chart initialization error:', e);
    }
  }

  /* ===== Mobile Search ===== */
  function initMobileSearch() {
    var toggleBtn = document.getElementById('mobileSearchToggle');
    var searchBar = document.getElementById('mobileSearchBar');
    if (toggleBtn && searchBar) {
      toggleBtn.addEventListener('click', function () {
        searchBar.classList.toggle('d-none');
        if (!searchBar.classList.contains('d-none')) {
          searchBar.querySelector('input').focus();
        }
      });
    }
  }

  /* ===== Notifications Dropdown ===== */
  function initNotifications() {
    var notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', function () {
        var menu = this.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
          var isOpen = menu.style.display === 'block';
          document.querySelectorAll('.dropdown-menu.show, .dropdown-menu[style*="block"]').forEach(function (m) {
            m.style.display = 'none'; m.classList.remove('show');
          });
          menu.style.display = isOpen ? 'none' : 'block';
          menu.classList.add('show');
        }
      });
    }
    document.addEventListener('click', function () {
      document.querySelectorAll('.dropdown-menu[style*="block"]').forEach(function (m) {
        m.style.display = 'none'; m.classList.remove('show');
      });
    });
  }

  /* ===== Date Picker Default ===== */
  function initDatePicker() {
    document.querySelectorAll('input[type="date"]').forEach(function (el) {
      if (!el.value) {
        el.value = new Date().toISOString().split('T')[0];
      }
    });
  }

  /* ===== Slug Generator ===== */
  function initSlugGenerator() {
    var headline = document.getElementById('headline');
    var slug = document.getElementById('slug');
    if (headline && slug) {
      headline.addEventListener('keyup', function () {
        slug.value = this.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '').trim();
      });
    }
  }

  /* ===== Animated Counters (with NaN guard) ===== */
  function initAnimatedCounters() {
    var counters = document.querySelectorAll('.stat-value[data-target]');
    if (!counters.length) return;

    counters.forEach(function (counter) {
      var target = parseInt(counter.dataset.target, 10);
      // CRITICAL: Guard against NaN to prevent infinite requestAnimationFrame loop
      if (isNaN(target) || target <= 0) {
        counter.textContent = counter.dataset.target || '0';
        return;
      }
      var step = Math.max(1, Math.floor(target / 60));
      var current = 0;

      function update() {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          return;
        }
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(update);
      }
      update();
    });
  }

  /* ===== Current Year ===== */
  function initCurrentYear() {
    var el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ===== Header Search Focus ===== */
  function initHeaderSearch() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        var input = document.querySelector('.header-search .form-control');
        if (input) input.focus();
      }
    });
  }

  /* ===== Logout Handler ===== */
  function initLogoutHandlers() {
    document.querySelectorAll('.sidebar-footer .nav-item').forEach(function (item) {
      var href = item.getAttribute('href');
      if (href === '#' || href === '') {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          if (confirm('Are you sure you want to log out?')) {
            window.showToast && window.showToast('Logged out successfully.', 'success');
          }
        });
      }
    });
  }

  /* ===== Expose Global Helpers ===== */
  window.previewImage = function (input, previewId) {
    var preview = document.getElementById(previewId);
    if (!preview || !input.files || !input.files[0]) return;
    var reader = new FileReader();
    reader.onload = function (e) { preview.src = e.target.result; preview.style.display = 'block'; };
    reader.readAsDataURL(input.files[0]);
  };

  window.copyToClipboard = function (text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        showToastMsg('Copied to clipboard!', 'success');
      });
    }
  };

  function showToastMsg(message, type) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--card,#fff);border:1px solid var(--border,#E2E8F0);border-radius:12px;padding:12px 20px;box-shadow:0 10px 30px rgba(0,0,0,0.1);z-index:9999;font-size:14px;animation:fadeIn 0.3s ease;max-width:360px;display:flex;align-items:center;gap:8px;';
    toast.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-primary') + '"></i><span>' + message + '</span>';
    document.body.appendChild(toast);
    setTimeout(function () { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(function () { toast.remove(); }, 300); }, 3000);
  }
  window.showToast = showToastMsg;

  window.executeBulkAction = function () {
    var select = document.getElementById('bulkAction');
    if (!select || !select.value) { showToastMsg('Please select an action', 'warning'); return; }
    showToastMsg('Bulk action executed: ' + select.value, 'success');
  };

  window.exportData = function (format) {
    showToastMsg('Exporting as ' + format.toUpperCase() + '...', 'success');
  };

  window.confirmDelete = function (item) {
    if (confirm('Are you sure you want to delete this ' + item + '?')) {
      showToastMsg(item + ' deleted.', 'success');
    }
  };

  window.previewContent = function () {
    showToastMsg('Opening preview...', 'success');
  };

  window.generateSlug = function (inputId, outputId) {
    var input = document.getElementById(inputId);
    var output = document.getElementById(outputId);
    if (!input || !output) return;
    output.value = input.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  };

  window.toggleStatus = function (el) {
    var isActive = el.classList.contains('badge-success') || el.classList.contains('text-success');
    el.className = isActive ? 'badge bg-danger' : 'badge bg-success';
    el.textContent = isActive ? 'Inactive' : 'Active';
    showToastMsg('Status updated', 'success');
  };

})();
