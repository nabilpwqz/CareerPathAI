import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  Auth 
} from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Firebase configuration for CareerPath AI
// Values are strictly loaded from environment variables to prevent secret leakage.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Safe fallback config to ensure build/SSR pipelines do not crash when env vars are not set
const activeConfig = firebaseConfig.apiKey ? firebaseConfig : {
  apiKey: "AIzaSy_DEMO_KEY_CONFIGURE_IN_ENV_ONLY",
  authDomain: "careerpath-demo.firebaseapp.com",
  projectId: "careerpath-demo",
  storageBucket: "careerpath-demo.appspot.com",
  messagingSenderId: "100000000000",
  appId: "1:100000000000:web:0000000000000000000000",
  measurementId: "G-DEMO000000"
};

// Initialize Firebase App safely for both SSR and Client-side hydration
const app: FirebaseApp = !getApps().length ? initializeApp(activeConfig) : getApp();

// Auth instance
const auth: Auth = getAuth(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const githubProvider = new GithubAuthProvider();

// Analytics (Client-side only)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported: boolean) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.debug('Firebase analytics initialization skipped:', err);
      }
    }
  }).catch(() => {
    // Analytics unsupported in current browser/sandbox
  });
}

export { app, auth, googleProvider, githubProvider, analytics };
export default app;
