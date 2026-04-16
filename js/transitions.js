/**
 * transitions.js — Safe cinematic exit transitions (Split-Sandwich Engine)
 */

(function() {
  'use strict';

  function createSplitTransition(destinationTitle, href) {
    // 1. Check for existing panels to prevent layering bugs
    if (document.querySelector('.split-panel')) return;

    // 2. Create the two panels
    const top = document.createElement('div');
    const bot = document.createElement('div');
    const base = 'position:fixed; left:0; width:100%; background:#050508; z-index:9999; transform:translateY(-100%); transition:transform 0.45s cubic-bezier(0.76,0,0.24,1); pointer-events:none;';
    
    top.className = 'split-panel';
    bot.className = 'split-panel';

    // Top panel starts above, bottom panel starts below
    top.style.cssText = base + 'top:0; height:51%; transform:translateY(-100%);';
    bot.style.cssText = base + 'bottom:0; height:51%; transform:translateY(100%); transition:transform 0.45s cubic-bezier(0.76,0,0.24,1);';

    const label = document.createElement('div');
    label.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:10000; font-family:"Bebas Neue",sans-serif; font-size:clamp(2rem,7vw,6rem); color:#F0F0FF; letter-spacing:0.1em; opacity:0; transition:opacity 0.2s ease; pointer-events:none; white-space:nowrap;';
    label.textContent = destinationTitle;

    const line = document.createElement('div');
    line.style.cssText = 'position:fixed; top:50%; left:0; width:0%; height:2px; background:linear-gradient(90deg,#7B61FF,#00F5D4); z-index:10000; transform:translateY(-50%); transition:width 0.35s ease; pointer-events:none;';

    document.body.append(top, bot, label, line);

    // Initial state trigger
    requestAnimationFrame(() => {
      top.style.transform = 'translateY(0)';
      bot.style.transform = 'translateY(0)';
      
      setTimeout(() => { 
        label.style.opacity = '1'; 
        line.style.width = '100%'; 
      }, 300);
      
      setTimeout(() => { 
        window.location.href = href; 
      }, 650);
    });
  }

  // Handle all internal links
  function initTransitions() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      // Skip absolute, hash, or target="_blank" links
      if (!href || href.startsWith('http') || href.startsWith('#') || target === '_blank' || href.startsWith('mailto:')) {
        return;
      }

      // Allow CMD/CTRL click
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      e.preventDefault();
      const title = link.getAttribute('data-title') || 'NAVIGATING...';
      createSplitTransition(title, href);
    });
  }

  // Entrance Reveal (Fade-up)
  function initEntrance() {
    const main = document.querySelector('main');
    if (main) {
      main.style.opacity = '0';
      main.style.transform = 'translateY(16px)';
      main.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          main.style.opacity = '1';
          main.style.transform = 'translateY(0)';
        }, 100);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTransitions();
      initEntrance();
    });
  } else {
    initTransitions();
    initEntrance();
  }

})();
