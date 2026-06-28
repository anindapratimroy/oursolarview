import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ── Scene setup ───────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.inset = '0';
renderer.domElement.style.zIndex = '0';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 5;
controls.maxDistance = 800;

// Custom Google Earth style Zoom-to-Cursor
renderer.domElement.addEventListener('wheel', (event) => {
  if (!controls.enabled) return;
  // If it's a trackpad pan gesture (has a noticeable horizontal component or is a direct horizontal swipe)
  if (Math.abs(event.deltaX) > 1) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const distToTarget = camera.position.distanceTo(controls.target);
    const panSpeed = 0.0015 * distToTarget; 
    
    const v = new THREE.Vector3();
    // Pan X (left/right)
    v.setFromMatrixColumn(camera.matrix, 0); // camera right vector
    v.multiplyScalar(event.deltaX * panSpeed);
    camera.position.add(v);
    controls.target.add(v);

    // Pan Y (up/down)
    v.setFromMatrixColumn(camera.matrix, 1); // camera up vector
    v.multiplyScalar(-event.deltaY * panSpeed);
    camera.position.add(v);
    controls.target.add(v);

    controls.update();
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation(); // Block default OrbitControls wheel zoom

  const zoomSpeed = 0.15;
  // Invert delta: scrolling up (deltaY < 0) zooms in, scrolling down (deltaY > 0) zooms out
  const delta = event.deltaY > 0 ? -1 : 1;
  
  const rect = renderer.domElement.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const ndcX = (x * 2) - 1;
  const ndcY = -(y * 2) + 1;

  const ray = new THREE.Raycaster();
  ray.setFromCamera({ x: ndcX, y: ndcY }, camera);
  const dir = ray.ray.direction;

  const dist = camera.position.distanceTo(controls.target);
  const step = dist * zoomSpeed * delta;

  // Ensure we don't zoom through the center if zooming in too far
  if (delta > 0 && dist < 1.0) return;

  camera.position.addScaledVector(dir, step);
  controls.target.addScaledVector(dir, step);
  
  controls.update();
}, { passive: false, capture: true });

camera.position.set(0, 25, 150);

// ── Lighting ──────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x112244, 1.5));
const sunPoint = new THREE.PointLight(0xffddaa, 12, 2000);
scene.add(sunPoint);
const rimLight = new THREE.DirectionalLight(0x4466aa, 0.5);
rimLight.position.set(-10, 5, -10);
scene.add(rimLight);

// ── Stars ─────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for (let i = 0; i < 2000; i++) {
  starPos.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
  color: 0xffffff, size: 1.2, transparent: true, opacity: 0.55, sizeAttenuation: true
})));

// ── Orbital plane grid ────────────────────────────────────────
let gridHelper = null;

// ── Textures ──────────────────────────────────────────────────
const loader = new THREE.TextureLoader();
const sunTex    = loader.load('../planets/img_others/2k_sun.jpg');
const earthTex  = loader.load('../planets/img_earth/earth_day_4096.jpg');
const cloudTex  = loader.load('../planets/img_earth/earth_clouds_1024.png');
const normalTex = loader.load('../planets/img_earth/earth_normal_2048.jpg');

// ── Sun ───────────────────────────────────────────────────────
const sunMat = new THREE.MeshStandardMaterial({
  map: sunTex, emissive: 0xff6600, emissiveMap: sunTex, emissiveIntensity: 1.8,
  roughness: 1, metalness: 0
});
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(12.0, 32, 32), sunMat);
scene.add(sunMesh);

// Sun corona
function addCorona(radius, color, opacity) {
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.BackSide, depthWrite: false })
  ));
}
addCorona(13.5, 0xff8800, 0.18);
addCorona(15.5, 0xff6600, 0.08);
addCorona(19.5, 0xff4400, 0.04);

// ── Earth ─────────────────────────────────────────────────────
const earthMat = new THREE.MeshPhongMaterial({
  map: earthTex, normalMap: normalTex,
  normalScale: new THREE.Vector2(0.6, 0.6),
  shininess: 20, specular: new THREE.Color(0x2244aa)
});
const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(4.0, 32, 32), earthMat);
scene.add(earthMesh);

