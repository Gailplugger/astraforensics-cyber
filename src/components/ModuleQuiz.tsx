import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  X,
  Trophy,
  Brain,
  Target,
  Clock,
  Question
} from '@phosphor-icons/react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface ModuleQuizProps {
  questions: QuizQuestion[]
  passingScore: number
  onComplete: (score: number) => void
  onBack: () => void
  moduleTitle: string
}

export function ModuleQuiz({ questions, passingScore, onComplete, onBack, moduleTitle }: ModuleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    if (!quizStarted || showResults) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResults])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count
    }, 0)

    const score = Math.round((correctAnswers / questions.length) * 100)
    setShowResults(true)
    
    setTimeout(() => {
      onComplete(score)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScore = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count
    }, 0)
    return Math.round((correctAnswers / questions.length) * 100)
  }

  const isQuizComplete = () => {
    return selectedAnswers.length === questions.length && 
           selectedAnswers.every(answer => answer !== undefined)
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Brain size={48} className="text-primary" />
            </div>
            <CardTitle className="text-2xl">Quiz: {moduleTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You're about to take the quiz for this module. Here's what you need to know:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">30</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Passing Score</div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 text-left">
                <h4 className="font-semibold mb-2">Quiz Instructions:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• You have 30 minutes to complete the quiz</li>
                  <li>• You can navigate between questions freely</li>
                  <li>• You need {passingScore}% to pass and earn your certificate</li>
                  <li>• You can retake the quiz if you don't pass</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" className="flex-1">
                <ArrowLeft size={16} className="mr-2" />
                Back to Module
              </Button>
              <Button 
                onClick={() => setQuizStarted(true)} 
                className="flex-1 bg-gradient-to-r from-primary to-accent"
              >
                Start Quiz
                <Target size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const score = getScore()
    const passed = score >= passingScore
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="mx-auto mb-4"
            >
              {passed ? (
                <Trophy size={48} className="text-yellow-600" />
              ) : (
                <Target size={48} className="text-muted-foreground" />
              )}
            </motion.div>
            <CardTitle className="text-2xl">
              {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-destructive'}`}>
                    {score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Your Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {selectedAnswers.reduce((count, answer, index) => {
                      return answer === questions[index].correctAnswer ? count + 1 : count
                    }, 0)}/{questions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Required</div>
                </div>
              </div>

              <div className={`rounded-lg p-4 ${
                passed 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`font-medium ${passed ? 'text-green-800' : 'text-red-800'}`}>
                  {passed 
                    ? `Excellent work! You've passed the quiz and will receive your certificate.`
                    : `You need ${passingScore}% to pass. Review the material and try again!`
                  }
                </p>
              </div>

              {/* Answer Review */}
              <div className="text-left space-y-3">
                <h4 className="font-semibold">Answer Review:</h4>
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        {isCorrect ? (
                          <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" weight="fill" />
                        ) : (
                          <X size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="space-y-2 flex-1">
                          <p className="font-medium">{question.question}</p>
                          <div className="grid grid-cols-1 gap-1">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`text-sm p-2 rounded ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-green-100 text-green-800 font-medium'
                                    : optionIndex === userAnswer && !isCorrect
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-muted/30'
                                }`}
                              >
                                {option}
                                {optionIndex === question.correctAnswer && ' ✓'}
                                {optionIndex === userAnswer && !isCorrect && ' ✗'}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" className="flex-1">
                Back to Module
              </Button>
              {!passed && (
                <Button 
                  onClick={() => {
                    setShowResults(false)
                    setQuizStarted(false)
                    setCurrentQuestionIndex(0)
                    setSelectedAnswers([])
                    setTimeRemaining(30 * 60)
                  }}
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft size={16} className="mr-2" />
                Exit Quiz
              </Button>
              <div>
                <h1 className="text-xl font-bold">Quiz: {moduleTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{formatTime(timeRemaining)}</span>
              </Badge>
              <div className="text-sm text-muted-foreground">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Question size={20} className="text-primary" />
                    <CardTitle className="text-xl">
                      Question {currentQuestionIndex + 1}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed">{currentQuestion.question}</p>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                            selectedAnswers[currentQuestionIndex] === index
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {selectedAnswers[currentQuestionIndex] === index && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <span className="text-base">{option}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-primary-foreground'
                      : selectedAnswers[index] !== undefined
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!isQuizComplete()}
                className="bg-gradient-to-r from-primary to-accent"
              >
                Submit Quiz
                <Trophy size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Answered: {selectedAnswers.filter(a => a !== undefined).length} / {questions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}