'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { Compass, Check, ArrowRight, ArrowLeft, Plus, X, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Mid-level' | 'Senior' | 'Director'>('Mid-level');
  const [currentRole, setCurrentRole] = useState('Full Stack Developer');
  const [yearsOfExperience, setYearsOfExperience] = useState(3);
  const [targetRole, setTargetRole] = useState('Senior AI Systems Engineer');
  const [targetIndustry, setTargetIndustry] = useState('Artificial Intelligence & SaaS');
  const [workPreference, setWorkPreference] = useState<'remote' | 'hybrid' | 'onsite'>('remote');
  const [expectedSalary, setExpectedSalary] = useState('$130,000 - $170,000');

  // Skills
  const [skills, setSkills] = useState<Array<{ name: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }>>([
    { name: 'TypeScript', level: 'advanced' },
    { name: 'React', level: 'advanced' },
    { name: 'Node.js', level: 'intermediate' },
    { name: 'PostgreSQL', level: 'intermediate' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      toast('Skill already added', 'info');
      return;
    }
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const payload = {
        experienceLevel,
        currentRole,
        targetRole,
        targetIndustry,
        yearsOfExperience: Number(yearsOfExperience),
        skills,
        preferredLocations: ['Remote'],
        workPreference,
        expectedSalary,
        onboardingCompleted: true,
      };

      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      await refreshSession();
      toast('Profile completed! Launching your Career Intelligence Dashboard...', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      toast(err.message || 'Error saving onboarding profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold text-white">CareerPath AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Setup Your Career Profile</h2>
          <p className="text-sm text-slate-400 mt-1">
            Step {step} of 3 — Calibrate your AI agents to your goals
          </p>

          {/* Stepper bar */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-12 bg-emerald-400' : s < step ? 'w-8 bg-emerald-600/60' : 'w-8 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Current Background & Stage
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Experience Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Entry', 'Mid-level', 'Senior', 'Director'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                        experienceLevel === lvl
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Current Job Title
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
                >
                  Next: Demonstrated Skills
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Your Technical & Domain Skills
              </h3>
              <p className="text-xs text-slate-400">
                List the core technologies and frameworks you currently work with.
              </p>

              {/* Add skill row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Python, Docker, Next.js"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Skills list */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      ({s.level})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSkill(s.name)}
                      className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
                >
                  Next: Target Goals
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Target Role & Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Next Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Industry
                  </label>
                  <input
                    type="text"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Work Location Preference
                  </label>
                  <select
                    value={workPreference}
                    onChange={(e) => setWorkPreference(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="remote">100% Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Expected Salary Range
                  </label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {loading ? 'Finalizing Profile...' : 'Complete & Launch Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
