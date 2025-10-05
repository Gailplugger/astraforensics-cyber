import { useKV } from '@github/spark/hooks'

// Define comprehensive data types for the backend
export interface User {
  id: string
  name: string
  email: string
  class: string
  phone: string
  registeredAt: string
  lastLoginAt?: string
  preferences: UserPreferences
  achievements: Achievement[]
  totalPoints: number
  level: number
  streakDays: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  aiAssistantEnabled: boolean
  preferredLanguage: string
  studyReminders: boolean
  difficultyPreference: 'adaptive' | 'beginner' | 'intermediate' | 'advanced'
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  points: number
  category: 'learning' | 'quiz' | 'streak' | 'special'
}

export interface ModuleProgress {
  moduleId: string
  userId: string
  completed: boolean
  progress: number
  currentSection: number
  timeSpent: number
  startedAt: string
  completedAt?: string
  quizAttempts: QuizAttempt[]
  certificateEarned?: Certificate
  averageScore: number
  bestScore: number
}

export interface QuizAttempt {
  id: string
  moduleId: string
  userId: string
  questions: QuizQuestion[]
  answers: Record<string, number>
  score: number
  timeSpent: number
  completedAt: string
  difficulty: 'easy' | 'medium' | 'hard'
  aiGenerated: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  points: number
  tags: string[]
}

export interface Certificate {
  id: string
  userId: string
  moduleId: string
  certificateNumber: string
  issueDate: string
  studentName: string
  courseName: string
  score: number
  modules: string[]
  validUntil?: string
  verificationCode: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  modules: string[]
  estimatedDuration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  objectives: string[]
  certification: boolean
}

export interface AIInteraction {
  id: string
  userId: string
  timestamp: string
  userMessage: string
  aiResponse: string
  context: string
  sentiment: 'positive' | 'neutral' | 'negative'
  helpful: boolean | null
}

export interface StudySession {
  id: string
  userId: string
  moduleId: string
  startTime: string
  endTime?: string
  duration: number
  sectionsCompleted: number
  notes: string[]
  focusScore: number // 1-10 based on engagement
}

export interface PlatformAnalytics {
  totalUsers: number
  activeUsers: number
  modulesCompleted: number
  quizzesAttempted: number
  certificatesIssued: number
  averageScore: number
  popularModules: Array<{moduleId: string; completions: number}>
  userGrowth: Array<{date: string; newUsers: number}>
}

// Backend service class for data management
export class AstraForensicsBackend {
  private static instance: AstraForensicsBackend
  
  static getInstance(): AstraForensicsBackend {
    if (!this.instance) {
      this.instance = new AstraForensicsBackend()
    }
    return this.instance
  }

  // User Management
  async createUser(userData: Omit<User, 'id' | 'achievements' | 'totalPoints' | 'level' | 'streakDays'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.generateId(),
      achievements: [],
      totalPoints: 0,
      level: 1,
      streakDays: 0
    }
    
    // Save user to KV store
    const users = await this.getUsers()
    users.push(user)
    await this.saveUsers(users)
    
