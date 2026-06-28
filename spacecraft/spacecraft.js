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
  {
    name: "Perseverance Rover",
    category: "rover",
    sketchfabId: "c1c94e1f69df45eeae4a0a1d0d27e85b",
    nasaUrl: "https://mars.nasa.gov/mars2020/",
    thumbnail: "https://media.sketchfab.com/models/c1c94e1f69df45eeae4a0a1d0d27e85b/thumbnails/88365fe977914d3a900c54de88a9eb95/58627236ace44b7384257c2da4b6d213.jpeg",
    desc: "NASA's most advanced Mars rover, landed in Jezero Crater on February 18, 2021. Carrying 23 cameras, a microphone, a ground-penetrating radar, and the Ingenuity helicopter.",
    launch: "July 30, 2020",
    location: "Jezero Crater, Mars",
    agency: "NASA / JPL-Caltech",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"1,025 kg"},{"icon":"fa-camera","label":"Cameras","value":"23 eyes"},{"icon":"fa-ruler","label":"Size","value":"3m × 2.7m × 2.2m"},{"icon":"fa-bolt","label":"Power","value":"Nuclear RTG (110W)"}]
  },
  {
    name: "Curiosity Rover (MSL)",
    category: "rover",
    sketchfabId: "0696a383f3e841d2b5c7636ee8a58aba",
    nasaUrl: "https://mars.nasa.gov/msl/",
    thumbnail: "https://media.sketchfab.com/models/0696a383f3e841d2b5c7636ee8a58aba/thumbnails/d677b4d6542a4e9998e41c91eab7b93e/464372d9b833402097de4721f4766b3d.jpeg",
    desc: "Mars Science Laboratory rover, exploring Gale Crater since August 6, 2012. A car-sized nuclear-powered rover studying the Martian climate, geology, and habitability.",
    launch: "November 26, 2011",
    location: "Gale Crater, Mars",
    agency: "NASA / JPL-Caltech",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"899 kg"},{"icon":"fa-camera","label":"Cameras","value":"17 eyes"},{"icon":"fa-ruler","label":"Size","value":"2.9m × 2.7m × 2.2m"},{"icon":"fa-bolt","label":"Power","value":"Nuclear RTG (110W)"}]
  },
  {
    name: "Mars Sojourner",
    category: "rover",
    sketchfabId: "8b3810e7cd804bd6b0009520c67984c6",
    nasaUrl: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models",
    thumbnail: "https://media.sketchfab.com/models/8b3810e7cd804bd6b0009520c67984c6/thumbnails/e5bb603ccdcb4b17913c3903be54c203/46ff0e916ff2438ebea3f811c5ceacc0.jpeg",
    desc: "The first wheeled vehicle to operate on another planet. Sojourner landed on Mars on July 4, 1997, as part of the Mars Pathfinder mission, exploring the Ares Vallis region.",
    launch: "December 4, 1996",
    location: "Ares Vallis, Mars",
    agency: "NASA / JPL",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"11.5 kg"},{"icon":"fa-camera","label":"Cameras","value":"3 eyes"},{"icon":"fa-ruler","label":"Size","value":"65cm × 48cm × 30cm"},{"icon":"fa-bolt","label":"Power","value":"Solar + batteries"}]
  },
  {
    name: "Hubble Space Telescope",
    category: "telescope",
    sketchfabId: "6546d1989bcd4e8aa135f0d659c53c9c",
    nasaUrl: "https://hubblesite.org/",
    thumbnail: "https://media.sketchfab.com/models/6546d1989bcd4e8aa135f0d659c53c9c/thumbnails/3a63be1802b4460b960d182f995a20fe/bc99cc641bbf4e7791ba12d9a913156d.jpeg",
    desc: "In orbit since 1990, Hubble has made over 1.5 million observations and fundamentally transformed our understanding of the cosmos — from determining the age of the universe to discovering dark energy.",
    launch: "April 24, 1990",
    location: "Low Earth Orbit (547 km)",
    agency: "NASA / ESA",
    facts: [{"icon":"fa-circle","label":"Mirror","value":"2.4m (7.9 ft)"},{"icon":"fa-weight-hanging","label":"Mass","value":"11,110 kg"},{"icon":"fa-tachometer-alt","label":"Speed","value":"27,300 km/h"},{"icon":"fa-images","label":"Observations","value":"1.5 million+"}]
  },
  {
    name: "Voyager 1 & 2",
    category: "spacecraft",
    sketchfabId: "1a865fbfcac5410ba5e700b89fda7ad6",
    nasaUrl: "https://github.com/nasa/NASA-3D-Resources/tree/master/3D%20Models/Voyager",
    thumbnail: "https://media.sketchfab.com/models/1a865fbfcac5410ba5e700b89fda7ad6/thumbnails/5b4559d600e0498d813a5bd3b39cdcc4/blob.jpeg",
    desc: "Launched in 1977, Voyager is the farthest human-made object ever built — drifting through interstellar space. It carries a golden record of Earth sounds, music, and greetings.",
    launch: "September 5, 1977",
    location: "Interstellar space",
    agency: "NASA / JPL",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"721.9 kg"},{"icon":"fa-bolt","label":"Power","value":"Nuclear RTG"},{"icon":"fa-tachometer-alt","label":"Speed","value":"61,500 km/h"},{"icon":"fa-signal","label":"Signal Delay","value":"22+ hours"}]
  },
  {
    name: "Chandrayaan-2",
    category: "spacecraft",
    sketchfabId: "4d0017f2c5fb49bb9817601858106ddb",
    nasaUrl: "https://www.isro.gov.in/Chandrayaan2_New.html",
    thumbnail: "https://media.sketchfab.com/models/4d0017f2c5fb49bb9817601858106ddb/thumbnails/6ba4a60f393f4f8390a2266b1c308113/3eef5b33d55e40deaea10eb7ab7ec712.jpeg",
    desc: "India's second lunar exploration mission — an orbiter, lander (Vikram), and rover (Pragyan). The orbiter continues to map the Moon in stunning detail.",
    launch: "July 22, 2019",
    location: "Lunar orbit",
    agency: "ISRO",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"3,877 kg"},{"icon":"fa-satellite","label":"Orbiter life","value":"7+ years"},{"icon":"fa-camera","label":"Instruments","value":"14 payloads"},{"icon":"fa-moon","label":"Orbit","value":"100 km lunar orbit"}]
  },
  {
    name: "Apollo 11 - Lunar Module 1969",
    category: "lander",
    sketchfabId: "14c9489460894e2799f3364bdacdd74f",
    nasaUrl: "https://www.nasa.gov/mission_pages/apollo/apollo-11.html",
    thumbnail: "https://media.sketchfab.com/models/14c9489460894e2799f3364bdacdd74f/thumbnails/0c49f46332074038aed5c527497ede30/332d40b5b2e04ed681e4095eb7d13267.jpeg",
    desc: "The Eagle has landed. The iconic Apollo 11 Lunar Module that carried Neil Armstrong and Buzz Aldrin to the first human landing on the Moon on July 20, 1969.",
    launch: "July 16, 1969",
    location: "Sea of Tranquility, Moon",
    agency: "NASA",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"15,103 kg"},{"icon":"fa-users","label":"Crew","value":"2 astronauts"},{"icon":"fa-clock","label":"Surface time","value":"21h 36m"},{"icon":"fa-shoe-prints","label":"EVAs","value":"1 (2h 31m)"}]
  },
  {
    name: "Chandrayaan-3 Vikram Lander",
    category: "lander",
    sketchfabId: "8f684cbf6b3f4cdaad72d3f1ebb5bde4",
    nasaUrl: "https://www.isro.gov.in/Chandrayaan3.html",
    thumbnail: "https://media.sketchfab.com/models/8f684cbf6b3f4cdaad72d3f1ebb5bde4/thumbnails/8fbb0b48dd974eeca8e908033ceadd66/a57c7b7e91d24836b0270ba2d01a355e.jpeg",
    desc: "The lander module of India's Chandrayaan-3 mission — which made history when it became the first spacecraft to soft-land near the Moon's south pole.",
    launch: "July 14, 2023",
    location: "Shiv Shakti Point, Moon",
    agency: "ISRO",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"1,752 kg"},{"icon":"fa-map-marker-alt","label":"Landing site","value":"69.37°S, 32.35°E"},{"icon":"fa-sun","label":"Surface ops","value":"14 Earth days"},{"icon":"fa-flag","label":"Historic first","value":"South pole landing"}]
  },
  {
    name: "Chandrayaan-3 Vikram (Alt View)",
    category: "lander",
    sketchfabId: "96dbe26896d541c297e53120a3f6eb16",
    nasaUrl: "https://www.isro.gov.in/Chandrayaan3.html",
    thumbnail: "https://media.sketchfab.com/models/96dbe26896d541c297e53120a3f6eb16/thumbnails/64c7d8b1e79847159ff479dd789b6a1f/604ce0da5c434df8b03ea7cafba42112.jpeg",
    desc: "An alternative 3D model of the Vikram Lander from India's historic Chandrayaan-3 mission to the lunar south pole.",
    launch: "July 14, 2023",
    location: "Shiv Shakti Point, Moon",
    agency: "ISRO",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"1,752 kg"},{"icon":"fa-map-marker-alt","label":"Landing site","value":"69.37°S, 32.35°E"},{"icon":"fa-sun","label":"Surface ops","value":"14 Earth days"},{"icon":"fa-flag","label":"Historic first","value":"South pole landing"}]
  },
  {
    name: "International Space Station (Exterior)",
    category: "station",
    sketchfabId: "b7d40d89fcbd4c998462380545f391b6",
    nasaUrl: "https://www.nasa.gov/international-space-station/",
    thumbnail: "https://media.sketchfab.com/models/b7d40d89fcbd4c998462380545f391b6/thumbnails/a2e735db671c4e9eb53e66e653ea2be1/d16f88becbe749c4a1a37f8cafaf38c2.jpeg",
    desc: "The largest structure humans have ever built in space. The ISS has continuously hosted crews since November 2000 — over 25 years of uninterrupted human presence in space.",
    launch: "November 20, 1998",
    location: "Low Earth Orbit (408 km)",
    agency: "NASA / Roscosmos / ESA / JAXA / CSA",
    facts: [{"icon":"fa-ruler","label":"Length","value":"109m"},{"icon":"fa-weight-hanging","label":"Mass","value":"420,000+ kg"},{"icon":"fa-tachometer-alt","label":"Speed","value":"27,600 km/h"},{"icon":"fa-users","label":"Visitors","value":"280+ from 20 countries"}]
  },
  {
    name: "International Space Station (Interior)",
    category: "station",
    sketchfabId: "7753b422ca8046b4ae783d44b2bd6cfc",
    nasaUrl: "https://www.nasa.gov/international-space-station/",
    thumbnail: "https://media.sketchfab.com/models/7753b422ca8046b4ae783d44b2bd6cfc/thumbnails/b586a85afd61433095d629a14ea7169d/85f26e7164de48409130edea1ff89839.jpeg",
    desc: "Explore the interior of the International Space Station. Since 2000, astronauts have lived and worked inside these modules, conducting thousands of scientific experiments in microgravity.",
    launch: "November 20, 1998",
    location: "Low Earth Orbit",
    agency: "Multi-national",
    facts: [{"icon":"fa-home","label":"Volume","value":"915 cubic meters"},{"icon":"fa-bed","label":"Crew","value":"Typically 7 members"},{"icon":"fa-window-maximize","label":"Windows","value":"Cupola observatory"},{"icon":"fa-vial","label":"Science","value":"3,000+ experiments"}]
  },
  {
    name: "SpaceX Falcon 9 & Dragon 2",
    category: "rocket",
    sketchfabId: "f709fc945bb2413faf2878aa613cde3d",
    nasaUrl: "https://www.spacex.com/vehicles/falcon-9/",
    thumbnail: "https://media.sketchfab.com/models/f709fc945bb2413faf2878aa613cde3d/thumbnails/d22f501228cc4baf8becc5e5776ef18a/720x405.jpeg",
    desc: "The Falcon 9 is a reusable, two-stage rocket designed and manufactured by SpaceX. Mounted on top is the Crew Dragon spacecraft, capable of carrying up to 7 passengers to and from Earth orbit.",
    launch: "May 30, 2020 (Demo-2)",
    location: "Earth Orbit / ISS",
    agency: "SpaceX / NASA",
    facts: [{"icon":"fa-rocket","label":"Vehicle","value":"Reusable launch"},{"icon":"fa-ruler-vertical","label":"Height","value":"70m (Falcon 9)"},{"icon":"fa-weight-hanging","label":"Payload","value":"22,800 kg to LEO"},{"icon":"fa-users","label":"Dragon Crew","value":"Up to 7"}]
  },
  {
    name: "ISRO Chandrayaan-3 Vikram Lander",
    category: "lander",
    sketchfabId: "27e8d9b94f324e6b9a25b58e64317213",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/27e8d9b94f324e6b9a25b58e64317213/thumbnails/619d3f07a5a44b92863dc2fed4885db7/4c6201d644bb4bccb3b4375674b9ae39.jpeg",
    desc: "The Vikram lander from India's Chandrayaan-3 mission, which successfully soft-landed near the lunar south pole on August 23, 2023, making India the fourth country to land on the Moon.",
    launch: "July 14, 2023",
    location: "Lunar South Pole",
    agency: "ISRO",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"1,752 kg"},{"icon":"fa-rocket","label":"Vehicle","value":"LVM3-M4"},{"icon":"fa-flag","label":"Nation","value":"India"}]
  },
  {
    name: "ISRO Pragyan Rover",
    category: "rover",
    sketchfabId: "ecd749574f7343b6a6b39a4a9a02639d",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/ecd749574f7343b6a6b39a4a9a02639d/thumbnails/165c8ddd7f3847688c944e1406b3f500/ceeeb4470566465ab6c134505a0f4c3a.jpeg",
    desc: "A lunar rover deployed by the Chandrayaan-3 mission. It explored the lunar surface near the south pole, conducting chemical analysis of the lunar regolith.",
    launch: "July 14, 2023",
    location: "Lunar South Pole",
    agency: "ISRO",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"26 kg"},{"icon":"fa-bolt","label":"Power","value":"Solar Panel (50W)"},{"icon":"fa-car-side","label":"Wheels","value":"6 Wheels"}]
  },
  {
    name: "ISRO Mangalyaan (Mars Orbiter)",
    category: "satellite",
    sketchfabId: "8719b7a3077643a798c95aec4dbced13",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/8719b7a3077643a798c95aec4dbced13/thumbnails/d7eec9aae83844f1a989875139df7e03/blob.jpeg",
    desc: "The Mars Orbiter Mission (MOM), also called Mangalyaan, was a space probe orbiting Mars since 2014. It made India the first Asian nation to reach Martian orbit and the first in the world to do so in its maiden attempt.",
    launch: "November 5, 2013",
    location: "Martian Orbit",
    agency: "ISRO",
    facts: [{"icon":"fa-weight-hanging","label":"Mass","value":"1,337 kg"},{"icon":"fa-rocket","label":"Vehicle","value":"PSLV-XL C25"},{"icon":"fa-clock","label":"Duration","value":"7.5 Years"}]
  },
  {
    name: "ISRO Gaganyaan Crew Module",
    category: "spacecraft",
    sketchfabId: "8f7d6390491c4e308a9cf8b503f9b384",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/8f7d6390491c4e308a9cf8b503f9b384/thumbnails/71567683be7a4f089adf6a8984890995/bcc51f72163e438c9f20898549579a75.jpeg",
    desc: "The crew module for Gaganyaan, India's first human spaceflight programme. It is designed to carry three Indian astronauts (Gaganauts) into Low Earth Orbit for a 3-day mission.",
    launch: "Upcoming",
    location: "Low Earth Orbit (400 km)",
    agency: "ISRO",
    facts: [{"icon":"fa-users","label":"Crew","value":"3 Members"},{"icon":"fa-weight-hanging","label":"Mass","value":"3,735 kg"},{"icon":"fa-rocket","label":"Vehicle","value":"LVM3"}]
  },
  {
    name: "Rocket ISRO",
    category: "rocket",
    sketchfabId: "a0cb59271cf540bfba324d7c3034d3d3",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/a0cb59271cf540bfba324d7c3034d3d3/thumbnails/1d6219f5b40d475b9dc5c77cec91e4ad/59dfd50f126c48e0a4ce3867ff620271.jpeg",
    desc: "Rocket ISRO model by selvinraj.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "ISRO Gaganyaan - Animated Solar Panel",
    category: "spacecraft",
    sketchfabId: "962a218eb4394890bfa55ab1e6b233e7",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/962a218eb4394890bfa55ab1e6b233e7/thumbnails/527471eb8a3240c294c2b9902ca6df9b/85906d17374e415eacf0b738129ee41b.jpeg",
    desc: "ISRO Gaganyaan - Animated Solar Panel by the3dCartel.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Vikram Lander ISRO Chandrayan 3 (MechLab3D)",
    category: "lander",
    sketchfabId: "f5d82f150d6640d3a85bf11b158d0a0f",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/f5d82f150d6640d3a85bf11b158d0a0f/thumbnails/9988b900bfa54e8abad65dd4cd5f6278/aca33ecdfcac47b7b63d5c0bbcfd4437.jpeg",
    desc: "Vikram Lander ISRO Chandrayan 3 by MechLab3D.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "NISAR Satellite ISRO - NASA Joint Mission",
    category: "satellite",
    sketchfabId: "0103309668d243dbbfab3c8fc6b9683c",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/0103309668d243dbbfab3c8fc6b9683c/thumbnails/724de452c1674c068bc3848b865cb5c2/d584adf2bac74d02b3210ec0e8af1a51.jpeg",
    desc: "NISAR Satellite ISRO - NASA Joint Mission by MechLab3D.",
    agency: "ISRO / NASA",
    facts: []
  },
  {
    name: "Rocket Model ISRO (GSLV) rocket",
    category: "rocket",
    sketchfabId: "ab1265ff351c4a0aa382d91c89c30f18",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/ab1265ff351c4a0aa382d91c89c30f18/thumbnails/9726a1f70c9d48689f17f953a7956af5/e55c4ec43a5741f89ff64cb8b57b0e41.jpeg",
    desc: "Rocket Model ISRO (GSLV) rocket by mahadevanshenil.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Gaganyaan Indian Spacecraft ISRO",
    category: "spacecraft",
    sketchfabId: "8806539ac75b4906a7bf1ca9bd0a9657",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/8806539ac75b4906a7bf1ca9bd0a9657/thumbnails/b4dd4676e712439e8ede1a38aa3b2a3b/c4b79066bc5143bc80d0d7d7bc8c8c1d.jpeg",
    desc: "Gaganyaan Indian Spacecraft ISRO by MechLab3D.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "PSLV C2 model",
    category: "rocket",
    sketchfabId: "93081942b54a4612bebade20fea22e33",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/93081942b54a4612bebade20fea22e33/thumbnails/3e72ae717a51456293bfa1fabbb37f7b/a900cc7f8d17409480973d654fc6dadf.jpeg",
    desc: "PSLV C2 model by satyajit26patil.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Chandrayaan-3 Vikram Lander (AnishRoyalinc)",
    category: "lander",
    sketchfabId: "b29bee8d7c524c12b6a043cdd1f75979",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/b29bee8d7c524c12b6a043cdd1f75979/thumbnails/c097f48fba60414e826b15a2e59328d1/00fe4c40ae2a40368c95fb8726fef8c8.jpeg",
    desc: "Chandrayaan 3 vikram lander by AnishRoyalinc.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Crew Dragon Capsule SpaceX",
    category: "spacecraft",
    sketchfabId: "f41cbc16988c4c31935e5d063088ca65",
    nasaUrl: "https://www.spacex.com/",
    thumbnail: "https://media.sketchfab.com/models/f41cbc16988c4c31935e5d063088ca65/thumbnails/d50a95b1b8ea43be9f770e8d4ef5a9f9/7d062c0404044e2f97f46dd48f39312b.jpeg",
    desc: "Crew Dragon Capsule SpaceX by academyinnovaworld.",
    agency: "SpaceX",
    facts: []
  },
  {
    name: "Vikram Lander (innovaworldfoundation)",
    category: "lander",
    sketchfabId: "b7fca089a3874faeba4a59774a3c968d",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/b7fca089a3874faeba4a59774a3c968d/thumbnails/503c5c4e449247b696e79e480d8b49f1/9e3d2c3ebe0143c3a4cd2a1f87cfac8f.jpeg",
    desc: "Vikram Lander by innovaworldfoundation.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Chandrayaan-3 Pragyan Rover (AnishRoyalinc)",
    category: "rover",
    sketchfabId: "33b2fe88693d40e995ba7008981f5954",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/33b2fe88693d40e995ba7008981f5954/thumbnails/78ccb118154441399097929d9af24625/e247e5215502466e8fb213770f6343bf.jpeg",
    desc: "Chandrayaan 3 pragyan rover by AnishRoyalinc.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Mars Orbiter Mission (Mangalyana) (dubey)",
    category: "satellite",
    sketchfabId: "72a4112ce14d4ce3887a8a149f5589b7",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/72a4112ce14d4ce3887a8a149f5589b7/thumbnails/ba7fc596843b47d58cd9bed87f1ce0fc/720x405.jpeg",
    desc: "Mars Orbiter Mission (Mangalyana) by ISRO by dubey.ujjwal1994.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "ISRO Rover",
    category: "rover",
    sketchfabId: "229bb6eb9b614a18bf3e4fe536dc707d",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/229bb6eb9b614a18bf3e4fe536dc707d/thumbnails/a10dba94dd664e55a6d1fdd09766923b/0c7cd9ca379648b19b95cf9e648b6eea.jpeg",
    desc: "ISRO Rover by Yagnik Kavathiya.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Aditya L1 Satellite",
    category: "satellite",
    sketchfabId: "89fe9cc3359e410ba285862dec53e5dc",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/89fe9cc3359e410ba285862dec53e5dc/thumbnails/3f8301f2d53c4f8c8fbfca525620b45b/4c4a68819be94540a485e1c800eaec08.jpeg",
    desc: "Aditya L1 Satellite by AnishRoyalinc.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "PSLV C40",
    category: "rocket",
    sketchfabId: "c7066310704040a9bf0c86d7d21ab94f",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/c7066310704040a9bf0c86d7d21ab94f/thumbnails/2de9a7667a8540dfac07c8da51e72bc2/805506a68ad148b295842065cc8d42d7.jpeg",
    desc: "PSLV C40 by Neel3Dartist.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Vikram Lander Chandrayan 3 & Pragyan Moon Rover",
    category: "lander",
    sketchfabId: "a8067a0e394c4961b5e855a8321adff8",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/a8067a0e394c4961b5e855a8321adff8/thumbnails/e9f60a90e4e2444e9ec76c00c8196ba6/ed803a96e4b44c6598e93642975c60ac.jpeg",
    desc: "Vikram Lander Chandrayan 3 & Pragyan Moon Rover by Abdurhman Aljagthami.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Chandrayaan-3 Vikram Lander (NishantCreatives)",
    category: "lander",
    sketchfabId: "13b82ab71a9f4f098dab6e8697d14216",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/13b82ab71a9f4f098dab6e8697d14216/thumbnails/46b8208f41a94082a9549c8dabc07043/e8eb898557324ef685fff28b65d6b38b.jpeg",
    desc: "Chandrayaan-3 Vikram Lander by NishantCreatives.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "GSLV Mk3",
    category: "rocket",
    sketchfabId: "0426922358b4444f9887bcd551d3a5cb",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/0426922358b4444f9887bcd551d3a5cb/thumbnails/22348c9ddb064333bbe03ca4aeaf08e3/63884d5637d449f89a4f99620b01898c.jpeg",
    desc: "GSLV Mk3 by Jainesh Pathak.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "NISAR (Aniketfab.com)",
    category: "satellite",
    sketchfabId: "18f8ec6b19db49d29d9c986842d79850",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/18f8ec6b19db49d29d9c986842d79850/thumbnails/742c1a5e29474c0b859c047e27c91eec/264ac7c554e04c15a3acd7cadb272f35.jpeg",
    desc: "NISAR by Aniketfab.com.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "Chandrayaan-1 Moon Impact Probe",
    category: "satellite",
    sketchfabId: "da611fcaf77b4cd183358dcee6c4513e",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/da611fcaf77b4cd183358dcee6c4513e/thumbnails/63be8fb08b9d40d492c9edf048516f89/5395b73d609a4541a51255d51eb5a5e0.jpeg",
    desc: "Chandrayaan-1 Moon Impact Probe by vedarthstudio.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "ADITYA L1 (MechLab3D)",
    category: "satellite",
    sketchfabId: "6658e75eb32240d6a485227564ad2938",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/6658e75eb32240d6a485227564ad2938/thumbnails/f96109bd322f40b99bfbf6bd00517ad2/da988363b66340dbb192da2733c7e09f.jpeg",
    desc: "ADITYA L1 by MechLab3D.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "isro_chandrayyan-3_mission_lander_module_vikram",
    category: "lander",
    sketchfabId: "9e34b033379243d5a8702a04b35770e5",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/9e34b033379243d5a8702a04b35770e5/thumbnails/468f8dff4c7646deab0e430fcc9d5cf7/97846f6a49ab48319b723e03934cad35.jpeg",
    desc: "isro_chandrayyan-3_mission_lander_module_vikram by meghraj.",
    agency: "ISRO",
    facts: []
  },
  {
    name: "LUPEX Rover (chandrayaan4)",
    category: "rover",
    sketchfabId: "6e3dc5e5772e449e91dc34a47cd4a69b",
    nasaUrl: "https://www.isro.gov.in/",
    thumbnail: "https://media.sketchfab.com/models/6e3dc5e5772e449e91dc34a47cd4a69b/thumbnails/3b894d4611364951806c495107ac71bc/ce741b30683c4ac387857f49e60cf200.jpeg",
    desc: "LUPEX Rover (chandrayaan4) by AnishRoyalinc.",
    agency: "ISRO",
    facts: []
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
    let loaderInterval;
    let currentPct = 0;
    const phrases = [
      "God is building the machines...",
      "God is forging the hull...",
      "God is igniting the thrusters...",
      "God is calibrating the instruments...",
      "God is programming the flight path...",
      "God is assembling the solar panels...",
      "God is charging the energy cells...",
      "God is testing the communications..."
    ];
    let currentPhrase = phrases[0];

    if ($viewerLoading) {
      $viewerLoading.classList.remove('hidden');
      $viewerLoading.style.display = 'flex';
      const textEl = document.getElementById('craftLoaderText');
      if (textEl) textEl.textContent = `${currentPhrase} (0%)`;
      
      loaderInterval = setInterval(() => {
        currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        if (textEl) textEl.textContent = `${currentPhrase} (${currentPct}%)`;
      }, 700);
    }

    const hideLoader = () => {
      if ($viewerLoading) $viewerLoading.classList.add('hidden');
      if (loaderInterval) clearInterval(loaderInterval);
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
          api.addEventListener('modelLoadProgress', function(factor) {
            currentPct = Math.floor(factor.progress * 100);
            const textEl = document.getElementById('craftLoaderText');
            if (textEl) textEl.textContent = `${currentPhrase} (${currentPct}%)`;
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
