'use strict';

/* ══════════════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════════════ */
(function () {
  const log   = document.getElementById('boot-log');
  const bar   = document.getElementById('boot-bar');
  const ready = document.getElementById('boot-ready');
  const boot  = document.getElementById('boot');

  const lines = [
    { t:0,    cls:'bl-info', txt:'[    0.000] PNOS kernel 1.0.0 initializing...' },
    { t:200,  cls:'bl-ok',   txt:'[    0.198] CPU: AI Processing Units — 8 cores OK' },
    { t:380,  cls:'bl-ok',   txt:'[    0.381] MEM: 16384MB DDR5 — OK' },
    { t:540,  cls:'bl-ok',   txt:'[    0.542] genai_llms.ko — loaded' },
    { t:700,  cls:'bl-ok',   txt:'[    0.701] agent_frameworks.ko — loaded' },
    { t:860,  cls:'bl-ok',   txt:'[    0.862] ml_data_science.ko — loaded' },
    { t:1020, cls:'bl-warn', txt:'[    1.021] HuggingFace cache: 2 models found' },
    { t:1180, cls:'bl-ok',   txt:'[    1.182] Network: github.com — reachable' },
    { t:1340, cls:'bl-ok',   txt:'[    1.341] Starting session: prasanna@PNOS' },
    { t:1500, cls:'bl-info', txt:'[    1.501] All systems operational.' },
  ];

  let prog = 0;
  lines.forEach(({ t, cls, txt }) => {
    setTimeout(() => {
      const d = document.createElement('div');
      d.className = cls; d.textContent = txt;
      log.appendChild(d);
      prog += 10; bar.style.width = prog + '%';
    }, t);
  });

  setTimeout(() => { ready.style.opacity = '1'; }, 1700);

  let gone = false;
  function dismiss() {
    if (gone) return; gone = true;
    boot.classList.add('done');
    setTimeout(() => { boot.style.display = 'none'; }, 800);
  }
  setTimeout(dismiss, 2700);
  ['keydown','scroll','touchstart','click'].forEach(ev =>
    window.addEventListener(ev, dismiss, { once:true, passive:true })
  );
})();


/* ══════════════════════════════════════════
   CLOCK
══════════════════════════════════════════ */
(function () {
  const el = document.getElementById('tb-clock');
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(n => String(n).padStart(2,'0')).join(':');
  };
  tick(); setInterval(tick, 1000);
})();


