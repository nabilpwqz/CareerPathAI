import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = memoryStore.findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const profile = memoryStore.getProfileByUserId(user._id);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoURL: user.photoURL || null,
      authProvider: user.authProvider || 'local',
    },
    profileSummary: profile
      ? {
          currentRole: profile.currentRole,
          targetRole: profile.targetRole,
          onboardingCompleted: profile.onboardingCompleted,
          skillsCount: profile.skills?.length || 0,
        }
      : null,
  });
}
