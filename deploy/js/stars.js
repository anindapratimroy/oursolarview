import { sceneManager } from './SceneManager.js';

export function initStars() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  let mouse = { x: -999, y: -999 };
  let animId;

  // ── Resize ────────────────────────────────────────────────
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Mouse tracking ────────────────────────────────────────
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  // ── Stars (optimised for perf) ───────────────────────────
  const STAR_COUNT = 150;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.3 + 0.15,
    opacity: Math.random() * 0.55 + 0.2,
    twinkleSpeed: Math.random() * 0.01 + 0.003,
    twinkleOffset: Math.random() * Math.PI * 2,
    drift: { x: (Math.random() - 0.5) * 0.00004, y: (Math.random() - 0.5) * 0.00004 },
  }));

  function drawStars(t) {
    stars.forEach(s => {
      // Mild parallax from mouse
      const px = s.x * W + (mouse.x - W / 2) * s.r * 0.008;
      const py = s.y * H + (mouse.y - H / 2) * s.r * 0.008;

      // Twinkling
      const alpha = s.opacity * (0.65 + 0.35 * Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset));

      // Drift (no per-frame sqrt for perf)
      s.x += s.drift.x;
      s.y += s.drift.y;
      if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
      if (s.y < 0) s.y = 1; if (s.y > 1) s.y = 0;

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
  }

  // ── Shooting Stars ────────────────────────────────────────
  const shooters = [];
  function spawnShooter() {
    if (shooters.length > 3) return;
    const startX = Math.random() * W * 0.8;
    const startY = Math.random() * H * 0.4;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    shooters.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * (10 + Math.random() * 8),
      vy: Math.sin(angle) * (10 + Math.random() * 8),
      len: 80 + Math.random() * 120,
      alpha: 1,
      life: 1,
    });
  }
  setInterval(spawnShooter, 2200 + Math.random() * 2000);

  function drawShooters() {
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx; s.y += s.vy;
      s.life -= 0.018;
      if (s.life <= 0 || s.x > W + 100 || s.y > H + 100) { shooters.splice(i, 1); continue; }
      const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.len;
      const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.len;
      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.6, `rgba(200,230,255,${s.life * 0.6})`);
      grad.addColorStop(1, `rgba(255,255,255,${s.life})`);
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
  }

  // ── Comets ────────────────────────────────────────────────
  const comets = [];
  function spawnComet() {
    if (comets.length > 2) return;
    comets.push({
      x: -60, y: Math.random() * H * 0.6,
      vx: 0.35 + Math.random() * 0.25,
      vy: (Math.random() - 0.5) * 0.1,
      tailLen: 180 + Math.random() * 100,
      size: 3 + Math.random() * 2,
      glowColor: Math.random() > 0.5 ? [150, 210, 255] : [255, 200, 100],
    });
  }
  setInterval(spawnComet, 12000 + Math.random() * 8000);

  function drawComets() {
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.x += c.vx; c.y += c.vy;
      if (c.x > W + 200) { comets.splice(i, 1); continue; }
      const [r, g, b] = c.glowColor;
      // Tail
      const grad = ctx.createLinearGradient(c.x - c.tailLen, c.y, c.x, c.y);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(${r},${g},${b},0.5)`);
      ctx.beginPath();
      ctx.moveTo(c.x - c.tailLen, c.y);
      ctx.lineTo(c.x, c.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = c.size * 0.9;
      ctx.stroke();
      // Head
      const headGlow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size * 4);
      headGlow.addColorStop(0, `rgba(${r},${g},${b},1)`);
      headGlow.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`);
      headGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = headGlow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx.fill();
    }
  }

  // ── Nebula Clouds ─────────────────────────────────────────
  const nebulas = [
    { x: 0.75, y: 0.15, r: 280, c: [40, 60, 180] },
    { x: 0.1, y: 0.7,  r: 200, c: [80, 30, 140] },
    { x: 0.55, y: 0.55, r: 160, c: [20, 80, 120] },
  ];
  function drawNebulas() {
    nebulas.forEach(n => {
      const nx = n.x * W; const ny = n.y * H;
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
      grad.addColorStop(0, `rgba(${n.c[0]},${n.c[1]},${n.c[2]},0.12)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  // ── UFO ───────────────────────────────────────────────────
  let ufo = { x: -200, y: H * 0.2, vx: 0, vy: 0, active: false, timer: 0 };
  function spawnUFO() {
    if (ufo.active) return;
    ufo.active = true;
    ufo.x = -100; ufo.y = H * 0.15 + Math.random() * H * 0.2;
    ufo.vx = 0.8 + Math.random() * 0.5;
    ufo.timer = 0;
  }
  setInterval(spawnUFO, 25000 + Math.random() * 15000);

  function updateUFO(t) {
    if (!ufo.active) return;
    ufo.x += ufo.vx;
    ufo.y += Math.sin(t * 0.05) * 0.6; // bobbing
    if (ufo.x > W + 200) ufo.active = false;
  }

  function drawUFO(t) {
    if (!ufo.active) return;
    const size = 18;
    ctx.save();
    ctx.translate(ufo.x, ufo.y);
    // Slight tilt based on velocity
    ctx.rotate(ufo.vx * 0.05);

    // Tractor beam
    const beamPhase = Math.sin(t * 0.1);
    if (beamPhase > 0) {
      const beamGrad = ctx.createLinearGradient(0, size * 0.4, 0, size * 4);
      beamGrad.addColorStop(0, 'rgba(120, 255, 180, 0.4)');
      beamGrad.addColorStop(1, 'rgba(120, 255, 180, 0)');
      ctx.beginPath();
      ctx.moveTo(-size * 0.3, size * 0.4);
      ctx.lineTo(size * 0.3, size * 0.4);
      ctx.lineTo(size * 1.5, size * 4);
      ctx.lineTo(-size * 1.5, size * 4);
      ctx.fillStyle = beamGrad;
      ctx.fill();
    }

    // Body base
    const bodyGrad = ctx.createLinearGradient(0, -size * 0.2, 0, size * 0.4);
    bodyGrad.addColorStop(0, '#8899aa');
    bodyGrad.addColorStop(1, '#223344');
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.36, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    // Body shine
    const bodyShine = ctx.createLinearGradient(-size * 0.5, -size * 0.3, size * 0.5, 0);
    bodyShine.addColorStop(0, 'rgba(255,255,255,0.35)');
    bodyShine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.05, size * 0.85, size * 0.16, 0, Math.PI, 0);
    ctx.fillStyle = bodyShine;
    ctx.fill();

    // Dome
    const domeGrad = ctx.createRadialGradient(-size * 0.15, -size * 0.4, 0, 0, -size * 0.1, size * 0.48);
    domeGrad.addColorStop(0, 'rgba(220,245,255,0.95)');
    domeGrad.addColorStop(0.5, 'rgba(120,200,255,0.75)');
    domeGrad.addColorStop(1, 'rgba(60,140,220,0.4)');
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.12, size * 0.46, size * 0.38, 0, Math.PI, 0);
    ctx.fillStyle = domeGrad;
    ctx.fill();

    // Lights underneath
    const lightX = [-size * 0.55, -size * 0.27, 0, size * 0.27, size * 0.55];
    lightX.forEach((lx, i) => {
      const phase = t * 0.08 + i * 1.2;
      const blink = 0.5 + 0.5 * Math.sin(phase);
      const hues = [[255,80,80],[80,255,140],[80,160,255],[255,200,60],[200,80,255]];
      const [r, g, b] = hues[i % hues.length];
      // Glow
      const lg = ctx.createRadialGradient(lx, size * 0.22, 0, lx, size * 0.22, size * 0.25);
      lg.addColorStop(0, `rgba(${r},${g},${b},${blink * 0.6})`);
      lg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(lx, size * 0.22, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = lg;
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(lx, size * 0.21, size * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.6 + blink * 0.4})`;
      ctx.fill();
    });

    // Rim ring
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.06, size * 0.42, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(150,210,255,0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  // ── Distant Planets ───────────────────────────────────────
  const distantPlanets = [
    { x: 0.88, y: 0.12, r: 18, c: '#e8c97c', rings: true,  speed: 0.00015, orbitR: 0 },
    { x: 0.05, y: 0.3,  r: 10, c: '#c47b5e', rings: false, speed: 0.0002,  orbitR: 0 },
    { x: 0.6,  y: 0.08, r:  7, c: '#7eb4e0', rings: false, speed: 0.0003,  orbitR: 0 },
  ];
  let dpAngle = 0;

  function drawDistantPlanets(t) {
    distantPlanets.forEach((dp, i) => {
      const px = dp.x * W + Math.sin(t * dp.speed * 60 + i * 2) * 12;
      const py = dp.y * H + Math.cos(t * dp.speed * 60 * 1.3 + i) * 6;
      // Glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, dp.r * 4);
      glow.addColorStop(0, dp.c + '44');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(px, py, dp.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      // Body gradient
      const grad = ctx.createRadialGradient(px - dp.r * 0.3, py - dp.r * 0.3, 0, px, py, dp.r);
      grad.addColorStop(0, '#fff8');
      grad.addColorStop(0.2, dp.c + 'ff');
      grad.addColorStop(1, dp.c + '88');
      ctx.beginPath();
      ctx.arc(px, py, dp.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Rings if applicable
      if (dp.rings) {
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, dp.r * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = dp.c + 'aa';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, dp.r * 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = dp.c + '55';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  // ── Main Loop (capped at ~35fps for performance) ──────────
  let t = 0;
  let _lastFrameTs = 0;
  const _FRAME_MS = 1000 / 35; // 35fps cap

  // Pre-cache the gradient — rebuild only on resize
  let _bgGrad;
  function _buildGrad() {
    _bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
    _bgGrad.addColorStop(0, '#00070f');
    _bgGrad.addColorStop(0.5, '#000c1e');
    _bgGrad.addColorStop(1, '#000510');
  }
  _buildGrad();
  window.addEventListener('resize', _buildGrad);

  function frame(now) {
    animId = requestAnimationFrame(frame);
    if (window.APP_PAUSED) return; // SceneManager pause
    if (now - _lastFrameTs < _FRAME_MS) return;
    _lastFrameTs = now;
    t++;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = _bgGrad;
    ctx.fillRect(0, 0, W, H);
    drawNebulas();
    drawDistantPlanets(t);
    drawStars(t);
    drawShooters();
    drawComets();
    updateUFO(t);
    drawUFO(t);
  }
  requestAnimationFrame(frame);
  sceneManager.registerFrame(animId);
}
