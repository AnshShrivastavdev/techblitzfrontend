'use client';

import React, { useState } from 'react';
import {
  User,
  BellRing,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Award,
  ChevronRight,
  Briefcase,
  Layers,
  X,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  batch: string;
  education: string;
  domain: string;
  experience: string;
  photo?: string;
  category: 'Defence & Aerospace' | 'Big Tech & Systems' | 'AI & Data Science' | 'Core Industry';
  isKeynote?: boolean;
  badge?: string;
  highlights: string[];
}

export const SPEAKERS_LIST: Speaker[] = [
  {
    id: 'spk-01',
    name: 'Dr. Sudhir Kumar Mishra',
    role: 'Former Director General, DRDO & Former CEO & MD',
    company: 'DRDO / BrahMos Aerospace',
    batch: 'JEC 1982 Batch',
    education: 'Jabalpur Engineering College (1982) • NIT Warangal',
    domain: 'Missile Systems, Defence Technology & Strategic Innovation',
    experience:
      'Long-standing career in Indian defence research and supersonic missile systems, including major leadership roles as CEO & MD of BrahMos Aerospace and Director General at DRDO, Ministry of Defence, Government of India.',
    photo: '/speakers/sudhir-kumar-mishra.png',
    category: 'Defence & Aerospace',
    isKeynote: true,
    badge: 'CHIEF KEYNOTE PATRON',
    highlights: ['BrahMos Aerospace Leadership', 'DRDO Distinguished Scientist', 'Strategic Defence Technology'],
  },
  {
    id: 'spk-02',
    name: 'Vinayak Chaturvedi',
    role: 'Software Engineer III',
    company: 'Google',
    batch: 'JEC 2018 Batch',
    education: 'B.E. Jabalpur Engineering College (2014–2018) • M.Tech, IIIT Bangalore (2020–2022)',
    domain: 'Full-Stack Architecture & Cloud Distributed Systems',
    experience:
      'Currently Software Engineer III at Google Hyderabad. Extensive track record in high-scale systems across Goldman Sachs (Senior Software Developer/Associate), The D. E. Shaw Group (Member Technical), and Infosys.',
    photo: '/speakers/vinayak-chaturvedi.jpg',
    category: 'Big Tech & Systems',
    isKeynote: true,
    badge: 'ALUMNI KEYNOTE',
    highlights: ['Google (Hyderabad)', 'Ex-Goldman Sachs & D. E. Shaw', 'IIIT Bangalore M.Tech'],
  },
  {
    id: 'spk-03',
    name: 'Shrey Tiwari',
    role: 'Graduate Engineer Trainee',
    company: 'Reliance Industries Limited',
    batch: 'JEC 2023 Batch',
    education: 'Jabalpur Engineering College (2019–2023) • M.Tech, IIT Delhi (Instrument Technology)',
    domain: 'Instrumentation Technology & Energy Engineering',
    experience:
      'Engineering and instrumentation professional at Reliance Industries Limited. Advanced technical research in Instrument Technology at IIT Delhi; former technical contributor to the JEC TEJASH electric-bike innovation project.',
    photo: '/speakers/shrey-tiwari.jpg',
    category: 'Core Industry',
    badge: 'INDUSTRY RESEARCHER',
    highlights: ['Reliance Industries Limited', 'IIT Delhi Instrument Tech', 'TEJASH EV Project'],
  },
  {
    id: 'spk-04',
    name: 'Rishabh Khampariya',
    role: 'Lead Product Analyst & Chief Mentor',
    company: 'Housing.com / edAnalytix',
    batch: 'JEC Alumnus',
    education: 'Jabalpur Engineering College • Topmate & CSD Mentor',
    domain: 'Product Intelligence, Fintech & Predictive Analytics',
    experience:
      'Over 7 years of deep industry expertise in product and business analytics. Proven tenure delivering data-driven decision frameworks for Housing.com, Amazon, Axis Bank, Microsoft client analytics, and Mu Sigma.',
    photo: '/speakers/rishabh-khampariya.jpg',
    category: 'AI & Data Science',
    badge: 'PRODUCT LEADER',
    highlights: ['Lead Product Analyst @ Housing', 'Ex-Amazon & Microsoft Analytics', 'Chief Mentor @ edAnalytix'],
  },
  {
    id: 'spk-05',
    name: 'Tanu Chaurasiya',
    role: 'Member of Technical Staff 2 (MTS-2)',
    company: 'Adobe',
    batch: 'JEC 2022 Batch',
    education: 'B.E. Jabalpur Engineering College (2018–2022, 8.28 CGPA)',
    domain: 'Core Software Architecture, EDA & Systems Algorithms',
    experience:
      'Member of Technical Staff at Adobe Noida. Established expertise spanning research-oriented technology roles at Siemens EDA (Senior MTS) and Samsung R&D Institute India (Senior Software Engineer).',
    photo: '/speakers/tanu-chaurasiya.jpg',
    category: 'Big Tech & Systems',
    badge: 'SYSTEMS INNOVATOR',
    highlights: ['Adobe (MTS-2)', 'Ex-Siemens EDA & Samsung R&D', '8.28 CGPA JEC Honors'],
  },
  {
    id: 'spk-06',
    name: 'Prashant Dutta',
    role: 'Manager (Information Technology)',
    company: 'MP Electricity Board (MPEB)',
    batch: 'JEC 2006 Batch',
    education: 'B.E. Jabalpur Engineering College (2002–2006)',
    domain: 'Enterprise ERP, Cloud Infrastructure & Smart Metering GIS',
    experience:
      'More than two decades of enterprise IT and large-scale digital governance leadership. Career includes software engineering at Satyam Computer Services, academic faculty leadership, and spearheading AWS cloud migrations, GIS, and smart metering at MPEB.',
    photo: '',
    category: 'Core Industry',
    badge: 'ENTERPRISE TECH LEAD',
    highlights: ['Manager IT @ MPEB', '20+ Years IT Leadership', 'Ex-Satyam & AWS Cloud Migration'],
  },
  {
    id: 'spk-07',
    name: 'Ashish Onkar',
    role: 'SAP Technology Specialist',
    company: 'Cognizant',
    batch: 'JEC 2018 Batch',
    education: 'B.E. Jabalpur Engineering College (2014–2018)',
    domain: 'Enterprise Systems, S/4HANA & Global Data Integration',
    experience:
      'Experienced enterprise technology professional at Cognizant with over 15+ years of SAP domain depth. Holds industry certifications in SAP Data Services (BODS), SAP S/4HANA Production Planning, and enterprise business transformation.',
    photo: '',
    category: 'Big Tech & Systems',
    badge: 'SAP ENTERPRISE LEAD',
    highlights: ['Cognizant SAP Specialist', 'SAP S/4HANA Certified', 'Enterprise Data Integration'],
  },
  {
    id: 'spk-08',
    name: 'Siddharth Chouksey',
    role: 'Systems Software Engineer',
    company: 'Hitachi / ex-Secureworks',
    batch: 'JEC Alumnus',
    education: 'Jabalpur Engineering College • BITS Pilani Hyderabad (2021–2023)',
    domain: 'Systems Software, C++ Internals & Cybersecurity EDR',
    experience:
      'Specialist in high-performance C++ systems and Linux OS internals at Hitachi. Deep engineering expertise in endpoint detection & response (EDR) security architecture, Linux kernel agents, and previously with Secureworks.',
    photo: '/speakers/siddharth-chouksey.jpg',
    category: 'Big Tech & Systems',
    badge: 'CYBERSECURITY ARCHITECT',
    highlights: ['Hitachi Systems Software', 'BITS Pilani M.Tech', 'Linux Internals & Taegis EDR'],
  },
  {
    id: 'spk-09',
    name: 'Rajit Gupta',
    role: 'Data Engineer',
    company: 'American Express',
    batch: 'JEC 2021 Batch',
    education: 'B.Tech, Jabalpur Engineering College (2017–2021)',
    domain: 'Cloud Big Data Pipelines & Enterprise Financial Analytics',
    experience:
      'Data Engineer at American Express Gurugram specializing in scalable analytics, modern big data pipelines, and SQL optimization. Google Cloud Certified Professional Data Engineer and former Smart India Hackathon team lead.',
    photo: '/speakers/rajit-gupta.jpg',
    category: 'AI & Data Science',
    badge: 'DATA ARCHITECT',
    highlights: ['American Express Gurugram', 'GCP Certified Data Engineer', 'Smart India Hackathon Lead'],
  },
  {
    id: 'spk-10',
    name: 'Shailendra Namdev',
    role: 'Data Scientist (AI/ML & Operations Research)',
    company: 'Flipkart',
    batch: 'JEC 2020 Batch',
    education: 'B.E. Jabalpur Engineering College (2016–2020) • M.Tech (TA) IEOR, IIT Bombay (2021–2023)',
    domain: 'Machine Learning, Mathematical Optimization & Algorithmic Design',
    experience:
      'Data Scientist at Flipkart Bangalore specializing in machine learning, mathematical programming, and operations research. M.Tech Teaching Assistant from IIT Bombay with published master’s thesis on network design and flow optimization for the Reserve Bank of India (RBI); ex-Delhivery.',
    photo: '/speakers/shailendra-namdev.jpg',
    category: 'AI & Data Science',
    badge: 'AI/ML & OR SCIENTIST',
    highlights: ['Flipkart Data Science', 'IIT Bombay IEOR M.Tech', 'RBI Optimization Thesis'],
  },
];

