'use client';

import React from 'react';
import { VideoPreloader } from '@/components/VideoPreloader';
import { Navbar } from '@/components/Navbar';
import { CanvasScroller } from '@/components/CanvasScroller';
import { CompanyMarquee } from '@/components/CompanyMarquee';
import { AboutSection } from '@/components/AboutSection';
import { SpeakersSection } from '@/components/SpeakersSection';
import { GallerySection } from '@/components/GallerySection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Full Cinematic Video Preloader (VN20260913_031443.mp4) */}
      <VideoPreloader videoSrc="/preloader.mp4" />

      {/* Fixed Sci-Fi Header with Login & Sign Up buttons */}
      <Navbar />

      {/* 3D Canvas Scroller Hero */}
      <section className="relative z-10">
        <CanvasScroller />
      </section>

      {/* Content sections below Canvas Scroller */}
      <div className="relative z-20 bg-black">
        {/* Horizontal Floating Logo Marquee: Companies of Alumni Mentors */}
        <CompanyMarquee />

        {/* About Section (#about) */}
        <AboutSection />

        {/* Speakers Section (#speakers) */}
        <SpeakersSection />

        {/* Gallery Section (#gallery) */}
        <GallerySection />

        {/* FAQ Section (#faq) */}
        <FaqSection />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
