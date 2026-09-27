'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import {
  User,
  Workshop,
  Registration,
  AttendanceLog,
  Certificate,
  getAllUsers,
  getAllWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getRegistrations,
  getAttendanceLogs,
  getCertificates,
  issueCertificate,
  exportUsersCSV,
  exportAttendanceCSV,
  getFAQs,
} from '@/services/storageService';
import {
  subscribeToRealtimeStudents,
  exportLiveStudentsCSV,
  removeStudentFromCloud,
} from '@/services/realtimeUserService';
import {
  Users,
  Calendar,
  Clock,
  Award,
  Download,
  Plus,
  Trash2,
  Play,
  Square,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardAdmin() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (
        user.role !== 'admin' &&
        user.email?.toLowerCase().trim() !== 'cosmos.jec@jecjabalpur.ac.in'
      ) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  const [module, setModule] = useState<'overview' | 'workshops' | 'users' | 'attendance' | 'certificates'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendance, setAttendance] = useState<AttendanceLog[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string }>({ type: '', msg: '' });

  // Filters & Modals
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [showCreateWs, setShowCreateWs] = useState(false);

  // New Workshop Form State
  const [newWs, setNewWs] = useState({
    title: '',
    description: '',
    track: 'Astrophysics',
    speakerName: 'Dr. Sarah Chen',
    speakerId: 'speaker-001',
    scheduledStartTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    scheduledEndTime: new Date(Date.now() + 93600000).toISOString().slice(0, 16),
    minAttendanceMinutes: 45,
    maxCapacity: 150,
    meetLink: 'https://meet.google.com/cos-tech-live',
    status: 'published' as Workshop['status'],
  });

  const loadAll = () => {
    setUsers(getAllUsers());
    setWorkshops(getAllWorkshops());
    setRegistrations(getRegistrations());
    setAttendance(getAttendanceLogs());
    setCertificates(getCertificates());
    getFAQs();
  };

  useEffect(() => {
    loadAll();

    // Subscribe to live Firebase Firestore & MongoDB student telemetry
    const unsubscribe = subscribeToRealtimeStudents((realtimeStudents) => {
      const adminUsers = getAllUsers().filter((u) => u.role === 'admin');
      setUsers([...adminUsers, ...realtimeStudents]);
    });

    return () => unsubscribe();
  }, []);

  // Real-Time Student Management States
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [studentToRemove, setStudentToRemove] = useState<User | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [userBranchFilter, setUserBranchFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleCopyEmail = (email: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  const handleConfirmRemove = async () => {
    if (!studentToRemove) return;
    setIsRemoving(true);
    try {
      await removeStudentFromCloud(studentToRemove.id, studentToRemove.email);
      // Immediately filter out locally for instant response
      setUsers((prev) => prev.filter((u) => u.id !== studentToRemove.id && u.email !== studentToRemove.email));
      showToast('success', `Student "${studentToRemove.name}" removed in real-time.`);
      if (selectedStudent?.id === studentToRemove.id) {
        setSelectedStudent(null);
      }
      setStudentToRemove(null);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to remove student');
    } finally {
      setIsRemoving(false);
    }
  };

  const showToast = (type: string, msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWs.title || !newWs.speakerName) {
      showToast('error', 'Please fill in required workshop fields');
      return;
    }
    createWorkshop(newWs);
    setShowCreateWs(false);
    setNewWs({
      title: '',
      description: '',
      track: 'Astrophysics',
      speakerName: 'Dr. Sarah Chen',
      speakerId: 'speaker-001',
      scheduledStartTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      scheduledEndTime: new Date(Date.now() + 93600000).toISOString().slice(0, 16),
      minAttendanceMinutes: 45,
      maxCapacity: 150,
      meetLink: 'https://meet.google.com/cos-tech-live',
      status: 'published',
    });
    loadAll();
    showToast('success', 'New space workshop registered and scheduled!');
  };

  const handleUpdateStatus = (wsId: string, status: Workshop['status']) => {
    updateWorkshop(wsId, { status });
    loadAll();
    showToast('success', `Workshop status changed to: ${status.toUpperCase()}`);
  };

  const handleDeleteWorkshop = (wsId: string) => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this workshop?')) {
      deleteWorkshop(wsId);
      loadAll();
      showToast('success', 'Workshop purged from system.');
    }
  };

  const handleBulkIssueCertificates = () => {
    let count = 0;
    attendance.forEach((att) => {
      if (att.isEligibleForCert) {
        const student = users.find((u) => u.id === att.userId);
        const ws = workshops.find((w) => w.id === att.workshopId);
        if (student && ws) {
          const res = issueCertificate(student.id, student.name, ws.id, ws.title);
          if (res) count++;
        }
      }
    });
    loadAll();
    showToast('success', `Issued ${count} new digital certificates to eligible participants!`);
  };

  const downloadCertPDF = async (cert: Certificate) => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setFillColor(2, 3, 6);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(22);
    doc.text('TECH BLITZ BY COSMOS', 148.5, 38, { align: 'center' });
    doc.setTextColor(248, 250, 252);
    doc.setFontSize(26);
    doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 68, { align: 'center' });
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(24);
    doc.text(cert.recipientName || 'Cosmos Student', 148.5, 98, { align: 'center' });
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(14);
    doc.text(`"${cert.workshopTitle || 'Technical Symposium'}"`, 148.5, 120, { align: 'center' });
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(`Certificate ID: ${cert.certificateNumber || cert.id}`, 40, 165);
    doc.text(`Issue Date: ${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'September 2026'}`, 200, 165);
    doc.save(`Certificate_${cert.certificateNumber || cert.id}.pdf`);
  };

  const allStudents = users.filter((u) => u.role !== 'admin');
  const uniqueBranches = Array.from(
    new Set(allStudents.map((u) => (u.branch || 'CSE').toUpperCase().trim()).filter(Boolean))
  ).sort();

  const filteredStudents = allStudents.filter((u) => {
    if (
      userBranchFilter !== 'all' &&
      (u.branch || 'CSE').toUpperCase().trim() !== userBranchFilter.toUpperCase().trim()
    ) {
      return false;
    }
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase().trim();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(q)) ||
      (u.college && u.college.toLowerCase().includes(q)) ||
      (u.institution && u.institution.toLowerCase().includes(q)) ||
      (u.branch && u.branch.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + pageSize);

  const displayName = user?.name || 'Mission Control Admin';

  return (
    <KineticGrid globalColor="default">
      {/* Top Header */}
      <header className="dash-header">
        <div className="dash-header__brand">
          <img src="/techblitz-logo.png" alt="Tech Blitz" className="dash-header__logo" />
          <div>
            <h2 className="dash-header__title">
              TECH <span style={{ color: '#38bdf8' }}>BLITZ</span>
            </h2>
            <span className="dash-header__subtitle">Cosmos Admin Console</span>
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
            <span className="dash-user-role" style={{ color: '#38bdf8' }}>
              ⚡ Whitelisted Administrator
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
        {feedback.msg && (
          <div className={`dash-toast dash-toast--${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.msg}
          </div>
        )}

        {/* Global Admin Stats */}
        <section className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Users size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{allStudents.length}</div>
              <div className="dash-stat-label">Registered Students</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Calendar size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{workshops.length}</div>
              <div className="dash-stat-label">Space Workshops</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Layers size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{registrations.length}</div>
              <div className="dash-stat-label">Seat Registrations</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Award size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{certificates.length}</div>
              <div className="dash-stat-label">Issued Credentials</div>
            </div>
          </div>
        </section>

        {/* Admin Module Tabs */}
        <div className="dash-tabs">
          <button
            className={`dash-tab ${module === 'overview' ? 'dash-tab--active' : ''}`}
            onClick={() => setModule('overview')}
          >
            ⚡ Control Center
          </button>
          <button
            className={`dash-tab ${module === 'workshops' ? 'dash-tab--active' : ''}`}
            onClick={() => setModule('workshops')}
          >
            <Calendar size={16} /> Workshop Lifecycle ({workshops.length})
          </button>
          <button
            className={`dash-tab ${module === 'users' ? 'dash-tab--active' : ''}`}
            onClick={() => setModule('users')}
          >
            <Users size={16} /> Student Management ({allStudents.length})
          </button>
          <button
            className={`dash-tab ${module === 'attendance' ? 'dash-tab--active' : ''}`}
            onClick={() => setModule('attendance')}
          >
            <Clock size={16} /> Telemetry Logs ({attendance.length})
          </button>
          <button
            className={`dash-tab ${module === 'certificates' ? 'dash-tab--active' : ''}`}
            onClick={() => setModule('certificates')}
          >
            <Award size={16} /> Certificate Engine ({certificates.length})
          </button>
        </div>

        {/* MODULE 1: CONTROL CENTER OVERVIEW */}
        {module === 'overview' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Mission Control Command Dashboard</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={exportUsersCSV} className="dash-btn-secondary">
                  <FileSpreadsheet size={15} /> Export Users CSV
                </button>
                <button onClick={exportAttendanceCSV} className="dash-btn-secondary">
                  <FileSpreadsheet size={15} /> Export Attendance CSV
                </button>
              </div>
            </div>

            <div className="dash-grid-cards">
              <div className="dash-card">
                <div className="dash-card__top">
                  <span className="dash-badge dash-badge--live">
                    <span className="dash-pulse-dot" /> LIVE SESSIONS
                  </span>
                </div>
                <h4 className="dash-card__title">Current Broadcasts</h4>
                <p className="dash-card__desc">
                  {workshops.filter((w) => w.status === 'live').length > 0
                    ? `${workshops.filter((w) => w.status === 'live').length} workshop currently broadcasting telemetry.`
                    : 'No workshops are live right now.'}
                </p>
                <button onClick={() => setModule('workshops')} className="dash-btn-primary" style={{ marginTop: 12 }}>
                  Manage Workshops
                </button>
              </div>

              <div className="dash-card">
                <div className="dash-card__top">
                  <span className="dash-category-tag">Automation</span>
                </div>
                <h4 className="dash-card__title">Certificate Engine</h4>
                <p className="dash-card__desc">
                  Auto-evaluate attendee telemetry minutes and issue verified PDF credentials with 1 click.
                </p>
                <button onClick={handleBulkIssueCertificates} className="dash-btn-telemetry" style={{ marginTop: 12 }}>
                  Bulk Issue Eligible
                </button>
              </div>

              <div className="dash-card">
                <div className="dash-card__top">
                  <span className="dash-category-tag">Database</span>
                </div>
                <h4 className="dash-card__title">User Whitelist & Access</h4>
                <p className="dash-card__desc">
                  Students, Speakers, and Admin permissions are strictly validated against session state.
                </p>
                <button onClick={() => setModule('users')} className="dash-btn-secondary" style={{ marginTop: 12 }}>
                  Inspect User Directory
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: WORKSHOP LIFECYCLE */}
        {module === 'workshops' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Workshop Transmissions & Broadcasts</h3>
              <button onClick={() => setShowCreateWs(!showCreateWs)} className="dash-btn-primary">
                <Plus size={16} /> Schedule Workshop
              </button>
            </div>

            {/* Create Workshop Form */}
            {showCreateWs && (
              <form onSubmit={handleCreateWorkshop} className="dash-profile-form" style={{ marginBottom: 28 }}>
                <h4 style={{ color: '#38bdf8', marginBottom: 12 }}>Schedule New Space Workshop</h4>
                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Workshop Title *</label>
                    <input
                      type="text"
                      required
                      value={newWs.title}
                      onChange={(e) => setNewWs({ ...newWs, title: e.target.value })}
                      placeholder="e.g. Deep Space Radio Telescope Signals"
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Keynote Speaker Name *</label>
                    <input
                      type="text"
                      required
                      value={newWs.speakerName}
                      onChange={(e) => setNewWs({ ...newWs, speakerName: e.target.value })}
                      placeholder="e.g. Dr. Sarah Chen"
                    />
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Domain Category</label>
                    <select
                      value={newWs.track}
                      onChange={(e) => setNewWs({ ...newWs, track: e.target.value })}
                      className="dash-select"
                    >
                      <option value="Astrophysics">Astrophysics</option>
                      <option value="Orbital Mechanics">Orbital Mechanics</option>
                      <option value="Satellite Systems">Satellite Systems</option>
                      <option value="Space Robotics">Space Robotics</option>
                      <option value="AI/ML">AI/ML</option>
                    </select>
                  </div>
                  <div className="dash-form-group">
                    <label>Google Meet Stream Link</label>
                    <input
                      type="url"
                      value={newWs.meetLink}
                      onChange={(e) => setNewWs({ ...newWs, meetLink: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newWs.scheduledStartTime}
                      onChange={(e) => setNewWs({ ...newWs, scheduledStartTime: e.target.value })}
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Minimum Attendance (Minutes)</label>
                    <input
                      type="number"
                      value={newWs.minAttendanceMinutes}
                      onChange={(e) => setNewWs({ ...newWs, minAttendanceMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="dash-btn-primary">
                    Confirm & Publish
                  </button>
                  <button type="button" onClick={() => setShowCreateWs(false)} className="dash-btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Workshops Grid */}
            {workshops.length === 0 ? (
              <div
                className="dash-empty-state"
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 16,
                  border: '1px dashed rgba(255,255,255,0.1)',
                }}
              >
                <Calendar size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: 6 }}>No Workshops Scheduled Yet</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 16px' }}>
                  Click &ldquo;+ Schedule Workshop&rdquo; above to publish sessions. Registered participants will receive access to the Google Meet link and live telemetry.
                </p>
                <button onClick={() => setShowCreateWs(true)} className="dash-btn-primary">
                  <Plus size={15} /> Schedule First Workshop
                </button>
              </div>
            ) : (
              <div className="dash-grid-cards">
                {workshops.map((ws) => (
                  <div key={ws.id} className="dash-card" style={{ height: '100%', margin: 0 }}>
                    <div className="dash-card__top">
                      <span className={`dash-badge dash-badge--${ws.status}`}>
                        {ws.status === 'live' && <span className="dash-pulse-dot" />}
                        {ws.status.toUpperCase()}
                      </span>
                      <span className="dash-category-tag">{ws.track || 'Cosmos Track'}</span>
                    </div>

                    <h4 className="dash-card__title">{ws.title}</h4>
                    <p className="dash-card__desc">Speaker: {ws.speakerName || 'Dr. Sarah Chen'}</p>

                    <div className="dash-card__meta">
                      <div>
                        <Clock size={14} /> {ws.minAttendanceMinutes * 3 || 90} min
                      </div>
                      <div>
                        <Calendar size={14} />{' '}
                        {ws.scheduledStartTime
                          ? new Date(ws.scheduledStartTime).toLocaleDateString()
                          : 'September 2026'}
                      </div>
                    </div>

                    {/* Admin State Transitions */}
                    <div className="dash-card__footer" style={{ flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                        {ws.status !== 'live' ? (
                          <button
                            onClick={() => handleUpdateStatus(ws.id, 'live')}
                            className="dash-btn-telemetry"
                            style={{ flex: 1 }}
                          >
                            <Play size={14} /> Set Live
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(ws.id, 'completed')}
                            className="dash-btn-secondary"
                            style={{ flex: 1 }}
                          >
                            <Square size={14} /> Complete
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteWorkshop(ws.id)}
                          className="dash-btn-danger"
                          title="Delete Workshop"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODULE 3: REAL-TIME STUDENT MANAGEMENT CONSOLE */}
        {module === 'users' && (
          <div className="dash-content-pane">
            {/* Header with Title and Actions */}
            <div className="dash-pane-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ margin: 0 }}>Real-Time Student Management Console</h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 8px #10b981',
                      }}
                    />
                    Live Telemetry Sync Active
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '6px 0 0' }}>
                  Synchronized live roster across Firebase Firestore & MongoDB • Calibrated for real-time management of 1,220 to 1,500+ student delegates
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    loadAll();
                    showToast('success', 'Real-time student registry re-synchronized.');
                  }}
                  className="dash-btn-secondary"
                  title="Force re-fetch from Firebase & MongoDB"
                >
                  <RefreshCw size={14} /> Re-sync Roster
                </button>
                <button
                  onClick={() => {
                    const exportTarget = filteredStudents.length > 0 ? filteredStudents : allStudents;
                    exportLiveStudentsCSV(exportTarget);
                    showToast('success', `Exported CSV with ${exportTarget.length} participant records.`);
                  }}
                  className="dash-btn-primary"
                  title="Export live student directory to CSV with complete student details"
                >
                  <FileSpreadsheet size={15} /> Export Students CSV ({filteredStudents.length})
                </button>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                margin: '18px 0',
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
                  Total Registered Students
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#38bdf8', marginTop: 4 }}>
                  {allStudents.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                  Across all campuses
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
                  Active Filter Matches
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#c084fc', marginTop: 4 }}>
                  {filteredStudents.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                  {userSearch || userBranchFilter !== 'all' ? 'Filtered results' : '100% of participants'}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
                  Unique Branches
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#34d399', marginTop: 4 }}>
                  {uniqueBranches.length || 1}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                  CSE, IT, ECE, EE & more
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
                  Cloud Engines
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', marginTop: 6 }}>
                  Firestore + Mongo
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                  Real-time delete sync
                </div>
              </div>
            </div>

            {/* Search, Filter, and Page Size Controls */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 280, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                  <Search
                    size={16}
                    style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }}
                  />
                  <input
                    type="text"
                    placeholder="Search by student name, email, roll number, college, phone..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ paddingLeft: 36, width: '100%' }}
                    className="dash-input"
                  />
                  {userSearch && (
                    <button
                      onClick={() => {
                        setUserSearch('');
                        setCurrentPage(1);
                      }}
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                      }}
                      title="Clear Search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Branch Filter */}
                <select
                  value={userBranchFilter}
                  onChange={(e) => {
                    setUserBranchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="dash-select"
                  style={{ minWidth: 160 }}
                >
                  <option value="all">All Branches ({allStudents.length})</option>
                  {uniqueBranches.map((b) => {
                    const count = allStudents.filter(
                      (s) => (s.branch || 'CSE').toUpperCase().trim() === b
                    ).length;
                    return (
                      <option key={b} value={b}>
                        {b} ({count})
                      </option>
                    );
                  })}
                </select>

                {(userSearch || userBranchFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setUserSearch('');
                      setUserBranchFilter('all');
                      setCurrentPage(1);
                    }}
                    className="dash-btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Page Size Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="dash-select"
                  style={{ width: 110, padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                  <option value={500}>500 / page</option>
                  <option value={1500}>All (1500)</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Participant Name & Email</th>
                    <th>College / Institution</th>
                    <th>Branch & Semester</th>
                    <th>Roll Number</th>
                    <th>Contact Phone</th>
                    <th>Registration Date</th>
                    <th style={{ textAlign: 'right', paddingRight: 16 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <Users size={36} color="#64748b" />
                          <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>
                            No Students Found
                          </div>
                          <div style={{ fontSize: '0.82rem', maxWidth: 420 }}>
                            {userSearch || userBranchFilter !== 'all'
                              ? 'No participants matched your active search query or branch filter. Try clearing your filters.'
                              : 'No student accounts have signed in or registered yet. As participants register with Firebase/Google, their live credentials will stream here instantly.'}
                          </div>
                          {(userSearch || userBranchFilter !== 'all') && (
                            <button
                              onClick={() => {
                                setUserSearch('');
                                setUserBranchFilter('all');
                                setCurrentPage(1);
                              }}
                              className="dash-btn-secondary"
                              style={{ marginTop: 8 }}
                            >
                              Clear Search & Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((u, idx) => {
                      const absoluteIndex = startIndex + idx + 1;
                      const initials = (u.name || 'P')
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <tr key={u.id} style={{ transition: 'background 0.15s ease' }}>
                          <td style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                            {absoluteIndex}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(139,92,246,0.2))',
                                  border: '1px solid rgba(56,189,248,0.4)',
                                  color: '#38bdf8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.78rem',
                                  flexShrink: 0,
                                }}
                              >
                                {initials}
                              </div>
                              <div>
                                <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{u.name}</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                                    {u.email}
                                  </span>
                                  <button
                                    onClick={() => handleCopyEmail(u.email)}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      padding: 0,
                                      cursor: 'pointer',
                                      color: copiedEmail === u.email ? '#34d399' : '#64748b',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                    }}
                                    title="Copy Email to Clipboard"
                                  >
                                    {copiedEmail === u.email ? <Check size={12} /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Building2 size={13} color="#94a3b8" />
                              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                                {u.college || u.institution || 'Jabalpur Engineering College'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  background: 'rgba(56, 189, 248, 0.1)',
                                  color: '#38bdf8',
                                  border: '1px solid rgba(56, 189, 248, 0.25)',
                                }}
                              >
                                {u.branch || 'CSE'}
                              </span>
                              <span
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: 4,
                                  fontSize: '0.72rem',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: '#94a3b8',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                Sem {u.semester || '1'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                color: '#e2e8f0',
                                background: 'rgba(0,0,0,0.3)',
                                padding: '3px 8px',
                                borderRadius: 4,
                                border: '1px solid rgba(255,255,255,0.08)',
                              }}
                            >
                              {u.rollNumber || '—'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: u.phone ? '#cbd5e1' : '#64748b' }}>
                              {u.phone || '—'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '—'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: 16 }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                onClick={() => setSelectedStudent(u)}
                                className="dash-btn-secondary"
                                style={{ padding: '5px 10px', fontSize: '0.75rem', gap: 4 }}
                                title="View Complete Student Dossier"
                              >
                                <Eye size={13} /> View
                              </button>
                              <button
                                onClick={() => setStudentToRemove(u)}
                                className="dash-btn-danger"
                                style={{ padding: '5px 10px', fontSize: '0.75rem', gap: 4 }}
                                title="Delete Participant in Real Time"
                              >
                                <Trash2 size={13} /> Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredStudents.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Showing <strong style={{ color: '#f8fafc' }}>{startIndex + 1}</strong> to{' '}
                  <strong style={{ color: '#f8fafc' }}>
                    {Math.min(startIndex + pageSize, filteredStudents.length)}
                  </strong>{' '}
                  of <strong style={{ color: '#38bdf8' }}>{filteredStudents.length}</strong> registered students
                  {filteredStudents.length !== allStudents.length && ` (filtered from ${allStudents.length} total)`}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={safeCurrentPage <= 1}
                    className="dash-btn-secondary"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      opacity: safeCurrentPage <= 1 ? 0.4 : 1,
                      cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                    }}
                    title="First Page"
                  >
                    « First
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="dash-btn-secondary"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      opacity: safeCurrentPage <= 1 ? 0.4 : 1,
                      cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                    }}
                    title="Previous Page"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>

                  <span
                    style={{
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      background: 'rgba(56, 189, 248, 0.1)',
                      borderRadius: 6,
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    Page {safeCurrentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="dash-btn-secondary"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      opacity: safeCurrentPage >= totalPages ? 0.4 : 1,
                      cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                    }}
                    title="Next Page"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safeCurrentPage >= totalPages}
                    className="dash-btn-secondary"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      opacity: safeCurrentPage >= totalPages ? 0.4 : 1,
                      cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                    }}
                    title="Last Page"
                  >
                    Last »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODULE 4: ATTENDANCE TRACKER */}
        {module === 'attendance' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Telemetry Attendance Heartbeats</h3>
              <button onClick={exportAttendanceCSV} className="dash-btn-secondary">
                <FileSpreadsheet size={15} /> Export Attendance CSV
              </button>
            </div>

            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Workshop</th>
                    <th>Minutes Logged</th>
                    <th>Last Heartbeat</th>
                    <th>Certificate Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                        No live telemetry heartbeats recorded yet. Heartbeats will log automatically when participants join live broadcasts.
                      </td>
                    </tr>
                  ) : (
                    attendance.map((att) => {
                      const student = users.find((u) => u.id === att.userId);
                      const ws = workshops.find((w) => w.id === att.workshopId);
                      return (
                        <tr key={att.id}>
                          <td>{student?.name || att.userId}</td>
                          <td>{ws?.title || att.workshopId}</td>
                          <td>{att.totalMinutesPresent} mins</td>
                          <td>{new Date(att.lastPingAt).toLocaleTimeString()}</td>
                          <td>
                            {att.isEligibleForCert ? (
                              <span style={{ color: '#34d399', fontWeight: 600 }}>✓ Eligible</span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>Accumulating...</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 5: CERTIFICATE ENGINE */}
        {module === 'certificates' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Digital Certificate Engine</h3>
              <button onClick={handleBulkIssueCertificates} className="dash-btn-primary">
                <Award size={16} /> Bulk Issue to Eligible
              </button>
            </div>

            {certificates.length === 0 ? (
              <div
                className="dash-empty-state"
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 16,
                  border: '1px dashed rgba(255,255,255,0.1)',
                }}
              >
                <Award size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: 6 }}>No Certificates Issued Yet</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 16px' }}>
                  All dummy certificates have been cleared. Authentic digital credentials will appear here once participants complete workshops and satisfy minimum attendance thresholds.
                </p>
              </div>
            ) : (
              <div className="dash-grid-cards">
                {certificates.map((c) => (
                  <div key={c.id} className="dash-cert-card">
                    <div className="dash-cert-badge">Verified Credential</div>
                    <h4>{c.recipientName}</h4>
                    <p style={{ color: '#38bdf8', fontSize: '0.85rem' }}>{c.workshopTitle}</p>
                    <div className="dash-cert-code">ID: {c.certificateNumber || c.id}</div>
                    <button
                      onClick={() => downloadCertPDF(c)}
                      className="dash-btn-secondary"
                      style={{ width: '100%', marginTop: 10 }}
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: STUDENT DETAILS DOSSIER */}
      {selectedStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{
              backgroundColor: '#090d16',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
              maxWidth: 580,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                  }}
                >
                  {(selectedStudent.name || 'P')[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
                    {selectedStudent.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                      }}
                    >
                      Student Delegate
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      UID: {selectedStudent.id.slice(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: 8,
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Participant Name
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: 4 }}>
                  {selectedStudent.name}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Email Address
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                    {selectedStudent.email}
                  </span>
                  <button
                    onClick={() => handleCopyEmail(selectedStudent.email)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedEmail === selectedStudent.email ? '#34d399' : '#94a3b8',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                    title="Copy Email"
                  >
                    {copiedEmail === selectedStudent.email ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  College / Institution
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e2e8f0', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={14} color="#38bdf8" />
                  <span>{selectedStudent.college || selectedStudent.institution || 'Jabalpur Engineering College'}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Branch & Semester
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e2e8f0', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <GraduationCap size={14} color="#34d399" />
                  <span>
                    {selectedStudent.branch || 'CSE'} • Sem {selectedStudent.semester || '1'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Roll Number / College ID
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontFamily: 'monospace', marginTop: 4 }}>
                  {selectedStudent.rollNumber || 'Not Specified'}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Contact Phone
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e2e8f0', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} color="#a78bfa" />
                  <span>{selectedStudent.phone || 'Not Provided'}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  gridColumn: '1 / -1',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                  Registration Timestamp
                </div>
                <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: 4 }}>
                  {selectedStudent.createdAt
                    ? new Date(selectedStudent.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                      })
                    : 'System Initialized'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: 16,
              }}
            >
              <button
                onClick={() => {
                  setStudentToRemove(selectedStudent);
                }}
                className="dash-btn-danger"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={14} /> Remove Student in Real-Time
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="dash-btn-secondary"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM REAL-TIME DELETION */}
      {studentToRemove && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => !isRemoving && setStudentToRemove(null)}
        >
          <div
            style={{
              backgroundColor: '#0b0f19',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(239, 68, 68, 0.25)',
              maxWidth: 480,
              width: '100%',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
                  Permanently Remove Student?
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#f87171' }}>
                  Immediate real-time cloud deletion
                </span>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 16px' }}>
              Are you sure you want to delete participant{' '}
              <strong style={{ color: '#f8fafc' }}>"{studentToRemove.name}"</strong>?
              This will permanently purge their record in real time from{' '}
              <strong style={{ color: '#38bdf8' }}>Firebase Firestore</strong>, the{' '}
              <strong style={{ color: '#34d399' }}>MongoDB backend database</strong>, and live attendance logs.
            </p>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 20,
                fontSize: '0.82rem',
              }}
            >
              <div style={{ color: '#cbd5e1' }}><strong>Email:</strong> {studentToRemove.email}</div>
              <div style={{ color: '#cbd5e1', marginTop: 4 }}><strong>College:</strong> {studentToRemove.college || 'JEC'}</div>
              <div style={{ color: '#cbd5e1', marginTop: 4 }}><strong>Branch:</strong> {studentToRemove.branch || 'CSE'}</div>
              {studentToRemove.rollNumber && (
                <div style={{ color: '#cbd5e1', marginTop: 4 }}><strong>Roll No:</strong> {studentToRemove.rollNumber}</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setStudentToRemove(null)}
                disabled={isRemoving}
                className="dash-btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRemove}
                disabled={isRemoving}
                className="dash-btn-danger"
                style={{
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: isRemoving ? 0.7 : 1,
                  cursor: isRemoving ? 'wait' : 'pointer',
                }}
              >
                {isRemoving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Purging in Real-Time...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Confirm Real-Time Removal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </KineticGrid>
  );
}
