import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { ResumeSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resumes = memoryStore.getResumesByUserId(session.userId);
  return NextResponse.json({ resumes });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = ResumeSchema.parse(body);

    const newResume = memoryStore.saveResume({
      ...validated,
      userId: session.userId,
      atsScore: 78,
      atsFeedback: {
        strengths: ['Clear structure', 'Standard industry sections'],
        improvements: ['Include more metrics in work bullets'],
        missingKeywords: [],
      },
    });

    return NextResponse.json({ message: 'Resume created successfully', resume: newResume }, { status: 201 });
  } catch (err: any) {
    if (err?.errors) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err?.message || 'Failed to create resume' }, { status: 500 });
  }
}
