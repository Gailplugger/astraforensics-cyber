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
import { SparkEnhancedCertificate } from './components/SparkEnhancedCertificate'
import { OfflineLearning } from './components/OfflineLearning'
import { BackendErrorBoundary } from './components/BackendErrorBoundary'
import { NotesDashboard } from './components/Notes/NotesDashboard'
import { TodoDashboard } from './components/Todo/TodoDashboard'
import { DailyReflection } from './components/DailyReflection'
import { SparkLoader } from './components/SparkLoader'
import { Button } from './components/ui/button'
import { Robot, Download, Trophy, TrendUp, FileText, CheckSquare, Brain } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

// Enhanced viewport height handling for mobile devices with better support
const setViewportHeight = () => {
  // Use new viewport units if available
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  
  // Set dynamic viewport height
  if ('visualViewport' in window) {
    const handleViewportChange = () => {
      const vh = window.visualViewport?.height || window.innerHeight
      document.documentElement.style.setProperty('--dvh', `${vh * 0.01}px`)
    }
    window.visualViewport?.addEventListener('resize', handleViewportChange)
    window.visualViewport?.addEventListener('scroll', handleViewportChange)
    handleViewportChange()
  }
}

// Initialize viewport height
setViewportHeight()

// Update on resize and orientation change with improved handling
window.addEventListener('resize', setViewportHeight)
window.addEventListener('orientationchange', () => {
  // Delay to ensure new orientation is applied
  setTimeout(setViewportHeight, 150)
})

// Handle mobile browser navigation changes
window.addEventListener('scroll', () => {
  setViewportHeight()
}, { passive: true })

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

interface StoredCertificate {
  id: string
  moduleId: string
  moduleName: string
  courseName: string
  studentName: string
  completedAt: string
  score: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+'
}

