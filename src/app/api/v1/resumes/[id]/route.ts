import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resume = memoryStore.getResumeById(params.id, session.userId);
  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  return NextResponse.json({ resume });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = memoryStore.getResumeById(params.id, session.userId);
  if (!existing) {
    return NextResponse.json({ error: 'Resume not found or unauthorized' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updated = memoryStore.saveResume({
      ...existing,
      ...body,
      _id: params.id,
      userId: session.userId,
    });

    return NextResponse.json({ message: 'Resume updated successfully', resume: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update resume' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = memoryStore.deleteResume(params.id, session.userId);
  if (!deleted) {
    return NextResponse.json({ error: 'Resume not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Resume deleted successfully' });
}
