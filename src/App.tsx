import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { WelcomeTour } from './components/WelcomeTour'
import { RegistrationForm } from './components/RegistrationForm'
import { Dashboard } from './components/Dashboard'
import { LearningModule } from './components/LearningModule'
import { Quiz } from './components/Quiz'
import { AIQuizGenerator } from './components/AIQuizGenerator'
import { EnhancedLearningModules } from './components/EnhancedLearningModules'
import { EnhancedAIAssistant } from './components/EnhancedAIAssistant'
import { AIChatAssistant } from './components/AIChatAssistant'
import { AISkillAssessment } from './components/AISkillAssessment'
import { CareerPathRecommendation } from './components/CareerPathRecommendation'
import { EnhancedCertificate } from './components/EnhancedCertificate'
import { OfflineLearning } from './components/OfflineLearning'
import { Button } from './components/ui/button'
import { Robot, Download, Trophy, TrendUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface UserData {
  name: string
  class: string
  email: string
  phone: string
  registeredAt: string
}

interface CertificateData {
  id: string
  studentName: string
  courseName: string
  completionDate: Date
  score: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+'
  moduleId: string
  skills: string[]
  duration: string
  certificateType: 'completion' | 'achievement' | 'mastery'
}

type AppState = 'welcome' | 'registration' | 'dashboard' | 'learning' | 'quiz' | 'ai-quiz' | 'enhanced-modules'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome')
  const [userData] = useKV<UserData | null>('user-data', null)
  const [hasSeenWelcome, setHasSeenWelcome] = useKV<boolean>('has-seen-welcome', false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showChatAssistant, setShowChatAssistant] = useState(false)
  const [showSkillAssessment, setShowSkillAssessment] = useState(false)
  const [showCareerRecommendation, setShowCareerRecommendation] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [showOfflineLearning, setShowOfflineLearning] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>()
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)

  useEffect(() => {
    const initApp = async () => {
      // Simulate app initialization
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (userData && hasSeenWelcome) {
        setCurrentState('dashboard')
      } else if (userData && !hasSeenWelcome) {
        setCurrentState('welcome')
      } else {
        setCurrentState('welcome')
      }
      
      setIsLoading(false)
    }

    initApp()
  }, [userData, hasSeenWelcome])

  const handleWelcomeComplete = () => {
    setHasSeenWelcome(true)
    if (userData) {
      setCurrentState('dashboard')
    } else {
      setCurrentState('registration')
    }
  }

  const handleRegistrationComplete = (userData: UserData) => {
    setCurrentState('dashboard')
  }

  const handleStartLearning = (moduleId?: string) => {
    if (moduleId) {
      setSelectedModuleId(moduleId)
    }
    setCurrentState('enhanced-modules')
  }

  const handleTakeQuiz = () => {
    setCurrentState('quiz')
  }

  const handleTakeAIQuiz = () => {
    setCurrentState('ai-quiz')
  }

  const handleBackToDashboard = () => {
    setCurrentState('dashboard')
    setSelectedModuleId(undefined)
  }

  const handleModuleComplete = (moduleId: string, score: number) => {
    // Generate certificate data
    const grade = score >= 95 ? 'A+' : score >= 90 ? 'A' : score >= 85 ? 'B+' : score >= 80 ? 'B' : 'C+'
    
    const certData: CertificateData = {
      id: Date.now().toString(),
      studentName: userData?.name || 'Student',
      courseName: `Module ${moduleId}`,
      completionDate: new Date(),
      score,
      grade,
      moduleId,
      skills: ['Network Security', 'Risk Assessment', 'Incident Response'],
      duration: '4 weeks',
      certificateType: score >= 90 ? 'mastery' : score >= 80 ? 'achievement' : 'completion'
    }
    
    setCertificateData(certData)
    setShowCertificate(true)
    console.log('Module completed:', moduleId, 'Score:', score)
  }

  const handleQuizComplete = (result: any) => {
    console.log('Quiz completed:', result)
    setCurrentState('dashboard')
  }

  const handleAssessmentComplete = (result: any) => {
    setAssessmentResult(result)
    setShowSkillAssessment(false)
    setShowCareerRecommendation(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <div className="anime-spinner rounded-full h-12 w-12 border-4 border-transparent"></div>
          </motion.div>
          <p className="text-muted-foreground gradient-text">Loading AstraForensics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {currentState === 'welcome' && (
        <WelcomeTour onComplete={handleWelcomeComplete} />
      )}
      
      {currentState === 'registration' && (
        <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
      )}
      
      {currentState === 'dashboard' && userData && (
        <Dashboard 
          userData={userData}
          onStartLearning={handleStartLearning}
          onTakeQuiz={handleTakeQuiz}
          onTakeAIQuiz={handleTakeAIQuiz}
        />
      )}
      
      {currentState === 'learning' && (
        <LearningModule 
          onBackToDashboard={handleBackToDashboard}
          onTakeQuiz={handleTakeQuiz}
        />
      )}

      {currentState === 'enhanced-modules' && (
        <EnhancedLearningModules
          selectedModuleId={selectedModuleId}
          onBack={handleBackToDashboard}
          onComplete={handleModuleComplete}
        />
      )}
      
      {currentState === 'quiz' && (
        <Quiz onBackToDashboard={handleBackToDashboard} />
      )}

      {currentState === 'ai-quiz' && (
        <AIQuizGenerator 
          topic="cybersecurity"
          difficulty="medium"
          questionCount={10}
          onComplete={handleQuizComplete}
          onBack={handleBackToDashboard}
        />
      )}

      {/* Enhanced AI Features - Floating Buttons */}
      {userData && currentState === 'dashboard' && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-40">
          {/* Main AI Assistant */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={() => setShowAIAssistant(true)}
              size="lg"
              className="rounded-full w-16 h-16 shadow-lg anime-glow bg-gradient-to-r from-primary to-accent"
              title="AI Learning Assistant"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Robot size={24} className="text-white" weight="fill" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Additional AI Features */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
            className="flex flex-col gap-2"
          >
            <Button
              onClick={() => setShowOfflineLearning(true)}
              size="sm"
              variant="secondary"
              className="rounded-full w-12 h-12 shadow-lg"
              title="Offline Learning"
            >
              <Download size={16} />
            </Button>
            
            <Button
              onClick={() => setShowSkillAssessment(true)}
              size="sm"
              variant="secondary"
              className="rounded-full w-12 h-12 shadow-lg"
              title="Skill Assessment"
            >
              <Trophy size={16} />
            </Button>
            
            <Button
              onClick={() => setShowCareerRecommendation(true)}
              size="sm"
              variant="secondary"
              className="rounded-full w-12 h-12 shadow-lg"
              title="Career Guidance"
            >
              <TrendUp size={16} />
            </Button>
          </motion.div>
        </div>
      )}

      {/* AI Components */}
      <EnhancedAIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        userData={userData || null}
        currentModule={selectedModuleId}
        context={currentState}
      />

      <AIChatAssistant
        isOpen={showChatAssistant}
        onClose={() => setShowChatAssistant(false)}
        userData={userData}
        context={currentState}
      />

      <AISkillAssessment
        isOpen={showSkillAssessment}
        onClose={() => setShowSkillAssessment(false)}
        onComplete={handleAssessmentComplete}
        userData={userData}
        difficulty="adaptive"
      />

      <CareerPathRecommendation
        isOpen={showCareerRecommendation}
        onClose={() => setShowCareerRecommendation(false)}
        userData={userData}
        assessmentResult={assessmentResult}
      />

      {certificateData && (
        <EnhancedCertificate
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          certificateData={certificateData}
          userData={userData}
        />
      )}

      <OfflineLearning
        isOpen={showOfflineLearning}
        onClose={() => setShowOfflineLearning(false)}
        userData={userData}
      />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border-t">
        <p>© 2024 AstraForensics - Advanced AI-Powered Cybersecurity Learning Platform | Made by AstraForensics</p>
      </footer>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  )
}

export default App