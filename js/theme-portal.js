/**
 * theme-portal.js — Homepage Project World Preview System v2
 *
 * On mouseenter of a project card:
 *   1. Hide global cursor dots
 *   2. Spawn the project's ACTUAL custom cursor (exact replica from theme JS)
 *   3. Apply data-active-theme to body for color changes
 *
 * On mouseleave:
 *   1. Destroy the custom cursor
 *   2. Restore global cursor
 *   3. Remove data-active-theme
 *
 * Guard: only runs on the homepage (no body theme class present).
 */

(function () {
  'use strict';

  // Only run on the homepage — project pages handle their own cursor & theme
  var projectThemes = ['theme-ub', 'theme-ln', 'theme-uu', 'theme-yami', 'theme-nv'];
  var onProjectPage = projectThemes.some(function (t) {
    return document.body.classList.contains(t);
  });
  if (onProjectPage) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  var cards = document.querySelectorAll('[data-project-theme]');
  if (!cards.length) return;

  // Inject CSS hide rule (idempotent — only once per page)
  if (!document.getElementById('portal-cursor-hide-rule')) {
    var portalStyle = document.createElement('style');
    portalStyle.id = 'portal-cursor-hide-rule';
    portalStyle.textContent = 'body.hide-native-cursor .theme-cursor-element { opacity: 0 !important; }';
    document.head.appendChild(portalStyle);
  }

  var activeCursorEl = null;    // the currently mounted custom cursor
  var leaveTimeout = null;

  // ── CURSOR FACTORIES ───────────────────────────────────────────
  // Each factory returns { el, move(x,y), destroy() }

  /* ── UB: Tactical Scope reticle ────────────────────────────── */
  function createUBCursor() {
    var ring = document.createElement('div');
    ring.setAttribute('data-portal-cursor', 'ub');
    ring.style.cssText = [
      'position:fixed',
      'width:48px',
      'height:48px',
      'border:1.5px solid rgba(0,245,212,0.7)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:100000',
      'animation:portalReticlePulse 2s ease-in-out infinite',
      'will-change:left,top',
      'opacity:0',
      'transition:opacity 0.15s ease'
    ].join(';');

    var crossH = document.createElement('div');
    crossH.style.cssText = 'position:absolute;top:50%;left:50%;width:14px;height:1.5px;background:#00F5D4;transform:translate(-50%,-50%);';
    var crossV = document.createElement('div');
    crossV.style.cssText = 'position:absolute;top:50%;left:50%;width:1.5px;height:14px;background:#00F5D4;transform:translate(-50%,-50%);';
    var dot = document.createElement('div');
    dot.style.cssText = 'position:absolute;top:50%;left:50%;width:3px;height:3px;background:#00F5D4;border-radius:50%;transform:translate(-50%,-50%);';

    ring.appendChild(crossH);
    ring.appendChild(crossV);
    ring.appendChild(dot);
    document.body.appendChild(ring);

    return {
      el: ring,
      move: function (x, y) {
        ring.style.left    = x + 'px';
        ring.style.top     = y + 'px';
        ring.style.opacity = '1';
      },
      destroy: function () { ring.remove(); }
    };
  }

  /* ── LN: Lotus Mandala ─────────────────────────────────────── */
  function createLNCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-portal-cursor', 'ln');
    cursor.style.cssText = [
      'position:fixed',
      'width:44px',
      'height:44px',
      'pointer-events:none',
      'z-index:100000',
      'transform:translate(-50%,-50%)',
      'will-change:left,top',
      'opacity:0',
      'transition:opacity 0.15s ease'
    ].join(';');

    cursor.innerHTML = [
      '<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">',
        '<circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,184,48,0.4)" stroke-width="0.8"/>',
        '<circle cx="22" cy="22" r="14" fill="none" stroke="rgba(255,184,48,0.2)" stroke-width="0.6" stroke-dasharray="3 4"/>',
        '<circle id="pc-soul-leo"  r="2.5" fill="#FFB830" style="filter:drop-shadow(0 0 4px #FFB830);"/>',
        '<circle id="pc-soul-nora" r="2.5" fill="#FF4E8C" style="filter:drop-shadow(0 0 4px #FF4E8C);"/>',
        '<line x1="22" y1="2"  x2="22" y2="8"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="22" y1="36" x2="22" y2="42" stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="2"  y1="22" x2="8"  y2="22"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="36" y1="22" x2="42" y2="22"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<circle cx="22" cy="22" r="1.5" fill="white" style="filter:drop-shadow(0 0 6px white);"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(cursor);

    var svg  = cursor.querySelector('svg');
    var leo  = cursor.querySelector('#pc-soul-leo');
    var nora = cursor.querySelector('#pc-soul-nora');
    var angle = 0;
    var alive = true;
    var raf = null;

    function animate() {
      if (!alive) return;
      angle += 0.3;
      svg.style.transform = 'rotate(' + angle + 'deg)';
      var t = Date.now() * 0.003;
      var orbit = 12;
      leo.setAttribute('cx',  22 + Math.cos(t) * orbit);
      leo.setAttribute('cy',  22 + Math.sin(t) * orbit);
      nora.setAttribute('cx', 22 + Math.cos(t + Math.PI) * orbit);
      nora.setAttribute('cy', 22 + Math.sin(t + Math.PI) * orbit);
      raf = requestAnimationFrame(animate);
    }
    animate();

    return {
      el: cursor,
      move: function (x, y) {
        cursor.style.left    = x + 'px';
        cursor.style.top     = y + 'px';
        cursor.style.opacity = '1';
      },
      destroy: function () {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        cursor.remove();
      }
    };
  }

  /* ── UU: Biohazard Crosshair ───────────────────────────────── */
  function createUUCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-portal-cursor', 'uu');
    cursor.style.cssText = [
      'position:fixed',
      'width:46px',
      'height:46px',
      'pointer-events:none',
      'z-index:100000',
      'transform:translate(-50%,-50%)',
      'will-change:left,top',
      'opacity:0',
      'transition:opacity 0.15s ease'
    ].join(';');

    cursor.innerHTML = [
      '<svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">',
        '<circle cx="23" cy="23" r="20" fill="none" stroke="rgba(80,255,60,0.5)" stroke-width="1" stroke-dasharray="6 3"/>',
        '<line x1="23" y1="0"  x2="23" y2="9"  stroke="rgba(80,255,60,0.9)" stroke-width="1.5"/>',
        '<line x1="23" y1="37" x2="23" y2="46" stroke="rgba(80,255,60,0.9)" stroke-width="1.5"/>',
        '<line x1="0"  y1="23" x2="9"  y2="23" stroke="rgba(80,255,60,0.9)" stroke-width="1.5"/>',
        '<line x1="37" y1="23" x2="46" y2="23" stroke="rgba(80,255,60,0.9)" stroke-width="1.5"/>',
        '<circle cx="23" cy="23" r="3" fill="none" stroke="rgba(255,26,26,0.9)" stroke-width="1.5"/>',
        '<circle cx="23" cy="23" r="1" fill="#FF1A1A"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(cursor);

    // Micro-glitch
    var glitchInterval = setInterval(function () {
      if (Math.random() > 0.85) {
        var offset = (Math.random() - 0.5) * 6;
        cursor.style.transform = 'translate(calc(-50% + ' + offset + 'px), -50%)';
        setTimeout(function () { cursor.style.transform = 'translate(-50%,-50%)'; }, 60);
      }
    }, 400);

    return {
      el: cursor,
      move: function (x, y) {
        cursor.style.left    = x + 'px';
        cursor.style.top     = y + 'px';
        cursor.style.opacity = '1';
      },
      destroy: function () {
        clearInterval(glitchInterval);
        cursor.remove();
      }
    };
  }

  /* ── Yami: Spirit Eye ──────────────────────────────────────── */
  function createYamiCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-portal-cursor', 'yami');
    cursor.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:100000',
      'transform:translate(-50%,-50%)',
      'mix-blend-mode:difference',
      'opacity:0',
      'transition:transform 0.08s ease, opacity 0.15s ease'
    ].join(';');

    cursor.innerHTML = [
      '<svg width="40" height="24" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">',
        '<path d="M2 12 Q20 2 38 12 Q20 22 2 12 Z" fill="none" stroke="rgba(232,224,208,0.7)" stroke-width="0.8"/>',
        '<circle cx="20" cy="12" r="5" fill="none" stroke="rgba(232,224,208,0.6)" stroke-width="0.8"/>',
        '<circle cx="20" cy="12" r="2.5" fill="rgba(192,0,26,0.9)"/>',
        '<circle cx="20" cy="12" r="1" fill="rgba(232,224,208,0.9)"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(cursor);

    var alive = true;

    function scheduleBlink() {
      if (!alive) return;
      var delay = 3000 + Math.random() * 5000;
      setTimeout(function () {
        if (!alive) return;
        cursor.style.transform = 'translate(-50%,-50%) scaleY(0.05)';
        setTimeout(function () {
          if (!alive) return;
          cursor.style.transform = 'translate(-50%,-50%) scaleY(1)';
          scheduleBlink();
        }, 120);
      }, delay);
    }
    scheduleBlink();

    return {
      el: cursor,
      move: function (x, y) {
        cursor.style.left    = x + 'px';
        cursor.style.top     = y + 'px';
        cursor.style.opacity = '1';
      },
      destroy: function () {
        alive = false;
        cursor.remove();
      }
    };
  }

  /* ── NV: Corrupted Crosshair — dual rotating rings ─────────── */
  function createNVCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-portal-cursor', 'nv');
    cursor.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:100000',
      'opacity:0',
      'will-change:left,top',
      'transition:opacity 0.15s ease'
    ].join(';');

    cursor.innerHTML = [
      '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;transform-origin:center;">',
        '<circle id="pc-nv-outer" cx="32" cy="32" r="28" fill="none" stroke="rgba(74,158,255,0.7)" stroke-width="1" stroke-dasharray="5 4" style="transform-origin:32px 32px;"/>',
        '<circle id="pc-nv-inner" cx="32" cy="32" r="18" fill="none" stroke="rgba(255,45,120,0.6)" stroke-width="0.8" stroke-dasharray="3 5" style="transform-origin:32px 32px;"/>',
        '<line x1="32" y1="0"  x2="32" y2="10" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<line x1="32" y1="54" x2="32" y2="64" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<line x1="0"  y1="32" x2="10" y2="32" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<line x1="54" y1="32" x2="64" y2="32" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<path d="M20 14 L14 14 L14 20" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<path d="M44 14 L50 14 L50 20" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<path d="M20 50 L14 50 L14 44" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<path d="M44 50 L50 50 L50 44" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<rect x="29" y="29" width="6" height="6" fill="none" stroke="rgba(255,45,120,0.9)" stroke-width="1.2" transform="rotate(45 32 32)"/>',
        '<circle cx="32" cy="32" r="2" fill="#FF2D78" style="filter:drop-shadow(0 0 6px #FF2D78);"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(cursor);

    var outerRing  = cursor.querySelector('#pc-nv-outer');
    var innerRing  = cursor.querySelector('#pc-nv-inner');
    var outerAngle = 0;
    var innerAngle = 0;
    var alive = true;
    var raf = null;

    function rotateCursor() {
      if (!alive) return;
      outerAngle += 0.35;
      innerAngle -= 0.6;
      outerRing.style.transform = 'rotate(' + outerAngle + 'deg)';
      innerRing.style.transform = 'rotate(' + innerAngle + 'deg)';
      raf = requestAnimationFrame(rotateCursor);
    }
    rotateCursor();

    // Micro-glitch
    var glitchInterval = setInterval(function () {
      if (Math.random() > 0.85) {
        var dx = (Math.random() - 0.5) * 7;
        cursor.style.transform = 'translate(-50%,-50%) translate(' + dx + 'px,0)';
        setTimeout(function () { cursor.style.transform = 'translate(-50%,-50%)'; }, 55);
      }
    }, 300);

    return {
      el: cursor,
      move: function (x, y) {
        cursor.style.left      = x + 'px';
        cursor.style.top       = y + 'px';
        cursor.style.transform = 'translate(-50%,-50%)';
        cursor.style.opacity   = '1';
      },
      destroy: function () {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        clearInterval(glitchInterval);
        cursor.remove();
      }
    };
  }

  // ── CURSOR MAP ─────────────────────────────────────────────────
  var cursorFactories = {
    'ub':   createUBCursor,
    'ln':   createLNCursor,
    'uu':   createUUCursor,
    'yami': createYamiCursor,
    'nv':   createNVCursor
  };

  // ── GLOBAL CURSOR HIDE/RESTORE ────────────────────────────────
  // Uses a CSS class + !important to defeat the cursor.js RAF loop
  function hideGlobalCursor() {
    document.body.style.cursor = 'none';
    document.body.classList.add('hide-native-cursor');
  }

  function restoreGlobalCursor() {
    document.body.style.cursor = '';
    document.body.classList.remove('hide-native-cursor');
  }

  // ── MOUSE MOVE HANDLER (shared, updated per-card) ─────────────
  var currentMoveHandler = null;

  function destroyActiveCursor() {
    if (activeCursorEl) {
      activeCursorEl.destroy();
      activeCursorEl = null;
    }
    if (currentMoveHandler) {
      document.removeEventListener('mousemove', currentMoveHandler);
      currentMoveHandler = null;
    }
  }

  // ── CARD LISTENERS ────────────────────────────────────────────
  cards.forEach(function (card) {

    card.addEventListener('mouseenter', function () {
      clearTimeout(leaveTimeout);

      var theme = card.dataset.projectTheme;

      // Apply color theme
      document.body.setAttribute('data-active-theme', theme);

      // Tear down previous cursor if switching between cards
      destroyActiveCursor();

      // Spawn the new cursor
      var factory = cursorFactories[theme];
      if (!factory) return;

      hideGlobalCursor();
      activeCursorEl = factory();

      // Attach move handler
      currentMoveHandler = function (e) {
        if (activeCursorEl) activeCursorEl.move(e.clientX, e.clientY);
      };
      document.addEventListener('mousemove', currentMoveHandler);
    });

    card.addEventListener('mouseleave', function () {
      leaveTimeout = setTimeout(function () {
        document.body.removeAttribute('data-active-theme');
        destroyActiveCursor();
        restoreGlobalCursor();
      }, 80);
    });

    // Keyboard focus support
    card.addEventListener('focusin', function () {
      clearTimeout(leaveTimeout);
      document.body.setAttribute('data-active-theme', card.dataset.projectTheme);
    });

    card.addEventListener('focusout', function (e) {
      if (!card.contains(e.relatedTarget)) {
        leaveTimeout = setTimeout(function () {
          document.body.removeAttribute('data-active-theme');
          destroyActiveCursor();
          restoreGlobalCursor();
        }, 80);
      }
    });
  });

})();
