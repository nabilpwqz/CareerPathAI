import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { CareerProfileSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let profile = memoryStore.getProfileByUserId(session.userId);
  if (!profile) {
    // initialize empty profile
    profile = memoryStore.saveProfile({
      userId: session.userId,
      experienceLevel: 'Entry',
      currentRole: 'Professional',
      targetRole: 'Software Engineer',
      targetIndustry: 'Technology',
      yearsOfExperience: 1,
      skills: [],
      preferredLocations: ['Remote'],
      workPreference: 'remote',
      onboardingCompleted: false,
    });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existing = memoryStore.getProfileByUserId(session.userId);
    const updated = memoryStore.saveProfile({
      ...(existing || {}),
      ...body,
      userId: session.userId,
    });

    return NextResponse.json({ message: 'Profile updated successfully', profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update profile' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CareerProfileSchema.parse(body);
    const updated = memoryStore.saveProfile({
      ...validated,
      userId: session.userId,
      onboardingCompleted: true,
    });

    return NextResponse.json({ message: 'Career preferences saved', profile: updated });
  } catch (err: any) {
    if (err?.errors) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err?.message || 'Failed to save career preferences' }, { status: 500 });
  }
}
