/**
 * theme-ln.js — Leo & Nora Page Visual Engine
 * ALL functions check for .theme-ln body class before running.
 * This script must never affect any other page.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('theme-ln')) return;

  /* ── 1. FLOATING EMBER PARTICLES ────────────────────── */
  function initEmbers() {
    if (!document.body.classList.contains('theme-ln')) return;
    const canvas = document.getElementById('ln-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Lift canvas above background images
    canvas.style.zIndex       = '5';
    canvas.style.mixBlendMode = 'screen';

    const colors = [
      'rgba(255,184,48,',
      'rgba(255,120,30,',
      'rgba(255,78,140,',
      'rgba(255,220,100,'
    ];

    const embers = Array.from({ length: 60 }, function () { return {
      x:       Math.random() * canvas.width,
      y:       canvas.height + Math.random() * 200,
      size:    1 + Math.random() * 2.5,
      speedY:  0.4 + Math.random() * 0.8,
      speedX:  (Math.random() - 0.5) * 0.4,
      opacity: 0.2 + Math.random() * 0.5,
      flicker: Math.random() * Math.PI * 2,
      color:   colors[Math.floor(Math.random() * colors.length)]
    }; });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach(function (e) {
        e.flicker += 0.04;
        var flicker = Math.sin(e.flicker) * 0.3;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle   = e.color + Math.max(0, e.opacity + flicker) + ')';
        ctx.shadowBlur  = 6;
        ctx.shadowColor = e.color + '0.8)';
        ctx.fill();
        e.y -= e.speedY;
        e.x += e.speedX;
        if (e.y < -10) {
          e.y = canvas.height + 10;
          e.x = Math.random() * canvas.width;
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

  /* ── 2. SACRED PULSE ────────────────────────────────── */
  function initSacredPulse() {
    if (!document.body.classList.contains('theme-ln')) return;

    function pulse() {
      var ring = document.createElement('div');
      ring.style.cssText = [
        'position:fixed',
        'left:50%',
        'top:50%',
        'width:0',
        'height:0',
        'border-radius:50%',
        'border:1px solid rgba(255,184,48,0.12)',
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
        'z-index:1',
        'animation:sacredPulse 3s ease-out forwards'
      ].join(';');
      document.body.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 3100);
      setTimeout(pulse, 20000 + Math.random() * 20000);
    }
    setTimeout(pulse, 8000);
  }

  /* ── 3. LOTUS MANDALA CURSOR ────────────────────────── */
  function initLNCursor() {
    if (!document.body.classList.contains('theme-ln')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    var cursor = document.createElement('div');
    cursor.id = 'ln-cursor';
    cursor.classList.add('theme-cursor-element');
    cursor.style.cssText = [
      'position:fixed',
      'width:44px',
      'height:44px',
      'pointer-events:none',
      'z-index:100000',
      'transform:translate(-50%,-50%)',
      'will-change:left,top',
      'opacity:0'
    ].join(';');

    cursor.innerHTML = [
      '<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">',
        '<circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,184,48,0.4)" stroke-width="0.8"/>',
        '<circle cx="22" cy="22" r="14" fill="none" stroke="rgba(255,184,48,0.2)" stroke-width="0.6" stroke-dasharray="3 4"/>',
        
        '<!-- Orbiting Soul Dots (Leo & Nora) -->',
        '<circle id="soul-leo"  r="2.5" fill="#FFB830" style="filter:drop-shadow(0 0 4px #FFB830);"/>',
        '<circle id="soul-nora" r="2.5" fill="#FF4E8C" style="filter:drop-shadow(0 0 4px #FF4E8C);"/>',
        
        '<line x1="22" y1="2"  x2="22" y2="8"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="22" y1="36" x2="22" y2="42" stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="2"  y1="22" x2="8"  y2="22"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<line x1="36" y1="22" x2="42" y2="22"  stroke="rgba(255,184,48,0.6)" stroke-width="1"/>',
        '<circle cx="22" cy="22" r="1.5" fill="white" style="filter:drop-shadow(0 0 6px white);"/>',
      '</svg>'
    ].join('');

    document.body.appendChild(cursor);

    var angle = 0;
    var svg   = cursor.querySelector('svg');
    var leo   = cursor.querySelector('#soul-leo');
    var nora  = cursor.querySelector('#soul-nora');

    function animateCursor() {
      angle += 0.3;
      svg.style.transform = 'rotate(' + angle + 'deg)';
      
      // Secondary orbit for the soul dots
      var orbit = 12;
      var t = Date.now() * 0.003;
      leo.setAttribute('cx', 22 + Math.cos(t) * orbit);
      leo.setAttribute('cy', 22 + Math.sin(t) * orbit);
      
      nora.setAttribute('cx', 22 + Math.cos(t + Math.PI) * orbit);
      nora.setAttribute('cy', 22 + Math.sin(t + Math.PI) * orbit);
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

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

    var centerDot = cursor.querySelector('circle:last-child');
    var lines     = cursor.querySelectorAll('line');

    document.querySelectorAll('a, button, .btn').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.4)';
        centerDot.style.fill = '#FF4E8C';
        lines.forEach(function (l) { l.style.stroke = 'rgba(255,78,140,0.9)'; });
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        centerDot.style.fill = '#FFB830';
        lines.forEach(function (l) { l.style.stroke = 'rgba(255,184,48,0.7)'; });
      });
    });
  }

  /* ── 4. EMBER CURSOR TRAIL ──────────────────────────── */
  function initLNTrail() {
    if (!document.body.classList.contains('theme-ln')) return;

    var trailColors = [
      'rgba(255,184,48,0.45)',
      'rgba(255,120,60,0.25)',
      'rgba(255,78,140,0.12)'
    ];
    var delays = [50, 110, 190];

    var trails = trailColors.map(function (color, i) {
      var t = document.createElement('div');
      t.classList.add('theme-cursor-element');
      t.style.cssText = [
        'position:fixed',
        'width:6px',
        'height:6px',
        'border-radius:50%',
        'background:' + color,
        'box-shadow:0 0 8px ' + color,
        'pointer-events:none',
        'z-index:99998',
        'transform:translate(-50%,-50%)',
        'transition:left ' + delays[i] + 'ms linear, top ' + delays[i] + 'ms linear'
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

  /* ── 5. LOTUS BLOOM CLICK EFFECT ────────────────────── */
  function lnClickEffect(e) {
    if (!document.body.classList.contains('theme-ln')) return;

    // Center radial flash
    var flash = document.createElement('div');
    flash.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:10px',
      'height:10px',
      'background:radial-gradient(circle, #FFB830, #FF4E8C)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:10000',
      'animation:lotusFlash 0.4s ease-out forwards'
    ].join(';');
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 420);

    // Two spiraling souls blooming outward
    var soulColors = ['#FFB830', '#FF4E8C'];
    soulColors.forEach(function(color, i) {
      var soul = document.createElement('div');
      var startAngle = i * Math.PI; // Opposite sides
      
      soul.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:' + e.clientY + 'px',
        'width:8px',
        'height:8px',
        'background:' + color,
        'border-radius:50%',
        'pointer-events:none',
        'z-index:10002',
        'box-shadow: 0 0 15px ' + color,
        'transition: transform 0.8s cubic-bezier(0.15, 0.85, 0.35, 1), opacity 0.8s'
      ].join(';');
      
      document.body.appendChild(soul);
      
      // Force reflow
      soul.offsetHeight;
      
      // Spiral outward: rotate 360deg and move 40px out
      var tx = Math.cos(startAngle + Math.PI) * 45;
      var ty = Math.sin(startAngle + Math.PI) * 45;
      
      soul.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(0)';
      soul.style.opacity = '0';
      
      setTimeout(function() { soul.remove(); }, 850);
    });

    // Gold sacred ring
    var ring = document.createElement('div');
    ring.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:0',
      'height:0',
      'border:1.5px solid rgba(255,184,48,0.7)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:9998',
      'animation:lotusRing 0.6s ease-out forwards'
    ].join(';');
    document.body.appendChild(ring);

    // Rose outer ring
    var ring2 = document.createElement('div');
    ring2.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:0',
      'height:0',
      'border:1px solid rgba(255,78,140,0.4)',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:9997',
      'animation:lotusRing 0.8s ease-out 0.1s forwards'
    ].join(';');
    document.body.appendChild(ring2);

    // Warm-toned Pebble/Petal Burst (No blue or purple)
    var pebbleColors = ['#FFB830', '#FF4E8C', '#FFF4E0', '#FF781E'];
    for (var j = 0; j < 12; j++) {
      var pebble = document.createElement('div');
      var size = 4 + Math.random() * 6;
      var color = pebbleColors[Math.floor(Math.random() * pebbleColors.length)];
      var angle = Math.random() * Math.PI * 2;
      var velocity = 2 + Math.random() * 4;
      var vx = Math.cos(angle) * velocity;
      var vy = Math.sin(angle) * velocity;
      
      pebble.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:' + e.clientY + 'px',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'background:' + color,
        'border-radius:50%',
        'pointer-events:none',
        'z-index:10001',
        'box-shadow: 0 0 10px ' + color,
        'transition:transform 0.6s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.6s ease-out'
      ].join(';');
      
      document.body.appendChild(pebble);
      
      // Force reflow
      pebble.offsetHeight;
      
      pebble.style.transform = 'translate(' + (vx * 20) + 'px, ' + (vy * 20) + 'px) scale(0)';
      pebble.style.opacity = '0';
      
      (function(p) {
        setTimeout(function () { p.remove(); }, 650);
      })(pebble);
    }

    setTimeout(function () { ring.remove(); ring2.remove(); }, 900);
  }

  /* ── 6. HERO BADGE & TITLE SPLIT ────────────────────── */
  function initHeroEnhancements() {
    if (!document.body.classList.contains('theme-ln')) return;

    // Insert "✦ CO-OP ADVENTURE" badge before breadcrumb
    var heroContent = document.querySelector('.project-detail__hero-content');
    if (heroContent) {
      var badge = document.createElement('div');
      badge.className = 'ln-hero-badge';
      badge.textContent = '✦  CO-OP ADVENTURE';
      heroContent.insertBefore(badge, heroContent.firstChild);
    }

    // Split h1 into animated spans — Leo / & / Nora
    var h1 = document.querySelector('.project-title');
    if (h1) {
      h1.innerHTML = '<span class="ln-leo">Leo</span> <span class="ln-amp">&amp;</span> <span class="ln-nora">Nora</span>';
    }
  }

  /* ── INIT ──────────────────────────────────────────── */
  function init() {
    initEmbers();
    initSacredPulse();
    initLNCursor();
    initLNTrail();
    initHeroEnhancements();
    document.addEventListener('click', function(e) {
      if (!document.body.classList.contains('theme-ln')) return;
      // Never intercept nav/hamburger/mobile-menu clicks
      if (e.target.closest('.nav__hamburger, .nav__mobile-menu, .nav__mobile-link, .nav')) return;
      e.stopImmediatePropagation();
      lnClickEffect(e);
    }, true); // Use capture phase to intercept before other scripts
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
