import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ── Scene setup ───────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.inset = '0';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.06;
controls.minDistance = 5; controls.maxDistance = 800;
camera.position.set(0, 28, 52);

// ── Lighting ──────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x112244, 1.5));
const sunPoint = new THREE.PointLight(0xffddaa, 12, 2000);
scene.add(sunPoint);
const rimLight = new THREE.DirectionalLight(0x4466aa, 0.5);
rimLight.position.set(-10, 5, -10); scene.add(rimLight);

// ── Stars ─────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for (let i = 0; i < 2000; i++) {
  starPos.push((Math.random()-0.5)*2000,(Math.random()-0.5)*2000,(Math.random()-0.5)*2000);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
  color:0xffffff, size:1.2, transparent:true, opacity:0.55, sizeAttenuation:true
})));

// ── Orbital plane grid ────────────────────────────────────────
const gridHelper = new THREE.GridHelper(200, 40, 0x112244, 0x0a1a30);
gridHelper.material.opacity = 0.45; gridHelper.material.transparent = true;
scene.add(gridHelper);

// ── Textures ──────────────────────────────────────────────────
const manager = new THREE.LoadingManager();
const loadingOverlay = document.createElement('div');
loadingOverlay.id = 'trajectory-loader';
loadingOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:var(--navy); z-index:9999; display:flex; justify-content:center; align-items:center; color:var(--gold); font-family:"Space Mono", monospace; font-size:1.2rem; flex-direction:column; gap:20px; transition:opacity 0.5s;';

const loadingText = document.createElement('div');
loadingText.innerText = 'Loading Physics Engine (0%)';

const spinner = document.createElement('i');
spinner.className = 'fa-solid fa-circle-notch fa-spin fa-2x';

loadingOverlay.appendChild(spinner);
loadingOverlay.appendChild(loadingText);
document.body.appendChild(loadingOverlay);

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  loadingText.innerText = `Loading Assets (${Math.round((itemsLoaded / itemsTotal) * 100)}%)`;
};
manager.onLoad = function () {
  loadingOverlay.style.opacity = '0';
  setTimeout(() => loadingOverlay.remove(), 500);
};

const loader = new THREE.TextureLoader(manager);
const sunTex   = loader.load('../planets/img_others/2k_sun.jpg');
const earthTex = loader.load('../planets/img_earth/earth_day_4096.jpg');
const cloudTex = loader.load('../planets/img_earth/earth_clouds_1024.png');
const normalTex = loader.load('../planets/img_earth/earth_normal_2048.jpg');

// ── Sun ───────────────────────────────────────────────────────
const sunMat = new THREE.MeshStandardMaterial({
  map: sunTex, emissive: 0xff6600, emissiveMap: sunTex, emissiveIntensity: 1.8,
  roughness: 1, metalness: 0
});
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(2.8, 32, 32), sunMat);
scene.add(sunMesh);

// Sun corona layers
function addCorona(radius, color, opacity) {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.MeshBasicMaterial({
    color, transparent:true, opacity, side:THREE.BackSide, depthWrite:false
  });
  scene.add(new THREE.Mesh(geo, mat));
}
addCorona(3.3, 0xff8800, 0.18);
addCorona(4.0, 0xff6600, 0.08);
addCorona(5.2, 0xff4400, 0.04);

// ── Earth ─────────────────────────────────────────────────────
const earthMat = new THREE.MeshPhongMaterial({
  map: earthTex, normalMap: normalTex,
  normalScale: new THREE.Vector2(0.6, 0.6),
  shininess: 20, specular: new THREE.Color(0x2244aa)
});
const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), earthMat);
scene.add(earthMesh);

// Cloud layer
const cloudMat = new THREE.MeshPhongMaterial({
  map: cloudTex, transparent:true, opacity:0.45, depthWrite:false
});
const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(0.67, 32, 32), cloudMat);
scene.add(cloudMesh);

