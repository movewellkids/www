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
// Testimonials carousel
// =============================================================================
(function () {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.testimonials-slide'));
  const dotsContainer = carousel.querySelector('.testimonials-dots');
  const prevBtn = carousel.querySelector('.testimonials-prev');
  const nextBtn = carousel.querySelector('.testimonials-next');
  let current = 0;

  function isMobile() { return window.innerWidth <= 640; }

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonials-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.setAttribute('aria-selected', 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function showSlides() {
    const showTwo = !isMobile();
    slides.forEach((s, i) => {
      const active = i === current || (showTwo && i === (current + 1) % slides.length);
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    Array.from(dotsContainer.children).forEach((d, i) => {
      const active = i === current;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    showSlides();
  }

  // Initialise
  showSlides();

  prevBtn.addEventListener('click', () => goTo(current - (isMobile() ? 1 : 2)));
  nextBtn.addEventListener('click', () => goTo(current + (isMobile() ? 1 : 2)));
})();

// =============================================================================
// Condition dialogs (services + homepage cards)
// =============================================================================
(function () {
  const html = document.documentElement;
  const siteHeader = document.getElementById('site-header');

  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    // Measure header height so the body padding (compensating for the header
    // being switched to position:fixed) and the backdrop top offset both match.
    if (siteHeader) {
      html.style.setProperty('--header-h', siteHeader.offsetHeight + 'px');
    }
    html.classList.add('dialog-open');
    dialog.showModal();
  }

  function closeDialog() {
    html.classList.remove('dialog-open');
    html.style.removeProperty('--header-h');
  }

  document.querySelectorAll('[data-condition]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById('condition-' + trigger.dataset.condition);
      openDialog(dialog);
    });
  });

  document.querySelectorAll('.condition-dialog').forEach(dialog => {
    const closeBtn = dialog.querySelector('.condition-dialog__close');
    if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {
      if (e.target === dialog) dialog.close();
    });
    // Native close event fires for ESC, .close(), and backdrop click via above
    dialog.addEventListener('close', closeDialog);
  });
})();

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
