import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { 
  Shield, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  TrendUp, 
  Trophy,
  Clock,
  Users,
  Target
} from '@phosphor-icons/react'

interface UserData {
  name: string
  class: string
  email: string
  phone: string
  registeredAt: string
}

interface ModuleProgress {
  moduleId: string
  completed: boolean
  progress: number
  quizScore?: number
  completedAt?: string
}

interface DashboardProps {
  userData: UserData
  onStartLearning: () => void
  onTakeQuiz: () => void
}

export function Dashboard({ userData, onStartLearning, onTakeQuiz }: DashboardProps) {
  const [moduleProgress] = useKV<ModuleProgress[]>('module-progress', [])
  const [quizScores] = useKV<Record<string, number>>('quiz-scores', {})

  const modules = [
    {
      id: 'cybersecurity-basics',
      title: 'Cybersecurity Fundamentals',
      description: 'Learn the core concepts of cybersecurity and threat landscape',
      duration: '45 min',
      difficulty: 'Beginner',
      topics: ['CIA Triad', 'Threat Types', 'Risk Assessment', 'Security Controls']
    },
    {
      id: 'network-security',
      title: 'Network Security',
      description: 'Understanding network protocols, firewalls, and intrusion detection',
      duration: '60 min',
      difficulty: 'Intermediate',
      topics: ['Firewalls', 'VPN', 'IDS/IPS', 'Network Monitoring']
    },
    {
      id: 'malware-analysis',
      title: 'Malware Analysis',
      description: 'Techniques for analyzing and understanding malicious software',
      duration: '75 min',
      difficulty: 'Advanced',
      topics: ['Static Analysis', 'Dynamic Analysis', 'Reverse Engineering', 'Sandboxing']
    },
    {
      id: 'incident-response',
      title: 'Incident Response',
      description: 'Learn how to respond to and manage cybersecurity incidents',
      duration: '50 min',
      difficulty: 'Intermediate',
      topics: ['NIST Framework', 'Forensics', 'Recovery', 'Documentation']
    },
    {
      id: 'penetration-testing',
      title: 'Penetration Testing',
      description: 'Ethical hacking techniques and vulnerability assessment',
      duration: '90 min',
      difficulty: 'Advanced',
      topics: ['Reconnaissance', 'Exploitation', 'Post-Exploitation', 'Reporting']
    }
  ]

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress?.find(p => p.moduleId === moduleId)
  }

  const getOverallProgress = () => {
    if (!moduleProgress || moduleProgress.length === 0) return 0
    const totalProgress = moduleProgress.reduce((sum, p) => sum + p.progress, 0)
    return Math.round(totalProgress / modules.length)
  }

  const getCompletedModules = () => {
    if (!moduleProgress) return 0
    return moduleProgress.filter(p => p.completed).length
  }

  const getAverageQuizScore = () => {
    if (!quizScores) return 0
    const scores = Object.values(quizScores)
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true
    const previousModule = modules[index - 1]
    const previousProgress = getModuleProgress(previousModule.id)
    return previousProgress?.completed || false
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield size={32} className="text-primary" weight="bold" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">AstraForensics</h1>
                <p className="text-sm text-muted-foreground">Cybersecurity Learning Platform</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">Welcome back, {userData.name}!</p>
              <p className="text-sm text-muted-foreground">{userData.class}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendUp size={24} className="text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{getOverallProgress()}%</p>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{getCompletedModules()}</p>
                  <p className="text-sm text-muted-foreground">Modules Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Trophy size={24} className="text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{getAverageQuizScore()}%</p>
                  <p className="text-sm text-muted-foreground">Average Quiz Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target size={24} className="text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{modules.length}</p>
                  <p className="text-sm text-muted-foreground">Total Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Track your cybersecurity education journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-muted-foreground">{getOverallProgress()}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Learning Modules</h2>
            <Button onClick={onTakeQuiz} variant="outline">
              <Trophy size={18} className="mr-2" />
              Take Practice Quiz
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module, index) => {
              const progress = getModuleProgress(module.id)
              const isUnlocked = isModuleUnlocked(index)
              
              return (
                <Card key={module.id} className={`card-hover ${!isUnlocked ? 'opacity-75' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {progress?.completed ? (
                            <CheckCircle size={20} className="text-green-600" weight="fill" />
                          ) : isUnlocked ? (
                            <BookOpen size={20} className="text-primary" />
                          ) : (
                            <Lock size={20} className="text-muted-foreground" />
                          )}
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                        </div>
                        <CardDescription className="mb-3">{module.description}</CardDescription>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{module.duration}</span>
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {module.topics.map((topic, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {progress && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                        {progress.quizScore && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Quiz Score: {progress.quizScore}%
                          </p>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      onClick={onStartLearning}
                      disabled={!isUnlocked}
                      className="w-full"
                      variant={progress?.completed ? "outline" : "default"}
                    >
                      {!isUnlocked ? (
                        <>
                          <Lock size={18} className="mr-2" />
                          Complete Previous Module
                        </>
                      ) : progress?.completed ? (
                        <>
                          <CheckCircle size={18} className="mr-2" />
                          Review Module
                        </>
                      ) : (
                        <>
                          <BookOpen size={18} className="mr-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          Made by{' '}
          <span className="font-semibold text-primary">AstraForensics</span>
        </div>
      </div>
    </div>
  )
}