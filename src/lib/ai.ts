/**
 * AI Integration for Notes and Todo Management
 * Uses Spark LLM API for intelligent content generation and assistance
 */

import { Note, TodoTask, DailyReflection, generateId } from './storage'

// Access the global spark object
declare const spark: any

export interface AIGenerationOptions {
  topic: string
  format: 'notes' | 'checklist' | 'summary' | 'explanation' | 'flashcards'
  complexity: 'simple' | 'intermediate' | 'advanced'
  length: 'short' | 'medium' | 'long'
}

export interface AITaskOptions {
  goal: string
  timeframe?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  includeDeadlines?: boolean
}

export interface FlashCard {
  id: string
  question: string
  answer: string
  category: string
}

export interface StudyPlan {
  title: string
  description: string
  duration: string
  tasks: {
    title: string
    description: string
    estimatedTime: string
    priority: 'low' | 'medium' | 'high'
    category: string
  }[]
}

class AIAssistant {
  /**
   * Generate comprehensive notes on a given topic
   */
  async generateNotes(options: AIGenerationOptions): Promise<Note> {
    const prompt = spark.llmPrompt`
      Create comprehensive ${options.complexity} level notes about "${options.topic}".
      
      Format: ${options.format}
      Length: ${options.length}
      
      Structure the notes with:
      1. Clear title and introduction
      2. Main concepts with detailed explanations
      3. Key points and takeaways
      4. Practical examples where relevant
      5. Summary or conclusion
      
      ${options.format === 'flashcards' ? 'Format as Q&A pairs for studying.' : ''}
      ${options.topic.toLowerCase().includes('cybersecurity') ? 'Include security best practices and real-world applications.' : ''}
      
      Make it engaging and educational. Use markdown formatting for structure.
    `

    try {
      const response = await spark.llm(prompt, 'gpt-4o')
      
      const note: Note = {
        id: generateId(),
        folderId: this.getFolderByTopic(options.topic),
        title: this.generateTitle(options.topic, options.format),
        content: response,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        tags: this.generateTags(options.topic, options.format),
        type: 'ai-generated'
      }

      return note
    } catch (error) {
      console.error('Error generating notes:', error)
      throw new Error('Failed to generate notes. Please try again.')
    }
  }

  /**
   * Summarize existing note content
   */
  async summarizeNote(content: string): Promise<string> {
    const prompt = spark.llmPrompt`
      Summarize the following note content into key points and main takeaways:
      
      ${content}
      
      Create a concise summary that captures:
      - Main concepts
      - Key insights
      - Important details to remember
      - Action items or next steps (if any)
      
      Keep it clear and well-structured.
    `

    try {
      return await spark.llm(prompt, 'gpt-4o')
    } catch (error) {
      console.error('Error summarizing note:', error)
      throw new Error('Failed to summarize note. Please try again.')
    }
  }

  /**
   * Expand note content with more details and examples
   */
  async expandNote(content: string, focus?: string): Promise<string> {
    const prompt = spark.llmPrompt`
      Expand the following note content with more detailed explanations, examples, and practical applications:
      
      ${content}
      
      ${focus ? `Focus particularly on: ${focus}` : ''}
      
      Add:
      - More detailed explanations of concepts
      - Practical examples and use cases
      - Step-by-step processes where applicable
      - Additional context and background information
      - Related concepts and connections
      
      Maintain the original structure but make it more comprehensive and educational.
    `

    try {
      return await spark.llm(prompt, 'gpt-4o')
    } catch (error) {
      console.error('Error expanding note:', error)
      throw new Error('Failed to expand note. Please try again.')
    }
  }

  /**
   * Simplify complex note content
   */
  async simplifyNote(content: string): Promise<string> {
    const prompt = spark.llmPrompt`
      Simplify the following note content to make it easier to understand:
      
      ${content}
      
      Make it:
      - More accessible and beginner-friendly
      - Use simpler language and shorter sentences
      - Include analogies and metaphors where helpful
      - Break down complex concepts into smaller parts
      - Remove jargon or explain technical terms clearly
      
      Keep all important information but make it digestible for someone new to the topic.
    `

    try {
      return await spark.llm(prompt, 'gpt-4o')
    } catch (error) {
      console.error('Error simplifying note:', error)
      throw new Error('Failed to simplify note. Please try again.')
    }
  }

