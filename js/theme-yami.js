/**
 * theme-yami.js — Yami Page Visual Engine
 * ALL functions guard with body class check. Zero bleed.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('theme-yami')) return;

  /* ── 1. BREATHING DARKNESS ───────────────────────────── */
  function initBreathingDark() {
    if (!document.body.classList.contains('theme-yami')) return;

    var breath = document.createElement('div');
    breath.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:50%',
      'width:40vmax',
      'height:40vmax',
      'background:radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 70%)',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:3',
      'animation:yamiBreath 8s ease-in-out infinite'
    ].join(';');
    document.body.appendChild(breath);
  }

  /* ── 2. SHADOW FIGURE ────────────────────────────────── */
  function initShadowFigure() {
    if (!document.body.classList.contains('theme-yami')) return;

    function appear() {
      var onLeft = Math.random() > 0.5;
      var figure = document.createElement('div');
      figure.style.cssText = [
        'position:fixed',
        'top:10%',
        onLeft ? 'left:0' : 'right:0',
        'width:3px',
        'height:70vh',
        'background:linear-gradient(to bottom, transparent, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.95) 70%, transparent)',
        'pointer-events:none',
        'z-index:9990',
        'opacity:0',
        'animation:shadowFlash 0.12s ease-in-out forwards'
      ].join(';');
      document.body.appendChild(figure);
      setTimeout(function () { figure.remove(); }, 140);
      setTimeout(appear, 15000 + Math.random() * 25000);
    }
    setTimeout(appear, 8000 + Math.random() * 8000);
  }

  /* ── 3. LANTERN FLICKER ──────────────────────────────── */
  function initLanternFlicker() {
    if (!document.body.classList.contains('theme-yami')) return;

    var lantern = document.createElement('div');
    lantern.style.cssText = [
      'position:fixed',
      'top:0',
      'left:50%',
      'transform:translateX(-50%)',
      'width:300px',
      'height:200px',
      'background:radial-gradient(ellipse at 50% 0%, rgba(180,100,20,0.08) 0%, transparent 70%)',
      'pointer-events:none',
      'z-index:2'
    ].join(';');
    document.body.appendChild(lantern);

    function flicker() {
      var intensity = 0.02 + Math.random() * 0.1;
      var duration  = 60 + Math.random() * 200;
      lantern.style.opacity = intensity.toString();
      setTimeout(flicker, duration);
    }
    flicker();
  }

  /* ── 4. SPIRIT EYE CURSOR ────────────────────────────── */
  function initYamiCursor() {
    if (!document.body.classList.contains('theme-yami')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';

    var cursor = document.createElement('div');
    cursor.id = 'yami-cursor';
    cursor.classList.add('theme-cursor-element');
    cursor.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:100000',
      'transform:translate(-50%,-50%)',
      'mix-blend-mode:difference',
      'opacity:0',
      'transition:transform 0.08s ease, opacity 0.2s ease'
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

    // Blinking: the eye closes and reopens every 3–9 seconds
    var blinkTimer;
    function scheduleBlink() {
      var delay = 3000 + Math.random() * 6000;
      blinkTimer = setTimeout(function () {
        cursor.style.transform = 'translate(-50%,-50%) scaleY(0.05)';
        setTimeout(function () {
          cursor.style.transform = 'translate(-50%,-50%) scaleY(1)';
          scheduleBlink();
        }, 120);
      }, delay);
    }
    scheduleBlink();

    document.addEventListener('mousemove', function (e) {
      cursor.style.left    = e.clientX + 'px';
      cursor.style.top     = e.clientY + 'px';
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
    });

    var iris  = cursor.querySelector('circle:nth-child(3)');
    var pupil = cursor.querySelector('circle:last-child');

    document.querySelectorAll('a, button, .btn').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.5)';
        if (iris)  iris.setAttribute('fill',  'rgba(192,0,26,1)');
        if (pupil) pupil.setAttribute('fill', 'rgba(232,224,208,1)');
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        if (iris)  iris.setAttribute('fill',  'rgba(192,0,26,0.9)');
        if (pupil) pupil.setAttribute('fill', 'rgba(232,224,208,0.9)');
      });
    });
  }

  /* ── 5. GHOST EYE TRAIL ──────────────────────────────── */
  function initYamiTrail() {
    if (!document.body.classList.contains('theme-yami')) return;

    var trailOpacities = [0.3, 0.15, 0.06];
    var delays = [50, 110, 190];

    var trails = trailOpacities.map(function (opacity, i) {
      var t = document.createElement('div');
      t.classList.add('theme-cursor-element');
      t.style.cssText = [
        'position:fixed',
        'pointer-events:none',
        'z-index:99997',
        'transform:translate(-50%,-50%)',
        'opacity:' + opacity,
        'transition:left ' + delays[i] + 'ms linear, top ' + delays[i] + 'ms linear',
        'filter:blur(' + (i * 0.8) + 'px)',
        'mix-blend-mode:difference'
      ].join(';');
      t.innerHTML = [
        '<svg width="40" height="24" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M2 12 Q20 2 38 12 Q20 22 2 12 Z" fill="none" stroke="rgba(232,224,208,0.8)" stroke-width="0.8"/>',
          '<circle cx="20" cy="12" r="5" fill="none" stroke="rgba(232,224,208,0.6)" stroke-width="0.8"/>',
          '<circle cx="20" cy="12" r="2.5" fill="rgba(192,0,26,0.7)"/>',
        '</svg>'
      ].join('');
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

  /* ── 6. INK BURST CLICK EFFECT ───────────────────────── */
  function yamiClickEffect(e) {
    if (!document.body.classList.contains('theme-yami')) return;

    // Three expanding pale rings — cold and spreading
    [0, 100, 200].forEach(function (delay, i) {
      var ink   = document.createElement('div');
      var sizes = [60, 100, 140];
      var bord  = (1.5 - i * 0.4).toFixed(1);
      var alpha = (0.5 - i * 0.15).toFixed(2);
      ink.style.cssText = [
        'position:fixed',
        'left:' + e.clientX + 'px',
        'top:' + e.clientY + 'px',
        'width:0',
        'height:0',
        'border-radius:50%',
        'border:' + bord + 'px solid rgba(232,224,208,' + alpha + ')',
        'transform:translate(-50%,-50%)',
        'pointer-events:none',
        'z-index:9998',
        '--target-size:' + sizes[i] + 'px',
        'animation:inkSpread 0.8s cubic-bezier(0.1,0.6,0.3,1) ' + delay + 'ms forwards'
      ].join(';');
      document.body.appendChild(ink);
      setTimeout(function () { ink.remove(); }, 1000 + delay);
    });

    // Blood red center mark
    var mark = document.createElement('div');
    mark.style.cssText = [
      'position:fixed',
      'left:' + e.clientX + 'px',
      'top:' + e.clientY + 'px',
      'width:4px',
      'height:4px',
      'background:#C0001A',
      'border-radius:50%',
      'transform:translate(-50%,-50%)',
      'pointer-events:none',
      'z-index:10000',
      'animation:inkMark 1.2s ease-out forwards'
    ].join(';');
    document.body.appendChild(mark);
    setTimeout(function () { mark.remove(); }, 1250);

    // Kanji whisper
    var kanji = ['闇','死','影','鬼','怖','夜','罪','呪'];
    var char  = kanji[Math.floor(Math.random() * kanji.length)];
    var whisper = document.createElement('div');
    var wx = e.clientX + (Math.random() - 0.5) * 40;
    var wy = e.clientY - 20 + (Math.random() - 0.5) * 20;
    whisper.style.cssText = [
      'position:fixed',
      'left:' + wx + 'px',
      'top:' + wy + 'px',
      'font-family:serif',
      'font-size:18px',
      'color:rgba(192,0,26,0.7)',
      'pointer-events:none',
      'z-index:10001',
      'transform:translate(-50%,-50%)',
      'animation:kanjiWhisper 1.4s ease-out forwards'
    ].join(';');
    whisper.textContent = char;
    document.body.appendChild(whisper);
    setTimeout(function () { whisper.remove(); }, 1450);
  }

  /* ── 7. EDGE DARKNESS ────────────────────────────────── */
  function initEdgeDarkness() {
    if (!document.body.classList.contains('theme-yami')) return;

    var leftEdge = document.createElement('div');
    leftEdge.style.cssText = [
      'position:fixed',
      'left:0',
      'top:0',
      'width:15%',
      'height:100%',
      'background:linear-gradient(to right, rgba(0,0,0,0.6), transparent)',
      'pointer-events:none',
      'z-index:5',
      'opacity:0',
      'transition:opacity 0.4s ease'
    ].join(';');

    var rightEdge = document.createElement('div');
    rightEdge.style.cssText = [
      'position:fixed',
      'right:0',
      'top:0',
      'width:15%',
      'height:100%',
      'background:linear-gradient(to left, rgba(0,0,0,0.6), transparent)',
      'pointer-events:none',
      'z-index:5',
      'opacity:0',
      'transition:opacity 0.4s ease'
    ].join(';');

    document.body.appendChild(leftEdge);
    document.body.appendChild(rightEdge);

    document.addEventListener('mousemove', function (e) {
      var pct = e.clientX / window.innerWidth;
      leftEdge.style.opacity  = pct < 0.15 ? String(((0.15 - pct) / 0.15).toFixed(3)) : '0';
      rightEdge.style.opacity = pct > 0.85 ? String(((pct - 0.85) / 0.15).toFixed(3)) : '0';
    });
  }

  /* ── 8. HERO ENHANCEMENTS ────────────────────────────── */
  function initHeroEnhancements() {
    if (!document.body.classList.contains('theme-yami')) return;

    // Add Japanese subtitle — 「生き残れ」 (survive)
    var tagline = document.querySelector('.project-tagline');
    if (tagline) {
      var jp = document.createElement('span');
      jp.className   = 'yami-japanese-subtitle';
      jp.textContent = '「生き残れ」';
      tagline.appendChild(jp);
    }

    // Red wound line centered in hero
    var hero = document.querySelector('.project-detail__hero');
    if (hero) {
      var wound = document.createElement('div');
      wound.className = 'yami-hero-wound';
      wound.setAttribute('aria-hidden', 'true');
      hero.appendChild(wound);
    }
  }

  /* ── 9. OVERRIDE GLOBAL CLICK EFFECTS ───────────────── */
  function initClickOverride() {
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('theme-yami')) return;
      // Never intercept nav/hamburger/mobile-menu clicks
      if (e.target.closest('.nav__hamburger, .nav__mobile-menu, .nav__mobile-link, .nav')) return;
      e.stopImmediatePropagation();
      yamiClickEffect(e);
    }, true);
  }
  /* ── 10. FALLING CURSED PETALS ───────────────────────── */
  function initAtmosphere() {
    if (!document.body.classList.contains('theme-yami')) return;
    var canvas = document.getElementById('yami-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    
    function setSize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setSize();
    window.addEventListener('resize', setSize);

    var colors = [
      'rgba(192, 0, 26, ',   // Blood Red
      'rgba(232, 224, 208, ', // Parchment
      'rgba(3, 3, 3, ',      // Void Black
      'rgba(74, 63, 47, '    // Tatami Brown
    ];

    var particles = Array.from({ length: 45 }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 3,
        speedY: 0.4 + Math.random() * 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        opacity: 0.15 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        // Irregular withered petal shape
        ctx.moveTo(-p.size, 0);
        ctx.quadraticCurveTo(0, -p.size * 1.2, p.size, 0);
        ctx.quadraticCurveTo(0, p.size * 0.8, -p.size, 0);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();
        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.2;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── INIT ────────────────────────────────────────────── */
  function init() {
    initBreathingDark();
    initShadowFigure();
    initLanternFlicker();
    initYamiCursor();
    initYamiTrail();
    initHeroEnhancements();
    initEdgeDarkness();
    initClickOverride();
    initAtmosphere();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
