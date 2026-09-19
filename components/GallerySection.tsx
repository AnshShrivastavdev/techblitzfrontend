'use client';

import React from 'react';
import { Camera } from 'lucide-react';

const GALLERY_CARDS = [
  {
    sector: 'SECTOR 01',
    tag: 'PAST EVENT // 2025 HACKATHON',
    title: 'Autonomous Rover & Obstacle Arenas',
    desc: 'Obstacle navigation testing with ultrasonic sensor arrays, LiDAR mapping, and automated trajectory correction.',
    badge: 'To Be Announced / Unlocking Soon',
  },
  {
    sector: 'SECTOR 02',
    tag: 'PAST EVENT // HARDWARE SPRINT',
    title: 'Embedded Firmware & RTOS Labs',
    desc: 'Custom PCB debugging, sensor bus integration, and real-time microcontroller telemetry at JEC Central Lab.',
    badge: 'To Be Announced / Unlocking Soon',
  },
  {
    sector: 'SECTOR 03',
    tag: 'PAST EVENT // ASTRONOMY SKY-WATCH',
    title: 'Deep Space Celestial Observation',
    desc: 'High-magnification telescope array deployment on JEC grounds for planetary analysis and lunar surface logging.',
    badge: 'To Be Announced / Unlocking Soon',
  },
  {
    sector: 'SECTOR 04',
    tag: 'TECHBLITZ 2026 // AUDITORIUM',
    title: 'Grand Keynote & Systems Expo',
    desc: 'Main stage setup for over 400 collegiate builders, academic scientists, and live technology demonstrations.',
    badge: 'To Be Announced / Unlocking Soon',
  },
  {
    sector: 'SECTOR 05',
    tag: 'TECHBLITZ 2026 // WORKBENCH',
    title: 'IoT & Hardware Prototyping Zone',
    desc: 'Dedicated solder stations, oscilloscopes, development boards, and direct mentorship by Cosmos technical alumni.',
    badge: 'To Be Announced / Unlocking Soon',
  },
  {
    sector: 'SECTOR 06',
    tag: 'TECHBLITZ 2026 // HACKATHON DEN',
    title: '24-Hour Overnight Systems Hackathon',
    desc: 'Continuous overnight engineering sprint, gigabit uplinks, hardware debugging, and jury reviews.',
    badge: 'To Be Announced / Unlocking Soon',
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 sm:py-32 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Centralized Section Header */}
        <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ARCHIVAL LOGS // PHOTO STREAM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Event Gallery & Visual Archives
          </h2>
          <p className="text-neutral-400 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Glimpses into past symposiums, competitive robotics bouts, deep space skywatches, and upcoming
            TechBlitz 2026 collegiate zones.
          </p>
        </div>

        {/* Spacious Grid of gallery cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GALLERY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 group backdrop-blur-md shadow-xl"
            >
              <div>
                {/* Top Telemetry Header */}
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400 mb-4 pb-3 border-b border-white/10">
                  <span className="text-cyan-300 font-semibold">{card.tag}</span>
                  <span className="text-[10px] text-neutral-500">{card.sector}</span>
                </div>

                {/* Minimalist Image Placeholder Frame */}
                <div className="h-44 sm:h-52 rounded-xl bg-neutral-900/60 border border-dashed border-white/20 flex flex-col items-center justify-center text-neutral-500 mb-5 group-hover:border-cyan-400/40 transition-colors relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  <div className="w-14 h-14 rounded-full border border-white/15 bg-neutral-950/90 flex items-center justify-center mb-3 group-hover:border-cyan-400/50 group-hover:scale-105 transition-all shadow-md">
                    <Camera className="w-6 h-6 text-neutral-400 group-hover:text-cyan-300 transition-colors" />
                  </div>

                  {/* "To Be Announced / Unlocking Soon" Glowing Badge */}
                  <div className="relative px-3.5 py-1 bg-black/95 border border-cyan-400/40 rounded-full text-[10px] font-mono font-bold tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{card.badge}</span>
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white mb-2 font-mono group-hover:text-cyan-200 transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                <span>SECURITY LEVEL: OPEN</span>
                <span className="text-cyan-400/80">ACCESS 2026</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
