'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BackgroundCanvas, TelemetryData } from './BackgroundCanvas';
import { StoryHudOverlay } from './StoryHudOverlay';
import {
  CHAPTERS,
  CHAPTER_RANGES,
  TOTAL_FRAMES,
  SCROLL_CONFIG,
  Chapter,
} from '@/config/scrollExperience';

export { CHAPTERS, CHAPTER_RANGES, TOTAL_FRAMES, SCROLL_CONFIG };
export type { Chapter };

interface CanvasStoryScrollProps {
  onReady?: () => void;
}

/**
 * ==============================================================================
 * 3D SCROLL-DRIVEN ORCHESTRATOR (Next.js / TypeScript)
 * Coordinates Layer 0 (Background Canvas), Layer 1 (Scroll Track Spacer),
 * and Layer 10 (HUD Overlay).
 * ==============================================================================
 */
export function CanvasStoryScroll({ onReady }: CanvasStoryScrollProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [targetProgress, setTargetProgress] = useState<number>(0);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    currentChapterIndex: 0,
    currentFrameNumber: 1,
    scrubPercent: 0,
    activeChapter: CHAPTERS[0],
  });

  // Calculate scroll progress through the natural document scroll track
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;

    if (scrollDistance <= 0) return;

    // How far we have scrolled into the track
    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / scrollDistance));

    setTargetProgress(rawProgress);

    // Fade out HUD when user scrolls into the lower content sections
    const bottomPastViewport = rect.bottom < window.innerHeight * 0.5;
    setIsHeroVisible(!bottomPastViewport);
  }, []);

  // Set up scroll listeners (passive & clean)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Jump to specific chapter
  const scrollToChapter = useCallback((chapterIdx: number) => {
    if (!trackRef.current) return;
    const range = CHAPTER_RANGES[chapterIdx];
    if (!range) return;

    const fraction = range.startFrame / TOTAL_FRAMES;
    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const scrollDistance = rect.height - window.innerHeight;
    const targetScrollY = trackTop + fraction * scrollDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }, []);

  const handleTelemetryUpdate = useCallback((newTelemetry: TelemetryData) => {
    setTelemetry(newTelemetry);
  }, []);

  return (
    <>
      {/* =====================================================================
          LAYER 0: PERSISTENT BACKGROUND 3D CANVAS (z-0)
          ===================================================================== */}
      <BackgroundCanvas
        targetProgress={targetProgress}
        onTelemetryUpdate={handleTelemetryUpdate}
        onReady={onReady}
      />

      {/* =====================================================================
          LAYER 10: HUD / STORY TEXT OVERLAY (z-10)
          ===================================================================== */}
      <StoryHudOverlay
        activeChapter={telemetry.activeChapter}
        currentChapterIndex={telemetry.currentChapterIndex}
        currentFrameNumber={telemetry.currentFrameNumber}
        scrubPercent={telemetry.scrubPercent}
        isVisible={isHeroVisible}
        onChapterSelect={scrollToChapter}
      />

      {/* =====================================================================
          LAYER 1: SCROLL TRACK SPACER (z-1)
          Dedicated spacer generating natural vertical scroll distance.
          Unobstructed, viewport-agnostic vertical height.
          ===================================================================== */}
      <div
        ref={trackRef}
        id="home"
        className="canvas-story-container relative w-full pointer-events-none"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: SCROLL_CONFIG.TRACK_HEIGHT_MOBILE,
          height: SCROLL_CONFIG.TRACK_HEIGHT_MOBILE,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

export default CanvasStoryScroll;
