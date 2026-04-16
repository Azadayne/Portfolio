/**
 * project.js — Handles the heavy cinematic interactions for project detail pages.
 * - Scroll-driven Title watermark
 * - 4-Act Scrollytelling Reel
 * - Typewriter Terminal
 * - Canvas Tech Nodes
 */



document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Theme Bleed flash on load
    const bleed = document.querySelector('.theme-bleed');
    if (bleed) {
        setTimeout(() => bleed.classList.add('flash'), 100);
        setTimeout(() => bleed.classList.remove('flash'), 1100);
    }

    // 2. Cinematic Title Scroll
    const watermark = document.querySelector('.hero-watermark');
    const heroContent = document.querySelector('.project-detail__hero-content');
    if (watermark && heroContent) {
        window.addEventListener('scroll', () => {
            let sc = window.scrollY;
            let wh = window.innerHeight;
            
            // Calculate progress (capped at 1)
            let progress = Math.min(1, sc / wh); 
            
            // Enhanced curve: Fades out completely by 70% of hero height
            let op = 0.1 * (1 - (progress * 1.4)); 
            let scale = 1 + (0.2 * progress);
            let spacing = progress * 50; // Expands as it fades
            
            if (sc <= wh + 50) {
                watermark.style.transform = `translate(-50%, -50%) scale(${scale})`;
                watermark.style.opacity = Math.max(0, op);
                watermark.style.letterSpacing = `${spacing}px`;
                
                heroContent.style.opacity = Math.max(0, 1 - (progress * 2));
                heroContent.style.transform = `translateY(${progress * 100}px)`;
            } else {
                // Hard reset when completely past hero
                watermark.style.opacity = 0;
                heroContent.style.opacity = 0;
            }
        }, {passive:true});
    }

    // 3. Experience Reel
    const reel = document.querySelector('.experience-reel');
    if (reel) {
        const medias = document.querySelectorAll('.reel-media');
        const texts = document.querySelectorAll('.reel-text');
        const dots = document.querySelectorAll('.reel-dot');

        window.addEventListener('scroll', () => {
            let rect = reel.getBoundingClientRect();
            // If reel top is past screen top, and bottom is still below screen top
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                let traveled = Math.abs(rect.top);
                let totalScrollable = rect.height - window.innerHeight;
                let progress = traveled / totalScrollable; // 0 to 1
                
                // Map progress to 4 acts (0,1,2,3)
                let act = Math.min(3, Math.floor(progress * 4));
                
                medias.forEach((m, i) => m.classList.toggle('active', i === act));
                texts.forEach((t, i) => t.classList.toggle('active', i === act));
                dots.forEach((d, i) => d.classList.toggle('active', i === act));
            } else if (rect.top > 0) {
                // Above the reel
                medias.forEach((m, i) => m.classList.toggle('active', i === 0));
                texts.forEach((t, i) => t.classList.toggle('active', i === 0));
                dots.forEach((d, i) => d.classList.toggle('active', i === 0));
            }
        }, {passive:true});
    }

    // 4. Fake Terminal Output
    const terminalLines = document.querySelectorAll('.terminal-line[data-typewriter]');
    if (terminalLines.length > 0) {
        let terminalStarted = false;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !terminalStarted) {
                terminalStarted = true;
                playTypewriter();
            }
        }, { threshold: 0.5 });
        
        var terminalBox = document.querySelector('.terminal-box');
        if (terminalBox) observer.observe(terminalBox);

        function playTypewriter() {
            let currentLine = 0;
            
            function typeLine() {
                if (currentLine >= terminalLines.length) return;
                
                const line = terminalLines[currentLine];
                const fullHTML = line.getAttribute('data-typewriter');
                line.style.display = 'block';
                line.innerHTML = ''; // Clear for typing
                
                // Extremely rudimentary DOM-safe typing by chunking text/span tags
                // For safety and speed in this demo, we'll just slice the raw HTML.
                // A better engine would parse nodes. We'll simply chunk by character, jumping brackets.
                let i = 0;
                let isTag = false;
                let typed = '';
                
                let speed = parseInt(line.getAttribute('data-speed') || "30");

                function nextChar() {
                    if (i < fullHTML.length) {
                        if (fullHTML[i] === '<') isTag = true;
                        typed += fullHTML[i];
                        if (fullHTML[i] === '>') isTag = false;
                        
                        i++;
                        if (isTag) {
                            nextChar(); // skip instantly through html tags
                        } else {
                            line.innerHTML = typed;
                            setTimeout(nextChar, speed);
                        }
                    } else {
                        currentLine++;
                        if (currentLine < terminalLines.length) {
                            setTimeout(typeLine, 100);
                        }
                    }
                }
                nextChar();
            }
            // Hide all lines initially
            terminalLines.forEach(l => l.style.display = 'none');
            typeLine();
        }
    }

    // 5. Tech Breakdown Reveals
    const techBreakdown = document.querySelector('.tech-breakdown');
    if (techBreakdown) {
        const cards = techBreakdown.querySelectorAll('.tech-card');
        
        const cardObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('reveal--visible');
                    }, index * 120); // 120ms stagger
                });
                cardObserver.unobserve(techBreakdown);
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        cardObserver.observe(techBreakdown);
    }

    // 6. Awards Sequences (Glorious Overhaul)
    const awardSect = document.querySelector('.award-cinematic');
    if (awardSect) {
        const particleContainer = document.getElementById('awardParticles');
        
        function initAwardParticles() {
            if (!particleContainer) return;
            for (let i = 0; i < 40; i++) {
                const p = document.createElement('div');
                p.style.position = 'absolute';
                p.style.width = Math.random() * 4 + 2 + 'px';
                p.style.height = p.style.width;
                p.style.background = 'rgba(123, 97, 255, 0.4)';
                p.style.borderRadius = '50%';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.filter = 'blur(2px)';
                
                // Animation properties
                const duration = Math.random() * 5 + 5;
                const delay = Math.random() * 2;
                p.style.animation = `float-particle ${duration}s ${delay}s ease-in-out infinite`;
                
                particleContainer.appendChild(p);
            }
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                awardSect.classList.add('reveal--visible');
                initAwardParticles();
                observer.unobserve(awardSect);
            }
        }, { threshold: 0.3 });
        observer.observe(awardSect);
    }

});
