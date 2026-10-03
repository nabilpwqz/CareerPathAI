import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { executeLLMRequest } from '@/lib/llm/adapter';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const interview = memoryStore.getInterviewById(params.id, session.userId);
  if (!interview) {
    return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { questionId, userAnswer } = body;

    if (!userAnswer || userAnswer.trim().length < 10) {
      return NextResponse.json({ error: 'Answer must be at least 10 characters long' }, { status: 400 });
    }

    const targetQ = interview.questions.find((q: any) => q.id === questionId);
    if (!targetQ) {
      return NextResponse.json({ error: 'Question not found in this session' }, { status: 404 });
    }

    const systemPrompt = `You are an elite Engineering Hiring Manager and Interview Coach at a top technology firm.
Evaluate the candidate's interview answer using the STAR method (Situation, Task, Action, Result).
Output MUST be strict JSON matching this structure:
{
  "score": number (0-100),
  "starAdherence": string,
  "strengths": string[],
  "weaknesses": string[],
  "idealAnswerOutline": string[]
}
Provide honest, constructive, and actionable feedback.`;

    const userPrompt = `Target Role: ${interview.targetRole}
Question: ${targetQ.question}
Context/Rubric: ${targetQ.keyRubricPoints.join(', ')}

Candidate Answer:
"${userAnswer}"`;

    const llmResult = await executeLLMRequest({
      userId: session.userId,
      taskType: 'interview_coach',
      systemPrompt,
      userPrompt,
      responseFormat: 'json',
    });

    const parsed = JSON.parse(llmResult.content);

    targetQ.userAnswer = userAnswer;
    targetQ.feedback = {
      score: parsed.score || 80,
      starAdherence: parsed.starAdherence || 'Standard STAR adherence',
      strengths: parsed.strengths || ['Good technical clarity'],
      weaknesses: parsed.weaknesses || ['Could detail business impact further'],
      idealAnswerOutline: parsed.idealAnswerOutline || [],
    };

    // Calculate overall session score
    const answered = interview.questions.filter((q: any) => q.feedback?.score != null);
    if (answered.length > 0) {
      const avg = Math.round(answered.reduce((sum: number, q: any) => sum + (q.feedback?.score || 0), 0) / answered.length);
      interview.overallScore = avg;
      interview.completed = answered.length === interview.questions.length;
    }

    const updated = memoryStore.saveInterview(interview);

    return NextResponse.json({
      message: 'Answer evaluated successfully',
      question: targetQ,
      overallScore: updated.overallScore,
      completed: updated.completed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to evaluate answer' }, { status: 500 });
  }
}