const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTex, transparent: true, opacity: 0.45, depthWrite: false });
const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(4.06, 32, 32), cloudMat);
scene.add(cloudMesh);

const atmoMesh = new THREE.Mesh(
  new THREE.SphereGeometry(4.3, 32, 32),
  new THREE.MeshPhongMaterial({ color: 0x4488cc, transparent: true, opacity: 0.1, side: THREE.BackSide, depthWrite: false })
);
scene.add(atmoMesh);

// ── Velocity Vector Arrow ───────────────────────────────────────
const velArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 15, 0xff3333, 4.0, 2.5);
scene.add(velArrow);

// ── Orbit Line ───────────────────────────────────────────────
let orbitLine = null;

// ── Swept Area ────────────────────────────────────────────────
let sweptMesh = null;
let prevPosForSwept = null;
let sweptFrameCount = 0;
const SWEPT_COLOR = new THREE.Color(0xc5a048);

// ── Bloom ─────────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.9, 0.5, 0.8);
composer.addPass(bloom);

// ── Physics Constants ─────────────────────────────────────────
const G = 6.67430e-11;
let M0_multiplier = 1;
let M0 = 1.98847e30 * M0_multiplier;
const r0 = 1.47095e11;
const v0 = 3.029195106e4;
const SF = 1e-10; // scale factor: 1 THREE unit = 1e10 m

// ── DOM References ────────────────────────────────────────────
const eccSlider   = document.getElementById('eccentricity');
const aSlider     = document.getElementById('semiMajor');
const speedSlider = document.getElementById('simSpeed');
const eValSpan    = document.getElementById('eVal');
const aValSpan    = document.getElementById('aVal');
const speedValSpan = document.getElementById('speedVal');
const distValEl   = document.getElementById('distVal');
const velValEl    = document.getElementById('velVal');
const periodValEl = document.getElementById('periodVal');
const periapsisValEl = document.getElementById('periapsisVal');
const apoapsisValEl = document.getElementById('apoapsisVal');
const energyValEl = document.getElementById('energyVal');
const badge       = document.getElementById('orbitTypeBadge');
const showVecCb   = document.getElementById('showVectors');

// New DOM Refs
const incSlider = document.getElementById('inclination');
const nodeSlider = document.getElementById('ascendingNode');
const argSlider = document.getElementById('argPeriapsis');
const incValSpan = document.getElementById('iVal');
const nodeValSpan = document.getElementById('nodeVal');
const argValSpan = document.getElementById('argVal');
const centralMassSelect = document.getElementById('centralMass');
const showPlaneCb = document.getElementById('showPlane');
const showTrailCb = document.getElementById('showTrail');
const trueAnomalySlider = document.getElementById('trueAnomaly');
const trueAnomalyValSpan = document.getElementById('thetaVal');


// ── State ─────────────────────────────────────────────────────
let orbitPts = [];
let orbitTheta = 0;
let simState = 'running';

// ── Slider event listeners ────────────────────────────────────
eccSlider.addEventListener('input', () => {
  eValSpan.textContent = parseFloat(eccSlider.value).toFixed(3);
  buildAndSetOrbit();
});
aSlider.addEventListener('input', () => {
  aValSpan.textContent = parseFloat(aSlider.value).toFixed(1);
  buildAndSetOrbit();
});
speedSlider.addEventListener('input', () => {
  speedValSpan.textContent = parseFloat(speedSlider.value).toFixed(1) + 'x';
});
incSlider.addEventListener('input', () => { incValSpan.textContent = incSlider.value; buildAndSetOrbit(); });
nodeSlider.addEventListener('input', () => { nodeValSpan.textContent = nodeSlider.value; buildAndSetOrbit(); });
argSlider.addEventListener('input', () => { argValSpan.textContent = argSlider.value; buildAndSetOrbit(); });
centralMassSelect.addEventListener('change', () => {
  M0_multiplier = parseFloat(centralMassSelect.value);
  M0 = 1.98847e30 * M0_multiplier;
  buildAndSetOrbit();
});
showPlaneCb.addEventListener('change', () => {
  if (orbitalPlaneMesh) orbitalPlaneMesh.visible = showPlaneCb.checked;
});
trueAnomalySlider.addEventListener('input', () => {
  trueAnomalyValSpan.textContent = trueAnomalySlider.value;
  // Convert true anomaly (0-360) to orbital param t (0-1) for our spline
  orbitTheta = parseFloat(trueAnomalySlider.value) / 360.0;
});



