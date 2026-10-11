'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Target,
  BookOpen,
  FolderGit2,
  RefreshCw
} from 'lucide-react';

export default function CareerRoadmapsPage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [targetRoleInput, setTargetRoleInput] = useState('Senior AI Systems Engineer');
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [timelineMonths, setTimelineMonths] = useState(6);
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);

  const fetchRoadmaps = async () => {
    try {
      const res = await fetch('/api/v1/career/roadmaps');
      if (res.ok) {
        const d = await res.json();
        setRoadmaps(d.roadmaps || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setWorkflowSteps([
      { stepName: 'Intake: Parsing Role Constraints', status: 'in_progress' },
    ]);

    try {
      const res = await fetch('/api/v1/career/roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: targetRoleInput,
          weeklyStudyHours: weeklyHours,
          timelineMonths,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate roadmap');

      setWorkflowSteps(data.steps || []);
      toast('Agentic Career Roadmap generated and persisted!', 'success');
      await fetchRoadmaps();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (roadmapId: string, taskId: string, completed: boolean) => {
    try {
      const res = await fetch('/api/v1/career/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId, taskId, completed: !completed }),
      });
      if (res.ok) {
        await fetchRoadmaps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeRoadmap = roadmaps[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Map className="w-3.5 h-3.5" />
            Agentic Planning Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Career Roadmap
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Structured milestone phases, study budgeting, and portfolio capstone projects validated against hiring benchmarks.
          </p>
        </div>
      </div>

      {/* Roadmap Configuration & Generation Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          Roadmap Calibration Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Target Technical Role</label>
            <input
              type="text"
              value={targetRoleInput}
              onChange={(e) => setTargetRoleInput(e.target.value)}
              placeholder="e.g. Senior AI Systems Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Weekly Study Hours</label>
            <input
              type="number"
              min={2}
              max={50}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Target Timeline (Months)</label>
            <input
              type="number"
              min={1}
              max={24}
              value={timelineMonths}
              onChange={(e) => setTimelineMonths(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {workflowSteps.length > 0 && (
          <div className="mb-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-300">Agentic Orchestration Pipeline:</span>
            {workflowSteps.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {s.stepName}: {s.details || 'Completed'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateRoadmap}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Synthesizing Agentic Plan...' : 'Generate / Recalculate Roadmap'}
          </button>
        </div>
      </div>

      {/* Active Roadmap Display */}
      {activeRoadmap ? (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                Active Career Blueprint
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{activeRoadmap.targetRole}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Estimated Duration: {activeRoadmap.estimatedMonths} Months • {activeRoadmap.weeklyStudyHours} hrs/week
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">Readiness Score</div>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-300">{activeRoadmap.readinessScore}%</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 text-lg">
                <Target className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-6">
            {activeRoadmap.phases?.map((phase: any) => (
              <div
                key={phase.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                      P{phase.phaseNumber}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{phase.phaseTitle}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{phase.objective}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 w-fit">
                    {phase.durationWeeks} Weeks
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Actionable Milestones & Practice Tasks
                  </div>
                  {phase.tasks?.map((t: any) => (
                    <div
                      key={t.id}
                      onClick={() => handleToggleTask(activeRoadmap._id, t.id, t.completed)}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/70 dark:bg-slate-950/70 flex items-start gap-3 cursor-pointer transition-colors group shadow-xs"
                    >
                      <div className="mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            t.completed
                              ? 'bg-emerald-600 border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500 text-white dark:text-slate-950'
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
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {t.category}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                              {t.estimatedHours}h
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggested Portfolio Capstone Project */}
                {phase.suggestedProject && (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">
                      <FolderGit2 className="w-4 h-4" />
                      Suggested Portfolio Capstone Project
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{phase.suggestedProject.title}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {phase.suggestedProject.description}
                    </p>
                    {phase.suggestedProject.keyDeliverables && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {phase.suggestedProject.keyDeliverables.map((del: string, dIdx: number) => (
                          <span
                            key={dIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs"
                          >
                            ✓ {del}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
          <Map className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Roadmap</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
            Click &quot;Generate / Recalculate Roadmap&quot; above to synthesize a personalized multi-phase learning path.
          </p>
        </div>
      )}
    </div>
  );
}

// [build-audit: 74] verified code formatting
