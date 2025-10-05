/**
 * AITaskModal - AI-powered task generation interface
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  X, 
  Target, 
  BookOpen, 
  Shield, 
  Brain,
  Clock,
  Calendar,
  CheckSquare,
  Zap,
  Trophy,
  Rocket,
  GraduationCap
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'

import { TodoTask } from '../../lib/storage'
import { aiAssistant, AITaskOptions } from '../../lib/ai'

interface AITaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: TodoTask) => void
}

const QUICK_GOALS = [
  {
    title: 'CEH Certification Prep',
    description: 'Complete study plan for Certified Ethical Hacker exam',
    icon: Shield,
    goal: 'Prepare for CEH (Certified Ethical Hacker) certification exam',
    timeframe: '3 months',
    difficulty: 'advanced' as const,
    category: 'Certification'
  },
  {
    title: 'CISSP Study Plan',
    description: 'Comprehensive CISSP certification preparation',
    icon: Trophy,
    goal: 'Master all 8 domains of CISSP certification',
    timeframe: '6 months',
    difficulty: 'advanced' as const,
    category: 'Certification'
  },
  {
    title: 'Network Security Mastery',
    description: 'Deep dive into network security concepts',
    icon: Brain,
    goal: 'Learn advanced network security concepts including firewalls, IDS/IPS, and network monitoring',
    timeframe: '2 months',
    difficulty: 'intermediate' as const,
    category: 'Study'
  },
  {
    title: 'Penetration Testing Skills',
    description: 'Build practical pen testing abilities',
    icon: Target,
    goal: 'Develop hands-on penetration testing skills using tools like Metasploit, Nmap, and Burp Suite',
    timeframe: '2 months',
    difficulty: 'advanced' as const,
    category: 'Learning'
  },
  {
    title: 'Security+ Certification',
    description: 'CompTIA Security+ exam preparation',
    icon: GraduationCap,
    goal: 'Pass CompTIA Security+ certification exam',
    timeframe: '2 months',
    difficulty: 'intermediate' as const,
    category: 'Certification'
  },
  {
    title: 'Incident Response Training',
    description: 'Learn cybersecurity incident response',
    icon: Zap,
    goal: 'Master cybersecurity incident response procedures and digital forensics techniques',
    timeframe: '6 weeks',
    difficulty: 'intermediate' as const,
    category: 'Study'
  },
  {
    title: 'Weekly Security Research',
    description: 'Stay updated with latest security trends',
    icon: BookOpen,
    goal: 'Establish weekly routine for security research and threat intelligence gathering',
    timeframe: '1 month',
    difficulty: 'beginner' as const,
    category: 'Research'
  },
  {
    title: 'Home Lab Setup',
    description: 'Build personal cybersecurity lab',
    icon: Rocket,
    goal: 'Set up comprehensive home cybersecurity lab for hands-on practice',
    timeframe: '1 month',
    difficulty: 'intermediate' as const,
    category: 'Projects'
  }
]

const TIMEFRAME_OPTIONS = [
  { value: '1 week', label: '1 Week', description: 'Quick sprint' },
  { value: '2 weeks', label: '2 Weeks', description: 'Short-term goal' },
  { value: '1 month', label: '1 Month', description: 'Monthly objective' },
  { value: '2 months', label: '2 Months', description: 'Medium-term plan' },
  { value: '3 months', label: '3 Months', description: 'Quarterly goal' },
  { value: '6 months', label: '6 Months', description: 'Long-term project' }
]

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', description: 'New to the topic' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Expert level' }
]

export function AITaskModal({ isOpen, onClose, onSave }: AITaskModalProps) {
  const [step, setStep] = useState<'goals' | 'custom' | 'generating'>('goals')
  const [options, setOptions] = useState<AITaskOptions>({
    goal: '',
    timeframe: '1 month',
    difficulty: 'intermediate',
    includeDeadlines: true
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQuickGoal = (goal: typeof QUICK_GOALS[0]) => {
    setOptions({
      goal: goal.goal,
      timeframe: goal.timeframe,
      difficulty: goal.difficulty,
      includeDeadlines: true
    })
    handleGenerate()
  }

  const handleGenerate = async () => {
    if (!options.goal.trim()) {
      toast.error('Please enter a goal')
      return
    }

    setIsGenerating(true)
    setStep('generating')

    try {
      const tasks = await aiAssistant.generateTasks(options)
      
      // Save all generated tasks
      for (const task of tasks) {
        await onSave(task)
      }
      
      onClose()
      toast.success(`Generated ${tasks.length} tasks successfully!`)
    } catch (error) {
      console.error('Error generating tasks:', error)
      toast.error('Failed to generate tasks. Please try again.')
      setStep('custom')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setStep('goals')
    setOptions({
      goal: '',
      timeframe: '1 month',
      difficulty: 'intermediate',
      includeDeadlines: true
    })
    setIsGenerating(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">AI Task Generator</h2>
                <p className="text-muted-foreground">
                  Generate personalized task lists for your cybersecurity goals
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 'goals' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-2">Choose Your Learning Goal</h3>
                <p className="text-muted-foreground">
                  Select a pre-defined goal or create a custom learning plan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {QUICK_GOALS.map((goal, index) => {
                  const IconComponent = goal.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
                        onClick={() => handleQuickGoal(goal)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{goal.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {goal.timeframe}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {goal.difficulty}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Category: {goal.category}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep('custom')}
                  className="border-dashed border-2"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Custom Goal
                </Button>
              </div>
            </div>
          )}

          {step === 'custom' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Custom Task Generation</h3>
                <p className="text-muted-foreground">
                  Describe your goal and AI will create a detailed action plan
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal">Learning Goal or Objective</Label>
                  <Textarea
                    id="goal"
                    placeholder="e.g., 'Learn penetration testing fundamentals' or 'Prepare for CISSP exam' or 'Build a home cybersecurity lab'"
                    value={options.goal}
                    onChange={(e) => setOptions(prev => ({ ...prev, goal: e.target.value }))}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be specific about what you want to achieve for better task generation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Timeframe</Label>
                    <Select 
                      value={options.timeframe} 
                      onValueChange={(value) => setOptions(prev => ({ ...prev, timeframe: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEFRAME_OPTIONS.map((timeframe) => (
                          <SelectItem key={timeframe.value} value={timeframe.value}>
                            <div>
                              <div className="font-medium">{timeframe.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {timeframe.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Difficulty Level</Label>
                    <Select 
                      value={options.difficulty} 
                      onValueChange={(value: any) => setOptions(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_OPTIONS.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            <div>
                              <div className="font-medium">{difficulty.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {difficulty.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="deadlines"
                    checked={options.includeDeadlines}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeDeadlines: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="deadlines" className="text-sm">
                    Include suggested deadlines and time estimates
                  </Label>
                </div>
              </div>

              {/* Preview */}
              {options.goal && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Goal:</strong> {options.goal}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        {options.timeframe}
                      </Badge>
                      <Badge variant="outline">
                        {options.difficulty}
                      </Badge>
                      {options.includeDeadlines && (
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          With deadlines
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'generating' && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-6"
              >
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Generating Task Plan</h3>
              <p className="text-muted-foreground mb-4">
                Creating personalized tasks for: "{options.goal}"
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Analyzing your goal and requirements
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-4 h-4" />
                  Breaking down into actionable tasks
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Setting priorities and timelines
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'generating' && (
          <div className="border-t p-6 flex items-center justify-between">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              {step === 'custom' && (
                <Button variant="outline" onClick={() => setStep('goals')}>
                  Back to Goals
                </Button>
              )}
              {step === 'custom' && (
                <Button 
                  onClick={handleGenerate}
                  disabled={!options.goal.trim() || isGenerating}
                  className="bg-gradient-to-r from-primary to-accent text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Tasks
                </Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}