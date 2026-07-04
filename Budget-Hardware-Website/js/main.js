/* ═══════════════════════════════════════════════
   BUDGET HARDWARE — Complete Motion Engine
   ═══════════════════════════════════════════════ */

const nav = document.getElementById('nav');
const menuBtn = document.getElementById('navMenuBtn');
const mobilePanel = document.getElementById('navMobilePanel');
const mobileBackdrop = document.getElementById('navMobileBackdrop');
let currentPage = document.body.getAttribute('data-page') || 'home';

/* ══════════════════════════════════════════════
   PAGE NAVIGATION
   ══════════════════════════════════════════════ */
function goPage(name) {
  const pages = document.querySelectorAll('.page');
  if (pages.length > 1) {
    pages.forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    currentPage = name;
    setActiveLinks(name);
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateNav();
    closeMobileMenu();
    // Re-run all observers on the new page content
    initReveal();
    initSplitText();
    initCurtains();
    initSeams();
    initStats();
    initTilt();
    initCursorTargets();
    initMagnetic();
    return;
  }
  const fileMap = {
    home: 'index.html', about: 'about.html', categories: 'categories.html',
    services: 'services.html', brands: 'brands.html', contact: 'contact.html'
  };
  if (fileMap[name]) window.location.href = fileMap[name];
}

function setActiveLinks(name) {
  document.querySelectorAll('.nav-links a, .nav-mobile-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === name);
  });
}

/* ══════════════════════════════════════════════
   NAV — transparent at top on every page
   ══════════════════════════════════════════════ */
function updateNav() {
  if (window.scrollY < 80) {
    nav.className = 'transparent';
  } else {
    nav.className = 'scrolled';
  }
}

/* ══════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════ */
function openMobileMenu() {
  menuBtn.classList.add('open');
  mobilePanel.classList.add('open');
  mobileBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  menuBtn.classList.remove('open');
  mobilePanel.classList.remove('open');
  mobileBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}
function toggleMobileMenu() {
  mobilePanel.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}
if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);
if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

// Close button inside panel
const mobileCloseBtn = document.querySelector('.nav-mobile-close');
if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);

/* ══════════════════════════════════════════════
   CUSTOM CURSOR with spring-lag physics
   ══════════════════════════════════════════════ */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Spring lag: stiffness 0.12 = premium silky trail
  (function loop() {
    dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  // Click pulse
  window.addEventListener('mousedown', () => ring.classList.add('clicking'));
  window.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

  window._cursorDot  = dot;
  window._cursorRing = ring;
})();

function initCursorTargets() {
  if (!window._cursorRing) return;
  const ring = window._cursorRing;
  document.querySelectorAll('.cat-card, .cat-full-img, .brand-cell, .intro-img-wrap, .about-hero img').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

/* ══════════════════════════════════════════════
   MAGNETIC BUTTONS — pull toward cursor, spring back
   ══════════════════════════════════════════════ */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;
  const STRENGTH = 0.38;

  document.querySelectorAll('.btn-primary, .btn-ghost, .btn-dark, .nav-cta, .form-submit').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      // Spring overshoot on release
      btn.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = 'translate(0,0)';
      setTimeout(() => { btn.style.transition = ''; }, 560);
    });
  });
}