/* ══════════════════════════════════════════
   NEURAL NETWORK — HERO BACKGROUND
   Full-screen, rich, colorful, AI-themed
══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes, signals;
  let active = true;
  let animFrame;

  const COLORS = ['#00ff88','#00d4ff','#ffcc00','#ff6b9d','#a78bfa'];
  const NODE_COUNT = 55;
  const CONN_DIST  = 160;

  function init() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;

    nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .32,
      vy: (Math.random() - .5) * .32,
      r:  Math.random() * 3 + 1.2,
      c:  COLORS[i % COLORS.length],
      phase: Math.random() * Math.PI * 2,
      layer: Math.floor(Math.random() * 4) // simulate layers
    }));

    // Multiple traveling signals
    signals = Array.from({ length: 8 }, () => makeSignal());
  }

  function makeSignal() {
    const f = Math.floor(Math.random() * NODE_COUNT);
    let t = Math.floor(Math.random() * NODE_COUNT);
    while (t === f) t = Math.floor(Math.random() * NODE_COUNT);
    return { f, t, p: 0, c: COLORS[Math.floor(Math.random() * COLORS.length)], speed: .006 + Math.random() * .006 };
  }

  init();
  window.addEventListener('resize', init);

  const obsHero = new IntersectionObserver(e => { active = e[0].isIntersecting; }, { threshold:.01 });
  obsHero.observe(document.getElementById('home'));

  let last = 0;
  function draw(ts) {
    animFrame = requestAnimationFrame(draw);
    if (!active) return;
    if (ts - last < 28) return; // ~35fps
    last = ts;

    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.phase += .012;
      n.x += n.vx + Math.sin(n.phase) * .08;
      n.y += n.vy + Math.cos(n.phase * .7) * .06;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < CONN_DIST) {
          const alpha = (1 - d / CONN_DIST) * 0.22;
          const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, nodes[i].c + Math.round(alpha * 255).toString(16).padStart(2,'0'));
          grad.addColorStop(1, nodes[j].c + Math.round(alpha * 255).toString(16).padStart(2,'0'));
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = .6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const pulse = Math.sin(n.phase) * .4 + .7;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = n.c + 'bb';
      ctx.shadowColor = n.c;
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Traveling signals
    signals.forEach((sig, idx) => {
      const fn = nodes[sig.f], tn = nodes[sig.t];
      const dx = tn.x - fn.x, dy = tn.y - fn.y;
      const dist = Math.hypot(dx, dy);

      if (dist < CONN_DIST) {
        const sx = fn.x + dx * sig.p;
        const sy = fn.y + dy * sig.p;

        // Trail
        for (let k = 1; k <= 5; k++) {
          const tp = Math.max(0, sig.p - k * .04);
          const tx = fn.x + dx * tp;
          const ty = fn.y + dy * tp;
          ctx.beginPath();
          ctx.arc(tx, ty, 3 - k * .4, 0, Math.PI * 2);
          ctx.fillStyle = sig.c + Math.round((1 - k/6) * 80).toString(16).padStart(2,'0');
          ctx.fill();
        }

        // Head
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = sig.c;
        ctx.shadowBlur  = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      sig.p += sig.speed;
      if (sig.p >= 1) signals[idx] = makeSignal();
    });
  }
  requestAnimationFrame(draw);
})();


/* ══════════════════════════════════════════
   SECTION AMBIENT CANVASES
   Each section gets its own subtle canvas effect
══════════════════════════════════════════ */
(function () {

  /* --- Shared tiny-dots + scan-line particle helper --- */
  function makeDots(canvas, color, count, speed) {
    const ctx = canvas.getContext('2d');
    let W, H, pts;

    function init() {
      W = canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: (Math.random() * speed + speed * .3) * (Math.random() > .5 ? 1 : -1),
        vx: (Math.random() - .5) * speed * .6,
        r:  Math.random() * 1.5 + .4,
        a:  Math.random() * .5 + .1,
      }));
    }
    init();

    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 40) return;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(p.a * 180).toString(16).padStart(2,'0');
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);

    window.addEventListener('resize', () => {
      W = canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
    });
  }

  /* --- Horizontal data-stream lines helper --- */
  function makeDataStreams(canvas, color) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const streams = [];
    const CHARS = '01<>/{}[]#@$';
    const STREAM_COUNT = 22;

    function init() {
      W = canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
      streams.length = 0;
      for (let i = 0; i < STREAM_COUNT; i++) {
        streams.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          len: Math.floor(Math.random() * 8 + 4),
          speed: Math.random() * .8 + .3,
          chars: Array.from({ length: 12 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
          head: 0, opacity: Math.random() * .18 + .04,
        });
      }
    }
    init();

    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 80) return;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      ctx.font = '11px Berkeley Mono, monospace';

      streams.forEach(s => {
        for (let k = 0; k < s.len; k++) {
          const alpha = (1 - k / s.len) * s.opacity;
          ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2,'0');
          const ci = (Math.floor(s.head) + k) % s.chars.length;
          if (Math.random() < .08) s.chars[ci] = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillText(s.chars[ci], s.x, s.y - k * 14);
        }
        s.head += s.speed;
        if (s.y > H + 80) { s.y = -20; s.x = Math.random() * W; }
        s.y += s.speed * .5;
      });
    }
    requestAnimationFrame(draw);
    window.addEventListener('resize', init);
  }

  /* --- Circuit-board grid lines --- */
  function makeCircuit(canvas, color) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const lines = [];

    function init() {
      W = canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
      lines.length = 0;
      const COUNT = 18;
      for (let i = 0; i < COUNT; i++) {
        const horiz = Math.random() > .5;
        lines.push({
          x: Math.random() * W, y: Math.random() * H,
          horiz, len: Math.random() * 180 + 60,
          speed: (Math.random() * .6 + .2) * (Math.random() > .5 ? 1 : -1),
          t: Math.random(), alpha: Math.random() * .12 + .03,
        });
      }
    }
    init();

    let last = 0;
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 50) return;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = .7;
      lines.forEach(l => {
        l.t += .004;
        if (l.t > 1) l.t = 0;
        const bright = Math.abs(Math.sin(l.t * Math.PI));
        ctx.beginPath();
        ctx.strokeStyle = color + Math.round(bright * l.alpha * 255).toString(16).padStart(2,'0');
        if (l.horiz) {
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(l.x + l.len, l.y);
        } else {
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(l.x, l.y + l.len);
        }
        ctx.stroke();
        // dot at joints
        ctx.beginPath();
        ctx.arc(l.x, l.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color + '33';
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);
    window.addEventListener('resize', init);
  }

  // Assign effects to sections
  const aboutC   = document.getElementById('about-canvas');
  const expC     = document.getElementById('exp-canvas');
  const projC    = document.getElementById('proj-canvas');
  const skillsC  = document.getElementById('skills-canvas');
  const contactC = document.getElementById('contact-canvas');

  // Use IntersectionObserver-based lazy init to avoid layout issues
  function lazyInit(el, fn) {
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { fn(); obs.disconnect(); }
    }, { threshold: .01 });
    obs.observe(el.parentElement);
  }

  lazyInit(aboutC,   () => makeDots(aboutC,   '#00ff88', 40, .25));
  lazyInit(expC,     () => makeDataStreams(expC, '#a78bfa'));
  lazyInit(projC,    () => makeDots(projC,    '#00d4ff', 35, .2));
  lazyInit(skillsC,  () => makeCircuit(skillsC, '#00d4ff'));
  lazyInit(contactC, () => makeDataStreams(contactC, '#00ff88'));

})();


