import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const interviews = memoryStore.getInterviewsByUserId(session.userId);
  return NextResponse.json({ interviews });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const targetRole = body.targetRole || 'Full Stack Engineer';
    const difficulty = body.difficulty || 'intermediate';

    // Generate tailored interview questions based on role
    const initialQuestions = [
      {
        id: `q_${Date.now()}_1`,
        type: 'behavioral',
        question: `Tell me about a high-pressure technical project where you faced conflicting requirements or strict deadlines in your work as a ${targetRole}.`,
        context: 'Assesses conflict resolution, prioritization, and resilience under delivery pressure.',
        keyRubricPoints: ['Clear STAR framework structure', 'Ownership and personal initiative', 'Quantified end outcome'],
      },
      {
        id: `q_${Date.now()}_2`,
        type: 'technical',
        question: `How would you architect a resilient, low-latency API service that integrates external LLM completions while mitigating rate limits and unexpected provider outages?`,
        context: 'Assesses backend system design, caching, circuit breakers, and timeout strategies.',
        keyRubricPoints: ['Circuit breaker pattern', 'Redis caching / semantic caching', 'Queue-based asynchronous workers'],
      },
      {
        id: `q_${Date.now()}_3`,
        type: 'situational',
        question: `You discover a security vulnerability or critical bug in production right before a major product demo. Walk me through your triage and communication steps.`,
        context: 'Assesses incident management, risk assessment, and stakeholder communication.',
        keyRubricPoints: ['Rapid impact isolation', 'Stakeholder transparency', 'Post-mortem and prevention plan'],
      },
    ];

    const sessionRecord = memoryStore.saveInterview({
      userId: session.userId,
      targetRole,
      difficulty,
      overallScore: 0,
      questions: initialQuestions,
      completed: false,
    });

    return NextResponse.json({ message: 'Interview session created', session: sessionRecord }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create interview session' }, { status: 500 });
  }
}
