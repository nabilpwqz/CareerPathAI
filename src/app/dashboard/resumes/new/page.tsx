'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/providers/ToastProvider';
import {
  FileText,
  Sparkles,
  Printer,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Briefcase,
  GraduationCap,
  Wand2,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

function ResumeStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const { toast } = useToast();

  const printAreaRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [tailorSteps, setTailorSteps] = useState<any[]>([]);

  // Resume Document State
  const [resumeData, setResumeData] = useState<any>({
    title: 'Senior Software Engineer - Target 2026',
    template: 'modern',
    targetRole: 'Senior Software Engineer',
    contactInfo: {
      fullName: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 342-8901',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/sarah-chen',
      github: 'github.com/sarah-chen',
    },
    summary:
      'High-impact Software Engineer with 4+ years of expertise in architecting scalable distributed web applications, optimizing high-concurrency microservices, and implementing resilient cloud architectures. Proven record of cutting database query latency by 42% and mentoring junior engineering talent.',
    experiences: [
      {
        company: 'Apex Cloud Systems',
        role: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2023-01',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected and deployed microservices backend processing 12M+ monthly events with 99.98% uptime using Node.js, TypeScript, and Redis caching.',
          'Spearheaded database query optimization across PostgreSQL clusters, cutting average P95 latency by 42%.',
          'Implemented CI/CD pipelines and automated integration test suites, reducing deployment failure rates to under 0.5%.',
        ],
      },
      {
        company: 'DataVantage Solutions',
        role: 'Full Stack Engineer',
        location: 'Seattle, WA',
        startDate: '2021-03',
        endDate: '2022-12',
        current: false,
        bullets: [
          'Engineered responsive user-facing dashboards using React, Next.js, and Tailwind CSS, increasing user session engagement by 28%.',
          'Built OAuth2 and JWT-based authentication service with role-based access control (RBAC).',
        ],
      },
    ],
    education: [
      {
        institution: 'University of Washington',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        graduationYear: '2021',
      },
    ],
    projects: [
      {
        title: 'Distributed Task Queue Engine',
        description: 'Built an open-source distributed job queue using Redis and TypeScript with automatic retry mechanisms.',
        technologies: ['TypeScript', 'Node.js', 'Redis', 'Docker'],
      },
    ],
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'GraphQL', 'Tailwind CSS'],
    certifications: ['AWS Certified Solutions Architect'],
    atsScore: 88,
    atsFeedback: {
      strengths: [
        'Measurable impact metrics in bullets (e.g., 42% latency cut, 12M+ events)',
        'Clean standard reverse-chronological layout',
        'Strong technical keywords',
      ],
      improvements: ['Consider tailoring directly to target employer tech stack'],
      missingKeywords: [],
    },
  });

  // Load existing resume if editing
  useEffect(() => {
    if (editId) {
      fetch(`/api/v1/resumes/${editId}`)
        .then((res) => res.json())
        .then((d) => {
          if (d.resume) setResumeData(d.resume);
        })
        .catch(console.error);
    }
  }, [editId]);

  // AI Generate from Profile
  const handleGenerateFromProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/resumes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: resumeData.targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume');
      setResumeData(data.resume);
      toast('Generated resume from verified profile background!', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Agentic Job Tailoring
  const handleTailorToJob = async () => {
    if (!jobDescriptionInput.trim() || jobDescriptionInput.trim().length < 30) {
      toast('Please enter a job description of at least 30 characters', 'error');
      return;
    }
    setTailoring(true);
    setTailorSteps([
      { stepName: 'Ingesting Target Job Description', status: 'in_progress' },
    ]);

    try {
      const res = await fetch('/api/v1/resumes/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobDescription: jobDescriptionInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tailoring failed');

      setTailorSteps(data.steps || []);
      setResumeData(data.resume);
      toast(`Resume tailored successfully! ATS Score: ${data.resume.atsScore}%`, 'success');
      setShowTailorModal(false);
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setTailoring(false);
    }
  };

  // Save Resume to Database
  const handleSave = async () => {
    setLoading(true);
    try {
      const url = editId ? `/api/v1/resumes/${editId}` : '/api/v1/resumes';
      const method = editId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      toast('Resume saved successfully to database!', 'success');
      if (!editId && data.resume?._id) {
        router.push(`/dashboard/resumes/new?editId=${data.resume._id}`);
      }
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Print / PDF Export
  const handlePrint = () => {
    window.print();
  };

  // Helpers to mutate arrays
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          company: 'Company Name',
          role: 'Role Title',
          location: 'Location',
          startDate: '2024-01',
          endDate: 'Present',
          current: true,
          bullets: ['Key achievement or responsibility with measurable impact.'],
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const list = [...resumeData.experiences];
    list.splice(index, 1);
    setResumeData({ ...resumeData, experiences: list });
  };

  const updateBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const exps = [...resumeData.experiences];
    exps[expIndex].bullets[bulletIndex] = val;
    setResumeData({ ...resumeData, experiences: exps });
  };

  const addBullet = (expIndex: number) => {
    const exps = [...resumeData.experiences];
    exps[expIndex].bullets.push('Spearheaded technical initiative delivering tangible results.');
    setResumeData({ ...resumeData, experiences: exps });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const exps = [...resumeData.experiences];
    exps[expIndex].bullets.splice(bulletIndex, 1);
    setResumeData({ ...resumeData, experiences: exps });
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            Resume Studio & ATS Optimizer
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {editId ? 'Editing ATS Resume' : 'Create ATS Resume'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerateFromProfile}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            Auto-Fill From Profile
          </button>

          <button
            type="button"
            onClick={() => setShowTailorModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-md shadow-amber-500/20"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Tailor to Job Description
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Export / Print PDF
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-bold transition-colors shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            {loading ? 'Saving...' : 'Save Resume'}
          </button>
        </div>
      </div>

      {/* ATS Score banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-extrabold text-emerald-600 dark:text-emerald-300 text-lg">
            {resumeData.atsScore || 85}%
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ATS Compatibility Score
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                High Match
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Optimized for automated recruiting parsers (Workday, Greenhouse, Lever).
            </div>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-400">Template:</span>
          {(['modern', 'executive', 'minimal'] as const).map((tmpl) => (
            <button
              key={tmpl}
              type="button"
              onClick={() => setResumeData({ ...resumeData, template: tmpl })}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-colors ${
                resumeData.template === tmpl
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Form Editor (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Input Form Controls */}
        <div className="space-y-6">
          {/* General Metadata */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Document Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Resume Title</label>
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Target Role</label>
                <input
                  type="text"
                  value={resumeData.targetRole}
                  onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.contactInfo.fullName}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      contactInfo: { ...resumeData.contactInfo, fullName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={resumeData.contactInfo.email}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      contactInfo: { ...resumeData.contactInfo, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={resumeData.contactInfo.phone}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      contactInfo: { ...resumeData.contactInfo, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.contactInfo.location}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      contactInfo: { ...resumeData.contactInfo, location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Professional Summary</h3>
            <textarea
              rows={4}
              value={resumeData.summary}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Work Experience */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Position
              </button>
            </div>

            <div className="space-y-6">
              {resumeData.experiences.map((exp: any, expIdx: number) => (
                <div key={expIdx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Position #{expIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(expIdx)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...resumeData.experiences];
                        copy[expIdx].company = e.target.value;
                        setResumeData({ ...resumeData, experiences: copy });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-xs focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = [...resumeData.experiences];
                        copy[expIdx].role = e.target.value;
                        setResumeData({ ...resumeData, experiences: copy });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-xs focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => {
                        const copy = [...resumeData.experiences];
                        copy[expIdx].startDate = e.target.value;
                        setResumeData({ ...resumeData, experiences: copy });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-xs focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const copy = [...resumeData.experiences];
                        copy[expIdx].endDate = e.target.value;
                        setResumeData({ ...resumeData, experiences: copy });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Accomplishment Bullets:</div>
                    {exp.bullets.map((b: string, bIdx: number) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed shadow-xs focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(expIdx, bIdx)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBullet(expIdx)}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time ATS Document Preview */}
        <div className="sticky top-6 h-fit">
          <div className="p-3 rounded-t-xl bg-slate-100 dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Live ATS Document Layout
            </span>
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">
              Template: {resumeData.template}
            </span>
          </div>

          <div
            ref={printAreaRef}
            className={`p-8 sm:p-10 bg-white text-slate-900 rounded-b-xl shadow-xl border border-slate-200 min-h-[750px] font-sans ${
              resumeData.template === 'modern' ? 'border-t-4 border-t-emerald-600' : ''
            }`}
          >
            {/* Document Header */}
            <div className="border-b border-slate-300 pb-4 mb-4 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {resumeData.contactInfo.fullName || 'Candidate Name'}
              </h2>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mt-0.5">
                {resumeData.targetRole}
              </div>
              <div className="mt-2 text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-1 justify-center sm:justify-start">
                <span>{resumeData.contactInfo.email}</span>
                <span>•</span>
                <span>{resumeData.contactInfo.phone}</span>
                <span>•</span>
                <span>{resumeData.contactInfo.location}</span>
                {resumeData.contactInfo.linkedin && (
                  <>
                    <span>•</span>
                    <span>{resumeData.contactInfo.linkedin}</span>
                  </>
                )}
              </div>
            </div>

            {/* Document Summary */}
            {resumeData.summary && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Executive Summary
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Document Experience */}
            {resumeData.experiences?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {resumeData.experiences.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-900">{exp.role}</span>
                        <span className="text-slate-600 font-medium">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mb-1.5">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
                        {exp.bullets.map((b: string, bI: number) => (
                          <li key={bI}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Skills */}
            {resumeData.skills?.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Technical Core Competencies
                </h3>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {Array.isArray(resumeData.skills) ? resumeData.skills.join(' • ') : resumeData.skills}
                </div>
              </div>
            )}

            {/* Document Education */}
            {resumeData.education?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Education & Credentials
                </h3>
                {resumeData.education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {edu.degree} in {edu.fieldOfStudy} — {edu.institution}
                    </span>
                    <span>{edu.graduationYear}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Job Tailoring with Agentic Workflow Feedback */}
      {showTailorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Agentic Resume Tailoring</h3>
              </div>
              <button
                onClick={() => setShowTailorModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste the job description from LinkedIn, Indeed, or company careers page. Our agentic pipeline will
              extract key competencies, align your bullet points without hallucinating, and optimize keyword density.
            </p>

            <textarea
              rows={6}
              placeholder="Paste job description here (e.g., responsibilities, requirements, preferred qualifications)..."
              value={jobDescriptionInput}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 leading-relaxed shadow-sm focus:outline-none focus:border-amber-500"
            />

            {tailorSteps.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-300">Agentic Execution Steps:</div>
                {tailorSteps.map((st, i) => (
                  <div key={i} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{st.stepName}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTailorModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTailorToJob}
                disabled={tailoring}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {tailoring ? 'Tailoring In Progress...' : 'Run Agentic Tailoring'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeStudioPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading Resume Studio...</div>}>
      <ResumeStudioContent />
    </Suspense>
  );
}
