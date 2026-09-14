'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  loginUser,
  loginSpeaker,
  registerStudent,
  getUserById,
} from '@/services/storageService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => { success: boolean; user?: User; error?: string };
  speakerLogin: (email: string, password?: string) => { success: boolean; user?: User; error?: string };
  register: (userData: Partial<User>) => { success: boolean; user?: User; error?: string };
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'techblitz_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        const freshUser = getUserById(session.id);
        if (freshUser) {
          setUser({ ...freshUser, role: session.role || freshUser.role });
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  function persistSession(u: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: u.id, role: u.role }));
  }

  function login(email: string, password?: string) {
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

  function register(userData: Partial<User>) {
    const result = registerStudent(userData);
    if (result.success && result.user) {
      setUser(result.user);
      persistSession(result.user);
    }
    return result;
  }

  function logout() {
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
      value={{ user, loading, login, speakerLogin, register, logout, refreshUser }}
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
