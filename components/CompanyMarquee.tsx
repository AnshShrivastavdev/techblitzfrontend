'use client';

import React from 'react';

export interface CompanyLogo {
  name: string;
  src: string;
  domain?: string;
}

export const COMPANY_LOGOS: CompanyLogo[] = [
  {
    name: 'ISRO',
    src: '/companies/c1.png',
    domain: 'Space Research & Payloads',
  },
  {
    name: 'Google',
    src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    domain: 'Cloud Systems & AI',
  },
  {
    name: 'Microsoft',
    src: '/companies/c5.png',
    domain: 'Enterprise Architecture',
  },
  {
    name: 'NVIDIA',
    src: '/companies/c4.png',
    domain: 'Accelerated Computing',
  },
  {
    name: 'Amazon',
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    domain: 'Distributed Infrastructure',
  },
  {
    name: 'Intel',
    src: '/companies/c9.png',
    domain: 'Silicon & Microelectronics',
  },
  {
    name: 'TCS',
    src: '/companies/tcs.png',
    domain: 'Systems Engineering',
  },
  {
    name: 'Airtel',
    src: '/companies/c3.png',
    domain: 'Network & Telemetry',
  },
  {
    name: 'Fiserv',
    src: '/companies/c8.png',
    domain: 'FinTech Platforms',
  },
  {
    name: 'IIT Roorkee',
    src: '/companies/c7.png',
    domain: 'Academic Research',
  },
  {
    name: 'Reliance',
    src: '/companies/RELIANCE.png',
    domain: 'Digital Ecosystems',
  },
];

export function CompanyMarquee() {
  return (
    <section className="py-24 sm:py-32 bg-black border-y border-white/10 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-14 sm:mb-18 text-center">
        {/* Aerospace Telemetry Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-white/5 text-neutral-300 text-xs font-mono tracking-widest mb-3.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>ALUMNI NETWORK // WORKSHOP DIRECTORS</span>
        </div>

        {/* Section Headline */}
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight text-white mb-4">
          Workshops Led by Industry Alumni
        </h3>

        {/* Subtitle explaining the alumni connection */}
        <p className="text-xs sm:text-base text-neutral-400 font-mono max-w-2xl mx-auto leading-relaxed">
          Hands-on technical tracks and guided engineering sprints conducted by JEC & Cosmos alumni currently building at world-class technology enterprises and research organizations.
        </p>
      </div>

      {/* Infinite Horizontal Floating Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left Gradient Mask for smooth fade */}
        <div className="absolute left-0 top-0 h-full w-24 sm:w-44 z-20 pointer-events-none bg-gradient-to-r from-black via-black/80 to-transparent" />

        {/* Marquee Track with CSS animation */}
        <div className="flex w-max will-change-transform animate-[marqueeScroll_30s_linear_infinite] hover:[animation-play-state:paused]">
          {/* Double array for infinite seamless looping */}
          {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex items-center gap-4 mx-4 sm:mx-6 px-6 py-4 rounded-xl border border-white/10 bg-neutral-950/80 hover:border-white/30 hover:bg-neutral-900/90 transition-all duration-300 group backdrop-blur-md cursor-default"
            >
              {/* Logo Frame with contrast protection for dark logos */}
              <div className="h-10 sm:h-12 w-28 sm:w-32 flex items-center justify-center p-1.5 rounded bg-white/95 group-hover:bg-white transition-colors shadow-sm">
                <img
                  src={company.src}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                  draggable={false}
                  loading="lazy"
                />
              </div>

              {/* Company & Domain Label */}
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold font-mono text-white tracking-wider group-hover:text-neutral-200 transition-colors">
                  {company.name}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 tracking-tight whitespace-nowrap">
                  {company.domain}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Gradient Mask for smooth fade */}
        <div className="absolute right-0 top-0 h-full w-24 sm:w-44 z-20 pointer-events-none bg-gradient-to-l from-black via-black/80 to-transparent" />
      </div>

      {/* Embedded CSS for infinite smooth marquee */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

export default CompanyMarquee;
