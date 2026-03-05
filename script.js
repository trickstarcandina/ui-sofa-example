/**
 * Kalix — Premium Sofa Website
 * Scroll animations, custom cursor, parallax, counter, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADING SCREEN =====
  const loader = document.getElementById('loader');
  const heroBg = document.getElementById('heroBg');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero Ken Burns effect
      setTimeout(() => heroBg.classList.add('loaded'), 100);
    }, 2000);
  });

  // Fallback: remove loader after 4s even if load event is slow
  setTimeout(() => {
    loader.classList.add('hidden');
    heroBg.classList.add('loaded');
  }, 4000);


  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('cursor');
  let cursorX = 0, cursorY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Smooth cursor follow
  function animateCursor() {
    const dx = cursorX - currentX;
    const dy = cursorY - currentY;
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .collection-card, .lookbook-item, .swatch');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });


  // ===== NAVIGATION SCROLL BEHAVIOR =====
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });


  // ===== SCROLL-TRIGGERED REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ===== PARALLAX EFFECT ON HERO =====
  const hero = document.getElementById('hero');
  const heroImg = heroBg.querySelector('img');

  function handleParallax() {
    const scrolled = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
      const parallaxValue = scrolled * 0.35;
      heroImg.style.transform = `scale(${heroBg.classList.contains('loaded') ? 1 : 1.1}) translateY(${parallaxValue}px)`;
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(handleParallax);
  });


  // ===== COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString('vi-VN');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(el => counterObserver.observe(el));


  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = nav.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });


  // ===== COLOR SWATCH INTERACTION =====
  document.querySelectorAll('.collection-card-swatches').forEach(swatchGroup => {
    const swatches = swatchGroup.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        // Ripple effect on the card
        const card = swatch.closest('.collection-card');
        const color = swatch.style.background;
        card.style.boxShadow = `0 0 0 2px ${color}, 0 8px 40px rgba(0,0,0,0.12)`;
        setTimeout(() => {
          card.style.boxShadow = '';
        }, 600);
      });
    });
  });


  // ===== COLLECTION CARD TILT EFFECT =====
  const cards = document.querySelectorAll('.collection-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease-out';
    });
  });


  // ===== LOOKBOOK MASONRY-LIKE HOVER =====
  const lookbookItems = document.querySelectorAll('.lookbook-item');

  lookbookItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      lookbookItems.forEach(other => {
        if (other !== item) {
          other.style.opacity = '0.6';
          other.style.filter = 'saturate(0.4)';
        }
      });
    });

    item.addEventListener('mouseleave', () => {
      lookbookItems.forEach(other => {
        other.style.opacity = '1';
        other.style.filter = 'saturate(1)';
      });
    });
  });


  // ===== MOBILE NAV TOGGLE =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  let mobileMenuOpen = false;

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      mobileMenuOpen = !mobileMenuOpen;

      if (mobileMenuOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'fixed';
        navLinks.style.top = '0';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.bottom = '0';
        navLinks.style.background = 'rgba(250, 248, 245, 0.98)';
        navLinks.style.backdropFilter = 'blur(20px)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.alignItems = 'center';
        navLinks.style.justifyContent = 'center';
        navLinks.style.gap = '2rem';
        navLinks.style.zIndex = '999';

        navLinks.querySelectorAll('a').forEach(a => {
          a.style.color = 'var(--color-text)';
          a.style.fontSize = '1.2rem';
        });
      } else {
        navLinks.style = '';
      }
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (mobileMenuOpen) {
          mobileMenuOpen = false;
          navLinks.style = '';
        }
      });
    });
  }


  // ===== CRAFT FEATURES STAGGER =====
  const craftFeatures = document.querySelectorAll('.craft-feature');
  const craftObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 150);
        craftObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  craftFeatures.forEach(feature => {
    feature.style.opacity = '0';
    feature.style.transform = 'translateX(-20px)';
    feature.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    craftObserver.observe(feature);
  });


  // ===== LOOKBOOK ITEMS TRANSITION =====
  lookbookItems.forEach(item => {
    item.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
  });


  // ===== PAGE VISIBILITY - PAUSE ANIMATIONS =====
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.style.animationPlayState = 'paused';
    } else {
      document.body.style.animationPlayState = 'running';
    }
  });

});