type AppState = 'welcome' | 'registration' | 'dashboard' | 'learning' | 'quiz' | 'ai-quiz' | 'module-content'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome')
  const [userData] = useKV<UserData | null>('user-data', null)
  const [hasSeenWelcome, setHasSeenWelcome] = useKV<boolean>('has-seen-welcome', false)
  const [userCertificates, setUserCertificates] = useKV<StoredCertificate[]>('user-certificates', [])
  const [isLoading, setIsLoading] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showChatAssistant, setShowChatAssistant] = useState(false)
  const [showSkillAssessment, setShowSkillAssessment] = useState(false)
  const [showCareerRecommendation, setShowCareerRecommendation] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [showOfflineLearning, setShowOfflineLearning] = useState(false)
  const [showNotesDashboard, setShowNotesDashboard] = useState(false)
  const [showTodoDashboard, setShowTodoDashboard] = useState(false)
  const [showDailyReflection, setShowDailyReflection] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>()
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)

  useEffect(() => {
    const initApp = async () => {
      try {
        setIsLoading(true)
        
        // Simple initialization without complex backend validation
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (userData && hasSeenWelcome) {
          setCurrentState('dashboard')
        } else if (userData && !hasSeenWelcome) {
          setCurrentState('welcome')
        } else {
          setCurrentState('welcome')
        }
        
        console.log('Application initialization completed')
      } catch (error) {
        console.error('Application initialization failed', error)
        toast.error('Failed to initialize application')
      } finally {
        setIsLoading(false)
      }
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

  const getModuleName = (moduleId: string) => {
    const moduleNames: Record<string, string> = {
      'cybersecurity-fundamentals': 'Cybersecurity Fundamentals',
      'network-security': 'Network Security Essentials',
      'ethical-hacking': 'Ethical Hacking & Penetration Testing',
      'incident-response': 'Incident Response & Digital Forensics',
      'cloud-security': 'Cloud Security Architecture'
    }
    return moduleNames[moduleId] || `Module ${moduleId}`
  }

  const getModuleSkills = (moduleId: string) => {
    const moduleSkills: Record<string, string[]> = {
      'cybersecurity-fundamentals': ['CIA Triad', 'Risk Assessment', 'Security Frameworks', 'Threat Analysis'],
      'network-security': ['Network Protocols', 'Firewalls', 'Zero Trust', 'Access Control'],
      'ethical-hacking': ['Penetration Testing', 'Vulnerability Assessment', 'Security Tools', 'Ethical Hacking'],
      'incident-response': ['Incident Response', 'Digital Forensics', 'Evidence Collection', 'Recovery Planning'],
      'cloud-security': ['Cloud Architecture', 'Shared Responsibility', 'Cloud Controls', 'Compliance']
    }
    return moduleSkills[moduleId] || ['Cybersecurity', 'Security Analysis', 'Risk Management']
  }

  const getModuleDuration = (moduleId: string) => {
    const moduleDurations: Record<string, string> = {
      'cybersecurity-fundamentals': '6 weeks',
      'network-security': '4 weeks',
      'ethical-hacking': '5 weeks',
      'incident-response': '4 weeks',
      'cloud-security': '3 weeks'
    }
    return moduleDurations[moduleId] || '4 weeks'
  }

  const handleModuleComplete = (moduleId: string, score: number) => {
    if (!userData) {
      console.error('User data is required to complete module')
      return
    }

    // Generate certificate data
    const grade = score >= 95 ? 'A+' : score >= 90 ? 'A' : score >= 85 ? 'B+' : score >= 80 ? 'B' : 'C+'
    
    const certData: CertificateData = {
      id: Date.now().toString(),
      studentName: userData.name,
      courseName: getModuleName(moduleId),
      completionDate: new Date(),
      score,
      grade,
      moduleId,
      skills: getModuleSkills(moduleId),
      duration: getModuleDuration(moduleId),
      certificateType: score >= 90 ? 'mastery' : score >= 80 ? 'achievement' : 'completion'
    }
    
    // Save certificate to user's collection with proper structure
    const certificateForStorage: StoredCertificate = {
      id: certData.id,
      moduleId: certData.moduleId,
      moduleName: certData.courseName,
      courseName: certData.courseName,
      studentName: certData.studentName,
      completedAt: certData.completionDate.toISOString(),
      score: certData.score,
      grade: certData.grade
    }
    
    setUserCertificates(prev => [...(prev || []), certificateForStorage])
    
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
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center safe-area-top safe-area-bottom relative overflow-hidden">
        {/* Enhanced Cyber Grid Background */}
        <div className="cyber-grid absolute inset-0 opacity-15"></div>
        
        {/* Floating Spark Elements with Enhanced Animation */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full spark-float-${(i % 3) + 1}`}
            style={{
              background: `var(--spark-${['electric', 'neon', 'plasma', 'energy'][i % 4]})`,
              left: `${5 + (i * 6)}%`,
              top: `${10 + (i * 5)}%`,
              boxShadow: `0 0 15px var(--spark-${['electric', 'neon', 'plasma', 'energy'][i % 4]})`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 1.5 }}
          />
        ))}

        {/* Neural Network Pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width="800" height="600" className="opacity-20">
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={100 + (i % 4) * 200}
                cy={150 + Math.floor(i / 4) * 300}
                r="4"
                fill="var(--spark-electric)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <motion.line
                key={i}
                x1={100 + (i % 3) * 200}
                y1={150}
                x2={300 + (i % 2) * 200}
                y2={450}
                stroke="var(--spark-neon)"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </svg>
        </div>

        <div className="text-center px-4 relative z-10 max-w-md">
          <SparkLoader 
            size="xl" 
            variant="neural" 
            text="Initializing AstraForensics Platform..."
          />
          
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">
              AstraForensics
            </h1>
            <p className="text-muted-foreground text-lg">
              Advanced AI-Powered Cybersecurity Learning
            </p>
            
            {/* Loading Steps */}
            <motion.div
              className="space-y-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                'Loading security modules...',
                'Initializing AI assistant...',
                'Preparing learning environment...',
                'Almost ready...'
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.5, duration: 0.5 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--spark-electric)' }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                  {step}
                </motion.div>
              ))}
            </motion.div>
            
            {/* Progress Bar */}
            <motion.div
              className="w-full bg-muted h-2 rounded-full overflow-hidden mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--gradient-spark)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </motion.div>
            
            {/* Spark Technology Badge */}
            <motion.div
              className="flex items-center justify-center gap-2 mt-6 p-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5 }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                ⚡
              </motion.span>
              <span className="text-sm font-medium gradient-text">
                Powered by Spark Technology
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <BackendErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background relative flex flex-col container">
        {/* Spark Background Effects */}
        <div className="cyber-grid absolute inset-0 opacity-10 pointer-events-none"></div>
        
        {/* Main Content Area */}
      <div className="flex-1 safe-area-top relative z-10">
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

      {/* Enhanced AI Features - Responsive Floating Buttons with Spark Effects */}
      {userData && currentState === 'dashboard' && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 safe-area-bottom safe-area-right">
          {/* Main AI Assistant */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={() => setShowAIAssistant(true)}
              size="lg"
              className="rounded-full w-14 h-14 sm:w-18 sm:h-18 shadow-xl spark-glow relative overflow-hidden"
              style={{ background: 'var(--gradient-spark)' }}
              title="AI Learning Assistant"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <Robot size={24} className="text-white sm:w-7 sm:h-7" weight="fill" />
              </motion.div>
              <div className="absolute inset-0 rounded-full spark-trail"></div>
            </Button>
          </motion.div>

          {/* Additional AI Features - Enhanced Grid */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
            className="flex flex-col gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowOfflineLearning(true)}
                size="sm"
                variant="secondary"
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                title="Offline Learning"
              >
                <Download size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowSkillAssessment(true)}
                size="sm"
                variant="secondary"
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                title="Skill Assessment"
              >
                <Trophy size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowCareerRecommendation(true)}
                size="sm"
                variant="secondary"
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                title="Career Guidance"
              >
                <TrendUp size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </motion.div>

            {/* New AI Features - Notes, Todo, Reflection */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowNotesDashboard(true)}
                size="sm"
                variant="secondary"
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                title="AI Notes & Knowledge Base"
              >
                <FileText size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowTodoDashboard(true)}
                size="sm"
                variant="secondary"
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                title="AI Task Manager"
              >
                <CheckSquare size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowDailyReflection(true)}
                size="sm"
                variant="secondary"
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                title="Daily Reflection"
              >
                <Brain size={16} className="sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Spark Particles around buttons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: `var(--spark-${['electric', 'neon', 'plasma'][i % 3]})`,
                  boxShadow: `0 0 4px var(--spark-${['electric', 'neon', 'plasma'][i % 3]})`
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
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
        <SparkEnhancedCertificate
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

      {/* New AI Features */}
      <NotesDashboard
        isOpen={showNotesDashboard}
        onClose={() => setShowNotesDashboard(false)}
      />

      <TodoDashboard
        isOpen={showTodoDashboard}
        onClose={() => setShowTodoDashboard(false)}
      />

      <DailyReflection
        isOpen={showDailyReflection}
        onClose={() => setShowDailyReflection(false)}
      />

      {/* Enhanced Responsive Footer with Spark Effects */}
      <footer className="safe-area-bottom border-t bg-card/80 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 py-4 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              © 2024 AstraForensics - Advanced AI-Powered Cybersecurity Learning Platform
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>⚡ Powered by</span>
              <span className="gradient-text font-semibold">Spark Technology</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.span>
            </div>
          </motion.div>
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
    </BackendErrorBoundary>
  )
}

export default App