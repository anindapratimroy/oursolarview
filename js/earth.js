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
  const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
  camera.position.set(0, 0, 3.5);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x224466, 1.2);
  scene.add(ambientLight);
  const sunLight = new THREE.DirectionalLight(0xfff4e0, 3.5);
  sunLight.position.set(3, 2, 4);
  scene.add(sunLight);
  const rimLight = new THREE.DirectionalLight(0x4488ff, 0.8);
  rimLight.position.set(-4, 0, -2);
  scene.add(rimLight);

  // Earth sphere
  const geo = new THREE.SphereGeometry(1, 64, 64);
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
  const earthTex  = loader.load('./planets/img_earth/earth_day_4096.jpg');
  const normalTex = loader.load('./planets/img_earth/earth_normal_2048.jpg');
  const cloudTex  = loader.load('./planets/img_earth/earth_clouds_1024.png');

  const mat = new THREE.MeshPhongMaterial({
    map: earthTex,
    normalMap: normalTex,
    normalScale: new THREE.Vector2(0.8, 0.8),
    shininess: 22,
    specular: new THREE.Color(0x3366aa),
  });

  const earth = new THREE.Mesh(geo, mat);
  earth.rotation.z = THREE.MathUtils.degToRad(23.4);
  scene.add(earth);

  // Cloud layer
  const cloudGeo = new THREE.SphereGeometry(1.012, 64, 64);
  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloudTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const clouds = new THREE.Mesh(cloudGeo, cloudMat);
  scene.add(clouds);

  // Atmosphere glow
  const atmoGeo = new THREE.SphereGeometry(1.06, 64, 64);
  const atmoMat = new THREE.MeshPhongMaterial({
    color: 0x4488cc,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(atmoGeo, atmoMat));

  // ── Mouse DRAG rotation ─────────────────────────────────────
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let rotX = 0, rotY = 0; // cumulative drag rotation
  let velX = 0, velY = 0; // inertia velocity
  let autoRotSpeed = 0.0025;

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
      velX *= 0.95; // friction
      velY *= 0.95;
      rotX += velX;
      rotY += velY;
      // Auto-rotate when not dragging
      rotY += autoRotSpeed;
    }
    earth.rotation.x = rotX;
    earth.rotation.y = rotY;
    clouds.rotation.x = rotX;
    clouds.rotation.y = rotY + 0.002;
    renderer.render(scene, camera);
  }
  animate();
  sceneManager.registerFrame(animId);

  // Re-hide on resize below breakpoint
  window.addEventListener('resize', () => {
    earthWrap.parentElement.style.display = window.innerWidth < 1100 ? 'none' : 'flex';
  });
}
