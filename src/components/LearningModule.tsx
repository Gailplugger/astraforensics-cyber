import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  Shield, 
  Network,
  Bug,
  Warning,
  Eye,
  ArrowRight
} from '@phosphor-icons/react'

interface ModuleProgress {
  moduleId: string
  completed: boolean
  progress: number
  quizScore?: number
  completedAt?: string
}

interface LearningModuleProps {
  onBackToDashboard: () => void
  onTakeQuiz: () => void
}

const moduleContent = {
  'cybersecurity-basics': {
    title: 'Cybersecurity Fundamentals',
    sections: [
      {
        title: 'Introduction to Cybersecurity',
        icon: Shield,
        content: `
          <h3>What is Cybersecurity?</h3>
          <p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.</p>
          
          <h3>Why is Cybersecurity Important?</h3>
          <ul>
            <li><strong>Data Protection:</strong> Safeguarding personal and business information</li>
            <li><strong>Financial Security:</strong> Preventing monetary losses from cyber attacks</li>
            <li><strong>Business Continuity:</strong> Ensuring operations continue without disruption</li>
            <li><strong>Privacy:</strong> Protecting individual and organizational privacy</li>
          </ul>
        `
      },
      {
        title: 'The CIA Triad',
        icon: Shield,
        content: `
          <h3>Core Principles of Information Security</h3>
          <p>The CIA Triad represents the three pillars of information security:</p>
          
          <h4>Confidentiality</h4>
          <p>Ensuring that information is accessible only to those authorized to access it. This involves:</p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Access controls and authentication</li>
            <li>Secure communication channels</li>
          </ul>
          
          <h4>Integrity</h4>
          <p>Maintaining the accuracy and completeness of information. This includes:</p>
          <ul>
            <li>Data validation and verification</li>
            <li>Digital signatures and checksums</li>
            <li>Version control systems</li>
          </ul>
          
          <h4>Availability</h4>
          <p>Ensuring that information and resources are available when needed. This involves:</p>
          <ul>
            <li>Redundancy and backup systems</li>
            <li>Disaster recovery planning</li>
            <li>System maintenance and monitoring</li>
          </ul>
        `
      },
      {
        title: 'Common Threat Types',
        icon: Warning,
        content: `
          <h3>Understanding Cyber Threats</h3>
          
          <h4>Malware</h4>
          <p>Malicious software designed to harm or exploit systems:</p>
          <ul>
            <li><strong>Viruses:</strong> Self-replicating programs that attach to other files</li>
            <li><strong>Worms:</strong> Standalone programs that spread across networks</li>
            <li><strong>Trojans:</strong> Disguised malicious programs</li>
            <li><strong>Ransomware:</strong> Encrypts files and demands payment</li>
          </ul>
          
          <h4>Social Engineering</h4>
          <p>Manipulating people to reveal confidential information:</p>
          <ul>
            <li><strong>Phishing:</strong> Fraudulent emails or websites</li>
            <li><strong>Pretexting:</strong> Creating false scenarios to gain trust</li>
            <li><strong>Baiting:</strong> Offering something enticing to spark curiosity</li>
          </ul>
          
          <h4>Network Attacks</h4>
          <ul>
            <li><strong>DDoS:</strong> Overwhelming systems with traffic</li>
            <li><strong>Man-in-the-Middle:</strong> Intercepting communications</li>
            <li><strong>SQL Injection:</strong> Exploiting database vulnerabilities</li>
          </ul>
        `
      },
      {
        title: 'Security Controls',
        icon: Shield,
        content: `
          <h3>Types of Security Controls</h3>
          
          <h4>Preventive Controls</h4>
          <p>Designed to prevent security incidents before they occur:</p>
          <ul>
            <li>Firewalls and access controls</li>
            <li>Encryption and authentication</li>
            <li>Security awareness training</li>
            <li>Antivirus software</li>
          </ul>
          
          <h4>Detective Controls</h4>
          <p>Identify and detect security incidents when they occur:</p>
          <ul>
            <li>Intrusion Detection Systems (IDS)</li>
            <li>Security monitoring and logging</li>
            <li>Vulnerability assessments</li>
            <li>Security audits</li>
          </ul>
          
          <h4>Corrective Controls</h4>
          <p>Respond to and recover from security incidents:</p>
          <ul>
            <li>Incident response procedures</li>
            <li>Backup and recovery systems</li>
            <li>Patch management</li>
            <li>System restoration</li>
          </ul>
        `
      }
    ]
  }
}

export function LearningModule({ onBackToDashboard, onTakeQuiz }: LearningModuleProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [moduleProgress, setModuleProgress] = useKV<ModuleProgress[]>('module-progress', [])
  
  const currentModule = moduleContent['cybersecurity-basics']
  const totalSections = currentModule.sections.length
  const progressPercentage = Math.round(((currentSection + 1) / totalSections) * 100)

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
      updateProgress()
    } else {
      completeModule()
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const updateProgress = () => {
    const newProgress = Math.round(((currentSection + 1) / totalSections) * 100)
    setModuleProgress((current) => {
      const existing = current?.find(p => p.moduleId === 'cybersecurity-basics')
      if (existing) {
        return current?.map(p => 
          p.moduleId === 'cybersecurity-basics' 
            ? { ...p, progress: newProgress }
            : p
        ) || []
      } else {
        return [
          ...(current || []),
          {
            moduleId: 'cybersecurity-basics',
            completed: false,
            progress: newProgress
          }
        ]
      }
    })
  }

  const completeModule = () => {
    setModuleProgress((current) => {
      const existing = current?.find(p => p.moduleId === 'cybersecurity-basics')
      if (existing) {
        return current?.map(p => 
          p.moduleId === 'cybersecurity-basics' 
            ? { ...p, completed: true, progress: 100, completedAt: new Date().toISOString() }
            : p
        ) || []
      } else {
        return [
          ...(current || []),
          {
            moduleId: 'cybersecurity-basics',
            completed: true,
            progress: 100,
            completedAt: new Date().toISOString()
          }
        ]
      }
    })
    
    toast.success('Congratulations! Module completed successfully!')
  }

  const currentSectionData = currentModule.sections[currentSection]
  const IconComponent = currentSectionData.icon

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
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <BookOpen size={20} className="text-primary" />
              <h1 className="text-lg font-semibold">{currentModule.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Learning Progress</h2>
              <Badge variant="secondary">
                Section {currentSection + 1} of {totalSections}
              </Badge>
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

        {/* Module Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent size={24} className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentSectionData.title}</CardTitle>
                <CardDescription>
                  Section {currentSection + 1} of {totalSections}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none custom-scrollbar"
              style={{
                color: 'var(--foreground)',
              }}
              dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            <ArrowLeft size={18} className="mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentSection === totalSections - 1 && (
              <Button variant="outline" onClick={onTakeQuiz}>
                <Eye size={18} className="mr-2" />
                Take Quiz
              </Button>
            )}
            
            <Button onClick={handleNext}>
              {currentSection === totalSections - 1 ? (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Complete Module
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