'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Chapter {
  id: number;
  folder: string;
  chapterNum: string;
  title: string;
  subtitle: string;
  desc: string;
  code: string;
  frameCount: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    folder: 'ezgif-20453c58589fe7f0-jpg',
    chapterNum: '01',
    title: 'THE COSMIC VOID',
    subtitle: 'ORIGIN // INCEPTION AT ZERO',
    desc: 'Deep space genesis. Before architecture, before silicon, there was curiosity and an empty vacuum waiting to be ignited.',
    code: 'SEC-01 // VOID-INIT',
    frameCount: 300,
  },
  {
    id: 2,
    folder: 'ezgif-2a0d9360cfda774a-jpg',
    chapterNum: '02',
    title: 'ORBITAL TRAJECTORY',
    subtitle: 'VECTORING INTO ORBIT',
    desc: 'Accelerating beyond gravitational constraints. Establishing computational trajectories and decentralized telemetry.',
    code: 'SEC-02 // ORBIT-VEC',
    frameCount: 240,
  },
  {
    id: 3,
    folder: 'ezgif-278a1d853b4e756b-jpg',
    chapterNum: '03',
    title: 'SPACE SCIENCE & EXPLORATION',
    subtitle: 'ASTRONOMICAL EXPLORATION',
    desc: 'Harnessing deep celestial observation, astrophysics modeling, and interplanetary sensor payloads.',
    code: 'SEC-03 // ASTRO-SPEC',
    frameCount: 240,
  },
  {
    id: 4,
    folder: 'ezgif-2df4780fdcfd6bba-jpg',
    chapterNum: '04',
    title: 'SUBSYSTEM TELEMETRY & AI',
    subtitle: 'NEURAL TELEMETRY & HARDWARE',
    desc: 'Interfacing embedded silicon with autonomous intelligence. Real-time edge compute across critical payloads.',
    code: 'SEC-04 // NEURAL-SYS',
    frameCount: 240,
  },
  {
    id: 5,
    folder: 'ezgif-2648f1735ee2e5c4-jpg',
    chapterNum: '05',
    title: 'COSMOS JEC GUILD',
    subtitle: 'COMMUNITY ARCHITECTURE',
    desc: 'The premier Science & Technology Guild of Jabalpur Engineering College. Fostering builders, engineers, and stargazers.',
    code: 'SEC-05 // GUILD-CORE',
    frameCount: 300,
  },
  {
    id: 6,
    folder: 'ezgif-2d9c0abdec6fddc5-jpg',
    chapterNum: '06',
    title: 'TECHBLITZ 2026',
    subtitle: 'FINALE // SYSTEM IGNITION',
    desc: 'The flagship national technological symposium. 6+ technical tracks, collegiate engineering sprints, and accredited certifications.',
    code: 'SEC-06 // FINALE-LAUNCH',
    frameCount: 240,
  },
];

