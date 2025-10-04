import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { WelcomeTour } from './components/WelcomeTour'
import { RegistrationForm } from './components/RegistrationForm'
import { Dashboard } from './components/Dashboard'
import { LearningModule } from './components/LearningModule'
import { Quiz } from './components/Quiz'
import { AIQuizGenerator } from './components/AIQuizGenerator'
import { ModuleContentViewer } from './components/ModuleContentViewer'
import { EnhancedAIAssistant } from './components/EnhancedAIAssistant'
import { AIChatAssistant } from './components/AIChatAssistant'
import { AISkillAssessment } from './components/AISkillAssessment'
import { CareerPathRecommendation } from './components/CareerPathRecommendation'
import { EnhancedCertificate } from './components/EnhancedCertificate'
import { OfflineLearning } from './components/OfflineLearning'
import { Button } from './components/ui/button'
import { Robot, Download, Trophy, TrendUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

// Enhanced viewport height handling for mobile devices
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Initialize viewport height
setViewportHeight()

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight)
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100)
})

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

type AppState = 'welcome' | 'registration' | 'dashboard' | 'learning' | 'quiz' | 'ai-quiz' | 'module-content'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome')
  const [userData] = useKV<UserData | null>('user-data', null)
  const [hasSeenWelcome, setHasSeenWelcome] = useKV<boolean>('has-seen-welcome', false)
  const [userCertificates, setUserCertificates] = useKV<CertificateData[]>('user-certificates', [])
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
    setCurrentState('module-content')
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
    
    // Save certificate to user's collection
    setUserCertificates(prev => [...(prev || []), certData])
    
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
      <div className="min-h-screen bg-background flex items-center justify-center safe-area-top safe-area-bottom">
        <div className="text-center px-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 sm:mb-6"
          >
            <div className="anime-spinner rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 border-4 border-transparent"></div>
          </motion.div>
          <motion.p 
            className="text-sm sm:text-base lg:text-lg text-muted-foreground gradient-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Loading AstraForensics...
          </motion.p>
          <motion.p 
            className="text-xs sm:text-sm text-muted-foreground mt-2 opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Preparing your cybersecurity learning experience
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 safe-area-top">
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

        {currentState === 'module-content' && (
          <ModuleContentViewer
            moduleId={selectedModuleId || 'cybersecurity-fundamentals'}
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
      </div>

      {/* Enhanced AI Features - Responsive Floating Buttons */}
      {userData && currentState === 'dashboard' && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 sm:gap-3 z-40 safe-area-bottom safe-area-right">
          {/* Main AI Assistant */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={() => setShowAIAssistant(true)}
              size="lg"
              className="rounded-full w-12 h-12 sm:w-16 sm:h-16 shadow-lg anime-glow bg-gradient-to-r from-primary to-accent"
              title="AI Learning Assistant"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Robot size={20} className="text-white sm:w-6 sm:h-6" weight="fill" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Additional AI Features - Responsive Grid */}
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
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg"
              title="Offline Learning"
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              onClick={() => setShowSkillAssessment(true)}
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg"
              title="Skill Assessment"
            >
              <Trophy size={14} className="sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              onClick={() => setShowCareerRecommendation(true)}
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-lg"
              title="Career Guidance"
            >
              <TrendUp size={14} className="sm:w-4 sm:h-4" />
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

      {/* Enhanced Responsive Footer */}
      <footer className="safe-area-bottom border-t bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © 2024 AstraForensics - Advanced AI-Powered Cybersecurity Learning Platform | Made by AstraForensics
          </p>
        </div>
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