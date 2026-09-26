'use client';

import React from 'react';
import CircularGallery from './CircularGallery';
import { Sparkles } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    image: '/gallery/event-1.jpg',
    text: 'Keynote & Opening Stage',
  },
  {
    image: '/gallery/event-2.jpg',
    text: 'Autonomous Robotics',
  },
  {
    image: '/gallery/event-3.jpg',
    text: 'Hardware Prototyping',
  },
  {
    image: '/gallery/event-4.jpg',
    text: '24-Hour Hackathon Den',
  },
  {
    image: '/gallery/event-5.jpg',
    text: 'Systems Demo & Expo',
  },
  {
    image: '/gallery/event-6.jpg',
    text: 'Live Code Debugging',
  },
  {
    image: '/gallery/event-7.jpg',
    text: 'Grand Valedictory',
  },
  {
    image: '/gallery/event-8.jpg',
    text: 'Cosmos Guild Cohort',
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 sm:py-32 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Centralized Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ARCHIVAL LOGS // PHOTO STREAM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Event Gallery & Visual Archives
          </h2>
          <p className="text-neutral-400 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Experience the intensity and innovation of last year's TechBlitz through our interactive 3D spatial archives.
          </p>
        </div>

        {/* 3D CircularGallery Interactive Showcase */}
        <div className="flex flex-col items-center w-full">
          <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/80 border border-white/10 text-[11px] font-mono text-cyan-400">
            <Sparkles size={13} className="text-cyan-400" />
            <span>DRAG & SCROLL INTERACTIVE 3D CIRCULAR GALLERY • LAST YEAR HIGHLIGHTS</span>
          </div>

          <div style={{ height: '600px', position: 'relative' }} className="w-full">
            <CircularGallery
              items={GALLERY_ITEMS}
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.05}
              fontUrl=""
              font="bold 30px Orbitron"
              scrollSpeed={2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
