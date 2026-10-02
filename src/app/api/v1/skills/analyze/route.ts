import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { executeLLMRequest } from '@/lib/llm/adapter';

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const profile = memoryStore.getProfileByUserId(session.userId);
    const targetRole = body.targetRole || profile?.targetRole || 'Senior AI Engineer';

    const systemPrompt = `You are an expert AI Tech Talent Strategist and Competency Analyst.
Analyze the user's skill set versus the target role requirements.
Output MUST be strict JSON in this exact structure:
{
  "matchScore": number (0-100),
  "demonstratedSkills": string[],
  "developingSkills": string[],
  "missingSkills": string[],
  "skillRelevanceMap": Record<string, string>,
  "recommendedActions": string[]
}
Clearly distinguish demonstrated from missing skills and explain relevance for each.`;

    const userPrompt = `Target Role: ${targetRole}
User Experience: ${profile?.experienceLevel || 'Mid-level'}
Current Skills: ${profile?.skills?.map((s: any) => `${s.name} (${s.level})`).join(', ') || 'TypeScript, React, Node.js'}`;

    const llmResult = await executeLLMRequest({
      userId: session.userId,
      taskType: 'skill_analysis',
      systemPrompt,
      userPrompt,
      responseFormat: 'json',
    });

    const parsed = JSON.parse(llmResult.content);

    return NextResponse.json({
      targetRole,
      matchScore: parsed.matchScore || 75,
      demonstratedSkills: parsed.demonstratedSkills || [],
      developingSkills: parsed.developingSkills || [],
      missingSkills: parsed.missingSkills || [],
      skillRelevanceMap: parsed.skillRelevanceMap || {},
      recommendedActions: parsed.recommendedActions || [],
      provider: llmResult.provider,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Skill gap analysis failed' }, { status: 500 });
  }
}