const orbitingBodySelect = document.getElementById('orbitingBody');
const textureLoader = new THREE.TextureLoader();
const planetTextures = {
  earth: textureLoader.load('../earth.avif'),
  mars: textureLoader.load('../mars.webp'),
  jupiter: textureLoader.load('../jupiter.avif'),
  mercury: textureLoader.load('../mercury.webp'),
  venus: textureLoader.load('../venus.webp'),
  saturn: textureLoader.load('../saturn.avif'),
  uranus: textureLoader.load('../uranus.webp'),
  neptune: textureLoader.load('../neptune.avif')
};
if(orbitingBodySelect) {
  orbitingBodySelect.addEventListener('change', () => {
     const val = orbitingBodySelect.value;
     const tex = planetTextures[val];
     earthMat.map = tex;
     
     if (val !== 'earth') {
         earthMat.normalMap = null;
         if (cloudMesh) cloudMesh.visible = false;
         if (atmoMesh) atmoMesh.visible = false;
     } else {
         earthMat.normalMap = normalTex;
         if (cloudMesh) cloudMesh.visible = true;
         if (atmoMesh) atmoMesh.visible = true;
     }
     
     earthMat.needsUpdate = true;
  });
}
const collisionWarningEl = document.getElementById('collisionWarning');

// ── Presets ───────────────────────────────────────────────────
function resetToDefault() {
  centralMassSelect.value = "1"; centralMassSelect.dispatchEvent(new Event('change'));
  incSlider.value = 0; nodeSlider.value = 0; argSlider.value = 0;
}
document.getElementById('preEarth').addEventListener('click', () => {
  resetToDefault();
  eccSlider.value = 0.017; aSlider.value = 15;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preHalley').addEventListener('click', () => {
  resetToDefault();
  eccSlider.value = 0.967; aSlider.value = 26;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preHyper').addEventListener('click', () => {
  resetToDefault();
  eccSlider.value = 1.2; aSlider.value = 15;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preISS').addEventListener('click', () => {
  centralMassSelect.value = "0.000003"; centralMassSelect.dispatchEvent(new Event('change'));
  eccSlider.value = 0.001; aSlider.value = 5;
  incSlider.value = 51; nodeSlider.value = 0; argSlider.value = 0;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preMolniya').addEventListener('click', () => {
  centralMassSelect.value = "0.000003"; centralMassSelect.dispatchEvent(new Event('change'));
  eccSlider.value = 0.74; aSlider.value = 18;
  incSlider.value = 63; nodeSlider.value = 90; argSlider.value = 270;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});


// ── Orbit computation ─────────────────────────────────────────
function buildOrbitPoints(a_au, e, n = 900) {
  const a = a_au * 1.496e11; // AU → m
  const pts = [];
  
  // 3D Orbital Elements
  const inc = parseFloat(incSlider.value) * (Math.PI / 180);
  const node = parseFloat(nodeSlider.value) * (Math.PI / 180);
  const argP = parseFloat(argSlider.value) * (Math.PI / 180);

  // Rotation Euler for the entire orbital plane
  const euler = new THREE.Euler(inc, node, argP, 'YXZ');

  if (e < 0.999) {
    // Ellipse
    const cx = -a * e;
    const b  = a * Math.sqrt(1 - e * e);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * 2 * Math.PI;
      let vec = new THREE.Vector3((cx + a * Math.cos(t)) * SF, 0, b * Math.sin(t) * SF);
      vec.applyEuler(euler);
      pts.push(vec);
    }
  } else if (e < 1.001) {
    // Parabola
    const p = a;
    const tMax = 2.8;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 * tMax - tMax;
      const rr = p / (1 + Math.cos(t));
      if (rr > 0 && rr < 2e13) {
        let vec = new THREE.Vector3(rr * Math.cos(t) * SF, 0, rr * Math.sin(t) * SF);
        vec.applyEuler(euler);
        pts.push(vec);
      }
    }
  } else {
    // Hyperbola
    const tMax = Math.min(Math.acos(-1 / e) * 0.93, Math.PI * 0.9);
    const p = a * (e * e - 1);
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 * tMax - tMax;
      const rr = p / (1 + e * Math.cos(t));
      if (rr > 0 && rr < 2e13) {
        let vec = new THREE.Vector3(rr * Math.cos(t) * SF, 0, rr * Math.sin(t) * SF);
        vec.applyEuler(euler);
        pts.push(vec);
      }
    }
  }
  return pts;
}

