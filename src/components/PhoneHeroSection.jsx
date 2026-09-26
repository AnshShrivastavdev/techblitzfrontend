'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const MOBILE_FRAME_COUNT = 300;
const MOBILE_FRAME_FOLDER = '/frames/ezgif-3390a1a431b30443-jpg';

// 3 Mobile Story Chapters
const MOBILE_CHAPTERS = [
  {
    id: 1,
    tag: '01 / LAUNCH',
    title: 'COSMIC GENESIS',
    subtitle: 'IGNITION VECTOR // ASCENT INITIATION',
    desc: 'Propelling into uncharted orbits. TechBlitz begins with raw computing power and high-velocity engineering.',
  },
  {
    id: 2,
    tag: '02 / TELEMETRY',
    title: 'ORBITAL TELEMETRY',
    subtitle: 'QUANTUM DATA & AI STREAM',
    desc: 'Deep celestial synchronization. Real-time telemetry, robotics algorithms, and autonomous neural networks.',
  },
  {
    id: 3,
    tag: '03 / TECHBLITZ',
    title: 'TECHBLITZ 2026',
    subtitle: 'INNOVATION SUMMIT // COSMOS JEC',
    desc: "Central India's premier hackathon and tech battleground. 36 hours of nonstop innovation at Jabalpur Engineering College.",
  },
];