export function CanvasStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loading & Progress State
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);

  // In-memory cache for frames: Map<string, HTMLImageElement>
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  // Fallback map: stores the most recently rendered image for each chapter
  const lastDrawnImageRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafIdRef = useRef<number | null>(null);

  // Format frame URL
  const getFrameUrl = useCallback((chapterIdx: number, frameIdx: number) => {
    const chapter = CHAPTERS[chapterIdx];
    const frameNumber = String(frameIdx + 1).padStart(3, '0');
    return `/frames/${chapter.folder}/ezgif-frame-${frameNumber}.jpg`;
  }, []);

  // Preloading all frames progressively with concurrency
  useEffect(() => {
    let cancelled = false;
    const cache = imageCacheRef.current;

    // Total frames: 300 + 240 + 240 + 240 + 300 + 240 = 1560
    const totalFrames = CHAPTERS.reduce((sum, ch) => sum + ch.frameCount, 0);
    let loadedCount = 0;

    // Priority 1: First frame of all chapters and first 30 frames of Chapter 1
    const highPriorityQueue: { c: number; f: number }[] = [];
    CHAPTERS.forEach((ch, c) => {
      highPriorityQueue.push({ c, f: 0 });
      highPriorityQueue.push({ c, f: Math.floor(ch.frameCount / 2) });
      highPriorityQueue.push({ c, f: ch.frameCount - 1 });
    });
    for (let f = 1; f < Math.min(60, CHAPTERS[0].frameCount); f++) {
      highPriorityQueue.push({ c: 0, f });
    }

    // Regular Queue: Remaining frames
    const normalQueue: { c: number; f: number }[] = [];
    CHAPTERS.forEach((ch, c) => {
      for (let f = 0; f < ch.frameCount; f++) {
        const alreadyInHigh = highPriorityQueue.some((item) => item.c === c && item.f === f);
        if (!alreadyInHigh) {
          normalQueue.push({ c, f });
        }
      }
    });

    const fullQueue = [...highPriorityQueue, ...normalQueue];
    const maxConcurrency = 24;
    let activeWorkers = 0;
    let queueIdx = 0;

    const loadNext = () => {
      if (cancelled) return;
      while (activeWorkers < maxConcurrency && queueIdx < fullQueue.length) {
        const item = fullQueue[queueIdx++];
        const url = getFrameUrl(item.c, item.f);

        if (cache.has(url)) {
          loadedCount++;
          updateProgress();
          continue;
        }

        activeWorkers++;
        const img = new Image();
        img.src = url;

        const onDone = () => {
          if (cancelled) return;
          activeWorkers--;
          cache.set(url, img);
          if (item.f === 0 && !lastDrawnImageRef.current.has(item.c)) {
            lastDrawnImageRef.current.set(item.c, img);
          }
          loadedCount++;
          updateProgress();
          loadNext();
        };

        img.onload = onDone;
        img.onerror = onDone;
      }
    };

    const updateProgress = () => {
      const pct = Math.min(100, Math.floor((loadedCount / totalFrames) * 100));
      setLoadProgress(pct);

      // Once high-priority frames (10%) are ready, allow viewing while background loading completes smoothly
      if (loadedCount >= 80 && !isLoaded) {
        setIsLoaded(true);
      }
    };

    loadNext();

    return () => {
      cancelled = true;
    };
  }, [getFrameUrl, isLoaded]);

  // Object-fit: cover center crop rendering
  const drawCoverImage = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      img: HTMLImageElement,
      alpha: number = 1
    ) => {
      if (!img || !img.naturalWidth) return;
      ctx.save();
      ctx.globalAlpha = alpha;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const hRatio = canvasWidth / imgWidth;
      const vRatio = canvasHeight / imgHeight;
      const ratio = Math.max(hRatio, vRatio);

      const drawWidth = imgWidth * ratio;
      const drawHeight = imgHeight * ratio;
      const drawX = (canvasWidth - drawWidth) / 2;
      const drawY = (canvasHeight - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    },
    []
  );

  // Render loop based on scroll position
  const renderFrameAtScroll = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    // Scroll calculations: 6 chapters * 160vh
    const rect = container.getBoundingClientRect();
    const totalScrollDist = container.scrollHeight - window.innerHeight;
    if (totalScrollDist <= 0) return;

    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollDist));

    // Chapter and local progress
    // rawProgress in [0, 1] mapped across 6 chapters
    const scaled = rawProgress * CHAPTERS.length;
    const chapterIdx = Math.min(CHAPTERS.length - 1, Math.floor(scaled));
    const localProgress = Math.min(1, Math.max(0, scaled - chapterIdx));

    setCurrentChapterIndex(chapterIdx);
    setChapterProgress(localProgress);

    const currentChapter = CHAPTERS[chapterIdx];
    const frameIndex = Math.min(
      currentChapter.frameCount - 1,
      Math.max(0, Math.floor(localProgress * currentChapter.frameCount))
    );

    // Frame retrieval
    const currentUrl = getFrameUrl(chapterIdx, frameIndex);
    let currentImg = imageCacheRef.current.get(currentUrl);

    // Fallback if current frame is buffering: use last drawn or first frame
    if (!currentImg || !currentImg.complete) {
      currentImg =
        lastDrawnImageRef.current.get(chapterIdx) ||
        imageCacheRef.current.get(getFrameUrl(chapterIdx, 0));
    } else {
      lastDrawnImageRef.current.set(chapterIdx, currentImg);
    }

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render primary frame
    if (currentImg && currentImg.complete && currentImg.naturalWidth) {
      drawCoverImage(ctx, canvas, currentImg, 1.0);
    }

    // Alpha-blend crossfade during final 12% scroll window of each scene
    // to smoothly transition into frame 1 (index 0) of next scene
    const CROSSFADE_WINDOW = 0.12;
    if (chapterIdx < CHAPTERS.length - 1 && localProgress >= 1 - CROSSFADE_WINDOW) {
      const crossfadeAlpha = (localProgress - (1 - CROSSFADE_WINDOW)) / CROSSFADE_WINDOW;
      const nextChapterIdx = chapterIdx + 1;
      const nextFrameUrl = getFrameUrl(nextChapterIdx, 0);
      const nextImg =
        imageCacheRef.current.get(nextFrameUrl) ||
        lastDrawnImageRef.current.get(nextChapterIdx);

      if (nextImg && nextImg.complete && nextImg.naturalWidth) {
        drawCoverImage(ctx, canvas, nextImg, crossfadeAlpha);
      }
    }
  }, [drawCoverImage, getFrameUrl]);

  // Scroll listener with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(renderFrameAtScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial draw
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrameAtScroll]);

  const activeChapter = CHAPTERS[currentChapterIndex];

  return (
    <div
      ref={containerRef}
      id="home"
      // 160vh per chapter * 6 chapters = 960vh
      className="relative w-full bg-black"
      style={{ height: `${CHAPTERS.length * 160}vh` }}
    >
      {/* Preloading Screen (0% to 100%) */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6 text-white"
          >
            <div className="w-full max-w-md space-y-6">
              {/* Logo / Subsystem Tag */}
              <div className="flex items-center justify-between font-mono text-xs text-neutral-400">
                <span className="tracking-widest">COSMOS // TECHBLITZ '26</span>
                <span className="text-white font-semibold">INITIALIZING</span>
              </div>

              {/* Minimalist Monochrome Progress Bar */}
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-900 border border-white/10">
                <motion.div
                  className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              {/* Progress Readout */}
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500 tracking-wider">
                  BUFFERING TELEMETRY FRAMES
                </span>
                <span className="text-white font-bold tracking-widest text-sm">
                  {loadProgress}%
                </span>
              </div>

              {/* Terminal Coordinates */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>LAT 23.2104° N // LON 79.9575° E</span>
                <span>JABALPUR ENGINEERING COLLEGE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* The 3D Scrub Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover block pointer-events-none"
        />

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/60 opacity-80" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)]" />

        {/* =====================================================================
            LEFT-ALIGNED STORY PLATE
            Minimalist frosted plate (bg-black/75 backdrop-blur-md border-l-2 border-white p-6)
            ===================================================================== */}
        <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none max-w-sm sm:max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="frosted-plate bg-black/75 backdrop-blur-md border-l-2 border-white p-6 rounded-r-lg shadow-[0_8px_32px_rgba(0,0,0,0.8)] border-y border-r border-white/5 pointer-events-auto"
            >
              {/* Telemetry Tag */}
              <div className="flex items-center justify-between mb-3 text-[11px] font-mono tracking-widest text-neutral-400 border-b border-white/10 pb-2">
                <span className="text-white font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white pulse-white-dot" />
                  {activeChapter.code}
                </span>
                <span className="text-neutral-500">
                  CH {activeChapter.chapterNum} / 06
                </span>
              </div>

              {/* Chapter Title */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 uppercase font-mono">
                {activeChapter.title}
              </h2>

              {/* Subtitle */}
              <h3 className="text-xs font-mono tracking-wider text-neutral-400 mb-4 uppercase">
                {activeChapter.subtitle}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {activeChapter.desc}
              </p>

              {/* Bottom Telemetry Detail */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>SCENE BUFFER: NOMINAL</span>
                <span>SCRUB: {Math.round(chapterProgress * 100)}%</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =====================================================================
            BOTTOM-RIGHT INDICATOR: "CHAPTER X / 6" with minimalist progress dashes
            ===================================================================== */}
        <div className="absolute right-6 sm:right-12 bottom-10 z-30 flex flex-col items-end gap-3 pointer-events-none">
          {/* Chapter readout */}
          <div className="flex items-center gap-3 font-mono text-xs text-white">
            <span className="tracking-widest font-semibold">
              CHAPTER {activeChapter.chapterNum} / 06
            </span>
            <span className="text-neutral-500 text-[11px]">
              [{Math.round(chapterProgress * 100)}%]
            </span>
          </div>

          {/* Minimalist Progress Dashes */}
          <div className="flex items-center gap-2">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === currentChapterIndex;
              const isPast = idx < currentChapterIndex;

              return (
                <div
                  key={ch.id}
                  className="relative h-1 transition-all duration-300 rounded-full"
                  style={{
                    width: isActive ? '36px' : '18px',
                    backgroundColor: isActive
                      ? '#ffffff'
                      : isPast
                      ? 'rgba(255, 255, 255, 0.4)'
                      : 'rgba(255, 255, 255, 0.12)',
                    boxShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Scroll Cue on Chapter 1 */}
          {currentChapterIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-2 text-[10px] font-mono text-neutral-500 tracking-widest flex items-center gap-1.5"
            >
              <span>SCROLL DOWN TO INITIATE SEQUENCE</span>
              <span className="inline-block animate-bounce">↓</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
