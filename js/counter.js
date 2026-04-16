/**
 * counter.js — Animated stat counters that count up from 0 on scroll
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Easing function — ease out quad
   */
  function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }

  /**
   * Animate a counter element from 0 to target value
   * @param {HTMLElement} el  — The element whose textContent to update
   * @param {number}      target — End value
   * @param {number}      duration — Duration in ms
   * @param {string}      suffix — e.g. '+' or ''
   */
  function animateCounter(el, target, duration, suffix) {
    if (prefersReduced) {
      el.textContent = target + (suffix || '');
      return;
    }

    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = current + (suffix || '');

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Initialize counters — observe them with IntersectionObserver
   */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el      = entry.target;
          const target  = parseInt(el.dataset.counter, 10);
          const suffix  = el.dataset.suffix || '';
          const duration = parseInt(el.dataset.duration, 10) || 1800;

          animateCounter(el, target, duration, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }

})();
