'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-01',
    category: 'ELIGIBILITY',
    question: 'Who is eligible to participate in TechBlitz 2026?',
    answer:
      'TechBlitz 2026 is open to all undergraduate and postgraduate students from any recognized engineering college, institute, or university across India. Students from any branch (Computer Science, Information Technology, Electronics & Communication, Mechanical, Electrical, Civil, and Applied Sciences) and any academic year are eligible to attend.',
  },
  {
    id: 'faq-02',
    category: 'PREREQUISITES',
    question: 'What prerequisites, equipment, or tools do I need to bring?',
    answer:
      'Participants must bring a functional laptop with Wi-Fi capability and a charger. Beginner-friendly tracks require no prior hardware or deep systems experience, as our guided walkthroughs include all necessary environment setup instructions, compiler setups, and starter templates. For hardware labs, components will be provided on-site.',
  },
  {
    id: 'faq-03',
    category: 'CERTIFICATES',
    question: 'How and when will certificates be distributed?',
    answer:
      'Official accredited certificates issued by Jabalpur Engineering College (JEC) and the Cosmos Science & Technology Guild will be provided. Attendees who complete workshop tracks or participate in the hackathon will receive verifiable digital certificates featuring cryptographic validation codes within 48 hours, along with physical printed certificates for offline attendees.',
  },
  {
    id: 'faq-04',
    category: 'TEAM SIZE',
    question: 'What are the team size requirements for workshops and the hackathon?',
    answer:
      'Hands-on technical workshop tracks are designed for individual participation to ensure each attendee gains direct practical competence. For the 24-Hour National Hackathon, participants may register solo or collaborate in teams of 2 to 4 members. Inter-college and inter-branch team compositions are fully welcomed and encouraged.',
  },
  {
    id: 'faq-05',
    category: 'COMMUNITY & CHANNELS',
    question: 'How do I join the community channels for updates and discussions?',
    answer:
      'Upon registering, attendees receive private access links to the Cosmos JEC Discord server and official WhatsApp bulletin channels for real-time announcements, track schedules, speaker Q&As, and teammate matching.',
  },
];

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0); // First item open by default

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 sm:py-36 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 sm:mb-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>KNOWLEDGE BASE // FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto font-sans">
            Essential information regarding eligibility, prerequisites, credentials, and team rules for TechBlitz 2026.
          </p>
        </div>

        {/* Accessible Accordion Component (Step 3) */}
        <div className="divide-y divide-white/10 border-y border-white/10" role="region" aria-label="FAQ Accordion">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = activeFaq === idx;
            const contentId = `faq-panel-${item.id}`;
            const buttonId = `faq-btn-${item.id}`;

            return (
              <div key={item.id} className="py-5 sm:py-6 transition-colors">
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none min-h-[44px]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10 w-fit">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-mono font-medium text-white group-hover:text-cyan-300 transition-colors">
                      {item.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-white transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 pb-1 pl-0 sm:pl-28 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
