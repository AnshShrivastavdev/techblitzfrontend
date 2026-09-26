import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const EVENT_ZONES = [
  {
    id: 'zone-01',
    tag: 'ZONE 01 // ROBOTICS',
    title: 'Autonomous Rover & SLAM Arena',
    desc: 'LiDAR-assisted obstacle traversal, real-time kinematic telemetry, and ROS 2 autonomous navigation circuits.',
    capacity: 'CAPACITY: 60 TEAMS',
    actionText: 'ACCESS LAB',
  },
  {
    id: 'zone-02',
    tag: 'ZONE 02 // HARDWARE',
    title: 'Embedded Firmware & RTOS Labs',
    desc: 'Custom PCB bring-up, CAN bus telemetry, and bare-metal microcontroller scheduling at JEC central lab.',
    capacity: 'CAPACITY: 45 SEATS',
    actionText: 'ACCESS LAB',
  },
  {
    id: 'zone-03',
    tag: 'ZONE 03 // SPACE SCIENCE',
    title: 'Satellite Ground Station & Telemetry',
    desc: 'Software-defined radio demodulation, orbital pass logging, and deep-space celestial observation rigs.',
    capacity: 'CAPACITY: 50 SEATS',
    actionText: 'ACCESS LAB',
  },
  {
    id: 'zone-04',
    tag: 'ZONE 04 // AI & COMPUTE',
    title: 'Neural Architecture & Edge Tensors',
    desc: 'Low-latency deep neural model quantization, tensor core optimization, and on-device computer vision.',
    capacity: 'CAPACITY: 80 SEATS',
    actionText: 'ACCESS LAB',
  },
  {
    id: 'zone-05',
    tag: 'ZONE 05 // PROTOTYPING',
    title: 'IoT Workbench & Solder Foundry',
    desc: 'High-frequency digital oscilloscopes, component kits, and live mentorship from Cosmos engineering alumni.',
    capacity: 'CAPACITY: 40 WORKSTATIONS',
    actionText: 'ACCESS LAB',
  },
  {
    id: 'zone-06',
    tag: 'ZONE 06 // HACKATHON',
    title: '24-Hour Systems Hackathon Den',
    desc: 'High-throughput gigabit uplinks, dedicated hardware testbeds, and round-the-clock systems builds.',
    capacity: 'CAPACITY: 120 BUILDERS',
    actionText: 'ACCESS LAB',
  },
];

export function EventZonesSection() {
  return (
    <section id="zones" className="py-24 sm:py-36 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centralized Section Header */}
        <div className="mb-16 sm:mb-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>EXPLORATION // TECHNICAL ZONES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Tech Event Zones
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Explore dedicated hands-on arenas, hardware testing facilities, and collegiate engineering sprints.
          </p>
        </div>

        {/* 3-Column Responsive Card Grid (Step 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {EVENT_ZONES.map((zone) => (
            <div
              key={zone.id}
              className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-400/40 hover:bg-neutral-900/50 transition-all duration-300 group backdrop-blur-md shadow-xl"
            >
              <div>
                {/* Top Telemetry Tag */}
                <div className="flex items-center justify-between text-[11px] font-mono mb-4 pb-3 border-b border-white/10">
                  <span className="text-cyan-400 font-semibold tracking-wider">{zone.tag}</span>
                  <span className="text-neutral-500 tracking-tight">{zone.capacity}</span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-sans group-hover:text-cyan-200 transition-colors uppercase leading-snug">
                  {zone.title}
                </h3>

                {/* Card Description */}
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans mb-6">
                  {zone.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg border border-white/15 bg-white/5 hover:bg-white hover:text-black text-white text-xs font-mono font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <span>{zone.actionText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventZonesSection;
