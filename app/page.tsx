'use client';

import React from 'react';
import { VideoPreloader } from '@/components/VideoPreloader';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CompanyMarquee } from '@/components/CompanyMarquee';
import { AboutSection } from '@/components/AboutSection';
import { OutreachPartnersSection } from '@/components/OutreachPartnersSection';
import { SpeakersSection } from '@/components/SpeakersSection';
import { GallerySection } from '@/components/GallerySection';
import { RegisterSection } from '@/components/RegisterSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Full Cinematic Video Preloader */}
      <VideoPreloader videoSrc="/preloader.mp4" />

      {/* =====================================================================
          LAYER 40: FIXED NAVIGATION HEADER (pointer-events-auto)
          ===================================================================== */}
      <Navbar />

      {/* =====================================================================
          RESPONSIVE DUAL-ENGINE 3D CANVAS SCROLL STORYTELLING HERO SYSTEM
          Desktop (>=768px): PcHeroSection.jsx (6 Sequential Chapters, 12% Crossfade)
          Mobile (<768px):   PhoneHeroSection.jsx (Vertical 280dvh Runway, Center-crop)
          ===================================================================== */}
      <HeroSection />

      {/* =====================================================================
          LAYER 20: INTERACTIVE CONTENT LAYER (pointer-events-auto)
          Subsequent sections rendering over black background
          ===================================================================== */}
      <main className="relative z-20 bg-black pointer-events-auto">
        {/* Horizontal Floating Logo Marquee: Companies of Alumni Mentors */}
        <CompanyMarquee />

        {/* About Section (#about) */}
        <AboutSection />

        {/* Outreach Partners Floating Showcase (#partners / #zones) */}
        <OutreachPartnersSection />

        {/* Speakers Section (#speakers) */}
        <SpeakersSection />

        {/* Gallery Section (#gallery) */}
        <GallerySection />

        {/* Participant Pass Registration Section (#register) */}
        <RegisterSection />

        {/* FAQ Accessible Accordion (#faq) */}
        <FaqSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
