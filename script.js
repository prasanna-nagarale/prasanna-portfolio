/* ══════════════════════════════════════════════════════
   PRASANNA NAGARALE — EDITORIAL PORTFOLIO
   script.js — All interactions, animations, 3D effects
══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════════════════════
     PRESS LOADER
  ═══════════════════════════════════ */
  const loader  = document.getElementById('pressLoader');
  const plBar   = document.getElementById('plBar');
  const plPct   = document.getElementById('plPct');
  const plHl    = document.getElementById('plHeadline');

  const messages = [
    'Going to press…',
    'Setting the type…',
    'Laying out the spreads…',
    'Inking the plates…',
    'Running the press…',
    'First edition ready.'
  ];

  let progress = 0;
  let msgIdx = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) progress = 100;

    plBar.style.width  = progress + '%';
    plPct.textContent  = Math.floor(progress) + '%';

    const newIdx = Math.min(Math.floor(progress / 20), messages.length - 1);
    if (newIdx !== msgIdx) {
      msgIdx = newIdx;
      plHl.style.opacity = '0';
      setTimeout(() => {
        plHl.textContent  = messages[msgIdx];
        plHl.style.opacity = '1';
      }, 300);
    }

    if (progress >= 100) {
      clearInterval(loaderInterval);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.add('loaded');
        initAll();
      }, 600);
    }
  }, 80);


  /* ═══════════════════════════════════
     INIT ALL
  ═══════════════════════════════════ */
  function initAll() {
    initCursor();
    initNav();
    initScrollProgress();
    initReveal();
    initTiltCards();
    initMag3D();
    initCounters();
    initForm();
    initActiveNav();
  }


  /* ═══════════════════════════════════
     CURSOR
  ═══════════════════════════════════ */
  function initCursor() {
    const cursor = document.getElementById('cursor');
    const trail  = document.getElementById('cursorTrail');
    if (!cursor || !trail) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mx = -200, my = -200;
    let tx = -200, ty = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Trail follows with lag
    function animTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(animTrail);
    }
    animTrail();

    // Hover state on interactive elements
    const hoverEls = document.querySelectorAll(
      'a, button, .tilt-card, .feat, .pq, .skc, .pc'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        trail.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        trail.classList.remove('hovering');
      });
    });
  }


  /* ═══════════════════════════════════
     NAV
  ═══════════════════════════════════ */
  function initNav() {
    const nav    = document.getElementById('nav');
    const ham    = document.getElementById('navHam');
    const mobile = document.getElementById('navMobile');

    // Scroll background
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mobile.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });

    // Close mobile nav on link click
    mobile.querySelectorAll('.nm-link').forEach(link => {
      link.addEventListener('click', () => {
        ham.classList.remove('open');
        mobile.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ═══════════════════════════════════
     SCROLL PROGRESS BAR
  ═══════════════════════════════════ */
  function initScrollProgress() {
    const fill = document.getElementById('spFill');
    if (!fill) return;
    const update = () => {
      const total  = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
      fill.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ═══════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════ */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('shown');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }


  /* ═══════════════════════════════════
     3D TILT CARDS (mouse tracking)
  ═══════════════════════════════════ */
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    const MAX_TILT = 8; // degrees

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r    = card.getBoundingClientRect();
        const cx   = r.left + r.width  / 2;
        const cy   = r.top  + r.height / 2;
        const dx   = (e.clientX - cx) / (r.width  / 2);
        const dy   = (e.clientY - cy) / (r.height / 2);
        const rx   = -dy * MAX_TILT;
        const ry   =  dx * MAX_TILT;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = 'transform .08s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .55s var(--ease)';
      });
    });
  }


  /* ═══════════════════════════════════
     3D MAGAZINE — mouse parallax
  ═══════════════════════════════════ */
  function initMag3D() {
    const mag = document.getElementById('mag3d');
    if (!mag) return;
    // Touch devices keep the static CSS tilt — no JS needed
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let bX = -18, bY = -18, bZ = -1.5;
    let tX = bX, tY = bY, tZ = bZ;
    let cX = bX, cY = bY, cZ = bZ;

    document.addEventListener('mousemove', e => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      tX = bX + ny * 5;
      tY = bY - nx * 5;
      tZ = bZ + nx * 1.2;
    });

    function loop() {
      cX += (tX - cX) * 0.055;
      cY += (tY - cY) * 0.055;
      cZ += (tZ - cZ) * 0.055;
      mag.style.transform = `rotateY(${cY}deg) rotateX(${cX}deg) rotateZ(${cZ}deg)`;
      requestAnimationFrame(loop);
    }
    loop();
  }


  /* ═══════════════════════════════════
     ANIMATED COUNTERS
  ═══════════════════════════════════ */
  function initCounters() {
    const counters = document.querySelectorAll('.sv[data-target]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        animateCounter(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target);
    const suffix  = el.dataset.suffix || '';
    const dec     = parseInt(el.dataset.dec || '0');
    const dur     = 1600;
    const start   = performance.now();

    function step(now) {
      const t    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4); // ease-out-quart
      const val  = target * ease;
      el.textContent = val.toFixed(dec) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  /* ═══════════════════════════════════
     CONTACT FORM
  ═══════════════════════════════════ */
function initForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('submitBtn');
  const defSpan = document.getElementById('subDef');
  const sentSpan = document.getElementById('subSent');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    defSpan.style.display = 'none';
    sentSpan.style.display = 'inline';
    btn.classList.add('sent');

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
    } catch (err) {
      console.error('Form error:', err);
    }

    setTimeout(() => {
      btn.classList.remove('sent');
      defSpan.style.display = 'inline';
      sentSpan.style.display = 'none';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}


  /* ═══════════════════════════════════
     ACTIVE NAV LINK ON SCROLL
  ═══════════════════════════════════ */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nl');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === '#' + e.target.id;
            link.classList.toggle('active', active);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(sec => obs.observe(sec));
  }


  /* ═══════════════════════════════════
     PARALLAX ON HERO GEOMETRICS
  ═══════════════════════════════════ */
  (function initParallax() {
    const geos = document.querySelectorAll('.geo');
    if (!geos.length) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', e => {
      const nx = (e.clientX / window.innerWidth  - 0.5);
      const ny = (e.clientY / window.innerHeight - 0.5);
      geos.forEach((g, i) => {
        const depth = (i + 1) * 8;
        g.style.transform = `translate(${nx * depth}px, ${ny * depth}px) rotate(${nx * 5}deg)`;
      });
    });
  })();


  /* ═══════════════════════════════════
     SMOOTH SCROLL for anchor links
  ═══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ═══════════════════════════════════
     SKILL TAG HOVER WAVE
  ═══════════════════════════════════ */
  (function initSkillWave() {
    const clusters = document.querySelectorAll('.skc');
    clusters.forEach(cluster => {
      const tags = cluster.querySelectorAll('.sk');
      cluster.addEventListener('mouseenter', () => {
        tags.forEach((tag, i) => {
          setTimeout(() => {
            tag.style.background = 'var(--wine)';
            tag.style.borderColor = 'var(--wine)';
            tag.style.color = 'var(--paper)';
          }, i * 40);
        });
      });
      cluster.addEventListener('mouseleave', () => {
        tags.forEach(tag => {
          tag.style.background = '';
          tag.style.borderColor = '';
          tag.style.color = '';
        });
      });
    });
  })();


  /* ═══════════════════════════════════
     FEATURED CARD PARALLAX SHIFT
  ═══════════════════════════════════ */
  (function initFeatParallax() {
    const feat = document.querySelector('.feat');
    if (!feat) return;

    feat.addEventListener('mousemove', e => {
      const r  = feat.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      const hl = feat.querySelector('.feat-hl');
      if (hl) {
        hl.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
        hl.style.transition = 'transform .15s ease';
      }
    });
    feat.addEventListener('mouseleave', () => {
      const hl = feat.querySelector('.feat-hl');
      if (hl) { hl.style.transform = ''; hl.style.transition = 'transform .6s ease'; }
    });
  })();


  /* ═══════════════════════════════════
     SECTION ENTRANCE TYPOGRAPHY EFFECT
     (project card names stagger on scroll)
  ═══════════════════════════════════ */
  (function initCardStagger() {
    const grid = document.querySelector('.proj-grid');
    if (!grid) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const names = grid.querySelectorAll('.pc-name');
        names.forEach((n, i) => {
          n.style.opacity = '0';
          n.style.transform = 'translateX(-12px)';
          setTimeout(() => {
            n.style.transition = 'opacity .5s ease, transform .5s ease';
            n.style.opacity = '1';
            n.style.transform = 'none';
          }, 120 + i * 60);
        });
        obs.unobserve(entries[0].target);
      }
    }, { threshold: 0.15 });
    obs.observe(grid);
  })();


  /* ═══════════════════════════════════
     PULLQUOTE TILT ON SCROLL
  ═══════════════════════════════════ */
  (function initPQScroll() {
    const pq = document.querySelector('.pq');
    if (!pq) return;
    const update = () => {
      const r = pq.getBoundingClientRect();
      const vc = window.innerHeight / 2;
      const delta = (r.top + r.height / 2 - vc) / window.innerHeight;
      pq.style.transform = `rotateZ(${-0.8 + delta * 1.5}deg)`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();


  /* ═══════════════════════════════════
     PAGE LOAD POLISH — flash prevention
  ═══════════════════════════════════ */
  // Body starts opacity:0, becomes 1 after loader
  // Already handled by CSS + initAll() above

})();