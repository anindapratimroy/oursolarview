export function initPlanets() {
// Planet Data
const PLANETS = [
  { name: 'Sun',     image: './planets/img_others/2k_sun.jpg',          desc: 'The G-type main-sequence star at the centre of our Solar System — a colossal sphere of hot plasma generating energy via nuclear fusion.' },
  { name: 'Mercury', image: './planets/img_others/2k_mercury.jpg',      desc: 'The smallest and innermost planet, with a heavily cratered surface, negligible atmosphere, and extreme temperature swings.' },
  { name: 'Venus',   image: './planets/img_others/2k_venus_surface.jpg',desc: 'Earth\'s twin in size but a hellscape in reality — a dense CO₂ atmosphere creates a runaway greenhouse effect reaching 465 °C.' },
  { name: 'Earth',   image: './planets/img_earth/earth_day_4096.jpg',   desc: 'Our home world: vast oceans, dynamic weather systems, and the only confirmed site of complex life in the known universe.' },
  { name: 'Mars',    image: './planets/img_others/2k_mars.jpg',         desc: 'The Red Planet, home to Olympus Mons — the tallest volcano in the Solar System — and a thin, dusty CO₂ atmosphere.' },
  { name: 'Jupiter', image: './planets/img_others/2k_jupiter.jpg',      desc: 'The largest gas giant, whose iconic Great Red Spot is a centuries-old anticyclonic storm wider than Earth itself.' },
  { name: 'Saturn',  image: './planets/img_others/2k_saturn.jpg',       desc: 'Renowned for its breathtaking ring system — vast sheets of ice and rock particles stretching hundreds of thousands of kilometres.' },
  { name: 'Uranus',  image: './planets/img_others/2k_uranus.jpg',       desc: 'An ice giant with a unique 98° axial tilt, causing each pole to experience 42 years of continuous sunlight and 42 of darkness.' },
  { name: 'Neptune', image: './planets/img_others/2k_neptune.jpg',      desc: 'The windiest planet — supersonic storms exceed 2,100 km/h in its frigid, deep-blue methane atmosphere.' },
];

const grid = document.getElementById('planetGrid');
if (!grid) return;

PLANETS.forEach(p => {
  const card = document.createElement('article');
  card.className = 'planet-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.innerHTML = `
    <div class="planet-img-wrap">
      <picture>
        <source srcset="${p.image.replace('.jpg', '.avif').replace('.webp', '.avif')}" type="image/avif" />
        <source srcset="${p.image.replace('.jpg', '.webp').replace('.avif', '.webp')}" type="image/webp" />
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'><rect width=\\'400\\' height=\\'400\\' fill=\\'%23000f23\\'/><circle cx=\\'200\\' cy=\\'200\\' r=\\'150\\' fill=\\'%23c5a048\\' opacity=\\'0.2\\'/></svg>'; this.classList.add('fallback-img');" />
      </picture>
    </div>
    <h3 class="planet-name">${p.name}</h3>
    <p class="planet-desc">${p.desc}</p>
    <span class="planet-cta">View in 3D <i class="fa-solid fa-arrow-right"></i></span>
  `;
  card.addEventListener('click', () => window.openPlanetModal(p));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') window.openPlanetModal(p); });
  grid.appendChild(card);
});

// History State URL Parameter logic
const urlParams = new URLSearchParams(window.location.search);
const activePlanet = urlParams.get('planet');
if (activePlanet && window.openPlanetModal) {
  const pData = PLANETS.find(p => p.name.toLowerCase() === activePlanet.toLowerCase());
  if (pData) {
    // Small delay to allow CSS transitions to initialize
    setTimeout(() => window.openPlanetModal(pData), 100);
  }
}
}
