import { initStars } from './stars.js';
import { initEarth } from './earth.js';
import { initModal } from './modal.js';
import { initPlanets } from './planets.js';

// Preloader fallback (managed by LoadingManager in earth.js if active)
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  function quickDismiss() {
    const $bar  = document.getElementById('preProgressBar');
    const $glow = document.getElementById('preProgressGlow');
    const $pct  = document.getElementById('prePct');
    const $lbl  = document.getElementById('preLabel');
    if ($bar)  $bar.style.width  = '100%';
    if ($glow) $glow.style.width = '100%';
    if ($pct)  $pct.textContent  = '100%';
    if ($lbl)  { $lbl.style.opacity='0'; setTimeout(()=>{ $lbl.textContent='The universe is yours.'; $lbl.style.opacity='1'; },200); }
    setTimeout(() => {
      pre.classList.add('out');
      setTimeout(() => pre.remove(), 850);
    }, 300);
  }

  if (window.innerWidth < 1100) {
    // Mobile: no Earth texture loading, dismiss quickly
    quickDismiss();
  } else {
    // Desktop fallback: if LoadingManager in earth.js fails to dismiss within 12s, force it
    setTimeout(() => {
      if (document.getElementById('preloader')) quickDismiss();
    }, 12000);
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
