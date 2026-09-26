'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import ElectricBorder from '@/components/ui/ElectricBorder';
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
} from '@/services/storageService';
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
} from 'lucide-react';

export default function DashboardStudent() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'workshops' | 'live' | 'certificates' | 'profile'>('workshops');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendance, setAttendance] = useState<AttendanceLog[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string }>({ type: '', msg: '' });

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    college: user?.college || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    rollNumber: user?.rollNumber || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        college: user.college || '',
        branch: user.branch || '',
        semester: user.semester || '',
        rollNumber: user.rollNumber || '',
      });
    }
  }, [user]);

  // Load data
  const loadData = () => {
    const ws = getAllWorkshops();
    setWorkshops(ws);
    if (user) {
      setRegistrations(getUserRegistrations(user.id));
      setAttendance(getAttendanceForUser(user.id));
      setCertificates(getUserCertificates(user.id));
    } else {
      // Fallback demo student
      setRegistrations(getUserRegistrations('student-001'));
      setAttendance(getAttendanceForUser('student-001'));
      setCertificates(getUserCertificates('student-001'));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Live workshop attendance simulation interval
  useEffect(() => {
    const activeUserId = user?.id || 'student-001';
    const interval = setInterval(() => {
      const liveWs = workshops.find(
        (w) => w.status === 'live' && registrations.some((r) => r.workshopId === w.id)
      );
      if (liveWs) {
        pingAttendance(activeUserId, liveWs.id);
        setAttendance(getAttendanceForUser(activeUserId));
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [user, workshops, registrations]);

  const handleRegister = (workshopId: string) => {
    const activeUserId = user?.id || 'student-001';
    const res = registerForWorkshop(activeUserId, workshopId);
    if (res.success) {
      setFeedback({ type: 'success', msg: 'Successfully registered for workshop!' });
      loadData();
    } else {
      setFeedback({ type: 'error', msg: res.error || 'Could not register' });
    }
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handleUnregister = (workshopId: string) => {
    const activeUserId = user?.id || 'student-001';
    unregisterFromWorkshop(activeUserId, workshopId);
    setFeedback({ type: 'success', msg: 'Registration cancelled.' });
    loadData();
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handleManualPing = (workshopId: string) => {
    const activeUserId = user?.id || 'student-001';
    pingAttendance(activeUserId, workshopId);
    setAttendance(getAttendanceForUser(activeUserId));
    setFeedback({ type: 'success', msg: '📡 Telemetry signal confirmed! Attendance updated.' });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const activeUserId = user?.id || 'student-001';
    updateUserProfile(activeUserId, profileForm);
    if (refreshUser) refreshUser();
    setFeedback({ type: 'success', msg: 'Profile updated successfully!' });
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
          <div className="dash-user-info">
            <span className="dash-user-name">{displayName}</span>
            <span className="dash-user-role">🎓 Student • {displayBranch}</span>
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
        {/* Banner Alert if Live Workshop Available */}
        {liveWorkshop && (
          <div className="dash-live-alert">
            <div className="dash-live-alert__left">
              <span className="dash-live-pulse" />
              <div>
                <strong style={{ color: '#38bdf8' }}>SESSION BROADCASTING LIVE:</strong>{' '}
                {liveWorkshop.title}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('live')}
              className="dash-btn-telemetry"
            >
              <Video size={15} /> Join Live Hub
            </button>
          </div>
        )}

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
            className={`dash-tab ${activeTab === 'live' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <Radio size={16} /> Live Session Hub
            {liveWorkshop && <span className="dash-badge-dot" />}
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
              <span className="dash-counter-pill">{workshops.length} Programs</span>
            </div>

            <div className="dash-grid-cards">
              {workshops.map((ws) => {
                const isRegistered = registeredWorkshopIds.has(ws.id);
                const borderColor = ws.status === 'live' ? '#00d4ff' : '#38bdf8';
                return (
                  <ElectricBorder
                    key={ws.id}
                    color={borderColor}
                    speed={ws.status === 'live' ? 1.4 : 0.9}
                    chaos={ws.status === 'live' ? 0.16 : 0.1}
                    borderRadius={16}
                    style={{ height: '100%' }}
                  >
                    <div className="dash-card" style={{ height: '100%', margin: 0 }}>
                      <div className="dash-card__top">
                        <span className={`dash-badge dash-badge--${ws.status}`}>
                          {ws.status === 'live' && <span className="dash-pulse-dot" />}
                          {ws.status.toUpperCase()}
                        </span>
                        <span className="dash-category-tag">{ws.track || 'Cosmos Track'}</span>
                      </div>

                      <h4 className="dash-card__title">{ws.title}</h4>
                      <p className="dash-card__desc">{ws.description}</p>

                      <div className="dash-card__meta">
                        <div>
                          <Calendar size={14} />{' '}
                          {ws.scheduledStartTime
                            ? new Date(ws.scheduledStartTime).toLocaleDateString()
                            : 'September 2026'}
                        </div>
                        <div>
                          <Clock size={14} /> {ws.minAttendanceMinutes * 3 || 90} mins
                        </div>
                        <div>
                          <UserIcon size={14} /> {ws.speakerName || 'Dr. Sarah Chen (Keynote)'}
                        </div>
                      </div>

                      <div className="dash-card__footer">
                        {isRegistered ? (
                          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                            <button
                              onClick={() => setActiveTab('live')}
                              className="dash-btn-primary"
                              style={{ flex: 1 }}
                            >
                              Go to Hub
                            </button>
                            <button
                              onClick={() => handleUnregister(ws.id)}
                              className="dash-btn-secondary"
                              title="Cancel Registration"
                            >
                              Unregister
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRegister(ws.id)}
                            className="dash-btn-primary"
                            style={{ width: '100%' }}
                          >
                            Register 1-Click
                          </button>
                        )}
                      </div>
                    </div>
                  </ElectricBorder>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE SESSION HUB */}
        {activeTab === 'live' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Live Telemetry & Satellite Broadcast Hub</h3>
            </div>

            {liveWorkshop ? (
              <div className="dash-live-box">
                <div className="dash-live-box__header">
                  <div className="dash-live-box__tag">
                    <span className="dash-pulse-dot" /> LIVE BROADCAST IN PROGRESS
                  </div>
                  <h2>{liveWorkshop.title}</h2>
                  <p style={{ color: '#94a3b8' }}>Led by: {liveWorkshop.speakerName || 'Dr. Sarah Chen'}</p>
                </div>

                <div className="dash-live-box__body">
                  <div className="dash-telemetry-box">
                    <div className="dash-telemetry-box__item">
                      <span className="dash-telemetry-box__label">Signal State</span>
                      <span className="dash-telemetry-box__val" style={{ color: '#38bdf8' }}>
                        ● Active Transponder
                      </span>
                    </div>

                    <div className="dash-telemetry-box__item">
                      <span className="dash-telemetry-box__label">Minutes Logged</span>
                      <span className="dash-telemetry-box__val">
                        {attendance.find((a) => a.workshopId === liveWorkshop.id)?.totalMinutesPresent || 0} / {liveWorkshop.minAttendanceMinutes} min
                      </span>
                    </div>

                    <div className="dash-telemetry-box__item">
                      <span className="dash-telemetry-box__label">Certificate Eligibility</span>
                      <span className="dash-telemetry-box__val">
                        {attendance.find((a) => a.workshopId === liveWorkshop.id)?.isEligibleForCert ? (
                          <span style={{ color: '#34d399' }}>✓ Eligible</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Accumulating minutes...</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="dash-live-box__actions">
                    <a
                      href={liveWorkshop.meetLink || 'https://meet.google.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="dash-btn-primary dash-btn-lg"
                    >
                      <Video size={18} /> Join Google Meet Stream <ExternalLink size={14} />
                    </a>

                    <button
                      onClick={() => handleManualPing(liveWorkshop.id)}
                      className="dash-btn-secondary"
                    >
                      <Zap size={16} /> Ping Signal Beacon
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dash-empty-state">
                <Radio size={48} color="#38bdf8" />
                <h4>No Live Workshops Currently In Session</h4>
                <p>
                  When your registered sessions begin broadcasting, your telemetry beacon and video link will automatically activate here.
                </p>
                <button onClick={() => setActiveTab('workshops')} className="dash-btn-primary">
                  Browse Upcoming Workshops
                </button>
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
                  <input type="text" value={user?.name || displayName} disabled className="dash-input-disabled" />
                </div>
                <div className="dash-form-group">
                  <label>Email Address</label>
                  <input type="text" value={user?.email || 'arjun@university.edu'} disabled className="dash-input-disabled" />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>College / University</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                  />
                </div>
                <div className="dash-form-group">
                  <label>Branch / Specialization</label>
                  <input
                    type="text"
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    placeholder="e.g. Aerospace Engineering"
                  />
                </div>
              </div>

              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Academic Semester</label>
                  <input
                    type="text"
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    placeholder="e.g. 6th Semester"
                  />
                </div>
                <div className="dash-form-group">
                  <label>Student Roll / ID Number</label>
                  <input
                    type="text"
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                    placeholder="e.g. AE2024098"
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
