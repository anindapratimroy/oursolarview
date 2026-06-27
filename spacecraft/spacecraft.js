/* ═══════════════════════════════════════════════════════════
   MY FLEET OF TITANS — spacecraft.js  (v2 — IMMERSIVE VIEWER)
   Full in-site 3D experience via Sketchfab embed
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   SPACECRAFT DATABASE
   thumbnail  = NASA Images API URL (reliable CDN, no auth needed)
   sketchfabId = verified working Sketchfab model IDs only.
   ───────────────────────────────────────────────────────────── */
const SPACECRAFT_DB = [
  /* ─── ROVERS ─────────────────────────────── */
  {
    name: 'Perseverance Rover',
    category: 'rover',
    sketchfabId: 'c1c94e1f69df45eeae4a0a1d0d27e85b',
    nasaUrl: 'https://mars.nasa.gov/mars2020/',
    thumbnail: 'https://images-assets.nasa.gov/image/PIA23764/PIA23764~thumb.jpg',
    desc: 'NASA\'s most advanced Mars rover, landed in Jezero Crater on February 18, 2021. Carrying 23 cameras, a microphone, a ground-penetrating radar, and the Ingenuity helicopter.',
    launch: 'July 30, 2020',
    location: 'Jezero Crater, Mars',
    agency: 'NASA / JPL-Caltech',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',    value: '1,025 kg' },
      { icon: 'fa-camera',         label: 'Cameras', value: '23 eyes' },
      { icon: 'fa-ruler',          label: 'Size',    value: '3m × 2.7m × 2.2m' },
      { icon: 'fa-bolt',           label: 'Power',   value: 'Nuclear RTG (110W)' }
    ]
  },
  {
    name: 'Curiosity Rover (MSL)',
    category: 'rover',
    sketchfabId: '0696a383f3e841d2b5c7636ee8a58aba',
    nasaUrl: 'https://mars.nasa.gov/msl/',
    thumbnail: 'https://images-assets.nasa.gov/image/PIA16239/PIA16239~thumb.jpg',
    desc: 'Mars Science Laboratory rover, exploring Gale Crater since August 6, 2012. A car-sized nuclear-powered rover studying the Martian climate, geology, and habitability.',
    launch: 'November 26, 2011',
    location: 'Gale Crater, Mars',
    agency: 'NASA / JPL-Caltech',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',    value: '899 kg' },
      { icon: 'fa-camera',         label: 'Cameras', value: '17 eyes' },
      { icon: 'fa-ruler',          label: 'Size',    value: '2.9m × 2.7m × 2.2m' },
      { icon: 'fa-bolt',           label: 'Power',   value: 'Nuclear RTG (110W)' }
    ]
  },
  {
    name: 'Mars Sojourner',
    category: 'rover',
    sketchfabId: '8b3810e7cd804bd6b0009520c67984c6',
    nasaUrl: 'https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models',
    thumbnail: 'https://images-assets.nasa.gov/image/PIA00405/PIA00405~thumb.jpg',
    desc: 'The first wheeled vehicle to operate on another planet. Sojourner landed on Mars on July 4, 1997, as part of the Mars Pathfinder mission, exploring the Ares Vallis region.',
    launch: 'December 4, 1996',
    location: 'Ares Vallis, Mars',
    agency: 'NASA / JPL',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',    value: '11.5 kg' },
      { icon: 'fa-camera',         label: 'Cameras', value: '3 eyes' },
      { icon: 'fa-ruler',          label: 'Size',    value: '65cm × 48cm × 30cm' },
      { icon: 'fa-bolt',           label: 'Power',   value: 'Solar + batteries' }
    ]
  },

  /* ─── TELESCOPES ──────────────────────────── */
  {
    name: 'Hubble Space Telescope',
    category: 'telescope',
    sketchfabId: '6546d1989bcd4e8aa135f0d659c53c9c',
    nasaUrl: 'https://hubblesite.org/',
    thumbnail: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~thumb.jpg',
    desc: 'In orbit since 1990, Hubble has made over 1.5 million observations and fundamentally transformed our understanding of the cosmos — from determining the age of the universe to discovering dark energy.',
    launch: 'April 24, 1990',
    location: 'Low Earth Orbit (547 km)',
    agency: 'NASA / ESA',
    facts: [
      { icon: 'fa-circle',         label: 'Mirror',       value: '2.4m (7.9 ft)' },
      { icon: 'fa-weight-hanging', label: 'Mass',         value: '11,110 kg' },
      { icon: 'fa-tachometer-alt', label: 'Speed',        value: '27,300 km/h' },
      { icon: 'fa-images',         label: 'Observations', value: '1.5 million+' }
    ]
  },

  /* ─── SPACECRAFT ──────────────────────────── */
  {
    name: 'Voyager 1 & 2',
    category: 'spacecraft',
    sketchfabId: '1a865fbfcac5410ba5e700b89fda7ad6',
    nasaUrl: 'https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Voyager',
    thumbnail: 'https://images-assets.nasa.gov/image/PIA17461/PIA17461~thumb.jpg',
    desc: 'Launched in 1977, Voyager is the farthest human-made object ever built — drifting through interstellar space. It carries a golden record of Earth sounds, music, and greetings.',
    launch: 'September 5, 1977',
    location: 'Interstellar space',
    agency: 'NASA / JPL',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',         value: '721.9 kg' },
      { icon: 'fa-bolt',           label: 'Power',        value: 'Nuclear RTG' },
      { icon: 'fa-tachometer-alt', label: 'Speed',        value: '61,500 km/h' },
      { icon: 'fa-signal',         label: 'Signal Delay', value: '22+ hours' }
    ]
  },
  {
    name: 'Chandrayaan-2',
    category: 'spacecraft',
    sketchfabId: '4d0017f2c5fb49bb9817601858106ddb',
    nasaUrl: 'https://www.isro.gov.in/Chandrayaan2_New.html',
    thumbnail: 'https://images-assets.nasa.gov/image/PIA23357/PIA23357~thumb.jpg',
    desc: 'India\'s second lunar exploration mission — an orbiter, lander (Vikram), and rover (Pragyan). The orbiter continues to map the Moon in stunning detail.',
    launch: 'July 22, 2019',
    location: 'Lunar orbit',
    agency: 'ISRO',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',         value: '3,877 kg' },
      { icon: 'fa-satellite',      label: 'Orbiter life', value: '7+ years' },
      { icon: 'fa-camera',         label: 'Instruments',  value: '14 payloads' },
      { icon: 'fa-moon',           label: 'Orbit',        value: '100 km lunar orbit' }
    ]
  },

  /* ─── LANDERS ─────────────────────────────── */
  {
    name: 'Apollo 11 - Lunar Module 1969',
    category: 'lander',
    sketchfabId: '14c9489460894e2799f3364bdacdd74f',
    nasaUrl: 'https://www.nasa.gov/mission_pages/apollo/apollo-11.html',
    thumbnail: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~thumb.jpg',
    desc: 'The Eagle has landed. The iconic Apollo 11 Lunar Module that carried Neil Armstrong and Buzz Aldrin to the first human landing on the Moon on July 20, 1969.',
    launch: 'July 16, 1969',
    location: 'Sea of Tranquility, Moon',
    agency: 'NASA',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',         value: '15,103 kg' },
      { icon: 'fa-users',          label: 'Crew',         value: '2 astronauts' },
      { icon: 'fa-clock',          label: 'Surface time', value: '21h 36m' },
      { icon: 'fa-shoe-prints',    label: 'EVAs',         value: '1 (2h 31m)' }
    ]
  },
  {
    name: 'Chandrayaan-3 Vikram Lander',
    category: 'lander',
    sketchfabId: '8f684cbf6b3f4cdaad72d3f1ebb5bde4',
    nasaUrl: 'https://www.isro.gov.in/Chandrayaan3.html',
    thumbnail: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~thumb.jpg',
    desc: 'The lander module of India\'s Chandrayaan-3 mission — which made history when it became the first spacecraft to soft-land near the Moon\'s south pole.',
    launch: 'July 14, 2023',
    location: 'Shiv Shakti Point, Moon',
    agency: 'ISRO',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',          value: '1,752 kg' },
      { icon: 'fa-map-marker-alt', label: 'Landing site',  value: '69.37°S, 32.35°E' },
      { icon: 'fa-sun',            label: 'Surface ops',   value: '14 Earth days' },
      { icon: 'fa-flag',           label: 'Historic first',value: 'South pole landing' }
    ]
  },
  {
    name: 'Chandrayaan-3 Vikram (Alt View)',
    category: 'lander',
    sketchfabId: '96dbe26896d541c297e53120a3f6eb16',
    nasaUrl: 'https://www.isro.gov.in/Chandrayaan3.html',
    thumbnail: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~thumb.jpg',
    desc: 'An alternative 3D model of the Vikram Lander from India\'s historic Chandrayaan-3 mission to the lunar south pole.',
    launch: 'July 14, 2023',
    location: 'Shiv Shakti Point, Moon',
    agency: 'ISRO',
    facts: [
      { icon: 'fa-weight-hanging', label: 'Mass',          value: '1,752 kg' },
      { icon: 'fa-map-marker-alt', label: 'Landing site',  value: '69.37°S, 32.35°E' },
      { icon: 'fa-sun',            label: 'Surface ops',   value: '14 Earth days' },
      { icon: 'fa-flag',           label: 'Historic first',value: 'South pole landing' }
    ]
  },

  /* ─── STATIONS ────────────────────────────── */
  {
    name: 'International Space Station (Exterior)',
    category: 'station',
    sketchfabId: 'b7d40d89fcbd4c998462380545f391b6',
    nasaUrl: 'https://www.nasa.gov/international-space-station/',
    thumbnail: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~thumb.jpg',
    desc: 'The largest structure humans have ever built in space. The ISS has continuously hosted crews since November 2000 — over 25 years of uninterrupted human presence in space.',
    launch: 'November 20, 1998',
    location: 'Low Earth Orbit (408 km)',
    agency: 'NASA / Roscosmos / ESA / JAXA / CSA',
    facts: [
      { icon: 'fa-ruler',          label: 'Length',   value: '109m' },
      { icon: 'fa-weight-hanging', label: 'Mass',     value: '420,000+ kg' },
      { icon: 'fa-tachometer-alt', label: 'Speed',    value: '27,600 km/h' },
      { icon: 'fa-users',          label: 'Visitors', value: '280+ from 20 countries' }
    ]
  },
  {
    name: 'International Space Station (Interior)',
    category: 'station',
    sketchfabId: '7753b422ca8046b4ae783d44b2bd6cfc',
    nasaUrl: 'https://www.nasa.gov/international-space-station/',
    thumbnail: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~thumb.jpg',
    desc: 'Explore the interior of the International Space Station. Since 2000, astronauts have lived and worked inside these modules, conducting thousands of scientific experiments in microgravity.',
    launch: 'November 20, 1998',
    location: 'Low Earth Orbit',
    agency: 'Multi-national',
    facts: [
      { icon: 'fa-home',           label: 'Volume',   value: '915 cubic meters' },
      { icon: 'fa-bed',            label: 'Crew',     value: 'Typically 7 members' },
      { icon: 'fa-window-maximize',label: 'Windows',  value: 'Cupola observatory' },
      { icon: 'fa-vial',           label: 'Science',  value: '3,000+ experiments' }
    ]
  },

  /* ─── ROCKETS ─────────────────────────────── */
  {
    name: 'SpaceX Falcon 9 & Dragon 2',
    category: 'rocket',
    sketchfabId: 'f709fc945bb2413faf2878aa613cde3d',
    nasaUrl: 'https://www.spacex.com/vehicles/falcon-9/',
    thumbnail: 'https://images-assets.nasa.gov/image/NHQ202005300057/NHQ202005300057~thumb.jpg',
    desc: 'The Falcon 9 is a reusable, two-stage rocket designed and manufactured by SpaceX. Mounted on top is the Crew Dragon spacecraft, capable of carrying up to 7 passengers to and from Earth orbit.',
    launch: 'May 30, 2020 (Demo-2)',
    location: 'Earth Orbit / ISS',
    agency: 'SpaceX / NASA',
    facts: [
      { icon: 'fa-rocket',         label: 'Vehicle',     value: 'Reusable launch' },
      { icon: 'fa-ruler-vertical', label: 'Height',      value: '70m (Falcon 9)' },
      { icon: 'fa-weight-hanging', label: 'Payload',     value: '22,800 kg to LEO' },
      { icon: 'fa-users',          label: 'Dragon Crew', value: 'Up to 7' }
    ]
  }
];




