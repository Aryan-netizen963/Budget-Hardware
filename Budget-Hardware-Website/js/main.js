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
/* Kept for the remaining onclick buttons (Visit Store / CTAs). The in-page
   branch this used to carry was dead: it required more than one .page in the
   document, and every file ships exactly one, so it always fell through to a
   redirect. Navigation links are now real <a href> elements and don't come
   through here at all. */
function goPage(name) {
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
  // Assigning className wholesale would drop menu-open, so toggle the two
  // scroll states and leave any other state on the bar alone.
  const atTop = window.scrollY < 80;
  nav.classList.toggle('transparent', atTop);
  nav.classList.toggle('scrolled', !atTop);
}

/* ══════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════ */
function openMobileMenu() {
  menuBtn.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Close menu');
  mobilePanel.classList.add('open');
  mobileBackdrop.classList.add('open');
  // The bar sits above the drawer so the mark can morph in place; strip its
  // scrolled pill while open or it floats as a white slab over the panel.
  nav.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
  mobilePanel.classList.remove('open');
  mobileBackdrop.classList.remove('open');
  nav.classList.remove('menu-open');
  document.body.style.overflow = '';
}
function toggleMobileMenu() {
  mobilePanel.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}
if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);
if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

// The mark is now the only dismiss control, so give the drawer the escape
// route a keyboard user expects and hand focus back to what opened it.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobilePanel.classList.contains('open')) {
    closeMobileMenu();
    menuBtn.focus();
  }
});

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
  // Stacked layouts don't tilt. Guarding here means no inline transform is
  // ever written to these cards, which is what lets the CSS drop an
  // `!important` that was otherwise cancelling their entrance animation.
  const flat = () => window.matchMedia('(hover: none)').matches || window.innerWidth <= 900;
  if (flat()) return;
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (flat()) return;   // re-checked, so resizing narrow can't re-introduce it
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
   GOLD SEAM LINES
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
  const els = document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible), .pop:not(.visible)');
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
  // Observe the number itself via [data-count] rather than a layout wrapper,
  // so the count-up survives the section being re-laid-out around it.
  const nums = document.querySelectorAll('[data-count]:not(.counted-init)');
  if (!nums.length) return;

  // Counting up IS motion, and CSS cannot switch off a JS animation — so
  // honour the preference here and just print the final value.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const numEl  = en.target;
      const raw    = numEl.textContent.trim();
      const target = parseInt(raw.replace(/\D/g, ''), 10);
      const suffix = raw.replace(/[0-9]/g, '');
      io.unobserve(numEl);
      if (!Number.isFinite(target)) return;

      if (still) { numEl.textContent = target + suffix; return; }

      const dur = 1800;
      const t0  = performance.now();
      (function tick(t) {
        const p     = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);   // easeOutQuart
        numEl.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else numEl.classList.add('counted');
      })(t0);
    });
  }, { threshold: 0.6 });

  nums.forEach(n => {
    n.classList.add('counted-init');
    io.observe(n);
  });
}

/* ══════════════════════════════════════════════
   INTRO IMAGE SLIDESHOW
   ══════════════════════════════════════════════ */
(function initSlideshow() {
  const wrap = document.querySelector('.intro-img-wrap');
  if (!wrap) return;
  const slides = wrap.querySelectorAll('.intro-img');
  if (slides.length < 2) return;

  const FADE  = 750;    // keep in step with .intro-img's transition duration
  const DWELL = 3400;   // how long a frame holds before the next fade starts

  let current = 0, inView = false, timer = null;

  // Decode the next frame ahead of time. These files are 460-720KB, so an
  // undecoded image can otherwise land mid-fade as a blank rectangle.
  const warm = i => { const im = slides[i]; if (im.decode) im.decode().catch(() => {}); };

  function advance() {
    const outgoing = slides[current];
    const next = (current + 1) % slides.length;
    // Outgoing holds opaque beneath; incoming fades in above it.
    outgoing.classList.add('holding');
    outgoing.classList.remove('active');
    slides[next].classList.add('active');
    setTimeout(() => outgoing.classList.remove('holding'), FADE);
    current = next;
    warm((next + 1) % slides.length);
  }

  // A slideshow is motion, and it is also work: don't cycle it when it is
  // scrolled away, when the tab is in the background, or when the reader has
  // asked for less movement.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  function sync() {
    const shouldRun = inView && !document.hidden && !still.matches;
    if (shouldRun && !timer) timer = setInterval(advance, DWELL);
    else if (!shouldRun && timer) { clearInterval(timer); timer = null; }
  }

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0.15 }).observe(wrap);

  document.addEventListener('visibilitychange', sync);
  if (still.addEventListener) still.addEventListener('change', sync);

  warm(1);
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