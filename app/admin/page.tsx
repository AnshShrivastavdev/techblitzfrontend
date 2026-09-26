'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import ElectricBorder from '@/components/ui/ElectricBorder';
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
} from 'lucide-react';

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
  }, []);

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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

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
              <div className="dash-stat-value">{users.length}</div>
              <div className="dash-stat-label">Total Registered Users</div>
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
            <Users size={16} /> Directory ({users.length})
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
            <div className="dash-grid-cards">
              {workshops.map((ws) => {
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
                  </ElectricBorder>
                );
              })}
            </div>
          </div>
        )}

        {/* MODULE 3: USER DIRECTORY */}
        {module === 'users' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Platform User Directory</h3>
              <button onClick={exportUsersCSV} className="dash-btn-secondary">
                <FileSpreadsheet size={15} /> Export CSV
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }}
                />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ paddingLeft: 36, width: '100%' }}
                  className="dash-input"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="dash-select"
                style={{ width: 160 }}
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="speaker">Speakers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Institution / Branch</th>
                    <th>Roll / Semester</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className={`dash-badge dash-badge--${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>{u.college || u.branch || 'Cosmos Member'}</td>
                      <td>{u.semester ? `${u.semester} • ${u.rollNumber}` : '—'}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  {attendance.map((att) => {
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
                  })}
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
          </div>
        )}
      </main>
    </KineticGrid>
  );
}