// Atmosphere
const atmoMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.74, 32, 32),
  new THREE.MeshPhongMaterial({
    color:0x4488cc, transparent:true, opacity:0.1,
    side:THREE.BackSide, depthWrite:false
  })
);
scene.add(atmoMesh);

// ── Velocity Arrow ────────────────────────────────────────────
const velArrow = new THREE.ArrowHelper(
  new THREE.Vector3(1,0,0), new THREE.Vector3(), 4,
  0x00ffff, 1.0, 0.5
);
scene.add(velArrow);

// ── Orbit Line ───────────────────────────────────────────────
let orbitLine = null;

// ── Swept Area (Kepler 2nd Law) ───────────────────────────────
let sweptMesh = null;
const sweptPositions = [];
const SWEPT_FRAMES = 40;

// ── Bloom ─────────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.9, 0.5, 0.8);
composer.addPass(bloom);

// ── Constants ─────────────────────────────────────────────────
const O = {
  M:1.98847e30, m:5.97237e24,
  r:1.47095e11, v:3.029195106e4,
  G:6.67430e-11
};
const SF = 1e-10; // scale factor

// ── DOM ───────────────────────────────────────────────────────
const Msl = document.getElementById('Mslider');
const msl = document.getElementById('mslider');
const rsl = document.getElementById('rslider');
const vsl = document.getElementById('vslider');

const dE      = document.getElementById('d-e');
const dA      = document.getElementById('d-a');
const dPer    = document.getElementById('d-period');
const dVel    = document.getElementById('d-vel');
const dH      = document.getElementById('d-h');
const badge   = document.getElementById('orbitTypeBadge');
const callout = document.getElementById('keplerCallout');
const thetaCanvas = document.getElementById('thetaGraph');
const thetaCtx    = thetaCanvas.getContext('2d');
const thetaDiv    = document.getElementById('thetaValue');
const msgOvl  = document.getElementById('messageOverlay');
const orbMsg  = document.getElementById('orbitalChangeMessage');

// Slider value labels
['M','m','r','v'].forEach(k => {
  const sl = {M:Msl,m:msl,r:rsl,v:vsl}[k];
  const sp = document.getElementById({M:'Mval',m:'mval',r:'rval',v:'vval'}[k]);
  sp.textContent = sl.value + '×';
  sl.addEventListener('input', () => {
    sp.textContent = sl.value + '×';
    updateOrbit(true);
  });
});

// ── Physics ───────────────────────────────────────────────────
function compute(M, r, v) {
  const h   = r * v;
  const eps = 0.5*v*v - (O.G*M)/r;
  const e   = Math.sqrt(Math.max(0, 1 + (2*eps*h*h)/(O.G*M*O.G*M)));
  let a = (e < 1) ? -(O.G*M)/(2*eps) : Math.abs(O.G*M/(2*eps));
  if (Math.abs(e-1) < 1e-4) a = h*h/(O.G*M);
  return { h, eps, e, a };
}

function buildOrbitPoints(a, e, n=900) {
  const pts = [];
  if (e < 1) {
    const cx = -a*e, b = a*Math.sqrt(1-e*e);
    for (let i=0; i<=n; i++) {
      const t = (i/n)*2*Math.PI;
      pts.push(new THREE.Vector3((cx+a*Math.cos(t))*SF, 0, b*Math.sin(t)*SF));
    }
  } else {
    const tMax = Math.min(Math.acos(-1/e)*0.96, Math.PI*0.95);
    for (let i=0; i<=n; i++) {
      const t = (i/n)*2*tMax - tMax;
      const rr = (Math.abs(e-1)<1e-4) ? a/(1+Math.cos(t)) : a*(e*e-1)/(1+e*Math.cos(t));
      if (rr>0 && rr<1e13) pts.push(new THREE.Vector3(rr*Math.cos(t)*SF, 0, rr*Math.sin(t)*SF));
    }
  }
  return pts;
}

let orbitPts = [], orbitTheta = 0, prevOrbitType = null, simState = 'running';
let pauseStart = 0, changeTimeout = null;

