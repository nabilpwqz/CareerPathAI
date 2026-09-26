import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isFallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isFallback: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; isFallback: boolean }> {
  if (cached.conn) {
    return { isConnected: true, isFallback: cached.isFallback };
  }

  if (!MONGODB_URI) {
    // If no URI provided, enable fallback in-memory persistent store
    cached.isFallback = true;
    return { isConnected: true, isFallback: true };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 4000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        cached.isFallback = false;
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn('⚠️ MongoDB connection could not be established. Enabling in-memory high-performance fallback store.', err?.message);
        cached.isFallback = true;
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true, isFallback: cached.isFallback };
  } catch {
    cached.isFallback = true;
    return { isConnected: true, isFallback: true };
  }
}

// In-Memory Persistent Data Store for Fallback / Standalone execution
class MemoryStorage {
  private users: Map<string, any> = new Map();
  private profiles: Map<string, any> = new Map();
  private resumes: Map<string, any> = new Map();
  private roadmaps: Map<string, any> = new Map();
  private jobs: Map<string, any> = new Map();
  private interviews: Map<string, any> = new Map();
  private chats: Map<string, any> = new Map();
  private usage: Map<string, any> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed standard demo user
    const demoUserId = 'demo-user-id-001';
    this.users.set(demoUserId, {
      _id: demoUserId,
      name: 'Sarah Chen (Demo)',
      email: 'demo@careerpath.ai',
      role: 'demo',
      passwordHash: '$2a$10$demo.hashed.password.careerpath.ai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.profiles.set(demoUserId, {
      _id: 'prof-001',
      userId: demoUserId,
      experienceLevel: 'Mid-level',
      currentRole: 'Full Stack Engineer',
      targetRole: 'Senior AI Systems Engineer',
      targetIndustry: 'Artificial Intelligence & SaaS',
      yearsOfExperience: 4,
      skills: [
        { name: 'TypeScript', level: 'advanced', category: 'Languages' },
        { name: 'React & Next.js', level: 'advanced', category: 'Frontend' },
        { name: 'Node.js & Express', level: 'advanced', category: 'Backend' },
        { name: 'Python', level: 'intermediate', category: 'Languages' },
        { name: 'PostgreSQL', level: 'intermediate', category: 'Databases' },
        { name: 'LangChain / LLM APIs', level: 'beginner', category: 'AI/ML' },
        { name: 'Docker & Kubernetes', level: 'intermediate', category: 'DevOps' },
      ],
      preferredLocations: ['Remote', 'San Francisco, CA', 'New York, NY'],
      workPreference: 'remote',
      expectedSalary: '$145,000 - $185,000',
      bio: 'Full stack software engineer passionate about building scalable AI-integrated cloud applications.',
      education: [
        {
          institution: 'University of Washington',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          graduationYear: '2022',
        },
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          year: '2024',
        },
      ],
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // User operations
  findUserByEmail(email: string) {
    for (const u of Array.from(this.users.values())) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  findUserById(id: string) {
    return this.users.get(id) || null;
  }

  saveUser(user: any) {
    const id = user._id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record = { ...user, _id: id, updatedAt: new Date().toISOString() };
    this.users.set(id, record);
    return record;
  }

  // Profile operations
  getProfileByUserId(userId: string) {
    for (const p of Array.from(this.profiles.values())) {
      if (p.userId === userId) return p;
    }
    return null;
  }

  saveProfile(profile: any) {
    const id = profile._id || `prof_${Date.now()}`;
    const record = { ...profile, _id: id, updatedAt: new Date().toISOString() };
    this.profiles.set(id, record);
    return record;
  }

  // Resume operations
  getResumesByUserId(userId: string) {
    return Array.from(this.resumes.values()).filter((r) => r.userId === userId);
  }

  getResumeById(id: string, userId?: string) {
    const r = this.resumes.get(id);
    if (!r) return null;
    if (userId && r.userId !== userId) return null;
    return r;
  }

  saveResume(resume: any) {
    const id = resume._id || `res_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const record = {
      ...resume,
      _id: id,
      version: (resume.version || 0) + 1,
      updatedAt: new Date().toISOString(),
      createdAt: resume.createdAt || new Date().toISOString(),
    };
    this.resumes.set(id, record);
    return record;
  }

  deleteResume(id: string, userId: string) {
    const r = this.getResumeById(id, userId);
    if (r) {
      this.resumes.delete(id);
      return true;
    }
    return false;
  }

  // Roadmap operations
  getRoadmapsByUserId(userId: string) {
    return Array.from(this.roadmaps.values()).filter((rm) => rm.userId === userId);
  }

  getRoadmapById(id: string, userId: string) {
    const rm = this.roadmaps.get(id);
    if (!rm || rm.userId !== userId) return null;
    return rm;
  }

  saveRoadmap(roadmap: any) {
    const id = roadmap._id || `rdm_${Date.now()}`;
    const record = {
      ...roadmap,
      _id: id,
      updatedAt: new Date().toISOString(),
      createdAt: roadmap.createdAt || new Date().toISOString(),
    };
    this.roadmaps.set(id, record);
    return record;
  }

  updateRoadmapTask(roadmapId: string, taskId: string, completed: boolean, userId: string) {
    const rm = this.getRoadmapById(roadmapId, userId);
    if (!rm) return null;

    let found = false;
    for (const phase of rm.phases) {
      for (const t of phase.tasks) {
        if (t.id === taskId) {
          t.completed = completed;
          t.completedAt = completed ? new Date().toISOString() : undefined;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      // Recalculate progress
      let totalTasks = 0;
      let completedTasks = 0;
      for (const phase of rm.phases) {
        for (const t of phase.tasks) {
          totalTasks++;
          if (t.completed) completedTasks++;
        }
      }
      rm.readinessScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : rm.readinessScore;
      rm.updatedAt = new Date().toISOString();
      this.roadmaps.set(roadmapId, rm);
    }
    return rm;
  }

  // Job analysis operations
  getJobAnalysesByUserId(userId: string) {
    return Array.from(this.jobs.values()).filter((j) => j.userId === userId);
  }

  saveJobAnalysis(jobAnalysis: any) {
    const id = jobAnalysis._id || `job_${Date.now()}`;
    const record = { ...jobAnalysis, _id: id, createdAt: new Date().toISOString() };
    this.jobs.set(id, record);
    return record;
  }

  deleteJobAnalysis(id: string, userId: string) {
    const j = this.jobs.get(id);
    if (j && j.userId === userId) {
      this.jobs.delete(id);
      return true;
    }
    return false;
  }

  // Interview session operations
  getInterviewsByUserId(userId: string) {
    return Array.from(this.interviews.values()).filter((i) => i.userId === userId);
  }

  getInterviewById(id: string, userId: string) {
    const session = this.interviews.get(id);
    if (!session || session.userId !== userId) return null;
    return session;
  }

  saveInterview(interview: any) {
    const id = interview._id || `int_${Date.now()}`;
    const record = { ...interview, _id: id, updatedAt: new Date().toISOString() };
    this.interviews.set(id, record);
    return record;
  }

  // AI Chat conversations
  getConversationsByUserId(userId: string) {
    return Array.from(this.chats.values()).filter((c) => c.userId === userId);
  }

  saveConversation(convo: any) {
    const id = convo._id || `chat_${Date.now()}`;
    const record = { ...convo, _id: id, updatedAt: new Date().toISOString() };
    this.chats.set(id, record);
    return record;
  }

  deleteConversation(id: string, userId: string) {
    const c = this.chats.get(id);
    if (c && c.userId === userId) {
      this.chats.delete(id);
      return true;
    }
    return false;
  }

  // AI Telemetry / Usage
  logAiUsage(metric: any) {
    const id = metric._id || `usg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const record = { ...metric, _id: id, createdAt: new Date().toISOString() };
    this.usage.set(id, record);
    return record;
  }

  getAllUsageMetrics() {
    return Array.from(this.usage.values());
  }

  getAllUsersCount() {
    return this.users.size;
  }
}

export const memoryStore = new MemoryStorage();
