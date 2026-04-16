/**
 * selection.js — Cinematic Text Selection
 */

let isDragging = false;
let scanLine = null;

document.addEventListener('mousedown', function(e) {
  if (e.button !== 0) return;
  isDragging = true;

  if (scanLine) {
    scanLine.remove();
    scanLine = null;
  }

  scanLine = document.createElement('div');
  let lineColor = 'linear-gradient(90deg, transparent, rgba(0,245,212,0.6), rgba(123,97,255,0.8), rgba(0,245,212,0.6), transparent)';
  if (document.body.classList.contains('theme-ub')) {
    lineColor = 'linear-gradient(90deg, transparent, rgba(0,245,212,0.5), rgba(255,60,40,0.8), rgba(0,245,212,0.5), transparent)';
  } else if (document.body.classList.contains('theme-ln')) {
    lineColor = 'linear-gradient(90deg, transparent, rgba(255,184,48,0.5), rgba(255,78,140,0.8), rgba(255,184,48,0.5), transparent)';
  } else if (document.body.classList.contains('theme-uu')) {
    lineColor = 'linear-gradient(90deg, transparent, rgba(80,255,60,0.5), rgba(255,26,26,0.8), rgba(80,255,60,0.5), transparent)';
  } else if (document.body.classList.contains('theme-yami')) {
    lineColor = 'linear-gradient(90deg, transparent, rgba(192,0,26,0.3), rgba(232,224,208,0.5), rgba(192,0,26,0.3), transparent)';
  } else if (document.body.classList.contains('theme-nv')) {
    lineColor = 'linear-gradient(90deg, transparent, rgba(74,158,255,0.7), rgba(255,45,120,0.9), rgba(74,158,255,0.7), transparent)';
  }

  scanLine.style.cssText = `
    position: fixed;
    left: 0;
    top: ${e.clientY}px;
    width: 100%;
    height: 1px;
    background: ${lineColor};
    pointer-events: none;
    z-index: 9997;
    opacity: 0;
    transition: opacity 0.15s ease;
  `;
  document.body.appendChild(scanLine);
  setTimeout(() => { if (scanLine) scanLine.style.opacity = '1'; }, 10);
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging || !scanLine) return;
  scanLine.style.top = e.clientY + 'px';
});

document.addEventListener('mouseup', function(e) {
  isDragging = false;
  if (scanLine) {
    const currentLine = scanLine;
    scanLine = null;
    currentLine.style.opacity = '0';
    setTimeout(() => { currentLine.remove(); }, 200);
  }

  setTimeout(function() {
    const selection = window.getSelection();
    if (!selection) return;
    const selected = selection.toString().trim();
    if (selected.length > 3) {
      // Corner brackets at selection release point
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        font-family: ${document.body.classList.contains('theme-yami') ? 'serif' : "'JetBrains Mono', monospace"};
        font-size: ${document.body.classList.contains('theme-yami') ? '18px' : '11px'};
        color: ${document.body.classList.contains('theme-ln') ? '#FFB830' : document.body.classList.contains('theme-uu') ? '#50FF3C' : document.body.classList.contains('theme-yami') ? 'rgba(192,0,26,0.8)' : document.body.classList.contains('theme-nv') ? '#4A9EFF' : '#00F5D4'};
        letter-spacing: ${document.body.classList.contains('theme-yami') ? '0.05em' : '0.15em'};
        white-space: nowrap;
        animation: selectionTag 1.8s ease forwards;
      `;
      let tag = '[ SELECTED ]';
      if (document.body.classList.contains('theme-ub'))   tag = '[ DATA BREACH ]';
      if (document.body.classList.contains('theme-ln'))   tag = '[ SACRED BOND ]';
      if (document.body.classList.contains('theme-uu'))   tag = '[ INFECTED ]';
      if (document.body.classList.contains('theme-yami')) tag = '闇';
      if (document.body.classList.contains('theme-nv'))  tag = '[ DETECTED ]';
      flash.textContent = tag;
      document.body.appendChild(flash);
      if (typeof scrambleText === 'function') {
        scrambleText(flash);
      }
      setTimeout(() => flash.remove(), 1900);

      // Thin border box around release point
      const box = document.createElement('div');
      box.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0px;
        height: 0px;
        border: 1px solid ${document.body.classList.contains('theme-ln') ? 'rgba(255,184,48,0.7)' : document.body.classList.contains('theme-uu') ? 'rgba(80,255,60,0.7)' : document.body.classList.contains('theme-yami') ? 'rgba(192,0,26,0.4)' : document.body.classList.contains('theme-nv') ? 'rgba(74,158,255,0.7)' : 'rgba(0,245,212,0.7)'};
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9998;
        animation: selectionBox 0.6s cubic-bezier(0.2,0.8,0.2,1) forwards;
      `;
      document.body.appendChild(box);
      setTimeout(() => box.remove(), 650);
    }
  }, 10);
});
