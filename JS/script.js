/* =========================================================
   DKC HEADER & NAVIGATION BEHAVIOUR
   Paste into script.js (replace the old menu code), or load
   as its own file with <script src="header.js" defer>.
   ========================================================= */
(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  const searchForm = document.getElementById('headerSearch');
  const searchInput = document.getElementById('headerSearchInput');
  if (!header || !nav || !toggle) return;

  const root = document.documentElement;
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const links = Array.from(nav.querySelectorAll('.nav-link'));

  /* ---- 1. Keep --header-h in sync (used for scroll offset + mobile panel height) ---- */
  const syncHeaderHeight = () =>
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
  syncHeaderHeight();
  if ('ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(header);
  else window.addEventListener('resize', syncHeaderHeight);

  /* ---- 2. Mobile menu ---- */
  function setMenu(open, returnFocus) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () =>
    setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);            // close after choosing a link
  });
  document.addEventListener('click', (e) => {
    if (mobileQuery.matches && !header.contains(e.target)) setMenu(false); // click outside
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
  });
  mobileQuery.addEventListener('change', () => setMenu(false)); // reset when resizing to desktop

  /* ---- 3. Shadow once the page scrolls + "last link" at page bottom ---- */
  const sections = new Map();     // section element -> nav link
  links.forEach((link) => {
    const id = (link.getAttribute('href') || '').replace('#', '');
    const el = id && document.getElementById(id);
    if (el) sections.set(el, link);
  });

  function setActive(activeLink) {
    links.forEach((l) => {
      const on = l === activeLink;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && links.length) setActive(links[links.length - 1]);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- 4. Scroll-spy: highlight the link for the section in view ---- */
  if ('IntersectionObserver' in window && sections.size) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(sections.get(entry.target));
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach((_, el) => spy.observe(el));
  }

  /* ---- 5. Search ----
     No backend yet, so submitting scrolls to the product section and
     broadcasts a "dkc:search" event. The Phase 2 product catalog will
     listen for that event and filter the grid. */
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) { searchInput.focus(); return; }
      document.dispatchEvent(new CustomEvent('dkc:search', { detail: { query } }));
      const target = document.getElementById('featured');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenu(false);
    });
  }
})();

/* =========================================================
   ANNOUNCEMENT BAR CAROUSEL
   Rotates the messages inside #announceRotator every 5 seconds.
   Pauses on hover/keyboard focus and while the tab is hidden.
   Users who prefer reduced motion get no auto-rotation (the
   dots still let them switch messages manually).
   ========================================================= */
(() => {
  'use strict';

  const rotator = document.getElementById('announceRotator');
  if (!rotator) return;

  const slides = Array.from(rotator.querySelectorAll('.announce-slide'));
  const dotsWrap = rotator.querySelector('.announce-dots');
  if (slides.length < 2) return;

  const INTERVAL = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer = null;
  let paused = false;

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show announcement ' + (i + 1) + ' of ' + slides.length);
    b.addEventListener('click', () => { show(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });

  function show(index) {
    const next = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.remove('is-prev');
      if (i === current && i !== next) s.classList.add('is-prev');
      s.classList.toggle('is-active', i === next);
      s.setAttribute('aria-hidden', String(i !== next));
    });
    dots.forEach((d, i) => {
      if (i === next) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    current = next;
  }

  function stop() { clearInterval(timer); timer = null; }
  function start() {
    if (reduceMotion.matches || paused || document.hidden || timer) return;
    timer = setInterval(() => show(current + 1), INTERVAL);
  }
  function restart() { stop(); start(); }

  rotator.addEventListener('mouseenter', () => { paused = true; stop(); });
  rotator.addEventListener('mouseleave', () => { paused = false; start(); });
  rotator.addEventListener('focusin', () => { paused = true; stop(); });
  rotator.addEventListener('focusout', () => { paused = false; start(); });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduceMotion.addEventListener('change', restart);

  show(0);
  start();
})();