/* ══════════════════════════════════════════════
   3D TILT on category cards
   ══════════════════════════════════════════════ */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const px = (e.clientX - r.left)  / r.width  - 0.5;  // -0.5 → 0.5
      const py = (e.clientY - r.top)   / r.height - 0.5;
      card.style.transform = `rotateY(${px * 10}deg) rotateX(${py * -10}deg) scale(1.025)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.75s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s';
      card.style.transform  = 'rotateY(0deg) rotateX(0deg) scale(1)';
      setTimeout(() => { card.style.transition = ''; }, 760);
    });
  });
}

/* ══════════════════════════════════════════════
   SPLIT-TEXT — headings rise line-by-line from mask
   ══════════════════════════════════════════════ */
function initSplitText() {
  document.querySelectorAll('.section-h2, .hero-h1, .cat-full-h3').forEach(h => {
    // Don't double-process
    if (h.querySelector('.split-line')) return;
    const parts = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = parts
      .map(p => `<span class="split-line"><span>${p.trim()}</span></span>`)
      .join('');
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.querySelectorAll('.split-line').forEach(l => l.classList.add('in-view'));
      io.unobserve(en.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.section-h2, .hero-h1, .cat-full-h3').forEach(h => io.observe(h));
}

/* ══════════════════════════════════════════════
   IMAGE CURTAIN REVEAL
   ══════════════════════════════════════════════ */
function initCurtains() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('curtain-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.img-curtain').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   ACCENT LINE REVEAL
   ══════════════════════════════════════════════ */
function initSeams() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('seam-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.seam').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL (base system)
   ══════════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   ANIMATED STAT COUNTERS (easeOutQuart)
   ══════════════════════════════════════════════ */
function initStats() {
  const cells = document.querySelectorAll('.stat-cell:not(.counted-init)');
  if (!cells.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const numEl  = en.target.querySelector('.stat-num');
      if (!numEl) return;
      const raw    = numEl.textContent.trim();
      const target = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, '');
      const dur    = 1800;
      const t0     = performance.now();

      (function tick(t) {
        const p      = Math.min((t - t0) / dur, 1);
        const eased  = 1 - Math.pow(1 - p, 4);   // easeOutQuart
        numEl.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else en.target.classList.add('counted');
      })(t0);

      en.target.classList.add('counted-init');
      io.unobserve(en.target);
    });
  }, { threshold: 0.6 });

  cells.forEach(c => {
    c.classList.add('counted-init');
    io.observe(c);
  });
}

/* ══════════════════════════════════════════════
   INTRO IMAGE SLIDESHOW
   ══════════════════════════════════════════════ */
(function() {
  const slides = document.querySelectorAll('.intro-img-wrap .intro-img');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4200);
})();

/* ══════════════════════════════════════════════
   MARQUEE — duplicate + velocity on scroll
   ══════════════════════════════════════════════ */
(function() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  // Duplicate for seamless loop
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
})();

(function() {
  const strip = document.querySelector('.marquee-strip');
  if (!strip) return;
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const v     = Math.abs(window.scrollY - lastY);
    lastY       = window.scrollY;
    const speed = Math.min(1 + v * 0.07, 4.5);  // cap 4.5x
    strip.style.setProperty('--marquee-speed', speed.toFixed(2));
    clearTimeout(strip._decay);
    strip._decay = setTimeout(() => strip.style.setProperty('--marquee-speed', 1), 450);
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   THREE-LAYER HERO PARALLAX
   far layer (bg) · mid layer (content) · near layer (word, counter-drift)
   ══════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const bg      = document.getElementById('heroBg');
  const content = document.querySelector('.hero-content');
  const word    = document.querySelector('.hero-word');
  if (!bg) return;

  const y   = window.scrollY;
  const vh  = window.innerHeight;
  if (y > vh) return;

  bg.style.transform = `scale(1.0) translateY(${y * 0.35}px)`;

  if (content) {
    content.style.transform = `translateY(${y * 0.15}px)`;
    content.style.opacity   = Math.max(0, 1 - y / (vh * 0.7));
  }
  if (word) {
    word.style.transform = `translateY(${y * -0.08}px)`;
  }
}, { passive: true });

/* ══════════════════════════════════════════════
   SCROLL EVENTS
   ══════════════════════════════════════════════ */
window.addEventListener('scroll', updateNav, { passive: true });

/* ══════════════════════════════════════════════
   INIT EVERYTHING
   ══════════════════════════════════════════════ */
setActiveLinks(currentPage);
updateNav();

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSplitText();
  initCurtains();
  initSeams();
  initStats();
  initTilt();
  initCursorTargets();
  initMagnetic();
});
// Guard: also fire immediately if DOM already parsed
if (document.readyState !== 'loading') {
  initReveal();
  initSplitText();
  initCurtains();
  initSeams();
  initStats();
  initTilt();
  initCursorTargets();
  initMagnetic();
}
