// import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";
// import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js';
// import * as THREE from "https://unpkg.com/three@0.129.0/build/three.module.js?module";
// import { OrbitControls } from "https://unpkg.com/three@0.129.0/examples/jsm/controls/OrbitControls.js?module";
// import {
//   CSS2DRenderer,
//   CSS2DObject
// } from "https://unpkg.com/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js?module";
// import { EffectComposer } from "https://unpkg.com/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js?module";
// import { RenderPass } from "https://unpkg.com/three@0.129.0/examples/jsm/postprocessing/RenderPass.js?module";
// import { UnrealBloomPass } from "https://unpkg.com/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js?module";


// --- Clean Imports using Import Map ---
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.129.0/build/three.module.js";

// import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// import {
//   CSS2DRenderer,
//   CSS2DObject
// } from "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";

// import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";
// --- Scene & Camera ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.set(50,10,0);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Label Renderer ---
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0";
labelRenderer.domElement.style.left = "0";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Lights ---
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
scene.add(new THREE.PointLight(0xffffff, 2, 3000));


const starGeometry = new THREE.BufferGeometry();
const starPositions = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - .5) * 8000;
  const y = (Math.random() - 0.5) * 9000;
  const z = (Math.random() - 0.5) * 8000;
  starPositions.push(x, y, z);
}
starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);



// --- Ellipse Ring ---
function createEllipseRing(radiusX, radiusY, centrex=0, segments=200) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i/segments) * 2 * Math.PI;
    points.push(new THREE.Vector3(radiusX*Math.cos(theta)+centrex, 0, radiusY*Math.sin(theta)));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x00AEEF, transparent:true, opacity:0.2 });
  return new THREE.LineLoop(geometry, material);
}

// --- Orbits data ---
const orbitsData = [
  { a: 9.097,   b: 8.902594,  cx: -0.361 },   
  { a: 16.998,  b: 16.997610, cx: -0.011 },   
  { a: 23.5,    b: 23.496719, cx: -0.392 },   
  { a: 35.806,  b: 35.649507, cx: -0.667 },   
  { a: 122.279, b: 122.135775, cx: -2.519 },  
  { a: 224.121, b: 223.795666, cx: -8.436 },  
  { a: 450.995, b: 450.491123, cx: -9.868 },  
  { a: 706.621, b: 706.594926, cx: -5.462 },  
];
orbitsData.forEach(o => scene.add(createEllipseRing(o.a,o.b,o.cx)));
  
  // --- Loading Manager ---
  const manager = new THREE.LoadingManager();
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'solarsystem-loader';
  loadingOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:var(--navy); z-index:9999; display:flex; justify-content:center; align-items:center; color:var(--gold); font-family:"Space Mono", monospace; font-size:1.2rem; flex-direction:column; gap:20px; transition:opacity 0.5s;';
  
  const loadingText = document.createElement('div');
  loadingText.innerText = 'God is sketching the blueprint of the cosmos... (0%)';
  
  const spinner = document.createElement('i');
  spinner.className = 'fa-solid fa-circle-notch fa-spin fa-2x';
  
  loadingOverlay.appendChild(spinner);
  loadingOverlay.appendChild(loadingText);
  document.body.appendChild(loadingOverlay);

  const startTime = Date.now();
  const phrases = [
    "God is sketching the blueprint of the cosmos...",
    "God is forging the heavy elements...",
    "God is carefully designing the planetary orbits...",
    "God is calibrating the laws of physics...",
    "God is fine-tuning the speed of light...",
    "God is painting the atmospheric clouds...",
    "God is scattering cosmic dust...",
    "God is admiring the final masterpiece..."
  ];
  let currentPct = 0;
  
  const phraseInterval = setInterval(() => {
    const randPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    loadingText.innerText = `${randPhrase} (${currentPct}%)`;
  }, 800);

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    currentPct = Math.round((itemsLoaded / itemsTotal) * 100);
    const currentText = loadingText.innerText.split(' (')[0] || phrases[0];
    loadingText.innerText = `${currentText} (${currentPct}%)`;
  };
  manager.onLoad = function () {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, 3000 - elapsed);
    setTimeout(() => {
      clearInterval(phraseInterval);
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.remove(), 500);
    }, delay);
  };

  // --- Textures & Planets ---
  const textureLoader = new THREE.TextureLoader(manager);
function loadPlanetTexture(texture, radius) {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ 
    map: textureLoader.load(texture),
    roughness: 1,
    metalness: 0,
    bumpMap: textureLoader.load(texture),
    bumpScale: 0.05

   });
  return new THREE.Mesh(geo, mat);
}

// --- Orbital periods normalized to Earth = 1 ---

const textureLoader1 = new THREE.TextureLoader(manager);
const fireTexture = textureLoader1.load('../planets/img_others/8k_sun.jpg');
fireTexture.wrapS = fireTexture.wrapT = THREE.RepeatWrapping;
// Sun Material
const sunMaterial = new THREE.MeshStandardMaterial({
  map: fireTexture,
  emissive: new THREE.Color(0xffaa00),
  emissiveMap: fireTexture,
  emissiveIntensity: 2
});

// Sun Mesh
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);
const sunLight = new THREE.PointLight(0xfff4e0, 3, 1000);
sunLight.position.copy(sunMesh.position);
scene.add(sunLight);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85));

