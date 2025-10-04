import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Clock,
  Target,
  ArrowRight,
  ArrowClockwise,
  Medal,
  Sparkle,
  Star,
  Certificate
} from '@phosphor-icons/react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

interface Certificate {
  id: string
  moduleId: string
  moduleName: string
  studentName: string
  completedAt: string
  score: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C'
}

interface QuizPerformanceData {
  quizId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  weakAreas: string[]
  strongAreas: string[]
  completedAt: string
  timeTaken: number
  questionPerformance: {
    questionId: string
    correct: boolean
    difficulty: string
    category: string
    timeSpent: number
  }[]
}

interface QuizProps {
  onBackToDashboard: () => void
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What does the "C" in the CIA Triad stand for?',
    options: ['Cybersecurity', 'Confidentiality', 'Compliance', 'Control'],
    correctAnswer: 1,
    explanation: 'The "C" stands for Confidentiality, which ensures that information is accessible only to those authorized to access it.',
    difficulty: 'easy',
    category: 'CIA Triad'
  },
  {
    id: 'q2',
    question: 'Which of the following is NOT a type of malware?',
    options: ['Virus', 'Worm', 'Firewall', 'Trojan'],
    correctAnswer: 2,
    explanation: 'A firewall is a security control that monitors and controls network traffic, not a type of malware.',
    difficulty: 'easy',
    category: 'Malware'
  },
  {
    id: 'q3',
    question: 'What is the primary purpose of a DDoS attack?',
    options: ['Steal sensitive data', 'Overwhelm systems with traffic', 'Install malware', 'Gain unauthorized access'],
    correctAnswer: 1,
    explanation: 'DDoS (Distributed Denial of Service) attacks aim to overwhelm systems with traffic, making them unavailable to legitimate users.',
    difficulty: 'medium',
    category: 'Network Attacks'
  },
  {
    id: 'q4',
    question: 'Which type of security control is designed to detect incidents when they occur?',
    options: ['Preventive', 'Detective', 'Corrective', 'Administrative'],
    correctAnswer: 1,
    explanation: 'Detective controls identify and detect security incidents when they occur, such as intrusion detection systems.',
    difficulty: 'medium',
    category: 'Security Controls'
  },
  {
    id: 'q5',
    question: 'What is social engineering in cybersecurity?',
    options: ['A network protocol', 'Manipulating people to reveal information', 'A type of encryption', 'A security framework'],
    correctAnswer: 1,
    explanation: 'Social engineering involves manipulating people psychologically to reveal confidential information or perform actions that compromise security.',
    difficulty: 'medium',
    category: 'Social Engineering'
  },
  {
    id: 'q6',
    question: 'Which principle ensures data accuracy and completeness?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
    correctAnswer: 1,
    explanation: 'Integrity ensures that data remains accurate, complete, and unaltered during storage, transmission, and processing.',
    difficulty: 'easy',
    category: 'CIA Triad'
  },
  {
    id: 'q7',
    question: 'What is the main goal of ransomware?',
    options: ['Delete all files', 'Monitor user activity', 'Encrypt files and demand payment', 'Steal login credentials'],
    correctAnswer: 2,
    explanation: 'Ransomware encrypts files on a victim\'s system and demands payment (ransom) for the decryption key.',
    difficulty: 'medium',
    category: 'Malware'
  },
  {
    id: 'q8',
    question: 'Which of the following is an example of a preventive security control?',
    options: ['Security audit', 'Intrusion detection system', 'Firewall', 'Incident response plan'],
    correctAnswer: 2,
    explanation: 'A firewall is a preventive control that blocks unauthorized network traffic before it can reach protected systems.',
    difficulty: 'hard',
    category: 'Security Controls'
  },
  {
    id: 'q9',
    question: 'What does "availability" mean in the context of the CIA Triad?',
    options: ['Data can be accessed by anyone', 'Systems are always online', 'Information is accessible when needed by authorized users', 'Data is stored in multiple locations'],
    correctAnswer: 2,
    explanation: 'Availability ensures that information and resources are accessible when needed by authorized users, maintaining system uptime and reliability.',
    difficulty: 'medium',
    category: 'CIA Triad'
  },
  {
    id: 'q10',
    question: 'Which attack type involves intercepting communications between two parties?',
    options: ['Phishing', 'SQL Injection', 'Man-in-the-Middle', 'Cross-site Scripting'],
    correctAnswer: 2,
    explanation: 'A Man-in-the-Middle (MitM) attack involves intercepting and potentially altering communications between two parties without their knowledge.',
    difficulty: 'hard',
    category: 'Network Attacks'
  }
]

