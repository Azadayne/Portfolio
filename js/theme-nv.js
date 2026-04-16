/**
 * theme-nv.js — Neon Veil Page Visual Engine v2
 * BANANZA EDITION: Living circuit board, neon aurora, holographic grid,
 * surveillance sweep, data surge, plasma cursor, explosive clicks.
 * ALL functions guard with body class check. Zero bleed.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('theme-nv')) return;

  /* ══════════════════════════════════════════════════════
     1. BIO-DIGITAL CORRUPTION — Horror Background
     Replaces the circuit board. Extremely faint, slow
     drifting red and black "spores" that occasionally
     pulse. Stays firmly behind content.
  ══════════════════════════════════════════════════════ */
  function initBioCorruption() {
    if (!document.body.classList.contains('theme-nv')) return;

    var canvas = document.getElementById('nv-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function setSize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setSize();
    window.addEventListener('resize', function () {
      setSize();
      respawnAll();
    });

    function makeSpore() {
      var isRed = Math.random() > 0.6;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 4,
        a: 0.01 + Math.random() * 0.04,
        pulse: Math.random() * Math.PI * 2,
        isRed: isRed,
        life: 0,
        maxLife: 800 + Math.random() * 1000
      };
    }

    var spores = [];
    function respawnAll() {
      var count = Math.min(150, Math.floor(canvas.width * canvas.height / 15000));
      spores = Array.from({ length: count }, makeSpore);
    }
    respawnAll();

    function drawCorruption() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spores.forEach(function (s) {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        s.pulse += 0.02;

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        var currentAlpha = s.a + Math.sin(s.pulse) * (s.a * 0.5);
        if (currentAlpha < 0) currentAlpha = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        
        if (s.isRed) {
          ctx.fillStyle = 'rgba(255, 45, 120, ' + currentAlpha + ')';
          ctx.shadowColor = 'rgba(255, 0, 50, ' + currentAlpha + ')';
          ctx.shadowBlur = s.size * 2;
        } else {
          ctx.fillStyle = 'rgba(15, 10, 20, ' + (currentAlpha * 2) + ')';
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();

        if (s.life > s.maxLife) {
          s.x = Math.random() * canvas.width;
          s.y = Math.random() * canvas.height;
          s.life = 0;
        }
      });

      requestAnimationFrame(drawCorruption);
    }
    drawCorruption();
  }

  /* ══════════════════════════════════════════════════════
     2. NEON AURORA — three drifting light blobs
     Large radial gradients in blue/magenta/teal that
     slowly orbit the viewport. Subtle but visible glow
     that shifts the ambient color of the whole page.
  ══════════════════════════════════════════════════════ */
  function initNeonAurora() {
    if (!document.body.classList.contains('theme-nv')) return;

    var auroraConfigs = [
      { color: '74,158,255', size: '50vmax', speed: 0.00012, ox: 0.5,  oy: 0.3,  opacity: 0.04, phase: 0 },
      { color: '255,45,120', size: '40vmax', speed: 0.00018, ox: 0.25, oy: 0.7,  opacity: 0.03, phase: Math.PI * 0.66 },
      { color: '0,255,209',  size: '35vmax', speed: 0.00010, ox: 0.75, oy: 0.5,  opacity: 0.02, phase: Math.PI * 1.33 },
    ];

    var auroras = auroraConfigs.map(function (cfg) {
      var el = document.createElement('div');
      el.style.cssText = [
        'position:fixed',
        'pointer-events:none',
        'z-index:1',
        'width:' + cfg.size,
        'height:' + cfg.size,
        'border-radius:50%',
        'background:radial-gradient(circle, rgba(' + cfg.color + ',' + cfg.opacity + ') 0%, transparent 70%)',
        'transform:translate(-50%,-50%)',
        'filter:blur(40px)',
        'will-change:left,top'
      ].join(';');
      document.body.appendChild(el);
      return { el: el, cfg: cfg };
    });

    var startTime = Date.now();
    function animateAurora() {
      var t = (Date.now() - startTime);
      auroras.forEach(function (a) {
        var angle = t * a.cfg.speed + a.cfg.phase;
        var rx    = 0.28 * window.innerWidth;
        var ry    = 0.22 * window.innerHeight;
        var cx    = a.cfg.ox * window.innerWidth  + Math.cos(angle) * rx;
        var cy    = a.cfg.oy * window.innerHeight + Math.sin(angle * 1.3) * ry;
        a.el.style.left = cx + 'px';
        a.el.style.top  = cy + 'px';
      });
      requestAnimationFrame(animateAurora);
    }
    animateAurora();
  }

  /* ══════════════════════════════════════════════════════
     3. SURVEILLANCE SWEEP — full-width horizontal scan
     A glowing band of light sweeps from top to bottom
     every 12–20s with a bright leading edge and a faint
     afterglow. Looks exactly like a CCTV scan passing.
  ══════════════════════════════════════════════════════ */
  function initSurveillanceSweep() {
    if (!document.body.classList.contains('theme-nv')) return;

    var sweeper = document.createElement('div');
    sweeper.style.cssText = [
      'position:fixed',
      'left:0',
      'top:-20px',
      'width:100%',
      'height:20px',
      'pointer-events:none',
      'z-index:9',
      'background:linear-gradient(to bottom, transparent, rgba(255,0,50,0.15), rgba(70,0,10,0.4), transparent)',
      'box-shadow:0 0 20px 2px rgba(255,0,50,0.1)',
      'opacity:0'
    ].join(';');
    document.body.appendChild(sweeper);

    function sweep() {
      var h = window.innerHeight;
      sweeper.style.transition = 'none';
      sweeper.style.top  = '-20px';
      sweeper.style.opacity = '0';

      setTimeout(function () {
        sweeper.style.opacity = '1';
        sweeper.style.transition = 'top ' + (h / 260) + 's linear, opacity 0.3s ease';
        sweeper.style.top = (h + 20) + 'px';

        setTimeout(function () {
          sweeper.style.opacity = '0';
        }, (h / 260) * 1000 - 300);

      }, 50);

      setTimeout(sweep, 25000 + Math.random() * 15000);
    }
    setTimeout(sweep, 8000 + Math.random() * 8000);
  }

  /* ══════════════════════════════════════════════════════
     4. DATA SURGE — full-page chromatic tear event
     Every 15–30s the entire viewport briefly explodes
     into a multi-band RGB tear with channel offsets.
     Three rapid stages: split, white-out, snap back.
  ══════════════════════════════════════════════════════ */
  function initDataSurge() {
    if (!document.body.classList.contains('theme-nv')) return;

    /* Overlay elements for RGB channel displacement */
    var ovR = document.createElement('div');
    var ovB = document.createElement('div');
    var base = 'position:fixed;inset:0;pointer-events:none;z-index:10;opacity:0;mix-blend-mode:screen;';
    ovR.style.cssText = base + 'background:rgba(255,45,120,0.04);';
    ovB.style.cssText = base + 'background:rgba(74,158,255,0.04);';
    document.body.appendChild(ovR);
    document.body.appendChild(ovB);

    /* Multiple random glitch bands drawn as a stack */
    function createBands() {
      var count = 4 + Math.floor(Math.random() * 5);
      var bands = [];
      for (var i = 0; i < count; i++) {
        var b = document.createElement('div');
        var y = Math.random() * window.innerHeight;
        var h = 4 + Math.random() * 40;
        var dx = (Math.random() - 0.5) * 60;
        var col = Math.random() > 0.5 ? 'rgba(255,0,50,0.8)' : 'rgba(10,0,0,0.95)';
        b.style.cssText = [
          'position:fixed',
          'left:0',
          'top:' + y + 'px',
          'width:100%',
          'height:' + h + 'px',
          'background:' + col,
          'transform:translateX(' + dx + 'px)',
          'pointer-events:none',
          'z-index:10',
          'opacity:1'
        ].join(';');
        document.body.appendChild(b);
        bands.push(b);
      }
      return bands;
    }

    function surge() {
      /* Stage 1 — bands appear + channel split (60ms) */
      var bands = createBands();
      ovR.style.cssText = ovR.style.cssText.replace('opacity:0', 'opacity:1');
      ovR.style.transform = 'translateX(6px)';
      ovB.style.cssText = ovB.style.cssText.replace('opacity:0', 'opacity:1');
      ovB.style.transform = 'translateX(-6px)';
      ovR.style.opacity = '1';
      ovB.style.opacity = '1';

      setTimeout(function () {
        /* Stage 2 — Horror red flash (40ms) */
        bands.forEach(function (b) { b.style.background = 'rgba(255,0,20,0.15)'; });
      }, 60);

      setTimeout(function () {
        /* Stage 3 — snap (30ms) */
        bands.forEach(function (b) { b.remove(); });
        /* Second ripple */
        var bands2 = createBands();
        setTimeout(function () { bands2.forEach(function (b) { b.remove(); }); }, 40);
      }, 100);

      setTimeout(function () {
        ovR.style.opacity = '0';
        ovB.style.opacity = '0';
        ovR.style.transform = 'none';
        ovB.style.transform = 'none';
      }, 140);

      setTimeout(surge, 30000 + Math.random() * 30000);
    }
    setTimeout(surge, 15000 + Math.random() * 15000);
  }

  /* ══════════════════════════════════════════════════════
     5. DETECTION RADAR — pulsing ring at a fixed HUD position
     A permanent but subtle radar-style ring in the top-right
     corner. It pings every 4s. On a "detection event" it
     fires a red pulse outward.
  ══════════════════════════════════════════════════════ */
  function initRadarHUD() {
    if (!document.body.classList.contains('theme-nv')) return;

    var hud = document.createElement('div');
    hud.setAttribute('aria-hidden', 'true');
    hud.style.cssText = [
      'position:fixed',
      'top:80px',
      'right:24px',
      'width:56px',
      'height:56px',
      'pointer-events:none',
      'z-index:30'
    ].join(';');

    hud.innerHTML = [
      '<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">',
        '<circle cx="28" cy="28" r="26" fill="none" stroke="rgba(74,158,255,0.1)" stroke-width="1"/>',
        '<circle cx="28" cy="28" r="18" fill="none" stroke="rgba(74,158,255,0.06)" stroke-width="0.7"/>',
        '<circle cx="28" cy="28" r="10" fill="none" stroke="rgba(74,158,255,0.04)" stroke-width="0.5"/>',
        '<line x1="28" y1="2" x2="28" y2="54" stroke="rgba(74,158,255,0.04)" stroke-width="0.5"/>',
        '<line x1="2" y1="28" x2="54" y2="28" stroke="rgba(74,158,255,0.04)" stroke-width="0.5"/>',
        /* Rotating sweep arm */
        '<line id="nv-sweep-arm" x1="28" y1="28" x2="28" y2="2" stroke="rgba(74,158,255,0.6)" stroke-width="1" style="transform-origin:28px 28px;"/>',
        '<circle cx="28" cy="28" r="2" fill="rgba(74,158,255,0.8)"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(hud);

    /* Rotate the sweep arm */
    var sweepAngle = 0;
    var arm = hud.querySelector('#nv-sweep-arm');
    function rotateSweep() {
      sweepAngle += 0.8;
      if (arm) arm.style.transform = 'rotate(' + sweepAngle + 'deg)';
      requestAnimationFrame(rotateSweep);
    }
    rotateSweep();

    /* Periodic pings */
    function ping() {
      var ring = document.createElement('div');
      ring.style.cssText = [
        'position:fixed',
        'right:' + (24 + 28) + 'px',
        'top:' + (80 + 28) + 'px',
        'width:0',
        'height:0',
        'border-radius:50%',
        'border:1px solid rgba(74,158,255,0.3)',
        'transform:translate(50%,-50%)',
        'pointer-events:none',
        'z-index:29',
        'animation:nvDetectionRing 2.5s ease-out forwards'
      ].join(';');
      document.body.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 2600);

      /* Occasional red detection alert */
      if (Math.random() > 0.7) {
        var alert = document.createElement('div');
        alert.style.cssText = ring.style.cssText
          .replace('rgba(74,158,255,0.7)', 'rgba(255,45,120,0.9)')
          .replace('nvDetectionRing 1.8s', 'nvDetectionRing 1.2s');
        document.body.appendChild(alert);
        setTimeout(function () { alert.remove(); }, 1300);
      }

      setTimeout(ping, 8000 + Math.random() * 4000);
    }
    setTimeout(ping, 4000);
  }

  /* ══════════════════════════════════════════════════════
     6. SHADOW ENTITY — perspective silhouette at edge
     More elaborate than a thin strip. A tall blurred
     humanoid-width shadow with chromatic fringing
     appears for 200ms every 10–25s.
  ══════════════════════════════════════════════════════ */
  function initShadowEntity() {
    if (!document.body.classList.contains('theme-nv')) return;

    function appear() {
      var onLeft = Math.random() > 0.5;
      var entity = document.createElement('div');
      entity.style.cssText = [
        'position:fixed',
        'top:0',
        onLeft ? 'left:0' : 'right:0',
        'width:28px',
        'height:100vh',
        'pointer-events:none',
        'z-index:9',
        'opacity:0',
        /* Silhouette blend: darker with blood red fringe */
        onLeft
          ? 'background:linear-gradient(to right, rgba(255, 0, 50, 0.4), rgba(0, 0, 0, 0.8) 60%, transparent)'
          : 'background:linear-gradient(to left,  rgba(255, 0, 50, 0.4), rgba(0, 0, 0, 0.8) 60%, transparent)',
        'filter:blur(3px)',
        'animation:shadowFlash 0.35s ease-in-out forwards'
      ].join(';');
      document.body.appendChild(entity);
      setTimeout(function () { entity.remove(); }, 250);
      setTimeout(appear, 25000 + Math.random() * 20000);
    }
    setTimeout(appear, 12000 + Math.random() * 12000);
  }

  /* ══════════════════════════════════════════════════════
     7. CURSOR: CORRUPTED CROSSHAIR + DUAL RING
     Outer ring rotates CW, inner ring rotates CCW.
     The whole thing micro-glitches. On hover it locks
     on the target with a red acquisition flash.
  ══════════════════════════════════════════════════════ */
  function initNVCursor() {
    if (!document.body.classList.contains('theme-nv')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    var cursor = document.createElement('div');
    cursor.id  = 'nv-cursor';
    cursor.classList.add('theme-cursor-element');
    cursor.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:100000',
      'opacity:0',
      'will-change:left,top'
    ].join(';');

    cursor.innerHTML = [
      '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;transform-origin:center;">',
        /* Outer dashed ring — blue */
        '<circle id="nv-ring-outer" cx="32" cy="32" r="28"',
          'fill="none" stroke="rgba(74,158,255,0.7)" stroke-width="1"',
          'stroke-dasharray="5 4"',
          'style="transform-origin:32px 32px;"/>',
        /* Inner dashed ring — magenta, rotates opposite */
        '<circle id="nv-ring-inner" cx="32" cy="32" r="18"',
          'fill="none" stroke="rgba(255,45,120,0.6)" stroke-width="0.8"',
          'stroke-dasharray="3 5"',
          'style="transform-origin:32px 32px;"/>',
        /* Cardinal crosshair lines — teal */
        '<line x1="32" y1="0"  x2="32" y2="10" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<line x1="32" y1="54" x2="32" y2="64" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<line x1="0"  y1="32" x2="10" y2="32" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        '<line x1="54" y1="32" x2="64" y2="32" stroke="rgba(0,255,209,0.9)" stroke-width="1.2"/>',
        /* Corner brackets */
        '<path d="M20 14 L14 14 L14 20" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<path d="M44 14 L50 14 L50 20" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<path d="M20 50 L14 50 L14 44" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        '<path d="M44 50 L50 50 L50 44" fill="none" stroke="rgba(74,158,255,0.8)" stroke-width="1.2"/>',
        /* Diamond center */
        '<rect id="nv-diamond" x="29" y="29" width="6" height="6"',
          'fill="none" stroke="rgba(255,45,120,0.9)" stroke-width="1.2"',
          'transform="rotate(45 32 32)"/>',
        /* Hot center dot */
        '<circle cx="32" cy="32" r="2" fill="#FF2D78"',
          'style="filter:drop-shadow(0 0 6px #FF2D78);"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(cursor);

    var svg        = cursor.querySelector('svg');
    var outerRing  = cursor.querySelector('#nv-ring-outer');
    var innerRing  = cursor.querySelector('#nv-ring-inner');
    var outerAngle = 0;
    var innerAngle = 0;

    function rotateCursor() {
      outerAngle += 0.35;
      innerAngle -= 0.6;
      outerRing.style.transform = 'rotate(' + outerAngle + 'deg)';
      innerRing.style.transform = 'rotate(' + innerAngle + 'deg)';
      requestAnimationFrame(rotateCursor);
    }
    rotateCursor();

    /* Micro-glitch */
    setInterval(function () {
      if (Math.random() > 0.85) {
        var dx = (Math.random() - 0.5) * 7;
        cursor.style.transform = 'translate(-50%,-50%) translate(' + dx + 'px,0)';
        setTimeout(function () { cursor.style.transform = 'translate(-50%,-50%)'; }, 55);
      }
    }, 300);

    var mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.left    = mx + 'px';
      cursor.style.top     = my + 'px';
      cursor.style.transform = 'translate(-50%,-50%)';
      cursor.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });

    document.querySelectorAll('a, button, .btn').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        svg.style.filter = 'drop-shadow(0 0 10px rgba(74,158,255,0.9)) drop-shadow(0 0 20px rgba(255,45,120,0.5))';
        cursor.style.transform = 'translate(-50%,-50%) scale(1.3)';
      });
      el.addEventListener('mouseleave', function () {
        svg.style.filter = 'none';
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     8. CHROMATIC GHOST TRAIL — three offset copies
     Blue copy trails behind at 50ms, magenta at 110ms,
     teal at 200ms. Mix-blend: screen — they layer
     on top of the environment creating chromatic smear.
  ══════════════════════════════════════════════════════ */
  function initNVTrail() {
    if (!document.body.classList.contains('theme-nv')) return;

    var configs = [
      { delay: 50,  col: 'rgba(74,158,255,0.22)',  blur: 0,   size: 64 },
      { delay: 110, col: 'rgba(255,45,120,0.14)',   blur: 1,   size: 56 },
      { delay: 200, col: 'rgba(0,255,209,0.08)',    blur: 2.5, size: 48 },
    ];

    configs.forEach(function (cfg) {
      var t = document.createElement('div');
      t.classList.add('theme-cursor-element');
      t.style.cssText = [
        'position:fixed',
        'pointer-events:none',
        'z-index:99998',
        'transform:translate(-50%,-50%)',
        'mix-blend-mode:screen',
        'transition:left ' + cfg.delay + 'ms linear, top ' + cfg.delay + 'ms linear',
        'filter:blur(' + cfg.blur + 'px)'
      ].join(';');
      t.innerHTML = [
        '<svg width="' + cfg.size + '" height="' + cfg.size + '"',
          'viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">',
          '<circle cx="32" cy="32" r="28" fill="none"',
            'stroke="' + cfg.col + '" stroke-width="0.8" stroke-dasharray="5 4"/>',
          '<circle cx="32" cy="32" r="2.5" fill="' + cfg.col + '"/>',
        '</svg>'
      ].join('');
      document.body.appendChild(t);

      document.addEventListener('mousemove', function (e) {
        t.style.left = e.clientX + 'px';
        t.style.top  = e.clientY + 'px';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     9. PLASMA EXPLOSION CLICK
     On click: a white plasma core expands, 8 neon shards
     fly outward at various speeds, three chromatic rings
     expand at offsets, a hex code whisper drifts up,
     and a brief full-screen RGB tear fires.
  ══════════════════════════════════════════════════════ */
  function nvClickEffect(e) {
    if (!document.body.classList.contains('theme-nv')) return;

    var cx = e.clientX, cy = e.clientY;

    /* Plasma core */
    var core = document.createElement('div');
    core.style.cssText = [
      'position:fixed',
      'left:' + cx + 'px',
      'top:' + cy + 'px',
      'width:16px',
      'height:16px',
      'border-radius:50%',
      'background:radial-gradient(circle, #fff 0%, #4A9EFF 40%, #FF2D78 80%)',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:10002',
      'box-shadow:0 0 30px 10px rgba(74,158,255,0.8), 0 0 60px 20px rgba(255,45,120,0.4)',
      'animation:nvGlitchFlash 0.35s ease-out forwards'
    ].join(';');
    document.body.appendChild(core);
    setTimeout(function () { core.remove(); }, 380);

    /* Chromatic rings */
    [
      { col: 'rgba(74,158,255,0.9)',  delay: 0,   dur: '0.7s', maxW: 160 },
      { col: 'rgba(255,45,120,0.7)',  delay: 60,  dur: '0.6s', maxW: 120 },
      { col: 'rgba(0,255,209,0.5)',   delay: 130, dur: '0.5s', maxW: 80  },
    ].forEach(function (cfg) {
      var ring = document.createElement('div');
      ring.style.cssText = [
        'position:fixed',
        'left:' + cx + 'px',
        'top:' + cy + 'px',
        'width:0',
        'height:0',
        'border-radius:50%',
        'border:2px solid ' + cfg.col,
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
        'z-index:10001',
        'box-shadow:0 0 8px ' + cfg.col,
        '--target-size:' + cfg.maxW + 'px',
        'animation:nvShockwave ' + cfg.dur + ' ease-out ' + cfg.delay + 'ms forwards'
      ].join(';');
      document.body.appendChild(ring);
      setTimeout(function () { ring.remove(); }, parseInt(cfg.dur) * 1000 + cfg.delay + 100);
    });

    /* 8 neon shards */
    var colors = ['#4A9EFF','#FF2D78','#00FFD1','#8250FF','#4A9EFF','#FF2D78','#00FFD1','#ff9f2d'];
    for (var i = 0; i < 8; i++) {
      (function(idx) {
        var deg  = idx * 45 + (Math.random() - 0.5) * 20;
        var rad  = deg * Math.PI / 180;
        var dist = 40 + Math.random() * 50;
        var tx   = Math.cos(rad) * dist;
        var ty   = Math.sin(rad) * dist;
        var w    = 2 + Math.random() * 3;
        var h    = 10 + Math.random() * 14;
        var shard = document.createElement('div');
        shard.style.cssText = [
          'position:fixed',
          'left:' + cx + 'px',
          'top:' + cy + 'px',
          'width:' + w + 'px',
          'height:' + h + 'px',
          'background:' + colors[idx],
          'box-shadow:0 0 12px 2px ' + colors[idx],
          'border-radius:1px',
          'transform:translate(-50%,-50%) rotate(' + deg + 'deg)',
          'pointer-events:none',
          'z-index:10000',
          'transition:transform 0.5s cubic-bezier(0.05,0.9,0.1,1), opacity 0.5s'
        ].join(';');
        document.body.appendChild(shard);
        shard.offsetHeight;
        shard.style.transform = 'translate(calc(-50% + ' + tx + 'px), calc(-50% + ' + ty + 'px)) rotate(' + deg + 'deg) scaleY(0.1)';
        shard.style.opacity   = '0';
        setTimeout(function () { shard.remove(); }, 550);
      })(i);
    }

    /* Hex code whisper */
    var hexChars  = '0123456789ABCDEF';
    var hexString = '';
    for (var h = 0; h < 6; h++) hexString += hexChars[Math.floor(Math.random() * 16)];
    var whisper = document.createElement('div');
    whisper.style.cssText = [
      'position:fixed',
      'left:' + (cx + 14) + 'px',
      'top:' + (cy - 10) + 'px',
      'font-family:JetBrains Mono,monospace',
      'font-size:10px',
      'color:rgba(0,255,209,0.9)',
      'text-shadow:0 0 8px rgba(0,255,209,0.8)',
      'pointer-events:none',
      'z-index:10003',
      'letter-spacing:0.1em',
      'animation:kanjiWhisper 1.2s ease-out forwards'
    ].join(';');
    whisper.textContent = '#' + hexString;
    document.body.appendChild(whisper);
    setTimeout(function () { whisper.remove(); }, 1250);

    /* Mini RGB tear */
    var tear = document.createElement('div');
    tear.style.cssText = [
      'position:fixed',
      'left:0',
      'top:' + (cy - 2) + 'px',
      'width:100%',
      'height:4px',
      'background:linear-gradient(90deg, transparent, rgba(255,45,120,0.3) 30%, rgba(74,158,255,0.5) 50%, rgba(0,255,209,0.3) 70%, transparent)',
      'pointer-events:none',
      'z-index:9999',
      'transform:scaleX(0)',
      'transform-origin:center',
      'transition:transform 0.15s ease, opacity 0.2s ease'
    ].join(';');
    document.body.appendChild(tear);
    tear.offsetHeight;
    tear.style.transform = 'scaleX(1)';
    setTimeout(function () { tear.style.opacity = '0'; }, 150);
    setTimeout(function () { tear.remove(); }, 380);
  }

  /* ══════════════════════════════════════════════════════
     10. HERO ENHANCEMENTS
  ══════════════════════════════════════════════════════ */
  function initHeroEnhancements() {
    if (!document.body.classList.contains('theme-nv')) return;

    var heroContent = document.querySelector('.project-detail__hero-content');
    if (heroContent) {
      var badge = document.createElement('div');
      badge.className = 'nv-hero-badge';
      badge.innerHTML = '<div class="nv-hero-badge__dot"></div><span>TARGET ACQUIRED</span>';
      heroContent.insertBefore(badge, heroContent.firstChild);
    }

    var hero = document.querySelector('.project-detail__hero');
    if (hero) {
      var line = document.createElement('div');
      line.className = 'nv-hero-line';
      line.setAttribute('aria-hidden', 'true');
      hero.appendChild(line);
    }
  }

  /* ══════════════════════════════════════════════════════
     11. PROXIMITY BLOOM — large neon light follows mouse
     A 500px soft glow in ice-blue follows the cursor
     with slight lag, making wherever you look warmer.
  ══════════════════════════════════════════════════════ */
  function initProximityBloom() {
    if (!document.body.classList.contains('theme-nv')) return;

    var bloom = document.createElement('div');
    bloom.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:3',
      'width:500px',
      'height:500px',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'background:radial-gradient(circle, rgba(74,158,255,0.03) 0%, rgba(255,45,120,0.01) 50%, transparent 70%)',
      'filter:blur(20px)',
      'transition:left 0.12s ease, top 0.12s ease',
    ].join(';');
    document.body.appendChild(bloom);

    document.addEventListener('mousemove', function (e) {
      bloom.style.left = e.clientX + 'px';
      bloom.style.top  = e.clientY + 'px';
    });
  }

  /* ══════════════════════════════════════════════════════
     12. OVERRIDE GLOBAL CLICK EFFECTS
  ══════════════════════════════════════════════════════ */
  function initClickOverride() {
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('theme-nv')) return;
      // Never intercept nav/hamburger/mobile-menu clicks
      if (e.target.closest('.nav__hamburger, .nav__mobile-menu, .nav__mobile-link, .nav')) return;
      e.stopImmediatePropagation();
      nvClickEffect(e);
    }, true);
  }

  /* ══════════════════════════════════════════════════════
     INIT — 50/50 Cyberpunk & Horror
  ══════════════════════════════════════════════════════ */
  function init() {
    initBioCorruption();
    // initNeonAurora(); // Kept disabled for maximum darkness
    initSurveillanceSweep();
    initDataSurge();
    initRadarHUD();
    initShadowEntity();

    initNVCursor();
    initNVTrail();
    initHeroEnhancements();
    initClickOverride();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
