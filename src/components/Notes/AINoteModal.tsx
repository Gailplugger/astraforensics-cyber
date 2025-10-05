/**
 * AINoteModal - AI-powered note generation interface
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  X, 
  Wand2, 
  Brain, 
  FileText, 
  CheckSquare, 
  Lightbulb,
  BookOpen,
  Zap,
  Target,
  Clock,
  TrendingUp
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

import { Note, Folder, generateId } from '../../lib/storage'
import { aiAssistant, AIGenerationOptions } from '../../lib/ai'

interface AINoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Note) => void
  folders: Folder[]
}

const QUICK_PROMPTS = [
  {
    title: 'Cybersecurity Fundamentals',
    description: 'Comprehensive overview of cybersecurity principles',
    icon: FileText,
    topic: 'cybersecurity fundamentals including CIA triad, risk assessment, and security frameworks',
    format: 'notes' as const,
    complexity: 'intermediate' as const
  },
  {
    title: 'Network Security Guide',
    description: 'Essential network security concepts and practices',
    icon: Brain,
    topic: 'network security protocols, firewalls, intrusion detection, and network monitoring',
    format: 'notes' as const,
    complexity: 'advanced' as const
  },
  {
    title: 'Ethical Hacking Checklist',
    description: 'Step-by-step penetration testing methodology',
    icon: CheckSquare,
    topic: 'ethical hacking methodology including reconnaissance, scanning, exploitation, and reporting',
    format: 'checklist' as const,
    complexity: 'advanced' as const
  },
  {
    title: 'Incident Response Plan',
    description: 'Comprehensive incident response procedures',
    icon: Target,
    topic: 'cybersecurity incident response procedures, containment strategies, and recovery planning',
    format: 'checklist' as const,
    complexity: 'intermediate' as const
  },
  {
    title: 'Security Awareness Training',
    description: 'Essential security concepts for end users',
    icon: Lightbulb,
    topic: 'cybersecurity awareness including phishing, social engineering, password security, and safe browsing',
    format: 'explanation' as const,
    complexity: 'simple' as const
  },
  {
    title: 'Cloud Security Best Practices',
    description: 'Securing cloud infrastructure and services',
    icon: TrendingUp,
    topic: 'cloud security architecture, shared responsibility model, identity management, and compliance',
    format: 'notes' as const,
    complexity: 'advanced' as const
  }
]

const FORMAT_OPTIONS = [
  { value: 'notes', label: 'Detailed Notes', icon: FileText, description: 'Comprehensive explanations with examples' },
  { value: 'checklist', label: 'Checklist', icon: CheckSquare, description: 'Step-by-step actionable items' },
  { value: 'summary', label: 'Summary', icon: Zap, description: 'Concise key points overview' },
  { value: 'explanation', label: 'Explanation', icon: BookOpen, description: 'Educational content with context' },
  { value: 'flashcards', label: 'Study Cards', icon: Brain, description: 'Q&A format for studying' }
]

const COMPLEXITY_OPTIONS = [
  { value: 'simple', label: 'Beginner', description: 'Basic concepts, simple language' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate detail, some technical terms' },
  { value: 'advanced', label: 'Advanced', description: 'In-depth analysis, technical language' }
]

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short', description: '1-2 paragraphs' },
  { value: 'medium', label: 'Medium', description: '3-5 paragraphs' },
  { value: 'long', label: 'Long', description: '6+ paragraphs' }
]

export function AINoteModal({ isOpen, onClose, onSave, folders }: AINoteModalProps) {
  const [step, setStep] = useState<'prompts' | 'custom' | 'generating'>('prompts')
  const [options, setOptions] = useState<AIGenerationOptions>({
    topic: '',
    format: 'notes',
    complexity: 'intermediate',
    length: 'medium'
  })
  const [selectedFolder, setSelectedFolder] = useState('default')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleQuickPrompt = (prompt: typeof QUICK_PROMPTS[0]) => {
    setOptions({
      topic: prompt.topic,
      format: prompt.format,
      complexity: prompt.complexity,
      length: 'medium'
    })
    handleGenerate()
  }

  const handleGenerate = async () => {
    if (!options.topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setIsGenerating(true)
    setStep('generating')

    try {
      const note = await aiAssistant.generateNotes(options)
      const finalNote: Note = {
        ...note,
        folderId: selectedFolder
      }
      onSave(finalNote)
      onClose()
      toast.success('AI note generated successfully!')
    } catch (error) {
      console.error('Error generating note:', error)
      toast.error('Failed to generate note. Please try again.')
      setStep('custom')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setStep('prompts')
    setOptions({
      topic: '',
      format: 'notes',
      complexity: 'intermediate',
      length: 'medium'
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
                <h2 className="text-2xl font-bold gradient-text">AI Note Generator</h2>
                <p className="text-muted-foreground">
                  Generate comprehensive notes on any cybersecurity topic
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
          {step === 'prompts' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-2">Choose a Quick Start Template</h3>
                <p className="text-muted-foreground">
                  Or click "Custom Topic" to create notes on any subject
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {QUICK_PROMPTS.map((prompt, index) => {
                  const IconComponent = prompt.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{prompt.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {prompt.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {prompt.format}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {prompt.complexity}
                            </Badge>
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
                  <Wand2 className="w-5 h-5 mr-2" />
                  Custom Topic
                </Button>
              </div>
            </div>
          )}

          {step === 'custom' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Custom AI Note Generation</h3>
                <p className="text-muted-foreground">
                  Specify your topic and preferences for personalized content
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topic or Question</Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., 'Explain zero-trust security architecture' or 'Create a study guide for ethical hacking certification'"
                    value={options.topic}
                    onChange={(e) => setOptions(prev => ({ ...prev, topic: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Content Format</Label>
                    <Select 
                      value={options.format} 
                      onValueChange={(value: any) => setOptions(prev => ({ ...prev, format: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMAT_OPTIONS.map((format) => {
                          const IconComponent = format.icon
                          return (
                            <SelectItem key={format.value} value={format.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{format.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {format.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Save to Folder</Label>
                    <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: folder.color }}
                              />
                              {folder.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Complexity Level</Label>
                    <Select 
                      value={options.complexity} 
                      onValueChange={(value: any) => setOptions(prev => ({ ...prev, complexity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPLEXITY_OPTIONS.map((complexity) => (
                          <SelectItem key={complexity.value} value={complexity.value}>
                            <div>
                              <div className="font-medium">{complexity.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {complexity.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Content Length</Label>
                    <Select 
                      value={options.length} 
                      onValueChange={(value: any) => setOptions(prev => ({ ...prev, length: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LENGTH_OPTIONS.map((length) => (
                          <SelectItem key={length.value} value={length.value}>
                            <div>
                              <div className="font-medium">{length.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {length.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
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
              <h3 className="text-xl font-semibold mb-2">Generating AI Content</h3>
              <p className="text-muted-foreground mb-4">
                Creating comprehensive notes on: "{options.topic}"
              </p>
              <div className="flex justify-center">
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
                <Button variant="outline" onClick={() => setStep('prompts')}>
                  Back to Templates
                </Button>
              )}
              {step === 'custom' && (
                <Button 
                  onClick={handleGenerate}
                  disabled={!options.topic.trim() || isGenerating}
                  className="bg-gradient-to-r from-primary to-accent text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Notes
                </Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}