/* ─────────────────────────────────────────────────────────────
   CATEGORY CONFIG
   ───────────────────────────────────────────────────────────── */
const CAT_COLORS = {
  rover: '#d35400', telescope: '#8e44ad', spacecraft: '#2980b9',
  lander: '#27ae60', station: '#16a085', satellite: '#f39c12', rocket: '#c0392b'
};
const CATEGORY_ICONS = {
  rover: 'fa-car-side', telescope: 'fa-eye', spacecraft: 'fa-meteor',
  lander: 'fa-parachute-box', station: 'fa-circle-nodes', satellite: 'fa-satellite', rocket: 'fa-rocket'
};

/* ─────────────────────────────────────────────────────────────
   DOM REFS
   ───────────────────────────────────────────────────────────── */
const $search        = document.getElementById('craftSearch');
const $searchClear   = document.getElementById('craftSearchClear');
const $resultCount   = document.getElementById('craftResultCount');
const $modelBadge    = document.getElementById('modelCountBadge');
const $showcaseGrid  = document.getElementById('featuredGrid');

/* ─── Viewer DOM ───── */
const $viewer        = document.getElementById('craftViewer');
const $viewerIframe  = document.getElementById('craftViewerIframe');
const $viewerName    = document.getElementById('craftViewerName');
const $viewerCat     = document.getElementById('craftViewerCat');
const $viewerDesc    = document.getElementById('craftViewerDesc');
const $viewerFacts   = document.getElementById('craftViewerFacts');
const $viewerClose   = document.getElementById('craftViewerClose');
const $viewerLoading = document.getElementById('craftViewerLoading');

