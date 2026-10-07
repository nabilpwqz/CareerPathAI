'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import {
  User,
  Save,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';

export default function CareerProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<any>({
    experienceLevel: 'Mid-level',
    currentRole: 'Full Stack Developer',
    targetRole: 'Senior AI Systems Engineer',
    targetIndustry: 'Technology / AI SaaS',
    yearsOfExperience: 4,
    skills: [
      { name: 'TypeScript', level: 'advanced' },
      { name: 'React', level: 'advanced' },
      { name: 'Node.js', level: 'advanced' },
      { name: 'PostgreSQL', level: 'intermediate' },
    ],
    workPreference: 'remote',
    expectedSalary: '$140,000 - $180,000',
    bio: 'Software engineer focused on scalable cloud infrastructure and AI integration.',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');

  useEffect(() => {
    fetch('/api/v1/profile')
      .then((res) => res.json())
      .then((d) => {
        if (d.profile) setProfile(d.profile);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      toast('Career profile saved and synchronized with AI engine!', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setProfile({
      ...profile,
      skills: [...(profile.skills || []), { name: newSkill.trim(), level: newLevel }],
    });
    setNewSkill('');
  };

  const removeSkill = (index: number) => {
    const s = [...(profile.skills || [])];
    s.splice(index, 1);
    setProfile({ ...profile, skills: s });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            Candidate Master Baseline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Career Profile Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Your career profile supplies verified background data to the resume generator and roadmap planner.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Career Role Info */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Role & Stage</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Current Role</label>
              <input
                type="text"
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Target Next Role</label>
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Experience Level</label>
              <select
                value={profile.experienceLevel}
                onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Entry">Entry</option>
                <option value="Entry-Mid">Entry-Mid</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Mid-Senior">Mid-Senior</option>
                <option value="Senior">Senior</option>
                <option value="Director">Director</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Years of Experience</label>
              <input
                type="number"
                value={profile.yearsOfExperience}
                onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Target Industry</label>
              <input
                type="text"
                value={profile.targetIndustry}
                onChange={(e) => setProfile({ ...profile, targetIndustry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Work Preference</label>
              <select
                value={profile.workPreference}
                onChange={(e) => setProfile({ ...profile, workPreference: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="remote">100% Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Expected Salary</label>
            <input
              type="text"
              value={profile.expectedSalary || ''}
              onChange={(e) => setProfile({ ...profile, expectedSalary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed shadow-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Skills Inventory */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Demonstrated Skills</h3>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Next.js, LangChain, Docker"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-emerald-500"
            />
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <button
              onClick={addSkill}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 pt-2">
            {profile.skills?.map((s: any, idx: number) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    {s.level}
                  </span>
                </div>
                <button
                  onClick={() => removeSkill(idx)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
