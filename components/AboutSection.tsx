'use client';

import React from 'react';
import { MapPin, Calendar, Clock, Award, Users, Terminal } from 'lucide-react';

const SCHEDULE_ITEMS = [
  {
    day: 'DAY 01',
    date: 'MARCH 27, 2026',
    title: 'MISSION GENESIS & TECHNICAL KEYNOTES',
    time: '09:00 - 18:00 IST',
    desc: 'Grand opening ceremony, symposium keynote address, live embedded hardware orientation, and kick-off for tracks 01 through 04.',
  },
  {
    day: 'DAY 02',
    date: 'MARCH 28, 2026',
    title: '24-HOUR HACKATHON & DEEP LAB SPRINTS',
    time: '10:00 IST CONTINUOUS',
    desc: 'Overnight systems build, satellite telemetry simulation, SLAM rover obstacle calibration, and round-the-clock mentorship.',
  },
  {
    day: 'DAY 03',
    date: 'MARCH 29, 2026',
    title: 'PROJECT EXPO, JURY REVIEW & CREDENTIALS',
    time: '10:00 - 19:30 IST',
    desc: 'Hackathon code freeze, live hardware demonstrations, jury evaluations, awards distribution, and verified JEC certificate issuance.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 border-t border-white/10 bg-neutral-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column: Guild Vision & Mission */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white pulse-white-dot" />
              <span>GUILD ORIGINS // EST. JEC</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4 sm:mb-6 font-mono">
              About TechBlitz & Cosmos JEC
            </h2>
            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              <p>
                <strong className="text-white">COSMOS</strong> is the premier Science, Astronomy & Advanced 
                Technology Guild of <strong className="text-white">Jabalpur Engineering College (JEC)</strong>, 
                operating under the Department of Computer Science & Engineering.
              </p>
              <p>
                Rooted in the spirit of space exploration and technical curiosity, Cosmos bridges academic 
                curriculums with bleeding-edge applied engineering: from micro-satellite telemetry and 
                autonomous systems to neural AI architectures and distributed clusters.
              </p>
              <p>
                <strong className="text-white">TechBlitz 2026</strong> is the annual flagship symposium 
                designed to elevate college builders into industry-capable systems creators through rigorous 
                hands-on labs, collaborative project sprints, and verified hardware workshops.
              </p>
            </div>

            {/* Quick Metadata Badges */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 sm:gap-6 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>Jabalpur Engineering College, MP, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white shrink-0" />
                <span>March 27 – 29, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-white shrink-0" />
                <span>Official JEC Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Event Schedule Sequence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                EVENT SCHEDULE TIMELINE
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500">
                TIMEZONE: IST (UTC+5:30)
              </span>
            </div>

            {SCHEDULE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-lg border border-white/10 bg-black/70 backdrop-blur hover:border-white/25 transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between text-xs font-mono tracking-wider mb-2 gap-1">
                  <span className="text-white font-bold group-hover:text-neutral-200">
                    {item.day} • {item.date}
                  </span>
                  <span className="text-neutral-500 text-[11px]">{item.time}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-2 font-mono">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