function getOrbitType(e) {
  if (e < 0.999) return 'ellipse';
  if (e < 1.001) return 'parabola';
  return 'hyperbola';
}

function orbitColor(type) {
  if (type === 'ellipse')  return 0x44ddff;
  if (type === 'parabola') return 0xffdd44;
  return 0xff6644;
}

let orbitPath = null;
let orbitalPlaneMesh = null;

function buildAndSetOrbit() {
  const e   = parseFloat(eccSlider.value);
  const a   = parseFloat(aSlider.value);
  const type = getOrbitType(e);

  // Remove old orbit line, plane and grid
  if (orbitLine) { scene.remove(orbitLine); orbitLine.geometry.dispose(); orbitLine = null; }
  if (gridHelper) { scene.remove(gridHelper); gridHelper.geometry.dispose(); gridHelper = null; }
  if (orbitalPlaneMesh) { 
      scene.remove(orbitalPlaneMesh); 
      if (orbitalPlaneMesh.geometry) {
          orbitalPlaneMesh.geometry.dispose(); 
      } else if (orbitalPlaneMesh.children && orbitalPlaneMesh.children[0]) {
          orbitalPlaneMesh.children[0].geometry.dispose();
      }
      orbitalPlaneMesh = null; 
  }

  orbitPts = buildOrbitPoints(a, e);
  orbitTheta = 0;

  const color = orbitColor(type);
  const isClosed = type === 'ellipse';
  orbitPath = new THREE.CatmullRomCurve3(orbitPts, isClosed);
  
  // Create a glowing 3D tube with subtle thickness
  const tubeGeo = new THREE.TubeGeometry(orbitPath, Math.min(orbitPts.length, 400), 0.15, 8, isClosed);
  orbitLine = new THREE.Mesh(
    tubeGeo,
    new THREE.MeshStandardMaterial({ 
      color, 
      emissive: color,
      emissiveIntensity: 0.8,
      transparent: true, 
      opacity: 0.7, 
      roughness: 0.2,
      metalness: 0.8
    })
  );
  scene.add(orbitLine);

  const a_scaled = a * 1.496e11 * SF;
  // Create Orbital Plane if it's an ellipse
  if (isClosed && showPlaneCb) {
    const cx = -a_scaled * e;
    const b_scaled = a_scaled * Math.sqrt(1 - e * e);
    const planeGeo = new THREE.PlaneGeometry(a_scaled * 2, b_scaled * 2, 32, 32);
    orbitalPlaneMesh = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false
    }));
    
    // Position center of the ellipse correctly before rotating
    orbitalPlaneMesh.position.set(cx, 0, 0);
    
    // We need to group it to rotate the whole orbital system
    const planeGroup = new THREE.Group();
    planeGroup.add(orbitalPlaneMesh);
    
    const inc = parseFloat(incSlider.value) * (Math.PI/180);
    const node = parseFloat(nodeSlider.value) * (Math.PI/180);
    const argP = parseFloat(argSlider.value) * (Math.PI/180);
    planeGroup.rotation.set(inc, node, argP, 'YXZ');
    
    orbitalPlaneMesh = planeGroup; // Track the group to easily remove it later
    scene.add(orbitalPlaneMesh);
    orbitalPlaneMesh.visible = showPlaneCb.checked;
  }

  // --- Dynamic Perfectly Fitted Grid ---
  // a_scaled is already defined above
  const gridPts = [];
  
  if (type === 'ellipse') {
    const cx = -a_scaled * e;
    const b_scaled = a_scaled * Math.sqrt(1 - e * e);
    const maxDim = Math.max(a_scaled, b_scaled);
    // Dynamic spacing so grid remains pleasantly dense but not overcrowded
    const spacing = Math.max(1, maxDim / 16); 
    
    // Draw lines parallel to Z (x-lines)
    for (let x = cx - a_scaled + spacing/2; x < cx + a_scaled; x += spacing) {
      const dx = x - cx;
      const inside = 1 - (dx * dx) / (a_scaled * a_scaled);
      if (inside > 0) {
        const z = b_scaled * Math.sqrt(inside);
        let v1 = new THREE.Vector3(x, 0, -z); let v2 = new THREE.Vector3(x, 0, z);
        const inc = parseFloat(incSlider.value) * (Math.PI/180);
        const node = parseFloat(nodeSlider.value) * (Math.PI/180);
        const argP = parseFloat(argSlider.value) * (Math.PI/180);
        const euler = new THREE.Euler(inc, node, argP, 'YXZ');
        v1.applyEuler(euler); v2.applyEuler(euler);
        gridPts.push(v1); gridPts.push(v2);
      }
    }
    // Draw lines parallel to X (z-lines)
    for (let z = -b_scaled + spacing/2; z < b_scaled; z += spacing) {
      const inside = 1 - (z * z) / (b_scaled * b_scaled);
      if (inside > 0) {
        const x_len = a_scaled * Math.sqrt(inside);
        let v1 = new THREE.Vector3(cx - x_len, 0, z); let v2 = new THREE.Vector3(cx + x_len, 0, z);
        const inc = parseFloat(incSlider.value) * (Math.PI/180);
        const node = parseFloat(nodeSlider.value) * (Math.PI/180);
        const argP = parseFloat(argSlider.value) * (Math.PI/180);
        const euler = new THREE.Euler(inc, node, argP, 'YXZ');
        v1.applyEuler(euler); v2.applyEuler(euler);
        gridPts.push(v1); gridPts.push(v2);
      }
    }
  } else {
    // Parabola or Hyperbola: standard bounding grid that covers the camera's visible area
    const p_scaled = type === 'parabola' ? a_scaled : a_scaled * Math.abs(e * e - 1);
    const gridSize = Math.max(150, p_scaled * 2.5);
    const spacing = gridSize / 30;
    const cx = type === 'parabola' ? 0 : -a_scaled * e;
    const half = gridSize / 2;
    for (let i = -half; i <= half; i += spacing) {
      gridPts.push(new THREE.Vector3(cx + i, 0, -half));
      gridPts.push(new THREE.Vector3(cx + i, 0, half));
      gridPts.push(new THREE.Vector3(cx - half, 0, i));
      gridPts.push(new THREE.Vector3(cx + half, 0, i));
    }
  }

  gridHelper = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(gridPts),
    new THREE.LineBasicMaterial({ color: 0x446699, transparent: true, opacity: 0.45 })
  );
  scene.add(gridHelper);

  // Auto-framing removed as per user request to keep scale of bodies constant on screen

  // Badge
  const em = e.toFixed(3);
  if (type === 'ellipse' && e === 0.0) {
    badge.textContent = `⬤ A mathematically perfect circle. God is pleased.`;
  } else if (type === 'ellipse') {
    badge.textContent = `⬤ Elliptical Orbit  ·  e = ${em}`;
  } else if (type === 'parabola') {
    badge.textContent = `◆ Parabolic Escape  ·  e = ${em}`;
  } else {
    badge.textContent = `▲ God has banished this celestial body to the void.`;
  }
  badge.style.borderColor = type === 'ellipse' ? 'rgba(197,160,72,0.5)' : type === 'parabola' ? 'rgba(255,220,50,0.6)' : 'rgba(255,100,60,0.6)';

  // Period (Kepler 3rd law) — only meaningful for ellipse
  if (type === 'ellipse') {
    const T_s = 2 * Math.PI * Math.sqrt(Math.pow(a * 1.496e11, 3) / (G * M0));
    const T_yr = T_s / (60 * 60 * 24 * 365.25);
    periodValEl.textContent = T_yr.toFixed(2) + ' yrs';
  } else {
    periodValEl.textContent = '∞ (unbound)';
  }

  // Calculate new orbital parameters
  const periapsis = a * Math.abs(1 - e);
  periapsisValEl.textContent = periapsis.toFixed(2) + ' AU';
  
  if (type === 'ellipse') {
    const apoapsis = a * (1 + e);
    apoapsisValEl.textContent = apoapsis.toFixed(2) + ' AU';
  } else {
    apoapsisValEl.textContent = '∞ (unbound)';
  }
  
  let energy;
  const a_m = a * 1.496e11;
  if (type === 'ellipse') {
    energy = - (G * M0) / (2 * a_m);
  } else if (type === 'parabola') {
    energy = 0;
  } else {
    energy = (G * M0) / (2 * a_m); // For hyperbola, E is positive
  }
  const energy_mj = energy / 1e6;
  energyValEl.textContent = energy_mj.toFixed(2) + ' MJ/kg';

  simState = 'running';
  earthMesh.visible = true;
  if (orbitingBodySelect && orbitingBodySelect.value !== 'earth') {
      if (cloudMesh) cloudMesh.visible = false;
      if (atmoMesh) atmoMesh.visible = false;
  } else {
      if (cloudMesh) cloudMesh.visible = true;
      if (atmoMesh) atmoMesh.visible = true;
  }
  velArrow.visible = true;
}