    return user
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) return null
    
    users[userIndex] = { ...users[userIndex], ...updates }
    await this.saveUsers(users)
    
    return users[userIndex]
  }

  async getUser(userId: string): Promise<User | null> {
    const users = await this.getUsers()
    return users.find(u => u.id === userId) || null
  }

  // Module Progress Management
  async updateModuleProgress(userId: string, moduleId: string, progress: Partial<ModuleProgress>): Promise<void> {
    const key = `module-progress-${userId}`
    const moduleProgresses = await this.getValue<ModuleProgress[]>(key) || []
    
    const existingIndex = moduleProgresses.findIndex(p => p.moduleId === moduleId)
    
    if (existingIndex >= 0) {
      moduleProgresses[existingIndex] = { ...moduleProgresses[existingIndex], ...progress }
    } else {
      const newProgress: ModuleProgress = {
        moduleId,
        userId,
        completed: false,
        progress: 0,
        currentSection: 0,
        timeSpent: 0,
        startedAt: new Date().toISOString(),
        quizAttempts: [],
        averageScore: 0,
        bestScore: 0,
        ...progress
      }
      moduleProgresses.push(newProgress)
    }
    
    await this.setValue(key, moduleProgresses)
    
    // Update user level and points if module completed
    if (progress.completed) {
      await this.updateUserPoints(userId, 100) // 100 points per module
      await this.checkAndUnlockAchievements(userId)
    }
  }

  async getModuleProgress(userId: string, moduleId?: string): Promise<ModuleProgress[]> {
    const key = `module-progress-${userId}`
    const progresses = await this.getValue<ModuleProgress[]>(key) || []
    
    if (moduleId) {
      return progresses.filter(p => p.moduleId === moduleId)
    }
    
    return progresses
  }

  // Quiz Management
  async saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
    const key = `quiz-attempts-${attempt.userId}`
    const attempts = await this.getValue<QuizAttempt[]>(key) || []
    attempts.push(attempt)
    await this.setValue(key, attempts)
    
    // Update user points based on score
    const points = Math.round(attempt.score * 2) // Up to 200 points for perfect score
    await this.updateUserPoints(attempt.userId, points)
  }

  async generateAIQuiz(topic: string, difficulty: string, questionCount: number): Promise<QuizQuestion[]> {
    try {
      // Check if Spark is available before attempting AI generation
      if (typeof window === 'undefined' || !window.spark) {
        console.warn('Spark API not available, using fallback questions')
        return this.getFallbackQuestions(topic, difficulty, questionCount)
      }

      const prompt = (window as any).spark.llmPrompt`Generate ${questionCount} cybersecurity quiz questions about ${topic} with ${difficulty} difficulty.

      Return a JSON object with a "questions" array. Each question should have:
      - id: unique identifier
      - question: the question text
      - options: array of 4 answer choices
      - correctAnswer: index (0-3) of the correct answer
      - explanation: detailed explanation
      - difficulty: "${difficulty}"
      - topic: "${topic}"
      - points: based on difficulty (easy=5, medium=10, hard=15)
      - tags: relevant keywords array

      Focus on practical cybersecurity scenarios and current threats.`

      const response = await (window as any).spark.llm(prompt, 'gpt-4o', true)
      const quizData = JSON.parse(response)
      
      return quizData.questions || this.getFallbackQuestions(topic, difficulty, questionCount)
    } catch (error) {
      console.error('Failed to generate AI quiz:', error)
      return this.getFallbackQuestions(topic, difficulty, questionCount)
    }
  }

  // Certificate Management
  async issueCertificate(userId: string, moduleId: string, score: number): Promise<Certificate> {
    const user = await this.getUser(userId)
    if (!user) throw new Error('User not found')

    const certificate: Certificate = {
      id: this.generateId(),
      userId,
      moduleId,
      certificateNumber: this.generateCertificateNumber(moduleId),
      issueDate: new Date().toISOString(),
      studentName: user.name,
      courseName: this.getModuleName(moduleId),
      score,
      modules: [moduleId],
      verificationCode: this.generateVerificationCode()
    }

    const key = `certificates-${userId}`
    const certificates = await this.getValue<Certificate[]>(key) || []
    certificates.push(certificate)
    await this.setValue(key, certificates)

    // Award achievement for first certificate
    if (certificates.length === 1) {
      await this.unlockAchievement(userId, 'first-certificate')
    }

    return certificate
  }

  // Achievement System
  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const user = await this.getUser(userId)
    if (!user) return

    const achievements = this.getAchievementDefinitions()
    const achievement = achievements[achievementId]
    if (!achievement) return

    const userAchievement: Achievement = {
      ...achievement,
      id: this.generateId(),
      unlockedAt: new Date().toISOString()
    }

    user.achievements.push(userAchievement)
    user.totalPoints += achievement.points

    await this.updateUser(userId, user)
  }

  async checkAndUnlockAchievements(userId: string): Promise<void> {
    const user = await this.getUser(userId)
    if (!user) return

    const moduleProgresses = await this.getModuleProgress(userId)
    const completedModules = moduleProgresses.filter(p => p.completed).length

    // Check various achievement conditions
    const achievementChecks = [
      { condition: completedModules >= 1, id: 'first-module' },
      { condition: completedModules >= 5, id: 'five-modules' },
      { condition: completedModules >= 10, id: 'ten-modules' },
      { condition: user.totalPoints >= 1000, id: 'thousand-points' },
      { condition: user.streakDays >= 7, id: 'week-streak' },
      { condition: user.streakDays >= 30, id: 'month-streak' }
    ]

    for (const check of achievementChecks) {
      if (check.condition && !user.achievements.find(a => a.id === check.id)) {
        await this.unlockAchievement(userId, check.id)
      }
    }
  }

  // AI Interaction Tracking
  async logAIInteraction(interaction: Omit<AIInteraction, 'id' | 'timestamp'>): Promise<void> {
    const fullInteraction: AIInteraction = {
      ...interaction,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    }

    const key = `ai-interactions-${interaction.userId}`
    const interactions = await this.getValue<AIInteraction[]>(key) || []
    interactions.push(fullInteraction)
    
    // Keep only last 100 interactions per user
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100)
    }
    
    await this.setValue(key, interactions)
  }

  // Analytics
  async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    const users = await this.getUsers()
    const activeUsers = users.filter(u => {
      const lastLogin = new Date(u.lastLoginAt || u.registeredAt)
      const daysSinceLogin = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceLogin <= 30
    }).length

    // Calculate other metrics from stored data
    const analytics: PlatformAnalytics = {
      totalUsers: users.length,
      activeUsers,
      modulesCompleted: 0, // Would calculate from all module progress
      quizzesAttempted: 0, // Would calculate from all quiz attempts
      certificatesIssued: 0, // Would calculate from all certificates
      averageScore: 0, // Would calculate from all quiz attempts
      popularModules: [], // Would analyze from module progress data
      userGrowth: [] // Would analyze from user registration dates
    }

    return analytics
  }

  // Utility methods
  private async getUsers(): Promise<User[]> {
    return await this.getValue<User[]>('all-users') || []
  }

  private async saveUsers(users: User[]): Promise<void> {
    await this.setValue('all-users', users)
  }

  private async getValue<T>(key: string): Promise<T | undefined> {
    try {
      if (typeof window === 'undefined' || !window.spark) {
        console.warn(`Cannot access KV store: Spark API not available for key ${key}`)
        return undefined
      }
      return await ((window as any).spark.kv.get as <T>(key: string) => Promise<T | undefined>)(key)
    } catch (error) {
      console.error(`Failed to get value for key ${key}:`, error)
      return undefined
    }
  }

  private async setValue<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.spark) {
        console.warn(`Cannot save to KV store: Spark API not available for key ${key}`)
        return
      }
      await ((window as any).spark.kv.set as <T>(key: string, value: T) => Promise<void>)(key, value)
    } catch (error) {
      console.error(`Failed to set value for key ${key}:`, error)
    }
  }

  private async updateUserPoints(userId: string, points: number): Promise<void> {
    const user = await this.getUser(userId)
    if (!user) return

    user.totalPoints += points
    user.level = Math.floor(user.totalPoints / 1000) + 1
    
    await this.updateUser(userId, user)
  }

  private generateId(): string {
    return `ast_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private generateCertificateNumber(moduleId: string): string {
    const prefix = moduleId.toUpperCase().substring(0, 3)
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `AST-${prefix}-${timestamp}-${random}`
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 15).toUpperCase()
  }

  private getModuleName(moduleId: string): string {
    const moduleNames: Record<string, string> = {
      'cybersecurity-fundamentals': 'Cybersecurity Fundamentals',
      'network-security': 'Network Security Essentials',
      'malware-analysis': 'Malware Analysis & Reverse Engineering',
      'incident-response': 'Incident Response & Digital Forensics',
      'penetration-testing': 'Ethical Hacking & Penetration Testing',
      'cryptography': 'Applied Cryptography',
      'identity-access-management': 'Identity & Access Management',
      'ai-cybersecurity': 'AI in Cybersecurity'
    }
    return moduleNames[moduleId] || 'Unknown Module'
  }

  private getAchievementDefinitions(): Record<string, Omit<Achievement, 'id' | 'unlockedAt'>> {
    return {
      'first-module': {
        title: 'First Steps',
        description: 'Completed your first learning module',
        icon: '🎯',
        points: 100,
        category: 'learning'
      },
      'five-modules': {
        title: 'Dedicated Learner',
        description: 'Completed 5 learning modules',
        icon: '📚',
        points: 500,
        category: 'learning'
      },
      'ten-modules': {
        title: 'Cybersecurity Expert',
        description: 'Completed 10 learning modules',
        icon: '🏆',
        points: 1000,
        category: 'learning'
      },
      'first-certificate': {
        title: 'Certified Professional',
        description: 'Earned your first certificate',
        icon: '🎓',
        points: 250,
        category: 'learning'
      },
      'thousand-points': {
        title: 'Point Master',
        description: 'Earned 1000 total points',
        icon: '⭐',
        points: 200,
        category: 'special'
      },
      'week-streak': {
        title: 'Consistent Learner',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        points: 300,
        category: 'streak'
      },
      'month-streak': {
        title: 'Dedication Champion',
        description: 'Maintained a 30-day learning streak',
        icon: '💎',
        points: 1000,
        category: 'streak'
      }
    }
  }

  private getFallbackQuestions(topic: string, difficulty: string, count: number): QuizQuestion[] {
    // Expanded fallback questions in case AI generation fails
    const baseQuestions: QuizQuestion[] = [
      {
        id: 'fallback1',
        question: 'What does the CIA triad stand for in cybersecurity?',
        options: [
          'Confidentiality, Integrity, Availability',
          'Control, Investigation, Analysis',
          'Compliance, Infrastructure, Authentication',
          'Cryptography, Identity, Authorization'
        ],
        correctAnswer: 0,
        explanation: 'The CIA triad represents the three fundamental principles of information security: Confidentiality (protecting information from unauthorized access), Integrity (ensuring data accuracy and trustworthiness), and Availability (ensuring information is accessible when needed).',
        difficulty: 'medium',
        topic: 'cybersecurity',
        points: 10,
        tags: ['basics', 'fundamentals', 'cia-triad']
      },
      {
        id: 'fallback2',
        question: 'Which of the following is NOT a common type of malware?',
        options: [
          'Virus',
          'Trojan',
          'Firewall',
          'Ransomware'
        ],
        correctAnswer: 2,
        explanation: 'A firewall is a security device that monitors and controls network traffic, not a type of malware. Viruses, Trojans, and Ransomware are all types of malicious software.',
        difficulty: 'easy',
        topic: 'malware',
        points: 5,
        tags: ['malware', 'security-tools', 'basics']
      },
      {
        id: 'fallback3',
        question: 'What is the primary purpose of encryption?',
        options: [
          'To speed up data transmission',
          'To compress files',
          'To protect data confidentiality',
          'To detect viruses'
        ],
        correctAnswer: 2,
        explanation: 'Encryption transforms readable data into an encoded format to protect its confidentiality, ensuring that only authorized parties with the correct decryption key can access the original information.',
        difficulty: 'medium',
        topic: 'cryptography',
        points: 10,
        tags: ['encryption', 'cryptography', 'data-protection']
      },
      {
        id: 'fallback4',
        question: 'Which authentication factor represents "something you know"?',
        options: [
          'Fingerprint',
          'Password',
          'Smart card',
          'Voice recognition'
        ],
        correctAnswer: 1,
        explanation: 'In multi-factor authentication, "something you know" refers to knowledge factors like passwords, PINs, or security questions. Fingerprints and voice recognition are "something you are" (biometric), while smart cards are "something you have".',
        difficulty: 'medium',
        topic: 'authentication',
        points: 10,
        tags: ['authentication', 'multi-factor', 'identity']
      },
      {
        id: 'fallback5',
        question: 'What does HTTPS provide that HTTP does not?',
        options: [
          'Faster loading times',
          'Better SEO ranking',
          'Encrypted communication',
          'Unlimited bandwidth'
        ],
        correctAnswer: 2,
        explanation: 'HTTPS (HTTP Secure) provides encrypted communication between a web browser and server using SSL/TLS protocols, protecting data from eavesdropping and tampering during transmission.',
        difficulty: 'easy',
        topic: 'network-security',
        points: 5,
        tags: ['https', 'ssl', 'tls', 'web-security']
      }
    ]

    // Filter by difficulty if specified
    let filteredQuestions = baseQuestions
    if (difficulty !== 'mixed') {
      filteredQuestions = baseQuestions.filter(q => q.difficulty === difficulty)
    }

    // If we don't have enough questions of the specified difficulty, include all
    if (filteredQuestions.length < count) {
      filteredQuestions = baseQuestions
    }

    return filteredQuestions.slice(0, count)
  }
}

// Export singleton instance
export const backend = AstraForensicsBackend.getInstance()