let viewerOpen = false;
let activeFilter = 'all';
let searchQuery = '';

/* ══════════════════════════════════════════════════════════════
   RENDER FLEET
   ══════════════════════════════════════════════════════════════ */
function renderGallery() {
  if (!$showcaseGrid) return;
  $showcaseGrid.innerHTML = '';

  let models = SPACECRAFT_DB;
  if (activeFilter !== 'all') models = models.filter(m => m.category === activeFilter);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    models = models.filter(m => m.name.toLowerCase().includes(q));
  }

  const total = SPACECRAFT_DB.length;
  if ($resultCount) {
    $resultCount.textContent = (searchQuery || activeFilter !== 'all')
      ? `Showing ${models.length} of ${total} models`
      : ``;
  }
  if ($modelBadge) $modelBadge.textContent = `${total}+`;

  models.forEach((model, idx) => {
    const catColor = CAT_COLORS[model.category] || '#8ba3c0';
    const catLabel = model.category.charAt(0).toUpperCase() + model.category.slice(1);
    const catIcon = CATEGORY_ICONS[model.category] || 'fa-cube';

    const card = document.createElement('div');
    card.className = 'showcase-card fade-up';
    card.style.animationDelay = `${idx * 50}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Explore ${model.name} in 3D`);

    const thumbImg = model.thumbnail
      ? `<img class="showcase-thumb-img" src="${model.thumbnail}" alt="${model.name}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'">`
      : '';

    card.innerHTML = `
      <div class="showcase-thumb">
        ${thumbImg}
        <div class="showcase-thumb-placeholder"><i class="fa-solid ${catIcon}"></i></div>
        <div class="showcase-thumb-overlay"></div>
        <div class="showcase-3d-badge"><i class="fa-solid fa-rotate-3d"></i> Live 3D</div>
        <div class="showcase-category-tag" style="--cat-color:${catColor}"><i class="fa-solid ${catIcon}"></i> ${catLabel}</div>
      </div>
      <div class="showcase-info">
        <h3 class="showcase-name">${model.name}</h3>
        <p class="showcase-teaser">${model.desc.slice(0, 110)}…</p>
        <div class="showcase-cta">
          <span class="showcase-cta-label"><i class="fa-solid fa-rotate-3d"></i> Experience in 3D</span>
          <i class="fa-solid fa-arrow-right showcase-arrow"></i>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openViewer(model));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(model); } });

    $showcaseGrid.appendChild(card);
  });
}

/* ══════════════════════════════════════════════════════════════
   IMMERSIVE VIEWER
   ══════════════════════════════════════════════════════════════ */
function openViewer(model) {
  viewerOpen = true;

  /* ── Header info ── */
  const catLabel = (model.category || 'spacecraft').charAt(0).toUpperCase() + (model.category || 'spacecraft').slice(1);
  const catColor = CAT_COLORS[model.category] || '#8ba3c0';
  if ($viewerName) $viewerName.textContent = model.name;
  if ($viewerCat) { $viewerCat.textContent = catLabel; $viewerCat.style.color = catColor; }
  if ($viewerDesc) $viewerDesc.textContent = model.desc || 'Official NASA 3D spacecraft model.';

  /* ── Facts panel ── */
  if ($viewerFacts && model.facts && model.facts.length) {
    $viewerFacts.innerHTML = model.facts.map(f => `
      <div class="viewer-fact">
        <i class="fa-solid ${f.icon}"></i>
        <div>
          <div class="viewer-fact-label">${f.label}</div>
          <div class="viewer-fact-value">${f.value}</div>
        </div>
      </div>
    `).join('');
    $viewerFacts.style.display = 'grid';
  } else if ($viewerFacts) {
    $viewerFacts.style.display = 'none';
  }

  /* ── 3D content loading ── */
  if (model.sketchfabId) {
    if ($viewerIframe) $viewerIframe.style.display = 'block';
    if ($viewerLoading) {
      $viewerLoading.classList.remove('hidden');
      $viewerLoading.style.display = 'flex';
    }

    const hideLoader = () => {
      if ($viewerLoading) $viewerLoading.classList.add('hidden');
    };

    if (window.Sketchfab) {
      $viewerIframe.src = '';
      const client = new Sketchfab('1.12.1', $viewerIframe);
      client.init(model.sketchfabId, {
        success: function onSuccess(api) {
          api.start();
          api.addEventListener('viewerready', function() {
            hideLoader();
          });
        },
        error: function onError() {
          hideLoader();
        },
        autostart: 1,
        preload: 1,
        ui_theme: 'dark',
        ui_hint: 0,
        camera: 0,
        transparent: 0,
        ui_watermark: 0,
        ui_infos: 0
      });
    } else {
      // Fallback if API script failed to load
      const embedUrl = `https://sketchfab.com/models/${model.sketchfabId}/embed?` + [
        'autostart=1', 'preload=1', 'ui_theme=dark', 'ui_hint=0', 'camera=0', 'transparent=0', 'ui_watermark=0', 'ui_infos=0'
      ].join('&');
      
      let loadTimeout;
      $viewerIframe.onload = () => {
        clearTimeout(loadTimeout);
        setTimeout(hideLoader, 3000);
      };
      loadTimeout = setTimeout(hideLoader, 8000);
      $viewerIframe.src = embedUrl;
    }
  }

  /* ── Show overlay ── */
  if ($viewer) $viewer.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Trap focus in viewer
  setTimeout(() => { if ($viewerClose) $viewerClose.focus(); }, 100);
}

function closeViewer() {
  viewerOpen = false;
  if ($viewer) $viewer.classList.remove('open');
  document.body.style.overflow = '';
  // Stop iframe to kill audio/network
  setTimeout(() => {
    if ($viewerIframe) $viewerIframe.src = '';
  }, 300);
}

/* ─── Viewer controls ─────────────────────────────────────── */
if ($viewerClose) $viewerClose.addEventListener('click', closeViewer);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && viewerOpen) closeViewer();
});

/* ══════════════════════════════════════════════════════════════
   FILTER CHIPS
   ══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderGallery();
  });
});

/* ══════════════════════════════════════════════════════════════
   SEARCH
   ══════════════════════════════════════════════════════════════ */
if ($search) {
  $search.addEventListener('input', () => {
    searchQuery = $search.value.trim();
    if ($searchClear) $searchClear.style.display = searchQuery ? 'flex' : 'none';
    renderGallery();
  });
}

if ($searchClear) {
  $searchClear.addEventListener('click', () => {
    if ($search) $search.value = '';
    searchQuery = '';
    $searchClear.style.display = 'none';
    renderGallery();
    if ($search) $search.focus();
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
renderGallery();