// --- Planets array with additional info ---
const planets = [
  { mesh: loadPlanetTexture("../planets/img_others/2k_sun.jpg", 4.9), key: "sun",
    details: "The Sun is the star at the center of the Solar System.",
    funFact: "The Sun accounts for 99.86% of the total mass of the Solar System!",
    info: {
      type: "Star",
      radiusKm: "695,700",
      massEarths: "330,000",
      volumeEarths: "1,300,000",
      densityGmCm3: "1.41",
      surfaceAreaKm2: "6.09e12",
      gravityEarths: "27.9",
      escapeVelocityKms: "617.7",
      avgTempC: "5,500 (surface)",
      avgTempF: "9,940 (surface)",
      minTempC: "N/A",
      maxTempC: "N/A",
      albedo: "N/A",
      rotationPeriodEarthDays: "27 (equator)",
      equatorialRotationVelocityKms: "1.99",
      axialTiltDegrees: "7.25",
      obliquityToOrbitDegrees: "N/A", // Sun is the center
      flattening: "0.00005",
      orbitalPeriodEarthDays: "N/A", // Sun doesn't orbit
      distanceFromSunAU: "N/A",
      orbitalVelocityKms: "N/A",
      semiMajorAxisAU: "N/A",
      semiMinorAxisAU: "N/A",
      perihelionKm: "N/A",
      aphelionKm: "N/A",
      eccentricity: "N/A",
      inclinationDegrees: "N/A",
      siderealPeriodEarthDays: "N/A",
      synodicPeriodEarthDays: "N/A",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "73% Hydrogen, 25% Helium, trace elements",
      coreComposition: "Hydrogen, Helium plasma",
      crustComposition: "N/A (no solid surface)",
      mantleComposition: "N/A (plasma)",
      surfacePressureBars: "N/A (no solid surface)",
      atmosphereComposition: "Hydrogen, Helium plasma",
      greenhouseEffect: "N/A",
      magneticField: "Strong, complex",
      moons: "0",
      rings: "No",
      apparentMagnitude: "-26.74",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Solar flares, sunspots, coronal mass ejections, source of light and heat for the Solar System."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_mercury.jpg", 1), key: "mercury",
    details: "Mercury is the smallest planet in our solar system and closest to the Sun.",
    funFact: "A day on Mercury is longer than its year!",
    info: {
      type: "Terrestrial Planet",
      radiusKm: "2,439",
      massEarths: "0.055",
      volumeEarths: "0.056",
      densityGmCm3: "5.43",
      surfaceAreaKm2: "7.48e7",
      gravityEarths: "0.38",
      escapeVelocityKms: "4.3",
      avgTempC: "-173 to 427",
      avgTempF: "-280 to 800",
      minTempC: "-173",
      maxTempC: "427",
      albedo: "0.142",
      rotationPeriodEarthDays: "58.6",
      equatorialRotationVelocityKms: "0.0108",
      axialTiltDegrees: "0.03",
      obliquityToOrbitDegrees: "0.03",
      flattening: "N/A",
      orbitalPeriodEarthDays: "88",
      distanceFromSunAU: "0.39",
      orbitalVelocityKms: "47.36",
      semiMajorAxisAU: "0.387",
      semiMinorAxisAU: "0.378",
      perihelionKm: "46000000",
      aphelionKm: "69820000",
      eccentricity: "0.205",
      inclinationDegrees: "7.00",
      siderealPeriodEarthDays: "87.97",
      synodicPeriodEarthDays: "115.88",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Silicate rock, iron core",
      coreComposition: "Iron",
      crustComposition: "Silicate rock",
      mantleComposition: "Silicate rock",
      surfacePressureBars: "10^-15 (trace exosphere)",
      atmosphereComposition: "Trace amounts of hydrogen, helium, oxygen, sodium, calcium, potassium",
      greenhouseEffect: "No significant atmosphere",
      magneticField: "Weak",
      moons: "0",
      rings: "No",
      apparentMagnitude: "-2.48 to 7.25",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Highly eccentric orbit, extreme temperature variations, caloris basin."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_venus_surface.jpg", 2.3), key: "venus",
    details: "Venus is the second planet from the Sun, often called Earth's 'sister planet' due to its similar size and mass. However, it has an extremely dense, toxic atmosphere and a scorching hot surface due to a runaway greenhouse effect.",
    funFact: "Venus rotates in the opposite direction (retrograde) to most other planets, meaning the Sun rises in the west and sets in the east. Its day is also longer than its year!",
    info: {
      type: "Terrestrial Planet",
      radiusKm: "6,052",
      massEarths: "0.815",
      volumeEarths: "0.857",
      densityGmCm3: "5.24",
      surfaceAreaKm2: "4.60e8",
      gravityEarths: "0.91",
      escapeVelocityKms: "10.36",
      avgTempC: "462",
      avgTempF: "863",
      minTempC: "N/A",
      maxTempC: "N/A",
      albedo: "0.77",
      rotationPeriodEarthDays: "243 (retrograde)",
      equatorialRotationVelocityKms: "0.0065",
      axialTiltDegrees: "177.36",
      obliquityToOrbitDegrees: "177.36",
      flattening: "N/A",
      orbitalPeriodEarthDays: "224.70",
      distanceFromSunAU: "0.72",
      orbitalVelocityKms: "35.02",
      semiMajorAxisAU: "0.723",
      semiMinorAxisAU: "0.723",
      perihelionKm: "107476000",
      aphelionKm: "108942000",
      eccentricity: "0.0067",
      inclinationDegrees: "3.39",
      siderealPeriodEarthDays: "224.70",
      synodicPeriodEarthDays: "583.92",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Silicate rock, iron core",
      coreComposition: "Iron, Nickel",
      crustComposition: "Silicate rock",
      mantleComposition: "Silicate rock",
      surfacePressureBars: "92",
      atmosphereComposition: "96.5% Carbon Dioxide, 3.5% Nitrogen, trace Sulfur Dioxide",
      greenhouseEffect: "Strong runaway greenhouse effect",
      magneticField: "None (induced magnetosphere)",
      moons: "0",
      rings: "No",
      apparentMagnitude: "-3.8 to -4.6",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Runaway greenhouse effect, sulfuric acid clouds, retrograde rotation, volcanic plains."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_earth/earth_day_4096.jpg", 2.3), key: "earth",
    details: "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
    funFact: "Earth is not a perfect sphere; it bulges at the equator.",
    info: {
      type: "Terrestrial Planet",
      radiusKm: "6,371",
      massEarths: "1",
      volumeEarths: "1",
      densityGmCm3: "5.51",
      surfaceAreaKm2: "5.10e8",
      gravityEarths: "1",
      escapeVelocityKms: "11.2",
      avgTempC: "15",
      avgTempF: "59",
      minTempC: "-89.2",
      maxTempC: "58",
      albedo: "0.30",
      rotationPeriodEarthDays: "0.99 (23h 56m)",
      equatorialRotationVelocityKms: "0.465",
      axialTiltDegrees: "23.44",
      obliquityToOrbitDegrees: "23.44",
      flattening: "0.00335",
      orbitalPeriodEarthDays: "365.25 (1 year)",
      distanceFromSunAU: "1",
      orbitalVelocityKms: "29.78",
      semiMajorAxisAU: "1.000",
      semiMinorAxisAU: "0.999",
      perihelionKm: "147095000",
      aphelionKm: "152100000",
      eccentricity: "0.0167",
      inclinationDegrees: "0",
      siderealPeriodEarthDays: "365.256",
      synodicPeriodEarthDays: "N/A", // Not applicable for Earth as primary
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Silicate rock, iron-nickel core, water, nitrogen-oxygen atmosphere",
      coreComposition: "Iron, Nickel",
      crustComposition: "Silicate rock",
      mantleComposition: "Silicate rock",
      surfacePressureBars: "1",
      atmosphereComposition: "78% Nitrogen, 21% Oxygen, 1% Argon, trace elements",
      greenhouseEffect: "Present (natural)",
      magneticField: "Strong",
      moons: "1 (Moon)",
      rings: "No",
      apparentMagnitude: "N/A",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Only known planet to support life, diverse ecosystems, liquid water on surface, active plate tectonics."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_mars.jpg", 2), key: "mars",
    details: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.",
    funFact: "Mars has two moons, Phobos and Deimos, which are thought to be captured asteroids.",
    info: {
      type: "Terrestrial Planet",
      radiusKm: "3,389",
      massEarths: "0.107",
      volumeEarths: "0.151",
      densityGmCm3: "3.93",
      surfaceAreaKm2: "1.44e8",
      gravityEarths: "0.38",
      escapeVelocityKms: "5.0",
      avgTempC: "-63",
      avgTempF: "-81",
      minTempC: "-140",
      maxTempC: "20",
      albedo: "0.25",
      rotationPeriodEarthDays: "1.03 (24h 37m)",
      equatorialRotationVelocityKms: "0.241",
      axialTiltDegrees: "25.19",
      obliquityToOrbitDegrees: "25.19",
      flattening: "0.00589",
      orbitalPeriodEarthDays: "687 (1.88 Earth years)",
      distanceFromSunAU: "1.52",
      orbitalVelocityKms: "24.13",
      semiMajorAxisAU: "1.524",
      semiMinorAxisAU: "1.517",
      perihelionKm: "206600000",
      aphelionKm: "249200000",
      eccentricity: "0.0934",
      inclinationDegrees: "1.85",
      siderealPeriodEarthDays: "686.97",
      synodicPeriodEarthDays: "779.94",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Iron, nickel, sulfur core; silicate mantle; basaltic crust",
      coreComposition: "Iron, Nickel, Sulfur",
      crustComposition: "Basaltic rock",
      mantleComposition: "Silicate rock",
      surfacePressureBars: "0.006",
      atmosphereComposition: "95% Carbon Dioxide, 2.7% Nitrogen, 1.6% Argon",
      greenhouseEffect: "Weak (thin atmosphere)",
      magneticField: "No global field (localized crustal fields)",
      moons: "2 (Phobos, Deimos)",
      rings: "No",
      apparentMagnitude: "-2.94 to 1.86",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Polar ice caps, Valles Marineris (canyon system), Olympus Mons (largest volcano), evidence of past liquid water."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_jupiter.jpg", 4), key: "jupiter",
    details: "Jupiter is the fifth planet from the Sun and the largest in the Solar System.",
    funFact: "Jupiter's Great Red Spot is a giant storm bigger than Earth!",
    info: {
      type: "Gas Giant",
      radiusKm: "69,911",
      massEarths: "318",
      volumeEarths: "1,321",
      densityGmCm3: "1.33",
      surfaceAreaKm2: "6.14e10",
      gravityEarths: "2.53",
      escapeVelocityKms: "59.5",
      avgTempC: "-145 (cloud tops)",
      avgTempF: "-234 (cloud tops)",
      minTempC: "N/A",
      maxTempC: "N/A",
      albedo: "0.52",
      rotationPeriodEarthDays: "0.41 (9h 56m)",
      equatorialRotationVelocityKms: "12.6",
      axialTiltDegrees: "3.13",
      obliquityToOrbitDegrees: "3.13",
      flattening: "0.06487",
      orbitalPeriodEarthDays: "4333 (11.86 Earth years)",
      distanceFromSunAU: "5.2",
      orbitalVelocityKms: "13.07",
      semiMajorAxisAU: "5.203",
      semiMinorAxisAU: "5.199",
      perihelionKm: "740573600",
      aphelionKm: "816520800",
      eccentricity: "0.0489",
      inclinationDegrees: "1.31",
      siderealPeriodEarthDays: "4332.59",
      synodicPeriodEarthDays: "398.88",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Hydrogen, Helium",
      coreComposition: "Dense core (rock, metal, hydrogen)",
      crustComposition: "N/A (fluid atmosphere)",
      mantleComposition: "Metallic hydrogen",
      surfacePressureBars: "N/A (no solid surface)",
      atmosphereComposition: "90% Hydrogen, 10% Helium, trace Methane, Ammonia",
      greenhouseEffect: "N/A (internal heat)",
      magneticField: "Extremely strong",
      moons: "95 (confirmed, e.g., Io, Europa, Ganymede, Callisto)",
      rings: "Yes (faint)",
      apparentMagnitude: "-1.6 to -2.9",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Great Red Spot, strong magnetic field, four large Galilean moons, fastest rotation of any planet."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_saturn.jpg", 4), key: "saturn",
    details: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, known for its rings.",
    funFact: "Saturn's rings are mostly made of ice particles and rock debris.",
    info: {
      type: "Gas Giant",
      radiusKm: "58,232",
      massEarths: "95.16",
      volumeEarths: "763",
      densityGmCm3: "0.687",
      surfaceAreaKm2: "4.27e10",
      gravityEarths: "1.06",
      escapeVelocityKms: "35.5",
      avgTempC: "-178 (cloud tops)",
      avgTempF: "-288 (cloud tops)",
      minTempC: "N/A",
      maxTempC: "N/A",
      albedo: "0.47",
      rotationPeriodEarthDays: "0.45 (10h 33m)",
      equatorialRotationVelocityKms: "9.87",
      axialTiltDegrees: "26.73",
      obliquityToOrbitDegrees: "26.73",
      flattening: "0.1076",
      orbitalPeriodEarthDays: "10759 (29.45 Earth years)",
      distanceFromSunAU: "9.58",
      orbitalVelocityKms: "9.68",
      semiMajorAxisAU: "9.576",
      semiMinorAxisAU: "9.544",
      perihelionKm: "1352550000",
      aphelionKm: "1514500000",
      eccentricity: "0.0565",
      inclinationDegrees: "2.48",
      siderealPeriodEarthDays: "10759.22",
      synodicPeriodEarthDays: "378.09",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Hydrogen, Helium, Methane",
      coreComposition: "Dense core (rock, metal, hydrogen)",
      crustComposition: "N/A (fluid atmosphere)",
      mantleComposition: "Metallic hydrogen, liquid hydrogen",
      surfacePressureBars: "N/A (no solid surface)",
      atmosphereComposition: "96% Hydrogen, 3% Helium, 0.4% Methane",
      greenhouseEffect: "N/A (internal heat)",
      magneticField: "Strong",
      moons: "146 (confirmed, e.g., Titan, Rhea, Iapetus)",
      rings: "Yes (prominent, icy particles)",
      apparentMagnitude: "0.7 to 0.1",
      discoveryDate: "Known since ancient times",
      discoverer: "N/A",
      notableFeatures: "Extensive and complex ring system, least dense planet in the Solar System, Titan (large moon with a dense atmosphere and liquid methane lakes)."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_uranus.jpg", 3), key: "uranus",
    details: "Uranus is the seventh planet from the Sun, with the third-largest planetary radius.",
    funFact: "Uranus rotates on its side, almost perpendicular to its orbit.",
    info: {
      type: "Ice Giant",
      radiusKm: "25,362",
      massEarths: "14.54",
      volumeEarths: "63",
      densityGmCm3: "1.27",
      surfaceAreaKm2: "8.08e9",
      gravityEarths: "0.90",
      escapeVelocityKms: "21.3",
      avgTempC: "-216 (cloud tops)",
      avgTempF: "-357 (cloud tops)",
      minTempC: "-224",
      maxTempC: "-197",
      albedo: "0.30",
      rotationPeriodEarthDays: "0.72 (17h 14m, retrograde)",
      equatorialRotationVelocityKms: "2.59",
      axialTiltDegrees: "97.77",
      obliquityToOrbitDegrees: "97.77",
      flattening: "0.0229",
      orbitalPeriodEarthDays: "30687 (84 Earth years)",
      distanceFromSunAU: "19.2",
      orbitalVelocityKms: "6.80",
      semiMajorAxisAU: "19.229",
      semiMinorAxisAU: "19.204",
      perihelionKm: "2748940000",
      aphelionKm: "3004000000",
      eccentricity: "0.0471",
      inclinationDegrees: "0.77",
      siderealPeriodEarthDays: "30687.15",
      synodicPeriodEarthDays: "369.66",
      meanAnomaly: "N/A",
      longitudeAscendingNode: "N/A",
      argumentOfPeriapsis: "N/A",
      composition: "Water, Methane, Ammonia ices over a small rocky core",
      coreComposition: "Rocky (silicates, iron)",
      crustComposition: "N/A (fluid atmosphere)",
      mantleComposition: "Water, methane, ammonia ices",
      surfacePressureBars: "N/A (no solid surface)",
      atmosphereComposition: "82.5% Hydrogen, 15.2% Helium, 2.3% Methane",
      greenhouseEffect: "N/A (internal heat)",
      magneticField: "Highly tilted and offset",
      moons: "27 (confirmed, e.g., Titania, Oberon, Umbriel)",
      rings: "Yes (faint)",
      apparentMagnitude: "5.5 to 5.9",
      discoveryDate: "March 13, 1781",
      discoverer: "William Herschel",
      notableFeatures: "Extreme axial tilt, coldest planetary atmosphere in the Solar System, thin ring system."
    }
  },
  { mesh: loadPlanetTexture("../planets/img_others/2k_neptune.jpg", 3), key: "neptune",
    details: "Neptune is the eighth and farthest known planet from the Sun in the Solar System, an ice giant with incredibly strong winds, often exceeding the speed of sound. Its vivid blue color is also due to methane in its atmosphere.",
    funFact: "Neptune experiences the strongest winds in the Solar System, with speeds reaching up to 2,100 km/h (1,300 mph), creating massive storms like the Great Dark Spot, which was comparable in size to Earth.",
    info: {
      type: "Ice Giant",
      radiusKm: "24622",
      massEarths: "17.15",
      volumeEarths: "58",
      densityGmCm3: "1.64",
      surfaceAreaKm2: "7.64e9",
      gravityEarths: "1.14",
      escapeVelocityKms: "23.5",
      avgTempC: "-214",
      avgTempF: "-353",
      minTempC: "-218",
      maxTempC: "-198",
      albedo: "0.29",
      rotationPeriodEarthDays: "0.67 (16h 6m)",
      equatorialRotationVelocityKms: "2.68",
      axialTiltDegrees: "28.32",
      obliquityToOrbitDegrees: "28.32",
      flattening: "0.01708",
      orbitalPeriodEarthDays: "60190 (164.79 Earth years)",
      distanceFromSunAU: "30.1",
      orbitalVelocityKms: "5.43",
      semiMajorAxisAU: "30.103",
      semiMinorAxisAU: "30.103",
      perihelionKm: "4459400000",
      aphelionKm: "4537000000",
      eccentricity: "0.0086",
      inclinationDegrees: "1.77",
      siderealPeriodEarthDays: "60190.03",
      synodicPeriodEarthDays: "367.49",
      meanAnomaly: "256.22",
      longitudeAscendingNode: "131.72",
      argumentOfPeriapsis: "276.34",
      composition: "Water, Methane, Ammonia ices over a small rocky core",
      coreComposition: "Rocky (silicates, iron)",
      crustComposition: "N/A (fluid atmosphere)",
      mantleComposition: "Water, methane, ammonia ices",
      surfacePressureBars: "N/A (no solid surface)",
      atmosphereComposition: "80% Hydrogen, 19% Helium, 1.5% Methane",
      greenhouseEffect: "N/A (internal heat)",
      magneticField: "Highly tilted and offset, stronger than Uranus'",
      moons: "14 (confirmed, e.g., Triton, Nereid, Proteus)",
      rings: "Yes (faint, dark system)",
      apparentMagnitude: "7.6 to 8.0",
      discoveryDate: "September 23, 1846",
      discoverer: "Urbain Le Verrier, John Couch Adams, Johann Galle",
      notableFeatures: "Strongest winds in the solar system, Great Dark Spot (transient storms), Triton (large moon with cryovolcanism)."
    }
  }
];
planets.forEach(p => scene.add(p.mesh));

// --- Per-planet label X/Y distances ---
const labelSettings = {
  sun:     { x: 1700, y: 80 },
  mercury: { x: 250, y: 20 },
  venus:   { x: 250, y: 25 },
  earth:   { x: 250, y: 30 },
  mars:    { x: 300, y: 35 },
  jupiter: { x: 1500, y: 50 },
  saturn:  { x: 1600, y: 60 },
  uranus:  { x: 1700, y: 70 },
  neptune: { x: 1800, y: 150 }
};

// --- Add labels ---
planets.forEach(p => {
  const div = document.createElement("div");
  div.className = "label";
  div.innerText = p.key.charAt(0).toUpperCase() + p.key.slice(1);

  const label = new CSS2DObject(div);
  label.position.set(0, (p.mesh.geometry.parameters.radius )+1.5, 0); 
  p.mesh.add(label);

  p.labelDiv = div;
  p.labelX = labelSettings[p.key].x;
  p.labelY = labelSettings[p.key].y;
});

// --- Asteroid Belt ---
const stones = [];
function createStone(radius, periodRatio, color=0xaaaaaa, size=0.2) {
  const geo = new THREE.SphereGeometry(size, 8, 8);
  const mat = new THREE.MeshStandardMaterial({ color });
  const theta = Math.random()*2*Math.PI;
  const m = new THREE.Mesh(geo, mat);
  m.position.set(radius*Math.cos(theta), 0, radius*Math.sin(theta));
  scene.add(m);
  stones.push({ mesh: m, angle: theta, radius, periodRatio });
}
for(let i=0;i<100;i++) createStone(50 + Math.random()*10, 4 + Math.random()*2);
for(let i=0;i<50;i++) createStone(63 + Math.random()*10, 4 + Math.random()*2);
for(let i=0;i<50;i++) createStone(65 + Math.random()*10, 4 + Math.random()*2);
for(let i=0;i<900;i++) createStone(55 + Math.random()*10, 4 + Math.random()*2);
for(let i=0;i<100;i++) createStone(60 + Math.random()*10, 4 + Math.random()*2);
for(let i=0;i<6000;i++) createStone(730 + Math.random()*40, 200 + Math.random()*100, 0x8888ff, 0.25);
// --- Angles ---
const angles1= new Array(planets.length).fill(0);

// --- Period scale slider ---
let periodScale = 1000; 
const scaleSlider = document.getElementById("scaleSlider");
const scaleValue = document.getElementById("scaleValue");
scaleSlider.addEventListener("input", e => {
  periodScale = parseFloat(e.target.value);
  scaleValue.innerText = periodScale;
});

const sunLightToggle = document.getElementById("toggleSunLight");
sunLightToggle.addEventListener("change", () => {
  sunLight.visible = sunLightToggle.checked;
});


// --- Function to create stone rings ---
function createStoneRing(innerRadius, outerRadius, stoneCount, texture, opacity = 0.06) {
  const ringGroup = new THREE.Group();
  const stoneGeometry = new THREE.SphereGeometry(0.1, 6, 6);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    opacity: opacity,
    transparent: true
  });
  for (let i = 0; i < stoneCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 0.5;
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.set(x, y, z);
    stone.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    const scale = 0.5 + Math.random() * 0.7;
    stone.scale.set(scale, scale, scale);
    ringGroup.add(stone);
  }
  return ringGroup;
}

