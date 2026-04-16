/**
 * nav.js — Mobile navigation handler. Single source of truth.
 * VERSION: 3.0 — Root-cause fix for theme click intercepts.
 *
 * The bug: theme JS files register capture-phase click listeners
 * with e.stopImmediatePropagation(), blocking ALL other listeners.
 * Fix applied IN theme files (theme-nv/yami/uu/ln.js) to exempt nav.
 * This file handles the menu open/close + close button logic.
 */
(function () {
    'use strict';

    function init() {
        var hamburger  = document.getElementById('hamburger');
        var mobileMenu = document.getElementById('mobileMenu');
        var closeBtn   = document.getElementById('mobileClose');
        var mobileLinks = document.querySelectorAll('.nav__mobile-link');

        if (!hamburger || !mobileMenu) {
            console.warn('[NAV] Required elements not found — hamburger:', !!hamburger, 'menu:', !!mobileMenu);
            return;
        }

        // Prevent double-binding if somehow called twice
        if (hamburger.dataset.navBound === 'true') return;
        hamburger.dataset.navBound = 'true';

        function openMenu() {
            mobileMenu.classList.add('nav__mobile-menu--open');
            hamburger.classList.add('nav__hamburger--open');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenu.classList.remove('nav__mobile-menu--open');
            hamburger.classList.remove('nav__hamburger--open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        function toggleMenu() {
            mobileMenu.classList.contains('nav__mobile-menu--open') ? closeMenu() : openMenu();
        }

        // Hamburger — use mousedown so it fires before capture-phase click listeners
        hamburger.addEventListener('mousedown', function (e) {
            e.preventDefault(); // prevent focus ring on mouse
            toggleMenu();
        });

        // Touch support (mobile)
        hamburger.addEventListener('touchend', function (e) {
            e.preventDefault();
            toggleMenu();
        });

        // Close button inside the menu
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                closeMenu();
            });
            closeBtn.addEventListener('touchend', function (e) {
                e.preventDefault();
                closeMenu();
            });
        }

        // Close when a nav link is tapped/clicked
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
            link.addEventListener('touchend', function (e) {
                e.preventDefault();
                closeMenu();
                // Brief delay to let the menu close before navigation fires
                var href = link.getAttribute('href');
                if (href) setTimeout(function () { window.location.href = href; }, 200);
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        // Close on outside click (bubbled, not captured)
        document.addEventListener('click', function (e) {
            if (!mobileMenu.classList.contains('nav__mobile-menu--open')) return;
            if (mobileMenu.contains(e.target)) return;
            if (hamburger.contains(e.target)) return;
            closeMenu();
        });

        console.log('[NAV] v3.0 initialized on', window.location.pathname);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