/* ══════════════════════════════════════════
   HERO TERMINAL TYPEWRITER
══════════════════════════════════════════ */
(function () {
  const cmdEl    = document.getElementById('hero-cmd');
  const outputEl = document.getElementById('hero-output');
  const ctaEl    = document.getElementById('hero-cta');
  if (!cmdEl) return;

  const command = 'whoami --verbose --format=ai-engineer';
  const outputLines = [
    { delay:0,   html:'<span class="to-name">PRASANNA<br><span class="hl">NAGARALE</span></span>' },
    { delay:160, html:'<span class="to-role">AI / ML Engineer — Open to Opportunities</span>' },
    { delay:320, html:'<span class="to-line">Built <span class="hi">RAG pipelines</span>, fine-tuned <span class="hi">LLMs</span>, shipped <span class="hi">multi-agent platforms</span> at scale.</span>' },
    { delay:480, html:'<span class="to-line">500+ users in production · 99.3% ML accuracy · 2 HuggingFace models published.</span>' },
  ];

  function typeLine(idx) {
    if (idx >= command.length) {
      outputLines.forEach(({ delay, html }) => {
        setTimeout(() => {
          const d = document.createElement('div');
          d.innerHTML = html; outputEl.appendChild(d);
        }, delay + 180);
      });
      setTimeout(() => {
        ctaEl.style.display = 'flex';
        ctaEl.style.opacity = '0';
        ctaEl.style.transition = 'opacity .5s ease';
        requestAnimationFrame(() => { ctaEl.style.opacity = '1'; });
      }, outputLines.at(-1).delay + 460);
      return;
    }
    cmdEl.textContent += command[idx];
    setTimeout(() => typeLine(idx + 1), 32 + Math.random() * 18);
  }
  setTimeout(() => typeLine(0), 3100);
})();


