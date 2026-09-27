/* ====================================================
   STORAGE SERVICE — Mock Backend with Pre-Seeded Data
   ==================================================== */

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  college?: string;
  branch?: string;
  semester?: string;
  rollNumber?: string;
  phone?: string;
  institution?: string;
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
export const ADMIN_EMAIL = 'cosmos.jec@jecjabalpur.ac.in';
export const ADMIN_WHITELIST = ['cosmos.jec@jecjabalpur.ac.in'];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// ------- Seed Data -------
const SEED_DATA: DatabaseSchema = {
  users: [
    {
      id: 'admin-001',
      name: 'COSMOS Mission Control (JEC)',
      email: 'cosmos.jec@jecjabalpur.ac.in',
      password: 'admin123',
      role: 'admin',
      college: 'Jabalpur Engineering College',
      branch: 'CSE',
      semester: 'Admin',
      rollNumber: 'ADMIN-01',
      createdAt: '2026-08-01T10:00:00Z',
    },
  ],
  speakers: [],
  workshops: [],
  registrations: [],
  attendanceLogs: [],
  certificates: [],

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

// Known dummy ID filters to purge from existing local storage
const DUMMY_USER_IDS = new Set(['student-001', 'student-002', 'student-003', 'student-004', 'student-005']);
const DUMMY_CERT_IDS = new Set(['cert-001', 'cert-002']);
const DUMMY_WS_IDS = new Set(['ws-001', 'ws-002', 'ws-003', 'ws-004']);

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
    const parsed: DatabaseSchema = JSON.parse(raw);
    let mutated = false;

    // Purge legacy dummy users if present
    if (parsed.users && parsed.users.some(u => DUMMY_USER_IDS.has(u.id))) {
      parsed.users = parsed.users.filter(u => !DUMMY_USER_IDS.has(u.id));
      mutated = true;
    }
    // Purge legacy dummy certificates if present
    if (parsed.certificates && parsed.certificates.some(c => DUMMY_CERT_IDS.has(c.id))) {
      parsed.certificates = parsed.certificates.filter(c => !DUMMY_CERT_IDS.has(c.id));
      mutated = true;
    }
    // Purge legacy dummy workshops if present
    if (parsed.workshops && parsed.workshops.some(w => DUMMY_WS_IDS.has(w.id))) {
      parsed.workshops = parsed.workshops.filter(w => !DUMMY_WS_IDS.has(w.id));
      mutated = true;
    }

    if (mutated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
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
  if (isAdminEmail(email)) {
    role = 'admin';
  }

  return { success: true, user: { ...user, role } };
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
    role: isAdminEmail(userData.email) ? 'admin' : 'student',
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

export function upsertUser(user: User): User {
  const db = getDB();
  const idx = db.users.findIndex(
    (u) => (user.id && u.id === user.id) || (user.email && u.email.toLowerCase() === user.email.toLowerCase().trim())
  );
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...user };
  } else {
    db.users.push(user);
  }
  saveDB(db);
  return user;
}

export function deleteUserById(userId: string, email?: string): boolean {
  const db = getDB();
  const initialLen = db.users.length;
  db.users = db.users.filter(
    (u) => u.id !== userId && (!email || u.email.toLowerCase() !== email.toLowerCase().trim())
  );
  db.registrations = db.registrations.filter((r) => r.userId !== userId);
  db.attendanceLogs = db.attendanceLogs.filter((a) => a.userId !== userId);
  saveDB(db);
  return db.users.length < initialLen;
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

export function exportUsersCSV(): boolean {
  const users = getDB().users;
  if (!users || users.length === 0) {
    if (typeof window !== 'undefined') {
      alert('No user records available to export.');
    }
    return false;
  }
  const formattedUsers = users.map((u, idx) => ({
    'S.No': idx + 1,
    'User ID': u.id,
    'Participant Name': u.name,
    'Email Address': u.email,
    'Role': u.role.toUpperCase(),
    'College / Institution': u.college || 'N/A',
    'Branch / Department': u.branch || 'N/A',
    'Semester': u.semester || 'N/A',
    'Roll Number': u.rollNumber || 'N/A',
    'Registration Date': u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : 'N/A',
  }));
  exportToCSV(formattedUsers, `TechBlitz_Students_${new Date().toISOString().slice(0, 10)}.csv`);
  return true;
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