export function Quiz({ onBackToDashboard }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizScores, setQuizScores] = useKV<Record<string, number>>('quiz-scores', {})
  const [certificates, setCertificates] = useKV<Certificate[]>('certificates', [])
  const [userData] = useKV<any>('user-data', null)
  const [quizPerformanceData, setQuizPerformanceData] = useKV<QuizPerformanceData[]>('quiz-performance', [])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({})
  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const totalQuestions = quizQuestions.length
  const currentQ = quizQuestions[currentQuestion]
  const progressPercentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100)

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    // Record time spent on current question
    const timeSpent = Date.now() - questionStartTime
    setQuestionTimes(prev => ({
      ...prev,
      [currentQ.id]: timeSpent
    }))

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    } else {
      finishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    }
  }

  const showAnswer = () => {
    setShowExplanation(true)
  }

  const getGrade = (score: number): Certificate['grade'] => {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'B+'
    if (score >= 80) return 'B'
    return 'C'
  }

  const finishQuiz = () => {
    const correctAnswers = quizQuestions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length
    
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)
    setScore(finalScore)
    setQuizCompleted(true)
    
    // Analyze performance by category
    const categoryPerformance: Record<string, { correct: number; total: number }> = {}
    const weakAreas: string[] = []
    const strongAreas: string[] = []
    
    quizQuestions.forEach(q => {
      if (!categoryPerformance[q.category]) {
        categoryPerformance[q.category] = { correct: 0, total: 0 }
      }
      categoryPerformance[q.category].total++
      if (selectedAnswers[q.id] === q.correctAnswer) {
        categoryPerformance[q.category].correct++
      }
    })
    
    // Identify weak and strong areas
    Object.entries(categoryPerformance).forEach(([category, performance]) => {
      const categoryScore = (performance.correct / performance.total) * 100
      if (categoryScore < 60) {
        weakAreas.push(category)
      } else if (categoryScore >= 80) {
        strongAreas.push(category)
      }
    })
    
    // Create detailed performance data for AI analysis
    const performanceData: QuizPerformanceData = {
      quizId: 'cybersecurity-basics',
      score: finalScore,
      correctAnswers,
      totalQuestions,
      weakAreas,
      strongAreas,
      completedAt: new Date().toISOString(),
      timeTaken: Math.ceil(timeElapsed / 60), // Convert to minutes
      questionPerformance: quizQuestions.map(q => ({
        questionId: q.id,
        correct: selectedAnswers[q.id] === q.correctAnswer,
        difficulty: q.difficulty,
        category: q.category,
        timeSpent: questionTimes[q.id] || 0
      }))
    }
    
    // Save performance data
    setQuizPerformanceData((current) => {
      const existing = current || []
      const filtered = existing.filter(p => p.quizId !== 'cybersecurity-basics')
      return [...filtered, performanceData]
    })
    
    // Save score
    setQuizScores((current) => ({
      ...current,
      'cybersecurity-basics': finalScore
    }))

    // Award certificate if score is 70% or higher
    if (finalScore >= 70 && userData) {
      const certificate: Certificate = {
        id: `cert-${Date.now()}`,
        moduleId: 'cybersecurity-basics',
        moduleName: 'Cybersecurity Fundamentals',
        studentName: userData.name,
        completedAt: new Date().toISOString(),
        score: finalScore,
        grade: getGrade(finalScore)
      }

      setCertificates((current) => {
        const existing = current || []
        // Remove any existing certificate for this module
        const filtered = existing.filter(c => c.moduleId !== 'cybersecurity-basics')
        return [...filtered, certificate]
      })

      setTimeout(() => {
        setShowCertificate(true)
      }, 2000)
    }

    if (finalScore >= 70) {
      toast.success(`Excellent! You scored ${finalScore}% and earned a certificate! 🎉`)
    } else if (finalScore >= 50) {
      toast('Good effort! You scored ' + finalScore + '%. Score 70% or higher to earn a certificate.')
    } else {
      toast('Keep studying! You scored ' + finalScore + '%. Score 70% or higher to earn a certificate.')
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setShowExplanation(false)
    setShowCertificate(false)
    setScore(0)
    setTimeElapsed(0)
    setQuestionStartTime(Date.now())
    setQuestionTimes({})
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (quizCompleted) {
    const correctAnswers = quizQuestions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length

    return (
      <div className="min-h-screen bg-background">
        {/* Certificate Modal */}
        <AnimatePresence>
          {showCertificate && score >= 70 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCertificate(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="bg-gradient-to-br from-yellow-50 to-amber-100 p-8 rounded-xl border-4 border-amber-300 shadow-2xl max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.3, type: "spring", duration: 1 }}
                    className="flex justify-center"
                  >
                    <div className="bg-red-600 rounded-full p-4">
                      <Medal size={48} className="text-yellow-300" weight="fill" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold text-amber-900">🎉 Certificate Earned! 🎉</h2>
                    <p className="text-lg text-amber-800 mt-2">
                      Congratulations! You've successfully completed the Cybersecurity Fundamentals quiz with a score of {score}%!
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="flex justify-center space-x-2"
                  >
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Score: {score}%
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Grade: {getGrade(score)}
                    </Badge>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button
                      onClick={() => setShowCertificate(false)}
                      className="mt-4"
                    >
                      <Certificate size={18} className="mr-2" />
                      View Certificate in Dashboard
                    </Button>
                  </motion.div>
                </div>

                {/* Confetti effect */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{ 
                      x: Math.random() * 400,
                      y: -10,
                      scale: 0
                    }}
                    animate={{ 
                      y: 500,
                      scale: 1,
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 3,
                      delay: Math.random() * 2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-b bg-card/50"
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
                <ArrowLeft size={18} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center relative overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <CardHeader className="relative">
                <motion.div 
                  className="flex justify-center mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 1, delay: 0.3 }}
                >
                  <div className="p-4 rounded-full bg-primary/10 relative">
                    <Trophy size={48} className="text-primary" />
                    {score >= 70 && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star size={20} className="text-yellow-500" weight="fill" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <CardTitle className="text-3xl mb-2">
                    {score >= 70 ? '🎉 Quiz Completed! 🎉' : 'Quiz Completed!'}
                  </CardTitle>
                  <CardDescription>
                    {score >= 70 
                      ? "Excellent work! You've mastered the Cybersecurity Fundamentals"
                      : "Good effort on the Cybersecurity Fundamentals quiz"
                    }
                  </CardDescription>
                </motion.div>
              </CardHeader>
              
              <CardContent className="space-y-6 relative">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className={`text-4xl font-bold ${getScoreColor(score)}`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      {score}%
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Final Score</p>
                    {score >= 70 && (
                      <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                        Certificate Earned! 🏆
                      </Badge>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl font-bold text-foreground">
                      {correctAnswers}/{totalQuestions}
                    </div>
                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl font-bold text-foreground">
                      {Math.ceil(timeElapsed / 60)}
                    </div>
                    <p className="text-sm text-muted-foreground">Minutes</p>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-lg font-semibold">Performance Breakdown</h3>
                  <div className="space-y-2">
                    {quizQuestions.map((q, index) => {
                      const isCorrect = selectedAnswers[q.id] === q.correctAnswer
                      return (
                        <motion.div 
                          key={q.id} 
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1 + index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center space-x-3">
                            <motion.div
                              animate={{ rotate: isCorrect ? 0 : 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {isCorrect ? (
                                <CheckCircle size={20} className="text-green-600" />
                              ) : (
                                <XCircle size={20} className="text-red-600" />
                              )}
                            </motion.div>
                            <span className="text-sm">Question {index + 1}</span>
                            <Badge variant="outline" className={getDifficultyColor(q.difficulty)}>
                              {q.difficulty}
                            </Badge>
                          </div>
                          <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={restartQuiz} variant="outline">
                      <ArrowClockwise size={18} className="mr-2" />
                      Retake Quiz
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={onBackToDashboard}>
                      <Target size={18} className="mr-2" />
                      Continue Learning 🚀
                    </Button>
                  </motion.div>
                  
                  {score >= 70 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => setShowCertificate(true)} variant="outline">
                        <Medal size={18} className="mr-2" />
                        View Certificate 🏆
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        className="border-b bg-card/50 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Target size={20} className="text-primary" />
              </motion.div>
              <h1 className="text-lg font-semibold">Cybersecurity Fundamentals Quiz ⚡</h1>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              animate={{ x: [-100, 400] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock size={20} className="text-primary" />
                  </motion.div>
                  <span>Quiz Progress</span>
                </h2>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(currentQ.difficulty)}>
                    {currentQ.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {progressPercentage}% Complete ✨
                  </motion.span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                >
                  <Progress value={progressPercentage} className="h-3" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="mb-8 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-1 h-full bg-primary"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              
              <CardHeader className="relative">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className="text-xl pr-4">{currentQ.question}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-2">
                    <span>Select the best answer from the options below</span>
                    <Badge variant="outline" className="text-xs">
                      Category: {currentQ.category}
                    </Badge>
                  </CardDescription>
                </motion.div>
              </CardHeader>
              
              <CardContent>
                <RadioGroup 
                  value={selectedAnswers[currentQ.id]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
                >
                  {currentQ.options.map((option, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer group-hover:text-primary transition-colors">
                        {option}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div 
                      className="mt-6 p-4 rounded-lg bg-muted/50 border border-green-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start space-x-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <CheckCircle size={20} className="text-green-600 mt-0.5" />
                        </motion.div>
                        <div>
                          <motion.p 
                            className="font-medium mb-2"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Correct Answer: {currentQ.options[currentQ.correctAnswer]} ✅
                          </motion.p>
                          <motion.p 
                            className="text-sm text-muted-foreground"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {currentQ.explanation}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </Button>
          </motion.div>

          <div className="flex space-x-2">
            {!showExplanation && selectedAnswers[currentQ.id] !== undefined && (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <Button variant="outline" onClick={showAnswer}>
                  <Sparkle size={18} className="mr-2" />
                  Show Answer
                </Button>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleNext}
                disabled={selectedAnswers[currentQ.id] === undefined}
                className="relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center">
                  {currentQuestion === totalQuestions - 1 ? (
                    <>
                      <Trophy size={18} className="mr-2" />
                      Finish Quiz 🏆
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        className="mt-16 border-t bg-card/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span>by</span>
            <motion.span 
              className="font-semibold text-primary"
              whileHover={{ scale: 1.1 }}
            >
              AstraForensics
            </motion.span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}