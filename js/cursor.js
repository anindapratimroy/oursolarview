// js/cursor.js

// Disable on touch devices
if (!window.matchMedia("(pointer: coarse)").matches) {

  const center = document.createElement('div');
  center.id = 'custom-cursor-center';
  
  const system = document.createElement('div');
  system.id = 'custom-cursor-orbit-system';
  
  const p1 = document.createElement('div'); p1.className = 'cursor-planet';
  const p2 = document.createElement('div'); p2.className = 'cursor-planet';
  const p3 = document.createElement('div'); p3.className = 'cursor-planet';
  system.appendChild(p1);
  system.appendChild(p2);
  system.appendChild(p3);
  
  // Wait for body to be available if script runs in head, otherwise append immediately
  function initCursor() {
    if (!document.body) {
      requestAnimationFrame(initCursor);
      return;
    }
    document.body.appendChild(system);
    document.body.appendChild(center);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let angle = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const hoverSelectors = 'a, button, select, input, .btn, summary, .mobile-toggle, label, .nav-brand, .planet-card, [onclick]';
    
    // Robust Event Delegation for Hover States
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(hoverSelectors)) {
        document.body.classList.add('cursor-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(hoverSelectors)) {
        // Only remove if we aren't moving into a child of the interactive element
        if (!e.relatedTarget || !e.relatedTarget.closest(hoverSelectors)) {
          document.body.classList.remove('cursor-hovering');
        }
      }
    });

    // Handle Dragging State for Canvases
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-dragging'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-dragging'));

    function render() {
      // Smooth lerping for the center dot
      currentX += (mouseX - currentX) * 0.25;
      currentY += (mouseY - currentY) * 0.25;

      center.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      system.style.left = `${currentX}px`;
      system.style.top = `${currentY}px`;

      // Dynamic speed based on movement
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // When dragging, speed up the orbit massively
      const isDragging = document.body.classList.contains('cursor-dragging');
      const dragMultiplier = isDragging ? 5 : 1;
      const speedMultiplier = (1 + Math.min(dist / 20, 4)) * dragMultiplier; 
      
      // Increment angle
      angle += 0.05 * speedMultiplier;

      // Radius logic
      const isHovering = document.body.classList.contains('cursor-hovering');
      let targetR = 12;
      if (isHovering) targetR = 30; // Expands to wrap buttons
      if (isDragging) targetR = 8;  // Constricts tightly when grabbing
      
      if (!window.orbRadius) window.orbRadius = 12;
      window.orbRadius += (targetR - window.orbRadius) * 0.15;
      
      const R = window.orbRadius;

      p1.style.transform = `translate(${Math.cos(angle) * R}px, ${Math.sin(angle) * R}px) translate(-50%, -50%)`;
      p2.style.transform = `translate(${Math.cos(angle + 2.094) * R}px, ${Math.sin(angle + 2.094) * R}px) translate(-50%, -50%)`;
      p3.style.transform = `translate(${Math.cos(angle + 4.188) * R}px, ${Math.sin(angle + 4.188) * R}px) translate(-50%, -50%)`;

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  
  initCursor();
}
