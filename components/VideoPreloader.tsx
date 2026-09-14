'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';

export interface VideoPreloaderProps {
  onComplete?: () => void;
  videoSrc?: string;
  autoFadeOnEnd?: boolean;
}

export function VideoPreloader({
  onComplete,
  videoSrc = '/preloader.mp4',
  autoFadeOnEnd = true,
}: VideoPreloaderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismissPreloader = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setIsOpen(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      onComplete?.();
    }, 900);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setVideoDuration(total);
    const pct = Math.min(100, Math.round((current / total) * 100));
    setProgress(pct);
  };

  const handleVideoEnded = () => {
    if (autoFadeOnEnd) {
      dismissPreloader();
    }
  };

  // Keyboard shortcut: ESC skips preloader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissPreloader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ensure autoplay triggers on mount
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires user interaction for autoplay
        });
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col justify-between bg-black text-white select-none transition-opacity duration-1000 overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Background Video (Cover) */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Cinematic Vignette Overlays for Contrast */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-t from-black/90 via-transparent to-black/80" />
      <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.75)_100%)]" />

      {/* Top HUD Bar */}
      <header className="relative z-10 w-full p-6 sm:p-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-white/30 bg-black/60 backdrop-blur flex items-center justify-center text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            CJ
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-white drop-shadow">
              COSMOS // JEC
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400">
              TECHBLITZ '26 PRELOADER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="px-3 py-1.5 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 hover:border-white/50 text-neutral-300 hover:text-white transition-all backdrop-blur flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
          </button>

          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={dismissPreloader}
            className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white text-white hover:text-black transition-all backdrop-blur font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          >
            <span>SKIP INTRO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Center Cinematic Title */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/70 backdrop-blur text-[11px] font-mono tracking-[0.25em] text-cyan-300 mb-4 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>MISSION INITIATION SEQUENCE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] uppercase">
          TECHBLITZ '26
        </h1>
        <p className="text-xs sm:text-sm font-mono text-neutral-300 tracking-wider mt-2 drop-shadow">
          JABALPUR ENGINEERING COLLEGE • DEPT OF CSE
        </p>
      </div>

      {/* Bottom Progress HUD */}
      <footer className="relative z-10 w-full p-6 sm:p-10 max-w-4xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono tracking-wider text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-bold">INITIALIZING SYSTEM TELEMETRY</span>
          </div>
          <div className="text-white font-mono font-bold text-sm">
            {progress}%
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 border border-white/15 overflow-hidden backdrop-blur">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-white transition-all duration-150 ease-out shadow-[0_0_12px_rgba(56,189,248,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 tracking-widest uppercase mt-1">
          <span>ORBITAL TRAJECTORY CALIBRATION</span>
          <span>PRESS ESC TO ENTER</span>
        </div>
      </footer>
    </div>
  );
}

export default VideoPreloader;
