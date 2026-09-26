import React, { useEffect } from 'react';
import Lenis from 'lenis';
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
import './LandingPage.css';

export default function LandingPage() {
  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    window.__lenis = lenis;

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <div className="techblitz-page bg-black text-white relative selection:bg-white selection:text-black min-h-screen">
      {/* Full Cinematic Video Preloader */}
      <VideoPreloader videoSrc="/preloader.mp4" />

      {/* =====================================================================
          LAYER 40: FIXED NAVIGATION HEADER (pointer-events-auto)
          ===================================================================== */}
      <Navbar />

      {/* =====================================================================
          LAYER 0 (BACKGROUND CANVAS), LAYER 10 (HUD OVERLAY), LAYER 1 (SCROLL TRACK)
          ===================================================================== */}
      <CanvasStoryScroll />

      {/* =====================================================================
          LAYER 20: INTERACTIVE CONTENT LAYER (pointer-events-auto)
          Subsequent sections rendering over black background.
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
