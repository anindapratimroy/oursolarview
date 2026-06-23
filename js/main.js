import { initStars } from './stars.js';
import { initEarth } from './earth.js';
import { initModal } from './modal.js';
import { initPlanets } from './planets.js';

// Preloader fallback (managed by LoadingManager in earth.js if active)
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre && window.innerWidth < 1100) {
    // If mobile, earth viewer isn't loading textures, so clear immediately
    pre.classList.add('out');
    setTimeout(() => pre.remove(), 700);
  } else if (pre) {
    // Fallback if LoadingManager fails
    setTimeout(() => {
        if(document.getElementById('preloader')) {
           pre.classList.add('out');
           setTimeout(() => pre.remove(), 700);
        }
    }, 5000);
  }
});

// Mobile Navigation Toggle
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', !isOpen);
    });
    
    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initEarth();
    initPlanets();
    initModal();
    initMobileNav();
});
