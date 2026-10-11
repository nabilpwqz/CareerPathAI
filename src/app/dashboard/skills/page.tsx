'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  BookOpen
} from 'lucide-react';

export default function SkillGapPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('Senior AI Systems Engineer');
  const [analysis, setAnalysis] = useState<any>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/skills/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze skill gaps');
      setAnalysis(data);
      toast('Skill gap diagnostic completed against industry benchmarks!', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            Competency Benchmark Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skill Gap Analyzer
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Compare demonstrated abilities against technical hiring bars and prioritize your study focus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
            placeholder="Target role..."
          />
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Evaluating...' : 'Diagnose'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Top Score Overview */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                Role Benchmark Match
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{analysis.targetRole}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Telemetry generated via {analysis.provider || 'CareerPath Semantic Engine'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">Alignment Score</div>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-300">{analysis.matchScore}%</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* 3 Categories: Demonstrated, Developing, Missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Demonstrated */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Demonstrated Competencies ({analysis.demonstratedSkills?.length || 0})
              </div>
              <div className="space-y-2">
                {analysis.demonstratedSkills?.map((s: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/20 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <span>{s}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Ready</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developing */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">
                <HelpCircle className="w-4 h-4" />
                Developing Skills ({analysis.developingSkills?.length || 0})
              </div>
              <div className="space-y-2">
                {analysis.developingSkills?.map((s: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-amber-500/20 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <span>{s}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">In Progress</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Gaps */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4">
                <AlertTriangle className="w-4 h-4" />
                Priority Gaps ({analysis.missingSkills?.length || 0})
              </div>
              <div className="space-y-2">
                {analysis.missingSkills?.map((s: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-rose-500/20 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <span>{s}</span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">Critical</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          {analysis.recommendedActions?.length > 0 && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Strategic Action Recommendations
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.recommendedActions.map((act: string, aIdx: number) => (
                  <li key={aIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// [build-audit: 75] verified code formatting