  /**
   * Convert notes to flashcards
   */
  async convertToFlashcards(content: string): Promise<FlashCard[]> {
    const prompt = spark.llmPrompt`
      Convert the following note content into study flashcards:
      
      ${content}
      
      Create flashcards with:
      - Clear, specific questions
      - Comprehensive but concise answers
      - Different types: definitions, concepts, applications, examples
      - Progressive difficulty levels
      
      Return as JSON in this format:
      {
        "flashcards": [
          {
            "question": "What is...",
            "answer": "Detailed answer...",
            "category": "concept/definition/application"
          }
        ]
      }
    `

    try {
      const response = await spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      return data.flashcards.map((card: any) => ({
        id: generateId(),
        question: card.question,
        answer: card.answer,
        category: card.category || 'general'
      }))
    } catch (error) {
      console.error('Error converting to flashcards:', error)
      throw new Error('Failed to create flashcards. Please try again.')
    }
  }

  /**
   * Generate AI-powered todo tasks
   */
  async generateTasks(options: AITaskOptions): Promise<TodoTask[]> {
    const prompt = spark.llmPrompt`
      Create a detailed task plan for: "${options.goal}"
      
      ${options.timeframe ? `Timeframe: ${options.timeframe}` : ''}
      ${options.difficulty ? `Difficulty level: ${options.difficulty}` : ''}
      ${options.includeDeadlines ? 'Include suggested deadlines and time estimates.' : ''}
      
      Create a comprehensive task list with:
      - Clear, actionable tasks
      - Logical sequence and dependencies
      - Estimated time requirements
      - Priority levels (high/medium/low)
      - Categories for organization
      - Subtasks for complex items
      
      Return as JSON in this format:
      {
        "tasks": [
          {
            "title": "Task title",
            "description": "Detailed description",
            "priority": "high/medium/low",
            "category": "study/preparation/practice",
            "estimatedTime": "2 hours",
            "subtasks": ["subtask 1", "subtask 2"]
          }
        ]
      }
    `

    try {
      const response = await spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      return data.tasks.map((task: any) => ({
        id: generateId(),
        title: task.title,
        description: task.description,
        completed: false,
        priority: task.priority || 'medium',
        category: task.category || 'general',
        dueDate: options.includeDeadlines ? this.generateDueDate(task.estimatedTime) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: this.generateTaskTags(options.goal, task.category),
        subtasks: task.subtasks?.map((subtask: string) => ({
          id: generateId(),
          title: subtask,
          completed: false
        })) || []
      }))
    } catch (error) {
      console.error('Error generating tasks:', error)
      throw new Error('Failed to generate tasks. Please try again.')
    }
  }

  /**
   * Generate study plan for certification or skill development
   */
  async generateStudyPlan(goal: string, timeframe: string): Promise<StudyPlan> {
    const prompt = spark.llmPrompt`
      Create a comprehensive study plan for: "${goal}"
      Timeframe: ${timeframe}
      
      Include:
      - Overall study strategy
      - Phase-by-phase breakdown
      - Resource recommendations
      - Practice schedules
      - Review and assessment points
      - Time allocation for each topic
      
      Make it specific to cybersecurity learning if applicable.
      
      Return as JSON with detailed structure including tasks, timelines, and milestones.
    `

    try {
      const response = await spark.llm(prompt, 'gpt-4o', true)
      return JSON.parse(response)
    } catch (error) {
      console.error('Error generating study plan:', error)
      throw new Error('Failed to generate study plan. Please try again.')
    }
  }

  /**
   * Generate daily reflection questions
   */
  async generateDailyReflection(): Promise<DailyReflection> {
    const today = new Date().toISOString().split('T')[0]
    
    const prompt = spark.llmPrompt`
      Generate a thoughtful daily reflection question for someone learning cybersecurity.
      
      The question should:
      - Encourage self-assessment and growth
      - Be relevant to cybersecurity learning
      - Promote critical thinking
      - Be answerable in 2-3 sentences
      
      Examples of good questions:
      - "What security vulnerability did you learn about today and how would you explain it to a non-technical person?"
      - "What cybersecurity concept challenged your assumptions today?"
      - "How did you apply a security principle in your daily activities?"
      
      Provide just the question, no additional text.
    `

    try {
      const question = await spark.llm(prompt, 'gpt-4o')
      
      return {
        id: generateId(),
        date: today,
        question: question.trim(),
        aiGenerated: true
      }
    } catch (error) {
      console.error('Error generating daily reflection:', error)
      throw new Error('Failed to generate reflection question.')
    }
  }

