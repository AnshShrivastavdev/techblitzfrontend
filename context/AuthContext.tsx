'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  loginUser,
  loginSpeaker,
  registerStudent,
  getUserById,
} from '@/services/storageService';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  speakerLogin: (email: string, password?: string) => { success: boolean; user?: User; error?: string };
  register: (userData: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'techblitz_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount and listen to Firebase auth state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen to real Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        // User is logged into Firebase
        const existingRaw = localStorage.getItem(SESSION_KEY);
        let currentRole: 'student' | 'speaker' | 'admin' = 'student';
        let localProfile: User | null = null;

        if (existingRaw) {
          try {
            const sess = JSON.parse(existingRaw);
            currentRole = sess.role || 'student';
            localProfile = getUserById(sess.id);
          } catch {
            // Ignore parse errors
          }
        }

        const syncedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || localProfile?.name || firebaseUser.email?.split('@')[0] || 'TechBlitz Participant',
          email: firebaseUser.email || '',
          role: currentRole,
          college: localProfile?.college || 'Jabalpur Engineering College',
          branch: localProfile?.branch || 'Computer Science & Engineering',
          semester: localProfile?.semester || '4th',
          rollNumber: localProfile?.rollNumber || '0201CS241001',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        setUser(syncedUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ id: syncedUser.id, role: syncedUser.role }));
      } else {
        // Fall back to local mock session if any
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          try {
            const session = JSON.parse(raw);
            const freshUser = getUserById(session.id);
            if (freshUser) {
              setUser({ ...freshUser, role: session.role || freshUser.role });
            }
          } catch {
            localStorage.removeItem(SESSION_KEY);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function persistSession(u: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: u.id, role: u.role }));
  }

  async function login(email: string, password?: string) {
    // 1. First attempt real Firebase Authentication if password provided
    if (password && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = cred.user;
        const role = email.includes('admin') ? 'admin' : 'student';
        const userObj: User = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email || email,
          role,
          college: 'Jabalpur Engineering College',
          createdAt: new Date().toISOString(),
        };
        setUser(userObj);
        persistSession(userObj);
        return { success: true, user: userObj };
      } catch (fbErr: any) {
        // If Firebase error is not user-not-found, or if local mock fallback is desired:
        console.warn('[Firebase Auth] Sign in notice:', fbErr?.code || fbErr?.message);
        // Fallback to local storage demo accounts if credentials match
        const localRes = loginUser(email, password);
        if (localRes.success && localRes.user) {
          setUser(localRes.user);
          persistSession(localRes.user);
          return localRes;
        }
        return { success: false, error: fbErr?.message || 'Invalid email or password' };
      }
    }

    // Fallback to local mock accounts
    const result = loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  function speakerLogin(email: string, password?: string) {
    const result = loginSpeaker(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function register(userData: Partial<User>) {
    // 1. Try real Firebase Authentication creation
    if (userData.email && userData.password && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const fbUser = cred.user;
        const role = userData.role || (userData.email.includes('admin') ? 'admin' : 'student');
        const userObj: User = {
          id: fbUser.uid,
          name: userData.name || fbUser.displayName || userData.email.split('@')[0],
          email: fbUser.email || userData.email,
          role,
          college: userData.college || 'Jabalpur Engineering College',
          branch: userData.branch || 'CSE',
          semester: userData.semester || '1st',
          rollNumber: userData.rollNumber || '',
          createdAt: new Date().toISOString(),
        };

        // Also save to local storage service
        registerStudent(userObj);
        setUser(userObj);
        persistSession(userObj);
        return { success: true, user: userObj };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] Registration notice:', fbErr?.code || fbErr?.message);
        return { success: false, error: fbErr?.message || 'Failed to create account with Firebase' };
      }
    }

    // Fallback to local storage
    const result = registerStudent(userData);
    if (result.success && result.user) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function loginWithGoogle() {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const role = fbUser.email?.includes('admin') ? 'admin' : 'student';
      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'TechBlitz Participant',
        email: fbUser.email || '',
        role,
        college: 'Jabalpur Engineering College',
        createdAt: new Date().toISOString(),
      };
      setUser(userObj);
      persistSession(userObj);
      return { success: true, user: userObj };
    } catch (err: any) {
      console.error('[Firebase Auth] Google sign in error:', err);
      return { success: false, error: err?.message || 'Google sign-in was cancelled or failed' };
    }
  }

  async function logout() {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      // Ignore signOut errors
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
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
      value={{ user, loading, login, speakerLogin, register, loginWithGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
