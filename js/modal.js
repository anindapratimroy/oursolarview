export function initModal() {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalIframe = document.getElementById('modalIframe');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (!modal) return;

  const modalFullscreen = document.getElementById('modalFullscreen');
  const fsIcon = document.getElementById('fsIcon');
  let isFullscreen = false;

  window.openPlanetModal = function(p, pushState = true) {
    modalTitle.innerHTML = `<span>${p.name}</span> — Divine Blueprint`;
    modalIframe.src = `./planets/planet_viewer.html?planet=${p.name.toLowerCase()}`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (pushState) {
      const url = new URL(window.location);
      url.searchParams.set('planet', p.name.toLowerCase());
      window.history.pushState({ modalOpen: true, planet: p.name.toLowerCase() }, '', url);
    }
  }

  function closeModal(pushState = true) {
    modal.classList.remove('open');
    if (isFullscreen) toggleFullscreen();
    document.body.style.overflow = '';
    setTimeout(() => { modalIframe.src = ''; }, 400);

    if (pushState) {
      const url = new URL(window.location);
      url.searchParams.delete('planet');
      window.history.pushState({ modalOpen: false }, '', url);
    }
  }

  // Handle browser Back/Forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.modalOpen) {
      // Re-open if going forward
      const planetName = e.state.planet;
      // We rely on the search params or state to open it, 
      // but easiest is just to reload or let the url trigger it.
      // Actually we can just call open if we have the planet data, but we only have name here.
      // Better to trigger a reload if we want full sync, or just let them reload.
      window.location.reload();
    } else {
      closeModal(false);
    }
  });
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    modal.classList.toggle('fullscreen', isFullscreen);
    fsIcon.className = isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    modalFullscreen.title = isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
  }
  modalFullscreen.addEventListener('click', toggleFullscreen);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Listen for postMessage from planet_viewer iframe back button
  window.addEventListener('message', (e) => {
    if (e.data === 'closeModal') closeModal();
  });
}
