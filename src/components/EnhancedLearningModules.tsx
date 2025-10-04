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
        <div className="min-h-screen bg-background flex flex-col">
          <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 safe-area-top safe-area-bottom">
            {/* Enhanced Certificate Success View */}
            <div className="text-center mb-6 lg:mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15,
                  duration: 0.8
                }}
                className="mx-auto mb-4 lg:mb-6"
              >
                <Trophy size={48} className="text-yellow-600 mx-auto sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
              </motion.div>
              
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                🎉 Congratulations!
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                You've successfully completed the module and earned your certificate!
              </motion.p>
            </div>

            {/* Enhanced Certificate Display */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <ProfessionalCertificate 
                certificateData={certificateData}
                onDownload={() => toast.success('Certificate downloaded!')}
                onShare={() => toast.success('Achievement shared!')}
              />
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 lg:mt-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => {
                  setShowCertificate(false)
                  setIsStudying(false)
                  setCurrentModule(null)
                  setCompletedModuleId(null)
                }}
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                <BookOpen size={18} className="mr-2" />
                <span className="hidden sm:inline">Return to Modules</span>
                <span className="sm:hidden">Back to Modules</span>
              </Button>
              
              <Button
                onClick={() => {
                  // Start next module or go to quiz
                  setShowCertificate(false)
                  setIsStudying(false)
                  setCurrentModule(null)
                  setCompletedModuleId(null)
                }}
                size="lg"
                className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Sparkle size={18} className="mr-2" />
                <span className="hidden sm:inline">Continue Learning</span>
                <span className="sm:hidden">Continue</span>
              </Button>
            </motion.div>
          </div>
        </div>
      )
    }
  }

  if (isStudying && currentModule) {
    const currentSection = currentModule.content[currentSectionIndex]
    const progress = ((currentSectionIndex + 1) / currentModule.content.length) * 100

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Enhanced Responsive Study Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-10 safe-area-top"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  onClick={() => setIsStudying(false)}
                  className="flex items-center space-x-2 flex-shrink-0"
                  size="sm"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Back to Modules</span>
                  <span className="sm:hidden">Back</span>
                </Button>
                
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0">{currentModule.icon}</div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                      {currentModule.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Section {currentSectionIndex + 1} of {currentModule.content.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                <Badge variant="outline" className={getDifficultyColor(currentModule.difficulty)}>
                  {currentModule.difficulty}
                </Badge>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {Math.round(progress)}% Complete
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="mt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium">Progress</span>
                <span className="text-xs text-muted-foreground">
                  {currentSectionIndex + 1}/{currentModule.content.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Content Area */}
        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 safe-area-bottom">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="relative overflow-hidden">
              {/* Enhanced Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"
                animate={{ 
                  background: [
                    "linear-gradient(45deg, rgba(59, 130, 246, 0.03), transparent, rgba(139, 92, 246, 0.03))",
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.03), transparent, rgba(59, 130, 246, 0.03))",
                    "linear-gradient(225deg, rgba(59, 130, 246, 0.03), transparent, rgba(139, 92, 246, 0.03))"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <CardHeader className="relative z-10 p-4 sm:p-6 lg:p-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-3 lg:mb-4">
                  {currentSection.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    <Clock size={12} className="mr-1" />
                    {currentSection.duration} min
                  </Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm capitalize">
                    {currentSection.type}
                  </Badge>
                  {currentSection.type === 'interactive' && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent text-xs sm:text-sm">
                      ✨ Interactive
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 p-4 sm:p-6 lg:p-8 pt-0">
                {/* Enhanced Content Display */}
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-6 lg:mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-base sm:text-lg leading-relaxed text-foreground">
                      {currentSection.content}
                    </p>
                  </motion.div>
                  
                  {/* Additional interactive elements for certain content types */}
                  {currentSection.type === 'interactive' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 p-4 sm:p-6 bg-muted/30 rounded-lg border border-border/50"
                    >
                      <h4 className="text-sm font-semibold mb-3 text-primary">Interactive Learning Activity</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        This section includes hands-on exercises and practical applications.
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Brain size={14} className="text-accent" />
                        <span>AI-powered adaptive content</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Navigation */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Previous Section Button */}
                  {currentSectionIndex > 0 && (
                    <Button
                      onClick={() => setCurrentSectionIndex(prev => prev - 1)}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      size="sm"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      <span className="hidden sm:inline">Previous Section</span>
                      <span className="sm:hidden">Previous</span>
                    </Button>
                  )}

                  {/* Main Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleCompleteSection}
                      size="lg"
                      className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative flex items-center justify-center text-sm sm:text-base">
                        {currentSectionIndex >= currentModule.content.length - 1 ? (
                          <>
                            <Trophy size={18} className="mr-2" />
                            <span className="hidden sm:inline">Complete Module & Get Certificate</span>
                            <span className="sm:hidden">Complete Module</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} className="mr-2" />
                            <span className="hidden sm:inline">Complete Section & Continue</span>
                            <span className="sm:hidden">Complete Section</span>
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-4 sm:mt-6 text-center">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    {currentModule.content.map((_, idx) => (
                      <motion.div
                        key={idx}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          idx <= currentSectionIndex ? 'bg-primary' : 'bg-muted'
                        }`}
                        animate={{
                          scale: idx === currentSectionIndex ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Section Progress
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Enhanced Responsive Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-10 safe-area-top"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="flex-shrink-0"
              >
                <BookOpen size={28} className="text-primary lg:w-8 lg:h-8" />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  Enhanced Learning Modules
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground truncate">
                  Master cybersecurity with our comprehensive curriculum
                </p>
              </div>
            </div>
            
            {onBack && (
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center space-x-2 flex-shrink-0"
                size="sm"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Modules Grid with Better Responsive Layout */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 safe-area-bottom">
        {/* Improved Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {modules.map((module, index) => {
            const progress = getModuleProgress(module.id)
            const isUnlocked = isModuleUnlocked(module)

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group h-full"
              >
                <Card className={`card-hover relative overflow-hidden h-full flex flex-col ${
                  !isUnlocked ? 'opacity-75' : ''
                } ${
                  progress?.completed ? 'border-green-300 bg-gradient-to-br from-green-50/50 to-emerald-50/50' : ''
                }`}>
                  {/* Enhanced Visual Effects */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-transparent"
                    animate={{ rotate: [0, 360] }}
                    transition={{ 
                      duration: 20 + index * 2, 
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                  />

                  {/* Status Indicators */}
                  <div className="absolute top-3 right-3 z-10 flex space-x-2">
                    {progress?.completed && (
                      <motion.div
                        animate={{ 
                          rotate: 360, 
                          scale: [1, 1.2, 1] 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle size={20} className="text-green-600" weight="fill" />
                      </motion.div>
                    )}

                    {module.certification && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <CertificateIcon size={18} className="text-yellow-600" weight="fill" />
                      </motion.div>
                    )}
                  </div>

                  <CardHeader className="relative z-10 p-4 lg:p-6 flex-shrink-0">
                    {/* Module Icon and Title */}
                    <div className="flex items-start space-x-3 mb-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex-shrink-0 mt-1"
                      >
                        {isUnlocked ? module.icon : <Lock size={24} className="text-muted-foreground" />}
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {module.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getDifficultyColor(module.difficulty)} text-xs`}
                          >
                            {module.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock size={10} className="mr-1" />
                            {module.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {module.description}
                    </p>

                    {/* Condensed Learning Objectives */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Key Skills
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {module.learningObjectives.slice(0, 2).map((objective, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <Star size={10} className="text-yellow-500 mt-1 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {objective}
                            </span>
                          </div>
                        ))}
                        {module.learningObjectives.length > 2 && (
                          <span className="text-xs text-primary">
                            +{module.learningObjectives.length - 2} more skills
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 p-4 lg:p-6 pt-0 flex-1 flex flex-col">
                    {/* Compact Topics Display */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {module.topics.slice(0, 4).map((topic, idx) => (
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
                        {module.topics.length > 4 && (
                          <Badge variant="outline" className="text-xs opacity-60">
                            +{module.topics.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Compact Prerequisites */}
                    {module.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
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

                    {/* Progress Bar */}
                    {progress && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Progress</span>
                          <span className="text-xs text-muted-foreground">{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-1.5" />
                      </motion.div>
                    )}

                    {/* Action Button - Always at bottom */}
                    <div className="mt-auto">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={() => handleStartModule(module)}
                          disabled={!isUnlocked}
                          className="w-full relative overflow-hidden group text-sm"
                          variant={progress?.completed ? "outline" : "default"}
                          size="sm"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                          <span className="relative flex items-center justify-center">
                            {!isUnlocked ? (
                              <>
                                <Lock size={14} className="mr-2" />
                                <span className="hidden sm:inline">Locked</span>
                                <span className="sm:hidden">🔒</span>
                              </>
                            ) : progress?.completed ? (
                              <>
                                <CheckCircle size={14} className="mr-2" />
                                <span className="hidden sm:inline">Review Module</span>
                                <span className="sm:hidden">Review</span>
                              </>
                            ) : progress?.progress ? (
                              <>
                                <Play size={14} className="mr-2" />
                                <span className="hidden sm:inline">Continue Learning</span>
                                <span className="sm:hidden">Continue</span>
                              </>
                            ) : (
                              <>
                                <BookOpen size={14} className="mr-2" />
                                <span className="hidden sm:inline">Start Module</span>
                                <span className="sm:hidden">Start</span>
                              </>
                            )}
                          </span>
                        </Button>
                      </motion.div>
                    </div>
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