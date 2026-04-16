/**
 * ripple.js — Button Click Feedback & Sonar Pulses
 */

// 1. Primary Button Ripple
function createRipple(e, btn) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 3; // 3x larger
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-element';
  ripple.style.cssText = `
    position:absolute;
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    border-radius:50%;
    background:radial-gradient(circle, rgba(0,245,212,0.4) 0%, rgba(123,97,255,0.15) 60%, transparent 100%);
    transform:scale(0);
    animation:rippleOut 0.7s cubic-bezier(0.2,0.8,0.4,1) forwards;
    pointer-events:none;
    z-index: 0;
  `;
  
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  
  // Second outer ring chase
  const ring = document.createElement('span');
  ring.style.cssText = `
    position:absolute;
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    border-radius:50%;
    border:2px solid rgba(0,245,212,0.5);
    transform:scale(0);
    animation:rippleOut 0.7s cubic-bezier(0.2,0.8,0.4,1) 80ms forwards;
    pointer-events:none;
    z-index: 1;
  `;
  btn.appendChild(ring);
  
  setTimeout(function() { 
    ripple.remove(); 
    ring.remove();
  }, 850);
}

// 2. Sonar Pulse for Play Buttons & Indicators
function sonarPulse(el) {
  [0, 120, 240].forEach(function(delay) {
    const ring = document.createElement('span');
    ring.style.cssText = `
      position:absolute;
      inset:-4px;
      border-radius:50%;
      border:2px solid rgba(0,245,212,${delay === 0 ? 0.8 : delay === 120 ? 0.4 : 0.15});
      animation:sonarRing 0.7s ease-out ${delay}ms forwards;
      pointer-events:none;
      z-index: 10;
    `;
    el.style.position = 'relative';
    el.appendChild(ring);
    setTimeout(function() { 
      ring.remove(); 
    }, 900 + delay);
  });
}

// Attach Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Primary Ripples & Scaling
  document.querySelectorAll('.btn-primary, .btn, button, .interactive-tap').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      createRipple(e, btn);
      
      // Haptic bounce
      btn.style.transition = 'transform 0.1s ease';
      btn.style.transform = 'scale(0.95)';
      
      setTimeout(function() {
        btn.style.transform = 'scale(1.03)';
        setTimeout(function() { 
          btn.style.transform = 'scale(1)'; 
        }, 120);
      }, 80);
    });
  });

  // Ghost Button Flood
  document.querySelectorAll('.btn-ghost, .btn-outline, .btn--secondary').forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.style.transition = 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease';
      btn.style.background = 'rgba(123,97,255,0.2)';
      btn.style.borderColor = '#7B61FF';
      btn.style.color = '#F0F0FF';
      
      setTimeout(function() {
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 400);
    });
  });

  // Sonar Trigger
  document.querySelectorAll('.play-btn, .scroll-indicator, .hero__scroll, .hero__scroll-indicator').forEach(function(el) {
    el.addEventListener('click', function() { 
      sonarPulse(el); 
    });
  });

  // Magnetic Button Attraction
  document.querySelectorAll('.btn-primary, .btn-ghost, .btn, .case-link, .nav__link').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      if (distance < 80) {
        const deltaX = (e.clientX - centerX) * 0.25;
        const deltaY = (e.clientY - centerY) * 0.25;
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        btn.style.transition = 'transform 0.15s ease';
      } else {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
});