// --- Load Saturn ring textures ---
const rockTexture = textureLoader.load("../planets/img_others/stone_brown.jpg"); // Assuming stone_brown.jpg is in the same directory
const rock2Texture = textureLoader.load("../planets/img_others/cream.jpeg"); // Assuming cream.jpeg is in the same directory

// --- Create Saturn’s stone rings ---
const saturnMesh = planets.find(p => p.key === "saturn").mesh;

const saturnRing = new THREE.Group();
saturnRing.add(createStoneRing(6.5, 10, 1000, rockTexture, 0.6));

// Tilt the ring slightly
saturnRing.rotation.x = 0.05;

// Attach ring to Saturn
saturnMesh.add(saturnRing);


// Find Jupiter mesh
const jupiterMesh = planets.find(p => p.key === "jupiter").mesh;

// Create a merged ring for Jupiter
const jupiterRing = new THREE.Group();

jupiterRing.add(createStoneRing(6, 7.2, 500, rock2Texture, 0.3));


// Add ring to Jupiter
jupiterMesh.add(jupiterRing);

const bgGeometry = new THREE.SphereGeometry(10000, 30, 30)
const bgMaterial = new THREE.MeshBasicMaterial({
  color: 0x050505,     // base dark blue
  side: THREE.BackSide, // render inside of sphere
});
// Bg color removed
const background = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(background);
scene.fog = new THREE.FogExp2(0x000011, 0.00015);
renderer.setClearColor(new THREE.Color(0x000010)); // dark top


