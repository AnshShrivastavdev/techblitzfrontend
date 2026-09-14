'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  question: string;
  category: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'ELIGIBILITY',
    question: 'Who is eligible to participate in TechBlitz 2026?',
    answer:
      'TechBlitz 2026 is open to all undergraduate and postgraduate students from any recognized engineering college, institute, or university across India. Students from any branch (Computer Science, Information Technology, Electronics & Communication, Mechanical, Electrical, Civil, and Applied Sciences) and any academic year are eligible to attend.',
  },
  {
    category: 'PREREQUISITES',
    question: 'What prerequisites, equipment, or tools do I need to bring?',
    answer:
      'Participants must bring a functional laptop with Wi-Fi capability and a charger. Beginner-friendly tracks require no prior hardware or deep systems experience, as our guided walkthroughs include all necessary environment setup instructions, compiler setups, and starter templates. For hardware labs, components will be provided on-site.',
  },
  {
    category: 'CERTIFICATES',
    question: 'How and when will certificates be distributed?',
    answer:
      'Official accredited certificates issued by Jabalpur Engineering College (JEC) and the Cosmos Science & Technology Guild will be provided. Attendees who complete workshop tracks or participate in the hackathon will receive verifiable digital certificates featuring cryptographic validation codes within 48 hours, along with physical printed certificates for offline attendees.',
  },
  {
    category: 'TEAM SIZE',
    question: 'What are the team size requirements for workshops and the hackathon?',
    answer:
      'Hands-on technical workshop tracks are designed for individual participation to ensure each attendee gains direct practical competence. For the 24-Hour National Hackathon, participants may register solo or collaborate in teams of 2 to 4 members. Inter-college and inter-branch team compositions are fully welcomed and encouraged.',
  },
  {
    category: 'COMMUNITY & CHANNELS',
    question: 'How do I join the community channels for updates and discussions?',
    answer:
      'Upon registering, attendees receive private access links to the Cosmos JEC Discord server and official WhatsApp bulletin channels for real-time announcements, track schedules, speaker Q&As, and teammate matching.',
  },
];

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0); // First open by default

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 border-t border-white/10 bg-black">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>KNOWLEDGE BASE // FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 font-mono">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Essential information regarding eligibility, prerequisites, credentials, and team rules for TechBlitz 2026.
          </p>
        </div>

        {/* Accordion Component */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = activeFaq === idx;

            return (
              <div key={idx} className="py-5 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 font-semibold text-left text-white hover:text-neutral-200 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15 w-fit">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-mono text-white group-hover:text-neutral-200">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 pb-1 pl-0 sm:pl-24 text-xs sm:text-sm text-neutral-400 leading-relaxed">
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
