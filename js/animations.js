/**
 * animations.js — Scroll reveal, parallax, process timeline, hero entrance
 */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Hero entrance ───────────────────────────────────────── */
  function initHeroEntrance() {
    const heroEls = document.querySelectorAll('.hero__label, .hero__title, .hero__subtitle, .hero__cta-group');
    if (!heroEls.length) return;

    heroEls.forEach(function (el, i) {
      const delay = (i * 0.2) + 0.3; // stagger after loader: 0.3, 0.5, 0.7, 0.9
      el.style.transitionDelay = delay + 's';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    });

    // Trigger after a tick to ensure loader has fired
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroEls.forEach(function (el) {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }

  /* ── Generic scroll reveal ───────────────────────────────── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (prefersReduced) {
      revealEls.forEach(function (el) {
        el.classList.add('reveal--visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Skill card stagger ──────────────────────────────────── */
  function initSkillCards() {
    const cards = document.querySelectorAll('.skill-card');
    if (!cards.length) return;

    if (prefersReduced) {
      cards.forEach(function (c) {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const card  = entry.target;
          const index = parseInt(card.dataset.cardIndex || 0, 10);
          const delay = index * 0.08;

          setTimeout(function () {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, delay * 1000);

          observer.unobserve(card);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card, i) {
      card.dataset.cardIndex = i;
      observer.observe(card);
    });
  }

  /* ── Process steps ───────────────────────────────────────── */
  function initProcessSteps() {
    const steps   = document.querySelectorAll('.process-step');
    const lineFill = document.querySelector('.process__line-fill');
    if (!steps.length) return;

    if (prefersReduced) {
      steps.forEach(function (s) { s.classList.add('process-step--visible'); });
      if (lineFill) lineFill.style.width = '100%';
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          steps.forEach(function (step, i) {
            setTimeout(function () {
              step.classList.add('process-step--visible');
            }, i * 150);
          });

          if (lineFill) {
            setTimeout(function () {
              lineFill.classList.add('animate');
            }, 200);
          }

          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (steps[0]) observer.observe(steps[0]);
  }

  /* ── Parallax ────────────────────────────────────────────── */
  function initParallax() {
    if (prefersReduced) return;

    // Disable on touch devices: parallax wastes battery with no visual payoff
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const heroBg = document.querySelector('.hero__bg-inner');
    const projectImages = document.querySelectorAll('.project-placeholder');

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    function updateParallax() {
      const scrollY = window.scrollY;

      // Hero parallax at 40% scroll speed
      if (heroBg) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.4) + 'px)';
        heroBg.style.willChange = 'transform';
      }

      // Project image parallax at 20% scroll speed
      projectImages.forEach(function (img) {
        const rect   = img.parentElement.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        img.style.transform = 'translateY(' + (center * 0.20) + 'px)';
        img.style.willChange = 'transform';
      });

      ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Navigation scroll state ─────────────────────────────── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    function updateNav() {
      if (window.scrollY > 80) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // run on init
  }



  /* ── Smooth scroll for anchor links ─────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Project panel reveal ────────────────────────────────── */
  function initProjectPanels() {
    const panels = document.querySelectorAll('.project-panel');
    if (!panels.length || prefersReduced) return;

    // Panels reveal their info from side
    const infoSections = document.querySelectorAll('.project-panel__info');
    const mediaSection = document.querySelectorAll('.project-panel__media');

    infoSections.forEach(function (info, i) {
      info.style.opacity   = '0';
      info.style.transform = (i % 2 === 0) ? 'translateX(40px)' : 'translateX(-40px)';
      info.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
    });

    mediaSection.forEach(function (media) {
      media.style.opacity   = '0';
      media.style.transition = 'opacity 1s ease 0.1s';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translate(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    infoSections.forEach(function (el) { observer.observe(el); });
    mediaSection.forEach(function (el) { observer.observe(el); });
  }

  /* ── Run all inits ───────────────────────────────────────── */
  function init() {
    initHeroEntrance();
    initScrollReveal();
    initSkillCards();
    initProcessSteps();
    initParallax();
    initNav();
    initSmoothScroll();
    initProjectPanels();
  }

  // Listen for custom event fired by main.js after loader completes
  document.addEventListener('siteReady', init);

})();
