import React from 'react';
import DepthCarousel from './DepthCarousel';
import { Sparkles, Calendar, ExternalLink } from 'lucide-react';

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

const GALLERY_CARDS = [
  {
    sector: 'SECTOR 01',
    tag: 'PAST EVENT // 2025 HACKATHON',
    title: 'Autonomous Rover & Obstacle Arenas',
    desc: 'Obstacle navigation testing with ultrasonic sensor arrays, LiDAR mapping, and automated trajectory correction.',
    image: '/gallery/event-1.jpg',
    badge: 'Archived // 2025',
  },
  {
    sector: 'SECTOR 02',
    tag: 'PAST EVENT // HARDWARE SPRINT',
    title: 'Embedded Firmware & RTOS Labs',
    desc: 'Custom PCB debugging, sensor bus integration, and real-time microcontroller telemetry at JEC Central Lab.',
    image: '/gallery/event-2.jpg',
    badge: 'Archived // 2025',
  },
  {
    sector: 'SECTOR 03',
    tag: 'PAST EVENT // SKY-WATCH',
    title: 'Deep Space Celestial Observation',
    desc: 'High-magnification telescope array deployment on JEC grounds for planetary analysis and lunar surface logging.',
    image: '/gallery/event-3.jpg',
    badge: 'Archived // 2025',
  },
  {
    sector: 'SECTOR 04',
    tag: 'TECHBLITZ // AUDITORIUM',
    title: 'Grand Keynote & Systems Expo',
    desc: 'Main stage setup for over 400 collegiate builders, academic scientists, and live technology demonstrations.',
    image: '/gallery/event-4.jpg',
    badge: 'Archived // 2025',
  },
  {
    sector: 'SECTOR 05',
    tag: 'TECHBLITZ // WORKBENCH',
    title: 'IoT & Hardware Prototyping Zone',
    desc: 'Dedicated solder stations, oscilloscopes, development boards, and direct mentorship by Cosmos alumni.',
    image: '/gallery/event-5.jpg',
    badge: 'Archived // 2025',
  },
  {
    sector: 'SECTOR 06',
    tag: 'TECHBLITZ // HACKATHON DEN',
    title: '24-Hour Overnight Systems Hackathon',
    desc: 'Continuous overnight engineering sprint, gigabit uplinks, hardware debugging, and jury reviews.',
    image: '/gallery/event-6.jpg',
    badge: 'Archived // 2025',
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

        {/* 3D DepthCarousel Interactive Centerpiece */}
        <div className="mb-24 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-white/10 text-[11px] font-mono text-cyan-400">
            <Sparkles size={13} className="text-cyan-400" />
            <span>INTERACTIVE 3D DEPTH CAROUSEL • LAST YEAR HIGHLIGHTS</span>
          </div>

          <div style={{ height: '500px', position: 'relative' }} className="w-full max-w-5xl">
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

        {/* Detailed Archival Grid */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 tracking-wider">
            <Calendar size={14} className="text-cyan-400" />
            <span>CURATED ARCHIVE SECTORS</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">6 LOGS AVAILABLE</span>
        </div>

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

                {/* Real Event Image Frame */}
                <div className="h-44 sm:h-52 rounded-xl bg-neutral-900/60 border border-white/10 overflow-hidden mb-5 relative group-hover:border-cyan-400/40 transition-colors shadow-inner">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/90 border border-cyan-400/40 rounded-full text-[10px] font-mono font-bold tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] flex items-center gap-1.5">
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
                <span className="text-cyan-400/80">ACCESS 2025 LOGS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
