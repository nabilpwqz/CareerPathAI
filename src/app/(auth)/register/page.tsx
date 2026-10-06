'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { ThemeToggle } from '@/components/providers/ThemeProvider';
import { 
  Compass, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithFirebase, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Real-time password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    if (score <= 4) return { score: 3, label: 'Strong', color: 'bg-emerald-400' };
    return { score: 4, label: 'Excellent', color: 'bg-emerald-300' };
  }, [password]);

  // Standard Email/Password Registration via Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast('Please accept the Terms of Service to create your workspace.', 'error');
      return;
    }
    if (password.length < 6) {
      toast('Firebase requires passwords to be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await registerWithFirebase(name, email, password);
      if (res.success) {
        toast('Account successfully created via Firebase! Proceeding to career onboarding...', 'success');
        router.push('/onboarding');
      } else {
        toast(res.error || 'Registration failed. Please try a different email.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google 1-Click Sign-Up
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        toast('Account connected with Google! Moving to onboarding...', 'success');
        router.push('/onboarding');
      } else {
        toast(res.error || 'Google sign-up could not be completed.', 'error');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500/30 transition-colors duration-200">
      {/* Top right theme toggle and navigation */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/"
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
        >
          Home
        </Link>
      </div>

      {/* Radiant Background Blur */}
      <div className="absolute top-1/4 right-1/3 translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/3 translate-y-1/3 w-[450px] h-[450px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            CareerPath <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300">AI</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Unlock personalized ATS resume tailoring and autonomous career roadmaps
        </p>

        {/* Firebase Connected Indicator Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-400 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Firebase Authentication Protected</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 py-8 px-6 shadow-xl dark:shadow-2xl rounded-3xl sm:px-10 transition-colors">
          
          {/* Social Sign-Up Providers */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-white font-medium text-sm transition-all hover:border-slate-400 dark:hover:border-slate-600 shadow-sm disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Sign up with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-semibold tracking-wider">
                Or create account with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className="font-semibold text-white">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all duration-300 ${
                          step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950 h-4 w-4"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-snug">
                I agree to the{' '}
                <span className="text-slate-200">Terms of Service</span> and{' '}
                <span className="text-slate-200">Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading || !agreeTerms}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering with Firebase...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Start</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
