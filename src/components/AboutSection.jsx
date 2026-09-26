import React from 'react';
import { Sparkles } from 'lucide-react';

const SCHEDULE_ITEMS = [
  {
    day: 'DAY 01',
    date: 'MARCH 27, 2026',
    title: 'Mission Genesis & Technical Keynotes',
    time: '09:00 - 18:00 IST',
    desc: 'Grand opening ceremony, symposium keynote address, live embedded hardware orientation, and kick-off for technical tracks 01 through 04.',
  },
  {
    day: 'DAY 02',
    date: 'MARCH 28, 2026',
    title: '24-Hour Hackathon & Deep Lab Sprints',
    time: '10:00 IST CONTINUOUS',
    desc: 'Overnight systems build, satellite telemetry simulation, SLAM rover obstacle calibration, and round-the-clock mentorship.',
  },
  {
    day: 'DAY 03',
    date: 'MARCH 29, 2026',
    title: 'Project Expo, Jury Review & Credentials',
    time: '10:00 - 19:30 IST',
    desc: 'Hackathon code freeze, live hardware demonstrations, jury evaluations, awards distribution, and verified JEC certificate issuance.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-36 border-t border-white/10 bg-neutral-950/60 relative overflow-hidden">
      {/* Subtle ambient cosmic background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* ===================================================================
            1. CENTRALIZED PRIMARY HEADER & TITLES
            =================================================================== */}
        <div className="mb-16 sm:mb-24 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/30 text-cyan-300 text-xs font-mono tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>GUILD ORIGINS // EST. JEC 1947</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            About TechBlitz & Cosmos JEC
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            The premier Science, Astronomy & Advanced Technology Guild of Jabalpur Engineering College (JEC), uniting builders, researchers, and systems innovators.
          </p>
        </div>

        {/* ===================================================================
            2. CENTRALIZED MISSION NARRATIVE CARD
            =================================================================== */}
        <div className="max-w-4xl mx-auto text-center rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-8 sm:p-12 lg:p-14 mb-20 sm:mb-28 shadow-2xl hover:border-cyan-400/30 transition-all duration-300 relative">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-6 pb-3 border-b border-white/10 mx-auto">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>MISSION MANIFESTO & VISION</span>
          </div>

          <div className="space-y-5 text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-sans">
            <p>
              <strong className="text-white font-semibold">COSMOS</strong> is the premier Science, Astronomy & Advanced 
              Technology Guild of <strong className="text-white font-semibold">Jabalpur Engineering College (JEC)</strong>, 
              operating under the Department of Computer Science & Engineering.
            </p>
            <p>
              Rooted in the spirit of space exploration and technical curiosity, Cosmos bridges academic 
              curriculums with bleeding-edge applied engineering: from micro-satellite telemetry and 
              autonomous systems to neural AI architectures and distributed clusters.
            </p>
            <p>
              <strong className="text-white font-semibold">TechBlitz 2026</strong> is our flagship annual symposium 
              engineered to elevate student builders into industry-capable systems creators through rigorous 
              hands-on labs, collaborative project sprints, and verified hardware workshops.
            </p>
          </div>

        </div>

        {/* ===================================================================
            3. CENTRALIZED EVENT SCHEDULE TIMELINE
            =================================================================== */}
        <div className="max-w-6xl mx-auto">
          {/* Sub-header */}
          <div className="text-center mb-10 sm:mb-14">
            <h3 className="text-2xl sm:text-3xl font-black font-sans text-white uppercase tracking-tight">
              Event Timeline & Milestones
            </h3>
            <span className="text-[11px] font-mono text-neutral-500 block mt-1">
              TIMEZONE: IST (UTC+5:30) · JEC CENTRAL CAMPUS
            </span>
          </div>

          {/* 3-Column Symmetrical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {SCHEDULE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md hover:border-cyan-400/40 hover:bg-neutral-950/90 transition-all duration-300 group shadow-xl flex flex-col items-center text-center justify-between"
              >
                <div className="w-full flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold tracking-wider mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{item.day}</span>
                  </div>

                  <span className="text-xs font-mono text-neutral-400 mb-3 tracking-widest uppercase">
                    {item.date}
                  </span>

                  <h4 className="text-base sm:text-lg font-bold text-white mb-3 font-sans group-hover:text-cyan-200 transition-colors uppercase leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-white/10 flex items-center justify-center">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-400/20">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
