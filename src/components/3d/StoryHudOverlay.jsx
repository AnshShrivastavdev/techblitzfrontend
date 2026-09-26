import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAPTERS } from '@/config/scrollExperience';

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
}) {
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

            {/* Chapter Title */}
            <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-0.5 sm:mb-1 font-sans">
              {chapter.title}
            </h3>

            {/* Subtitle */}
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-300/80 mb-1.5 sm:mb-2">
              {chapter.subtitle}
            </div>

            {/* Description */}
            <p className="text-[11px] sm:text-xs md:text-sm text-neutral-300 leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">
              {chapter.desc}
            </p>

            {/* Telemetry Micro-Readouts */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 font-mono text-[8px] sm:text-[10px]">
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
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 pointer-events-auto hidden md:flex flex-col items-end gap-3 font-mono">
        <span className="text-[10px] tracking-widest text-neutral-500 uppercase mb-1">
          MISSION TIMELINE
        </span>

        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === currentChapterIndex;
          return (
            <button
              key={ch.id}
              onClick={() => onChapterSelect && onChapterSelect(idx)}
              className={`group flex items-center gap-3 px-3 py-1.5 rounded transition-all text-right cursor-pointer pointer-events-auto ${
                isActive
                  ? 'bg-cyan-950/40 border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'hover:bg-white/5 border border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {ch.title}
              </span>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-cyan-400 shadow-[0_0_10px_#00f0ff] scale-125'
                    : 'bg-neutral-700 group-hover:bg-neutral-500'
                }`}
              >
                {isActive && <div className="w-1 h-1 rounded-full bg-black" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          BOTTOM MISSION SCRUB BAR & PROMPT
          ===================================================================== */}
      <div className="absolute bottom-2 sm:bottom-4 left-3 right-3 sm:left-6 sm:right-6 flex items-center justify-between gap-2 text-xs font-mono text-neutral-400 pointer-events-none">
        {/* Live Chapter Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <span className="text-white font-bold tracking-wider text-[11px] sm:text-xs">
            CH {chapter.chapterNum}/06
          </span>
          <div className="flex gap-1">
            {CHAPTERS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 sm:h-1.5 transition-all rounded-full ${
                  idx === currentChapterIndex
                    ? 'w-5 sm:w-6 bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                    : idx < currentChapterIndex
                    ? 'w-1.5 sm:w-2 bg-neutral-500'
                    : 'w-1.5 sm:w-2 bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll CTA Indicator */}
        <div className="flex items-center gap-2 text-neutral-400 pointer-events-none">
          <span className="hidden sm:inline text-[10px] tracking-widest uppercase text-cyan-300/80 animate-pulse">
            SCROLL DOWN TO ADVANCE 6 CHAPTERS
          </span>
          <div className="w-4 h-6 sm:w-5 sm:h-8 rounded-full border border-white/30 flex items-start justify-center p-0.5 sm:p-1">
            <div className="w-1 h-1.5 sm:h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/50 border border-white/10 rounded text-[10px] text-neutral-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            ABOUT ↓
          </a>
          <a
            href="#speakers"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-400/60 rounded text-[10px] text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer"
          >
            SPEAKERS →
          </a>
        </div>
      </div>
    </div>
  );
}

export default StoryHudOverlay;
