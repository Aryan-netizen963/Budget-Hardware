const nav = document.getElementById('nav');
const menuBtn = document.getElementById('navMenuBtn');
const mobilePanel = document.getElementById('navMobilePanel');
const mobileBackdrop = document.getElementById('navMobileBackdrop');
let currentPage = document.body.getAttribute('data-page') || 'home';

/* ── PAGE NAVIGATION ── */
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
    initReveal();
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

/* ── NAV SCROLL STATE ── */
function updateNav() {
  if (window.scrollY < 80) {
    nav.className = 'transparent';
  } else {
    nav.className = 'scrolled';
  }
}

/* ── MOBILE MENU ── */
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

/* ── SCROLL EVENTS ── */
window.addEventListener('scroll', updateNav, { passive: true });

// Hero parallax
window.addEventListener('scroll', () => {
  if (currentPage !== 'home') return;
  const bg = document.getElementById('heroBg');
  if (bg) bg.style.transform = `scale(1.0) translateY(${window.scrollY * 0.22}px)`;
}, { passive: true });

/* ── SCROLL REVEAL ── */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ── INTRO IMAGE SLIDESHOW ── */
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

/* ── MARQUEE DUPLICATE for seamless loop ── */
(function() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  // Clone content so marquee loops seamlessly
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
})();

/* ── INIT ── */
setActiveLinks(currentPage);
updateNav();
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
});
// Also run immediately in case DOM is already ready
initReveal();
