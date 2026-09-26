'use client';

import React from 'react';
import { Cpu, Satellite, Code2, Compass, Layers, CheckCircle2 } from 'lucide-react';

export interface WorkshopTrack {
  id: string;
  code: string;
  title: string;
  badge: string;
  level: string;
  duration: string;
  desc: string;
  project: string;
  prereqs: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORKSHOP_TRACKS: WorkshopTrack[] = [
  {
    id: 'embedded-iot',
    code: 'DOM-01 // HARDWARE',
    title: 'Embedded Systems & IoT',
    badge: 'HANDS-ON HARDWARE',
    level: 'INTERMEDIATE',
    duration: '16 HOURS',
    desc: 'Microcontroller architecture, real-time operating systems (FreeRTOS), ESP32 firmware development, and sensor telemetry protocols over radio frequencies.',
    project: 'Build an autonomous LoRa environmental sensor node transmitting live telemetry to an edge gateway.',
    prereqs: 'Basic C/C++, digital logic fundamentals, introductory circuit reading.',
    icon: Cpu,
  },
  {
    id: 'space-ai',
    code: 'DOM-02 // ASTRONOMY',
    title: 'Space Tech & AI',
    badge: 'ORBITAL INTELLIGENCE',
    level: 'ADVANCED',
    duration: '16 HOURS',
    desc: 'Astrophysical image processing, orbital trajectory computations, satellite telemetry parsing, and deep neural vision models for planetary classification.',
    project: 'Deploy a deep learning pipeline for automated orbital debris tracking and celestial body classification.',
    prereqs: 'Python, NumPy, basic matrix math, curiosity about orbital dynamics.',
    icon: Satellite,
  },
  {
    id: 'fullstack-web',
    code: 'DOM-03 // SYSTEMS',
    title: 'Full-Stack Web Development',
    badge: 'MISSION DASHBOARDS',
    level: 'BEGINNER TO PRO',
    duration: '18 HOURS',
    desc: 'Modern reactive architecture, real-time bidirectional WebSockets, server-rendered components, and high-performance mission telemetry dashboards.',
    project: 'Develop a high-throughput space mission telemetry console with interactive data visualization.',
    prereqs: 'JavaScript/TypeScript basics, HTML/CSS familiarity, general browser knowledge.',
    icon: Code2,
  },
  {
    id: 'robotics-slam',
    code: 'DOM-04 // MECHATRONICS',
    title: 'Robotics & Autonomous Systems',
    badge: 'KINEMATICS & SLAM',
    level: 'INTERMEDIATE',
    duration: '16 HOURS',
    desc: 'Forward/inverse kinematics, sensor fusion with Kalman filters, motor driver integration, and LiDAR-based SLAM algorithms for ground exploration.',
    project: 'Program an autonomous planetary rover prototype with obstacle avoidance and obstacle mapping.',
    prereqs: 'Basic physics, Python/C++, fundamental understanding of sensors.',
    icon: Compass,
  },
];

export function WorkshopsSection() {
  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="workshops" className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-t border-white/10">
      <div className="mb-14">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white pulse-white-dot" />
          <span>SUBSYSTEM CATALOG // 2026</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-mono">
          Workshop Tracks & Technical Domains
        </h2>
        <p className="text-neutral-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Rigorous, project-first tracks crafted by senior student leads and industry researchers. 
          Gain production engineering skills, assemble deployable systems, and earn accredited JEC credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKSHOP_TRACKS.map((track) => {
          const Icon = track.icon;

          return (
            <div
              key={track.id}
              className="p-7 rounded-xl border border-white/10 bg-neutral-950/80 backdrop-blur-md flex flex-col justify-between hover:border-white/30 transition-all group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 mb-5 pb-3 border-b border-white/5">
                  <span className="text-white font-semibold">{track.code}</span>
                  <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                    {track.duration}
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-white/40 transition-colors flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition-colors">
                      {track.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mt-0.5">
                      {track.badge}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
                  {track.desc}
                </p>

                {/* Capstone Project Plate */}
                <div className="bg-black/60 border border-white/10 rounded-lg p-3.5 mb-4">
                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase block mb-1">
                    HANDS-ON CAPSTONE PROJECT:
                  </span>
                  <p className="text-xs text-neutral-200 font-medium leading-relaxed">
                    {track.project}
                  </p>
                </div>

                {/* Prerequisites */}
                <div className="text-[11px] text-neutral-400 flex items-start gap-2 mb-6">
                  <span className="font-mono text-neutral-500 uppercase tracking-wider flex-shrink-0">
                    PREREQUISITES:
                  </span>
                  <span>{track.prereqs}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <div className="text-neutral-400">
                  LEVEL: <span className="text-white font-semibold">{track.level}</span>
                </div>
                <button
                  onClick={scrollToRegister}
                  className="px-3 py-1 text-xs text-neutral-300 hover:text-white border border-white/15 hover:border-white/40 rounded transition-all cursor-pointer"
                >
                  ENROLL TRACK →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
