/**
 * theme-uu.js — Undead Unleashed Page Visual Engine
 * ALL functions guard with body class check. Zero bleed.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('theme-uu')) return;

  /* ── 1. CRT STATIC NOISE ────────────────────────────── */
  function initStaticNoise() {
    if (!document.body.classList.contains('theme-uu')) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'uu-noise';
    canvas.style.cssText = 'position:fixed; inset:0; width:100%; height:100%; pointer-events:none; z-index:2; opacity:0.04; mix-blend-mode:screen;';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    canvas.width  = 300;
    canvas.height = 300;

    function drawNoise() {
      var img = ctx.createImageData(300, 300);
      for (var i = 0; i < img.data.length; i += 4) {
        var v = Math.random() * 255;
        img.data[i]     = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(drawNoise);
    }
    drawNoise();
  }

  /* ── 2. GLITCH FLICKER ──────────────────────────────── */
  function initGlitchFlicker() {
    if (!document.body.classList.contains('theme-uu')) return;

    var glitchBand = document.createElement('div');
    glitchBand.style.cssText = 'position:fixed; left:0; width:100%; height:0; pointer-events:none; z-index:99; background:rgba(80,255,60,0.06); opacity:0; transition:opacity 0.05s;';
    document.body.appendChild(glitchBand);

    var wrapper = document.querySelector('.uu-content-wrapper');

    function glitch() {
      if (!wrapper) return;
      var bandY = Math.random() * window.innerHeight;
      var bandH = 20 + Math.random() * 40;
      glitchBand.style.top    = bandY + 'px';
      glitchBand.style.height = bandH + 'px';
      glitchBand.style.transform = 'translateX(' + ((Math.random() - 0.5) * 16) + 'px)';
      glitchBand.style.opacity = '1';
      wrapper.style.transform = 'translateX(' + ((Math.random() - 0.5) * 4) + 'px)';

      setTimeout(function () {
        glitchBand.style.opacity   = '0';
        glitchBand.style.transform = 'translateX(0)';
        wrapper.style.transform = 'translateX(0)';
      }, 80);

      setTimeout(glitch, 8000 + Math.random() * 14000);
    }
    setTimeout(glitch, 4000 + Math.random() * 6000);
  }

  /* ── 3. EMERGENCY ALERT FLASH ───────────────────────── */
  function initAlertFlash() {
    if (!document.body.classList.contains('theme-uu')) return;

    var siren = document.createElement('div');
    siren.style.cssText = 'position:fixed; inset:0; background:rgba(255,26,26,0); pointer-events:none; z-index:4; transition:background 0.08s;';
    document.body.appendChild(siren);

    function flash() {
      siren.style.background = 'rgba(255,26,26,0.05)';
      setTimeout(function () { siren.style.background = 'rgba(255,26,26,0)'; }, 100);
      setTimeout(function () { siren.style.background = 'rgba(255,26,26,0.03)'; }, 250);
      setTimeout(function () { siren.style.background = 'rgba(255,26,26,0)'; }, 380);
      setTimeout(flash, 30000 + Math.random() * 30000);
    }
    setTimeout(flash, 10000 + Math.random() * 10000);
  }

  /* ── 4. BIOHAZARD CURSOR ────────────────────────────── */
  function initUUCursor() {
    if (!document.body.classList.contains('theme-uu')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    var cursor = document.createElement('div');
    cursor.id = 'uu-cursor';
    cursor.classList.add('theme-cursor-element');
    cursor.style.cssText = [
      'position:fixed',
      'width:46px',
      'height:46px',
      'pointer-events:none',
      'z-index:100000',
      'transform:translate(-50%,-50%)',
      'will-change:left,top',
      'opacity:0'
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

    // Micro-glitch on the cursor
    setInterval(function () {
      if (Math.random() > 0.85) {
        var offset = (Math.random() - 0.5) * 6;
        cursor.style.transform = 'translate(calc(-50% + ' + offset + 'px), -50%)';
        setTimeout(function () { cursor.style.transform = 'translate(-50%,-50%)'; }, 60);
      }
    }, 400);

    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    });

    document.querySelectorAll('a, button, .btn').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.filter    = 'drop-shadow(0 0 6px rgba(80,255,60,0.9))';
        cursor.style.transform = 'translate(-50%,-50%) scale(1.3)';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.filter    = 'none';
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  }

  /* ── 5. INFECTION TRAIL ─────────────────────────────── */
  function initUUTrail() {
    if (!document.body.classList.contains('theme-uu')) return;

    var trailColors = ['rgba(80,255,60,0.4)', 'rgba(60,200,40,0.2)', 'rgba(40,140,20,0.1)'];
    var delays = [40, 90, 160];

    var trails = trailColors.map(function (color, i) {
      var t = document.createElement('div');
      t.classList.add('theme-cursor-element');
      t.style.cssText = [
        'position:fixed',
        'width:5px',
        'height:5px',
        'border-radius:50%',
        'background:' + color,
        'box-shadow:0 0 6px ' + color,
        'pointer-events:none',
        'z-index:99998',
        'transform:translate(-50%,-50%)',
        'transition:left ' + delays[i] + 'ms linear, top ' + delays[i] + 'ms linear',
        'filter:blur(' + (i * 0.5) + 'px)'
      ].join(';');
      document.body.appendChild(t);
      return t;
    });

    document.addEventListener('mousemove', function (e) {
      trails.forEach(function (t) {
        t.style.left = e.clientX + 'px';
        t.style.top  = e.clientY + 'px';
      });
    });
  }

  /* ── 6. SPLATTER CLICK EFFECT ───────────────────────── */
  function uuClickEffect(e) {
    if (!document.body.classList.contains('theme-uu')) return;

    // Center impact flash
    var flash = document.createElement('div');
    flash.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:10px',
      'height:10px',
      'background:radial-gradient(circle, #FF1A1A, #50FF3C)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:10000',
      'animation:uuImpact 0.35s ease-out forwards'
    ].join(';');
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 370);

    // Irregular splatter lines
    var angles         = [0, 30, 65, 110, 155, 200, 250, 310];
    var splatterColors = ['#FF1A1A','#50FF3C','#FF1A1A','#FFB800','#50FF3C','#FF1A1A','#50FF3C','#FF1A1A'];

    angles.forEach(function (angle, i) {
      var splat = document.createElement('div');
      var len   = (20 + Math.random() * 25).toFixed(1) + 'px';
      splat.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:' + e.clientY + 'px',
        'width:0px',
        'height:' + (1 + Math.random()).toFixed(1) + 'px',
        'background:' + splatterColors[i],
        'transform-origin:left center',
        'transform:translate(0,-50%) rotate(' + angle + 'deg)',
        'pointer-events:none',
        'z-index:9999',
        'border-radius:1px',
        '--len:' + len,
        'animation:uuSplat 0.45s cubic-bezier(0.1,0.8,0.2,1) ' + (i * 10) + 'ms forwards'
      ].join(';');
      document.body.appendChild(splat);
      setTimeout(function () { splat.remove(); }, 480 + i * 10);
    });

    // Contamination rings — green then red
    [0, 80].forEach(function (delay) {
      var ring  = document.createElement('div');
      var color = delay === 0 ? 'rgba(80,255,60,0.7)' : 'rgba(255,26,26,0.4)';
      ring.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:' + e.clientY + 'px',
        'width:0',
        'height:0',
        'border:1.5px solid ' + color,
        'border-radius:50%',
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
        'z-index:9998',
        'animation:uuRing 0.6s ease-out ' + delay + 'ms forwards'
      ].join(';');
      document.body.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 700 + delay);
    });
  }

  /* ── 7. HERO ENHANCEMENTS ───────────────────────────── */
  function initHeroEnhancements() {
    if (!document.body.classList.contains('theme-uu')) return;

    var heroContent = document.querySelector('.project-detail__hero-content');
    if (heroContent) {
      // Emergency badge
      var badge = document.createElement('div');
      badge.className = 'uu-hero-badge';
      badge.innerHTML = '<div class="uu-hero-badge__indicator"></div><span>CONTAINMENT FAILURE</span>';
      heroContent.insertBefore(badge, heroContent.firstChild);
    }

    // Biohazard SVG watermark
    var hero = document.querySelector('.project-detail__hero');
    if (hero) {
      var bh = document.createElement('div');
      bh.setAttribute('aria-hidden', 'true');
      bh.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:220px;opacity:0.03;z-index:1;pointer-events:none;';
      bh.innerHTML = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#50FF3C"><path d="M50 10 C60 10,70 15,70 25 C80 20,90 25,88 36 C95 40,95 52,86 56 C88 67,82 76,72 74 C70 82,60 85,50 82 C40 85,30 82,28 74 C18 76,12 67,14 56 C5 52,5 40,12 36 C10 25,20 20,30 25 C30 15,40 10,50 10Z M50 38 C44 38,40 42,40 48 C40 54,44 58,50 58 C56 58,60 54,60 48 C60 42,56 38,50 38Z"/></svg>';
      hero.appendChild(bh);

      // Emergency ticker
      var tickerWrap = document.createElement('div');
      tickerWrap.className = 'uu-ticker-wrap';
      var ticker = document.createElement('div');
      ticker.className = 'uu-ticker';
      var msg = '\u26A0 OUTBREAK DETECTED \u2014 STAY INDOORS \u2003\u26A0 EVACUATION ROUTES COMPROMISED \u2003\u26A0 DO NOT ENGAGE \u2003\u26A0 ALL PERSONNEL REPORT TO SECTOR 7 \u2003\u26A0 BIOHAZARD LEVEL: CRITICAL \u2003\u26A0 OUTBREAK DETECTED \u2014 STAY INDOORS \u2003\u26A0 EVACUATION ROUTES COMPROMISED \u2003\u26A0 DO NOT ENGAGE \u2003';
      ticker.textContent = msg;
      tickerWrap.appendChild(ticker);
      hero.appendChild(tickerWrap);
    }
  }

  /* ── 8. TEXT FLICKER ────────────────────────────────── */
  function initTextFlicker() {
    if (!document.body.classList.contains('theme-uu')) return;

    setInterval(function () {
      if (Math.random() > 0.97) {
        var headings = document.querySelectorAll('h1, h2, h3');
        var target   = headings[Math.floor(Math.random() * headings.length)];
        if (!target) return;
        target.style.opacity = '0.3';
        setTimeout(function () { target.style.opacity = '1'; }, 80);
      }
    }, 1000);
  }

  /* ── 9. OVERRIDE GLOBAL CLICK EFFECTS ──────────────── */
  function initClickOverride() {
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('theme-uu')) return;
      // Never intercept nav/hamburger/mobile-menu clicks
      if (e.target.closest('.nav__hamburger, .nav__mobile-menu, .nav__mobile-link, .nav')) return;
      e.stopImmediatePropagation();
      uuClickEffect(e);
    }, true);
  }

  /* ── ALSO UPDATE SELECTION.JS TAG ───────────────────── */
  // Handled in selection.js via body class detection

  /* ── INIT ─────────────────────────────────────────── */
  function init() {
    initStaticNoise();
    initGlitchFlicker();
    initAlertFlash();
    initUUCursor();
    initUUTrail();
    initHeroEnhancements();
    initTextFlicker();
    initClickOverride();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
