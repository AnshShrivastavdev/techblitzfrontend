'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const CHAPTERS = [
  {
    id: 1,
    title: 'The Cosmic Void',
    subtitle: 'ORIGIN // SYSTEM INITIALIZATION',
    tag: 'SCENE 01 / 06',
    code: 'SEC-01',
    folder: 'ezgif-20453c58589fe7f0-jpg',
    frameCount: 300,
    desc: 'From the quiet vacuum of deep space, the quantum singularity initializes. Digital telemetry awakens across celestial vectors.',
  },
  {
    id: 2,
    title: 'Orbital Trajectory',
    subtitle: 'VECTOR ACCELERATION',
    tag: 'SCENE 02 / 06',
    code: 'SEC-02',
    folder: 'ezgif-2a0d9360cfda774a-jpg',
    frameCount: 240,
    desc: 'Propulsion systems achieve escape velocity. Algorithmic coordinates guide the ascent into high-altitude orbital mechanics.',
  },
  {
    id: 3,
    title: 'Space Science Exploration',
    subtitle: 'DEEP CELESTIAL ANALYSIS',
    tag: 'SCENE 03 / 06',
    code: 'SEC-03',
    folder: 'ezgif-278a1d853b4e756b-jpg',
    frameCount: 240,
    desc: 'Planetary scanning and multispectral observation. Deciphering cosmic anomalies and electromagnetic signals across the galaxy.',
  },
  {
    id: 4,
    title: 'Telemetry & AI',
    subtitle: 'AUTONOMOUS SILICON INTERFACE',
    tag: 'SCENE 04 / 06',
    code: 'SEC-04',
    folder: 'ezgif-2df4780fdcfd6bba-jpg',
    frameCount: 240,
    desc: 'Neural networks sync with satellite constellations. Autonomous machine learning models computing trajectories in real time.',
  },
  {
    id: 5,
    title: 'Club Intro', // Cosmos JEC Club Intro
    subtitle: 'COSMOS // THE ENGINEERING GUILD',
    tag: 'SCENE 05 / 06',
    code: 'SEC-05',
    folder: 'ezgif-2648f1735ee2e5c4-jpg',
    frameCount: 300,
    desc: 'The creators behind the machine. Cosmos — Jabalpur Engineering College’s premier student technology club, engineering the future.',
  },
  {
    id: 6,
    title: 'TechBlitz Finale',
    subtitle: 'IGNITION & APEX CELEBRATION',
    tag: 'SCENE 06 / 06',
    code: 'SEC-06',
    folder: 'ezgif-2d9c0abdec6fddc5-jpg',
    frameCount: 240,
    desc: 'Central India’s flagship technological convergence. 36 hours of relentless innovation, hackathons, robotics, and grand discovery.',
  },
];

const TOTAL_FRAMES = CHAPTERS.reduce((acc, ch) => acc + ch.frameCount, 0); // 1560 frames

const CHAPTER_RANGES = [
  { chapterIdx: 0, startFrame: 0, count: 300 },
  { chapterIdx: 1, startFrame: 300, count: 240 },
  { chapterIdx: 2, startFrame: 540, count: 240 },
  { chapterIdx: 3, startFrame: 780, count: 240 },
  { chapterIdx: 4, startFrame: 1020, count: 300 },
  { chapterIdx: 5, startFrame: 1320, count: 240 },
];