const realSeconds={
  sun_eq:2164320.0,
  orbit:{ mercury:7600521.6, venus:19414166.4, earth:31558118.4, mars:59355072.0,
          jupiter:374335776.0, saturn:929577600.0, uranus:2651443200.0, neptune:5199724800.0 },
  rotation:{ mercury:5067014.4, venus:20997360.0, earth:86164.1, mars:88642.68,
             jupiter:35730.0, saturn:38361.6, uranus:62064.0, neptune:57996.0 }
};
const retrograde=new Set(["venus","uranus"]);
const angles=new Array(planets.length).fill(0);
 const sunRotationPeriod = 2164320.0;
// --- Simulation speed ---
let simScale=100000;
document.getElementById("scaleSlider").addEventListener("input",e=>{
  simScale=parseFloat(e.target.value);
  document.getElementById("scaleValue").innerText=simScale;
});

// --- Info Panel Elements ---
const infoPanel = document.getElementById("infoPanel");
const panelPlanetName = document.getElementById("panelPlanetName");
const panelDetails = document.getElementById("panelDetails");
const panelFunFact = document.getElementById("panelFunFact");

// New info elements
const infoType = document.getElementById("infoType");
const infoAvgTemp = document.getElementById("infoAvgTemp");
const infoOrbitalPeriod = document.getElementById("infoOrbitalPeriod");
const infoRotationPeriod = document.getElementById("infoRotationPeriod");
const infoDistanceFromSun = document.getElementById("infoDistanceFromSun");
const infoRadius = document.getElementById("infoRadius");
const infoMass = document.getElementById("infoMass");
const infoVolume = document.getElementById("infoVolume");
const infoDensity = document.getElementById("infoDensity");
const infoSurfaceArea = document.getElementById("infoSurfaceArea");
const infoGravity = document.getElementById("infoGravity");
const infoEscapeVelocity = document.getElementById("infoEscapeVelocity");
const infoMinTempC = document.getElementById("infoMinTempC");
const infoMaxTempC = document.getElementById("infoMaxTempC");
const infoAlbedo = document.getElementById("infoAlbedo");
const infoEquatorialRotationVelocity = document.getElementById("infoEquatorialRotationVelocity");
const infoAxialTilt = document.getElementById("infoAxialTilt");
const infoObliquityToOrbit = document.getElementById("infoObliquityToOrbit");
const infoFlattening = document.getElementById("infoFlattening");
const infoOrbitalVelocity = document.getElementById("infoOrbitalVelocity");
const infoSemiMajorAxis = document.getElementById("infoSemiMajorAxis");
const infoSemiMinorAxis = document.getElementById("infoSemiMinorAxis");
const infoPerihelion = document.getElementById("infoPerihelion");
const infoAphelion = document.getElementById("infoAphelion");
const infoEccentricity = document.getElementById("infoEccentricity");
const infoInclination = document.getElementById("infoInclination");
const infoSiderealPeriod = document.getElementById("infoSiderealPeriod");
const infoSynodicPeriod = document.getElementById("infoSynodicPeriod");
const infoComposition = document.getElementById("infoComposition");
const infoCoreComposition = document.getElementById("infoCoreComposition");
const infoCrustComposition = document.getElementById("infoCrustComposition");
const infoMantleComposition = document.getElementById("infoMantleComposition");
const infoSurfacePressure = document.getElementById("infoSurfacePressure");
const infoAtmosphereComposition = document.getElementById("infoAtmosphereComposition");
const infoGreenhouseEffect = document.getElementById("infoGreenhouseEffect");
const infoMagneticField = document.getElementById("infoMagneticField");
const infoMoons = document.getElementById("infoMoons");
const infoRings = document.getElementById("infoRings");
const infoApparentMagnitude = document.getElementById("infoApparentMagnitude");
const infoDiscoveryDate = document.getElementById("infoDiscoveryDate");
const infoDiscoverer = document.getElementById("infoDiscoverer");
const infoNotableFeatures = document.getElementById("infoNotableFeatures");


