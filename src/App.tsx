import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { RegistrationForm } from './components/RegistrationForm'
import { Dashboard } from './components/Dashboard'
import { LearningModule } from './components/LearningModule'
import { Quiz } from './components/Quiz'

interface UserData {
  name: string
  class: string
  email: string
  phone: string
  registeredAt: string
}

type AppState = 'registration' | 'dashboard' | 'learning' | 'quiz'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('registration')
  const [userData] = useKV<UserData | null>('user-data', null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userData) {
      setCurrentState('dashboard')
    }
    setIsLoading(false)
  }, [userData])

  const handleRegistrationComplete = (userData: UserData) => {
    setCurrentState('dashboard')
  }

  const handleStartLearning = () => {
    setCurrentState('learning')
  }

  const handleTakeQuiz = () => {
    setCurrentState('quiz')
  }

  const handleBackToDashboard = () => {
    setCurrentState('dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AstraForensics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {currentState === 'registration' && (
        <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
      )}
      
      {currentState === 'dashboard' && userData && (
        <Dashboard 
          userData={userData}
          onStartLearning={handleStartLearning}
          onTakeQuiz={handleTakeQuiz}
        />
      )}
      
      {currentState === 'learning' && (
        <LearningModule 
          onBackToDashboard={handleBackToDashboard}
          onTakeQuiz={handleTakeQuiz}
        />
      )}
      
      {currentState === 'quiz' && (
        <Quiz onBackToDashboard={handleBackToDashboard} />
      )}
      
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