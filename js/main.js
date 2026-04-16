/**
 * main.js — Entry point. Orchestrates loader, then fires siteReady.
 * Handles interactive homepage features: particle canvas, tooltips, progress bar, easter egg.
 */

(function () {
  'use strict';

  /* ── Loading screen ──────────────────────────────────────── */
  function initLoader() {
    const loader      = document.querySelector('.loader');
    const progressBar = document.querySelector('.loader__progress-bar');

    if (!loader) {
      setTimeout(fireReady, 50);
      return;
    }

    if (sessionStorage.getItem('loaderShown')) {
      loader.classList.add('loader--hidden');
      setTimeout(fireReady, 50);
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (progressBar) progressBar.style.width = '100%';
      });
    });

    setTimeout(function () {
      loader.classList.add('loader--hidden');
      sessionStorage.setItem('loaderShown', '1');
      fireReady();
    }, 1900);
  }

  function fireReady() {
    document.dispatchEvent(new CustomEvent('siteReady'));
  }

  /* ── Fix: Force hero video to load and play ────────────── */
  function forceVideoPlay() {
    const heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
      heroVideo.load();
      heroVideo.play().catch(function (err) {
        console.log('Video autoplay failed:', err);
      });
    }
  }

  /* ── Lightbox (For Project Pages) ────────────────────────── */
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.project-gallery__item');
    if (!galleryItems.length) return;
    
    // Existing lightbox code inline for project pages is handled there, but we ensure no breaks.
  }

  /* ── Navbar Scroll Progress ──────────────────────────────── */
  function initNavProgress() {
    const bar = document.getElementById('navProgress');
    const glow = document.getElementById('navProgressGlow');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      bar.style.width = pct + '%';
      
      if (pct >= 99) {
        glow.style.opacity = '1';
        setTimeout(() => glow.style.opacity = '0', 300);
      } else {
        glow.style.opacity = '0';
      }
    }, {passive:true});
  }

  /* ── Hero Constellation Canvas ───────────────────────────── */
  function initConstellation() {
    const canvas = document.getElementById('hero-constellation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const colors = ['#7B61FF', '#00F5D4', '#FF2D6B']; // Violet, Cyan, Magenta
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const maxParticles = isTouch ? 25 : 60;
    
    let mouse = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for(let i=0; i<maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      
      for(let i=0; i<maxParticles; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < 0) p.x = width;  if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        // Mouse repelling
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 200) {
          let force = (200 - dist) / 200;
          p.x += (dx/dist) * force * 2;
          p.y += (dy/dist) * force * 2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for(let j=i+1; j<maxParticles; j++) {
            let p2 = particles[j];
            let dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if(dist2 < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255,255,255,${(120 - dist2)/120 * 0.15})`;
                ctx.stroke();
            }
        }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── Interactive Ticker Tooltips ─────────────────────────── */
  function initTickerTooltips() {
    const items = document.querySelectorAll('.marquee__item[data-tooltip]');
    if (!items.length) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'ticker-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.background = 'var(--surface-high)';
    tooltip.style.color = 'var(--text-primary)';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = 'var(--radius-tag)';
    tooltip.style.border = '1px solid var(--accent)';
    tooltip.style.fontFamily = 'var(--font-mono)';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.boxShadow = 'var(--shadow-accent)';
    document.body.appendChild(tooltip);

    let fadeTimeout;

    items.forEach(item => {
      item.style.cursor = 'pointer'; // Even with custom cursor, show intent
      item.addEventListener('click', (e) => {
        const text = item.getAttribute('data-tooltip');
        tooltip.textContent = text;
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top = (e.clientY - 40) + 'px';
        tooltip.style.opacity = '1';
        
        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
          tooltip.style.opacity = '0';
        }, 3000);
      });
    });

    const track = document.querySelector('.marquee__track');
    if (track) {
      track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
      track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }
  }

  /* ── Konami Easter Egg (Part 4) ────────────────────────── */
  function initKonami() {
    const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
      if (e.key === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          triggerEasterEgg();
        }
      } else {
        konamiIndex = 0;
      }
    });

    function triggerEasterEgg() {
      // Screen Shake
      document.body.style.animation = 'screenShake 0.3s ease';
      setTimeout(function() { document.body.style.animation = ''; }, 300);

      const terminal = document.createElement('div');
      terminal.style.cssText = `
        position:fixed; bottom:0; left:0; right:0; height:220px;
        background:#050508; border-top:1px solid #7B61FF;
        z-index:9998; font-family:"JetBrains Mono",monospace;
        font-size:13px; color:#00F5D4; padding:1.5rem;
        animation:terminalSlideUp 0.4s ease forwards;
        box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
      `;
      
      const lines = [
        '> KONAMI CODE DETECTED — WELCOME, DEVELOPER',
        '> INITIALIZING DEBUG MODE...',
        '> LOADING WORLD_01... ████████░░ 80%',
        '> COMPILING SHADERS... DONE',
        '> RENDER THREAD ACTIVE — 144FPS LOCKED',
        '> LUMEN GI ENABLED — BOUNCES: INFINITE',
        '> NANITE VIRTUALIZED GEOMETRY — ONLINE',
        '> ALL SYSTEMS NOMINAL. YOU FOUND THE SECRET. ✓'
      ];
      
      let i = 0;
      function printLine() {
        if (i >= lines.length) return;
        const lineEl = document.createElement('div');
        lineEl.textContent = lines[i];
        terminal.appendChild(lineEl);
        terminal.scrollTop = terminal.scrollHeight;
        i++;
        setTimeout(printLine, 280);
      }
      
      printLine();
      document.body.appendChild(terminal);
      
      setTimeout(function() {
        terminal.style.transition = 'opacity 0.4s ease';
        terminal.style.opacity = '0';
        setTimeout(function() { terminal.remove(); }, 400);
      }, 3500);
    }
  }


  /* ── Page Scroll HUD Progress Bar ────────────────────────── */
  function initGlobalScrollHUD() {
    // Desktop only — mobile already has the nav progress bar
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const scrollBar = document.createElement('div');
    scrollBar.style.cssText = 'position:fixed; right:0; top:0; width:3px; height:0%; background:linear-gradient(to bottom,#7B61FF,#00F5D4); z-index:9998; transition:height 0.05s linear;';
    document.body.appendChild(scrollBar);

    window.addEventListener('scroll', function() {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      let pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      scrollBar.style.height = pct + '%';
    }, {passive:true});
  }

  /* ── Run on DOMContentLoaded ─────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initLoader();
    forceVideoPlay();
    initLightbox();
    initNavProgress();
    initConstellation();
    initTickerTooltips();
    initKonami();
    initGlobalScrollHUD();
  }

})();
