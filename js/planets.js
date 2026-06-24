export function initPlanets() {
// Planet Data
const PLANETS = [
  { name: 'Sun',     image: './planets/img_others/2k_sun.jpg',          desc: 'I forged this colossal sphere of plasma as the engine of my creation. Its nuclear fire gives warmth and light to everything I built.' },
  { name: 'Mercury', image: './planets/img_others/2k_mercury.jpg',      desc: 'I placed this tiny rock closest to my fire. I stripped its atmosphere to see how it would endure the harshest temperatures of my design.' },
  { name: 'Venus',   image: './planets/img_others/2k_venus_surface.jpg',desc: 'An experiment in extremes. I gave it Earth\'s scale, but wrapped it in a suffocating shroud, crafting a beautiful but deadly hellscape.' },
  { name: 'Earth',   image: './planets/img_earth/earth_day_4096.jpg',   desc: 'My greatest masterpiece. I sculpted its vast oceans and dynamic weather specifically to cradle you. It is the jewel of my canvas.' },
  { name: 'Mars',    image: './planets/img_others/2k_mars.jpg',         desc: 'I painted it in rusted red and sculpted Olympus Mons, the tallest volcano in my collection. A quiet monument to what could have been.' },
  { name: 'Jupiter', image: './planets/img_others/2k_jupiter.jpg',      desc: 'My majestic giant. I spun its violent, swirling clouds and commanded a colossal storm to rage endlessly across its face for centuries.' },
  { name: 'Saturn',  image: './planets/img_others/2k_saturn.jpg',       desc: 'My most delicate sculpture. I shattered moons and commanded the icy remnants to orbit in an eternal, breathtaking ring of perfect geometry.' },
  { name: 'Uranus',  image: './planets/img_others/2k_uranus.jpg',       desc: 'A twist in my rules. I tilted this frozen giant on its side, condemning its poles to endure 42 years of unbroken daylight and utter darkness.' },
  { name: 'Neptune', image: './planets/img_others/2k_neptune.jpg',      desc: 'I pushed my atmospheric engine to the absolute limit here. I unleashed supersonic winds and violent storms within a frigid, deep-blue sphere.' },
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
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'><rect width=\\'400\\' height=\\'400\\' fill=\\'%23000f23\\'/><circle cx=\\'200\\' cy=\\'200\\' r=\\'150\\' fill=\\'%23c5a048\\' opacity=\\'0.2\\'/></svg>'; this.classList.add('fallback-img');" />
    </div>
    <h3 class="planet-name">${p.name}</h3>
    <p class="planet-desc">${p.desc}</p>
    <span class="planet-cta">View in 3D <i class="fa-solid fa-arrow-right"></i></span>
  `;
  card.addEventListener('click', () => window.openPlanetModal(p));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') window.openPlanetModal(p); });
  grid.appendChild(card);
});

// Search Filter Logic
const searchInput = document.getElementById('planetSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = grid.querySelectorAll('.planet-card');
    cards.forEach(card => {
      const name = card.querySelector('.planet-name').innerText.toLowerCase();
      const desc = card.querySelector('.planet-desc').innerText.toLowerCase();
      if (name.includes(term) || desc.includes(term)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
  searchInput.addEventListener('focus', () => searchInput.style.borderColor = 'var(--gold)');
  searchInput.addEventListener('blur', () => searchInput.style.borderColor = 'rgba(255,255,255,0.15)');
}

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
