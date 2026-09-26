'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface SceneConfig {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  folder: string;
  frameCount: number;
}

export const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: 'The Cosmic Void',
    subtitle: 'ORIGIN // SYSTEM INITIALIZATION',
    tag: 'SCENE 01 / 06',
    folder: 'ezgif-20453c58589fe7f0-jpg',
    frameCount: 300,
  },
  {
    id: 2,
    title: 'Orbital Trajectory',
    subtitle: 'VECTOR ACCELERATION',
    tag: 'SCENE 02 / 06',
    folder: 'ezgif-2a0d9360cfda774a-jpg',
    frameCount: 240,
  },
  {
    id: 3,
    title: 'Space Science & Exploration',
    subtitle: 'DEEP CELESTIAL ANALYSIS',
    tag: 'SCENE 03 / 06',
    folder: 'ezgif-278a1d853b4e756b-jpg',
    frameCount: 240,
  },
  {
    id: 4,
    title: 'Subsystem Telemetry & AI',
    subtitle: 'AUTONOMOUS SILICON INTERFACE',
    tag: 'SCENE 04 / 06',
    folder: 'ezgif-2df4780fdcfd6bba-jpg',
    frameCount: 240,
  },
  {
    id: 5,
    title: 'Club Intro', // Requirement: Scene 5 must be titled "Club Intro"
    subtitle: 'COSMOS // THE ENGINEERING GUILD',
    tag: 'SCENE 05 / 06',
    folder: 'ezgif-2648f1735ee2e5c4-jpg',
    frameCount: 300,
  },
  {
    id: 6,
    title: 'TechBlitz Finale', // Requirement: Scene 6 - TechBlitz Finale
    subtitle: 'IGNITION & APEX CELEBRATION',
    tag: 'SCENE 06 / 06',
    folder: 'ezgif-2d9c0abdec6fddc5-jpg',
    frameCount: 240,
  },
];

const TOTAL_FRAMES = SCENES.reduce((acc, scene) => acc + scene.frameCount, 0); // 1,560 frames

