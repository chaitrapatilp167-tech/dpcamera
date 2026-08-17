/* ============================================================
   STACKLY — Shared JavaScript
   ============================================================ */

/* ── 0. Website 3-Second Camera Loader ───────────────────── */
(function initStacklyLoader() {
  if (document.getElementById('stackly-loader')) return;

  const loader = document.createElement('div');
  loader.id = 'stackly-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-camera-wrap">
        <div class="loader-camera-ring"></div>
        <svg class="loader-camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </div>
      <div class="loader-brand">Stackly</div>
      <div class="loader-sub">Photography Studio</div>
      <div class="loader-progress-track">
        <div class="loader-progress-fill"></div>
      </div>
    </div>
  `;
  document.body.prepend(loader);

  // Auto-hide loader after 3 seconds
  setTimeout(() => {
    loader.classList.add('loader-hidden');
    setTimeout(() => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 650);
  }, 3000);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Scroll Reveal (directional) ─────────────────────── */

  // Assign directional classes automatically based on DOM position
  function assignRevealDirections() {
    // About section: image from left, text from right
    const aboutFrame = document.querySelector('.about-frame');
    const aboutCopy  = document.querySelector('.about-copy');
    if (aboutFrame) aboutFrame.classList.add('reveal-left');
    if (aboutCopy)  aboutCopy.classList.add('reveal-right');

    // Service rows: alternate left/right
    document.querySelectorAll('.service-row').forEach((row, i) => {
      row.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    });

    // Gallery items: from bottom with stagger
    document.querySelectorAll('.g-item').forEach((el, i) => {
      el.classList.add('reveal-bottom');
      el.style.transitionDelay = `${i * 80}ms`;
    });

    // Process steps: from bottom with stagger
    document.querySelectorAll('.process-step').forEach((el, i) => {
      el.classList.add('reveal-bottom');
      el.style.transitionDelay = `${i * 100}ms`;
    });

    // Journal / expertise cards: from bottom with stagger
    document.querySelectorAll('.journal-card').forEach((el, i) => {
      el.classList.add('reveal-bottom');
      el.style.transitionDelay = `${i * 110}ms`;
    });

    // Service cards (inclusions + standard): from bottom with stagger
    document.querySelectorAll('.service-card').forEach((el, i) => {
      el.classList.add('reveal-bottom');
      el.style.transitionDelay = `${i * 90}ms`;
    });

    // Section heads: from bottom
    document.querySelectorAll('.section-head').forEach(el => {
      el.classList.add('reveal-bottom');
    });

    // FAQ items: from bottom with stagger
    document.querySelectorAll('.faq-item').forEach((el, i) => {
      el.classList.add('reveal-bottom');
      el.style.transitionDelay = `${i * 80}ms`;
    });

    // Stats strip items: from bottom with stagger
    document.querySelectorAll('.stats-strip__item').forEach((el, i) => {
      el.classList.add('reveal-bottom');
      el.style.transitionDelay = `${i * 80}ms`;
    });

    // CTA band
    const ctaBand = document.querySelector('.cta-band');
    if (ctaBand) ctaBand.classList.add('reveal-bottom');

    // gallery-more buttons
    document.querySelectorAll('.gallery-more').forEach(el => {
      el.classList.add('reveal-bottom');
    });
  }

  assignRevealDirections();

  // Observer — watches all reveal variants
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-bottom').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── 2. Nav Active ───────────────────────────────────────── */
  document.querySelectorAll('.navlinks a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.navlinks a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ── 3. FAQ Accordion ────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ── 4. Filter Buttons ───────────────────────────────────── */
  document.querySelectorAll('.filters').forEach(filterGroup => {
    const targetSel = filterGroup.dataset.target;
    const target = targetSel
      ? document.querySelector(targetSel)
      : filterGroup.nextElementSibling;

    filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        if (target) {
          target.querySelectorAll('[data-cat]').forEach(item => {
            const show = filter === 'all' || item.dataset.cat === filter;
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.3s';
            setTimeout(() => {
              item.style.display = show ? '' : 'none';
              if (show) {
                requestAnimationFrame(() => {
                  item.style.opacity = '1';
                });
              }
            }, 150);
          });
        }
      });
    });
  });

  /* ── 5. Hamburger / Mobile Nav ───────────────────────────── */
  const nav = document.querySelector('.nav');
  const navlinks = document.querySelector('.navlinks');

  if (nav && navlinks) {
    const burger = document.createElement('button');
    burger.className = 'burger';
    burger.setAttribute('aria-label', 'Toggle navigation');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    // ── Inject mobile auth section (Log in + Get Started) ──
    if (!navlinks.querySelector('.mobile-auth')) {
      const navright = nav.querySelector('.navright');
      const loginHref = navright ? (navright.querySelector('.login-link')?.getAttribute('href') || 'login.html') : 'login.html';
      const getStartedHref = navright ? (navright.querySelector('.btn')?.getAttribute('href') || 'get-started.html') : 'get-started.html';

      const mobileAuth = document.createElement('li');
      mobileAuth.className = 'mobile-auth';
      mobileAuth.innerHTML = `
        <a href="${loginHref}" class="mobile-login">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Log in
        </a>
        <a href="${getStartedHref}" class="mobile-getstarted">
          Get started
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      `;
      navlinks.appendChild(mobileAuth);
    }

    burger.addEventListener('click', () => {
      navlinks.classList.toggle('open');
    });

    // Close nav when a link is clicked (includes mobile auth links)
    navlinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navlinks.classList.remove('open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        navlinks.classList.remove('open');
      }
    });
  }

});
