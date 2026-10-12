'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Cpu,
  Zap,
  Server,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

export default function AdminTelemetryPage() {
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [telRes, hRes] = await Promise.all([
        fetch('/api/v1/admin/analytics'),
        fetch('/api/v1/health'),
      ]);

      if (telRes.ok) {
        const d = await telRes.json();
        setTelemetry(d);
      }
      if (hRes.ok) {
        const h = await hRes.json();
        setHealth(h);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            Operations & Observability
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Telemetry & AI Metrics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Real-time monitoring of AI token consumption, provider latency, cost budgeting, and system health.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>Total AI Invocations</span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {telemetry?.summary?.totalInvocations || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all agentic workflows</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>Tokens Processed</span>
            <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">
            {telemetry?.summary?.totalTokens?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Prompt + completion tokens</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>Avg Pipeline Latency</span>
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-300">
            {telemetry?.summary?.averageLatencyMs || 0}ms
          </div>
          <p className="text-[11px] text-slate-500 mt-1">End-to-end execution speed</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>Estimated Cost</span>
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ${telemetry?.summary?.totalEstimatedCostUsd || '0.0000'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Budgeted API consumption</p>
        </div>
      </div>

      {/* System Health Diagnostics */}
      {health && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Infrastructure Status & Database Health
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400">Database Layer</span>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-1">{health.database?.type}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Status: {health.database?.status}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400">AI Provider Routing</span>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">Mode: {health.aiConfig?.activeProvider}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Gemini: {health.aiConfig?.geminiConfigured ? '✓ Active' : 'Offline / Fallback'} • OpenAI: {health.aiConfig?.openaiConfigured ? '✓ Active' : 'Offline / Fallback'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400">Process Uptime</span>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{health.uptimeSeconds}s</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Environment: {health.environment}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Execution Audit Logs */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Recent LLM Pipeline Execution Logs
        </h3>

        {telemetry?.recentLogs?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Task Type</th>
                  <th className="pb-3">Provider</th>
                  <th className="pb-3">Model</th>
                  <th className="pb-3">Tokens</th>
                  <th className="pb-3">Latency</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {telemetry.recentLogs.map((log: any) => (
                  <tr key={log._id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{log.taskType}</td>
                    <td className="py-2.5">{log.provider}</td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">{log.model}</td>
                    <td className="py-2.5">{log.totalTokens}</td>
                    <td className="py-2.5">{log.latencyMs}ms</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.status === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No AI requests logged yet in current session.</p>
        )}
      </div>
    </div>
  );
}

// [build-audit: 80] verified code formatting
