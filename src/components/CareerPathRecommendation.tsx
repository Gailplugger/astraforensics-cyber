import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  TrendUp, 
  Target, 
  Trophy, 
  Clock,
  CurrencyDollar,
  GraduationCap,
  Brain,
  ShieldCheck,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Briefcase,
  MapPin
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CareerPath {
  id: string
  title: string
  description: string
  matchPercentage: number
  averageSalary: string
  experienceLevel: 'entry' | 'mid' | 'senior'
  skills: string[]
  responsibilities: string[]
  growthOutlook: 'excellent' | 'good' | 'moderate'
  timeToQualify: string
  certifications: string[]
  companies: string[]
  workEnvironment: string[]
  dailyTasks: string[]
}

interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  resources: string[]
}

interface CareerRecommendationProps {
  isOpen: boolean
  onClose: () => void
  userData?: any
  assessmentResult?: any
}

export function CareerPathRecommendation({ isOpen, onClose, userData, assessmentResult }: CareerRecommendationProps) {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [phase, setPhase] = useState<'overview' | 'detailed' | 'roadmap'>('overview')
  const [savedPaths] = useKV<CareerPath[]>('saved-career-paths', [])

  useEffect(() => {
    if (isOpen) {
      generateCareerRecommendations()
    }
  }, [isOpen, assessmentResult])

  const generateCareerRecommendations = async () => {
    setIsLoading(true)
    try {
      const userProfile = {
        skillLevel: assessmentResult?.skillLevel || 'beginner',
        score: assessmentResult?.score || 0,
        strengths: assessmentResult?.strengths || [],
        interests: userData?.interests || [],
        experience: userData?.experience || 'entry'
      }

      const prompt = `Based on this cybersecurity assessment profile, recommend the top 5 most suitable career paths:

User Profile:
- Skill Level: ${userProfile.skillLevel}
- Assessment Score: ${userProfile.score}%
- Key Strengths: ${userProfile.strengths.join(', ')}
- Experience Level: ${userProfile.experience}

Generate comprehensive career recommendations in JSON format:
{
  "careerPaths": [
    {
      "id": "security-analyst",
      "title": "Security Analyst",
      "description": "Monitor and analyze security events...",
      "matchPercentage": 95,
      "averageSalary": "$65,000 - $85,000",
      "experienceLevel": "entry",
      "skills": ["SIEM", "Incident Response", "Network Security"],
      "responsibilities": ["Monitor security alerts", "Investigate incidents"],
      "growthOutlook": "excellent",
      "timeToQualify": "6-12 months",
      "certifications": ["Security+", "GCIH"],
      "companies": ["IBM", "Microsoft", "CrowdStrike"],
      "workEnvironment": ["Remote friendly", "24/7 operations"],
      "dailyTasks": ["Monitor SIEM alerts", "Analyze logs"]
    }
  ]
}

Focus on realistic, achievable paths based on the user's current level.`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.careerPaths && Array.isArray(data.careerPaths)) {
        setCareerPaths(data.careerPaths)
      } else {
        setCareerPaths(getFallbackCareerPaths())
      }
    } catch (error) {
      console.error('Error generating career recommendations:', error)
      setCareerPaths(getFallbackCareerPaths())
      toast.error('Using default career recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackCareerPaths = (): CareerPath[] => [
    {
      id: 'security-analyst',
      title: 'Cybersecurity Analyst',
      description: 'Monitor and analyze security events, investigate incidents, and implement security measures to protect organizational assets.',
      matchPercentage: 92,
      averageSalary: '$65,000 - $85,000',
      experienceLevel: 'entry',
      skills: ['SIEM Tools', 'Incident Response', 'Network Security', 'Risk Assessment'],
      responsibilities: ['Monitor security alerts', 'Investigate security incidents', 'Develop security procedures'],
      growthOutlook: 'excellent',
      timeToQualify: '6-12 months',
      certifications: ['CompTIA Security+', 'GCIH', 'CySA+'],
      companies: ['IBM', 'Microsoft', 'Splunk', 'CrowdStrike'],
      workEnvironment: ['SOC Environment', 'Remote Options', '24/7 Operations'],
      dailyTasks: ['Monitor SIEM dashboards', 'Analyze security logs', 'Document incidents', 'Coordinate response efforts']
    },
    {
      id: 'penetration-tester',
      title: 'Penetration Tester',
      description: 'Conduct authorized simulated cyberattacks to identify vulnerabilities in systems, networks, and applications.',
      matchPercentage: 78,
      averageSalary: '$75,000 - $120,000',
      experienceLevel: 'mid',
      skills: ['Ethical Hacking', 'Vulnerability Assessment', 'Scripting', 'Network Protocols'],
      responsibilities: ['Conduct penetration tests', 'Write detailed reports', 'Recommend security improvements'],
      growthOutlook: 'excellent',
      timeToQualify: '12-24 months',
      certifications: ['CEH', 'OSCP', 'GPEN'],
      companies: ['Rapid7', 'Tenable', 'Synopsys', 'Consulting Firms'],
      workEnvironment: ['Project-based', 'Travel Required', 'Flexible Hours'],
      dailyTasks: ['Plan test scenarios', 'Execute attacks', 'Document findings', 'Present to stakeholders']
    }
  ]

  const generateSkillGapAnalysis = async (selectedCareer: CareerPath) => {
    try {
      const prompt = `Analyze the skill gaps for becoming a ${selectedCareer.title}.

Current User Profile:
- Skill Level: ${assessmentResult?.skillLevel || 'beginner'}
- Strengths: ${assessmentResult?.strengths?.join(', ') || 'General cybersecurity knowledge'}
- Weaknesses: ${assessmentResult?.weaknesses?.join(', ') || 'Areas for improvement'}

Required Skills for ${selectedCareer.title}:
${selectedCareer.skills.join(', ')}

Generate a detailed skill gap analysis in JSON format:
{
  "skillGaps": [
    {
      "skill": "SIEM Tools",
      "currentLevel": 2,
      "requiredLevel": 7,
      "priority": "high",
      "estimatedTime": "3-4 months",
      "resources": ["Splunk Training", "SIEM Lab Practice", "Online Courses"]
    }
  ]
}

Rate levels 1-10 where:
1-3: Beginner, 4-6: Intermediate, 7-8: Advanced, 9-10: Expert`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.skillGaps && Array.isArray(data.skillGaps)) {
        setSkillGaps(data.skillGaps)
      }
    } catch (error) {
      console.error('Error generating skill gap analysis:', error)
      // Fallback skill gaps
      setSkillGaps([
        {
          skill: 'Network Security',
          currentLevel: 3,
          requiredLevel: 7,
          priority: 'high',
          estimatedTime: '3-4 months',
          resources: ['Network+ Certification', 'Hands-on Labs', 'Security Fundamentals Course']
        }
      ])
    }
  }

  const selectCareerPath = async (path: CareerPath) => {
    setSelectedPath(path)
    setPhase('detailed')
    await generateSkillGapAnalysis(path)
  }

  const viewRoadmap = () => {
    setPhase('roadmap')
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100'
    if (percentage >= 75) return 'text-blue-600 bg-blue-100'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getGrowthIcon = (outlook: string) => {
    switch (outlook) {
      case 'excellent': return <TrendUp className="text-green-600" size={20} />
      case 'good': return <TrendUp className="text-blue-600" size={20} />
      default: return <TrendUp className="text-yellow-600" size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      default: return 'secondary'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Briefcase size={20} className="text-white" weight="fill" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Career Path Recommendations</h2>
                <p className="text-muted-foreground">
                  {phase === 'overview' && 'Discover your ideal cybersecurity career'}
                  {phase === 'detailed' && `Detailed analysis: ${selectedPath?.title}`}
                  {phase === 'roadmap' && `Learning roadmap: ${selectedPath?.title}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {phase !== 'overview' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhase(phase === 'roadmap' ? 'detailed' : 'overview')}
                >
                  Back
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {phase === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-muted-foreground">Analyzing your profile and generating personalized recommendations...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold mb-2">Your Personalized Career Matches</h3>
                      <p className="text-muted-foreground">Based on your skills, interests, and assessment results</p>
                    </div>

                    <div className="grid gap-4">
                      {careerPaths.map((path, index) => (
                        <motion.div
                          key={path.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="cursor-pointer hover:shadow-lg transition-all card-hover" onClick={() => selectCareerPath(path)}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <CardTitle className="text-xl">{path.title}</CardTitle>
                                    <Badge className={`${getMatchColor(path.matchPercentage)} font-semibold`}>
                                      {path.matchPercentage}% Match
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground text-sm">{path.description}</p>
                                </div>
                                <ArrowRight size={20} className="text-muted-foreground ml-4" />
                              </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <CurrencyDollar size={16} className="text-green-600" />
                                  <span className="text-sm font-medium">{path.averageSalary}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <GraduationCap size={16} className="text-blue-600" />
                                  <span className="text-sm capitalize">{path.experienceLevel} Level</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getGrowthIcon(path.growthOutlook)}
                                  <span className="text-sm capitalize">{path.growthOutlook} Growth</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-amber-600" />
                                  <span className="text-sm">{path.timeToQualify}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {path.skills.slice(0, 4).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {path.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{path.skills.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {phase === 'detailed' && selectedPath && (
              <motion.div
                key="detailed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                {/* Career Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{selectedPath.title}</CardTitle>
                        <p className="text-muted-foreground">{selectedPath.description}</p>
                      </div>
                      <Badge className={`${getMatchColor(selectedPath.matchPercentage)} text-lg px-4 py-2`}>
                        {selectedPath.matchPercentage}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy size={20} className="text-primary" />
                        Key Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Average Salary</label>
                        <p className="text-lg font-semibold text-green-600">{selectedPath.averageSalary}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                        <p className="capitalize">{selectedPath.experienceLevel}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Time to Qualify</label>
                        <p>{selectedPath.timeToQualify}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Growth Outlook</label>
                        <div className="flex items-center gap-2">
                          {getGrowthIcon(selectedPath.growthOutlook)}
                          <span className="capitalize">{selectedPath.growthOutlook}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Required Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain size={20} className="text-accent" />
                        Required Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedPath.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-sm">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daily Responsibilities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target size={20} className="text-blue-600" />
                        Daily Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedPath.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Certifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-purple-600" />
                        Recommended Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedPath.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center gap-4">
                  <Button onClick={viewRoadmap} className="bg-gradient-to-r from-primary to-accent">
                    View Learning Roadmap
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === 'roadmap' && selectedPath && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Learning Roadmap: {selectedPath.title}</CardTitle>
                    <p className="text-muted-foreground">
                      Personalized learning path based on your current skills and career goals
                    </p>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skill Gap Analysis</h3>
                  {skillGaps.map((gap, index) => (
                    <motion.div
                      key={gap.skill}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{gap.skill}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant={getPriorityColor(gap.priority)}>
                                {gap.priority} Priority
                              </Badge>
                              <Badge variant="outline">{gap.estimatedTime}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Current Level</span>
                                <span>{gap.currentLevel}/10</span>
                              </div>
                              <Progress value={(gap.currentLevel / 10) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Required Level</span>
                                <span>{gap.requiredLevel}/10</span>
                              </div>
                              <Progress value={(gap.requiredLevel / 10) * 100} className="h-2" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Recommended Resources:</label>
                              <ul className="mt-1 space-y-1">
                                {gap.resources.map((resource, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Star size={12} className="text-yellow-500" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">1</div>
                        <div>
                          <p className="font-medium">Start with high-priority skills</p>
                          <p className="text-sm text-muted-foreground">Focus on skills marked as high priority first</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">2</div>
                        <div>
                          <p className="font-medium">Complete recommended certifications</p>
                          <p className="text-sm text-muted-foreground">Work towards industry-recognized certifications</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">3</div>
                        <div>
                          <p className="font-medium">Gain practical experience</p>
                          <p className="text-sm text-muted-foreground">Apply knowledge through labs, projects, and internships</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button onClick={onClose} className="bg-gradient-to-r from-primary to-accent">
                    Start Learning Journey
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}