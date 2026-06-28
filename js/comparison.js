import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PLANET_DATA = {
  sun: {
    name: 'Sun', radiusKm: 696340,
    texture: '../planets/img_others/2k_sun.jpg', color: 0xffdd44,
    data: {
      'Diameter': '1,392,700 km', 'Mass': '1.989 × 10³⁰ kg', 'Gravity': '274 m/s²',
      'Day Length': '25-35 Earth days', 'Year Length': 'N/A', 'Avg Temp': '5,500 °C',
      'Moons': '0', 'Axial Tilt': '7.25°', 'Orbital Speed': '220 km/s',
      'Distance from Sun': '0 km', 'Atmosphere': 'Hydrogen, Helium',
      'Magnetic Field': 'Extremely strong (Solar dynamo)'
    },
    emissive: true
  },
  mercury: {
    name: 'Mercury', radiusKm: 2439.7,
    texture: '../planets/img_others/2k_mercury.jpg', color: 0xaaaaaa,
    data: {
      'Diameter': '4,879 km', 'Mass': '3.30 × 10²³ kg', 'Gravity': '3.7 m/s²',
      'Day Length': '4,222.6 hours', 'Year Length': '88 Earth days', 'Avg Temp': '167 °C',
      'Moons': '0', 'Axial Tilt': '0.034°', 'Orbital Speed': '47.4 km/s',
      'Distance from Sun': '57.9 million km', 'Atmosphere': 'Negligible (trace O₂, Na)',
      'Magnetic Field': 'Weak (1% of Earth)'
    }
  },
  venus: {
    name: 'Venus', radiusKm: 6051.8,
    texture: '../planets/img_others/2k_venus_surface.jpg', color: 0xe8cda0,
    data: {
      'Diameter': '12,104 km', 'Mass': '4.87 × 10²⁴ kg', 'Gravity': '8.87 m/s²',
      'Day Length': '2,802 hours', 'Year Length': '225 Earth days', 'Avg Temp': '464 °C',
      'Moons': '0', 'Axial Tilt': '177.4° (retrograde)', 'Orbital Speed': '35 km/s',
      'Distance from Sun': '108.2 million km', 'Atmosphere': 'Thick CO₂, sulphuric acid clouds',
      'Magnetic Field': 'None detected'
    }
  },
  earth: {
    name: 'Earth', radiusKm: 6371,
    texture: '../planets/img_earth/earth_day_4096.jpg', color: 0x4488dd,
    normalMap: '../planets/img_earth/earth_normal_2048.jpg',
    data: {
      'Diameter': '12,742 km', 'Mass': '5.97 × 10²⁴ kg', 'Gravity': '9.81 m/s²',
      'Day Length': '24 hours', 'Year Length': '365.25 days', 'Avg Temp': '15 °C',
      'Moons': '1 (Moon)', 'Axial Tilt': '23.4°', 'Orbital Speed': '29.8 km/s',
      'Distance from Sun': '149.6 million km', 'Atmosphere': 'N₂ (78%), O₂ (21%)',
      'Magnetic Field': 'Strong (shields surface)'
    }
  },
  mars: {
    name: 'Mars', radiusKm: 3389.5,
    texture: '../planets/img_others/2k_mars.jpg', color: 0xcc5533,
    data: {
      'Diameter': '6,779 km', 'Mass': '6.39 × 10²³ kg', 'Gravity': '3.72 m/s²',
      'Day Length': '24.6 hours', 'Year Length': '687 Earth days', 'Avg Temp': '-65 °C',
      'Moons': '2 (Phobos, Deimos)', 'Axial Tilt': '25.2°', 'Orbital Speed': '24.1 km/s',
      'Distance from Sun': '227.9 million km', 'Atmosphere': 'Thin CO₂ (95%)',
      'Magnetic Field': 'None (remnant localised)'
    }
  },
  jupiter: {
    name: 'Jupiter', radiusKm: 69911,
    texture: '../planets/img_others/2k_jupiter.jpg', color: 0xcc9966,
    data: {
      'Diameter': '139,820 km', 'Mass': '1.90 × 10²⁷ kg', 'Gravity': '24.79 m/s²',
      'Day Length': '9.9 hours', 'Year Length': '11.86 Earth years', 'Avg Temp': '-110 °C',
      'Moons': '95 known', 'Axial Tilt': '3.1°', 'Orbital Speed': '13.1 km/s',
      'Distance from Sun': '778.5 million km', 'Atmosphere': 'H₂ & He (gas giant)',
      'Magnetic Field': 'Very strong (14× Earth)'
    }
  },
  saturn: {
    name: 'Saturn', radiusKm: 58232,
    texture: '../planets/img_others/2k_saturn.jpg', color: 0xddcc88,
    data: {
      'Diameter': '116,460 km', 'Mass': '5.68 × 10²⁶ kg', 'Gravity': '10.44 m/s²',
      'Day Length': '10.7 hours', 'Year Length': '29.5 Earth years', 'Avg Temp': '-140 °C',
      'Moons': '146 known', 'Axial Tilt': '26.7°', 'Orbital Speed': '9.7 km/s',
      'Distance from Sun': '1.43 billion km', 'Atmosphere': 'H₂ & He, iconic rings',
      'Magnetic Field': 'Strong (578× Earth volume)'
    }
  },
  uranus: {
    name: 'Uranus', radiusKm: 25362,
    texture: '../planets/img_others/2k_uranus.jpg', color: 0x88ddee,
    data: {
      'Diameter': '50,724 km', 'Mass': '8.68 × 10²⁵ kg', 'Gravity': '8.87 m/s²',
      'Day Length': '17.2 hours', 'Year Length': '84 Earth years', 'Avg Temp': '-195 °C',
      'Moons': '28 known', 'Axial Tilt': '97.8° (rotates on side)', 'Orbital Speed': '6.8 km/s',
      'Distance from Sun': '2.87 billion km', 'Atmosphere': 'H₂, He, methane (ice giant)',
      'Magnetic Field': 'Moderate, strongly tilted'
    }
  },
  neptune: {
    name: 'Neptune', radiusKm: 24622,
    texture: '../planets/img_others/2k_neptune.jpg', color: 0x3355cc,
    data: {
      'Diameter': '49,244 km', 'Mass': '1.02 × 10²⁶ kg', 'Gravity': '11.15 m/s²',
      'Day Length': '16.1 hours', 'Year Length': '165 Earth years', 'Avg Temp': '-200 °C',
      'Moons': '16 known', 'Axial Tilt': '28.3°', 'Orbital Speed': '5.4 km/s',
      'Distance from Sun': '4.50 billion km', 'Atmosphere': 'H₂, He, methane (ice giant)',
      'Magnetic Field': 'Moderate, strongly tilted'
    }
  }
};