const CATEGORIES = [
  'All',
  'Defence & Aerospace',
  'Big Tech & Systems',
  'AI & Data Science',
  'Core Industry',
] as const;

export function SpeakersSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpeaker, setActiveSpeaker] = useState<Speaker | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const filteredSpeakers =
    selectedCategory === 'All'
      ? SPEAKERS_LIST
      : SPEAKERS_LIST.filter((s) => s.category === selectedCategory);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyEmail('');
      setNotifySuccess(false);
    }, 4000);
  };

  return (
    <section id="speakers" className="py-24 sm:py-32 border-t border-white/10 bg-black relative overflow-hidden">
      {/* Ambient background nebulae */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[300px] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Distinguished Alumni & Keynote Faculty
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white mb-5 uppercase leading-tight">
            Speakers & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Mentors</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Welcoming visionaries, senior defence leaders, and global software architects. From DRDO & Google to Adobe, Flipkart, and IITs — meeting the brightest minds of TechBlitz 2.0.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All' ? SPEAKERS_LIST.length : SPEAKERS_LIST.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                    : 'bg-neutral-900/80 text-neutral-400 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-400/30 text-cyan-200' : 'bg-white/5 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-20">
          {filteredSpeakers.map((speaker, idx) => {
            const isTopKeynote = speaker.isKeynote && speaker.id === 'spk-01';

            return (
              <motion.div
                key={speaker.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={`group relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  isTopKeynote
                    ? 'border-2 border-cyan-400/60 bg-gradient-to-b from-neutral-900/90 via-black/90 to-neutral-950/95 shadow-[0_0_35px_rgba(56,189,248,0.15)] md:col-span-2 lg:col-span-3'
                    : 'border border-white/10 bg-neutral-950/80 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.1)]'
                }`}
                onClick={() => setActiveSpeaker(speaker)}
              >
                {/* Tech Corner Accents */}
                <span className="absolute top-2.5 left-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>
                <span className="absolute top-2.5 right-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>
                <span className="absolute bottom-2.5 left-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>
                <span className="absolute bottom-2.5 right-2.5 text-[9px] text-neutral-600 font-mono select-none">+</span>

                {/* Top Badge & Batch */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase ${
                      isTopKeynote
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'bg-white/5 text-cyan-400 border border-white/10'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    {speaker.badge || speaker.category}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-neutral-400 bg-neutral-900/90 px-2.5 py-1 rounded-md border border-white/10">
                    ⚡ {speaker.batch}
                  </span>
                </div>

                {/* Speaker Identity: Horizontal for top keynote, vertical for standard cards */}
                <div className={`flex ${isTopKeynote ? 'flex-col sm:flex-row items-center sm:items-start gap-6 mb-6' : 'flex-col items-center text-center mb-5'}`}>
                  {/* Photo / Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`relative rounded-2xl overflow-hidden border bg-neutral-900 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl ${
                        isTopKeynote
                          ? 'w-32 h-32 sm:w-36 sm:h-36 border-cyan-400/60 shadow-[0_0_25px_rgba(56,189,248,0.25)]'
                          : 'w-28 h-28 border-white/20 group-hover:border-cyan-400/50'
                      }`}
                    >
                      {speaker.photo ? (
                        <img
                          src={speaker.photo}
                          alt={speaker.name}
                          className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-500"
                          onError={(e) => {
                            // Fallback to stylized monogram if image link fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}

                      {/* Fallback Monogram Avatar */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-cyan-400 font-mono font-bold text-2xl -z-10">
                        {speaker.name
                          .split(' ')
                          .filter((w) => !w.startsWith('Dr.'))
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    </div>
                  </div>

                  {/* Speaker Details */}
                  <div className={`flex-1 ${isTopKeynote ? 'text-center sm:text-left' : 'text-center mt-4'}`}>
                    <h3
                      className={`font-black text-white font-sans tracking-tight group-hover:text-cyan-300 transition-colors ${
                        isTopKeynote ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                      }`}
                    >
                      {speaker.name}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-cyan-400 font-mono text-xs sm:text-sm font-semibold">
                      <Briefcase className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                      <span>{speaker.role}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-neutral-300 text-xs font-mono">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                      <strong className="text-white">{speaker.company}</strong>
                    </div>

                    {isTopKeynote && (
                      <p className="mt-3 text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-3">
                        {speaker.experience}
                      </p>
                    )}
                  </div>
                </div>

                {/* Academic Background Pill */}
                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 mb-4 text-left">
                  <div className="flex items-start gap-2 text-[11px] text-neutral-300">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{speaker.education}</span>
                  </div>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {speaker.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-white/5"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                  <span>View Full Profile</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Centralized Notification Bar */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl border border-white/15 bg-neutral-950/90 text-center shadow-2xl backdrop-blur-md">
          <h4 className="text-xs sm:text-sm font-bold font-mono tracking-wider text-white mb-2 flex items-center justify-center gap-2">
            <BellRing className="w-4 h-4 text-cyan-400" />
            SPEAKER ROSTER & WORKSHOP TELEMETRY
          </h4>
          <p className="text-xs text-neutral-400 mb-5 max-w-md mx-auto leading-relaxed">
            Receive keynote schedule timings, interactive AMA slots, and live session updates directly in your inbox.
          </p>

          <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="developer@jecjabalpur.ac.in"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs font-mono bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors min-h-[42px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono font-bold bg-white text-black hover:bg-cyan-400 rounded-lg transition-colors whitespace-nowrap cursor-pointer min-h-[42px] shadow-md"
            >
              SUBSCRIBE UPDATES
            </button>
          </form>

          {notifySuccess && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>SUBSCRIPTION LOGGED // NOTIFICATION ARMED</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Speaker Detailed Dossier Modal */}
      <AnimatePresence>
        {activeSpeaker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-neutral-950 border border-cyan-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-neutral-900 flex-shrink-0 shadow-lg">
                  {activeSpeaker.photo ? (
                    <img
                      src={activeSpeaker.photo}
                      alt={activeSpeaker.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-cyan-400 font-bold text-2xl">
                      {activeSpeaker.name
                        .split(' ')
                        .filter((w) => !w.startsWith('Dr.'))
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 mb-2">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    {activeSpeaker.badge || 'VERIFIED ALUMNUS'}
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-white">{activeSpeaker.name}</h3>
                  <p className="text-cyan-400 font-mono text-xs sm:text-sm mt-1">{activeSpeaker.role}</p>
                  <p className="text-neutral-300 font-mono text-xs mt-0.5 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    {activeSpeaker.company}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="py-6 space-y-5">
                <div>
                  <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    Alma Mater & Education
                  </h5>
                  <p className="text-sm text-neutral-200 bg-neutral-900/60 p-3 rounded-xl border border-white/5 font-mono">
                    {activeSpeaker.education}
                  </p>
                </div>

                <div>
                  <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Core Domain & Technical Focus
                  </h5>
                  <p className="text-sm text-cyan-300 bg-cyan-950/20 p-3 rounded-xl border border-cyan-500/20 font-mono">
                    {activeSpeaker.domain}
                  </p>
                </div>

                <div>
                  <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    Professional Experience & Background
                  </h5>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-white/5">
                    {activeSpeaker.experience}
                  </p>
                </div>

                <div>
                  <h5 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Key Affiliations
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activeSpeaker.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/30"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500">TechBlitz 2.0 • Jabalpur Engineering College</span>
                <button
                  onClick={() => setActiveSpeaker(null)}
                  className="px-4 py-2 rounded-lg bg-white text-black text-xs font-mono font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default SpeakersSection;
