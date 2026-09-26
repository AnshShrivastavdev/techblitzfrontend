import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import ElectricBorder from '@/components/ui/ElectricBorder';
import {
  getAllWorkshops,
  updateWorkshop,
  getRegistrations,
  getAttendanceLogs,
  getAllUsers,
} from '@/services/storageService';
import {
  Mic2,
  Calendar,
  Clock,
  Video,
  Users,
  Radio,
  LogOut,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Award,
} from 'lucide-react';

export default function DashboardSpeaker() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'attendees' | 'bio'
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const loadData = () => {
    const allWs = getAllWorkshops();
    // Filter workshops assigned to this speaker (by email or name match)
    const speakerWs = allWs.filter(
      (w) =>
        w.speakerId === user?.id ||
        w.speakerEmail === user?.email ||
        w.speakerName?.toLowerCase().includes(user?.name?.toLowerCase() || '')
    );
    setWorkshops(speakerWs.length > 0 ? speakerWs : allWs);
    setRegistrations(getRegistrations());
    setAttendance(getAttendanceLogs());
    setUsers(getAllUsers());
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleStatusChange = (workshopId, newStatus) => {
    updateWorkshop(workshopId, { status: newStatus });
    loadData();
    setFeedback({
      type: 'success',
      msg: `Workshop transmission status switched to: ${newStatus.toUpperCase()}`,
    });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const totalAttendees = registrations.filter((r) =>
    workshops.some((w) => w.id === r.workshopId)
  ).length;

  const liveSessionsCount = workshops.filter((w) => w.status === 'live').length;

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
            <span className="dash-header__subtitle">Keynote Speaker Console</span>
          </div>
        </div>

        <div className="dash-header__user">
          <button
            onClick={() => navigate('/')}
            className="dash-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}
            title="Return to Main Landing Page"
          >
            ← Launchpad
          </button>
          <div className="dash-user-info">
            <span className="dash-user-name">{user?.name}</span>
            <span className="dash-user-role">🎙️ Invited Speaker</span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="dash-btn-logout"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dash-main">
        {feedback.msg && (
          <div className={`dash-toast dash-toast--${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.msg}
          </div>
        )}

        {/* Speaker Stats */}
        <section className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Mic2 size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{workshops.length}</div>
              <div className="dash-stat-label">Assigned Sessions</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Radio size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{liveSessionsCount}</div>
              <div className="dash-stat-label">Broadcasting Live</div>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">
              <Users size={20} color="#38bdf8" />
            </div>
            <div>
              <div className="dash-stat-value">{totalAttendees}</div>
              <div className="dash-stat-label">Total Registered Attendees</div>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="dash-tabs">
          <button
            className={`dash-tab ${activeTab === 'sessions' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <Calendar size={16} /> Workshop Transmissions ({workshops.length})
          </button>
          <button
            className={`dash-tab ${activeTab === 'attendees' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('attendees')}
          >
            <Users size={16} /> Audience Telemetry
          </button>
        </div>

        {/* TAB 1: SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Assigned Workshop Broadcasts</h3>
            </div>

            <div className="dash-grid-cards">
              {workshops.map((ws) => {
                const wsRegs = registrations.filter((r) => r.workshopId === ws.id);
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
                        <span className="dash-category-tag">{wsRegs.length} Registered</span>
                      </div>

                      <h4 className="dash-card__title">{ws.title}</h4>
                      <p className="dash-card__desc">{ws.description}</p>

                      <div className="dash-card__meta">
                        <div>
                          <Clock size={14} /> Duration: {ws.durationMinutes || 90} min
                        </div>
                        <div>
                          <Calendar size={14} />{' '}
                          {ws.scheduledAt
                            ? new Date(ws.scheduledAt).toLocaleDateString()
                            : ws.scheduledStartTime
                            ? new Date(ws.scheduledStartTime).toLocaleDateString()
                            : 'September 2026'}
                        </div>
                      </div>

                      {/* Google Meet Stream Link */}
                      <div style={{ margin: '14px 0', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Meet Stream Link:</span>{' '}
                        <a
                          href={ws.meetLink || 'https://meet.google.com'}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#38bdf8', textDecoration: 'underline' }}
                        >
                          {ws.meetLink || 'https://meet.google.com'} <ExternalLink size={12} style={{ display: 'inline' }} />
                        </a>
                      </div>

                      {/* Controls */}
                      <div className="dash-card__footer">
                        {ws.status === 'live' ? (
                          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                            <a
                              href={ws.meetLink || 'https://meet.google.com'}
                              target="_blank"
                              rel="noreferrer"
                              className="dash-btn-primary"
                              style={{ flex: 1 }}
                            >
                              <Video size={16} /> Enter Stage
                            </a>
                            <button
                              onClick={() => handleStatusChange(ws.id, 'completed')}
                              className="dash-btn-danger"
                            >
                              <Square size={14} /> End Stream
                            </button>
                          </div>
                        ) : ws.status === 'completed' ? (
                          <div style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={16} /> Broadcast Successfully Completed
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(ws.id, 'live')}
                            className="dash-btn-telemetry"
                            style={{ width: '100%' }}
                          >
                            <Play size={16} /> Go Live Now
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

        {/* TAB 2: ATTENDEE TELEMETRY */}
        {activeTab === 'attendees' && (
          <div className="dash-content-pane">
            <div className="dash-pane-header">
              <h3>Participant Roster & Engagement Records</h3>
            </div>

            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Workshop Title</th>
                    <th>Institution</th>
                    <th>Signal Minutes</th>
                    <th>Eligibility</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations
                    .filter((r) => workshops.some((w) => w.id === r.workshopId))
                    .map((r) => {
                      const student = users.find((u) => u.id === r.userId);
                      const ws = workshops.find((w) => w.id === r.workshopId);
                      const att = attendance.find(
                        (a) => a.userId === r.userId && a.workshopId === r.workshopId
                      );
                      return (
                        <tr key={r.id}>
                          <td>
                            <strong>{student?.name || 'Student Participant'}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student?.email}</div>
                          </td>
                          <td>{ws?.title}</td>
                          <td>{student?.college || 'Cosmos Explorer'}</td>
                          <td>{att?.totalMinutesPresent || 0} min</td>
                          <td>
                            {att?.isEligibleForCert ? (
                              <span style={{ color: '#34d399', fontWeight: 600 }}>✓ Verified</span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>In Progress</span>
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
      </main>
    </KineticGrid>
  );
}