const EARTH_RADIUS_KM = 6371;
const BASE_RADIUS = 1.8;

function visualRadius(key) {
  const ratio = PLANET_DATA[key].radiusKm / EARTH_RADIUS_KM;
  return BASE_RADIUS * ratio;
}

function buildViewer(canvasId, wrapperId, loaderId) {
  const canvas  = document.getElementById(canvasId);
  const wrapper = document.getElementById(wrapperId);
  const loader  = document.getElementById(loaderId);

  const W = wrapper.clientWidth  || 340;
  const H = wrapper.clientHeight || 340;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 50000);
  camera.position.set(0, 0, 7);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 50000;

  scene.add(new THREE.AmbientLight(0x222244, 1.2));
  const sun = new THREE.DirectionalLight(0xfff4e0, 2.5);
  sun.position.set(5, 3, 5);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x4466aa, 0.4);
  rim.position.set(-5, -2, -5);
  scene.add(rim);

  let mesh = null;
  let animId = null;
  const texLoader = new THREE.TextureLoader();

  function loadPlanet(key) {
    return new Promise((resolve) => {
      if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); mesh = null; }
      if (animId) { cancelAnimationFrame(animId); animId = null; }

      const pd = PLANET_DATA[key];
      const radius = visualRadius(key);

      function onLoaded(tex) {
        const matParams = { 
          map: tex, 
          shininess: pd.name === 'Earth' ? 25 : 5,
          color: tex ? 0xffffff : pd.color 
        };
        
        if (pd.emissive) {
          matParams.emissive = new THREE.Color(0xffffff);
          matParams.emissiveMap = tex;
          matParams.emissiveIntensity = 1.0;
        }
        
        const mat = new THREE.MeshPhongMaterial(matParams);
        
        if (pd.normalMap) {
          texLoader.load(pd.normalMap, (nmap) => {
            mat.normalMap = nmap;
            mat.normalScale = new THREE.Vector2(0.8, 0.8);
            mat.needsUpdate = true;
          });
        }
        
        const geo = new THREE.SphereGeometry(radius, 64, 64);
        mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        
        // Dynamically adjust camera based on body size to prevent clipping
        camera.position.set(0, 0, Math.max(7, radius * 3.5));

        if (pd.name === 'Earth') {
          const cloudTex = texLoader.load('../planets/img_earth/earth_clouds_1024.png');
          const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTex, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
          const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.015, 64, 64), cloudMat);
          mesh.add(cloudMesh);

          const atmoMat = new THREE.MeshPhongMaterial({ color: 0x4488cc, transparent: true, opacity: 0.15, side: THREE.BackSide, depthWrite: false });
          const atmoMesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.08, 64, 64), atmoMat);
          mesh.add(atmoMesh);
        }

        function animate() {
          animId = requestAnimationFrame(animate);
          if (mesh && !controls.state) {
            mesh.rotation.y += 0.002;
            if (mesh.children.length > 0) {
               mesh.children[0].rotation.y += 0.001;
            }
          }
          controls.update();
          renderer.render(scene, camera);
        }
        animate();
        
        // Canvas fade-in effect on swap
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.5s ease';
        setTimeout(() => canvas.style.opacity = '1', 50);

        resolve();
      }

      texLoader.load(pd.texture, onLoaded, undefined, () => onLoaded(null));
    });
  }

  window.addEventListener('resize', () => {
    const nW = wrapper.clientWidth  || 340;
    const nH = wrapper.clientHeight || 340;
    renderer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  });

  return { loadPlanet, camera };
}

