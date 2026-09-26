import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthPage from '@/pages/AuthPage';
import LandingPage from '@/pages/LandingPage';
import DashboardStudent from '@/pages/DashboardStudent';
import DashboardSpeaker from '@/pages/DashboardSpeaker';
import DashboardAdmin from '@/pages/DashboardAdmin';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040407', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040407', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading...
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'speaker') return <Navigate to="/speaker/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public / Guest Auth Routes */}
      <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/speaker/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><AuthPage /></GuestRoute>} />

      {/* Protected Dashboards */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/speaker/dashboard"
        element={
          <ProtectedRoute allowedRoles={['speaker']}>
            <DashboardSpeaker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
