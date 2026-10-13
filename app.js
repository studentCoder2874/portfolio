/**
 * PORTFOLIO JAVASCRIPT MASTERPIECE
 * Author: Hafiz Muhammad Tahir Hassan
 * Core Stack: Lenis Smooth Scroll, GSAP 3, ScrollTrigger, Three.js 3D Engine,
 *             Custom Awwwards Interactive Cursor, Magnetic Micro-Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Dynamic Footer Year ────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── 2. Lenis Smooth Scroll & GSAP Integration ─────────────────────────── */
  let lenis = null;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        }
      });
    });
  }

  /* ── 3. Real-Time Scroll Progress & Header Morphing ────────────────────── */
  const progressBar = document.getElementById('scrollProgressBar');
  const headerNav = document.getElementById('headerNav');
  const backToTopBtn = document.getElementById('backToTop');

  function onScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (progressBar && docHeight > 0) {
      const percent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }

    if (headerNav) {
      if (scrollTop > 40) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScrollProgress, { passive: true });
  onScrollProgress();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ── 4. Active Navigation Tracking on Scroll ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── 5. Mobile Navigation Drawer ───────────────────────────────────────── */
  const hamburger = document.getElementById('navHamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('[data-drawer-link]');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    hamburger?.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    hamburger?.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  /* ── 6. Awwwards Custom Interactive Cursor ─────────────────────────────── */
  const cursorDot = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('customCursorFollower');

  if (cursorDot && cursorFollower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const xToDot = gsap.quickTo(cursorDot, 'x', { duration: 0.08, ease: 'power3' });
    const yToDot = gsap.quickTo(cursorDot, 'y', { duration: 0.08, ease: 'power3' });
    const xToFollower = gsap.quickTo(cursorFollower, 'x', { duration: 0.25, ease: 'power3' });
    const yToFollower = gsap.quickTo(cursorFollower, 'y', { duration: 0.25, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    }, { passive: true });

    // Interactive Hover Scaling on Clickables
    const hoverTargets = document.querySelectorAll('a, button, .btn, .glass-card, .btn-copy, .magnetic-target');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('is-hovered');
      });
      target.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('is-hovered');
      });
    });
  }

  /* ── 7. Magnetic Button Micro-Interactions ──────────────────────────────── */
  const magneticTargets = document.querySelectorAll('.magnetic-target');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && typeof gsap !== 'undefined') {
    magneticTargets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  /* ── 8. Interactive Card Spotlight Glow & 3D Tilt ───────────────────────── */
  const glassCards = document.querySelectorAll('.glass-card');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 992) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.innerWidth > 992) {
        card.style.transform = '';
      }
    });
  });

  /* ── 9. GSAP & ScrollTrigger Staggered Motion ───────────────────────────── */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Section Staggered Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.gsap-hero-item', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.2
    });

    // Scroll-Triggered Section & Card Reveals
    if (typeof ScrollTrigger !== 'undefined') {
      const fadeElements = gsap.utils.toArray('.gsap-fade');

      fadeElements.forEach(el => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Animated Skill Progress Bars
      const skillsSec = document.getElementById('skills');
      if (skillsSec) {
        ScrollTrigger.create({
          trigger: skillsSec,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
              const target = bar.getAttribute('data-progress');
              if (target) {
                gsap.to(bar, {
                  width: target,
                  duration: 1.4,
                  ease: 'power3.out'
                });
              }
            });
          }
        });
      }

      // Interactive Counter Animations
      const statsGrid = document.getElementById('statsGrid');
      if (statsGrid) {
        ScrollTrigger.create({
          trigger: statsGrid,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            document.querySelectorAll('.stat-num.counter').forEach(el => {
              const target = parseInt(el.getAttribute('data-target') || '0', 10);
              animateValue(el, 0, target, 1200);
            });
          }
        });
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        ScrollTrigger.create({
          trigger: contactSection,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            animateValue(document.getElementById('hitCounter'), 0, 1234, 1600, 7);
            animateValue(document.getElementById('hitCounter2'), 0, 1234, 1600, 4);
          }
        });
      }
    }
  }

  /* ── 10. Smooth Eased Number Counting Function ─────────────────────────── */
  function animateValue(el, start, end, duration, pad = 0) {
    if (!el) return;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing: cubic out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * (end - start) + start);

      if (pad > 0) {
        el.textContent = String(current).padStart(pad, '0');
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        if (pad > 0) {
          el.textContent = String(end).padStart(pad, '0');
        } else {
          el.textContent = end;
        }
      }
    };

    window.requestAnimationFrame(step);
  }

  /* ── 11. Live Lahore (PKT, UTC+5) Clock ─────────────────────────────────── */
  const timeDisplay = document.getElementById('localTimeDisplay');

  function updateLahoreTime() {
    if (!timeDisplay) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      timeDisplay.textContent = `Local Time: ${formatted} (PKT · UTC+5)`;
    } catch {
      timeDisplay.textContent = `Lahore, Pakistan · PKT (UTC+5)`;
    }
  }

  updateLahoreTime();
  setInterval(updateLahoreTime, 1000);

  /* ── 12. Clipboard Copy Micro-Interactions ──────────────────────────────── */
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        btn.classList.add('copied');
        setTimeout(() => {
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });

  /* ── 13. Three.js Interactive 3D Cyber Wave & Geometric Core ───────────── */
  initThreeHero();

});