function updateTable(leftKey, rightKey) {
  const lp = PLANET_DATA[leftKey];
  const rp = PLANET_DATA[rightKey];
  document.getElementById('compare-th-left').textContent  = lp.name;
  document.getElementById('compare-th-right').textContent = rp.name;

  const tbody = document.getElementById('compare-tbody');
  tbody.innerHTML = '';
  Object.keys(lp.data).forEach(prop => {
    const lv = lp.data[prop] || '—';
    const rv = rp.data[prop] || '—';
    
    // Attempt to parse numbers to create visual ratio bars
    let leftRatio = 0;
    let rightRatio = 0;
    
    if (lv !== '—' && rv !== '—') {
      const ln = parseFloat(lv.replace(/,/g, '').split(' ')[0]);
      const rn = parseFloat(rv.replace(/,/g, '').split(' ')[0]);
      if (!isNaN(ln) && !isNaN(rn) && (ln !== 0 || rn !== 0)) {
        const max = Math.max(ln, rn);
        leftRatio = (ln / max) * 100;
        rightRatio = (rn / max) * 100;
      }
    }
    
    // Build bar HTML if we have valid ratios
    let barHtml = '';
    if (leftRatio > 0 || rightRatio > 0) {
      barHtml = `
        <div class="ratio-bar-container" style="position:absolute; bottom:0; left:0; padding: 0 10px; width: 100%; pointer-events:none;">
          <div class="ratio-bar-left"><div class="ratio-fill ratio-fill-left" style="width: ${leftRatio}%"></div></div>
          <div class="ratio-bar-right"><div class="ratio-fill ratio-fill-right" style="width: ${rightRatio}%"></div></div>
        </div>
      `;
    }
    
    const tr = document.createElement('tr');
    tr.style.position = 'relative';
    tr.innerHTML =
      '<td class="compare-td-label">' + prop + '</td>' +
      '<td class="compare-td-val">' + lv + '</td>' +
      '<td class="compare-td-val">' + rv + barHtml + '</td>';
    tbody.appendChild(tr);
  });
  
  // God Easter Egg
  if ((leftKey === 'earth' && rightKey === 'jupiter') || (leftKey === 'jupiter' && rightKey === 'earth')) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3" style="text-align:center; color:var(--gold); padding:20px; font-family:\'Space Mono\', monospace; letter-spacing:0.05em; font-size:0.8rem;">"You built one for life, and the other to protect it."</td>';
    tbody.appendChild(tr);
  }
}

