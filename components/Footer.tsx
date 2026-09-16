'use client';

import React from 'react';

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const DiscordIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10 sm:mb-12">
          {/* Brand Info with explicit title */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded border border-cyan-500/40 bg-[#020b18] overflow-hidden flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <img
                  src="/cosmos-tight.png"
                  alt="COSMOS"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-mono tracking-wider text-white">
                Cosmos JEC - Jabalpur Engineering College
              </h3>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Science, Astronomy & Advanced Technology Guild of Jabalpur Engineering College (JEC).
              Empowering engineers and builders through hands-on systems innovation.
            </p>
          </div>

          {/* Clean Social Links with Minimalist Icons: GitHub, Instagram, LinkedIn, Discord */}
          <div className="flex items-center gap-3 text-neutral-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/10 rounded-lg hover:border-white hover:text-white hover:bg-white/5 transition-all"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/10 rounded-lg hover:border-white hover:text-white hover:bg-white/5 transition-all"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/10 rounded-lg hover:border-white hover:text-white hover:bg-white/5 transition-all"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/10 rounded-lg hover:border-white hover:text-white hover:bg-white/5 transition-all"
              aria-label="Discord"
            >
              <DiscordIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Coordinates & Pure Black Theme Branding */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-neutral-500">
          <div>
            <span>Cosmos JEC - Jabalpur Engineering College • Dept of CSE</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span>LAT 23.2104° N // LON 79.9575° E</span>
            <span>•</span>
            <span>TECHBLITZ © 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
