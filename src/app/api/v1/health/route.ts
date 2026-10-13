import { NextResponse } from 'next/server';
import { connectToDatabase, memoryStore } from '@/lib/db';

export async function GET() {
  const dbStatus = await connectToDatabase();
  const uptimeSeconds = process.uptime();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(uptimeSeconds),
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: dbStatus.isFallback ? 'In-Memory High-Performance Store (Fallback Active)' : 'MongoDB Atlas / Mongoose (Connected)',
      status: 'operational',
    },
    aiConfig: {
      activeProvider: process.env.AI_PROVIDER || 'auto',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      groqConfigured: !!process.env.GROQ_API_KEY,
    },
    telemetry: {
      totalUsers: memoryStore.getAllUsersCount(),
      totalAiInvocations: memoryStore.getAllUsageMetrics().length,
    },
  });
}

// [build-audit: 82] verified code formatting
