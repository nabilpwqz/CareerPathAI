'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  googleProvider, 
  githubProvider 
} from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string | null;
  authProvider?: 'firebase' | 'local' | 'demo';
}

export interface ProfileSummary {
  currentRole: string;
  targetRole: string;
  onboardingCompleted: boolean;
  skillsCount: number;
}

interface AuthContextType {
  user: AuthUser | null;
  profileSummary: ProfileSummary | null;
  loading: boolean;
  // Firebase specific methods
  loginWithFirebase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithFirebase: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithGithub: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  // Generic / Demo access methods
  login: (credentials: { email?: string; password?: string; isDemo?: boolean }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper: Synchronize Firebase authenticated user with backend persistence layer
  const syncFirebaseUserWithBackend = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const idToken = await fbUser.getIdToken();
      const res = await fetch('/api/v1/auth/firebase-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0],
          photoURL: fbUser.photoURL,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileSummary(data.profileSummary);
        return { success: true, user: data.user };
      } else {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.error || 'Failed to synchronize user session' };
      }
    } catch (err: any) {
      console.error('Session sync error:', err);
      return { success: false, error: err.message || 'Network error during session sync' };
    }
  }, []);

  // Fetch current active server session
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/auth/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setProfileSummary(data.profileSummary);
        } else {
          setUser(null);
          setProfileSummary(null);
        }
      } else {
        setUser(null);
        setProfileSummary(null);
      }
    } catch {
      setUser(null);
      setProfileSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      if (fbUser) {
        await syncFirebaseUserWithBackend(fbUser);
      } else {
        // Fall back to server session check (for Demo user or existing cookie)
        await refreshSession();
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [syncFirebaseUserWithBackend, refreshSession]);

  // Sign in with Firebase Email & Password
  const loginWithFirebase = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const syncRes = await syncFirebaseUserWithBackend(credential.user);
      if (!syncRes.success) {
        return { success: false, error: syncRes.error };
      }
      return { success: true };
    } catch (err: any) {
      const message = mapFirebaseError(err.code || err.message);
      return { success: false, error: message };
    }
  };

  // Sign up with Firebase Email & Password
  const registerWithFirebase = async (name: string, email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name && credential.user) {
        await updateProfile(credential.user, { displayName: name });
      }
      const syncRes = await syncFirebaseUserWithBackend(credential.user);
      if (!syncRes.success) {
        return { success: false, error: syncRes.error };
      }
      return { success: true };
    } catch (err: any) {
      const message = mapFirebaseError(err.code || err.message);
      return { success: false, error: message };
    }
  };

  // 1-Click Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const syncRes = await syncFirebaseUserWithBackend(credential.user);
      if (!syncRes.success) {
        return { success: false, error: syncRes.error };
      }
      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in window was closed before completing.' };
      }
      const message = mapFirebaseError(err.code || err.message);
      return { success: false, error: message };
    }
  };

  // 1-Click Sign in with GitHub
  const loginWithGithub = async () => {
    try {
      const credential = await signInWithPopup(auth, githubProvider);
      const syncRes = await syncFirebaseUserWithBackend(credential.user);
      if (!syncRes.success) {
        return { success: false, error: syncRes.error };
      }
      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in window was closed before completing.' };
      }
      const message = mapFirebaseError(err.code || err.message);
      return { success: false, error: message };
    }
  };

  // Send Password Reset Email via Firebase
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: `Password reset link sent to ${email}` };
    } catch (err: any) {
      const message = mapFirebaseError(err.code || err.message);
      return { success: false, error: message };
    }
  };

  // Universal Login (handles Firebase or 1-Click Demo)
  const login = async (credentials: { email?: string; password?: string; isDemo?: boolean }) => {
    if (credentials.isDemo) {
      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.error || 'Demo access failed' };
        }
        setUser(data.user);
        await refreshSession();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Demo access failed' };
      }
    }

    if (credentials.email && credentials.password) {
      return loginWithFirebase(credentials.email, credentials.password);
    }

    return { success: false, error: 'Missing credentials' };
  };

  // Universal Register
  const register = async (data: { name: string; email: string; password: string }) => {
    return registerWithFirebase(data.name, data.email, data.password);
  };

  // Universal Sign Out
  const logout = async () => {
    try {
      // Sign out from Firebase Auth
      await firebaseSignOut(auth).catch(() => {});
      // Invalidate backend cookie session
      await fetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      setUser(null);
      setProfileSummary(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profileSummary,
        loading,
        loginWithFirebase,
        registerWithFirebase,
        loginWithGoogle,
        loginWithGithub,
        sendPasswordReset,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// User-friendly Firebase error messages
function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is improperly formatted.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account was found with this email. Please check or sign up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This authentication method is currently disabled in your Firebase console.';
    case 'auth/popup-blocked':
      return 'The authentication popup was blocked by your browser. Please allow popups for this site.';
    default:
      return code.replace('auth/', '').replace(/-/g, ' ');
  }
}
