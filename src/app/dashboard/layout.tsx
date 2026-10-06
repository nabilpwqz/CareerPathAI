'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { ThemeToggle } from '@/components/providers/ThemeProvider';
import {
  Compass,
  LayoutDashboard,
  FileText,
  Map,
  Sparkles,
  MessageSquare,
  Briefcase,
  Target,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'ATS Resume Studio', href: '/dashboard/resumes', icon: FileText },
  { name: 'Career Roadmaps', href: '/dashboard/roadmaps', icon: Map },
  { name: 'Skill Gap Analyzer', href: '/dashboard/skills', icon: Target },
  { name: 'STAR Interview Studio', href: '/dashboard/interviews', icon: MessageSquare },
  { name: 'Job Fit Analyzer', href: '/dashboard/job-analysis', icon: Briefcase },
  { name: 'AI Career Advisor', href: '/dashboard/ai-assistant', icon: Sparkles },
  { name: 'Career Profile', href: '/dashboard/profile', icon: User },
  { name: 'Admin Telemetry', href: '/dashboard/admin', icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profileSummary, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Compass className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-bold text-slate-950 dark:text-white text-base">CareerPath AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between shrink-0 z-40 fixed md:sticky top-0 h-screen overflow-y-auto transition-colors`}
      >
        <div>
          {/* Logo & Theme Toggle Header */}
          <div className="hidden md:flex items-center justify-between mb-8 px-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Compass className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">CareerPath</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-bold ml-1 text-lg">AI</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation links */}
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
            Platform Modules
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session Footer in Sidebar */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800/80 mt-5">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 mb-3 flex items-center gap-3">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={user.name || 'User'}
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-sm shadow-emerald-500/20">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="truncate flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-950 dark:text-white truncate flex items-center gap-1.5">
                <span className="truncate">{user?.name || 'Authorized User'}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {profileSummary?.targetRole || user?.email || 'Candidate'}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {user?.authProvider === 'firebase' ? 'Firebase' : user?.role || 'Active'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/40 bg-white dark:bg-slate-900/40 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition-all group shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full transition-colors">
        {children}
      </main>
    </div>
  );
}