/**
 * Initializes Three.js 3D Interactive Cyber Wave & Polyhedral Core
 */
function initThreeHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const container = canvas.parentElement;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 4, 30);

  // High-Performance WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Master Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Floating Geometric Cyber Orb
  const orbGroup = new THREE.Group();
  masterGroup.add(orbGroup);

  // Outer Icosahedron Wireframe
  const icoGeometry = new THREE.IcosahedronGeometry(6.5, 2);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
  orbGroup.add(icosahedron);

  // Inner Core Polyhedron
  const coreGeometry = new THREE.IcosahedronGeometry(4, 1);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
  orbGroup.add(innerCore);

  // Glowing Orbital Torus
  const torusGeometry = new THREE.TorusGeometry(10, 0.08, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.rotation.x = Math.PI / 3;
  orbGroup.add(torus);

  // 2. Dynamic 3D Particle Terrain Wave
  const isMobile = window.innerWidth < 768;
  const numParticlesX = isMobile ? 35 : 60;
  const numParticlesZ = isMobile ? 35 : 60;
  const totalParticles = numParticlesX * numParticlesZ;
  const waveSpacing = 0.95;

  const wavePositions = new Float32Array(totalParticles * 3);
  const waveColors = new Float32Array(totalParticles * 3);

  const colCyan = new THREE.Color(0x00f0ff);
  const colIndigo = new THREE.Color(0x6366f1);
  const colBlue = new THREE.Color(0x38bdf8);

  let pIndex = 0;
  for (let ix = 0; ix < numParticlesX; ix++) {
    for (let iz = 0; iz < numParticlesZ; iz++) {
      const x = (ix - numParticlesX / 2) * waveSpacing;
      const z = (iz - numParticlesZ / 2) * waveSpacing;
      const y = -8;

      wavePositions[pIndex * 3] = x;
      wavePositions[pIndex * 3 + 1] = y;
      wavePositions[pIndex * 3 + 2] = z;

      const factor = (ix + iz) / (numParticlesX + numParticlesZ);
      const chosen = factor > 0.6 ? colCyan : (factor > 0.3 ? colBlue : colIndigo);
      waveColors[pIndex * 3] = chosen.r;
      waveColors[pIndex * 3 + 1] = chosen.g;
      waveColors[pIndex * 3 + 2] = chosen.b;

      pIndex++;
    }
  }

  const waveGeometry = new THREE.BufferGeometry();
  waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
  waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

  const waveMaterial = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
  masterGroup.add(wavePoints);

  // Position orb relative to layout
  function updateLayout() {
    if (window.innerWidth > 992) {
      orbGroup.position.set(7.5, 0.5, 0);
    } else {
      orbGroup.position.set(0, 1.5, -4);
    }
  }
  updateLayout();

  // Mouse Interaction with Lerp
  let targetRotationY = 0;
  let targetRotationX = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = normX * 0.4;
    targetRotationX = normY * 0.3;
  }, { passive: true });

  // Window Resize
  function onResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateLayout();
  }

  window.addEventListener('resize', onResize, { passive: true });

  // Pause rendering when Hero is offscreen
  let isHeroVisible = true;
  const heroSection = document.getElementById('hero');

  if (heroSection && 'IntersectionObserver' in window) {
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    heroObs.observe(heroSection);
  }

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isHeroVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Constant delicate rotation for cyber orb
    icosahedron.rotation.y += delta * 0.18;
    icosahedron.rotation.x += delta * 0.08;

    innerCore.rotation.y -= delta * 0.24;
    innerCore.rotation.z += delta * 0.12;

    torus.rotation.z += delta * 0.16;
    torus.rotation.y -= delta * 0.07;

    // Smooth inertia lerp towards mouse pointer
    masterGroup.rotation.y += (targetRotationY - masterGroup.rotation.y) * 0.045;
    masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * 0.045;

    // Dynamic wave oscillation
    const posArr = waveGeometry.attributes.position.array;
    let idx = 0;
    for (let ix = 0; ix < numParticlesX; ix++) {
      for (let iz = 0; iz < numParticlesZ; iz++) {
        const x = posArr[idx * 3];
        const z = posArr[idx * 3 + 2];
        posArr[idx * 3 + 1] = -7 + (Math.sin(x * 0.3 + elapsedTime * 1.5) * 1.4) + (Math.cos(z * 0.3 + elapsedTime * 1.5) * 1.4);
        idx++;
      }
    }
    waveGeometry.attributes.position.needsUpdate = true;

    // Subtle scroll sink
    const scrollOffset = window.scrollY || 0;
    masterGroup.position.y = -(scrollOffset * 0.008);

    renderer.render(scene, camera);
  }

  animate();
}
