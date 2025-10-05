/**
 * DailyReflection - AI-powered daily reflection component
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Calendar, 
  Sparkles, 
  Save, 
  RefreshCw,
  BookOpen,
  Target,
  TrendingUp,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { toast } from 'sonner'

import { DailyReflection as ReflectionType, storageManager } from '../lib/storage'
import { aiAssistant } from '../lib/ai'

interface DailyReflectionProps {
  isOpen: boolean
  onClose: () => void
}

export function DailyReflection({ isOpen, onClose }: DailyReflectionProps) {
  const [todayReflection, setTodayReflection] = useState<ReflectionType | null>(null)
  const [answer, setAnswer] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentReflections, setRecentReflections] = useState<ReflectionType[]>([])

  useEffect(() => {
    if (isOpen) {
      loadTodayReflection()
      loadRecentReflections()
    }
  }, [isOpen])

  const loadTodayReflection = async () => {
    try {
      const reflections = await storageManager.getReflections()
      const today = new Date().toISOString().split('T')[0]
      
      let todayRef = reflections.find(r => r.date === today)
      
      if (!todayRef) {
        // Generate today's question
        todayRef = await aiAssistant.generateDailyReflection()
        await storageManager.saveReflection(todayRef)
      }
      
      setTodayReflection(todayRef)
      setAnswer(todayRef.answer || '')
    } catch (error) {
      console.error('Error loading reflection:', error)
      toast.error('Failed to load daily reflection')
    }
  }

  const loadRecentReflections = async () => {
    try {
      const reflections = await storageManager.getReflections()
      const recent = reflections
        .filter(r => r.answer) // Only show answered reflections
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
      setRecentReflections(recent)
    } catch (error) {
      console.error('Error loading recent reflections:', error)
    }
  }

  const handleSaveAnswer = async () => {
    if (!todayReflection || !answer.trim()) {
      toast.error('Please write your reflection')
      return
    }

    try {
      const updatedReflection: ReflectionType = {
        ...todayReflection,
        answer: answer.trim()
      }
      
      await storageManager.saveReflection(updatedReflection)
      setTodayReflection(updatedReflection)
      await loadRecentReflections()
      
      toast.success('Reflection saved! Great job reflecting on your learning.')
    } catch (error) {
      console.error('Error saving reflection:', error)
      toast.error('Failed to save reflection')
    }
  }

  const handleGenerateNewQuestion = async () => {
    setIsGenerating(true)
    try {
      const newReflection = await aiAssistant.generateDailyReflection()
      setTodayReflection(newReflection)
      setAnswer('')
      await storageManager.saveReflection(newReflection)
      toast.success('New reflection question generated!')
    } catch (error) {
      console.error('Error generating new question:', error)
      toast.error('Failed to generate new question')
    } finally {
      setIsGenerating(false)
    }
  }

  const formatReflectionDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today'
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
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
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">Daily Reflection</h2>
                <p className="text-muted-foreground">
                  Take a moment to reflect on your cybersecurity learning journey
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Reflection */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Today's Reflection
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {todayReflection?.aiGenerated && (
                        <Badge variant="secondary">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateNewQuestion}
                        disabled={isGenerating}
                      >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayReflection ? (
                    <>
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <h4 className="font-medium mb-2 text-primary">Today's Question:</h4>
                        <p className="text-sm leading-relaxed">
                          {todayReflection.question}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Reflection:</label>
                        <Textarea
                          placeholder="Take your time to reflect... Share your thoughts, insights, or learnings from today."
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          {answer.length} characters · Aim for 2-3 thoughtful sentences
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSaveAnswer}
                          disabled={!answer.trim()}
                          className="bg-gradient-to-r from-primary to-accent text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Reflection
                        </Button>
                      </div>

                      {todayReflection.answer && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-green-700">
                              Reflection Complete
                            </span>
                          </div>
                          <p className="text-sm text-green-600">
                            Great job taking time to reflect on your learning today! 
                            Come back tomorrow for a new question.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading your daily reflection...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Reflections */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-4 h-4" />
                    Recent Reflections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReflections.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {recentReflections.map((reflection, index) => (
                          <motion.div
                            key={reflection.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-lg border bg-muted/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-primary">
                                {formatReflectionDate(reflection.date)}
                              </span>
                              {reflection.aiGenerated && (
                                <Sparkles className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {reflection.question}
                            </p>
                            {reflection.answer && (
                              <p className="text-xs line-clamp-3">
                                {reflection.answer}
                              </p>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Complete your first reflection to see your progress here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reflection Benefits */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-4 h-4" />
                    Why Reflect?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-muted-foreground">
                        <strong>Deepen Learning:</strong> Reflection helps consolidate new knowledge
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                      <p className="text-muted-foreground">
                        <strong>Track Progress:</strong> See how your understanding evolves over time
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                      <p className="text-muted-foreground">
                        <strong>Build Habits:</strong> Daily practice creates lasting learning routines
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}