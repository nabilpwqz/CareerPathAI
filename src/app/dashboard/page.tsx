'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Sparkles,
  FileText,
  Map,
  Target,
  CheckCircle2,
  ArrowRight,
  Award,
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, resRes, rdmRes, intRes] = await Promise.all([
        fetch('/api/v1/profile'),
        fetch('/api/v1/resumes'),
        fetch('/api/v1/career/roadmaps'),
        fetch('/api/v1/interviews/sessions'),
      ]);

      if (profRes.ok) {
        const d = await profRes.json();
        setProfile(d.profile);
      }
      if (resRes.ok) {
        const d = await resRes.json();
        setResumes(d.resumes || []);
      }
      if (rdmRes.ok) {
        const d = await rdmRes.json();
        setRoadmaps(d.roadmaps || []);
      }
      if (intRes.ok) {
        const d = await intRes.json();
        setInterviews(d.interviews || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute live metrics
  const activeRoadmap = roadmaps[0];
  let totalTasks = 0;
  let completedTasks = 0;
  if (activeRoadmap?.phases) {
    activeRoadmap.phases.forEach((p: any) => {
      p.tasks?.forEach((t: any) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
  }
  const roadmapProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : activeRoadmap?.readinessScore || 0;

  const topAtsScore = resumes.length > 0 ? Math.max(...resumes.map((r) => r.atsScore || 75)) : 0;
  const profileCompletePct = profile?.onboardingCompleted ? 100 : 40;

  const handleTaskToggle = async (roadmapId: string, taskId: string, currentCompleted: boolean) => {
    try {
      const res = await fetch('/api/v1/career/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId, taskId, completed: !currentCompleted }),
      });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Career Intelligence Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Targeting{' '}
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{profile?.targetRole || 'Senior AI Engineer'}</span> in{' '}
            <span className="text-slate-800 dark:text-slate-300 font-medium">{profile?.targetIndustry || 'Technology'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resumes/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20"
          >
            <FileText className="w-4 h-4" />
            Create ATS Resume
          </Link>
          <Link
            href="/dashboard/roadmaps"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shadow-sm"
          >
            <Map className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Recalculate Roadmap
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Profile Completion */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-3">
              <span>Profile Health</span>
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{profileCompletePct}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {profile?.skills?.length || 0} demonstrated skills cataloged
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${profileCompletePct}%` }} />
          </div>
        </div>

        {/* ATS Resume Readiness */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-3">
              <span>Best ATS Score</span>
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-300">
              {topAtsScore > 0 ? `${topAtsScore}%` : 'Not Built'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {resumes.length} saved version{resumes.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${topAtsScore || 0}%` }} />
          </div>
        </div>

        {/* Roadmap Progress */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-3">
              <span>Roadmap Readiness</span>
              <Map className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">{roadmapProgressPct}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {completedTasks} of {totalTasks} milestones completed
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${roadmapProgressPct}%` }} />
          </div>
        </div>

        {/* Interview Simulation */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-3">
              <span>Interview Score</span>
              <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-300">
              {interviews.length > 0 && interviews[0].overallScore ? `${interviews[0].overallScore}%` : '84% (Avg)'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {interviews.length} practice session{interviews.length === 1 ? '' : 's'} logged
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: '84%' }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Roadmap Tasks & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Roadmap Tasks & Skill Gaps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Roadmap Milestone Section */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Roadmap Tasks</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phase 1 Milestones for {profile?.targetRole || 'Senior AI Systems Engineer'}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/roadmaps"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
              >
                View Full Map
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeRoadmap?.phases?.[0]?.tasks ? (
              <div className="space-y-3">
                {activeRoadmap.phases[0].tasks.slice(0, 4).map((t: any) => (
                  <div
                    key={t.id}
                    onClick={() => handleTaskToggle(activeRoadmap._id, t.id, t.completed)}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/60 flex items-start gap-3 cursor-pointer transition-colors group shadow-xs"
                  >
                    <div className="mt-0.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          t.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white dark:text-slate-950'
                            : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {t.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                          {t.estimatedHours}h
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No active roadmap generated yet.</p>
                <Link
                  href="/dashboard/roadmaps"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs"
                >
                  Generate 3-Phase Roadmap Now
                </Link>
              </div>
            )}
          </div>

          {/* ATS Resumes Table / Status */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Saved ATS Resumes</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verifiable documents tailored to job descriptions</p>
                </div>
              </div>
              <Link
                href="/dashboard/resumes"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
              >
                Manage All ({resumes.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {resumes.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {resumes.slice(0, 3).map((r) => (
                  <div key={r._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-200 text-sm">{r.title}</div>
                      <div className="text-slate-500 dark:text-slate-400">
                        Target Role: <span className="text-slate-700 dark:text-slate-300">{r.targetRole}</span> • v{r.version}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold">
                        {r.atsScore || 85}% ATS Score
                      </span>
                      <Link
                        href={`/dashboard/resumes/new?editId=${r._id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">No resumes saved in database.</p>
                <Link
                  href="/dashboard/resumes/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs"
                >
                  Build Your First Resume
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Recommended Actions & Skill Gap Snapshot */}
        <div className="space-y-6">
          {/* Recommended Next Actions */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Next Strategic Actions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-xs">
                <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Tailor Resume to a Job Post</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  Paste a real job description from LinkedIn or Indeed to compute keyword match percentage.
                </p>
                <Link
                  href="/dashboard/resumes/new"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  Open Studio <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-xs">
                <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Run Skill Gap Diagnostic</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  Identify high-demand missing competencies against {profile?.targetRole || 'Senior AI Engineer'}.
                </p>
                <Link
                  href="/dashboard/skills"
                  className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 inline-flex items-center gap-1"
                >
                  Analyze Skills <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-xs">
                <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Practice STAR Interview Answer</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  Simulate architectural and behavioral questions with instant rubric scoring.
                </p>
                <Link
                  href="/dashboard/interviews"
                  className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 inline-flex items-center gap-1"
                >
                  Start Simulation <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Fast AI Career Assistant Prompt Box */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Career AI Quick Query
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Need immediate salary benchmarking or interview negotiation guidance?
            </p>
            <Link
              href="/dashboard/ai-assistant"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
            >
              Chat With Career Assistant
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
