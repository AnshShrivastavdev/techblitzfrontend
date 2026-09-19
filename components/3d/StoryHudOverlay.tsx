'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTERS, Chapter } from '@/config/scrollExperience';

interface StoryHudOverlayProps {
  activeChapter?: Chapter;
  currentChapterIndex?: number;
  currentFrameNumber?: number;
  scrubPercent?: number;
  isVisible?: boolean;
  onChapterSelect?: (chapterIdx: number) => void;
}

/**
 * ==============================================================================
 * LAYER 10: HUD / STORY TEXT OVERLAY LAYER
 * Pinned story text, titles, telemetry badges, and interactive controls:
 * fixed inset-0 pointer-events-none z-10
 * ==============================================================================
 */
export function StoryHudOverlay({
  activeChapter,
  currentChapterIndex = 0,
  currentFrameNumber = 1,
  scrubPercent = 0,
  isVisible = true,
  onChapterSelect,
}: StoryHudOverlayProps) {
  const chapter = activeChapter || CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 select-none ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* =====================================================================
          TOP HUD HEADER: COORDINATES & TELEMETRY
          ===================================================================== */}
      <div className="absolute top-3 sm:top-5 left-3 right-3 sm:left-6 sm:right-6 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-400 pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-3 bg-black/70 backdrop-blur-md px-2.5 sm:px-4 py-1 sm:py-2 rounded border border-white/10 pointer-events-auto">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white font-semibold text-[11px] sm:text-xs">COSMOS // JEC</span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline text-neutral-400">LAT: 23.1765° N · LON: 79.9864° E</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 bg-black/70 backdrop-blur-md px-2.5 sm:px-4 py-1 sm:py-2 rounded border border-white/10 pointer-events-auto">
          <span className="text-neutral-400">
            FRAME: <span className="text-cyan-400 font-bold">{String(currentFrameNumber).padStart(3, '0')}</span> / {chapter.frameCount}
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-cyan-300 font-semibold">{scrubPercent}%</span>
        </div>
      </div>


      {/* =====================================================================
          LEFT-ALIGNED SCI-FI STORY CONSOLE (FROSTED GLASS PLATE)
          ===================================================================== */}
      <div className="absolute left-3 right-3 sm:right-auto sm:left-8 md:left-12 bottom-14 sm:bottom-24 max-w-sm sm:max-w-md pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-black/85 backdrop-blur-xl border-l-4 border-cyan-400 p-3.5 sm:p-6 rounded-r-xl shadow-[0_0_40px_rgba(0,0,0,0.9)] border-y border-r border-white/10 pointer-events-auto"
          >
            {/* Header Tag & Spectrum Visualizer */}
            <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono tracking-widest text-cyan-400 mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                  {chapter.code}
                </span>
                <span className="text-neutral-400">CH.{chapter.chapterNum}</span>
              </div>

              {/* Simulated Audio/Telemetry Spectrum Bars */}
              <div className="flex items-center gap-0.5">
                <div className="w-1 bg-cyan-400/90 animate-pulse h-1.5" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 bg-cyan-400/90 animate-pulse h-3" style={{ animationDelay: '0.25s' }} />
                <div className="w-1 bg-cyan-400/90 animate-pulse h-4" style={{ animationDelay: '0.05s' }} />
                <div className="w-1 bg-cyan-400/90 animate-pulse h-2.5" style={{ animationDelay: '0.35s' }} />
                <div className="w-1 bg-cyan-400/90 animate-pulse h-1" style={{ animationDelay: '0.45s' }} />
              </div>
            </div>

            {/* Subtitle / Code */}
            <div className="text-[10px] sm:text-xs font-mono tracking-wider text-cyan-300/80 mb-1 sm:mb-1.5 uppercase">
              {chapter.subtitle}
            </div>

            {/* Chapter Headline Title */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-2 sm:mb-3 leading-tight uppercase font-sans">
              {chapter.title}
            </h2>

            {/* Chapter Narrative Description */}
            <p className="text-[11px] sm:text-xs md:text-sm text-neutral-300 leading-relaxed font-sans mb-3 sm:mb-4">
              {chapter.desc}
            </p>

            {/* Telemetry Metric Readout Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 sm:pt-3 border-t border-white/10 text-[9px] sm:text-[10px] font-mono">
              <div>
                <span className="text-neutral-500 block">APOGEE</span>
                <span className="text-neutral-200 font-medium">{chapter.apogee}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">VELOCITY</span>
                <span className="text-neutral-200 font-medium">{chapter.velocity}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">SIGNAL</span>
                <span className="text-cyan-400 font-medium">{chapter.signal}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =====================================================================
          RIGHT-ALIGNED INTERACTIVE CHAPTER TIMELINE (CLICKABLE NODES)
          ===================================================================== */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-auto hidden md:flex flex-col items-end gap-2.5 font-mono">
        <span className="text-[10px] tracking-widest text-neutral-500 uppercase mb-1">
          MISSION TIMELINE
        </span>

        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === currentChapterIndex;
          return (
            <button
              key={ch.id}
              onClick={() => onChapterSelect && onChapterSelect(idx)}
              className={`group flex items-center gap-3 px-3 py-1.5 rounded transition-all text-right cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'bg-black/60 border border-white/5 hover:border-white/20 hover:bg-black/80'
              }`}
            >
              <div className="flex flex-col items-end">
                <span
                  className={`text-[10px] font-bold tracking-wider transition-colors ${
                    isActive ? 'text-cyan-300' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                >
                  0{ch.id} // {ch.title}
                </span>
                <span className="text-[8px] text-neutral-500 uppercase tracking-widest">
                  {ch.code}
                </span>
              </div>

              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8] scale-125'
                    : 'bg-neutral-600 group-hover:bg-neutral-400'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          BOTTOM HUD: SCRUB PROGRESS BAR & SCROLL HINT
          ===================================================================== */}
      <div className="absolute bottom-3 sm:bottom-6 left-3 right-3 sm:left-8 sm:right-8 flex items-center justify-between gap-4 pointer-events-none">
        {/* Scrub Progress Meter */}
        <div className="w-full max-w-xs sm:max-w-md bg-black/60 backdrop-blur-md p-2 sm:p-2.5 rounded border border-white/10 pointer-events-auto">
          <div className="flex justify-between text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-400 mb-1">
            <span>SCRUB TRAJECTORY</span>
            <span className="text-cyan-400 font-bold">{scrubPercent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-75 ease-out shadow-[0_0_10px_#00f0ff]"
              style={{ width: `${scrubPercent}%` }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase bg-black/60 backdrop-blur-md px-3 py-2 rounded border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SCROLL TO TRAVERSE</span>
        </div>
      </div>
    </div>
  );
}

export default StoryHudOverlay;
