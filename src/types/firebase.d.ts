declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
    [key: string]: any;
  }
  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
}

declare module 'firebase/auth' {
  import { FirebaseApp } from 'firebase/app';

  export interface UserInfo {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    uid: string;
  }

  export interface User extends UserInfo {
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: {
      creationTime?: string;
      lastSignInTime?: string;
    };
    providerData: UserInfo[];
    refreshToken: string;
    tenantId: string | null;
    delete(): Promise<void>;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<any>;
    reload(): Promise<void>;
  }

  export interface UserCredential {
    user: User;
    providerId: string | null;
    operationType: string;
  }

  export interface AuthProvider {
    providerId: string;
  }

  export class GoogleAuthProvider implements AuthProvider {
    providerId: string;
    static readonly PROVIDER_ID: string;
    addScope(scope: string): GoogleAuthProvider;
    setCustomParameters(customOAuthParameters: Record<string, string>): GoogleAuthProvider;
  }

  export class GithubAuthProvider implements AuthProvider {
    providerId: string;
    static readonly PROVIDER_ID: string;
    addScope(scope: string): GithubAuthProvider;
    setCustomParameters(customOAuthParameters: Record<string, string>): GithubAuthProvider;
  }

  export interface Auth {
    app: FirebaseApp;
    currentUser: User | null;
    signOut(): Promise<void>;
  }

  export function getAuth(app?: FirebaseApp): Auth;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function signInWithPopup(auth: Auth, provider: AuthProvider): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
  export function sendPasswordResetEmail(auth: Auth, email: string): Promise<void>;
  export function updateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void>;
  export function onAuthStateChanged(
    auth: Auth,
    nextOrObserver: (user: User | null) => void,
    error?: (error: Error) => void,
    completed?: () => void
  ): () => void;
}

declare module 'firebase/analytics' {
  import { FirebaseApp } from 'firebase/app';

  export interface Analytics {
    app: FirebaseApp;
  }

  export function getAnalytics(app?: FirebaseApp): Analytics;
  export function isSupported(): Promise<boolean>;
}
