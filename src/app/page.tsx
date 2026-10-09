'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { ThemeToggle } from '@/components/providers/ThemeProvider';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Compass,
  Briefcase,
  Layers,
  Search,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Cpu,
  BarChart3,
  Bot,
  Menu,
  X
} from 'lucide-react';

const FEATURE_CAREERS = [
  {
    id: 1,
    title: 'Senior AI Systems Engineer',
    company: 'Anthropic Labs / Enterprise',
    salary: '$165k - $225k',
    experience: 'Senior',
    skills: ['LangGraph', 'Python', 'Vector DBs', 'Kubernetes', 'TypeScript'],
    growth: '+42% YoY Demand',
    matchBenchmark: '88% Alignment Target',
  },
  {
    id: 2,
    title: 'Full Stack Cloud Architect',
    company: 'Apex Cloud Systems',
    salary: '$140k - $190k',
    experience: 'Senior',
    skills: ['Next.js', 'PostgreSQL', 'Docker', 'AWS', 'Node.js'],
    growth: '+28% YoY Demand',
    matchBenchmark: '85% Alignment Target',
  },
  {
    id: 3,
    title: 'Machine Learning Operations (MLOps)',
    company: 'DeepScale AI',
    salary: '$150k - $205k',
    experience: 'Mid-Senior',
    skills: ['PyTorch', 'MLflow', 'Docker', 'CI/CD', 'FastAPI'],
    growth: '+35% YoY Demand',
    matchBenchmark: '79% Alignment Target',
  },
  {
    id: 4,
    title: 'Frontend Experience Engineer',
    company: 'DesignCraft SaaS',
    salary: '$120k - $165k',
    experience: 'Mid-level',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Web Vitals', 'GraphQL'],
    growth: '+22% YoY Demand',
    matchBenchmark: '92% Alignment Target',
  },
  {
    id: 5,
    title: 'Cybersecurity Threat Analyst',
    company: 'Sentinel Defense',
    salary: '$130k - $175k',
    experience: 'Mid-level',
    skills: ['Penetration Testing', 'SIEM', 'Cloud Security', 'Network Protocols'],
    growth: '+31% YoY Demand',
    matchBenchmark: '81% Alignment Target',
  },
  {
    id: 6,
    title: 'Technical Product Manager (AI/Data)',
    company: 'Synapse Global',
    salary: '$145k - $195k',
    experience: 'Senior',
    skills: ['Roadmapping', 'SQL', 'LLM Architectures', 'Agile', 'User Analytics'],
    growth: '+26% YoY Demand',
    matchBenchmark: '84% Alignment Target',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExp, setSelectedExp] = useState('All');
  const [demoLoading, setDemoLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemoAccess = async () => {
    setDemoLoading(true);
    try {
      const res = await login({ isDemo: true });
      if (res.success) {
        toast('Logged into Demo workspace successfully!', 'success');
        router.push('/dashboard');
      } else {
        toast(res.error || 'Demo access failed', 'error');
      }
    } finally {
      setDemoLoading(false);
    }
  };

  const filteredCareers = FEATURE_CAREERS.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExp = selectedExp === 'All' || c.experience === selectedExp;
    return matchesSearch && matchesExp;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
            <span className="text-base sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white truncate">
              CareerPath <span className="text-emerald-500 dark:text-emerald-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#workflows" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              Agent Workflows
            </a>
            <a href="#careers" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              Market Explorer
            </a>
            <a href="#features" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              Platform Features
            </a>
            <a href="#pricing" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Night / Light Mode Toggle */}
            <ThemeToggle />

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
              >
                <span className="hidden xs:inline">Go to</span> Dashboard
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoAccess}
                  disabled={demoLoading}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  {demoLoading ? 'Loading Demo...' : '1-Click Demo'}
                </button>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-xl">
            <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              <a
                href="#workflows"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Agent Workflows
              </a>
              <a
                href="#careers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Market Explorer
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Platform Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Pricing Plans
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDemoAccess();
                    }}
                    disabled={demoLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium text-sm transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    {demoLoading ? 'Launching Demo...' : '1-Click Interactive Demo'}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-slate-950 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 pb-14 sm:pb-20 overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-[1.15]">
            Architect Your Career Growth With{' '}
            <span className="block sm:inline mt-1.5 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300">
              Autonomous AI Workflows
            </span>
          </h1>

          <p className="mt-5 sm:mt-8 text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed sm:leading-8">
            Stop guessing skill requirements. Generate verifiable ATS resumes tailored to target job descriptions,
            track multi-phase learning roadmaps, and practice STAR-format interviews with real-time AI rubrics.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 max-w-sm sm:max-w-none mx-auto w-full">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-sm sm:text-base transition-all shadow-xl shadow-emerald-600/20 dark:shadow-emerald-500/25 transform hover:-translate-y-0.5"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              <Bot className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              {demoLoading ? 'Launching Demo...' : 'Explore Live Workspace'}
            </button>
          </div>

          {/* Social Proof & Tech Badges */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/80 max-w-3xl mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Zero-Hallucination Resume Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Multi-Provider LLM Orchestration</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <span>Deterministic Skill Gap Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Agentic Workflow Section */}
      <section id="workflows" className="py-14 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-2">
              Autonomous Architecture
            </h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
              How the Career Intelligence Loop Operates
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Unlike generic single-prompt chatbots, CareerPath AI runs verified, multi-stage state transitions with strict schema validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white mb-2">Intake & Extraction</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extracts your confirmed experience, demonstrated skills, education, and study constraints without inventing credentials.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white mb-2">Market Benchmark</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Compares your demonstrated profile against real hiring standards, parsing required frameworks and architectural knowledge.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white mb-2">Phased Roadmap Execution</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Synthesizes ordered learning milestones, estimated time budgets, and concrete portfolio deliverables.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-4">
                04
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-950 dark:text-white mb-2">Continuous Recalculation</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                As you check off tasks or complete interview simulations, your readiness metrics and recommendations automatically adapt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Explorer */}
      <section id="careers" className="py-14 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-2">
                Live Industry Benchmark
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                High-Growth Tech Career Explorer
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                Explore real role benchmarks, required skills, and average compensations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by role or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>

              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="All">All Experience Levels</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Mid-Senior">Mid-Senior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md hover:shadow-emerald-500/5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10">
                      {c.growth}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{c.experience}</span>
                  </div>

                  <h4 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.company}</p>

                  <div className="mt-4 flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Target Compensation</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">{c.salary}</span>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Core Skills Required
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{c.matchBenchmark}</span>
                  <Link
                    href={`/register?role=${encodeURIComponent(c.title)}`}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                  >
                    Build Roadmap
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section id="features" className="py-14 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-2">
              Full-Stack Modules
            </h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
              An End-to-End Career Acceleration Suite
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Every tool is connected to your central career profile with persistent database storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <div className="p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 sm:mb-6">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-2">ATS Resume Studio</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Tailor your resume against any job description. Calculates ATS alignment scores, identifies missing tech keywords, and exports high-fidelity PDFs.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  Live side-by-side document preview
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  Guaranteed zero hallucination of degrees
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 sm:mb-6">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-2">Career Roadmap Builder</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Multi-phase actionable roadmap broken down into manageable milestones, weekly hour budgets, and portfolio capstone projects.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  Interactive task progress toggling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  Dynamic readiness score recalculation
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5 sm:mb-6">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-2">STAR Interview Studio</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Practice behavioral, technical, and architectural questions. Receive line-by-line feedback scored against professional hiring rubrics.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  STAR framework compliance check
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  Ideal answer outlines & practice history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section id="pricing" className="py-14 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-2">
              Transparent Access
            </h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
              Simple, Predictable Plans
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Get started with our free tier or access advanced autonomous workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm dark:shadow-none flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Starter</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For exploring career options</p>
                <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ forever</span>
                </div>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    1 Active Career Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    2 ATS Resume Tailoring runs/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Basic 3-phase Career Roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Live Market Explorer Access
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-6 sm:mt-8 block text-center py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-5 sm:p-8 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900/90 relative flex flex-col justify-between shadow-xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wide">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Professional</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For active job seekers & upskillers</p>
                <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">$19</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs text-slate-800 dark:text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Unlimited ATS Resumes & PDF Exports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Autonomous Roadmap Recalculation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Unlimited STAR Interview Evaluations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Job Description Alignment Analyzer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    24/7 AI Career Advisor Specialists
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-6 sm:mt-8 block text-center py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Start 14-Day Pro Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm dark:shadow-none flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Enterprise / Teams</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For universities & engineering teams</p>
                <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">$49</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ seat / mo</span>
                </div>
                <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Admin Analytics & Telemetry Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Custom LLM Provider Key Injection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    Priority Support & SLAs
                  </li>
                </ul>
              </div>
              <button
                onClick={handleDemoAccess}
                className="mt-6 sm:mt-8 block text-center py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition-colors"
              >
                Explore Enterprise Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-14 sm:py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/20 transition-colors">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-2">FAQ</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-5 text-sm">
            <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <h4 className="font-bold text-slate-950 dark:text-white text-sm sm:text-base mb-2">
                Does the AI invent or fabricate work history or degrees on my resume?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Absolutely not. Our prompt contracts explicitly forbid fabricating degrees, past employers, or unverifiable claims. The AI improves phrasing, highlights matching keywords from job descriptions, and restructures your achievements using the STAR impact formula.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <h4 className="font-bold text-slate-950 dark:text-white text-sm sm:text-base mb-2">
                What makes this platform genuinely intelligent?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Rather than executing a single unmonitored prompt, our workflows use a multi-stage pipeline: intake verification, context retrieval from your saved profile, domain benchmark analysis, schema validation with Zod guardrails, and persistent database storage.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm dark:shadow-none">
              <h4 className="font-bold text-slate-950 dark:text-white text-sm sm:text-base mb-2">
                Can I export my generated resumes to PDF?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes. CareerPath AI includes a dedicated print and export pipeline that produces clean, ATS-parsable PDF documents following standard font sizes and margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 sm:py-12 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">CareerPath AI</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/login" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Create Account
            </Link>
            <button onClick={handleDemoAccess} className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
              Launch Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// [build-audit: 68] verified code formatting
