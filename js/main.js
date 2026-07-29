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
  initFeaturedSlider();
  initBlogPagination();
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

/* ==========================================================================
   FEATURED POSTS SLIDER
   ========================================================================== */
function initFeaturedSlider() {
  const slides = document.querySelectorAll('.fp-slide');
  const dots   = document.querySelectorAll('.fp-dot');
  const prevBtn  = document.getElementById('fp-prev');
  const nextBtn  = document.getElementById('fp-next');
  const pauseBtn = document.getElementById('fp-pause');
  const titleEl  = document.querySelector('.fp-slider-title-text');
  const metaEl   = document.querySelector('.fp-slider-meta');

  if (!slides.length) return;

  const slideTitles = [
    'JOB - Data Protection Officer (DPO) - Mahindra Group, India',
    'Open Source - First response tool for threat hunting',
    'FREE - Security Configuration Baselines For Microsoft Products'
  ];

  const slideMetas = [
    'The Secure Planet • Aug 11 2023',
    'The Secure Planet • Sep 20 2023',
    'The Secure Planet • Aug 11 2023'
  ];

  let current = 0;
  let paused = false;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    if (titleEl) titleEl.textContent = slideTitles[current];
    if (metaEl)  metaEl.textContent  = slideMetas[current];
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => { if (!paused) goTo(current + 1); }, 4000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startTimer(); });

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.innerHTML = paused
        ? '<i class="fa fa-play"></i>'
        : '<i class="fa fa-pause"></i>';
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  startTimer();
}

/* ==========================================================================
   BLOG PAGE PAGINATION (Interactive Page Switcher)
   ========================================================================== */
function initBlogPagination() {
  const pageNums = document.querySelectorAll('.page-num');
  const countEl  = document.getElementById('current-page-num');
  const nextBtn  = document.getElementById('page-next');
  const lastBtn  = document.getElementById('page-last');
  const feedHeader = document.querySelector('.section-header');

  if (!pageNums.length || !countEl) return;

  let currentPage = 1;
  const maxPages = 21;

  function updatePage(page) {
    if (page < 1 || page > maxPages) return;
    currentPage = page;
    countEl.textContent = currentPage;

    pageNums.forEach(num => {
      const pageVal = parseInt(num.dataset.page, 10);
      if (pageVal === currentPage) {
        num.classList.add('active');
      } else {
        num.classList.remove('active');
      }
    });

    if (feedHeader) {
      feedHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  pageNums.forEach(num => {
    num.addEventListener('click', (e) => {
      e.preventDefault();
      const pageVal = parseInt(num.dataset.page, 10);
      if (!isNaN(pageVal)) updatePage(pageVal);
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updatePage(currentPage + 1);
    });
  }

  if (lastBtn) {
    lastBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updatePage(maxPages);
    });
  }
}
