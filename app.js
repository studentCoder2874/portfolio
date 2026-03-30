/* ── app.js ─────────────────────────────────────────────────────────────── */

/* 1. Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* 2. Theme toggle */
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

// Load saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* 3. Hamburger nav */
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? (spans[0].style.transform = 'translateY(7px) rotate(45deg)',
       spans[1].style.opacity = '0',
       spans[2].style.transform = 'translateY(-7px) rotate(-45deg)')
    : (spans[0].style.transform = '',
       spans[1].style.opacity = '',
       spans[2].style.transform = '');
});

// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

/* 4. Navbar scroll style */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* 5. Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('[data-nav]');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* 6. GSAP Hero animation */
gsap.registerPlugin(ScrollTrigger);

const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .to('#heroEyebrow',  { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
  .to('#heroName',     { opacity: 1, y: 0, duration: 0.9 }, '-=0.4')
  .to('#heroTagline',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
  .to('#heroCta',      { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  .to('#heroScroll',   { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

// Set initial states
gsap.set(['#heroEyebrow','#heroName','#heroTagline','#heroCta','#heroScroll'], { y: 30 });

/* 7. Scroll reveals using IntersectionObserver */
const revealEls = document.querySelectorAll('.reveal');
const revealChildren = document.querySelectorAll('.reveal-child');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObs.observe(el));

// Stagger children inside cards
const childObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Find siblings in same parent, stagger them
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll('.reveal-child')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.1) + 's';
      entry.target.classList.add('in-view');
      childObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealChildren.forEach(el => childObs.observe(el));

/* 8. Skill bar animation on reveal */
const barFills = document.querySelectorAll('.bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

barFills.forEach(b => barObs.observe(b));

/* 9. GSAP ScrollTrigger — section title char animations */
document.querySelectorAll('.section-title').forEach(title => {
  gsap.fromTo(title, 
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/* 10. Timeline cards — GSAP stagger on scroll */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  gsap.fromTo(item,
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
      delay: i * 0.08,
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/* 11. Smooth anchor scrolling with offset for nav */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
