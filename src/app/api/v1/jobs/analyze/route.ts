import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { executeLLMRequest } from '@/lib/llm/adapter';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const analyses = memoryStore.getJobAnalysesByUserId(session.userId);
  return NextResponse.json({ analyses });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { jobTitle, company, rawDescription } = body;

    if (!rawDescription || rawDescription.trim().length < 20) {
      return NextResponse.json({ error: 'Please paste a valid job description (at least 20 characters)' }, { status: 400 });
    }

    const profile = memoryStore.getProfileByUserId(session.userId);
    const candidateSkills = profile?.skills?.map((s: any) => s.name).join(', ') || 'TypeScript, React, Node.js';

    const systemPrompt = `You are an expert Technical Recruiter and Job Fit Analyst.
Extract key requirements from the job description and compare against candidate background.
Output MUST be strict JSON in this exact structure:
{
  "jobTitle": "${jobTitle || 'Extracted Role'}",
  "company": "${company || 'Target Company'}",
  "extractedRequirements": {
    "coreSkills": string[],
    "toolsAndFrameworks": string[],
    "experienceRequired": string,
    "educationRequired": string,
    "keyResponsibilities": string[]
  },
  "alignmentScore": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "tailoringAdvice": string[]
}`;

    const userPrompt = `Candidate Skills: ${candidateSkills}
Job Description:
${rawDescription.substring(0, 4000)}`;

    const llmResult = await executeLLMRequest({
      userId: session.userId,
      taskType: 'job_analysis',
      systemPrompt,
      userPrompt,
      responseFormat: 'json',
    });

    const parsed = JSON.parse(llmResult.content);

    const savedRecord = memoryStore.saveJobAnalysis({
      userId: session.userId,
      jobTitle: parsed.jobTitle || jobTitle || 'Target Role',
      company: parsed.company || company || 'Company',
      rawDescription,
      extractedRequirements: parsed.extractedRequirements || {
        coreSkills: [],
        toolsAndFrameworks: [],
        experienceRequired: '3+ years',
        educationRequired: 'B.S. or equivalent',
        keyResponsibilities: [],
      },
      alignmentScore: parsed.alignmentScore || 75,
      matchingSkills: parsed.matchingSkills || [],
      missingSkills: parsed.missingSkills || [],
      tailoringAdvice: parsed.tailoringAdvice || [],
    });

    return NextResponse.json({ message: 'Job analysis completed', analysis: savedRecord }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Job analysis failed' }, { status: 500 });
  }
}
