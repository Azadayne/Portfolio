/**
 * scramble.js — Nav Link Character Scramble Effect
 */

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!%';

function scrambleText(el) {
  if (el.dataset.scrambling === 'true') return;
  el.dataset.scrambling = 'true';

  const original = el.textContent;
  let frame = 0;
  const totalFrames = 10;
  
  const interval = setInterval(function() {
    el.textContent = original.split('').map(function(char, i) {
      if (char === ' ') return ' ';
      
      // Gradually resolve characters from left to right
      if (frame / totalFrames > i / original.length) return original[i];
      
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    
    frame++;
    
    if (frame > totalFrames) {
      el.textContent = original;
      el.dataset.scrambling = 'false';
      clearInterval(interval);
    }
  }, 35);
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('nav a, .nav__link, .nav__logo').forEach(function(link) {
    link.addEventListener('mouseenter', function() {
      scrambleText(link);
    });
  });
});
