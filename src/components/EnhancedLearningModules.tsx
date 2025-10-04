import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { ProfessionalCertificate } from './ProfessionalCertificate'
import { 
  ArrowLeft, 
  CheckCircle, 
  Play, 
  BookOpen,
  Clock,
  Star,
  Trophy,
  Brain,
  Target,
  Shield,
  Lock,
  Globe,
  Bug,
  Eye,
  Fingerprint,
  Certificate as CertificateIcon,
  Sparkle
} from '@phosphor-icons/react'

interface LearningContent {
  id: string
  title: string
  content: string
  type: 'text' | 'video' | 'interactive' | 'simulation'
  duration: number
}

interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  prerequisites: string[]
  learningObjectives: string[]
  content: LearningContent[]
  topics: string[]
  certification: boolean
}

interface ModuleProgress {
  moduleId: string
  completed: boolean
  progress: number
  currentSection: number
  timeSpent: number
  quizScore?: number
  completedAt?: string
  certificateEarned?: boolean
}

interface EnhancedLearningModulesProps {
  selectedModuleId?: string
  onBack?: () => void
  onComplete?: (moduleId: string, score: number) => void
}

export function EnhancedLearningModules({ selectedModuleId, onBack, onComplete }: EnhancedLearningModulesProps) {
  const [modules] = useState<Module[]>([
    {
      id: 'cybersecurity-fundamentals',
      title: 'Cybersecurity Fundamentals',
      description: 'Master the core principles and concepts of cybersecurity',
      icon: <Shield size={24} className="text-blue-600" />,
      difficulty: 'Beginner',
      estimatedTime: '2-3 hours',
      prerequisites: [],
      learningObjectives: [
        'Understand the CIA triad and its applications',
        'Identify common cybersecurity threats and vulnerabilities',
        'Learn about risk assessment and management',
        'Explore security frameworks and compliance standards'
      ],
      content: [
        {
          id: 'intro',
          title: 'Introduction to Cybersecurity',
          content: 'Welcome to the world of cybersecurity! In this comprehensive module, you\'ll learn the fundamental concepts that form the backbone of information security...',
          type: 'text',
          duration: 15
        },
        {
          id: 'cia-triad',
          title: 'The CIA Triad',
          content: 'The CIA triad consists of Confidentiality, Integrity, and Availability - the three pillars of information security...',
          type: 'interactive',
          duration: 20
        }
      ],
      topics: ['CIA Triad', 'Threat Landscape', 'Risk Management', 'Compliance'],
      certification: true
    },
    {
      id: 'network-security',
      title: 'Network Security Essentials',
      description: 'Comprehensive guide to securing network infrastructure',
      icon: <Globe size={24} className="text-green-600" />,
      difficulty: 'Intermediate',
      estimatedTime: '3-4 hours',
      prerequisites: ['cybersecurity-fundamentals'],
      learningObjectives: [
        'Configure and manage firewalls effectively',
        'Implement network segmentation strategies',
        'Monitor network traffic for threats',
        'Design secure network architectures'
      ],
      content: [
        {
          id: 'network-basics',
          title: 'Network Security Fundamentals',
          content: 'Understanding network protocols, OSI model, and security implications at each layer...',
          type: 'text',
          duration: 25
        }
      ],
      topics: ['Firewalls', 'VPN', 'IDS/IPS', 'Network Monitoring'],
      certification: true
    },
    {
      id: 'malware-analysis',
      title: 'Malware Analysis & Reverse Engineering',
      description: 'Advanced techniques for analyzing malicious software',
      icon: <Bug size={24} className="text-red-600" />,
      difficulty: 'Advanced',
      estimatedTime: '4-5 hours',
      prerequisites: ['cybersecurity-fundamentals', 'network-security'],
      learningObjectives: [
        'Perform static and dynamic malware analysis',
        'Use reverse engineering tools effectively',
        'Identify malware families and their behaviors',
        'Develop malware detection signatures'
      ],
      content: [
        {
          id: 'malware-intro',
          title: 'Introduction to Malware',
          content: 'Types of malware, attack vectors, and analysis methodologies...',
          type: 'text',
          duration: 30
        }
      ],
      topics: ['Static Analysis', 'Dynamic Analysis', 'Reverse Engineering', 'Sandboxing'],
      certification: true
    },
    {
      id: 'incident-response',
      title: 'Incident Response & Digital Forensics',
      description: 'Learn to respond to and investigate security incidents',
      icon: <Eye size={24} className="text-purple-600" />,
      difficulty: 'Intermediate',
      estimatedTime: '3-4 hours',
      prerequisites: ['cybersecurity-fundamentals'],
      learningObjectives: [
        'Implement NIST incident response framework',
        'Collect and preserve digital evidence',
        'Conduct forensic analysis of systems',
        'Document and report security incidents'
      ],
      content: [
        {
          id: 'ir-framework',
          title: 'Incident Response Framework',
          content: 'NIST framework phases: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned...',
          type: 'text',
          duration: 25
        }
      ],
      topics: ['NIST Framework', 'Digital Forensics', 'Evidence Collection', 'Incident Documentation'],
      certification: true
    },
    {
      id: 'penetration-testing',
      title: 'Ethical Hacking & Penetration Testing',
      description: 'Learn ethical hacking techniques and penetration testing methodologies',
      icon: <Target size={24} className="text-orange-600" />,
      difficulty: 'Advanced',
      estimatedTime: '5-6 hours',
      prerequisites: ['cybersecurity-fundamentals', 'network-security'],
      learningObjectives: [
        'Master reconnaissance and enumeration techniques',
        'Exploit common vulnerabilities safely',
        'Perform post-exploitation activities',
        'Write comprehensive penetration test reports'
      ],
      content: [
        {
          id: 'pentest-methodology',
          title: 'Penetration Testing Methodology',
          content: 'OWASP Testing Guide, NIST SP 800-115, and industry-standard methodologies...',
          type: 'text',
          duration: 35
        }
      ],
      topics: ['Reconnaissance', 'Vulnerability Assessment', 'Exploitation', 'Post-Exploitation'],
      certification: true
    },
    {
      id: 'cryptography',
      title: 'Applied Cryptography',
      description: 'Master cryptographic principles and their practical applications',
      icon: <Lock size={24} className="text-indigo-600" />,
      difficulty: 'Advanced',
      estimatedTime: '4-5 hours',
      prerequisites: ['cybersecurity-fundamentals'],
      learningObjectives: [
        'Understand symmetric and asymmetric encryption',
        'Implement digital signatures and certificates',
        'Design secure communication protocols',
        'Apply cryptographic best practices'
      ],
      content: [
        {
          id: 'crypto-basics',
          title: 'Cryptographic Fundamentals',
          content: 'History of cryptography, modern cryptographic algorithms, and their applications...',
          type: 'text',
          duration: 30
        }
      ],
      topics: ['Symmetric Encryption', 'Public Key Cryptography', 'Digital Signatures', 'PKI'],
      certification: true
    },
    {
      id: 'identity-access-management',
      title: 'Identity & Access Management',
      description: 'Comprehensive IAM strategies and implementation',
      icon: <Fingerprint size={24} className="text-cyan-600" />,
      difficulty: 'Intermediate',
      estimatedTime: '3-4 hours',
      prerequisites: ['cybersecurity-fundamentals'],
      learningObjectives: [
        'Design identity management architectures',
        'Implement multi-factor authentication',
        'Manage privileged access controls',
        'Ensure compliance with identity regulations'
      ],
      content: [
        {
          id: 'iam-principles',
          title: 'IAM Principles and Frameworks',
          content: 'Identity lifecycle management, access control models, and authentication methods...',
          type: 'text',
          duration: 25
        }
      ],
      topics: ['Identity Lifecycle', 'Access Controls', 'Multi-factor Authentication', 'Privileged Access'],
      certification: true
    },
    {
      id: 'ai-cybersecurity',
      title: 'AI in Cybersecurity',
      description: 'Leverage artificial intelligence for advanced threat detection',
      icon: <Brain size={24} className="text-pink-600" />,
      difficulty: 'Advanced',
      estimatedTime: '4-5 hours',
      prerequisites: ['cybersecurity-fundamentals', 'malware-analysis'],
      learningObjectives: [
        'Apply machine learning to threat detection',
        'Understand AI-powered security tools',
        'Identify AI threats and adversarial attacks',
        'Implement automated incident response'
      ],
      content: [
        {
          id: 'ai-security-intro',
          title: 'AI in Security Operations',
          content: 'Machine learning algorithms for anomaly detection, behavioral analysis, and automated response...',
          type: 'text',
          duration: 35
        }
      ],
      topics: ['Machine Learning', 'Anomaly Detection', 'Automated Response', 'AI Threats'],
      certification: true
    }
  ])

  const [moduleProgress, setModuleProgress] = useKV<ModuleProgress[]>('enhanced-module-progress', [])
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isStudying, setIsStudying] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [completedModuleId, setCompletedModuleId] = useState<string | null>(null)

  useEffect(() => {
    if (selectedModuleId) {
      const module = modules.find(m => m.id === selectedModuleId)
      if (module) {
        setCurrentModule(module)
        setIsStudying(true)
        
        // Load progress
        const progress = moduleProgress?.find(p => p.moduleId === selectedModuleId)
        if (progress) {
          setCurrentSectionIndex(progress.currentSection)
        }
      }
    }
  }, [selectedModuleId, modules, moduleProgress])

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress?.find(p => p.moduleId === moduleId)
  }

  const isModuleUnlocked = (module: Module) => {
    if (module.prerequisites.length === 0) return true
    
    return module.prerequisites.every(prereqId => {
      const prereqProgress = getModuleProgress(prereqId)
      return prereqProgress?.completed || false
    })
  }

  const updateProgress = (moduleId: string, updates: Partial<ModuleProgress>) => {
    setModuleProgress(prev => {
      const existing = prev?.find(p => p.moduleId === moduleId)
      if (existing) {
        return prev?.map(p => 
          p.moduleId === moduleId ? { ...p, ...updates } : p
        ) || []
      } else {
        const newProgress: ModuleProgress = {
          moduleId,
          completed: false,
          progress: 0,
          currentSection: 0,
          timeSpent: 0,
          ...updates
        }
        return [...(prev || []), newProgress]
      }
    })
  }

  const handleStartModule = (module: Module) => {
    if (!isModuleUnlocked(module)) {
      toast.error('Complete prerequisite modules first!')
      return
    }

    setCurrentModule(module)
    setIsStudying(true)
    setCurrentSectionIndex(0)
  }

  const handleCompleteSection = () => {
    if (!currentModule) return

    const isLastSection = currentSectionIndex >= currentModule.content.length - 1
    const progress = Math.round(((currentSectionIndex + 1) / currentModule.content.length) * 100)

    if (isLastSection) {
      // Module completed
      updateProgress(currentModule.id, {
        completed: true,
        progress: 100,
        currentSection: currentModule.content.length - 1,
        completedAt: new Date().toISOString(),
        certificateEarned: currentModule.certification
      })

      if (currentModule.certification) {
        setCompletedModuleId(currentModule.id)
        setShowCertificate(true)
      }

      toast.success(`🎉 Module "${currentModule.title}" completed!`)
      onComplete?.(currentModule.id, 100)
    } else {
      // Move to next section
      setCurrentSectionIndex(prev => prev + 1)
      updateProgress(currentModule.id, {
        progress,
        currentSection: currentSectionIndex + 1
      })
    }
  }

  const generateCertificate = () => {
    if (!currentModule || !completedModuleId) return null

    return {
      id: `cert-${completedModuleId}-${Date.now()}`,
      studentName: 'Student', // Would come from user data
      courseName: currentModule.title,
      completionDate: new Date().toISOString(),
      score: 100,
      modules: [currentModule.title],
      certificateNumber: `AST-${completedModuleId.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toISOString()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (showCertificate && completedModuleId) {
    const certificateData = generateCertificate()
    if (certificateData) {
      return (
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mx-auto mb-4"
              >
                <Trophy size={64} className="text-yellow-600 mx-auto" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">🎉 Congratulations!</h1>
              <p className="text-xl text-muted-foreground">
                You've successfully completed the module and earned your certificate!
              </p>
            </div>

            <ProfessionalCertificate 
              certificateData={certificateData}
              onDownload={() => toast.success('Certificate downloaded!')}
              onShare={() => toast.success('Achievement shared!')}
            />

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                onClick={() => {
                  setShowCertificate(false)
                  setIsStudying(false)
                  setCurrentModule(null)
                  setCompletedModuleId(null)
                }}
                variant="outline"
              >
                Return to Modules
              </Button>
              <Button
                onClick={() => {
                  // Start next module or go to quiz
                  setShowCertificate(false)
                  setIsStudying(false)
                  setCurrentModule(null)
                  setCompletedModuleId(null)
                }}
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }

  if (isStudying && currentModule) {
    const currentSection = currentModule.content[currentSectionIndex]
    const progress = ((currentSectionIndex + 1) / currentModule.content.length) * 100

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b bg-card/50 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsStudying(false)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Modules</span>
                </Button>
                
                <div className="flex items-center space-x-3">
                  {currentModule.icon}
                  <div>
                    <h1 className="text-xl font-bold">{currentModule.title}</h1>
                    <p className="text-sm text-muted-foreground">
                      Section {currentSectionIndex + 1} of {currentModule.content.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={getDifficultyColor(currentModule.difficulty)}>
                  {currentModule.difficulty}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </div>
              </div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="mt-4"
            >
              <Progress value={progress} className="h-2" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />

              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl mb-2">{currentSection.title}</CardTitle>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    <Clock size={14} className="mr-1" />
                    {currentSection.duration} min
                  </Badge>
                  <Badge variant="outline">{currentSection.type}</Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="prose max-w-none mb-8">
                  <p className="text-lg leading-relaxed">{currentSection.content}</p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleCompleteSection}
                    size="lg"
                    className="w-full relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="relative flex items-center justify-center">
                      {currentSectionIndex >= currentModule.content.length - 1 ? (
                        <>
                          <Trophy size={20} className="mr-2" />
                          Complete Module
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} className="mr-2" />
                          Complete Section
                        </>
                      )}
                    </span>
                  </Button>
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
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-card/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen size={32} className="text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Enhanced Learning Modules</h1>
                <p className="text-muted-foreground">Master cybersecurity with our comprehensive curriculum</p>
              </div>
            </div>
            
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const progress = getModuleProgress(module.id)
            const isUnlocked = isModuleUnlocked(module)

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className={`card-hover relative overflow-hidden h-full ${
                  !isUnlocked ? 'opacity-75' : ''
                } ${
                  progress?.completed ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' : ''
                }`}>
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                    animate={{ x: [-300, 400] }}
                    transition={{ 
                      duration: 8 + index * 0.5, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: index * 0.2
                    }}
                  />

                  {progress?.completed && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle size={24} className="text-green-600" weight="fill" />
                    </motion.div>
                  )}

                  {module.certification && (
                    <motion.div
                      className="absolute top-4 left-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <CertificateIcon size={20} className="text-yellow-600" weight="fill" />
                    </motion.div>
                  )}

                  <CardHeader className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {isUnlocked ? module.icon : <Lock size={24} className="text-muted-foreground" />}
                      </motion.div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {module.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock size={12} className="mr-1" />
                            {module.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                    {/* Learning Objectives */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Learning Objectives:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {module.learningObjectives.slice(0, 2).map((objective, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Star size={12} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{objective}</span>
                          </li>
                        ))}
                        {module.learningObjectives.length > 2 && (
                          <li className="text-primary">+{module.learningObjectives.length - 2} more objectives</li>
                        )}
                      </ul>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    {/* Topics */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {module.topics.map((topic, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Badge variant="outline" className="text-xs hover:bg-primary/10">
                              {topic}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {module.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {module.prerequisites.map((prereqId, idx) => {
                            const prereqModule = modules.find(m => m.id === prereqId)
                            const prereqCompleted = getModuleProgress(prereqId)?.completed
                            return (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className={`text-xs ${prereqCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {prereqCompleted ? '✓' : '○'} {prereqModule?.title || prereqId}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Progress */}
                    {progress && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                      </motion.div>
                    )}

                    {/* Action Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={() => handleStartModule(module)}
                        disabled={!isUnlocked}
                        className="w-full relative overflow-hidden group"
                        variant={progress?.completed ? "outline" : "default"}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <span className="relative flex items-center justify-center">
                          {!isUnlocked ? (
                            <>
                              <Lock size={18} className="mr-2" />
                              Locked
                            </>
                          ) : progress?.completed ? (
                            <>
                              <CheckCircle size={18} className="mr-2" />
                              Review Module
                            </>
                          ) : progress?.progress ? (
                            <>
                              <Play size={18} className="mr-2" />
                              Continue Learning
                            </>
                          ) : (
                            <>
                              <BookOpen size={18} className="mr-2" />
                              Start Module
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
      </div>
    </div>
  )
}