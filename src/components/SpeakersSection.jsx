import React, { useState } from 'react';
import { User, BellRing, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SPEAKER_SLOTS = [
  {
    id: 'KEYNOTE 01',
    role: 'Principal Systems Architect',
    domain: 'Neural Architecture Search & Edge Tensor Ops',
    affiliation: 'Autonomous Systems Research',
  },
  {
    id: 'KEYNOTE 02',
    role: 'Satellite Telemetry Specialist',
    domain: 'Orbital Mechanics & Deep Space Telemetry',
    affiliation: 'Aerospace Engineering Systems',
  },
  {
    id: 'SPEAKER 03',
    role: 'Embedded Silicon & Mechatronics Lead',
    domain: 'Real-Time RTOS, CAN Bus & Micro-Robotics',
    affiliation: 'Applied Robotics Labs',
  },
  {
    id: 'SPEAKER 04',
    role: 'Distributed Cloud Infrastructure Lead',
    domain: 'Low-Latency Mesh & Edge Compute Clusters',
    affiliation: 'Open Infrastructure Guild',
  },
];

export function SpeakersSection() {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyEmail('');
      setNotifySuccess(false);
    }, 4000);
  };

  return (
    <section id="speakers" className="py-24 sm:py-32 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Centralized Section Header */}
        <div className="mb-16 sm:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ROSTER STATUS // CLEARANCE PENDING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Speakers & Mentors
          </h2>
          <p className="text-neutral-400 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Distinguished faculty, aerospace researchers, and industry engineering leads.
            The official keynote manifest is undergoing final orbital clearance.
          </p>
        </div>

        {/* Minimalist Placeholder Frames with glowing "To Be Announced" badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {SPEAKER_SLOTS.map((speaker, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden group hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-md shadow-xl"
            >
              {/* Corner crosshairs */}
              <span className="absolute top-3 left-3 text-[10px] text-neutral-600 font-mono select-none">+</span>
              <span className="absolute top-3 right-3 text-[10px] text-neutral-600 font-mono select-none">+</span>
              <span className="absolute bottom-3 left-3 text-[10px] text-neutral-600 font-mono select-none">+</span>
              <span className="absolute bottom-3 right-3 text-[10px] text-neutral-600 font-mono select-none">+</span>

              {/* Minimalist Silhouette Avatar Frame */}
              <div className="relative w-28 h-28 rounded-full border border-dashed border-white/25 bg-neutral-900/80 flex items-center justify-center mb-6 text-neutral-500 group-hover:border-cyan-400/50 transition-colors shadow-inner">
                <User className="w-10 h-10 text-neutral-500 group-hover:text-cyan-300 transition-colors" />
                
                {/* Glowing "To Be Announced" Badge */}
                <div className="absolute -bottom-2.5 px-3 py-1 bg-black border border-cyan-400/40 rounded-full text-[9px] font-mono font-bold tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>TO BE ANNOUNCED</span>
                </div>
              </div>

              {/* Speaker Metadata */}
              <div className="text-[11px] font-mono text-cyan-400/80 tracking-widest uppercase mb-2">
                {speaker.id}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-2 font-mono group-hover:text-cyan-200 transition-colors">
                {speaker.role}
              </h4>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                {speaker.domain}
              </p>
              <div className="text-[10px] font-mono text-neutral-500 mt-auto pt-4 border-t border-white/5 w-full uppercase tracking-wider">
                {speaker.affiliation}
              </div>
            </div>
          ))}
        </div>

        {/* Centralized Notification Bar */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border border-white/15 bg-neutral-950/90 text-center shadow-2xl backdrop-blur-md">
          <h4 className="text-xs sm:text-sm font-bold font-mono tracking-wider text-white mb-2 flex items-center justify-center gap-2">
            <BellRing className="w-4 h-4 text-cyan-400" />
            SPEAKER ROSTER TELEMETRY
          </h4>
          <p className="text-xs text-neutral-400 mb-5 max-w-md mx-auto leading-relaxed">
            Receive the official keynote schedule and speaker lineup the instant security clearance unlocks.
          </p>

          <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="developer@jecjabalpur.ac.in"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs font-mono bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors min-h-[42px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono font-bold bg-white text-black hover:bg-cyan-400 rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[42px] shadow-md"
            >
              NOTIFY ME
            </button>
          </form>

          {notifySuccess && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>SUBSCRIPTION LOGGED // NOTIFICATION ARMED</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SpeakersSection;
