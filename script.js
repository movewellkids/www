// =============================================================================
// Theme toggle
// =============================================================================
(function () {
  const THEME_KEY = 'mwk-theme';

  function applyTheme(theme) {
    if (theme === 'warm') {
      document.documentElement.setAttribute('data-theme', 'warm');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      const label = theme === 'warm' ? 'Switch to default theme' : 'Switch to warm theme';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
  }

  function initThemeToggle() {
    const saved = localStorage.getItem(THEME_KEY) || 'default';
    applyTheme(saved);

    const headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    const label = saved === 'warm' ? 'Switch to default theme' : 'Switch to warm theme';
    btn.setAttribute('aria-label', label);
    btn.title = label;
    headerInner.appendChild(btn);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'default';
      const next = current === 'warm' ? 'default' : 'warm';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // Apply saved theme immediately to avoid flash of wrong theme
  const _saved = localStorage.getItem(THEME_KEY);
  if (_saved === 'warm') document.documentElement.setAttribute('data-theme', 'warm');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

// =============================================================================
// Header scroll shadow
// =============================================================================
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
}

// =============================================================================
// Copyright year
// =============================================================================
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// =============================================================================
// Hamburger nav toggle
// =============================================================================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('main-nav-list');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
  // Close nav when a link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =============================================================================
// Scroll-triggered entrance animations
// =============================================================================
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animateEls = document.querySelectorAll(
    '.section-header, .card, .step, .trust-badge, .pricing-card, .service-card, .team-card'
  );
  if (animateEls.length && 'IntersectionObserver' in window) {
    animateEls.forEach(el => el.classList.add('animate-on-scroll'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animateEls.forEach(el => observer.observe(el));
  }
}