// --- Animation ---
const clock=new THREE.Clock();

const planetView = document.getElementById("planetView");
let currentView = "none";

planetView.addEventListener("change", (e) => {
  currentView = e.target.value;
  if (currentView !== "none") {
    cameraFollow = false; // Disable click-following if dropdown is used
    currentTargetPlanet = null; // Clear click target
    showInfoPanel(planets.find(p => p.key === currentView));
  } else {
    // "Free View" selected
    cameraFollow = false;
    currentTargetPlanet = null;
    hideInfoPanel();
    // Ensure controls are re-enabled and target is reset when going to free view
    controls.enabled = true;
    controls.target.set(0, 0, 0); 
  }
});

// --- Raycaster setup for clicking planets ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentTargetPlanet = null;
let cameraFollow = false;

// --- Functions to show/hide info panel ---
function showInfoPanel(planet) {
  panelPlanetName.innerText = planet.key.charAt(0).toUpperCase() + planet.key.slice(1);
  panelDetails.innerText = planet.details;
  panelFunFact.innerText = "Fun Fact: " + planet.funFact;

  // Populate new detailed info
  if (planet.info) { // Check if detailed info exists
    infoType.innerText = planet.info.type || "N/A";
    infoAvgTemp.innerText = `${planet.info.avgTempC} / ${planet.info.avgTempF}` || "N/A";
    infoOrbitalPeriod.innerText = (planet.info.orbitalPeriodEarthDays && planet.info.orbitalPeriodEarthDays !== "N/A" ? `${planet.info.orbitalPeriodEarthDays} Earth days` : "N/A");
    infoRotationPeriod.innerText = (planet.info.rotationPeriodEarthDays && planet.info.rotationPeriodEarthDays !== "N/A" ? `${planet.info.rotationPeriodEarthDays}` : "N/A");
    infoDistanceFromSun.innerText = (planet.info.distanceFromSunAU && planet.info.distanceFromSunAU !== "N/A" ? `${planet.info.distanceFromSunAU} AU` : "N/A");
    infoRadius.innerText = (planet.info.radiusKm && planet.info.radiusKm !== "N/A" ? `${planet.info.radiusKm} km` : "N/A");
    infoMass.innerText = (planet.info.massEarths && planet.info.massEarths !== "N/A" ? `${planet.info.massEarths} Earths` : "N/A");
    infoVolume.innerText = (planet.info.volumeEarths && planet.info.volumeEarths !== "N/A" ? `${planet.info.volumeEarths} Earths` : "N/A");
    infoDensity.innerText = (planet.info.densityGmCm3 && planet.info.densityGmCm3 !== "N/A" ? `${planet.info.densityGmCm3} g/cm³` : "N/A");
    infoSurfaceArea.innerText = (planet.info.surfaceAreaKm2 && planet.info.surfaceAreaKm2 !== "N/A" ? `${planet.info.surfaceAreaKm2} km²` : "N/A");
    infoGravity.innerText = (planet.info.gravityEarths && planet.info.gravityEarths !== "N/A" ? `${planet.info.gravityEarths} g` : "N/A");
    infoEscapeVelocity.innerText = (planet.info.escapeVelocityKms && planet.info.escapeVelocityKms !== "N/A" ? `${planet.info.escapeVelocityKms} km/s` : "N/A");
    infoMinTempC.innerText = (planet.info.minTempC && planet.info.minTempC !== "N/A" ? `${planet.info.minTempC}°C` : "N/A");
    infoMaxTempC.innerText = (planet.info.maxTempC && planet.info.maxTempC !== "N/A" ? `${planet.info.maxTempC}°C` : "N/A");
    infoAlbedo.innerText = planet.info.albedo || "N/A";
    infoEquatorialRotationVelocity.innerText = (planet.info.equatorialRotationVelocityKms && planet.info.equatorialRotationVelocityKms !== "N/A" ? `${planet.info.equatorialRotationVelocityKms} km/s` : "N/A");
    infoAxialTilt.innerText = (planet.info.axialTiltDegrees && planet.info.axialTiltDegrees !== "N/A" ? `${planet.info.axialTiltDegrees}°` : "N/A");
    infoObliquityToOrbit.innerText = (planet.info.obliquityToOrbitDegrees && planet.info.obliquityToOrbitDegrees !== "N/A" ? `${planet.info.obliquityToOrbitDegrees}°` : "N/A");
    infoFlattening.innerText = planet.info.flattening || "N/A";
    infoOrbitalVelocity.innerText = (planet.info.orbitalVelocityKms && planet.info.orbitalVelocityKms !== "N/A" ? `${planet.info.orbitalVelocityKms} km/s` : "N/A");
    infoSemiMajorAxis.innerText = (planet.info.semiMajorAxisAU && planet.info.semiMajorAxisAU !== "N/A" ? `${planet.info.semiMajorAxisAU} AU` : "N/A");
    infoSemiMinorAxis.innerText = (planet.info.semiMinorAxisAU && planet.info.semiMinorAxisAU !== "N/A" ? `${planet.info.semiMinorAxisAU} AU` : "N/A");
    infoPerihelion.innerText = (planet.info.perihelionKm && planet.info.perihelionKm !== "N/A" ? `${planet.info.perihelionKm} km` : "N/A");
    infoAphelion.innerText = (planet.info.aphelionKm && planet.info.aphelionKm !== "N/A" ? `${planet.info.aphelionKm} km` : "N/A");
    infoEccentricity.innerText = planet.info.eccentricity || "N/A";
    infoInclination.innerText = (planet.info.inclinationDegrees && planet.info.inclinationDegrees !== "N/A" ? `${planet.info.inclinationDegrees}°` : "N/A");
    infoSiderealPeriod.innerText = (planet.info.siderealPeriodEarthDays && planet.info.siderealPeriodEarthDays !== "N/A" ? `${planet.info.siderealPeriodEarthDays} days` : "N/A");
    infoSynodicPeriod.innerText = (planet.info.synodicPeriodEarthDays && planet.info.synodicPeriodEarthDays !== "N/A" ? `${planet.info.synodicPeriodEarthDays} days` : "N/A");
    infoComposition.innerText = planet.info.composition || "N/A";
    infoCoreComposition.innerText = planet.info.coreComposition || "N/A";
    infoCrustComposition.innerText = planet.info.crustComposition || "N/A";
    infoMantleComposition.innerText = planet.info.mantleComposition || "N/A";
    infoSurfacePressure.innerText = (planet.info.surfacePressureBars && planet.info.surfacePressureBars !== "N/A" ? `${planet.info.surfacePressureBars} bars` : "N/A");
    infoAtmosphereComposition.innerText = planet.info.atmosphereComposition || "N/A";
    infoGreenhouseEffect.innerText = planet.info.greenhouseEffect || "N/A";
    infoMagneticField.innerText = planet.info.magneticField || "N/A";
    infoMoons.innerText = planet.info.moons || "0";
    infoRings.innerText = planet.info.rings || "No";
    infoApparentMagnitude.innerText = planet.info.apparentMagnitude || "N/A";
    infoDiscoveryDate.innerText = planet.info.discoveryDate || "N/A";
    infoDiscoverer.innerText = planet.info.discoverer || "N/A";
    infoNotableFeatures.innerText = planet.info.notableFeatures || "N/A";

  } else {
    // Clear info if no data available (or set to N/A)
    infoType.innerText = "N/A";
    infoAvgTemp.innerText = "N/A";
    infoOrbitalPeriod.innerText = "N/A";
    infoRotationPeriod.innerText = "N/A";
    infoDistanceFromSun.innerText = "N/A";
    infoRadius.innerText = "N/A";
    infoMass.innerText = "N/A";
    infoVolume.innerText = "N/A";
    infoDensity.innerText = "N/A";
    infoSurfaceArea.innerText = "N/A";
    infoGravity.innerText = "N/A";
    infoEscapeVelocity.innerText = "N/A";
    infoMinTempC.innerText = "N/A";
    infoMaxTempC.innerText = "N/A";
    infoAlbedo.innerText = "N/A";
    infoEquatorialRotationVelocity.innerText = "N/A";
    infoAxialTilt.innerText = "N/A";
    infoObliquityToOrbit.innerText = "N/A";
    infoFlattening.innerText = "N/A";
    infoOrbitalVelocity.innerText = "N/A";
    infoSemiMajorAxis.innerText = "N/A";
    infoSemiMinorAxis.innerText = "N/A";
    infoPerihelion.innerText = "N/A";
    infoAphelion.innerText = "N/A";
    infoEccentricity.innerText = "N/A";
    infoInclination.innerText = "N/A";
    infoSiderealPeriod.innerText = "N/A";
    infoSynodicPeriod.innerText = "N/A";
    infoComposition.innerText = "N/A";
    infoCoreComposition.innerText = "N/A";
    infoCrustComposition.innerText = "N/A";
    infoMantleComposition.innerText = "N/A";
    infoSurfacePressure.innerText = "N/A";
    infoAtmosphereComposition.innerText = "N/A";
    infoGreenhouseEffect.innerText = "N/A";
    infoMagneticField.innerText = "N/A";
    infoMoons.innerText = "N/A";
    infoRings.innerText = "N/A";
    infoApparentMagnitude.innerText = "N/A";
    infoDiscoveryDate.innerText = "N/A";
    infoDiscoverer.innerText = "N/A";
    infoNotableFeatures.innerText = "N/A";
  }


  infoPanel.classList.add("visible"); // Use class for visibility
}

