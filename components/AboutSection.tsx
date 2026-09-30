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

        {/* Event Schedule Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-cyan-500/20 bg-neutral-900/60 backdrop-blur-xl hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">DAY 01 · OCT 12</span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">COMPLETED / RECAP</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Keynote & Guild Orientation</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4 font-sans">
              Opening ceremonies, Cosmos Guild roadmap unveiling, hardware showcase, and keynote address by CSE Department Faculty.
            </p>
            <div className="text-[11px] font-mono text-neutral-500 flex justify-between items-center border-t border-white/10 pt-3">
              <span>09:30 AM - 01:00 PM</span>
              <span className="text-cyan-400 font-semibold">Auditorium Hall</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-cyan-400/40 bg-cyan-950/20 backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.1)] hover:border-cyan-400/60 transition-all relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 bg-cyan-500 text-black text-[10px] font-mono font-bold tracking-widest rounded-full uppercase shadow">
              CURRENT PHASE
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/40">DAY 02 · ACTIVE</span>
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                LIVE WORKSHOPS
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Hands-on Technical Workshops</h4>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-sans">
              Deep-dive labs on Next.js 15, AI Agent Engineering, Cloud Microservices, and Embedded IoT Telemetry.
            </p>
            <div className="text-[11px] font-mono text-cyan-300 flex justify-between items-center border-t border-white/10 pt-3">
              <span>10:00 AM - 04:30 PM</span>
              <span className="text-cyan-400 font-semibold">CSE Computer Labs</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-white/10">DAY 03 · UPCOMING</span>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">REGISTERING</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Buildathon & Project Pitch</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4 font-sans">
              24-hour sprint presentations, peer code reviews, award distribution, and Cosmos Guild certificate verification.
            </p>
            <div className="text-[11px] font-mono text-neutral-500 flex justify-between items-center border-t border-white/10 pt-3">
              <span>09:00 AM - 05:00 PM</span>
              <span className="text-cyan-400 font-semibold">Main Campus Arena</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
