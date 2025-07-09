// main.js - CMCBIZTECH Website

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const menu = document.getElementById('mobile-menu');
        if (menu && !menu.classList.contains('opacity-0')) {
          menu.classList.add('opacity-0', 'pointer-events-none');
          menu.classList.remove('opacity-100');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // Mobile menu toggle functionality (updated for new header)
  function setupMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    if (toggle && menu && closeBtn) {
      toggle.onclick = function() {
        menu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      };
      closeBtn.onclick = function() {
        menu.classList.add('hidden');
        document.body.style.overflow = '';
      };
      // Close menu on nav link click (for mobile)
      menu.querySelectorAll('a').forEach(link => {
        link.onclick = function() {
          menu.classList.add('hidden');
          document.body.style.overflow = '';
        };
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          menu.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // Highlight active nav link with gold underline
  function highlightActiveNav() {
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === path) {
        link.classList.add('text-[#C29D59]', 'font-bold', 'border-b-2', 'border-[#C29D59]');
      } else {
        link.classList.remove('text-[#C29D59]', 'font-bold', 'border-b-2', 'border-[#C29D59]');
      }
    });
  }

  // Sticky header: shadow & auto-hide on scroll down, show on up
  let lastScrollY = window.scrollY;
  let ticking = false;
  const header = document.querySelector('header');
  if (header) {
    header.classList.add('transition-all', 'duration-300', 'backdrop-blur-md', 'shadow-lg');
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 60) {
            header.classList.add('shadow-xl');
            if (window.scrollY > lastScrollY) {
              header.classList.add('-translate-y-full');
            } else {
              header.classList.remove('-translate-y-full');
            }
          } else {
            header.classList.remove('shadow-xl', '-translate-y-full');
          }
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Focus ring for nav links/buttons
  const focusStyle = 'ring-2 ring-[#C29D59] ring-offset-2';
  document.body.addEventListener('focusin', e => {
    if (e.target.matches('.nav-link, button, a')) {
      e.target.classList.add(...focusStyle.split(' '));
    }
  });
  document.body.addEventListener('focusout', e => {
    if (e.target.matches('.nav-link, button, a')) {
      e.target.classList.remove(...focusStyle.split(' '));
    }
  });

  // Dynamic header loading
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(data => {
        headerContainer.innerHTML = data;
        setupMobileMenu();
        highlightActiveNav();
      })
      .catch(error => {
        console.error('Error loading header:', error);
      });
  } else {
    setupMobileMenu();
    highlightActiveNav();
  }

  // Dynamic footer loading
  const footerContainer = document.getElementById('footer');
  if (footerContainer) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
      });
  }

  // Bulletproof Hero Slideshow Logic
  (function heroSlideshowInit() {
    let initialized = false;
    let observer;

    function setupHeroSlideshow() {
      const slideshow = document.getElementById('hero-slideshow');
      if (!slideshow || initialized) return;
      const slides = slideshow.querySelectorAll('.hero-slide');
      const dots = slideshow.querySelectorAll('.hero-dot');
      const captions = slideshow.querySelectorAll('.hero-caption');
      const prevBtn = document.getElementById('slide-prev');
      const nextBtn = document.getElementById('slide-next');
      let current = 0;
      let interval;

      function showSlide(idx) {
        // Defensive: clamp idx
        if (idx < 0) idx = slides.length - 1;
        if (idx >= slides.length) idx = 0;
        slides.forEach((slide, i) => {
          slide.classList.toggle('opacity-100', i === idx);
          slide.classList.toggle('opacity-0', i !== idx);
          slide.classList.toggle('z-10', i === idx);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('bg-[#C29D59]', i === idx);
          dot.classList.toggle('bg-white', i !== idx);
          dot.classList.toggle('opacity-80', i === idx);
          dot.classList.toggle('opacity-50', i !== idx);
        });
        captions.forEach((caption, i) => {
          caption.classList.toggle('opacity-100', i === idx);
          caption.classList.toggle('opacity-0', i !== idx);
        });
        current = idx;
      }
      function nextSlide() {
        showSlide((current + 1) % slides.length);
      }
      function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
      }
      function startAuto() {
        stopAuto(); // Always clear before starting
        interval = setInterval(nextSlide, 5000);
      }
      function stopAuto() {
        if (interval) clearInterval(interval);
        interval = null;
      }
      if (slides.length > 1 && captions.length === slides.length) {
        showSlide(0);
        startAuto();
        if (nextBtn) nextBtn.onclick = () => { nextSlide(); stopAuto(); startAuto(); };
        if (prevBtn) prevBtn.onclick = () => { prevSlide(); stopAuto(); startAuto(); };
        dots.forEach((dot, i) => {
          dot.onclick = () => { showSlide(i); stopAuto(); startAuto(); };
        });
        slideshow.addEventListener('mouseenter', stopAuto);
        slideshow.addEventListener('mouseleave', startAuto);
        slideshow.setAttribute('tabindex', '0');
        slideshow.addEventListener('keydown', e => {
          if (e.key === 'ArrowLeft') { prevSlide(); stopAuto(); startAuto(); }
          if (e.key === 'ArrowRight') { nextSlide(); stopAuto(); startAuto(); }
        });
      }
      initialized = true;
    }

    // Try to initialize immediately
    setupHeroSlideshow();

    // Use MutationObserver to re-initialize if DOM changes (e.g. header/footer loaded)
    observer = new MutationObserver(() => {
      if (!initialized) setupHeroSlideshow();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also re-initialize on window load (for good measure)
    window.addEventListener('load', () => {
      if (!initialized) setupHeroSlideshow();
    });
  })();
}); 