export function PcHeroSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // States
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [globalFrameNum, setGlobalFrameNum] = useState(1);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Images 2D array: imagesRef.current[chapterIdx][frameIdx]
  const imagesRef = useRef(CHAPTERS.map(() => []));
  const lastDrawnImageRef = useRef(null);
  const rafIdRef = useRef(null);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const isMountedRef = useRef(true);

  const getFrameUrl = useCallback((chIdx, frameIdx) => {
    const ch = CHAPTERS[chIdx];
    const frameNum = String(frameIdx + 1).padStart(3, '0');
    return `/frames/${ch.folder}/ezgif-frame-${frameNum}.jpg`;
  }, []);

  // Center-crop cover math
  const drawCoverImage = useCallback((ctx, img, canvasWidth, canvasHeight, alpha = 1.0) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const canvasAspect = canvasWidth / canvasHeight;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (canvasAspect > imgAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgAspect;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  // Precomputed chapter lookup from global frame
  const getSceneFrameInfo = useCallback((globalFrame) => {
    for (let i = 0; i < CHAPTER_RANGES.length; i++) {
      const r = CHAPTER_RANGES[i];
      if (globalFrame >= r.startFrame && globalFrame < r.startFrame + r.count) {
        return {
          chIdx: i,
          frameInCh: globalFrame - r.startFrame,
          totalInCh: r.count,
        };
      }
    }
    const last = CHAPTER_RANGES[CHAPTER_RANGES.length - 1];
    return {
      chIdx: CHAPTER_RANGES.length - 1,
      frameInCh: last.count - 1,
      totalInCh: last.count,
    };
  }, []);

  // Predictive proximity buffering
  const ensureFramesNearby = useCallback(
    (chIdx, frameIdx) => {
      const count = CHAPTERS[chIdx].frameCount;
      for (let offset = -4; offset <= 25; offset++) {
        const f = frameIdx + offset;
        if (f >= 0 && f < count) {
          if (!imagesRef.current[chIdx]?.[f]) {
            const img = new Image();
            img.src = getFrameUrl(chIdx, f);
            if (!imagesRef.current[chIdx]) {
              imagesRef.current[chIdx] = [];
            }
            imagesRef.current[chIdx][f] = img;
          }
        }
      }
    },
    [getFrameUrl]
  );

  // Retrieve best available frame or fallback
  const getFrameImage = useCallback((chIdx, frameIdx) => {
    const frames = imagesRef.current[chIdx];
    const count = CHAPTERS[chIdx].frameCount;
    const clamped = Math.max(0, Math.min(count - 1, frameIdx));

    if (frames) {
      const direct = frames[clamped];
      if (direct && direct.complete && direct.naturalWidth > 0) return direct;

      // Nearest frame search outward across the entire chapter
      for (let offset = 1; offset < count; offset++) {
        const prev = frames[clamped - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) return prev;
        const next = frames[clamped + offset];
        if (next && next.complete && next.naturalWidth > 0) return next;
      }
    }

    // Search earlier chapter
    for (let s = chIdx - 1; s >= 0; s--) {
      const sFrames = imagesRef.current[s];
      if (sFrames) {
        for (let f = sFrames.length - 1; f >= 0; f--) {
          const prev = sFrames[f];
          if (prev && prev.complete && prev.naturalWidth > 0) return prev;
        }
      }
    }

    return lastDrawnImageRef.current;
  }, []);

  // High-performance progressive preloading
  useEffect(() => {
    isMountedRef.current = true;
    let isCancelled = false;

    // Allocate 2D arrays
    for (let s = 0; s < CHAPTERS.length; s++) {
      imagesRef.current[s] = new Array(CHAPTERS[s].frameCount);
    }

    // Critical queue: Frame 0 of each chapter + first 10 frames of Chapter 0
    const criticalTasks = [];
    for (let s = 0; s < CHAPTERS.length; s++) {
      criticalTasks.push({ s, f: 0 });
    }
    for (let f = 1; f < Math.min(12, CHAPTERS[0].frameCount); f++) {
      criticalTasks.push({ s: 0, f });
    }

    let criticalLoaded = 0;
    criticalTasks.forEach(({ s, f }) => {
      const img = new Image();
      img.src = getFrameUrl(s, f);
      imagesRef.current[s][f] = img;

      const onDone = () => {
        if (isCancelled || !isMountedRef.current) return;
        criticalLoaded++;
        if (f === 0 && s === 0 && !lastDrawnImageRef.current) {
          lastDrawnImageRef.current = img;
        }
        if (criticalLoaded >= 6) {
          setIsLoaded(true);
          setLoadPercent(100);
        }
      };
      img.onload = onDone;
      img.onerror = onDone;
    });

    // Snappy loading indicator
    let pct = 0;
    const countInterval = setInterval(() => {
      if (isCancelled || !isMountedRef.current) return;
      pct = Math.min(100, pct + Math.floor(Math.random() * 20 + 15));
      setLoadPercent(pct);
      if (pct >= 100) {
        clearInterval(countInterval);
        setIsLoaded(true);
      }
    }, 40);

    // Hard fallback: unlock within 450ms
    const unlockTimeout = setTimeout(() => {
      if (!isCancelled && isMountedRef.current) {
        setLoadPercent(100);
        setIsLoaded(true);
      }
    }, 450);

    // Background streaming of remaining frames
    const fullQueue = [];
    for (let s = 0; s < CHAPTERS.length; s++) {
      for (let f = 0; f < CHAPTERS[s].frameCount; f++) {
        if (!imagesRef.current[s][f]) {
          fullQueue.push({ s, f });
        }
      }
    }

    let qIdx = 0;
    const CONCURRENCY = 24;

    const loadNext = () => {
      if (isCancelled || !isMountedRef.current || qIdx >= fullQueue.length) return;
      const { s, f } = fullQueue[qIdx++];

      if (imagesRef.current[s][f]) {
        loadNext();
        return;
      }

      const img = new Image();
      img.src = getFrameUrl(s, f);
      imagesRef.current[s][f] = img;

      const handleDone = () => {
        if (!isCancelled && isMountedRef.current) {
          loadNext();
        }
      };
      img.onload = handleDone;
      img.onerror = handleDone;
    };

    for (let i = 0; i < CONCURRENCY; i++) {
      loadNext();
    }

    return () => {
      isCancelled = true;
      isMountedRef.current = false;
      clearInterval(countInterval);
      clearTimeout(unlockTimeout);

      // Dereference all images on unmount
      if (imagesRef.current) {
        for (let s = 0; s < imagesRef.current.length; s++) {
          const chArr = imagesRef.current[s];
          if (chArr) {
            for (let f = 0; f < chArr.length; f++) {
              if (chArr[f]) {
                chArr[f].onload = null;
                chArr[f].onerror = null;
                chArr[f] = null;
              }
            }
          }
        }
      }
    };
  }, [getFrameUrl]);

  // Render logic at progress with 12% alpha-blend crossfade
  const renderFrameAtProgress = useCallback(
    (progress) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const clamped = Math.max(0, Math.min(progress, 0.999999));
      const targetGlobalFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(clamped * TOTAL_FRAMES))
      );

      const { chIdx, frameInCh, totalInCh } = getSceneFrameInfo(targetGlobalFrame);

      setCurrentChapterIdx(chIdx);
      const chPct = frameInCh / Math.max(1, totalInCh - 1);
      setChapterProgress(chPct);
      setGlobalFrameNum(targetGlobalFrame + 1);

      // Preload nearby frames around current scrubber position
      ensureFramesNearby(chIdx, frameInCh);

      // Crossfade logic: Last 12% of chapter into frame 0 of next chapter
      const isNearEnd = chPct >= 0.88 && chIdx < CHAPTERS.length - 1;

      if (isNearEnd) {
        // Linear blend factor 0.0 -> 1.0 over the last 12%
        const blendProgress = Math.min(1.0, Math.max(0.0, (chPct - 0.88) / 0.12));
        const curImg = getFrameImage(chIdx, frameInCh);
        const nextImg = getFrameImage(chIdx + 1, 0);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (curImg) {
          drawCoverImage(ctx, curImg, canvas.width, canvas.height, 1.0);
          lastDrawnImageRef.current = curImg;
        }

        if (nextImg) {
          drawCoverImage(ctx, nextImg, canvas.width, canvas.height, blendProgress);
        }
      } else {
        const img = getFrameImage(chIdx, frameInCh);
        if (img) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawCoverImage(ctx, img, canvas.width, canvas.height, 1.0);
          lastDrawnImageRef.current = img;
        }
      }
    },
    [drawCoverImage, ensureFramesNearby, getFrameImage, getSceneFrameInfo]
  );

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      renderFrameAtProgress(currentProgressRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrameAtProgress]);

  // Scroll listener and RAF loop
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;

      if (scrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(-rect.top / scrollDistance, 1));
      targetProgressRef.current = progress;

      // Visibility toggle
      const isPast = rect.bottom < window.innerHeight * 0.4;
      setIsHeroVisible(!isPast);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const lenisInstance = typeof window !== 'undefined' ? window.__lenis : null;
    if (lenisInstance) {
      lenisInstance.on('scroll', handleScroll);
    }
    handleScroll();

    let isRunning = true;
    const tick = () => {
      if (!isRunning) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.00005) {
        currentProgressRef.current += diff * 0.35;
        renderFrameAtProgress(currentProgressRef.current);
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        renderFrameAtProgress(currentProgressRef.current);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', handleScroll);
      if (lenisInstance) {
        lenisInstance.off('scroll', handleScroll);
      }
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrameAtProgress]);

  // Smooth scroll to chapter click
  const scrollToChapter = (idx) => {
    if (!containerRef.current) return;
    const range = CHAPTER_RANGES[idx];
    if (!range) return;

    const fraction = range.startFrame / TOTAL_FRAMES;
    const rect = containerRef.current.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = trackTop + fraction * scrollDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const activeChapter = CHAPTERS[currentChapterIdx] || CHAPTERS[0];

  return (
    <div className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* =====================================================================
          1. DESKTOP RUNWAY: height: calc(6 * 160vh) = 960vh
          ===================================================================== */}
      <div
        ref={containerRef}
        id="home"
        className="canvas-desktop-scroller relative w-full h-[960vh]"
        style={{ minHeight: 'calc(6 * 160vh)', height: 'calc(6 * 160vh)' }}
      >
        {/* Sticky Full-Screen Canvas: h-screen sticky top-0 */}
        <div
          className="sticky top-0 left-0 w-full h-screen overflow-hidden pointer-events-none"
          style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh' }}
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block bg-black pointer-events-none"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/60 via-transparent to-black/30" />

          {/* =====================================================================
              2. UI OVERLAYS (Fades out when hero scrolls past)
              ===================================================================== */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              isHeroVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* FIXED HEADER: COSMOS JEC & Nav Links */}
            <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-30 pointer-events-auto">
              <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md px-4 py-2 rounded-lg border border-white/15">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <span className="font-mono text-xs font-bold tracking-widest text-white">
                  COSMOS <span className="text-neutral-400">JEC</span>
                </span>
                <span className="text-neutral-600">|</span>
                <span className="font-mono text-[11px] text-cyan-300/90 tracking-wider">
                  TECHBLITZ '26
                </span>
              </div>

              {/* Desktop Nav Links */}
              <nav className="flex items-center gap-6 bg-black/75 backdrop-blur-md px-5 py-2 rounded-lg border border-white/15 font-mono text-xs tracking-widest text-neutral-400">
                <a
                  href="#about"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ABOUT
                </a>
                <a
                  href="#zones"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  TRACKS
                </a>
                <a
                  href="#speakers"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  SPEAKERS
                </a>
                <a
                  href="#gallery"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  GALLERY
                </a>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400 font-bold">
                  FRAME <span className="text-cyan-400">{String(globalFrameNum).padStart(4, '0')}</span> / {TOTAL_FRAMES}
                </span>
              </nav>
            </div>

            {/* LEFT-ALIGNED FROSTED GLASS CARD */}
            <div className="absolute left-10 lg:left-16 bottom-16 max-w-lg w-full z-20 pointer-events-auto">
              <div className="bg-black/75 backdrop-blur-md border border-white/20 border-l-2 border-l-white p-8 shadow-[0_30px_60px_rgba(0,0,0,0.9)] transition-all duration-300">
                {/* Scene Tag and Subtitle */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[11px] tracking-widest text-black bg-white font-bold px-2.5 py-0.5 uppercase">
                    {activeChapter.tag}
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-cyan-300/90 uppercase">
                    {activeChapter.subtitle}
                  </span>
                </div>

                {/* Animated Chapter Headings */}
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans mb-3 leading-tight">
                  {activeChapter.title}
                </h2>

                {/* Event Summary / Chapter Narrative */}
                <p className="text-sm text-neutral-300 leading-relaxed font-sans mb-6">
                  {activeChapter.desc}
                </p>

                {/* Chapter Progress Bar */}
                <div className="mb-6 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-400 mb-2">
                    <span>CHAPTER PROGRESS</span>
                    <span className="text-white font-bold font-mono">
                      {Math.round(chapterProgress * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${Math.round(chapterProgress * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Desktop CTA Buttons */}
                <div className="flex items-center gap-4">
                  <a
                    href="#register"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }) ||
                        (window.location.href = '/register');
                    }}
                    className="py-2.5 px-6 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded transition-all hover:bg-neutral-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Register Now
                  </a>
                  <a
                    href="#zones"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('zones')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-2.5 px-6 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95"
                  >
                    Explore Tracks
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT-ALIGNED CHAPTER SELECTOR TIMELINE */}
            <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-end gap-2.5 z-20 pointer-events-auto select-none font-mono">
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase mb-1">
                SEQUENTIAL CHAPTERS
              </span>
              {CHAPTERS.map((ch, idx) => {
                const isActive = idx === currentChapterIdx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => scrollToChapter(idx)}
                    className={`group flex items-center gap-3 px-3 py-1.5 rounded transition-all text-right cursor-pointer ${
                      isActive
                        ? 'bg-white/20 border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'bg-black/60 border border-white/10 hover:border-white/30 hover:bg-black/80'
                    }`}
                  >
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[10px] font-bold tracking-wider transition-colors ${
                          isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                        }`}
                      >
                        0{ch.id} // {ch.title}
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${
                        isActive ? 'bg-white shadow-[0_0_8px_#ffffff] scale-125' : 'bg-neutral-600 group-hover:bg-neutral-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* BOTTOM-RIGHT CHAPTER INDICATOR */}
            <div className="absolute right-10 bottom-12 z-20 pointer-events-none flex flex-col items-end gap-2 text-right select-none">
              <div className="bg-black/75 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-lg flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-mono text-xs tracking-widest text-white font-bold uppercase">
                  CHAPTER {currentChapterIdx + 1} / 6
                </span>
                <span className="text-neutral-600">|</span>
                <span className="font-mono text-[11px] text-neutral-400 tracking-wider">
                  SCROLL TO SCRUB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PcHeroSection;
