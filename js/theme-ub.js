/**
 * theme-ub.js — Unfinished Business Page Visual Engine
 * ALL functions check for .theme-ub body class before running.
 * This script must never affect any other page.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('theme-ub')) return;

  /* ── 1. RAIN CANVAS ──────────────────────────────── */
  function initRain() {
    const canvas = document.getElementById('rain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Raise canvas above background images so rain is visible everywhere
    canvas.style.zIndex       = '5';
    canvas.style.mixBlendMode = 'screen'; // composites naturally over dark images

    const drops = Array.from({ length: 240 }, function () { return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      speed:   9  + Math.random() * 7,
      length:  18 + Math.random() * 28,
      opacity: 0.10 + Math.random() * 0.12   // 10–22% — much more visible
    }; });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(function (drop) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1.5, drop.y + drop.length);
        ctx.strokeStyle = 'rgba(180,230,180,' + drop.opacity + ')';
        ctx.lineWidth = 0.9;
        ctx.stroke();
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', function () {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /* ── 2. LIGHTNING FLASH & PROCEDURAL BOLT ─────────── */
  function initLightning() {
    if (!document.body.classList.contains('theme-ub')) return;

    // Background ambient flash
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed; inset:0; background:white; opacity:0; pointer-events:none; z-index:8; transition:opacity 0.03s;';
    document.body.appendChild(flash);

    // Lightning bolt canvas
    const flexCanvas = document.createElement('canvas');
    flexCanvas.id = 'ub-lightning-canvas';
    flexCanvas.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:7; mix-blend-mode:screen;';
    document.body.appendChild(flexCanvas);

    const ctx = flexCanvas.getContext('2d');

    function resize() {
      flexCanvas.width = window.innerWidth;
      flexCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Generates a jagged line descending downwards
    function createBolt(x, y, targetY, isBranch) {
      const segments = [];
      let cx = x, cy = y;
      while (cy < targetY) {
        let stepY = 15 + Math.random() * 30;
        let stepX = (Math.random() - 0.5) * 60;
        if (isBranch) {
            // Branches tend to spread outwards more aggressively
            stepX = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40);
        }
        let nextX = cx + stepX;
        let nextY = cy + stepY;
        segments.push({ x1: cx, y1: cy, x2: nextX, y2: nextY });
        cx = nextX;
        cy = nextY;
      }
      return segments;
    }

    let activeBolts = [];

    function drawBolts() {
      ctx.clearRect(0, 0, flexCanvas.width, flexCanvas.height);
      if (!activeBolts.length) return;

      let stillAlive = false;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'miter';

      activeBolts.forEach(function(bolt) {
        if (bolt.alpha <= 0) return;
        stillAlive = true;

        ctx.beginPath();
        // Neon cyan/blue theme glow
        ctx.shadowBlur = bolt.isBranch ? 10 : 20;
        ctx.shadowColor = '#00F5D4';
        ctx.strokeStyle = 'rgba(200, 255, 255, ' + bolt.alpha + ')';
        ctx.lineWidth = bolt.width;

        bolt.segments.forEach(function(seg) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();

        // Fade out
        bolt.alpha -= 0.04;
      });

      if (stillAlive) {
        requestAnimationFrame(drawBolts);
      } else {
        activeBolts = [];
        ctx.clearRect(0, 0, flexCanvas.width, flexCanvas.height);
      }
    }

    function shootLightning() {
      let bolts = [];
      // Random start position near the top 80% range
      let startX = flexCanvas.width * 0.1 + Math.random() * (flexCanvas.width * 0.8);
      // Lightning descends between 50% and 100% of screen height
      let targetY = flexCanvas.height * (0.5 + Math.random() * 0.5);

      let main = createBolt(startX, 0, targetY, false);
      bolts.push({ segments: main, width: 2 + Math.random() * 2.5, alpha: 1, isBranch: false });

      // Add branches
      main.forEach(function(seg, i) {
        if (Math.random() < 0.20) { // 20% chance to branch per segment
          let br = createBolt(seg.x1, seg.y1, seg.y1 + 50 + Math.random() * 150, true);
          bolts.push({ segments: br, width: 1 + Math.random() * 1.5, alpha: 0.8, isBranch: true });
        }
      });

      activeBolts = bolts;
      drawBolts();
    }

    function strike() {
      // First strike — ambient flash and actual lightning bolt
      flash.style.opacity = '0.06';
      shootLightning();

      setTimeout(function () { flash.style.opacity = '0'; },   80);
      
      // Second flicker
      setTimeout(function () { 
          flash.style.opacity = '0.03'; 
          // Re-ignite the bolts slightly during the secondary flash
          activeBolts.forEach(function(b) { b.alpha = Math.max(b.alpha, 0.4); });
          if (activeBolts.length) requestAnimationFrame(drawBolts);
      }, 150);
      
      setTimeout(function () { flash.style.opacity = '0'; },   210);
      
      // Optional third micro-flicker for realism
      setTimeout(function () { flash.style.opacity = '0.015'; }, 300);
      setTimeout(function () { flash.style.opacity = '0'; },   340);
      
      // Next strike in 6–14 seconds (averaging ~10s per user request)
      setTimeout(strike, 6000 + Math.random() * 8000);
    }
    
    // First strike hits 3–6 seconds in
    setTimeout(strike, 3000 + Math.random() * 3000);
  }

  /* ── 3. TACTICAL SCOPE CURSOR ────────────────────── */
  function initUBCursor() {
    if (!document.body.classList.contains('theme-ub')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    const ring = document.createElement('div');
    ring.id = 'ub-cursor-ring';
    ring.classList.add('theme-cursor-element');
    ring.style.cssText = [
      'position:fixed',
      'width:48px',
      'height:48px',
      'border:1.5px solid rgba(200,255,0,0.7)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:100000',
      'transition:border-color 0.2s ease, opacity 0.2s ease',
      'animation:reticlePulse 2s ease-in-out infinite',
      'will-change:transform',
      'opacity:0'
    ].join(';');

    const crossH = document.createElement('div');
    crossH.style.cssText = 'position:absolute;top:50%;left:50%;width:14px;height:1.5px;background:#00F5D4;transform:translate(-50%,-50%);transition:background 0.2s;';

    const crossV = document.createElement('div');
    crossV.style.cssText = 'position:absolute;top:50%;left:50%;width:1.5px;height:14px;background:#00F5D4;transform:translate(-50%,-50%);transition:background 0.2s;';

    const centerDot = document.createElement('div');
    centerDot.style.cssText = 'position:absolute;top:50%;left:50%;width:3px;height:3px;background:#00F5D4;border-radius:50%;transform:translate(-50%,-50%);transition:background 0.2s;';

    ring.appendChild(crossH);
    ring.appendChild(crossV);
    ring.appendChild(centerDot);
    document.body.appendChild(ring);

    let idleTimer = null;
    let isIdle = false;

    document.addEventListener('mousemove', function (e) {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
      ring.style.opacity = '1';

      if (isIdle) {
        ring.style.animation = 'reticlePulse 2s ease-in-out infinite';
        isIdle = false;
      }

      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        isIdle = true;
        ring.style.animation = 'reticlePulse 2s ease-in-out infinite, reticleRotate 4s linear infinite';
      }, 3000);
    });

    document.addEventListener('mouseleave', function () {
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      ring.style.opacity = '1';
    });

    function paintRed() {
      ring.style.borderColor = 'rgba(255,60,40,0.9)';
      centerDot.style.background = '#FF3C28';
      crossH.style.background    = '#FF3C28';
      crossV.style.background    = '#FF3C28';
    }

    function paintGreen() {
      ring.style.borderColor = 'rgba(0, 245, 212, 0.7)';
      centerDot.style.background = '#00F5D4';
      crossH.style.background    = '#00F5D4';
      crossV.style.background    = '#00F5D4';
    }

    document.querySelectorAll('a, button, .btn').forEach(function (el) {
      el.addEventListener('mouseenter', paintRed);
      el.addEventListener('mouseleave', paintGreen);
    });
  }

  /* ── 4. BULLET IMPACT CLICK EFFECT ──────────────── */
  function ubClickEffect(e) {
    if (!document.body.classList.contains('theme-ub')) return;

    // Impact flash
    const flash = document.createElement('div');
    flash.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:8px',
      'height:8px',
      'background:white',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:10000',
      'animation:impactFlash 0.12s ease-out forwards'
    ].join(';');
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 130);

    // Crack lines at 4 diagonal angles
    [45, 135, 225, 315].forEach(function (angle) {
      const crack = document.createElement('div');
      crack.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:' + e.clientY + 'px',
        'width:0px',
        'height:1px',
        'background:#00F5D4',
        'transform-origin:left center',
        'transform:translate(0,-50%) rotate(' + angle + 'deg)',
        'pointer-events:none',
        'z-index:9999',
        'animation:crackShoot 0.4s ease-out forwards'
      ].join(';');
      document.body.appendChild(crack);
      setTimeout(function () { crack.remove(); }, 420);
    });

    // Red shockwave ring
    const wave = document.createElement('div');
    wave.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:0',
      'height:0',
      'border:2px solid rgba(255,60,40,0.8)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:9998',
      'animation:ubShockwave 0.5s ease-out forwards'
    ].join(';');
    document.body.appendChild(wave);
    setTimeout(function () { wave.remove(); }, 520);
  }

  /* ── 5. HERO: ACTIVE OPERATION BADGE ─────────────── */
  function initActiveOpBadge() {
    if (!document.body.classList.contains('theme-ub')) return;

    const heroContent = document.querySelector('.theme-ub .project-detail__hero-content');
    if (!heroContent) return;

    const badge = document.createElement('div');
    badge.className = 'ub-active-op';
    badge.innerHTML = '<div class="ub-active-op__dot"></div><span>ACTIVE OPERATION</span>';

    // Insert before the first child (breadcrumb)
    heroContent.insertBefore(badge, heroContent.firstChild);
  }

  /* ── 6. HERO: CLASSIFIED STAMP ───────────────────── */
  function initClassifiedStamp() {
    if (!document.body.classList.contains('theme-ub')) return;

    const hero = document.querySelector('.theme-ub .project-detail__hero');
    if (!hero) return;

    const stamp = document.createElement('div');
    stamp.className = 'hero-classified-stamp';
    stamp.setAttribute('aria-hidden', 'true');
    hero.appendChild(stamp);
  }

  /* ── 7. DISABLE GLOBAL RIPPLE CLICK ON UB PAGE ────── */
  function disableGlobalClickEffects() {
    // The global ripple.js adds click listeners — we override by stopping
    // the UB click handler after ensuring it runs first (capture phase).
    document.addEventListener('click', function (e) {
      // We allow the event to propagate but our ubClickEffect
      // already fired via its own listener. Nothing else needed.
    }, true);
  }

  /* ── INIT ─────────────────────────────────────────── */
  function init() {
    initRain();
    initLightning();
    initUBCursor();
    initActiveOpBadge();
    initClassifiedStamp();
    document.addEventListener('click', ubClickEffect);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
