import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required Firebase user credentials (uid, email)' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let user = memoryStore.findUserById(uid) || memoryStore.findUserByEmail(cleanEmail);

    if (!user) {
      // First time login with Firebase — register new user
      const name = displayName?.trim() || cleanEmail.split('@')[0];
      user = memoryStore.saveUser({
        _id: uid,
        name,
        email: cleanEmail,
        role: 'user',
        photoURL: photoURL || null,
        authProvider: 'firebase',
      });

      // Initialize default onboarding profile
      memoryStore.saveProfile({
        userId: user._id,
        experienceLevel: 'Entry',
        currentRole: 'Aspiring Professional',
        targetRole: 'Software Engineer',
        targetIndustry: 'Technology & AI',
        yearsOfExperience: 1,
        skills: [
          { name: 'JavaScript / TypeScript', level: 'intermediate', category: 'Languages' },
          { name: 'Problem Solving', level: 'intermediate', category: 'Core' },
        ],
        preferredLocations: ['Remote'],
        workPreference: 'remote',
        onboardingCompleted: false,
      });
    } else {
      // Update existing record with any newly available Firebase info (e.g., photo)
      if (photoURL && !user.photoURL) {
        user.photoURL = photoURL;
      }
      if (displayName && user.name === cleanEmail.split('@')[0]) {
        user.name = displayName;
      }
      user.authProvider = user.authProvider || 'firebase';
    }

    // Ensure user has an associated profile
    let profile = memoryStore.getProfileByUserId(user._id);
    if (!profile) {
      profile = memoryStore.saveProfile({
        userId: user._id,
        experienceLevel: 'Entry',
        currentRole: 'Aspiring Professional',
        targetRole: 'Software Engineer',
        targetIndustry: 'Technology & AI',
        yearsOfExperience: 0,
        skills: [],
        preferredLocations: ['Remote'],
        workPreference: 'remote',
        onboardingCompleted: false,
      });
    }

    // Generate authenticated session token
    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role || 'user',
    });

    const res = NextResponse.json({
      success: true,
      message: 'Firebase session synchronized successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        photoURL: user.photoURL || null,
        authProvider: user.authProvider || 'firebase',
      },
      profileSummary: {
        currentRole: profile.currentRole,
        targetRole: profile.targetRole,
        onboardingCompleted: profile.onboardingCompleted,
        skillsCount: profile.skills?.length || 0,
      },
      token,
    });

    setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    console.error('Error in /api/v1/auth/firebase-sync:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to synchronize Firebase session' },
      { status: 500 }
    );
  }
}
