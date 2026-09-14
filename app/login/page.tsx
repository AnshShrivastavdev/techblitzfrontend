'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Mic2,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { ShaderAnimation } from '@/components/ui/shader-lines';
import { useAuth } from '@/context/AuthContext';

function AuthContent() {
  const { login, register, speakerLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'create' : 'signin';

  // Role: 'student' | 'speaker'
  const [role, setRole] = useState<'student' | 'speaker'>('student');

  // Student mode: 'signin' | 'create'
  const [studentMode, setStudentMode] = useState<'signin' | 'create'>(initialMode);

  // Speaker mode: 'password' | 'otp'
  const [speakerMode, setSpeakerMode] = useState<'password' | 'otp'>('password');

  // Common UI State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Student Sign-In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Student Create Account
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createCollege, setCreateCollege] = useState('');
  const [createBranch, setCreateBranch] = useState('');
  const [createSemester, setCreateSemester] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  // Speaker
  const [speakerEmail, setSpeakerEmail] = useState('');
  const [speakerPassword, setSpeakerPassword] = useState('');
  const [speakerOtp, setSpeakerOtp] = useState('');

  const handleStudentSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signInEmail || !signInPassword) {
      setError('Please enter both email and password.');
      return;
    }
    const result = login(signInEmail, signInPassword);
    if (result.success && result.user) {
      if (result.user.role === 'admin') {
        setSuccess('ADMINISTRATOR CLEARANCE ACCEPTED // ROUTING TO MISSION CONTROL...');
        setTimeout(() => {
          router.push('/admin');
        }, 800);
      } else {
        setSuccess('ACCESS GRANTED // AUTHORIZING DELEGATE SESSION...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      }
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  const handleStudentCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!createName || !createEmail || !createPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    const result = register({
      name: createName,
      email: createEmail,
      password: createPassword,
      college: createCollege,
      branch: createBranch,
      semester: createSemester,
    });
    if (result.success) {
      setSuccess('PROFILE REGISTERED // INITIALIZING DELEGATE PROTOCOLS...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const handleSpeakerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (speakerMode === 'otp') {
      if (speakerOtp === '123456') {
        const result = login(speakerEmail || 'sarah.chen@techblitz.com', 'speaker123');
        if (result.success) {
          setSuccess('SPEAKER OTP VERIFIED // CLEARANCE ACCEPTED...');
          setTimeout(() => {
            router.push('/speaker/dashboard');
          }, 800);
        } else {
          setError('Speaker record not found.');
        }
      } else {
        setError('Invalid OTP code. Use 123456 for demo.');
      }
      return;
    }

    if (!speakerEmail || !speakerPassword) {
      setError('Please enter both speaker email and passcode.');
      return;
    }

    const result = speakerLogin(speakerEmail, speakerPassword);
    if (result.success) {
      setSuccess('SPEAKER ACCESS CONFIRMED // LOADING KEYNOTE TELEMETRY...');
      setTimeout(() => {
        router.push('/speaker/dashboard');
      }, 800);
    } else {
      setError(result.error || 'Invalid speaker credentials.');
    }
  };

  const handleSendOtp = () => {
    if (!speakerEmail) {
      setError('Enter your registered speaker email first.');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtpCountdown(30);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fillDemo = (type: 'student' | 'speaker' | 'admin') => {
    setError('');
    if (type === 'student') {
      setRole('student');
      setStudentMode('signin');
      setSignInEmail('arjun@university.edu');
      setSignInPassword('student123');
    } else if (type === 'speaker') {
      setRole('speaker');
      setSpeakerMode('password');
      setSpeakerEmail('sarah.chen@techblitz.com');
      setSpeakerPassword('speaker123');
    } else if (type === 'admin') {
      setRole('student');
      setStudentMode('signin');
      setSignInEmail('admin@techblitz.com');
      setSignInPassword('admin123');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black text-white selection:bg-cyan-500/30">
      {/* Three.js Dynamic Shader Lines Background */}
      <ShaderAnimation />

      {/* Radial vignette overlay to guarantee perfect form legibility */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.88)_100%)] backdrop-blur-[0.5px]" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Return to Launchpad Navigation */}
        <Link
          href="/"
          className="mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-neutral-950/80 text-xs font-mono text-neutral-400 hover:text-white hover:border-white/50 transition-all flex items-center gap-2 backdrop-blur cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>← RETURN TO LAUNCHPAD</span>
        </Link>

        {/* Branding Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold mb-3 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            COSMOS JEC PRESENTS
          </span>
          <img
            src="/techblitz-logo.png"
            alt="TechBlitz Logo"
            className="w-72 max-w-[85vw] h-auto object-contain filter drop-shadow-[0_0_35px_rgba(56,189,248,0.45)] mb-2"
          />
        </div>

        {/* Glass Card */}
        <div className="w-full rounded-2xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-black/60 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError('');
                setSuccess('');
              }}
              className={`py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>STUDENT PORTAL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('speaker');
                setError('');
                setSuccess('');
              }}
              className={`py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'speaker'
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mic2 className="w-4 h-4" />
              <span>SPEAKER PORTAL</span>
            </button>
          </div>

          {/* Error & Success Banners */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* ================= STUDENT PORTAL ================= */}
          {role === 'student' && (
            <div>
              {/* Student Mode Switch: Sign In vs Create Account */}
              <div className="flex border-b border-white/10 mb-6 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('signin');
                    setError('');
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider transition-colors cursor-pointer ${
                    studentMode === 'signin'
                      ? 'text-white border-b-2 border-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('create');
                    setError('');
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider transition-colors cursor-pointer ${
                    studentMode === 'create'
                      ? 'text-white border-b-2 border-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {/* Student Sign In Form */}
              {studentMode === 'signin' ? (
                <form onSubmit={handleStudentSignIn} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1.5 uppercase">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="arjun@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1.5 uppercase">
                      Security Passcode
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-white text-black font-mono font-bold text-xs rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <span>AUTHORIZE ACCESS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Student Create Account Form */
                <form onSubmit={handleStudentCreate} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        placeholder="Arjun Sharma"
                        className="w-full pl-10 pr-4 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={createEmail}
                        onChange={(e) => setCreateEmail(e.target.value)}
                        placeholder="arjun@jec.ac.in"
                        className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={createPhone}
                        onChange={(e) => setCreatePhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                      College / Institute Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={createCollege}
                        onChange={(e) => setCreateCollege(e.target.value)}
                        placeholder="Jabalpur Engineering College"
                        className="w-full pl-10 pr-4 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                        Branch
                      </label>
                      <input
                        type="text"
                        value={createBranch}
                        onChange={(e) => setCreateBranch(e.target.value)}
                        placeholder="CSE / ECE / IT"
                        className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                        Semester
                      </label>
                      <input
                        type="text"
                        value={createSemester}
                        onChange={(e) => setCreateSemester(e.target.value)}
                        placeholder="4th Semester"
                        className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1 uppercase">
                      Create Passcode *
                    </label>
                    <input
                      type="password"
                      required
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-white text-black font-mono font-bold text-xs rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <span>INITIALIZE ACCOUNT & PASS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================= SPEAKER PORTAL ================= */}
          {role === 'speaker' && (
            <div>
              {/* Speaker Mode Switch: Password vs OTP */}
              <div className="flex border-b border-white/10 mb-6 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setSpeakerMode('password');
                    setError('');
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider transition-colors cursor-pointer ${
                    speakerMode === 'password'
                      ? 'text-white border-b-2 border-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  PASSCODE LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSpeakerMode('otp');
                    setError('');
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider transition-colors cursor-pointer ${
                    speakerMode === 'otp'
                      ? 'text-white border-b-2 border-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  ONE-TIME PASSCODE (OTP)
                </button>
              </div>

              <form onSubmit={handleSpeakerLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1.5 uppercase">
                    Speaker Official Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={speakerEmail}
                      onChange={(e) => setSpeakerEmail(e.target.value)}
                      placeholder="sarah.chen@techblitz.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {speakerMode === 'password' ? (
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1.5 uppercase">
                      Speaker Access Key
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        value={speakerPassword}
                        onChange={(e) => setSpeakerPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider text-neutral-400 mb-1.5 uppercase">
                      Verification Code (Demo: 123456)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={speakerOtp}
                        onChange={(e) => setSpeakerOtp(e.target.value)}
                        placeholder="123456"
                        className="flex-1 px-4 py-2.5 bg-black border border-white/15 rounded-lg text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors text-center tracking-[0.25em]"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpCountdown > 0}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-xs font-mono rounded-lg transition-colors whitespace-nowrap"
                      >
                        {otpCountdown > 0 ? `${otpCountdown}s` : otpSent ? 'RESEND' : 'SEND OTP'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-white text-black font-mono font-bold text-xs rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <span>SPEAKER AUTHENTICATE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Demo Credentials Quick-Fill Pill Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 tracking-wider mb-2.5 uppercase">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>QUICK DEMO ACCREDITATIONS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="px-2.5 py-1 rounded border border-white/10 hover:border-white/30 bg-white/5 text-[10px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Delegate Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('speaker')}
                className="px-2.5 py-1 rounded border border-white/10 hover:border-white/30 bg-white/5 text-[10px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Speaker Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2.5 py-1 rounded border border-white/10 hover:border-white/30 bg-white/5 text-[10px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading portal...</div>}>
      <AuthContent />
    </Suspense>
  );
}
