'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: COSMOS JEC Logo / Emblem */}
        <Link
          href="/"
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded border border-white/25 bg-neutral-950 flex items-center justify-center text-xs font-mono font-bold text-white group-hover:border-white transition-colors">
            CJ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider font-mono text-white group-hover:text-neutral-200">
              COSMOS <span className="text-neutral-400">JEC</span>
            </span>
            <span className="text-[9px] font-mono text-neutral-500 tracking-widest">
              TECHBLITZ '26
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs tracking-widest text-neutral-400">
          <button
            onClick={() => scrollTo('about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollTo('speakers')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            SPEAKERS
          </button>
          <button
            onClick={() => scrollTo('gallery')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            GALLERY
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Far Right: Direct Login & Sign Up Navigation Links */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Direct Link to Login Page */}
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-neutral-300 hover:text-white border border-white/20 hover:border-white/50 rounded transition-all flex items-center gap-1.5 cursor-pointer hover:bg-white/5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>LOG IN</span>
          </Link>

          {/* Direct Link to Sign Up Page */}
          <Link
            href="/login?mode=register"
            className="px-4 py-1.5 text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 rounded transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>SIGN UP</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-2xl px-5 py-5 font-mono text-xs tracking-widest space-y-1">
          <button
            onClick={() => scrollTo('about')}
            className="w-full text-left text-neutral-300 hover:text-white py-3 px-2 rounded hover:bg-white/5 flex items-center min-h-[44px]"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollTo('speakers')}
            className="w-full text-left text-neutral-300 hover:text-white py-3 px-2 rounded hover:bg-white/5 flex items-center min-h-[44px]"
          >
            SPEAKERS
          </button>
          <button
            onClick={() => scrollTo('gallery')}
            className="w-full text-left text-neutral-300 hover:text-white py-3 px-2 rounded hover:bg-white/5 flex items-center min-h-[44px]"
          >
            GALLERY
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="w-full text-left text-neutral-300 hover:text-white py-3 px-2 rounded hover:bg-white/5 flex items-center min-h-[44px]"
          >
            FAQ
          </button>

          {/* Mobile Auth Buttons */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 min-h-[44px] flex items-center justify-center text-center text-xs font-semibold border border-white/20 text-white rounded hover:bg-white/10"
              >
                LOG IN
              </Link>
              <Link
                href="/login?mode=register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 min-h-[44px] flex items-center justify-center text-center text-xs font-semibold bg-white text-black rounded hover:bg-neutral-200"
              >
                SIGN UP
              </Link>
            </div>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] flex items-center justify-center text-center text-xs font-semibold text-cyan-300 border border-cyan-500/30 bg-cyan-950/20 rounded hover:bg-cyan-900/30"
            >
              ⚡ OPEN DASHBOARD
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
