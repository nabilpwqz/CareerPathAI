import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { AgenticWorkflowOrchestrator } from '@/lib/llm/orchestrator';

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { resumeId, jobDescription, resumeData } = body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return NextResponse.json({ error: 'Job description must be at least 20 characters' }, { status: 400 });
    }

    let targetResume = resumeData;
    if (resumeId) {
      targetResume = memoryStore.getResumeById(resumeId, session.userId);
    }

    if (!targetResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const workflowResult = await AgenticWorkflowOrchestrator.runResumeTailoringAgent(
      session.userId,
      targetResume,
      jobDescription
    );

    if (workflowResult.status === 'failed') {
      return NextResponse.json({ error: workflowResult.error || 'Tailoring failed' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Resume tailored successfully',
      workflowId: workflowResult.workflowId,
      steps: workflowResult.steps,
      resume: workflowResult.data,
      executionDurationMs: workflowResult.executionDurationMs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error during tailoring' }, { status: 500 });
  }
}
