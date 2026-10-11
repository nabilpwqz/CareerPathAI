'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Layers,
  Building
} from 'lucide-react';

export default function JobAnalysisPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('Senior AI Systems Engineer');
  const [company, setCompany] = useState('Anthropic / Scale AI');
  const [rawDescription, setRawDescription] = useState(
    `We are seeking a Senior AI Systems Engineer to join our infrastructure team. You will architect distributed agentic workflows, integrate state-of-the-art LLMs, and optimize high-throughput retrieval pipelines.
Requirements:
- 4+ years software engineering experience in Python or TypeScript.
- Strong knowledge of vector databases (Qdrant, Pinecone, or FAISS) and semantic retrieval.
- Hands-on experience with Next.js, Docker, Kubernetes, and PostgreSQL.
- Understanding of prompt security, prompt injection defenses, and structured JSON output validation.`
  );

  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch('/api/v1/jobs/analyze');
      if (res.ok) {
        const d = await res.json();
        setSavedAnalyses(d.analyses || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleAnalyze = async () => {
    if (!rawDescription.trim() || rawDescription.trim().length < 20) {
      toast('Please paste a job description of at least 20 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/jobs/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          company,
          rawDescription,
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Job analysis failed');

      setActiveAnalysis(d.analysis);
      toast('Job description analyzed successfully!', 'success');
      await fetchAnalyses();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            Job Fit Alignment Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Job Description Analyzer
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Extract hiring requirements, benchmark against your active profile, and identify missing qualifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Form */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Paste Job Details</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Target Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Full Job Description</label>
            <textarea
              rows={10}
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 leading-relaxed shadow-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? 'Evaluating Alignment...' : 'Extract & Compute Alignment'}
            </button>
          </div>
        </div>

        {/* Right: Analysis Results */}
        <div>
          {activeAnalysis ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{activeAnalysis.company}</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeAnalysis.jobTitle}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Alignment Fit</div>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{activeAnalysis.alignmentScore}%</div>
                </div>
              </div>

              {/* Matching vs Missing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/20 shadow-xs">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Matching Skills ({activeAnalysis.matchingSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeAnalysis.matchingSkills?.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-rose-500/20 shadow-xs">
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Gaps ({activeAnalysis.missingSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeAnalysis.missingSkills?.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-slate-200 dark:border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tailoring Advice */}
              {activeAnalysis.tailoringAdvice?.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">
                    Actionable Application Advice
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeAnalysis.tailoringAdvice.map((adv: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
              <Briefcase className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Awaiting Job Description</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paste any job posting on the left and click &quot;Extract & Compute Alignment&quot; to see keyword breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// [build-audit: 76] verified code formatting
