import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { executeLLMRequest } from '@/lib/llm/adapter';

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chats = memoryStore.getConversationsByUserId(session.userId);
  return NextResponse.json({ conversations: chats });
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversationId, message, persona = 'executive' } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const profile = memoryStore.getProfileByUserId(session.userId);

    let convo: any = conversationId ? memoryStore.getConversationsByUserId(session.userId).find(c => c._id === conversationId) : null;
    if (!convo) {
      convo = {
        userId: session.userId,
        title: message.substring(0, 35) + '...',
        messages: [],
      };
    }

    // Add user message
    const userMsg = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      persona,
    };
    convo.messages.push(userMsg);

    // Build persona-specific advisory prompt
    let personaGuidance = 'You are CareerPath AI, an expert agentic Career Advisor and Executive Coach.';
    if (persona === 'system_design') {
      personaGuidance = 'You are CareerPath AI’s Principal Systems Architect & Staff+ Engineering Coach. Specialize in high-concurrency architectures, distributed systems, vector retrieval, microservices, databases, and architectural trade-offs.';
    } else if (persona === 'salary_negotiator') {
      personaGuidance = 'You are CareerPath AI’s Executive Compensation & Total Rewards Specialist. Specialize in tech salary bands, equity (RSUs/options), signing bonuses, counter-offer negotiation scripts, and leverage assessment.';
    } else if (persona === 'resume_optimizer') {
      personaGuidance = 'You are CareerPath AI’s Lead Technical Recruiter and ATS Optimization Expert. Focus on restructuring resume achievements, elevating action verbs, removing filler words, and maximizing quantifiable impact ($ / % / throughput).';
    } else if (persona === 'interview_coach') {
      personaGuidance = 'You are CareerPath AI’s Senior Behavioral & STAR Interview Strategist. Specialize in coaching candidates through tough behavioral, leadership, and cross-functional conflict questions using the strict Situation, Task, Action, Result framework.';
    }

    const systemPrompt = `${personaGuidance}
You provide strategic, actionable, and personalized career advice based on the user's background.
Format your responses with clear markdown: bullet points, bold key insights, and structured next steps. Keep advice direct, actionable, and free of fluff.
User Profile context:
Current Role: ${profile?.currentRole || 'Professional'}
Target Role: ${profile?.targetRole || 'Not specified'}
Experience Level: ${profile?.experienceLevel || 'Mid-level'}
Top Skills: ${profile?.skills?.map((s: any) => s.name).slice(0, 8).join(', ') || 'Software Engineering'}`;

    const recentHistory = convo.messages.slice(-4).map((m: any) => `${m.role}: ${m.content}`).join('\n');

    const llmResult = await executeLLMRequest({
      userId: session.userId,
      taskType: 'chat',
      systemPrompt,
      userPrompt: `Conversation History:\n${recentHistory}\n\nAnswer the user's latest query with authoritative, high-value advice.`,
      responseFormat: 'text',
    });

    const aiMsg = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: llmResult.content,
      timestamp: new Date().toISOString(),
      agentTask: 'career_advisor',
      persona,
    };
    convo.messages.push(aiMsg);

    const saved = memoryStore.saveConversation(convo);

    return NextResponse.json({
      conversationId: saved._id,
      message: aiMsg,
      conversation: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Chat error' }, { status: 500 });
  }
}
