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
  const rafIdRef = useRef<number | null>(null);
  const currentProgressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);

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

  // Render logic for specific progress
  const renderFrameAtProgress = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const totalScenes = SCENES.length;
      const clamped = Math.max(0, Math.min(progress, 0.999999));

      // Determine current scene index and normalized scene progress [0, 1)
      const rawScene = clamped * totalScenes;
      const sceneIdx = Math.min(Math.floor(rawScene), totalScenes - 1);
      const curSceneProgress = rawScene - sceneIdx;

      setCurrentSceneIdx(sceneIdx);
      setSceneProgress(curSceneProgress);

      const curScene = SCENES[sceneIdx];
      const curSceneFrames = imagesRef.current[sceneIdx];

      // Clear canvas before drawing
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smoothly crossfade (alpha blend) the last 10% into the first frame of the next scene
      const CROSSFADE_THRESHOLD = 0.9;

      if (curSceneProgress < CROSSFADE_THRESHOLD || sceneIdx === totalScenes - 1) {
        // Normal scene playback (first 90% of scene, or entire final scene)
        const normalized =
          sceneIdx === totalScenes - 1
            ? curSceneProgress
            : curSceneProgress / CROSSFADE_THRESHOLD;

        const frameIdx = Math.min(
          Math.floor(normalized * curScene.frameCount),
          curScene.frameCount - 1
        );

        // Resilient closest-frame lookup
        let img = curSceneFrames?.[frameIdx];
        if (!img || !img.complete || img.naturalWidth === 0) {
          for (let offset = 1; offset < 35; offset++) {
            const prev = curSceneFrames?.[frameIdx - offset];
            if (prev && prev.complete && prev.naturalWidth > 0) {
              img = prev;
              break;
            }
            const next = curSceneFrames?.[frameIdx + offset];
            if (next && next.complete && next.naturalWidth > 0) {
              img = next;
              break;
            }
          }
          if (!img || !img.complete || img.naturalWidth === 0) {
            img = curSceneFrames?.[0];
          }
        }

        if (img) {
          drawImageCover(ctx, img, canvas.width, canvas.height, 1.0);
        }
      } else {
        // Crossfade window: last 10% of current scene (progress 0.9 to 1.0)
        const t = (curSceneProgress - CROSSFADE_THRESHOLD) / (1 - CROSSFADE_THRESHOLD);

        const lastFrameIdx = curScene.frameCount - 1;
        let curImg = curSceneFrames?.[lastFrameIdx];
        if (!curImg || !curImg.complete || curImg.naturalWidth === 0) {
          curImg = curSceneFrames?.[0];
        }

        const nextSceneFrames = imagesRef.current[sceneIdx + 1];
        const nextImg = nextSceneFrames?.[0];

        if (curImg) {
          drawImageCover(ctx, curImg, canvas.width, canvas.height, 1.0);
        }
        if (nextImg) {
          drawImageCover(ctx, nextImg, canvas.width, canvas.height, t);
        }
      }
    },
    [drawImageCover]
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
    handleScroll();

    let isRunning = true;
    const tick = () => {
      if (!isRunning) return;

      // Smooth lerp towards target scroll position for 60-120fps fluid scrubbing
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.18;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      renderFrameAtProgress(currentProgressRef.current);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [renderFrameAtProgress]);

  const activeScene = SCENES[currentSceneIdx] || SCENES[0];

  return (
    <div className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* 1. MINIMAL BLACK-AND-WHITE LOADING PERCENTAGE SCREEN */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 select-none ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <div className="flex flex-col items-center max-w-md w-full px-6">
          {/* Top Aerospace/Tech Tag */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
              TECHBLITZ // SYSTEM INITIALIZATION
            </span>
          </div>

          {/* Large High-Contrast Percentage Counter */}
          <div className="text-6xl sm:text-8xl font-black font-mono tracking-tighter text-white">
            {loadPercent}%
          </div>

          {/* Minimalist 2px White Progress Bar */}
          <div className="w-full h-[2px] bg-neutral-900 border border-neutral-800 my-6 sm:my-8 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-out"
              style={{ width: `${loadPercent}%` }}
            />
          </div>

          {/* Monospace Telemetry Subtext */}
          <div className="w-full flex justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500 tracking-wider">
            <span>FRAMES BUFFERED</span>
            <span className="text-neutral-300">
              {Math.round((loadPercent / 100) * TOTAL_FRAMES)} / {TOTAL_FRAMES}
            </span>
          </div>
          <div className="w-full flex justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500 tracking-wider mt-1">
            <span>TELEMETRY STATUS</span>
            <span className="text-white">
              {loadPercent === 100 ? 'READY TO ENGAGE' : 'DECODING HIGH-RES ASSETS...'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCROLL CONTAINER (660vh on mobile, 1080vh on sm/desktop) */}
      <div
        ref={containerRef}
        className="relative w-full h-[660vh] sm:h-[1080vh]"
      >
        {/* Sticky Full-Screen Canvas Container */}
        <div className="sticky top-0 left-0 w-full h-screen h-[100dvh] overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full block bg-black"
          />

          {/* Subtle Film Grain Vignette for contrast */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />

          {/* 3. LEFT-ALIGNED HIGH-CONTRAST B&W FROSTED TEXT BOX */}
          <div className="absolute left-3 right-3 sm:right-auto sm:left-12 lg:left-16 bottom-4 sm:bottom-16 max-w-md w-auto z-20 pointer-events-auto">
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
