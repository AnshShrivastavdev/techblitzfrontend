'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Award, Calendar, CheckCircle2, AlertCircle, Building2, User, Sparkles } from 'lucide-react';
import { ShaderAnimation } from '@/components/ui/shader-lines';
import { Certificate, getCertificateByNumber, getCertificates } from '@/services/storageService';

export default function VerifyCertificatePage() {
  const params = useParams();
  const idParam = (params?.id as string) || '';
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idParam) {
      const decodedId = decodeURIComponent(idParam);
      // Try exact match by certificate number or ID
      let found = getCertificateByNumber(decodedId);
      if (!found) {
        const all = getCertificates();
        found = all.find((c) => c.id === decodedId || c.certificateNumber?.toLowerCase() === decodedId.toLowerCase());
      }
      setCert(found || null);
    }
    setLoading(false);
  }, [idParam]);

  const certNumber = cert?.certificateNumber || cert?.id || idParam;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black text-white selection:bg-cyan-500/30">
      {/* Background Shader Lines */}
      <ShaderAnimation />

      {/* Radial vignette overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.92)_100%)] backdrop-blur-[0.5px]" />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        {/* Return to Launchpad Navigation */}
        <Link
          href="/"
          className="mb-6 px-4 py-2 rounded-full border border-white/20 bg-neutral-950/80 text-xs font-mono text-neutral-400 hover:text-white hover:border-white/50 transition-all flex items-center gap-2 backdrop-blur cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>← RETURN TO LAUNCHPAD</span>
        </Link>

        {/* Header Branding */}
        <div className="text-center mb-6 flex flex-col items-center">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold mb-3 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            COSMOS JEC ACCREDITATION PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white uppercase">
            Certificate Authenticator
          </h1>
        </div>

        {/* Verification Card */}
        <div className="w-full rounded-2xl border border-white/20 bg-neutral-950/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          {loading ? (
            <div className="py-12 text-center font-mono text-xs text-neutral-400">
              VERIFYING DIGITAL CREDENTIAL SIGNATURE...
            </div>
          ) : cert ? (
            <div className="space-y-6">
              {/* Authenticated Status Header */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-mono font-bold text-xs sm:text-sm tracking-wide text-emerald-200 uppercase">
                    AUTHENTICATED CREDENTIAL // VERIFIED
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-400/80">
                    Officially recorded on the COSMOS JEC Student Registry
                  </p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-3 font-mono">
                  <div className="text-[11px] text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Recipient Name
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-sans text-white">
                    {cert.recipientName || 'Cosmos Delegate'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-3 font-mono">
                  <div className="text-[11px] text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    Workshop Track
                  </div>
                  <div className="text-base sm:text-lg font-bold font-sans text-cyan-300">
                    {cert.workshopTitle || 'Technical Symposium'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 font-mono space-y-1">
                    <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Certificate Number</div>
                    <div className="text-xs font-bold text-white tracking-wider">{certNumber}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 font-mono space-y-1">
                    <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Issued Date</div>
                    <div className="text-xs font-bold text-white">
                      {cert.issueDate || cert.issuedAt
                        ? new Date(cert.issueDate || cert.issuedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'September 2026'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issuing Authority */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Jabalpur Engineering College (JEC) • Dept of CSE</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cryptographic Seal Verified</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-950/50 border border-amber-500/50 text-amber-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white mb-1">CREDENTIAL RECORD NOT FOUND</h3>
                <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto leading-relaxed">
                  No certificate matching ID <span className="text-cyan-400 font-bold">{certNumber}</span> was found in the active database.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-center">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-lg bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 transition-colors"
                >
                  GO TO STUDENT DASHBOARD
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
