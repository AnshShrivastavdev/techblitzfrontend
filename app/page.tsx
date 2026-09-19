'use client';

import React from 'react';
import { VideoPreloader } from '@/components/VideoPreloader';
import { Navbar } from '@/components/Navbar';
import { CanvasStoryScroll } from '@/components/3d/CanvasStoryScroll';
import { CompanyMarquee } from '@/components/CompanyMarquee';
import { AboutSection } from '@/components/AboutSection';
import { EventZonesSection } from '@/components/EventZonesSection';
import { SpeakersSection } from '@/components/SpeakersSection';
import { GallerySection } from '@/components/GallerySection';
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
          LAYER 0 (BACKGROUND CANVAS), LAYER 10 (HUD OVERLAY), LAYER 1 (SCROLL TRACK)
          Decoupled, centralized 3D scroll-driven storytelling experience
          ===================================================================== */}
      <CanvasStoryScroll />

      {/* =====================================================================
          LAYER 20: INTERACTIVE CONTENT LAYER (pointer-events-auto)
          Subsequent sections rendering over black background
          ===================================================================== */}
      <main className="relative z-20 bg-black pointer-events-auto">
        {/* Horizontal Floating Logo Marquee: Companies of Alumni Mentors */}
        <CompanyMarquee />

        {/* About Section (#about) */}
        <AboutSection />

        {/* Event Zones 3-Column Grid (#zones) */}
        <EventZonesSection />

        {/* Speakers Section (#speakers) */}
        <SpeakersSection />

        {/* Gallery Section (#gallery) */}
        <GallerySection />

        {/* FAQ Accessible Accordion (#faq) */}
        <FaqSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
