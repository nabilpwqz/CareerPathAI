'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/providers/ToastProvider';
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export default function ResumesListPage() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/resumes');
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`/api/v1/resumes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Resume deleted successfully', 'success');
        setResumes(resumes.filter((r) => r._id !== id));
      } else {
        toast('Failed to delete resume', 'error');
      }
    } catch {
      toast('Error deleting resume', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ATS Resume Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Build, tailor, and export high-conversion ATS-compliant resumes verified against target jobs.
          </p>
        </div>

        <Link
          href="/dashboard/resumes/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Create New Resume
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No resumes created yet</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
            Create an ATS-optimized resume from your career profile or tailor one directly to a target job description.
          </p>
          <Link
            href="/dashboard/resumes/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            Build Your First Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((r) => (
            <div
              key={r._id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    {r.atsScore || 85}% ATS Score
                  </span>
                  <span className="text-slate-500">v{r.version || 1}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{r.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                  Target Role: <span className="text-slate-800 dark:text-slate-300 font-semibold">{r.targetRole}</span>
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {r.summary || 'No summary provided.'}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                  <span>{r.experiences?.length || 0} Positions</span>
                  <span>{r.skills?.length || 0} Skills</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/dashboard/resumes/new?editId=${r._id}`}
                  className="flex-1 text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Edit & Tailor
                </Link>

                <button
                  onClick={() => handleDelete(r._id)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
