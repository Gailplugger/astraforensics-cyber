import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { 
  Brain, 
  Trophy, 
  Target, 
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  TrendUp,
  Star,
  Lightning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AssessmentQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  explanation: string
  timeLimit: number
}

interface AssessmentResult {
  id: string
  userId: string
  completedAt: Date
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

interface AISkillAssessmentProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (result: AssessmentResult) => void
  userData?: any
  difficulty?: 'adaptive' | 'beginner' | 'intermediate' | 'advanced'
}

const skillCategories = [
  'Network Security',
  'Cryptography',
  'Incident Response',
  'Penetration Testing',
  'Digital Forensics',
  'Risk Assessment',
  'Security Governance',
  'Malware Analysis'
]

export function AISkillAssessment({ isOpen, onClose, onComplete, userData, difficulty = 'adaptive' }: AISkillAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [phase, setPhase] = useState<'intro' | 'assessment' | 'result'>('intro')
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [currentDifficulty, setCurrentDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  const [assessmentHistory] = useKV<AssessmentResult[]>('assessment-history', [])

  // Timer effect
  useEffect(() => {
    if (phase === 'assessment' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && phase === 'assessment') {
      handleTimeUp()
    }
  }, [timeRemaining, phase])

  const generateAssessmentQuestions = async (targetDifficulty: string, count: number = 15) => {
    setIsLoading(true)
    try {
      const prompt = `Generate ${count} cybersecurity assessment questions for ${targetDifficulty} level.

Each question should test practical knowledge and real-world application.

Categories to cover: ${skillCategories.join(', ')}

Return as JSON with this exact structure:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "difficulty": "${targetDifficulty}",
      "category": "Network Security",
      "explanation": "Detailed explanation of the correct answer",
      "timeLimit": 45
    }
  ]
}`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions)
        setTimeRemaining(data.questions[0]?.timeLimit || 45)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      toast.error('Failed to generate assessment questions')
      setQuestions(getFallbackQuestions())
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackQuestions = (): AssessmentQuestion[] => [
    {
      id: '1',
      question: 'What is the primary purpose of a firewall in network security?',
      options: [
        'To monitor network traffic and block unauthorized access',
        'To encrypt all network communications',
        'To provide antivirus protection',
        'To manage user passwords'
      ],
      correctAnswer: 0,
      difficulty: 'beginner',
      category: 'Network Security',
      explanation: 'A firewall acts as a barrier between trusted and untrusted networks, monitoring and controlling incoming and outgoing network traffic based on predetermined security rules.',
      timeLimit: 45
    },
    {
      id: '2',
      question: 'Which encryption algorithm is commonly used for securing HTTPS connections?',
      options: ['DES', 'AES', 'MD5', 'SHA-1'],
      correctAnswer: 1,
      difficulty: 'intermediate',
      category: 'Cryptography',
      explanation: 'AES (Advanced Encryption Standard) is widely used in HTTPS connections, often in combination with RSA for key exchange and SHA for message authentication.',
      timeLimit: 60
    }
  ]

  const startAssessment = async () => {
    setPhase('assessment')
    setStartTime(new Date())
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    
    await generateAssessmentQuestions(difficulty === 'adaptive' ? currentDifficulty : difficulty)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    
    setShowExplanation(true)
    
    // Adaptive difficulty adjustment
    if (difficulty === 'adaptive') {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.correctAnswer
      adjustDifficulty(isCorrect)
    }
  }

  const adjustDifficulty = (wasCorrect: boolean) => {
    if (wasCorrect && currentDifficulty === 'beginner') {
      setCurrentDifficulty('intermediate')
    } else if (wasCorrect && currentDifficulty === 'intermediate') {
      setCurrentDifficulty('advanced')
    } else if (!wasCorrect && currentDifficulty === 'advanced') {
      setCurrentDifficulty('intermediate')
    } else if (!wasCorrect && currentDifficulty === 'intermediate') {
      setCurrentDifficulty('beginner')
    }
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setTimeRemaining(questions[currentQuestion + 1]?.timeLimit || 45)
    } else {
      completeAssessment()
    }
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1) // Mark as no answer
      submitAnswer()
    } else {
      nextQuestion()
    }
  }

  const completeAssessment = async () => {
    if (!startTime) return

    const endTime = new Date()
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
    const correctAnswers = answers.filter((answer, index) => answer === questions[index]?.correctAnswer).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    // Generate AI analysis
    const analysisResult = await generateAssessmentAnalysis(answers, questions, score)

    const result: AssessmentResult = {
      id: Date.now().toString(),
      userId: userData?.email || 'anonymous',
      completedAt: endTime,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
      skillLevel: getSkillLevel(score),
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      recommendations: analysisResult.recommendations
    }

    setAssessmentResult(result)
    setPhase('result')
    onComplete(result)
  }

  const generateAssessmentAnalysis = async (userAnswers: number[], questions: AssessmentQuestion[], score: number) => {
    try {
      const prompt = `Analyze this cybersecurity skill assessment performance:

Score: ${score}%
Questions answered: ${userAnswers.length}/${questions.length}
Correct answers: ${userAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}

Question details: ${questions.map((q, index) => `
Question ${index + 1}: ${q.category} (${q.difficulty})
User answered: ${userAnswers[index] !== undefined ? q.options[userAnswers[index]] || 'No answer' : 'No answer'}
Correct answer: ${q.options[q.correctAnswer]}
`).join('')}

Provide analysis in JSON format:
{
  "strengths": ["area1", "area2", "area3"],
  "weaknesses": ["area1", "area2"],
  "recommendations": ["specific action 1", "specific action 2", "specific action 3"]
}

Focus on cybersecurity knowledge areas and practical skills.`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      return JSON.parse(response)
    } catch (error) {
      return {
        strengths: ['Problem-solving approach', 'Analytical thinking'],
        weaknesses: ['Areas needing improvement identified'],
        recommendations: ['Continue studying cybersecurity fundamentals', 'Practice with hands-on labs', 'Focus on weak areas identified']
      }
    }
  }

  const getSkillLevel = (score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
    if (score >= 90) return 'expert'
    if (score >= 75) return 'advanced'
    if (score >= 60) return 'intermediate'
    return 'beginner'
  }

  const retakeAssessment = () => {
    setPhase('intro')
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setAssessmentResult(null)
    setShowExplanation(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl bg-background rounded-2xl shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain size={32} className="text-white" weight="fill" />
                </div>
                <h2 className="text-3xl font-bold mb-4">AI-Powered Skill Assessment</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Evaluate your cybersecurity knowledge with our adaptive AI assessment system
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                  <CardHeader>
                    <Target size={32} className="mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">Adaptive Testing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Questions adapt to your skill level for accurate assessment
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Clock size={32} className="mx-auto text-accent mb-2" />
                    <CardTitle className="text-lg">15-20 Minutes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive assessment in just 15-20 minutes
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <TrendUp size={32} className="mx-auto text-success mb-2" />
                    <CardTitle className="text-lg">Detailed Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Get personalized insights and career recommendations
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-3">Assessment covers:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {skillCategories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="justify-center">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={startAssessment}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Preparing Assessment...
                    </>
                  ) : (
                    <>
                      <Lightning size={16} className="mr-2" />
                      Start Assessment
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'assessment' && questions.length > 0 && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              {/* Progress Header */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Question {currentQuestion + 1} of {questions.length}
                  </h3>
                  <div className="flex items-center gap-4">
                    <Badge variant={timeRemaining <= 10 ? 'destructive' : 'secondary'}>
                      <Clock size={14} className="mr-1" />
                      {timeRemaining}s
                    </Badge>
                    <Badge variant="outline">
                      {questions[currentQuestion]?.category}
                    </Badge>
                  </div>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
              </div>

              {/* Question */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg leading-relaxed">
                    {questions[currentQuestion]?.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                          selectedAnswer === index ? 'bg-primary/10 border-primary' : 'hover:bg-secondary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    <Card className={`border-2 ${
                      selectedAnswer === questions[currentQuestion]?.correctAnswer 
                        ? 'border-green-500 bg-green-50/50' 
                        : 'border-red-500 bg-red-50/50'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {selectedAnswer === questions[currentQuestion]?.correctAnswer ? (
                            <CheckCircle size={24} className="text-green-600" weight="fill" />
                          ) : (
                            <XCircle size={24} className="text-red-600" weight="fill" />
                          )}
                          <CardTitle className="text-lg">
                            {selectedAnswer === questions[currentQuestion]?.correctAnswer ? 'Correct!' : 'Incorrect'}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{questions[currentQuestion]?.explanation}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>
                  Exit Assessment
                </Button>
                
                {!showExplanation ? (
                  <Button 
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    ) : (
                      'View Results'
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'result' && assessmentResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trophy size={40} className="text-white" weight="fill" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
                <p className="text-muted-foreground">Your cybersecurity skill assessment results</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold text-primary mb-2">
                      {assessmentResult.score}%
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </CardHeader>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-2 capitalize">
                      {assessmentResult.skillLevel}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Skill Level</p>
                  </CardHeader>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-2">
                      {Math.floor(assessmentResult.timeSpent / 60)}:{String(assessmentResult.timeSpent % 60).padStart(2, '0')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Star size={20} weight="fill" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessmentResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle size={16} className="text-green-500" weight="fill" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <Target size={20} />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessmentResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Eye size={16} className="text-amber-500" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain size={20} className="text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {assessmentResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={retakeAssessment}>
                  Retake Assessment
                </Button>
                <Button onClick={onClose} className="bg-gradient-to-r from-primary to-accent">
                  Continue Learning
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}