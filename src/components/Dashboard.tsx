import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { LearningRecommendations } from './LearningRecommendations'
import { CertificateGallery } from './CertificateGallery'
import { ProfileSettings } from './ProfileSettings'
import { 
  Shield, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  TrendUp, 
  Trophy,
  Clock,
  Users,
  Target,
  Brain,
  Medal,
  Sparkle,
  Star,
  Certificate,
  ChartLine,
  Lightning,
  Gear,
  List
} from '@phosphor-icons/react'
import cyberHero from '@/assets/images/cybersecurity-hero.svg'
import animeCharacter from '@/assets/images/anime-character.svg'

interface UserData {
  name: string
  username?: string
  class: string
  email: string
  phone: string
  registeredAt: string
  profilePicture?: string
  bio?: string
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
  onStartLearning: (moduleId?: string) => void
  onTakeQuiz: () => void
  onTakeAIQuiz?: () => void
}

export function Dashboard({ userData, onStartLearning, onTakeQuiz, onTakeAIQuiz }: DashboardProps) {
  const [moduleProgress] = useKV<ModuleProgress[]>('module-progress', [])
  const [quizScores] = useKV<Record<string, number>>('quiz-scores', {})
  const [certificates] = useKV<any[]>('user-certificates', [])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [userProfileData, setUserProfileData] = useKV<UserData>('user-data', userData)

  const handleStartRecommendation = (recommendationId: string) => {
    // Navigate to specific learning path based on recommendation
    onStartLearning()
  }

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
      case 'Beginner': return 'bg-success/10 text-success border-success/20'
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20'
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20'
      default: return 'bg-muted text-muted-foreground border-border'
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
      {/* Responsive Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-card/50 backdrop-blur-sm relative overflow-hidden safe-area-top"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <img src={cyberHero} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield size={28} className="text-primary sm:w-8 sm:h-8" weight="bold" />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">AstraForensics</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Cybersecurity Learning Platform</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <motion.div
                className="cursor-pointer"
                onClick={() => setShowProfile(true)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={animeCharacter} 
                  alt="Character" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary/20"
                />
              </motion.div>
              <div className="text-left sm:text-right">
                <motion.p 
                  className="font-medium text-foreground text-sm sm:text-base cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setShowProfile(true)}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome back, {userProfileData?.name}! ✨
                </motion.p>
                <motion.p 
                  className="text-xs sm:text-sm text-muted-foreground"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {userProfileData?.class}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 safe-area-bottom">
        {/* Responsive Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 md:mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendUp size={20} className="text-primary sm:w-6 sm:h-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <motion.p 
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {getOverallProgress()}%
                    </motion.p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Overall Progress</p>
                  </div>
                </div>
                <motion.div
                  className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 opacity-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkle size={12} className="text-primary sm:w-4 sm:h-4" weight="fill" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CheckCircle size={20} className="text-success sm:w-6 sm:h-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <motion.p 
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {getCompletedModules()}
                    </motion.p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Modules Completed</p>
                  </div>
                </div>
                <motion.div
                  className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 opacity-10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <Star size={12} className="text-success sm:w-4 sm:h-4" weight="fill" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy size={20} className="text-warning sm:w-6 sm:h-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <motion.p 
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {getAverageQuizScore()}%
                    </motion.p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Average Quiz Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={`relative overflow-hidden ${(certificates && certificates.length > 0) ? 'border-cert-gold/30 bg-gradient-to-br from-cert-gold/5 to-warning/5' : ''}`}>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Medal size={20} className="text-cert-gold sm:w-6 sm:h-6" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <motion.p 
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {certificates?.length || 0}
                    </motion.p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Certificates Earned</p>
                  </div>
                </div>
                {certificates && certificates.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 p-0 h-auto text-xs text-cert-gold hover:text-cert-gold/80"
                    onClick={() => setShowCertificates(true)}
                  >
                    View certificates →
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Certificate Gallery Section - Responsive */}
        {showCertificates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
              <div className="flex items-center space-x-3">
                <Certificate size={20} className="text-cert-gold sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Certificates</h2>
              </div>
              <Button
                onClick={() => setShowCertificates(false)}
                variant="outline"
                size="sm"
              >
                Hide Certificates
              </Button>
            </div>
            <CertificateGallery userData={userData} />
          </motion.div>
        )}

        {/* Enhanced Learning Progress - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="mb-6 md:mb-8 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
              animate={{ x: [-100, 800] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Target size={20} className="text-primary sm:w-6 sm:h-6" />
                </motion.div>
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription className="text-sm">Track your cybersecurity education journey</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <motion.span 
                    className="text-sm text-muted-foreground"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {getOverallProgress()}%
                  </motion.span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <Progress value={getOverallProgress()} className="h-3" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations Section - Enhanced & Responsive */}
        {(quizScores && Object.keys(quizScores).length > 0) && (
          <motion.div 
            className="mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Brain size={20} className="text-primary sm:w-6 sm:h-6" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Learning Recommendations</h2>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs sm:text-sm">
                  ✨ Powered by AI
                </Badge>
              </div>
              <Button
                onClick={() => setShowRecommendations(!showRecommendations)}
                variant="outline"
                className="relative overflow-hidden"
                size="sm"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative text-sm">
                  {showRecommendations ? 'Hide' : 'Show'} Recommendations
                </span>
              </Button>
            </div>
            
            {showRecommendations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <LearningRecommendations onStartRecommendation={handleStartRecommendation} />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Learning Modules - Responsive Grid */}
        <motion.div 
          className="space-y-4 md:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <BookOpen size={20} className="text-primary sm:w-6 sm:h-6" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Learning Modules</h2>
              <Badge variant="secondary" className="bg-info/10 text-info text-xs sm:text-sm">
                {modules.length} Available
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button onClick={onTakeQuiz} variant="outline" className="group" size="sm">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy size={16} className="mr-2 group-hover:text-warning" />
                </motion.div>
                Practice Quiz
              </Button>
              
              {onTakeAIQuiz && (
                <Button onClick={onTakeAIQuiz} className="group bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90" size="sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain size={16} className="mr-2" />
                  </motion.div>
                  AI Quiz ✨
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {modules.map((module, index) => {
              const progress = getModuleProgress(module.id)
              const isUnlocked = isModuleUnlocked(index)
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group"
                >
                  <Card className={`card-hover relative overflow-hidden h-full ${!isUnlocked ? 'opacity-75' : ''} ${progress?.completed ? 'border-success/30 bg-gradient-to-br from-success/5 to-success/10' : ''}`}>
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                      animate={{ x: [-300, 400] }}
                      transition={{ 
                        duration: 3 + index * 0.5, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: index * 0.2
                      }}
                    />
                    
                    {progress?.completed && (
                      <motion.div
                        className="absolute top-3 right-3"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkle size={18} className="text-success" weight="fill" />
                      </motion.div>
                    )}

                    <CardHeader className="p-4 md:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {progress?.completed ? (
                                <CheckCircle size={18} className="text-success sm:w-5 sm:h-5" weight="fill" />
                              ) : isUnlocked ? (
                                <BookOpen size={18} className="text-primary sm:w-5 sm:h-5" />
                              ) : (
                                <Lock size={18} className="text-muted-foreground sm:w-5 sm:h-5" />
                              )}
                            </motion.div>
                            <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                              {module.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="mb-3 text-sm leading-relaxed">{module.description}</CardDescription>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Badge variant="secondary" className={`${getDifficultyColor(module.difficulty)} text-xs`}>
                                {module.difficulty}
                              </Badge>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                                <Clock size={10} />
                                <span>{module.duration}</span>
                              </Badge>
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {module.topics.slice(0, 3).map((topic, idx) => (
                                <motion.div
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1.5 + index * 0.1 + idx * 0.05 }}
                                >
                                  <Badge variant="outline" className="text-xs bg-secondary/50 hover:bg-secondary">
                                    {topic}
                                  </Badge>
                                </motion.div>
                              ))}
                              {module.topics.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{module.topics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 md:p-6 pt-0">
                      {progress && (
                        <motion.div 
                          className="mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <motion.span 
                              className="text-sm text-muted-foreground"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                            >
                              {progress.progress}%
                            </motion.span>
                          </div>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          >
                            <Progress value={progress.progress} className="h-2" />
                          </motion.div>
                          {progress.quizScore && (
                            <motion.p 
                              className="text-sm text-muted-foreground mt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1 + index * 0.1 }}
                            >
                              Quiz Score: {progress.quizScore}% ⭐
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={() => onStartLearning(module.id)}
                          disabled={!isUnlocked}
                          className="w-full relative overflow-hidden group h-11"
                          variant={progress?.completed ? "outline" : "default"}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                          <span className="relative flex items-center justify-center text-sm">
                            {!isUnlocked ? (
                              <>
                                <Lock size={16} className="mr-2" />
                                Complete Previous Module
                              </>
                            ) : progress?.completed ? (
                              <>
                                <CheckCircle size={16} className="mr-2" />
                                Review Module ✨
                              </>
                            ) : (
                              <>
                                <BookOpen size={16} className="mr-2" />
                                Start Learning 🚀
                              </>
                            )}
                          </span>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Responsive Footer */}
        <motion.div 
          className="mt-12 md:mt-16 text-center text-sm text-muted-foreground border-t pt-6 md:pt-8 relative safe-area-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="bg-gradient-to-r from-transparent via-primary/10 to-transparent h-px w-full absolute top-0"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span>by</span>
            <motion.span 
              className="font-semibold text-primary"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
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
        </motion.div>

        {/* Profile Settings Modal */}
        <ProfileSettings
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userData={{
            ...userProfileData || userData,
            username: (userProfileData?.username || userData.name.toLowerCase().replace(/\s+/g, '')),
            totalScore: getAverageQuizScore(),
            completedModules: getCompletedModules()
          }}
          onUpdate={(updatedData) => {
            setUserProfileData(updatedData)
            setShowProfile(false)
          }}
        />
      </div>
    </div>
  )
}