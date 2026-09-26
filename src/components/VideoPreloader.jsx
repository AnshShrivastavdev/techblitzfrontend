import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

export function VideoPreloader({
  onComplete,
  videoSrc = '/preloader.mp4',
  autoFadeOnEnd = true,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const dismissPreloader = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setIsOpen(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (onComplete) onComplete();
    }, 700);
  };

  const handleVideoEnded = () => {
    if (autoFadeOnEnd) {
      dismissPreloader();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismissPreloader();
      }
    };
    const handleScrollOrWheel = () => {
      dismissPreloader();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleScrollOrWheel, { passive: true });
    window.addEventListener('scroll', handleScrollOrWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleScrollOrWheel);
      window.removeEventListener('scroll', handleScrollOrWheel);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy blocks autoplay, dismiss gracefully after brief pause
          setTimeout(dismissPreloader, 2000);
        });
      }
    }

    // Safety fallback: never hold user longer than video length / 6 seconds
    const safetyTimer = setTimeout(() => {
      dismissPreloader();
    }, 6000);

    return () => clearTimeout(safetyTimer);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      onClick={dismissPreloader}
      style={{ pointerEvents: isFading || !isOpen ? 'none' : 'auto' }}
      className={`fixed inset-0 z-[99999] flex flex-col justify-between bg-black text-white select-none transition-opacity duration-700 overflow-hidden cursor-pointer ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Pure Fullscreen Video without obstructing text overlays */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Minimal Top Controls: Audio toggle & Skip button */}
      <div 
        className="relative z-10 w-full p-4 sm:p-8 flex items-center justify-end gap-3 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="px-3 py-1.5 rounded-full border border-white/20 bg-black/50 hover:bg-white/10 hover:border-white/50 text-neutral-300 hover:text-white transition-all backdrop-blur flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-lg"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
        </button>

        <button
          type="button"
          onClick={dismissPreloader}
          className="px-3.5 py-1.5 rounded-full border border-white/20 bg-black/50 hover:bg-white text-white hover:text-black transition-all backdrop-blur font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <span className="text-[11px]">SKIP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default VideoPreloader;
