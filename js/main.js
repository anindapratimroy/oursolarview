import { initStars } from './stars.js';
import { initEarth } from './earth.js';
import { initModal } from './modal.js';
import { initPlanets } from './planets.js';

// Preloader
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    pre.classList.add('out');
    setTimeout(() => pre.remove(), 700);
  }
});

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initEarth();
    initPlanets();
    initModal();
});
