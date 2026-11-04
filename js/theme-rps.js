/**
 * theme-rps.js — Rock, Paper Scissors Page Visual Engine
 * ALL functions check for .theme-rps body class before running.
 * This script must never affect any other page.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('theme-rps')) return;

  /* ── 1. ARENA ATMOSPHERE CANVAS (Embers & Clash Ambiance) ── */
  function initAtmosphereCanvas() {
    let canvas = document.getElementById('rps-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'rps-canvas';
      canvas.style.cssText = 'position:fixed; inset:0; width:100%; height:100%; z-index:0; pointer-events:none;';
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Arena ember motes (crimson, gold, orange)
    const colors = [
      'rgba(230,57,70,',   // Crimson red
      'rgba(255,182,39,',  // Molten gold
      'rgba(255,107,53,',  // Ember orange
      'rgba(0,245,212,'    // Cyan spark
    ];

    const embers = Array.from({ length: 85 }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.5 - 0.4,
        size: Math.random() * 2.8 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.1,
        oscSpeed: Math.random() * 0.04 + 0.01,
        oscOffset: Math.random() * Math.PI * 2
      };
    });

    let tickCount = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tickCount++;

      embers.forEach(function (e) {
        ctx.beginPath();
        ctx.arc(e.x + Math.sin(tickCount * e.oscSpeed + e.oscOffset) * 1.5, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.colorPrefix + e.opacity + ')';
        ctx.shadowColor = e.colorPrefix + '0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();

        e.x += e.vx;
        e.y += e.vy;

        if (e.y < -10) {
          e.y = canvas.height + 10;
          e.x = Math.random() * canvas.width;
        }
        if (e.x < -10) e.x = canvas.width + 10;
        if (e.x > canvas.width + 10) e.x = -10;
      });

      // Reset shadow blur
      ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }

    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /* ── 2. ARENA CLASH FLASH LIGHTING (Similar to UB Lightning) ── */
  function initClashFlash() {
    if (!document.body.classList.contains('theme-rps')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const flash = document.createElement('div');
    flash.id = 'rps-clash-flash';
    flash.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:radial-gradient(circle at 50% 30%, rgba(230,57,70,0.18), transparent 70%)',
      'pointer-events:none',
      'z-index:2',
      'opacity:0',
      'transition:opacity 0.08s ease'
    ].join(';');
    document.body.appendChild(flash);

    function strike() {
      flash.style.opacity = '0.7';
      setTimeout(function () { flash.style.opacity = '0.1'; }, 70);
      setTimeout(function () { flash.style.opacity = '0.9'; }, 130);
      setTimeout(function () { flash.style.opacity = '0'; }, 220);

      setTimeout(strike, 7000 + Math.random() * 8000);
    }

    setTimeout(strike, 3000 + Math.random() * 3000);
  }

  /* ── 3. RPS BITMAP CURSOR ───────────────────────────── */
  function initRPSCursor() {
    // Step 5: Only enable on devices with (hover: hover) and (pointer: fine)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.body.classList.remove('rps-cursor-active');
      return;
    }

    // Clean up any existing cursor instance
    const existing = document.getElementById('rps-custom-cursor');
    if (existing) existing.remove();

    // Hotspot coordinates (calibrated to scaled 1x 56px width)
    const hotspotX = 4.24;
    const hotspotY = 4.78;

    // Single DOM element container
    const cursor = document.createElement('div');
    cursor.id = 'rps-custom-cursor';
    cursor.className = 'rps-custom-cursor theme-cursor-element';
    cursor.setAttribute('aria-hidden', 'true');

    // Artwork image (using 1x/2x responsive srcset)
    const img = document.createElement('img');
    img.className = 'rps-cursor-img';
    img.alt = '';
    img.src = 'public/cursor/rps-cursor.png';
    img.srcset = 'public/cursor/rps-cursor@1x.png 1x, public/cursor/rps-cursor.png 2x';

    // Step 5: Fallback if image fails to load -> restore native cursor
    img.onerror = function () {
      console.warn('RPS cursor image failed to load, falling back to native cursor.');
      cursor.remove();
      document.body.classList.remove('rps-cursor-active');
    };

    img.onload = function () {
      // Activate cursor:none on page root and all elements
      document.body.classList.add('rps-cursor-active');
    };

    cursor.appendChild(img);
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let isVisible = false;
    let rafPending = false;

    // 1:1 Instantaneous position tracking via translate3d with RAF batching
    function updatePosition() {
      cursor.style.transform = `translate3d(${mouseX - hotspotX}px, ${mouseY - hotspotY}px, 0)`;
      rafPending = false;
    }

    function onPointerMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      isVisible = true;
      cursor.classList.add('is-visible');
      cursor.classList.remove('is-hidden');
      cursor.style.opacity = '1';
      cursor.style.visibility = 'visible';

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updatePosition);
      }
    }

    // Window enter/leave fade transitions
    function onMouseEnter() {
      isVisible = true;
      cursor.classList.remove('is-hidden');
      cursor.classList.add('is-visible');
      cursor.style.opacity = '1';
      cursor.style.visibility = 'visible';
    }

    function onMouseLeave(e) {
      if (!e.relatedTarget && !e.toElement) {
        const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
        if (!isFs) {
          cursor.classList.add('is-hidden');
        }
      }
    }

    // Interactive elements selector
    const interactiveSel = [
      'a',
      'button',
      '[role="button"]',
      'input',
      'textarea',
      'select',
      '.reel-dot',
      '.contrib-card',
      '.rps-character-card',
      '.rps-cycle__node',
      '.tech-tag',
      '.tech-stack-strip__item',
      '.rps-gallery__item',
      '.ba-slider__handle',
      '.custom-video-controls',
      '.rps-video-hero',
      '.warp-link'
    ].join(',');

    function onMouseOver(e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSel)) {
        cursor.classList.add('is-hovering');
      }
    }

    function onMouseOut(e) {
      if (e.target && e.target.closest && e.target.closest(interactiveSel)) {
        const related = e.relatedTarget;
        if (!related || !related.closest || !related.closest(interactiveSel)) {
          cursor.classList.remove('is-hovering');
        }
      }
    }

    function onMouseDown() {
      cursor.classList.add('is-active');
    }

    function onMouseUp() {
      cursor.classList.remove('is-active');
    }

    // Attach listeners
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Cleanup when leaving the page (Step 3: Mount & clean up listeners, element, cursor:none)
    function cleanup() {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('rps-cursor-active');
      cursor.remove();
    }

    window.addEventListener('pagehide', cleanup, { once: true });
    window.addEventListener('beforeunload', cleanup, { once: true });
  }

  /* ── 4. EXPANDABLE CASE STUDY CARDS ─────────────────── */
  function initContribCards() {
    const cards = document.querySelectorAll('.contrib-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const wasActive = card.classList.contains('active');
        cards.forEach(function (c) { c.classList.remove('active'); });
        if (!wasActive) card.classList.add('active');
      });
    });
  }

  /* ── 5. RPS 3-ROLE CYCLE PULSE ──────────────────────── */
  function initCycleAnimation() {
    const nodes = document.querySelectorAll('.rps-cycle__node');
    if (!nodes.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = 0;
    setInterval(function () {
      nodes.forEach(function (n) {
        n.style.transform = '';
        n.style.boxShadow = '';
      });
      const node = nodes[current];
      if (node) {
        node.style.transform = 'scale(1.08)';
      }
      current = (current + 1) % nodes.length;
    }, 1800);
  }

  /* ── 6. HERO CHARACTER TITLE WORD TRACKING ─────────── */
  function initHeroCharacterTracking() {
    const hero = document.querySelector('.project-detail__hero');
    if (!hero) return;

    function updatePositions() {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      if (W <= 0 || H <= 0) return;

      // Native resolution of assets/img/RPS.png: 1671 x 941
      const imgW = 1671;
      const imgH = 941;
      const imgAspect = imgW / imgH;
      const containerAspect = W / H;

      let rendW, rendH, offsetX, offsetY;

      if (containerAspect >= imgAspect) {
        // Container is wider than the image: covers full width, crops top/bottom
        rendW = W;
        rendH = W / imgAspect;
        offsetX = 0;
        offsetY = (H - rendH) / 2;
      } else {
        // Container is narrower than the image: covers full height, crops left/right
        rendH = H;
        rendW = H * imgAspect;
        offsetX = (W - rendW) / 2;
        offsetY = 0;
      }

      // Character anchor coordinates (in native image pixels):
      // Rock (Left): stone gladiator upper chest/head (x=410, y=275)
      // Scissors (Center): mohawk striker upper chest/head (x=860, y=390)
      // Paper (Right): parchment strategist upper chest/head (x=1300, y=220)
      const rockX = Math.round(offsetX + (410 / imgW) * rendW);
      const rockY = Math.round(offsetY + (275 / imgH) * rendH);

      const scissorsX = Math.round(offsetX + (860 / imgW) * rendW);
      const scissorsY = Math.round(offsetY + (390 / imgH) * rendH);

      const paperX = Math.round(offsetX + (1300 / imgW) * rendW);
      const paperY = Math.round(offsetY + (220 / imgH) * rendH);

      hero.style.setProperty('--char-rock-x', rockX + 'px');
      hero.style.setProperty('--char-rock-y', rockY + 'px');
      hero.style.setProperty('--char-scissors-x', scissorsX + 'px');
      hero.style.setProperty('--char-scissors-y', scissorsY + 'px');
      hero.style.setProperty('--char-paper-x', paperX + 'px');
      hero.style.setProperty('--char-paper-y', paperY + 'px');
    }

    updatePositions();
    window.addEventListener('resize', updatePositions, { passive: true });

    const bgImg = hero.querySelector('.project-detail__hero-bg img');
    if (bgImg) {
      if (!bgImg.complete) {
        bgImg.addEventListener('load', updatePositions, { once: true });
      }
    }
  }

  /* ── INIT ───────────────────────────────────────────── */
  function init() {
    initAtmosphereCanvas();
    initClashFlash();
    initRPSCursor();
    initContribCards();
    initCycleAnimation();
    initHeroCharacterTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
