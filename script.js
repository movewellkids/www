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

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonials-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    dotsContainer.children[current].classList.remove('is-active');
    dotsContainer.children[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    slides[current].setAttribute('aria-hidden', 'false');
    dotsContainer.children[current].classList.add('is-active');
    dotsContainer.children[current].setAttribute('aria-selected', 'true');
  }

  // Initialise first slide
  slides[0].classList.add('is-active');

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
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
