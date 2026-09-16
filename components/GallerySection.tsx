'use client';

import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, Satellite } from 'lucide-react';

interface GalleryCard {
  sector: string;
  tag: string;
  title: string;
  desc: string;
  badge: string;
}

const GALLERY_CARDS: GalleryCard[] = [
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
    <section id="gallery" className="py-16 sm:py-24 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>ARCHIVAL LOGS // PHOTO STREAM</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4 font-mono">
            Event Gallery & Visual Archives
          </h2>
          <p className="text-neutral-400 max-w-2xl text-xs sm:text-base">
            Glimpses into past symposiums, competitive robotics bouts, deep space skywatches, and upcoming
            TechBlitz event zones.
          </p>
        </div>

        {/* Grid of gallery cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GALLERY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-neutral-950/80 p-4 sm:p-6 flex flex-col justify-between hover:border-white/30 transition-all duration-300 group backdrop-blur-md"
            >
              <div>
                {/* Top Telemetry Header */}
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-500 mb-3 sm:mb-4 pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-semibold">{card.tag}</span>
                  <span className="text-[10px] text-neutral-500">{card.sector}</span>
                </div>

                {/* Minimalist Image Placeholder Frame */}
                <div className="h-36 sm:h-44 rounded-lg bg-neutral-900/50 border border-dashed border-white/15 flex flex-col items-center justify-center text-neutral-500 mb-4 sm:mb-5 group-hover:border-white/30 transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-neutral-950 flex items-center justify-center mb-3 group-hover:border-white/30 transition-colors">
                    <Camera className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                  </div>

                  {/* "To Be Announced / Unlocking Soon" Glowing Badge */}
                  <div className="relative px-3 py-1 bg-black/90 border border-white/30 rounded-full text-[10px] font-mono font-bold tracking-wider text-white shadow-[0_0_12px_rgba(255,255,255,0.3)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{card.badge}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-2 font-mono group-hover:text-neutral-100 transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Bottom HUD bar */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>COSMOS JEC PHOTO LOG</span>
                <span>LAT 23.2104° N</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
