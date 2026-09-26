'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import ParticleText from './ParticleText';

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
        <div className="max-w-5xl mx-auto">
          {/* Sub-header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-black font-sans text-white uppercase tracking-tight">
              Event Timeline & Milestones
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 block mt-1 tracking-widest uppercase">
              TIMEZONE: IST (UTC+5:30) · JEC CENTRAL CAMPUS
            </span>
          </div>

          {/* Interactive ParticleText Container */}
          <div
            style={{ width: '100%', height: 360, background: '#09090f' }}
            className="rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center"
          >
            <ParticleText
              text="COMING SOON"
              particleSize={2.2}
              density={4}
              color="#f8fafc"
              highlightColor="#8b5cf6"
              scatter={190}
              gatherDuration={1600}
              stagger={420}
              pointerRepel={42}
              repelRadius={120}
              idleDrift={0.8}
              trigger="mount"
              fontSize="clamp(3.5rem, 13vw, 9rem)"
              fontWeight={800}
              fontFamily="inherit"
              glow
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span>SYMPOSIUM MILESTONES & SESSION SCHEDULE WILL BE ANNOUNCED SHORTLY</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
