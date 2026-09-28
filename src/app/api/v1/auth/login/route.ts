import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { LoginSchema } from '@/lib/validation';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if 1-click Demo mode requested
    if (body.isDemo || body.email === 'demo@careerpath.ai') {
      const demoUser = memoryStore.findUserByEmail('demo@careerpath.ai');
      if (demoUser) {
        const token = signToken({
          userId: demoUser._id,
          email: demoUser.email,
          role: demoUser.role,
        });

        const res = NextResponse.json({
          message: 'Logged in as Demo User',
          user: {
            id: demoUser._id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
          },
          token,
        });

        setAuthCookie(res, token);
        return res;
      }
    }

    const validated = LoginSchema.parse(body);
    const user = memoryStore.findUserByEmail(validated.email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (user.passwordHash) {
      const isValid = await verifyPassword(validated.password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    if (err?.errors) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err?.message || 'Server error during login' }, { status: 500 });
  }
}