export function CanvasScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preloading & Status state
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);

  // Image storage: 2D array of images indexed by [sceneIdx][frameIdx]
  const imagesRef = useRef<HTMLImageElement[][]>(SCENES.map(() => []));
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const currentProgressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentSceneIdxRef = useRef<number>(0);
  const lastProgressPctRef = useRef<number>(0);

  // Helper to format frame path
  const getFramePath = useCallback((sceneIndex: number, frameIndex: number) => {
    const scene = SCENES[sceneIndex];
    const frameNum = String(frameIndex + 1).padStart(3, '0');
    return `/frames/${scene.folder}/ezgif-frame-${frameNum}.jpg`;
  }, []);

  // 1. Fast, progressive preloading: Instant readiness (<350ms) + background streaming
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    interface FrameTask {
      sceneIdx: number;
      frameIdx: number;
      url: string;
      isCritical: boolean;
    }

    const tasks: FrameTask[] = [];

    // Prioritize frame 0 of all scenes and first 10 frames of Scene 1 (Critical Path)
    for (let s = 0; s < SCENES.length; s++) {
      tasks.push({
        sceneIdx: s,
        frameIdx: 0,
        url: getFramePath(s, 0),
        isCritical: true,
      });
    }

    for (let f = 1; f < Math.min(12, SCENES[0].frameCount); f++) {
      tasks.push({
        sceneIdx: 0,
        frameIdx: f,
        url: getFramePath(0, f),
        isCritical: true,
      });
    }

    // Queue remaining frames scene by scene for natural scrolling direction
    for (let s = 0; s < SCENES.length; s++) {
      const startF = s === 0 ? Math.min(12, SCENES[0].frameCount) : 1;
      for (let f = startF; f < SCENES[s].frameCount; f++) {
        tasks.push({
          sceneIdx: s,
          frameIdx: f,
          url: getFramePath(s, f),
          isCritical: false,
        });
      }
    }

    // Allocate 2D arrays
    for (let s = 0; s < SCENES.length; s++) {
      imagesRef.current[s] = new Array(SCENES[s].frameCount);
    }

    // Fast initial percentage animation (0 -> 100% in ~350ms)
    let pct = 0;
    const countInterval = setInterval(() => {
      if (isCancelled) return;
      pct = Math.min(100, pct + Math.floor(Math.random() * 25 + 15));
      setLoadPercent(pct);
      if (pct >= 100) {
        clearInterval(countInterval);
        setIsLoaded(true);
      }
    }, 45);

    // Hard fallback: Unlock within 400ms under all conditions so website is never slow
    const unlockTimeout = setTimeout(() => {
      if (!isCancelled) {
        setLoadPercent(100);
        setIsLoaded(true);
      }
    }, 400);

    const CONCURRENCY = 36;
    let currentIndex = 0;

    const loadNext = (): Promise<void> => {
      if (isCancelled || currentIndex >= tasks.length) {
        return Promise.resolve();
      }

      const task = tasks[currentIndex++];
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = task.url;

        const onDone = () => {
          if (isCancelled) return;
          imagesRef.current[task.sceneIdx][task.frameIdx] = img;
          loadedCount++;

          if (task.isCritical && loadedCount >= 8) {
            setIsLoaded(true);
            setLoadPercent(100);
          }
          resolve();
        };

        img.onload = onDone;
        img.onerror = onDone;
      }).then(() => loadNext());
    };

    const workers = Array.from({ length: CONCURRENCY }, () => loadNext());

    Promise.all(workers).then(() => {
      if (!isCancelled) {
        setLoadPercent(100);
        setIsLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
      clearInterval(countInterval);
      clearTimeout(unlockTimeout);
    };
  }, [getFramePath]);

  // Object-fit: cover center-crop render function
  const drawImageCover = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number,
      alpha = 1.0
    ) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;
      const imgAspect = imgWidth / imgHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (canvasAspect > imgAspect) {
        // Canvas is wider than image aspect ratio -> fit width, crop height
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        // Canvas is taller than image aspect ratio -> fit height, crop width
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    },
    []
  );

  // Precomputed cumulative scene offsets
  const SCENE_RANGES = [
    { sceneIdx: 0, startFrame: 0, count: 300 },
    { sceneIdx: 1, startFrame: 300, count: 240 },
    { sceneIdx: 2, startFrame: 540, count: 240 },
    { sceneIdx: 3, startFrame: 780, count: 240 },
    { sceneIdx: 4, startFrame: 1020, count: 300 },
    { sceneIdx: 5, startFrame: 1320, count: 240 },
  ];

  const getSceneFrameInfo = useCallback((globalFrame: number) => {
    for (let i = 0; i < SCENE_RANGES.length; i++) {
      const r = SCENE_RANGES[i];
      if (globalFrame >= r.startFrame && globalFrame < r.startFrame + r.count) {
        return {
          sceneIdx: i,
          frameInScene: globalFrame - r.startFrame,
          totalFramesInScene: r.count,
        };
      }
    }
    const last = SCENE_RANGES[SCENE_RANGES.length - 1];
    return {
      sceneIdx: SCENE_RANGES.length - 1,
      frameInScene: last.count - 1,
      totalFramesInScene: last.count,
    };
  }, []);

  // Dynamic predictive preloader: proactively buffer frames around current scroll position
  const ensureFramesNearby = useCallback(
    (sceneIdx: number, frameIdx: number) => {
      const count = SCENE_RANGES[sceneIdx].count;
      for (let offset = -5; offset <= 30; offset++) {
        const f = frameIdx + offset;
        if (f >= 0 && f < count) {
          if (!imagesRef.current[sceneIdx]?.[f]) {
            const img = new Image();
            img.src = getFramePath(sceneIdx, f);
            if (!imagesRef.current[sceneIdx]) {
              imagesRef.current[sceneIdx] = [];
            }
            imagesRef.current[sceneIdx][f] = img;
          }
        }
      }
    },
    [getFramePath]
  );

  const getFrameImage = useCallback((sceneIdx: number, frameIdx: number) => {
    const frames = imagesRef.current[sceneIdx];
    const count = SCENE_RANGES[sceneIdx].count;
    const clamped = Math.max(0, Math.min(count - 1, frameIdx));

    if (frames) {
      const direct = frames[clamped];
      if (direct && direct.complete && direct.naturalWidth > 0) return direct;

      // Search whole scene outward from nearest frame
      for (let offset = 1; offset < count; offset++) {
        const prev = frames[clamped - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) return prev;
        const next = frames[clamped + offset];
        if (next && next.complete && next.naturalWidth > 0) return next;
      }
    }

    // Search earlier scenes if current scene is buffering
    for (let s = sceneIdx - 1; s >= 0; s--) {
      const sFrames = imagesRef.current[s];
      if (sFrames) {
        for (let f = sFrames.length - 1; f >= 0; f--) {
          const prev = sFrames[f];
          if (prev && prev.complete && prev.naturalWidth > 0) return prev;
        }
      }
    }

    // Ultimate fallback: never return null if we already drew a frame
    return lastDrawnImageRef.current;
  }, []);

  // Render logic for specific progress: strictly monotonic 0 to 1559 covers ALL 1560 frames
  const renderFrameAtProgress = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const clamped = Math.max(0, Math.min(progress, 0.999999));
      const targetGlobalFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(clamped * TOTAL_FRAMES))
      );

      const { sceneIdx, frameInScene, totalFramesInScene } = getSceneFrameInfo(targetGlobalFrame);

      if (sceneIdx !== currentSceneIdxRef.current) {
        currentSceneIdxRef.current = sceneIdx;
        setCurrentSceneIdx(sceneIdx);
      }
      const newPct = Math.round((frameInScene / totalFramesInScene) * 100);
      if (newPct !== lastProgressPctRef.current) {
        lastProgressPctRef.current = newPct;
        setSceneProgress(newPct / 100);
      }

      // Dynamically stream upcoming frames around current scroll position
      ensureFramesNearby(sceneIdx, frameInScene);

      const BLEND_FRAMES = 6;
      const isNearEnd =
        frameInScene >= totalFramesInScene - BLEND_FRAMES && sceneIdx < SCENE_RANGES.length - 1;

      if (isNearEnd) {
        const t = (frameInScene - (totalFramesInScene - BLEND_FRAMES)) / BLEND_FRAMES;
        const curImg = getFrameImage(sceneIdx, frameInScene);
        const nextImg = getFrameImage(sceneIdx + 1, 0);

        if (curImg) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawImageCover(ctx, curImg, canvas.width, canvas.height, 1.0);
          lastDrawnImageRef.current = curImg;
        }
        if (nextImg) {
          drawImageCover(ctx, nextImg, canvas.width, canvas.height, t);
        }
      } else {
        const img = getFrameImage(sceneIdx, frameInScene);
        if (img) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawImageCover(ctx, img, canvas.width, canvas.height, 1.0);
          lastDrawnImageRef.current = img;
        }
      }
    },
    [drawImageCover, ensureFramesNearby, getFrameImage, getSceneFrameInfo]
  );

  // Resize handler for Retina displays & responsive cover math
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrameAtProgress]);

  // RequestAnimationFrame scroll listening loop with smooth lerping
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const totalScrollDistance = container.offsetHeight - window.innerHeight;

      if (totalScrollDistance <= 0) return;

      const progress = Math.max(0, Math.min(-rect.top / totalScrollDistance, 1));
      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const lenisInstance = (window as any).__lenis;
    if (lenisInstance) {
      lenisInstance.on('scroll', handleScroll);
    }
    handleScroll();

    let isRunning = true;
    const tick = () => {
      if (!isRunning) return;

      // Ultra-snappy lerp towards target scroll position for 60-120fps fluid scrubbing
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
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [renderFrameAtProgress]);

  const activeScene = SCENES[currentSceneIdx] || SCENES[0];

  return (
    <div className="relative w-full bg-black text-white selection:bg-white selection:text-black">


      {/* 2. SCROLL CONTAINER (1200vh on mobile, 1500vh on sm/desktop) */}
      <div
        ref={containerRef}
        className="canvas-scroller-container relative w-full h-[1200vh] sm:h-[1500vh]"
        style={{ minHeight: '1200vh', height: '1200vh' }}
      >
        {/* Sticky Full-Screen Canvas Container */}
        <div
          className="sticky top-0 left-0 w-full h-screen h-[100dvh] overflow-hidden pointer-events-none"
          style={{ position: 'sticky', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block bg-black pointer-events-none"
            style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
          />

          {/* Subtle Film Grain Vignette for contrast */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />

          {/* 3. LEFT-ALIGNED HIGH-CONTRAST B&W FROSTED TEXT BOX */}
          <div className="absolute left-3 right-3 sm:right-auto sm:left-12 lg:left-16 bottom-4 sm:bottom-16 max-w-md w-auto z-20 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/20 p-4 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] border-l-4 border-l-white transition-all duration-300">
              {/* Scene Tag and Subtitle */}
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-black bg-white font-bold px-2 py-0.5 uppercase">
                  {activeScene.tag}
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-neutral-400 uppercase">
                  {activeScene.subtitle}
                </span>
              </div>

              {/* Dynamic Chapter Title (Scene 5 is strictly "Club Intro") */}
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase font-sans mb-2 sm:mb-3">
                {activeScene.title}
              </h2>

              {/* Scrub Progress Meter */}
              <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-wider text-neutral-400">
                <span>CHAPTER PROGRESS</span>
                <span className="text-white font-bold font-mono">
                  {Math.round(sceneProgress * 100)}%
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 mt-1.5 sm:mt-2 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: `${Math.round(sceneProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right-aligned Minimal Scene Index Navigation */}
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-20 pointer-events-none select-none">
            {SCENES.map((scene, idx) => (
              <div
                key={scene.id}
                className="flex items-center gap-3 transition-all duration-300"
              >
                <div
                  className={`w-1.5 transition-all duration-300 ${
                    idx === currentSceneIdx
                      ? 'h-8 bg-white'
                      : 'h-2 bg-neutral-600'
                  }`}
                />
                <span
                  className={`font-mono text-[10px] tracking-widest transition-opacity duration-300 ${
                    idx === currentSceneIdx ? 'opacity-100 text-white' : 'opacity-0'
                  }`}
                >
                  0{scene.id} // {scene.title}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Right Minimal Scroll Indicator - Hidden on mobile to prevent overlay conflict */}
          <div className="hidden sm:flex absolute right-6 sm:right-12 bottom-12 sm:bottom-16 items-center gap-3 z-20 pointer-events-none select-none text-neutral-500 font-mono text-[11px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>SCROLL TO SCRUB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasScroller;
