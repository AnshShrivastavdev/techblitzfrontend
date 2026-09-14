/* ====================================================
   STORAGE SERVICE — Mock Backend with Pre-Seeded Data
   ==================================================== */

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'speaker' | 'admin';
  college?: string;
  branch?: string;
  semester?: string;
  rollNumber?: string;
  createdAt: string;
}

export interface Speaker {
  id: string;
  userId: string;
  bio: string;
  title: string;
  company: string;
  avatarUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  availabilityStatus: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  speakerId: string;
  speakerEmail?: string;
  speakerName?: string;
  status: 'live' | 'published' | 'completed' | 'draft';
  meetLink?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  minAttendanceMinutes: number;
  maxCapacity: number;
  track: string;
}

export interface Registration {
  id: string;
  userId: string;
  workshopId: string;
  registeredAt: string;
  status: 'registered' | 'cancelled';
}

export interface AttendanceLog {
  id: string;
  userId: string;
  workshopId: string;
  lastPingAt: string;
  totalMinutesPresent: number;
  isEligibleForCert: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  recipientName?: string;
  workshopId: string;
  workshopTitle?: string;
  issuedAt: string;
  issueDate?: string;
  verificationUrl: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface DatabaseSchema {
  users: User[];
  speakers: Speaker[];
  workshops: Workshop[];
  registrations: Registration[];
  attendanceLogs: AttendanceLog[];
  certificates: Certificate[];
  gallery: GalleryItem[];
  faqs: Faq[];
}

const STORAGE_KEY = 'techblitz_db';
const ADMIN_WHITELIST = ['admin@techblitz.com', 'organizer@techblitz.com'];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// ------- Seed Data -------
const SEED_DATA: DatabaseSchema = {
  users: [
    {
      id: 'admin-001',
      name: 'Mission Control',
      email: 'admin@techblitz.com',
      password: 'admin123',
      role: 'admin',
      college: '',
      branch: '',
      semester: '',
      rollNumber: '',
      createdAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'speaker-001',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@techblitz.com',
      password: 'speaker123',
      role: 'speaker',
      college: '',
      branch: '',
      semester: '',
      rollNumber: '',
      createdAt: '2026-08-05T10:00:00Z',
    },
    {
      id: 'speaker-002',
      name: 'Alex Rivera',
      email: 'alex.rivera@techblitz.com',
      password: 'speaker123',
      role: 'speaker',
      college: '',
      branch: '',
      semester: '',
      rollNumber: '',
      createdAt: '2026-08-06T10:00:00Z',
    },
    {
      id: 'student-001',
      name: 'Arjun Patel',
      email: 'arjun@university.edu',
      password: 'student123',
      role: 'student',
      college: 'National Institute of Technology',
      branch: 'Computer Science',
      semester: '6th',
      rollNumber: 'CS2023042',
      createdAt: '2026-08-10T10:00:00Z',
    },
    {
      id: 'student-002',
      name: 'Priya Sharma',
      email: 'priya@college.edu',
      password: 'student123',
      role: 'student',
      college: 'Indian Institute of Technology',
      branch: 'Information Technology',
      semester: '4th',
      rollNumber: 'IT2024018',
      createdAt: '2026-08-11T10:00:00Z',
    },
    {
      id: 'student-003',
      name: 'Rohan Mehra',
      email: 'rohan@institute.edu',
      password: 'student123',
      role: 'student',
      college: 'Birla Institute of Technology',
      branch: 'Electronics',
      semester: '5th',
      rollNumber: 'EC2023097',
      createdAt: '2026-08-12T10:00:00Z',
    },
    {
      id: 'student-004',
      name: 'Neha Gupta',
      email: 'neha@techcollege.edu',
      password: 'student123',
      role: 'student',
      college: 'VIT University',
      branch: 'Computer Science',
      semester: '3rd',
      rollNumber: 'CS2025033',
      createdAt: '2026-08-13T10:00:00Z',
    },
    {
      id: 'student-005',
      name: 'Karan Singh',
      email: 'karan@engineering.edu',
      password: 'student123',
      role: 'student',
      college: 'Delhi Technological University',
      branch: 'Mechanical',
      semester: '7th',
      rollNumber: 'ME2022056',
      createdAt: '2026-08-14T10:00:00Z',
    },
  ],

  speakers: [
    {
      id: 'sp-001',
      userId: 'speaker-001',
      bio: 'AI/ML Research Scientist with 10+ years of experience in deep learning and neural architecture search. Published 30+ papers in top-tier conferences.',
      title: 'Senior Research Scientist',
      company: 'DeepMind Research Lab',
      avatarUrl: '',
      portfolioUrl: 'https://sarahchen.ai',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      githubUrl: 'https://github.com/sarahchen',
      availabilityStatus: 'available',
    },
    {
      id: 'sp-002',
      userId: 'speaker-002',
      bio: 'Cloud Architecture specialist and distributed systems engineer. Built scalable infrastructure serving 100M+ users. AWS Solutions Architect Professional.',
      title: 'Principal Cloud Architect',
      company: 'Stellar Cloud Systems',
      avatarUrl: '',
      portfolioUrl: 'https://alexrivera.dev',
      linkedinUrl: 'https://linkedin.com/in/alexrivera',
      githubUrl: 'https://github.com/alexrivera',
      availabilityStatus: 'available',
    },
  ],

  workshops: [
    {
      id: 'ws-001',
      title: 'Deep Learning Frontiers: Transformers & Beyond',
      description: 'Explore cutting-edge transformer architectures, attention mechanisms, and their applications in vision and language models.',
      speakerId: 'speaker-001',
      speakerEmail: 'sarah.chen@techblitz.com',
      speakerName: 'Dr. Sarah Chen',
      status: 'live',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      scheduledStartTime: '2026-09-13T10:00:00Z',
      scheduledEndTime: '2026-09-13T12:00:00Z',
      minAttendanceMinutes: 15,
      maxCapacity: 200,
      track: 'AI/ML',
    },
    {
      id: 'ws-002',
      title: 'Cloud-Native Microservices at Scale',
      description: 'Learn to design, deploy, and orchestrate microservices using Kubernetes, service mesh, and observability patterns.',
      speakerId: 'speaker-002',
      speakerEmail: 'alex.rivera@techblitz.com',
      speakerName: 'Alex Rivera',
      status: 'published',
      meetLink: '',
      scheduledStartTime: '2026-09-15T14:00:00Z',
      scheduledEndTime: '2026-09-15T16:00:00Z',
      minAttendanceMinutes: 20,
      maxCapacity: 150,
      track: 'Cloud',
    },
    {
      id: 'ws-003',
      title: 'Decentralized Systems & Web3 Fundamentals',
      description: 'A hands-on introduction to blockchain, smart contracts, and decentralized application development.',
      speakerId: 'speaker-001',
      speakerEmail: 'sarah.chen@techblitz.com',
      speakerName: 'Dr. Sarah Chen',
      status: 'published',
      meetLink: '',
      scheduledStartTime: '2026-09-18T09:00:00Z',
      scheduledEndTime: '2026-09-18T11:30:00Z',
      minAttendanceMinutes: 20,
      maxCapacity: 120,
      track: 'Web3',
    },
    {
      id: 'ws-004',
      title: 'Offensive Security & Penetration Testing',
      description: 'Completed workshop covering ethical hacking, vulnerability assessment, and penetration testing methodologies.',
      speakerId: 'speaker-002',
      speakerEmail: 'alex.rivera@techblitz.com',
      speakerName: 'Alex Rivera',
      status: 'completed',
      meetLink: 'https://meet.google.com/xyz-uvwx-yz',
      scheduledStartTime: '2026-09-01T10:00:00Z',
      scheduledEndTime: '2026-09-01T12:00:00Z',
      minAttendanceMinutes: 15,
      maxCapacity: 100,
      track: 'Cybersecurity',
    },
  ],

  registrations: [
    { id: 'reg-001', userId: 'student-001', workshopId: 'ws-001', registeredAt: '2026-09-10T10:00:00Z', status: 'registered' },
    { id: 'reg-002', userId: 'student-002', workshopId: 'ws-001', registeredAt: '2026-09-10T11:00:00Z', status: 'registered' },
    { id: 'reg-003', userId: 'student-003', workshopId: 'ws-001', registeredAt: '2026-09-11T09:00:00Z', status: 'registered' },
    { id: 'reg-004', userId: 'student-001', workshopId: 'ws-002', registeredAt: '2026-09-11T10:00:00Z', status: 'registered' },
    { id: 'reg-005', userId: 'student-004', workshopId: 'ws-002', registeredAt: '2026-09-11T12:00:00Z', status: 'registered' },
    { id: 'reg-006', userId: 'student-001', workshopId: 'ws-004', registeredAt: '2026-08-28T10:00:00Z', status: 'registered' },
    { id: 'reg-007', userId: 'student-002', workshopId: 'ws-004', registeredAt: '2026-08-28T11:00:00Z', status: 'registered' },
    { id: 'reg-008', userId: 'student-005', workshopId: 'ws-004', registeredAt: '2026-08-29T10:00:00Z', status: 'registered' },
  ],

  attendanceLogs: [
    { id: 'att-001', userId: 'student-001', workshopId: 'ws-004', lastPingAt: '2026-09-01T12:00:00Z', totalMinutesPresent: 95, isEligibleForCert: true },
    { id: 'att-002', userId: 'student-002', workshopId: 'ws-004', lastPingAt: '2026-09-01T11:45:00Z', totalMinutesPresent: 80, isEligibleForCert: true },
    { id: 'att-003', userId: 'student-005', workshopId: 'ws-004', lastPingAt: '2026-09-01T10:20:00Z', totalMinutesPresent: 10, isEligibleForCert: false },
    { id: 'att-004', userId: 'student-001', workshopId: 'ws-001', lastPingAt: '2026-09-13T10:45:00Z', totalMinutesPresent: 30, isEligibleForCert: true },
    { id: 'att-005', userId: 'student-002', workshopId: 'ws-001', lastPingAt: '2026-09-13T10:30:00Z', totalMinutesPresent: 18, isEligibleForCert: true },
  ],

  certificates: [
    {
      id: 'cert-001',
      certificateNumber: 'CERT-2026-001',
      userId: 'student-001',
      recipientName: 'Arjun Patel',
      workshopId: 'ws-004',
      workshopTitle: 'Offensive Security & Penetration Testing',
      issuedAt: '2026-09-02T10:00:00Z',
      issueDate: '2026-09-02T10:00:00Z',
      verificationUrl: '/verify/CERT-2026-001',
    },
    {
      id: 'cert-002',
      certificateNumber: 'CERT-2026-002',
      userId: 'student-002',
      recipientName: 'Priya Sharma',
      workshopId: 'ws-004',
      workshopTitle: 'Offensive Security & Penetration Testing',
      issuedAt: '2026-09-02T10:00:00Z',
      issueDate: '2026-09-02T10:00:00Z',
      verificationUrl: '/verify/CERT-2026-002',
    },
  ],

  gallery: [
    { id: 'gal-001', title: 'AI Workshop Keynote', category: 'Workshops', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
    { id: 'gal-002', title: 'Hackathon Winners', category: 'Hackathons', imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600' },
    { id: 'gal-003', title: 'Cloud Architecture Talk', category: 'Workshops', imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600' },
  ],

  faqs: [
    { id: 'faq-001', question: 'How do I register for workshops?', answer: 'Log in to your student dashboard and click "Register" on any available workshop. You can register with a single click.', category: 'Registration', published: true, order: 1 },
    { id: 'faq-002', question: 'How are certificates issued?', answer: 'Certificates are automatically generated once a workshop is completed and you have met the minimum attendance duration requirement (typically 75% of the session).', category: 'Certificates', published: true, order: 2 },
    { id: 'faq-003', question: 'What do I need to join a live workshop?', answer: 'You need a stable internet connection and a Google account to join via Google Meet. The join link will appear on your dashboard when the session goes live.', category: 'Technical', published: true, order: 3 },
    { id: 'faq-004', question: 'Can I verify my certificate?', answer: 'Yes! Every certificate includes a unique QR code and verification ID. Visit the verification portal or scan the QR code to confirm authenticity.', category: 'Certificates', published: true, order: 4 },
  ],
};

// ------- Core Storage Functions -------
function getDB(): DatabaseSchema {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(SEED_DATA));
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return JSON.parse(JSON.stringify(SEED_DATA));
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return JSON.parse(JSON.stringify(SEED_DATA));
  }
}

function saveDB(db: DatabaseSchema): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// ------- Auth -------
export function isAdminEmail(email: string): boolean {
  return ADMIN_WHITELIST.includes(email.toLowerCase().trim());
}

export function loginUser(email: string, password?: string): { success: boolean; user?: User; error?: string } {
  const db = getDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && (password ? u.password === password : true)
  );
  if (!user) return { success: false, error: 'Invalid email or password' };

  let role = user.role;
  if (isAdminEmail(email) && role !== 'speaker') {
    role = 'admin';
  }

  return { success: true, user: { ...user, role } };
}

export function loginSpeaker(email: string, password?: string): { success: boolean; user?: User; error?: string } {
  const db = getDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && (password ? u.password === password : true) && u.role === 'speaker'
  );
  if (!user) return { success: false, error: 'Invalid speaker credentials' };
  return { success: true, user };
}

