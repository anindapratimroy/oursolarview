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

  window.openPlanetModal = function(p) {
    modalTitle.innerHTML = `<span>${p.name}</span> — Data Stream`;
    modalIframe.src = `./planets/planet_viewer.html?planet=${p.name.toLowerCase()}`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    if (isFullscreen) toggleFullscreen();
    document.body.style.overflow = '';
    setTimeout(() => { modalIframe.src = ''; }, 400);
  }
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    modal.classList.toggle('fullscreen', isFullscreen);
    fsIcon.className = isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    modalFullscreen.title = isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
  }
  modalFullscreen.addEventListener('click', toggleFullscreen);
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
