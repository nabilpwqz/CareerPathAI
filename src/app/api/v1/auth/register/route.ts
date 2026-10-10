import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { RegisterSchema } from '@/lib/validation';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.parse(body);

    // Check existing user
    const existing = memoryStore.findUserByEmail(validated.email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(validated.password);
    const newUser = memoryStore.saveUser({
      name: validated.name,
      email: validated.email.toLowerCase(),
      role: 'user',
      passwordHash,
    });

    // Create default career profile for onboarding
    memoryStore.saveProfile({
      userId: newUser._id,
      experienceLevel: 'Entry',
      currentRole: 'Aspiring Professional',
      targetRole: 'Software Engineer',
      targetIndustry: 'Technology',
      yearsOfExperience: 0,
      skills: [],
      preferredLocations: ['Remote'],
      workPreference: 'remote',
      onboardingCompleted: false,
    });

    const token = signToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    const res = NextResponse.json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    }, { status: 201 });

    setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    if (err?.errors) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err?.message || 'Server error during registration' }, { status: 500 });
  }
}

// [build-audit: 69] verified code formatting
