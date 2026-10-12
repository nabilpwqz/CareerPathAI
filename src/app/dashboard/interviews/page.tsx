'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import {
  MessageSquare,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function InterviewStudioPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [targetRole, setTargetRole] = useState('Senior AI Systems Engineer');

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/v1/interviews/sessions');
      if (res.ok) {
        const d = await res.json();
        setSessions(d.interviews || []);
        if (d.interviews && d.interviews.length > 0 && !activeSession) {
          setActiveSession(d.interviews[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const createSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/interviews/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, difficulty: 'intermediate' }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to start interview');
      setActiveSession(d.session);
      setActiveQuestionIndex(0);
      setAnswerInput('');
      toast('New interview simulation session initiated!', 'success');
      await fetchSessions();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!activeSession || !answerInput.trim() || answerInput.trim().length < 10) {
      toast('Please write a detailed response (at least 10 characters)', 'error');
      return;
    }

    const currentQ = activeSession.questions[activeQuestionIndex];
    setSubmittingAnswer(true);

    try {
      const res = await fetch(`/api/v1/interviews/sessions/${activeSession._id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          userAnswer: answerInput,
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Evaluation failed');

      // Update active session locally
      const updatedQs = [...activeSession.questions];
      updatedQs[activeQuestionIndex] = d.question;
      setActiveSession({
        ...activeSession,
        questions: updatedQs,
        overallScore: d.overallScore,
        completed: d.completed,
      });

      toast(`Answer evaluated! Score: ${d.question.feedback?.score}%`, 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const currentQ = activeSession?.questions?.[activeQuestionIndex];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Interview Simulation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            STAR Interview Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Practice technical and behavioral scenarios with instant rubric scoring and feedback.
          </p>
        </div>

        <button
          onClick={createSession}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Generating...' : 'Start New Simulation'}
        </button>
      </div>

      {activeSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Questions selector & Answer Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {activeSession.questions.map((q: any, idx: number) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setAnswerInput(q.userAnswer || '');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    activeQuestionIndex === idx
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-sm'
                      : q.feedback
                      ? 'bg-white dark:bg-slate-900 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs'
                  }`}
                >
                  <span>Question {idx + 1}</span>
                  {q.feedback && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              ))}
            </div>

            {/* Active Question Box */}
            {currentQ && (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Category: {currentQ.type}
                  </span>
                  <span className="text-slate-500">Rubric Scored</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">{currentQ.question}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">{currentQ.context}</p>

                {/* STAR Guidance Alert */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">STAR Structure Checklist:</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    • <strong>Situation:</strong> Context and company challenge.<br />
                    • <strong>Task:</strong> Your exact responsibility.<br />
                    • <strong>Action:</strong> Technical decisions and execution steps.<br />
                    • <strong>Result:</strong> Quantifiable outcome (metrics, latency, revenue).
                  </div>
                </div>

                {/* Answer Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Your Response
                  </label>
                  <textarea
                    rows={6}
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Structure your answer using the STAR method..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 leading-relaxed shadow-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={submittingAnswer}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingAnswer ? 'Evaluating Answer...' : 'Submit For Evaluation'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Real-Time Evaluator Feedback */}
          <div>
            {currentQ?.feedback ? (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluation Score</div>
                    <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{currentQ.feedback.score}%</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    STAR Adherence
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.feedback.starAdherence}</p>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Strengths
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {currentQ.feedback.strengths?.map((str: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Improvement Opportunities
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {currentQ.feedback.weaknesses?.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">!</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentQ.feedback.idealAnswerOutline?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">Ideal STAR Structure Outline:</div>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      {currentQ.feedback.idealAnswerOutline.map((out: string, i: number) => (
                        <li key={i}>• {out}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
                <HelpCircle className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Awaiting Response</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Type your STAR response on the left and click &quot;Submit For Evaluation&quot; to receive rubric analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Interview Simulation</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
            Click &quot;Start New Simulation&quot; above to practice behavioral and system design interview questions.
          </p>
        </div>
      )}
    </div>
  );
}

// [build-audit: 78] verified code formatting
