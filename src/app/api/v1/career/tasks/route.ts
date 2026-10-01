import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { roadmapId, taskId, completed } = body;

    if (!roadmapId || !taskId) {
      return NextResponse.json({ error: 'Roadmap ID and Task ID are required' }, { status: 400 });
    }

    const updated = memoryStore.updateRoadmapTask(roadmapId, taskId, Boolean(completed), session.userId);
    if (!updated) {
      return NextResponse.json({ error: 'Task or roadmap not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task status updated', roadmap: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update task status' }, { status: 400 });
  }
}
