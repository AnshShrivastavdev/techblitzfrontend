'use client';

import React, { useState } from 'react';
import { User, BellRing, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpeakerSlot {
  id: string;
  role: string;
  domain: string;
  affiliation: string;
}

const SPEAKER_SLOTS: SpeakerSlot[] = [
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

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyEmail('');
      setNotifySuccess(false);
    }, 4000);
  };

  return (
    <section id="speakers" className="py-24 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-neutral-300 text-xs font-mono tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>ROSTER STATUS // CLEARANCE PENDING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-mono">
            Speakers & Mentors
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Distinguished faculty, aerospace researchers, and industry engineering leads.
            Official manifest is undergoing final clearance.
          </p>
        </div>

        {/* Minimalist Placeholder Frames with glowing "To Be Announced" badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SPEAKER_SLOTS.map((speaker, idx) => (
            <div
              key={idx}
              className="relative rounded-xl border border-white/10 bg-neutral-950/80 p-6 flex flex-col items-center text-center overflow-hidden group hover:border-white/30 transition-all duration-300 backdrop-blur-md"
            >
              {/* Corner crosshairs */}
              <span className="absolute top-2.5 left-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>
              <span className="absolute top-2.5 right-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>
              <span className="absolute bottom-2.5 left-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>
              <span className="absolute bottom-2.5 right-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>

              {/* Minimalist Silhouette Avatar Frame */}
              <div className="relative w-28 h-28 rounded-full border border-dashed border-white/20 bg-neutral-900/60 flex items-center justify-center mb-6 text-neutral-500 group-hover:border-white/40 transition-colors">
                <User className="w-10 h-10 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                
                {/* Glowing "To Be Announced" Badge */}
                <div className="absolute -bottom-2.5 px-3 py-1 bg-black border border-white/30 rounded-full text-[9px] font-mono font-bold tracking-wider text-white shadow-[0_0_15px_rgba(255,255,255,0.45)] flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>TO BE ANNOUNCED</span>
                </div>
              </div>

              {/* Speaker Metadata */}
              <div className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase mb-1.5">
                {speaker.id}
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-mono group-hover:text-neutral-100 transition-colors">
                {speaker.role}
              </h4>
              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                {speaker.domain}
              </p>
              <div className="text-[10px] font-mono text-neutral-500 mt-auto pt-3 border-t border-white/5 w-full uppercase tracking-wider">
                {speaker.affiliation}
              </div>
            </div>
          ))}
        </div>

        {/* Minimalist Notification Bar */}
        <div className="max-w-md mx-auto p-6 rounded-xl border border-white/10 bg-neutral-950 text-center">
          <h4 className="text-xs font-bold font-mono tracking-wider text-white mb-2 flex items-center justify-center gap-2">
            <BellRing className="w-4 h-4 text-white" />
            SPEAKER ROSTER TELEMETRY
          </h4>
          <p className="text-xs text-neutral-400 mb-4">
            Receive the official keynote schedule and speaker lineup when unlocked.
          </p>

          <form onSubmit={handleNotifySubmit} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="developer@jecjabalpur.ac.in"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-md text-white focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono font-semibold bg-white text-black hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              NOTIFY ME
            </button>
          </form>

          {notifySuccess && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs font-mono text-white flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>SUBSCRIPTION LOGGED // NOTIFICATION ARMED</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SpeakersSection;
