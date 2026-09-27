'use client';

import React from 'react';
import { ExternalLink, Compass } from 'lucide-react';

export interface OutreachPartner {
  id: string;
  shortName: string;
  fullName: string;
  location: string;
  tag: string;
  logo: string;
  website?: string;
  delayClass?: string;
}

export const OUTREACH_PARTNERS: OutreachPartner[] = [
  {
    id: 'p-iit-indore',
    shortName: 'IIT Indore',
    fullName: 'Indian Institute of Technology, Indore',
    location: 'Indore, Madhya Pradesh',
    tag: 'Institute of National Importance',
    logo: '/outreach-partners/iit-indore.jpeg',
    delayClass: 'animation-delay-0',
  },
  {
    id: 'p-manit-bhopal',
    shortName: 'MANIT Bhopal',
    fullName: 'Maulana Azad National Institute of Technology',
    location: 'Bhopal, Madhya Pradesh',
    tag: 'National Institute of Technology',
    logo: '/outreach-partners/manit-bhopal.jpeg',
    delayClass: 'animation-delay-300',
  },
  {
    id: 'p-iiit-bhopal',
    shortName: 'IIIT Bhopal',
    fullName: 'Indian Institute of Information Technology',
    location: 'Bhopal, Madhya Pradesh',
    tag: 'Apex IT & Systems Institute',
    logo: '/outreach-partners/iiit-bhopal.jpeg',
    delayClass: 'animation-delay-600',
  },
  {
    id: 'p-nit-raipur',
    shortName: 'NIT Raipur',
    fullName: 'National Institute of Technology, Raipur',
    location: 'Raipur, Chhattisgarh',
    tag: 'Central Technical Institute',
    logo: '/outreach-partners/nit-raipur.jpeg',
    delayClass: 'animation-delay-900',
  },
  {
    id: 'p-sgsits',
    shortName: 'SGSITS Indore',
    fullName: 'Shri Govindram Seksaria Institute of Tech & Science',
    location: 'Indore, Madhya Pradesh',
    tag: 'Premier Autonomous College',
    logo: '/outreach-partners/sgsits.jpeg',
    delayClass: 'animation-delay-200',
  },
  {
    id: 'p-iet-davv',
    shortName: 'IET DAVV',
    fullName: 'Institute of Engineering & Technology, DAVV',
    location: 'Indore, Madhya Pradesh',
    tag: 'University Engineering Institute',
    logo: '/outreach-partners/iet-davv.jpeg',
    delayClass: 'animation-delay-500',
  },
  {
    id: 'p-mits-gwalior',
    shortName: 'MITS Gwalior',
    fullName: 'Madhav Institute of Technology & Science',
    location: 'Gwalior, Madhya Pradesh',
    tag: 'Autonomous Technical Campus',
    logo: '/outreach-partners/mits-gwalior.jpeg',
    delayClass: 'animation-delay-800',
  },
  {
    id: 'p-rgpv-bhopal',
    shortName: 'RGPV Bhopal',
    fullName: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    location: 'Bhopal, Madhya Pradesh',
    tag: 'State Technological University',
    logo: '/outreach-partners/rgpv-bhopal.jpeg',
    delayClass: 'animation-delay-400',
  },
  {
    id: 'p-rec-rewa',
    shortName: 'REC Rewa',
    fullName: 'Rewa Engineering College',
    location: 'Rewa, Madhya Pradesh',
    tag: 'Pioneering State Engineering College',
    logo: '/outreach-partners/rewa-engineering-college.jpeg',
    delayClass: 'animation-delay-700',
  },
];

export function OutreachPartnersSection() {
  return (
    <section
      id="partners"
      className="py-24 sm:py-36 border-t border-white/10 bg-black relative overflow-hidden select-none"
    >
      {/* Invisible anchor target for backwards compatibility with #zones */}
      <span id="zones" className="absolute -top-20 opacity-0 pointer-events-none" />

      {/* Cosmic background radial aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-cyan-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[300px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centralized Section Header */}
        <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>COLLEGIATE NETWORK // CAMPUS SYNDICATE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Our Outreach Partners
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Uniting pioneering student innovators, technical societies, and engineering research labs across India's premier technical institutes.
          </p>
        </div>

        {/* ===================================================================
            1. CONTINUOUS FLOATING LOGO MARQUEE (Row 1 & Row 2 Infinite Flow)
            =================================================================== */}
        <div className="mb-16 relative w-full overflow-hidden py-4">
          {/* Edge fade gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-20 pointer-events-none bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-20 pointer-events-none bg-gradient-to-l from-black via-black/80 to-transparent" />

          {/* Endless horizontal marquee track */}
          <div className="flex w-max will-change-transform animate-[marqueeScroll_32s_linear_infinite] hover:[animation-play-state:paused]">
            {[...OUTREACH_PARTNERS, ...OUTREACH_PARTNERS].map((partner, idx) => (
              <div
                key={`marquee-${partner.id}-${idx}`}
                className="flex items-center gap-3.5 mx-3 sm:mx-4 px-5 py-3 rounded-xl border border-white/10 bg-neutral-950/80 hover:border-cyan-400/40 hover:bg-neutral-900/90 transition-all duration-300 group backdrop-blur-md cursor-default shadow-lg"
              >
                {/* Floating Logo Badge with Clean White Background for Contrast */}
                <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={partner.logo}
                    alt={partner.shortName}
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-bold font-mono text-white tracking-wider group-hover:text-cyan-300 transition-colors uppercase">
                    {partner.shortName}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 tracking-tight">
                    {partner.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            2. FLOATING 3D INTERACTIVE PARTNER GRID (9 Premier Campuses)
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {OUTREACH_PARTNERS.map((partner, index) => (
            <div
              key={partner.id}
              className="group relative rounded-2xl border border-white/10 bg-neutral-950/70 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-400/50 hover:bg-neutral-900/60 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-[0_12px_35px_rgba(6,182,212,0.15)] overflow-hidden"
              style={{
                animation: `floatPartner 6s ease-in-out ${(index * 0.45).toFixed(2)}s infinite alternate`,
              }}
            >
              {/* Subtle card ambient highlight */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />

              <div>
                {/* Header Tag with Telemetry Pill */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-5 pb-3 border-b border-white/10">
                  <span className="text-cyan-400 font-semibold tracking-wider uppercase">
                    {partner.tag}
                  </span>
                  <span className="text-neutral-500 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-cyan-400/80" />
                    <span>0{index + 1}</span>
                  </span>
                </div>

                {/* Floating Logo Badge & Name Row */}
                <div className="flex items-center gap-4 mb-4">
                  {/* High-Contrast Floating Logo Frame */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 border border-white/40 shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300">
                    <img
                      src={partner.logo}
                      alt={partner.shortName}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Title & Short Details */}
                  <div className="flex flex-col">
                    <h3 className="text-lg sm:text-xl font-black font-sans text-white group-hover:text-cyan-200 transition-colors uppercase tracking-tight">
                      {partner.shortName}
                    </h3>
                    <span className="text-xs font-mono text-cyan-300/80 tracking-wide mt-0.5">
                      {partner.location}
                    </span>
                  </div>
                </div>

                {/* Full Institution Description */}
                <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed font-sans mb-6">
                  {partner.fullName}
                </p>
              </div>

              {/* Card Footer Status */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>DELEGATE DEPLOYMENT ACTIVE</span>
                </span>
                <span className="text-cyan-400 text-xs font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>NETWORK</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Keyframes Definition in Scoped Style */}
      <style jsx global>{`
        @keyframes floatPartner {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}

export default OutreachPartnersSection;
