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
    const targetRole = body.targetRole || 'Full Stack Engineer';
    const profile = memoryStore.getProfileByUserId(session.userId);

    const systemPrompt = `You are an elite ATS resume architect. Convert the candidate profile into a high-impact, professional resume.
Output MUST be strict JSON in this exact structure:
{
  "summary": string,
  "experiences": [
    {
      "company": string,
      "role": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "bullets": string[]
    }
  ],
  "skills": string[],
  "atsScore": number (70-95),
  "atsFeedback": {
    "strengths": string[],
    "improvements": string[],
    "missingKeywords": string[]
  }
}
Do NOT invent false credentials. Extract accomplishments using action verbs and quantifiable results.`;

    const userPrompt = `Candidate Profile:
Current Role: ${profile?.currentRole || 'Engineer'}
Experience Level: ${profile?.experienceLevel || 'Mid-level'}
Target Role: ${targetRole}
Known Skills: ${profile?.skills?.map((s: any) => s.name).join(', ') || 'TypeScript, React, Node.js'}
Education: ${profile?.education?.[0]?.institution || 'University'} - ${profile?.education?.[0]?.degree || 'BS Computer Science'}

Generate an ATS-optimized resume profile matching the target role.`;

    const llmResult = await executeLLMRequest({
      userId: session.userId,
      taskType: 'resume_generation',
      systemPrompt,
      userPrompt,
      responseFormat: 'json',
    });

    const parsed = JSON.parse(llmResult.content);

    const user = memoryStore.findUserById(session.userId);

    const generatedResume = {
      userId: session.userId,
      title: `${targetRole} - ATS Ready`,
      template: 'modern',
      targetRole,
      contactInfo: {
        fullName: user?.name || 'Candidate',
        email: user?.email || 'candidate@example.com',
        phone: '+1 (555) 234-5678',
        location: profile?.preferredLocations?.[0] || 'San Francisco, CA',
        linkedin: 'linkedin.com/in/profile',
        github: 'github.com/profile',
      },
      summary: parsed.summary,
      experiences: parsed.experiences || [],
      education: profile?.education || [
        {
          institution: 'State University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          graduationYear: '2022',
        },
      ],
      projects: [
        {
          title: 'Cloud Orchestration Platform',
          description: 'Designed and deployed distributed task scheduler with Redis and Docker.',
          technologies: ['TypeScript', 'Node.js', 'Docker', 'Redis'],
        },
      ],
      skills: parsed.skills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
      certifications: profile?.certifications?.map((c: any) => `${c.name} (${c.issuer})`) || ['AWS Solutions Architect'],
      atsScore: parsed.atsScore || 86,
      atsFeedback: parsed.atsFeedback || {
        strengths: ['Concise summary statement', 'High action verb usage'],
        improvements: ['Include more metrics in project section'],
        missingKeywords: [],
      },
      version: 1,
    };

    const saved = memoryStore.saveResume(generatedResume);
    return NextResponse.json({ message: 'Resume generated successfully', resume: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to generate resume' }, { status: 500 });
  }
}
