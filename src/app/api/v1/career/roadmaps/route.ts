import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { AgenticWorkflowOrchestrator } from '@/lib/llm/orchestrator';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const roadmaps = memoryStore.getRoadmapsByUserId(session.userId);
  return NextResponse.json({ roadmaps });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const targetRole = body.targetRole || 'Senior AI Systems Engineer';
    const weeklyStudyHours = Number(body.weeklyStudyHours) || 12;
    const timelineMonths = Number(body.timelineMonths) || 6;

    const result = await AgenticWorkflowOrchestrator.runCareerRoadmapAgent(
      session.userId,
      targetRole,
      weeklyStudyHours,
      timelineMonths
    );

    if (result.status === 'failed') {
      return NextResponse.json({ error: result.error || 'Roadmap orchestration failed' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Roadmap generated successfully',
      workflowId: result.workflowId,
      steps: result.steps,
      roadmap: result.data,
      executionDurationMs: result.executionDurationMs,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error generating roadmap' }, { status: 500 });
  }
}
