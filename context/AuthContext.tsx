'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  loginUser,
  registerStudent,
  getUserById,
  isAdminEmail,
  upsertUser,
  getAllUsers,
} from '@/services/storageService';
import { syncStudentToCloud } from '@/services/realtimeUserService';
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
  register: (userData: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'techblitz_session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://techblitzfrontend.onrender.com/api';

function formatAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please verify your credentials or register for an account.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in with your password or use Google Sign-In.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups or use Email & Password.';
    case 'auth/unauthorized-domain': {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'techblitzfrontend.vercel.app';
      return `Domain (${currentHost}) is not authorized for Google OAuth in Firebase Console. Please add "${currentHost}" under Firebase Console > Authentication > Settings > Authorized Domains, or sign in below with Email & Password.`;
    }
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in provider is disabled in Firebase Console. Please enable Email/Password under Firebase Authentication > Sign-in method.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return error?.message || 'Authentication failed. Please verify your details.';
  }
}

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
        let localProfile: User | null = null;
        let sessRole: string | null = null;

        if (existingRaw) {
          try {
            const sess = JSON.parse(existingRaw);
            sessRole = sess.role || null;
            localProfile = getUserById(sess.id) || null;
          } catch {
            // Ignore parse errors
          }
        }
        if (!localProfile && firebaseUser.uid) {
          localProfile = getUserById(firebaseUser.uid) || null;
        }

        const isAdmin = Boolean(
          (firebaseUser.email && isAdminEmail(firebaseUser.email)) ||
          localProfile?.role === 'admin' ||
          sessRole === 'admin'
        );
        const currentRole: 'student' | 'admin' = isAdmin ? 'admin' : 'student';

        const syncedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || localProfile?.name || firebaseUser.email?.split('@')[0] || 'TechBlitz Participant',
          email: firebaseUser.email || '',
          role: currentRole,
          college: localProfile?.college || 'Jabalpur Engineering College',
          branch: localProfile?.branch || '',
          semester: localProfile?.semester || '',
          rollNumber: localProfile?.rollNumber || '',
          phone: localProfile?.phone || '',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };

        upsertUser(syncedUser);
        syncStudentToCloud(syncedUser);
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
              const isAdmin = Boolean(isAdminEmail(freshUser.email) || freshUser.role === 'admin' || session.role === 'admin');
              const role: 'student' | 'admin' = isAdmin ? 'admin' : 'student';
              setUser({ ...freshUser, role });
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
    const cleanEmail = email.toLowerCase().trim();

    // 1. First attempt real Firebase Authentication if password provided
    if (password && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = cred.user;
        const role: 'student' | 'admin' = isAdminEmail(cleanEmail) ? 'admin' : 'student';
        const userObj: User = {
          id: fbUser.uid,
          name: fbUser.displayName || cleanEmail.split('@')[0],
          email: fbUser.email || cleanEmail,
          role,
          college: 'Jabalpur Engineering College',
          createdAt: new Date().toISOString(),
        };
        upsertUser(userObj);
        syncStudentToCloud(userObj);
        setUser(userObj);
        persistSession(userObj);
        return { success: true, user: userObj };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] Sign in notice:', fbErr?.code || fbErr?.message);
        
        // 2. Check local registered accounts
        const localRes = loginUser(cleanEmail, password);
        if (localRes.success && localRes.user) {
          setUser(localRes.user);
          persistSession(localRes.user);
          syncStudentToCloud(localRes.user);
          return localRes;
        }

        // 3. Fallback: Check if account exists locally in storage
        const allUsers = getAllUsers();
        const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (existing && (!existing.password || existing.password === password)) {
          setUser(existing);
          persistSession(existing);
          return { success: true, user: existing };
        }

        return { success: false, error: formatAuthError(fbErr) };
      }
    }

    // Fallback to local mock accounts
    const result = loginUser(cleanEmail, password);
    if (result.success && result.user) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function register(userData: Partial<User>) {
    if (!userData.email) return { success: false, error: 'Email is required.' };
    const cleanEmail = userData.email.toLowerCase().trim();

    // 1. Try real Firebase Authentication creation
    if (userData.password && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
        const fbUser = cred.user;
        const role: 'student' | 'admin' = isAdminEmail(cleanEmail) ? 'admin' : 'student';
        const userObj: User = {
          id: fbUser.uid,
          name: userData.name || fbUser.displayName || cleanEmail.split('@')[0],
          email: fbUser.email || cleanEmail,
          role,
          college: userData.college || 'Jabalpur Engineering College',
          branch: userData.branch || 'CSE',
          semester: userData.semester || '1st',
          rollNumber: userData.rollNumber || '',
          phone: userData.phone || '',
          createdAt: new Date().toISOString(),
        };

        // Also save to local storage service & Cloud
        upsertUser(userObj);
        syncStudentToCloud(userObj);
        setUser(userObj);
        persistSession(userObj);
        return { success: true, user: userObj };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] Registration notice:', fbErr?.code || fbErr?.message);
        
        // If email already in use, inform user clearly
        if (fbErr?.code === 'auth/email-already-in-use') {
          return {
            success: false,
            error: 'This email is already registered. Please sign in with your password, or use Google Sign-In.',
          };
        }

        // If Firebase threw operation-not-allowed or network failure, register student via database & cloud
        if (
          fbErr?.code === 'auth/operation-not-allowed' ||
          fbErr?.code === 'auth/network-request-failed' ||
          fbErr?.code === 'auth/internal-error'
        ) {
          const role: 'student' | 'admin' = isAdminEmail(cleanEmail) ? 'admin' : 'student';
          const localUser: User = {
            id: 'std_' + Math.random().toString(36).slice(2, 9),
            name: userData.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            password: userData.password,
            role,
            college: userData.college || 'Jabalpur Engineering College',
            branch: userData.branch || 'CSE',
            semester: userData.semester || '1st',
            rollNumber: userData.rollNumber || '',
            phone: userData.phone || '',
            createdAt: new Date().toISOString(),
          };
          upsertUser(localUser);
          syncStudentToCloud(localUser);
          setUser(localUser);
          persistSession(localUser);
          return { success: true, user: localUser };
        }

        return { success: false, error: formatAuthError(fbErr) };
      }
    }

    // Fallback to local storage
    const result = registerStudent({ ...userData, email: cleanEmail });
    if (result.success && result.user) {
      syncStudentToCloud(result.user);
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  async function loginWithGoogle() {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const cleanEmail = (fbUser.email || '').toLowerCase().trim();
      const role: 'student' | 'admin' = isAdminEmail(cleanEmail) ? 'admin' : 'student';
      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split('@')[0] || 'TechBlitz Participant',
        email: cleanEmail,
        role,
        college: 'Jabalpur Engineering College',
        createdAt: new Date().toISOString(),
      };
      upsertUser(userObj);
      syncStudentToCloud(userObj);
      setUser(userObj);
      persistSession(userObj);
      return { success: true, user: userObj };
    } catch (err: any) {
      console.error('[Firebase Auth] Google sign in error:', err?.code, err?.message);
      return { success: false, error: formatAuthError(err) };
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
      value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}
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
