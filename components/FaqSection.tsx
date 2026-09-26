'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FaqItem {
  id: string;
  category: 'General' | 'Registration' | 'Workshops' | 'Certificates' | 'Networking';
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-01',
    category: 'Workshops',
    question: 'Will Techblitz be beneficial for 3rd and 4th year students?',
    answer:
      'Yes, the workshops at Techblitz are designed to equip 3rd and 4th year students with hands-on experience in emerging technologies, real-world tools, and industry practices. They help bridge the gap between academics and practical applications, making students more job-ready for placements, interviews, and real engineering challenges.',
  },
  {
    id: 'faq-02',
    category: 'Registration',
    question: 'How much does it cost to attend TechBlitz?',
    answer:
      'TechBlitz is organized by COSMOS JEC with a student-first philosophy to keep technical education accessible. Registration details and domain access information are provided directly on the registration portal, with multiple foundational sessions and webinars offered at zero cost or with nominal verification processing fees.',
  },
  {
    id: 'faq-03',
    category: 'Registration',
    question: 'What is the registration deadline?',
    answer:
      'Registrations are processed on a rolling, first-come-first-served basis. Because each workshop domain has strictly capped seats to maintain high mentor-to-student interaction and quality hands-on guidance, domains lock automatically once their intake threshold is reached.',
  },
  {
    id: 'faq-04',
    category: 'General',
    question: "Can I attend if I'm a beginner in technology?",
    answer:
      'Absolutely! TechBlitz caters to all learning stages. Foundational tracks such as AI/ML Fundamentals, UI/UX Design, and AWS Cloud Essentials are calibrated specifically for beginners. Mentors guide you step-by-step through environment setup, tools, and basic coding paradigms.',
  },
  {
    id: 'faq-05',
    category: 'Workshops',
    question: 'Is this only for JEC students?',
    answer:
      'No. While TechBlitz is organized by COSMOS under the Department of Computer Science and Engineering at Jabalpur Engineering College (JEC), students, scholars, and builders from other engineering colleges, universities, and technical institutes are warmly encouraged to participate.',
  },
  {
    id: 'faq-06',
    category: 'Certificates',
    question: 'Will certificates be provided?',
    answer:
      'Yes. Depending on domain completion and assessment metrics, participants can earn an official Certificate of Participation as well as a Certificate of Excellence. All credentials are authenticated by Jabalpur Engineering College (JEC) and the COSMOS community with unique verifiable credential IDs.',
  },
  {
    id: 'faq-07',
    category: 'Registration',
    question: 'Until when is registration open?',
    answer:
      'Registration remains active until each technical domain hits its enrollment capacity limit. We strongly advise securing your spot early, as high-demand tracks (such as AI/ML, Cybersecurity, and VLSI) typically fill up rapidly.',
  },
  {
    id: 'faq-08',
    category: 'Workshops',
    question: 'What domains will be covered in the workshops?',
    answer:
      'TechBlitz covers 11 specialized technology domains: AI/ML, Cybersecurity, VLSI Design, Mobile App Development, UI/UX Design, DevOps & CI/CD Pipelines, Management Aspects in Engineering, Industrial AIML Webinar, Backend Development, Applications of AIML in Space Science, and AWS Cloud Essentials.',
  },
  {
    id: 'faq-09',
    category: 'Networking',
    question: 'Will there be any networking opportunities?',
    answer:
      'Yes! Attendees will have interactive Q&A access to industry leaders from Google, ISRO, NVIDIA, Amazon, and Airtel, as well as IIT research scholars, JEC faculty mentors, and fellow passionate student technologists across community forums and live sessions.',
  },
  {
    id: 'faq-10',
    category: 'General',
    question: 'How long will each session be?',
    answer:
      'Workshops feature daily 2 sessions conducted in the evening between 6:00 PM and 10:00 PM IST. This schedule is carefully designed so students can participate without conflicting with their daytime college classes or lab schedules.',
  },
  {
    id: 'faq-11',
    category: 'General',
    question: 'Do we need any prior knowledge or skills?',
    answer:
      'Prerequisites depend on the chosen track. Beginner tracks require only curiosity and basic computer familiarity. Intermediate and advanced tracks (like VLSI design, DevOps, or Space Science AI/ML) benefit from fundamental programming or circuit logic, with starter templates and tool guides provided beforehand.',
  },
  {
    id: 'faq-12',
    category: 'General',
    question: 'What should I bring to the event?',
    answer:
      'For virtual/hybrid sessions, you need a laptop or desktop with a stable internet connection, installed required software (detailed in your track welcome guide), and an audio headset. For campus sessions, bring your laptop, charger, notebook, and college ID card.',
  },
  {
    id: 'faq-13',
    category: 'Workshops',
    question: 'What topics will the speakers talk about?',
    answer:
      'Speakers will present real-world industrial implementations, system architecture principles, security paradigms, deployment strategies, and insider career roadmaps, followed by practical demonstrations and live question-and-answer interactions.',
  },
  {
    id: 'faq-14',
    category: 'Workshops',
    question: 'Which MNC professionals are coming?',
    answer:
      'TechBlitz features renowned leaders from top global technology enterprises and premier institutions, including Deepak Srivastava (Senior Scientist, ISRO), Pragati Saraf (Data Scientist, Google, Ex-Microsoft), Sanjeev Kumar (Android Developer, Bharti Airtel), Pratyush Pare (ASIC Design Engineer, NVIDIA), Ankit Yadav (Information Security Engineer, Fiserv), Arideep Dutta (Software Engineer, Rippling, Ex-Amazon), Ratnesh Patel (IT Analyst, Tata Consultancy Services), and Research Scholars from IIT Roorkee.',
  },
  {
    id: 'faq-15',
    category: 'Certificates',
    question: 'What are the conditions to receive the Participation Certificate?',
    answer:
      'To earn the Certificate of Participation, attendees must attend the scheduled workshop sessions for their chosen domain, meet the minimum attendance threshold, and submit the concluding feedback or domain assessment quiz.',
  },
  {
    id: 'faq-16',
    category: 'Certificates',
    question: 'Will this workshop help in placements?',
    answer:
      'Yes, significantly. Beyond verified certificates for your resume and LinkedIn, the workshops emphasize real industry tools, production architectures, and project workflows directly sought by tech recruiters, giving you actionable talking points for technical interviews.',
  },
  {
    id: 'faq-17',
    category: 'Workshops',
    question: 'Can we attend more than one domain session?',
    answer:
      'Yes! You can register multiple times for different domain tracks as long as their live timings do not overlap. Many participants pair software tracks (like Backend or AI/ML) with cloud or design tracks to build comprehensive full-stack expertise.',
  },
  {
    id: 'faq-18',
    category: 'Networking',
    question: 'What will be future opportunity for top performers?',
    answer:
      'Top performers, quiz high-scorers, and active builders will receive the prestigious Certificate of Excellence, potential project collaboration with COSMOS research pods, priority entry to upcoming national hackathons, and direct mentorship referrals.',
  },
];

