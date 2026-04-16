/**
 * cursor.js — Custom neon crosshair cursor with trails and reactive states
 */

(function () {
  'use strict';

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.querySelector('.cursor__dot');
  const ring = document.querySelector('.cursor__ring');

  // Skip if we are on a themed project page which handles its own cursor
  const themes = ['theme-ub', 'theme-ln', 'theme-uu', 'theme-yami', 'theme-nv'];
  const hasTheme = themes.some(t => document.body.classList.contains(t));
  if (hasTheme) {
    if (dot)  dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
    return;
  }

  if (!dot || !ring) return;

  // Upgrade dot and ring styles
  dot.style.width = '8px';
  dot.style.height = '8px';
  ring.style.boxShadow = '0 0 12px rgba(123,97,255,0.6), 0 0 24px rgba(123,97,255,0.2)';

  // Create 3 ghost rings dynamically
  const ghosts = [];
  const trailColors = ['rgba(123,97,255,0.5)', 'rgba(0,245,212,0.3)', 'rgba(255,45,107,0.15)'];
  const trailSizes = ['36px', '44px', '56px'];
  const trailDelays = ['60ms', '130ms', '220ms'];
  const lagFactors = [0.08, 0.05, 0.03]; 
  const opacities = [0.5, 0.3, 0.15];

  for (let i = 0; i < 3; i++) {
    const el = document.createElement('div');
    el.className = 'cursor__ghost';
    el.classList.add('theme-cursor-element');
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:9997;
      width:${trailSizes[i]}; height:${trailSizes[i]}; 
      border-radius:50%; border:1px solid ${trailColors[i]};
      transform:translate(-50%,-50%); transition:left ${trailDelays[i]} linear, top ${trailDelays[i]} linear;
      opacity:0;
    `;
    document.body.appendChild(el);
    ghosts.push({
      el: el,
      x: 0, y: 0,
      lerp: lagFactors[i],
      baseOpacity: opacities[i]
    });
  }

  // Ring follows mouse with lerp lag
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  const LERP = 0.16;  // faster main ring

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tick() {
    // Dot snaps to exact cursor position
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';

    // Main Ring lerps toward cursor
    ringX = lerp(ringX, mouseX, LERP);
    ringY = lerp(ringY, mouseY, LERP);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // Ghosts lerp toward cursor slower
    ghosts.forEach(g => {
        g.x = lerp(g.x, mouseX, g.lerp);
        g.y = lerp(g.y, mouseY, g.lerp);
        g.el.style.left = g.x + 'px';
        g.el.style.top = g.y + 'px';
    });

    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Start raf on first move
    if (!rafId) {
      ringX = mouseX; ringY = mouseY;
      ghosts.forEach(g => { g.x = mouseX; g.y = mouseY; });
      tick();
      // Show cursor after first move
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      ghosts.forEach(g => { g.el.style.opacity = g.baseOpacity; });
    }
  });

  // Start as invisible until first mouse move
  dot.style.opacity  = '0';
  ring.style.opacity = '0';

  // Hover state on interactive elements
  const interactiveSelector = 'a, button, [role="button"], input, textarea, label, .btn, .nav__link, .case-link, .social-link, .nav__hamburger, .nav__mobile-link, .project-panel__media, .skill-card';
  const cyanSelector = '.btn--secondary, .tag, .case-link, [data-hover="cyan"]';
  const magentaSelector = '.award, [data-hover="magenta"]';

  document.addEventListener('mouseover', function (e) {
    const target = e.target.closest(interactiveSelector) || e.target.closest(magentaSelector);
    if (!target) return;
    
    // Clear old classes
    ring.className = 'cursor__ring';
    
    // Determine color state
    if (target.closest(magentaSelector)) {
        ring.classList.add('cursor--hover-magenta');
    } else if (target.closest(cyanSelector)) {
        ring.classList.add('cursor--hover-cyan');
    } else {
        ring.classList.add('cursor--hover-violet');
    }

    dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    
    // Assign ghost colors
    const activeColorStr = window.getComputedStyle(ring).borderColor;
    ghosts.forEach(g => {
        g.el.style.borderColor = activeColorStr;
        g.el.style.transform = 'translate(-50%, -50%) scale(1.3)';
    });
  });

  document.addEventListener('mouseout', function (e) {
    const target = e.target.closest(interactiveSelector) || e.target.closest(magentaSelector);
    if (!target) return;
    
    ring.className = 'cursor__ring';
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
    ghosts.forEach(g => {
        g.el.style.borderColor = 'transparent';
        g.el.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // Click pulse
  document.addEventListener('mousedown', function () {
    dot.style.transform = 'translate(-50%, -50%) scale(0.7)';
    ring.style.transform = 'translate(-50%, -50%) scale(0.85)';
    ghosts.forEach(g => { g.el.style.transform = 'translate(-50%, -50%) scale(0.6)'; });
  });

  document.addEventListener('mouseup', function () {
    dot.style.transform  = 'translate(-50%, -50%) scale(1.2)';
    ring.style.transform = 'translate(-50%, -50%) scale(1.1)';
    const ringClassCheck = ring.className.includes('hover') ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)';
    setTimeout(function () {
      dot.style.transform  = ringClassCheck;
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ghosts.forEach(g => { g.el.style.transform = ring.className.includes('hover') ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%) scale(1)'; });
    }, 150);
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    ghosts.forEach(g => { g.el.style.opacity = '0'; });
  });

  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
    ghosts.forEach(g => { g.el.style.opacity = g.baseOpacity; });
  });

  // Cursor Click Explosion - Target Lock + Shockwave
  document.addEventListener('click', function(e) {
    // Part 1 — Sharp corner brackets (target lock HUD)
    const size = 28;
    const corners = [
      { top: -size, left: -size, border: 'top left' },
      { top: -size, left: size, border: 'top right' },
      { top: size, left: -size, border: 'bottom left' },
      { top: size, left: size, border: 'bottom right' }
    ];

    corners.forEach(function(c) {
      const bracket = document.createElement('div');
      const borderTop = c.border.includes('top') ? '2px solid #00F5D4' : 'none';
      const borderBottom = c.border.includes('bottom') ? '2px solid #00F5D4' : 'none';
      const borderLeft = c.border.includes('left') ? '2px solid #00F5D4' : 'none';
      const borderRight = c.border.includes('right') ? '2px solid #00F5D4' : 'none';

      bracket.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        left: ${e.clientX + c.left}px;
        top: ${e.clientY + c.top}px;
        border-top: ${borderTop};
        border-bottom: ${borderBottom};
        border-left: ${borderLeft};
        border-right: ${borderRight};
        pointer-events: none;
        z-index: 9999;
        animation: bracketSnap 0.5s cubic-bezier(0.2,0.8,0.2,1) forwards;
      `;
      document.body.appendChild(bracket);
      setTimeout(() => bracket.remove(), 520);
    });

    // Part 2 — Sharp expanding square ring (not circle)
    const ring = document.createElement('div');
    ring.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 0px;
      height: 0px;
      border: 1.5px solid rgba(123,97,255,0.9);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%) rotate(45deg);
      animation: squareShock 0.55s cubic-bezier(0.2,0.8,0.2,1) forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 570);

    // Part 3 — Quick center flash dot
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 6px;
      height: 6px;
      background: #FF2D6B;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10000;
      animation: centerFlash 0.3s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 320);
  });

})();
