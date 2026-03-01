// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');

// Testimonial carousel
function initTestimonialCarousel(carousel) {
    const pages = carousel.querySelectorAll('.testimonial-page');
    const dotsContainer = carousel.querySelector('.testimonial-dots');
    if (!pages.length || !dotsContainer) return;

    let current = 0;

    pages.forEach(function(_, i) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
        dot.addEventListener('click', function() { goTo(i); });
        dotsContainer.appendChild(dot);
    });

    function goTo(n) {
        pages[current].classList.remove('active');
        dotsContainer.querySelectorAll('.testimonial-dot')[current].classList.remove('active');
        current = (n + pages.length) % pages.length;
        pages[current].classList.add('active');
        dotsContainer.querySelectorAll('.testimonial-dot')[current].classList.add('active');
    }

    carousel.querySelector('.testimonial-prev').addEventListener('click', function() { goTo(current - 1); });
    carousel.querySelector('.testimonial-next').addEventListener('click', function() { goTo(current + 1); });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.testimonial-carousel').forEach(initTestimonialCarousel);
});