'use client';

import React from 'react';
import DepthCarousel from './DepthCarousel';
import { Sparkles } from 'lucide-react';

const CAROUSEL_ITEMS = [
  {
    image: '/gallery/event-1.jpg',
    alt: 'TechBlitz Opening Ceremony & Keynote Stage',
  },
  {
    image: '/gallery/event-2.jpg',
    alt: 'Autonomous Robotics & Arena Testing Battles',
  },
  {
    image: '/gallery/event-3.jpg',
    alt: 'Hardware Prototyping & Sensor Calibration Lab',
  },
  {
    image: '/gallery/event-4.jpg',
    alt: 'Overnight 24-Hour Collegiate Hackathon Den',
  },
  {
    image: '/gallery/event-5.jpg',
    alt: 'Technical Paper Presentation & Systems Demo',
  },
  {
    image: '/gallery/event-6.jpg',
    alt: 'Live Code Debugging & Mentor Guidance Sprint',
  },
  {
    image: '/gallery/event-7.jpg',
    alt: 'Grand Valedictory & Champion Award Ceremony',
  },
  {
    image: '/gallery/event-8.jpg',
    alt: 'Cosmos Technical Council & Volunteer Cohort',
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

        {/* 3D DepthCarousel Interactive Showcase */}
        <div className="flex flex-col items-center">
          <div className="mb-8 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/80 border border-white/10 text-[11px] font-mono text-cyan-400">
            <Sparkles size={13} className="text-cyan-400" />
            <span>INTERACTIVE 3D DEPTH CAROUSEL • LAST YEAR HIGHLIGHTS</span>
          </div>

          <div style={{ height: '520px', position: 'relative' }} className="w-full max-w-5xl">
            <DepthCarousel
              items={CAROUSEL_ITEMS}
              depth={220}
              spread={90}
              tilt={60}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.29}
              blur={12}
              autoplay
              loop
              cardWidth={300}
              cardHeight={380}
              radius={18}
              tint="#05060a"
              duration={700}
              ease="power3.out"
              autoplayDelay={3200}
              showControls
              showIndicators
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