export function PhoneHeroSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Loading state
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Active chapter and telemetry state
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrubPercent, setScrubPercent] = useState(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Image cache: single array of 300 images strictly for mobile
  const framesRef = useRef(new Array(MOBILE_FRAME_COUNT));
  const lastDrawnImageRef = useRef(null);
  const rafIdRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isMountedRef = useRef(true);

  const getFrameUrl = useCallback((frameIdx) => {
    const frameNumber = String(frameIdx + 1).padStart(3, '0');
    return `${MOBILE_FRAME_FOLDER}/ezgif-frame-${frameNumber}.jpg`;
  }, []);

  // Object-fit: cover center-crop math for portrait screens
  const drawCoverImage = useCallback((ctx, img, canvasWidth, canvasHeight) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.save();
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

  // Frame renderer for a specific normalized progress (0.0 to 1.0)
  const renderFrameAtProgress = useCallback(
    (progress) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const clamped = Math.max(0, Math.min(progress, 0.999999));
      const targetFrame = Math.min(
        MOBILE_FRAME_COUNT - 1,
        Math.max(0, Math.floor(clamped * MOBILE_FRAME_COUNT))
      );

      const frameNumber = targetFrame + 1;
      const pct = Math.round(clamped * 100);

      // Determine active chapter (0-33%, 33-66%, 66-100%)
      let chapterIdx = 0;
      if (clamped >= 0.66) {
        chapterIdx = 2;
      } else if (clamped >= 0.33) {
        chapterIdx = 1;
      }

      setActiveChapterIndex(chapterIdx);
      setScrubPercent(pct);
      setCurrentFrameNum(frameNumber);

      // Proactively stream adjacent frames
      const bufferStart = Math.max(0, targetFrame - 8);
      const bufferEnd = Math.min(MOBILE_FRAME_COUNT - 1, targetFrame + 25);
      for (let f = bufferStart; f <= bufferEnd; f++) {
        if (!framesRef.current[f]) {
          const preloadImg = new Image();
          preloadImg.src = getFrameUrl(f);
          framesRef.current[f] = preloadImg;
        }
      }

      // Get frame image with exhaustive outward search across the entire array
      let img = framesRef.current[targetFrame];
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < MOBILE_FRAME_COUNT; offset++) {
          const prev = framesRef.current[targetFrame - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            img = prev;
            break;
          }
          const next = framesRef.current[targetFrame + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            img = next;
            break;
          }
        }
      }

      const drawImg = img || lastDrawnImageRef.current;
      if (drawImg && drawImg.complete && drawImg.naturalWidth > 0) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawCoverImage(ctx, drawImg, canvas.width, canvas.height);
        lastDrawnImageRef.current = drawImg;
      }
    },
    [drawCoverImage, getFrameUrl]
  );

  // Frame Preloader: monochrome progress, only fetches mobile frames
  useEffect(() => {
    isMountedRef.current = true;
    let loadedCount = 0;
    const totalFrames = MOBILE_FRAME_COUNT;

    // Phase 1: Load essential keyframes across all chapters immediately
    const initialKeyframes = [
      0, 1, 2, 3, 4, 10, 20, 30, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 299,
    ];

    initialKeyframes.forEach((f) => {
      if (!framesRef.current[f]) {
        const img = new Image();
        img.src = getFrameUrl(f);
        framesRef.current[f] = img;
        img.onload = () => {
          if (!isMountedRef.current) return;
          loadedCount++;
          const pct = Math.min(100, Math.round((loadedCount / totalFrames) * 100));
          setLoadPercent((prev) => Math.max(prev, pct));
          if (f === 0 && !lastDrawnImageRef.current) {
            lastDrawnImageRef.current = img;
            renderFrameAtProgress(0);
          }
        };
        img.onerror = () => {
          loadedCount++;
        };
      }
    });

    // Fast initial unlock so user can scroll immediately without waiting
    let fakePct = 0;
    const progressInterval = setInterval(() => {
      if (!isMountedRef.current) return;
      fakePct = Math.min(100, fakePct + Math.floor(Math.random() * 20 + 10));
      setLoadPercent((prev) => Math.max(prev, fakePct));
      if (fakePct >= 100) {
        clearInterval(progressInterval);
        setIsLoaded(true);
      }
    }, 35);

    const unlockTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        setLoadPercent(100);
        setIsLoaded(true);
      }
    }, 450);

    // Phase 2: Stream remaining frames sequentially with high concurrency
    const queue = [];
    for (let f = 0; f < totalFrames; f++) {
      if (!framesRef.current[f]) {
        queue.push(f);
      }
    }

    let qIdx = 0;
    const CONCURRENCY = 24;

    const loadWorker = () => {
      if (!isMountedRef.current || qIdx >= queue.length) return;
      const f = queue[qIdx++];

      if (framesRef.current[f]) {
        loadWorker();
        return;
      }

      const img = new Image();
      img.src = getFrameUrl(f);
      framesRef.current[f] = img;

      const done = () => {
        if (!isMountedRef.current) return;
        loadedCount++;
        const currentTotal = initialKeyframes.length + loadedCount;
        const pct = Math.min(100, Math.round((currentTotal / totalFrames) * 100));
        setLoadPercent((prev) => Math.max(prev, pct));
        loadWorker();
      };

      img.onload = done;
      img.onerror = done;
    };

    for (let i = 0; i < CONCURRENCY; i++) {
      loadWorker();
    }

    return () => {
      isMountedRef.current = false;
      clearInterval(progressInterval);
      clearTimeout(unlockTimeout);

      if (framesRef.current) {
        for (let i = 0; i < framesRef.current.length; i++) {
          if (framesRef.current[i]) {
            framesRef.current[i].onload = null;
            framesRef.current[i].onerror = null;
            framesRef.current[i] = null;
          }
        }
      }
    };
  }, [getFrameUrl, renderFrameAtProgress]);

  // Resize handler: DPR scaling and dynamic viewport updates
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

  // Dual Scroll listener: Native Window + Lenis Smooth Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollDistance = rect.height - window.innerHeight;

      if (scrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(-rect.top / scrollDistance, 1));
      targetProgressRef.current = progress;

      // Visibility toggle when scrolling into lower sections
      const isPast = rect.bottom < window.innerHeight * 0.25;
      setIsHeroVisible(!isPast);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sync with global Lenis instance if available
    const lenisInstance = typeof window !== 'undefined' ? window.__lenis : null;
    if (lenisInstance) {
      lenisInstance.on('scroll', handleScroll);
    }

    handleScroll();

    let isRunning = true;
    const tick = () => {
      if (!isRunning) return;

      // Snappy and responsive lerping (0.4 factor for ultra-fluid scrubbing)
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.4;
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

  // Tap cue to advance scroll down smoothly
  const handleScrollDown = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
    const currentScrolled = -rect.top;

    // Scroll down by 1 viewport height
    const targetY = window.scrollY + Math.min(window.innerHeight * 0.9, scrollDistance - currentScrolled + 50);
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const activeChapter = MOBILE_CHAPTERS[activeChapterIndex] || MOBILE_CHAPTERS[0];

  return (
    <div className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* =====================================================================
          1. PRELOADER: SLEEK MONOCHROME SCREEN (0% to 100%)
          ===================================================================== */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none">
          {/* Minimalist Cosmos Emblem */}
          <div className="w-12 h-12 mb-6 rounded-full border border-white/20 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-white animate-ping" />
          </div>

          <div className="text-[11px] font-mono tracking-widest text-neutral-400 mb-2 uppercase">
            COSMOS JEC // MOBILE TELEMETRY
          </div>

          <div className="text-3xl font-black font-mono tracking-tight text-white mb-4">
            {loadPercent}%
          </div>

          {/* Monochrome Progress Bar */}
          <div className="w-48 h-1 bg-white/15 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-white transition-all duration-75 ease-out"
              style={{ width: `${loadPercent}%` }}
            />
          </div>

          <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">
            CALIBRATING 3D FRAMES ({MOBILE_FRAME_COUNT})
          </span>
        </div>
      )}

      {/* =====================================================================
          2. SCROLL RUNWAY: generous height: 380dvh to allow comfortable scrubbing
          ===================================================================== */}
      <div
        ref={containerRef}
        id="home"
        className="canvas-mobile-scroller relative w-full h-[380dvh]"
        style={{ minHeight: '380dvh', height: '380dvh' }}
      >
        {/* Sticky Full-Screen Canvas Container: height: 100dvh */}
        <div
          className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden pointer-events-none"
          style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100dvh', pointerEvents: 'none' }}
        >
          {/* The 3D Render Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block bg-black pointer-events-none"
            style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/60" />

          {/* =====================================================================
              3. UI OVERLAYS (Fades out when hero scrolls past)
              ===================================================================== */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
              isHeroVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* TOP: Minimal "COSMOS JEC" Branding on top-left */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-white">
                  COSMOS <span className="text-neutral-400">JEC</span>
                </span>
              </div>

              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-neutral-400 tracking-wider pointer-events-auto">
                FRAME <span className="text-white font-bold">{String(currentFrameNum).padStart(3, '0')}</span> / {MOBILE_FRAME_COUNT}
              </div>
            </div>

            {/* BOTTOM: Thumb-Friendly Story Card with Gradient Backdrop */}
            {/* Set pointer-events-none on the gradient backdrop so touch gestures pass through to document scroll */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 pt-16 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
              <div className="max-w-md mx-auto space-y-3 pointer-events-none">
                {/* Chapter Pill & Telemetry Scrub Status */}
                <div className="flex items-center justify-between pointer-events-none">
                  <span className="inline-block bg-white text-black font-mono text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                    {activeChapter.tag}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                    {scrubPercent}% COMPLETE
                  </span>
                </div>

                {/* Chapter Heading & Title */}
                <div className="pointer-events-none">
                  <h2 className="text-xl font-black font-sans tracking-tight text-white uppercase leading-tight">
                    {activeChapter.title}
                  </h2>
                  <p className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase mt-0.5">
                    {activeChapter.subtitle}
                  </p>
                </div>

                {/* Chapter Narrative */}
                <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2 pointer-events-none">
                  {activeChapter.desc}
                </p>

                {/* Mini Scrub Progress Bar */}
                <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: `${scrubPercent}%` }}
                  />
                </div>

                {/* High-Contrast Touch Action Buttons - Explicitly pointer-events-auto */}
                <div className="flex items-center gap-3 pt-1 pointer-events-auto">
                  <a
                    href="#register"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }) ||
                        (window.location.href = '/register');
                    }}
                    className="flex-1 py-2.5 px-4 bg-white text-black font-mono font-bold text-xs uppercase text-center rounded-lg shadow-lg active:scale-95 transition-transform cursor-pointer"
                  >
                    Register Now
                  </a>
                  <a
                    href="#zones"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('zones')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-mono font-bold text-xs uppercase text-center rounded-lg active:scale-95 transition-transform backdrop-blur-md cursor-pointer"
                  >
                    Tracks
                  </a>
                </div>

                {/* Micro-Cue: Swipe down or tap to scrub frames */}
                <div className="text-center pt-1 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handleScrollDown}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 hover:text-white tracking-widest uppercase animate-pulse cursor-pointer py-1 px-3 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <span>Swipe down to scrub frames</span>
                    <span className="text-white font-bold">↓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneHeroSection;