function hideInfoPanel() {
  infoPanel.classList.remove("visible"); // Use class for visibility
}

// --- Mouse/Touch click event ---
window.addEventListener("pointerdown", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
  
  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const planet = planets.find(p => p.mesh === clicked);
    if (planet) {
      currentTargetPlanet = planet;
      cameraFollow = true;
      planetView.value = "none"; // Reset dropdown to "Free View" when a planet is clicked
      showInfoPanel(planet);
    }
  } else {
    // Clicked empty space → return to free view
    cameraFollow = false;
    currentTargetPlanet = null;
    currentView = "none"; // Ensure internal view state is "none"
    planetView.value = "none"; // Update dropdown visually
    hideInfoPanel();
    // Re-enable controls and reset target to sun
    controls.enabled = true;
    controls.target.set(0, 0, 0); 
  }
});

// --- Animation loop ---
function animate(){
  requestAnimationFrame(animate);
// --- Rotate the Sun relative to Earth's orbital position ---
 const delta=clock.getDelta(); // seconds since last frame
sunMesh.rotation.y += (2 * Math.PI / sunRotationPeriod) * delta * simScale;
  // Animated UV-scroll — gives boiling fire/plasma effect (Reference sun.html technique)
  fireTexture.offset.x += 0.0006 * delta * 60;
  fireTexture.offset.y += 0.0004 * delta * 60;
  // Sun spin
//   planets[0].mesh.rotation.y += (2*Math.PI/realSeconds.sun_eq) * delta * simScale;

  // Planets orbit + spin
  for(let i=1;i<planets.length;i++){
    const key=planets[i].key;
    const orbitT=realSeconds.orbit[key]/simScale;
    const spinT=realSeconds.rotation[key]/simScale;
    const orbitSpeed=2*Math.PI/orbitT;
    const spinSpeed=2*Math.PI/spinT*(retrograde.has(key)?-1:1);

    angles[i]+=orbitSpeed*delta;
    const {a,b,cx}=orbitsData[i-1];
    planets[i].mesh.position.set(a*Math.cos(angles[i])+cx,0,b*Math.sin(angles[i]));
    planets[i].mesh.rotation.y+=spinSpeed*delta;
  }


controls.minDistance = 5;   // how close camera can zoom in
controls.maxDistance = 1100;  // how far camera can zoom out

  // Asteroids
// --- Asteroids motion (synced with real-time delta) ---
stones.forEach(s => {
  // Orbital speed (radians per real second)
  const angularSpeed = (2 * Math.PI) / (s.periodRatio * 31558118.4); 
  // 31558118.4 = 1 Earth year in seconds (base unit)

  // Advance orbit angle with respect to elapsed time
  s.angle += angularSpeed * delta * periodScale;

  // Update position on the ellipse
  s.mesh.position.set(
    s.radius * Math.cos(s.angle),
    0,
    s.radius * Math.sin(s.angle)
  );
});


  // Update labels
  planets.forEach(p => {
    if(p.labelDiv){
      const distance = camera.position.distanceTo(p.mesh.position);
      if(distance > p.labelX){
        p.labelDiv.style.opacity = "0";
      } else {
        p.labelDiv.style.opacity = "1";
        if(distance < p.labelY){
          let scale = p.labelY / distance;
          scale = Math.min(scale, 3);
          p.labelDiv.style.transform = `scale(${scale})`; // Corrected string literal
        } else {
          p.labelDiv.style.transform = "scale(1)";
        }
      }
    }
  });

// --- Camera follow logic for dropdown or click ---
let targetPosition;
let targetLookAt;
let shouldEnableControls = true; // Flag to determine if controls should be enabled

if (cameraFollow && currentTargetPlanet) {
  // Follow clicked planet
  targetLookAt = currentTargetPlanet.mesh.position.clone();
  const offset = new THREE.Vector3(
    currentTargetPlanet.mesh.geometry.parameters.radius * 3, // Adjust offset based on planet size
    currentTargetPlanet.mesh.geometry.parameters.radius * 1.5,
    currentTargetPlanet.mesh.geometry.parameters.radius * 3
  ); 
  targetPosition = targetLookAt.clone().add(offset);
  shouldEnableControls = false; // Disable orbit controls when following a clicked planet
} else if (currentView !== "none") {
  // Follow planet selected from dropdown
  const selectedPlanet = planets.find(p => p.key === currentView);
  if (selectedPlanet) {
    targetLookAt = selectedPlanet.mesh.position.clone();
    const offset = new THREE.Vector3(
      selectedPlanet.mesh.geometry.parameters.radius * 3, // Adjust offset based on planet size
      selectedPlanet.mesh.geometry.parameters.radius * 1.5,
      selectedPlanet.mesh.geometry.parameters.radius * 3
    ); 
    targetPosition = targetLookAt.clone().add(offset);
    shouldEnableControls = false; // Disable orbit controls when using dropdown view
  }
} else {
  // Free view (orbit around Sun)
  targetLookAt = new THREE.Vector3(0, 0, 0);
  // controls.enabled is true by default
}

// Smoothly interpolate camera position and controls target
if (targetPosition) { // Only interpolate if a targetPosition is defined (i.e., not in "Free View" implicitly)
  camera.position.lerp(targetPosition, 0.05);
}
controls.target.lerp(targetLookAt, 0.1);


// Apply controls enablement based on the flag
controls.enabled = shouldEnableControls;


  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  controls.update();
}
animate();

// --- Resize ---
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});