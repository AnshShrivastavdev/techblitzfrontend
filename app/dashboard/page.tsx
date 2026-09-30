'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import ParticleText from '@/components/ParticleText';
import {
  Workshop,
  Registration,
  AttendanceLog,
  Certificate,
  getAllWorkshops,
  getUserRegistrations,
  registerForWorkshop,
  unregisterFromWorkshop,
  getAttendanceForUser,
  pingAttendance,
  getUserCertificates,
  updateUserProfile,
  isAdminEmail,
  fetchWorkshopsFromAPI,
  markAttendance,
} from '@/services/storageService';
import { syncStudentToCloud } from '@/services/realtimeUserService';
import {
  Calendar,
  Clock,
  Video,
  Award,
  BookOpen,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  ShieldCheck,
  Radio,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function DashboardStudent() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const isUserAdmin = Boolean(user && (user.role === 'admin' || isAdminEmail(user.email)));

  const [activeTab, setActiveTab] = useState<'workshops' | 'my-workshops' | 'certificates' | 'profile'>('workshops');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendance, setAttendance] = useState<AttendanceLog[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string }>({ type: '', msg: '' });

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    rollNumber: user?.rollNumber || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        semester: user.semester || '',
        rollNumber: user.rollNumber || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Load data
  const loadData = async () => {
    const ws = await fetchWorkshopsFromAPI();
    setWorkshops(ws);
    if (user) {
      setRegistrations(getUserRegistrations(user.id));
      setAttendance(getAttendanceForUser(user.id));
      setCertificates(getUserCertificates(user.id));
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Live workshop attendance simulation interval
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const liveWs = workshops.find(
        (w) => w.status === 'live' && registrations.some((r) => r.workshopId === w.id)
      );
      if (liveWs) {
        pingAttendance(user.id, liveWs.id);
        setAttendance(getAttendanceForUser(user.id));
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [user, workshops, registrations]);

  const handleRegister = (workshopId: string) => {
    if (!user) return;
    const res = registerForWorkshop(user.id, workshopId);
    if (res.success) {
      setFeedback({ type: 'success', msg: 'Successfully registered for workshop!' });
      loadData();
    } else {
      setFeedback({ type: 'error', msg: res.error || 'Could not register' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handleUnregister = (workshopId: string) => {
    if (!user) return;
    unregisterFromWorkshop(user.id, workshopId);
    setFeedback({ type: 'success', msg: 'Registration cancelled.' });
    loadData();
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handleManualPing = (workshopId: string) => {
    if (!user) return;
    pingAttendance(user.id, workshopId);
    setAttendance(getAttendanceForUser(user.id));
    setFeedback({ type: 'success', msg: '📡 Telemetry signal confirmed! Attendance updated.' });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
  };

  const handleMarkAttendance = (workshopId: string) => {
    if (!user) return;
    markAttendance(user.id, workshopId);
    setAttendance(getAttendanceForUser(user.id));
    setFeedback({ type: 'success', msg: '✓ Attendance marked successfully! You can now join the Google Meet.' });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = updateUserProfile(user.id, profileForm);
    if (updated) {
      await syncStudentToCloud(updated);
      if (refreshUser) refreshUser();
      setFeedback({ type: 'success', msg: 'Profile updated & synchronized across cloud!' });
    } else {
      setFeedback({ type: 'error', msg: 'Failed to update profile.' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
  };

  const downloadCertificate = async (cert: Certificate) => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Dark Space Certificate Styling
    doc.setFillColor(2, 3, 6);
    doc.rect(0, 0, 297, 210, 'F');

    // Outer border
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);

    // Inner border
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.rect(14, 14, 269, 182);

    // Header
    doc.setTextColor(56, 189, 248);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('TECH BLITZ BY COSMOS', 148.5, 38, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SPACE SCIENCE & EVENT MANAGEMENT NETWORK // JEC', 148.5, 45, { align: 'center' });

    // Certificate Title
    doc.setTextColor(248, 250, 252);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 68, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(12);
    doc.text('This is proudly presented to', 148.5, 82, { align: 'center' });

    // Recipient Name
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(24);
    doc.text(cert.recipientName || user?.name || 'Arjun Patel', 148.5, 98, { align: 'center' });

    // Body
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `for successfully participating in and completing the technical session`,
      148.5,
      112,
      { align: 'center' }
    );

    // Workshop Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`"${cert.workshopTitle || 'Deep Learning Frontiers'}"`, 148.5, 124, { align: 'center' });

    // Issue Date & ID
    const dateStr = cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : new Date().toLocaleDateString();
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(`Issue Date: ${dateStr}`, 40, 160);
    doc.text(`Certificate ID: ${cert.certificateNumber || cert.id}`, 40, 168);
    doc.text(`Verification: Verified Authenticity`, 200, 160);
    doc.text(`Authorized Signatory: Cosmos Command`, 200, 168);

    doc.save(`TechBlitz_Certificate_${cert.certificateNumber || cert.id}.pdf`);
  };

  const registeredWorkshopIds = new Set(registrations.map((r) => r.workshopId));
  const liveWorkshop = workshops.find(
    (w) => w.status === 'live' && registeredWorkshopIds.has(w.id)
  );

  const displayName = user?.name || 'Arjun Patel';
  const displayBranch = user?.branch || 'Cosmic Explorer';

  return (
    <KineticGrid globalColor="default">
      {/* Top Navigation */}
      <header className="dash-header">
        <div className="dash-header__brand">
          <img src="/techblitz-logo.png" alt="Tech Blitz" className="dash-header__logo" />
          <div>
            <h2 className="dash-header__title">
              TECH <span style={{ color: '#38bdf8' }}>BLITZ</span>
            </h2>
            <span className="dash-header__subtitle">Participant Portal</span>
          </div>
        </div>

        <div className="dash-header__user">
          <button
            onClick={() => router.push('/')}
            className="dash-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}
            title="Return to Main Landing Page"
          >
            ← Launchpad
          </button>
          {isUserAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="dash-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', borderColor: 'rgba(56,189,248,0.5)', color: '#38bdf8' }}
              title="Go to Mission Control Admin Dashboard"
            >
              ⚙️ Admin Panel
            </button>
          )}
          <div className="dash-user-info">
            <span className="dash-user-name">{displayName}</span>
            <span className="dash-user-role">
              {isUserAdmin
                ? '🛡️ Cosmos Admin'
                : `🎓 Student • ${displayBranch}`}
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="dash-btn-logout"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="dash-main">
        {/* Global Feedback notification */}
        {feedback.msg && (
          <div className={`dash-toast dash-toast--${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.msg}
          </div>
        )}

        {/* Quick Stats Grid */}
        <section className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <BookOpen size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{registrations.length}</div>
              <div className="dash-stat-label">Enrolled Workshops</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Clock size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">
                {attendance.reduce((sum, a) => sum + (a.totalMinutesPresent || 0), 0)} min
              </div>
              <div className="dash-stat-label">Telemetry Logged</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Award size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{certificates.length}</div>
              <div className="dash-stat-label">Certificates Earned</div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="dash-tabs">
          <button
            className={`dash-tab ${activeTab === 'workshops' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('workshops')}
          >
            <Calendar size={16} /> Workshops Catalog
          </button>
          <button
            className={`dash-tab ${activeTab === 'my-workshops' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('my-workshops')}
          >
            <BookOpen size={16} /> My Workshops
            {workshops.filter((w) => registrations.some((r) => r.workshopId === w.id)).length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                {workshops.filter((w) => registrations.some((r) => r.workshopId === w.id)).length}
              </span>
            )}
          </button>
          <button
            className={`dash-tab ${activeTab === 'certificates' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <Award size={16} /> My Certificates ({certificates.length})
          </button>
          <button
            className={`dash-tab ${activeTab === 'profile' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon size={16} /> Academic Profile
          </button>
        </div>

        {/* TAB 1: WORKSHOPS CATALOG */}
        {activeTab === 'workshops' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Available Space Science & Tech Workshops</h3>
              <span
                className="dash-counter-pill"
                style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.06)' }}
              >
                {workshops.length} Active Tracks
              </span>
            </div>

            {/* Real-Time Interactive Workshop Cards */}
            {workshops.length === 0 ? (
              <div className="dash-empty-state">
                <BookOpen size={48} color="#38bdf8" />
                <h4>No Workshops Currently Available</h4>
                <p>Check back soon for newly published sessions from mission control.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                {workshops.map((ws) => {
                  const isRegistered = registeredWorkshopIds.has(ws.id);
                  const isLive = ws.status === 'live';

                  return (
                    <div
                      key={ws.id}
                      className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 flex flex-col justify-between hover:border-cyan-400/40 transition-all backdrop-blur-md relative shadow-xl"
                    >
                      <div>
                        {/* Status Tag & Track */}
                        <div className="flex items-center justify-between text-xs font-mono mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                              isLive
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                                : 'bg-white/5 text-neutral-300 border border-white/10'
                            }`}
                          >
                            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                            {ws.status ? ws.status.toUpperCase() : 'PUBLISHED'}
                          </span>
                          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-400 text-[10px]">
                            {ws.track || 'Cosmos Track'}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-xl font-bold font-sans text-white mb-2 leading-snug">{ws.title}</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-4">{ws.description}</p>

                        {/* Speaker & Date Info */}
                        <div className="space-y-2 p-3 rounded-xl bg-neutral-900/60 border border-white/5 mb-5 font-mono text-xs text-neutral-300">
                          <div className="flex items-center gap-2">
                            <UserIcon size={14} className="text-cyan-400 shrink-0" />
                            <span><strong className="text-white">Speaker:</strong> {ws.speakerName || 'Keynote Faculty'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-cyan-400 shrink-0" />
                            <span>
                              <strong className="text-white">Start Date:</strong>{' '}
                              {ws.scheduledStartTime ? new Date(ws.scheduledStartTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'TBA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-cyan-400 shrink-0" />
                            <span>
                              <strong className="text-white">End Date:</strong>{' '}
                              {ws.scheduledEndTime ? new Date(ws.scheduledEndTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'TBA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-cyan-400 shrink-0" />
                            <span><strong className="text-white">Min Attendance:</strong> {ws.minAttendanceMinutes || 45} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button: 1-Click Register / Enrolled */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                        {isRegistered ? (
                          <div className="flex items-center gap-2 w-full">
                            <span className="px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 flex-1 justify-center">
                              <CheckCircle2 size={14} className="text-emerald-400" />
                              REGISTERED
                            </span>
                            <button
                              onClick={() => setActiveTab('my-workshops')}
                              className="px-3 py-2 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Video size={14} /> MY WORKSHOPS
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRegister(ws.id)}
                            className="w-full py-3 bg-white text-black font-mono font-bold text-xs rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                          >
                            <span>REGISTER WITH 1-CLICK</span>
                            <Sparkles size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY WORKSHOPS */}
        {activeTab === 'my-workshops' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header flex items-center justify-between">
              <div>
                <h3>My Registered Workshops</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Access Google Meet links and stream details for your registered sessions
                </p>
              </div>
              <span className="dash-counter-pill font-mono font-bold">
                {workshops.filter((w) => registrations.some((r) => r.workshopId === w.id)).length} Registered
              </span>
            </div>

            {workshops.filter((w) => registrations.some((r) => r.workshopId === w.id)).length === 0 ? (
              <div className="dash-empty-state">
                <BookOpen size={48} color="#38bdf8" />
                <h4>No Registered Workshops Found</h4>
                <p>
                  You haven't registered for any workshops yet. Browse the catalog and register to get instant access to Google Meet links!
                </p>
                <button onClick={() => setActiveTab('workshops')} className="dash-btn-primary">
                  Browse Workshops
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {workshops
                  .filter((w) => registrations.some((r) => r.workshopId === w.id))
                  .map((ws) => {
                    const isCurrentlyLive = ws.status === 'live';
                    const isMarked = attendance.some((a) => a.workshopId === ws.id);
                    return (
                      <div
                        key={ws.id}
                        className={`dash-live-box relative overflow-hidden transition-all duration-300 border-cyan-500/30 bg-neutral-900/80 p-6 rounded-2xl border`}
                      >
                        <div className="dash-live-box__header flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {isCurrentlyLive ? (
                                <div className="dash-live-box__tag">
                                  <span className="dash-pulse-dot" /> LIVE NOW
                                </div>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                  <Clock size={12} /> Registered & Confirmed
                                </span>
                              )}
                              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[11px]">
                                {ws.track}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-wide">{ws.title}</h2>
                            <p style={{ color: '#94a3b8' }} className="text-xs mt-1">
                              Speaker: <span className="text-white font-medium">{ws.speakerName || 'TechBlitz Keynote Faculty'}</span>
                            </p>
                          </div>

                          {/* Start & End Date Time */}
                          <div className="text-right font-mono text-xs text-neutral-400 bg-black/40 px-3 py-2 rounded-xl border border-white/10 self-start md:self-auto space-y-1">
                            <div className="text-cyan-400 font-semibold text-[11px]">
                              Start: {ws.scheduledStartTime ? new Date(ws.scheduledStartTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                            </div>
                            <div className="text-cyan-300 font-semibold text-[11px]">
                              End: {ws.scheduledEndTime ? new Date(ws.scheduledEndTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBA'}
                            </div>
                          </div>
                        </div>

                        <div className="dash-live-box__body mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-neutral-300 mb-4">{ws.description}</p>

                          {/* Attendance & Join Google Meet Action Section */}
                          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <span className="text-xs font-mono font-bold text-white block">STEP 1: Attendance Verification</span>
                                <span className="text-[11px] text-neutral-400">You must mark your attendance before joining the workshop stream.</span>
                              </div>
                              {isMarked ? (
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                                  <CheckCircle2 size={14} className="text-emerald-400" /> Attendance Marked
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleMarkAttendance(ws.id)}
                                  className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                                >
                                  <CheckCircle2 size={14} /> Mark Attendance Now
                                </button>
                              )}
                            </div>

                            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <span className="text-xs font-mono font-bold text-white block">STEP 2: Join Meeting Room</span>
                                <span className="text-[11px] text-neutral-400">
                                  {isMarked ? 'Attendance verified. Click below to enter Google Meet.' : 'Locked until attendance is marked.'}
                                </span>
                              </div>

                              {isMarked ? (
                                <a
                                  href={ws.meetLink || 'https://meet.google.com'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="dash-btn-primary flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                                >
                                  <Video size={16} /> Join Google Meet <ExternalLink size={14} />
                                </a>
                              ) : (
                                <button
                                  onClick={() => {
                                    setFeedback({ type: 'error', msg: 'Please click "Mark Attendance Now" before joining the meeting!' });
                                    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
                                  }}
                                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-400 border border-white/10 font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer hover:border-cyan-500/40"
                                >
                                  <Video size={16} /> Join Google Meet (Locked)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Earned Certifications</h3>
              <span className="dash-counter-pill">{certificates.length} Verified</span>
            </div>

            {certificates.length === 0 ? (
              <div className="dash-empty-state">
                <Award size={48} color="#38bdf8" />
                <h4>No Certificates Issued Yet</h4>
                <p>
                  Attend workshops and satisfy the minimum live attendance criteria to earn verified digital credentials.
                </p>
              </div>
            ) : (
              <div className="dash-grid-cards">
                {certificates.map((cert) => (
                  <div key={cert.id} className="dash-cert-card">
                    <div className="dash-cert-badge">
                      <ShieldCheck size={18} /> Verified Credential
                    </div>
                    <h4>{cert.workshopTitle}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Issued on: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'September 2026'}
                    </p>
                    <div className="dash-cert-code">ID: {cert.certificateNumber || cert.id}</div>
                    <button
                      onClick={() => downloadCertificate(cert)}
                      className="dash-btn-primary"
                      style={{ width: '100%', marginTop: 12 }}
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Participant Academic Dossier</h3>
            </div>

            <form onSubmit={handleProfileSave} className="dash-profile-form">
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                  />
                </div>
                <div className="dash-form-group">
                  <label>Email Address</label>
                  <input type="text" value={user?.email || ''} disabled className="dash-input-disabled" />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                <div className="dash-form-group">
                  <label>College / University</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    placeholder="e.g. Jabalpur Engineering College"
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Branch / Specialization</label>
                  <input
                    type="text"
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>
                <div className="dash-form-group">
                  <label>Academic Semester</label>
                  <input
                    type="text"
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    placeholder="e.g. 4th Semester"
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Student Roll / ID Number</label>
                  <input
                    type="text"
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                    placeholder="e.g. 0201CS241001"
                  />
                </div>
              </div>

              <button type="submit" className="dash-btn-primary" style={{ alignSelf: 'flex-start' }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </main>
    </KineticGrid>
  );
}
