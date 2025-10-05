import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { createPrompt, callLLM, sparkLog, sparkError } from '@/lib/spark-api'
import { 
  Brain, 
  CheckCircle, 
  X, 
  ArrowLeft, 
  Trophy,
  Clock,
  Target,
  Lightbulb,
  Sparkle,
  Warning,
  ArrowClockwise
} from '@phosphor-icons/react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  points: number
}

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  difficulty: string
  topic: string
  completedAt: string
}

interface AIQuizGeneratorProps {
  topic?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  questionCount?: number
  onComplete?: (result: QuizResult) => void
  onBack?: () => void
}

export function AIQuizGenerator({ 
  topic = 'cybersecurity', 
  difficulty = 'medium', 
  questionCount = 10,
  onComplete,
  onBack 
}: AIQuizGeneratorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useKV<Record<string, number>>('current-quiz-answers', {})
  const [quizResults] = useKV<QuizResult[]>('quiz-results', [])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [quizStartTime] = useState(Date.now())
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    generateQuiz()
  }, [topic, difficulty, questionCount])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - quizStartTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStartTime])

  const generateQuiz = async () => {
    setIsGenerating(true)
    try {
      sparkLog('Generating AI quiz', { topic, difficulty, questionCount })
      
      const prompt = createPrompt`Generate a cybersecurity quiz with exactly ${questionCount} questions about ${topic} with ${difficulty} difficulty level.

      Return a JSON object with a "questions" property containing an array of question objects. Each question should have:
      - id: unique identifier
      - question: the question text
      - options: array of 4 answer choices
      - correctAnswer: index (0-3) of the correct answer
      - explanation: detailed explanation of why the answer is correct
      - difficulty: "${difficulty}"
      - topic: "${topic}"
      - points: point value (easy=5, medium=10, hard=15)

      Focus on practical cybersecurity concepts, real-world scenarios, and current threats. Make questions challenging but fair.

      Example format:
      {
        "questions": [
          {
            "id": "q1",
            "question": "What does the 'C' in CIA triad stand for?",
            "options": ["Confidentiality", "Consistency", "Compliance", "Control"],
            "correctAnswer": 0,
            "explanation": "In the CIA triad, 'C' stands for Confidentiality, which ensures that information is accessible only to authorized users.",
            "difficulty": "${difficulty}",
            "topic": "${topic}",
            "points": ${difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15}
          }
        ]
      }`

      const response = await callLLM(prompt, 'gpt-4o', true)
      const quizData = JSON.parse(response)
      
      if (quizData.questions && Array.isArray(quizData.questions)) {
        setQuestions(quizData.questions)
        sparkLog('Quiz generated successfully', { questionCount: quizData.questions.length })
      } else {
        throw new Error('Invalid quiz format: missing questions array')
      }
    } catch (error) {
      sparkError('Failed to generate quiz', error)
      toast.error('Failed to generate quiz. Using fallback questions.')
      generateFallbackQuiz()
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFallbackQuiz = () => {
    const fallbackQuestions: QuizQuestion[] = [
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
        explanation: 'The CIA triad represents the three fundamental principles of information security: Confidentiality (protecting data from unauthorized access), Integrity (ensuring data accuracy), and Availability (ensuring data is accessible when needed).',
        difficulty: 'medium',
        topic: 'cybersecurity',
        points: 10
      },
      {
        id: 'fallback2',
        question: 'Which type of malware is designed to replicate itself and spread to other computers?',
        options: ['Trojan', 'Virus', 'Spyware', 'Adware'],
        correctAnswer: 1,
        explanation: 'A virus is malicious code that replicates itself by attaching to other programs and spreading from one computer to another, often requiring user action to execute.',
        difficulty: 'medium',
        topic: 'cybersecurity',
        points: 10
      }
    ]
    setQuestions(fallbackQuestions)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    
    setSelectedAnswer(answerIndex)
    const currentQuestion = questions[currentQuestionIndex]
    const correct = answerIndex === currentQuestion.correctAnswer
    setIsCorrect(correct)
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }))
  }

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer')
      return
    }

    if (!showExplanation) {
      setShowExplanation(true)
      return
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setIsCorrect(null)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    const correctAnswers = questions.filter(q => 
      answers?.[q.id] === q.correctAnswer
    ).length

    const totalPoints = questions.reduce((sum, q) => 
      (answers?.[q.id] === q.correctAnswer ? q.points : 0) + sum, 0
    )
    
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0)
    const score = Math.round((totalPoints / maxPoints) * 100)

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent: Math.floor((Date.now() - quizStartTime) / 1000),
      difficulty,
      topic,
      completedAt: new Date().toISOString()
    }

    // Show success animation and complete
    toast.success(`Quiz completed! Score: ${score}%`)
    onComplete?.(result)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6"
          >
            <Brain size={64} className="text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4">🧠 Generating AI-Powered Quiz</h2>
          <p className="text-muted-foreground mb-6">
            Creating {questionCount} personalized {difficulty} questions about {topic}...
          </p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Progress value={85} className="w-64 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Warning size={48} className="text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quiz Generation Failed</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't generate the quiz. Please try again.
            </p>
            <Button onClick={generateQuiz} className="w-full">
              <ArrowClockwise size={20} className="mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-card/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Brain size={28} className="text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold">AI-Generated Quiz</h1>
                  <p className="text-sm text-muted-foreground">
                    {topic} • {difficulty} level
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-muted-foreground" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-muted-foreground" />
                <span>{currentQuestionIndex + 1} of {questions.length}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="mt-4"
          >
            <Progress value={getProgressPercentage()} className="h-2" />
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-4 leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {currentQuestion.points} points
                      </Badge>
                      <Badge variant="outline">
                        {currentQuestion.topic}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="space-y-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={
                          selectedAnswer === index
                            ? showExplanation
                              ? index === currentQuestion.correctAnswer
                                ? "default"
                                : "destructive"
                              : "default"
                            : "outline"
                        }
                        className={`w-full p-6 h-auto text-left justify-start relative overflow-hidden group ${
                          showExplanation && index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : ''
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showExplanation}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <div className="flex items-center space-x-4 relative z-10">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            selectedAnswer === index
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          
                          {showExplanation && index === currentQuestion.correctAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle size={24} className="text-green-600" weight="fill" />
                            </motion.div>
                          )}
                          
                          {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <X size={24} className="text-red-600" weight="bold" />
                            </motion.div>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                    >
                      <div className="flex items-start space-x-3">
                        <Lightbulb size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                          <p className="text-blue-700">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="w-full relative overflow-hidden group"
                    size="lg"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="relative flex items-center justify-center">
                      {!showExplanation ? (
                        'Show Explanation'
                      ) : currentQuestionIndex === questions.length - 1 ? (
                        <>
                          <Trophy size={20} className="mr-2" />
                          Complete Quiz
                        </>
                      ) : (
                        'Next Question →'
                      )}
                    </span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}