/* ══════════════════════════════════════════
   NAV — active section + hamburger
══════════════════════════════════════════ */
(function () {
  const links    = document.querySelectorAll('.tb-link');
  const proc     = document.getElementById('tb-proc');
  const ham      = document.getElementById('tb-ham');
  const mobNav   = document.getElementById('mob-nav');
  const sections = [...document.querySelectorAll('section[id]')];

  const procMap = {
    home:'~/home', about:'cat about.sys',
    experience:'git log --experience', projects:'ls ./projects/',
    skills:'pip list --installed', contact:'ssh prasanna@nagarale.dev'
  };

  ham?.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobNav?.classList.toggle('open');
  });
  document.querySelectorAll('.mob-link,.tb-link').forEach(a => {
    a.addEventListener('click', () => {
      ham?.classList.remove('open');
      mobNav?.classList.remove('open');
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
    });
  });

  function update() {
    const mid = window.scrollY + window.innerHeight * .42;
    let cur = sections[0].id;
    sections.forEach(s => { if (s.offsetTop <= mid) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.dataset.section === cur));
    if (proc) proc.textContent = procMap[cur] || '~';
  }
  window.addEventListener('scroll', update, { passive:true });
  update();
})();


/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('shown'); obs.unobserve(e.target); }
    });
  }, { threshold:.06, rootMargin:'0px 0px -20px 0px' });
  document.querySelectorAll('.rev').forEach(el => obs.observe(el));
  setTimeout(() => document.querySelectorAll('.rev').forEach(el => el.classList.add('shown')), 5000);
})();


/* ══════════════════════════════════════════
   STAT BAR ANIMATION
══════════════════════════════════════════ */
(function () {
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.si-fill').forEach(el => {
      const w = el.style.width; el.style.width = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = w; }));
    });
    obs.disconnect();
  }, { threshold:.3 });
  const ab = document.getElementById('about');
  if (ab) obs.observe(ab);
})();


/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
(function () {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('send-btn');
  const txt  = document.getElementById('send-txt');
  const ok   = document.getElementById('form-ok');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    txt.textContent = '▶ transmitting...';
    btn.disabled = true;
    try {
      const res = await fetch('https://formspree.io/f/mzdknekw', {
        method:'POST', body:new FormData(form),
        headers:{ 'Accept':'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        ok.style.display   = 'block';
      } else {
        const d = await res.json();
        const msg = d?.errors?.map(e => e.message).join(', ') || 'Error';
        txt.textContent = `✗ ${msg}`; btn.disabled = false;
        setTimeout(() => { txt.textContent = '▶ execute send_message.sh'; }, 4000);
      }
    } catch {
      txt.textContent = '✗ Network error'; btn.disabled = false;
      setTimeout(() => { txt.textContent = '▶ execute send_message.sh'; }, 4000);
    }
  });
})();