// Kepler callouts
const KEPLER_MSGS = {
  near_perihelion: '🔥 <strong>Kepler 2nd Law</strong> — Near perihelion. Earth moves <strong>fastest</strong> — equal areas swept in equal time.',
  near_aphelion:   '❄ <strong>Kepler 2nd Law</strong> — Near aphelion. Earth moves <strong>slowest</strong> — same area, more time.',
  third_law:       '📐 <strong>Kepler 3rd Law</strong> — T² ∝ a³. Changing distance changes period proportionally.',
  ellipse:         '⭕ <strong>Kepler 1st Law</strong> — Orbit is an ellipse with the Sun at one <strong>focus</strong>.',
  hyperbola:       '🚀 <strong>Escape trajectory!</strong> Eccentricity > 1 — the planet will never return.',
  parabola:        '🎯 <strong>Parabolic escape</strong> — critical velocity. Eccentricity = 1, just barely unbound.',
};
let calloutTimer = null;
function showCallout(key) {
  if (calloutTimer) clearTimeout(calloutTimer);
  callout.innerHTML = KEPLER_MSGS[key] || '';
  callout.style.display = 'block';
  calloutTimer = setTimeout(() => { callout.style.display = 'none'; }, 5000);
}

function getOrbitType(e) {
  if (e < 0.999) return 'ellipse';
  if (e < 1.001) return 'parabola';
  return 'hyperbola';
}

function orbitColor(type) {
  if (type === 'ellipse')   return 0x44ddff;
  if (type === 'parabola')  return 0xffdd44;
  return 0xff6644;
}
function badgeText(type, e) {
  const em = e.toFixed(4);
  if (type === 'ellipse')  return `⬤ Elliptical Orbit  ·  e = ${em}`;
  if (type === 'parabola') return `◆ Parabolic Escape  ·  e = ${em}`;
  return `▲ Hyperbolic Flyby  ·  e = ${em}`;
}

function updateOrbit(fromUser=false) {
  if (orbitLine) { scene.remove(orbitLine); orbitLine = null; }

  const Mv = O.M * parseFloat(Msl.value);
  const rv = O.r  * parseFloat(rsl.value);
  const vv = O.v  * parseFloat(vsl.value);
  const { h, eps, e, a } = compute(Mv, rv, vv);

  const type = getOrbitType(e);

  // Dashboard
  const AU = 1.496e11;
  dE.textContent    = e.toFixed(5);
  dA.textContent    = (a/AU).toFixed(3);
  dH.textContent    = h.toExponential(3);

  let period = '∞';
  if (e < 1) {
    const T = (2*Math.PI*Math.sqrt(Math.pow(a,3)/(O.G*Mv))) / (60*60*24*365.25);
    period = T.toFixed(3);
    dPer.textContent = period + ' yr';
  } else {
    dPer.textContent = '∞';
  }

  // Badge
  badge.textContent = badgeText(type, e);
  badge.style.borderColor = type==='ellipse' ? 'rgba(197,160,72,0.4)' : type==='parabola' ? 'rgba(255,220,50,0.5)' : 'rgba(255,100,60,0.5)';

  // Build orbit
  orbitPts = buildOrbitPoints(a, e);
  const color = orbitColor(type);
  orbitLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPts),
    new THREE.LineBasicMaterial({ color, transparent:true, opacity:0.55, linewidth:1.5 })
  );
  scene.add(orbitLine);
  orbitTheta = 0;

  if (fromUser && prevOrbitType && prevOrbitType !== type) {
    if (changeTimeout) clearTimeout(changeTimeout);
    orbMsg.textContent = `ORBIT → ${type.toUpperCase()}`;
    orbMsg.style.display = 'block';
    changeTimeout = setTimeout(() => orbMsg.style.display='none', 3000);
    showCallout(type);
  } else if (fromUser) {
    showCallout('third_law');
  }
  prevOrbitType = type;

  if (simState !== 'collision') {
    earthMesh.visible = cloudMesh.visible = atmoMesh.visible = true;
    msgOvl.style.display = 'none';
    velArrow.visible = true;
    simState = 'running';
  }
}

