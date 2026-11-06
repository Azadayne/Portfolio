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
        }, { passive: true });
    }

    // 3. Experience Reel & Universal Video Controls
    function formatVideoTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateControlsUI(video) {
        const container = video.closest('.reel-media, .rps-video-hero') || video.parentElement;
        if (!container) return;

        const playBtn = container.querySelector('.video-play-btn');
        const timeDisplay = container.querySelector('.video-time-display');
        const seekSlider = container.querySelector('.video-seek-slider');
        const volSlider = container.querySelector('.video-volume-slider');
        const volBtn = container.querySelector('.video-vol-btn');

        // Play/Pause icon
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            if (icon) {
                icon.className = video.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
            }
            playBtn.setAttribute('title', video.paused ? 'Play' : 'Pause');
            playBtn.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
        }

        // Time display & Seek slider
        if (video.duration && !isNaN(video.duration)) {
            if (timeDisplay) {
                timeDisplay.textContent = `${formatVideoTime(video.currentTime)} / ${formatVideoTime(video.duration)}`;
            }
            if (seekSlider && !seekSlider.dataset.isDragging) {
                const pct = (video.currentTime / video.duration) * 100;
                seekSlider.value = pct;
                seekSlider.style.setProperty('--seek-pct', `${pct}%`);
            }
        }

        // Volume slider & Mute/Unmute icon & Readout
        const isMuted = (video.muted || video.volume === 0);
        if (volSlider && !volSlider.dataset.isDragging) {
            const effectiveVol = isMuted ? 0 : video.volume;
            volSlider.value = effectiveVol;
            volSlider.style.setProperty('--vol-pct', `${effectiveVol * 100}%`);
        }

        const volPct = container.querySelector('.video-volume-pct');
        if (volPct) {
            volPct.textContent = isMuted ? 'MUTE' : `${Math.round(video.volume * 100)}%`;
        }

        if (volBtn) {
            const icon = volBtn.querySelector('i');
            if (icon) {
                if (isMuted) {
                    icon.className = 'fa-solid fa-volume-xmark';
                } else if (video.volume < 0.4) {
                    icon.className = 'fa-solid fa-volume-low';
                } else {
                    icon.className = 'fa-solid fa-volume-high';
                }
            }
            volBtn.setAttribute('title', isMuted ? 'Unmute audio' : 'Mute audio');
            volBtn.setAttribute('aria-label', isMuted ? 'Unmute audio' : 'Mute audio');
        }
    }

    function playVideo(video) {
        if (!video) return;

        // Initialize audio state (unmuted, volume 0.8)
        if (!video.dataset.hasInitializedAudio) {
            video.muted = false;
            video.volume = 0.8;
            video.dataset.lastVolume = "0.8";
            video.dataset.hasInitializedAudio = "true";
        }

        const container = video.closest('.reel-media, .rps-video-hero') || video.parentElement;
        if (container) container.classList.add('is-playing');

        const p = video.play();
        if (p !== undefined) {
            p.then(() => {
                updateControlsUI(video);
            }).catch(() => {
                // Browser autoplay policy restricted unmuted playback without prior user gesture
                // Fall back to muted playback so visual playback continues
                video.muted = true;
                video.play().catch(() => { });
                updateControlsUI(video);

                // Unmute automatically on first user interaction anywhere
                const unlockAudio = () => {
                    video.muted = false;
                    video.volume = parseFloat(video.dataset.lastVolume || '0.8');
                    updateControlsUI(video);
                    ['click', 'keydown', 'touchstart'].forEach(evt => {
                        window.removeEventListener(evt, unlockAudio);
                    });
                };
                ['click', 'keydown', 'touchstart'].forEach(evt => {
                    window.addEventListener(evt, unlockAudio, { once: true, passive: true });
                });
            });
        }
        updateControlsUI(video);
    }

    function pauseVideo(video) {
        if (!video) return;
        if (!video.paused) {
            video.pause();
        }
        const container = video.closest('.reel-media, .rps-video-hero') || video.parentElement;
        if (container) container.classList.remove('is-playing');
        updateControlsUI(video);
    }

    // Track last known pointer position globally for immediate fullscreen cursor snapping
    let lastPointerX = window.innerWidth / 2;
    let lastPointerY = window.innerHeight / 2;
    window.addEventListener('pointermove', (e) => {
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
    }, { passive: true, capture: true });

    function isAnyFullscreenActive() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
    }

    function syncFullscreenThemeCursors() {
        const fsElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        const cursors = document.querySelectorAll('#rps-custom-cursor, #ub-cursor-ring, #ln-cursor, #uu-cursor, #yami-cursor, #nv-cursor');

        let target = fsElem;
        if (target && target.tagName === 'VIDEO' && target.parentElement) {
            target = target.parentElement;
        }

        cursors.forEach(cur => {
            if (target) {
                if (cur.parentElement !== target) {
                    target.appendChild(cur);
                }
            } else {
                if (cur.parentElement !== document.body) {
                    document.body.appendChild(cur);
                }
            }
            cur.classList.remove('is-hidden');
            cur.style.opacity = '1';
            cur.style.visibility = 'visible';
        });

        // Synthesize pointer event with last known coordinates so active cursor repositions immediately
        try {
            const synEvt = new PointerEvent('pointermove', {
                clientX: lastPointerX,
                clientY: lastPointerY,
                bubbles: true,
                cancelable: false
            });
            window.dispatchEvent(synEvt);
        } catch (e) { }
    }

    function initCustomVideoPlayers() {
        const videos = document.querySelectorAll('video');
        if (!videos.length) return;

        videos.forEach(video => {
            const container = video.closest('.reel-media, .rps-video-hero') || video.parentElement;
            if (!container) return;

            // Make sure video does not autoplay on load
            video.autoplay = false;
            video.dataset.lastVolume = "0.8";
            video.dataset.savedVolume = "0.8";

            // Custom Controls Bar
            let controls = container.querySelector('.custom-video-controls');
            if (!controls) {
                controls = document.createElement('div');
                controls.className = 'custom-video-controls';
                controls.innerHTML = `
                  <button class="video-ctrl-btn video-play-btn" type="button" aria-label="Play" title="Play">
                    <i class="fa-solid fa-play"></i>
                  </button>
                  <span class="video-time-display">0:00 / 0:00</span>
                  <div class="video-seek-wrap">
                    <input type="range" class="video-seek-slider" min="0" max="100" step="0.1" value="0" aria-label="Timeline seek">
                  </div>
                  <div class="video-volume-group">
                    <button class="video-ctrl-btn video-vol-btn" type="button" aria-label="Mute audio" title="Mute audio">
                      <i class="fa-solid fa-volume-high"></i>
                    </button>
                    <div class="video-volume-popover">
                      <span class="video-volume-pct">80%</span>
                      <input type="range" class="video-volume-slider" min="0" max="1" step="0.02" value="0.8" aria-label="Volume level">
                    </div>
                  </div>
                  <button class="video-ctrl-btn video-fs-btn" type="button" aria-label="Toggle Fullscreen" title="Fullscreen">
                    <i class="fa-solid fa-expand"></i>
                  </button>
                `;
                container.appendChild(controls);
            }

            const playBtn = controls.querySelector('.video-play-btn');
            const seekSlider = controls.querySelector('.video-seek-slider');
            const volGroup = controls.querySelector('.video-volume-group');
            const volBtn = controls.querySelector('.video-vol-btn');
            let volPopover = controls.querySelector('.video-volume-popover');
            let volSlider = controls.querySelector('.video-volume-slider');
            let volPct = controls.querySelector('.video-volume-pct');
            const fsBtn = controls.querySelector('.video-fs-btn');

            // Ensure .video-volume-popover and .video-volume-pct exist even in pre-existing static HTML
            if (volGroup && !volPopover) {
                volPopover = document.createElement('div');
                volPopover.className = 'video-volume-popover';
                volPct = document.createElement('span');
                volPct.className = 'video-volume-pct';
                volPct.textContent = '80%';
                volPopover.appendChild(volPct);
                if (volSlider) {
                    volGroup.removeChild(volSlider);
                    volPopover.appendChild(volSlider);
                }
                volGroup.appendChild(volPopover);
            }

            // Auto-close timer for mobile vertical volume popover
            let volCloseTimer = null;
            const startVolCloseTimer = () => {
                if (volCloseTimer) clearTimeout(volCloseTimer);
                volCloseTimer = setTimeout(() => {
                    if (volGroup) volGroup.classList.remove('is-open');
                }, 3800);
            };
            const clearVolCloseTimer = () => {
                if (volCloseTimer) {
                    clearTimeout(volCloseTimer);
                    volCloseTimer = null;
                }
            };

            // Wire Play/Pause
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        playVideo(video);
                    } else {
                        pauseVideo(video);
                    }
                });
            }

            // Wire Seek
            if (seekSlider) {
                seekSlider.addEventListener('mousedown', () => { seekSlider.dataset.isDragging = 'true'; });
                seekSlider.addEventListener('touchstart', () => { seekSlider.dataset.isDragging = 'true'; }, { passive: true });

                seekSlider.addEventListener('input', () => {
                    if (video.duration && !isNaN(video.duration)) {
                        const pct = parseFloat(seekSlider.value);
                        seekSlider.style.setProperty('--seek-pct', `${pct}%`);
                        video.currentTime = (pct / 100) * video.duration;
                        const timeDisplay = controls.querySelector('.video-time-display');
                        if (timeDisplay) {
                            timeDisplay.textContent = `${formatVideoTime(video.currentTime)} / ${formatVideoTime(video.duration)}`;
                        }
                    }
                });

                const stopSeek = () => {
                    if (seekSlider.dataset.isDragging) {
                        delete seekSlider.dataset.isDragging;
                        if (video.duration && !isNaN(video.duration)) {
                            video.currentTime = (parseFloat(seekSlider.value) / 100) * video.duration;
                        }
                    }
                };
                seekSlider.addEventListener('mouseup', stopSeek);
                seekSlider.addEventListener('touchend', stopSeek);
            }

            // Wire Volume Button (Explicit Mute / Unmute Toggle + Mobile Popover Open)
            if (volBtn) {
                volBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

                    // On mobile, if popover is closed, first tap opens the vertical slider
                    if (isMobile && volGroup && !volGroup.classList.contains('is-open')) {
                        volGroup.classList.add('is-open');
                        // If muted, also unmute automatically for quick listen
                        if (video.muted || video.volume === 0) {
                            const restored = parseFloat(video.dataset.savedVolume || video.dataset.lastVolume || '0.8') || 0.8;
                            video.muted = false;
                            video.volume = restored;
                            if (volSlider) {
                                volSlider.value = restored;
                                volSlider.style.setProperty('--vol-pct', `${restored * 100}%`);
                            }
                        }
                        startVolCloseTimer();
                        updateControlsUI(video);
                        return;
                    }

                    // Otherwise (desktop or already open on mobile), toggle mute/unmute
                    const isMuted = (video.muted || video.volume === 0);
                    if (isMuted) {
                        // UNMUTE: restore saved volume or default 0.8
                        const restored = parseFloat(video.dataset.savedVolume || video.dataset.lastVolume || '0.8') || 0.8;
                        video.muted = false;
                        video.volume = restored;
                        if (volSlider) {
                            volSlider.value = restored;
                            volSlider.style.setProperty('--vol-pct', `${restored * 100}%`);
                        }
                    } else {
                        // MUTE: save current volume and set muted true
                        video.dataset.savedVolume = video.volume > 0 ? video.volume.toString() : '0.8';
                        video.muted = true;
                        if (volSlider) {
                            volSlider.value = 0;
                            volSlider.style.setProperty('--vol-pct', '0%');
                        }
                    }
                    if (isMobile && volGroup && volGroup.classList.contains('is-open')) {
                        startVolCloseTimer();
                    }
                    updateControlsUI(video);
                });
            }

            // Wire Volume Slider (Desktop input & change)
            if (volSlider) {
                volSlider.addEventListener('mousedown', () => { 
                    volSlider.dataset.isDragging = 'true'; 
                });
                volSlider.addEventListener('touchstart', () => { 
                    volSlider.dataset.isDragging = 'true';
                    clearVolCloseTimer();
                }, { passive: true });

                volSlider.addEventListener('input', () => {
                    const val = parseFloat(volSlider.value);
                    if (val === 0) {
                        video.muted = true;
                    } else {
                        video.muted = false;
                        video.dataset.savedVolume = val.toString();
                        video.dataset.lastVolume = val.toString();
                    }
                    video.volume = val;
                    volSlider.style.setProperty('--vol-pct', `${val * 100}%`);
                    updateControlsUI(video);
                });

                const stopVol = () => {
                    delete volSlider.dataset.isDragging;
                    startVolCloseTimer();
                };
                volSlider.addEventListener('mouseup', stopVol);
                volSlider.addEventListener('touchend', stopVol);
            }

            // Mobile Vertical Drag & Touch Tracking on Popover
            if (volPopover) {
                const handleMobileVerticalTouch = (touch) => {
                    if (!touch || !volSlider) return;
                    const rect = volSlider.getBoundingClientRect();
                    const height = rect.height || 96;
                    // Rotated -90deg: Top is 100%, Bottom is 0%
                    const ratio = 1 - ((touch.clientY - rect.top) / height);
                    const clamped = Math.max(0, Math.min(1, Math.round(ratio * 50) / 50));

                    if (clamped <= 0.02) {
                        video.muted = true;
                        video.volume = 0;
                        volSlider.value = 0;
                        volSlider.style.setProperty('--vol-pct', '0%');
                    } else {
                        video.muted = false;
                        video.volume = clamped;
                        video.dataset.savedVolume = clamped.toString();
                        video.dataset.lastVolume = clamped.toString();
                        volSlider.value = clamped;
                        volSlider.style.setProperty('--vol-pct', `${clamped * 100}%`);
                    }
                    updateControlsUI(video);
                };

                volPopover.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                    clearVolCloseTimer();
                    if (volSlider) volSlider.dataset.isDragging = 'true';
                    if (e.touches && e.touches[0]) {
                        handleMobileVerticalTouch(e.touches[0]);
                    }
                }, { passive: false });

                volPopover.addEventListener('touchmove', (e) => {
                    e.stopPropagation();
                    e.preventDefault(); // Prevent page scroll while adjusting vertical volume
                    if (e.touches && e.touches[0]) {
                        handleMobileVerticalTouch(e.touches[0]);
                    }
                }, { passive: false });

                const endPopoverTouch = (e) => {
                    e.stopPropagation();
                    if (volSlider) delete volSlider.dataset.isDragging;
                    startVolCloseTimer();
                };
                volPopover.addEventListener('touchend', endPopoverTouch);
                volPopover.addEventListener('touchcancel', endPopoverTouch);
                volPopover.addEventListener('click', (e) => e.stopPropagation());
            }

            // Close mobile popover when tapping outside
            document.addEventListener('touchstart', (e) => {
                if (volGroup && !volGroup.contains(e.target)) {
                    volGroup.classList.remove('is-open');
                }
            }, { passive: true });
            document.addEventListener('click', (e) => {
                if (volGroup && !volGroup.contains(e.target)) {
                    volGroup.classList.remove('is-open');
                }
            });

            // Robust Fullscreen Check for this Player
            function isVideoInFullscreen() {
                const fs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
                if (fs) {
                    return fs === container || fs === video || container.contains(fs) || video.contains(fs);
                }
                return !!(video && video.webkitDisplayingFullscreen);
            }

            function requestVideoFullscreen() {
                // Request landscape screen orientation lock for horizontal widescreen fullscreen on mobile
                if (screen.orientation && typeof screen.orientation.lock === 'function') {
                    try { screen.orientation.lock('landscape').catch(() => { }); } catch (e) { }
                }
                // Request fullscreen on container so custom controls remain accessible
                const req = container.requestFullscreen || container.webkitRequestFullscreen || container.mozRequestFullScreen || container.msRequestFullscreen;
                if (req) {
                    try {
                        const p = req.call(container);
                        if (p && p.catch) {
                            p.catch(() => {
                                // Fall back to video element directly
                                const vreq = video.requestFullscreen || video.webkitRequestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen || video.webkitEnterFullscreen;
                                if (vreq) try { vreq.call(video); } catch (e) { }
                            });
                        }
                    } catch (err) {
                        const vreq = video.requestFullscreen || video.webkitRequestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen || video.webkitEnterFullscreen;
                        if (vreq) try { vreq.call(video); } catch (e) { }
                    }
                } else if (video && video.webkitEnterFullscreen) {
                    try { video.webkitEnterFullscreen(); } catch (e) { }
                }
            }

            function exitVideoFullscreen() {
                // Release orientation lock
                if (screen.orientation && typeof screen.orientation.unlock === 'function') {
                    try { screen.orientation.unlock(); } catch (e) { }
                }
                // Standard document-level exit
                const exitDoc = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                if (exitDoc) {
                    try {
                        const p = exitDoc.call(document);
                        if (p && p.catch) p.catch(() => { });
                    } catch (err) { }
                }
                // WebKit / iOS native video exit fallback
                if (video) {
                    if (typeof video.webkitExitFullscreen === 'function') {
                        try { video.webkitExitFullscreen(); } catch (e) { }
                    }
                    if (typeof video.exitFullscreen === 'function') {
                        try { video.exitFullscreen(); } catch (e) { }
                    }
                }
            }

            if (fsBtn) {
                const handleFsToggle = (e) => {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    }
                    if (isVideoInFullscreen() || isAnyFullscreenActive()) {
                        exitVideoFullscreen();
                    } else {
                        requestVideoFullscreen();
                    }
                };

                fsBtn.addEventListener('click', handleFsToggle);
                fsBtn.addEventListener('touchend', handleFsToggle, { passive: false });

                // Double click/tap video to toggle fullscreen
                video.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    handleFsToggle(e);
                });
            }

            // Screen Click / Tap in Fullscreen: Toggle Play and Pause
            let lastScreenPressTime = 0;
            function handleFullscreenScreenPress(e) {
                // Ignore clicks on controls bar and interactive buttons/sliders
                if (e.target && e.target.closest && e.target.closest('.custom-video-controls, button, input, [role="button"]')) {
                    return;
                }

                if (isVideoInFullscreen() || isAnyFullscreenActive()) {
                    const now = Date.now();
                    if (now - lastScreenPressTime < 250) return; // Debounce rapid bubbling
                    lastScreenPressTime = now;

                    if (video.paused) {
                        playVideo(video);
                    } else {
                        pauseVideo(video);
                    }
                }
            }

            container.addEventListener('click', handleFullscreenScreenPress);
            video.addEventListener('click', handleFullscreenScreenPress);

            // Keyboard Spacebar / 'k' support in Fullscreen
            document.addEventListener('keydown', (e) => {
                if (!isVideoInFullscreen()) return;
                if (e.code === 'Space' || e.key === ' ' || e.key === 'k' || e.key === 'K') {
                    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'BUTTON')) {
                        return;
                    }
                    e.preventDefault();
                    if (video.paused) {
                        playVideo(video);
                    } else {
                        pauseVideo(video);
                    }
                }
            });

            // Play Overlay interaction (e.g. RPS Gameplay player)
            const playOverlay = container.querySelector('.rps-video-hero__play-overlay');
            if (playOverlay) {
                playOverlay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        playVideo(video);
                    } else {
                        pauseVideo(video);
                    }
                });
            }

            // Video element events
            video.addEventListener('timeupdate', () => updateControlsUI(video));
            video.addEventListener('loadedmetadata', () => updateControlsUI(video));
            video.addEventListener('volumechange', () => updateControlsUI(video));
            video.addEventListener('play', () => updateControlsUI(video));
            video.addEventListener('pause', () => updateControlsUI(video));
            video.addEventListener('ended', () => updateControlsUI(video));

            // Auto-hide controls when idle
            let idleTimeout = null;
            const resetIdle = () => {
                controls.classList.remove('is-idle');
                clearTimeout(idleTimeout);
                if (!video.paused) {
                    idleTimeout = setTimeout(() => {
                        controls.classList.add('is-idle');
                    }, 3000);
                }
            };
            container.addEventListener('mousemove', resetIdle);
            container.addEventListener('mouseenter', resetIdle);
            container.addEventListener('touchstart', resetIdle, { passive: true });
            video.addEventListener('play', resetIdle);
            video.addEventListener('pause', () => {
                clearTimeout(idleTimeout);
                controls.classList.remove('is-idle');
            });

            // Initial UI update
            updateControlsUI(video);
        });

        // Universal Fullscreen Change Event Dispatcher across all players
        const handleFullscreenChange = () => {
            const isFs = isAnyFullscreenActive();

            if (!isFs) {
                if (screen.orientation && typeof screen.orientation.unlock === 'function') {
                    try { screen.orientation.unlock(); } catch (e) { }
                }
            }

            videos.forEach(v => {
                const cont = v.closest('.reel-media, .rps-video-hero') || v.parentElement;
                if (!cont) return;
                const btn = cont.querySelector('.video-fs-btn');
                if (btn) {
                    const icon = btn.querySelector('i');
                    const inThis = isFs && (
                        document.fullscreenElement === cont ||
                        cont.contains(document.fullscreenElement) ||
                        document.fullscreenElement === v ||
                        v.contains(document.fullscreenElement)
                    );
                    if (icon) {
                        icon.className = inThis ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
                    }
                    btn.setAttribute('title', inThis ? 'Exit Fullscreen' : 'Fullscreen');
                    btn.setAttribute('aria-label', inThis ? 'Exit Fullscreen' : 'Toggle Fullscreen');
                }
            });

            syncFullscreenThemeCursors();
            setTimeout(syncFullscreenThemeCursors, 60);
            setTimeout(syncFullscreenThemeCursors, 200);
        };

        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'].forEach(evt => {
            document.addEventListener(evt, handleFullscreenChange);
        });
    }

    // Initialize custom controls on all project videos
    initCustomVideoPlayers();

    // Reel Scroll Management
    const reel = document.querySelector('.experience-reel');
    if (reel) {
        const medias = document.querySelectorAll('.reel-media');
        const texts = document.querySelectorAll('.reel-text');
        const dots = document.querySelectorAll('.reel-dot');
        const reelVideo = reel.querySelector('.reel-media video');

        const onReelScroll = () => {
            let rect = reel.getBoundingClientRect();
            // If reel top is past screen top, and bottom is still below screen top
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                let traveled = Math.abs(rect.top);
                let totalScrollable = rect.height - window.innerHeight;
                let progress = totalScrollable > 0 ? (traveled / totalScrollable) : 0;

                // Map progress to 4 acts (0,1,2,3)
                let act = Math.min(3, Math.floor(progress * 4));

                medias.forEach((m, i) => m.classList.toggle('active', i === act));
                texts.forEach((t, i) => t.classList.toggle('active', i === act));
                dots.forEach((d, i) => d.classList.toggle('active', i === act));

                // Video scroll-trigger logic:
                // Only start playing when scrolled into Act IV (act === 3)
                if (reelVideo) {
                    if (act === 3) {
                        playVideo(reelVideo);
                    } else {
                        pauseVideo(reelVideo);
                    }
                }
            } else if (rect.top > 0) {
                // Above the reel
                medias.forEach((m, i) => m.classList.toggle('active', i === 0));
                texts.forEach((t, i) => t.classList.toggle('active', i === 0));
                dots.forEach((d, i) => d.classList.toggle('active', i === 0));
                if (reelVideo) {
                    pauseVideo(reelVideo);
                }
            } else {
                // Below the reel (rect.bottom < window.innerHeight)
                if (reelVideo) {
                    pauseVideo(reelVideo);
                }
            }
        };

        window.addEventListener('scroll', onReelScroll, { passive: true });
        onReelScroll();
    }

    // Standalone videos scroll management (e.g. RPS Gameplay video)
    const standaloneVideos = document.querySelectorAll('video:not(.reel-media video)');
    if (standaloneVideos.length > 0 && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                    playVideo(video);
                } else {
                    pauseVideo(video);
                }
            });
        }, {
            threshold: [0, 0.2, 0.35, 0.5, 0.75, 1.0]
        });

        standaloneVideos.forEach(video => {
            videoObserver.observe(video);
        });
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

    // Universal Back to Top Button Click Handler
    document.querySelectorAll('.back-to-top-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Populate current year on all footer year elements
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('#footerYear, .footer-year, .footerYear').forEach(el => {
        el.textContent = currentYear;
    });

});
