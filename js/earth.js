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

  // Loading Manager
  const manager = new THREE.LoadingManager();
  const preloader = document.getElementById('preloader');
  const spinner = document.querySelector('.pre-spinner');
  const preLabel = document.querySelector('.pre-label');
  
  if (preloader) {
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      if (preLabel) preLabel.innerText = `Loading Assets (${Math.round((itemsLoaded / itemsTotal) * 100)}%)`;
    };
    manager.onLoad = function () {
      preloader.classList.add('out');
      setTimeout(() => preloader.remove(), 700);
    };
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

    // Dynamic light
    const rotationMatrix  = new THREE.Matrix4().makeRotationY(earth.rotation.y);
    const dynamicLightDir = new THREE.Vector3(5, 3, 5).applyMatrix4(rotationMatrix).normalize();
    earthMaterial.uniforms.lightDirection.value = dynamicLightDir;
    directionalLight.position.copy(dynamicLightDir.clone().multiplyScalar(10));

    renderer.render(scene, camera);
  }
  animate();
  sceneManager.registerFrame(animId);

  // Re-hide on resize below breakpoint
  window.addEventListener('resize', () => {
    earthWrap.parentElement.style.display = window.innerWidth < 1100 ? 'none' : 'flex';
  });
}
