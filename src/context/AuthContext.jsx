import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/config/firebase';
import { fetchWithAuth } from '@/services/api';
import {
  loginUser,
  loginSpeaker,
  registerStudent,
  getUserById,
} from '@/services/storageService';

const AuthContext = createContext(null);

const SESSION_KEY = 'techblitz_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured()) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const res = await fetchWithAuth('/me');
            if (res.ok && res.data?.user) {
              const remoteUser = res.data.user;
              setUser(remoteUser);
              persistSession(remoteUser);
            } else {
              // Graceful fallback if backend server is not running
              const fallbackRole =
                firebaseUser.email?.toLowerCase().includes('admin') ? 'admin' : 'student';
              const localUser = {
                id: firebaseUser.uid,
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || 'TechBlitz Participant',
                email: firebaseUser.email,
                role: fallbackRole,
              };
              setUser(localUser);
              persistSession(localUser);
            }
          } catch (e) {
            console.warn('[AuthContext] Backend sync notice:', e.message);
          }
        } else {
          // Firebase reports no active user
          const raw = localStorage.getItem(SESSION_KEY);
          if (raw) {
            try {
              const session = JSON.parse(raw);
              const freshUser = getUserById(session.id);
              if (freshUser) {
                setUser({ ...freshUser, role: session.role });
              } else {
                setUser(null);
              }
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
    } else {
      // Offline fallback: restore session from local storage
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        try {
          const session = JSON.parse(raw);
          const freshUser = getUserById(session.id);
          if (freshUser) {
            setUser({ ...freshUser, role: session.role });
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  function persistSession(u) {
    if (!u) return;
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id: u._id || u.id || u.firebaseUid, role: u.role })
    );
  }

  async function login(email, password) {
    if (isFirebaseConfigured()) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const res = await fetchWithAuth('/me');
        let loggedUser = res.ok && res.data?.user ? res.data.user : null;

        if (!loggedUser) {
          const isAdminEmail =
            email.toLowerCase().includes('admin') ||
            email.toLowerCase() === 'admin@techblitz.com';
          loggedUser = {
            id: cred.user.uid,
            firebaseUid: cred.user.uid,
            email: cred.user.email,
            name: cred.user.displayName || 'TechBlitz Participant',
            role: isAdminEmail ? 'admin' : 'student',
          };
        }

        setUser(loggedUser);
        persistSession(loggedUser);
        return { success: true, user: loggedUser };
      } catch (err) {
        console.error('[Firebase Login Error]:', err.code, err.message);
        let userMessage = 'Authentication failed. Please check your credentials.';
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          userMessage = 'Invalid email or password.';
        } else if (err.code === 'auth/user-not-found') {
          userMessage = 'No account found with this email.';
        } else if (err.code === 'auth/too-many-requests') {
          userMessage = 'Too many attempts. Please try again later.';
        }
        return { success: false, error: userMessage };
      }
    }

    // Offline / Demo fallback
    const result = loginUser(email, password);
    if (result.success) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function speakerLogin(email, password) {
    if (isFirebaseConfigured()) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const res = await fetchWithAuth('/me');
        let loggedUser = res.ok && res.data?.user ? res.data.user : null;

        if (!loggedUser) {
          loggedUser = {
            id: cred.user.uid,
            firebaseUid: cred.user.uid,
            email: cred.user.email,
            name: cred.user.displayName || 'TechBlitz Speaker',
            role: 'speaker',
          };
        }

        setUser(loggedUser);
        persistSession(loggedUser);
        return { success: true, user: loggedUser };
      } catch (err) {
        console.error('[Firebase Speaker Login Error]:', err.code, err.message);
        return { success: false, error: 'Invalid speaker email or password.' };
      }
    }

    // Offline / Demo fallback
    const result = loginSpeaker(email, password);
    if (result.success) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function register(userData) {
    if (isFirebaseConfigured()) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

        if (userData.name) {
          await updateProfile(cred.user, { displayName: userData.name });
        }

        // Post profile details to server
        await fetchWithAuth('/me/profile', {
          method: 'POST',
          body: JSON.stringify({
            name: userData.name,
            phone: userData.phone || '',
            institution: userData.college || '',
            branch: userData.branch || '',
            semester: userData.semester || '',
          }),
        });

        const res = await fetchWithAuth('/me');
        let newUser = res.ok && res.data?.user ? res.data.user : null;

        if (!newUser) {
          newUser = {
            id: cred.user.uid,
            firebaseUid: cred.user.uid,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            college: userData.college,
            branch: userData.branch,
            semester: userData.semester,
            role: 'student',
          };
        }

        setUser(newUser);
        persistSession(newUser);
        return { success: true, user: newUser };
      } catch (err) {
        console.error('[Firebase Register Error]:', err.code, err.message);
        let userMessage = err.message;
        if (err.code === 'auth/email-already-in-use') {
          userMessage = 'An account with this email already exists.';
        } else if (err.code === 'auth/weak-password') {
          userMessage = 'Password should be at least 6 characters.';
        }
        return { success: false, error: userMessage };
      }
    }

    // Offline / Demo fallback
    const result = registerStudent(userData);
    if (result.success) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function logout() {
    try {
      if (isFirebaseConfigured()) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('[Logout Notice]:', e.message);
    }
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  function refreshUser() {
    if (!user) return;
    const fresh = getUserById(user.id);
    if (fresh) {
      const updated = { ...fresh, role: user.role };
      setUser(updated);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, speakerLogin, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
