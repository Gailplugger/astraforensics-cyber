import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Brain, 
  TrendUp, 
  Target, 
  BookOpen, 
  Lightbulb,
  CheckCircle,
  Clock,
  Medal,
  ArrowClockwise,
  Sparkle
} from '@phosphor-icons/react'

interface QuizPerformance {
  quizId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  weakAreas: string[]
  completedAt: string
  timeTaken: number
}

interface LearningRecommendation {
  id: string
  title: string
  description: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  category: 'review' | 'practice' | 'advanced' | 'foundation'
  estimatedTime: string
  resources: {
    type: 'module' | 'quiz' | 'reading' | 'exercise'
    title: string
    duration: string
  }[]
}

interface LearningRecommendationsProps {
  onStartRecommendation: (recommendationId: string) => void
}

export function LearningRecommendations({ onStartRecommendation }: LearningRecommendationsProps) {
  const [quizScores] = useKV<Record<string, number>>('quiz-scores', {})
  const [quizPerformance] = useKV<QuizPerformance[]>('quiz-performance', [])
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  useEffect(() => {
    if (quizScores && Object.keys(quizScores).length > 0) {
      generateRecommendations()
    }
  }, [quizScores])

  const generateRecommendations = async () => {
    setIsGenerating(true)
    try {
      // Analyze quiz performance data
      const performanceData = analyzeQuizPerformance()
      
      // Create AI prompt for personalized recommendations
      const prompt = (window as any).spark.llmPrompt`
        Analyze this cybersecurity student's learning performance and generate personalized learning recommendations:

        Performance Summary:
        - Average Quiz Score: ${performanceData.averageScore}%
        - Total Quizzes Taken: ${performanceData.totalQuizzes}
        - Weak Areas: ${performanceData.weakAreas.join(', ')}
        - Strong Areas: ${performanceData.strongAreas.join(', ')}
        - Learning Pattern: ${performanceData.learningPattern}
        - Time Spent: ${performanceData.totalTime} minutes

        Available Learning Modules:
        1. Cybersecurity Fundamentals (CIA Triad, Threat Types, Risk Assessment)
        2. Network Security (Firewalls, VPN, IDS/IPS, Network Monitoring)
        3. Malware Analysis (Static/Dynamic Analysis, Reverse Engineering)
        4. Incident Response (NIST Framework, Forensics, Recovery)
        5. Penetration Testing (Reconnaissance, Exploitation, Reporting)

        Generate exactly 4 personalized learning recommendations. Each recommendation should be highly specific to their performance gaps and learning style. Return as JSON with this exact structure:

        {
          "recommendations": [
            {
              "id": "unique_id",
              "title": "Specific recommendation title",
              "description": "Detailed description tailored to student's needs",
              "reason": "Why this is recommended based on their performance",
              "priority": "high|medium|low",
              "category": "review|practice|advanced|foundation",
              "estimatedTime": "time estimate",
              "resources": [
                {
                  "type": "module|quiz|reading|exercise",
                  "title": "specific resource title",
                  "duration": "time needed"
                }
              ]
            }
          ]
        }
      `

      const response = await (window as any).spark.llm(prompt, 'gpt-4o', true)
      const aiRecommendations = JSON.parse(response)
      
      setRecommendations(aiRecommendations.recommendations)
      setLastGenerated(new Date().toISOString())
      
      toast.success('AI recommendations generated based on your performance!')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast.error('Failed to generate personalized recommendations')
      // Fallback to static recommendations
      setRecommendations(getFallbackRecommendations())
    } finally {
      setIsGenerating(false)
    }
  }

  const analyzeQuizPerformance = () => {
    const scores = quizScores ? Object.values(quizScores) : []
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    
    // Analyze weak areas based on quiz performance
    const weakAreas: string[] = []
    const strongAreas: string[] = []
    
    if (averageScore < 70) {
      weakAreas.push('Fundamental Concepts', 'Security Controls', 'Risk Assessment')
    } else if (averageScore < 85) {
      weakAreas.push('Advanced Techniques', 'Practical Application')
      strongAreas.push('Basic Concepts')
    } else {
      strongAreas.push('Fundamental Knowledge', 'Security Principles')
    }

    // Determine learning pattern
    let learningPattern = 'steady'
    if (scores.length > 1) {
      const trend = scores[scores.length - 1] - scores[0]
      if (trend > 10) learningPattern = 'improving'
      else if (trend < -10) learningPattern = 'declining'
    }

    return {
      averageScore,
      totalQuizzes: scores.length,
      weakAreas,
      strongAreas,
      learningPattern,
      totalTime: quizPerformance ? quizPerformance.reduce((total, p) => total + (p.timeTaken || 0), 0) : 0
    }
  }

  const getFallbackRecommendations = (): LearningRecommendation[] => {
    const performanceData = analyzeQuizPerformance()
    
    if (performanceData.averageScore < 60) {
      return [
        {
          id: 'foundation-review',
          title: 'Strengthen Core Fundamentals',
          description: 'Focus on mastering the CIA Triad and basic security concepts',
          reason: 'Your quiz scores indicate you need to reinforce fundamental concepts',
          priority: 'high',
          category: 'foundation',
          estimatedTime: '2-3 hours',
          resources: [
            { type: 'module', title: 'Cybersecurity Fundamentals Review', duration: '45 min' },
            { type: 'exercise', title: 'CIA Triad Practice Questions', duration: '30 min' }
          ]
        }
      ]
    }
    
    return [
      {
        id: 'network-security-focus',
        title: 'Advanced Network Security',
        description: 'Dive deeper into network protocols and security mechanisms',
        reason: 'Your strong foundation allows you to tackle more advanced topics',
        priority: 'medium',
        category: 'advanced',
        estimatedTime: '1-2 hours',
        resources: [
          { type: 'module', title: 'Network Security Deep Dive', duration: '60 min' },
          { type: 'quiz', title: 'Network Security Assessment', duration: '20 min' }
        ]
      }
    ]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'review': return <ArrowClockwise size={16} />
      case 'practice': return <Target size={16} />
      case 'advanced': return <TrendUp size={16} />
      case 'foundation': return <BookOpen size={16} />
      default: return <Lightbulb size={16} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'review': return 'bg-blue-100 text-blue-800'
      case 'practice': return 'bg-purple-100 text-purple-800'
      case 'advanced': return 'bg-orange-100 text-orange-800'
      case 'foundation': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!quizScores || Object.keys(quizScores).length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain size={24} className="text-primary" />
            <CardTitle>AI Learning Recommendations</CardTitle>
          </div>
          <CardDescription>
            Complete a quiz to get personalized learning recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkle size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Take your first quiz to unlock AI-powered personalized learning recommendations!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain size={24} className="text-primary" />
              <div>
                <CardTitle>AI Learning Recommendations</CardTitle>
                <CardDescription>
                  Personalized suggestions based on your quiz performance
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generateRecommendations}
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <ArrowClockwise size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle size={16} className="mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {isGenerating ? (
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground mb-2">AI is analyzing your performance...</p>
              <p className="text-sm text-muted-foreground">
                Generating personalized learning recommendations
              </p>
            </div>
          </CardContent>
        ) : recommendations.length > 0 ? (
          <CardContent>
            <div className="space-y-4">
              {lastGenerated && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Clock size={14} />
                  <span>Generated {new Date(lastGenerated).toLocaleString()}</span>
                </div>
              )}
              
              {recommendations.map((rec) => (
                <Card key={rec.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline" className={getCategoryColor(rec.category)}>
                            {getCategoryIcon(rec.category)}
                            <span className="ml-1">{rec.category}</span>
                          </Badge>
                        </div>
                        <CardDescription>{rec.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb size={16} className="text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium mb-1">Why this is recommended:</p>
                            <p className="text-sm text-muted-foreground">{rec.reason}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{rec.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Medal size={14} />
                          <span>{rec.resources.length} resources</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recommended Resources:</p>
                        <div className="space-y-2">
                          {rec.resources.map((resource, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div className="flex items-center space-x-2">
                                {resource.type === 'module' && <BookOpen size={14} className="text-blue-600" />}
                                {resource.type === 'quiz' && <Target size={14} className="text-purple-600" />}
                                {resource.type === 'reading' && <BookOpen size={14} className="text-green-600" />}
                                {resource.type === 'exercise' && <CheckCircle size={14} className="text-orange-600" />}
                                <span className="text-sm">{resource.title}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {resource.duration}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => onStartRecommendation(rec.id)}
                        className="w-full"
                        variant={rec.priority === 'high' ? 'default' : 'outline'}
                      >
                        <BookOpen size={16} className="mr-2" />
                        Start Learning Path
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="text-center py-8">
              <Brain size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Click "Refresh" to generate AI-powered recommendations based on your quiz performance
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}