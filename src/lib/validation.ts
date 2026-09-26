import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export const CareerProfileSchema = z.object({
  experienceLevel: z.enum(['Entry', 'Entry-Mid', 'Mid-level', 'Mid-Senior', 'Senior', 'Director', 'Executive']),
  currentRole: z.string().min(2, 'Current role is required'),
  targetRole: z.string().min(2, 'Target role is required'),
  targetIndustry: z.string().min(2, 'Target industry is required'),
  yearsOfExperience: z.number().min(0).max(50),
  skills: z.array(
    z.object({
      name: z.string().min(1),
      level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
      category: z.string().optional(),
    })
  ).min(1, 'Please specify at least one skill'),
  preferredLocations: z.array(z.string()).default([]),
  workPreference: z.enum(['remote', 'hybrid', 'onsite', 'flexible']).default('remote'),
  expectedSalary: z.string().optional(),
  bio: z.string().max(1000).optional(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string(),
      graduationYear: z.string(),
    })
  ).optional(),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.string(),
    })
  ).optional(),
  onboardingCompleted: z.boolean().default(false),
});

export const ResumeExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().default('Present'),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).min(1, 'Add at least one accomplishment bullet'),
});

export const ResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  template: z.enum(['modern', 'executive', 'minimal', 'technical']).default('modern'),
  targetRole: z.string().min(1, 'Target role is required'),
  targetJobDescription: z.string().optional(),
  contactInfo: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(5, 'Phone number is required'),
    location: z.string().min(2, 'Location is required'),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  summary: z.string().min(20, 'Executive summary should be at least 20 characters'),
  experiences: z.array(ResumeExperienceSchema).default([]),
  education: z.array(
    z.object({
      institution: z.string().min(1),
      degree: z.string().min(1),
      fieldOfStudy: z.string().min(1),
      graduationYear: z.string().min(1),
      gpa: z.string().optional(),
    })
  ).default([]),
  projects: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      technologies: z.array(z.string()).default([]),
      link: z.string().optional(),
    })
  ).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
});

export const TailorResumeRequestSchema = z.object({
  resumeId: z.string().optional(),
  resumeData: ResumeSchema.optional(),
  jobDescription: z.string().min(30, 'Please paste a comprehensive job description (at least 30 characters)'),
});

export const GenerateRoadmapRequestSchema = z.object({
  targetRole: z.string().min(2, 'Target role is required'),
  currentRole: z.string().optional(),
  weeklyStudyHours: z.number().min(2).max(60).default(10),
  timelineMonths: z.number().min(1).max(24).default(6),
  focusAreas: z.array(z.string()).optional(),
});

export const JobAnalysisRequestSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is required'),
  company: z.string().optional(),
  rawDescription: z.string().min(30, 'Please paste a complete job description'),
});

export const InterviewAnswerSchema = z.object({
  questionId: z.string().min(1),
  userAnswer: z.string().min(10, 'Your response should be at least 10 characters'),
});