export function initComparison() {
  const leftViewer  = buildViewer('compare-canvas-left',  'compare-canvas-wrap-left',  'compare-loader-left');
  const rightViewer = buildViewer('compare-canvas-right', 'compare-canvas-wrap-right', 'compare-loader-right');

  const selLeft   = document.getElementById('select-left');
  const selRight  = document.getElementById('select-right');
  const nameLeft  = document.getElementById('compare-name-left');
  const nameRight = document.getElementById('compare-name-right');

  const globalLoader = document.getElementById('compare-global-loader');
  const globalText = document.getElementById('compare-global-text');
  const phrases = [
    "God is retrieving celestial bodies...",
    "God is forging the heavy elements...",
    "God is aligning the orbits...",
    "God is calibrating the scales...",
    "God is admiring the masterpiece..."
  ];

  async function refresh(isInitialLoad = false) {
    if (isInitialLoad && globalLoader) {
      globalLoader.style.display = 'flex';
      globalLoader.style.opacity = '1';
      let currentPct = 0;
      globalLoader.dataset.phraseInterval = setInterval(() => {
        if (globalText) {
          globalText.style.opacity = "0";
          setTimeout(() => {
            const currentText = phrases[Math.floor(Math.random() * phrases.length)];
            globalText.innerText = `${currentText} (${currentPct}%)`;
            globalText.style.opacity = "1";
          }, 300);
        }
      }, 700);

      globalLoader.dataset.pctInterval = setInterval(() => {
        if (currentPct < 99) {
          currentPct += Math.floor(Math.random() * 2) + 1;
          if (currentPct > 99) currentPct = 99;
          
          if (globalText && globalText.style.opacity !== "0") {
            const baseText = globalText.innerText.split(' (')[0] || phrases[0];
            globalText.innerText = `${baseText} (${currentPct}%)`;
          }
        }
      }, 45);
    }

    const lk = selLeft.value;
    const rk = selRight.value;

    const startTime = Date.now();
    await Promise.all([
      leftViewer.loadPlanet(lk),
      rightViewer.loadPlanet(rk)
    ]);
    
    // Dynamic synchronized camera logic for true 1:1 scale
    const lRad = visualRadius(lk);
    const rRad = visualRadius(rk);
    const maxRad = Math.max(lRad, rRad);
    
    // Calculate distance to fit the largest planet (fov is 45 deg)
    // distance = radius / tan(22.5 deg) * margin
    const dist = (maxRad / Math.tan((22.5 * Math.PI) / 180)) * 1.5;
    const finalDist = Math.max(dist, 7); // minimum distance of 7
    
    leftViewer.camera.position.set(0, 0, finalDist);
    rightViewer.camera.position.set(0, 0, finalDist);

    // Optional: if UI has name elements
    if (nameLeft) nameLeft.textContent = PLANET_DATA[lk].name;
    if (nameRight) nameRight.textContent = PLANET_DATA[rk].name;
    
    updateTable(lk, rk);

    if (isInitialLoad && globalLoader) {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 4500 - Math.min(elapsed, 4500)); // wait up to 4.5s
      setTimeout(() => {
        if (globalText) {
          const baseText = globalText.innerText.split(' (')[0] || phrases[0];
          globalText.innerText = `${baseText} (100%)`;
        }
        clearInterval(globalLoader.dataset.phraseInterval);
        clearInterval(globalLoader.dataset.pctInterval);
        globalLoader.style.opacity = '0';
        setTimeout(() => globalLoader.style.display = 'none', 600);
      }, delay);
    }
  }

  selLeft.addEventListener('change', () => refresh(false));
  selRight.addEventListener('change', () => refresh(false));

  refresh(true);
}
