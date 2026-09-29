import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ message: 'Successfully logged out' });
  clearAuthCookie(res);
  return res;
}
