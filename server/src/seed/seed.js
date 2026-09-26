import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { User } from '../models/User.js';
import { Speaker } from '../models/Speaker.js';
import { Workshop } from '../models/Workshop.js';
import { Gallery, FAQ } from '../models/Content.js';

import { getMongoUri } from '../config/db.js';

const seedData = async () => {
  try {
    const connStr = getMongoUri();
    console.log(`[Seed Script] Connecting to MongoDB: ${connStr}`);
    await mongoose.connect(connStr);

    console.log('[Seed Script] Clearing existing collections...');
    await User.deleteMany({});
    await Speaker.deleteMany({});
    await Workshop.deleteMany({});
    await Gallery.deleteMany({});
    await FAQ.deleteMany({});

    console.log('[Seed Script] Seeding Admin User...');
    const adminUid = process.env.ADMIN_FIREBASE_UID || process.env.ADMIN_CLERK_USER_ID || 'user_2admin_demo_id';
    const admin = await User.create({
      firebaseUid: adminUid,
      clerkId: adminUid,
      name: 'Aakash Sharma (COSMOS Lead)',
      email: 'aakash.sharma@jec.ac.in',
      phone: '+91 9876543210',
      role: 'admin',
    });

    console.log('[Seed Script] Seeding Demo Participant User...');
    const demoUser = await User.create({
      firebaseUid: 'user_2participant_demo_id',
      clerkId: 'user_2participant_demo_id',
      name: 'Rohan Verma',
      email: 'rohan.verma@student.jec.ac.in',
      phone: '+91 9123456789',
      role: 'user',
    });

    console.log('[Seed Script] Seeding Speakers...');
    const speakers = await Speaker.create([
      {
        name: 'Dr. Aris Thorne',
        company: 'Neural Dynamics Labs',
        designation: 'Principal AI Scientist',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        bio: 'Pioneer in Transformer architectures and large language model optimization with 15+ patents.',
        linkedin: 'https://linkedin.com',
        website: 'https://arxiv.org',
      },
      {
        name: 'Elena Rostova',
        company: 'Quantum Systems Corp',
        designation: 'Head of Developer Relations',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400',
        bio: 'Specialist in high-throughput cloud microservices and decentralized compute frameworks.',
        linkedin: 'https://linkedin.com',
      },
      {
        name: 'Karan Patel',
        company: 'Cosmic Security Group',
        designation: 'Chief Information Security Officer',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
        bio: 'Ethical hacker and security researcher focused on zero-trust architectures and cloud infrastructure defense.',
        linkedin: 'https://linkedin.com',
      },
    ]);

    console.log('[Seed Script] Seeding Workshops...');
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const workshops = await Workshop.create([
      {
        title: 'Introduction to Generative AI & Agentic Systems',
        slug: 'intro-generative-ai',
        description: 'Explore the cutting edge of LLMs, agentic orchestration, tool-calling APIs, and autonomous AI workflows in this intensive hands-on session.',
        shortDescription: 'Master LLMs, prompt engineering, and autonomous agent orchestration.',
        date: tomorrow,
        startTime: new Date(now.getTime() - 10 * 60 * 1000), // Session currently live for instant testing
        endTime: new Date(now.getTime() + 110 * 60 * 1000),
        durationMinutes: 120,
        speakerId: speakers[0]._id,
        gmeetLink: 'https://meet.google.com/tb2-genai-session',
        registrationOpen: true,
        capacity: 150,
        certificateEligible: true,
        attendanceRequiredPercentage: 75,
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
        status: 'live',
      },
      {
        title: 'Cloud-Native Architecture & Microservices Masterclass',
        slug: 'cloud-native-masterclass',
        description: 'Deep dive into Kubernetes container orchestration, service meshes, distributed tracing, and resilient cloud design patterns for modern scale.',
        shortDescription: 'Learn Docker, Kubernetes, and distributed systems from industry experts.',
        date: nextWeek,
        startTime: new Date(nextWeek.getTime()),
        endTime: new Date(nextWeek.getTime() + 120 * 60 * 1000),
        durationMinutes: 120,
        speakerId: speakers[1]._id,
        gmeetLink: 'https://meet.google.com/tb2-cloud-native',
        registrationOpen: true,
        capacity: 100,
        certificateEligible: true,
        attendanceRequiredPercentage: 75,
        bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        status: 'published',
      },
      {
        title: 'Zero-Trust Cybersecurity & Cloud Offense-Defense',
        slug: 'zero-trust-cybersecurity',
        description: 'Hands-on practical workshop covering identity-centric access control, API security auditing, and modern penetration testing methodologies.',
        shortDescription: 'Master API security, vulnerability assessments, and zero-trust security.',
        date: nextWeek,
        startTime: new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000),
        endTime: new Date(nextWeek.getTime() + (24 + 2) * 60 * 60 * 1000),
        durationMinutes: 120,
        speakerId: speakers[2]._id,
        gmeetLink: 'https://meet.google.com/tb2-cyber-sec',
        registrationOpen: true,
        capacity: 80,
        certificateEligible: true,
        attendanceRequiredPercentage: 80,
        bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',
        status: 'published',
      },
    ]);

    console.log('[Seed Script] Seeding Gallery & FAQs...');
    await Gallery.create([
      {
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800',
        caption: 'TechBlitz Keynote Opening Ceremony at JEC Auditorium',
        category: 'Keynote',
        eventYear: '2025',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800',
        caption: 'Participants collaborating during the Live AI Hackathon',
        category: 'Hackathon',
        eventYear: '2025',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
        caption: 'Interactive Workshop Session on Distributed Cloud Architectures',
        category: 'Workshops',
        eventYear: '2025',
      },
    ]);

    await FAQ.create([
      {
        question: 'What is TechBlitz 2.0?',
        answer: 'TechBlitz 2.0 is the flagship technical event series organized by COSMOS Technical Club at Jabalpur Engineering College, featuring hands-on technical workshops, live expert sessions, and verified certification.',
        order: 1,
        category: 'General',
      },
      {
        question: 'How do I register for a workshop?',
        answer: 'Log in with your Clerk authenticated account, navigate to the Workshops section, select your preferred workshop, and click "Register Now". You will receive an instant email confirmation.',
        order: 2,
        category: 'Registration',
      },
      {
        question: 'How do I earn and download my Certificate of Participation?',
        answer: 'To be eligible for a certificate, you must check in and check out during the live session, meeting the minimum required attendance threshold (default 75%). Once approved by admin after session completion, your certificate will appear in the Certificates tab for instant PDF download.',
        order: 3,
        category: 'Certificates',
      },
      {
        question: 'Where do I access the live Google Meet link?',
        answer: 'Registered participants can access the live session GMeet link directly from their dashboard or "My Workshops" page during the active event window.',
        order: 4,
        category: 'Session Access',
      },
    ]);

    console.log('====================================================');
    console.log('[Seed Script] SUCCESS! Seed completed cleanly.');
    console.log(`Admin User ID: ${admin.clerkId}`);
    console.log(`Demo User ID: ${demoUser.clerkId}`);
    console.log(`Workshops Created: ${workshops.length}`);
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
};

seedData();
