/* =========================================================
   REDFALCON — Interactive Scripts
   ========================================================= */

/* ---------- Utils ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#loader').classList.add('hidden');
    initReveal();
  }, 900);
});

/* ---------- Navbar ---------- */
const nav = $('#navbar');
const navLinks = $('#navLinks');
const navToggle = $('#navToggle');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  setActiveNav();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function setActiveNav() {
  const sections = $$('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

/* ---------- Counters ---------- */
function animateCounters() {
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ---------- Scroll Reveal ---------- */
function initReveal() {
  const targets = $$('section, .service-card, .price-card, .testi-card, .about-inner, .contact-grid, .citem').filter(el => el.id !== 'home');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        requestAnimationFrame(() => e.target.classList.add('revealed'));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => {
    el.setAttribute('data-reveal', '');
    observer.observe(el);
  });

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounters(); counterObs.disconnect(); }
    });
  }, { threshold: 0.4 });
  counterObs.observe($('.hero-stats'));
}

/* ---------- GSAP Entrance Animations ---------- */
if (window.gsap) {
  gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.4, ease: 'power3.out' });
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.9, delay: 0.55, ease: 'power3.out' });
  gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 0.8, delay: 0.75, ease: 'power3.out' });
  gsap.from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, delay: 0.95, ease: 'power3.out' });
  gsap.from('.hero-stats .stat', { opacity: 0, y: 24, duration: 0.7, delay: 1.2, stagger: 0.1, ease: 'power3.out' });
}

