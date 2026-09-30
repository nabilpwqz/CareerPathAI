import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const metrics = memoryStore.getAllUsageMetrics();
  const totalTokens = metrics.reduce((sum, m) => sum + (m.totalTokens || 0), 0);
  const totalCost = metrics.reduce((sum, m) => sum + (m.estimatedCostUsd || 0), 0);
  const avgLatency = metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + (m.latencyMs || 0), 0) / metrics.length) : 180;

  // Breakdown by task type
  const taskBreakdown: Record<string, number> = {};
  metrics.forEach((m) => {
    taskBreakdown[m.taskType] = (taskBreakdown[m.taskType] || 0) + 1;
  });

  return NextResponse.json({
    summary: {
      totalInvocations: metrics.length,
      totalTokens,
      totalEstimatedCostUsd: Number(totalCost.toFixed(4)),
      averageLatencyMs: avgLatency,
      activeUsers: memoryStore.getAllUsersCount(),
    },
    taskBreakdown,
    recentLogs: metrics.slice(-15).reverse(),
  });
}
