'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Compass, Home } from 'lucide-react';
import { ShaderAnimation } from '@/components/ui/shader-lines';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black text-white selection:bg-cyan-500/30">
      {/* Dynamic Background Shader */}
      <ShaderAnimation />

      {/* Radial Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.95)_100%)] backdrop-blur-[0.5px]" />

      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center">
        {/* Cosmos Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/30 text-cyan-300 text-[11px] font-mono tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>ERROR 404 // VECTOR DISCONNECTED</span>
        </div>

        {/* Big Glitchy 404 */}
        <h1 className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-white mb-2 drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white mb-4 uppercase">
          Orbit Not Found
        </h2>

        <p className="text-neutral-400 text-xs sm:text-sm font-sans max-w-md mx-auto mb-8 leading-relaxed">
          The trajectory or requested vector you followed does not exist or has decayed from orbital space. Realign your navigation telemetry to return safely.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xs font-mono text-xs">
          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-5 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <Home className="w-4 h-4" />
            <span>LAUNCHPAD</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:flex-1 py-3 px-5 bg-neutral-900 border border-white/20 text-white font-medium rounded-lg hover:bg-neutral-800 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>DASHBOARD</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
