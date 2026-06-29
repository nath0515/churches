
  //SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  //Navbar shadow on scroll
  const nav = document.querySelector('.navbar-church');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(59,42,26,0.10)' : 'none';
  }, { passive: true });

  //Hero parallax
  const hero = document.querySelector('.hero-section');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });

  document.querySelectorAll('.service-card, .community-card, .reach-card, .video-card, .sermon-card, .event-card').forEach(card => {
    if (card.dataset.flipInitialized === 'true') return;

    const frontContent = card.innerHTML;
    const frontFace = document.createElement('div');
    frontFace.className = 'card-flip__face card-flip__face--front';
    frontFace.innerHTML = frontContent;

    const backFace = document.createElement('div');
    backFace.className = 'card-flip__face card-flip__face--back';
    backFace.innerHTML = `
      <span class="event-date-badge">More Info</span>
      <h5>Details Coming Soon</h5>
      <p>Add notes, directions, registration info, or a short recap here.</p>
    `;

    const inner = document.createElement('div');
    inner.className = 'card-flip__inner';
    inner.appendChild(frontFace);
    inner.appendChild(backFace);

    card.innerHTML = '';
    card.appendChild(inner);
    card.classList.add('card-flip');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Flip card');
    card.setAttribute('aria-pressed', 'false');
    card.dataset.flipInitialized = 'true';

    const toggleFlip = () => {
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    };

    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFlip();
      }
    });
  });

  // Attach reveal classes
  // Section headings
  document.querySelectorAll('.section-eyebrow, .section-title, .section-lead').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.cross-divider').forEach(el => el.classList.add('reveal'));

  // Banner
  document.querySelector('.about-banner')?.classList.add('reveal--watch');

  // Cards — stagger within their row
  document.querySelectorAll(
    '.services-section .row, .events-section .row, .communities-section .row, ' +
    '.reach-section .row:not(.g-0), .engage-section .row, .sermons-section .row'
  ).forEach(row => row.classList.add('stagger-children'));

  // Stat blocks
  document.querySelectorAll('.stat-block').forEach(el => el.classList.add('reveal', 'reveal--scale'));

  // Footer cols
  document.querySelectorAll('.site-footer .col-lg-3, .site-footer .col-lg-2').forEach(el => el.classList.add('reveal'));

  // About banner trigger
  const aboutBanner = document.querySelector('.about-banner');

  // IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains('stagger-children')) {
        [...el.children].forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), i * 90);
        });
      } else if (el === aboutBanner) {
        el.classList.add('is-visible');
      } else {
        el.classList.add('is-visible');
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Observe reveal elements
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Observe stagger rows
  document.querySelectorAll('.stagger-children').forEach(el => observer.observe(el));

  // Observe about banner
  if (aboutBanner) observer.observe(aboutBanner);

  // Stat counter animation
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start = performance.now();
    const isFloat = target !== Math.floor(target);

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('.stat-number');
      if (!numEl) return;
      const raw = numEl.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, '');
      const num = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (!isNaN(num)) animateCounter(numEl, num, suffix);
      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-block').forEach(el => statObserver.observe(el));