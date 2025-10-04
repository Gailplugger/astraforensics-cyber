import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { RegistrationForm } from './components/RegistrationForm'
import { Dashboard } from './components/Dashboard'
import { LearningModule } from './components/LearningModule'
import { Quiz } from './components/Quiz'
import { AIQuizGenerator } from './components/AIQuizGenerator'
import { EnhancedLearningModules } from './components/EnhancedLearningModules'
import { AIAssistant } from './components/AIAssistant'
import { Button } from './components/ui/button'
import { Robot } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface UserData {
  name: string
  class: string
  email: string
  phone: string
  registeredAt: string
}

type AppState = 'registration' | 'dashboard' | 'learning' | 'quiz' | 'ai-quiz' | 'enhanced-modules'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('registration')
  const [userData] = useKV<UserData | null>('user-data', null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>()

  useEffect(() => {
    if (userData) {
      setCurrentState('dashboard')
    }
    setIsLoading(false)
  }, [userData])

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
    // Handle module completion, update progress, generate certificates, etc.
    console.log('Module completed:', moduleId, 'Score:', score)
  }

  const handleQuizComplete = (result: any) => {
    // Handle quiz completion, save results, update progress
    console.log('Quiz completed:', result)
    setCurrentState('dashboard')
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

      {/* AI Assistant Floating Button */}
      {userData && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 300 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => setShowAIAssistant(true)}
              size="lg"
              className="rounded-full w-16 h-16 shadow-lg anime-glow relative overflow-hidden group"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Robot size={28} className="text-white" weight="fill" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        userData={userData}
        currentModule={selectedModuleId}
        context={currentState}
      />
      
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