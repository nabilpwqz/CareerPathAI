'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Cpu,
  DollarSign,
  FileText,
  MessageSquare,
  Award,
  Zap,
  RefreshCw,
  Download,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

const ADVISOR_PERSONAS = [
  {
    id: 'executive',
    name: 'Executive Strategist',
    icon: Award,
    badge: 'Strategic Vision',
    description: 'Seniority progression, technical leadership, and career transition roadmaps.',
    quickPrompts: [
      'What specific skills separate Senior from Staff/Principal AI Engineers?',
      'How should I position myself for an Engineering Management transition?',
      'Create a 30-60-90 day strategic plan for starting my target role.',
      'How do I pivot from traditional Web Dev to Autonomous AI Systems?',
    ],
  },
  {
    id: 'system_design',
    name: 'System Design Coach',
    icon: Cpu,
    badge: 'Architecture & Scale',
    description: 'High-concurrency systems, distributed architectures, vector search, and trade-offs.',
    quickPrompts: [
      'Walk me through designing an enterprise RAG pipeline with hybrid search.',
      'Explain how to design an idempotent distributed job queue with Kafka.',
      'What are the key trade-offs between monolithic and microservice deployments in 2026?',
      'How do I structure a real-time collaborative document editor architecture?',
    ],
  },
  {
    id: 'salary_negotiator',
    name: 'Compensation Negotiator',
    icon: DollarSign,
    badge: 'Total Rewards & Offers',
    description: 'Base salary bands, equity (RSUs/options), signing bonuses, and leverage scripts.',
    quickPrompts: [
      'Draft a professional counter-offer email requesting 15% more base salary.',
      'How do I evaluate a private startup stock options offer vs public RSUs?',
      'What are the current compensation benchmarks for Senior AI Engineers in the US/Remote?',
      'How do I negotiate for a signing bonus or additional equity without losing the offer?',
    ],
  },
  {
    id: 'resume_optimizer',
    name: 'ATS Resume Architect',
    icon: FileText,
    badge: 'Recruiter Impact',
    description: 'Rewrite bullet points, elevate action verbs, and maximize quantifiable metrics.',
    quickPrompts: [
      'Rewrite this bullet: "Helped optimize database queries" for maximum impact.',
      'How do I describe side projects so enterprise recruiters take them seriously?',
      'Audit my skill section: What obsolete tech keywords should I delete?',
      'Give me 5 punchy bullet points demonstrating ownership in a cloud migration.',
    ],
  },
  {
    id: 'interview_coach',
    name: 'Behavioral STAR Coach',
    icon: MessageSquare,
    badge: 'STAR Methodology',
    description: 'Behavioral questions, cross-functional conflicts, and executive presence.',
    quickPrompts: [
      'Give me a STAR answer outline for: "Tell me about a time an outage occurred under your watch."',
      'How do I answer: "Describe a disagreement with a Product Manager on scope."',
      'What are the top 5 questions I should ask the CTO at the end of the final round?',
      'How do I explain a 6-month employment gap without sounding defensive?',
    ],
  },
];

export default function AiAssistantPage() {
  const { user, profileSummary } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activePersona, setActivePersona] = useState('executive');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content:
        `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your Autonomous Career Advisor.\n\nI have synchronized with your target profile (${profileSummary?.targetRole || 'Senior Engineer'}). Choose a specialized advisory persona above or ask any strategic career question below.`,
      timestamp: new Date().toISOString(),
      persona: 'executive',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  const currentPersonaConfig = ADVISOR_PERSONAS.find((p) => p.id === activePersona) || ADVISOR_PERSONAS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/v1/ai/chat');
      if (res.ok) {
        const d = await res.json();
        setConversations(d.conversations || []);
        if (d.conversations?.length > 0 && !activeConversationId) {
          const latest = d.conversations[d.conversations.length - 1];
          setActiveConversationId(latest._id);
          if (latest.messages?.length > 0) {
            setMessages(latest.messages);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || sending) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      persona: activePersona,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversationId,
          message: textToSend,
          persona: activePersona,
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Advisory request failed');

      setActiveConversationId(d.conversationId);
      setMessages((prev) => [...prev, d.message]);
      await fetchConversations();
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast('Copied response to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => `### ${m.role === 'user' ? 'Candidate' : 'Advisor'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n\n---\n`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-advisory-session-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Advisory session exported as Markdown', 'success');
  };

  const handleClearChat = () => {
    setActiveConversationId(null);
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `Consultation session reset. As your ${currentPersonaConfig.name}, what career strategy or tactical milestone can I help you resolve?`,
        timestamp: new Date().toISOString(),
        persona: activePersona,
      },
    ]);
    toast('Started fresh advisory session', 'info');
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6.5rem)]">
      {/* Top Banner: Persona Switcher & Actions */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Career Advisory Suite
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Career Advisor
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors shadow-sm"
              title="Export consultation to Markdown"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export
            </button>
            <button
              onClick={handleClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" />
              Reset
            </button>
          </div>
        </div>

        {/* Specialized Persona Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ADVISOR_PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isSelected = activePersona === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => {
                  setActivePersona(persona.id);
                  toast(`Switched mode to ${persona.name}`, 'info');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-500 dark:text-emerald-400'}`} />
                <span>{persona.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized Context Status Bar */}
      <div className="shrink-0 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>
            Target: <strong className="text-slate-900 dark:text-white">{profileSummary?.targetRole || 'Senior Engineer'}</strong>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>
            Readiness:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {profileSummary?.onboardingCompleted ? '88% Aligned' : 'Active Onboarding'}
            </strong>
          </span>
        </div>
        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          Current Persona: <span className="font-bold text-slate-800 dark:text-slate-200">{currentPersonaConfig.name}</span> ({currentPersonaConfig.badge})
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shrink-0 mt-0.5 shadow-sm shadow-emerald-500/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="flex flex-col gap-1 max-w-2xl">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm transition-all ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-emerald-500/10'
                      : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>

                {/* Response Metadata & Copy Action */}
                {!isUser && (
                  <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {m.persona ? ADVISOR_PERSONAS.find((p) => p.id === m.persona)?.name || 'Advisor' : 'Career Advisor'}
                      {' • '}
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyMessage(m.id, m.content)}
                      className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-0.5"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {sending && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 max-w-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
            <span>Consulting {currentPersonaConfig.name} knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Strategy Playbooks for Active Persona */}
      <div className="shrink-0 pt-1">
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Recommended Inquiries ({currentPersonaConfig.name}):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentPersonaConfig.quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 transition-all shadow-sm"
            >
              <span>{prompt}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="shrink-0 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${currentPersonaConfig.name} anything about ${currentPersonaConfig.description.toLowerCase()}`}
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Advisor</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// [build-audit: 79] verified code formatting