const CATEGORIES = ['All', 'Workshops', 'Registration', 'General', 'Certificates', 'Networking'] as const;

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<string | null>('faq-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setActiveFaq(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 sm:py-36 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>KNOWLEDGE BASE // FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Got questions? We've got answers! Find everything you need to know about TechBlitz, from registration to workshops, certificates, and beyond.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="mb-6 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search FAQs (e.g., certificates, JEC, MNC speakers, timings)..."
              className="w-full pl-11 pr-4 py-3 bg-neutral-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs font-mono text-neutral-400 hover:text-white px-2 py-1"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-10 flex flex-wrap gap-2 items-center justify-center">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            const count = cat === 'All' ? FAQ_ITEMS.length : FAQ_ITEMS.filter(f => f.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-neutral-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accessible Accordion Component */}
        <div className="divide-y divide-white/10 border-y border-white/10" role="region" aria-label="FAQ Accordion">
          {filteredFaqs.length === 0 ? (
            <div className="py-16 text-center">
              <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-mono text-neutral-400 mb-1">No matching questions found.</p>
              <p className="text-xs text-neutral-500">Try adjusting your search query or choosing another category.</p>
            </div>
          ) : (
            filteredFaqs.map(item => {
              const isOpen = activeFaq === item.id;
              const contentId = `faq-panel-${item.id}`;
              const buttonId = `faq-btn-${item.id}`;

              return (
                <div key={item.id} className="py-5 sm:py-6 transition-colors">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="w-full flex items-start sm:items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none min-h-[44px]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 pr-2">
                      <span className="text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10 w-fit shrink-0">
                        {item.category}
                      </span>
                      <span className="text-sm sm:text-base font-sans font-medium text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-white transition-transform duration-300 shrink-0 mt-1 sm:mt-0 ${
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
            })
          )}
        </div>

        {/* Footer Support Callout */}
        <div className="mt-12 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>HAVE MORE QUESTIONS? REACH OUT VIA OUR CAMPUS COMMUNITY PORTAL</span>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
