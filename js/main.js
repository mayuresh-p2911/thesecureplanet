/**
 * THE SECURE PLANET — Redesigned Modern Interactive Engine (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTickerLoop();
  initSearchModal();
  initCategoryFilter();
  initCommentTabs();
  initRandomPost();
  initShareButtons();
  initMobileMenu();
  initScrollReveal();
  initNavbarShadow();
});

/* ==========================================================================
   SCROLL REVEAL — staggered card entrances (no-JS safe: .reveal only
   exists once this runs, and only when IntersectionObserver is supported)
   ========================================================================== */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.article-card, .side-feature-card, .sidebar-widget, .hero-main-card'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  let stagger = 0;
  targets.forEach((el) => {
    el.classList.add('reveal');
    // small cascading delay per element, capped so late cards never lag
    el.style.setProperty('--reveal-delay', `${Math.min(stagger, 0.3)}s`);
    stagger += 0.06;
    observer.observe(el);
  });
}

/* ==========================================================================
   NAVBAR — soft shadow once the page is scrolled
   ========================================================================== */
function initNavbarShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ==========================================================================
   TICKER — duplicate items so the -50% slide loops seamlessly
   ========================================================================== */
function initTickerLoop() {
  const track = document.querySelector('.ticker-items');
  if (!track || track.dataset.cloned) return;
  track.innerHTML += track.innerHTML;
  track.dataset.cloned = 'true';
}

/* ==========================================================================
   SEARCH MODAL
   ========================================================================== */
function initSearchModal() {
  const searchBtn = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');

  if (!searchModal) return;

  const openModal = () => {
    searchModal.classList.add('open');
    if (searchInput) searchInput.focus();
  };

  const closeModal = () => {
    searchModal.classList.remove('open');
  };

  if (searchBtn) searchBtn.addEventListener('click', openModal);
  if (searchClose) searchClose.addEventListener('click', closeModal);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openModal();
    } else if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Live filter simulation in search modal
  const resultsContainer = document.getElementById('search-results-list');
  if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const articles = document.querySelectorAll('.article-card');
      resultsContainer.innerHTML = '';
      
      if (query.length === 0) return;

      let count = 0;
      articles.forEach((article) => {
        const title = article.querySelector('.article-title')?.textContent || '';
        const excerpt = article.querySelector('.article-excerpt')?.textContent || '';
        const link = article.querySelector('.article-title a')?.getAttribute('href') || '#';
        
        if (title.toLowerCase().includes(query) || excerpt.toLowerCase().includes(query)) {
          count++;
          const item = document.createElement('a');
          item.href = link;
          item.className = 'popular-item';
          item.style.padding = '12px';
          item.innerHTML = `
            <div class="popular-title" style="font-size:0.95rem;">
              <div>${title}</div>
              <small style="color:var(--text-muted)">Matched in content</small>
            </div>
          `;
          resultsContainer.appendChild(item);
        }
      });

      if (count === 0) {
        resultsContainer.innerHTML = `<div style="color:var(--text-muted);padding:12px;">No articles found matching "${query}"</div>`;
      }
    });
  }
}

/* ==========================================================================
   CATEGORY FILTER PILLS (MAIN FEED)
   ========================================================================== */
function initCategoryFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const articles = document.querySelectorAll('.article-card');

  if (!pills.length || !articles.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      articles.forEach((article) => {
        const category = article.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          article.style.display = '';
          article.style.opacity = '0';
          setTimeout(() => {
            article.style.opacity = '1';
          }, 50);
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   INTERACTIVE COMMENT TABS (POST PAGE)
   ========================================================================== */
function initCommentTabs() {
  const tabBtns = document.querySelectorAll('.comment-tab-btn');
  const tabPanes = document.querySelectorAll('.comment-pane');

  if (!tabBtns.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach((pane) => {
        if (pane.getAttribute('data-pane') === target) {
          pane.style.display = 'block';
        } else {
          pane.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   RANDOM POST NAVIGATION
   ========================================================================== */
function initRandomPost() {
  const randomBtns = document.querySelectorAll('.random-post-btn');
  const posts = [
    'https://www.thesecureplanet.com/2023/09/a-free-retro-video-game-emulator.html',
    'https://www.thesecureplanet.com/2023/09/amazing-website-find-if-your-property.html',
    'https://www.thesecureplanet.com/2023/09/free-program-find-if-your-computer-is.html',
    'https://www.thesecureplanet.com/2023/09/open-source-best-image-forensic-toolset.html',
    'https://www.thesecureplanet.com/2023/09/monitor-ipv4-utilization-for-amazon-vpc.html',
    'https://www.thesecureplanet.com/2023/09/free-program-reminds-you-on-taking.html',
    'https://www.thesecureplanet.com/2023/08/job-data-protection-officer-dpo.html'
  ];

  randomBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const randomIndex = Math.floor(Math.random() * posts.length);
      window.location.href = posts[randomIndex];
    });
  });
}

/* ==========================================================================
   SHARE BUTTONS / TOAST NOTIFICATION
   ========================================================================== */
function initShareButtons() {
  const copyBtn = document.getElementById('copy-link-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const originalIcon = copyBtn.innerHTML;
      copyBtn.innerHTML = `<i class="fa fa-check" style="color:#10B981;"></i>`;
      setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
      }, 2000);
    });
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('mobile-open');
    const icon = toggle.querySelector('i');
    if (icon) {
      if (navLinks.classList.contains('mobile-open')) {
        icon.className = 'fa fa-times';
      } else {
        icon.className = 'fa fa-bars';
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('mobile-open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('mobile-open');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fa fa-bars';
    }
  });
}
