'use client';

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, MapPin, Calendar, Sparkles } from 'lucide-react';

export function RegisterSection() {
  const [registeredTier, setRegisteredTier] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [collegeInput, setCollegeInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClaim = (tier: string) => {
    setRegisteredTier(tier);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput) return;
    setSubmitted(true);
    setTimeout(() => {
      setRegisteredTier(null);
      setNameInput('');
      setEmailInput('');
      setCollegeInput('');
      setSubmitted(false);
    }, 3500);
  };

  return (
    <section id="register" className="py-24 border-t border-white/10 max-w-7xl mx-auto px-6 sm:px-8">
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white pulse-white-dot" />
          <span>ACCESS PROTOCOL // TICKETS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-mono">
          Initialize Your Registration
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base">
          Secure your participant pass for TechBlitz 2026 at Jabalpur Engineering College. 
          Workstation capacities are limited to ensure individualized hardware workbench access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Tier 01: Standard Trainee Pass */}
        <div className="rounded-xl border border-white/10 bg-neutral-950/80 p-8 flex flex-col justify-between hover:border-white/25 transition-all backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
              <span>TIER 01</span>
              <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                ONLINE KEYNOTES
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 font-mono">Standard Trainee Pass</h3>
            <div className="text-3xl font-mono font-bold text-white mb-6">
              FREE <span className="text-xs text-neutral-400 font-sans font-normal">/ for all engineering students</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Access to all live-streamed keynote lectures</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Official Cosmos Community Discord channels</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Digital certificate of participation</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Access to shared repository architectures</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleClaim('Tier 01: Standard Trainee Pass')}
            className="w-full py-3.5 text-xs font-mono font-semibold border border-white/20 hover:border-white hover:bg-white hover:text-black rounded-lg transition-all cursor-pointer text-white"
          >
            CLAIM TRAINEE PASS
          </button>
        </div>

        {/* Tier 02: All-Access Flight Pass (Featured) */}
        <div className="rounded-xl border-2 border-white bg-neutral-950 p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(255,255,255,0.12)] relative">
          <div className="absolute -top-3 right-6 px-3 py-1 bg-white text-black font-mono font-bold text-[10px] tracking-wider rounded-full uppercase">
            RECOMMENDED // ALL-INCLUSIVE
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono text-white mb-2">
              <span>TIER 02</span>
              <span className="px-2.5 py-0.5 rounded bg-white text-black font-bold text-[10px]">
                CAMPUS ON-SITE
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 font-mono">All-Access Flight Pass</h3>
            <div className="text-3xl font-mono font-bold text-white mb-6">
              INR 199 <span className="text-xs text-neutral-400 font-sans font-normal">/ student (subsidized kit)</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Full on-site access at Jabalpur Engineering College</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Physical hardware kit usage (ESP32, sensors, motors, PCBs)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>24-Hour Grand Hackathon entry, food & prizes</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Official JEC physical accredited certificate with QR verification seal</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                <span>Cosmos JEC exclusive participant flight kit & merchandise</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleClaim('Tier 02: All-Access Flight Pass')}
            className="w-full py-3.5 text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <span>SECURE ALL-ACCESS FLIGHT PASS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Registration Modal Form */}
      {registeredTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-white/20 p-6 sm:p-8 rounded-xl shadow-2xl relative">
            <button
              onClick={() => setRegisteredTier(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white font-mono text-xs"
            >
              ✕ CLOSE
            </button>

            <div className="text-[11px] font-mono text-neutral-400 mb-1">REGISTRATION PROTOCOL</div>
            <h3 className="text-xl font-bold text-white mb-2 font-mono">{registeredTier}</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Enter your student details to generate your verified flight pass manifest.
            </p>

            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-white/5 border border-white/20 rounded-lg">
                <CheckCircle2 className="w-10 h-10 text-white mx-auto" />
                <h4 className="font-mono font-bold text-white text-sm">REGISTRATION CONFIRMED</h4>
                <p className="text-xs text-neutral-400">
                  Your entry manifest has been dispatched to {emailInput}. Present your confirmation at the JEC central registration desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Patel"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">COLLEGE / UNIVERSITY EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="arjun@university.edu"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">INSTITUTE / COLLEGE NAME</label>
                  <input
                    type="text"
                    placeholder="Jabalpur Engineering College"
                    value={collegeInput}
                    onChange={(e) => setCollegeInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded text-white focus:outline-none focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  CONFIRM & GENERATE PASS
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