/* ---------- Hero Particles ---------- */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  const N = () => Math.min(90, Math.floor(w / 16));
  let parts = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    parts = Array.from({ length: N() }, () => makePart(true));
  }
  function makePart(silent) {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.6 + 0.15),
      a: Math.random() * 0.7 + 0.15,
      hue: Math.random() > 0.55
    };
  }
  window.addEventListener('resize', resize);
  resize();

  const mouse = { x: -999, y: -999 };
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, makePart());
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue
        ? `rgba(255,45,45,${p.a})`
        : `rgba(255,255,255,${p.a * 0.5})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 140) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255,45,45,${0.35 * (1 - dm / 140)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      for (let j = i + 1; j < parts.length; j++) {
        const q = parts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,45,45,${0.12 * (1 - d / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- Portfolio Filter ---------- */
const filterBtns = $$('.filter-btn');
const workCards = $$('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    workCards.forEach((card, i) => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.remove('hide');
      if (!show) {
        setTimeout(() => card.classList.add('hide'), 260);
      }
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = `cardIn 0.5s ease ${i * 0.05}s both`;
      if (!show) card.style.animation = 'none';
    });
  });
});

/* ---------- Contact Form ---------- */
const contactForm = $('#contactForm');
const formStatus = $('#formStatus');
const toast = $('#toast');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const name = fd.get('name').trim();
  const email = fd.get('email').trim();
  if (!name || !email) {
    formStatus.textContent = 'Sila lengkapkan semua medan.';
    formStatus.classList.add('error');
    return;
  }
  formStatus.textContent = '';
  const btn = $('button[type="submit"]', contactForm);
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menghantar...';
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = original;
    contactForm.reset();
    formStatus.classList.remove('error');
    formStatus.textContent = '';
    showToast('Mesej anda telah dihantar! Kami akan balas segera.');
  }, 1400);
});

function showToast(msg) {
  $('span', toast).textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---------- Newsletter ---------- */
const newsBtn = $('.newsletter button');
newsBtn.addEventListener('click', () => {
  const input = $('.newsletter input');
  if (input.value.includes('@')) {
    input.value = '';
    showToast('Berjaya melanggan! Terima kasih.');
  } else {
    input.style.borderColor = 'var(--red)';
    setTimeout(() => (input.style.borderColor = ''), 1500);
  }
});

/* ---------- Tilt Effect ---------- */
$$('[data-tilt]').forEach(card => {
  if (window.innerWidth < 820) return;
  let raf;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.style.transform = `translateY(-6px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg)`;
    });
  });
  card.addEventListener('mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    card.style.transform = '';
  });
});

/* =========================================================
   CANVAS VISUALS
   ========================================================= */

/* ---------- EA Equity Charts (line charts) ---------- */
function drawEAChart(canvas, variant) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const pts = [];
  const n = 90;
  let val = variant && variant.gold ? 40 : 34;
  for (let i = 0; i < n; i++) {
    val += (Math.random() - (variant && variant.dn ? 0.62 : 0.46)) * (variant && variant.vol ? 8 : 4.5);
    val = Math.max(6, Math.min(97, val));
    pts.push(val);
  }
  if (variant && variant.trend) {
    for (let i = 0; i < n; i++) pts[i] = 20 + i * (60 / n) + (Math.random() - 0.5) * 6;
  }

  const line = ctx.createLinearGradient(0, 0, w, 0);
  line.addColorStop(0, '#ff1e1e');
  line.addColorStop(0.6, '#ff4444');
  line.addColorStop(1, '#b91c1c');

  // grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 8 + (h - 16) * (i / 4);
    ctx.beginPath(); ctx.moveTo(8, y); ctx.lineTo(w - 8, y); ctx.stroke();
  }

  // area fill
  ctx.beginPath();
  pts.forEach((v, i) => {
    const x = 8 + (w - 16) * (i / (n - 1));
    const y = h - (v / 100) * (h - 16) - 8;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(w - 8, h - 8);
  ctx.lineTo(8, h - 8);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(255,30,30,0.35)');
  grad.addColorStop(1, 'rgba(255,30,30,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // line
  ctx.beginPath();
  pts.forEach((v, i) => {
    const x = 8 + (w - 16) * (i / (n - 1));
    const y = h - (v / 100) * (h - 16) - 8;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = line;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // glow dot at end
  const lx = 8 + (w - 16);
  const ly = h - (pts[n - 1] / 100) * (h - 16) - 8;
  ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ff1e1e';
  ctx.shadowColor = '#ff1e1e'; ctx.shadowBlur = 14; ctx.fill();
  ctx.shadowBlur = 0;
}

$$('.ea-chart').forEach((c, i) => drawEAChart(c, i === 0 ? { trend: true } : null));
$$('.ea-chart-mini-canvas').forEach((c, i) => drawEAChart(c, { gold: i === 0, dn: i === 2, vol: i === 2 }));

/* ---------- Game Pixel Visuals (retro mini scenes) ---------- */
function drawGame(canvas, type) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.width * dpr; canvas.height = canvas.height * dpr;
  ctx.scale(dpr, dpr);
  const w = canvas.width / dpr, h = canvas.height / dpr;

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#14081a');
  skyGrad.addColorStop(0.5, '#200b1c');
  skyGrad.addColorStop(1, '#2a0a12');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // stars
  for (let i = 0; i < 40; i++) {
    const sx = (i * 97) % w;
    const sy = (i * 53) % (h / 2);
    ctx.fillStyle = `rgba(255,255,255,${0.15 + ((i * 7) % 6) * 0.08})`;
    ctx.fillRect(sx, sy, 2, 2);
  }

  // ground
  ctx.fillStyle = '#0d0d14';
  ctx.fillRect(0, h * 0.8, w, h * 0.2);
  ctx.fillStyle = 'rgba(255,30,30,0.35)';
  ctx.fillRect(0, h * 0.8, w, 2);

  if (type === 1) {
    // RPG: pixel hero + sword + monster
    const gx = w / 2, gy = h * 0.78;
    // monster
    drawDino(ctx, w * 0.32, h * 0.72, 26, '#4ade80');
    // hero
    drawHero(ctx, gx, gy);
    // sword slash
    ctx.save();
    ctx.translate(gx + 8, gy - 34);
    ctx.rotate(-0.5);
    ctx.fillStyle = 'rgba(255,120,120,0.8)';
    ctx.fillRect(-22, 0, 46, 4);
    ctx.restore();
    drawHUD(ctx, 'HP 100', '#22c55e', 'LV 12', w);
  } else if (type === 2) {
    // RACING: road + cars
    drawRoad(ctx, w, h);
    drawCar(ctx, w * 0.34, h * 0.62, '#ff1e1e', true);
    drawCar(ctx, w * 0.72, h * 0.55, '#3b82f6', false);
    drawHUD(ctx, '248 km/h', '#facc15', 'LAP 2/12', w);
  } else {
    // FPS: crosshair + target
    drawTarget(ctx, w * 0.68, h * 0.4, 40);
    ctx.strokeStyle = 'rgba(255,30,30,0.9)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 14, h / 2); ctx.lineTo(w / 2 + 14, h / 2);
    ctx.moveTo(w / 2, h / 2 - 14); ctx.lineTo(w / 2, h / 2 + 14);
    ctx.stroke();
    drawHUD(ctx, 'AMMO 30', '#fff', 'SCORE 9,420', w);
  }
}

function drawDetective(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width, h = canvas.height;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#0d1016');
  sky.addColorStop(0.7, '#1a1010');
  sky.addColorStop(1, '#2b0d0d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // street lamp glow
  for (let i = 0; i < 3; i++) {
    const lx = 40 + i * (w / 2.6);
    ctx.beginPath();
    ctx.arc(lx, 60, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,180,120,0.07)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,200,150,0.9)';
    ctx.fillRect(lx - 2, 56, 4, 14);
    ctx.fillStyle = 'rgba(255,220,170,0.8)';
    ctx.fillRect(lx - 14, 46, 28, 6);
  }

  // ground
  ctx.fillStyle = '#0a0a10';
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
  ctx.strokeStyle = 'rgba(255,30,30,0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = h * 0.75 + i * (h * 0.25 / 5);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // detective silhouette (coat + fedora)
  ctx.save();
  ctx.translate(w * 0.32, h * 0.74);
  ctx.fillStyle = '#111318';
  ctx.fillRect(-20, -70, 40, 74);           // coat body
  ctx.fillRect(-34, -64, 68, 18);           // coat shoulders
  ctx.fillRect(-12, -88, 26, 24);           // head
  ctx.fillStyle = '#15181f';
  ctx.fillRect(-38, -92, 78, 10);           // fedora brim
  ctx.fillRect(-16, -108, 34, 18);          // fedora crown
  ctx.fillStyle = 'rgba(255,220,170,0.9)';
  ctx.fillRect(-8, -84, 4, 4);              // eye
  ctx.restore();

  // evidence card floating
  ctx.save();
  ctx.translate(w * 0.66, h * 0.34);
  ctx.fillStyle = '#d9c7a3';
  ctx.fillRect(-40, -26, 80, 52);
  ctx.fillStyle = '#8b2222';
  ctx.fillRect(-40, -26, 80, 10);
  ctx.fillStyle = '#3a2c1e';
  ctx.font = '700 9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('EV 0004', -34, -10);
  ctx.fillText('A. Tan (44)', -34, 4);
  ctx.fillText('"Saya tak nampak..."', -34, 16);
  ctx.restore();

  // magnifying glass
  ctx.save();
  ctx.translate(w * 0.82, h * 0.6);
  ctx.rotate(0.5);
  ctx.strokeStyle = 'rgba(230,230,230,0.5)';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(230,230,230,0.5)';
  ctx.beginPath(); ctx.moveTo(18, 18); ctx.lineTo(34, 34); ctx.stroke();
  ctx.restore();

  drawHUD(ctx, 'CASE 01', '#e88a3a', 'WITNESS? 3/7', w);
}

function drawHero(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  // body
  ctx.fillStyle = '#ff1e1e';
  ctx.fillRect(-4, -26, 9, 14);
  // head
  ctx.fillStyle = '#ffb07c';
  ctx.fillRect(-3, -36, 7, 8);
  // helmet
  ctx.fillStyle = '#8b0000';
  ctx.fillRect(-4, -40, 9, 5);
  // eye
  ctx.fillStyle = '#111';
  ctx.fillRect(0, -33, 2, 2);
  // legs
  ctx.fillStyle = '#3b3b4d';
  ctx.fillRect(-4, -12, 4, 10);
  ctx.fillRect(1, -12, 4, 10);
  // sword
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(9, -34, 2, 18);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(6, -35, 8, 2);
  ctx.restore();
}

function drawDino(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(0, -s, s, s * 0.6);       // body
  ctx.fillRect(-s * 0.4, -s * 0.5, s * 0.5, s * 0.4); // neck
  ctx.fillRect(-s * 0.5, -s * 0.9, s * 0.35, s * 0.45); // head
  ctx.fillRect(s, -s * 0.3, s * 0.3, s * 0.3); // tail
  ctx.fillRect(-s * 0.1, 0, s * 0.2, s * 0.45); // leg
  ctx.fillRect(s * 0.5, 0, s * 0.2, s * 0.45);
  ctx.fillStyle = '#fff';
  ctx.fillRect(-s * 0.36, -s * 0.75, 3, 3);
  ctx.fillStyle = '#000';
  ctx.fillRect(-s * 0.3, -s * 0.7, 2, 2);
  ctx.restore();
}

function drawRoad(ctx, w, h) {
  ctx.fillStyle = '#0a0a10';
  ctx.fillRect(0, h * 0.5, w, h * 0.5);
  ctx.fillStyle = '#1a1a24';
  ctx.fillRect(w * 0.38, h * 0.5, w * 0.24, h * 0.5);
  // glowing dashes
  ctx.fillStyle = 'rgba(255,220,120,0.8)';
  for (let i = 0; i < 8; i++) {
    const y = h * 0.52 + (i * 26) % (h * 0.45);
    ctx.fillRect(w / 2 - 2, y, 4, 12);
  }
  // side neon
  ctx.fillStyle = 'rgba(255,30,30,0.5)';
  ctx.fillRect(w * 0.37, h * 0.5, 2, h * 0.5);
  ctx.fillRect(w * 0.63, h * 0.5, 2, h * 0.5);
}

function drawCar(ctx, x, y, color, mirrored) {
  ctx.save();
  ctx.translate(x, y);
  if (mirrored) ctx.scale(-1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(-13, 6, 26, 10);
  ctx.fillRect(-9, 0, 18, 8);
  ctx.fillStyle = '#0d0d14';
  ctx.fillRect(-8, 7, 6, 7); ctx.fillRect(2, 7, 6, 7);
  ctx.fillRect(-11, 12, 5, 3); ctx.fillRect(6, 12, 5, 3);
  ctx.fillStyle = 'rgba(255,255,200,0.9)';
  ctx.fillRect(-15, 8, 3, 4);
  ctx.restore();
}

function drawTarget(ctx, x, y, r) {
  const rings = ['#ff1e1e', '#fff', '#ff1e1e'];
  const radii = [r, r * 0.66, r * 0.33];
  radii.forEach((rr, i) => {
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fillStyle = rings[i];
    ctx.fill();
  });
  ctx.beginPath();
  ctx.arc(x, y, r * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = '#111';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,30,30,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, r * 1.35, 0, Math.PI * 2); ctx.stroke();
}

function drawHUD(ctx, left, color, right, w) {
  ctx.font = '700 13px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = color;
  ctx.fillText(left, 12, 22);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(right, w - 12, 22);
}

$$('.game-visual').forEach(v => {
  const c = $('canvas', v);
  if (!c) return;
  const type = +v.dataset.game;
  if (type === 4) drawDetective(c);
  else drawGame(c, type);
});

/* ---------- Resize redraws ---------- */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    $$('.ea-chart').forEach((c, i) => { c.width = 520; drawEAChart(c, i === 0 ? { trend: true } : null); });
    $$('.ea-chart-mini-canvas').forEach((c, i) => { c.width = 300; drawEAChart(c, { gold: i === 0, dn: i === 2, vol: i === 2 }); });
  }, 250);
});