export function registerStudent(userData: Partial<User>): { success: boolean; user?: User; error?: string } {
  const db = getDB();
  if (!userData.email) return { success: false, error: 'Email required' };
  const exists = db.users.find((u) => u.email.toLowerCase() === userData.email!.toLowerCase().trim());
  if (exists) return { success: false, error: 'Email already registered' };

  const newUser: User = {
    id: 'student-' + generateId(),
    name: userData.name || 'Cosmic Student',
    email: userData.email.trim(),
    password: userData.password || 'student123',
    role: 'student',
    college: userData.college || '',
    branch: userData.branch || '',
    semester: userData.semester || '',
    rollNumber: userData.rollNumber || '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDB(db);
  return { success: true, user: newUser };
}

// ------- Users -------
export function getAllUsers(): User[] {
  return getDB().users;
}

export function getUserById(id: string): User | undefined {
  return getDB().users.find((u) => u.id === id);
}

export function updateUserProfile(userId: string, updates: Partial<User>): User | false {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  db.users[idx] = { ...db.users[idx], ...updates };
  saveDB(db);
  return db.users[idx];
}

// ------- Workshops -------
export function getAllWorkshops(): Workshop[] {
  return getDB().workshops;
}

export function getWorkshopById(id: string): Workshop | undefined {
  return getDB().workshops.find((w) => w.id === id);
}

export function createWorkshop(data: Omit<Workshop, 'id'>): Workshop {
  const db = getDB();
  const ws: Workshop = { id: 'ws-' + generateId(), ...data };
  db.workshops.push(ws);
  saveDB(db);
  return ws;
}

export function updateWorkshop(id: string, updates: Partial<Workshop>): Workshop | false {
  const db = getDB();
  const idx = db.workshops.findIndex((w) => w.id === id);
  if (idx === -1) return false;
  db.workshops[idx] = { ...db.workshops[idx], ...updates };
  saveDB(db);
  return db.workshops[idx];
}

export function deleteWorkshop(id: string): void {
  const db = getDB();
  db.workshops = db.workshops.filter((w) => w.id !== id);
  saveDB(db);
}

// ------- Registrations -------
export function getRegistrations(): Registration[] {
  return getDB().registrations;
}

export function getUserRegistrations(userId: string): Registration[] {
  return getDB().registrations.filter((r) => r.userId === userId && r.status === 'registered');
}

export function getWorkshopRegistrations(workshopId: string): Registration[] {
  return getDB().registrations.filter((r) => r.workshopId === workshopId && r.status === 'registered');
}

export function registerForWorkshop(userId: string, workshopId: string): { success: boolean; registration?: Registration; error?: string } {
  const db = getDB();
  const existing = db.registrations.find(
    (r) => r.userId === userId && r.workshopId === workshopId && r.status === 'registered'
  );
  if (existing) return { success: false, error: 'Already registered' };

  const reg: Registration = {
    id: 'reg-' + generateId(),
    userId,
    workshopId,
    registeredAt: new Date().toISOString(),
    status: 'registered',
  };
  db.registrations.push(reg);
  saveDB(db);
  return { success: true, registration: reg };
}

export function unregisterFromWorkshop(userId: string, workshopId: string): boolean {
  const db = getDB();
  const idx = db.registrations.findIndex(
    (r) => r.userId === userId && r.workshopId === workshopId && r.status === 'registered'
  );
  if (idx === -1) return false;
  db.registrations[idx].status = 'cancelled';
  saveDB(db);
  return true;
}

// ------- Attendance -------
export function getAttendanceLogs(): AttendanceLog[] {
  return getDB().attendanceLogs;
}

export function getAttendanceForUser(userId: string): AttendanceLog[] {
  return getDB().attendanceLogs.filter((a) => a.userId === userId);
}

export function getAttendanceForWorkshop(workshopId: string): AttendanceLog[] {
  return getDB().attendanceLogs.filter((a) => a.workshopId === workshopId);
}

export function pingAttendance(userId: string, workshopId: string): AttendanceLog {
  const db = getDB();
  let log = db.attendanceLogs.find((a) => a.userId === userId && a.workshopId === workshopId);
  const ws = db.workshops.find((w) => w.id === workshopId);

  if (!log) {
    log = {
      id: 'att-' + generateId(),
      userId,
      workshopId,
      lastPingAt: new Date().toISOString(),
      totalMinutesPresent: 1,
      isEligibleForCert: false,
    };
    db.attendanceLogs.push(log);
  } else {
    log.totalMinutesPresent += 1;
    log.lastPingAt = new Date().toISOString();
    log.isEligibleForCert = ws ? log.totalMinutesPresent >= ws.minAttendanceMinutes : false;
  }

  saveDB(db);
  return log;
}

// ------- Certificates -------
export function getCertificates(): Certificate[] {
  return getDB().certificates;
}

export function getUserCertificates(userId: string): Certificate[] {
  return getDB().certificates.filter((c) => c.userId === userId);
}

export function getCertificateByNumber(certNumber: string): Certificate | undefined {
  return getDB().certificates.find((c) => c.certificateNumber === certNumber);
}

export function generateCertificates(workshopId: string): Certificate[] {
  const db = getDB();
  const eligibleLogs = db.attendanceLogs.filter(
    (a) => a.workshopId === workshopId && a.isEligibleForCert
  );

  const generated: Certificate[] = [];
  for (const log of eligibleLogs) {
    const exists = db.certificates.find(
      (c) => c.userId === log.userId && c.workshopId === workshopId
    );
    if (exists) continue;

    const certNum = `CERT-${new Date().getFullYear()}-${String(db.certificates.length + 1).padStart(3, '0')}`;
    const cert: Certificate = {
      id: 'cert-' + generateId(),
      certificateNumber: certNum,
      userId: log.userId,
      workshopId,
      issuedAt: new Date().toISOString(),
      verificationUrl: `/verify/${certNum}`,
    };
    db.certificates.push(cert);
    generated.push(cert);
  }

  saveDB(db);
  return generated;
}

export function issueCertificate(userId: string, recipientName: string, workshopId: string, workshopTitle: string): Certificate {
  const db = getDB();
  const exists = db.certificates.find(
    (c) => c.userId === userId && c.workshopId === workshopId
  );
  if (exists) return exists;

  const certNum = `CERT-${new Date().getFullYear()}-${String(db.certificates.length + 1).padStart(3, '0')}`;
  const cert: Certificate = {
    id: 'cert-' + generateId(),
    certificateNumber: certNum,
    userId,
    recipientName: recipientName || 'Cosmos Student',
    workshopId,
    workshopTitle: workshopTitle || 'Space Science Workshop',
    issuedAt: new Date().toISOString(),
    issueDate: new Date().toISOString(),
    verificationUrl: `/verify/${certNum}`,
  };
  db.certificates.push(cert);
  saveDB(db);
  return cert;
}

// ------- Speakers -------
export function getSpeakers(): Speaker[] {
  return getDB().speakers;
}

export function getSpeakerByUserId(userId: string): Speaker | undefined {
  return getDB().speakers.find((s) => s.userId === userId);
}

export function updateSpeakerProfile(speakerId: string, updates: Partial<Speaker>): Speaker | false {
  const db = getDB();
  const idx = db.speakers.findIndex((s) => s.id === speakerId);
  if (idx === -1) return false;
  db.speakers[idx] = { ...db.speakers[idx], ...updates };
  saveDB(db);
  return db.speakers[idx];
}

// ------- Gallery -------
export function getGallery(): GalleryItem[] {
  return getDB().gallery;
}

export function addGalleryItem(data: Omit<GalleryItem, 'id'>): GalleryItem {
  const db = getDB();
  const item: GalleryItem = { id: 'gal-' + generateId(), ...data };
  db.gallery.push(item);
  saveDB(db);
  return item;
}

export function deleteGalleryItem(id: string): void {
  const db = getDB();
  db.gallery = db.gallery.filter((g) => g.id !== id);
  saveDB(db);
}

// ------- FAQs -------
export function getFaqs(): Faq[] {
  return getDB().faqs.sort((a, b) => a.order - b.order);
}

export const getFAQs = getFaqs;

export function addFaq(data: Omit<Faq, 'id' | 'order' | 'published'>): Faq {
  const db = getDB();
  const faq: Faq = { id: 'faq-' + generateId(), order: db.faqs.length + 1, published: true, ...data };
  db.faqs.push(faq);
  saveDB(db);
  return faq;
}

export function updateFaq(id: string, updates: Partial<Faq>): Faq | false {
  const db = getDB();
  const idx = db.faqs.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  db.faqs[idx] = { ...db.faqs[idx], ...updates };
  saveDB(db);
  return db.faqs[idx];
}

export function deleteFaq(id: string): void {
  const db = getDB();
  db.faqs = db.faqs.filter((f) => f.id !== id);
  saveDB(db);
}

// ------- CSV Export Utility -------
export function exportToCSV(data: Record<string, any>[], filename: string): void {
  if (!data.length || typeof window === 'undefined') return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportUsersCSV(): void {
  const users = getDB().users.map((u) => ({
    ID: u.id,
    Name: u.name,
    Email: u.email,
    Role: u.role,
    College: u.college || '',
    Branch: u.branch || '',
    Semester: u.semester || '',
    RollNumber: u.rollNumber || '',
    Joined: u.createdAt,
  }));
  exportToCSV(users, `TechBlitz_Users_${Date.now()}.csv`);
}

export function exportAttendanceCSV(): void {
  const db = getDB();
  const logs = db.attendanceLogs.map((a) => {
    const user = db.users.find((u) => u.id === a.userId);
    const ws = db.workshops.find((w) => w.id === a.workshopId);
    return {
      ParticipantName: user?.name || a.userId,
      ParticipantEmail: user?.email || '',
      WorkshopTitle: ws?.title || a.workshopId,
      TotalMinutesPresent: a.totalMinutesPresent,
      CertificateEligible: a.isEligibleForCert ? 'Yes' : 'No',
      LastHeartbeat: a.lastPingAt,
    };
  });
  exportToCSV(logs, `TechBlitz_Attendance_${Date.now()}.csv`);
}

// ------- Reset DB -------
export function resetDB(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
}
