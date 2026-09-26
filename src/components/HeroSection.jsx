'use client';

import React, { useState, useEffect } from 'react';
import PhoneHeroSection from './PhoneHeroSection';
import PcHeroSection from './PcHeroSection';

/**
 * ==============================================================================
 * DUAL-ENGINE 3D CANVAS SCROLL STORYTELLING HERO CONTROLLER
 * TechBlitz — Organized by Cosmos JEC
 *
 * Conditionally mounts and loads assets ONLY for the active viewport (breakpoint: 768px):
 * - Desktop (window.innerWidth >= 768px) => Mounts PcHeroSection
 * - Mobile (window.innerWidth < 768px)    => Mounts PhoneHeroSection
 *
 * Eliminates SSR hydration flicker via client-side mount check.
 * ==============================================================================
 */
export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };

    // Evaluate active viewport immediately upon client mount
    handleResize();
    setMounted(true);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Return solid black placeholder during SSR & pre-mount to eliminate hydration mismatch
  if (!mounted) {
    return <div className="w-full h-screen bg-black" />;
  }

  // Conditionally render ONLY the active engine to prevent unnecessary asset loading
  return isDesktop ? (
    <PcHeroSection key="pc-hero-engine" />
  ) : (
    <PhoneHeroSection key="phone-hero-engine" />
  );
}

export default HeroSection;
