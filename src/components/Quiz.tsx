import { useState } from 'react'
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
  ArrowClockwise
} from '@phosphor-icons/react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
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
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Which of the following is NOT a type of malware?',
    options: ['Virus', 'Worm', 'Firewall', 'Trojan'],
    correctAnswer: 2,
    explanation: 'A firewall is a security control that monitors and controls network traffic, not a type of malware.',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: 'What is the primary purpose of a DDoS attack?',
    options: ['Steal sensitive data', 'Overwhelm systems with traffic', 'Install malware', 'Gain unauthorized access'],
    correctAnswer: 1,
    explanation: 'DDoS (Distributed Denial of Service) attacks aim to overwhelm systems with traffic, making them unavailable to legitimate users.',
    difficulty: 'medium'
  },
  {
    id: 'q4',
    question: 'Which type of security control is designed to detect incidents when they occur?',
    options: ['Preventive', 'Detective', 'Corrective', 'Administrative'],
    correctAnswer: 1,
    explanation: 'Detective controls identify and detect security incidents when they occur, such as intrusion detection systems.',
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'What is social engineering in cybersecurity?',
    options: ['A network protocol', 'Manipulating people to reveal information', 'A type of encryption', 'A security framework'],
    correctAnswer: 1,
    explanation: 'Social engineering involves manipulating people psychologically to reveal confidential information or perform actions that compromise security.',
    difficulty: 'medium'
  },
  {
    id: 'q6',
    question: 'Which principle ensures data accuracy and completeness?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
    correctAnswer: 1,
    explanation: 'Integrity ensures that data remains accurate, complete, and unaltered during storage, transmission, and processing.',
    difficulty: 'easy'
  },
  {
    id: 'q7',
    question: 'What is the main goal of ransomware?',
    options: ['Delete all files', 'Monitor user activity', 'Encrypt files and demand payment', 'Steal login credentials'],
    correctAnswer: 2,
    explanation: 'Ransomware encrypts files on a victim\'s system and demands payment (ransom) for the decryption key.',
    difficulty: 'medium'
  },
  {
    id: 'q8',
    question: 'Which of the following is an example of a preventive security control?',
    options: ['Security audit', 'Intrusion detection system', 'Firewall', 'Incident response plan'],
    correctAnswer: 2,
    explanation: 'A firewall is a preventive control that blocks unauthorized network traffic before it can reach protected systems.',
    difficulty: 'hard'
  },
  {
    id: 'q9',
    question: 'What does "availability" mean in the context of the CIA Triad?',
    options: ['Data can be accessed by anyone', 'Systems are always online', 'Information is accessible when needed by authorized users', 'Data is stored in multiple locations'],
    correctAnswer: 2,
    explanation: 'Availability ensures that information and resources are accessible when needed by authorized users, maintaining system uptime and reliability.',
    difficulty: 'medium'
  },
  {
    id: 'q10',
    question: 'Which attack type involves intercepting communications between two parties?',
    options: ['Phishing', 'SQL Injection', 'Man-in-the-Middle', 'Cross-site Scripting'],
    correctAnswer: 2,
    explanation: 'A Man-in-the-Middle (MitM) attack involves intercepting and potentially altering communications between two parties without their knowledge.',
    difficulty: 'hard'
  }
]

export function Quiz({ onBackToDashboard }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizScores, setQuizScores] = useKV<Record<string, number>>('quiz-scores', {})
  const [timeElapsed, setTimeElapsed] = useState(0)

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
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      finishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const showAnswer = () => {
    setShowExplanation(true)
  }

  const finishQuiz = () => {
    const correctAnswers = quizQuestions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length
    
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)
    setScore(finalScore)
    setQuizCompleted(true)
    
    // Save score
    setQuizScores((current) => ({
      ...current,
      'cybersecurity-basics': finalScore
    }))

    if (finalScore >= 70) {
      toast.success(`Excellent! You scored ${finalScore}%`)
    } else if (finalScore >= 50) {
      toast('Good effort! You scored ' + finalScore + '%')
    } else {
      toast('Keep studying! You scored ' + finalScore + '%')
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setShowExplanation(false)
    setScore(0)
    setTimeElapsed(0)
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
        <div className="border-b bg-card/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
                <ArrowLeft size={18} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Trophy size={48} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Quiz Completed!</CardTitle>
              <CardDescription>
                Great job on completing the Cybersecurity Fundamentals quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    {correctAnswers}/{totalQuestions}
                  </div>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    {Math.ceil(timeElapsed / 60)}
                  </div>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Breakdown</h3>
                <div className="space-y-2">
                  {quizQuestions.map((q, index) => {
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswer
                    return (
                      <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          {isCorrect ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : (
                            <XCircle size={20} className="text-red-600" />
                          )}
                          <span className="text-sm">Question {index + 1}</span>
                          <Badge variant="outline" className={getDifficultyColor(q.difficulty)}>
                            {q.difficulty}
                          </Badge>
                        </div>
                        <span className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={restartQuiz} variant="outline">
                  <ArrowClockwise size={18} className="mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={onBackToDashboard}>
                  <Target size={18} className="mr-2" />
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Target size={20} className="text-primary" />
              <h1 className="text-lg font-semibold">Cybersecurity Fundamentals Quiz</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quiz Progress</h2>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">
                  Question {currentQuestion + 1} of {totalQuestions}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(currentQ.difficulty)}>
                  {currentQ.difficulty}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progressPercentage}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            <CardDescription>
              Select the best answer from the options below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedAnswers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start space-x-2">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium mb-2">
                      Correct Answer: {currentQ.options[currentQ.correctAnswer]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft size={18} className="mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {!showExplanation && selectedAnswers[currentQ.id] !== undefined && (
              <Button variant="outline" onClick={showAnswer}>
                Show Answer
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              disabled={selectedAnswers[currentQ.id] === undefined}
            >
              {currentQuestion === totalQuestions - 1 ? (
                <>
                  <Trophy size={18} className="mr-2" />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Made by{' '}
          <span className="font-semibold text-primary">AstraForensics</span>
        </div>
      </div>
    </div>
  )
}