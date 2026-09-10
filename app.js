/* ── app.js ─────────────────────────────────────────────────────────────── */

/* 1. Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* 2. Hamburger nav */
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* 3. Active nav link on scroll */
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

/* 4. Skill bar fill-in on load (instant reveal, era-appropriate — no easing) */
document.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animated'));

/* 5. Hit counter count-up (classic 90s visitor counter gimmick) */
function animateCounter(el, target, pad) {
  if (!el) return;
  let count = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    el.textContent = String(count).padStart(pad, '0');
  }, 20);
}
animateCounter(document.getElementById('hitCounter'), 1234, 7);
animateCounter(document.getElementById('hitCounter2'), 1234, 4);
