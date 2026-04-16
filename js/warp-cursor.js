/**
 * warp-cursor.js — Project Warp Navigation Cursor Preview
 *
 * On project detail pages, hovering a .warp-link at the bottom
 * of the page spawns the *destination* project's custom cursor.
 *
 * Cursor factories are self-contained here. The current page's
 * own theme cursor is hidden during hover and restored on leave.
 *
 * Filename → theme key mapping:
 *   unfinished-business.html → ub
 *   leo-and-nora.html        → ln
 *   undead-unleashed.html    → uu
 *   yami.html                → yami
 *   neon-veil.html           → nv
 */

(function () {
  'use strict';

  if (window.matchMedia('(pointer: coarse)').matches) return;

  var warpLinks = document.querySelectorAll('.warp-link');
  if (!warpLinks.length) return;

  // ── FILENAME → THEME KEY MAP ──────────────────────────────────
  var hrefToTheme = {
    'unfinished-business.html': 'ub',
    'leo-and-nora.html':        'ln',
    'undead-unleashed.html':    'uu',
    'yami.html':                'yami',
    'neon-veil.html':           'nv'
  };


  // ── CURSOR FACTORIES ──────────────────────────────────────────

  function createUBCursor() {
    var ring = document.createElement('div');
    ring.setAttribute('data-warp-cursor', 'ub');
    ring.style.cssText = [
      'position:fixed',
      'width:48px',
      'height:48px',
      'border:1.5px solid rgba(0,245,212,0.7)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:200000',
      'animation:warpReticlePulse 2s ease-in-out infinite',
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
      move: function (x, y) { ring.style.left = x + 'px'; ring.style.top = y + 'px'; ring.style.opacity = '1'; },
      destroy: function () { ring.remove(); }
    };
  }

  function createLNCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-warp-cursor', 'ln');
    cursor.style.cssText = [
      'position:fixed', 'width:44px', 'height:44px', 'pointer-events:none',
      'z-index:200000', 'transform:translate(-50%,-50%)',
      'will-change:left,top', 'opacity:0', 'transition:opacity 0.15s ease'
    ].join(';');
    cursor.innerHTML = [
      '<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">',
        '<circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,184,48,0.4)" stroke-width="0.8"/>',
        '<circle cx="22" cy="22" r="14" fill="none" stroke="rgba(255,184,48,0.2)" stroke-width="0.6" stroke-dasharray="3 4"/>',
        '<circle id="wc-soul-leo"  r="2.5" fill="#FFB830" style="filter:drop-shadow(0 0 4px #FFB830);"/>',
        '<circle id="wc-soul-nora" r="2.5" fill="#FF4E8C" style="filter:drop-shadow(0 0 4px #FF4E8C);"/>',
        '<line x1="22" y1="2"  x2="22" y2="8"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="22" y1="36" x2="22" y2="42" stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="2"  y1="22" x2="8"  y2="22"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="36" y1="22" x2="42" y2="22"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<circle cx="22" cy="22" r="1.5" fill="white" style="filter:drop-shadow(0 0 6px white);"/>',
      '</svg>'
    ].join('');
    document.body.appendChild(cursor);
    var svg   = cursor.querySelector('svg');
    var leo   = cursor.querySelector('#wc-soul-leo');
    var nora  = cursor.querySelector('#wc-soul-nora');
    var angle = 0;
    var alive = true;
    var raf   = null;
    function animate() {
      if (!alive) return;
      angle += 0.3;
      svg.style.transform = 'rotate(' + angle + 'deg)';
      var t = Date.now() * 0.003;
      leo.setAttribute('cx',  22 + Math.cos(t) * 12);
      leo.setAttribute('cy',  22 + Math.sin(t) * 12);
      nora.setAttribute('cx', 22 + Math.cos(t + Math.PI) * 12);
      nora.setAttribute('cy', 22 + Math.sin(t + Math.PI) * 12);
      raf = requestAnimationFrame(animate);
    }
    animate();
    return {
      move: function (x, y) { cursor.style.left = x + 'px'; cursor.style.top = y + 'px'; cursor.style.opacity = '1'; },
      destroy: function () { alive = false; if (raf) cancelAnimationFrame(raf); cursor.remove(); }
    };
  }

  function createUUCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-warp-cursor', 'uu');
    cursor.style.cssText = [
      'position:fixed', 'width:46px', 'height:46px', 'pointer-events:none',
      'z-index:200000', 'transform:translate(-50%,-50%)',
      'will-change:left,top', 'opacity:0', 'transition:opacity 0.15s ease'
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
    var glitch = setInterval(function () {
      if (Math.random() > 0.85) {
        var o = (Math.random() - 0.5) * 6;
        cursor.style.transform = 'translate(calc(-50% + ' + o + 'px),-50%)';
        setTimeout(function () { cursor.style.transform = 'translate(-50%,-50%)'; }, 60);
      }
    }, 400);
    return {
      move: function (x, y) { cursor.style.left = x + 'px'; cursor.style.top = y + 'px'; cursor.style.opacity = '1'; },
      destroy: function () { clearInterval(glitch); cursor.remove(); }
    };
  }

  function createYamiCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-warp-cursor', 'yami');
    cursor.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:200000',
      'transform:translate(-50%,-50%)', 'mix-blend-mode:difference',
      'opacity:0', 'transition:transform 0.08s ease, opacity 0.15s ease'
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
    function blink() {
      if (!alive) return;
      setTimeout(function () {
        if (!alive) return;
        cursor.style.transform = 'translate(-50%,-50%) scaleY(0.05)';
        setTimeout(function () {
          if (!alive) return;
          cursor.style.transform = 'translate(-50%,-50%) scaleY(1)';
          blink();
        }, 120);
      }, 3000 + Math.random() * 5000);
    }
    blink();
    return {
      move: function (x, y) { cursor.style.left = x + 'px'; cursor.style.top = y + 'px'; cursor.style.opacity = '1'; },
      destroy: function () { alive = false; cursor.remove(); }
    };
  }

  function createNVCursor() {
    var cursor = document.createElement('div');
    cursor.setAttribute('data-warp-cursor', 'nv');
    cursor.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:200000',
      'opacity:0', 'will-change:left,top', 'transition:opacity 0.15s ease'
    ].join(';');
    cursor.innerHTML = [
      '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;transform-origin:center;">',
        '<circle id="wc-nv-outer" cx="32" cy="32" r="28" fill="none" stroke="rgba(74,158,255,0.7)" stroke-width="1" stroke-dasharray="5 4" style="transform-origin:32px 32px;"/>',
        '<circle id="wc-nv-inner" cx="32" cy="32" r="18" fill="none" stroke="rgba(255,45,120,0.6)" stroke-width="0.8" stroke-dasharray="3 5" style="transform-origin:32px 32px;"/>',
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
    var outer = cursor.querySelector('#wc-nv-outer');
    var inner = cursor.querySelector('#wc-nv-inner');
    var oa = 0, ia = 0, alive = true, raf = null;
    function rotate() {
      if (!alive) return;
      oa += 0.35; ia -= 0.6;
      outer.style.transform = 'rotate(' + oa + 'deg)';
      inner.style.transform = 'rotate(' + ia + 'deg)';
      raf = requestAnimationFrame(rotate);
    }
    rotate();
    var glitch = setInterval(function () {
      if (Math.random() > 0.85) {
        var dx = (Math.random() - 0.5) * 7;
        cursor.style.transform = 'translate(-50%,-50%) translate(' + dx + 'px,0)';
        setTimeout(function () { cursor.style.transform = 'translate(-50%,-50%)'; }, 55);
      }
    }, 300);
    return {
      move: function (x, y) {
        cursor.style.left = x + 'px'; cursor.style.top = y + 'px';
        cursor.style.transform = 'translate(-50%,-50%)'; cursor.style.opacity = '1';
      },
      destroy: function () {
        alive = false; if (raf) cancelAnimationFrame(raf);
        clearInterval(glitch); cursor.remove();
      }
    };
  }

  var factories = { ub: createUBCursor, ln: createLNCursor, uu: createUUCursor, yami: createYamiCursor, nv: createNVCursor };

  // ── INJECT RETICLE KEYFRAME IF MISSING ───────────────────────
  if (!document.getElementById('warp-cursor-keyframes')) {
    var style = document.createElement('style');
    style.id = 'warp-cursor-keyframes';
    style.textContent = [
      '@keyframes warpReticlePulse {',
        '0%,100%{box-shadow:0 0 6px rgba(0,245,212,0.4),inset 0 0 4px rgba(0,245,212,0.1);}',
        '50%{box-shadow:0 0 18px rgba(0,245,212,0.8),inset 0 0 8px rgba(0,245,212,0.2);}',
      '}',
      'body.hide-native-cursor .theme-cursor-element {',
        'opacity: 0 !important;',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  // ── WIRE UP WARP LINKS ────────────────────────────────────────
  var activeCursor = null;
  var moveHandler  = null;
  var leaveTimer   = null;

  warpLinks.forEach(function (link) {
    // Derive theme key from the href filename
    var href     = link.getAttribute('href') || '';
    var filename = href.split('/').pop();
    var theme    = hrefToTheme[filename];
    if (!theme || !factories[theme]) return;

    link.addEventListener('mouseenter', function () {
      clearTimeout(leaveTimer);

      // Clean up any previous warp cursor
      if (activeCursor) { activeCursor.destroy(); activeCursor = null; }
      if (moveHandler)  { document.removeEventListener('mousemove', moveHandler); moveHandler = null; }

      // Hide the current page's own custom cursor via CSS class
      document.body.classList.add('hide-native-cursor');

      // Spawn destination cursor
      activeCursor = factories[theme]();

      moveHandler = function (e) {
        if (activeCursor) activeCursor.move(e.clientX, e.clientY);
      };
      document.addEventListener('mousemove', moveHandler);
    });

    link.addEventListener('mouseleave', function () {
      leaveTimer = setTimeout(function () {
        if (activeCursor) { activeCursor.destroy(); activeCursor = null; }
        if (moveHandler)  { document.removeEventListener('mousemove', moveHandler); moveHandler = null; }

        // Restore own page cursor
        document.body.classList.remove('hide-native-cursor');
      }, 80);
    });
  });

})();