// ── Theta Graph ────────────────────────────────────────────────
function drawTheta(theta, r) {
  const W = thetaCanvas.width, H = thetaCanvas.height;
  const cx = W/2, cy = H/2;
  thetaCtx.clearRect(0,0,W,H);

  // Bg
  thetaCtx.fillStyle='rgba(0,8,20,0.7)';
  thetaCtx.fillRect(0,0,W,H);

  // Axes
  thetaCtx.strokeStyle='rgba(255,255,255,0.12)';
  thetaCtx.lineWidth=1;
  thetaCtx.beginPath();
  thetaCtx.moveTo(cx,0); thetaCtx.lineTo(cx,H);
  thetaCtx.moveTo(0,cy); thetaCtx.lineTo(W,cy);
  thetaCtx.stroke();

  // Circles
  [0.33,0.66,1].forEach(f => {
    thetaCtx.strokeStyle='rgba(197,160,72,0.1)';
    thetaCtx.beginPath();
    thetaCtx.arc(cx,cy,f*(W/2-4),0,Math.PI*2);
    thetaCtx.stroke();
  });

  const maxR = 1.6e11;
  const clamped = Math.min(r, maxR);
  const scale = (W/2-8)/maxR;
  const px = cx + clamped*scale*Math.cos(theta);
  const py = cy - clamped*scale*Math.sin(theta);

  // Radius vector (gold)
  thetaCtx.strokeStyle='rgba(197,160,72,0.8)';
  thetaCtx.lineWidth=2;
  thetaCtx.beginPath(); thetaCtx.moveTo(cx,cy); thetaCtx.lineTo(px,py); thetaCtx.stroke();

  // Planet dot
  thetaCtx.fillStyle='#44ddff';
  thetaCtx.beginPath(); thetaCtx.arc(px,py,4,0,Math.PI*2); thetaCtx.fill();

  // Sun dot
  thetaCtx.fillStyle='#ffaa33';
  thetaCtx.beginPath(); thetaCtx.arc(cx,cy,5,0,Math.PI*2); thetaCtx.fill();

  const deg = (((theta % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI)) * (180/Math.PI);
  thetaDiv.textContent = `θ: ${(theta<0?theta+2*Math.PI:theta).toFixed(3)} rad | ${deg.toFixed(1)}°`;
}

// ── Kepler 2nd Law swept area ─────────────────────────────────
let prevPosForSwept = null;
let sweptFrameCount = 0;
const SWEPT_COLOR = new THREE.Color(0xc5a048);

function drawSweptArea(currentPos) {
  if (sweptMesh) { scene.remove(sweptMesh); sweptMesh = null; }
  if (!prevPosForSwept) { prevPosForSwept = currentPos.clone(); return; }
  sweptFrameCount++;
  if (sweptFrameCount % 3 !== 0) return; // update every 3 frames

  const origin = new THREE.Vector3(0, 0.01, 0);
  const vertices = [
    origin.x, origin.y, origin.z,
    prevPosForSwept.x, 0.01, prevPosForSwept.z,
    currentPos.x, 0.01, currentPos.z,
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex([0,1,2]);
  const mat = new THREE.MeshBasicMaterial({
    color: SWEPT_COLOR, transparent:true, opacity:0.22,
    side: THREE.DoubleSide, depthWrite:false
  });
  sweptMesh = new THREE.Mesh(geo, mat);
  scene.add(sweptMesh);
  prevPosForSwept = currentPos.clone();
}

// ── Animation ─────────────────────────────────────────────────
const TIME_SCALE = 0.008 * 24 * 3600;
let lastT = performance.now();
const COLL_DIST = 3.45;
let nearPeriCallout = false, nearAphCallout = false;

function animate() {
  const now = performance.now();
  const dt  = (now - lastT)/1000 * TIME_SCALE;
  lastT = now;

  if (simState === 'reset') {
    Msl.value='1'; msl.value='1'; rsl.value='1'; vsl.value='1';
    ['Mval','mval','rval','vval'].forEach(id => document.getElementById(id).textContent = '1×');
    updateOrbit();
    simState = 'running';
  }

  if (simState === 'running' && orbitPts.length > 0) {
    const Mv = O.M * parseFloat(Msl.value);
    const rv = O.r  * parseFloat(rsl.value);
    const vv = O.v  * parseFloat(vsl.value);
    const { h, eps, e, a } = compute(Mv, rv, vv);

    // Speed-up near perihelion (equal-area approximation via angle step)
    const idx = Math.floor(orbitTheta * orbitPts.length);
    if (orbitPts[idx]) {
      const pos = orbitPts[idx];
      const dist2Sun = pos.length();
      // Angular speed ∝ h/r² — faster when closer
      const angStep = dt * 0.000015 * (2.2 / Math.max(dist2Sun, 0.1));
      if (e < 1) {
        orbitTheta = (orbitTheta + angStep) % 1;
      } else {
        if (orbitTheta < 1) orbitTheta += angStep * 0.7;
      }

      earthMesh.position.set(pos.x, pos.y, pos.z);
      cloudMesh.position.set(pos.x, pos.y, pos.z);
      atmoMesh.position.set(pos.x, pos.y, pos.z);
      earthMesh.rotation.y  += 0.04;
      cloudMesh.rotation.y  += 0.055;

      // Collision
      if (pos.length() <= COLL_DIST) {
        simState = 'collision'; pauseStart = now;
        earthMesh.visible = cloudMesh.visible = atmoMesh.visible = false;
        msgOvl.style.display = 'block'; velArrow.visible = false;
      } else {
        // Velocity arrow
        const tangDir = new THREE.Vector3(-pos.z, 0, pos.x).normalize();
        const vMag = h / (pos.length() / SF);
        velArrow.position.copy(pos);
        velArrow.setDirection(tangDir);
        velArrow.setLength(Math.min(vMag * 5e-5 + 2, 8), 0.9, 0.45);
        const speed = vMag / 1000; // km/s
        dVel.textContent = speed.toFixed(2) + ' km/s';

        // Swept area
        drawSweptArea(pos);

        // Polar graph
        const theta = Math.atan2(pos.z, pos.x);
        drawTheta(theta, pos.length() / SF);

        // Kepler 2nd law callouts
        const frac = orbitTheta;
        if (e < 1) {
          if ((frac < 0.08 || frac > 0.92) && !nearPeriCallout) {
            nearPeriCallout = true; nearAphCallout = false;
            showCallout('near_perihelion');
          } else if (frac > 0.38 && frac < 0.62 && !nearAphCallout) {
            nearAphCallout = true; nearPeriCallout = false;
            showCallout('near_aphelion');
          }
        }
      }
    }
  } else if (simState === 'collision' && (performance.now()-pauseStart) >= 4000) {
    simState = 'reset';
  }

  sunMesh.rotation.y  += 0.0018;

  controls.update();
  composer.render();
  requestAnimationFrame(animate);
}

updateOrbit();
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

// ── UI Toggles ─────────────────────────────────────────────────
const phySb  = document.getElementById('physicsSidebar');
const expSb  = document.getElementById('explanationSidebar');
const phyBtn = document.getElementById('togglePhysics');
const expBtn = document.getElementById('toggleExplanation');

phyBtn.addEventListener('click', () => {
  const open = phySb.style.display === 'block';
  phySb.style.display = open ? 'none' : 'block';
  expSb.style.display = 'none';
  phyBtn.classList.toggle('active', !open);
  expBtn.classList.remove('active');
});
expBtn.addEventListener('click', () => {
  const open = expSb.style.display === 'block';
  expSb.style.display = open ? 'none' : 'block';
  phySb.style.display = 'none';
  expBtn.classList.toggle('active', !open);
  phyBtn.classList.remove('active');
});