// ── Swept area ────────────────────────────────────────────────
function drawSweptArea(currentPos) {
  if (sweptMesh) { scene.remove(sweptMesh); sweptMesh.geometry.dispose(); sweptMesh = null; }
  if (!prevPosForSwept) { prevPosForSwept = currentPos.clone(); return; }
  sweptFrameCount++;
  if (sweptFrameCount % 3 !== 0) return;

  const origin = new THREE.Vector3(0, 0.01, 0);
  const vertices = [
    origin.x, origin.y, origin.z,
    prevPosForSwept.x, 0.01, prevPosForSwept.z,
    currentPos.x, 0.01, currentPos.z
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex([0, 1, 2]);
  sweptMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: SWEPT_COLOR, transparent: true, opacity: 0.22,
    side: THREE.DoubleSide, depthWrite: false
  }));
  scene.add(sweptMesh);
  prevPosForSwept = currentPos.clone();
}

// ── Animation ─────────────────────────────────────────────────
const BASE_SPEED = 0.008 * 24 * 3600;
let lastT = performance.now();

// ── Particle Tail System ──────────────────────────────────────
const tailGroup = new THREE.Group();
scene.add(tailGroup);
const tails = [];
for (let i = 0; i < 60; i++) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 8, 8), 
    new THREE.MeshBasicMaterial({ color: 0x44ddff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  tails.push(mesh);
  tailGroup.add(mesh);
}
let tFrame = 0;

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const simSpeed = parseFloat(speedSlider.value);
  const dt = ((now - lastT) / 1000) * BASE_SPEED * simSpeed;
  lastT = now;

  if (simState === 'running' && orbitPath) {
    const e = parseFloat(eccSlider.value);
    
    // Smoothly evaluate the position directly from the CatmullRom spline
    const pos = orbitPath.getPointAt(orbitTheta);

    if (pos) {
      const dist2Sun = pos.length();

      // Angular speed proportional to 1/r² (Kepler 2nd law)
      // M0_multiplier changes the speed according to Kepler's third law (v ~ sqrt(M))
      const timeScale = Math.sqrt(M0_multiplier);
      const angStep = dt * 0.000015 * (2.2 / Math.max(dist2Sun, 0.1)) * timeScale;
      
      // If simSpeed is 0, we rely on the manual scrubber (orbitTheta stays static)
      if (simSpeed > 0) {
        if (e < 1) {
          orbitTheta = (orbitTheta + angStep) % 1;
        } else {
          if (orbitTheta < 1) orbitTheta += angStep * 0.7;
        }
        if (trueAnomalySlider && trueAnomalyValSpan) {
           trueAnomalySlider.value = orbitTheta * 360;
           trueAnomalyValSpan.textContent = Math.round(orbitTheta * 360);
        }
      }

      earthMesh.position.set(pos.x, pos.y, pos.z);
      cloudMesh.position.set(pos.x, pos.y, pos.z);
      atmoMesh.position.set(pos.x, pos.y, pos.z);
      
      if (orbitingBodySelect && orbitingBodySelect.value !== 'earth') {
          // Point the mesh at the sun (0,0,0) so the baked bright side faces the sun.
          earthMesh.lookAt(0, 0, 0);
          // Apply an offset so the bright side of the texture actually faces the sun
          // Most baked textures have the bright side at +Z or -Z. Let's add a Y rotation offset.
          earthMesh.rotateY(Math.PI / 2); // adjust if needed
      } else {
          earthMesh.rotation.y += 0.04;
      }
      cloudMesh.rotation.y += 0.055;

      // Update dynamic tail
      if (tFrame % 2 === 0 && showTrailCb && showTrailCb.checked) {
         const tNode = tails.shift();
         tNode.position.copy(pos);
         tNode.position.x += (Math.random() - 0.5) * 1.5;
         tNode.position.y += (Math.random() - 0.5) * 1.5;
         tNode.position.z += (Math.random() - 0.5) * 1.5;
         tNode.material.opacity = 0.7;
         tNode.scale.set(1, 1, 1);
         if (orbitLine) tNode.material.color.setHex(orbitLine.material.color.getHex());
         tails.push(tNode);
      }
      for (let i = 0; i < tails.length; i++) {
         tails[i].material.opacity *= 0.93;
         tails[i].scale.multiplyScalar(0.96);
      }
      tFrame++;

      // Dashboard: distance
      const distAU = (dist2Sun / SF) / 1.496e11;
      distValEl.textContent = distAU.toFixed(3) + ' AU';
      
      // Collision detection (if distance < Sun radius scaled)
      // The sun mesh is scaled to a certain size. In this simulation, let's say collision happens if distAU < 0.2 (just an arbitrary small threshold for collision with a star)
      // Actually, sunMesh has a radius of 20 units. Our distance is in THREE units (dist2Sun).
      if (dist2Sun < 25) {
         collisionWarningEl.style.display = 'block';
      } else {
         collisionWarningEl.style.display = 'none';
      }

      // Dashboard: velocity (v = sqrt(GM(2/r - 1/a)))
      const a_m = parseFloat(aSlider.value) * 1.496e11;
      const r_m = dist2Sun / SF;
      let v_ms;
      if (e < 0.999) {
        v_ms = Math.sqrt(Math.max(0, G * M0 * (2 / r_m - 1 / a_m)));
      } else {
        v_ms = Math.sqrt(Math.max(0, G * M0 * (2 / r_m)));
      }
      velValEl.textContent = (v_ms / 1000).toFixed(2) + ' km/s';

      // Velocity arrow
      if (showVecCb && showVecCb.checked) {
        const tangDir = new THREE.Vector3(-pos.z, 0, pos.x).normalize();
        velArrow.position.copy(pos);
        velArrow.setDirection(tangDir);
        velArrow.setLength(Math.min((v_ms / 1000) * 0.4 + 3.0, 15), 4.0, 2.5);
        velArrow.visible = true;
      } else {
        velArrow.visible = false;
      }

      // Swept area
      drawSweptArea(pos);
    }
  }

  sunMesh.rotation.y += 0.0018;
  controls.update();
  composer.render();
}

// ── Visibility toggle for vectors ─────────────────────────────
showVecCb.addEventListener('change', () => {
  velArrow.visible = showVecCb.checked;
});

// ── Resize ────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

// ── Init ──────────────────────────────────────────────────────
buildAndSetOrbit();
animate();