  /**
   * Analyze learning progress and provide recommendations
   */
  async analyzeProgress(notes: Note[], todos: TodoTask[]): Promise<string> {
    const completedTasks = todos.filter(t => t.completed).length
    const totalTasks = todos.length
    const recentNotes = notes.filter(n => 
      new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    const prompt = spark.llmPrompt`
      Analyze the following learning progress and provide personalized recommendations:
      
      Total notes created: ${notes.length}
      Recent notes (last 7 days): ${recentNotes}
      Total tasks: ${totalTasks}
      Completed tasks: ${completedTasks}
      Completion rate: ${totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0}%
      
      Main topics covered: ${this.extractTopics(notes, todos)}
      
      Provide:
      - Assessment of current progress
      - Areas for improvement
      - Specific recommendations for next steps
      - Motivation and encouragement
      - Study strategy suggestions
      
      Keep it supportive and actionable.
    `

    try {
      return await spark.llm(prompt, 'gpt-4o')
    } catch (error) {
      console.error('Error analyzing progress:', error)
      throw new Error('Failed to analyze progress.')
    }
  }

  // Helper methods
  private getFolderByTopic(topic: string): string {
    const topicLower = topic.toLowerCase()
    if (topicLower.includes('cyber') || topicLower.includes('security') || topicLower.includes('hack')) {
      return 'cybersecurity'
    }
    if (topicLower.includes('study') || topicLower.includes('learn') || topicLower.includes('course')) {
      return 'study'
    }
    return 'default'
  }

  private generateTitle(topic: string, format: string): string {
    const formatTitles = {
      notes: 'Notes on',
      checklist: 'Checklist for',
      summary: 'Summary of',
      explanation: 'Understanding',
      flashcards: 'Study Cards for'
    }
    
    const prefix = formatTitles[format as keyof typeof formatTitles] || 'AI Generated:'
    return `${prefix} ${topic}`
  }

  private generateTags(topic: string, format: string): string[] {
    const baseTags = ['ai-generated', format]
    const topicTags = topic.split(' ').filter(word => word.length > 3)
    return [...baseTags, ...topicTags.slice(0, 3)]
  }

  private generateTaskTags(goal: string, category: string): string[] {
    const baseTags = ['ai-generated', category]
    const goalTags = goal.split(' ').filter(word => word.length > 3)
    return [...baseTags, ...goalTags.slice(0, 2)]
  }

  private generateDueDate(estimatedTime: string): string {
    // Simple logic to generate due dates based on estimated time
    const now = new Date()
    const hours = this.parseEstimatedTime(estimatedTime)
    
    if (hours <= 2) {
      // Same day
      now.setHours(now.getHours() + hours + 2)
    } else if (hours <= 8) {
      // Next day
      now.setDate(now.getDate() + 1)
    } else {
      // Multiple days
      const days = Math.ceil(hours / 8)
      now.setDate(now.getDate() + days)
    }
    
    return now.toISOString()
  }

  private parseEstimatedTime(timeStr: string): number {
    // Parse strings like "2 hours", "30 minutes", "1.5 hours"
    const hourMatch = timeStr.match(/(\d+\.?\d*)\s*hours?/i)
    const minuteMatch = timeStr.match(/(\d+)\s*minutes?/i)
    
    if (hourMatch) {
      return parseFloat(hourMatch[1])
    } else if (minuteMatch) {
      return parseFloat(minuteMatch[1]) / 60
    }
    
    return 2 // Default to 2 hours
  }

  private extractTopics(notes: Note[], todos: TodoTask[]): string {
    const noteTags = notes.flatMap(n => n.tags)
    const todoTags = todos.flatMap(t => t.tags)
    const allTags = [...noteTags, ...todoTags]
    
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)
      .join(', ')
  }
}

// Export singleton instance
export const aiAssistant = new AIAssistant()

// Voice recognition utilities
export class VoiceManager {
  private recognition: any = null
  private isListening = false

  constructor() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.setupRecognition()
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
      this.setupRecognition()
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return

    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = 'en-US'
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (this.isListening) {
        reject(new Error('Already listening'))
        return
      }

      this.isListening = true

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        this.isListening = false
        resolve(transcript)
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  get isSupported(): boolean {
    return this.recognition !== null
  }

  get listening(): boolean {
    return this.isListening
  }
}

export const voiceManager = new VoiceManager()