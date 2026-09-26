import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShaderAnimation } from '@/components/ui/shader-lines';
import {
  User,
  Mail,
  Phone,
  Building,
  Layers,
  GraduationCap,
  Lock,
  Mic2,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, speakerLogin, register } = useAuth();

  // Role tab: 'student' | 'speaker'
  const [role, setRole] = useState(() => (location.pathname === '/speaker/login' ? 'speaker' : 'student'));

  // Student sub-mode: 'signin' | 'create'
  const [studentMode, setStudentMode] = useState(() => (location.pathname === '/register' ? 'create' : 'signin'));

  // Sync mode on route change
  useEffect(() => {
    if (location.pathname === '/speaker/login') {
      setRole('speaker');
    } else if (location.pathname === '/register') {
      setRole('student');
      setStudentMode('create');
    } else if (location.pathname === '/login') {
      setRole('student');
      setStudentMode('signin');
    }
  }, [location.pathname]);

  // Speaker sub-mode: 'password' | 'otp'
  const [speakerMode, setSpeakerMode] = useState('password');

  // Error state
  const [error, setError] = useState('');

  // Password visibility
  const [showPw, setShowPw] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Student Sign-In Fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Student Create Account Fields
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createCollege, setCreateCollege] = useState('');
  const [createBranch, setCreateBranch] = useState('');
  const [createSemester, setCreateSemester] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  // Speaker Fields
  const [speakerEmail, setSpeakerEmail] = useState('');
  const [speakerPassword, setSpeakerPassword] = useState('');
  const [speakerOtp, setSpeakerOtp] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleStudentSignIn(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await login(signInEmail, signInPassword);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStudentCreate(e) {
    e.preventDefault();
    setError('');
    if (!createName || !createEmail || !createPassword) {
      setError('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await register({
        name: createName,
        email: createEmail,
        password: createPassword,
        college: createCollege,
        branch: createBranch,
        semester: createSemester,
        rollNumber: '',
      });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSpeakerLogin(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (speakerMode === 'otp') {
        // Mock OTP verification
        if (speakerOtp === '123456') {
          // Find speaker and log in
          const result = await login(speakerEmail, 'speaker123');
          if (result.success) {
            navigate('/speaker/dashboard');
          } else {
            setError('Speaker not found. Check your registered email.');
          }
        } else {
          setError('Invalid OTP code. Use 123456 for demo.');
        }
        return;
      }

      // Password mode — use the speaker-specific login
      const result = await speakerLogin(speakerEmail, speakerPassword);
      if (result.success) {
        navigate('/speaker/dashboard');
      } else {
        setError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSendOtp() {
    if (!speakerEmail) {
      setError('Enter your registered email first');
      return;
    }
    setOtpSent(true);
    setOtpCountdown(30);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function fillDemo(type) {
    setError('');
    if (type === 'student') {
      setRole('student');
      setStudentMode('signin');
      setSignInEmail('arjun@university.edu');
      setSignInPassword('student123');
    } else if (type === 'speaker') {
      setRole('speaker');
      setSpeakerMode('password');
      setSpeakerEmail('sarah.chen@techblitz.com');
      setSpeakerPassword('speaker123');
    } else if (type === 'admin') {
      setRole('student');
      setStudentMode('signin');
      setSignInEmail('admin@techblitz.com');
      setSignInPassword('admin123');
    }
  }

  return (
    <div className="auth-page">
      {/* Shader Background */}
      <ShaderAnimation />
      <div className="auth-page__overlay" />

      <div className="auth-page__content">
        {/* Return to Launchpad Navigation */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#94a3b8',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            ← RETURN TO LAUNCHPAD
          </button>
        </div>

        {/* Branding */}
        <div className="auth-brand">
          <span className="auth-brand__presents">COSMOS jec presents</span>
          <img
            src="/techblitz-logo.png"
            alt="Tech Blitz Logo"
            className="auth-brand__logo"
          />
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Role Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tabs__tab ${role === 'student' ? 'auth-tabs__tab--active' : ''}`}
              onClick={() => { setRole('student'); setError(''); }}
            >
              <GraduationCap size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              Student Portal
            </button>
            <button
              className={`auth-tabs__tab ${role === 'speaker' ? 'auth-tabs__tab--active' : ''}`}
              onClick={() => { setRole('speaker'); setError(''); }}
            >
              <Mic2 size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              Speaker Portal
            </button>
          </div>

          <div className="auth-body">
            {/* Error Message */}
            {error && (
              <div className="auth-message auth-message--error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* ===== STUDENT PORTAL ===== */}
            {role === 'student' && (
              <>
                {/* Mode Toggle */}
                <div className="auth-mode-toggle">
                  <button
                    className={`auth-mode-toggle__btn ${studentMode === 'signin' ? 'auth-mode-toggle__btn--active' : ''}`}
                    onClick={() => { setStudentMode('signin'); setError(''); }}
                  >
                    Sign In
                  </button>
                  <button
                    className={`auth-mode-toggle__btn ${studentMode === 'create' ? 'auth-mode-toggle__btn--active' : ''}`}
                    onClick={() => { setStudentMode('create'); setError(''); }}
                  >
                    Create Account
                  </button>
                </div>

                {studentMode === 'signin' ? (
                  <form onSubmit={handleStudentSignIn}>
                    <div className="auth-field">
                      <label className="auth-field__label">Email Address</label>
                      <div className="auth-field__input-wrap">
                        <Mail size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type="email"
                          placeholder="your@university.edu"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">Password</label>
                      <div className="auth-field__input-wrap">
                        <Lock size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type={showPw ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="auth-field__toggle-pw"
                          onClick={() => setShowPw(!showPw)}
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="auth-submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Authenticating...' : 'Access the Cosmos'}
                      <ArrowRight size={18} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleStudentCreate}>
                    <div className="auth-field">
                      <label className="auth-field__label">Full Name</label>
                      <div className="auth-field__input-wrap">
                        <User size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type="text"
                          placeholder="John Doe"
                          value={createName}
                          onChange={(e) => setCreateName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">Email Address</label>
                      <div className="auth-field__input-wrap">
                        <Mail size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type="email"
                          placeholder="your@university.edu"
                          value={createEmail}
                          onChange={(e) => setCreateEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">Phone Number</label>
                      <div className="auth-field__input-wrap">
                        <Phone size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={createPhone}
                          onChange={(e) => setCreatePhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">College / Institution</label>
                      <div className="auth-field__input-wrap">
                        <Building size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type="text"
                          placeholder="Your college or university"
                          value={createCollege}
                          onChange={(e) => setCreateCollege(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">Branch / Stream</label>
                      <div className="auth-field__input-wrap">
                        <Layers size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type="text"
                          placeholder="Computer Science, IT, ECE..."
                          value={createBranch}
                          onChange={(e) => setCreateBranch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">Semester</label>
                      <div className="auth-field__input-wrap">
                        <GraduationCap size={16} className="auth-field__icon" />
                        <select
                          className="auth-field__select"
                          value={createSemester}
                          onChange={(e) => setCreateSemester(e.target.value)}
                        >
                          <option value="">Select Semester</option>
                          <option value="1st">1st Semester</option>
                          <option value="2nd">2nd Semester</option>
                          <option value="3rd">3rd Semester</option>
                          <option value="4th">4th Semester</option>
                          <option value="5th">5th Semester</option>
                          <option value="6th">6th Semester</option>
                          <option value="7th">7th Semester</option>
                          <option value="8th">8th Semester</option>
                        </select>
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-field__label">Create Password</label>
                      <div className="auth-field__input-wrap">
                        <Lock size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type={showPw ? 'text' : 'password'}
                          placeholder="Minimum 6 characters"
                          value={createPassword}
                          onChange={(e) => setCreatePassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="auth-field__toggle-pw"
                          onClick={() => setShowPw(!showPw)}
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="auth-submit" disabled={isSubmitting}>
                      <Sparkles size={18} />
                      {isSubmitting ? 'Creating Account...' : 'Launch Into the Cosmos'}
                      <ArrowRight size={18} />
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ===== SPEAKER PORTAL ===== */}
            {role === 'speaker' && (
              <>
                {/* Mode Toggle */}
                <div className="auth-mode-toggle">
                  <button
                    className={`auth-mode-toggle__btn ${speakerMode === 'password' ? 'auth-mode-toggle__btn--active' : ''}`}
                    onClick={() => { setSpeakerMode('password'); setError(''); }}
                  >
                    Secure Password
                  </button>
                  <button
                    className={`auth-mode-toggle__btn ${speakerMode === 'otp' ? 'auth-mode-toggle__btn--active' : ''}`}
                    onClick={() => { setSpeakerMode('otp'); setError(''); }}
                  >
                    Quick OTP Login
                  </button>
                </div>

                <form onSubmit={handleSpeakerLogin}>
                  <div className="auth-field">
                    <label className="auth-field__label">Speaker Registered Email</label>
                    <div className="auth-field__input-wrap">
                      <Mic2 size={16} className="auth-field__icon" />
                      <input
                        className="auth-field__input"
                        type="email"
                        placeholder="speaker@techblitz.com"
                        value={speakerEmail}
                        onChange={(e) => setSpeakerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {speakerMode === 'password' ? (
                    <div className="auth-field">
                      <label className="auth-field__label">Access Key / Password</label>
                      <div className="auth-field__input-wrap">
                        <ShieldCheck size={16} className="auth-field__icon" />
                        <input
                          className="auth-field__input"
                          type={showPw ? 'text' : 'password'}
                          placeholder="Enter your access key"
                          value={speakerPassword}
                          onChange={(e) => setSpeakerPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="auth-field__toggle-pw"
                          onClick={() => setShowPw(!showPw)}
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="auth-field__label" style={{ marginBottom: 6, display: 'block' }}>
                        6-Digit Verification Code
                      </label>
                      <div className="auth-otp-row">
                        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                          <KeyRound size={16} style={{ position: 'absolute', left: 12, color: 'var(--star-faint)' }} />
                          <input
                            className="auth-otp-row__input"
                            type="text"
                            maxLength={6}
                            placeholder="● ● ● ● ● ●"
                            value={speakerOtp}
                            onChange={(e) => setSpeakerOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            style={{ paddingLeft: 38 }}
                          />
                        </div>
                        <button
                          type="button"
                          className="auth-otp-row__send"
                          onClick={handleSendOtp}
                          disabled={otpCountdown > 0}
                        >
                          {otpCountdown > 0 ? `Resend ${otpCountdown}s` : otpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      </div>
                      {otpSent && (
                        <div className="auth-message auth-message--success" style={{ marginBottom: 16 }}>
                          <Sparkles size={14} />
                          Demo OTP: 123456
                        </div>
                      )}
                    </>
                  )}

                  <button type="submit" className="auth-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Authenticating Speaker...' : 'Authenticate Speaker Access'}
                    <ArrowRight size={18} />
                  </button>
                </form>
              </>
            )}

            {/* Demo Quick-Fill Pills */}
            <div className="auth-demo-pills">
              <span className="auth-demo-pills__label">Quick Demo Access</span>
              <button className="auth-demo-pill" onClick={() => fillDemo('student')}>
                🎓 Student
              </button>
              <button className="auth-demo-pill" onClick={() => fillDemo('speaker')}>
                🎙️ Speaker
              </button>
              <button className="auth-demo-pill" onClick={() => fillDemo('admin')}>
                ⚡ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          © 2026 Tech Blitz by Cosmos • All rights reserved
        </div>
      </div>
    </div>
  );
}
