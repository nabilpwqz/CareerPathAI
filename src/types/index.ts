// ==========================================
// CareerPath AI Core Type Definitions
// ==========================================

export type UserRole = 'user' | 'admin' | 'demo';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICareerProfile {
  _id: string;
  userId: string;
  experienceLevel: 'Entry' | 'Entry-Mid' | 'Mid-level' | 'Mid-Senior' | 'Senior' | 'Director' | 'Executive';
  currentRole: string;
  targetRole: string;
  targetIndustry: string;
  yearsOfExperience: number;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category?: string;
  }>;
  preferredLocations: string[];
  workPreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  expectedSalary?: string;
  bio?: string;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IResumeSectionExperience {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface IResumeSectionEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa?: string;
}

export interface IResumeSectionProject {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface IResume {
  _id: string;
  userId: string;
  title: string;
  template: 'modern' | 'executive' | 'minimal' | 'technical';
  targetRole: string;
  targetJobDescription?: string;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experiences: IResumeSectionExperience[];
  education: IResumeSectionEducation[];
  projects: IResumeSectionProject[];
  skills: string[];
  certifications: string[];
  atsScore?: number;
  atsFeedback?: {
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRoadmapTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high';
  category: 'core' | 'framework' | 'architecture' | 'portfolio' | 'practice';
  resourceUrls?: string[];
  completed: boolean;
  completedAt?: string;
}

export interface IRoadmapMilestone {
  id: string;
  phaseNumber: number;
  phaseTitle: string;
  objective: string;
  durationWeeks: number;
  tasks: IRoadmapTask[];
  suggestedProject?: {
    title: string;
    description: string;
    keyDeliverables: string[];
  };
}

export interface ICareerRoadmap {
  _id: string;
  userId: string;
  targetRole: string;
  currentRole: string;
  readinessScore: number;
  estimatedMonths: number;
  weeklyStudyHours: number;
  phases: IRoadmapMilestone[];
  assumptions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ISkillAnalysis {
  _id?: string;
  userId: string;
  targetRole: string;
  matchScore: number;
  demonstratedSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  skillRelevanceMap: Record<string, string>;
  recommendedActions: string[];
  createdAt: string;
}

export interface IJobAnalysis {
  _id: string;
  userId: string;
  jobTitle: string;
  company?: string;
  rawDescription: string;
  extractedRequirements: {
    coreSkills: string[];
    toolsAndFrameworks: string[];
    experienceRequired: string;
    educationRequired: string;
    keyResponsibilities: string[];
  };
  alignmentScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  tailoringAdvice: string[];
  createdAt: string;
}

export interface IInterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | 'system-design';
  question: string;
  context: string;
  keyRubricPoints: string[];
  userAnswer?: string;
  feedback?: {
    score: number; // 0 - 100
    starAdherence?: string;
    strengths: string[];
    weaknesses: string[];
    idealAnswerOutline: string[];
  };
}

export interface IInterviewSession {
  _id: string;
  userId: string;
  targetRole: string;
  difficulty: 'entry' | 'intermediate' | 'senior';
  overallScore?: number;
  questions: IInterviewQuestion[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentTask?: string;
}

export interface IAIConversation {
  _id: string;
  userId: string;
  title: string;
  messages: IChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface IAIUsageMetric {
  _id: string;
  userId: string;
  provider: string;
  model: string;
  taskType: 'resume_generation' | 'resume_tailor' | 'roadmap_generation' | 'skill_analysis' | 'interview_coach' | 'job_analysis' | 'chat';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  status: 'success' | 'failed' | 'fallback';
  createdAt: string;
}