/* ══════════════════════════════════════════
   FEATURE 1 — SYSTEM BOOT SCROLLBAR HUD
══════════════════════════════════════════ */
(function () {
  const fill   = document.getElementById('scroll-fill');
  const thumb  = document.getElementById('scroll-thumb');
  const pct    = document.getElementById('scroll-pct');
  const track  = document.getElementById('scroll-track');
  if (!fill) return;

  function update() {
    const scrollTop = window.scrollY;
    const docH      = document.documentElement.scrollHeight - window.innerHeight;
    const ratio     = docH > 0 ? Math.min(scrollTop / docH, 1) : 0;
    const p         = Math.round(ratio * 100);

    fill.style.height  = p + '%';
    pct.textContent    = p + '%';

    // Position thumb
    const trackH = track.offsetHeight;
    thumb.style.top = (ratio * (trackH - 8)) + 'px';

    // Color shift: green → cyan → purple as you scroll
    if (p < 50) {
      const t = p / 50;
      const r = Math.round(0   + t * 0);
      const g = Math.round(255 + t * (212 - 255));
      const b = Math.round(136 + t * (255 - 136));
      const col = `rgb(${r},${g},${b})`;
      fill.style.background  = `linear-gradient(to bottom, #00ff88, ${col})`;
      fill.style.boxShadow   = `0 0 8px #00ff88`;
      pct.style.color        = col;
      pct.style.textShadow   = `0 0 6px ${col}`;
      thumb.style.background = col;
      thumb.style.boxShadow  = `0 0 8px ${col}, 0 0 16px rgba(0,255,136,0.3)`;
    } else {
      const t = (p - 50) / 50;
      const r = Math.round(0   + t * 167);
      const g = Math.round(212 + t * (139 - 212));
      const b = Math.round(255 + t * (250 - 255));
      const col = `rgb(${r},${g},${b})`;
      fill.style.background  = `linear-gradient(to bottom, #00d4ff, ${col})`;
      fill.style.boxShadow   = `0 0 8px #00d4ff`;
      pct.style.color        = col;
      pct.style.textShadow   = `0 0 6px ${col}`;
      thumb.style.background = col;
      thumb.style.boxShadow  = `0 0 8px ${col}, 0 0 16px rgba(167,139,250,0.3)`;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();


/* ══════════════════════════════════════════
   FEATURE 2 — DECRYPTION HOVER ON PROJECT NAMES
   Matrix scramble → resolves to real name
══════════════════════════════════════════ */
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]|/\\@#$%^&*~!?';
  const FRAMES = 8;    // scramble frames
  const FRAME_MS = 38; // ms per frame

  function scramble(el) {
    const original = el.dataset.text || el.textContent;
    let frame = 0;
    el.classList.add('decrypting');

    const interval = setInterval(() => {
      frame++;
      if (frame >= FRAMES) {
        clearInterval(interval);
        el.textContent = original;
        el.classList.remove('decrypting');
        return;
      }
      // Each frame: reveal more correct chars from left
      const revealed = Math.floor((frame / FRAMES) * original.length);
      let out = '';
      for (let i = 0; i < original.length; i++) {
        if (i < revealed || original[i] === ' ') {
          out += original[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      el.textContent = out;
    }, FRAME_MS);
  }

  // Apply to all project name elements
  document.querySelectorAll('.pc-name[data-text], .pf-name').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    el.closest('.proj-card, .proj-flagship')?.addEventListener('mouseenter', () => {
      scramble(el);
    });
  });
})();


/* ══════════════════════════════════════════
   FEATURE 3 — LIVE UPTIME COUNTER
══════════════════════════════════════════ */
(function () {
  const el = document.getElementById('tb-uptime');
  if (!el) return;
  const start = Date.now();

  function tick() {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    el.textContent = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  }

  tick();
  setInterval(tick, 1000);
})();


/* ══════════════════════════════════════════
   FEATURE 4 — COUNT-UP NUMBER ANIMATION
   Fires when about section enters viewport
══════════════════════════════════════════ */
(function () {
  const targets = document.querySelectorAll('.si-val[data-target]');
  if (!targets.length) return;

  let fired = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function runCountUp() {
    if (fired) return;
    fired = true;

    targets.forEach(el => {
      const end      = parseFloat(el.dataset.target);
      const suffix   = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimal || '0');
      const duration = 1600;
      const startT   = performance.now();

      function frame(now) {
        const elapsed = now - startT;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOut(progress);
        const current  = end * eased;
        el.textContent = current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      }

      // Reset to 0 first
      el.textContent = '0' + suffix;
      requestAnimationFrame(frame);
    });
  }

  // Trigger on scroll into about section
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { runCountUp(); obs.disconnect(); }
  }, { threshold: 0.4 });

  const about = document.getElementById('about');
  if (about) obs.observe(about);
})();