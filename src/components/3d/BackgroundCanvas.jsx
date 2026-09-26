import React, { useEffect, useRef, useCallback } from 'react';
import {
  CHAPTERS,
  CHAPTER_RANGES,
  TOTAL_FRAMES,
  SCROLL_CONFIG,
  getFramePath,
  getProgressIndices,
} from '@/config/scrollExperience';

/**
 * ==============================================================================
 * LAYER 0: BACKGROUND THREE.JS / 2D WEBGL CANVAS
 * Persistent, decoupled visual layer: fixed inset-0 pointer-events-none z-0
 * ==============================================================================
 */
export function BackgroundCanvas({ targetProgress = 0, onTelemetryUpdate, onReady }) {
  const canvasRef = useRef(null);

  // 2D Array cache: framesRef.current[chapterIndex][frameIndex] = HTMLImageElement
  const framesRef = useRef(CHAPTERS.map((ch) => new Array(ch.frameCount)));
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);
  const lastDrawnImageRef = useRef(null);
  const currentChapterIndexRef = useRef(0);
  const lastScrubPercentRef = useRef(0);
  const currentFrameNumberRef = useRef(1);

  // Keep targetProgressRef in sync
  useEffect(() => {
    targetProgressRef.current = targetProgress;
  }, [targetProgress]);

  // Object-fit: cover destination-fit centered render (works identically across all viewports)
  const drawCoverImage = useCallback((ctx, img, canvasWidth, canvasHeight, alpha = 1) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const canvasAspect = canvasWidth / canvasHeight;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

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

  // Proximity buffer: ensures adjacent frames are loaded ahead of time
  const ensureFramesNearby = useCallback((chIdx, frameIdx, windowSize = SCROLL_CONFIG.PROXIMITY_PRELOAD_WINDOW) => {
    const chapter = CHAPTERS[chIdx];
    if (!chapter) return;
    const start = Math.max(0, frameIdx - windowSize);
    const end = Math.min(chapter.frameCount - 1, frameIdx + windowSize);

    for (let f = start; f <= end; f++) {
      if (!framesRef.current[chIdx][f]) {
        const img = new Image();
        img.src = getFramePath(chIdx, f);
        framesRef.current[chIdx][f] = img;
      }
    }
  }, []);

  // Frame Preloader: Instant start (<300ms) + progressive background streaming
  useEffect(() => {
    let isCancelled = false;

    // Phase 1: Immediate essential keyframes for instant start
    const immediateKeys = [
      { c: 0, f: 0 },
      { c: 0, f: 1 },
      { c: 0, f: 2 },
      { c: 0, f: 3 },
      { c: 0, f: 4 },
      { c: 1, f: 0 },
      { c: 2, f: 0 },
      { c: 3, f: 0 },
      { c: 4, f: 0 },
      { c: 5, f: 0 },
    ];

    let immediateLoaded = 0;
    immediateKeys.forEach(({ c, f }) => {
      const img = new Image();
      img.src = getFramePath(c, f);
      framesRef.current[c][f] = img;

      img.onload = img.onerror = () => {
        if (isCancelled) return;
        immediateLoaded++;
        if (immediateLoaded >= 3 && onReady) {
          onReady();
        }
      };
    });

    // Phase 2: Rapid keyframe cadence (every 4th frame)
    const keyframes = [];
    CHAPTERS.forEach((ch, chIdx) => {
      for (let f = 0; f < ch.frameCount; f += SCROLL_CONFIG.KEYFRAME_SAMPLE_INTERVAL) {
        if (!framesRef.current[chIdx][f]) {
          keyframes.push({ c: chIdx, f });
        }
      }
    });

    let currentKeyIdx = 0;
    const loadNextKeyframeBatch = () => {
      if (isCancelled || currentKeyIdx >= keyframes.length) return;
      const batch = keyframes.slice(currentKeyIdx, currentKeyIdx + 12);
      currentKeyIdx += 12;

      batch.forEach(({ c, f }) => {
        if (!framesRef.current[c][f]) {
          const img = new Image();
          img.src = getFramePath(c, f);
          framesRef.current[c][f] = img;
        }
      });

      if (currentKeyIdx < keyframes.length) {
        requestAnimationFrame(loadNextKeyframeBatch);
      } else {
        // Phase 3: Background stream remaining frames sequentially
        loadAllRemainingFrames();
      }
    };

    requestAnimationFrame(loadNextKeyframeBatch);

    const loadAllRemainingFrames = () => {
      const remaining = [];
      CHAPTERS.forEach((ch, chIdx) => {
        for (let f = 0; f < ch.frameCount; f++) {
          if (!framesRef.current[chIdx][f]) {
            remaining.push({ c: chIdx, f });
          }
        }
      });

      let rIdx = 0;
      const streamBatch = () => {
        if (isCancelled || rIdx >= remaining.length) return;
        const batch = remaining.slice(rIdx, rIdx + 8);
        rIdx += 8;

        batch.forEach(({ c, f }) => {
          if (!framesRef.current[c][f]) {
            const img = new Image();
            img.src = getFramePath(c, f);
            framesRef.current[c][f] = img;
          }
        });

        if (rIdx < remaining.length) {
          setTimeout(streamBatch, 16);
        }
      };

      streamBatch();
    };

    return () => {
      isCancelled = true;
    };
  }, [onReady]);

  // High-performance Render Loop with LERP interpolation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
      if (lastDrawnImageRef.current) {
        drawCoverImage(ctx, lastDrawnImageRef.current, width, height, 1);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const renderLoop = () => {
      // Smooth dampening towards target scroll progress
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * SCROLL_CONFIG.LERP_FACTOR;

      // Extract chapter & frame telemetry
      const { chapterIdx, localFrameIdx, currentFrameNumber, scrubPercent } =
        getProgressIndices(currentProgressRef.current);

      // Preload nearby frames
      ensureFramesNearby(chapterIdx, localFrameIdx, SCROLL_CONFIG.PROXIMITY_PRELOAD_WINDOW);

      // Attempt to retrieve current frame image
      const img = framesRef.current[chapterIdx]?.[localFrameIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        drawCoverImage(ctx, img, width, height, 1);
        lastDrawnImageRef.current = img;
      } else if (lastDrawnImageRef.current) {
        // Safe fallback: hold last drawn image to eliminate flashing
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        drawCoverImage(ctx, lastDrawnImageRef.current, width, height, 1);
      }

      // Notify parent telemetry when values shift
      if (
        onTelemetryUpdate &&
        (currentChapterIndexRef.current !== chapterIdx ||
          currentFrameNumberRef.current !== currentFrameNumber ||
          lastScrubPercentRef.current !== scrubPercent)
      ) {
        currentChapterIndexRef.current = chapterIdx;
        currentFrameNumberRef.current = currentFrameNumber;
        lastScrubPercentRef.current = scrubPercent;

        onTelemetryUpdate({
          currentChapterIndex: chapterIdx,
          currentFrameNumber,
          scrubPercent,
          activeChapter: CHAPTERS[chapterIdx],
        });
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawCoverImage, ensureFramesNearby, onTelemetryUpdate]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black select-none"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#000000',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      />

      {/* Vignette & Ambient Darkness Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

      {/* Grid overlay lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
    </div>
  );
}

export default BackgroundCanvas;
