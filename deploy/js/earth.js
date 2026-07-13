import * as THREE from 'three';
import { sceneManager } from './SceneManager.js';

export function initEarth() {
  const earthWrap = document.getElementById('earth-canvas-wrap');
  const earthCanvas = document.getElementById('earth-renderer');
  if (window.innerWidth < 1100 || !earthWrap || !earthCanvas) {
     return;
  }
  
  const W = earthWrap.offsetWidth || 380;
  const H = earthWrap.offsetHeight || 380;

  const renderer = new THREE.WebGLRenderer({ canvas: earthCanvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = false;
  sceneManager.registerRenderer(renderer);

  const scene = new THREE.Scene();
  sceneManager.registerScene(scene);
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
  camera.position.set(0, 0, 5.28);

  // Lighting
  const lightDir = new THREE.Vector3(5, 3, 5).normalize();
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.copy(lightDir.clone().multiplyScalar(10));
  scene.add(directionalLight);

  // ── Cinematic Loader ──────────────────────────────────────────
  const manager    = new THREE.LoadingManager();
  const preloader  = document.getElementById('preloader');
  const $bar       = document.getElementById('preProgressBar');
  const $glow      = document.getElementById('preProgressGlow');
  const $label     = document.getElementById('preLabel');
  const $pct       = document.getElementById('prePct');
  const $log       = document.getElementById('preLog');

  // Stage messages shown at progress milestones
  const STAGES = [
    { at:  0, msg: 'Igniting the stars...',              log: '▸ Cosmos engine online' },
    { at: 10, msg: 'Weaving space-time fabric...',       log: '▸ Rendering three.js scene' },
    { at: 25, msg: 'Painting the pale blue dot...',      log: '▸ Loading Earth day texture' },
    { at: 45, msg: 'Stitching the night-side lights...', log: '▸ Loading Earth night texture' },
    { at: 65, msg: 'Sculpting cloud formations...',      log: '▸ Loading cloud & specular maps' },
    { at: 80, msg: 'Calibrating orbital mechanics...',   log: '▸ Compiling shaders & geometry' },
    { at: 92, msg: 'Initialising planetary atlas...',    log: '▸ Finalising scene graph' },
    { at: 99, msg: 'The universe awaits...',             log: '▸ Handing control to the God' },
  ];
  let lastStageIdx = -1;

  function setProgress(pct) {
    const p = Math.min(100, Math.max(0, Math.round(pct)));
    if ($bar)  $bar.style.width  = p + '%';
    if ($glow) $glow.style.width = p + '%';
    if ($pct)  $pct.textContent  = p + '%';

    // Check for stage transitions
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (p >= STAGES[i].at && i > lastStageIdx) {
        lastStageIdx = i;
        // Update label with fade
        if ($label) {
          $label.style.opacity = '0';
          setTimeout(() => {
            $label.textContent    = STAGES[i].msg;
            $label.style.opacity  = '1';
          }, 200);
        }
        // Add log entry
        if ($log) {
          const prev = $log.querySelector('.pre-log-item.active');
          if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
          const li = document.createElement('div');
          li.className = 'pre-log-item active';
          li.textContent = STAGES[i].log;
          $log.appendChild(li);
          // Keep only last 3 lines visible
          const items = $log.querySelectorAll('.pre-log-item');
          if (items.length > 3) items[0].remove();
        }
        break;
      }
    }
  }

  // Dismiss the loader
  function dismissLoader() {
    setProgress(100);
    if ($label) { $label.style.opacity='0'; setTimeout(()=>{ $label.textContent='The universe is yours.'; $label.style.opacity='1'; }, 200); }
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('out');
        setTimeout(() => { preloader.remove(); startPrefetch(); }, 850);
      }
    }, 320);
  }

  if (preloader) {
    // Start at 5% immediately so the bar isn't dead on load
    setTimeout(() => setProgress(5), 50);

    manager.onProgress = function(_url, loaded, total) {
      if (total > 0) {
        // Map actual loaded/total to 10–95 range (first 10 and last 5 are bookend stages)
        const real = 10 + (loaded / total) * 85;
        setProgress(real);
      }
    };

    manager.onLoad = function() {
      dismissLoader();
    };

    // Safety: if THREE textures somehow all load before manager fires, dismiss after 800ms
    manager.onError = function() {
      dismissLoader();
    };
  }

  /* ─── Background Prefetch ────────────────────────────────────
     After the homepage finishes, tell the browser to fetch the
     HTML and key JS of all other sections so clicking a nav
     link feels instant.
  ─────────────────────────────────────────────────────────────── */
  function startPrefetch() {
    const PAGES = [
      { href: './solarsystem/index.html',     as: 'document' },
      { href: './trajectory/index.html',      as: 'document' },
      { href: './compare/index.html',         as: 'document' },
      { href: './spacecraft/index.html',      as: 'document' },
      { href: './solarsystem/solarsystem.js', as: 'script' },
      { href: './trajectory/trajectory.js',   as: 'script' },
      { href: './compare/comparison.js',      as: 'script' },
      { href: './spacecraft/spacecraft.js',   as: 'script' },
    ];
    PAGES.forEach(({ href, as: asAttr }) => {
      const link = document.createElement('link');
      link.rel  = 'prefetch';
      link.href = href;
      link.as   = asAttr;
      document.head.appendChild(link);
    });
    console.log('[SolarVerse] Background prefetch started for all sections.');
  }


  const loader = new THREE.TextureLoader(manager);
  const texDay    = loader.load('./planets/img_earth/earth_day_4096.jpg');
  const texNight  = loader.load('./planets/img_earth/earth_night_4096.jpg');
  const texClouds = loader.load('./planets/img_earth/earth_clouds_1024.png');

  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dayTex:        { value: texDay   },
      nightTex:      { value: texNight },
      lightDirection:{ value: lightDir },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTex;
      uniform sampler2D nightTex;
      uniform vec3 lightDirection;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        float light = dot(normalize(vNormal), normalize(lightDirection));
        light = clamp(light, 0.0, 1.0);
        vec4 dayColor   = texture2D(dayTex,   vUv);
        vec4 nightColor = texture2D(nightTex, vUv);
        vec4 color = mix(nightColor, dayColor, light);
        gl_FragColor = color;
      }
    `
  });

  const earth = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 64), earthMaterial);
  scene.add(earth);

  // Cloud layer
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(2.02, 64, 64),
    new THREE.MeshPhongMaterial({ map: texClouds, transparent: true, opacity: 0.4, depthWrite: false })
  );
  scene.add(clouds);

  // ── Mouse DRAG rotation ─────────────────────────────────────
  let isDragging   = false;
  let prevMouseX   = 0, prevMouseY = 0;
  let rotX = 0, rotY = 0;   // cumulative drag rotation
  let velX = 0, velY = 0;   // inertia velocity
  const autoRotSpeed  = 0.0025;
  const RETURN_SPEED  = 0.028; // spring-return speed for rotX after drag

  earthCanvas.addEventListener('mousedown', e => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    velX = 0; velY = 0;
    earthCanvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouseX;
    const dy = e.clientY - prevMouseY;
    velX = dy * 0.005;
    velY = dx * 0.005;
    rotX += velX;
    rotY += velY;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    earthCanvas.style.cursor = 'grab';
  });

  // Touch support
  earthCanvas.addEventListener('touchstart', e => {
    isDragging = true;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
    velX = 0; velY = 0;
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - prevMouseX;
    const dy = e.touches[0].clientY - prevMouseY;
    velX = dy * 0.005;
    velY = dx * 0.005;
    rotX += velX;
    rotY += velY;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });

  // Initial rotation to show a bright, sunlit side (e.g. the Americas/Atlantic) on load
  rotY = 1.8;

  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    if (window.APP_PAUSED) return;

    if (!isDragging) {
      // Friction — inertia decays
      velX *= 0.92;
      velY *= 0.92;
      rotX += velX;
      rotY += velY;

      // Auto-rotate Y (continues from wherever user left it)
      rotY += 0.001;

      // ── Spring-return to upright ─────────────────────────────
      // After the user lets go, rotX (vertical tilt) gently
      // lerps back toward 0 (upright), giving a natural "snap back".
      // rotY is intentionally NOT reset — keeping the current face.
      rotX += (0 - rotX) * RETURN_SPEED;
    }

    earth.rotation.x  = rotX;
    earth.rotation.y  = rotY;
    clouds.rotation.x = rotX;
    clouds.rotation.y = rotY + 0.0005; // cloud net rotation 0.0015

    // Static light: The sun stays fixed in space while the Earth rotates underneath it.
    // This allows the day/night terminator to sweep across the continents naturally.
    const staticLightDir = new THREE.Vector3(5, 3, 5).normalize();
    earthMaterial.uniforms.lightDirection.value = staticLightDir;
    
    // Position the actual DirectionalLight (used for scene illumination if any other objects exist)
    directionalLight.position.copy(staticLightDir.clone().multiplyScalar(10));

    renderer.render(scene, camera);
  }
  animate();
  sceneManager.registerFrame(animId);

  // Re-hide on resize below breakpoint
  window.addEventListener('resize', () => {
    earthWrap.parentElement.style.display = window.innerWidth < 1100 ? 'none' : 'flex';
  });
}
